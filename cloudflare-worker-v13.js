/**
 * Cloudflare Worker الموحّد لمنصة «مدرسة العلم» (v13)
 * ١. المعلم المحاور والمجيب الآلي عبر Gemini API (GEMINI_API_KEY)
 * ٢. المزامنة السحابية لحسابات التلاميذ والمعلمين والمدارس عبر Cloudflare KV (USERS_KV)
 * ٣. نظام الأمان المزدوج الخفي للإدارة العليا (بوابة الدخول الأولى + رمز خزنة المالك الثاني المحفوظ سحابياً)
 * ٤. لوحة التحليلات التربوية وإلغاء الحسابات الخاملة واستعادة كلمات المرور
 * ٥. النشر السحابي المباشر لحزم المدارس الخاصة + صندوق التراسل المباشر للحزم (JSON) بين المستخدمين (طالب / معلم / إدارة)
 * ٦. دعم الدخول السريع بحساب Google (اختياري عند وضع GOOGLE_CLIENT_ID)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8'
};

function jsonRes(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: CORS_HEADERS });
}

function getKV(env) {
  return env.USERS_KV || env.AL3LM_USERS_KV || null;
}

function computeHash(rawStr, salt) {
  const str = `${salt}::${String(rawStr || '').trim()}`;
  let h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'h2_' + (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

async function getOwnerSecurityConfig(kv, env) {
  let saved = null;
  if (kv) {
    try { saved = await kv.get('cfg:owner_security_v1', 'json'); } catch (_) {}
  }
  const defaultGate1Users = ['الإدارة', 'الادارة', 'admin'];
  const gate1User = saved?.gate1User || String(env.ADMIN_LOGIN_USER || '').trim().toLowerCase() || '';
  const gate1PassHash = saved?.gate1PassHash || computeHash(String(env.ADMIN_LOGIN_PASS || 'admin1234').trim(), 'owner_gate1');
  const gate2PinHash  = saved?.gate2PinHash  || computeHash(String(env.ADMIN_MASTER_PIN || '1234').trim(), 'owner_master');
  const recHash       = saved?.recHash       || '';

  return { gate1User, defaultGate1Users, gate1PassHash, gate2PinHash, recHash };
}

async function verifyOwnerGate2(body, kv, env) {
  const cfg = await getOwnerSecurityConfig(kv, env);
  if (body.masterPin && computeHash(String(body.masterPin).trim(), 'owner_master') === cfg.gate2PinHash) {
    return true;
  }
  if (body.masterPinHash && body.masterPinHash === cfg.gate2PinHash) {
    return true;
  }
  return false;
}

function analyzeStudentProgress(stu) {
  const yr = parseInt(stu.assignedYear, 10) || 1;
  const stg = Math.ceil(yr / 7);
  const branch = stu.schoolBranch || 'main';
  const saveKey = branch === 'main' ? `y${yr}` : `${branch}_y${yr}`;
  const prog = stu.progress || {};

  let curWeek = parseInt(prog[`student_week_${saveKey}`], 10) || stu.stats?.curWeek || 1;
  let curSubj = parseInt(prog[`student_subj_${saveKey}`], 10) || stu.stats?.curSubj || 1;

  const sealScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  const sealAttempts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

  Object.keys(prog).forEach((k) => {
    let m1 = k.match(new RegExp(`^subj_score_${saveKey}_w(\\d+)_s([1-7])$`));
    if (m1) {
      const s = parseInt(m1[2], 10);
      sealScores[s] += parseFloat(prog[k]) || 0;
      sealAttempts[s] += 1;
    }
    let m2 = k.match(new RegExp(`^subj_star_${saveKey}_w(\\d+)_s([1-7])$`));
    if (m2 && prog[k] === '1') {
      const s = parseInt(m2[2], 10);
      sealScores[s] += 1;
      sealAttempts[s] += 1;
    }
    let m3 = k.match(new RegExp(`star_y${yr}_w(\\d+)_s([1-7])$`));
    if (m3 && prog[k] === '1') {
      const s = parseInt(m3[2], 10);
      sealScores[s] += 1;
      sealAttempts[s] += 1;
    }
  });

  let strongestSeal = null, weakestSeal = null;
  let maxVal = -1, minVal = Infinity;
  const totalTouched = Object.values(sealAttempts).reduce((a, b) => a + b, 0);

  if (totalTouched > 0) {
    for (let s = 1; s <= 7; s++) {
      const avg = sealAttempts[s] > 0 ? (sealScores[s] / sealAttempts[s]) : 0;
      if (sealScores[s] > maxVal) { maxVal = sealScores[s]; strongestSeal = s; }
      if (avg < minVal) { minVal = avg; weakestSeal = s; }
    }
  }

  let pct = stu.stats?.pct;
  if (typeof pct !== 'number') {
    const completedLessonsCount = Array.isArray(stu.lessonHistory) ? stu.lessonHistory.length : 0;
    pct = Math.min(100, Math.round(((curWeek - 1) / 28) * 100) || (completedLessonsCount > 0 ? 4 : 0));
  }

  return {
    yr, stg, curWeek, curSubj, pct,
    scoreLabel: stu.stats?.scoreLabel || stu.lastScore || `${pct}%`,
    lessonsDoneCount: Array.isArray(stu.lessonHistory) ? stu.lessonHistory.length : 0,
    strongestSeal, weakestSeal
  };
}

async function loadDirectoryIndex(kv) {
  const raw = await kv.get('dir:index_v1', 'json');
  return raw || { students: {}, teachers: {}, schools: {} };
}

async function saveDirectoryIndex(kv, dir) {
  await kv.put('dir:index_v1', JSON.stringify(dir));
}

function summarizeStudentForDir(stu) {
  const an = analyzeStudentProgress(stu);
  return {
    username: stu.username,
    name: stu.name || stu.username,
    assignedYear: an.yr,
    schoolBranch: stu.schoolBranch || 'main',
    createdAt: stu.createdAt || null,
    lastActiveAt: stu.lastActiveAt || stu.updatedAt || stu.createdAt || null,
    pct: an.pct,
    scoreLabel: an.scoreLabel,
    curWeek: an.curWeek,
    curSubj: an.curSubj,
    lessonsDoneCount: an.lessonsDoneCount,
    strongestSeal: an.strongestSeal,
    weakestSeal: an.weakestSeal
  };
}

function summarizeTeacherForDir(tch) {
  return {
    username: tch.username,
    name: tch.name || tch.username,
    schoolId: tch.schoolId || 'main',
    schoolCode: tch.schoolCode || '',
    schoolName: tch.schoolName || 'مدرسة العلم',
    createdAt: tch.createdAt || null,
    lastActiveAt: tch.lastActiveAt || tch.updatedAt || tch.createdAt || null
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method === 'GET') {
      return jsonRes({
        ok: true,
        service: 'al-3lm-unified-worker-v13',
        googleClientId: env.GOOGLE_CLIENT_ID || ''
      });
    }

    let body = {};
    try {
      body = await request.json();
    } catch (_) {
      return jsonRes({ ok: false, error: 'INVALID_JSON' }, 400);
    }

    const action = body.action || '';
    const kv = getKV(env);
    const nowIso = new Date().toISOString();

    if (action) {
      if (!kv) {
        return jsonRes({ ok: false, error: 'KV_NOT_BOUND', hint: 'يرجى ربط USERS_KV في إعدادات الـ Worker.' }, 500);
      }

      // ٠. البوابة الإدارية الأولى (في index.html): تتحقق من يوزر وباسورد الإدارة الأولين وتمنح شارة كشف بوابة المالك الثانية!
      if (action === 'verify_admin_gate1') {
        const u = String(body.username || '').trim().toLowerCase();
        const pw = String(body.password || '').trim();
        const cfg = await getOwnerSecurityConfig(kv, env);

        const userMatches = cfg.gate1User
          ? (u === cfg.gate1User)
          : cfg.defaultGate1Users.includes(u);

        // يقبل كلمة المرور الأولى للإدارة (الافتراضية admin1234 أو المخصصة)، كما يقبل توافقاً أولياً 1234 إن لم تُغيّر بعد
        const enteredGate1Hash = computeHash(pw, 'owner_gate1');
        const enteredLegacyHash = computeHash(pw, 'owner_master');
        const passMatches = (enteredGate1Hash === cfg.gate1PassHash) || (!cfg.gate1User && enteredLegacyHash === cfg.gate2PinHash);

        if (userMatches && passMatches) {
          const gate1Token = computeHash(`${cfg.gate1PassHash}::${new Date().toISOString().slice(0, 10)}`, 'gate1_session');
          return jsonRes({ ok: true, isOwnerGate1: true, gate1Token, adminDisplay: body.username || 'الإدارة' });
        }
        return jsonRes({ ok: false, error: 'NOT_ADMIN_GATE1' });
      }

      // ٠-ب. البوابة الإدارية الثانية (فتح خزنة المالك السرية والتحليلات داخل teachers.html بالباسورد الثاني المستقل)
      if (action === 'verify_owner_gate2') {
        const ok = await verifyOwnerGate2(body, kv, env);
        if (!ok) return jsonRes({ ok: false, error: 'WRONG_MASTER_PIN' }, 403);
        return jsonRes({ ok: true });
      }

      // ٠-ج. تحديث بيانات البوابتين السريتين للمالك وحفظها في السحابة (Cloudflare KV) لتعمل من أي جهاز
      if (action === 'owner_update_credentials') {
        const ok = await verifyOwnerGate2(body, kv, env);
        if (!ok) return jsonRes({ ok: false, error: 'UNAUTHORIZED_OWNER' }, 403);

        const cfg = await getOwnerSecurityConfig(kv, env);
        const nextCfg = {
          gate1User: body.newGate1User ? String(body.newGate1User).trim().toLowerCase() : cfg.gate1User,
          gate1PassHash: body.newGate1Pass ? computeHash(String(body.newGate1Pass).trim(), 'owner_gate1') : cfg.gate1PassHash,
          gate2PinHash: body.newGate2Pin ? computeHash(String(body.newGate2Pin).trim(), 'owner_master') : cfg.gate2PinHash,
          recHash: body.newRecoveryPhrase ? computeHash(String(body.newRecoveryPhrase).trim(), 'owner_rec') : cfg.recHash,
          updatedAt: nowIso
        };
        await kv.put('cfg:owner_security_v1', JSON.stringify(nextCfg));
        return jsonRes({ ok: true, gate2PinHash: nextCfg.gate2PinHash });
      }

      // ٠-د. دخول سريع عبر حساب Google (OAuth ID Token) بدون حاجة لحفظ باسورد جديد!
      if (action === 'oauth_google_login') {
        const idToken = String(body.credential || '').trim();
        const role = body.role === 'teacher' ? 'teacher' : 'student';
        if (!idToken) return jsonRes({ ok: false, error: 'MISSING_TOKEN' }, 400);

        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (!verifyRes.ok) return jsonRes({ ok: false, error: 'INVALID_GOOGLE_TOKEN' }, 401);
        const tokenInfo = await verifyRes.json();

        const expectedClientId = env.GOOGLE_CLIENT_ID || body.clientId || '';
        if (expectedClientId && tokenInfo.aud !== expectedClientId) {
          return jsonRes({ ok: false, error: 'CLIENT_ID_MISMATCH' }, 401);
        }

        const email = String(tokenInfo.email || '').trim().toLowerCase();
        if (!email) return jsonRes({ ok: false, error: 'NO_EMAIL' }, 400);

        const baseUser = email.split('@')[0].replace(/[^a-z0-9_\u0600-\u06FF]/gi, '') || ('user_' + tokenInfo.sub.slice(-6));
        const username = baseUser.toLowerCase();
        const oauthHash = computeHash(tokenInfo.sub, 'google_oauth_' + username);
        const dir = await loadDirectoryIndex(kv);

        if (role === 'student') {
          let stu = await kv.get(`stu:${username}`, 'json');
          if (stu && stu.googleSub && stu.googleSub !== tokenInfo.sub) {
            return jsonRes({ ok: false, error: 'USERNAME_COLLISION' }, 409);
          }
          if (!stu) {
            stu = {
              accountType: 'student',
              username,
              name: tokenInfo.given_name || tokenInfo.name || username,
              email,
              googleSub: tokenInfo.sub,
              pwHash: oauthHash,
              assignedYear: parseInt(body.assignedYear, 10) || 1,
              schoolBranch: body.schoolBranch || 'main',
              createdAt: nowIso,
              lastActiveAt: nowIso,
              progress: {},
              lessonHistory: []
            };
          } else {
            stu.googleSub = tokenInfo.sub;
            stu.lastActiveAt = nowIso;
          }
          await kv.put(`stu:${username}`, JSON.stringify(stu));
          dir.students[username] = summarizeStudentForDir(stu);
          await saveDirectoryIndex(kv, dir);
          return jsonRes({ ok: true, role: 'student', profile: stu });
        } else {
          let tch = await kv.get(`tch:${username}`, 'json');
          if (!tch) {
            tch = {
              accountType: 'teacher',
              username,
              name: tokenInfo.given_name || tokenInfo.name || username,
              email,
              googleSub: tokenInfo.sub,
              pwHash: oauthHash,
              schoolId: 'main',
              schoolCode: '',
              schoolName: 'مدرسة العلم',
              createdAt: nowIso,
              lastActiveAt: nowIso
            };
          } else {
            tch.googleSub = tokenInfo.sub;
            tch.lastActiveAt = nowIso;
          }
          await kv.put(`tch:${username}`, JSON.stringify(tch));
          dir.teachers[username] = summarizeTeacherForDir(tch);
          await saveDirectoryIndex(kv, dir);
          return jsonRes({ ok: true, role: 'teacher', profile: tch });
        }
      }

      // ١. تسجيل تلميذ جديد
      if (action === 'register_student') {
        const p = body.profile || {};
        const username = String(p.username || '').trim().toLowerCase();
        if (!username || !p.pwHash) return jsonRes({ ok: false, error: 'MISSING_FIELDS' }, 400);
        const existing = await kv.get(`stu:${username}`, 'json');
        if (existing) return jsonRes({ ok: false, error: 'USERNAME_EXISTS' });

        p.username = username;
        p.createdAt = p.createdAt || nowIso;
        p.lastActiveAt = nowIso;
        await kv.put(`stu:${username}`, JSON.stringify(p));

        const dir = await loadDirectoryIndex(kv);
        dir.students[username] = summarizeStudentForDir(p);
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true, profile: p });
      }

      // ٢. دخول أو سحب بيانات التلميذ
      if (action === 'login_student' || action === 'pull_student') {
        const username = String(body.username || '').trim().toLowerCase();
        const pwHash = String(body.pwHash || '').trim();
        const stu = await kv.get(`stu:${username}`, 'json');
        if (!stu) return jsonRes({ ok: false, error: 'NOT_FOUND' });
        if (stu.pwHash !== pwHash) return jsonRes({ ok: false, error: 'WRONG_PASSWORD' });

        stu.lastActiveAt = nowIso;
        await kv.put(`stu:${username}`, JSON.stringify(stu));

        const dir = await loadDirectoryIndex(kv);
        dir.students[username] = summarizeStudentForDir(stu);
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true, profile: stu });
      }

      // ٣. مزامنة تقدم التلميذ
      if (action === 'sync_student') {
        const username = String(body.username || body.profile?.username || '').trim().toLowerCase();
        const pwHash = String(body.pwHash || body.profile?.pwHash || '').trim();
        if (!username || !pwHash) return jsonRes({ ok: false, error: 'MISSING_FIELDS' }, 400);

        const existing = await kv.get(`stu:${username}`, 'json');
        if (existing && existing.pwHash !== pwHash) return jsonRes({ ok: false, error: 'WRONG_PASSWORD' });

        const merged = {
          ...(existing || {}),
          ...(body.profile || {}),
          username,
          pwHash,
          progress: { ...(existing?.progress || {}), ...(body.profile?.progress || {}) },
          lastActiveAt: nowIso
        };
        await kv.put(`stu:${username}`, JSON.stringify(merged));

        const dir = await loadDirectoryIndex(kv);
        dir.students[username] = summarizeStudentForDir(merged);
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true, profile: merged });
      }

      // ٤. تسجيل معلم جديد
      if (action === 'register_teacher') {
        const p = body.profile || {};
        const username = String(p.username || '').trim().toLowerCase();
        if (!username || !p.pwHash) return jsonRes({ ok: false, error: 'MISSING_FIELDS' }, 400);
        const existing = await kv.get(`tch:${username}`, 'json');
        if (existing) return jsonRes({ ok: false, error: 'USERNAME_EXISTS' });

        p.username = username;
        p.createdAt = p.createdAt || nowIso;
        p.lastActiveAt = nowIso;
        await kv.put(`tch:${username}`, JSON.stringify(p));

        const dir = await loadDirectoryIndex(kv);
        dir.teachers[username] = summarizeTeacherForDir(p);
        if (p.schoolMeta && p.schoolMeta.id) {
          const sm = { ...p.schoolMeta };
          delete sm.pin;
          dir.schools[sm.id] = sm;
          await kv.put(`sch:${sm.id}`, JSON.stringify(sm));
        }
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true, profile: p });
      }

      // ٥. دخول المعلم
      if (action === 'login_teacher') {
        const username = String(body.username || '').trim().toLowerCase();
        const pwHash = String(body.pwHash || '').trim();
        const tch = await kv.get(`tch:${username}`, 'json');
        if (!tch) return jsonRes({ ok: false, error: 'NOT_FOUND' });
        if (tch.pwHash !== pwHash) return jsonRes({ ok: false, error: 'WRONG_PASSWORD' });

        tch.lastActiveAt = nowIso;
        await kv.put(`tch:${username}`, JSON.stringify(tch));

        const dir = await loadDirectoryIndex(kv);
        dir.teachers[username] = summarizeTeacherForDir(tch);
        await saveDirectoryIndex(kv, dir);

        let schoolMeta = tch.schoolMeta || null;
        if (tch.schoolId && tch.schoolId !== 'main') {
          const savedSch = await kv.get(`sch:${tch.schoolId}`, 'json');
          if (savedSch) schoolMeta = savedSch;
        }
        return jsonRes({ ok: true, profile: tch, schoolMeta });
      }

      // ٦. مزامنة المعلم ومدرسته
      if (action === 'sync_teacher') {
        const username = String(body.username || body.profile?.username || '').trim().toLowerCase();
        const pwHash = String(body.pwHash || body.profile?.pwHash || '').trim();
        if (!username || !pwHash) return jsonRes({ ok: false, error: 'MISSING_FIELDS' }, 400);

        const existing = await kv.get(`tch:${username}`, 'json');
        if (existing && existing.pwHash !== pwHash) return jsonRes({ ok: false, error: 'WRONG_PASSWORD' });

        const merged = { ...(existing || {}), ...(body.profile || {}), username, pwHash, lastActiveAt: nowIso };
        await kv.put(`tch:${username}`, JSON.stringify(merged));

        const dir = await loadDirectoryIndex(kv);
        dir.teachers[username] = summarizeTeacherForDir(merged);
        const sm = body.schoolMeta || merged.schoolMeta;
        if (sm && sm.id) {
          dir.schools[sm.id] = sm;
          await kv.put(`sch:${sm.id}`, JSON.stringify(sm));
        }
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true });
      }

      // ٧. نشر حزمة دروس المدرسة الخاصة سحابياً بضغطة زر ليقرأها جميع طلابها تلقائياً بدون إرسال ملفات يدوياً!
      if (action === 'publish_school_package') {
        const pkg = body.packageData;
        const schoolId = pkg?.schoolMeta?.id;
        if (!schoolId || schoolId === 'main') return jsonRes({ ok: false, error: 'INVALID_SCHOOL' }, 400);

        const safeMeta = { ...pkg.schoolMeta };
        delete safeMeta.pin;
        delete safeMeta.pinHash;
        delete safeMeta.recHash;

        const cloudPkg = {
          packageType: 'single_private_school',
          publishedAt: nowIso,
          schoolMeta: safeMeta,
          lessonsByYear: pkg.lessonsByYear || {}
        };
        await kv.put(`pkg:sch:${schoolId}`, JSON.stringify(cloudPkg));

        const dir = await loadDirectoryIndex(kv);
        dir.schools[schoolId] = { ...(dir.schools[schoolId] || {}), ...safeMeta, lastPublishedAt: nowIso };
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true, publishedAt: nowIso });
      }

      // ٧-ب. سحب أحدث دروس المدرسة الخاصة تلقائياً للطالب المشترك فيها
      if (action === 'pull_school_package') {
        const schoolId = String(body.schoolId || '').trim();
        if (!schoolId || schoolId === 'main') return jsonRes({ ok: false, error: 'MAIN_SCHOOL' });
        const cloudPkg = await kv.get(`pkg:sch:${schoolId}`, 'json');
        if (!cloudPkg) return jsonRes({ ok: false, error: 'NO_PUBLISHED_PACKAGE' });
        return jsonRes({ ok: true, packageData: cloudPkg });
      }

      // ٨. صندوق التراسل السحابي المباشر للحزم (JSON) بين المستخدمين (معلم <-> طالب <-> إدارة) من داخل المنصة!
      if (action === 'send_package') {
        const fromUser = String(body.fromUser || 'مستخدم').trim();
        const fromRole = String(body.fromRole || 'user').trim();
        const targetRaw = String(body.toUsername || '').trim().toLowerCase();
        const title = String(body.title || 'حزمة تعليمية مشتركة').trim();
        const packagePayload = body.packagePayload;

        if (!targetRaw || !packagePayload) {
          return jsonRes({ ok: false, error: 'MISSING_TARGET_OR_PACKAGE' }, 400);
        }

        const dir = await loadDirectoryIndex(kv);
        let recipients = [];

        // خيار الإرسال الجماعي لجميع طلاب مدرسة معينة بضغطة واحدة
        if (targetRaw.startsWith('school:')) {
          const schId = targetRaw.slice(7);
          recipients = Object.values(dir.students || {})
            .filter(s => s.schoolBranch === schId)
            .map(s => s.username);
        } else {
          // التحقق من وجود المستلم (طالب أو معلم أو الإدارة)
          const existsStu = await kv.get(`stu:${targetRaw}`, 'json');
          const existsTch = await kv.get(`tch:${targetRaw}`, 'json');
          const isAdminTarget = ['admin', 'الإدارة', 'الادارة'].includes(targetRaw);
          if (!existsStu && !existsTch && !isAdminTarget) {
            return jsonRes({ ok: false, error: 'RECIPIENT_NOT_FOUND' }, 404);
          }
          recipients = [isAdminTarget ? 'admin' : targetRaw];
        }

        const msgItem = {
          id: 'pkg_' + Date.now() + '_' + Math.floor(Math.random() * 9000 + 1000),
          fromUser,
          fromRole,
          title,
          sentAt: nowIso,
          packagePayload
        };

        for (const rec of recipients) {
          const inboxKey = `inbox:${rec}`;
          const curInbox = (await kv.get(inboxKey, 'json')) || [];
          curInbox.unshift(msgItem);
          await kv.put(inboxKey, JSON.stringify(curInbox.slice(0, 15)));
        }

        return jsonRes({ ok: true, deliveredCount: recipients.length });
      }

      // ٨-ب. فحص صندوق الحزم الواردة للمستخدم الحالي
      if (action === 'check_inbox') {
        const u = String(body.username || '').trim().toLowerCase();
        const includeAdminBox = Boolean(body.includeAdminBox);
        if (!u && !includeAdminBox) return jsonRes({ ok: true, items: [] });

        let items = u ? ((await kv.get(`inbox:${u}`, 'json')) || []) : [];
        if (includeAdminBox && u !== 'admin') {
          const adminItems = (await kv.get('inbox:admin', 'json')) || [];
          items = [...adminItems.map(x => ({ ...x, _adminBox: true })), ...items];
        }
        return jsonRes({ ok: true, items });
      }

      // ٨-ج. حذف حزمة واردة بعد قبولها أو استعراضها
      if (action === 'delete_inbox_item') {
        const u = String(body.username || '').trim().toLowerCase();
        const itemId = String(body.itemId || '').trim();
        const boxKey = body.isAdminBox ? 'inbox:admin' : `inbox:${u}`;
        const cur = (await kv.get(boxKey, 'json')) || [];
        const filtered = cur.filter(x => x.id !== itemId);
        await kv.put(boxKey, JSON.stringify(filtered));
        return jsonRes({ ok: true });
      }

      // ٩. جلب الدليل العام أو تحليلات المالك الشاملة
      if (action === 'list_directory' || action === 'owner_analytics_directory') {
        const dir = await loadDirectoryIndex(kv);

        if (action === 'owner_analytics_directory') {
          const ok = await verifyOwnerGate2(body, kv, env);
          if (!ok) return jsonRes({ ok: false, error: 'UNAUTHORIZED_OWNER' }, 403);

          const stuList = await kv.list({ prefix: 'stu:' });
          for (const k of (stuList.keys || [])) {
            const u = k.name.slice(4);
            const sObj = await kv.get(k.name, 'json');
            if (sObj) dir.students[u] = summarizeStudentForDir(sObj);
          }
          const tchList = await kv.list({ prefix: 'tch:' });
          for (const k of (tchList.keys || [])) {
            const u = k.name.slice(4);
            const tObj = await kv.get(k.name, 'json');
            if (tObj) dir.teachers[u] = summarizeTeacherForDir(tObj);
          }
          await saveDirectoryIndex(kv, dir);
        }

        return jsonRes({
          ok: true,
          googleClientId: env.GOOGLE_CLIENT_ID || '',
          students: Object.values(dir.students || {}),
          teachers: Object.values(dir.teachers || {}),
          schools: Object.values(dir.schools || {})
        });
      }

      // ١٠. حذف حساب مستخدم (خاص بالمالك الأساسي عبر البوابة الثانية)
      if (action === 'owner_delete_user') {
        const ok = await verifyOwnerGate2(body, kv, env);
        if (!ok) return jsonRes({ ok: false, error: 'UNAUTHORIZED_OWNER' }, 403);

        const role = body.accountType === 'teacher' ? 'teacher' : 'student';
        const username = String(body.username || '').trim().toLowerCase();
        if (!username) return jsonRes({ ok: false, error: 'MISSING_USERNAME' }, 400);

        const dir = await loadDirectoryIndex(kv);
        if (role === 'teacher') {
          const tObj = await kv.get(`tch:${username}`, 'json');
          await kv.delete(`tch:${username}`);
          delete dir.teachers[username];
          if (body.deleteSchoolToo && tObj?.schoolId && tObj.schoolId !== 'main') {
            await kv.delete(`sch:${tObj.schoolId}`);
            await kv.delete(`pkg:sch:${tObj.schoolId}`);
            delete dir.schools[tObj.schoolId];
          }
        } else {
          await kv.delete(`stu:${username}`);
          delete dir.students[username];
        }
        await kv.delete(`inbox:${username}`);
        await saveDirectoryIndex(kv, dir);
        return jsonRes({ ok: true, deleted: username, accountType: role });
      }

      // ١١. إعادة تعيين كلمة مرور مستخدم (خاص بالمالك الأساسي عبر البوابة الثانية)
      if (action === 'owner_reset_user_password') {
        const ok = await verifyOwnerGate2(body, kv, env);
        if (!ok) return jsonRes({ ok: false, error: 'UNAUTHORIZED_OWNER' }, 403);

        const role = body.accountType === 'teacher' ? 'teacher' : 'student';
        const username = String(body.username || '').trim().toLowerCase();
        const newPassword = String(body.newPassword || '').trim();
        if (!username || newPassword.length < 3) return jsonRes({ ok: false, error: 'INVALID_INPUT' }, 400);

        const key = role === 'teacher' ? `tch:${username}` : `stu:${username}`;
        const acc = await kv.get(key, 'json');
        if (!acc) return jsonRes({ ok: false, error: 'NOT_FOUND' }, 404);

        const saltPrefix = role === 'teacher' ? 'tch_' : 'stu_';
        acc.pwHash = computeHash(newPassword, saltPrefix + username);
        await kv.put(key, JSON.stringify(acc));
        return jsonRes({ ok: true, username, accountType: role });
      }

      return jsonRes({ ok: false, error: 'UNKNOWN_ACTION' }, 400);
    }

    // طلبات المعلم المحاور والمجيب الآلي (Gemini API)
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) return jsonRes({ ok: false, error: 'MISSING_GEMINI_API_KEY' }, 500);

    const systemInstruction = String(body.systemInstruction || 'أنت معلم حكيم في مدرسة العلم.').trim();
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const maxOutputTokens = Math.min(1200, Math.max(120, parseInt(body.maxOutputTokens, 10) || 450));

    const contents = rawMessages.map((m) => ({
      role: m.role === 'teacher' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text || '') }]
    }));
    if (contents.length === 0) contents.push({ role: 'user', parts: [{ text: 'مرحباً يا معلمي.' }] });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
      const gRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.55, maxOutputTokens }
        })
      });
      const gData = await gRes.json();
      const reply = gData?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n').trim() || '';
      if (!reply) return jsonRes({ ok: false, error: 'EMPTY_MODEL_REPLY' }, 502);
      return jsonRes({ ok: true, reply });
    } catch (_) {
      return jsonRes({ ok: false, error: 'GEMINI_NETWORK_ERROR' }, 502);
    }
  }
};
