// ============================================================================
// interactive-labs.js — محرك المختبرات والألعاب التفاعلية المستقل (28 × 7 × 7)
// يقرأ النص الموجود أسفل المختبر ويبني تفاعلاً متصاعداً حسب الحرف والختم والمستوى
// ============================================================================
window.InteractiveLabEngine = (function () {
    let activeAnimId = null;
    let activeInterval = null;

    const LETTER_MECHANICS = [
        'التقاط الفكرة الأساسية', 'فرز المفاهيم المترابطة', 'ترتيب خطوات الفكرة', 'موازنة القيم والنسب',
        'ضبط الزاوية والمقياس', 'اختبار العلاقة السببية', 'ربط الأصل بالفرع', 'استخراج القاعدة العامة',
        'تحليل الحالات المتعددة', 'مقارنة النماذج بدقة', 'تتبع المسار المتسلسل', 'إكمال النمط الناقص',
        'تقدير المقدار والتناسب', 'فحص التوازن والاستقرار', 'تركيب العناصر المتكاملة', 'تمييز الخاص من العام',
        'ضبط الإيقاع والتردد', 'توجيه المسار نحو الهدف', 'تحويل المعطى إلى نتيجة', 'بناء البرهان الخطوي',
        'مراجعة الشروط والقيود', 'استنتاج الأثر التطبيقي', 'ربط المعنى بالسلوك', 'تثبيت المفهوم بالممارسة',
        'اختبار الدقة تحت التغيير', 'تجميع خلاصة المدار', 'إتقان الربط الشامل', 'التركيب المتقدم للدرس'
    ];

    const SEAL_LAB_THEMES = {
        1: { name: 'مختبر المنطق والبيان', accent: '#10b981', badge: 'المنطق' },
        2: { name: 'مختبر البصيرة الهندسية', accent: '#38bdf8', badge: 'البصيرة' },
        3: { name: 'مختبر الرنين والصوت', accent: '#c084fc', badge: 'الصوت' },
        4: { name: 'مختبر الرياضيات والمقدار', accent: '#facc15', badge: 'المقدار' },
        5: { name: 'مختبر الحركة والاتزان', accent: '#fb7185', badge: 'الحركة' },
        6: { name: 'مختبر العلوم وسنن الكون', accent: '#34d399', badge: 'العلوم' },
        7: { name: 'مختبر الآداب وتزكية السلوك', accent: '#fbbf24', badge: 'الآداب' }
    };

    function stopActiveTimers() {
        if (activeAnimId) {
            cancelAnimationFrame(activeAnimId);
            activeAnimId = null;
        }
        if (activeInterval) {
            clearInterval(activeInterval);
            activeInterval = null;
        }
    }

    // استخراج النص التعليمي الموضوع أسفل المختبر وتقسيمه إلى عبارات صافية بدون أرقام أو رموز مزعجة
    function extractCleanPhrasesFromSlideText(labData, subjId) {
        let rawText = '';

        if (typeof labData === 'string') {
            rawText = labData;
        } else if (labData && typeof labData.text === 'string') {
            rawText = labData.text;
        }

        if (!rawText) {
            const textDom = document.querySelector('#main-content .slider-text-content');
            if (textDom && textDom.innerText.trim()) {
                rawText = textDom.innerText.trim();
            }
        }

        if (!rawText && typeof getActiveCurriculumObj === 'function') {
            const lessonObj = getActiveCurriculumObj();
            const sIdx = window._activeSlideIdx || 0;
            rawText = lessonObj?.learn?.slides?.[sIdx]?.text || lessonObj?.learn?.introGoal || '';
        }

        const subjName = (typeof SUBJ_TITLES !== 'undefined' && SUBJ_TITLES[subjId]) ? SUBJ_TITLES[subjId] : 'الدرس';
        if (!rawText || !rawText.trim()) {
            rawText = `هذا درس ${subjName} قيد التحضير`;
        }

        const cleanedFull = rawText
            .replace(/<[^>]*>/g, ' ')
            .replace(/[\/\\|()\[\]{}«»"':؛،,.\-–—_*#@$%^&+=~`?؟!]/g, ' ')
            .replace(/[0-9٠-٩]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const words = cleanedFull.split(' ').filter(w => w.length > 1);
        const phrases = [];

        if (words.length >= 3) {
            const chunkSize = Math.max(2, Math.min(4, Math.ceil(words.length / 4)));
            for (let i = 0; i < words.length && phrases.length < 5; i += chunkSize) {
                const part = words.slice(i, i + chunkSize).join(' ').trim();
                if (part && !phrases.includes(part)) phrases.push(part);
            }
        }

        while (phrases.length < 3) {
            phrases.push(`هذا درس ${subjName} قيد التحضير`);
        }

        return {
            fullText: cleanedFull || `هذا درس ${subjName} قيد التحضير`,
            phrases: phrases.slice(0, 5)
        };
    }

    // حساب إحداثيات المصفوفة (1..28 للحرف، 1..7 للختم، 1..7 للمستوى)
    function computeMatrixCoords(labData, subjId) {
        const gWeek = (typeof playWeek !== 'undefined') ? playWeek : 1;
        const yearVal = (typeof RAW_YEAR !== 'undefined') ? RAW_YEAR : 8;
        const cycleVal = (typeof getCycleFromGlobalWeek === 'function') ? getCycleFromGlobalWeek(gWeek) : Math.ceil(gWeek / 28);

        const letterIndex = (labData && Number.isInteger(labData.letterIndex))
            ? Math.max(1, Math.min(28, labData.letterIndex))
            : (((gWeek - 1) % 28) + 1);

        const letterChar = (typeof getAbjadChar === 'function')
            ? getAbjadChar(letterIndex - 1)
            : 'أ';

        const sealIndex = Math.max(1, Math.min(7, parseInt(subjId || (typeof activeViewSubj !== 'undefined' ? activeViewSubj : 1), 10) || 1));

        // تصاعد المستوى من 1 إلى 7 حسب السنة والدورة والختم
        const computedLevel = (labData && Number.isInteger(labData.level))
            ? Math.max(1, Math.min(7, labData.level))
            : Math.max(1, Math.min(7, ((yearVal - 8) + Math.ceil((cycleVal * sealIndex) / 7))));

        return {
            letterIndex,
            letterChar,
            sealIndex,
            level: computedLevel,
            cycle: cycleVal,
            year: yearVal
        };
    }

    function render(stageContainer, labData, subjId) {
        stopActiveTimers();
        if (!stageContainer) return;
        stageContainer.innerHTML = '';

        const coords = computeMatrixCoords(labData, subjId);
        const theme = SEAL_LAB_THEMES[coords.sealIndex] || SEAL_LAB_THEMES[1];
        const mechanicName = LETTER_MECHANICS[coords.letterIndex - 1] || LETTER_MECHANICS[0];
        const extracted = extractCleanPhrasesFromSlideText(labData, coords.sealIndex);

        // شريط علوي مختصر يوضح الختم والحرف والمستوى
        const headerPill = document.createElement('div');
        headerPill.className = 'lab-header-pill';
        headerPill.style.borderColor = theme.accent;
        headerPill.innerHTML = `
            <span>${theme.name}</span>
            <span>•</span>
            <span>حرف ${coords.letterChar}</span>
            <span>•</span>
            <span>المستوى ${coords.level} من 7</span>
        `;

        // منطقة التفاعل واللعبة المبنية على النص أسفل المختبر
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'lab-canvas-wrap';
        canvasWrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:8px; width:100%;';

        const activeCount = Math.min(extracted.phrases.length, Math.max(2, Math.min(5, Math.ceil(coords.level / 2) + 1)));
        const targetPhrases = extracted.phrases.slice(0, activeCount);
        let currentTargetIdx = 0;
        let matchedSet = new Set();

        const missionBox = document.createElement('div');
        missionBox.style.cssText = `
            background: rgba(15, 23, 42, 0.85);
            border: 1.5px solid ${theme.accent};
            border-radius: 14px;
            padding: 8px 16px;
            color: #fef08a;
            font-weight: 800;
            font-size: clamp(0.88rem, 2vmin, 1.12rem);
            text-align: center;
            max-width: 95%;
        `;

        const cardsGrid = document.createElement('div');
        cardsGrid.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            max-width: 820px;
        `;

        // شريط تحكم سفلي للمستوى وإعادة التوليد
        const controlsBar = document.createElement('div');
        controlsBar.className = 'lab-controls-bar';
        controlsBar.style.borderColor = theme.accent;

        let selectedLevel = coords.level;

        function refreshMissionPrompt() {
            const targetPhrase = targetPhrases[currentTargetIdx] || extracted.fullText;
            missionBox.innerHTML = `${mechanicName} — اختر المقطع المطابق: <span>${targetPhrase}</span>`;
        }

        function buildInteractiveCards() {
            cardsGrid.innerHTML = '';
            matchedSet.clear();
            currentTargetIdx = 0;
            refreshMissionPrompt();

            const shuffled = [...targetPhrases].sort(() => Math.random() - 0.5);
            shuffled.forEach((phrase, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'lab-action-mini-btn';
                btn.style.cssText = `
                    padding: 10px 16px;
                    font-size: clamp(0.86rem, 1.95vmin, 1.08rem);
                    border-radius: 14px;
                    background: rgba(15, 23, 42, 0.9);
                    color: #f8fafc;
                    border: 2px solid ${theme.accent};
                    cursor: pointer;
                    transition: transform 0.18s ease, background 0.18s ease;
                    max-width: 260px;
                    line-height: 1.5;
                `;
                btn.innerText = phrase;

                btn.onclick = () => {
                    if (matchedSet.has(idx)) return;
                    const expectedPhrase = targetPhrases[currentTargetIdx];
                    if (phrase === expectedPhrase) {
                        matchedSet.add(idx);
                        btn.style.background = '#059669';
                        btn.style.color = '#ffffff';
                        btn.style.borderColor = '#fde047';
                        if (typeof playCorrectChime === 'function') playCorrectChime();

                        if (matchedSet.size >= targetPhrases.length) {
                            missionBox.innerHTML = `اكتمل نشاط الحرف ${coords.letterChar} في المستوى ${selectedLevel}`;
                            if (typeof updateNavButtons === 'function') updateNavButtons(true);
                        } else {
                            currentTargetIdx++;
                            refreshMissionPrompt();
                        }
                    } else {
                        btn.style.background = '#991b1b';
                        btn.style.borderColor = '#fca5a5';
                        if (typeof playWrongTone === 'function') playWrongTone();
                        setTimeout(() => {
                            if (!matchedSet.has(idx)) {
                                btn.style.background = 'rgba(15, 23, 42, 0.9)';
                                btn.style.borderColor = theme.accent;
                            }
                        }, 450);
                    }
                };

                cardsGrid.appendChild(btn);
            });
        }

        controlsBar.innerHTML = `
            <label class="lab-ctrl-group">المستوى <input type="range" id="lab-lvl-range" min="1" max="7" value="${selectedLevel}"><span class="lab-val-badge" id="lab-lvl-badge">${selectedLevel}</span></label>
            <button type="button" class="lab-action-mini-btn" id="lab-replay-btn">إعادة المحاولة</button>
        `;

        canvasWrap.appendChild(missionBox);
        canvasWrap.appendChild(cardsGrid);
        stageContainer.appendChild(headerPill);
        stageContainer.appendChild(canvasWrap);
        stageContainer.appendChild(controlsBar);

        const lvlRange = controlsBar.querySelector('#lab-lvl-range');
        const lvlBadge = controlsBar.querySelector('#lab-lvl-badge');
        const replayBtn = controlsBar.querySelector('#lab-replay-btn');

        lvlRange.oninput = (e) => {
            selectedLevel = parseInt(e.target.value, 10) || 1;
            lvlBadge.innerText = String(selectedLevel);
            buildInteractiveCards();
        };

        replayBtn.onclick = () => {
            buildInteractiveCards();
        };

        buildInteractiveCards();
    }

    return { render, stopActiveTimers };
})();