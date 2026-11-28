/**
 * محرك «مدرسة العلم» المحلي واللامركزي (al3lm-local-mesh.js)
 * لا يظهر ولا يعمل إلا داخل النسخ المحلية (APK / EXE / LAN / localhost)، ويبقى مخفياً تماماً على الموقع العام.
 */
(function initAl3lmLocalMesh() {
    const REMOTE_ORIGIN = 'https://al-3lm.org';
    const MESH_PORT = 8765;
    const DB_NAME = 'al3lm_mesh_db';
    const DB_VER = 1;

    const isLocalEnv = (function() {
        if (typeof window.__AL3LM_IS_LOCAL === 'boolean') return window.__AL3LM_IS_LOCAL;
        const p = window.location.protocol;
        const h = window.location.hostname || '';
        if (p === 'file:' || p === 'capacitor:' || window.Capacitor || window.Al3lmNative) return true;
        if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/i.test(h)) return true;
        if (h.endsWith('.local')) return true;
        try { if (localStorage.getItem('al3lm_force_local_mode') === '1') return true; } catch (_) {}
        return false;
    })();

    window.__AL3LM_IS_LOCAL = isLocalEnv;
    if (!isLocalEnv) return;

    function revealLocalSlots() {
        if (document.body) document.body.classList.add('is-local-copy');
        document.querySelectorAll('.al3lm-local-only-slot').forEach(el => {
            el.style.display = el.classList.contains('menu-divider-line') ? 'block' : 'flex';
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', revealLocalSlots);
    } else {
        revealLocalSlots();
    }

    // ================= IndexedDB لتخزين التحديثات التفاضلية (Delta Overrides) =================
    function openMeshDB() {
        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) return reject(new Error('No IndexedDB'));
            const req = indexedDB.open(DB_NAME, DB_VER);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
                if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function dbGet(storeName, key) {
        const db = await openMeshDB();
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, 'readonly');
            const r = tx.objectStore(storeName).get(key);
            r.onsuccess = () => resolve(r.result || null);
            r.onerror = () => resolve(null);
        });
    }

    async function dbPut(storeName, key, val) {
        const db = await openMeshDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            tx.objectStore(storeName).put(val, key);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }

    // ================= مولد QR خفيف يعمل ١٠٠٪ بدون إنترنت =================
    function renderMiniQR(text, box) {
        if (!box) return;
        if (typeof window.drawLocalQR === 'function') {
            window.drawLocalQR(text, box);
            return;
        }
        const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
        let x = 1;
        for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
        const gfMul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
        function polyRest(data, ecLen) {
            let gen = [1];
            for (let i = 0; i < ecLen; i++) {
                const next = new Array(gen.length + 1).fill(0);
                for (let j = 0; j < gen.length; j++) { next[j] ^= gen[j]; next[j + 1] ^= gfMul(gen[j], EXP[i]); }
                gen = next;
            }
            const msg = Array.from(data).concat(new Array(ecLen).fill(0));
            for (let i = 0; i < data.length; i++) {
                const coef = msg[i];
                if (coef !== 0) for (let j = 0; j < gen.length; j++) msg[i + j] ^= gfMul(gen[j], coef);
            }
            return msg.slice(data.length);
        }
        const VERS = [
            null,
            { size: 21, total: 26, ec: 7, align: [] },
            { size: 25, total: 44, ec: 10, align: [6, 18] },
            { size: 29, total: 70, ec: 15, align: [6, 22] },
            { size: 33, total: 100, ec: 20, align: [6, 26] },
            { size: 37, total: 134, ec: 26, align: [6, 30] }
        ];
        const bytes = new TextEncoder().encode(String(text || ''));
        let vIdx = 1;
        while (vIdx <= 5 && (VERS[vIdx].total - VERS[vIdx].ec - 3) < bytes.length) vIdx++;
        if (vIdx > 5) { box.textContent = 'انسخ العنوان'; return; }
        const V = VERS[vIdx], dataCap = V.total - V.ec, bits = [];
        const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
        push(4, 4); push(bytes.length, 8); bytes.forEach(b => push(b, 8));
        for (let i = 0; i < 4 && bits.length < dataCap * 8; i++) bits.push(0);
        while (bits.length % 8 !== 0) bits.push(0);
        const cw = [];
        for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; cw.push(b); }
        let pad = true;
        while (cw.length < dataCap) { cw.push(pad ? 0xEC : 0x11); pad = !pad; }
        const all = cw.concat(polyRest(cw, V.ec)), N = V.size;
        const grid = Array.from({ length: N }, () => new Array(N).fill(0));
        const resv = Array.from({ length: N }, () => new Array(N).fill(false));
        const finder = (r, c) => {
            for (let dr = -1; dr <= 7; dr++) for (let dc = -1; dc <= 7; dc++) {
                const rr = r + dr, cc = c + dc;
                if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
                const out = (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) || (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6));
                const inn = (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
                grid[rr][cc] = (out || inn) ? 1 : 0; resv[rr][cc] = true;
            }
        };
        finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
        for (let i = 8; i < N - 8; i++) { grid[6][i] = grid[i][6] = (i % 2 === 0) ? 1 : 0; resv[6][i] = resv[i][6] = true; }
        if (V.align.length) {
            const [a, b] = V.align;
            [[a, b], [b, a], [b, b]].forEach(([cr, cc]) => {
                if (resv[cr][cc]) return;
                for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
                    grid[cr + dr][cc + dc] = (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (!dr && !dc)) ? 1 : 0;
                    resv[cr + dr][cc + dc] = true;
                }
            });
        }
        for (let i = 0; i < 9; i++) if (i !== 6) resv[8][i] = resv[i][8] = true;
        for (let i = 0; i < 8; i++) resv[8][N - 1 - i] = resv[N - 1 - i][8] = true;
        grid[N - 8][8] = 1; resv[N - 8][8] = true;
        const sBits = []; all.forEach(w => { for (let i = 7; i >= 0; i--) sBits.push((w >>> i) & 1); });
        let bi = 0, up = true;
        for (let col = N - 1; col > 0; col -= 2) {
            if (col === 6) col--;
            for (let cnt = 0; cnt < N; cnt++) {
                const r = up ? (N - 1 - cnt) : cnt;
                for (let dc = 0; dc < 2; dc++) {
                    const c = col - dc;
                    if (!resv[r][c]) {
                        const bit = bi < sBits.length ? sBits[bi++] : 0;
                        grid[r][c] = ((r + c) % 2 === 0) ? (bit ^ 1) : bit;
                    }
                }
            }
            up = !up;
        }
        const fmt = 0x77c4, fb = [];
        for (let i = 0; i < 15; i++) fb.push((fmt >>> i) & 1);
        [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]].forEach(([r, c], idx) => { grid[r][c] = fb[14 - idx]; });
        for (let i = 0; i < 7; i++) grid[N - 1 - i][8] = fb[14 - i];
        for (let i = 7; i < 15; i++) grid[8][N - 15 + i] = fb[14 - i];
        let p = '';
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) p += `M${c+2},${r+2}h1v1h-1z`;
        box.innerHTML = `<svg viewBox="0 0 ${N+4} ${N+4}" width="124" height="124" shape-rendering="crispEdges"><rect width="${N+4}" height="${N+4}" fill="#fff"/><path d="${p}" fill="#06281e"/></svg>`;
    }

    function ensureMeshModal() {
        let modal = document.getElementById('al3lm-mesh-modal');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'al3lm-mesh-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:14000;background:rgba(2,12,9,0.88);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;padding:14px;direction:rtl;font-family:Cairo,sans-serif;';
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        modal.innerHTML = `
            <div style="position:relative;width:100%;max-width:560px;background:linear-gradient(155deg,#06281e 0%,#091526 100%);color:#f8fafc;border:3px solid #eab308;border-radius:26px;padding:22px 20px;box-shadow:0 26px 65px rgba(0,0,0,0.8);display:flex;flex-direction:column;gap:14px;text-align:right;" onclick="event.stopPropagation()">
                <button type="button" onclick="document.getElementById('al3lm-mesh-modal').style.display='none'" style="position:absolute;top:12px;left:14px;width:34px;height:34px;border-radius:50%;border:1.5px solid #fde047;background:rgba(15,23,42,0.9);color:#fef08a;font-size:1.25rem;font-weight:900;cursor:pointer;">×</button>
                <h3 id="al3lm-mesh-title" style="font-family:'Aref Ruqaa',serif;font-size:1.55rem;color:#fef08a;padding-left:38px;margin:0;"></h3>
                <div id="al3lm-mesh-body" style="display:flex;flex-direction:column;gap:12px;font-size:0.86rem;line-height:1.7;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    function getNativeBridge() {
        if (window.Al3lmNative) return window.Al3lmNative;
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Al3lmNativeBridge) {
            return window.Capacitor.Plugins.Al3lmNativeBridge;
        }
        return null;
    }

    // ١. إرسال التطبيق المستقل عبر البلوتوث / واتساب / Quick Share / LAN
    async function shareStandaloneApp() {
        const native = getNativeBridge();
        if (native && typeof native.shareInstalledApk === 'function') {
            try {
                native.shareInstalledApk();
                return;
            } catch (_) {}
        }

        const modal = ensureMeshModal();
        const title = document.getElementById('al3lm-mesh-title');
        const body = document.getElementById('al3lm-mesh-body');
        title.textContent = '📤 إرسال ومشاركة التطبيق مع الأصدقاء';

        let lanUrl = window.location.origin;
        try {
            const infoRes = await fetch('/mesh-node-info').then(r => r.ok ? r.json() : null).catch(() => null);
            if (infoRes && infoRes.lanUrl) lanUrl = infoRes.lanUrl;
        } catch (_) {}

        body.innerHTML = `
            <div style="background:rgba(15,23,42,0.82);border:1.5px solid #38bdf8;border-radius:18px;padding:14px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;">
                <div style="flex:1;min-width:210px;display:flex;flex-direction:column;gap:8px;">
                    <strong style="color:#fef08a;">١. مشاركة فورية عبر نفس الشبكة أو نقطة الاتصال (Hotspot):</strong>
                    <span style="color:#cbd5e1;font-size:0.8rem;">امسح الرمز بكاميرا هاتف صديقك لفتح المنصة وتثبيتها أو سحب التحديثات منك بدون إنترنت:</span>
                    <code id="mesh-lan-url-txt" style="background:rgba(0,0,0,0.4);padding:6px 10px;border-radius:10px;color:#7dd3fc;direction:ltr;text-align:center;font-weight:900;">${lanUrl}</code>
                </div>
                <div id="mesh-qr-holder" style="width:138px;height:138px;background:#fff;border-radius:14px;padding:6px;border:2.5px solid #fde047;display:flex;align-items:center;justify-content:center;margin:0 auto;"></div>
            </div>
            <div style="background:rgba(6,78,59,0.55);border:1.5px solid rgba(250,204,21,0.45);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px;">
                <strong style="color:#fef08a;">٢. إرسال ملف التثبيت عبر البلوتوث أو واتساب أو الفلاشة:</strong>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <a href="./al-3lm.apk" download="مدرسة_العلم.apk" style="padding:8px 15px;border-radius:999px;background:linear-gradient(135deg,#eab308,#ca8a04);color:#06281e;font-weight:900;text-decoration:none;font-size:0.8rem;">📱 حفظ ملف الهاتف (APK) لإرساله</a>
                    <button type="button" id="copy-mesh-link-btn" style="padding:8px 15px;border-radius:999px;border:1.5px solid #fde047;background:rgba(15,23,42,0.9);color:#fef08a;font-family:inherit;font-weight:900;cursor:pointer;font-size:0.8rem;">📋 نسخ رابط البث المحلي</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
        renderMiniQR(lanUrl, document.getElementById('mesh-qr-holder'));
        const cpBtn = document.getElementById('copy-mesh-link-btn');
        if (cpBtn) {
            cpBtn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(lanUrl);
                    cpBtn.textContent = '✅ تم النسخ!';
                } catch (_) {}
            };
        }
    }

    // ٢. التحديث الهجين بضغطة زر واحدة (P2P / LAN أولاً ثم al-3lm.org)
    async function fetchJsonWithTimeout(url, ms = 3500) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), ms);
        try {
            const r = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { signal: ctrl.signal, cache: 'no-store' });
            if (!r.ok) return null;
            return await r.json();
        } catch (_) {
            return null;
        } finally {
            clearTimeout(t);
        }
    }

    async function getLocalInstalledManifest() {
        const fromIdb = await dbGet('meta', 'manifest').catch(() => null);
        const fromBundled = await fetchJsonWithTimeout('./update-manifest.json', 2000);
        if (fromIdb && fromBundled) {
            return (fromIdb.timestamp || 0) >= (fromBundled.timestamp || 0) ? fromIdb : fromBundled;
        }
        return fromIdb || fromBundled || { version: '1.0', timestamp: 0, files: {} };
    }

    async function discoverBestUpdateSource(customPeerIp) {
        const candidates = [];

        if (customPeerIp) {
            const cleanIp = customPeerIp.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            const base = cleanIp.includes(':') ? `http://${cleanIp}` : `http://${cleanIp}:${MESH_PORT}`;
            candidates.push({ label: `جهاز زميل في الشبكة المحلية (${cleanIp})`, base, isLocalPeer: true });
        }

        const native = getNativeBridge();
        if (native && typeof native.discoverPeerUpdateServersJson === 'function') {
            try {
                const rawJson = native.discoverPeerUpdateServersJson();
                const peers = JSON.parse(rawJson || '[]');
                peers.forEach(p => {
                    candidates.push({ label: `جهاز محدّث قريب بدون إنترنت (${p})`, base: p.replace(/\/$/, ''), isLocalPeer: true });
                });
            } catch (_) {}
        }

        if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(window.location.hostname)) {
            candidates.push({ label: `خادم المدرسة المحلي (${window.location.host})`, base: window.location.origin, isLocalPeer: true });
        }

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const peerRes = await fetchJsonWithTimeout('/mesh-discover-lan-peers', 2400);
            if (peerRes && Array.isArray(peerRes.peers)) {
                peerRes.peers.forEach(p => {
                    candidates.push({ label: `جهاز محدّث على الشبكة المحلية (${p})`, base: p.replace(/\/$/, ''), isLocalPeer: true });
                });
            }
        }

        if (navigator.onLine) {
            candidates.push({ label: 'الموقع الرسمي (al-3lm.org)', base: REMOTE_ORIGIN, isLocalPeer: false });
            const cid = (localStorage.getItem('al3lm_ipfs_backup_cid') || '').trim();
            if (cid) {
                candidates.push({ label: 'الشبكة اللامركزية (IPFS)', base: `https://dweb.link/ipfs/${cid}`, isLocalPeer: false });
            }
        }

        let best = null;
        for (const c of candidates) {
            const mf = await fetchJsonWithTimeout(`${c.base}/update-manifest.json`, c.isLocalPeer ? 2200 : 5000);
            if (mf && mf.files && typeof mf.timestamp === 'number') {
                if (!best || mf.timestamp > best.manifest.timestamp || (mf.timestamp === best.manifest.timestamp && c.isLocalPeer && !best.source.isLocalPeer)) {
                    best = { source: c, manifest: mf };
                }
            }
        }
        return best;
    }

    async function oneClickUpdateUI(customPeerIp = '') {
        const modal = ensureMeshModal();
        const title = document.getElementById('al3lm-mesh-title');
        const body = document.getElementById('al3lm-mesh-body');
        title.textContent = '🔄 تحديث المنصة بضغطة واحدة (P2P محلي أو عبر الإنترنت)';
        body.innerHTML = `<div style="color:#fde047;font-weight:800;">⏳ جاري فحص الأجهزة القريبة في الشبكة المحلية أولاً (لتوفير الإنترنت)، ثم الموقع الرسمي...</div>`;
        modal.style.display = 'flex';

        const localMf = await getLocalInstalledManifest();
        const found = await discoverBestUpdateSource(customPeerIp);

        if (!found) {
            body.innerHTML = `
                <div style="background:rgba(15,23,42,0.82);border:1.5px solid #94a3b8;border-radius:16px;padding:14px;">
                    📴 لا يوجد جهاز محدّث متصل معك حالياً في الشبكة المحلية ولا يوجد إنترنت.<br>
                    <span style="color:#a7f3d0;font-size:0.8rem;">نسختك المحلية الحالية (<strong>${localMf.version || '1.0'}</strong>) جاهزة وتعمل بالكامل دون إنترنت.</span>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                    <input id="manual-peer-ip-inp" type="text" placeholder="أو اكتب عنوان جهاز زميل محدّث (مثال 192.168.1.5)" style="flex:1;min-width:190px;padding:8px 12px;border-radius:12px;border:1.5px solid #475569;background:#0f172a;color:#fff;direction:ltr;font-family:inherit;font-size:0.8rem;">
                    <button type="button" id="retry-peer-btn" style="padding:8px 14px;border-radius:999px;border:1.5px solid #fde047;background:#059669;color:#fef08a;font-family:inherit;font-weight:900;cursor:pointer;font-size:0.8rem;">اتصال بالزميل</button>
                </div>
            `;
            document.getElementById('retry-peer-btn').onclick = () => {
                const ip = document.getElementById('manual-peer-ip-inp').value.trim();
                if (ip) oneClickUpdateUI(ip);
            };
            return;
        }

        const remoteFiles = found.manifest.files || {};
        const localFiles = localMf.files || {};
        const changedPaths = Object.keys(remoteFiles).filter(relPath => {
            const rf = remoteFiles[relPath];
            const lf = localFiles[relPath];
            return !lf || lf.hash !== rf.hash;
        });

        if ((found.manifest.timestamp <= (localMf.timestamp || 0)) || changedPaths.length === 0) {
            body.innerHTML = `
                <div style="background:rgba(6,78,59,0.65);border:1.5px solid #4ade80;border-radius:16px;padding:14px;color:#ecfdf5;font-weight:800;">
                    ✅ نسختك المحلية بأحدث إصدار بالفعل (<strong>${found.manifest.version}</strong>) — وجهازك جاهز تلقائياً لتحديث زملائك عبر الشبكة المحلية!
                </div>
            `;
            return;
        }

        const totalBytes = changedPaths.reduce((acc, p) => acc + (remoteFiles[p]?.size || 0), 0);
        const sizeKB = Math.max(1, Math.round(totalBytes / 1024));
        const badgeType = found.source.isLocalPeer
            ? '<span style="color:#4ade80;">📡 مجاناً عبر الشبكة المحلية P2P بدون إنترنت</span>'
            : '<span style="color:#7dd3fc;">🌐 عبر الموقع الرسمي (al-3lm.org)</span>';

        body.innerHTML = `
            <div style="background:rgba(15,23,42,0.85);border:2px solid #fde047;border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:6px;">
                <div>✨ <strong>عُثر على تحديث جديد (${found.manifest.version})!</strong></div>
                <div>المصدر: <strong>${found.source.label}</strong> (${badgeType})</div>
                <div>الملفات المعدّلة فقط: <strong>${changedPaths.length} ملف</strong> (${sizeKB > 1024 ? (sizeKB/1024).toFixed(1) + ' ميجابايت' : sizeKB + ' كيلوبايت'})</div>
            </div>
            <div id="mesh-upd-progress" style="font-size:0.82rem;color:#fef08a;font-weight:800;"></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" id="confirm-delta-upd-btn" style="flex:1;padding:10px 16px;border-radius:999px;border:2px solid #fef08a;background:linear-gradient(135deg,#eab308,#ca8a04);color:#06281e;font-family:inherit;font-weight:900;cursor:pointer;font-size:0.88rem;">⬇️ سحب التحديث الآن ونشره لمن حولي</button>
                <button type="button" onclick="document.getElementById('al3lm-mesh-modal').style.display='none'" style="padding:10px 16px;border-radius:999px;border:1.5px solid #94a3b8;background:transparent;color:#e2e8f0;font-family:inherit;font-weight:800;cursor:pointer;font-size:0.82rem;">لاحقاً</button>
            </div>
        `;

        document.getElementById('confirm-delta-upd-btn').onclick = async function() {
            this.disabled = true;
            const prog = document.getElementById('mesh-upd-progress');
            const native = getNativeBridge();
            let done = 0;

            for (const relPath of changedPaths) {
                prog.textContent = `⏳ جاري تحديث (${done + 1} من ${changedPaths.length}): ${relPath}...`;
                try {
                    const fileUrl = `${found.source.base}/${relPath}?t=${Date.now()}`;
                    const resp = await fetch(fileUrl, { cache: 'no-store' });
                    if (!resp.ok) throw new Error('fetch failed');
                    const blob = await resp.blob();
                    const cleanKey = '/' + relPath.replace(/^\.?\//, '');

                    await dbPut('files', cleanKey, {
                        blob,
                        contentType: resp.headers.get('content-type') || '',
                        updatedAt: Date.now()
                    });

                    const b64 = await blobToBase64(blob);
                    if (native && typeof native.saveRelayFileBase64 === 'function') {
                        native.saveRelayFileBase64(relPath, b64);
                    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        await fetch('/mesh-store-override', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ path: relPath, base64: b64 })
                        }).catch(() => {});
                    }
                    done++;
                } catch (_) {}
            }

            await dbPut('meta', 'manifest', found.manifest).catch(() => {});
            if (native && typeof native.saveRelayManifest === 'function') {
                native.saveRelayManifest(JSON.stringify(found.manifest));
            } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                await fetch('/mesh-store-manifest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(found.manifest)
                }).catch(() => {});
            }

            if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg && reg.active) reg.active.postMessage({ type: 'AL3LM_CLEAR_STATIC_CACHE_ONLY' });
            }

            prog.innerHTML = `<span style="color:#4ade80;">✅ اكتمل تحديث (${done}) ملفات بنجاح! جهازك الآن محدّث وينشر التحديث لأصدقائك تلقائياً.</span>`;
            setTimeout(() => window.location.reload(), 1000);
        };
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = String(reader.result || '');
                resolve(res.includes(',') ? res.split(',')[1] : res);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    window.Al3lmMesh = {
        isLocal: isLocalEnv,
        shareApp: shareStandaloneApp,
        oneClickUpdate: () => oneClickUpdateUI('')
    };
})();
