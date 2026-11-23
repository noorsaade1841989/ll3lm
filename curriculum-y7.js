// ============================================================================
// الملف الجامع لمنهج السنة السابعة (عمر 7 سنوات - 28 أسبوعاً × 7 جوارح) — curriculum-y7.js
// مقسم إلى 7 أقسام علمية وفلكية (curriculum-y7-part1.js .. curriculum-y7-part7.js)
// ومزود بمحرك ضبط الفيديوهات لملف stage-1.html:
// - الصف 1: فيديوهات فقط
// - الصفوف 2..5: إيقاف وإخفاء الفيديوهات تماماً
// - الصفان 6 و7: إضاءة زر الفيديو ومشغل الفيديو عند توفر الفيديو، وإطفاؤه عند عدم توفره
// ============================================================================

// ============================================================================
// المحرك المشترك لمنهج السنة السابعة (curriculum-y7) + منطق الفيديوهات للصفوف (1..7)
// - الصف 1: فيديوهات فقط
// - الصفوف 2..5: إلغاء الفيديوهات تماماً
// - الصفان 6 و7: زر الفيديو ومشغل الفيديو مشروطان بوجود الفيديو (إن وجد يضاء الزر والفيديو، وإن لم يوجد يبدو الزر مطفأ)
// ============================================================================
window.curriculumData = window.curriculumData || {};
window.curriculumData[7] = window.curriculumData[7] || {};
window.Y7_ALL_WEEKS_MAP = window.Y7_ALL_WEEKS_MAP || {};

window.toWesternDigits = window.toWesternDigits || function(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
};

window.buildAndRegisterY7Section = function(sectionWeeksArray) {
    if (!Array.isArray(sectionWeeksArray)) return;
    sectionWeeksArray.forEach(item => {
        window.Y7_ALL_WEEKS_MAP[item.w] = item;
    });

    sectionWeeksArray.forEach((item, localIdx) => {
        const w = item.w;
        const ltr = item.ltr;
        const next1 = sectionWeeksArray[(localIdx + 1) % sectionWeeksArray.length] || item;
        const next2 = sectionWeeksArray[(localIdx + 2) % sectionWeeksArray.length] || item;
        const next3 = sectionWeeksArray[(localIdx + 3) % sectionWeeksArray.length] || item;
        const prev1 = window.Y7_ALL_WEEKS_MAP[w > 1 ? w - 1 : 28] || next1;

        const vidPath   = `assets/y7/videos/v${w}.mp4`;
        const artPath   = `assets/y4/art/art${w}.jpg`;
        const sportPath = `assets/y6/sports/sprt${w}.jpg`;
        const sciPath   = `assets/y7/scince/s${w}.1.jpg`;
        const rightPath = `assets/y7/rights/r${w}.jpg`;

        // بناء شرائح القصة الكاملة والميزان الصوتي (الكلمات الـ 16 أو الـ 40) للمادة 1 (اللسان والبيان)
        const lisanSlides = [
            {
                cardData: {
                    mode: 'eye-card',
                    bgImg: artPath,
                    tag: `🌌 ${item.heavenName}`,
                    glyph: `${ltr} = ${item.jummal}`,
                    word: `${item.prophet} — ${item.virtue}`,
                    feature: item.natureLabel,
                    noHighlight: false
                },
                text: `${item.unitHeader} — ${item.naturesText}`
            }
        ];

        (item.storyParagraphs || []).forEach((para, pIdx) => {
            lisanSlides.push({
                img: artPath,
                text: `📖 الفَصْلُ (${pIdx + 1}) مِنْ قِصَّةِ ${item.prophet}: ${para}`
            });
        });

        // تقسيم الكلمات المرجعية (16 أو 40 كلمة) إلى شرائح واضحة للميزان الصوتي والمكاني
        const wordsArr = item.words || [];
        const chunkSize = 4;
        for (let i = 0; i < wordsArr.length; i += chunkSize) {
            const slice = wordsArr.slice(i, i + chunkSize);
            const wordsHeadline = slice.map(x => x.word).join(' • ');
            const wordsDetails = slice.map((x, k) => `${i + k + 1}. ${x.raw}`).join(' | ');
            lisanSlides.push({
                cardData: {
                    mode: 'ear-card',
                    bgImg: artPath,
                    tag: `🗣️ المِيزَانُ الصَّوْتِيُّ (${i + 1}..${Math.min(i + chunkSize, wordsArr.length)})`,
                    glyph: ltr,
                    word: wordsHeadline,
                    feature: slice[0] ? slice[0].desc : '',
                    noHighlight: false
                },
                text: `الكَلِمَاتُ المَرْجِعِيَّةُ لِحَرْفِ (${ltr}): ${wordsDetails}`
            });
        }

        const firstWordObj = wordsArr[0] || { word: item.grammar.focusWord, desc: 'سَاكِنٌ', raw: item.grammar.focusWord };
        const midWordObj   = wordsArr[Math.min(2, wordsArr.length - 1)] || firstWordObj;
        const maddWordObj  = wordsArr[wordsArr.length - 1] || firstWordObj;
        const shaddaWordObj = wordsArr[Math.min(10, wordsArr.length - 1)] || firstWordObj;

        // بناء شرائح المادة 7 (قصص حور وسرور الكاملة لرسالة الحقوق + آداب الطهارة والستر)
        const rightsSlidesBuilt = (item.rightsSlides || []).map(rs => ({
            img: rightPath,
            text: `${rs.title}: ${rs.text}`
        }));

        window.curriculumData[7][w] = {
            // 1. اللسان والبيان اللغوي (القصة الكاملة + الطبائع الأربع + الميزان الصوتي للكلمات الـ 16/40)
            1: {
                learn: {
                    introTitle: `قِصَّةُ ${item.prophet} — (${item.virtue})`,
                    introGoal: `${item.limbs['1'] ? item.limbs['1'].body : item.storyThird}`,
                    coverImg: artPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: lisanSlides
                },
                play: {
                    questions: [
                        {
                            img: artPath,
                            q: `مَا هِيَ الفَضِيلَةُ الرَّئِيسِيَّةُ وَالمَنْزِلَةُ الفَلَكِيَّةُ فِي وَحْدَةِ ${item.prophet} مَعَ حَرْفِ (${ltr})؟`,
                            focusWord: item.prophet,
                            options: [
                                { text: `${item.virtue} — ${item.natureLabel}`, correct: true },
                                { text: `${next1.virtue} — إِهْمَالُ الأَمَانَةِ`, correct: false },
                                { text: `${next2.virtue} — الِاسْتِعْجَالُ وَالغَضَبُ`, correct: false },
                                { text: `${next3.virtue} — تَرْكُ التَّفَكُّرِ`, correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `مَا هُوَ التَّوْصِيفُ الصَّوْتِيُّ وَالمَكَانِيُّ لِحَرْفِ (${ltr}) فِي كَلِمَةِ «${firstWordObj.word}»؟`,
                            focusWord: firstWordObj.word,
                            options: [
                                { text: firstWordObj.desc, correct: true },
                                { text: 'مَمْدُودٌ بِاليَاءِ فِي آخِرِ الكَلِمَةِ دَائِمًا', correct: false },
                                { text: 'حَرْفٌ أَجْنَبِيٌّ لَا مَخْرَجَ لَهُ', correct: false },
                                { text: 'مُضَعَّفٌ بِالضَّمِّ فِي أَوَّلِ الكَلِمَةِ', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `أَيُّ كَلِمَةٍ مِنْ كَلِمَاتِ القِصَّةِ تُمَثِّلُ المَدَّ الصَّوْتِيَّ فِي مِيزَانِ حَرْفِ (${ltr})؟`,
                            focusWord: maddWordObj.word,
                            options: [
                                { text: `${maddWordObj.word} (${maddWordObj.desc})`, correct: true },
                                { text: firstWordObj.word, correct: false },
                                { text: 'فِي / مِنْ / عَلَى', correct: false },
                                { text: 'لَمْ / لَنْ', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `مَا هِيَ الخُلَاصَةُ الحِكْمِيَّةُ الجَامِعَةُ لِقِصَّةِ ${item.prophet}؟`,
                            focusWord: item.virtue,
                            options: [
                                { text: item.storyThird, correct: true },
                                { text: 'اتِّبَاعُ رِيحِ الوَهْمِ وَنَارِ الغَضَبِ وَالحَسَدْ', correct: false },
                                { text: 'تَرْكُ العَمَلِ وَالبَحْثِ العِلْمِيّْ', correct: false },
                                { text: 'الغُرُورُ بِالقُوَّةِ وَنِسْيَانُ شُكْرِ اللهْ', correct: false }
                            ]
                        }
                    ],
                    sadaqahPairs: [
                        { right: item.prophet, left: item.virtue },
                        { right: firstWordObj.word, left: firstWordObj.desc },
                        { right: maddWordObj.word, left: maddWordObj.desc },
                        { right: shaddaWordObj.word, left: shaddaWordObj.desc }
                    ],
                    sadaqahDecoy: 'كَلِمَةٌ بِلَا مِيزَانٍ صَوْتِيٍّ',
                    giftBasket: {
                        prompt: `اجْمَعْ فِي السَّلَّةِ كَلِمَاتِ المِيزَانِ الصَّوْتِيِّ وَالحِكْمَةِ مِنْ قِصَّةِ ${item.prophet}:`,
                        targetCount: 3,
                        items: [
                            { emoji: '🌟', label: item.virtue, good: true },
                            { emoji: '📖', label: firstWordObj.word, good: true },
                            { emoji: '✨', label: maddWordObj.word, good: true },
                            { emoji: '🚫', label: 'الغَضَبُ وَالحَسَدُ', good: false },
                            { emoji: '⚠️', label: 'الوَهْمُ وَالكَسَلُ', good: false }
                        ]
                    }
                },
                apply: {
                    img: artPath,
                    steps: [
                        `أَقْرَأُ فُصُولَ قِصَّةِ ${item.prophet} وَأَسْتَخْرِجُ الطَّبَائِعَ الأَرْبَعَ (النَّارَ، الرِّيحَ، التُّرَابَ، المَاءَ).`,
                        `أَنْطِقُ كَلِمَاتِ المِيزَانِ الصَّوْتِيِّ لِحَرْفِ (${ltr}) بِأَصْوَاتِهِ العَشَرَةِ: (${firstWordObj.word} • ${midWordObj.word} • ${shaddaWordObj.word} • ${maddWordObj.word}).`
                    ]
                }
            },

            // 2. العين والتفكر الهندسي والنحو وبناء الجملة
            2: {
                learn: {
                    introTitle: `${item.grammar.topic} — التَّفَكُّرُ الهَنْدَسِيُّ لِحَرْفِ (${ltr})`,
                    introGoal: item.limbs['2'] ? item.limbs['2'].body : item.grammar.rule,
                    coverImg: artPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: [
                        {
                            cardData: {
                                mode: 'eye-card',
                                bgImg: artPath,
                                tag: '📐 التَّفَكُّرُ الهَنْدَسِيُّ البَصَرِيُّ',
                                glyph: ltr,
                                word: item.limbs['2'] ? item.limbs['2'].heading.replace(/^2\.\s*/, '') : `هَنْدَسَةُ حَرْفِ (${ltr})`,
                                feature: `${item.heavenName}`,
                                noHighlight: false
                            },
                            text: item.limbs['2'] ? item.limbs['2'].body : item.grammar.rule
                        },
                        {
                            cardData: {
                                mode: 'eye-card',
                                bgImg: artPath,
                                tag: '👁️ قَاعِدَةُ النَّحْوِ وَالجُمْلَةِ',
                                glyph: ltr,
                                word: item.grammar.focusWord,
                                feature: item.grammar.topic,
                                noHighlight: false
                            },
                            text: `${item.grammar.rule} — مِثَالٌ تَطْبِيقِيٌّ: (${item.grammar.example})`
                        },
                        {
                            cardData: {
                                mode: 'eye-card',
                                bgImg: artPath,
                                tag: '✍️ الشَّاهِدُ النَّحْوِيُّ مِنَ الوَحْدَةِ',
                                glyph: ltr,
                                word: item.earIirab.sentence,
                                feature: item.earIirab.caseAns,
                                noHighlight: false
                            },
                            text: `تَأَمَّلْ تَرْكِيبَ الجُمْلَةِ التَّامَّةِ: «${item.earIirab.sentence}» — الكَلِمَةُ المِحْوَرِيَّةُ هِيَ (${item.earIirab.targetWord}).`
                        }
                    ]
                },
                play: {
                    questions: [
                        {
                            img: artPath,
                            q: item.grammar.q,
                            focusWord: item.grammar.focusWord,
                            options: [
                                { text: item.grammar.opts[0], correct: true },
                                { text: item.grammar.opts[1], correct: false },
                                { text: item.grammar.opts[2], correct: false },
                                { text: item.grammar.opts[3], correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `مَا هُوَ مَوْضُوعُ القَاعِدَةِ النَّحْوِيَّةِ فِي هٰذَا الأُسْبُوعِ؟`,
                            focusWord: item.grammar.focusWord,
                            options: [
                                { text: item.grammar.topic, correct: true },
                                { text: next1.grammar.topic, correct: false },
                                { text: next2.grammar.topic, correct: false },
                                { text: next3.grammar.topic, correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `كَيْفَ نَتَفَكَّرُ بَصَرِيًّا وَهَنْدَسِيًّا فِي رَسْمِ حَرْفِ (${ltr})؟`,
                            focusWord: `حَرْفُ (${ltr})`,
                            options: [
                                { text: item.limbs['2'] ? item.limbs['2'].body.split('،')[0] : item.grammar.rule, correct: true },
                                { text: 'رَسْمٌ عَشْوَائِيٌّ بِلَا نِسْبَةٍ وَلَا مِيزَانْ', correct: false },
                                { text: 'حَرْفٌ لَا يُكْتَبُ فِي الكَلِمَاتِ العَرَبِيَّةْ', correct: false },
                                { text: 'شَكْلٌ خَالٍ مِنَ الدَّلَالَةِ البَصَرِيَّةْ', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `أَيُّ جُمْلَةٍ هِيَ جُمْلَةٌ تَامَّةٌ صَحِيحَةُ التَّرْكِيبِ وَالضَّبْطِ؟`,
                            focusWord: item.earIirab.targetWord,
                            options: [
                                { text: item.earIirab.sentence, correct: true },
                                { text: 'فِي عَلَى مِنْ إِلَى', correct: false },
                                { text: 'يَكْتُبُ قَرَأَ اِذْهَبْ', correct: false },
                                { text: 'عَنْ ثُمَّ أَوْ', correct: false }
                            ]
                        }
                    ],
                    sadaqahPairs: [
                        { right: item.grammar.focusWord, left: item.grammar.opts[0] },
                        { right: `هَنْدَسَةُ حَرْفِ (${ltr})`, left: item.prophet },
                        { right: 'المُبْتَدَأُ وَالخَبَرُ', left: 'الجُمْلَةُ الاِسْمِيَّةُ' },
                        { right: 'الفِعْلُ وَالفَاعِلُ', left: 'الجُمْلَةُ الفِعْلِيَّةُ' }
                    ],
                    sadaqahDecoy: 'كَلِمَةٌ بِلَا مَعْنًى'
                },
                apply: {
                    img: artPath,
                    steps: [
                        `أَتَأَمَّلُ الهَنْدَسَةَ البَصَرِيَّةَ لِحَرْفِ (${ltr}): (${item.limbs['2'] ? item.limbs['2'].body : ''})`,
                        `أَكْتُبُ القَاعِدَةَ النَّحْوِيَّةَ وَالمِثَالَ بِخَطِّ النَّسْخِ المُتْقَنِ: (${item.grammar.example} — ${item.earIirab.sentence})`
                    ]
                }
            },

            // 3. الأذن والسمع والوعي القصصي والإعراب السمعي والتجويد
            3: {
                learn: {
                    introTitle: `${item.earIirab.topic} — السَّمْعُ وَالتَّجْوِيدُ`,
                    introGoal: item.limbs['3'] ? item.limbs['3'].body : item.earIirab.rule,
                    coverImg: artPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: [
                        {
                            cardData: {
                                mode: 'ear-card',
                                bgImg: artPath,
                                tag: '👂 الوَعْيُ السَّمْعِيُّ وَالوَقْفُ السَّاكِنُ',
                                glyph: ltr,
                                word: `${firstWordObj.word} • ${shaddaWordObj.word}`,
                                feature: 'ضَبْطُ المَخْرَجِ وَإِيقَاعِ الوَقْفِ السَّاكِنْ',
                                noHighlight: false
                            },
                            text: item.limbs['3'] ? item.limbs['3'].body : item.earIirab.rule
                        },
                        {
                            cardData: {
                                mode: 'ear-card',
                                bgImg: artPath,
                                tag: '🎵 الإِعْرَابُ السَّمْعِيُّ التَّطْبِيقِيُّ',
                                glyph: item.earIirab.targetWord,
                                word: item.earIirab.sentence,
                                feature: item.earIirab.caseAns,
                                noHighlight: false
                            },
                            text: `${item.earIirab.rule} — اسْتَمِعْ إِلَى حَرَكَةِ (${item.earIirab.targetWord}) فِي جُمْلَةِ: «${item.earIirab.sentence}».`
                        }
                    ]
                },
                play: {
                    questions: [
                        {
                            img: artPath,
                            q: `مَا هِيَ حَالَةُ إِعْرَابِ كَلِمَةِ «${item.earIirab.targetWord}» فِي جُمْلَةِ «${item.earIirab.sentence}»؟`,
                            focusWord: item.earIirab.targetWord,
                            options: [
                                { text: item.earIirab.caseAns, correct: true },
                                { text: 'حَرْفٌ لَا مَحَلَّ لَهُ مِنَ الإِعْرَابْ', correct: false },
                                { text: 'فِعْلُ أَمْرٍ مَبْنِيٌّ عَلَى السُّكُونْ', correct: false },
                                { text: 'أَدَاةُ اسْتِفْهَامٍ', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `كَيْفَ نُدَرِّبُ الأُذُنَ عِنْدَ نِهَايَةِ الجُمَلِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ فِي قِصَّةِ ${item.prophet}؟`,
                            focusWord: 'الوَقْفُ السَّاكِنُ',
                            options: [
                                { text: 'عَلَى إِيقَاعِ الوَقْفِ السَّاكِنِ الصَّافِي وَالإِنْصَاتِ الوَاعِي', correct: true },
                                { text: 'عَلَى الصُّرَاخِ وَوَصْلِ الكَلَامِ بِلَا تَنَفُّسْ', correct: false },
                                { text: 'عَلَى تَحْرِيكِ السَّاكِنِ عِنْدَ الوَقْفْ', correct: false },
                                { text: 'عَلَى تَرْكِ الاسْتِمَاعِ لِلقِصَّةْ', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `مَا هُوَ الفَرْقُ الصَّوْتِيُّ بَيْنَ الحَرْفِ السَّاكِنِ فِي «${firstWordObj.word}» وَالمُضَعَّفِ فِي «${shaddaWordObj.word}»؟`,
                            focusWord: shaddaWordObj.word,
                            options: [
                                { text: 'السَّاكِنُ انْحِبَاسٌ بِلَا حَرَكَةٍ، وَالمُضَعَّفُ ضَغْطٌ مُضَاعَفٌ (سَاكِنٌ + مُتَحَرِّكٌ)', correct: true },
                                { text: 'لَا فَرْقَ بَيْنَهُمَا فِي النُّطْقِ أَبَدًا', correct: false },
                                { text: 'كِلَاهُمَا مَدٌّ طَوِيلٌ بِالأَلِفِ', correct: false },
                                { text: 'المُضَعَّفُ لَا يُنْطَقُ فِي الكَلِمَةِ', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `مَا هِيَ عَلَامَاتُ الإِعْرَابِ الأَصْلِيَّةُ الثَّلَاثُ فِي الأَسْمَاءِ المُعْرَبَةِ؟`,
                            focusWord: 'الإِعْرَابُ السَّمْعِيُّ',
                            options: [
                                { text: 'الضَّمَّةُ لِلرَّفْعِ (ـُ)، وَالفَتْحَةُ لِلنَّصْبِ (ـَ)، وَالكَسْرَةُ لِلجَرِّ (ـِ)', correct: true },
                                { text: 'السُّكُونُ فِي جَمِيعِ الحَالَاتِ', correct: false },
                                { text: 'الكسْرَةُ لِلرَّفْعِ وَالضَّمَّةُ لِلجَرِّ', correct: false },
                                { text: 'لَا تُوجَدُ عَلَامَاتٌ إِعْرَابِيَّةٌ', correct: false }
                            ]
                        }
                    ],
                    sadaqahPairs: [
                        { right: item.earIirab.targetWord, left: item.earIirab.caseAns },
                        { right: firstWordObj.word, left: firstWordObj.desc },
                        { right: shaddaWordObj.word, left: shaddaWordObj.desc },
                        { right: 'المُبْتَدَأُ وَالفَاعِلُ', left: 'مَرْفُوعٌ بِالضَّمَّةِ (ـُ)' }
                    ],
                    sadaqahDecoy: 'سَاكِنٌ دَائِمًا'
                },
                apply: {
                    img: artPath,
                    steps: [
                        `أَسْتَمِعُ بإنْصَاتٍ لِقِصَّةِ ${item.prophet} مَعَ تَطْبِيقِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ.`,
                        `أَنْطِقُ الجُمْلَةَ نُطْقًا مُعْرَبًا سَلِيمًا: (${item.earIirab.sentence}) وَأُمَيِّزُ حَرَكَةَ (${item.earIirab.targetWord}).`
                    ]
                }
            },

            // 4. اليد والحساب وحساب الجُمَّل والمهارة العملية
            4: {
                learn: {
                    introTitle: `العَدَدُ (${item.math.numVal}) وَحِسَابُ الجُمَّلِ (${ltr} = ${item.jummal})`,
                    introGoal: item.limbs['4'] ? item.limbs['4'].body : `نَتَعَلَّمُ تَرْكِيبَ العَدَدِ (${item.math.eqDisplay}) وَقِيمَةَ حَرْفِ (${ltr} = ${item.jummal})!`,
                    coverImg: artPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: [
                        {
                            cardData: {
                                mode: 'hand-card',
                                bgImg: artPath,
                                tag: '✋ حِسَابُ الجُمَّلِ وَالمَهَارَةُ العَمَلِيَّةُ',
                                glyph: `${ltr} = ${item.jummal}`,
                                word: `التَّرْتِيبُ (${w}) • الجُمَّلُ (${item.jummal})`,
                                visualTokens: `حَرْفُ (${ltr}) = ${item.jummal}`,
                                feature: item.prophet,
                                noHighlight: true
                            },
                            text: item.limbs['4'] ? item.limbs['4'].body : `قِيمَةُ حَرْفِ (${ltr}) فِي حِسَابِ الجُمَّلِ هِيَ (${item.jummal}).`
                        },
                        {
                            cardData: {
                                mode: 'hand-card',
                                bgImg: artPath,
                                tag: '🔢 تَرْكِيبُ الأَعْدَادِ وَالجَمْعُ',
                                glyph: `${item.math.numVal}`,
                                word: item.math.eqDisplay,
                                visualTokens: `${item.math.numName} (${item.math.numVal})`,
                                feature: item.math.numName,
                                noHighlight: true
                            },
                            text: `العَدَدُ (${item.math.numVal}) يُقْرَأُ بِالعَرَبِيَّةِ: (${item.math.numName})، وَيَتَرَكَّبُ مِنْ: ${item.math.eqDisplay}.`
                        },
                        {
                            cardData: {
                                mode: 'hand-card',
                                bgImg: artPath,
                                tag: '⚖️ الطَّرْحُ وَالمُقَارَنَةُ الرِّيَاضِيَّةُ',
                                glyph: item.math.compDisplay,
                                word: item.math.subDisplay,
                                visualTokens: `المُقَارَنَةُ: ${item.math.compDisplay}`,
                                feature: 'أَكْبَرُ (>) أَوْ أَصْغَرُ (<) أَوْ يُسَاوِي (=)',
                                noHighlight: true
                            },
                            text: `فِي الطَّرْحِ العَكْسِيِّ: (${item.math.subDisplay})، وَفِي المُقَارَنَةِ بَيْنَ الأَعْدَادِ: (${item.math.compDisplay}).`
                        }
                    ]
                },
                play: {
                    questions: [
                        {
                            img: artPath,
                            q: `مَا هِيَ قِيمَةُ حَرْفِ (${ltr}) فِي حِسَابِ الجُمَّلِ المُرْتَبِطِ بِوَحْدَةِ ${item.prophet}؟`,
                            focusWord: `حَرْفُ (${ltr})`,
                            options: [
                                { text: `${item.jummal}`, correct: true },
                                { text: `${next1.jummal}`, correct: false },
                                { text: `${next2.jummal}`, correct: false },
                                { text: '0', correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: item.math.q1.stem,
                            focusWord: item.math.q1.focus,
                            options: [
                                { text: item.math.q1.ans, correct: true },
                                { text: item.math.q1.wrong[0], correct: false },
                                { text: item.math.q1.wrong[1], correct: false },
                                { text: item.math.q1.wrong[2], correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: item.math.q2.stem,
                            focusWord: item.math.q2.focus,
                            options: [
                                { text: item.math.q2.ans, correct: true },
                                { text: item.math.q2.wrong[0], correct: false },
                                { text: item.math.q2.wrong[1], correct: false },
                                { text: item.math.q2.wrong[2], correct: false }
                            ]
                        },
                        {
                            img: artPath,
                            q: `أَيُّ مُقَارَنَةٍ وَمُعَادَلَةٍ رِيَاضِيَّةٍ هِيَ الصَّحِيحَةُ فِي هٰذَا الدَّرْسِ؟`,
                            focusWord: item.math.compDisplay,
                            options: [
                                { text: `${item.math.eqDisplay} | ${item.math.compDisplay}`, correct: true },
                                { text: '0 > 100', correct: false },
                                { text: '1 + 1 = 50', correct: false },
                                { text: '10 - 10 = 90', correct: false }
                            ]
                        }
                    ],
                    sadaqahPairs: [
                        { right: `حَرْفُ (${ltr}) فِي الجُمَّلِ`, left: `${item.jummal}` },
                        { right: `${item.math.numVal}`, left: item.math.numName },
                        { right: item.math.eqDisplay.split('=')[0].trim(), left: `${item.math.numVal}` }
                    ],
                    sadaqahDecoy: '0'
                },
                apply: {
                    img: artPath,
                    steps: [
                        `أَكْتُبُ الرَّقْمَ (${w}) وَقِيمَةَ حَرْفِ (${ltr} = ${item.jummal}) وَالعَدَدَ (${item.math.numVal} — ${item.math.numName}) بِالأَرْقَامِ (0-9).`,
                        `أُطَبِّقُ المَهَارَةَ العَمَلِيَّةَ لِليَدِ: (${item.limbs['4'] ? item.limbs['4'].body : item.math.eqDisplay})`
                    ]
                }
            },

            // 5. الرجلان والرياضة الحيوية والحركة البدنية النبوية (مرتبطة بالـ 28 شريحة مصورة sprt1..sprt28 بالترتيب)
            5: {
                learn: {
                    introTitle: item.sportExact ? `${item.sportExact.title}` : `${item.sport.title} — الرِّيَاضَةُ وَالحَرَكَةُ النَّبَوِيَّةُ`,
                    introGoal: item.sportExact ? `${item.sportExact.subtitle} — ${item.limbs['5'] ? item.limbs['5'].body : ''}` : (item.limbs['5'] ? item.limbs['5'].body : `نُؤَدِّي التَّمْرِينَ بِتَوَازُنٍ وَتَنَفُّسٍ مُنْتَظَمٍ لِتَنْشِيطِ الجِسْمِ وَالدِّمَاغْ!`),
                    coverImg: item.sportExact ? item.sportExact.img : sportPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: item.sportExact ? [
                        {
                            img: item.sportExact.img,
                            text: item.sportExact.slideText
                        },
                        {
                            img: item.sportExact.img,
                            text: `🦶 مَنْهَجُ الرِّجْلَيْنِ وَالسَّعْيِ فِي سِيرَةِ ${item.prophet}: ${item.limbs['5'] ? item.limbs['5'].body : item.sport.middleText}`
                        }
                    ] : [
                        {
                            img: sportPath,
                            text: `🦶 مَنْهَجُ الرِّجْلَيْنِ فِي سِيرَةِ ${item.prophet}: ${item.limbs['5'] ? item.limbs['5'].body : item.sport.middleText}`
                        },
                        {
                            img: sportPath,
                            text: `🏃 تَمْرِينُ التَّوَازُنِ وَالتَّنَفُّسِ (${item.sport.title}): ${item.sport.middleText}`
                        }
                    ]
                },
                play: {
                    questions: item.sportExact ? [
                        { ...item.sportExact.q1, img: item.sportExact.img },
                        { ...item.sportExact.q2, img: item.sportExact.img },
                        { ...item.sportExact.q3, img: item.sportExact.img },
                        {
                            img: item.sportExact.img,
                            q: `مَا هِيَ رِيَاضَةُ الرِّجْلَيْنِ وَالحَرَكَةِ المُسْتَفَادَةُ مِنْ سِيرَةِ ${item.prophet}؟`,
                            focusWord: item.prophet,
                            options: [
                                { text: item.limbs['5'] ? item.limbs['5'].body.split('،')[0] : item.sport.title, correct: true },
                                { text: 'الخُمُولُ وَتَرْكُ الحَرَكَةِ النَّافِعَةْ', correct: false },
                                { text: 'الرَّكْضُ الفَوْضَوِيُّ المُؤْذِي لِلمَفَاصِلْ', correct: false },
                                { text: 'حَبْسُ النَّفَسِ وَالشَّدُّ العَصَبِيّْ', correct: false }
                            ]
                        }
                    ] : [],
                    sadaqahPairs: item.sportExact ? item.sportExact.sadaqahPairs : [
                        { right: item.sport.title, left: 'تَوَازُنٌ وَتَرْكِيزٌ' },
                        { right: `رِيَاضَةُ ${item.prophet}`, left: 'سَعْيٌ نَشِيطٌ وَصِحَّةٌ بَدَنِيَّةٌ' },
                        { right: 'الشَّهِيقُ وَالزَّفِيرُ', left: 'تَجْدِيدُ الأُكْسِجِينْ' }
                    ],
                    sadaqahDecoy: 'الكَسَلُ وَالخُمُولُ وَالفَوْضَى الحَرَكِيَّةُ',
                    giftBasket: item.sportExact ? {
                        prompt: item.sportExact.giftBasket.prompt,
                        targetCount: (item.sportExact.giftBasket.correct || []).length,
                        items: [
                            ...(item.sportExact.giftBasket.correct || []).map(lbl => ({ emoji: '🏃', label: lbl, good: true })),
                            ...(item.sportExact.giftBasket.wrong || []).map(lbl => ({ emoji: '🚫', label: lbl, good: false }))
                        ]
                    } : undefined
                },
                apply: {
                    img: item.sportExact ? item.sportExact.img : sportPath,
                    steps: [
                        item.sportExact ? item.sportExact.applyStep : `أُطَبِّقُ تَمْرِينَ التَّوَازُنِ وَالتَّنَفُّسِ: (${item.sport.middleText})`,
                        `أَقْتَدِي بِنَشَاطِ وَسَعْيِ ${item.prophet}: (${item.limbs['5'] ? item.limbs['5'].body : item.sport.title}).`
                    ]
                }
            },

            // 6. البطن والعلوم الكسبية والمجموعة العلمية المحددة للقسم (مرتبطة بالـ 46 شريحة المصورة s1.1..s28.2 بالترتيب)
            6: {
                learn: {
                    introTitle: item.science ? `${item.science.groupTitle} — ${item.science.topic}` : `${item.sci.title} — (${item.sciGroupName.split(':')[0]})`,
                    introGoal: `${item.limbs['6'] ? item.limbs['6'].body : item.sci.summaryThird}`,
                    coverImg: (item.science && item.science.coverImg) ? item.science.coverImg : sciPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: (item.science && Array.isArray(item.science.slides))
                        ? [
                            ...item.science.slides,
                            {
                                img: item.science.coverImg || sciPath,
                                text: `🌾 العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ فِي وَحْدَةِ ${item.prophet}: ${item.limbs['6'] ? item.limbs['6'].body : item.sci.summaryThird}`
                            }
                        ]
                        : [
                            {
                                img: sciPath,
                                text: `🌾 العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ فِي وَحْدَةِ ${item.prophet}: ${item.limbs['6'] ? item.limbs['6'].body : item.sci.summaryThird}`
                            },
                            {
                                img: sciPath,
                                text: `🔬 ${item.sciGroupName} — (${item.sci.title}): ${item.sci.summaryThird}`
                            }
                        ]
                },
                play: {
                    questions: item.science ? [
                        { ...item.science.q1, img: item.science.coverImg || sciPath },
                        { ...item.science.q2, img: (item.science.slides[1] && item.science.slides[1].img) || item.science.coverImg || sciPath },
                        { ...item.science.q3, img: (item.science.slides[item.science.slides.length - 1] && item.science.slides[item.science.slides.length - 1].img) || sciPath },
                        {
                            img: item.science.coverImg || sciPath,
                            q: `مَا هِيَ العُلُومُ الكَسْبِيَّةُ وَالطَّبِيعِيَّةُ الَّتِي نَتَعَلَّمُهَا مِنْ وَحْدَةِ ${item.prophet}؟`,
                            focusWord: item.prophet,
                            options: [
                                { text: item.limbs['6'] ? item.limbs['6'].body.split('؛')[0] : item.sci.title, correct: true },
                                { text: 'الإِسْرَافُ وَإِتْلَافُ المَوَارِدِ الطَّبِيعِيَّةْ', correct: false },
                                { text: 'تَرْكُ الزِّرَاعَةِ وَالصِّنَاعَةِ وَالبَحْثْ', correct: false },
                                { text: 'تَنَاوُلُ الأَغْذِيَةِ الضَّارَّةْ', correct: false }
                            ]
                        }
                    ] : [],
                    sadaqahPairs: item.science ? item.science.sadaqahPairs : [
                        { right: item.sci.focusConcept, left: item.sci.factAns },
                        { right: prev1.sci.focusConcept, left: prev1.sci.factAns },
                        { right: `عُلُومُ وَحْدَةِ ${item.prophet}`, left: 'القُوتُ الحَلَالُ وَالعِمَارَةُ العِلْمِيَّةُ' }
                    ],
                    sadaqahDecoy: 'تَلْوِيثُ الطَّبِيعَةِ وَإِهْدَارُ الطَّاقَةِ',
                    giftBasket: item.science ? {
                        prompt: item.science.giftBasket.prompt,
                        targetCount: (item.science.giftBasket.correct || []).length,
                        items: [
                            ...(item.science.giftBasket.correct || []).map(lbl => ({ emoji: '🔬', label: lbl, good: true })),
                            ...(item.science.giftBasket.wrong || []).map(lbl => ({ emoji: '🚫', label: lbl, good: false }))
                        ]
                    } : {
                        prompt: `اجْمَعْ فِي السَّلَّةِ المَفَاهِيمَ العِلْمِيَّةَ الصَّحِيحَةَ لِدَرْسِ (${item.sci.title}):`,
                        targetCount: 3,
                        items: [
                            { emoji: '🔬', label: item.sci.focusConcept, good: true },
                            { emoji: '🧪', label: item.sci.factAns, good: true },
                            { emoji: '🌱', label: 'العُلُومُ الكَسْبِيَّةُ النَّافِعَةُ', good: true },
                            { emoji: '🚫', label: 'التَّلَوُّثُ', good: false },
                            { emoji: '⚠️', label: 'الإِسْرَافُ', good: false }
                        ]
                    }
                },
                apply: {
                    img: (item.science && item.science.coverImg) ? item.science.coverImg : sciPath,
                    steps: [
                        item.science ? item.science.applyStep : `أَسْتَنْتِجُ مِنْ دَرْسِ العلوم (${item.sci.title}): أَنَّ (${item.sci.focusConcept}) يَعْمَلُ عَلَى (${item.sci.factAns}).`,
                        `أَفْهَمُ العُلُومَ الكَسْبِيَّةَ فِي قِصَّةِ ${item.prophet}: (${item.limbs['6'] ? item.limbs['6'].body : item.sci.summaryThird})`
                    ]
                }
            },

            // 7. الفرج والآداب — قصص حور وسرور الكاملة لرسالة الحقوق وآداب الطهارة والستر
            7: {
                learn: {
                    introTitle: `رِسَالَةُ الحُقُوقِ (حُور وَسُرُور): ${item.rightsFullTitle}`,
                    introGoal: item.limbs['7'] ? item.limbs['7'].body : item.rightsSummary.storySentence,
                    coverImg: rightPath,
                    video: vidPath,
                    useVideo: false,
                    hasVideo: false,
                    preferSlidesOnly: true,
                    slides: rightsSlidesBuilt
                },
                play: {
                    questions: [
                        {
                            img: rightPath,
                            q: `مَا هُوَ السُّلُوكُ العَمَلِيُّ الَّذِي نُطَبِّقُهُ فِي «${item.rightsFullTitle}»؟`,
                            focusWord: item.rightsFullTitle,
                            options: [
                                { text: item.rightsSummary.applyAction, correct: true },
                                { text: 'إِيذَاءُ الآخَرِينَ بِالقَوْلِ أَوِ الفِعْلْ', correct: false },
                                { text: 'الغَضَبُ وَعَدَمُ الاحْتِرَامْ', correct: false },
                                { text: 'تَرْكُ الوَاجِبَاتِ اليَوْمِيَّةْ', correct: false }
                            ]
                        },
                        {
                            img: rightPath,
                            q: `مَاذَا تَعَلَّمَتْ حُورُ وَسُرُورٌ (وَنُورٌ) فِي قِصَّةِ اليَوْمِ مِنْ رِسَالَةِ الحُقُوقِ؟`,
                            focusWord: 'حُورُ وَسُرُورٌ',
                            options: [
                                { text: item.rightsSummary.storySentence, correct: true },
                                { text: 'أَنَّ الإِهْمَالَ يَجْلِبُ السَّعَادَةْ', correct: false },
                                { text: 'أَنَّ الغِشَّ مَقْبُولٌ فِي الدِّرَاسَةِ وَاللَّعِبْ', correct: false },
                                { text: 'أَنَّ الفَوْضَى أَفْضَلُ مِنَ النِّظَامْ', correct: false }
                            ]
                        },
                        {
                            img: rightPath,
                            q: `مَا هِيَ آدَابُ الطَّهَارَةِ وَالسَّتْرِ وَالعِفَّةِ المُسْتَفَادَةُ مِنْ سِيرَةِ ${item.prophet}؟`,
                            focusWord: item.prophet,
                            options: [
                                { text: item.limbs['7'] ? item.limbs['7'].body.split('،')[0] : item.rightsSummary.applyAction, correct: true },
                                { text: 'إِهْمَالُ النَّظَافَةِ وَالطَّهَارَةِ', correct: false },
                                { text: 'التَّكَبُّرُ عَلَى النَّاسِ', correct: false },
                                { text: 'تَرْكُ الِاسْتِئْذَانِ وَالحَيَاءْ', correct: false }
                            ]
                        }
                    ],
                    sadaqahPairs: [
                        { right: item.rightsFullTitle, left: item.rightsSummary.applyAction },
                        { right: prev1.rightsFullTitle || prev1.rightsSummary.title, left: prev1.rightsSummary.applyAction },
                        { right: item.prophet, left: item.virtue }
                    ],
                    sadaqahDecoy: 'سُوءُ الخُلُقِ وَالإِيذَاءُ'
                },
                apply: {
                    img: rightPath,
                    steps: [
                        `أَقْرَأُ قِصَّةَ حُورَ وَسُرُورَ فِي «${item.rightsFullTitle}» وَأَسْتَحْضِرُ وَصِيَّةَ رِسَالَةِ الحُقُوقِ.`,
                        `أُطَبِّقُ بِنَفْسِي اليَوْمَ: (${item.rightsSummary.applyAction}) مَعَ مُرَاعَاةِ آدَابِ الطَّهَارَةِ وَالسَّتْرِ.`
                    ]
                }
            }
        };
    });

    if (typeof window.initStage1VideoAndY7Engine === 'function') {
        window.initStage1VideoAndY7Engine();
    }
};

// ============================================================================
// محرك تنسيق السنة السابعة (خط النسخ الواضح + الأرقام الغربية 0-9 + الحركات الحمراء)
// ملاحظة: زر التبديل للفيديو المشروط لعمري 6 و7 مدمج مباشرةً وبصورة موحدة في stage1.html
// ============================================================================
window.initStage1VideoAndY7Engine = function() {
    if (typeof document === 'undefined') return;
    if (typeof RAW_YEAR !== 'undefined' && Number(RAW_YEAR) !== 7) return;

    document.body.classList.add('y7-mode-active');

    if (!document.getElementById('y7-typography-styles')) {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@600;700&family=Amiri:wght@700&display=swap';
            document.head.appendChild(fontLink);
        }
        const st = document.createElement('style');
        st.id = 'y7-typography-styles';
        st.innerHTML = `
            body.y7-mode-active,
            body.y7-mode-active * {
                font-family: 'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', 'Simplified Arabic', 'Geeza Pro', serif !important;
            }
            body.y7-mode-active .haraka-red,
            body.y7-mode-active .madd-red,
            body.y7-mode-active .hl-char {
                color: #e11d48 !important;
                font-weight: 700 !important;
            }
            body.y7-mode-active .fc-word-main {
                font-size: clamp(1.9rem, 5.4vmin, 3.3rem) !important;
                line-height: 1.4 !important;
                padding: 0 12px;
                unicode-bidi: plaintext;
            }
            body.y7-mode-active .fc-glyph {
                unicode-bidi: isolate;
                direction: ltr;
            }
            body.y7-mode-active .slider-text-content {
                font-size: clamp(1.15rem, 2.9vmin, 1.75rem) !important;
                line-height: 1.75 !important;
            }
            body.y7-mode-active .quiz-opt-btn .opt-main-text {
                font-size: clamp(1.08rem, 2.7vmin, 1.65rem) !important;
                line-height: 1.4 !important;
            }
        `;
        document.head.appendChild(st);
    }
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', window.initStage1VideoAndY7Engine);
} else {
    setTimeout(window.initStage1VideoAndY7Engine, 0);
}


(function registerCompleteYear7All7Parts() {
    const Y7_ALL_28_WEEKS = [
  {
    "w": 1,
    "secNum": 1,
    "heavenName": "سَمَاءُ السَّبْتِ العُلْيَا (أ ب ج د)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الأُولَى: عُلُومُ جِسْمِ الإِنْسَانِ وَالأَحْيَاءِ الخَلَوِيَّةِ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "أ",
    "jummal": 1,
    "prophet": "آدَمُ (ع)",
    "virtue": "الأَمَانَةُ",
    "unitHeader": "الوَحْدَةُ المَرْجِعِيَّةُ الأُولَى: نَبِيُّ اللهِ آدَمُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "عَلَّمَ اللهُ آدَمَ (ع) أَسْمَاءَ كُلِّ شَيْءٍ وَأَسْكَنَهُ الجَنَّةَ، ثُمَّ هَبَطَ إِلَى الأَرْضِ لِيَعْمُرَهَا بِالعِلْمِ وَالأَمَانَةِ وَالاسْتِغْفَارْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): اسْتِكْبَارُ إِبْلِيسَ وَحَسَدُهُ لِآدَمَ، وَنَارُ الحَسَدِ فِي صَدْرِ قَابِيلَ حِينَ اعْتَدَى عَلَى أَخِيهِ هَابِيلَ.",
    "storyParagraphs": [
      "فِي مَبْدَأِ الحِكَايَةِ وَفِي يَوْمِ السَّبْتِ الجَمِيلْ، بَدَأَ اللهُ الوَاحِدُ خَلْقَ هٰذَا الكَوْنِ الكَبِيرِ مِنْ نُقْطَةٍ وَاحِدَةٍ امْتَدَّ مِنْهَا الوُجُودْ، فَارْتَفَعَتْ فَوْقَنَا سَمَاءٌ عُلْيَا زَرْقَاءُ صَافِيَةْ، وَكَانَ النَّبِيُّ الرَّقْمُ وَاحِدٍ وَالأَوَّلُ هُوَ أَبَانَا نَبِيَّ اللهِ آدَمَ عَلَيْهِ السَّلَامْ. خَلَقَهُ اللهُ مِنْ أَدِيمِ الأَرْضْ، أَيْ مِنْ تُرَابِهَا وَطِينِهَا النَّاعِمِ الطَّاهِرْ، وَنَفَخَ فِيهِ الرُّوحَ وَأَعْطَاهُ عَقْلًا ذَكِيًّا يَتَفَكَّرُ بِهْ، لِيَعِيشَ أَبْنَاؤُهُ جِيلًا بَعْدَ جِيلٍ وَيُكْتَبَ لَهُمْ طُولُ البَقَاءْ، وَخَلَقَ زَوْجَتَهُ حَوَّاءَ لِتَكُونَ أَوَّلَ أُمٍّ حَنُونَةٍ لِكُلِّ النَّاسْ، و لَآدَمَ فُؤَادٌ يَمْلَؤُهُ إِيمَانٌ وَنُورٌ وَمَحَبَّةٌ لِلهْ.",
      "عَلَّمَ اللهُ آدَمَ الأَسْمَاءَ المُبَارَكَةَ كُلَّهَا الَّتِي لَمْ تَعْرِفْهَا المَلَائِكَةْ، فَأَرَاهُ أَنْوَارَ أَهْلِ البَيْتِ الأَطْهَارِ أُولِي الخَيْرِ وَالفَضْلِ الكَبِيرْ، حَتَّى عَرَفَ آدَمُ بِعَقْلِهِ وَنَطَقَ بِلِسَانِهِ اسْمَ كُلِّ نُورٍ مِنْهُمْ وَكُلِّ شَيْءٍ فِي الكَوْنْ. وَحَضَرَتْ مَلَائِكَةٌ كِرَامٌ لَهُمْ أَفْئِدَةٌ وَقُلُوبٌ صَافِيَةٌ كَالمَاءِ النَّقِيِّ فِي الطَّاعَةِ وَالتَّوَاضُعْ، فَلَمَّا أَخْبَرَهُمْ آدَمُ بِتِلْكَ الأَسْمَاءِ الشَّرِيفَةْ، أَمَرَهُمُ اللهُ فَسَجَدُوا لَهُ تَحِيَّةً وَاحْتِرَامًا عَلَى مَرْأًى مِنَ الجَمِيعِ وَأَمَامَ عُيُونِهِمْ، إِلَّا إِبْلِيسَ رَفَضَ أَنْ يَسْجُدْ، لِأَنَّهُ خُلِقَ مِنْ نَارٍ فَاشْتَعَلَ فِي قَلْبِهِ الغَضَبُ وَالحَسَدْ، فَهُوَ حَسُودٌ لَئِيمٌ دَفَعَتْهُ نَارُ الغُرُورِ وَطَلَبُ تَرَؤُّسٍ لِيَكُونَ هُوَ الرَّئِيسَ المُتَكَبِّرَ عَلَى غَيْرِهْ.",
      "عَاشَ آدَمُ وَحَوَّاءُ فِي الجَنَّةِ الخَضْرَاءِ فِي مَأْمَنٍ وَسَلَامٍ لَا يَخَافَانِ مِنْ جُوعٍ أَوْ تَعَبْ، فِيهَا قُصُورٌ يَلْمَعُ فِيهَا لُؤْلُؤٌ أَبْيَضُ جَمِيلْ، وَتَجْرِي فِيهَا أَنْهَارٌ مِنْ مَاءٍ عَذْبٍ لِكُلِّ نَهْرٍ مِنْهَا شَاطِئٌ أَخْضَرُ مُزْهِرْ. وَأَرْشَدَهُمَا اللهُ أَنْ يَأْكُلَا مِنْ كُلِّ الثِّمَارِ اللَّذِيذَةْ، وَمِنَ الأَفْضَلِ أَلَّا يَذُوقَا جُزْءًا صَغِيرًا مِنْ شَجَرَةٍ وَاحِدَةْ. لٰكِنَّ الشَّيْطَانَ جَاءَ كَالرِّيحِ الخَادِعَةِ يَنْفُخُ الوَهْمَ وَالكَذِبْ، وَحَلَفَ لَهُمَا كَاذِبًا وَأَوْهَمَهُمَا أَنَّ الشَّجَرَةَ تَزِيدُهُمَا قُرْبًا مِنَ اللهِ وَمَحَبَّةً لِأَوْلِيَائِهْ، فَشَجَّعَتْ حَوَّاءُ آدَمَ وَأَكَلَا مِنْهَا شَوْقًا إِلَى قُرْبِ اللهِ وَمَحَبَّتِهِ لَا عِصْيَانًا لَهْ، فَتَرَكَا النَّصِيحَةَ الأُولَى وَسَقَطَتْ عَنْهُمَا زِينَةُ الجَنَّةْ، فَبَادَرَا بِأَدَبٍ وَحَيَاءٍ يَسْتُرَانِ أَبْدَانَهُمَا بِأَوْرَاقِ الشَّجَرْ. وَلَمَّا عَرَفَا الحَقِيقَةَ حَزِنَا كَثِيرًا وَعِنْدَهَا لَجَآ مَعًا إِلَى اللهِ يَدْعُوَانِهِ بِتِلْكَ الأَسْمَاءِ النُّورَانِيَّةِ المُبَارَكَةْ، وَقَالَ آدَمُ فِي دُعَائِهْ، يَا رَبِّ أَنْتَ مَلْجَئِي الَّذِي أَحْتَمِي بِهْ، فَهُوَ عَبْدٌ سَأَّالٌ يُكْثِرُ الدُّعَاءَ وَالتَّوَسُّلَ إِلَى رَبِّهْ، فَسَامَحَهُ اللهُ لِأَنَّهُ خَيْرُ مَلْجَأٍ لِكُلِّ تَائِبْ، وَهُوَ الحَنُونُ المُلَئِّمُ الَّذِي يُدَاوِي القُلُوبَ الحَزِينَةَ وَيَجْبُرُهَا بِرَحْمَتِهْ.",
      "بَعْدَ ذٰلِكَ نَزَلَ آدَمُ وَحَوَّاءُ إِلَى الأَرْضِ فِي مَكَانَيْنِ بَعِيدَيْنْ، فَمَشَيَا بِأَقْدَامِهِمَا طَوِيلًا وَسَعَيَا بِنَشَاطٍ حَتَّى التَقَيَا وَتَعَارَفَا عَلَى جَبَلِ عَرَفَاتْ، وَبَنَى آدَمُ بِأَمْرِ رَبِّهِ الكَعْبَةَ المُشَرَّفَةَ فِي مَكَّةَ وَطَافَ حَوْلَهَا لِتَكُونَ أَوَّلَ بَيْتٍ يُعْبَدُ اللهُ فِيهْ. وَعَمِلَ آدَمُ بِعَقْلِهِ وَيَدَيْهِ يَبْنِي الأَرْضَ بِكُلِّ تَفَاؤُلٍ وَفَرَحْ، فَهُوَ نَبِيٌّ مُؤْمِنٌ يُطِيعُ اللهْ، وَأَبٌ مَسْؤُولٌ يُعَلِّمُ أُسْرَتَهُ آدَابَ النَّظَافَةِ وَالطَّهَارَةِ وَسَتْرِ البَدَنِ بِاللِّبَاسِ الجَمِيلْ، وَعَامِلٌ دَؤُوبٌ نَشِيطٌ حَرَثَ التُّرَابَ وَزَرَعَ القَمْحَ وَالأَشْجَارَ وَطَحَنَ الحَبَّ وَخَبَزَ الخُبْزَ الطَّيِّبَ لِيَأْكُلُوا حَلَالًا، وَحُفِرَتْ فِي الأَرْضِ بِئْرٌ يَخْرُجُ مِنْهَا المَاءُ الصَّافِي العَذْبْ.",
      "وَكَبِرَ أَوْلَادُ آدَمَ وَمِنْهُمْ هَابِيلُ وَقَابِيلُ كَمَا حَكَى لَنَا قُرْآنٌ كَرِيمْ، فَأَمَرَهُمَا آدَمُ أَنْ يُقَدِّمَا هَدِيَّةً وَقُرْبَانًا لِلهْ. كَانَ هَابِيلُ نَقِيَّ القَلْبِ كَالمَاءِ الصَّافِي فَقَدَّمَ أَفْضَلَ خَرُوفٍ عِنْدَهُ طَاعَةً لِلهْ، أَمَّا قَابِيلُ فَخَدَعَتْهُ رِيحُ الوَهْمِ وَالبُخْلِ فَقَدَّمَ حُزْمَةً رَدِيئَةً مِنَ الزَّرْعْ. فَتَقَبَّلَ اللهُ مِنْ هَابِيلَ وَلَمْ يَتَقَبَّلْ مِنْ قَابِيلْ، فَاشْتَعَلَتْ فِي صَدْرِ قَابِيلَ نَارُ الحَسَدِ وَالغَضَبِ فَاعْتَدَى عَلَى أَخِيهِ الطَّيِّبِ هَابِيلَ وَقَتَلَهْ، ثُمَّ تَحَيَّرَ كَيْفَ يُخْفِي جَسَدَهُ حَتَّى أَرْسَلَ اللهُ غُرَابًا يَحْفِرُ فِي التُّرَابِ لِيُعَلِّمَهُ كَيْفَ يَسْتُرُ وَيَدْفِنُ أَخَاهْ، فَحَزِنَ آدَمُ عَلَى هَابِيلَ وَبَكَى عَلَيْهِ طَوِيلًا فِي الأَرْضْ.",
      "فَجَبَرَ اللهُ قَلْبَ آدَمَ وَحَوَّاءَ وَرَزَقَهُمَا وَلَدًا صَالِحًا عَاقِلًا هُوَ شِيثُ هِبَةُ اللهْ، وَأَنْزَلَ اللهُ عَلَى آدَمَ صُحُفًا فِيهَا عُلُومٌ وَحِكْمَةٌ وَنُورْ، فَكَانَ آدَمُ يُعَلِّمُ ابْنَهُ شِيثًا وَيَقُولُ لَهُ اقْرَأْ كَلِمَاتِ اللهِ وَاعْمَلْ بِهَا فِي الحَيَاةْ، فَكَانَتْ لِتِلْكَ الصُّحُفِ الشَّرِيفَةِ قِرَاءَةٌ طَيِّبَةٌ يُرَتِّلُهَا شِيثُ وَكُلُّ وَلَدٍ قَارِئٍ مُطِيعٍ لِرَبِّهْ. وَسَلَّمَ آدَمُ الوَصِيَّةَ وَعِلْمَ النُّبُوَّةِ لِابْنِهِ شِيثٍ قَبْلَ وَفَاتِهْ، وَسَارَ أَبْنَاؤُهُ الطَّيِّبُونَ عَلَى عَهْدِهِ حِينَ لَجَؤُوا إِلَى اللهِ بِالعَقْلِ وَالطَّاعَةْ، لِيَفُوزُوا فِي الآخِرَةِ بِأَجْمَلِ مَآلٍ وَأَحْلَى جَنَّةٍ عِنْدَ اللهْ."
    ],
    "words": [
      {
        "word": "اسْمَ",
        "desc": "أول منفصل / ساكن بهمز الوصل: ا",
        "raw": "اسْمَ (أول منفصل / ساكن بهمز الوصل: ا)"
      },
      {
        "word": "مَأْمَنٍ",
        "desc": "وسط متصل / ساكن: ـأْ",
        "raw": "مَأْمَنٍ (وسط متصل / ساكن: ـأْ)"
      },
      {
        "word": "مُؤْمِنٌ",
        "desc": "وسط متصل / ساكن: ـؤْ",
        "raw": "مُؤْمِنٌ (وسط متصل / ساكن: ـؤْ)"
      },
      {
        "word": "بِئْرٌ",
        "desc": "وسط متصل / ساكن: ـئْـ",
        "raw": "بِئْرٌ (وسط متصل / ساكن: ـئْـ)"
      },
      {
        "word": "اقْرَأْ",
        "desc": "آخر منفصل / ساكن: أْ",
        "raw": "اقْرَأْ (آخر منفصل / ساكن: أْ)"
      },
      {
        "word": "البَقَاءْ",
        "desc": "آخر منفصل / ساكن وقفا: ءْ",
        "raw": "البَقَاءْ (آخر منفصل / ساكن وقفا: ءْ)"
      },
      {
        "word": "أَدِيمِ",
        "desc": "أول منفصل / متحرك بالفتح: أَ",
        "raw": "أَدِيمِ (أول منفصل / متحرك بالفتح: أَ)"
      },
      {
        "word": "الأَسْمَاءَ",
        "desc": "أول متصل / متحرك بالفتح: ـأَ",
        "raw": "الأَسْمَاءَ (أول متصل / متحرك بالفتح: ـأَ)"
      },
      {
        "word": "مَرْأًى",
        "desc": "وسط منفصل / متحرك بالفتح: أَ",
        "raw": "مَرْأًى (وسط منفصل / متحرك بالفتح: أَ)"
      },
      {
        "word": "فُؤَادٌ",
        "desc": "وسط متصل / متحرك بالفتح: ـؤَ",
        "raw": "فُؤَادٌ (وسط متصل / متحرك بالفتح: ـؤَ)"
      },
      {
        "word": "قِرَاءَةٌ",
        "desc": "وسط منفصل / متحرك بالفتح: ءَ",
        "raw": "قِرَاءَةٌ (وسط منفصل / متحرك بالفتح: ءَ)"
      },
      {
        "word": "بَدَأَ",
        "desc": "آخر منفصل / متحرك بالفتح: أَ",
        "raw": "بَدَأَ (آخر منفصل / متحرك بالفتح: أَ)"
      },
      {
        "word": "أُمٍّ",
        "desc": "أول منفصل / متحرك بالضم: أُ",
        "raw": "أُمٍّ (أول منفصل / متحرك بالضم: أُ)"
      },
      {
        "word": "تَفَاؤُلٍ",
        "desc": "وسط منفصل / متحرك بالضم: ؤُ",
        "raw": "تَفَاؤُلٍ (وسط منفصل / متحرك بالضم: ؤُ)"
      },
      {
        "word": "لُؤْلُؤٌ",
        "desc": "آخر متصل / متحرك بالضم: ـؤٌ",
        "raw": "لُؤْلُؤٌ (آخر متصل / متحرك بالضم: ـؤٌ)"
      },
      {
        "word": "شَاطِئٌ",
        "desc": "آخر متصل / متحرك بالضم: ـئٌ",
        "raw": "شَاطِئٌ (آخر متصل / متحرك بالضم: ـئٌ)"
      },
      {
        "word": "سَمَاءٌ",
        "desc": "آخر منفصل / متحرك بالضم: ءٌ",
        "raw": "سَمَاءٌ (آخر منفصل / متحرك بالضم: ءٌ)"
      },
      {
        "word": "إِبْلِيسَ",
        "desc": "أول منفصل / متحرك بالكسر: إِ",
        "raw": "إِبْلِيسَ (أول منفصل / متحرك بالكسر: إِ)"
      },
      {
        "word": "مَلَائِكَةٌ",
        "desc": "وسط متصل بطرف / متحرك بالكسر: ئِـ",
        "raw": "مَلَائِكَةٌ (وسط متصل بطرف / متحرك بالكسر: ئِـ)"
      },
      {
        "word": "أَفْئِدَةٌ",
        "desc": "وسط متصل بطرفين / متحرك بالكسر: ـئِـ",
        "raw": "أَفْئِدَةٌ (وسط متصل بطرفين / متحرك بالكسر: ـئِـ)"
      },
      {
        "word": "مَبْدَأِ",
        "desc": "آخر منفصل / متحرك بالكسر: أِ",
        "raw": "مَبْدَأِ (آخر منفصل / متحرك بالكسر: أِ)"
      },
      {
        "word": "مَلْجَأٍ",
        "desc": "آخر متصل / متحرك بالكسر: ـأٍ",
        "raw": "مَلْجَأٍ (آخر متصل / متحرك بالكسر: ـأٍ)"
      },
      {
        "word": "قَارِئٍ",
        "desc": "آخر منفصل / متحرك بالكسر: ئٍ",
        "raw": "قَارِئٍ (آخر منفصل / متحرك بالكسر: ئٍ)"
      },
      {
        "word": "سَأَّالٌ",
        "desc": "وسط متصل / مضعف بالفتح: ـأَّ",
        "raw": "سَأَّالٌ (وسط متصل / مضعف بالفتح: ـأَّ)"
      },
      {
        "word": "تَرَؤُّسٍ",
        "desc": "وسط منفصل / مضعف بالضم: ؤُّ",
        "raw": "تَرَؤُّسٍ (وسط منفصل / مضعف بالضم: ؤُّ)"
      },
      {
        "word": "المُلَئِّمُ",
        "desc": "وسط متصل / مضعف بالكسر: ـئِّـ",
        "raw": "المُلَئِّمُ (وسط متصل / مضعف بالكسر: ـئِّـ)"
      },
      {
        "word": "آدَمَ",
        "desc": "أول منفصل / ممدود بالألف: آ",
        "raw": "آدَمَ (أول منفصل / ممدود بالألف: آ)"
      },
      {
        "word": "الآخِرَةِ",
        "desc": "أول متصل / ممدود بالألف: ـآ",
        "raw": "الآخِرَةِ (أول متصل / ممدود بالألف: ـآ)"
      },
      {
        "word": "قُرْآنٌ",
        "desc": "وسط منفصل / ممدود بالألف: آ",
        "raw": "قُرْآنٌ (وسط منفصل / ممدود بالألف: آ)"
      },
      {
        "word": "مَآلٍ",
        "desc": "وسط متصل / ممدود بالألف: ـآ",
        "raw": "مَآلٍ (وسط متصل / ممدود بالألف: ـآ)"
      },
      {
        "word": "لَجَآ",
        "desc": "آخر متصل / ممدود بالألف: ـآ",
        "raw": "لَجَآ (آخر متصل / ممدود بالألف: ـآ)"
      },
      {
        "word": "جُزْءًا",
        "desc": "آخر منفصل / ممدود بالألف وقفا: ءَا",
        "raw": "جُزْءًا (آخر منفصل / ممدود بالألف وقفا: ءَا)"
      },
      {
        "word": "أُولِي",
        "desc": "أول منفصل / ممدود بالواو: أُو",
        "raw": "أُولِي (أول منفصل / ممدود بالواو: أُو)"
      },
      {
        "word": "الأُولَى",
        "desc": "أول متصل / ممدود بالواو: ـأُو",
        "raw": "الأُولَى (أول متصل / ممدود بالواو: ـأُو)"
      },
      {
        "word": "مَسْؤُولٌ",
        "desc": "وسط متصل / ممدود بالواو: ـؤُو",
        "raw": "مَسْؤُولٌ (وسط متصل / ممدود بالواو: ـؤُو)"
      },
      {
        "word": "دَؤُوبٌ",
        "desc": "وسط منفصل / ممدود بالواو: ؤُو",
        "raw": "دَؤُوبٌ (وسط منفصل / ممدود بالواو: ؤُو)"
      },
      {
        "word": "لَجَؤُوا",
        "desc": "آخر متصل / ممدود بالواو: ـؤُوا",
        "raw": "لَجَؤُوا (آخر متصل / ممدود بالواو: ـؤُوا)"
      },
      {
        "word": "إِيمَانٌ",
        "desc": "أول منفصل / ممدود بالياء: إِي",
        "raw": "إِيمَانٌ (أول منفصل / ممدود بالياء: إِي)"
      },
      {
        "word": "لَئِيمٌ",
        "desc": "وسط متصل / ممدود بالياء: ـئِي",
        "raw": "لَئِيمٌ (وسط متصل / ممدود بالياء: ـئِي)"
      },
      {
        "word": "مَلْجَئِي",
        "desc": "آخر متصل / ممدود بالياء: ـئِي",
        "raw": "مَلْجَئِي (آخر متصل / ممدود بالياء: ـئِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الأَلِفِ (أ): النُّطْقُ السَّلِيمُ لِأَصْوَاتِ الأَلِفِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهَا الثَّلَاثَةِ (أَوَّل، وَسَط، آخِر الكَلِمَةِ) مِنْ مَخْرَجِ أَقْصَى الحَلْقِ إِلَى الفَمِ عَبْرَ الكَلِمَاتِ الـ 40."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الوُجُودُ مِنْ نُقْطَةٍ: مُشَاهَدَةُ انْطِلَاقِ التَّكْوِينِ وَالأَشْكَالِ الهَنْدَسِيَّةِ مِنْ «نُقْطَةٍ» وَاحِدَةٍ، وَكَيْفَ تَمْتَدُّ النُّقْطَةُ لِتُشَكِّلَ خَطَّ الأَلِفِ (ا) وَمِنْهُ تَتَّسِعُ دَائِرَةُ السَّمَاءِ وَالأَرْضِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ آدَمَ (عَلَيْهِ السَّلَامُ): الاسْتِمَاعُ الوَاعِي لِفُصُولِ حَيَاةِ أَبِي البَشَرِ، مَعَ تَدْرِيبِ الأُذُنِ عَلَى إِيقَاعِ الوَقْفِ السَّاكِنِ عِنْدَ نِهَايَةِ كُلِّ جُمْلَةٍ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ وَاحِدٌ (1): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (1) وَرَسْمِ الأَلِفِ العَمُودِيِّ، وَإِدْرَاكُ مَفْهُومِ الوَحْدَةِ وَالبِدَايَةِ (الإِلٰهُ الوَاحِدُ، النَّبِيُّ الأَوَّلُ، البَيْتُ الأَوَّلُ، العَدَدُ 1)، وَمَهَارَةِ عَمَلِ اليَدِ فِي الزَّرْعِ وَالبِنَاءِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "المَشْيُ وَالسَّعْيُ فِي الأَرْضِ: تَدْرِيبُ القَدَمَيْنِ عَلَى رِيَاضَةِ المَشْيِ المُتَوَازِنِ وَالسَّعْيِ النَّشِيطِ، اقْتِدَاءً بِمَشْيِ آدَمَ فِي الأَرْضِ حَتَّى لِقَاءِ عَرَفَاتٍ، وَطَوَافِهِ حَوْلَ الكَعْبَةِ، وَسَعْيِهِ لِعِمَارَةِ الأَرْضِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ المَاءِ وَالزِّرَاعَةِ وَالخَبْزِ: تَعَلُّمُ العُلُومِ الَّتِي اكْتُسِبَتْ فِي زَمَانِ آدَمَ لِتَحْصِيلِ القُوتِ الحَلَالِ الطَّيِّبِ؛ مِنْ حَفْرِ الآبَارِ وَاسْتِخْرَاجِ المَاءِ، إِلَى حَرْثِ التُّرَابِ، وَزِرَاعَةِ الحُبُوبِ وَالثِّمَارِ، وَطَحْنِ القَمْحِ وَعَجْنِهِ وَخَبْزِهِ غِذَاءً نَافِعًا لِلْبَدَنِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ السَّتْرِ وَاللِّبَاسِ وَالطَّهَارَةِ: غَرْسُ فِطْرَةِ الحَيَاءِ وَسَتْرِ الجَسَدِ بِاللِّبَاسِ السَّاتِرِ الجَمِيلِ (مِنْ وَرَقِ الجَنَّةِ إِلَى حِيَاكَةِ الثِّيَابِ فِي الأَرْضِ)، وَآدَابِ التَّطَهُّرِ وَالنَّظَافَةِ بِالمَاءِ الطَّهُورِ وَالتُّرَابِ الطَّاهِرِ، وَإِكْرَامِ الجَسَدِ وَسَتْرِهِ حَيًّا بِاللِّبَاسِ وَمَيِّتًا بِالدَّفْنِ فِي التُّرَابِ."
      }
    },
    "grammar": {
      "topic": "أَقْسَامُ الكَلِمَةِ (1): الاِسْمُ",
      "rule": "الاِسْمُ هُوَ كُلُّ كَلِمَةٍ تَدُلُّ عَلَى إِنْسَانٍ أَوْ حَيَوَانٍ أَوْ نَبَاتٍ أَوْ جَمَادْ.",
      "example": "أَحْمَدُ يَقْرَأُ، وَالأَسَدُ قَوِيٌّ، وَالأَرْضُ خَضْرَاءُ.",
      "focusWord": "الأَسَدُ",
      "q": "أَيُّ كَلِمَةٍ مِنْ هٰذِهِ الكَلِمَاتِ هِيَ «اسْمٌ» يَدُلُّ عَلَى حَيَوَانْ؟",
      "opts": [
        "الأَسَدُ",
        "يَكْتُبُ",
        "فِي",
        "ذَهَبَ"
      ]
    },
    "earIirab": {
      "topic": "عَلَامَةُ الرَّفْعِ: الضَّمَّةُ (ـُ) فِي آخِرِ الاِسْمْ",
      "rule": "نَرْفَعُ الاِسْمَ فِي بِدَايَةِ الجُمْلَةِ بِالضَّمَّةِ الظَّاهِرَةِ عَلَى آخِرِهْ.",
      "sentence": "الأَمَانَةُ خُلُقٌ عَظِيمٌ.",
      "targetWord": "الأَمَانَةُ",
      "caseAns": "مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 1,
      "numName": "وَاحِدٌ",
      "eqDisplay": "1 + 0 = 1",
      "subDisplay": "1 - 0 = 1",
      "compDisplay": "1 > 0",
      "q1": {
        "stem": "مَا هُوَ اسْمُ الرَّقْمِ (1) بِالعَرَبِيَّةِ؟",
        "focus": "1",
        "ans": "وَاحِدٌ",
        "wrong": [
          "اثْنَانِ",
          "عَشَرَةٌ",
          "عِشْرُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "1 + 0 = ؟",
        "ans": "1 (وَاحِدٌ)",
        "wrong": [
          "0 (صِفْرٌ)",
          "2 (اثْنَانِ)",
          "10 (عَشَرَةٌ)"
        ]
      }
    },
    "sport": {
      "title": "عِنَاقُ الفَرَاشَةِ وَالتَّنَفُّسُ الهَادِئُ",
      "middleText": "أَضُمُّ ذِرَاعَيَّ عَلَى كَتِفَيَّ كَجَنَاحَيِ الفَرَاشَةِ وَأُرَبِّتُ بِلُطْفٍ بِالتَّبَادُلْ. يَمْنَحُ هٰذَا التَّمْرِينُ دِمَاغِي وَقَلْبِي السَّكِينَةَ مَعَ أَخْذِ 5 أَنْفَاسٍ عَمِيقَةْ."
    },
    "sci": {
      "title": "البُنْيَانُ وَالحَرَكَةُ: العِظَامُ وَالعَضَلَاتُ",
      "summaryThird": "يَتَكَوَّنُ جِسْمُنَا مِنْ هَيْكَلٍ عَظْمِيٍّ يَحْمِي الأَعْضَاءَ الدَّاخِلِيَّةَ كَالدِّرْعِ الوَاقِي، وَتَكْسُوهُ عَضَلَاتٌ مَرِنَةٌ تَنْقَبِضُ وَتَنْبَسِطُ لِتَمْنَحَنَا القُدْرَةَ عَلَى الحَرَكَةِ وَالجَرْيِ بِنَشَاطْ.",
      "focusConcept": "الهَيْكَلُ العَظْمِيُّ",
      "factAns": "يَسْنِدُ الجِسْمَ وَيَحْمِي الأَعْضَاءَ"
    },
    "rightsSummary": {
      "title": "حَقُّ اللهِ الأَكْبَرُ (حُور وَسُرُور - 1)",
      "storySentence": "تَعَلَّمَ سُرُورٌ وَحُورُ أَنَّ حَقَّ اللهِ الأَكْبَرَ هُوَ أَنْ نَعْبُدَهُ وَحْدَهُ بِلَا شَرِيكٍ، وَنَشْكُرَ نِعَمَهُ الكَثِيرَةَ بِالطَّاعَةِ وَالإِخْلَاصْ.",
      "applyAction": "أَقُولُ بِقَلْبٍ خَاشِعٍ: الحَمْدُ للهِ رَبِّ العَالَمِينَ عَلَى كُلِّ نِعْمَةْ."
    },
    "rightsFullTitle": "(1) حق الله الأكبر",
    "rightsQuote": "فأَمَّا حَقُّ اللهِ الأَكْبَرُ فَإنَّكَ تَعْبُدُهُ لا تُشْرِكُ بهِ شَيْئاً، فَإذَا فَعَلْتَ ذَلِكَ بإخلاص جَعَلَ لَكَ عَلَى نَفْسِهِ أَنْ يَكفِيَكَ أَمْرَ الدُّنْيَا وَالآخِرَةِ وَيَحْفَظَ لَكَ مَا تُحِبُّ مِنْهَما.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (1) حق الله الأكبر",
        "text": "فأَمَّا حَقُّ اللهِ الأَكْبَرُ فَإنَّكَ تَعْبُدُهُ لا تُشْرِكُ بهِ شَيْئاً، فَإذَا فَعَلْتَ ذَلِكَ بإخلاص جَعَلَ لَكَ عَلَى نَفْسِهِ أَنْ يَكفِيَكَ أَمْرَ الدُّنْيَا وَالآخِرَةِ وَيَحْفَظَ لَكَ مَا تُحِبُّ مِنْهَما. — وَفِي سِيرَةِ آدَمُ (ع): آدَابُ السَّتْرِ وَاللِّبَاسِ وَالطَّهَارَةِ: غَرْسُ فِطْرَةِ الحَيَاءِ وَسَتْرِ الجَسَدِ بِاللِّبَاسِ السَّاتِرِ الجَمِيلِ (مِنْ وَرَقِ الجَنَّةِ إِلَى حِيَاكَةِ الثِّيَابِ فِي الأَرْضِ)، وَآدَابِ التَّطَهُّرِ وَالنَّظَافَةِ بِالمَاءِ الطَّهُورِ وَالتُّرَابِ الطَّاهِرِ، وَإِكْرَامِ الجَسَدِ وَسَتْرِهِ حَيًّا بِاللِّبَاسِ وَمَيِّتًا بِالدَّفْنِ فِي التُّرَابِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الله الأكبر",
        "text": "في صباح هادئ، تلقّفت حور صوت أمها الهادئ: \"حان وقت الفجر يا حور.\" تثاءبت وهي تتقلب في فراشها الدافئ، وتقول في نفسها: \"كم أتمنى لو أستطيع النوم أكثر!\" ولكن فجأة، كالضوء الذي يخترق الظلام، تذكّرت:  \"الله يراني.\" نهضت بسرعة، واستحيت من نفسها. توضأت وصَلّت، لكنها شعرت أن تركيزها شارد. وعندما انتهت، همست بتأثّر: \"لم أُحسن صلاتي اليوم... سأحاول غدًا أن أكون أقرب إلى الله.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الله الأكبر",
        "text": "ثم بدأت تستعد للذهاب إلى المدرسة، وفجأة تذكّرت واجبًا لم تُكمله. خطرت لها فكرة نقل الإجابات من إحدى صديقاتها، لكنها وقفت لحظة وقالت في نفسها: \"لن أفعل ذلك، فأنا أتعلم لأفهم، ولن أصل إلى الفهم بالغش. الله يراني، ولن أخذل نفسي بهذه الطريقة.\" أسرعت إلى أمها، وطلبت مساعدتها . فلم تتردد الأم في دعمها، وساعدتها في إنجاز جزء من الواجب. شعرت حور براحة كبيرة، وكأن الله قد كافأها على إخلاصها بأن منحها العون. في المدرسة، سألتها المعلمة عن الواجب الناقص. فصدقتها حور وشرحت لها الموقف. لم تعاقبها المعلمة، بل منحتها فرصة ثمينة لتحسين واجبها. فرحت حور فرحًا شديدًا لهذه الثقة. وفي اليوم التالي، قدّمت واجبها بشكل متقن، فكان الأجمل بين زميلاتها. أدركت حور أن النجاح الحقيقي لا يحتاج إلى طرق مختصرة، بل إلى إخلاص ونية صادقة، حتى لو واجهت عقبات. وفي لحظة من الصفاء، ابتسمت وهمست: \"عندما أخلص لله، يكفيني، ويمنحني القوة لأن أكون أفضل. الله يرى كل شيء، وسأجعل كل عملي خالصًا له وحده.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الأُولَى: جِسْمُ الإِنْسَانِ",
      "topic": "الدَّرْسُ الأَوَّلُ: البُنْيَانُ، الحَرَكَةُ، وَالدِّرْعُ الوَاقِي (الجِهَازُ الهَيْكَلِيُّ وَالعَضَلِيُّ وَالغِطَائِيُّ)",
      "coverImg": "assets/y7/scince/s1.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s1.1.jpg",
          "text": "الشَّرِيحَةُ (1) الجِهَازُ الهَيْكَلِيُّ — الدِّعَامَةُ وَالصَّلَابَةُ: يَحْمِي الأَعْضَاءَ وَيَدْعَمُ الجِسْمَ وَيُسَاعِدُ عَلَى الحَرَكَةِ. يَتَكَوَّنُ مِنَ الجُمْجُمَةِ وَالقَفَصِ الصَّدْرِيِّ وَالعَمُودِ الفَقَرِيِّ وَالحَوْضِ، وَتَرْبِطُ المَفَاصِلُ العِظَامَ لِتَسْمَحَ بِالثَّنْيِ وَالبَسْطِ، وَنُقَوِّيهِ بِالكَالْسِيُومِ وَالجُلُوسِ السَّلِيمِ وَخُوذَةِ الحِمَايَةِ."
        },
        {
          "img": "assets/y7/scince/s1.2.jpg",
          "text": "الشَّرِيحَةُ (2) الجِهَازُ العَضَلِيُّ — المُحَرِّكُ وَالمُرُونَةُ: يُحَرِّكُ الجِسْمَ وَيَحْمِي الأَعْضَاءَ وَيَحْفَظُ وَضْعِيَّةَ الجِسْمِ. يَشْمَلُ عَضَلَاتٍ هَيْكَلِيَّةً وَعَضَلَةً قَلْبِيَّةً وَعَضَلَاتٍ مَلْسَاءَ تَعْمَلُ بِالاِنْقِبَاضِ وَالاِنْبِسَاطِ وَتَرْبِطُهَا الأَوْتَارُ بِالعِظَامِ، وَنُقَوِّيهَا بِالبُرُوتِينِ وَالرِّيَاضَةِ وَالتَّمَدُّدِ."
        },
        {
          "img": "assets/y7/scince/s1.3.jpg",
          "text": "الشَّرِيحَةُ (3) الجِهَازُ الغِطَائِيُّ — الدِّرْعُ الخَارِجِيُّ: يَتَكَوَّنُ مِنَ الجِلْدِ وَالشَّعْرِ وَالأَظَافِرِ وَالغُدَدِ العَرَقِيَّةِ وَالمَسَامِ. يَحْمِي الجِسْمَ وَيُنَظِّمُ الحَرَارَةَ بِإِفْرَازِ العَرَقِ لِلتَّبْرِيدِ وَيَمْنَحُنَا الإِحْسَاسَ وَاللَّمْسَ، وَنَحْمِيهِ بِالنَّظَافَةِ وَالاسْتِحْمَامِ وَشُرْبِ المَاءِ وَالوِقَايَةِ مِنَ الشَّمْسِ."
        }
      ],
      "text": "الشَّرِيحَةُ (1) الجِهَازُ الهَيْكَلِيُّ — الدِّعَامَةُ وَالصَّلَابَةُ: يَحْمِي الأَعْضَاءَ وَيَدْعَمُ الجِسْمَ وَيُسَاعِدُ عَلَى الحَرَكَةِ. يَتَكَوَّنُ مِنَ الجُمْجُمَةِ وَالقَفَصِ الصَّدْرِيِّ وَالعَمُودِ الفَقَرِيِّ وَالحَوْضِ، وَتَرْبِطُ المَفَاصِلُ العِظَامَ لِتَسْمَحَ بِالثَّنْيِ وَالبَسْطِ، وَنُقَوِّيهِ بِالكَالْسِيُومِ وَالجُلُوسِ السَّلِيمِ وَخُوذَةِ الحِمَايَةِ. الشَّرِيحَةُ (2) الجِهَازُ العَضَلِيُّ — المُحَرِّكُ وَالمُرُونَةُ: يُحَرِّكُ الجِسْمَ وَيَحْمِي الأَعْضَاءَ وَيَحْفَظُ وَضْعِيَّةَ الجِسْمِ. يَشْمَلُ عَضَلَاتٍ هَيْكَلِيَّةً وَعَضَلَةً قَلْبِيَّةً وَعَضَلَاتٍ مَلْسَاءَ تَعْمَلُ بِالاِنْقِبَاضِ وَالاِنْبِسَاطِ وَتَرْبِطُهَا الأَوْتَارُ بِالعِظَامِ، وَنُقَوِّيهَا بِالبُرُوتِينِ وَالرِّيَاضَةِ وَالتَّمَدُّدِ. الشَّرِيحَةُ (3) الجِهَازُ الغِطَائِيُّ — الدِّرْعُ الخَارِجِيُّ: يَتَكَوَّنُ مِنَ الجِلْدِ وَالشَّعْرِ وَالأَظَافِرِ وَالغُدَدِ العَرَقِيَّةِ وَالمَسَامِ. يَحْمِي الجِسْمَ وَيُنَظِّمُ الحَرَارَةَ بِإِفْرَازِ العَرَقِ لِلتَّبْرِيدِ وَيَمْنَحُنَا الإِحْسَاسَ وَاللَّمْسَ، وَنَحْمِيهِ بِالنَّظَافَةِ وَالاسْتِحْمَامِ وَشُرْبِ المَاءِ وَالوِقَايَةِ مِنَ الشَّمْسِ.",
      "q1": {
        "q": "مَا الجِهَازُ الَّذِي يُمَثِّلُ الدِّعَامَةَ وَالصَّلَابَةَ وَيَتَكَوَّنُ مِنَ الجُمْجُمَةِ وَالقَفَصِ الصَّدْرِيِّ وَالعَمُودِ الفَقَرِيِّ؟",
        "focusWord": "الجِهَازُ الهَيْكَلِيُّ",
        "options": [
          {
            "text": "الجِهَازُ الهَيْكَلِيُّ (العِظَامُ وَالمَفَاصِلُ)",
            "correct": true
          },
          {
            "text": "الجِهَازُ الهَضْمِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ التَّنَفُّسِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ البَوْلِيُّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ تَعْمَلُ العَضَلَاتُ المَرْبُوطَةُ بِالعِظَامِ عَبْرَ الأَوْتَارِ لِتَحْرِيكِ الجِسْمِ؟",
        "focusWord": "الاِنْقِبَاضُ وَالاِنْبِسَاطُ",
        "options": [
          {
            "text": "بِالاِنْقِبَاضِ وَالاِنْبِسَاطِ",
            "correct": true
          },
          {
            "text": "بِالتَّبَخُّرِ وَالتَّكَاثُفِ",
            "correct": false
          },
          {
            "text": "بِهَضْمِ الطَّعَامِ",
            "correct": false
          },
          {
            "text": "بِإِفْرَازِ الدُّمُوعِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا وَظِيفَةُ الغُدَدِ العَرَقِيَّةِ فِي الجِهَازِ الغِطَائِيِّ (الجِلْدِ)؟",
        "focusWord": "تَنْظِيمُ الحَرَارَةِ",
        "options": [
          {
            "text": "إِفْرَازُ العَرَقِ لِتَبْرِيدِ الجِسْمِ وَتَنْظِيمِ حَرَارَتِهِ",
            "correct": true
          },
          {
            "text": "ضَخُّ الدَّمِ فِي الشَّرَايِينِ",
            "correct": false
          },
          {
            "text": "تَخْزِينُ الكَالْسِيُومِ",
            "correct": false
          },
          {
            "text": "تَحْرِيكُ المَفَاصِلِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الجِهَازُ الهَيْكَلِيُّ",
          "left": "الجُمْجُمَةُ وَالقَفَصُ الصَّدْرِيُّ وَالعَمُودُ الفَقَرِيُّ"
        },
        {
          "right": "الجِهَازُ العَضَلِيُّ",
          "left": "عَضَلَاتٌ هَيْكَلِيَّةٌ وَقَلْبِيَّةٌ وَمَلْسَاءُ تَعْمَلُ بِالاِنْقِبَاضِ وَالاِنْبِسَاطِ"
        },
        {
          "right": "الجِهَازُ الغِطَائِيُّ",
          "left": "الجِلْدُ وَالشَّعْرُ وَالأَظَافِرُ وَالغُدَدُ العَرَقِيَّةُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَا يُقَوِّي العِظَامَ وَالعَضَلَاتِ وَالجِلْدَ:",
        "correct": [
          "الحَلِيبُ الغَنِيُّ بِالكَالْسِيُومِ",
          "البُرُوتِينُ وَالرِّيَاضَةُ",
          "النَّظَافَةُ وَشُرْبُ المَاءِ",
          "الجُلُوسُ السَّلِيمُ"
        ],
        "wrong": [
          "كَثْرَةُ السُّكَّرِيَّاتِ الضَّارَّةِ",
          "الجُلُوسُ الخَاطِئُ"
        ]
      },
      "applyStep": "أُحَافِظُ عَلَى بُنْيَانِ جِسْمِي بِشُرْبِ الحَلِيبِ وَمُمَارَسَةِ الرِّيَاضَةِ وَالنَّظَافَةِ اليَوْمِيَّةِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt1.jpg",
      "title": "تَمَارِينُ الدِّمَاغِ السَّبْعَةُ (الرَّبْطُ بَيْنَ نِصْفَيِ الدِّمَاغِ)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِزِيَادَةِ التَّرْكِيزِ وَتَنْسِيقِ الحَرَكَةِ!",
      "slideText": "🧠 تَمَارِينُ الدِّمَاغِ السَّبْعَةُ (الرَّبْطُ بَيْنَ نِصْفَيِ الدِّمَاغِ — 10 دَقَائِقَ يَوْمِيًّا): (1) المِشْيَةُ المُتَقَاطِعَةُ: لَمْسُ الرُّكْبَةِ بِاليَدِ المُعَاكِسَةِ بِالتَّنَاوُبِ. (2) المِشْيَةُ المُتَقَاطِعَةُ الخَلْفِيَّةُ: رَفْعُ القَدَمِ لِلْخَلْفِ وَلَمْسُ كَعْبِهَا بِاليَدِ المُعَاكِسَةِ. (3) مَسْكَةُ الأُذُنِ وَالأَنْفِ مَعَ التَّصْفِيقِ وَالتَّبْدِيلِ. (4) رَسْمُ اللَّانِهَايَةِ الهَوَائِيِّ (∞). (5) الرَّسْمُ المُزْدَوَجُ المُتَنَاظِرُ بِكِلْتَا اليَدَيْنِ مَعًا. (6) طَاحُونَةُ الهَوَاءِ المُتَقَاطِعَةُ. (7) التَّرْبِيتُ الدَّائِرِيُّ المُتَعَاكِسُ عَلَى البَطْنِ وَالرَّأْسِ.",
      "q1": {
        "q": "مَا الهَدَفُ الرَّئِيسِيُّ مِنْ مُمَارَسَةِ تَمَارِينِ الدِّمَاغِ السَّبْعَةِ لِمُدَّةِ 10 دَقَائِقَ يَوْمِيًّا؟",
        "focusWord": "الرَّبْطُ بَيْنَ نِصْفَيِ الدِّمَاغِ",
        "options": [
          {
            "text": "الرَّبْطُ بَيْنَ نِصْفَيِ الدِّمَاغِ لِزِيَادَةِ التَّرْكِيزِ وَتَنْسِيقِ الحَرَكَةِ",
            "correct": true
          },
          {
            "text": "إِجْهَادُ العَضَلَاتِ وَالسَّهَرُ",
            "correct": false
          },
          {
            "text": "حَبْسُ النَّفَسِ الطَّوِيلُ",
            "correct": false
          },
          {
            "text": "الجُلُوسُ بِلَا حَرَكَةٍ طَوَالَ اليَوْمِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (الرَّسْمِ المُزْدَوَجِ المُتَنَاظِرِ) وَتَمْرِينَ (اللَّانِهَايَةِ الهَوَائِيِّ)؟",
        "focusWord": "الرَّسْمُ المُزْدَوَجُ المُتَنَاظِرُ",
        "options": [
          {
            "text": "نَرْسُمُ عَلَامَةَ (∞) فِي الهَوَاءِ، وَنَرْسُمُ شَكْلَيْنِ مُتَنَاظِرَيْنِ بِكِلْتَا اليَدَيْنِ مَعًا عَلَى اللَّوْحِ",
            "correct": true
          },
          {
            "text": "نَرْكُضُ بِسُرْعَةٍ دُونَ تَوَازُنٍ",
            "correct": false
          },
          {
            "text": "نُغْمِضُ أَعْيُنَنَا وَنَنَامُ",
            "correct": false
          },
          {
            "text": "نَقْفِزُ عَلَى قَدَمٍ وَاحِدَةٍ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "فِي تَمْرِينِ (التَّرْبِيتِ الدَّائِرِيِّ المُتَعَاكِسِ) رَقْمِ (7)، مَاذَا تَفْعَلُ اليَدَانِ فِي نَفْسِ الوَقْتِ؟",
        "focusWord": "التَّرْبِيتُ الدَّائِرِيُّ المُتَعَاكِسُ",
        "options": [
          {
            "text": "يَدٌ تَفْرُكُ البَطْنَ بِحَرَكَةٍ دَائِرِيَّةٍ وَاليَدُ الأُخْرَى تُرَبِّتُ بِخِفَّةٍ أَعْلَى الرَّأْسِ",
            "correct": true
          },
          {
            "text": "اليَدَانِ مَشْبُوكَتَانِ خَلْفَ الظَّهْرِ",
            "correct": false
          },
          {
            "text": "اليَدَانِ تَحْمِلَانِ أَثْقَالًا حَدِيدِيَّةً",
            "correct": false
          },
          {
            "text": "اليَدَانِ ثَابِتَتَانِ عَلَى الطَّاوِلَةِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "المِشْيَةُ المُتَقَاطِعَةُ (1 وَ2)",
          "left": "لَمْسُ الرُّكْبَةِ أَوِ الكَعْبِ الخَلْفِيِّ بِاليَدِ المُعَاكِسَةِ"
        },
        {
          "right": "رَسْمُ اللَّانِهَايَةِ الهَوَائِيُّ (4)",
          "left": "رَسْمُ عَلَامَةِ (∞) فِي الهَوَاءِ لِتَنْشِيطِ التَّرْكِيزِ"
        },
        {
          "right": "الرَّسْمُ المُزْدَوَجُ المُتَنَاظِرُ (5)",
          "left": "رَسْمُ أَشْكَالٍ مُتَنَاظِرَةٍ بِكِلْتَا اليَدَيْنِ مَعًا"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الدِّمَاغِ السَّبْعَةَ لِلرَّبْطِ بَيْنَ نِصْفَيِ الدِّمَاغِ:",
        "correct": [
          "المِشْيَةُ المُتَقَاطِعَةُ الأَمَامِيَّةُ وَالخَلْفِيَّةُ",
          "مَسْكَةُ الأُذُنِ وَالأَنْفِ",
          "رَسْمُ اللَّانِهَايَةِ الهَوَائِيُّ (∞)",
          "طَاحُونَةُ الهَوَاءِ المُتَقَاطِعَةُ"
        ],
        "wrong": [
          "الخُمُولُ وَالكَسَلُ",
          "الحَرَكَةُ الفَوْضَوِيَّةُ بِلَا تَرْكِيزٍ"
        ]
      },
      "applyStep": "أُطَبِّقُ تَمَارِينَ الدِّمَاغِ السَّبْعَةَ (المِشْيَةَ المُتَقَاطِعَةَ وَرَسْمَ اللَّانِهَايَةِ ∞) لِمُدَّةِ 10 دَقَائِقَ قَبْلَ المَذَاكَرَةِ."
    }
  },
  {
    "w": 2,
    "secNum": 1,
    "heavenName": "سَمَاءُ السَّبْتِ العُلْيَا (أ ب ج د)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الأُولَى: عُلُومُ جِسْمِ الإِنْسَانِ وَالأَحْيَاءِ الخَلَوِيَّةِ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "ب",
    "jummal": 2,
    "prophet": "أَيُّوبُ (ع)",
    "virtue": "الصَّبْرُ",
    "unitHeader": "الوَحْدَةُ الثَّانِيَةُ: نَبِيُّ اللهِ أَيُّوبُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "صَبَرَ نَبِيُّ اللهِ أَيُّوبُ (ع) عَلَى المَرَضِ سَنَوَاتٍ طَوِيلَةً وَهُوَ يَذْكُرُ اللهَ وَيَشْكُرُهُ، فَأَمَرَهُ اللهُ أَنْ يَضْرِبَ الأَرْضَ بِرِجْلِهِ فَنَبَعَ مَاءٌ بَارِدٌ شَفَاهُ اللهُ بِهْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): اشْتِعَالُ نَارِ الحَسَدِ فِي قَلْبِ إِبْلِيسَ مِنْ شُكْرِ أَيُّوبَ، وَتَسْلِيطُ النَّارِ عَلَى المَزَارِعِ وَالحَلَالِ امْتِحَانًا لِصَبْرِهِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): الرِّيحُ الَّتِي هَدَمَتِ الدَّارَ، وَوَهْمُ النَّاسِ وَالأَصْحَابِ حِينَ ظَنُّوا أَنَّ البَلَاءَ عُقُوبَةٌ، وَخِدَاعُ إِبْلِيسَ فِي صُورَةِ طَبِيبٍ لِإِيقَاعِ الوَهْمِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): رُسُوخُ عَقْلِ أَيُّوبَ وَحُجَّتِهِ أَمَامَ أَصْحَابِهِ، وَضَرْبُهُ التُّرَابَ بِرِجْلِهِ، وَعِمَارَةُ بَيَادِرِ القَمْحِ وَالشَّعِيرِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): عَيْنُ المَاءِ البَارِدِ الشَّافِي لِلظَّاهِرِ وَالبَاطِنِ، وَنَقَاءُ فِطْرَةِ أَيُّوبَ وَزَوْجَتِهِ رَحْمَةَ فِي الطَّاعَةِ وَالوَفَاءِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ السَّبْتِ العَظِيمْ، يَأْتِي النَّبِيُّ الرَّقْمُ اثْنَانِ مِنْ ذُرِّيَّةِ إِبْرَاهِيمَ الخَلِيلْ، وَهُوَ نَبِيُّ اللهِ أَيُّوبُ عَلَيْهِ السَّلَامْ. كَانَ يَعِيشُ فِي أَرْضِ الشَّامِ الخَضْرَاءِ المُنْبَسِطَةِ كَـبِسَاطٍ وَاسِعٍ جَمِيلْ، مَعَ زَوْجَتِهِ الصَّالِحَةِ رَحْمَةَ حَفِيدَةِ نَبِيِّ اللهِ يُوسُفَ الكَرِيمْ. أَنْعَمَ اللهُ عَلَيْهِمَا بِأَوْلَادٍ طَيِّبِينَ وَأَمْوَالٍ وَأَغْنَامٍ كَثِيرَةْ، وَكَانَتْ لَهُ مَزَارِعُ وَبَسَاتِينُ تَجْرِي فِيهَا المِيَاهُ العَذْبَةْ، يُثْمِرُ فِيهَا كُلُّ بُسْتَانٌ أَطْيَبَ الفَوَاكِهِ وَالحُبُوبْ. وَمَعَ كُلِّ هٰذِهِ النِّعَمِ كَانَ قَلْبُهُ نَقِيًّا كَالمَاءِ الصَّافِي فِي التَّوَاضُعِ وَالطَّاعَةْ، يَكْفُلُ الأَيْتَامَ وَيُطْعِمُ المَسَاكِينْ، وَيَشْكُرُ رَبَّهُ وَيُسَبِّحُ بِحَمْدِهِ لَيْلًا وَنَهَارًا فِي سَبِيلِ الخَيْرِ وَالهُدَى.",
      "وَلَمَّا رَأَى إِبْلِيسُ طَاعَتَهُ اشْتَعَلَتْ فِي صَدْرِهِ نَارُ الغَضَبِ وَالحَسَدْ، وَادَّعَى أَنَّهُ لَا يَعْبُدُ اللهَ إِلَّا لِكَثْرَةِ نِعَمِهْ. فَأَرَادَ اللهُ أَنْ يُظْهِرَ لِلْمَلَائِكَةِ وَالنَّاسِ مَنْزِلَةَ نَبِيِّهِ العَظِيمَةْ، فَنَزَلَتِ النَّارُ عَلَى مَزَارِعِهِ وَأَمْوَالِهِ فَـذَهَبَ المَالُ كُلُّهْ، وَهَبَّتْ رِيحٌ شَدِيدَةٌ عَلَى دَارِهِ فَرَحَلَ أَوْلَادُهُ إِلَى رَحْمَةِ رَبِّهِمْ، ثُمَّ ابْتُلِيَ فِي جَسَدِهِ بِأَلَمٍ وَمَرَضٍ شَدِيدٍ دَامَ سَبْعَ سِنِينْ، دُونَ أَنْ يُصِيبَهُ أَيُّ مَرَضٍ مُنَفِّرٍ لِأَنَّ أَنْبِيَاءَ اللهِ مَعْصُومُونَ مُطَهَّرُونْ.",
      "فَثَبَتَ عَقْلُ نَبِيِّ اللهِ كَمَا يَثْبُتُ أَعْلَى جَبَلٍ رَاسِخٍ عَلَى التُّرَابْ، وَقَالَ بِحِكْمَتِهِ إِنَّ المَالَ وَالأَوْلَادَ وَدِيعَةٌ مِنَ اللهِ وَقَدْ أَخَذَ اللهُ وَدِيعَتَهْ، فَهُوَ نَبِيٌّ صَبُورٌ شَاكِرٌ لِرَبِّهْ، وَقَدْ رَبَطَ اللهُ عَلَى قَلْبِهِ بِالسَّكِينَةِ وَالنُّورْ. وَجَاءَ الشَّيْطَانُ يَنْفُخُ رِيحَ الوَهْمِ فِي عُقُولِ النَّاسِ وَأَصْحَابِهِ الرُّهْبَانْ، فَجَاؤُوا إِلَيْهِ وَقَالُوا لَهُ لَعَلَّكَ أَذْنَبْتَ ذَنْبًا خَفِيًّا فَعَاقَبَكَ اللهْ. فَرَدَّ عَلَيْهِمْ بِعَقْلِهِ وَحِكْمَتِهِ وَأَخْبَرَهُمْ أَنَّ اللهَ يَبْتَلِي أَحْبَابَهُ لِيَرْفَعَ دَرَجَاتِهِمْ، وَأَنَّ اللهَ يُحِبُّ الصَّابِرِينْ.",
      "وَابْتَعَدَ النَّاسُ عَنْهُ بِسَبَبِ الوَهْمِ وَالخَوْفْ، وَلَمْ يَبْقَ مَعَهُ إِلَّا زَوْجَتُهُ الوَفِيَّةُ رَحْمَةُ الَّتِي كَانَتْ تَخْدُمُهُ بِمَحَبَّةٍ وَطَهَارَةٍ وَتَعْمَلُ بِيَدَيْهَا لِتَأْتِيَهُ بِالقُوتِ الحَلَالْ. وَاعْتَرَضَ إِبْلِيسُ طَرِيقَهَا يَوْمًا فِي صُورَةِ طَبِيبٍ كَاذِبٍ لِيَخْدَعَهَا بِالوَهْمْ، فَعَرَفَهُ زَوْجُهَا النَّبِيُّ بِنُورِ عَقْلِهِ وَحَذَّرَهَا مِنْهْ، وَأَقْسَمَ أَنْ يَضْرِبَهَا مِائَةَ عُودٍ إِذَا عَافَاهُ اللهْ. وَلَمَّا مَنَعَ النَّاسُ العَمَلَ عَنْ زَوْجَتِهْ، قَصَّتْ ضَفِيرَةَ شَعْرِهَا وَبَاعَتْهَا لِتَشْتَرِيَ لَهُ خُبْزًا طَيِّبًا يَأْكُلُهْ، فَلَمَّا عَلِمَ بِتَضْحِيَتِهَا وَصَبْرِهَا رَقَّ قَلْبُهُ وَتَوَجَّهَ إِلَى رَبِّهِ بِأَدَبٍ وَدُعَاءٍ قَائِلًا، يَا رَبِّ إِنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينْ.",
      "فَاسْتَجَابَ اللهُ دُعَاءَهُ وَتَقَبَّلَ صَبْرَهُ الجَمِيلْ، وَأَوْحَى إِلَيْهِ أَنِ ارْكُضْ بِرِجْلِكَ وَاضْرِبْ بِهَا التُّرَابَ تَحْتَكَ. فَرَكَضَ بِقَدَمَيْهِ بِنَشَاطٍ فَتَفَجَّرَتْ عَيْنُ مَاءٍ صَافِيَةٌ، وَقَالَ اللهُ لَهُ هٰذَا مَاءٌ بَارِدٌ تَغْتَسِلُ بِهِ وَمِنْهُ شَرَابْ. فَاغْتَسَلَ بِالمَاءِ الطَّهُورِ فَشُفِيَ ظَاهِرُ بَدَنِهْ، وَشَرِبَ مِنْهُ شَرْبَةً عَذْبَةً فَشُفِيَ بَطْنُهُ وَجَوْفُهُ مِنْ كُلِّ دَاءْ، وَأَنْزَلَ اللهُ لَهُ مَعَ المَلَكِ جِبْرِيلَ حُلَّةً خَضْرَاءَ جَمِيلَةً مِنَ الجَنَّةِ لَبِسَهَا فِي سَتْرٍ وَبَهَاءْ. وَلَمَّا عَادَتْ زَوْجَتُهُ رَحْمَةُ رَأَتْ شَابًّا مُشْرِقَ الوَجْهِ فَلَمْ تَعْرِفْهُ فِي البِدَايَةِ وَسَأَلَتْهُ عَنْ زَوْجِهَا النَّبِيِّ المَرِيضْ، فَتَبَسَّمَ لَهَا فَعَرَفَتْهُ وَفَرِحَتْ فَرَحًا عَظِيمًا، وَدَعَا اللهَ لَهَا فَعَادَ إِلَيْهَا شَبَابُهَا وَضَفِيرَتُهَا.",
      "وَأَمَرَهُ اللهُ أَنْ يَجْمَعَ بِيَدِهِ حُزْمَةً فِيهَا مِائَةُ عُودٍ أَخْضَرَ نَاعِمٍ مِنَ العُشْبِ وَالرَّيْحَانِ وَيَضْرِبَ بِهَا زَوْجَتَهُ ضَرْبَةً وَاحِدَةً خَفِيفَةً بِلُطْفٍ وَرِفْقٍ لِيُوفِيَ بِقَسَمِهِ دُونَ أَنْ يُؤْذِيَهَا. وَأَنْزَلَ اللهُ البَرَكَةَ عَلَى دِيَارِهِ فَأَمْطَرَ عَلَيْهِ جَرَادًا مِنْ ذَهَبْ، وَأَرْسَلَ سَحَابَتَيْنِ أَمْطَرَتَا ذَهَبًا وَفِضَّةً عَلَى بَيْدَرِ القَمْحِ وَبَيْدَرِ الشَّعِيرْ، وَضَاعَفَ لَهُ الخَيْرَ مَرَّتَيْنِ فَأَحْيَا لَهُ أَوْلَادَهُ وَرَزَقَهُ مِثْلَهُمْ مَعَهُمْ، وَسَلَّمَ عِلْمَ النُّبُوَّةِ وَالوَصِيَّةَ مِنْ بَعْدِهِ لِابْنِهِ الصَّالِحِ بِشْرٍ ذِي الكِفْلِ عَلَيْهِ السَّلَامْ، وَخَلَّدَ اللهُ ذِكْرَهُ فِي القُرْآنِ الكَرِيمِ لِأَنَّهُ نِعْمَ عَبْدٌ صَابِرٌ أَوَّابْ."
    ],
    "words": [
      {
        "word": "عَبْدٌ",
        "desc": "وسط متصل / ساكن: ـبْـ",
        "raw": "عَبْدٌ (وسط متصل / ساكن: ـبْـ)"
      },
      {
        "word": "شَرَابْ",
        "desc": "آخر منفصل / ساكن وقفا: بْ",
        "raw": "شَرَابْ (آخر منفصل / ساكن وقفا: بْ)"
      },
      {
        "word": "بَسَاتِينُ",
        "desc": "أول منفصل / متحرك بالفتح: بَـ",
        "raw": "بَسَاتِينُ (أول منفصل / متحرك بالفتح: بَـ)"
      },
      {
        "word": "البَرَكَةَ",
        "desc": "أول متصل / متحرك بالفتح: ـبَـ",
        "raw": "البَرَكَةَ (أول متصل / متحرك بالفتح: ـبَـ)"
      },
      {
        "word": "جَبَلٍ",
        "desc": "وسط متصل / متحرك بالفتح: ـبَـ",
        "raw": "جَبَلٍ (وسط متصل / متحرك بالفتح: ـبَـ)"
      },
      {
        "word": "رَبَطَ",
        "desc": "وسط منفصل / متحرك بالفتح: بَـ",
        "raw": "رَبَطَ (وسط منفصل / متحرك بالفتح: بَـ)"
      },
      {
        "word": "ذَهَبَ",
        "desc": "آخر متصل / متحرك بالفتح: ـبَ",
        "raw": "ذَهَبَ (آخر متصل / متحرك بالفتح: ـبَ)"
      },
      {
        "word": "بُسْتَانٌ",
        "desc": "أول منفصل / متحرك بالضم: بُـ",
        "raw": "بُسْتَانٌ (أول منفصل / متحرك بالضم: بُـ)"
      },
      {
        "word": "أَيُّوبُ",
        "desc": "آخر منفصل / متحرك بالضم: بُ",
        "raw": "أَيُّوبُ (آخر منفصل / متحرك بالضم: بُ)"
      },
      {
        "word": "بِسَاطٍ",
        "desc": "أول منفصل / متحرك بالكسر: بِـ",
        "raw": "بِسَاطٍ (أول منفصل / متحرك بالكسر: بِـ)"
      },
      {
        "word": "تَقَبَّلَ",
        "desc": "وسط متصل / مضعف بالفتح: ـبَّـ",
        "raw": "تَقَبَّلَ (وسط متصل / مضعف بالفتح: ـبَّـ)"
      },
      {
        "word": "يُحِبُّ",
        "desc": "آخر متصل / مضعف بالضم: ـبُّ",
        "raw": "يُحِبُّ (آخر متصل / مضعف بالضم: ـبُّ)"
      },
      {
        "word": "يُسَبِّحُ",
        "desc": "وسط متصل / مضعف بالكسر: ـبِّـ",
        "raw": "يُسَبِّحُ (وسط متصل / مضعف بالكسر: ـبِّـ)"
      },
      {
        "word": "بَارِدٌ",
        "desc": "أول منفصل / ممدود بالألف: بَا",
        "raw": "بَارِدٌ (أول منفصل / ممدود بالألف: بَا)"
      },
      {
        "word": "صَبُورٌ",
        "desc": "وسط متصل / ممدود بالواو: ـبُو",
        "raw": "صَبُورٌ (وسط متصل / ممدود بالواو: ـبُو)"
      },
      {
        "word": "سَبِيلِ",
        "desc": "وسط متصل / ممدود بالياء: ـبِي",
        "raw": "سَبِيلِ (وسط متصل / ممدود بالياء: ـبِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ البَاءِ (ب): النُّطْقُ السَّلِيمُ لِحَرْفِ البَاءِ مِنْ مَخْرَجِ انْطِبَاقِ الشَّفَتَيْنِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، مَعَ تَعَلُّمِ أَدَبِ اللِّسَانِ فِي التَّسْبِيحِ وَالدُّعَاءِ دُونَ شَكْوَى."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الامْتِدَادُ الأُفُقِيُّ وَالنُّقْطَةُ السُّفْلِيَّةُ: مُشَاهَدَةُ انْبِسَاطِ خَطِّ البَاءِ (ب) كَالبِسَاطِ الأَخْضَرِ وَحَوْضِ المَاءِ، وَاسْتِقْرَارِ النُّقْطَةِ تَحْتَهُ كَعَيْنِ المَاءِ المَكْنُونَةِ تَحْتَ الأَرْضِ الَّتِي تَنْبُعُ عِنْدَ الحَرَكَةِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ أَيُّوبَ الكَامِلَةُ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ القِصَّةِ مِنَ النَّعِيمِ إِلَى الابْتِلَاءِ فَالشِّفَاءِ وَالمُضَاعَفَةِ، مَعَ تَدْرِيبِ الأُذُنِ عَلَى الوَقْفِ السَّاكِنِ عِنْدَ كُلِّ فَاصِلَةٍ وَنُقْطَةٍ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ اثْنَانِ (2): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (2) وَرَسْمِ حَرْفِ البَاءِ، وَإِدْرَاكُ مَفْهُومِ الثُّنَائِيَّةِ وَالتَّضَاعُفِ (مُغْتَسَلٌ وَشَرَابٌ، بَيْدَرُ القَمْحِ وَبَيْدَرُ الشَّعِيرِ، سَحَابَتَا الذَّهَبِ وَالفِضَّةِ، رَدُّ الأَهْلِ وَمِثْلِهِمْ مَعَهُمْ)، وَمَهَارَةِ اليَدِ فِي جَمْعِ حُزْمَةِ الرَّيْحَانِ وَعَمَلِ الخُبْزِ الحَلَالِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "الرَّكْضُ وَدَقُّ الأَرْضِ بِالقَدَمَيْنِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ الرَّكْضِ النَّشِيطِ وَالضَّرْبِ المُتَوَازِنِ بِالقَدَمِ عَلَى الأَرْضِ لِتَنْشِيطِ الدَّوْرَةِ الدَّمَوِيَّةِ وَالقُوَّةِ البَدَنِيَّةِ، اقْتِدَاءً بِقَوْلِهِ تَعَالَى: ﴿ارْكُضْ بِرِجْلِكَ﴾."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ المَاءِ الشَّافِي وَزِرَاعَةِ القَمْحِ وَالشَّعِيرِ: تَعَلُّمُ فَوَائِدِ شُرْبِ المَاءِ العَذْبِ البَارِدِ فِي غَسْلِ البَطْنِ وَتَنْقِيَةِ الجَوْفِ، وَمَعْرِفَةِ عُلُومِ خَزْنِ القَمْحِ وَالشَّعِيرِ فِي البَيَادِرِ وَالتَّدَاوِي بِالأَعْشَابِ الطَّبِيعِيَّةِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الاغْتِسَالِ وَاللِّبَاسِ النَّظِيفِ وَالوَفَاءِ الأُسَرِيِّ: تَعَلُّمُ آدَابِ الاغْتِسَالِ بِالمَاءِ البَارِدِ لِطَهَارَةِ البَدَنِ، وَارْتِدَاءِ الثِّيَابِ النَّظِيفَةِ السَّاتِرَةِ (كَالحُلَّةِ الخَضْرَاءِ)، وَحِفْظِ الوَفَاءِ وَالمَوَدَّةِ وَالرِّفْقِ دَاخِلَ الأُسْرَةِ."
      }
    },
    "grammar": {
      "topic": "أَقْسَامُ الكَلِمَةِ (2): الفِعْلُ",
      "rule": "الفِعْلُ هُوَ كَلِمَةٌ تَدُلُّ عَلَى عَمَلٍ يَحْدُثُ فِي زَمَنٍ مُعَيَّنٍ (مَاضٍ أَوْ مُضَارِعٍ أَوْ أَمْرْ).",
      "example": "صَبَرَ أَيُّوبُ، وَيَشْرَبُ الطِّفْلُ المَاءَ، وَاكْتُبْ دَرْسَكَ.",
      "focusWord": "يَشْرَبُ",
      "q": "أَيُّ كَلِمَةٍ مِنْ هٰذِهِ الكَلِمَاتِ هِيَ «فِعْلٌ» يَدُلُّ عَلَى حَرَكَةٍ وَعَمَلْ؟",
      "opts": [
        "يَشْرَبُ",
        "البَابُ",
        "مِنْ",
        "البَيْتُ"
      ]
    },
    "earIirab": {
      "topic": "عَلَامَةُ النَّصْبِ: الفَتْحَةُ (ـَ) عَلَى المَفْعُولِ بِهْ",
      "rule": "نَنْصِبُ الاِسْمَ الَّذِي وَقَعَ عَلَيْهِ الفِعْلُ بِالفَتْحَةِ الظَّاهِرَةِ فِي آخِرِهْ.",
      "sentence": "شَرِبَ المَرِيضُ المَاءَ.",
      "targetWord": "المَاءَ",
      "caseAns": "مَنْصُوبٌ بِالفَتْحَةِ (ـَ)"
    },
    "math": {
      "numVal": 2,
      "numName": "اثْنَانِ",
      "eqDisplay": "1 + 1 = 2",
      "subDisplay": "2 - 1 = 1",
      "compDisplay": "2 > 1",
      "q1": {
        "stem": "مَا هُوَ اسْمُ الرَّقْمِ (2) بِالعَرَبِيَّةِ؟",
        "focus": "2",
        "ans": "اثْنَانِ",
        "wrong": [
          "وَاحِدٌ",
          "ثَلَاثَةٌ",
          "عِشْرُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "2 - 1 = ؟",
        "ans": "1 (وَاحِدٌ)",
        "wrong": [
          "2 (اثْنَانِ)",
          "3 (ثَلَاثَةٌ)",
          "4 (أَرْبَعَةٌ)"
        ]
      }
    },
    "sport": {
      "title": "تَقَاطُعُ الأَنْفِ وَالأُذُنِ",
      "middleText": "أَلْمِسُ أَنْفِي بِيَدٍ وَأُذُنِي بِاليَدِ الأُخْرَى مُتَقَاطِعَتَيْنِ ثُمَّ أُصَفِّقُ وَأُبَدِّلُ بَيْنَهُمَا. يُنَشِّطُ هٰذَا التَّمْرِينُ التَّوَاصُلَ بَيْنَ فِصَّيِ الدِّمَاغِ وَيَزِيدُ سُرْعَةَ الِانْتِبَاهْ."
    },
    "sci": {
      "title": "مَصْنَعُ الطَّاقَةِ: الهَضْمُ وَالتَّنَفُّسُ وَالدَّوَرَانُ",
      "summaryThird": "يَهْضِمُ الجِهَازُ الهَضْمِيُّ الغِذَاءَ الطَّيِّبَ وَتَسْتَخْلِصُ الرِّئَتَانِ الأُكْسِجِينَ مِنَ الهَوَاءِ، ثُمَّ يَضُخُّ القَلْبُ الدَّمَ المَحَمَّلَ بِالغِذَاءِ وَالأُكْسِجِينِ لِكُلِّ خَلِيَّةٍ فِي الجِسْمْ.",
      "focusConcept": "القَلْبُ وَالرِّئَتَانِ",
      "factAns": "تَوْزِيعُ الأُكْسِجِينِ وَالطَّاقَةِ لِلجِسْمْ"
    },
    "rightsSummary": {
      "title": "حَقُّ النَّفْسِ وَالجَسَدِ (حُور وَسُرُور - 2)",
      "storySentence": "عَرَفَتْ حُورُ أَنَّ نَفْسَنَا وَجَسَدَنَا أَمَانَةٌ مِنَ اللهِ، فَحَقُّهَا عَلَيْنَا أَنْ نُغَذِّيَهَا بِالطَّيِّبَاتِ وَنَحْفَظَهَا مِنَ الأَذَى وَالكَسَلْ.",
      "applyAction": "أُحَافِظُ عَلَى نَظَافَةِ جِسْمِي وَأَسْتَعْمِلُ طَاقَتِي فِي الخَيْرِ وَالتَّعَلُّمْ."
    },
    "rightsFullTitle": "(2) حق النفس",
    "rightsQuote": "وَأَمَّا حَقُّ نَفْسِكَ عَلَيْكَ فَأَنْ تَسْتَوْفِيَهَا فِي طَاعَةِ اللهِ فَتُؤَدّي إلَى لِسَانِكَ حَقَّهُ وَإلَى سَمْعِك حَقَّهُ وَإلَى بَصَرِكَ حَقّهُ وَإلَى يَدِكَ حَقَّهَا وَإلَى رِجْلِك حَقَّهَا وَإلَى بَطْنِكَ حَقَّهُ وَإلَى فَرْجِكَ حَقَّهُ وَتَسْتَعِينَ باللهِ عَلَى ذَلِك.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (2) حق النفس",
        "text": "وَأَمَّا حَقُّ نَفْسِكَ عَلَيْكَ فَأَنْ تَسْتَوْفِيَهَا فِي طَاعَةِ اللهِ فَتُؤَدّي إلَى لِسَانِكَ حَقَّهُ وَإلَى سَمْعِك حَقَّهُ وَإلَى بَصَرِكَ حَقّهُ وَإلَى يَدِكَ حَقَّهَا وَإلَى رِجْلِك حَقَّهَا وَإلَى بَطْنِكَ حَقَّهُ وَإلَى فَرْجِكَ حَقَّهُ وَتَسْتَعِينَ باللهِ عَلَى ذَلِك. — وَفِي سِيرَةِ أَيُّوبُ (ع): آدَابُ الاغْتِسَالِ وَاللِّبَاسِ النَّظِيفِ وَالوَفَاءِ الأُسَرِيِّ: تَعَلُّمُ آدَابِ الاغْتِسَالِ بِالمَاءِ البَارِدِ لِطَهَارَةِ البَدَنِ، وَارْتِدَاءِ الثِّيَابِ النَّظِيفَةِ السَّاتِرَةِ (كَالحُلَّةِ الخَضْرَاءِ)، وَحِفْظِ الوَفَاءِ وَالمَوَدَّةِ وَالرِّفْقِ دَاخِلَ الأُسْرَةِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق النفس",
        "text": "خرجت حور إلى اجتماع عائلي. سلمت وجلست، وكان الكبار يتحدثون عن حق النفس: أن تستوفيه في طاعة الله. سألت حور أمها: \"أمي، ماذا يعني استيفاء حق النفس؟\" ابتسمت الأم وقالت: \"من يريد أن يكون جيدًا بحق نفسه وذاته، لابد أن يجعل جوارحه – اللسان، السمع، البصر، اليد، الرجل، والفرج – في طاعة الله وعدم المعصية.\" ثم ذكرتها الأم بمواقف من حياتها: \"أتذكرين عندما جئتِ لتخبريني عن صديقاتك اللواتي تشاجرن؟ قلت لك: توقفي يا عزيزتي، فلا تذكريهن إلا بخير. وإذا أردت الاستعلام عن شيء، فسمي المواقف والأفعال فقط، لا الأشخاص فهو حق لسانك عليك.\" قالت حور: \"اه تذكرت فهمت يا أمي.\" وأثناء حديثهما، ظهر إعلان غير مناسب على التلفاز. فقالت حور:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق النفس",
        "text": "\"أمي، هذا الإعلان يحوي غناءً ومشاهد غير جيدة اليس من حق نفسي ألا أراه أو أسمعه .\" أضافت حور \"وأيضًا، اليدان والرجلان يجب ألا يتحركا إلا للصلاة أو الطاعة، لا للأذى أو المعصية.\" ابتسمت الأم وقالت: \"أحسنتِ يا صغيرتي. وبقي حق النفس بالعفاف ومنع ما لا يحل لك من الغرباء.\" قالت حور: \"آه يا أمي، لذلك أرتدي حجابي لأحمي نفسي وأحصنها، حتى أصبح أماً صالحة مثلك.\" قالت الأم: \"أجل يا صغيرتي، وتكوني متزنة المشاعر والعطاء، لتبني أسرة جميلة من أفراد مثلك.\" همست حور: \"كم أحبك يا أمي.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الأُولَى: جِسْمُ الإِنْسَانِ",
      "topic": "الدَّرْسُ الثَّانِي: تَكَامُلُ الحَرَكَةِ وَمَصْنَعُ الطَّاقَةِ وَالحَيَاةِ (الهَضْمِيُّ، التَّنَفُّسِيُّ، الدَّوْرِيُّ، البَوْلِيُّ)",
      "coverImg": "assets/y7/scince/s2.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s2.1.jpg",
          "text": "الشَّرِيحَةُ (4) تَكَامُلُ الحَرَكَةِ وَالحِمَايَةِ: تَعْمَلُ العِظَامُ وَالعَضَلَاتُ وَالجِلْدُ كَفَرِيقٍ وَاحِدٍ بِتَنْسِيقٍ سَرِيعٍ مِنَ الدِّمَاغِ؛ فَالهَيْكَلُ العَظْمِيُّ يَسْنِدُ الجِسْمَ، وَالعَضَلَاتُ تُحَرِّكُ الخُطُوَاتِ، وَالجِلْدُ يَحْمِي مِنَ الخَارِجِ."
        },
        {
          "img": "assets/y7/scince/s2.2.jpg",
          "text": "الشَّرِيحَةُ (5) الجِهَازُ الهَضْمِيُّ — تَحْوِيلُ الغِذَاءِ لِوَقُودٍ: يُحَوِّلُ الطَّعَامَ لِطَاقَةٍ وَيَمْتَصُّ المُغَذِّيَاتِ وَالمَاءَ؛ وَيَتَكَوَّنُ مِنَ الفَمِ وَالأَسْنَانِ وَالمَرِيءِ وَالمَعِدَةِ وَالكَبِدِ وَالبَنْكِرْيَاسِ وَالأَمْعَاءِ، وَنَحْمِيهِ بِالمَضْغِ الجَيِّدِ وَالأَلْيَافِ وَغَسْلِ اليَدَيْنِ."
        },
        {
          "img": "assets/y7/scince/s2.3.jpg",
          "text": "الشَّرِيحَةُ (6) الجِهَازُ التَّنَفُّسِيُّ — بَوَّابَةُ الأُكْسِجِينِ: يُدْخِلُ الأُكْسِجِينَ بِالشَّهِيقِ وَيُخْرِجُ ثَانِي أُكْسِيدِ الكَرْبُونِ بِالزَّفِيرِ؛ وَيَتَكَوَّنُ مِنَ الأَنْفِ وَالبُلْعُومِ وَالقَصَبَةِ الهَوَائِيَّةِ وَالرِّئَتَيْنِ وَالشُّعَبِ الهَوَائِيَّةِ وَالحِجَابِ الحَاجِزِ."
        },
        {
          "img": "assets/y7/scince/s2.4.jpg",
          "text": "الشَّرِيحَةُ (7) الجِهَازُ الدَّوْرِيُّ — شَبَكَةُ النَّقْلِ وَالتَّوْزِيعِ: يَنْقُلُ الأُكْسِجِينَ وَالغِذَاءَ لِلْخَلَايَا عَبْرَ القَلْبِ وَالشَّرَايِينِ وَالأَوْرِدَةِ وَالشُّعَيْرَاتِ الدَّمَوِيَّةِ، وَنُقَوِّيهِ بِالرِّيَاضَةِ وَالغِذَاءِ الصِّحِّيِّ وَتَجَنُّبِ الأَطْعِمَةِ الضَّارَّةِ."
        },
        {
          "img": "assets/y7/scince/s2.5.jpg",
          "text": "الشَّرِيحَةُ (8) الجِهَازُ البَوْلِيُّ — مَحَطَّةُ التَّنْقِيَةِ: يُصَفِّي الدَّمَ مِنَ السُّمُومِ وَيَحْفَظُ تَوَازُنَ المَاءِ وَالأَمْلَاحِ؛ وَيَتَكَوَّنُ مِنَ الكُلْيَتَيْنِ وَالحَالِبَيْنِ وَالمَثَانَةِ البَوْلِيَّةِ وَمَجْرَى البَوْلِ، وَنَحْمِيهِ بِشُرْبِ المَاءِ وَتَقْلِيلِ الأَمْلَاحِ وَتَجَنُّبِ حَبْسِ البَوْلِ."
        }
      ],
      "text": "الشَّرِيحَةُ (4) تَكَامُلُ الحَرَكَةِ وَالحِمَايَةِ: تَعْمَلُ العِظَامُ وَالعَضَلَاتُ وَالجِلْدُ كَفَرِيقٍ وَاحِدٍ بِتَنْسِيقٍ سَرِيعٍ مِنَ الدِّمَاغِ؛ فَالهَيْكَلُ العَظْمِيُّ يَسْنِدُ الجِسْمَ، وَالعَضَلَاتُ تُحَرِّكُ الخُطُوَاتِ، وَالجِلْدُ يَحْمِي مِنَ الخَارِجِ. الشَّرِيحَةُ (5) الجِهَازُ الهَضْمِيُّ — تَحْوِيلُ الغِذَاءِ لِوَقُودٍ: يُحَوِّلُ الطَّعَامَ لِطَاقَةٍ وَيَمْتَصُّ المُغَذِّيَاتِ وَالمَاءَ؛ وَيَتَكَوَّنُ مِنَ الفَمِ وَالأَسْنَانِ وَالمَرِيءِ وَالمَعِدَةِ وَالكَبِدِ وَالبَنْكِرْيَاسِ وَالأَمْعَاءِ، وَنَحْمِيهِ بِالمَضْغِ الجَيِّدِ وَالأَلْيَافِ وَغَسْلِ اليَدَيْنِ. الشَّرِيحَةُ (6) الجِهَازُ التَّنَفُّسِيُّ — بَوَّابَةُ الأُكْسِجِينِ: يُدْخِلُ الأُكْسِجِينَ بِالشَّهِيقِ وَيُخْرِجُ ثَانِي أُكْسِيدِ الكَرْبُونِ بِالزَّفِيرِ؛ وَيَتَكَوَّنُ مِنَ الأَنْفِ وَالبُلْعُومِ وَالقَصَبَةِ الهَوَائِيَّةِ وَالرِّئَتَيْنِ وَالشُّعَبِ الهَوَائِيَّةِ وَالحِجَابِ الحَاجِزِ. الشَّرِيحَةُ (7) الجِهَازُ الدَّوْرِيُّ — شَبَكَةُ النَّقْلِ وَالتَّوْزِيعِ: يَنْقُلُ الأُكْسِجِينَ وَالغِذَاءَ لِلْخَلَايَا عَبْرَ القَلْبِ وَالشَّرَايِينِ وَالأَوْرِدَةِ وَالشُّعَيْرَاتِ الدَّمَوِيَّةِ، وَنُقَوِّيهِ بِالرِّيَاضَةِ وَالغِذَاءِ الصِّحِّيِّ وَتَجَنُّبِ الأَطْعِمَةِ الضَّارَّةِ. الشَّرِيحَةُ (8) الجِهَازُ البَوْلِيُّ — مَحَطَّةُ التَّنْقِيَةِ: يُصَفِّي الدَّمَ مِنَ السُّمُومِ وَيَحْفَظُ تَوَازُنَ المَاءِ وَالأَمْلَاحِ؛ وَيَتَكَوَّنُ مِنَ الكُلْيَتَيْنِ وَالحَالِبَيْنِ وَالمَثَانَةِ البَوْلِيَّةِ وَمَجْرَى البَوْلِ، وَنَحْمِيهِ بِشُرْبِ المَاءِ وَتَقْلِيلِ الأَمْلَاحِ وَتَجَنُّبِ حَبْسِ البَوْلِ.",
      "q1": {
        "q": "مَا الجِهَازُ الَّذِي يُحَوِّلُ الطَّعَامَ إِلَى طَاقَةٍ وَيَشْمَلُ الفَمَ وَالمَرِيءَ وَالمَعِدَةَ وَالكَبِدَ وَالأَمْعَاءَ؟",
        "focusWord": "الجِهَازُ الهَضْمِيُّ",
        "options": [
          {
            "text": "الجِهَازُ الهَضْمِيُّ",
            "correct": true
          },
          {
            "text": "الجِهَازُ التَّنَفُّسِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ البَوْلِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ الهَيْكَلِيُّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا العُضْوُ الَّذِي يَضُخُّ الدَّمَ فِي الشَّرَايِينِ وَالأَوْرِدَةِ لِنَقْلِ الأُكْسِجِينِ وَالغِذَاءِ فِي الجِهَازِ الدَّوْرِيِّ؟",
        "focusWord": "القَلْبُ",
        "options": [
          {
            "text": "القَلْبُ",
            "correct": true
          },
          {
            "text": "المَعِدَةُ",
            "correct": false
          },
          {
            "text": "المَثَانَةُ",
            "correct": false
          },
          {
            "text": "الحَالِبُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا وَظِيفَةُ الكُلْيَتَيْنِ فِي الجِهَازِ البَوْلِيِّ (مَحَطَّةِ التَّنْقِيَةِ)؟",
        "focusWord": "تَصْفِيَةُ الدَّمِ",
        "options": [
          {
            "text": "تَصْفِيَةُ الدَّمِ مِنَ السُّمُومِ وَضَبْطُ تَوَازُنِ المَاءِ وَالأَمْلَاحِ",
            "correct": true
          },
          {
            "text": "مَضْغُ الطَّعَامِ وَابْتِلَاعُهُ",
            "correct": false
          },
          {
            "text": "تَبَادُلُ الغَازَاتِ فِي الشَّهِيقِ",
            "correct": false
          },
          {
            "text": "تَحْرِيكُ المَفَاصِلِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الجِهَازُ الهَضْمِيُّ",
          "left": "المَعِدَةُ وَالكَبِدُ وَالأَمْعَاءُ لِتَحْوِيلِ الغِذَاءِ لِوَقُودٍ"
        },
        {
          "right": "الجِهَازُ التَّنَفُّسِيُّ",
          "left": "الرِّئَتَانِ وَالحِجَابُ الحَاجِزُ لِإِدْخَالِ الأُكْسِجِينِ"
        },
        {
          "right": "الجِهَازُ البَوْلِيُّ",
          "left": "الكُلْيَتَانِ وَالحَالِبَانِ لِتَصْفِيَةِ الدَّمِ مِنَ السُّمُومِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَادَاتِ حِمَايَةِ مَصْنَعِ الطَّاقَةِ وَالحَيَاةِ فِي جِسْمِكَ:",
        "correct": [
          "شُرْبُ الكَثِيرِ مِنَ المَاءِ",
          "المَضْغُ الجَيِّدُ وَغَسْلُ اليَدَيْنِ",
          "اسْتِنْشَاقُ الهَوَاءِ النَّقِيِّ",
          "تَقْلِيلُ الأَمْلَاحِ وَتَجَنُّبُ حَبْسِ البَوْلِ"
        ],
        "wrong": [
          "الأَطْعِمَةُ الضَّارَّةُ وَالمَالِحَةُ",
          "حَبْسُ البَوْلِ وَقِلَّةُ المَاءِ"
        ]
      },
      "applyStep": "أَمْضَغُ طَعَامِي جَيِّدًا وَأَشْرَبُ الكَثِيرَ مِنَ المَاءِ النَّقِيِّ لِحِمَايَةِ جِهَازِي الهَضْمِيِّ وَالبَوْلِيِّ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt2.jpg",
      "title": "تَمَارِينُ التَّآزُرِ البَصَرِيِّ وَالدِّقَّةِ الحَرَكِيَّةِ (المَجْمُوعَةُ الثَّانِيَةُ: 8..14)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِتَقْوِيَةِ التَّرْكِيزِ البَصَرِيِّ وَتَنَاسُقِ حَرَكَةِ اليَدَيْنِ!",
      "slideText": "👁️✋ تَمَارِينُ التَّآزُرِ البَصَرِيِّ وَالدِّقَّةِ الحَرَكِيَّةِ (المَجْمُوعَةُ الثَّانِيَةُ — التَّمَارِينُ 8 إِلَى 14): (8) الفِيلُ المُفَكِّرُ: إِلْصَاقُ الأُذُنِ بِالكَتِفِ وَرَسْمُ علامة (∞) بِالذِّرَاعِ مَعَ تَتَبُّعِ الأَصَابِعِ بِالعَيْنَيْنِ. (9) تَتَبُّعُ البَنْدُولِ بِالعَيْنَيْنِ مَعَ تَثْبِيتِ الرَّأْسِ. (10) رَمْيَةُ التَّبْدِيلِ لِلْكُرَةِ بَيْنَ اليَدَيْنِ. (11) الإِيقَاعُ الرُّبَاعِيُّ (ضَرْبُ الفَخِذَيْنِ ثُمَّ التَّصْفِيقُ ثُمَّ لَمْسُ الكَتِفَيْنِ بِتَقَاطُعٍ ثُمَّ التَّصْفِيقُ). (12) أَصَابِعُ البِيَانُو العَكْسِيَّةُ. (13) القَبْضَةُ وَالكَفُّ بِالتَّبَادُلِ. (14) نَقْلُ الكُرَاتِ بِالمِلْقَطِ عَبْرَ خَطِّ المُنْتَصَفِ.",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (الفِيلِ المُفَكِّرِ) رَقْمِ (8) لِتَقْوِيَةِ التَّآزُرِ البَصَرِيِّ؟",
        "focusWord": "الفِيلُ المُفَكِّرُ",
        "options": [
          {
            "text": "يُلْصِقُ أُذُنَهُ بِكَتِفِهِ وَيَمُدُّ ذِرَاعَهُ لِيَرْسُمَ عَلَامَةَ (∞) فِي الهَوَاءِ مَعَ تَتَبُّعِ أَصَابِعِهِ بِعَيْنَيْهِ",
            "correct": true
          },
          {
            "text": "يُغْمِضُ عَيْنَيْهِ وَيَقْفِزُ فِي المَكَانِ",
            "correct": false
          },
          {
            "text": "يَجْرِي لِلْخَلْفِ بِسُرْعَةٍ",
            "correct": false
          },
          {
            "text": "يَسْتَلْقِي عَلَى بَطْنِهِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا قَاعِدَةُ تَمْرِينِ (تَتَبُّعِ البَنْدُولِ) رَقْمِ (9)؟",
        "focusWord": "تَتَبُّعُ البَنْدُولِ",
        "options": [
          {
            "text": "تَثْبِيتُ الرَّأْسِ تَمَامًا وَتَتَبُّعُ حَرَكَةِ الكُرَةِ المُتَأَرْجِحَةِ يَمِينًا وَيَسَارًا بِالعَيْنَيْنِ فَقَطْ",
            "correct": true
          },
          {
            "text": "تَحْرِيكُ الرَّأْسِ بِسُرْعَةٍ شَدِيدَةٍ",
            "correct": false
          },
          {
            "text": "رَمْيُ الكُرَةِ بَعِيدًا",
            "correct": false
          },
          {
            "text": "إِغْلَاقُ العَيْنَيْنِ أَثْنَاءَ التَّأَرْجُحِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَاذَا نَفْعَلُ فِي تَمْرِينِ (أَصَابِعِ البِيَانُو العَكْسِيَّةِ) وَتَمْرِينِ (القَبْضَةِ وَالكَفِّ)؟",
        "focusWord": "القَبْضَةُ وَالكَفُّ",
        "options": [
          {
            "text": "نَرْفَعُ إِبْهَامَ اليُمْنَى مَعَ خِنْصِرِ اليُسْرَى، وَنُغْلِقُ يَدًا كَقَبْضَةٍ مَعَ فَتْحِ الكَفِّ الآخَرِ بِالتَّنَاوُبِ",
            "correct": true
          },
          {
            "text": "نَضْرِبُ الطَّاوِلَةَ بِقُوَّةٍ",
            "correct": false
          },
          {
            "text": "نَشْبِكُ الأَصَابِعَ بِلَا حَرَكَةٍ",
            "correct": false
          },
          {
            "text": "نَمْشِي عَلَى الحَبْلِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الفِيلُ المُفَكِّرُ (8)",
          "left": "رَسْمُ (∞) بِالذِّرَاعِ مَعَ إِلْصَاقِ الأُذُنِ بِالكَتِفِ"
        },
        {
          "right": "تَتَبُّعُ البَنْدُولِ (9)",
          "left": "تَثْبِيتُ الرَّأْسِ وَمُتَابَعَةُ الكُرَةِ بِالعَيْنَيْنِ فَقَطْ"
        },
        {
          "right": "نَقْلُ الكُرَاتِ بِالمِلْقَطِ (14)",
          "left": "عُبُورُ خَطِّ المُنْتَصَفِ مِنْ أَقْصَى اليَمِينِ لِأَقْصَى اليَسَارِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ التَّآزُرِ البَصَرِيِّ وَالدِّقَّةِ الحَرَكِيَّةِ (8..14):",
        "correct": [
          "الفِيلُ المُفَكِّرُ وَتَتَبُّعُ البَنْدُولِ",
          "رَمْيَةُ التَّبْدِيلِ بَيْنَ اليَدَيْنِ",
          "الإِيقَاعُ الرُّبَاعِيُّ وَأَصَابِعُ البِيَانُو",
          "القَبْضَةُ وَالكَفُّ وَنَقْلُ الكُرَاتِ بِالمِلْقَطِ"
        ],
        "wrong": [
          "تَشْتِيتُ البَصَرِ أَثْنَاءَ التَّمْرِينِ",
          "إِهْمَالُ تَدْرِيبِ اليَدِ اليُسْرَى"
        ]
      },
      "applyStep": "أُدَرِّبُ عَيْنَيَّ وَيَدَيَّ يَوْمِيًّا عَلَى تَمْرِينِ الفِيلِ المُفَكِّرِ وَرَمْيَةِ التَّبْدِيلِ وَالقَبْضَةِ وَالكَفِّ."
    }
  },
  {
    "w": 3,
    "secNum": 1,
    "heavenName": "سَمَاءُ السَّبْتِ العُلْيَا (أ ب ج د)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الأُولَى: عُلُومُ جِسْمِ الإِنْسَانِ وَالأَحْيَاءِ الخَلَوِيَّةِ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "ج",
    "jummal": 3,
    "prophet": "يُونُسُ (ع)",
    "virtue": "التَّسْبِيحُ",
    "unitHeader": "الوَحْدَةُ الثَّالِثَةُ: نَبِيُّ اللهِ يُونُسُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "ابْتَلَعَ الحُوتُ العِمْلَاقُ نَبِيَّ اللهِ يُونُسَ (ع) فِي أَعْمَاقِ البَحْرِ دُونَ أَنْ يُؤْذِيَهُ، فَسَبَّحَ اللهَ فِي الظُّلُمَاتِ قَائِلًا: (لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ) فَنَجَّاهُ اللهْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): نَارُ العِنَادِ فِي قُلُوبِ القَوْمِ الأَوَّلِ، وَاندِفَاعُ العَابِدِ «تَنُوخَا» بِطَبْعِ النَّارِ لِطَلَبِ العَذَابِ، وَخُرُوجُ يُونُسَ مُغَاضِبًا لِقَوْمِهِ غَيْرَةً لِلهِ (تَرْكُ الأَوْلَى). B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ الَّتِي زَيَّنَتْ عِبَادَةَ الأَصْنَامِ، وَالرِّيحُ العَاصِفَةُ فِي البَحْرِ الَّتِي أَحَاطَتْ بِالسَّفِينَةِ حَتَّى أُجْرِيَتِ القُرْعَةُ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): حِكْمَةُ العَالِمِ «رُوبِيلَ» الَّذِي غَلَبَ بِعَقْلِهِ وَعِلْمِهِ فَأَرْشَدَ القَوْمَ الأَوَّلَ إِلَى التَّوْبَةِ فَوْقَ الجَبَلِ، وَإِنْبَاتُ الأَرْضِ شَجَرَةَ اليَقْطِينِ، وَعَقْلُ القَوْمِ الثَّانِي الَّذِينَ آمَنُوا بِالحِكْمَةِ دُونَ عِنَادٍ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): طَوَافُ الحُوتِ بِيُونُسَ فِي البِحَارِ السَّبْعَةِ وَسَمَاعُهُ تَسْبِيحَ كَائِنَاتِ المَاءِ، وَدُمُوعُ التَّوْبَةِ وَالطَّاعَةِ، وَإِقْبَالُ القَوْمِ الثَّانِي عَلَى الإِيمَانِ بِنَقَاءٍ وَتَوَاضُعٍ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ السَّبْتِ العَظِيمْ، يَأْتِي النَّبِيُّ الرَّقْمُ ثَلَاثَةٍ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلْ، وَهُوَ نَبِيُّ اللهِ يُونُسُ بْنُ مَتَّى ذُو النُّونِ عَلَيْهِ السَّلَامْ. أَرْسَلَهُ اللهُ إِلَى قَوْمِهِ الأَوَّلِينَ فِي أَرْضِ نِينَوَى لِيَدْعُوَهُمْ بِالحِكْمَةِ وَالعَقْلِ إِلَى عِبَادَةِ اللهِ الوَاحِدِ وَتَرْكِ الأَصْنَامْ. وَكَانَ فِي قَوْمِهِ رَجُلَانِ مُؤْمِنَانْ، أَحَدُهُمَا عَابِدٌ اسْمُهُ تَنُوخَا غَلَبَتْ عَلَيْهِ نَارُ الغَضَبِ وَالاسْتِعْجَالْ، وَالآخَرُ عَالِمٌ حَكِيمٌ اسْمُهُ رُوبِيلُ يَتَفَكَّرُ بِعَقْلِهِ وَيُحِبُّ الصَّبْرَ وَالإِمْهَالْ. أَمَّا أَكْثَرُ القَوْمِ فَخَدَعَتْهُمْ رِيحُ الوَهْمِ وَالكَذِبْ، وَاشْتَعَلَتْ فِي قُلُوبِهِمْ نَارُ العِنَادِ فَكَذَّبُوا نَبِيَّهُمُ الكَرِيمْ. فأَشَارَ العَابِدُ تَنُوخَا عَلَى يُونُسَ بِالدُّعَاءِ عَلَيْهِمْ، لٰكِنَّ العَالِمَ رُوبِيلَ نَصَحَهُ بِالصَّبْرِ لَعَلَّهُمْ يَرْجِعُونْ. فَلَمَّا زَادَ عِنَادُهُمْ أَخْبَرَهُمْ يُونُسُ أَنَّ العَذَابَ سَيَنْزِلُ بَعْدَ ثَلَاثَةِ أَيَّامْ، ثُمَّ خَرَجَ مِنْ قَرْيَتِهِمْ مُغَاضِبًا لَهُمْ غَيْرَةً لِرَبِّهِ قَبْلَ أَنْ يَأْتِيَهُ الإِذْنْ، وَظَنَّ أَنَّ اللهَ لَنْ يُضَيِّقَ عَلَيْهِ فِي مَسِيرِهِ فَتَرَكَ الأَوْلَى فِي الصَّبْرِ وَالانْتِظَارْ. وَلَمَّا جَاءَ يَوْمُ الأَرْبِعَاءِ وَرَأَى القَوْمُ الأَوَّلُونَ آيَاتِ العَذَابِ وَالغَيْمَةَ السَّوْدَاءَ انْكَشَفَ عَنْهُمُ الوَهْمْ، فَذَهَبُوا إِلَى العَالِمِ الحَكِيمِ رُوبِيلَ يَسْأَلُونَهُ النَّجَاةْ. فَأَرْشَدَهُمْ بِنُورِ عَقْلِهِ أَنْ يَصْعَدُوا بِأَقْدَامِهِمْ إِلَى أَعْلَى الجَبَلِ الكَبِيرْ، وَيَرُدُّوا المَظَالِمَ وَيَفْصِلُوا الصِّغَارَ عَنْ أُمَّهَاتِهِمْ وَيَتَوَاضَعُوا لِلهْ، فَصَارَ الجَمِيعُ يَضِجُّ بِالبُكَاءِ وَالدُّعَاءِ وَرَجَعَ القَوْمُ الأَوَّلُونَ إِلَى رَبِّهِمْ بِتَوْبَةٍ صَادِقَةْ، فَكَشَفَ اللهُ عَنْهُمُ العَذَابَ وَنَجَّى قَرْيَتَهُمْ بِنُورِ العِلْمِ وَالعَقْلْ.",
      "وَفِي ذٰلِكَ الوَقْتِ مَشَى يُونُسُ إِلَى شَاطِئِ البَحْرِ وَرَكِبَ فِي سَفِينَةٍ مَمْلُوءَةٍ بِالرُّكَّابْ. وَفِي وَسَطِ البَحْرِ هَبَّتِ الرِّيحُ وَعَلَا مَوْجٌ عَظِيمْ، وَوَقَفَتِ السَّفِينَةُ لِأَنَّ حُوتًا كَبِيرًا هُوَ النُّونُ أَرْسَلَهُ اللهُ كَـجُنْدٍ مِنْ جُنُودِهِ فَفَتَحَ فَمَهُ أَمَامَ السَّفِينَةِ فِي المَاءْ. فَأَجْرَى الرُّكَّابُ القُرْعَةَ ثَلَاثَ مَرَّاتْ، وَفِي كُلِّ مَرَّةٍ كَانَتْ تَقَعُ عَلَى يُونُسَ عَلَيْهِ السَّلَامْ. فَعَرَفَ بِعَقْلِهِ أَنَّ هٰذَا أَمْرُ اللهْ، فَنَزَلَ فِي البَحْرِ وَأَوْحَى اللهُ إِلَى الحُوتِ أَلَّا يَجْرَحَ لَهُ لَحْمًا أَوْ يَكْسِرَ لَهُ أَيَّ عَظْمْ، لِأَنَّ يُونُسَ لَيْسَ طَعَامًا لَهُ بَلْ بَطْنُهُ مَسْجِدٌ وَحِرْزٌ لِنَبِيِّ اللهْ.",
      "اسْتَقَرَّ يُونُسُ فِي بَطْنِ الحُوتِ كَمَا تَسْتَقِرُّ النُّقْطَةُ فِي بَطْنِ حَرْفِ الجِيمْ، وَطَافَ بِهِ الحُوتُ فِي البِحَارِ السَّبْعَةِ فَرَأَى عَجَائِبَ خَلْقِ اللهِ فِي أَعْمَاقِ المِيَاهْ. وَفِي الظُّلُمَاتِ الثَّلَاثْ، ظُلْمَةِ اللَّيْلِ وَظُلْمَةِ البَحْرِ وَظُلْمَةِ بَطْنِ الحُوتْ، أَنْصَتَ يُونُسُ بِأُذُنِهِ فَسَمِعَ تَسْبِيحَ الحَصَى وَكَائِنَاتِ البَحْرِ لِخَالِقِهَا العَظِيمْ. فَرَكَعَ وَسَجَدَ لِلهِ فِي سَجْدَةٍ طَوِيلَةٍ وَقَلْبُهُ فِي سُجُودٍ خَاشِعٍ وَنَادَى بِلِسَانِهِ قَائِلًا بِإِيمَانْ، لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينْ. فَلَوْلَا أَنَّهُ كَانَ مِنَ المُسَبِّحِينَ لَبَقِيَ فِي بَطْنِهِ إِلَى يَوْمِ الدِّينْ، لٰكِنَّ اللهَ سَمِعَ تَسْبِيحَهُ بَعْدَ ثَلَاثَةِ أَيَّامٍ وَكَانَ لَهُ أَسْرَعَ الفَرَجْ، لِأَنَّ اللهَ يُنَجِّي المُؤْمِنِينَ الصَّادِقِينْ.",
      "أَمَرَ اللهُ الحُوتَ فَقَذَفَ يُونُسَ عَلَى السَّاحِلِ بِسَلَامْ، وَكَانَ مُتْعَبًا ضَعِيفًا وَجَائِعًا يَحْتَاجُ إِلَى الغِذَاءِ وَالسَّتْرْ. فَأَنْبَتَ اللهُ فَوْقَهُ فِي الحَالِ شَجَرَةً خَضْرَاءَ مِنْ يَقْطِينْ، فَكَانَ لَهَا ظِلٌّ عَجِيبٌ بِأَوْرَاقِهَا العَرِيضَةِ النَّاعِمَةِ الَّتِي سَتَرَتْ جَسَدَهُ الطَّاهِرَ وَحَمَتْ نَعُومَةَ جِلْدِهِ مِنْ حَرِّ الشَّمْسِ وَأَبْعَدَتْ عَنْهُ الذُّبَابْ. وَأَرْسَلَ اللهُ إِلَيْهِ غَزَالَةً بَرِّيَّةً تَأْتِيهِ كُلَّ صَبَاحٍ وَمَسَاءْ، فَيَشْرَبُ مِنْ لَبَنِهَا النَّقِيِّ وَيَأْكُلُ مِنْ ثَمَرِ اليَقْطِينِ النَّافِعِ لِلْبَطْنِ وَالعَقْلِ حَتَّى قَوِيَ بَدَنُهُ وَتَطَهَّرَ بِالمَاءْ.",
      "وَلَمَّا يَبِسَتْ شَجَرَةُ اليَقْطِينِ حَزِنَ يُونُسُ عَلَيْهَا فِي العَرَاءْ، فَأَوْحَى اللهُ إِلَيْهِ أَنَّكَ حَزِنْتَ عَلَى شَجَرَةٍ وَاحِدَةٍ لَمْ تَزْرَعْهَا بِيَدِكْ، فَكَيْفَ لَا أَرْحَمُ قَوْمَكَ الَّذِينَ تَابُوا وَأَنَابُوا إِلَيَّ بِصِدْقْ. ثُمَّ أَرْسَلَهُ اللهُ فِي بَعْثَةٍ جَدِيدَةٍ إِلَى قَوْمٍ آخَرِينَ هُمُ القَوْمُ الثَّانِي الَّذِينَ بَلَغَ عَدَدُهُمْ مِائَةَ أَلْفٍ أَوْ يَزِيدُونْ، فَدَعَاهُمْ يُونُسُ إِلَى اللهِ فَفَكَّرُوا بِعُقُولِهِمْ وَآمَنُوا بِهِ جَمِيعًا مِنْ غَيْرِ عِنَادْ، فَرَضِيَ اللهُ عَنْهُمْ وَمَتَّعَهُمْ فِي الحَيَاةِ بِالخَيْرِ وَالبَرَكَةِ إِلَى حِينْ، وَعَاشُوا مَعَ نَبِيِّهِمْ فِي عِلْمٍ وَطَهَارَةٍ وَسَلَامْ."
    ],
    "words": [
      {
        "word": "سَجْدَةٍ",
        "desc": "وسط متصل / ساكن: ـجْـ",
        "raw": "سَجْدَةٍ (وسط متصل / ساكن: ـجْـ)"
      },
      {
        "word": "الفَرَجْ",
        "desc": "آخر منفصل / ساكن وقفا: جْ",
        "raw": "الفَرَجْ (آخر منفصل / ساكن وقفا: جْ)"
      },
      {
        "word": "جَسَدَهُ",
        "desc": "أول منفصل / متحرك بالفتح: جَـ",
        "raw": "جَسَدَهُ (أول منفصل / متحرك بالفتح: جَـ)"
      },
      {
        "word": "الجَبَلِ",
        "desc": "أول متصل / متحرك بالفتح: ـجَـ",
        "raw": "الجَبَلِ (أول متصل / متحرك بالفتح: ـجَـ)"
      },
      {
        "word": "شَجَرَةً",
        "desc": "وسط متصل / متحرك بالفتح: ـجَـ",
        "raw": "شَجَرَةً (وسط متصل / متحرك بالفتح: ـجَـ)"
      },
      {
        "word": "رَجَعَ",
        "desc": "وسط منفصل / متحرك بالفتح: جَـ",
        "raw": "رَجَعَ (وسط منفصل / متحرك بالفتح: جَـ)"
      },
      {
        "word": "خَرَجَ",
        "desc": "آخر منفصل / متحرك بالفتح: جَ",
        "raw": "خَرَجَ (آخر منفصل / متحرك بالفتح: جَ)"
      },
      {
        "word": "جُنْدٍ",
        "desc": "أول منفصل / متحرك بالضم: جُـ",
        "raw": "جُنْدٍ (أول منفصل / متحرك بالضم: جُـ)"
      },
      {
        "word": "مَوْجٌ",
        "desc": "آخر متصل / متحرك بالضم: ـجٌ",
        "raw": "مَوْجٌ (آخر متصل / متحرك بالضم: ـجٌ)"
      },
      {
        "word": "جِلْدِهِ",
        "desc": "أول منفصل / متحرك بالكسر: جِـ",
        "raw": "جِلْدِهِ (أول منفصل / متحرك بالكسر: جِـ)"
      },
      {
        "word": "نَجَّى",
        "desc": "وسط متصل / مضعف بالفتح: ـجَّـ",
        "raw": "نَجَّى (وسط متصل / مضعف بالفتح: ـجَّـ)"
      },
      {
        "word": "يَضِجُّ",
        "desc": "آخر متصل / مضعف بالضم: ـجُّ",
        "raw": "يَضِجُّ (آخر متصل / مضعف بالضم: ـجُّ)"
      },
      {
        "word": "يُنَجِّي",
        "desc": "وسط متصل / مضعف بالكسر: ـجِّـ",
        "raw": "يُنَجِّي (وسط متصل / مضعف بالكسر: ـجِّـ)"
      },
      {
        "word": "جَائِعًا",
        "desc": "أول منفصل / ممدود بالألف: جَا",
        "raw": "جَائِعًا (أول منفصل / ممدود بالألف: جَا)"
      },
      {
        "word": "سُجُودٍ",
        "desc": "وسط متصل / ممدود بالواو: ـجُو",
        "raw": "سُجُودٍ (وسط متصل / ممدود بالواو: ـجُو)"
      },
      {
        "word": "عَجِيبٌ",
        "desc": "وسط متصل / ممدود بالياء: ـجِي",
        "raw": "عَجِيبٌ (وسط متصل / ممدود بالياء: ـجِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الجِيمِ (ج): النُّطْقُ السَّلِيمُ لِحَرْفِ الجِيمِ مِنْ مَخْرَجِ وَسَطِ اللِّسَانِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى التَّسْبِيحِ اليُونُسِيِّ: ﴿لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ﴾."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "المُنْحَنَى الجَوْفِيُّ وَالنُّقْطَةُ فِي البَطْنِ: مُشَاهَدَةُ انْحِنَاءِ حَرْفِ الجِيمِ (ج) لِيَصْنَعَ جَوْفًا وَبَطْنًا تَسْتَقِرُّ النُّقْطَةُ فِي دَاخِلِهِ كَمَا اسْتَقَرَّ يُونُسُ فِي بَطْنِ الحُوتِ، وَمُشَاهَدَةُ الشَّكْلِ الهَنْدَسِيِّ الثُّلَاثِيِّ (المُثَلَّثِ ذِي الزَّوَايَا الثَّلَاثِ)."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ يُونُسَ الكَامِلَةُ وَإِنْصَاتُ الأَعْمَاقِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ القِصَّةِ (القَوْمُ الأَوَّلُ، العَالِمُ وَالعَابِدُ، البَحْرُ وَالحُوتُ، شَجَرَةُ اليَقْطِينِ، وَالقَوْمُ الثَّانِي)، وَتَدْرِيبُ الأُذُنِ عَلَى الإِنْصَاتِ لِتَسْبِيحِ الكَائِنَاتِ وَالوَقْفِ السَّاكِنِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ ثَلَاثَةٌ (3): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (3) وَرَسْمِ حَرْفِ الجِيمِ، وَإِدْرَاكُ مَفْهُومِ الثُّلَاثِيَّةِ فِي القِصَّةِ (النَّبِيُّ الثَّالِثُ، مَهْلَةُ الأَيَّامِ الثَّلَاثَةِ، القُرْعَةُ ثَلَاثَ مَرَّاتٍ، الظُّلُمَاتُ الثَّلَاثُ، ثَلَاثَةُ أَيَّامٍ فِي بَطْنِ الحُوتِ)، وَمَهَارَةِ اليَدِ فِي التَّجْدِيفِ وَسَقْيِ الشَّجَرِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "صُعُودُ الجَبَلِ وَحَرَكَةُ السِّبَاحَةِ وَالسَّيْرِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ صُعُودِ المُرْتَفَعَاتِ، وَتَمَارِينِ حَرَكَةِ القَدَمَيْنِ فِي السِّبَاحَةِ، وَالمَشْيِ النَّشِيطِ فِي البَعْثَةِ إِلَى القَوْمِ الثَّانِي."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ اليَقْطِينِ (القَرْعِ) وَاللَّبَنِ وَعَجَائِبِ البِحَارِ: تَعَلُّمُ الفَوَائِدِ العِلْمِيَّةِ وَالغِذَائِيَّةِ لِثَمَرِ اليَقْطِينِ فِي تَقْوِيَةِ الدِّمَاغِ وَتَلْيِينِ البَطْنِ، وَفَوَائِدِ اللَّبَنِ الطَّبِيعِيِّ فِي تَجْدِيدِ قُوَّةِ الجِسْمِ، وَمَعْرِفَةِ عُلُومِ البِحَارِ السَّبْعَةِ وَالحِيتَانِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ السَّتْرِ بِأَوْرَاقِ اليَقْطِينِ وَرَدِّ الحُقُوقِ: تَعَلُّمُ كَيْفَ سَتَرَ اللهُ بَدَنَ نَبِيِّهِ يُونُسَ بِأَوْرَاقِ اليَقْطِينِ النَّاعِمَةِ وَحَمَى جِلْدَهُ مِنَ الأَذَى، وَآدَابِ تَطْهِيرِ البَدَنِ بِالمَاءِ، وَطَهَارَةِ النَّفْسِ بِرَدِّ المَظَالِمِ إِلَى أَهْلِهَا وَبِرِّ الأُمِّ (كَمَا نُسِبَ يُونُسُ إِلَى أُمِّهِ مَتَّى)."
      }
    },
    "grammar": {
      "topic": "أَقْسَامُ الكَلِمَةِ (3): الحَرْفُ",
      "rule": "الحَرْفُ كَلِمَةٌ صَغِيرَةٌ تَرْبِطُ بَيْنَ الكَلِمَاتِ لِتُتِمَّ مَعْنَى الجُمْلَةِ، مِثْلَ: (فِي، إِلَى، عَلَى، مِنْ، وَ).",
      "example": "سَبَّحَ يُونُسُ فِي بَطْنِ الحُوتِ، وَخَرَجَ إِلَى الشَّاطِئِ.",
      "focusWord": "فِي",
      "q": "أَيُّ كَلِمَةٍ فِي جُمْلَةِ «السَّمَكَةُ فِي البَحْرِ» هِيَ «حَرْفٌ» يَرْبِطُ الكَلِمَتَيْنْ؟",
      "opts": [
        "فِي",
        "السَّمَكَةُ",
        "البَحْرِ",
        "تَسْبَحُ"
      ]
    },
    "earIirab": {
      "topic": "عَلَامَةُ الجَرِّ: الكَسْرَةُ (ـِ) بَعْدَ حَرْفِ الجَرّْ",
      "rule": "كُلُّ اسْمٍ يَأْتِي بَعْدَ حَرْفِ الجَرِّ (مِنْ، إِلَى، فِي، عَلَى) نَجُرُّ آخِرَهُ بِالكَسْرَةِ (ـِ).",
      "sentence": "يَسْبَحُ الحُوتُ فِي البَحْرِ.",
      "targetWord": "البَحْرِ",
      "caseAns": "مَجْرُورٌ بِالكَسْرَةِ (ـِ)"
    },
    "math": {
      "numVal": 3,
      "numName": "ثَلَاثَةٌ",
      "eqDisplay": "1 + 2 = 3",
      "subDisplay": "3 - 1 = 2",
      "compDisplay": "3 > 2",
      "q1": {
        "stem": "مَا هُوَ اسْمُ الرَّقْمِ (3) بِالعَرَبِيَّةِ؟",
        "focus": "3",
        "ans": "ثَلَاثَةٌ",
        "wrong": [
          "اثْنَانِ",
          "أَرْبَعَةٌ",
          "ثَلَاثُونَ"
        ]
      },
      "q2": {
        "stem": "اخْتَرِ العَلَامَةَ الصَّحِيحَةَ بَيْنَ العَدَدَيْنِ (3 وَ 2):",
        "focus": "3 [ ؟ ] 2",
        "ans": "3 > 2 (أَكْبَرُ)",
        "wrong": [
          "3 < 2 (أَصْغَرُ)",
          "3 = 2 (يُسَاوِي)",
          "0"
        ]
      }
    },
    "sport": {
      "title": "لَمْسُ الكَعْبِ الخَلْفِيِّ بِالتَّبَادُلِ",
      "middleText": "أَرْفَعُ قَدَمِي خَلْفَ ظَهْرِي وَأَلْمِسُهَا بِيَدِي المُعَاكِسَةِ يَمِينًا وَيَسَارًا بِإِيقَاعٍ مُتَوَازِنْ. يُقَوِّي هٰذَا التَّمْرِينُ تَوَازُنَ السَّاقَيْنِ وَتَنَاسُقَ الحَرَكَةِ مَعَ التَّنَفُّسِ المُنْتَظَمْ."
    },
    "sci": {
      "title": "القِيَادَةُ الذَّكِيَّةُ: الدِّمَاغُ وَالحَوَاسُّ وَالمَنَاعَةُ",
      "summaryThird": "يَقُودُ الدِّمَاغُ جِسْمَ الإِنْسَانِ وَيَسْتَقْبِلُ الرَّسَائِلَ مِنَ الحَوَاسِّ الخَمْسِ عَبْرَ الأَعْصَابِ، بَيْنَمَا يَحْمِي جِهَازُ المَنَاعَةِ وَكُرَيَّاتُ الدَّمِ البَيْضَاءِ جِسْمَنَا مِنَ الجَرَاثِيمْ.",
      "focusConcept": "الدِّمَاغُ وَالأَعْصَابُ",
      "factAns": "قِيَادَةُ الجِسْمِ وَاسْتِقْبَالُ الحَوَاسّْ"
    },
    "rightsSummary": {
      "title": "حَقُّ اللِّسَانِ وَالصِّدْقِ (حُور وَسُرُور - 3)",
      "storySentence": "تَعَلَّمَ سُرُورٌ أَنَّ حَقَّ اللِّسَانِ هُوَ تَعْوِيدُهُ عَلَى الصِّدْقِ وَالكَلِمَةِ الطَّيِّبَةِ وَالتَّسْبِيحِ، وَتَجَنُّبِ الكَذِبِ أَوِ الكَلَامِ الجَارِحْ.",
      "applyAction": "أَصْدُقُ فِي قَوْلِي دَائِمًا وَأُكْثِرُ مِنْ قَوْلِ: سُبْحَانَ اللهِ وَبِحَمْدِهْ."
    },
    "rightsFullTitle": "(3) حق اللسان",
    "rightsQuote": "وَأَمَّا حَقُّ اللّسَان فَإكْرَامُهُ عَنِ الْخَنَى وتَعْوِيدُهُ عَلَى الْخَيْرِ وَحَمْلُهُ عَلَى الأَدَب وَإجْمَامُهُ إلاّ لِمَوْضِعِ الْحَاجَةِ وَالْمَنْفَعَةِ لِلدِّينِ وَالدُّنْيَا وَإعْفَاؤُهُ عَنِ الْفُضُول اُلشَّنِعَةِ الْقَلِيلَةِ الْفَائِدَةِ الَّتِي لا يُؤْمَنُ ضَرَرُهَا مَعَ قِلَّةِ عَائِدَتِهَا. وَيُعَدُّ شَاهِدَ الْعَقْلِ وَالدَّلِيلَ عَلَيْه وَتَزَيُّنُ الْعَاقِلَ بعَقْلِهِ حُسْنُ سِيرَتِهِ فِي لِسَانِهِ. وَلا قُوَّةَ إلا باللهِ الْعَلِيِّ الْعَظِيمِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (3) حق اللسان",
        "text": "وَأَمَّا حَقُّ اللّسَان فَإكْرَامُهُ عَنِ الْخَنَى وتَعْوِيدُهُ عَلَى الْخَيْرِ وَحَمْلُهُ عَلَى الأَدَب وَإجْمَامُهُ إلاّ لِمَوْضِعِ الْحَاجَةِ وَالْمَنْفَعَةِ لِلدِّينِ وَالدُّنْيَا وَإعْفَاؤُهُ عَنِ الْفُضُول اُلشَّنِعَةِ الْقَلِيلَةِ الْفَائِدَةِ الَّتِي لا يُؤْمَنُ ضَرَرُهَا مَعَ قِلَّةِ عَائِدَتِهَا. وَيُعَدُّ شَاهِدَ الْعَقْلِ وَالدَّلِيلَ عَلَيْه وَتَزَيُّنُ الْعَاقِلَ بعَقْلِهِ حُسْنُ سِيرَتِهِ فِي لِسَانِهِ. وَلا قُوَّةَ إلا باللهِ الْعَلِيِّ الْعَظِيمِ. — وَفِي سِيرَةِ يُونُسُ (ع): آدَابُ السَّتْرِ بِأَوْرَاقِ اليَقْطِينِ وَرَدِّ الحُقُوقِ: تَعَلُّمُ كَيْفَ سَتَرَ اللهُ بَدَنَ نَبِيِّهِ يُونُسَ بِأَوْرَاقِ اليَقْطِينِ النَّاعِمَةِ وَحَمَى جِلْدَهُ مِنَ الأَذَى، وَآدَابِ تَطْهِيرِ البَدَنِ بِالمَاءِ، وَطَهَارَةِ النَّفْسِ بِرَدِّ المَظَالِمِ إِلَى أَهْلِهَا وَبِرِّ الأُمِّ (كَمَا نُسِبَ يُونُسُ إِلَى أُمِّهِ مَتَّى)."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق اللسان",
        "text": "جلست حور مع أختها يلعبان بالمكعبات ويبنيان برجًا طويلًا. عندما أصبح البرج مرتفعًا، دفعته أختها بالخطأ. قالت حور بغضب: \"أيها الحمقاء!\" وبدأ الشجار، وارتفعت الأصوات، وتبادلا القصص عن أخطاء قديمة، ولم تسمح كل منهما للأخرى بالكلام. سمعت الأم صوتهما، فأتت لترى ما يحدث. روا لها القصة واستمرّا بالجدال الطويل، بلا نتيجة. انزعجت الأم من طول حديثهما، وقررت حرمانهما من اللعب بالمكعبات لمدة أسبوع. بعد قليل، جاء الأخ الكبير ووجد أخواته حزينات، لا يتحدثان مع بعضهما ولا يردان عليه."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق اللسان",
        "text": "ذهب ليخبر الأم، فجمعتهم وشرحت لهم: \"للسان حق عليكم. لو لم تستعجل حور في إهانة أختها، لما بدأ الشجار. ولو قللتم من الكلام أو اخترتم كلامًا مفيدًا، كان بالإمكان حل المشكلة قبل العقاب أو الحزن.\" وأضافت: \"المهم هو الكلام الجيد، المفيد، بالكم المناسب، لإفهام المعنى وتحقيق الخير.\" نظر الأخ إلى أخواته وقال: \"هل نستطيع بناء برج جديد يا أمي؟\" ابتسمت الأم وقالت: \"طالما فهمتم الدرس، فلا بأس.\" ضحك الأخوات وعانقوا بعضهم، وبدأوا ببناء برج جديد بروح صبر وتعاون وحكمة."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الأُولَى: جِسْمُ الإِنْسَانِ",
      "topic": "الدَّرْسُ الثَّالِثُ: القِيَادَةُ الذَّكِيَّةُ وَالدِّفَاعُ الدَّاخِلِيُّ (العَصَبِيُّ، الحَوَاسُّ الخَمْسُ، الغُدَدُ الصَّمَّاءُ، المَنَاعِيُّ)",
      "coverImg": "assets/y7/scince/s3.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s3.1.jpg",
          "text": "الشَّرِيحَةُ (9) الجِهَازُ العَصَبِيُّ — مَرْكَزُ القِيَادَةِ وَالإِشَارَاتِ: يَسْتَقْبِلُ المَعْلُومَاتِ وَيُعَالِجُ البَيَانَاتِ وَيُنَسِّقُ الحَرَكَةَ؛ وَيَتَكَوَّنُ مِنَ الدِّمَاغِ وَالحَبْلِ الشَّوْكِيِّ وَالخَلَايَا العَصَبِيَّةِ وَالأَعْصَابِ، وَنَحْمِيهِ بِالنَّوْمِ الكَافِي وَفِيتَامِينَاتِ (ب) وَحِمَايَةِ الرَّأْسِ."
        },
        {
          "img": "assets/y7/scince/s3.2.jpg",
          "text": "الشَّرِيحَةُ (10) الحَوَاسُّ الخَمْسُ — نَوَافِذُ الإِدْرَاكِ: تَسْتَقْبِلُ مَعْلُومَاتِ البِيئَةِ وَتَحْمِي الجِسْمَ مِنَ الأَخْطَارِ؛ وَأَعْضَاؤُهَا العَيْنُ (الإِبْصَارُ)، وَالأُذُنُ (السَّمْعُ)، وَالأَنْفُ (الشَّمُّ)، وَاللِّسَانُ (التَّذَوُّقُ)، وَالجِلْدُ (اللَّمْسُ وَالإِحْسَاسُ)."
        },
        {
          "img": "assets/y7/scince/s3.3.jpg",
          "text": "الشَّرِيحَةُ (11) جِهَازُ الغُدَدِ الصَّمَّاءِ — مُنَظِّمُ النُّمُوِّ وَالتَّوَازُنِ: يُفْرِزُ الهُرْمُونَاتِ فِي الدَّمِ لِتَنْظِيمِ نُمُوِّ الجِسْمِ وَضَبْطِ الطَّاقَةِ؛ وَيَشْمَلُ الغُدَّةَ النُّخَامِيَّةَ وَالغُدَّةَ الدَّرَقِيَّةَ وَالغُدَّتَيْنِ الكُظْرِيَّتَيْنِ وَالبَنْكِرْيَاسَ."
        },
        {
          "img": "assets/y7/scince/s3.4.jpg",
          "text": "الشَّرِيحَةُ (12) الجِهَازُ المَنَاعِيُّ وَاللِّمْفَاوِيُّ — جَيْشُ الدِّفَاعِ الدَّاخِلِيِّ: يُقَاوِمُ الجَرَاثِيمَ وَالأَمْرَاضَ؛ وَيَتَكَوَّنُ مِنْ خَلَايَا الدَّمِ البَيْضَاءِ وَاللَّوْزَتَيْنِ وَالطِّحَالِ وَالعُقَدِ اللِّمْفَاوِيَّةِ وَنُخَاعِ العَظْمِ، وَنُقَوِّيهِ بِالنَّظَافَةِ وَالنَّوْمِ وَالفِيتَامِينَاتِ."
        }
      ],
      "text": "الشَّرِيحَةُ (9) الجِهَازُ العَصَبِيُّ — مَرْكَزُ القِيَادَةِ وَالإِشَارَاتِ: يَسْتَقْبِلُ المَعْلُومَاتِ وَيُعَالِجُ البَيَانَاتِ وَيُنَسِّقُ الحَرَكَةَ؛ وَيَتَكَوَّنُ مِنَ الدِّمَاغِ وَالحَبْلِ الشَّوْكِيِّ وَالخَلَايَا العَصَبِيَّةِ وَالأَعْصَابِ، وَنَحْمِيهِ بِالنَّوْمِ الكَافِي وَفِيتَامِينَاتِ (ب) وَحِمَايَةِ الرَّأْسِ. الشَّرِيحَةُ (10) الحَوَاسُّ الخَمْسُ — نَوَافِذُ الإِدْرَاكِ: تَسْتَقْبِلُ مَعْلُومَاتِ البِيئَةِ وَتَحْمِي الجِسْمَ مِنَ الأَخْطَارِ؛ وَأَعْضَاؤُهَا العَيْنُ (الإِبْصَارُ)، وَالأُذُنُ (السَّمْعُ)، وَالأَنْفُ (الشَّمُّ)، وَاللِّسَانُ (التَّذَوُّقُ)، وَالجِلْدُ (اللَّمْسُ وَالإِحْسَاسُ). الشَّرِيحَةُ (11) جِهَازُ الغُدَدِ الصَّمَّاءِ — مُنَظِّمُ النُّمُوِّ وَالتَّوَازُنِ: يُفْرِزُ الهُرْمُونَاتِ فِي الدَّمِ لِتَنْظِيمِ نُمُوِّ الجِسْمِ وَضَبْطِ الطَّاقَةِ؛ وَيَشْمَلُ الغُدَّةَ النُّخَامِيَّةَ وَالغُدَّةَ الدَّرَقِيَّةَ وَالغُدَّتَيْنِ الكُظْرِيَّتَيْنِ وَالبَنْكِرْيَاسَ. الشَّرِيحَةُ (12) الجِهَازُ المَنَاعِيُّ وَاللِّمْفَاوِيُّ — جَيْشُ الدِّفَاعِ الدَّاخِلِيِّ: يُقَاوِمُ الجَرَاثِيمَ وَالأَمْرَاضَ؛ وَيَتَكَوَّنُ مِنْ خَلَايَا الدَّمِ البَيْضَاءِ وَاللَّوْزَتَيْنِ وَالطِّحَالِ وَالعُقَدِ اللِّمْفَاوِيَّةِ وَنُخَاعِ العَظْمِ، وَنُقَوِّيهِ بِالنَّظَافَةِ وَالنَّوْمِ وَالفِيتَامِينَاتِ.",
      "q1": {
        "q": "مَا مَرْكَزُ القِيَادَةِ وَالإِشَارَاتِ فِي الجِسْمِ الَّذِي يَتَكَوَّنُ مِنَ الدِّمَاغِ وَالحَبْلِ الشَّوْكِيِّ وَالأَعْصَابِ؟",
        "focusWord": "الجِهَازُ العَصَبِيُّ",
        "options": [
          {
            "text": "الجِهَازُ العَصَبِيُّ",
            "correct": true
          },
          {
            "text": "الجِهَازُ الهَضْمِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ الغِطَائِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ البَوْلِيُّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الجِهَازُ الَّذِي يُفْرِزُ الهُرْمُونَاتِ لِتَنْظِيمِ النُّمُوِّ وَيَضُمُّ الغُدَّةَ النُّخَامِيَّةَ وَالدَّرَقِيَّةَ وَالكُظْرِيَّتَيْنِ؟",
        "focusWord": "جِهَازُ الغُدَدِ الصَّمَّاءِ",
        "options": [
          {
            "text": "جِهَازُ الغُدَدِ الصَّمَّاءِ",
            "correct": true
          },
          {
            "text": "الجِهَازُ الهَيْكَلِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ التَّنَفُّسِيُّ",
            "correct": false
          },
          {
            "text": "الجِهَازُ العَضَلِيُّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الخَلَايَا الَّتِي تَعْمَلُ كَجَيْشِ دِفَاعٍ دَاخِلِيٍّ فِي الجِهَازِ المَنَاعِيِّ لِمُحَارَبَةِ الجَرَاثِيمِ وَالعَدْوَى؟",
        "focusWord": "خَلَايَا الدَّمِ البَيْضَاءُ",
        "options": [
          {
            "text": "خَلَايَا الدَّمِ البَيْضَاءُ",
            "correct": true
          },
          {
            "text": "الغُدَدُ العَرَقِيَّةُ",
            "correct": false
          },
          {
            "text": "الأَوْتَارُ العَضَلِيَّةُ",
            "correct": false
          },
          {
            "text": "الأَسْنَانُ القَاطِعَةُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الجِهَازُ العَصَبِيُّ",
          "left": "الدِّمَاغُ وَالحَبْلُ الشَّوْكِيُّ وَالأَعْصَابُ"
        },
        {
          "right": "جِهَازُ الغُدَدِ الصَّمَّاءِ",
          "left": "إِفْرَازُ الهُرْمُونَاتِ مِنَ الغُدَّةِ النُّخَامِيَّةِ وَالدَّرَقِيَّةِ"
        },
        {
          "right": "الجِهَازُ المَنَاعِيُّ",
          "left": "خَلَايَا الدَّمِ البَيْضَاءُ وَاللَّوْزَتَانِ وَالطِّحَالُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَا يَحْمِي الدِّمَاغَ وَالحَوَاسَّ وَيُقَوِّي المَنَاعَةَ:",
        "correct": [
          "النَّوْمُ المُبَكِّرُ وَالكَافِي",
          "إِرَاحَةُ العَيْنِ مِنَ الشَّاشَاتِ",
          "الغِذَاءُ الغَنِيُّ بِالفِيتَامِينَاتِ",
          "غَسْلُ اليَدَيْنِ وَالنَّظَافَةُ"
        ],
        "wrong": [
          "السَّهَرُ الطَّوِيلُ أَمَامَ الشَّاشَاتِ",
          "الضَّوْضَاءُ وَالإِنَارَةُ الشَّدِيدَةُ"
        ]
      },
      "applyStep": "أَنَامُ مُبَكِّرًا وَأُرِيحُ عَيْنَيَّ مِنَ الشَّاشَاتِ وَأَغْسِلُ يَدَيَّ لِتَقْوِيَةِ جِهَازِي العَصَبِيِّ وَالمَنَاعِيِّ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt3.jpg",
      "title": "تَمَارِينُ التَّوَازُنِ وَالتَّكَامُلِ الحِسِّيِّ (المَجْمُوعَةُ الثَّالِثَةُ: 15..21)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِتَدْرِيبِ المُخَيْخِ وَزِيَادَةِ التَّرْكِيزِ وَضَبْطِ النَّفْسِ!",
      "slideText": "⚖️ تَمَارِينُ التَّوَازُنِ وَالتَّكَامُلِ الحِسِّيِّ (المَجْمُوعَةُ الثَّالِثَةُ — التَّمَارِينُ 15 إِلَى 21): (15) وَقْفَةُ اللَّقْلَقِ عَلَى قَدَمٍ وَاحِدَةٍ (10 ثَوَانٍ بِعَيْنَيْنِ مَفْتُوحَتَيْنِ ثُمَّ 5 ثَوَانٍ مَغْمُوضَتَيْنِ). (16) المَشْيُ عَلَى الخَيْطِ (الكَعْبُ مُلَاصِقٌ لِلْأَصَابِعِ). (17) المَشْيُ لِلْخَلْفِ عَلَى خَطٍّ مُسْتَقِيمٍ. (18) سَاعِي البَرِيدِ المُتَوَازِنُ (المَشْيُ مَعَ وَضْعِ كِتَابٍ فَوْقَ الرَّأْسِ). (19) القَفْزُ الدَّوَرَانِيُّ المُوَجَّهُ مَعَ الثَّبَاتِ. (20) مِشْيَةُ الدُّبِّ لِلْأَمَامِ أَوِ السَّلْطَعُونِ لِلْخَلْفِ. (21) التَّأَرْجُحُ الصَّخْرِيُّ بِضَمِّ الرُّكْبَتَيْنِ لِلصَّدْرِ.",
      "q1": {
        "q": "مَا الجُزْءُ المسْؤُولُ عَنِ التَّوَازُنِ فِي الدِّمَاغِ الَّذِي تُدَرِّبُهُ تَمَارِينُ المَجْمُوعَةِ الثَّالِثَةِ (15..21)؟",
        "focusWord": "المُخَيْخُ وَالتَّوَازُنُ",
        "options": [
          {
            "text": "المُخَيْخُ، مِمَّا يَزِيدُ التَّرْكِيزَ وَالتَّكَامُلَ الحِسِّيَّ وَضَبْطَ النَّفْسِ",
            "correct": true
          },
          {
            "text": "المَعِدَةُ وَالأَمْعَاءُ",
            "correct": false
          },
          {
            "text": "الأَسْنَانُ اللَّبَنِيَّةُ",
            "correct": false
          },
          {
            "text": "الغُدَدُ العَرَقِيَّةُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (وَقْفَةِ اللَّقْلَقِ) وَتَمْرِينَ (سَاعِي البَرِيدِ المُتَوَازِنِ)؟",
        "focusWord": "وَقْفَةُ اللَّقْلَقِ وَسَاعِي البَرِيدِ",
        "options": [
          {
            "text": "نَقِفُ عَلَى قَدَمٍ وَاحِدَةٍ بَثَبَاتٍ، وَنَمْشِي فِي خَطٍّ مُسْتَقِيمٍ وَاضِعِينَ كِتَابًا فَوْقَ الرَّأْسِ دُونَ أَنْ يَسْقُطَ",
            "correct": true
          },
          {
            "text": "نَرْكُضُ بِسُرْعَةٍ عَشْوَائِيَّةٍ",
            "correct": false
          },
          {
            "text": "نَرْمِي الكِتَابَ فِي الهَوَاءِ",
            "correct": false
          },
          {
            "text": "نَجْلِسُ عَلَى الكُرْسِيِّ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الفَرْقُ بَيْنَ (مِشْيَةِ الدُّبِّ) وَ(مِشْيَةِ السَّلْطَعُونِ) فِي التَّمْرِينِ رَقْمِ (20)؟",
        "focusWord": "مِشْيَةُ الدُّبِّ أَوِ السَّلْطَعُونِ",
        "options": [
          {
            "text": "مِشْيَةُ الدُّبِّ عَلَى الأَطْرَافِ الأَرْبَعَةِ لِلْأَمَامِ، وَمِشْيَةُ السَّلْطَعُونِ لِلْخَلْفِ مَعَ رَفْعِ الحَوْضِ",
            "correct": true
          },
          {
            "text": "كِلَاهُمَا قَفْزٌ عَلَى الحَبْلِ",
            "correct": false
          },
          {
            "text": "كِلَاهُمَا سِبَاحَةٌ فِي المَاءِ",
            "correct": false
          },
          {
            "text": "لَا تَتَحَرَّكُ فِيهِمَا الذِّرَاعَانِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "وَقْفَةُ اللَّقْلَقِ (15)",
          "left": "الوُقُوفُ عَلَى قَدَمٍ وَاحِدَةٍ 10 ثَوَانٍ ثُمَّ إِغْمَاضُ العَيْنَيْنِ 5 ثَوَانٍ"
        },
        {
          "right": "سَاعِي البَرِيدِ المُتَوَازِنُ (18)",
          "left": "المَشْيُ فِي خَطٍّ مُسْتَقِيمٍ مَعَ مُوَازَنَةِ كِتَابٍ فَوْقَ الرَّأْسِ"
        },
        {
          "right": "التَّأَرْجُحُ الصَّخْرِيُّ (21)",
          "left": "ضَمُّ الرُّكْبَتَيْنِ لِلصَّدْرِ كَالبَيْضَةِ وَالتَّأَرْجُحُ بِهُدُوءٍ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ التَّوَازُنِ وَالتَّكَامُلِ الحِسِّيِّ (15..21):",
        "correct": [
          "وَقْفَةُ اللَّقْلَقِ",
          "المَشْيُ عَلَى الخَيْطِ لِلْأَمَامِ وَلِلْخَلْفِ",
          "سَاعِي البَرِيدِ المُتَوَازِنُ",
          "مِشْيَةُ الدُّبِّ وَالسَّلْطَعُونِ"
        ],
        "wrong": [
          "الاسْتِعْجَالُ وَفِقْدَانُ التَّوَازُنِ",
          "دَفْعُ الزُّمَلَاءِ أَثْنَاءَ المَشْيِ"
        ]
      },
      "applyStep": "أَتَدَرَّبُ عَلَى وَقْفَةِ اللَّقْلَقِ وَالمَشْيِ عَلَى خَطٍّ مُسْتَقِيمٍ كَسَاعِي البَرِيدِ المُتَوَازِنِ لِتَقْوِيَةِ تَرْكِيزِي."
    }
  },
  {
    "w": 4,
    "secNum": 1,
    "heavenName": "سَمَاءُ السَّبْتِ العُلْيَا (أ ب ج د)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الأُولَى: عُلُومُ جِسْمِ الإِنْسَانِ وَالأَحْيَاءِ الخَلَوِيَّةِ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "د",
    "jummal": 4,
    "prophet": "هُودٌ (ع)",
    "virtue": "الشُّكْرُ",
    "unitHeader": "الوَحْدَةُ الرَّابِعَةُ : نَبِيُّ اللهِ هُودٌ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "أَرْسَلَ اللهُ نَبِيَّهُ هُودًا (ع) إِلَى قَوْمِ عَادٍ الَّذِينَ بَنَوْا قُصُورًا عَالِيَةً، فَدَعَاهُمْ إِلَى شُكْرِ اللهِ عَلَى نِعْمَةِ القُوَّةِ وَالبَسَاتِينِ وَتَرْكِ الغُرُورْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): تَجَبُّرُ قَوْمِ عَادٍ وَبَطْشُهُمْ بِالضُّعَفَاءِ عِنْدَ الغَضَبِ: ﴿وَإِذَا بَطَشْتُمْ بَطَشْتُمْ جَبَّارِينَ﴾، وَنَارُ الكِبْرِ فِي تَحَدِّيهِمْ لِنَبِيِّهِمْ وَقَوْلِهِمْ: ﴿مَنْ أَشَدُّ مِنَّا قُوَّةً﴾. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): وَهْمُ عِبَادَةِ الأَصْنَامِ الثَّلَاثَةِ (صَمُودَ وَصَدَاءَ وَالهَبَاءَ)، وَوَهْمُ الخُلُودِ بِبِنَاءِ مَدِينَةِ إِرَمَ وَالأَبْرَاجِ العَالِيَةِ، وَوَهْمُ العَجُوزِ الَّتِي ظَنَّتْ أَنَّ النَّفَقَ يَحْمِيهَا، وَوَهْمُ قَيْلِ بْنِ عَنْزٍ حِينَ اخْتَارَ السَّحَابَةَ السَّوْدَاءَ فَكَانَتْ هِيَ الرِّيحَ الصَّرْصَرَ العَقِيمَ الَّتِي خَرَجَتْ بِمِقْدَارِ حَلْقَةِ الخَاتَمِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): ثَبَاتُ عَقْلِ هُودٍ (عَلَيْهِ السَّلَامُ) وَتَوَكُّلُهُ الرَّاسِخُ أَمَامَ القَوْمِ جَمِيعًا، وَعَقْلُ مَرْثَدِ بْنِ سَعْدٍ فِي مَكَّةَ، وَخَطُّ هُودٍ الدَّائِرَةَ عَلَى التُّرَابِ لِحِمَايَةِ المُؤْمِنِينَ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): رَبْطُ هُودٍ بَيْنَ طَاعَةِ الاسْتِغْفَارِ وَنُزُولِ المَاءِ المِدْرَارِ، وَسُقُوطُ وَفْدِ عَادٍ فِي شَهْوَةِ اللَّهْوِ وَالشَّرَابِ شَهْرًا فِي مَكَّةَ حَتَّى نَسُوا قَوْمَهُمْ، فِي مُقَابِلِ طَهَارَةِ هُودٍ وَمَرْثَدٍ وَالمُؤْمِنِينَ.",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ السَّبْتِ العَظِيمْ، يَأْتِي النَّبِيُّ الرَّقْمُ أَرْبَعَةٍ لِيُكْمِلَ دَوْرَةَ الطَّبَائِعِ الأَرْبَعِ فِي مَنْزِلَةِ المَاءِ وَالطَّاعَةِ وَالتَّوَاضُعْ، وَهُوَ نَبِيُّ اللهِ هُودٌ عَلَيْهِ السَّلَامْ. وَهُوَ مِنْ ذُرِّيَّةِ سَامِ بْنِ نُوحٍ وَأَوَّلُ الأَنْبِيَاءِ العَرَبْ، أَرْسَلَهُ اللهُ إِلَى قَبِيلَةِ عَادٍ الأُولَى الَّذِينَ سَكَنُوا أَرْضَ الأَحْقَافْ، وَهِيَ جِبَالُ الرِّمَالِ فِي اليَمَنِ ذَاتِ البَسَاتِينِ الخَضْرَاءِ وَالعُيُونِ الجَارِيَةْ. وَكَانَ اللهُ يَمُدُّ قَوْمَ عَادٍ بِالأَمْوَالِ وَالأَنْعَامِ وَالبَنِينْ، وَمَنَحَهُمْ أَجْسَامًا طَوِيلَةً وَقُوَّةً عَظِيمَةً لَمْ يَكُنْ لَهَا مَثِيلٌ فِي البِلَادْ.",
      "لٰكِنَّ قَوْمَ عَادٍ بَدَلَ أَنْ يَتَوَاضَعُوا لِلهِ كَالمَاءِ النَّقِيِّ الصَّافِي، غَلَبَتْ عَلَيْهِمْ شَهْوَةُ التَّكَبُّرِ وَحُبُّ البَقَاءِ فِي دُنْيَا زَائِلَةٍ فَنَسُوا الآخِرَةْ. بَنَى مَلِكُهُمْ شَدَّادُ مَدِينَةَ إِرَمَ ذَاتِ العِمَادِ المَرْفُوعَةِ عَلَى الأَعْمِدَةِ الطَّوِيلَةْ، وَصَارُوا يَبْنُونَ فَوْقَ كُلِّ مَكَانٍ مُرْتَفِعٍ بِنَاءً عَالِيًا يَعْبَثُونَ فِيهِ وَيَسْخَرُونَ مِنَ المَارَّةْ، وَيَصْنَعُونَ مَصَانِعَ وَأَحْوَاضًا عَظِيمَةً لِلمَاءِ وَقُصُورًا مُشَيَّدَةً كَأَنَّهُمْ يَخْلُدُونْ. وَاشْتَعَلَتْ فِي صُدُورِهِمْ نَارُ الغَضَبِ وَالظُّلْمِ فَكَانُوا إِذَا بَطَشُوا بِالضُّعَفَاءِ بَطَشُوا جَبَّارِينْ، وَخَدَعَتْهُمْ رِيحُ الوَهْمِ فَعَبَدُوا ثَلَاثَةَ أَصْنَامٍ مِنْ حِجَارَةٍ هِيَ صَمُودُ وَصَدَاءُ وَالهَبَاءْ، وَقَالُوا بِغُرُورٍ مَنْ أَشَدُّ مِنَّا قُوَّةً فِي الأَرْضْ.",
      "وَقَفَ نَبِيُّ اللهِ بَيْنَهُمْ بِعَقْلٍ حَكِيمٍ وَكَلَّمَهُمْ بِكُلِّ أَدَبٍ وَهُدُوءْ، وَقَالَ لَهُمْ يَا قَوْمِ اعْبُدُوا اللهَ الوَاحِدَ وَلَا تَبْنُوا قُصُورًا لِلتَّكَبُّرِ وَالظُّلْمْ، بَلِ ابْنُوا مَسْكَنًا نَافِعًا وَدَارًا طَيِّبَةً لِلسَّتْرِ وَالطَّاعَةْ. وَبَيَّنَ لَهُمْ أَنَّ مَنْ عَبَدَ اللهَ وَاسْتَغْفَرَهُ بِتَوَاضُعْ، يُرْسِلُ اللهُ عَلَيْهِمُ المَطَرَ مِنَ السَّمَاءِ مِدْرَارًا كَثِيرَ البَرَكَةْ، وَيَزِيدُهُمْ قُوَّةً إِلَى قُوَّتِهِمْ لِأَنَّ اللهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ عَظِيمْ. فَكَذَّبُوهُ وَخَوَّفُوهُ بِأَصْنَامِهِمْ وَادَّعَوْا أَنَّهَا أَصَابَتْهُ بِسُوءْ، فَوَقَفَ أَمَامَهُمْ جَمِيعًا بِشَجَاعَةِ العَقْلِ وَاليَقِينِ وَقَالَ لَهُمْ كِيدُونِي جَمِيعًا وَلَا تُمْهِلُونِي، فَإِنِّي تَوَكَّلْتُ عَلَى اللهِ رَبِّي وَرَبِّكُمْ وَهُوَ القَادِرُ عَلَى كُلِّ شَيْءْ. فَعَرَفَ العُقَلَاءُ أَنَّهُ قَدْ صَدَقَ فِي قَوْلِهْ، وَآمَنَ مَعَهُ قَلِيلٌ مِنَ الأَطْهَارِ وَمِنْهُمُ الرَّجُلُ الحَكِيمُ مَرْثَدُ بْنُ سَعْدٍ الَّذِي كَانَ مُصَدِّقًا بِآيَاتِ اللهْ.",
      "وَلَمَّا أَصَرَّ الظَّالِمُونَ عَلَى عِنَادِهِمْ حَبَسَ اللهُ عَنْهُمُ المَطَرَ ثَلَاثَ سِنِينَ حَتَّى جَفَّتِ العُيُونُ وَيَبِسَ الشَّجَرْ. فَأَرْسَلُوا وَفْدًا مِنْهُمْ فِيهِ سَبْعُونَ رَجُلًا مَعَ قَيْلِ بْنِ عَنْزٍ وَمَرْثَدِ بْنِ سَعْدٍ إِلَى مَكَّةَ لِيَطْلُبُوا المَطَرْ. وَلَمَّا نَزَلُوا فِي مَكَّةَ غَلَبَتْهُمْ شَهْوَةُ البَطْنِ وَاللَّهْوِ فَأَكَلُوا وَشَرِبُوا وَسَمِعُوا الغِنَاءَ شَهْرًا كَامِلًا وَنَسُوا قَوْمَهُمُ العِطَاشْ! وَلَمَّا تَذَكَّرُوا قَامُوا لِلدُّعَاءْ، فَأَعْلَنَ مَرْثَدُ بْنُ سَعْدٍ إِيمَانَهُ بِنَبِيِّ اللهِ هُودٍ وَدَعَا اللهَ أَنْ يَسْقِيَهُمْ إِنْ أَطَاعُوا نَبِيَّهُمْ، أَمَّا قَيْلُ بْنُ عَنْزٍ فَأَصَرَّ عَلَى الكِبْرِ وَالوَهْمْ. فَأَرَاهُمُ اللهُ فِي السَّمَاءِ ثَلَاثَ سَحَابَاتْ، بَيْضَاءَ وَحَمْرَاءَ وَسَوْدَاءْ، فَاخْتَارَ قَيْلٌ بِوَهْمِهِ السَّحَابَةَ السَّوْدَاءَ ظَنًّا مِنْهُ أَنَّهَا مَمْلُوءَةٌ بِالمَاءْ، وَهُوَ لَا يَعْلَمُ أَنَّهَا تَحْمِلُ الرِّيحَ العَقِيمَ الَّتِي لَا مَطَرَ فِيهَا وَلَا ثَمَرْ.",
      "أَمَرَ اللهُ المَلَائِكَةَ أَنْ يَفْتَحُوا مِنْ خَزَائِنِ الرِّيحِ مِقْدَارَ حَلْقَةِ الخَاتَمِ فَقَطْ، فَسَارَتِ السَّحَابَةُ السَّوْدَاءُ حَتَّى وَصَلَتْ إِلَى دِيَارِهِمْ، وَأَبْصَرَتْهَا امْرَأَةٌ مِنْهُمُ اسْمُهَا مَهْدَدُ فَصَعَقَتْ مِنَ الهَوْلْ، بَيْنَمَا فَرِحَ القَوْمُ بِوَهْمِهِمْ وَقَالُوا هٰذَا غَيْمٌ سَيُمْطِرُنَا وَيَسْقِي أَرْضَنَا وَحُقُولَنَا. فَقَالَ لَهُمْ نَبِيُّهُمْ بَلْ هِيَ الرِّيحُ الَّتِي اسْتَعْجَلْتُمْ بِهَا فِيهَا عَذَابٌ أَلِيمْ. ثُمَّ دَعَا نَبِيُّ اللهِ رَبَّهُ وَخَطَّ بِيَدِهِ خَطًّا فِي التُّرَابِ حَوْلَهْ، فَدَخَلَ مَعَهُ المُؤْمِنُونَ فِي تِلْكَ الدَّائِرَةِ الآمِنَةْ. وَفِي يَوْمِ الأَرْبِعَاءِ هَبَّتِ الرِّيحُ الصَّرْصَرُ الشَّدِيدَةُ البَارِدَةُ سَبْعَ لَيَالٍ وَثَمَانِيَةَ أَيَّامٍ مُتَتَالِيَةْ، فَكَانَتْ تَقْتَلِعُ المُتَكَبِّرِينَ كَأَنَّهُمْ أَعْجَازُ نَخْلٍ خَاوِيَةْ، وَاخْتَبَأَتْ عَجُوزٌ فِي نَفَقٍ تَحْتَ الأَرْضِ ظَنًّا أَنَّهُ يَحْمِيهَا فَدَخَلَتْ عَلَيْهَا الرِّيحُ، وَحَطَّمَتِ الرِّيحُ قُصُورَهُمُ العَالِيَةَ وَطَمَرَتْهُمْ بِالرِّمَالِ حَتَّى زَالَ كُلُّ مَا قَدَّمَ الظَّالِمُونَ مِنْ بُنْيَانِ التَّفَاخُرِ وَالبَطْشْ. أَمَّا نَبِيُّ اللهِ وَالمُؤْمِنُونَ فَمَرَّتْ عَلَيْهِمُ الرِّيحُ نَسِيمًا لَطِيفًا بِرَحْمَةِ اللهْ، وَعَاشَ مَعَهُمْ يَعْمُرُونَ الأَرْضَ بِالعَقْلِ وَالطَّاعَةِ حَتَّى أَوْصَى بِالتَّوْحِيدِ وَبَشَّرَ بِنَبِيِّ اللهِ صَالِحٍ مِنْ بَعْدِهْ، وَجُعِلَ مَثْوَاهُ المُبَارَكُ فِي وَادِي السَّلَامِ بِأَرْضِ النَّجَفِ الأَشْرَفْ."
    ],
    "words": [
      {
        "word": "مِدْرَارًا",
        "desc": "وسط متصل / ساكن: ـدْ",
        "raw": "مِدْرَارًا (وسط متصل / ساكن: ـدْ)"
      },
      {
        "word": "البِلَادْ",
        "desc": "آخر منفصل / ساكن وقفا: دْ",
        "raw": "البِلَادْ (آخر منفصل / ساكن وقفا: دْ)"
      },
      {
        "word": "دَعَا",
        "desc": "أول منفصل / متحرك بالفتح: دَ",
        "raw": "دَعَا (أول منفصل / متحرك بالفتح: دَ)"
      },
      {
        "word": "فَدَخَلَ",
        "desc": "أول متصل / متحرك بالفتح: ـدَ",
        "raw": "فَدَخَلَ (أول متصل / متحرك بالفتح: ـدَ)"
      },
      {
        "word": "صَدَقَ",
        "desc": "وسط متصل / متحرك بالفتح: ـدَ",
        "raw": "صَدَقَ (وسط متصل / متحرك بالفتح: ـدَ)"
      },
      {
        "word": "أَدَبٍ",
        "desc": "وسط منفصل / متحرك بالفتح: دَ",
        "raw": "أَدَبٍ (وسط منفصل / متحرك بالفتح: دَ)"
      },
      {
        "word": "عَبَدَ",
        "desc": "آخر متصل / متحرك بالفتح: ـدَ",
        "raw": "عَبَدَ (آخر متصل / متحرك بالفتح: ـدَ)"
      },
      {
        "word": "دُنْيَا",
        "desc": "أول منفصل / متحرك بالضم: دُ",
        "raw": "دُنْيَا (أول منفصل / متحرك بالضم: دُ)"
      },
      {
        "word": "هُودٌ",
        "desc": "آخر منفصل / متحرك بالضم: دٌ",
        "raw": "هُودٌ (آخر منفصل / متحرك بالضم: دٌ)"
      },
      {
        "word": "دِيَارِهِمْ",
        "desc": "أول منفصل / متحرك بالكسر: دِ",
        "raw": "دِيَارِهِمْ (أول منفصل / متحرك بالكسر: دِ)"
      },
      {
        "word": "قَدَّمَ",
        "desc": "وسط متصل / مضعف بالفتح: ـدَّ",
        "raw": "قَدَّمَ (وسط متصل / مضعف بالفتح: ـدَّ)"
      },
      {
        "word": "يَمُدُّ",
        "desc": "آخر متصل / مضعف بالضم: ـدُّ",
        "raw": "يَمُدُّ (آخر متصل / مضعف بالضم: ـدُّ)"
      },
      {
        "word": "مُصَدِّقًا",
        "desc": "وسط متصل / مضعف بالكسر: ـدِّ",
        "raw": "مُصَدِّقًا (وسط متصل / مضعف بالكسر: ـدِّ)"
      },
      {
        "word": "دَارًا",
        "desc": "أول منفصل / ممدود بالألف: دَا",
        "raw": "دَارًا (أول منفصل / ممدود بالألف: دَا)"
      },
      {
        "word": "صُدُورِهِمْ",
        "desc": "وسط متصل / ممدود بالواو: ـدُو",
        "raw": "صُدُورِهِمْ (وسط متصل / ممدود بالواو: ـدُو)"
      },
      {
        "word": "قَدِيرٌ",
        "desc": "وسط متصل / ممدود بالياء: ـدِي",
        "raw": "قَدِيرٌ (وسط متصل / ممدود بالياء: ـدِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الدَّالِ (د): النُّطْقُ السَّلِيمُ لِحَرْفِ الدَّالِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ أُصُولِ الثَّنَايَا العُلْيَا، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى كَلِمَةِ التَّوَكُّلِ وَالاسْتِغْفَارِ."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الزَّاوِيَةُ وَالمُرَبَّعُ وَحَلْقَةُ الخَاتَمِ: مُشَاهَدَةُ التِقَاءِ الخَطَّيْنِ فِي حَرْفِ الدَّالِ (د) لِصُنْعِ زَاوِيَةِ البِنَاءِ، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «المُرَبَّعِ» ذِي الأَرْكَانِ الأَرْبَعَةِ، وَالتَّفَكُّرُ فِي صِغَرِ «حَلْقَةِ الخَاتَمِ» الَّتِي خَرَجَتْ مِنْهَا الرِّيحُ العَظِيمَةُ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ هُودٍ الكَامِلَةُ وَالتَّرَفُّعُ عَنْ سَمَاعِ اللَّهْوِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ القِصَّةِ، وَتَعَلُّمُ حِفْظِ الأُذُنِ عَنْ سَمَاعِ اللَّهْوِ البَاطِلِ الَّذِي أَنْسَى وَفْدَ عَادٍ أَهْلَهُمْ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ أَرْبَعَةٌ (4): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (4) وَرَسْمِ حَرْفِ الدَّالِ (د)، وَإِدْرَاكُ مَفْهُومِ الرُّبَاعِيَّةِ (النَّبِيُّ الرَّابِعُ، اكْتِمَالُ الطَّبَائِعِ الأَرْبَعِ فِي سَمَاءِ السَّبْتِ، الجِهَاتُ الأَرْبَعُ، الأَرْكَانُ الأَرْبَعَةُ)، وَتَدْرِيبُ اليَدِ عَلَى البِنَاءِ النَّافِعِ وَكَفِّهَا عَنِ البَطْشِ وَالظُّلْمِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ الثَّبَاتِ وَالارْتِكَازِ وَالمَشْيِ عَلَى الرِّمَالِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ الثَّبَاتِ وَالتَّوَازُنِ القَوِيِّ عَلَى الأَرْضِ، وَتَمْرِينِ القَفْزِ وَالحَرَكَةِ المُنْتَظِمَةِ دَاخِلَ المُرَبَّعِ ذِي الزَّوَايَا الأَرْبَعِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ خَزْنِ المِيَاهِ وَالنَّخِيلِ وَآفَةِ الشَّرَهِ: تَعَلُّمُ كَيْفِيَّةِ جَمْعِ مِيَاهِ الأَمْطَارِ فِي الأَحْوَاضِ (المَصَانِعِ المَائِيَّةِ) لِسَقْيِ البَسَاتِينِ، وَمَعْرِفَةِ عُلُومِ النَّخِيلِ وَالتَّمْرِ، وَالحَذَرِ مِنْ شَهْوَةِ الشَّرَهِ فِي الطَّعَامِ وَالشَّرَابِ الَّتِي أَغْفَلَتْ وَفْدَ عَادٍ عَنْ وَاجِبِهِمْ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ المَسْكَنِ المُتَوَاضِعِ وَالطَّهَارَةِ وَالرِّفْقِ: تَعَلُّمُ أَنَّ البُيُوتَ تُبْنَى لِلسَّتْرِ وَالسَّكِينَةِ وَالطَّاعَةِ لَا لِلتَّفَاخُرِ وَالعَبَثِ، وَآدَابِ التَّطَهُّرِ بِمَاءِ السَّمَاءِ الطَّهُورِ، وَالتَّوَاضُعِ وَالرِّفْقِ بِالضُّعَفَاءِ."
      }
    },
    "grammar": {
      "topic": "تَمْيِيزُ أَقْسَامِ الكَلِمَةِ الثَّلَاثَةِ فِي جُمْلَةٍ تَامَّةْ",
      "rule": "تَتَرَكَّبُ الجُمْلَةُ المُفِيدَةُ مِنْ تَعَاوُنِ الاِسْمِ وَالفِعْلِ وَالحَرْفِ لِإِفَادَةِ مَعْنًى تَامّْ.",
      "example": "يَشْكُرُ (فِعْلٌ) المُؤْمِنُ (اسْمٌ) اللهَ عَلَى (حَرْفٌ) النِّعْمَةِ (اسْمٌ).",
      "focusWord": "المُؤْمِنُ",
      "q": "مَا نَوْعُ كَلِمَةِ «يَشْكُرُ» فِي جُمْلَةِ «يَشْكُرُ المُؤْمِنُ رَبَّهُ»؟",
      "opts": [
        "فِعْلٌ",
        "اسْمٌ",
        "حَرْفُ جَرٍّ",
        "حَرْفُ عَطْفٍ"
      ]
    },
    "earIirab": {
      "topic": "مِيزَانُ الحَرَكَاتِ الثَّلَاثِ (الضَّمَّةُ وَالفَتْحَةُ وَالكَسْرَةُ)",
      "rule": "نُمَيِّزُ بِأُذُنِنَا صَوْتَ الضَّمَّةِ لِلرَّفْعِ (ـُ)، وَالفَتْحَةِ لِلنَّصْبِ (ـَ)، وَالكَسْرَةِ لِلجَرِّ (ـِ).",
      "sentence": "غَرَسَ الفَلَّاحُ الشَّجَرَةَ فِي البُسْتَانِ.",
      "targetWord": "الفَلَّاحُ",
      "caseAns": "مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 4,
      "numName": "أَرْبَعَةٌ",
      "eqDisplay": "2 + 2 = 4",
      "subDisplay": "4 - 2 = 2",
      "compDisplay": "4 = 4",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "2 + 2 = ؟",
        "ans": "4 (أَرْبَعَةٌ)",
        "wrong": [
          "2 (اثْنَانِ)",
          "5 (خَمْسَةٌ)",
          "3 (ثَلَاثَةٌ)"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "4 - 2 = ؟",
        "ans": "2 (اثْنَانِ)",
        "wrong": [
          "4 (أَرْبَعَةٌ)",
          "1 (وَاحِدٌ)",
          "0 (صِفْرٌ)"
        ]
      }
    },
    "sport": {
      "title": "رَسْمُ اللَّانِهَايَةِ (∞) بِالإِصْبَعِ وَالعَيْنَيْنِ",
      "middleText": "أَرْسُمُ بِإِصْبَعِي شَكْلَ اللَّانِهَايَةِ الأُفُقِيَّ فِي الهَوَاءِ وَأَتَتَبَّعُهُ بِعَيْنَيَّ دُونَ تَحْرِيكِ الرَّأْسْ. يُقَوِّي هٰذَا التَّمْرِينُ عَضَلَاتِ العَيْنِ وَيَرْفَعُ دِقَّةَ القِرَاءَةِ وَالتَّرْكِيزْ."
    },
    "sci": {
      "title": "مُخْتَبَرُ جِسْمِ الإِنْسَانِ: الرِّئَةُ وَنَبْضُ القَلْبِ",
      "summaryThird": "فِي تَجْرِبَةِ مُجَسَّمِ الرِّئَةِ يَدْخُلُ الهَوَاءُ عِنْدَ سَحْبِ الحِجَابِ الحَاجِزِ لِلأَسْفَلِ (الشَّهِيقُ)، كَمَا تَزْدَادُ دَقَّاتُ القَلْبِ أَثْنَاءَ الرِّيَاضَةِ لِتَزْوِيدِ العَضَلَاتِ بِالأُكْسِجِينْ.",
      "focusConcept": "عَمَلِيَّةُ الشَّهِيقِ",
      "factAns": "دُخُولُ الهَوَاءِ لِلرِّئَتَيْنِ وَاتِّسَاعُ الصَّدْرْ"
    },
    "rightsSummary": {
      "title": "حَقُّ السَّمْعِ وَالأُذُنِ (حُور وَسُرُور - 4)",
      "storySentence": "تَعَلَّمَتْ حُورُ أَنَّ حَقَّ السَّمْعِ هُوَ الإِنْصَاتُ لِلحِكْمَةِ وَالعِلْمِ النَّافِعِ، وَإِغْلَاقُ الأُذُنِ عَنْ سَمَاعِ الغِيبَةِ أَوِ الضَّجِيجِ الضَّارّْ.",
      "applyAction": "أَسْتَمِعُ بِانْتِبَاهٍ وَأَدَبٍ لِكَلَامِ وَالِدَيَّ وَمُعَلِّمِي."
    },
    "rightsFullTitle": "(4) حق السمع",
    "rightsQuote": "وَأَمَّا حَقُّ السَّمْعِ فَتَنْزِيهُهُ عَنْ أَنْ تَجْعَلَهُ طَرِيقًا إلَى قَلْبكَ إلا لِفُوهَة كَرِيمَة تُحْدِثُ فِي قَلبكَ خَيْرًا أَو تَكْسِبُ خُلُقًا كَرِيمًا فَإنَّهُ بَابُ الْكَلامِ إلَى الْقَلْب يُؤَدِّي إلَيْهِ ضُرُوبُ الْمَعَانِي عَلَى مَا فِيهَا مِن خَيْر أَو شَرِّ. وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (4) حق السمع",
        "text": "وَأَمَّا حَقُّ السَّمْعِ فَتَنْزِيهُهُ عَنْ أَنْ تَجْعَلَهُ طَرِيقًا إلَى قَلْبكَ إلا لِفُوهَة كَرِيمَة تُحْدِثُ فِي قَلبكَ خَيْرًا أَو تَكْسِبُ خُلُقًا كَرِيمًا فَإنَّهُ بَابُ الْكَلامِ إلَى الْقَلْب يُؤَدِّي إلَيْهِ ضُرُوبُ الْمَعَانِي عَلَى مَا فِيهَا مِن خَيْر أَو شَرِّ. وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ هُودٌ (ع): آدَابُ المَسْكَنِ المُتَوَاضِعِ وَالطَّهَارَةِ وَالرِّفْقِ: تَعَلُّمُ أَنَّ البُيُوتَ تُبْنَى لِلسَّتْرِ وَالسَّكِينَةِ وَالطَّاعَةِ لَا لِلتَّفَاخُرِ وَالعَبَثِ، وَآدَابِ التَّطَهُّرِ بِمَاءِ السَّمَاءِ الطَّهُورِ، وَالتَّوَاضُعِ وَالرِّفْقِ بِالضُّعَفَاءِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق السمع",
        "text": "جاءت إحدى الجارات إلى منزل أم حور، وشعرت حور أن أمها غير مرتاحة. جلست الجارة تتحدث كثيرًا عن الآخرين بكلامٍ غير جميل، وكانت أم حور تحاول أن تُحسّن الصورة وتبرّر للجميع. لكن حور لاحظت أن وجه أمها بدأ يتغير، وكأن الحديث يثقل قلبها. ثم فتحت الجارة هاتفها، وبدأت تشاهد مقاطع فيها غناءٍ صاخب، وشعرت حور كأن أمها تتألم  فقررت الصمت. ولم تمضِ دقائق حتى غادرت الجارة، تاركة خلفها جوًّا من الانزعاج. بعد أن رحلت، جلست حور تفكر: \"لماذا كانت أمي مستاءة هكذا؟\" رنّ الهاتف، كانت صديقتها تتصل بها لتراجعا معًا أحد الدروس. ساعدتها حور حتى فهمت الدرس جيدًا، لكن صديقتها بدأت تتحدث عن المعلمة بطريقة غير لائقة."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق السمع",
        "text": "تغيّر وجه حور، وتذكّرت موقف أمها مع الجارة. قالت بهدوء: \"معلمتي شرحت لنا الدرس جيدًا، وأنا فهمت لأنني كنت أستمع بانتباه. ربما أنتِ لم تركّزي وقتها، فلا تظلميها بالكلام.\" سكتت صديقتها قليلاً ثم قالت بخجل: \"أنتِ محقة، لقد كنت سارحة وقت الشرح. أعتذر عن كلامي.\" ابتسمت حور بسعادة، وشعرت أنها تعلّمت شيئًا جديدًا عن نفسها. ذهبت إلى أمها، قبّلتها وقالت: \"كم أنتِ قدوة جميلة يا أمي، بسببك عرفت أن سمعنا لا بد أن يكون للخير، لا للشر.\" ابتسمت الأم وقالت: \"نعم يا ابنتي، السمع باب إلى القلب والعقل، فاحفظيه ليبقى قلبك طيبًا دائمًا.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الأُولَى: جِسْمُ الإِنْسَانِ",
      "topic": "التَّجْرِبَتَانِ (1 وَ2): الرِّئَةُ البَالُونِيَّةُ (كَيْفَ نَتَنَفَّسُ؟) وَسَمَّاعَةُ دَقَّاتِ القَلْبِ",
      "coverImg": "assets/y7/scince/s4.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s4.1.jpg",
          "text": "التَّجْرِبَةُ (1) الرِّئَةُ البَالُونِيَّةُ — كَيْفَ نَتَنَفَّسُ؟: نَصْنَعُ مُجَسَّمَ الرِّئَةِ مِنْ زُجَاجَةٍ وَأُنْبُوبٍ وَبَالُونَتَيْنِ وَغِشَاءٍ مَطَّاطِيٍّ (يُمَثِّلُ الحِجَابَ الحَاجِزَ)؛ عِنْدَ سَحْبِ الغِشَاءِ لِلْأَسْفَلِ يَدْخُلُ الهَوَاءُ فَتَنْتَفِخُ البَالُونَتَانِ (شَهِيقٌ)، وَعِنْدَ دَفْعِهِ لِلْأَعْلَى يَخْرُجُ الهَوَاءُ (زَفِيرٌ)."
        },
        {
          "img": "assets/y7/scince/s4.2.jpg",
          "text": "التَّجْرِبَةُ (2) دَقَّاتُ القَلْبِ: نَصْنَعُ سَمَّاعَةً مَنْزِلِيَّةً مِنْ قِمْعٍ وَأُنْبُوبٍ مَرِنٍ وَغِشَاءِ بَالُونٍ، وَنَضَعُهَا عَلَى الصَّدْرِ لِلِاسْتِمَاعِ إِلَى نَبْضِ القَلْبِ وَفَهْمِ كَيْفَ يَضُخُّ الدَّمَ فِي الأَوْعِيَةِ الدَّمَوِيَّةِ لِنَقْلِ الأُكْسِجِينِ وَنَشَاطِ الجِسْمِ."
        }
      ],
      "text": "التَّجْرِبَةُ (1) الرِّئَةُ البَالُونِيَّةُ — كَيْفَ نَتَنَفَّسُ؟: نَصْنَعُ مُجَسَّمَ الرِّئَةِ مِنْ زُجَاجَةٍ وَأُنْبُوبٍ وَبَالُونَتَيْنِ وَغِشَاءٍ مَطَّاطِيٍّ (يُمَثِّلُ الحِجَابَ الحَاجِزَ)؛ عِنْدَ سَحْبِ الغِشَاءِ لِلْأَسْفَلِ يَدْخُلُ الهَوَاءُ فَتَنْتَفِخُ البَالُونَتَانِ (شَهِيقٌ)، وَعِنْدَ دَفْعِهِ لِلْأَعْلَى يَخْرُجُ الهَوَاءُ (زَفِيرٌ). التَّجْرِبَةُ (2) دَقَّاتُ القَلْبِ: نَصْنَعُ سَمَّاعَةً مَنْزِلِيَّةً مِنْ قِمْعٍ وَأُنْبُوبٍ مَرِنٍ وَغِشَاءِ بَالُونٍ، وَنَضَعُهَا عَلَى الصَّدْرِ لِلِاسْتِمَاعِ إِلَى نَبْضِ القَلْبِ وَفَهْمِ كَيْفَ يَضُخُّ الدَّمَ فِي الأَوْعِيَةِ الدَّمَوِيَّةِ لِنَقْلِ الأُكْسِجِينِ وَنَشَاطِ الجِسْمِ.",
      "q1": {
        "q": "فِي تَجْرِبَةِ الرِّئَةِ البَالُونِيَّةِ، مَاذَا يُمَثِّلُ الغِشَاءُ المَطَّاطِيُّ المَوْجُودُ أَسْفَلَ الزُّجَاجَةِ؟",
        "focusWord": "الحِجَابُ الحَاجِزُ",
        "options": [
          {
            "text": "عَضَلَةَ الحِجَابِ الحَاجِزِ",
            "correct": true
          },
          {
            "text": "المَعِدَةَ",
            "correct": false
          },
          {
            "text": "الجُمْجُمَةَ",
            "correct": false
          },
          {
            "text": "الكُلْيَةَ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَاذَا يَحْدُثُ لِلْبَالُونَتَيْنِ (الرِّئَتَيْنِ) عِنْدَ سَحْبِ الغِشَاءِ المَطَّاطِيِّ لِلْأَسْفَلِ؟",
        "focusWord": "تَنْتَفِخُ البَالُونَتَانِ",
        "options": [
          {
            "text": "يَدْخُلُ الهَوَاءُ وَتَنْتَفِخُ البَالُونَتَانِ (عَمَلِيَّةُ الشَّهِيقِ)",
            "correct": true
          },
          {
            "text": "تَنْكَمِشُ الزُّجَاجَةُ",
            "correct": false
          },
          {
            "text": "يَتَوَقَّفُ الهَوَاءُ",
            "correct": false
          },
          {
            "text": "تَتَحَوَّلُ لِمَاءٍ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الأَدَوَاتُ المُسْتَخْدَمَةُ فِي تَجْرِبَةِ صُنْعِ سَمَّاعَةٍ مَنْزِلِيَّةٍ لِسَمَاعِ دَقَّاتِ القَلْبِ؟",
        "focusWord": "قِمْعٌ وَأُنْبُوبٌ مَرِنٌ",
        "options": [
          {
            "text": "قِمْعٌ وَأُنْبُوبٌ مَرِنٌ وَغِشَاءُ بَالُونٍ",
            "correct": true
          },
          {
            "text": "تُرَابٌ وَخَلٌّ",
            "correct": false
          },
          {
            "text": "بَطَاطَا وَمَسَامِيرُ",
            "correct": false
          },
          {
            "text": "مِلْحٌ وَمِغْنَاطِيسُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "البَالُونَتَانِ دَاخِلَ الزُّجَاجَةِ",
          "left": "تُمَثِّلَانِ الرِّئَتَيْنِ فِي الشَّهِيقِ وَالزَّفِيرِ"
        },
        {
          "right": "الغِشَاءُ المَطَّاطِيُّ السُّفْلِيُّ",
          "left": "يُمَثِّلُ عَضَلَةَ الحِجَابِ الحَاجِزِ"
        },
        {
          "right": "القِمْعُ وَالأُنْبُوبُ المَرِنُ",
          "left": "سَمَّاعَةٌ مَنْزِلِيَّةٌ لِسَمَاعِ نَبْضِ القَلْبِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَدَوَاتِ تَجْرِبَتَيِ الرِّئَةِ البَالُونِيَّةِ وَسَمَّاعَةِ القَلْبِ:",
        "correct": [
          "زُجَاجَةٌ وَبَالُونَتَانِ",
          "غِشَاءٌ مَطَّاطِيٌّ",
          "قِمْعٌ وَأُنْبُوبٌ مَرِنٌ",
          "سَمَاعُ نَبْضِ القَلْبِ"
        ],
        "wrong": [
          "حِجَارَةٌ بُرْكَانِيَّةٌ",
          "بُرَادَةُ حَدِيدٍ"
        ]
      },
      "applyStep": "أُطَبِّقُ تَجْرِبَةَ الرِّئَةِ البَالُونِيَّةِ وَأَسْتَمِعُ لِنَبْضِ القَلْبِ بَعْدَ الرِّيَاضَةِ لِأَرَى كَيْفَ يَزْدَادُ نَشَاطُهُ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt4.jpg",
      "title": "الدَّرْسُ (1): البِدَايَةُ التَّأْسِيسِيَّةُ (المَسَارُ الأَوَّلُ) + فِيزْيَاءُ الوُضُوءِ",
      "subtitle": "الوَقْتُ: 30 دَقِيقَةً يَوْمِيًّا | الهَدَفُ: طَاقَةٌ، مُرُونَةٌ، وَقُوَّةٌ مُتَكَامِلَةٌ",
      "slideText": "⚡ الدَّرْسُ (1) البِدَايَةُ التَّأْسِيسِيَّةُ (المَسَارُ الأَوَّلُ — 30 دَقِيقَةً يَوْمِيًّا): (1) ضَبْطُ الطَّاقَةِ: التَّسْبِيحُ الحَرَكِيُّ. (2) فَكُّ ضَغْطِ الفَقَرَاتِ: القِيَامُ النَّقِيُّ. (3) البِنَاءُ العَضَلِيُّ: تَمْرِينُ البِلَانْكِ (Plank). (4) تَقْوِيَةُ الاتِّزَانِ: السُّكُونُ الكَوَانْتِيُّ. (5) الاسْتِجَابَةُ العَصَبِيَّةُ: تَغْيِيرُ الاتِّجَاهِ المُفَاجِئُ وَرَدُّ الفِعْلِ. (6) التَّدَفُّقُ وَالاسْتِرْخَاءُ: الجُلُوسُ فِي صَمْتٍ وَتَأَمُّلٍ. • ثَانِيًا: الهَنْدَسَةُ الحَرَكِيَّةُ لِلْعِبَادَةِ (مِيكَانِيكَا الاسْتِرَاحَةِ وَفِيزْيَاءُ الوُضُوءِ): تَطْهِيرُ الهَالَةِ الكَهْرُومِغْنَاطِيسِيَّةِ، التَّوَازُنُ العَصَبِيُّ، وَتَفْرِيغُ الشِّحْنَاتِ السَّاكِنَةِ لِلْأَرْضِ.",
      "q1": {
        "q": "مَا الفَقَرَاتُ السِّتُّ فِي (الدَّرْسِ الأَوَّلِ: البِدَايَةِ التَّأْسِيسِيَّةِ — المَسَارِ الأَوَّلِ)؟",
        "focusWord": "البِدَايَةُ التَّأْسِيسِيَّةُ",
        "options": [
          {
            "text": "التَّسْبِيحُ الحَرَكِيُّ، القِيَامُ النَّقِيُّ، البِلَانْكُ، السُّكُونُ الكَوَانْتِيُّ، تَغْيِيرُ الاتِّجَاهِ، وَالجُلُوسُ فِي تَأَمُّلٍ",
            "correct": true
          },
          {
            "text": "النَّوْمُ طَوَالَ النَّهَارِ",
            "correct": false
          },
          {
            "text": "الرَّكْضُ بِلَا إِحْمَاءٍ",
            "correct": false
          },
          {
            "text": "حَمْلُ الأَثْقَالِ الخَطِرَةِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الفَوَائِدُ العِلْمِيَّةُ وَالفِيزْيَائِيَّةُ لِلْوُضُوءِ فِي (الهَنْدَسَةِ الحَرَكِيَّةِ لِلْعِبَادَةِ)؟",
        "focusWord": "فِيزْيَاءُ الوُضُوءِ",
        "options": [
          {
            "text": "تَطْهِيرُ الهَالَةِ الكَهْرُومِغْنَاطِيسِيَّةِ، وَتَحْقِيقُ التَّوَازُنِ العَصَبِيِّ، وَتَفْرِيغُ الشِّحْنَاتِ السَّاكِنَةِ",
            "correct": true
          },
          {
            "text": "زِيَادَةُ التَّوَتُّرِ العَصَبِيِّ",
            "correct": false
          },
          {
            "text": "إِجْهَادُ المَفَاصِلِ",
            "correct": false
          },
          {
            "text": "تَقْلِيلُ الأُكْسِجِينِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "أَيُّ تَمْرِينٍ يُسْتَخْدَمُ لِلْبِنَاءِ العَضَلِيِّ فِي المَسَارِ الأَوَّلِ؟",
        "focusWord": "البِلَانْكُ (Plank)",
        "options": [
          {
            "text": "تَمْرِينُ البِلَانْكِ (Plank) لِتَقْوِيَةِ الجِذْعِ وَالعَضَلَاتِ",
            "correct": true
          },
          {
            "text": "تَمْرِينُ التَّثَاؤُبِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ الغَمْزِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ الصُّرَاخِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "البِنَاءُ العَضَلِيُّ فِي المَسَارِ الأَوَّلِ",
          "left": "تَمْرِينُ البِلَانْكِ (Plank)"
        },
        {
          "right": "تَقْوِيَةُ الاتِّزَانِ",
          "left": "السُّكُونُ الكَوَانْتِيُّ عَلَى قَدَمٍ وَاحِدَةٍ"
        },
        {
          "right": "فِيزْيَاءُ الوُضُوءِ",
          "left": "تَطْهِيرُ الهَالَةِ الكَهْرُومِغْنَاطِيسِيَّةِ وَالتَّوَازُنُ العَصَبِيُّ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَنَاصِرَ الدَّرْسِ الأَوَّلِ (البِدَايَةِ التَّأْسِيسِيَّةِ وَفِيزْيَاءِ الوُضُوءِ):",
        "correct": [
          "التَّسْبِيحُ الحَرَكِيُّ وَالقِيَامُ النَّقِيُّ",
          "تَمْرِينُ البِلَانْكِ (Plank)",
          "السُّكُونُ الكَوَانْتِيُّ وَتَغْيِيرُ الاتِّجَاهِ",
          "فِيزْيَاءُ الوُضُوءِ وَالتَّوَازُنُ العَصَبِيُّ"
        ],
        "wrong": [
          "إِهْمَالُ الوُضُوءِ وَالنَّظَافَةِ",
          "الاهْتِزَازُ وَالتَّسَرُّعُ فِي البِلَانْكِ"
        ]
      },
      "applyStep": "أُحَافِظُ عَلَى الوُضُوءِ بِإِتْقَانٍ وَأُطَبِّقُ تَمْرِينَ القِيَامِ النَّقِيِّ وَالبِلَانْكِ وَالسُّكُونِ الكَوَانْتِيِّ."
    }
  },
  {
    "w": 5,
    "secNum": 2,
    "heavenName": "سَمَاءُ الأَحَدِ الثَّانِيَةُ (هـ و ز ح)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ وَالفَقَارِيَّاتِ وَاللَّافَقَارِيَّاتِ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "هـ",
    "jummal": 5,
    "prophet": "إِبْرَاهِيمُ (ع)",
    "virtue": "التَّفَكُّرُ",
    "unitHeader": "الوَحْدَةُ الخَامِسَةُ : نَبِيُّ اللهِ إِبْرَاهِيمُ الخَلِيلُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "تَأَمَّلَ نَبِيُّ اللهِ إِبْرَاهِيمُ (ع) الكَوْكَبَ وَالقَمَرَ وَالشَّمْسَ فَرَآهَا تَغِيبُ، فَأَعْلَنَ بِيَقِينٍ أَنَّ اللهَ هُوَ خَالِقُ الكَوْنِ العَظِيمِ الَّذِي لَا يَغِيبْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): نَارُ الكِبْرِ وَالغَضَبِ فِي صَدْرِ النُّمْرُودِ وَقَوْمِهِ حِينَ أَوْقَدُوا النَّارَ العُظْمَى وَرَمَوْا فِيهَا الخَلِيلَ بِالمَنْجَنِيقِ، فَجَعَلَهَا اللهُ ﴿بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ﴾. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ فِي عِبَادَةِ الكَوَاكِبِ وَالأَصْنَامِ، وَادِّعَاءُ النُّمْرُودِ الكَاذِبُ لِلرُّبُوبِيَّةِ الَّذِي أَبْطَلَهُ اللهُ بِبَعُوضَةٍ صَغِيرَةٍ تَطِيرُ فِي الهَوَاءِ، وَوَسْوَسَةُ إِبْلِيسَ الخَادِعَةُ عِنْدَ الجَمَرَاتِ الثَّلَاثِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): تَفَكُّرُ إِبْرَاهِيمَ العَقْلِيُّ فِي مَلَكُوتِ السَّمَاوَاتِ وَالأَرْضِ، وَمُنَاظَرَتُهُ لِلنُّمْرُودِ، وَتَحَوُّلُ الرَّمْلِ فِي كِيسِهِ إِلَى دَقِيقٍ طَيِّبٍ، وَإِحْيَاءُ الطُّيُورِ الأَرْبَعَةِ عَلَى الجِبَالِ، وَرَفْعُ قَوَاعِدِ الكَعْبَةِ مِنْ صُخُورِ الأَرْضِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): بِرُّ إِبْرَاهِيمَ وَطَاعَتُهُ المُطْلَقَةُ لِرَبِّهِ وَحِلْمُهُ الأَوَّاهُ، وَقَطَرَاتُ المَاءِ الَّتِي حَمَلَتْهَا الضِّفْدَعَةُ، وَتَفَجُّرُ مَاءِ زَمْزَمَ، وَطَاعَةُ إِسْمَاعِيلَ فِي الذَّبْحِ العَظِيمِ، وَتَهْذِيبُ شَهَوَاتِ النَّفْسِ المُمَثَّلَةِ فِي الطُّيُورِ الأَرْبَعَةِ.",
    "storyParagraphs": [
      "فِي مَطْلَعِ فَلَكِ يَوْمِ الأَحَدِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ خَمْسَةٍ فِي مَنْزِلَةِ النَّارِ الَّتِي صَارَتْ بَرْدًا وَسَلَامًا عَلَى أَهْلِ الإِيمَانْ، وَهُوَ أَبُونَا البَرُّ المُطِيعُ لِرَبِّهِ خَلِيلُ اللهِ إِبْرَاهِيمُ عَلَيْهِ السَّلَامْ. وُلِدَ فِي بَابِلَ فِي زَمَنِ المَلِكِ الظَّالِمِ النُّمْرُودِ الَّذِي اشْتَعَلَتْ فِي قَلْبِهِ نَارُ الكِبْرِ وَالغَضَبْ، فَأَخْفَتْهُ أُمُّهُ الصَّالِحَةُ فِي كَهْفٍ آمِنٍ وَجَعَلَ اللهُ رِزْقَهُ فِي أَصَابِعِهِ الخَمْسَةِ يَمُصُّ مِنْهَا لَبَنًا وَعَسَلًا وَمَاءً طَيِّبًا حَتَّى كَبِرْ. وَكَشَفَ اللهُ لِبَصَرِهِ مَلَكُوتَ السَّمَاوَاتِ وَالأَرْضِ فَرَأَى العَرْشَ وَأَنْوَارَ أَهْلِ البَيْتِ الخَمْسَةِ الأَطْهَارْ، فَامْتَلَأَ قَلْبُهُ السَّلِيمُ بِاليَقِينْ، ثُمَّ نَاظَرَ قَوْمَهُ بِحُجَّةِ العَقْلِ لِيُبْطِلَ رِيحَ الوَهْمِ فِي عِبَادَةِ الكَوْكَبِ وَالقَمَرِ وَالشَّمْسِ حِينَ غَرَبَتْ وَغَابَتْ عَنِ الأَبْصَارْ، وَتَوَجَّهَ بِقَلْبِهِ حَنِيفًا مُسْلِمًا إِلَى اللهِ فَاطِرِ السَّمَاوَاتِ وَالأَرْضِ الَّذِي هَدَى الخَلْقَ إِلَى الحَقِّ المَتِينْ. وَنَصَحَ عَمَّهُ آزَرَ الَّذِي كَانَ يَنْحِتُ الأَصْنَامَ بِكُلِّ أَدَبٍ وَبِرٍّ قَائِلًا سَلَامٌ عَلَيْكَ سَأَسْتَغْفِرُ لَكَ رَبَّ العَالَمِينْ، أَمَّا أَبُوهُ الحَقِيقِيُّ تَارَحُ فَكَانَ مُؤْمِنًا طَاهِرًا مُوَحِّدًا لِرَبِّ العِبَادْ.",
      "وَفِي يَوْمِ عِيدِ القَوْمِ دَخَلَ إِلَى مَعْبَدِ الأَصْنَامِ وَحَطَّمَهَا بِيَدِهِ القَوِيَّةِ إِلَّا كَبِيرَهُمْ لِيُوقِظَ عُقُولَهُمْ مِنَ الضَّلَالْ، فَلَمَّا سَأَلُوهُ قَالَ بَلْ فَعَلَهُ كَبِيرُهُمْ فَسَلُوهُمْ إِنْ كَانُوا يَنْطِقُونْ. فَعَرَفُوا بِعُقُولِهِمْ أَنَّ الحِجَارَةَ لَا تَنْفَعُ وَلَا تَضُرُّ وَأَنَّ لِلْكَوْنِ خَالِقًا وَاحِدًا هُوَ إِلٰهٌ عَظِيمْ، لٰكِنَّ النُّمْرُودَ وَأَعْوَانَهُ غَلَبَتْهُمْ نَارُ الغَضَبِ فَأَوْقَدُوا نَارًا عُظْمَى ذَاتَ لَهَبٍ شَدِيدْ، وَوَضَعُوا الخَلِيلَ فِي المَنْجَنِيقِ لِيُلْقُوهُ فِيهَا أَمَامَ عُيُونِ النَّاسِ الَّذِينَ وَقَفُوا كَـشُهُودٍ عَلَى ذٰلِكَ الحَدَثِ الكَبِيرْ. وَجَاءَتِ الضِّفْدَعَةُ الصَّغِيرَةُ تَرُشُّ عَلَى النَّارِ قَطَرَاتٍ مِنَ المِيَاهْ، وَفِي الهَوَاءِ سَأَلَهُ المَلَكُ جِبْرِيلُ هَلْ لَكَ مِنْ حَاجَةٍ فَأَجَابَ بِلِسَانِ التَّوَكُّلِ حَسْبِيَ اللهُ وَنِعْمَ الوَكِيلْ، فَأَمَرَ اللهُ النَّارَ أَنْ كُونِي بَرْدًا وَسَلَامًا عَلَى إِبْرَاهِيمَ فَتَحَوَّلَتْ رَوْضَةً خَضْرَاءَ لَطِيفَةً فِي الحَالْ. ثُمَّ نَاظَرَ النُّمْرُودَ بِحُجَّةِ العَقْلِ وَقَالَ لَهُ إِنَّ اللهَ يُحْيِي وَيُمِيتُ وَيَأْتِي بِالشَّمْسِ مِنَ المَشْرِقِ فَأْتِ بِهَا مِنَ المَغْرِبِ فَبُهِتَ الظَّالِمُ وَانْكَسَرَ وَهْمُهْ، وَأَهْلَكَ اللهُ جُنُودَ النُّمْرُودِ وَأَرْسَلَ عَلَيْهِ بَعُوضَةً صَغِيرَةً دَخَلَتْ فِي أَنْفِهِ فَكَسَرَتْ غُرُورَهُ وَتَجَبُّرَهْ.",
      "وَسَأَلَ الخَلِيلُ رَبَّهُ أَنْ يُرِيَهُ كَيْفَ يُحْيِي المَوْتَى لِيَزْدَادَ قَلْبُهُ طُمَأْنِينَةً وَسَلَامْ، فَأَمَرَهُ اللهُ أَنْ يَأْخُذَ أَرْبَعَةً مِنَ الطَّيْرِ هِيَ الطَّاوُوسُ وَالدِّيكُ وَالغُرَابُ وَالحَمَامَةُ الَّتِي تُمَثِّلُ طَبَائِعَ النَّفْسِ الأَرْبَعْ، وَيَجْعَلَ عَلَى كُلِّ جَبَلٍ مِنْهَا جُزْءًا ثُمَّ يُنَادِيهَا فَتَطَايَرَتِ الأَجْزَاءُ وَعَادَتْ حَيَّةً بِقُدْرَةِ المَلِكِ العَلَّامْ. ثُمَّ هَاجَرَ مَعَ زَوْجَتِهِ العَفِيفَةِ سَارَةَ وَابْنِ أَخِيهِ لُوطٍ إِلَى الأَرْضِ المُبَارَكَةِ عَلَى نُورٍ وَهِدَايَةٍ مِنَ اللهْ، وَفِي الطَّرِيقِ صَنَعَ لِسَارَةَ صُنْدُوقًا يَسْتُرُهَا صَوْنًا لِعِفَّتِهَا وَحَيَائِهَا عَنْ أَعْيُنِ النَّاسْ، فَلَمَّا حَاوَلَ مَلِكٌ ظَالِمٌ أَنْ يَمُدَّ يَدَهُ إِلَيْهَا حَفِظَهَا اللهُ وَيَبِسَتْ يَدُهُ حَتَّى تَابَ وَأَكْرَمَهَا وَأَهْدَاهَا السَّيِّدَةَ هَاجَرَ لِتَخْدِمَهَا بِإِحْسَانْ. وَاتَّخَذَ اللهُ إِبْرَاهِيمَ خَلِيلًا لِأَنَّهُ كَانَ كَثِيرَ السُّجُودِ لَا يَسْأَلُ أَحَدًا غَيْرَ اللهِ وَلَا يَرُدُّ سَائِلًا وَيُطْعِمُ الضِّيفَانْ، وَحِينَ نَفِدَ الطَّعَامُ يَوْمًا مَلَأَ كِيسَهُ بِالرَّمْلِ النَّظِيفِ حَيَاءً مِنْ أَهْلِهِ فَحَوَّلَهُ اللهُ بِبَرَكَتِهِ إِلَى دَقِيقٍ أَبْيَضَ خَبَزَتْ مِنْهُ سَارَةُ أَطْيَبَ خُبْزٍ حَلَالْ. وَلَمَّا زَارَتْهُ المَلَائِكَةُ جَاءَهُمْ بِعِجْلٍ حَنِيذٍ مَشْوِيٍّ فَبَشَّرُوهُ بِابْنٍ عَالِمٍ هُوَ إِسْحَاقُ وَمِنْ وَرَائِهِ يَعْقُوبْ، وَشَفَعَ عِنْدَهُمْ بِحِلْمِهِ وَرِقَّةِ قَلْبِهِ لَعَلَّ قَوْمَ لُوطٍ يَرْجِعُونَ عَنِ العِصْيَانْ.",
      "وَبِأَمْرِ اللهِ أَسْكَنَ زَوْجَتَهُ هَاجَرَ وَابْنَهُ الرَّضِيعَ إِسْمَاعِيلَ فِي وَادِي مَكَّةَ عِنْدَ بَيْتِ اللهِ المُحَرَّمْ، وَدَعَا رَبَّهُ أَنْ يَجْعَلَ أَفْئِدَةَ النَّاسِ تَهْوِي إِلَيْهِمْ وَيَرْزُقَهُمْ مِنَ الثَّمَرَاتِ وَالأَمَانْ. فَسَعَتْ هَاجَرُ بِرِجْلَيْهَا بَيْنَ الصَّفَا وَالمَرْوَةِ سَبْعَةَ أَشْوَاطْ، حَتَّى فَجَّرَ اللهُ تَحْتَ قَدَمَيْ إِسْمَاعِيلَ بِئْرَ زَمْزَمَ المُبَارَكَةَ فَعَاشَا فِي خَيْرٍ وَسَلَامْ. وَكَانَ الخَلِيلُ يَزُورُهُمْ عَلَى البُرَاقِ وَأَرْشَدَ إِسْمَاعِيلَ بِحِكْمَتِهِ إِلَى تَثْبِيتِ عَتَبَةِ بَابِهِ الطَّيِّبَةِ أَيِ الزَّوْجَةِ الصَّالِحَةِ الشَّاكِرَةِ الَّتِي تَصُونُ الدَّارْ، وَلَمَّا كَبِرَ إِسْمَاعِيلُ رَأَى الخَلِيلُ فِي المَنَامِ أَنَّهُ يَذْبَحُهُ امْتِحَانًا لِلطَّاعَةِ وَالتَّسْلِيمْ. فَقَالَ إِسْمَاعِيلُ بِأَدَبٍ يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ سَتَجِدُنِي إِنْ شَاءَ اللهُ مِنَ الصَّابِرِينْ، وَرَجَمَ إِبْرَاهِيمُ الشَّيْطَانَ بِيَدِهِ بِسَبْعِ حَصَيَاتٍ عِنْدَ الجَمَرَاتِ الثَّلَاثِ فَأَبْطَلَ وَسْوَسَتَهْ، وَلَمَّا أَسْلَمَا لِأَمْرِ اللهِ فَدَاهُ رَبُّهُ بِكَبْشٍ عَظِيمٍ مِنَ الجَنَّةِ لِيَكُونَ سُنَّةَ الهَدْيِ فِي الحَجِّ إِلَى يَوْمِ الدِّينْ.",
      "ثُمَّ تَعَاوَنَ الخَلِيلُ وَابْنُهُ إِسْمَاعِيلُ فِي رَفْعِ قَوَاعِدِ الكَعْبَةِ المُشَرَّفَةِ لِتَكُونَ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ فِيهِ بَرَكَةٌ وَهُدًى لِلْعَالَمِينْ. وَوَقَفَ إِبْرَاهِيمُ بِقَدَمَيْهِ عَلَى حَجَرِ المَقَامِ فَلَانَ الصَّخْرُ تَحْتَ رِجْلَيْهِ وَبَقِيَ أَثَرُهُ آيَةً بَاهِرَةْ، وَطَهَّرَ مَعَ ابْنِهِ بَيْتَ اللهِ الحَرَامَ وَصَعِدَ فَوْقَ الجَبَلِ فَأَذَّنَ فِي النَّاسِ بِالحَجِّ فَلَبَّى نِدَاءَهُ كُلُّ مُؤْمِنْ. وَأَنْزَلَ اللهُ عَلَيْهِ صُحُفَ إِبْرَاهِيمَ المَمْلُوءَةَ بِالحِكْمَةِ وَالمَوَاعِظْ، وَعَلَّمَ النَّاسَ سُنَنَ الفِطْرَةِ وَالنَّظَافَةِ حَيْثُ كَانَ التَّطَهُّرُ بِالمَاءِ وَالسِّوَاكُ وَتَقْلِيمُ الأَظْفَارِ وَالخِتَانُ وَالغُسْلُ مِمَّا يُطَهِّرُ البَدَنَ وَالثِّيَابْ، وَكَانَ أَوَّلَ مَنْ ظَهَرَ الشَّيْبُ الأَبْيَضُ فِي لِحْيَتِهِ فَجَعَلَهُ اللهُ لَهُ نُورًا وَوَقَارًا فِي الدُّنْيَا وَالآخِرَةْ. وَحَمِدَ رَبَّهُ الَّذِي وَهَبَ لَهُ عَلَى الكِبَرِ إِسْمَاعِيلَ وَإِسْحَاقْ، وَسَأَلَ اللهَ أَنْ يَجْعَلَ لَهُ لِسَانَ صِدْقٍ فِي الآخِرِينَ وَهُوَ أَمِيرُ المُؤْمِنِينَ عَلِيٌّ عَلَيْهِ السَّلَامْ، وَلَمَّا أَتَمَّ كَلِمَاتِ رَبِّهِ رَفَعَهُ اللهُ بَعْدَ النُّبُوَّةِ وَالخُلَّةِ إِلَى مَقَامِ الإِمَامَةْ، وَاسْتَجَابَ دُعَاءَهُ فَجَعَلَ فِي ذُرِّيَّتِهِ الطَّاهِرَةِ خَاتَمَ الأَنْبِيَاءِ مُحَمَّدًا وَأَهْلَ بَيْتِهِ المَعْصُومِينَ الَّذِينَ بِهِمْ يَهْدِي اللهُ العِبَادَ إِلَى صِرَاطِهِ المُسْتَقِيمْ."
    ],
    "words": [
      {
        "word": "يَهْدِي",
        "desc": "وسط متصل / ساكن: ـهْـ",
        "raw": "يَهْدِي (وسط متصل / ساكن: ـهْـ)"
      },
      {
        "word": "المِيَاهْ",
        "desc": "آخر منفصل / ساكن وقفا: هْ",
        "raw": "المِيَاهْ (آخر منفصل / ساكن وقفا: هْ)"
      },
      {
        "word": "هَدَى",
        "desc": "أول منفصل / متحرك بالفتح: هَـ",
        "raw": "هَدَى (أول منفصل / متحرك بالفتح: هَـ)"
      },
      {
        "word": "الهَدْيِ",
        "desc": "أول متصل / متحرك بالفتح: ـهَـ",
        "raw": "الهَدْيِ (أول متصل / متحرك بالفتح: ـهَـ)"
      },
      {
        "word": "لَهَبٍ",
        "desc": "وسط متصل / متحرك بالفتح: ـهَـ",
        "raw": "لَهَبٍ (وسط متصل / متحرك بالفتح: ـهَـ)"
      },
      {
        "word": "وَهَبَ",
        "desc": "وسط منفصل / متحرك بالفتح: هَـ",
        "raw": "وَهَبَ (وسط منفصل / متحرك بالفتح: هَـ)"
      },
      {
        "word": "تَوَجَّهَ",
        "desc": "آخر متصل / متحرك بالفتح: ـهَ",
        "raw": "تَوَجَّهَ (آخر متصل / متحرك بالفتح: ـهَ)"
      },
      {
        "word": "هُدًى",
        "desc": "أول منفصل / متحرك بالضم: هُـ",
        "raw": "هُدًى (أول منفصل / متحرك بالضم: هُـ)"
      },
      {
        "word": "إِلٰهٌ",
        "desc": "آخر متصل / متحرك بالضم: ـهٌ",
        "raw": "إِلٰهٌ (آخر متصل / متحرك بالضم: ـهٌ)"
      },
      {
        "word": "هِدَايَةٍ",
        "desc": "أول منفصل / متحرك بالكسر: هِـ",
        "raw": "هِدَايَةٍ (أول منفصل / متحرك بالكسر: هِـ)"
      },
      {
        "word": "طَهَّرَ",
        "desc": "وسط متصل / مضعف بالفتح: ـهَّـ",
        "raw": "طَهَّرَ (وسط متصل / مضعف بالفتح: ـهَّـ)"
      },
      {
        "word": "التَّطَهُّرُ",
        "desc": "وسط متصل / مضعف بالضم: ـهُّـ",
        "raw": "التَّطَهُّرُ (وسط متصل / مضعف بالضم: ـهُّـ)"
      },
      {
        "word": "يُطَهِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـهِّـ",
        "raw": "يُطَهِّرُ (وسط متصل / مضعف بالكسر: ـهِّـ)"
      },
      {
        "word": "هَاجَرَ",
        "desc": "أول منفصل / ممدود بالألف: هَا",
        "raw": "هَاجَرَ (أول منفصل / ممدود بالألف: هَا)"
      },
      {
        "word": "شُهُودٍ",
        "desc": "وسط متصل / ممدود بالواو: ـهُو",
        "raw": "شُهُودٍ (وسط متصل / ممدود بالواو: ـهُو)"
      },
      {
        "word": "إِبْرَاهِيمُ",
        "desc": "وسط منفصل / ممدود بالياء: هِي",
        "raw": "إِبْرَاهِيمُ (وسط منفصل / ممدود بالياء: هِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الهَاءِ (هـ): النُّطْقُ السَّلِيمُ لِحَرْفِ الهَاءِ مِنْ مَخْرَجِ أَقْصَى الحَلْقِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى كَلِمَةِ التَّوَكُّلِ: «حَسْبِيَ اللهُ وَنِعْمَ الوَكِيلُ»، وَالتَّلْبِيَةِ، وَالقَوْلِ اللَّيِّنِ، وَالدُّعَاءِ بِـ«لِسَانِ الصِّدْقِ»."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الدَّائِرَةُ وَالأَنْوَارُ الخَمْسَةُ وَالشَّكْلُ الخُمَاسِيُّ: مُشَاهَدَةُ التِفَافِ الخَطِّ فِي حَرْفِ الهَاءِ (هـ / ـهـ / ـه / ه) لِيَصْنَعَ حَلْقَةً وَمَدَارًا كَطَوَافِ الحُجَّاجِ حَوْلَ الكَعْبَةِ، وَالتَّفَكُّرُ البَصَرِيُّ فِي رُؤْيَةِ إِبْرَاهِيمَ لِأَنْوَارِ أَهْلِ البَيْتِ الخَمْسَةِ فِي المَلَكُوتِ، وَالتَّعَرُّفُ عَلَى الشَّكْلِ الخُمَاسِيِّ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ خَلِيلِ الرَّحْمٰنِ الكَامِلَةُ وَنِدَاءُ الحَجِّ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ أَبِي الأَنْبِيَاءِ وَمَوَاعِظِ صُحُفِ إِبْرَاهِيمَ وَنِدَائِهِ بِالحَجِّ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ خَمْسَةٌ (5): تَدْرِيبُ اليَدِ عَلَى العَدِّ بِأَصَابِعِ الكَفِّ الخَمْسَةِ (الَّتِي جَعَلَ اللهُ فِيهَا رِزْقَ إِبْرَاهِيمَ فِي الكَهْفِ)، وَكِتَابَةِ الرَّقْمِ (5) الشَّبِيهِ بِحَرْفِ الهَاءِ المُنْفَصِلَةِ (ه)، وَمَهَارَةِ اليَدِ فِي البِنَاءِ (رَفْعُ قَوَاعِدِ الكَعْبَةِ وَصُنْعُ الصُّنْدُوقِ)، وَإِكْرَامِ الضَّيْفِ، وَرَمْيِ الجَمَرَاتِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السَّعْيِ وَالوُقُوفِ المُتَوَازِنِ عَلَى قَدَمٍ وَاحِدَةٍ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ المَشْيِ وَالسَّعْيِ بَيْنَ الصَّفَا وَالمَرْوَةِ، وَتَمْرِينِ التَّوَازُنِ بِالوُقُوفِ عَلَى قَدَمٍ ثُمَّ القَدَمِ الأُخْرَى كَمَا وَقَفَ إِبْرَاهِيمُ عَلَى حَجَرِ «مَقَامِ إِبْرَاهِيمَ»."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ مَاءِ زَمْزَمَ وَالدَّقِيقِ وَآدَابِ الضِّيَافَةِ: تَعَلُّمُ خَصَائِصِ مَاءِ زَمْزَمَ الشَّافِيَةِ، وَفَوَائِدِ اللَّبَنِ وَالعَسَلِ وَالخُبْزِ مِنَ الدَّقِيقِ النَّقِيِّ، وَآدَابِ طَهْيِ اللُّحُومِ المَشْوِيَّةِ النَّاضِجَةِ (العِجْلِ الحَنِيذِ) لِلضُّيُوفِ، وَمَعْرِفَةِ طَبَائِعِ الطُّيُورِ الأَرْبَعَةِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "سُنَنُ الفِطْرَةِ الإِبْرَاهِيمِيَّةِ وَالصَّوْنِ وَالعِفَّةِ: تَعَلُّمُ خِصَالِ الفِطْرَةِ وَالنَّظَافَةِ الَّتِي سَنَّهَا إِبْرَاهِيمُ (عَلَيْهِ السَّلَامُ) مِنَ الاسْتِنْجَاءِ بِالمَاءِ الطَّهُورِ، وَالخِتَانِ، وَتَقْلِيمِ الأَظْفَارِ، وَالسِّوَاكِ، وَتَطْهِيرِ المَسَاجِدِ، وَصَوْنِ حُرْمَةِ الأُسْرَةِ وَسَتْرِهَا (كَمَا صَانَ السَّيِّدَةَ سَارَةَ فِي الصُّنْدُوقِ)، وَاخْتِيَارِ الصُّحْبَةِ الصَّالِحَةِ الشَّاكِرَةِ."
      }
    },
    "grammar": {
      "topic": "الجُمْلَةُ الاِسْمِيَّةُ: تَبْدَأُ بِاسْمٍ",
      "rule": "الجُمْلَةُ الاِسْمِيَّةُ هِيَ كُلُّ جُمْلَةٍ تَبْدَأُ بِاسْمٍ، وَتَتَكَوَّنُ مِنْ رُكْنَيْنِ هُمَا: المُبْتَدَأُ وَالخَبَرْ.",
      "example": "الهِلَالُ مُنِيرٌ — السَّمَاءُ صَافِيَةٌ — اللهُ خَالِقٌ.",
      "focusWord": "الهِلَالُ مُنِيرٌ",
      "q": "أَيُّ جُمْلَةٍ مِنْ هٰذِهِ الجُمَلِ هِيَ «جُمْلَةٌ اسْمِيَّةٌ» تَبْدَأُ بِاسْمْ؟",
      "opts": [
        "الهِلَالُ مُنِيرٌ",
        "طَلَعَ البَدْرُ",
        "يَطِيرُ الهُدْهُدُ",
        "اِفْتَحِ الكِتَابَ"
      ]
    },
    "earIirab": {
      "topic": "رَفْعُ المُبْتَدَأِ وَالخَبَرِ بِالضَّمَّةِ (ـُ / ـٌ)",
      "rule": "فِي الجُمْلَةِ الاِسْمِيَّةِ يَكُونُ المُبْتَدَأُ مَرْفُوعًا بِالضَّمَّةِ (ـُ)، وَالخَبَرُ مَرْفُوعًا بِالتَّنْوِينِ المَضْمُومِ (ـٌ).",
      "sentence": "الهَوَاءُ نَقِيٌّ.",
      "targetWord": "الهَوَاءُ",
      "caseAns": "مُبْتَدَأٌ مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 5,
      "numName": "خَمْسَةٌ",
      "eqDisplay": "2 + 3 = 5",
      "subDisplay": "5 - 2 = 3",
      "compDisplay": "5 > 3",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "2 + 3 = ؟",
        "ans": "5 (خَمْسَةٌ)",
        "wrong": [
          "3 (ثَلَاثَةٌ)",
          "6 (سِتَّةٌ)",
          "2 (اثْنَانِ)"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "5 - 2 = ؟",
        "ans": "3 (ثَلَاثَةٌ)",
        "wrong": [
          "5 (خَمْسَةٌ)",
          "1 (وَاحِدٌ)",
          "4 (أَرْبَعَةٌ)"
        ]
      }
    },
    "sport": {
      "title": "الرَّسْمُ المَرْآتِيُّ المُزْدَوَجُ بِاليَدَيْنِ",
      "middleText": "أُمْسِكُ قَلَمَيْنِ بِيَدَيَّ الاثْنَتَيْنِ وَأَرْسُمُ دَائِرَتَيْنِ أَوْ قَلْبَيْنِ مُتَمَاثِلَيْنِ فِي الوَقْتِ نَفْسِهْ. يُوَحِّدُ هٰذَا التَّمْرِينُ مَهَارَةَ اليَدِ اليُمْنَى وَاليُسْرَى وَيُقَوِّي تَرْكِيزَ الدِّمَاغْ."
    },
    "sci": {
      "title": "فَقَارِيَّاتُ الدَّمِ الحَارِّ: الثَّدْيِيَّاتُ وَالطُّيُورُ",
      "summaryThird": "تَتَمَيَّزُ الثَّدْيِيَّاتُ وَالطُّيُورُ بِثَبَاتِ حَرَارَةِ أَجْسَامِهَا؛ فَالثَّدْيِيَّاتُ يَكْسُوهَا الشَّعْرُ أَوِ الصُّوفُ وَتُرْضِعُ صِغَارَهَا، وَالطُّيُورُ يَكْسُوهَا الرِّيشُ وَتَبِيضُ وَتُحَلِّقُ بِأَجْنِحَتِهَا.",
      "focusConcept": "الثَّدْيِيَّاتُ وَالطُّيُورُ",
      "factAns": "كَائِنَاتٌ فَقَارِيَّةٌ ثَابِتَةُ الحَرَارَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ البَصَرِ وَالعَيْنِ (حُور وَسُرُور - 5)",
      "storySentence": "تَأَمَّلَ سُرُورٌ النُّجُومَ وَالأَشْجَارَ وَعَرَفَ أَنَّ حَقَّ البَصَرِ هُوَ النَّظَرُ فِي آيَاتِ اللهِ لِلِاعْتِبَارِ وَالعِلْمِ، وَغَضُّ الطَّرْفِ عَمَّا لَا يَحِلُّ النَّظَرُ إِلَيْهْ.",
      "applyAction": "أَحْمِي عَيْنَيَّ مِنَ الإِجْهَادِ وَأَتَأَمَّلُ بِهِمَا جَمَالَ مَخْلُوقَاتِ اللهْ."
    },
    "rightsFullTitle": "(5) حق البصر",
    "rightsQuote": "وَأَمَّا حَقُّ بَصَرِكَ فَغَضُّهُ عَمَّا لا يَحِلُّ لَكَ وتَرْكُ ابْتِذَالِهِ إلاّ لِمَوضِعِ عِبْرَة تَسْتَقْبلُ بهَا بَصَرًا أَو تَسْتَفِيدُ بهَا عِلْمًا، فَإنَّ الْبَصَرَ بَابُ الِاعْتِبَارِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (5) حق البصر",
        "text": "وَأَمَّا حَقُّ بَصَرِكَ فَغَضُّهُ عَمَّا لا يَحِلُّ لَكَ وتَرْكُ ابْتِذَالِهِ إلاّ لِمَوضِعِ عِبْرَة تَسْتَقْبلُ بهَا بَصَرًا أَو تَسْتَفِيدُ بهَا عِلْمًا، فَإنَّ الْبَصَرَ بَابُ الِاعْتِبَارِ. — وَفِي سِيرَةِ إِبْرَاهِيمُ (ع): سُنَنُ الفِطْرَةِ الإِبْرَاهِيمِيَّةِ وَالصَّوْنِ وَالعِفَّةِ: تَعَلُّمُ خِصَالِ الفِطْرَةِ وَالنَّظَافَةِ الَّتِي سَنَّهَا إِبْرَاهِيمُ (عَلَيْهِ السَّلَامُ) مِنَ الاسْتِنْجَاءِ بِالمَاءِ الطَّهُورِ، وَالخِتَانِ، وَتَقْلِيمِ الأَظْفَارِ، وَالسِّوَاكِ، وَتَطْهِيرِ المَسَاجِدِ، وَصَوْنِ حُرْمَةِ الأُسْرَةِ وَسَتْرِهَا (كَمَا صَانَ السَّيِّدَةَ سَارَةَ فِي الصُّنْدُوقِ)، وَاخْتِيَارِ الصُّحْبَةِ الصَّالِحَةِ الشَّاكِرَةِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق البصر",
        "text": "👁️ حور ودرس البصر استيقظت حور على صوت صفارة سيارة إسعافٍ يخترق هدوء الصباح الباكر. دفعها الفضول نحو النافذة، وهناك تجمّدت في مكانها. رأت جارتهم تصرخ بانهيار، والذعر يملأ وجهها وهي تحتضن طفلها الصغير. كان المشهد مؤلمًا… رغوة بيضاء تتشكل حول فم الطفل الذي تهاوى بين يدي أمه المذعورة. ارتدت حور مسرعة إلى أمها، والحكاية تخرج من فمها متقطّعة من شدّة الفزع. لم تمضِ لحظات حتى كانت الأم على عتبة منزل الجيران لتطمئن وتعرف ما جرى. عادت بعد حين، وملامح الحزن تملأ وجهها. قالت بصوتٍ خافت: \"الطفل يعاني من اضطراب كهربائي حاد في دماغه… كاد أن يفقد حياته.\" جلسَت أم الصغير بعدها عند أم حور، وعيناها تلمعان بالدموع، وقالت بأسفٍ موجع: \"كنتُ أظن أنني أظلمه إن منعتُه من اللعب بالأجهزة. حسبتُ أني أقسو عليه… والآن كدتُ أن أفقده. صار يقضي كل وقته أمام الشاشات، فأرهق عينيه، ومع المحتوى غير المناسب الذي كان يراه، اختلّ توازنه حتى أصيب بما أصيب.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق البصر",
        "text": "كانت حور تتابع الحديث بصمتٍ ووجوم، وكأن الكلمات تُضيء في داخلها شيئًا غاب عنها طويلًا. همست لنفسها: \"الحمد لله… الآن فقط فهمت أمي.\" تذكّرت كم كانت تضيق بتلك القواعد التي تفرضها أمها حول الأجهزة والبرامج، وكم كانت تظنها مبالغةً في الحذر، لكنها الآن رأت بعينها ما كانت أمها تراه بقلبها. رفعت الأم يديها بالدعاء، تقول بخشوع: \"اللهم اشفِ الصغير، وامنح أهله القوة والصبر، وعلّمنا أن نرى بنورك لا بأهوائنا.\" اقتربت حور وجلست إلى جوارها، تراقب وجهها المضيء بالرحمة، وفي صمتٍ عميق فهمت أن الحبّ الحقيقي ليس في منح كل ما نريد، بل في حفظنا مما يؤذينا. ابتسمت الأم وقالت برفق: \"يا ابنتي، في كل ما نراه حولنا درسٌ من الله، فمن أحسن النظر تعلّم، ومن أغضّ بصره عن السوء نجا، فالبصر نعمة، ومتى طهُر النظر صفا القلب.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ",
      "topic": "الدَّرْسُ (1): فَقَارِيَّاتُ الدَّمِ الحَارِّ (1. الحَيَوَانَاتُ اللَّبُونَةُ الثَّدْيِيَّاتُ — 2. الطُّيُورُ)",
      "coverImg": "assets/y7/scince/s5.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s5.1.jpg",
          "text": "الدَّرْسُ (1) فَقَارِيَّاتُ الدَّمِ الحَارِّ — (1) الحَيَوَانَاتُ اللَّبُونَةُ (الثَّدْيِيَّاتُ): فَقَارِيَّاتٌ ثَابِتَةُ الحَرَارَةِ، تَتَكَاثَرُ بِالوِلَادَةِ وَتُرْضِعُ صِغَارَهَا، يَكْسُوهَا الشَّعْرُ أَوِ الصُّوفُ أَوِ الوَبَرُ وَتَتَنَفَّسُ بِالرِّئَتَيْنِ؛ مِنْهَا عَاشِبَةٌ (جَمَلٌ، بَقَرَةٌ، خَرُوفٌ، أَرْنَبٌ)، وَلَوَاحِمُ (أَسَدٌ، فَهْدٌ، ذِئْبٌ)، وَكَالِشَةٌ (دُبٌّ، قِرْدٌ، قُنْفُذٌ)."
        },
        {
          "img": "assets/y7/scince/s5.2.jpg",
          "text": "الدَّرْسُ (1) فَقَارِيَّاتُ الدَّمِ الحَارِّ — (2) الطُّيُورُ: فَقَارِيَّاتٌ ثَابِتَةُ الحَرَارَةِ، تَتَكَاثَرُ بِالبَيْضِ، يُغَطِّيهَا الرِّيشُ وَلَهَا جَنَاحَانِ وَتَتَنَفَّسُ بِالرِّئَتَيْنِ؛ مِنْهَا عَاشِبَةٌ (حَمَامَةٌ، بَبَّغَاءُ)، وَكَالِشَةٌ (عُصْفُورٌ، نَعَامَةٌ، بَطَّةٌ، طَاوُوسٌ)، وَلَوَاحِمُ (صَقْرٌ، بُومٌ، بِطْرِيقٌ، هُدْهُدٌ، نَوْرَسٌ)."
        }
      ],
      "text": "الدَّرْسُ (1) فَقَارِيَّاتُ الدَّمِ الحَارِّ — (1) الحَيَوَانَاتُ اللَّبُونَةُ (الثَّدْيِيَّاتُ): فَقَارِيَّاتٌ ثَابِتَةُ الحَرَارَةِ، تَتَكَاثَرُ بِالوِلَادَةِ وَتُرْضِعُ صِغَارَهَا، يَكْسُوهَا الشَّعْرُ أَوِ الصُّوفُ أَوِ الوَبَرُ وَتَتَنَفَّسُ بِالرِّئَتَيْنِ؛ مِنْهَا عَاشِبَةٌ (جَمَلٌ، بَقَرَةٌ، خَرُوفٌ، أَرْنَبٌ)، وَلَوَاحِمُ (أَسَدٌ، فَهْدٌ، ذِئْبٌ)، وَكَالِشَةٌ (دُبٌّ، قِرْدٌ، قُنْفُذٌ). الدَّرْسُ (1) فَقَارِيَّاتُ الدَّمِ الحَارِّ — (2) الطُّيُورُ: فَقَارِيَّاتٌ ثَابِتَةُ الحَرَارَةِ، تَتَكَاثَرُ بِالبَيْضِ، يُغَطِّيهَا الرِّيشُ وَلَهَا جَنَاحَانِ وَتَتَنَفَّسُ بِالرِّئَتَيْنِ؛ مِنْهَا عَاشِبَةٌ (حَمَامَةٌ، بَبَّغَاءُ)، وَكَالِشَةٌ (عُصْفُورٌ، نَعَامَةٌ، بَطَّةٌ، طَاوُوسٌ)، وَلَوَاحِمُ (صَقْرٌ، بُومٌ، بِطْرِيقٌ، هُدْهُدٌ، نَوْرَسٌ).",
      "q1": {
        "q": "مَا الصِّفَةُ الَّتِي تُمَيِّزُ الحَيَوَانَاتِ اللَّبُونَةَ (الثَّدْيِيَّاتِ) عَنْ بَقِيَّةِ الفَقَارِيَّاتِ؟",
        "focusWord": "تَتَكَاثَرُ بِالوِلَادَةِ",
        "options": [
          {
            "text": "تَتَكَاثَرُ بِالوِلَادَةِ وَتُرْضِعُ صِغَارَهَا الحَلِيبَ",
            "correct": true
          },
          {
            "text": "تَتَنَفَّسُ بِالخَيَاشِيمِ تَحْتَ المَاءِ",
            "correct": false
          },
          {
            "text": "يُغَطِّيهَا الرِّيشُ وَلَهَا مِنْقَارٌ",
            "correct": false
          },
          {
            "text": "لَيْسَ لَهَا عَمُودٌ فَقَرِيٌّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "أَيٌّ مِنْ هٰذِهِ الحَيَوَانَاتِ اللَّبُونَةِ يُصَنَّفُ مِنَ الكَالِشَةِ (آكِلَةِ العُشْبِ وَاللَّحْمِ)؟",
        "focusWord": "الدُّبُّ وَالقُنْفُذُ",
        "options": [
          {
            "text": "الدُّبُّ وَالقِرْدُ وَالقُنْفُذُ",
            "correct": true
          },
          {
            "text": "الخَرُوفُ وَالأَرْنَبُ",
            "correct": false
          },
          {
            "text": "الأَسَدُ وَالفَهْدُ",
            "correct": false
          },
          {
            "text": "السُّلَحْفَاةُ البَرِّيَّةُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِمَاذَا تَتَمَيَّزُ الطُّيُورُ كَالصَّقْرِ وَالحَمَامَةِ وَالطَّاوُوسِ؟",
        "focusWord": "ثَابِتَةُ الحَرَارَةِ",
        "options": [
          {
            "text": "فَقَارِيَّاتٌ ثَابِتَةُ الحَرَارَةِ تَتَكَاثَرُ بِالبَيْضِ وَيُغَطِّيهَا الرِّيشُ",
            "correct": true
          },
          {
            "text": "مُتَغَيِّرَةُ الحَرَارَةِ تَزْحَفُ عَلَى بَطْنِهَا",
            "correct": false
          },
          {
            "text": "لَافَقَارِيَّاتٌ بِلَا عَمُودٍ فَقَرِيٍّ",
            "correct": false
          },
          {
            "text": "تَتَنَفَّسُ بِالخَيَاشِيمِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الثَّدْيِيَّاتُ العَاشِبَةُ",
          "left": "الجَمَلُ وَالبَقَرَةُ وَالخَرُوفُ وَالأَرْنَبُ"
        },
        {
          "right": "الثَّدْيِيَّاتُ الكَالِشَةُ",
          "left": "الدُّبُّ وَالقِرْدُ وَالقُنْفُذُ"
        },
        {
          "right": "الطُّيُورُ اللَّاحِمَةُ",
          "left": "الصَّقْرُ وَالبُومُ وَالبِطْرِيقُ وَالنَّوْرَسُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ فَقَارِيَّاتِ الدَّمِ الحَارِّ (الثَّدْيِيَّاتِ وَالطُّيُورَ):",
        "correct": [
          "الجَمَلُ وَالبَقَرَةُ (ثَدْيِيَّاتٌ)",
          "الأَسَدُ وَالدُّبُّ (ثَدْيِيَّاتٌ)",
          "الحَمَامَةُ وَالطَّاوُوسُ (طُيُورٌ)",
          "الصَّقْرُ وَالهُدْهُدُ (طُيُورٌ)"
        ],
        "wrong": [
          "التِّمْسَاحُ (زَوَاحِفُ)",
          "الضِّفْدَعُ (بَرْمَائِيَّاتٌ)"
        ]
      },
      "applyStep": "أَرْفُقُ بِالحَيَوَانَاتِ الأَلِيفَةِ وَالطُّيُورِ وَأَضَعُ لَهَا المَاءَ وَالحُبُوبَ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt5.jpg",
      "title": "تَمَارِينُ التَّنَفُّسِ وَالتَّهْدِئَةِ العَصَبِيَّةِ (المَجْمُوعَةُ الرَّابِعَةُ: 22..28)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِتَنْظِيمِ الجِهَازِ العَصَبِيِّ وَالوُصُولِ لِلِاسْتِرْخَاءِ وَاليَقَظَةِ الذِّهْنِيَّةِ!",
      "slideText": "🌬️ تَمَارِينُ التَّنَفُّسِ وَالتَّهْدِئَةِ العَصَبِيَّةِ (المَجْمُوعَةُ الرَّابِعَةُ — التَّمَارِينُ 22 إِلَى 28): (22) تَنَفُّسُ الوَرْدَةِ وَالشَّمْعَةِ (شَهِيقٌ مِنَ الأَنْفِ كَشَمِّ الوَرْدَةِ وَزَفِيرٌ مِنَ الفَمِ كَإِطْفَاءِ الشَّمْعَةِ). (23) عُقْدَةُ الهُدُوءِ مَعَ وَضْعِ اللِّسَانِ فِي سَقْفِ الحَلْقِ. (24) قُبَّعَةُ التَّفْكِيرِ (تَدْلِيكُ حَافَتَيِ الأُذُنَيْنِ نُزُولًا لِلشَّحْمَةِ). (25) الشَّدُّ وَالاسْتِرْخَاءُ (كَالرُّوبُوتِ ثُمَّ كَالدُّمْيَةِ). (26) طَنِينُ النَّحْلَةِ مَعَ الزَّفِيرِ الهَادِئِ. (27) رَسْمُ النَّجْمَةِ عَبْرَ تَتَبُّعِ أَصَابِعِ الكَفِّ مَعَ الشَّهِيقِ وَالزَّفِيرِ. (28) العِنَاقُ الفَرَاشِيُّ (التَّرْبِيتُ الهَادِئُ عَلَى الصَّدْرِ بِالتَّنَاوُبِ).",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (تَنَفُّسِ الوَرْدَةِ وَالشَّمْعَةِ) رَقْمِ (22) لِتَهْدِئَةِ الجِهَازِ العَصَبِيِّ؟",
        "focusWord": "تَنَفُّسُ الوَرْدَةِ وَالشَّمْعَةِ",
        "options": [
          {
            "text": "نَأْخُذُ شَهِيقًا بِبُطْءٍ مِنَ الأَنْفِ (كَشَمِّ الوَرْدَةِ) لِيَنْتَفِخَ البَطْنُ، ثُمَّ نَزْفِرُ بِبُطْءٍ مِنَ الفَمِ (كَإِطْفَاءِ الشَّمْعَةِ)",
            "correct": true
          },
          {
            "text": "نَحْبِسُ النَّفَسَ حَتَّى نَتْعَبَ",
            "correct": false
          },
          {
            "text": "نَتَنَفَّسُ بِسُرْعَةٍ وَصُرَاخٍ",
            "correct": false
          },
          {
            "text": "نَنْفُخُ بِقُوَّةٍ دُونَ شَهِيقٍ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَاذَا نَفْعَلُ فِي تَمْرِينِ (قُبَّعَةِ التَّفْكِيرِ) رَقْمِ (24)؟",
        "focusWord": "قُبَّعَةُ التَّفْكِيرِ",
        "options": [
          {
            "text": "نُمْسِكُ حَافَتَيِ الأُذُنَيْنِ العُلْوِيَّةَ بِالإِبْهَامِ وَالسَّبَّابَةِ وَنُدَلِّكُهُمَا بِلُطْفٍ نُزُولًا لِشَحْمَةِ الأُذُنِ",
            "correct": true
          },
          {
            "text": "نَشُدُّ شَعْرَ الرَّأْسِ بِقُوَّةٍ",
            "correct": false
          },
          {
            "text": "نَرْكُضُ فِي الغُرْفَةِ",
            "correct": false
          },
          {
            "text": "نَقْفِزُ فَوْقَ الحَبْلِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَيْفَ يُسَاعِدُنَا تَمْرِينُ (الشَّدِّ وَالاسْتِرْخَاءِ: الرُّوبُوتُ وَالدُّمْيَةُ) وَتَمْرِينُ (العِنَاقِ الفَرَاشِيِّ)؟",
        "focusWord": "الشَّدُّ وَالاسْتِرْخَاءُ",
        "options": [
          {
            "text": "يُزِيلُ التَّوَتُّرَ العَضَلِيَّ وَيَمْنَحُ الجِسْمَ وَالقَلْبَ السَّكِينَةَ وَالهُدُوءَ",
            "correct": true
          },
          {
            "text": "يُسَبِّبُ الغَضَبَ وَالانْفِعَالَ",
            "correct": false
          },
          {
            "text": "يُضْعِفُ التَّنَفُّسَ",
            "correct": false
          },
          {
            "text": "يُؤْلِمُ المَفَاصِلَ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "تَنَفُّسُ الوَرْدَةِ وَالشَّمْعَةِ (22)",
          "left": "شَهِيقٌ بَطِيءٌ مِنَ الأَنْفِ وَزَفِيرٌ هَادِئٌ مِنَ الفَمِ"
        },
        {
          "right": "قُبَّعَةُ التَّفْكِيرِ (24)",
          "left": "تَدْلِيكُ حَافَتَيِ الأُذُنَيْنِ بِلُطْفٍ نُزُولًا لِلشَّحْمَةِ"
        },
        {
          "right": "الشَّدُّ وَالاسْتِرْخَاءُ (25)",
          "left": "شَدُّ العَضَلَاتِ كَالرُّوبُوتِ ثُمَّ إِرْخَاؤُهَا كَالدُّمْيَةِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ التَّنَفُّسِ وَالتَّهْدِئَةِ العَصَبِيَّةِ (22..28):",
        "correct": [
          "تَنَفُّسُ الوَرْدَةِ وَالشَّمْعَةِ",
          "عُقْدَةُ الهُدُوءِ وَقُبَّعَةُ التَّفْكِيرِ",
          "طَنِينُ النَّحْلَةِ وَرَسْمُ النَّجْمَةِ",
          "العِنَاقُ الفَرَاشِيُّ وَالاسْتِرْخَاءُ"
        ],
        "wrong": [
          "الغَضَبُ وَالصُّرَاخُ",
          "التَّنَفُّسُ السَّطْحِيُّ السَّرِيعُ"
        ]
      },
      "applyStep": "عِنْدَمَا أَشْعُرُ بِالتَّعَبِ أَوِ التَّوَتُّرِ أُطَبِّقُ تَنَفُّسَ الوَرْدَةِ وَالشَّمْعَةِ وَعُقْدَةَ الهُدُوءِ وَقُبَّعَةَ التَّفْكِيرِ."
    }
  },
  {
    "w": 6,
    "secNum": 2,
    "heavenName": "سَمَاءُ الأَحَدِ الثَّانِيَةُ (هـ و ز ح)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ وَالفَقَارِيَّاتِ وَاللَّافَقَارِيَّاتِ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "و",
    "jummal": 6,
    "prophet": "يَعْقُوبُ (ع)",
    "virtue": "الرَّجَاءُ",
    "unitHeader": "الوَحْدَةُ السَّادِسَةُ : نَبِيُّ اللهِ يَعْقُوبُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "ظَلَّ نَبِيُّ اللهِ يَعْقُوبُ (ع) وَاثِقًا بِرَحْمَةِ اللهِ وَفَرَجِهِ رَغْمَ طُولِ غِيَابِ ابْنِهِ يُوسُفَ (ع)، حَتَّى جَمَعَ اللهُ شَمْلَهُمْ فِي مِصْرَ بِعِزٍّ وَكَرَامَةْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): اشْتِعَالُ نَارِ الغَيْرَةِ وَالحَسَدِ فِي صُدُورِ إِخْوَةِ يُوسُفَ الكِبَارِ حِينَ قَالُوا: ﴿لَيُوسُفُ وَأَخُوهُ أَحَبُّ إِلَىٰ أَبِينَا مِنَّا﴾، وَغَضَبُهُمْ حِينَ أَلْقَوْا أَخَاهُمْ فِي البِئْرِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ وَالخِدَاعِ فِي تَلْطِيخِ القَمِيصِ بِـ﴿دَمٍ كَذِبٍ﴾ وَاتِّهَامِ الذِّئْبِ البَرِيءِ، وَفِي مُقَابِلِهَا «الرِّيحُ الصَّادِقَةُ» وَهِيَ رِيحُ الجَنَّةِ وَعِطْرُ قَمِيصِ يُوسُفَ الَّذِي هَبَّ عَلَى يَعْقُوبَ مِنْ مَسِيرَةِ ثَمَانِينَ فَرْسَخًا فَبَدَّدَ كُلَّ وَهْمٍ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): فِطْنَةُ يَعْقُوبَ وَعَقْلُهُ الحَكِيمُ حِينَ فَحَصَ القَمِيصَ السَّلِيمَ وَاسْتَنْطَقَ الذِّئْبَ فَكَشَفَ الكَذِبَ، وَبَلَاغَةُ كِتَابِهِ إِلَى عَزِيزِ مِصْرَ، وَتَدْبِيرُهُ فِي الدُّخُولِ مِنْ أَبْوَابٍ مُتَفَرِّقَةٍ، وَاتِّعَاظُهُ بِالرُّسُلِ الثَّلَاثَةِ قَبْلَ المَوْتِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): دُمُوعُ المَحَبَّةِ فِي «بَيْتِ الأَحْزَانِ»، وَإِخْلَاصُهُ بِذِكْرَى الدَّارِ الآخِرَةِ، وَإِطْعَامُهُ الصَّائِمِينَ وَوَفَاؤُهُ بِنَذْرِ العُشْرِ، وَعَفْوُهُ عَنْ أَبْنَائِهِ وَالاسْتِغْفَارُ لَهُمْ فِي سَحَرِ الجُمُعَةِ، وَسُجُودُ الشُّكْرِ لِلهِ فِي مِصْرَ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الأَحَدِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ سِتَّةٍ فِي مَنْزِلَةِ الرِّيحِ الَّتِي تَكْشِفُ الوَهْمَ بِنَسِيمِ اليَقِينْ، وَهُوَ نَبِيُّ اللهِ يَعْقُوبُ بْنُ إِسْحَاقَ بْنِ إِبْرَاهِيمَ الخَلِيلِ عَلَيْهِمُ السَّلَامْ. وُلِدَ يَعْقُوبُ فِي بَيْتِ النُّبُوَّةِ الطَّاهِرِ تَوْأَمًا مَعَ أَخِيهِ العِيصْ، وَسُمِّيَ إِسْرَائِيلَ أَيْ عَبْدَ اللهِ الخَالِصْ، وَجَعَلَهُ اللهُ مِنْ أُولِي الأَيْدِي وَالأَبْصَارِ أَيْ أَصْحَابِ القُوَّةِ فِي الطَّاعَةِ وَالبَصِيرَةِ فِي الدِّينْ، وَأَخْلَصَهُ بِذِكْرِ الدَّارِ الآخِرَةِ وَنَزَلَ عَلَيْهِ الوَحْيُ مِنَ السَّمَاءْ. سَافَرَ يَعْقُوبُ فِي شَبَابِهِ إِلَى خَالِهِ لَابَانْ، وَفِي الطَّرِيقِ نَامَ عَلَى الأَرْضِ فَرَأَى فِي مَنَامِهِ مِعْرَاجًا إِلَى السَّمَاءِ تَصْعَدُ فِيهِ المَلَائِكَةُ وَتَنْزِلْ، وَبَشَّرَهُ اللهُ بِأَنَّهُ مَعَهُ يَحْفَظُهُ وَيَرُدُّهُ سَالِمًا إِلَى دِيَارِهْ، فَنَذَرَ يَعْقُوبُ لِرَبِّهِ أَنْ يَبْنِيَ هُنَاكَ مَسْجِدًا مُبَارَكًا وَيَتَصَدَّقَ بِعُشْرِ مَالِهِ لِلفُقَرَاءْ. وَعَمِلَ فِي رَعْيِ الغَنَمِ بِيَدَيْهِ بِأَمَانَةٍ وَرَزَقَهُ اللهُ اثْنَيْ عَشَرَ وَلَدًا هُمُ الأَسْبَاطُ عَلَى ضِعْفِ الرَّقْمِ سِتَّةٍ فِي الحِسَابْ، وَكَانَ حَكِيمًا يَعْتَنِي بِصِحَّةِ البَدَنِ وَالبَطْنْ، فَلَمَّا أَصَابَهُ أَلَمُ عِرْقِ النَّسَا فِي رِجْلِهِ امْتَنَعَ عَنْ أَكْلِ لَحْمِ الإِبِلِ طَلَبًا لِلعَافِيَةِ قَبْلَ نُزُولِ التَّوْرَاةِ بِزَمَانْ.",
      "كَانَ أَحَبَّ أَبْنَائِهِ إِلَى قَلْبِهِ وَلَدُهُ الصَّغِيرُ يُوسُفُ وَأَخُوهُ بِنْيَامِينُ لِطَهَارَةِ فِطْرَتِهِمَا وَأَدَبِهِمَا فِي الطَّاعَةْ. وَفِي لَيْلَةٍ مُبَارَكَةٍ رَأَى يُوسُفُ فِي المَنَامِ أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالقَمَرَ سَاجِدِينَ لَهْ، فَعَرَفَ يَعْقُوبُ بِنُورِ عَقْلِهِ أَنَّ اللهَ سَيَجْتَبِيهِ وَيُعَلِّمُهُ تَأْوِيلَ الأَحَادِيثْ، وَأَوْصَاهُ أَلَّا يَقُصَّ رُؤْيَاهُ عَلَى إِخْوَتِهِ حَتَّى لَا يَكِيدُوا لَهُ بِوَسْوَسَةِ الشَّيْطَانْ. لٰكِنَّ نَارَ الغَيْرَةِ وَالحَسَدِ اشْتَعَلَتْ فِي صُدُورِ الإِخْوَةِ الكِبَارْ، فَأَخَذُوا يُوسُفَ مَعَهُمْ إِلَى البَرِّيَّةِ بِحُجَّةِ اللِّعْبِ وَالسِّبَاقِ بِالأَقْدَامْ، وَأَلْقَوْهُ فِي البِئْرِ ثُمَّ لَطَّخُوا قَمِيصَهُ بِدَمٍ كَذِبٍ وَأَمْسَكُوا ذِئْبًا وَرَجَعُوا عِشَاءً يَبْكُونَ لِيَخْدَعُوا أَبَاهُمْ بِرِيحِ الوَهْمِ وَالزُّورْ، وَقَالُوا يَا أَبَانَا إِنَّا ذَهَبْنَا نَسْتَبِقُ وَتَرَكْنَا يُوسُفَ عِنْدَ مَتَاعِنَا فَأَكَلَهُ هٰذَا الذِّئْبْ. فَأَمْسَكَ يَعْقُوبُ القَمِيصَ بِيَدِهِ وَفَحَصَهُ بِعَقْلِهِ الحَكِيمِ فَرَآهُ سَلِيمًا لَمْ يُمَزَّقْ، ثُمَّ دَعَا اللهَ فَأَنْطَقَ الذِّئْبَ بِلِسَانٍ فَصِيحٍ وَقَالَ يَا نَبِيَّ اللهِ وَاللهِ مَا أَكَلْتُ لَحْمَهُ وَلَا مَزَّقْتُ جِلْدَهُ لِأَنَّ لُحُومَ الأَنْبِيَاءِ مُحَرَّمَةٌ عَلَيْنَا، وَإِنَّمَا أَنَا ذِئْبٌ غَرِيبٌ جِئْتُ مِنْ مِصْرَ أَبْحَثُ عَنْ أَخٍ لِي فَقَدْتُهْ. فَأَطْلَقَ يَعْقُوبُ الذِّئْبَ وَقَالَ لِبَنِيهِ بَلْ سَوَّلَتْ لَكُمْ أَنْفُسُكُمْ أَمْرًا فَصَبْرٌ جَمِيلٌ وَاللهُ المُسْتَعَانْ.",
      "كَانَ هٰذَا الفِرَاقُ امْتِحَانًا لِيَعْقُوبَ لِيَرْفَعَ اللهُ مَقَامَهُ بَعْدَ أَنْ مَرَّ بِبَابِهِ يَوْمًا سَائِلٌ مُؤْمِنٌ صَائِمٌ فَلَمْ يُطْعَمْ فِي دَارِهِ عَنْ غَيْرِ قَصْدْ، فَتَوَاضَعَ يَعْقُوبُ لِرَبِّهِ وَصَارَ مُنَادِيهِ يُنَادِي كُلَّ صَبَاحٍ مَنْ كَانَ صَائِمًا فَلْيَحْضُرْ عَلَى مَائِدَةِ يَعْقُوبْ. وَجَلَسَ فِي بَيْتِ الأَحْزَانِ يَبْكِي عَلَى فِرَاقِ حَبِيبِهِ يُوسُفَ زَمَنًا طَوِيلًا حَتَّى ابْيَضَّتْ عَيْنَاهُ مِنَ الحُزْنِ وَهُوَ كَظِيمْ، وَسَأَلَ مَلَكَ المَوْتِ حِينَ زَارَهُ هَلْ قَبَضْتَ رُوحَ وَلَدِي يُوسُفْ، فَأَخْبَرَهُ مَلَكُ المَوْتِ أَنَّ يُوسُفَ حَيٌّ يُرْزَقْ، فَازْدَادَ يَقِينًا وَقَالَ بِلِسَانِ الصِّدْقِ إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللهِ وَأَعْلَمُ مِنَ اللهِ مَا لَا تَعْلَمُونْ، وَعَاشَ مُفَوِّضًا أَمْرَهُ كُلَّهُ إِلَى خَالِقِهِ العَلِيمْ. وَمَرَّتِ السِّنُونَ وَأَصَابَ البِلَادَ قَحْطٌ شَدِيدْ، فَأَرْسَلَ يَعْقُوبُ أَبْنَاءَهُ إِلَى مِصْرَ لِيَشْتَرُوا القَمْحَ وَالمِيرَةْ، فَلَمَّا طَلَبُوا أَنْ يَأْخُذُوا مَعَهُمْ أَخَاهُمْ بِنْيَامِينَ فِي المَرَّةِ الثَّانِيَةِ قَالَ لَنْ أُرْسِلَهُ مَعَكُمْ حَتَّى تُؤْتُونِ مَوْثِقًا مِنَ اللهِ لَتَأْتُنَّنِي بِهِ إِلَّا أَنْ يُحَاطَ بِكُمْ. وَلَمَّا أَعْطَوْهُ العَهْدَ أَوْصَاهُمْ بِعَقْلِهِ وَحِكْمَتِهِ أَلَّا يَدْخُلُوا مِصْرَ مِنْ بَابٍ وَاحِدٍ بَلْ يَدْخُلُوا مِنْ أَبْوَابٍ مُتَفَرِّقَةٍ وِقَايَةً لَهُمْ مِنْ عُيُونِ الحَاسِدِينْ، مَعَ يَقِينِهِ أَنَّ اللهَ هُوَ خَيْرٌ حَافِظًا وَأَرْحَمُ الرَّاحِمِينْ، فَكَانَ يَحْمِي أَبْنَاءَهُ بِذِكْرِ اللهِ فِي تَعَوُّذٍ دَائِمٍ وَتَوَكَّلَ عَلَى رَبِّهِ فِي كُلِّ حِينْ.",
      "وَلَمَّا احْتَبَسَ يُوسُفُ أَخَاهُ بِنْيَامِينَ عِنْدَهُ فِي مِصْرَ بِحِكْمَةٍ مِنْهْ، وَرَجَعَ الإِخْوَةُ بِالخَبَرِ قَالَ يَعْقُوبُ يَا بَنِيَّ اذْهَبُوا فَتَحَسَّسُوا مِنْ يُوسُفَ وَأَخِيهِ وَلَا تَيْأَسُوا مِنْ رَوْحِ اللهْ. وَكَتَبَ يَعْقُوبُ بِيَدِهِ رِسَالَةً بَلِيغَةً إِلَى عَزِيزِ مِصْرَ يَذْكُرُ فِيهَا صَبْرَ آبَائِهِ الأَنْبِيَاءِ وَأَمَانَتَهُمْ وَيَطْلُبُ رَدَّ بِنْيَامِينَ بِالعَدْلِ وَالإِحْسَانْ، وَتَوَسَّلَ فِي دُعَائِهِ إِلَى اللهِ بِحَقِّ مُحَمَّدٍ وَآلِهِ الأَطْهَارْ. فَلَمَّا قَرَأَ يُوسُفُ رِسَالَةَ أَبِيهِ قَبَّلَهَا وَبَكَى وَعَرَّفَ إِخْوَتَهُ بِنَفْسِهْ، وَأَعْطَاهُمْ قَمِيصَهُ المُبَارَكَ الَّذِي كَانَ لِجَدِّهِ إِبْرَاهِيمَ حِينَ أُلْقِيَ فِي النَّارْ. وَلَمَّا خَرَجَتِ القَافِلَةُ مِنْ مِصْرَ هَبَّتْ رِيحُ الصِّدْقِ الطَّيِّبَةُ مِنْ مَسِيرَةِ ثَمَانِينَ فَرْسَخًا فَـوَجَدَ يَعْقُوبُ عِطْرَ الجَنَّةِ وَقَالَ إِنِّي لَأَجِدُ رِيحَ يُوسُفَ لَوْلَا أَنْ تُفَنِّدُونْ. فَلَمَّا جَاءَ البَشِيرُ يَهُوذَا وَأَلْقَى القَمِيصَ عَلَى وَجْهِ يَعْقُوبَ كَانَ القَمِيصُ دَوَاءً مُبَارَكًا عَادَ بِهِ بَصِيرًا فِي الحَالْ، وَقَالَ لِبَنِيهِ أَلَمْ أَقُلْ لَكُمْ إِنِّي أَعْلَمُ مِنَ اللهِ مَا لَا تَعْلَمُونْ.",
      "اعْتَذَرَ الأَبْنَاءُ إِلَى أَبِيهِمْ بِنَدَمٍ وَطَلَبُوا مِنْهُ العَفْوْ، فَرَقَّ قَلْبُهُ الحَنُونُ وَكَانَ لَهُمْ مِنْهُ سَمَاحٌ وَعَفْوٌ جَمِيلْ، وَاسْتَغْفَرَ لَهُمْ رَبَّهُ فِي وَقْتِ السَّحَرِ مِنْ لَيْلَةِ الجُمُعَةِ المُبَارَكَةْ. ثُمَّ سَارَ يَعْقُوبُ مَعَ أَهْلِهِ جَمِيعًا إِلَى مِصْرَ وَدَخَلُوهَا آمِنِينْ، وَخَرُّوا لِلهِ سُجَّدًا شُكْرًا لِخَالِقِهِمْ وَتَحِيَّةً لِيُوسُفَ فَتَحَقَّقَتِ الرُّؤْيَا الصَّادِقَةُ بَعْدَ الصَّبْرِ الجَمِيلْ، وَظَهَرَ أَنَّ أَهْلَ اليَقِينِ وَالصِّدْقِ وَأَهْلَ الوَهْمِ وَالكَذِبِ لَا يَسْتَوُونَ عِنْدَ اللهْ. وَعَاشَ يَعْقُوبُ فِي مِصْرَ مُكَرَّمًا حَتَّى ظَهَرَتْ لَهُ الرُّسُلُ الثَّلَاثَةُ الَّتِي طَلَبَهَا مِنْ مَلَكِ المَوْتِ لِيَسْتَعِدَّ لِلآخِرَةِ وَهِيَ الشَّيْبُ وَضَعْفُ القُوَّةِ وَانْحِنَاءُ الظَّهْرْ، فَجَمَعَ بَنِيهِ عِنْدَ وَفَاتِهِ وَسَأَلَهُمْ مَا تَعْبُدُونَ مِنْ بَعْدِ الرَّحِيلْ، فَقَالُوا نَعْبُدُ إِلٰهَكَ وَإِلٰهَ آبَائِكَ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ إِلٰهًا وَاحِدًا وَنَحْنُ لَهُ مُسْلِمُونْ. وَسَلَّمَ مَوَارِيثَ النُّبُوَّةِ لِوَلَدِهِ الصِّدِّيقِ يُوسُفْ، وَحُمِلَ جَسَدُهُ الطَّاهِرُ بِوَصِيَّتِهِ لِيُدْفَنَ فِي الأَرْضِ المُقَدَّسَةِ بِجِوَارِ أَبِيهِ إِسْحَاقَ وَجَدِّهِ إِبْرَاهِيمَ الخَلِيلِ عَلَيْهِمُ السَّلَامْ."
    ],
    "words": [
      {
        "word": "مَوْثِقًا",
        "desc": "وسط متصل / ساكن: ـوْ",
        "raw": "مَوْثِقًا (وسط متصل / ساكن: ـوْ)"
      },
      {
        "word": "العَفْوْ",
        "desc": "آخر متصل / ساكن وقفا: ـوْ",
        "raw": "العَفْوْ (آخر متصل / ساكن وقفا: ـوْ)"
      },
      {
        "word": "وَجَدَ",
        "desc": "أول منفصل / متحرك بالفتح: وَ",
        "raw": "وَجَدَ (أول منفصل / متحرك بالفتح: وَ)"
      },
      {
        "word": "الوَحْيُ",
        "desc": "أول متصل / متحرك بالفتح: ـوَ",
        "raw": "الوَحْيُ (أول متصل / متحرك بالفتح: ـوَ)"
      },
      {
        "word": "تَوَكَّلَ",
        "desc": "وسط متصل / متحرك بالفتح: ـوَ",
        "raw": "تَوَكَّلَ (وسط متصل / متحرك بالفتح: ـوَ)"
      },
      {
        "word": "دَوَاءً",
        "desc": "وسط منفصل / متحرك بالفتح: وَ",
        "raw": "دَوَاءً (وسط منفصل / متحرك بالفتح: وَ)"
      },
      {
        "word": "هُوَ",
        "desc": "آخر متصل / متحرك بالفتح: ـوَ",
        "raw": "هُوَ (آخر متصل / متحرك بالفتح: ـوَ)"
      },
      {
        "word": "وُلِدَ",
        "desc": "أول منفصل / متحرك بالضم: وُ",
        "raw": "وُلِدَ (أول منفصل / متحرك بالضم: وُ)"
      },
      {
        "word": "عَفْوٌ",
        "desc": "آخر متصل / متحرك بالضم: ـوٌ",
        "raw": "عَفْوٌ (آخر متصل / متحرك بالضم: ـوٌ)"
      },
      {
        "word": "وِقَايَةً",
        "desc": "أول منفصل / متحرك بالكسر: وِ",
        "raw": "وِقَايَةً (أول منفصل / متحرك بالكسر: وِ)"
      },
      {
        "word": "سَوَّلَتْ",
        "desc": "وسط متصل / مضعف بالفتح: ـوَّ",
        "raw": "سَوَّلَتْ (وسط متصل / مضعف بالفتح: ـوَّ)"
      },
      {
        "word": "تَعَوُّذٍ",
        "desc": "وسط متصل / مضعف بالضم: ـوُّ",
        "raw": "تَعَوُّذٍ (وسط متصل / مضعف بالضم: ـوُّ)"
      },
      {
        "word": "مُفَوِّضًا",
        "desc": "وسط متصل / مضعف بالكسر: ـوِّ",
        "raw": "مُفَوِّضًا (وسط متصل / مضعف بالكسر: ـوِّ)"
      },
      {
        "word": "وَاحِدًا",
        "desc": "أول منفصل / ممدود بالألف: وَا",
        "raw": "وَاحِدًا (أول منفصل / ممدود بالألف: وَا)"
      },
      {
        "word": "يَسْتَوُونَ",
        "desc": "وسط متصل / ممدود بالواو: ـوُو",
        "raw": "يَسْتَوُونَ (وسط متصل / ممدود بالواو: ـوُو)"
      },
      {
        "word": "طَوِيلًا",
        "desc": "وسط متصل / ممدود بالياء: ـوِي",
        "raw": "طَوِيلًا (وسط متصل / ممدود بالياء: ـوِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الوَاوِ (و): النُّطْقُ السَّلِيمُ لِحَرْفِ الوَاوِ مِنْ مَخْرَجِ الشَّفَتَيْنِ بِانْضِمَامِهِمَا مَعَ بَقَاءِ فُرْجَةٍ يَمُرُّ مِنْهَا الصَّوْتُ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الصِّدْقِ وَتَرْكِ الكَذِبِ وَالبُهْتَانِ (حَتَّى مَعَ الحَيَوَانِ كَالذِّئْبِ)، وَذِكْرِ يَعْقُوبَ: ﴿فَصَبْرٌ جَمِيلٌ وَاللَّهُ الْمُسْتَعَانُ﴾."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الحَلْقَةُ المُنْسَابَةُ وَالشَّكْلُ السُّدَاسِيُّ وَالبَصِيرَةُ: مُشَاهَدَةُ التِفَافِ رَأْسِ الوَاوِ (و) كَالعَيْنِ المُبْصِرَةِ ثُمَّ انْسِيَابِ خَطِّهَا المُنْحَنِي، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «الشَّكْلِ السُّدَاسِيِّ» المُنْتَظِمِ ذِي الأَضْلَاعِ السِّتَّةِ، وَالتَّفَكُّرُ فِي قَوْلِهِ تَعَالَى: ﴿أُولِي الْأَيْدِي وَالْأَبْصَارِ﴾ حَيْثُ بَقِيَتْ بَصِيرَةُ قَلْبِ يَعْقُوبَ مُنِيرَةً حَتَّى عَادَ بَصَرُ عَيْنَيْهِ بِقَمِيصِ يُوسُفَ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ يَعْقُوبَ الكَامِلَةُ وَالتَّثَبُّتُ مِنَ الأَخْبَارِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ يَعْقُوبَ (مِنْ رُؤْيَا المِعْرَاجِ وَبَرَاءَةِ الذِّئْبِ إِلَى رِسَالَةِ مِصْرَ وَوَصِيَّةِ التَّوْحِيدِ)، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ الحُجَّةِ وَالبُرْهَانِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ سِتَّةٌ (6): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (6) وَرَسْمِ حَرْفِ الوَاوِ (و)، وَإِدْرَاكُ مَفْهُومِ السُّدَاسِيَّةِ وَمُضَاعَفِهَا (النَّبِيُّ السَّادِسُ، خَلْقُ الكَوْنِ فِي سِتَّةِ أَيَّامٍ، وَالأَسْبَاطُ الاثْنَا عَشَرَ: 6 + 6 = 12)، وَمَهَارَةِ اليَدِ فِي رَعْيِ الغَنَمِ، وَفَحْصِ النَّسِيجِ، وَكِتَابَةِ الرَّسَائِلِ الهَادِفَةِ (كَرِسَالَةِ يَعْقُوبَ لِعَزِيزِ مِصْرَ)، وَإِخْرَاجِ الصَّدَقَةِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ الجَرْيِ وَالمُسَابَقَةِ وَسَلَامَةِ عَصَبِ الرِّجْلَيْنِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ الجَرْيِ وَالسِّبَاقِ الرِّيَاضِيِّ النَّافِعِ (﴿إِنَّا ذَهَبْنَا نَسْتَبِقُ﴾)، وَتَمَارِينِ تَقْوِيَةِ السَّاقَيْنِ وَاسْتِقَامَةِ الظَّهْرِ لِحِمَايَةِ «عِرْقِ النَّسَا»، وَالتَّدَرُّبِ عَلَى الدُّخُولِ المُنَظَّمِ مِنَ الأَبْوَابِ دُونَ تَزَاحُمٍ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الحِمْيَةِ الغِذَائِيَّةِ وَإِطْعَامِ الصَّائِمِينَ: تَعَلُّمُ قَاعِدَةِ الحِمْيَةِ الطِّبِّيَّةِ فِي قَوْلِهِ تَعَالَى: ﴿كُلُّ الطَّعَامِ كَانَ حِلًّا لِبَنِي إِسْرَائِيلَ إِلَّا مَا حَرَّمَ إِسْرَائِيلُ عَلَىٰ نَفْسِهِ﴾؛ حَيْثُ امْتَنَعَ يَعْقُوبُ عَمَّا يُهَيِّجُ أَلَمَ عِرْقِ النَّسَا وِقَايَةً لِبَدَنِهِ، وَمَعْرِفَةِ فَوَائِدِ الأَلْبَانِ وَالعَدَسِ وَالحُبُوبِ، وَفَضْلِ تَفْطِيرِ الصَّائِمِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ المَوَاثِيقِ وَالعِفَّةِ وَالعَفْوِ وَتَوْقِيرِ الكِبَرِ: تَعَلُّمُ الوَفَاءِ بِالنَّذْرِ وَالمِيثَاقِ، وَالتَّحَصُّنِ مِنَ الحَسَدِ بِالتَّعَوُّذِ بِاللهِ، وَطَهَارَةِ الثِّيَابِ وَتَعْطِيرِهَا، وَتَوْقِيرِ كِبَارِ السِّنِّ عِنْدَ ظُهُورِ الرُّسُلِ الثَّلَاثَةِ (الشَّيْبِ وَالضَّعْفِ وَانْحِنَاءِ الظَّهْرِ)، وَالعَفْوِ وَالاسْتِغْفَارِ بَيْنَ الإِخْوَةِ."
      }
    },
    "grammar": {
      "topic": "الرُّكْنُ الأَوَّلُ فِي الجُمْلَةِ الاِسْمِيَّةِ: المُبْتَدَأُ",
      "rule": "المُبْتَدَأُ هُوَ الاِسْمُ المَرْفُوعُ الَّذِي نَبْدَأُ بِهِ الجُمْلَةَ الاِسْمِيَّةَ وَنَتَحَدَّثُ عَنْهُ.",
      "example": "الوَرْدَةُ جَمِيلَةٌ — الوَعْدُ صَادِقٌ — الوَلَدُ مُؤَدَّبٌ.",
      "focusWord": "الوَرْدَةُ",
      "q": "أَيْنَ «المُبْتَدَأُ» فِي جُمْلَةِ «الوَرْدَةُ مُتَفَتِّحَةٌ»؟",
      "opts": [
        "الوَرْدَةُ",
        "مُتَفَتِّحَةٌ",
        "فِي",
        "البُسْتَانِ"
      ]
    },
    "earIirab": {
      "topic": "رَفْعُ المُبْتَدَأِ وَالعَطْفُ بِحَرْفِ الوَاوْ",
      "rule": "حَرْفُ العَطْفِ (وَ) يَرْبِطُ بَيْنَ اسْمَيْنِ فَيَشْتَرِكَانِ فِي الحَرَكَةِ الإِعْرَابِيَّةْ.",
      "sentence": "القَمَرُ وَالنَّجْمُ مُضِيئَانِ.",
      "targetWord": "القَمَرُ",
      "caseAns": "مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 6,
      "numName": "سِتَّةٌ",
      "eqDisplay": "3 + 3 = 6",
      "subDisplay": "6 - 3 = 3",
      "compDisplay": "4 < 6",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "3 + 3 = ؟",
        "ans": "6 (سِتَّةٌ)",
        "wrong": [
          "4 (أَرْبَعَةٌ)",
          "7 (سَبْعَةٌ)",
          "5 (خَمْسَةٌ)"
        ]
      },
      "q2": {
        "stem": "اخْتَرِ العَلَامَةَ الصَّحِيحَةَ بَيْنَ (4 وَ 6):",
        "focus": "4 [ ؟ ] 6",
        "ans": "4 < 6 (أَصْغَرُ)",
        "wrong": [
          "4 > 6 (أَكْبَرُ)",
          "4 = 6 (يُسَاوِي)",
          "10"
        ]
      }
    },
    "sport": {
      "title": "طَاحُونَةُ الهَوَاءِ المُتَقَاطِعَةُ",
      "middleText": "أَقِفُ فَاتِحًا قَدَمَيَّ وَذِرَاعَيَّ، ثُمَّ أَنْحَنِي لِأَلْمِسَ قَدَمِي اليُمْنَى بِيَدِي اليُسْرَى وَالعَكْسُ بِالتَّنَاوُبْ. يُلَيِّنُ هٰذَا التَّمْرِينُ العَمُودَ الفَقَرِيَّ وَيُنَشِّطُ الدَّوْرَةَ الدَّمَوِيَّةَ لِلدِّمَاغْ."
    },
    "sci": {
      "title": "فَقَارِيَّاتُ الدَّمِ البَارِدِ: الأَسْمَاكُ وَالزَّوَاحِفُ وَالبَرْمَائِيَّاتُ",
      "summaryThird": "تَتَغَيَّرُ حَرَارَةُ هٰذِهِ الكَائِنَاتِ حَسَبَ بِيئَتِهَا؛ فَالأَسْمَاكُ تَتَنَفَّسُ تَحْتَ المَاءِ بِالخَيَاشِيمِ، وَالزَّوَاحِفُ تَحْمِيهَا الحَرَاشِفُ وَالدُّرُوعُ، وَالبَرْمَائِيَّاتُ كَالضِّفْدَعِ تَعِيشُ فِي المَاءِ وَاليَابِسَةْ.",
      "focusConcept": "الخَيَاشِيمُ فِي الأَسْمَاكِ",
      "factAns": "التَّنَفُّسُ تَحْتَ المَاءْ"
    },
    "rightsSummary": {
      "title": "حَقُّ اليَدَيْنِ وَالعَمَلِ الصَّالِحِ (حُور وَسُرُور - 6)",
      "storySentence": "تَعَلَّمَتْ حُورُ وَسُرُورٌ أَنَّ حَقَّ اليَدَيْنِ هُوَ بَسْطُهُمَا لِلعَطَاءِ وَالكِتَابَةِ وَمُسَاعَدَةِ المُحْتَاجِ، وَكَفُّهُمَا عَنْ إِيذَاءِ أَيِّ إِنْسَانٍ أَوْ حَيَوَانْ.",
      "applyAction": "أَسْتَخْدِمُ يَدَيَّ فِي كِتَابَةِ العِلْمِ وَالعَطَاءِ وَتَرْتِيبِ بَيْتِنَا."
    },
    "rightsFullTitle": "(6) حق اليد",
    "rightsQuote": "وَأَمَّا حَقُّ يَدِكَ فَأَنْ لا تَبْسُطَهَا إلَى مَا لا يَحِلُّ لَكَ فَتَنَالَ بمَا تَبْسُطُهَا إلَيْهِ مِنَ اللهِ الْعُقُوبَةَ فِي الآجِلِ، وَمِنَ النَّاسِ بلِسَانِ اللائِمَةِ فِي الْعَـاجِلِ، وَلا تَقْبضَهَا مِمَّا افْتَرَضَ اللهُ عَلَيْهَا وَلَكِنْ تُوقّرَِهَا بقَبْضِهَا عَنْ كَثِير مِمَّا يَحِلُّ لَهَا وبَسْطِهَا إلَى كَثِير مِمَّا لَيسَ عَلَيْهَا، فَإذَا هِيَ قَدْ عُقِلَتْ وَشُرِّفَتْ فِي الْعَاجِلِ وَجَبَ لَهَا حُسْنُ الثَّوَاب فِي الآجِلِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (6) حق اليد",
        "text": "وَأَمَّا حَقُّ يَدِكَ فَأَنْ لا تَبْسُطَهَا إلَى مَا لا يَحِلُّ لَكَ فَتَنَالَ بمَا تَبْسُطُهَا إلَيْهِ مِنَ اللهِ الْعُقُوبَةَ فِي الآجِلِ، وَمِنَ النَّاسِ بلِسَانِ اللائِمَةِ فِي الْعَـاجِلِ، وَلا تَقْبضَهَا مِمَّا افْتَرَضَ اللهُ عَلَيْهَا وَلَكِنْ تُوقّرَِهَا بقَبْضِهَا عَنْ كَثِير مِمَّا يَحِلُّ لَهَا وبَسْطِهَا إلَى كَثِير مِمَّا لَيسَ عَلَيْهَا، فَإذَا هِيَ قَدْ عُقِلَتْ وَشُرِّفَتْ فِي الْعَاجِلِ وَجَبَ لَهَا حُسْنُ الثَّوَاب فِي الآجِلِ. — وَفِي سِيرَةِ يَعْقُوبُ (ع): آدَابُ المَوَاثِيقِ وَالعِفَّةِ وَالعَفْوِ وَتَوْقِيرِ الكِبَرِ: تَعَلُّمُ الوَفَاءِ بِالنَّذْرِ وَالمِيثَاقِ، وَالتَّحَصُّنِ مِنَ الحَسَدِ بِالتَّعَوُّذِ بِاللهِ، وَطَهَارَةِ الثِّيَابِ وَتَعْطِيرِهَا، وَتَوْقِيرِ كِبَارِ السِّنِّ عِنْدَ ظُهُورِ الرُّسُلِ الثَّلَاثَةِ (الشَّيْبِ وَالضَّعْفِ وَانْحِنَاءِ الظَّهْرِ)، وَالعَفْوِ وَالاسْتِغْفَارِ بَيْنَ الإِخْوَةِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق اليد",
        "text": "🌿 قصة: \"اليد التي تعلّمت الحكمة\" ذهبت حور مع أمّها وإخوتها إلى مركز التسوّق. وكان المكان مليئًا بالأضواء والبضائع الملوّنة التي تجذب الأنظار. وبينما هم يسيرون في الممر، مدّت أختها الصغيرة يدها بخفّة، وأخذت شيئًا من الرفّ، ثم خبّأته في جيبها. رأتها حور فارتبكت، وسارعت تنتزع الغرض من يد أختها بقسوة، وأعادته إلى مكانه بسرعة. بدأت الصغيرة تبكي بصوتٍ عالٍ، وتجمّع الناس حولهم، فغضب أخوها وظنّ أن حور هي التي أزعجت الجميع، فضربها على يدها غاضبًا. مدّت الأم يدها بهدوء، وأخذت الغرض الصغير من الرفّ، وقالت بابتسامة: \"يا صغيرتي، إذا رغبتِ في شيء فأخبريني، لنمنحه لك بعد أن ندفع ثمنه.\" ثم نظرت الأم إلى حور وقالت: \"يا حور، أختك لم تتعمّد الخطأ، هي فقط لا تعرف بعدُ ما يجوز وما لا يجوز.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق اليد",
        "text": "مدّت حور يدها تمسح دموع أختها الصغيرة، ثم قبّلت رأسها بحنان. لكنها التفتت إلى أخيها بوجهٍ غاضب، وأرادت أن تردّ له الضربة. ابتسمت الأم وقالت برفق: \"يا حور، هل يرضيك أن تكرّري الخطأ الذي لم ترضي به؟\" خفضت حور رأسها وقالت: \"لا، ولكنّه ضربني.\" نظر الأخ إلى أمّه بخجل، وشعر بالندم على ما فعل، فقال بصوتٍ مملوء بالصدق: \"آسف يا حور، لقد أخطأت. أعدك أن أضبط يدي بعد الآن، وإن لم أفعل فسأعاقب نفسي بإعطائك مصروفي في ذلك اليوم.\" فرحت الأم، وابتسمت حور، وقالتا معًا: \"كم نحبك أيها الفهمان!\" ضحك الأخ وقال بثقة: \"يجب أن أكون قويًّا... لكن بحكمة.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ",
      "topic": "الدَّرْسُ (2): فَقَارِيَّاتُ الدَّمِ البَارِدِ (1. الزَّوَاحِفُ — 2. الأَسْمَاكُ — 3. البَرْمَائِيَّاتُ)",
      "coverImg": "assets/y7/scince/s6.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s6.1.jpg",
          "text": "الدَّرْسُ (2) فَقَارِيَّاتُ الدَّمِ البَارِدِ — (1) الزَّوَاحِفُ: فَقَارِيَّاتٌ مُتَغَيِّرَةُ الحَرَارَةِ (دَمٌ بَارِدٌ)، تَتَكَاثَرُ بِالبَيْضِ وَتَدْفِنُ بَيْضَهَا، يُغَطِّيهَا حَرَاشِفُ مُتَّصِلَةٌ وَتَتَنَفَّسُ بِالرِّئَتَيْنِ؛ أَنْوَاعُهَا الحَرْشَفِيَّاتُ وَالتَّمَاسِيحُ وَالسَّلَاحِفُ (عَاشِبَةٌ كَالسُّلَحْفَاةِ البَرِّيَّةِ، وَلَوَاحِمُ كَالتِّمْسَاحِ وَالثُّعْبَانِ، وَآكِلَةُ حَشَرَاتٍ كَالسِّحْلِيَّةِ)."
        },
        {
          "img": "assets/y7/scince/s6.2.jpg",
          "text": "الدَّرْسُ (2) فَقَارِيَّاتُ الدَّمِ البَارِدِ — (2) الأَسْمَاكُ: فَقَارِيَّاتٌ مَائِيَّةٌ مُتَغَيِّرَةُ الحَرَارَةِ، تَتَكَاثَرُ بِالبَيْضِ، تَتَنَفَّسُ بِالخَيَاشِيمِ، يُغَطِّيهَا القُشُورُ وَلَهَا زَعَانِفُ؛ أَقْسَامُهَا عَظْمِيَّةٌ وَغُضْرُوفِيَّةٌ وَعَدِيمَةُ الفَكِّ، وَمِنْهَا لَوَاحِمُ (القِرْشُ، التُّونَةُ، السَّلْمُونُ) وَكَالِشَةٌ (السَّرْدِينُ، البُورِي)."
        },
        {
          "img": "assets/y7/scince/s6.3.jpg",
          "text": "الدَّرْسُ (2) فَقَارِيَّاتُ الدَّمِ البَارِدِ — (3) البَرْمَائِيَّاتُ: فَقَارِيَّاتٌ مُتَغَيِّرَةُ الحَرَارَةِ تَتَكَاثَرُ بِالبَيْضِ وَيُغَطِّيهَا جِلْدٌ رَطْبٌ، تَتَنَفَّسُ بِالخَيَاشِيمِ صِغَارًا (شُرْغُوفٌ) وَبِالرِّئَتَيْنِ عِنْدَ البُلُوغِ؛ أَقْسَامُهَا القَوَافِزُ (ضِفْدَعٌ، عُلْجُومٌ)، وَذَوَاتُ الذَّيْلِ (سَمَنْدَرٌ)، وَعَدِيمَةُ الأَطْرَافِ."
        }
      ],
      "text": "الدَّرْسُ (2) فَقَارِيَّاتُ الدَّمِ البَارِدِ — (1) الزَّوَاحِفُ: فَقَارِيَّاتٌ مُتَغَيِّرَةُ الحَرَارَةِ (دَمٌ بَارِدٌ)، تَتَكَاثَرُ بِالبَيْضِ وَتَدْفِنُ بَيْضَهَا، يُغَطِّيهَا حَرَاشِفُ مُتَّصِلَةٌ وَتَتَنَفَّسُ بِالرِّئَتَيْنِ؛ أَنْوَاعُهَا الحَرْشَفِيَّاتُ وَالتَّمَاسِيحُ وَالسَّلَاحِفُ (عَاشِبَةٌ كَالسُّلَحْفَاةِ البَرِّيَّةِ، وَلَوَاحِمُ كَالتِّمْسَاحِ وَالثُّعْبَانِ، وَآكِلَةُ حَشَرَاتٍ كَالسِّحْلِيَّةِ). الدَّرْسُ (2) فَقَارِيَّاتُ الدَّمِ البَارِدِ — (2) الأَسْمَاكُ: فَقَارِيَّاتٌ مَائِيَّةٌ مُتَغَيِّرَةُ الحَرَارَةِ، تَتَكَاثَرُ بِالبَيْضِ، تَتَنَفَّسُ بِالخَيَاشِيمِ، يُغَطِّيهَا القُشُورُ وَلَهَا زَعَانِفُ؛ أَقْسَامُهَا عَظْمِيَّةٌ وَغُضْرُوفِيَّةٌ وَعَدِيمَةُ الفَكِّ، وَمِنْهَا لَوَاحِمُ (القِرْشُ، التُّونَةُ، السَّلْمُونُ) وَكَالِشَةٌ (السَّرْدِينُ، البُورِي). الدَّرْسُ (2) فَقَارِيَّاتُ الدَّمِ البَارِدِ — (3) البَرْمَائِيَّاتُ: فَقَارِيَّاتٌ مُتَغَيِّرَةُ الحَرَارَةِ تَتَكَاثَرُ بِالبَيْضِ وَيُغَطِّيهَا جِلْدٌ رَطْبٌ، تَتَنَفَّسُ بِالخَيَاشِيمِ صِغَارًا (شُرْغُوفٌ) وَبِالرِّئَتَيْنِ عِنْدَ البُلُوغِ؛ أَقْسَامُهَا القَوَافِزُ (ضِفْدَعٌ، عُلْجُومٌ)، وَذَوَاتُ الذَّيْلِ (سَمَنْدَرٌ)، وَعَدِيمَةُ الأَطْرَافِ.",
      "q1": {
        "q": "مَا الفَقَارِيَّاتُ المَائِيَّةُ الَّتِي تَتَنَفَّسُ بِالخَيَاشِيمِ وَيُغَطِّيهَا القُشُورُ وَلَهَا زَعَانِفُ؟",
        "focusWord": "الأَسْمَاكُ",
        "options": [
          {
            "text": "الأَسْمَاكُ (عَظْمِيَّةٌ وَغُضْرُوفِيَّةٌ وَعَدِيمَةُ الفَكِّ)",
            "correct": true
          },
          {
            "text": "الطُّيُورُ الجَارِحَةُ",
            "correct": false
          },
          {
            "text": "الثَّدْيِيَّاتُ البَرِّيَّةُ",
            "correct": false
          },
          {
            "text": "العَنْكَبِيَّاتُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ تَتَنَفَّسُ البَرْمَائِيَّاتُ مِثْلُ الضِّفْدَعِ وَالسَّمَنْدَرِ خِلَالَ دَوْرَةِ حَيَاتِهَا؟",
        "focusWord": "بِالخَيَاشِيمِ ثُمَّ الرِّئَتَيْنِ",
        "options": [
          {
            "text": "بِالخَيَاشِيمِ صِغَارًا (شُرْغُوفٌ) وَبِالرِّئَتَيْنِ وَالجِلْدِ الرَّطْبِ عِنْدَ البُلُوغِ",
            "correct": true
          },
          {
            "text": "بِالرِّئَتَيْنِ فَقَطْ تَحْتَ المَاءِ",
            "correct": false
          },
          {
            "text": "بِالأَوْرَاقِ الخَضْرَاءِ",
            "correct": false
          },
          {
            "text": "بِالقُشُورِ الصُّلْبَةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِمَاذَا يُغَطَّى جِسْمُ الزَّوَاحِفِ مِثْلِ التِّمْسَاحِ وَالثُّعْبَانِ وَالسِّحْلِيَّةِ؟",
        "focusWord": "حَرَاشِفُ مُتَّصِلَةٌ",
        "options": [
          {
            "text": "حَرَاشِفُ مُتَّصِلَةٌ أَوْ دُرُوعٌ حَرْشَفِيَّةٌ",
            "correct": true
          },
          {
            "text": "رِيشٌ نَاعِمٌ",
            "correct": false
          },
          {
            "text": "صُوفٌ كَثِيفٌ",
            "correct": false
          },
          {
            "text": "أَشْوَاكٌ نَبَاتِيَّةٌ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الزَّوَاحِفُ",
          "left": "حَرَاشِفُ مُتَّصِلَةٌ وَتَنَفُّسٌ بِالرِّئَتَيْنِ (تِمْسَاحٌ، سُلَحْفَاةٌ، سِحْلِيَّةٌ)"
        },
        {
          "right": "الأَسْمَاكُ",
          "left": "قُشُورٌ وَزَعَانِفُ وَتَنَفُّسٌ بِالخَيَاشِيمِ (قِرْشٌ، سَلْمُونٌ، سَرْدِينٌ)"
        },
        {
          "right": "البَرْمَائِيَّاتُ",
          "left": "جِلْدٌ رَطْبٌ وَشُرْغُوفٌ يَتَنَفَّسُ بِالخَيَاشِيمِ ثُمَّ الرِّئَتَيْنِ (ضِفْدَعٌ، سَمَنْدَرٌ)"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ فَقَارِيَّاتِ الدَّمِ البَارِدِ (الزَّوَاحِفَ وَالأَسْمَاكَ وَالبَرْمَائِيَّاتِ):",
        "correct": [
          "السُّلَحْفَاةُ وَالتِّمْسَاحُ (زَوَاحِفُ)",
          "السَّلْمُونُ وَالسَّرْدِينُ (أَسْمَاكٌ)",
          "الضِّفْدَعُ وَالسَّمَنْدَرُ (بَرْمَائِيَّاتٌ)",
          "السِّحْلِيَّةُ (زَوَاحِفُ)"
        ],
        "wrong": [
          "الجَمَلُ (ثَدْيِيَّاتٌ دَمٌ حَارٌّ)",
          "الحَمَامَةُ (طُيُورٌ دَمٌ حَارٌّ)"
        ]
      },
      "applyStep": "أَتَأَمَّلُ حِكْمَةَ اللهِ فِي تَنَوُّعِ تَنَفُّسِ المَخْلُوقَاتِ بَيْنَ الرِّئَتَيْنِ فِي البَرِّ وَالخَيَاشِيمِ فِي المَاءِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt6.jpg",
      "title": "تَمَارِينُ نِقَاطِ الطَّاقَةِ وَتَنْشِيطِ الدِّمَاغِ (المَجْمُوعَةُ الخَامِسَةُ: 29..35)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِتَنْشِيطِ مَسَارَاتِ الطَّاقَةِ وَزِيَادَةِ تَدَفُّقِ الأُكْسِجِينِ وَاليَقَظَةِ الذِّهْنِيَّةِ!",
      "slideText": "✨ تَمَارِينُ نِقَاطِ الطَّاقَةِ وَتَنْشِيطِ الدِّمَاغِ (المَجْمُوعَةُ الخَامِسَةُ — التَّمَارِينُ 29 إِلَى 35): (29) أَزْرَارُ الدِّمَاغِ (يَدٌ عَلَى السُّرَّةِ وَتَدْلِيكُ النُّقْطَتَيْنِ تَحْتَ التَّرْقُوَةِ مَعَ تَحْرِيكِ العَيْنَيْنِ أُفُقِيًّا). (30) أَزْرَارُ الأَرْضِ (إِصْبَعَانِ تَحْتَ الشَّفَةِ السُّفْلِيَّةِ وَاليَدُ الأُخْرَى أَسْفَلَ البَطْنِ مَعَ تَحْرِيكِ العَيْنَيْنِ عَمُودِيًّا). (31) أَزْرَارُ الفَضَاءِ (إِصْبَعَانِ فَوْقَ الشَّفَةِ العُلْيَا وَاليَدُ الأُخْرَى أَسْفَلَ الظَّهْرِ). (32) أَزْرَارُ التَّوَازُنِ خَلْفَ الأُذُنِ. (33) النِّقَاطُ الإِيجَابِيَّةُ عَلَى الجَبْهَةِ. (34) التَّثَاؤُبُ الطَّاقِيُّ لِإِرْخَاءِ الفَكِّ. (35) التَّرْبِيتُ التِّيمُوسِيُّ أَعْلَى الصَّدْرِ لِتَنْشِيطِ الحَيَوِيَّةِ.",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (أَزْرَارِ الدِّمَاغِ) رَقْمِ (29) لِزِيَادَةِ تَدَفُّقِ الأُكْسِجِينِ وَاليَقَظَةِ؟",
        "focusWord": "أَزْرَارُ الدِّمَاغِ",
        "options": [
          {
            "text": "يَضَعُ يَدَهُ عَلَى السُّرَّةِ وَيُدَلِّكُ بِاليَدِ الأُخْرَى النُّقْطَتَيْنِ تَحْتَ التَّرْقُوَةِ مَعَ تَحْرِيكِ عَيْنَيْهِ أُفُقِيًّا يَمِينًا وَيَسَارًا",
            "correct": true
          },
          {
            "text": "يُغْلِقُ أُذُنَيْهِ وَيَقْفِزُ",
            "correct": false
          },
          {
            "text": "يَرْكُضُ فِي دَائِرَةٍ",
            "correct": false
          },
          {
            "text": "يَشُدُّ رُكْبَتَيْهِ لِلصَّدْرِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الفَرْقُ بَيْنَ حَرَكَةِ العَيْنَيْنِ فِي (أَزْرَارِ الدِّمَاغِ 29) وَفِي (أَزْرَارِ الأَرْضِ 30)؟",
        "focusWord": "أَزْرَارُ الدِّمَاغِ وَأَزْرَارُ الأَرْضِ",
        "options": [
          {
            "text": "فِي أَزْرَارِ الدِّمَاغِ تَتَحَرَّكُ العَيْنَانِ أُفُقِيًّا (يَمِينًا وَيَسَارًا)، وَفِي أَزْرَارِ الأَرْضِ عَمُودِيًّا (لِلْأَعْلَى وَالأَسْفَلِ)",
            "correct": true
          },
          {
            "text": "العَيْنَانِ مَغْمُوضَتَانِ فِي التَّمْرِينَيْنِ",
            "correct": false
          },
          {
            "text": "لَا تَتَحَرَّكُ العَيْنَانِ أَبَدًا",
            "correct": false
          },
          {
            "text": "نَنْظُرُ لِلْخَلْفِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "أَيْنَ نُرَبِّتُ بِلُطْفٍ فِي تَمْرِينِ (التَّرْبِيتِ التِّيمُوسِيِّ 35) لِتَنْشِيطِ الحَيَوِيَّةِ وَالمَنَاعَةِ؟",
        "focusWord": "التَّرْبِيتُ التِّيمُوسِيُّ",
        "options": [
          {
            "text": "عَلَى مُنْتَصَفِ أَعْلَى الصَّدْرِ مَعَ تَنَفُّسٍ عَمِيقٍ",
            "correct": true
          },
          {
            "text": "عَلَى كَعْبِ القَدَمِ",
            "correct": false
          },
          {
            "text": "عَلَى الظَّهْرِ",
            "correct": false
          },
          {
            "text": "عَلَى المِرْفَقِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "أَزْرَارُ الدِّمَاغِ (29)",
          "left": "تَدْلِيكُ النُّقْطَتَيْنِ تَحْتَ التَّرْقُوَةِ مَعَ تَحْرِيكِ العَيْنَيْنِ أُفُقِيًّا"
        },
        {
          "right": "التَّثَاؤُبُ الطَّاقِيُّ (34)",
          "left": "تَدْلِيكُ مَفْصِلِ الفَكِّ أَمَامَ الأُذُنَيْنِ لِإِرْخَاءِ الوَجْهِ"
        },
        {
          "right": "التَّرْبِيتُ التِّيمُوسِيُّ (35)",
          "left": "التَّرْبِيتُ بِلُطْفٍ أَعْلَى الصَّدْرِ لِتَنْشِيطِ الحَيَوِيَّةِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ نِقَاطِ الطَّاقَةِ وَتَنْشِيطِ الدِّمَاغِ (29..35):",
        "correct": [
          "أَزْرَارُ الدِّمَاغِ وَأَزْرَارُ الأَرْضِ",
          "أَزْرَارُ الفَضَاءِ وَأَزْرَارُ التَّوَازُنِ",
          "النِّقَاطُ الإِيجَابِيَّةُ وَالتَّثَاؤُبُ الطَّاقِيُّ",
          "التَّرْبِيتُ التِّيمُوسِيُّ أَعْلَى الصَّدْرِ"
        ],
        "wrong": [
          "الشَّدُّ العَنِيفُ عَلَى الوَجْهِ",
          "حَبْسُ النَّفَسِ أَثْنَاءَ التَّدْلِيكِ"
        ]
      },
      "applyStep": "أُطَبِّقُ تَمْرِينَ أَزْرَارِ الدِّمَاغِ وَالتَّرْبِيتِ التِّيمُوسِيِّ كُلَّ صَبَاحٍ لِتَنْشِيطِ ذِهْنِي قَبْلَ الدَّرْسِ."
    }
  },
  {
    "w": 7,
    "secNum": 2,
    "heavenName": "سَمَاءُ الأَحَدِ الثَّانِيَةُ (هـ و ز ح)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ وَالفَقَارِيَّاتِ وَاللَّافَقَارِيَّاتِ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "ز",
    "jummal": 7,
    "prophet": "عُزَيْرٌ (ع)",
    "virtue": "اليَقِينُ",
    "unitHeader": "الوَحْدَةُ السَّابِعَةُ: نَبِيُّ اللهِ عُزَيْرٌ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "أَرَى اللهُ نَبِيَّهُ عُزَيْرًا (ع) آيَةَ البَعْثِ وَالإِحْيَاءِ فِي قَرْيَتِهِ وَفِي طَعَامِهِ الَّذِي بَقِيَ طَازَجًا، فَازْدَادَ يَقِينًا وَقَالَ: (أَعْلَمُ أَنَّ اللهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ).",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): طُغْيَانُ بُخْتَنَصَّرَ وَجَيْشِهِ حِينَ خَرَّبُوا بَيْتَ المَقْدِسِ وَأَحْرَقُوا كُتُبَ التَّوْرَاةِ بِالنَّارِ نَتِيجَةَ فَسَادِ بَنِي إِسْرَائِيلَ وَعِنَادِهِمْ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ وَالغُلُوِّ الكَاذِبِ الَّتِي نَفَخَهَا الشَّيْطَانُ فِي عُقُولِ جُهَّالِ اليَهُودِ حِينَ قَالُوا بُهْتَانًا: ﴿عُزَيْرٌ ابْنُ اللَّهِ﴾ لِأَنَّهُ جَدَّدَ لَهُمُ التَّوْرَاةَ، مَعَ بَرَاءَةِ عُزَيْرٍ التَّامَّةِ مِنْ وَهْمِهِمْ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): تَفَكُّرُ عُزَيْرٍ العَقْلِيُّ فِي القَرْيَةِ الخَاوِيَةِ عَلَى عُرُوشِهَا وَفِي حِكْمَةِ القَضَاءِ وَالقَدَرِ: ﴿أَنَّىٰ يُحْيِي هَٰذِهِ اللَّهُ بَعْدَ مَوْتِهَا﴾، وَحِفْظُ نُسْخَةِ التَّوْرَاةِ الأَصْلِيَّةِ مَدْفُونَةً فِي التُّرَابِ، وَجَمْعُ ذَرَّاتِ التُّرَابِ وَالعِظَامِ النَّخِرَةِ لِبِنَاءِ الجَسَدِ مِنْ جَدِيدٍ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): بَقَاءُ مَاءِ عَصِيرِ العِنَبِ وَرُطُوبَةِ التِّينِ طَازَجَيْنِ طَوَالَ مِائَةِ عَامٍ (﴿لَمْ يَتَسَنَّهْ﴾)، وَتَوَاضُعُ عُزَيْرٍ فِي عُبُودِيَّتِهِ الخَالِصَةِ لِلهِ، وَإِحْيَاءُ القُلُوبِ بِنُورِ الشَّرِيعَةِ وَالطَّاعَةِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الأَحَدِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ سَبْعَةٍ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلِ وَالتَّفَكُّرْ، وَهُوَ نَبِيُّ اللهِ عُزَيْرٌ عَلَيْهِ السَّلَامْ. كَانَ مِنْ ذُرِّيَّةِ هَارُونَ وَمِنْ حُكَمَاءِ بَنِي إِسْرَائِيلَ الَّذِينَ آتَاهُمُ اللهُ الحِكْمَةَ وَالفَهْمْ، وَكَانَ يَحْفَظُ آيَاتِ التَّوْرَاةِ الَّتِي نَزَّلَ اللهُ فِيهَا النُّورَ وَالهُدَى فِي ذٰلِكَ الزَّمَانْ. وَلَمَّا تَرَكَ قَوْمُهُ طَاعَةَ اللهِ وَاشْتَعَلَتْ بَيْنَهُمْ نَارُ الظُّلْمِ وَالعُدْوَانْ، سَلَّطَ اللهُ عَلَيْهِمْ جَيْشَ بُخْتَنَصَّرَ فَهَدَمَ بَيْتَ المَقْدِسِ وَأَحْرَقَ كُتُبَ التَّوْرَاةِ بِالنَّارْ، فَبَقِيَ نَبِيُّ اللهِ مَحْزُونًا يَبْكِي عَلَى دِيَارِ قَوْمِهِ وَضَيَاعِ عِلْمِهِمْ، وَلٰكِنَّ أَبَاهُ سَرُوخَا كَانَ قَدْ دَفَنَ قَبْلَ ذٰلِكَ نُسْخَةً أَصْلِيَّةً مِنَ التَّوْرَاةِ فِي التُّرَابِ كَأَنَّهَا كَنْزٌ ثَمِينٌ مَحْفُوظٌ لِأَهْلِ الإِيمَانْ.",
      "وَفِي يَوْمٍ خَرَجَ نَبِيُّ اللهِ رَاكِبًا عَلَى حِمَارِهِ يَتَفَكَّرُ بِعَقْلِهِ فِي حِكْمَةِ قَضَاءِ اللهِ وَقَدَرِهْ، وَحَمَلَ مَعَهُ زَادًا طَيِّبًا لِلطَّرِيقِ هُوَ سَلَّةٌ فِيهَا تِينٌ نَاضِجٌ وَإِنَاءٌ فِيهِ عَصِيرُ عِنَبٍ حُلْوُ المَذَاقْ. مَرَّ فِي طَرِيقِهِ عَلَى قَرْيَةِ بَيْتِ المَقْدِسِ بَعْدَ أَنْ صَارَتْ خَاوِيَةً عَلَى عُرُوشِهَا قَدْ تَهَدَّمَتْ سُقُوفُهَا وَخَلَتْ مِنْ أَهْلِهَا وَأَشْجَارِهَا، فَوَقَفَ يَنْظُرُ إِلَى تِلْكَ الأَطْلَالِ وَالعِظَامِ البَالِيَةِ عَلَى التُّرَابْ، وَقَالَ بِلِسَانِ التَّفَكُّرِ وَالتَّعَجُّبِ مِنْ عَظَمَةِ الخَالِقِ لَا بِلِسَانِ الشَّكِّ وَالارْتِيَابْ، أَنَّى يُحْيِي هٰذِهِ اللهُ بَعْدَ مَوْتِهَا. فَأَرَادَ اللهُ أَنْ يُرِيَهُ آيَةَ البَعْثِ وَالإِحْيَاءِ بِعَيْنَيْهِ لِيَكُونَ بُرْهَانًا عَقْلِيًّا لَهُ وَلِلنَّاسِ أَجْمَعِينْ، فَأَمَاتَهُ اللهُ تَحْتَ ظِلٍّ هَادِئٍ مِائَةَ عَامٍ كَامِلَةْ، وَأَخْفَاهُ عَنْ عُيُونِ المَارَّةِ وَالسِّبَاعِ وَالطُّيُورِ حِفْظًا وَسَتْرًا لِجَسَدِهِ الطَّاهِرْ.",
      "مَرَّتْ مِائَةُ سَنَةٍ عَادَ فِيهَا النَّاسُ إِلَى القَرْيَةِ فَبَنَوْا بُيُوتَهَا، وَحَرَثَ الفَلَّاحُ الأَرْضَ فَزَرَعَ فِيهَا الحُبُوبَ وَالأَشْجَارَ وَخَبَزَ النَّاسُ طَعَامَهُمْ فِي أَمَانْ. ثُمَّ بَعَثَ اللهُ نَبِيَّهُ مِنْ رُقَادِهِ فَأَحْيَا عَيْنَيْهِ أَوَّلًا لِيُبْصِرَ بِهِمَا كَيْفَ يَجْمَعُ اللهُ ذَرَّاتِ الجَسَدِ مِنْ جَدِيدْ، وَسَأَلَهُ مَلَكُ اللهِ كَمْ لَبِثْتَ فِي مَكَانِكْ، فَنَظَرَ إِلَى الشَّمْسِ وَظَنَّ أَنَّهُ نَامَ فِي الصَّبَاحِ وَاسْتَيْقَظَ قَبْلَ الغُرُوبِ فَقَالَ لَبِثْتُ يَوْمًا أَوْ بَعْضَ يَوْمْ. فَقَالَ لَهُ المَلَكُ بَلْ لَبِثْتَ مِائَةَ عَامٍ فَانْظُرْ إِلَى طَعَامِكَ وَشَرَابِكَ لَمْ يَتَسَنَّهْ وَلَمْ يَتَغَيَّرْ طَعْمُ التِّينِ وَالعَصِيرِ طَوَالَ مِائَةِ سَنَةْ، وَانْظُرْ إِلَى حِمَارِكَ كَيْفَ تَفَرَّقَتْ عِظَامُهُ البَيْضَاءُ النَّخِرَةُ عَلَى التُّرَابْ. ثُمَّ نَادَى المَلَكُ تِلْكَ العِظَامَ فَتَجَمَّعَتْ مِنْ كُلِّ جَانِبٍ وَارْتَبَطَ بَعْضُهَا بِبَعْضٍ فِي مَفَاصِلِهَا أَمَامَ عَيْنَيْهْ، ثُمَّ كَسَاهَا اللهُ بِالعُرُوقِ وَالأَعْصَابِ وَاللَّحْمِ الطَّرِيِّ وَالجِلْدِ وَالشَّعْرْ، وَنَفَخَ فِيهِ الرُّوحَ فَقَامَ الحِمَارُ عَلَى قَوَائِمِهِ يَنْهَقُ بِإِذْنِ اللهْ، فَلَمَّا تَبَيَّنَ لَهُ ذٰلِكَ سَجَدَ لِلهِ وَقَالَ أَعْلَمُ أَنَّ اللهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ وَأَنَّهُ قَوِيٌّ عَزِيزٌ حَكِيمْ.",
      "رَكِبَ نَبِيُّ اللهِ حِمَارَهُ وَسَارَ إِلَى قَرْيَتِهِ فِي زِيَارَةِ أَهْلِهِ وَمَحَلَّتِهْ، فَرَأَى عِمَارَةً جَدِيدَةً وَبَسَاتِينَ ذَاتَ زُرُوعٍ خَضْرَاءَ لَمْ يَعْرِفْهَا مِنْ قَبْلْ. وَصَلَ إِلَى دَارِهِ القَدِيمَةِ فَوَجَدَ عِنْدَ البَابِ خَادِمَتَهُ القَدِيمَةَ وَقَدْ صَارَتِ امْرَأَةً كَبِيرَةً عَمْيَاءَ ضَعِيفَةَ القَدَمَيْنِ بَعْدَ مُرُورِ مِائَةِ عَامْ، فَسَأَلَهَا أَهٰذَا بَيْتُ عُزَيْرْ، فَبَكَتِ المَرْأَةُ العَجُوزْ، وَقَالَتْ نَعَمْ وَلٰكِنَّهُ غَابَ عَنَّا مُنْذُ مِائَةِ سَنَةٍ وَلَمْ نَسْمَعْ لَهُ خَبَرًا فِي البِلَادْ. فَقَالَ لَهَا إِنِّي أَنَا هُوَ قَدْ أَمَاتَنِيَ اللهُ مِائَةَ سَنَةٍ ثُمَّ بَعَثَنِي، فَقَالَتْ إِنَّهُ كَانَ مُسْتَجَابَ الدَّعْوَةِ فَادْعُ اللهَ أَنْ يَرُدَّ إِلَيَّ بَصَرِي وَعَافِيَتِي حَتَّى أَرَاكَ بِعَيْنِي. فَدَعَا رَبَّهُ وَمَسَحَ بِيَدِهِ عَلَى عَيْنَيْهَا فَأَبْصَرَتْ فِي الحَالِ وَقَوِيَتْ قَدَمَاهَا، وَقَالَتْ أَشْهَدُ أَنَّكَ نَبِيُّ اللهِ الكَرِيمْ.",
      "دَخَلَ إِلَى مَجْلِسِ قَوْمِهِ فَوَجَدَ ابْنَهُ قَدْ صَارَ شَيْخًا كَبِيرًا عُمْرُهُ مِائَةٌ وَعَشْرُ سِنِينَ وَقَدِ ابْيَضَّ شَعْرُهُ وَلِحْيَتُهُ وَحَوْلَهُ أَحْفَادُهُ الشُّيُوخْ، بَيْنَمَا عَادَ الأَبُ شَابًّا فِي سِنِّ الأَرْبَعِينَ أَسْوَدَ الشَّعْرِ وَاللِّحْيَةْ. فَأَخْبَرَتْهُمُ الخَادِمَةُ بِالقِصَّةِ العَجِيبَةْ، فَقَالَ ابْنُهُ كَانَتْ لِأَبِي عَلَامَةٌ وَشَامَةٌ سَوْدَاءُ كَالهِلَالِ بَيْنَ كَتِفَيْهْ، فَلَمَّا كَشَفَ عَنْ كَتِفَيْهِ رَأَوُا الشَّامَةَ فَعَرَفُوهُ وَقَبَّلُوا يَدَيْهِ وَرَأْسَهُ بَعْدَ طُولِ شَوْقٍ وَحُزْنٍ عَلَى فِرَاقِهْ. وَعَلِمَ أَنَّ القَوْمَ قَدْ نَسُوا التَّوْرَاةَ بَعْدَ احْتِرَاقِهَا، فَأَخْرَجَ لَهُمُ النُّسْخَةَ الَّتِي دَفَنَهَا أَبُوهُ وَجَلَسَ يَكْتُبُ التَّوْرَاةَ بِيَدِهِ حَرْفًا بِحَرْفٍ كَمَا يُنَزِّلُ اللهُ الوَحْيَ عَلَى أَنْبِيَائِهْ، وَعَلَّمَهُمْ شَرَائِعَ الطَّهَارَةِ وَالحَلَالِ وَالحَرَامِ الَّتِي رَزَقَ اللهُ بِهَا العِبَادَ حَيَاةً طَيِّبَةْ.",
      "وَبَعْدَ مُضِيِّ زَمَنٍ طَوِيلٍ هَبَّتْ رِيحُ الوَهْمِ وَالكَذِبِ عَلَى جُهَّالِ اليَهُودِ فَقَالُوا بِغُلُوِّهِمْ إِنَّهُ ابْنُ اللهِ لِأَنَّهُ جَدَّدَ لَهُمُ التَّوْرَاةْ، وَتَبَرَّأَ نَبِيُّ اللهِ مِنْ قَوْلِهِمُ البَاطِلِ لِأَنَّهُ عَبْدٌ مُتَوَاضِعٌ يَسْجُدُ لِلهِ الأَحَدِ الصَّمَدِ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَبِطَاعَتِهِ يَعِزُّ كُلُّ مُؤْمِنٍ فِي الدُّنْيَا وَالآخِرَةْ."
    ],
    "words": [
      {
        "word": "حُزْنٍ",
        "desc": "وسط متصل / ساكن: ـزْ",
        "raw": "حُزْنٍ (وسط متصل / ساكن: ـزْ)"
      },
      {
        "word": "العَجُوزْ",
        "desc": "آخر منفصل / ساكن وقفا: زْ",
        "raw": "العَجُوزْ (آخر منفصل / ساكن وقفا: زْ)"
      },
      {
        "word": "زَمَنٍ",
        "desc": "أول منفصل / متحرك بالفتح: زَ",
        "raw": "زَمَنٍ (أول منفصل / متحرك بالفتح: زَ)"
      },
      {
        "word": "فَزَرَعَ",
        "desc": "أول متصل / متحرك بالفتح: ـزَ",
        "raw": "فَزَرَعَ (أول متصل / متحرك بالفتح: ـزَ)"
      },
      {
        "word": "عُزَيْرٌ",
        "desc": "وسط متصل / متحرك بالفتح: ـزَ",
        "raw": "عُزَيْرٌ (وسط متصل / متحرك بالفتح: ـزَ)"
      },
      {
        "word": "رَزَقَ",
        "desc": "وسط منفصل / متحرك بالفتح: زَ",
        "raw": "رَزَقَ (وسط منفصل / متحرك بالفتح: زَ)"
      },
      {
        "word": "خَبَزَ",
        "desc": "آخر متصل / متحرك بالفتح: ـزَ",
        "raw": "خَبَزَ (آخر متصل / متحرك بالفتح: ـزَ)"
      },
      {
        "word": "زُرُوعٍ",
        "desc": "أول منفصل / متحرك بالضم: زُ",
        "raw": "زُرُوعٍ (أول منفصل / متحرك بالضم: زُ)"
      },
      {
        "word": "كَنْزٌ",
        "desc": "آخر متصل / متحرك بالضم: ـزٌ",
        "raw": "كَنْزٌ (آخر متصل / متحرك بالضم: ـزٌ)"
      },
      {
        "word": "زِيَارَةِ",
        "desc": "أول منفصل / متحرك بالكسر: زِ",
        "raw": "زِيَارَةِ (أول منفصل / متحرك بالكسر: زِ)"
      },
      {
        "word": "نَزَّلَ",
        "desc": "وسط متصل / مضعف بالفتح: ـزَّ",
        "raw": "نَزَّلَ (وسط متصل / مضعف بالفتح: ـزَّ)"
      },
      {
        "word": "يَعِزُّ",
        "desc": "آخر متصل / مضعف بالضم: ـزُّ",
        "raw": "يَعِزُّ (آخر متصل / مضعف بالضم: ـزُّ)"
      },
      {
        "word": "يُنَزِّلُ",
        "desc": "وسط متصل / مضعف بالكسر: ـزِّ",
        "raw": "يُنَزِّلُ (وسط متصل / مضعف بالكسر: ـزِّ)"
      },
      {
        "word": "زَادًا",
        "desc": "أول منفصل / ممدود بالألف: زَا",
        "raw": "زَادًا (أول منفصل / ممدود بالألف: زَا)"
      },
      {
        "word": "مَحْزُونًا",
        "desc": "وسط متصل / ممدود بالواو: ـزُو",
        "raw": "مَحْزُونًا (وسط متصل / ممدود بالواو: ـزُو)"
      },
      {
        "word": "عَزِيزٌ",
        "desc": "وسط متصل / ممدود بالياء: ـزِي",
        "raw": "عَزِيزٌ (وسط متصل / ممدود بالياء: ـزِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الزَّايِ (ز): النُّطْقُ السَّلِيمُ لِحَرْفِ الزَّايِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ مَا بَيْنَ الثَّنَايَا العُلْيَا وَالسُّفْلَى (مِنْ حُرُوفِ الصَّفِيرِ)، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ (بِاعْتِبَارِهِ مِنْ حُرُوفِ القَطْعِ) عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الإِقْرَارِ بِقُدْرَةِ اللهِ: ﴿أَعْلَمُ أَنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ﴾ وَتَنْزِيهِ اللهِ الأَحَدِ الصَّمَدِ."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "القَوْسُ الهِلَالِيُّ وَالنُّقْطَةُ العُلْوِيَّةُ وَبُرْهَانُ العِيَانِ: مُشَاهَدَةُ انْحِنَاءِ حَرْفِ الزَّايِ (ز) كَالهِلَالِ (كَالشَّامَةِ الهِلَالِيَّةِ بَيْنَ كَتِفَيْ عُزَيْرٍ) مَعَ النُّقْطَةِ العُلْوِيَّةِ فَوْقَهُ كَالعَيْنِ النَّاظِرَةِ، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «الشَّكْلِ السُّبَاعِيِّ»، وَالتَّفَكُّرُ فِي حِكْمَةِ إِحْيَاءِ اللهِ لِعَيْنَيْ عُزَيْرٍ أَوَّلًا لِيَنْظُرَ عِيَانًا إِلَى تَرْكِيبِ عِظَامِهِ وَعِظَامِ حِمَارِهِ، ثُمَّ شِفَاءِ عَيْنَيِ الخَادِمَةِ العَمْيَاءِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ عُزَيْرٍ الكَامِلَةُ وَنِدَاءُ الإِحْيَاءِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ قِصَّةِ إِمَاتَةِ عُزَيْرٍ مِائَةَ عَامٍ وَبَعْثِهِ وَعَوْدَتِهِ إِلَى ابْنِهِ الشَّيْخِ الكَبِيرِ وَتَجْدِيدِهِ لِلتَّوْرَاةِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ سَبْعَةٌ (7): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (7) وَرَسْمِ حَرْفِ الزَّايِ (ز)، وَإِدْرَاكُ مَفْهُومِ السُّبَاعِيَّةِ فِي الكَوْنِ (النَّبِيُّ السَّابِعُ، السَّمَاوَاتُ السَّبْعُ، الأَرَاضِي السَّبْعُ، أَيَّامُ الأُسْبُوعِ السَّبْعَةُ، وَالجَوَارِحُ السَّبْعُ)، وَتَدْرِيبُ اليَدِ عَلَى مَهَارَةِ الخَطِّ وَنَسْخِ الكُتُبِ النَّافِعَةِ (كَمَا كَتَبَ عُزَيْرٌ التَّوْرَاةَ بِيَدِهِ)، وَقَطْفِ التِّينِ وَعَصْرِ العِنَبِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ المَشْيِ وَتَمَارِينُ المَفَاصِلِ وَالنُّهُوضِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ التَّمَدُّدِ وَالنُّهُوضِ النَّشِيطِ بَعْدَ النَّوْمِ، وَتَقْوِيَةِ مَفَاصِلِ الرُّكْبَتَيْنِ وَالسَّاقَيْنِ وَالعَضَلَاتِ الَّتِي تَكْسُو العِظَامَ، وَالسَّيْرِ فِي الأَرْضِ لِلتَّفَكُّرِ وَالعِبْرَةِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ التِّينِ وَالعِنَبِ وَحِفْظِ الأَغْذِيَةِ وَتَشْرِيحِ الجَسَدِ: تَعَلُّمُ الفَوَائِدِ العِلْمِيَّةِ وَالغِذَائِيَّةِ لِثَمَرِ التِّينِ وَعَصِيرِ العِنَبِ الطَّبِيعِيِّ فِي مَنْحِ الطَّاقَةِ وَتَنْظِيفِ البَطْنِ، وَآيَةِ حِفْظِ الطَّعَامِ وَالشَّرَابِ مِنَ التَّغَيُّرِ وَالفَسَادِ (﴿لَمْ يَتَسَنَّهْ﴾)، وَمَعْرِفَةِ عِلْمِ تَرْكِيبِ الهَيْكَلِ العَظْمِيِّ وَالأَعْصَابِ وَاللَّحْمِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ السَّتْرِ الإِلٰهِيِّ وَالوَفَاءِ لِلْخَدَمِ وَتَوْقِيرِ الآبَاءِ: تَعَلُّمُ كَيْفَ سَتَرَ اللهُ جَسَدَ نَبِيِّهِ عُزَيْرٍ مِائَةَ عَامٍ عَنْ أَعْيُنِ النَّاسِ وَالسِّبَاعِ، وَآدَابِ التَّطَهُّرِ وَالاسْتِعْدَادِ لِلصَّلَاةِ عِنْدَ الاسْتِيقَاظِ مِنَ النَّوْمِ، وَالإِحْسَانِ إِلَى الخَدَمِ وَالكِبَارِ (كَمَا رَحِمَ الخَادِمَةَ العَجُوزَ)، وَالبِرِّ بَيْنَ الآبَاءِ وَالأَبْنَاءِ."
      }
    },
    "grammar": {
      "topic": "الرُّكْنُ الثَّانِي فِي الجُمْلَةِ الاِسْمِيَّةِ: الخَبَرُ",
      "rule": "الخَبَرُ هُوَ الكَلِمَةُ الَّتِي تُخْبِرُنَا عَنِ المُبْتَدَأِ وَتُتِمُّ مَعْنَى الجُمْلَةِ الاِسْمِيَّةِ، وَيَكُونُ مَرْفُوعًا بِالضَّمَّةْ.",
      "example": "الزَّيْتُونُ مُبَارَكٌ — الزَّهْرَةُ عَطِرَةٌ — السَّمَاءُ مُمْطِرَةٌ.",
      "focusWord": "مُبَارَكٌ",
      "q": "أَيْنَ «الخَبَرُ» الَّذِي أَتَمَّ المَعْنَى فِي جُمْلَةِ «الزَّيْتُونُ مُبَارَكٌ»؟",
      "opts": [
        "مُبَارَكٌ",
        "الزَّيْتُونُ",
        "فِي",
        "الشَّجَرَةِ"
      ]
    },
    "earIirab": {
      "topic": "تَنْوِينُ الرَّفْعِ (ـٌ) فِي آخِرِ الخَبَرْ",
      "rule": "نَسْمَعُ فِي آخِرِ الخَبَرِ المَرْفُوعِ نَغْمَةَ تَنْوِينِ الضَّمِّ (ـٌ) بِوُضُوحْ.",
      "sentence": "الزَّرْعُ نَاضِجٌ.",
      "targetWord": "نَاضِجٌ",
      "caseAns": "خَبَرٌ مَرْفُوعٌ بِالضَّمَّةِ (ـٌ)"
    },
    "math": {
      "numVal": 7,
      "numName": "سَبْعَةٌ",
      "eqDisplay": "3 + 4 = 7",
      "subDisplay": "7 - 4 = 3",
      "compDisplay": "7 > 5",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "3 + 4 = ؟",
        "ans": "7 (سَبْعَةٌ)",
        "wrong": [
          "6 (سِتَّةٌ)",
          "8 (ثَمَانِيَةٌ)",
          "5 (خَمْسَةٌ)"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "7 - 4 = ؟",
        "ans": "3 (ثَلَاثَةٌ)",
        "wrong": [
          "4 (أَرْبَعَةٌ)",
          "5 (خَمْسَةٌ)",
          "2 (اثْنَانِ)"
        ]
      }
    },
    "sport": {
      "title": "التَّرْبِيتُ عَلَى الرَّأْسِ وَفَرْكُ البَطْنِ",
      "middleText": "أُرَبِّتُ بِيَدٍ عَلَى رَأْسِي صُعُودًا وَهُبُوطًا، وَأُدِيرُ اليَدَ الأُخْرَى فِي دَوَائِرَ عَلَى بَطْنِي ثُمَّ أَعْكِسُ اليَدَيْنْ. يُدَرِّبُ هٰذَا التَّمْرِينُ الدِّمَاغَ عَلَى القِيَامِ بِحَرَكَتَيْنِ مُخْتَلِفَتَيْنِ بِمَهَارَةٍ عَالِيَةْ."
    },
    "sci": {
      "title": "عَالَمُ اللَّافَقَارِيَّاتِ وَمَمْلَكَةُ النَّحْلِ",
      "summaryThird": "اللَّافَقَارِيَّاتُ كَائِنَاتٌ لَيْسَ لَهَا عَمُودٌ فَقَرِيٌّ مِثْلَ النَّحْلِ وَالفَرَاشَاتِ وَالأُخْطُبُوطِ، وَتَعْمَلُ النَّحْلَةُ بِتَعَاوُنٍ عَجِيبٍ لِتُلَقِّحَ الأَزْهَارَ وَتَصْنَعَ العَسَلَ الشَّافِي.",
      "focusConcept": "اللَّافَقَارِيَّاتُ وَالنَّحْلُ",
      "factAns": "تَلْقِيحُ الأَزْهَارِ وَصُنْعُ العَسَلْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الرِّجْلَيْنِ وَالمَشْيِ (حُور وَسُرُور - 7)",
      "storySentence": "مَشَى سُرُورٌ مَعَ أَبِيهِ بِتَوَاضُعٍ وَهُدُوءٍ، وَتَعَلَّمَ أَنَّ حَقَّ الرِّجْلَيْنِ هُوَ السَّعْيُ إِلَى الصَّلَاةِ وَالعِلْمِ وَصِلَةِ الرَّحِمِ، وَعَدَمُ المَشْيِ إِلَى مَكَانٍ فِيهِ أَذًى.",
      "applyAction": "أَمْشِي بِسَكِينَةٍ وَوَقَارٍ فِي طَرِيقِ العِلْمِ وَالخَيْرْ."
    },
    "rightsFullTitle": "(7) حق الرجلين",
    "rightsQuote": "وَأَمَّا حَقُّ رِجْلَيْكَ فَأَنْ لا تَمْشِي بهِمَا إلَى مَا لا يَحِلُّ لَكَ وَلا تَجْعَلْهُمَا مَطِيَّتَكَ فِي الطَّرِيقِ الْمُسْتَخِفَّةِ بأَهْلِهَا فِيهَا فَإنَّهَا حَامِلَتُكَ وَسَالِكَةٌ بكَ مَسْلَكَ الدِّينِ وَالسَّبْقُ لَكَ، وَلا قُوَّةَ إلا بالله.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (7) حق الرجلين",
        "text": "وَأَمَّا حَقُّ رِجْلَيْكَ فَأَنْ لا تَمْشِي بهِمَا إلَى مَا لا يَحِلُّ لَكَ وَلا تَجْعَلْهُمَا مَطِيَّتَكَ فِي الطَّرِيقِ الْمُسْتَخِفَّةِ بأَهْلِهَا فِيهَا فَإنَّهَا حَامِلَتُكَ وَسَالِكَةٌ بكَ مَسْلَكَ الدِّينِ وَالسَّبْقُ لَكَ، وَلا قُوَّةَ إلا بالله. — وَفِي سِيرَةِ عُزَيْرٌ (ع): آدَابُ السَّتْرِ الإِلٰهِيِّ وَالوَفَاءِ لِلْخَدَمِ وَتَوْقِيرِ الآبَاءِ: تَعَلُّمُ كَيْفَ سَتَرَ اللهُ جَسَدَ نَبِيِّهِ عُزَيْرٍ مِائَةَ عَامٍ عَنْ أَعْيُنِ النَّاسِ وَالسِّبَاعِ، وَآدَابِ التَّطَهُّرِ وَالاسْتِعْدَادِ لِلصَّلَاةِ عِنْدَ الاسْتِيقَاظِ مِنَ النَّوْمِ، وَالإِحْسَانِ إِلَى الخَدَمِ وَالكِبَارِ (كَمَا رَحِمَ الخَادِمَةَ العَجُوزَ)، وَالبِرِّ بَيْنَ الآبَاءِ وَالأَبْنَاءِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرجلين",
        "text": "حور تتعلم طريق الفرح 1. الاختيار بين الخطر والأمان شعرت حور بضيق وأرادت أن تطلق طاقتها، فقالت لأمها بحماس: \"أمي، هل نخرج لنلعب قليلاً؟\" اقترح أخوها أن يكتفوا بالنزول للعب في الشارع أمام البيت، لكن الأم رفضت بهدوء وحكمة: \"الطريق مؤذٍ وخطير يا أحبّتي، يمكن أن تؤذوا أنفسكم أو غيركم. تعالوا نذهب إلى الحديقة العامة. هناك يمكنكم الركض بأمان، والهواء النقي هو أساس نموكم السليم.\" فرح الأطفال بالفكرة، وانطلقوا إلى الحديقة، حيث كان النسيم عليلًا والضحكات تنتظر أن تملأ المكان. 2. عاقبة الأذى والتهور بينما كانوا يركضون، مرّت قطة صغيرة تفتش عن طعام قرب سلة المهملات. سارع طفل غريب إليها، وركلها بقدمه محاولاً إخافتها. لكن القطة قفزت بعيدًا، وفقد هو توازنه وسقط أرضًا، ليعلو صوته بالبكاء الشديد. اقترب منه أخو حور وقال بعتاب هادئ: \"ماذا استفدت من هذا الفعل؟ لقد سببت الأذى لكائن ضعيف، وانتهى بك الأمر تتألم أنت أيضاً.\" ساعده الأخ على النهوض، ومشيا معًا نحو الأرجوحة الثنائية. لكن العنف لم يغب عن سلوك الطفل؛ فبدأ يحرك الأرجوحة بعنف مفرط، مهدداً بسقوطه وسقوط أخي."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرجلين",
        "text": "3. حكمة الإيقاف وجمال العطاء هنا، لم تتمالك حور أعصابها، وركضت تنادي أمها. جاءت الأم بخطوات واثقة وأوقفت الأرجوحة. نظرت إلى الطفل بجدية ممزوجة بالحنان وقالت: \"يا ولدي، الحركة جميلة ومفيدة، لكنها تصبح خطيرة إن لم نعرف ضوابطها. أرأيت؟ اللعب المتهور لا يؤذي إلا صاحبه أو الآخرين، ولا يجلب الفرح أبدًا.\" خفض الطفل رأسه خجلاً. في هذه الأثناء، كان أخو حور يبتعد عنه ليساعد أخته الصغيرة على صعود درج الزلاجة. ومع كل مرة كانت الأخت تهبط وتضحك، كان صوت ضحكها الصافي يتطاير مثل العصافير في السماء، جاذباً ابتسامات الجميع. وقف الطفل السابق يراقب مشهد الفرح والتعاون، ثم انسحب بهدوء من الحديقة. وكأنه أدرك في تلك اللحظة أن الشقاوة لا تخلق السعادة، بينما الرحمة والتعاون هما مصدرها الحقيقي. 4. الدرس المستفاد ابتسمت حور وهي ترى الفرق بين المشهدين، وقالت لأمها بامتنان: \"ما أجمل الحركة يا أمي، عندما تكون لدرء الأذى وجلب الفرح والسعادة للآخرين!\" وضعت الأم يدها على كتف حور وقالت بابتسامة رقيقة: \"**صدقتِ يا صغيرتي... أقدامنا في الحياة تأخذنا إمّا إلى سعادة، أو إلى شقاء. والاختيار لنا، أن نكون مصدراً للخير أو للأذى في كل خطوة نخطوها.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ",
      "topic": "الدَّرْسُ (3): اللَّافَقَارِيَّاتُ (1. مَفْصِلِيَّاتُ الأَرْجُلِ — 2. الرَّخَوِيَّاتُ — 3. الدِّيدَانُ — 4. البَحْرِيَّاتُ اللَّافَقَارِيَّةُ)",
      "coverImg": "assets/y7/scince/s7.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s7.1.jpg",
          "text": "الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (1) مَفْصِلِيَّاتُ الأَرْجُلِ: لَافَقَارِيَّاتٌ بِلَا عَمُودٍ فَقَرِيٍّ يُغَطِّيهَا دِرْعٌ صُلْبٌ وَقُرُونُ اسْتِشْعَارٍ؛ أَقْسَامُهَا الأَرْبَعَةُ: الحَشَرَاتُ (نَحْلَةٌ، جَرَادٌ)، وَالعَنْكَبِيَّاتُ (عَنْكَبُوتٌ، عَقْرَبٌ)، وَالقِشْرِيَّاتُ (سَلْطَعُونٌ، رُوبِيَانٌ)، وَعَدِيدَاتُ الأَرْجُلِ (أُمُّ أَرْبَعٍ وَأَرْبَعِينَ)."
        },
        {
          "img": "assets/y7/scince/s7.2.jpg",
          "text": "الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (2) الرَّخَوِيَّاتُ: لَافَقَارِيَّاتٌ لَهَا عَبَاءَةٌ وَقَدَمٌ عَضَلِيَّةٌ وَتُفْرِزُ الصَّدَفَةَ؛ أَقْسَامُهَا الثَّلَاثَةُ: بَطْنُقَدَمِيَّاتٌ (حَلَزُونٌ)، وَمَحَارِيَّاتٌ (مَحَارَةُ اللُّؤْلُؤِ)، وَرَأْسُقَدَمِيَّاتٌ (أُخْطُبُوطٌ، حَبَّارٌ)."
        },
        {
          "img": "assets/y7/scince/s7.3.jpg",
          "text": "الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (3) عَالَمُ الدِّيدَانِ: أَجْسَامٌ لَيِّنَةٌ بِلَا أَرْجُلٍ تَتَنَفَّسُ عَبْرَ جِلْدِهَا الرَّطْبِ؛ أَقْسَامُهَا الثَّلَاثَةُ: حَلَقِيَّةٌ نَافِعَةٌ لِتَهْوِيَةِ التُّرْبَةِ (دُودَةُ الأَرْضِ، العَلَقَةُ)، وَمُسَطَّحَةٌ (بَلَانَارْيَا، دُودَةٌ شَرِيطِيَّةٌ)، وَأُسْطُوَانِيَّةٌ (إِسْكَارِسُ، نِيمَاتُودَا)."
        },
        {
          "img": "assets/y7/scince/s7.4.jpg",
          "text": "الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (4) البَحْرِيَّاتُ اللَّافَقَارِيَّةُ: تَعِيشُ فِي البِحَارِ وَقَاعِ المُحِيطِ؛ أَقْسَامُهَا الثَّلَاثَةُ: الإِسْفَنْجِيَّاتُ (إِسْفَنْجُ البَحْرِ)، وَاللَّاسِعَاتُ (قِنْدِيلُ البَحْرِ، المَرْجَانُ)، وَشَوْكِيَّاتُ الجِلْدِ (نَجْمَةُ البَحْرِ، خِيَارُ البَحْرِ)."
        }
      ],
      "text": "الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (1) مَفْصِلِيَّاتُ الأَرْجُلِ: لَافَقَارِيَّاتٌ بِلَا عَمُودٍ فَقَرِيٍّ يُغَطِّيهَا دِرْعٌ صُلْبٌ وَقُرُونُ اسْتِشْعَارٍ؛ أَقْسَامُهَا الأَرْبَعَةُ: الحَشَرَاتُ (نَحْلَةٌ، جَرَادٌ)، وَالعَنْكَبِيَّاتُ (عَنْكَبُوتٌ، عَقْرَبٌ)، وَالقِشْرِيَّاتُ (سَلْطَعُونٌ، رُوبِيَانٌ)، وَعَدِيدَاتُ الأَرْجُلِ (أُمُّ أَرْبَعٍ وَأَرْبَعِينَ). الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (2) الرَّخَوِيَّاتُ: لَافَقَارِيَّاتٌ لَهَا عَبَاءَةٌ وَقَدَمٌ عَضَلِيَّةٌ وَتُفْرِزُ الصَّدَفَةَ؛ أَقْسَامُهَا الثَّلَاثَةُ: بَطْنُقَدَمِيَّاتٌ (حَلَزُونٌ)، وَمَحَارِيَّاتٌ (مَحَارَةُ اللُّؤْلُؤِ)، وَرَأْسُقَدَمِيَّاتٌ (أُخْطُبُوطٌ، حَبَّارٌ). الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (3) عَالَمُ الدِّيدَانِ: أَجْسَامٌ لَيِّنَةٌ بِلَا أَرْجُلٍ تَتَنَفَّسُ عَبْرَ جِلْدِهَا الرَّطْبِ؛ أَقْسَامُهَا الثَّلَاثَةُ: حَلَقِيَّةٌ نَافِعَةٌ لِتَهْوِيَةِ التُّرْبَةِ (دُودَةُ الأَرْضِ، العَلَقَةُ)، وَمُسَطَّحَةٌ (بَلَانَارْيَا، دُودَةٌ شَرِيطِيَّةٌ)، وَأُسْطُوَانِيَّةٌ (إِسْكَارِسُ، نِيمَاتُودَا). الدَّرْسُ (3) اللَّافَقَارِيَّاتُ — (4) البَحْرِيَّاتُ اللَّافَقَارِيَّةُ: تَعِيشُ فِي البِحَارِ وَقَاعِ المُحِيطِ؛ أَقْسَامُهَا الثَّلَاثَةُ: الإِسْفَنْجِيَّاتُ (إِسْفَنْجُ البَحْرِ)، وَاللَّاسِعَاتُ (قِنْدِيلُ البَحْرِ، المَرْجَانُ)، وَشَوْكِيَّاتُ الجِلْدِ (نَجْمَةُ البَحْرِ، خِيَارُ البَحْرِ).",
      "q1": {
        "q": "مَا الأَقْسَامُ الأَرْبَعَةُ لِمَفْصِلِيَّاتِ الأَرْجُلِ ذَاتِ الدِّرْعِ الصُّلْبِ؟",
        "focusWord": "مَفْصِلِيَّاتُ الأَرْجُلِ",
        "options": [
          {
            "text": "الحَشَرَاتُ، وَالعَنْكَبِيَّاتُ، وَالقِشْرِيَّاتُ، وَعَدِيدَاتُ الأَرْجُلِ",
            "correct": true
          },
          {
            "text": "الأَسْمَاكُ وَالزَّوَاحِفُ وَالطُّيُورُ",
            "correct": false
          },
          {
            "text": "الحَزَازِيَّاتُ وَالسَّرْخَسِيَّاتُ",
            "correct": false
          },
          {
            "text": "الفِطْرِيَّاتُ وَالبَكْتِيرْيَا",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "إِلَى أَيِّ مَجْمُوعَةٍ تَنْتَمِي مَحَارَةُ اللُّؤْلُؤِ وَالحَلَزُونُ وَالأُخْطُبُوطُ؟",
        "focusWord": "الرَّخَوِيَّاتُ",
        "options": [
          {
            "text": "الرَّخَوِيَّاتُ (المَحَارِيَّاتُ وَالبَطْنُقَدَمِيَّاتُ وَالرَّأْسُقَدَمِيَّاتُ)",
            "correct": true
          },
          {
            "text": "الدِّيدَانُ الحَلَقِيَّةُ",
            "correct": false
          },
          {
            "text": "البَرْمَائِيَّاتُ",
            "correct": false
          },
          {
            "text": "الثَّدْيِيَّاتُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا فَائِدَةُ دُودَةِ الأَرْضِ (مِنَ الدِّيدَانِ الحَلَقِيَّةِ) لِلْبِيئَةِ الزِّرَاعِيَّةِ؟",
        "focusWord": "تَهْوِيَةُ التُّرْبَةِ",
        "options": [
          {
            "text": "تَهْوِيَةُ التُّرْبَةِ وَتَحْلِيلُ بَقَايَا الأَوْرَاقِ",
            "correct": true
          },
          {
            "text": "إِنْتَاجُ العَسَلِ",
            "correct": false
          },
          {
            "text": "بِنَاءُ الشِّعَابِ المَرْجَانِيَّةِ",
            "correct": false
          },
          {
            "text": "إِنْتَاجُ اللُّؤْلُؤِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "مَفْصِلِيَّاتُ الأَرْجُلِ",
          "left": "النَّحْلَةُ وَالعَنْكَبُوتُ وَالسَّلْطَعُونُ وَأُمُّ أَرْبَعٍ وَأَرْبَعِينَ"
        },
        {
          "right": "الرَّخَوِيَّاتُ",
          "left": "الحَلَزُونُ وَالمَحَارَةُ وَالأُخْطُبُوطُ وَالحَبَّارُ"
        },
        {
          "right": "البَحْرِيَّاتُ اللَّافَقَارِيَّةُ",
          "left": "إِسْفَنْجُ البَحْرِ وَالمَرْجَانُ وَنَجْمَةُ البَحْرِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرِ الكَائِنَاتِ اللَّافَقَارِيَّةَ النَّافِعَةَ لِتَوَازُنِ البِيئَةِ:",
        "correct": [
          "النَّحْلَةُ (مَفْصِلِيَّاتٌ تُلَقِّحُ الأَزْهَارَ)",
          "دُودَةُ الأَرْضِ (تُهَوِّي التُّرْبَةَ)",
          "مَحَارَةُ اللُّؤْلُؤِ (رَخَوِيَّاتٌ)",
          "المَرْجَانُ وَنَجْمَةُ البَحْرِ"
        ],
        "wrong": [
          "الأَسَدُ (فَقَارِيَّاتٌ)",
          "الصَّقْرُ (فَقَارِيَّاتٌ)"
        ]
      },
      "applyStep": "أَغْسِلُ الخُضْرَوَاتِ وَالفَوَاكِهَ جَيِّدًا لِلْوِقَايَةِ مِنَ الدِّيدَانِ الضَّارَّةِ وَأَحْمِي النَّحْلَ النَّافِعَ فِي الطَّبِيعَةِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt7.jpg",
      "title": "تَمَارِينُ التَّمَدُّدِ العَضَلِيِّ وَفَكِّ التَّوَتُّرِ (المَجْمُوعَةُ السَّادِسَةُ: 36..42)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِإِطَالَةِ الأَوْتَارِ وَإِرْخَاءِ العَضَلَاتِ المُنْقَبِضَةِ وَزِيَادَةِ الاسْتِيعَابِ!",
      "slideText": "🧘 تَمَارِينُ التَّمَدُّدِ العَضَلِيِّ وَفَكِّ التَّوَتُّرِ (المَجْمُوعَةُ السَّادِسَةُ — التَّمَارِينُ 36 إِلَى 42): (36) البُومَةُ الحَكِيمَةُ (مَسْكُ عَضَلَةِ الكَتِفِ مَعَ إِدَارَةِ الرَّأْسِ بِبُطْءٍ مَعَ الزَّفِيرِ). (37) تَفْعِيلُ الذِّرَاعِ بِجانبِ الأُذُنِ لِإِطَالَةِ الكَتِفَيْنِ. (38) انْحِنَاءَةُ الجَاذِبِيَّةِ لِلْأَمَامِ مَعَ تَقَاطُعِ الكَاحِلَيْنِ. (39) ضَخُّ السَّاقِ بِالارْتِكَازِ عَلَى الحَائِطِ وَمَدِّ السَّاقِ لِلْخَلْفِ. (40) ثَنْيُ القَدَمِ وَفَرْدُهَا بِبُطْءٍ. (41) المُنَشِّطُ المَائِيُّ عَبْرَ إِسْنَادِ الجَبْهَةِ بَيْنَ الكَفَّيْنِ عَلَى الطَّاوِلَةِ ثُمَّ رَفْعِ الرَّأْسِ مَعَ الشَّهِيقِ. (42) القِطَّةُ وَالبَقَرَةُ لِمُرُونَةِ العَمُودِ الفَقَرِيِّ.",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (البُومَةِ الحَكِيمَةِ) رَقْمِ (36) لِفَكِّ تَوَتُّرِ الرَّقَبَةِ وَالكَتِفَيْنِ؟",
        "focusWord": "البُومَةُ الحَكِيمَةُ",
        "options": [
          {
            "text": "يُمْسِكُ عَضَلَةَ كَتِفِهِ بِاليَدِ المُعَاكِسَةِ وَيَضْغَطُ بِلُطْفٍ مَعَ إِدَارَةِ رَأْسِهِ بِبُطْءٍ مِنَ اليَمِينِ لِلْيَسَارِ مَعَ الزَّفِيرِ",
            "correct": true
          },
          {
            "text": "يَقْفِزُ فِي الهَوَاءِ بِسُرْعَةٍ",
            "correct": false
          },
          {
            "text": "يَرْكُضُ لِلْخَلْفِ",
            "correct": false
          },
          {
            "text": "يَحْمِلُ كِتَابًا فَوْقَ رَأْسِهِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الحَرَكَةُ الصَّحِيحَةُ فِي تَمْرِينِ (القِطَّةِ وَالبَقَرَةِ) رَقْمِ (42) لِإِطَالَةِ الظَّهْرِ؟",
        "focusWord": "القِطَّةُ وَالبَقَرَةُ",
        "options": [
          {
            "text": "يَرْتَكِزُ عَلَى يَدَيْهِ وَرُكْبَتَيْهِ، وَيُقَوِّسُ ظَهْرَهُ لِلْأَعْلَى مَعَ الزَّفِيرِ، ثُمَّ يُرْخِي بَطْنَهُ لِلْأَسْفَلِ وَيَرْفَعُ رَأْسَهُ مَعَ الشَّهِيقِ",
            "correct": true
          },
          {
            "text": "يَقِفُ عَلَى قَدَمٍ وَاحِدَةٍ",
            "correct": false
          },
          {
            "text": "يَجْلِسُ عَلَى الحَائِطِ",
            "correct": false
          },
          {
            "text": "يَضْرِبُ الكُرَةَ بِرِجْلِهِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (ضَخِّ السَّاقِ 39) وَتَمْرِينَ (انْحِنَاءَةِ الجَاذِبِيَّةِ 38)؟",
        "focusWord": "ضَخُّ السَّاقِ وَانْحِنَاءَةُ الجَاذِبِيَّةِ",
        "options": [
          {
            "text": "نَضْغَطُ بِكَعْبِ السَّاقِ الخَلْفِيَّةِ عَلَى الأَرْضِ مَعَ الزَّفِيرِ، وَنَنْحَنِي لِلْأَمَامِ بِبُطْءٍ لِإِطَالَةِ الأَوْتَارِ",
            "correct": true
          },
          {
            "text": "نَشُدُّ السَّاقَ بِقُوَّةٍ مُؤْلِمَةٍ",
            "correct": false
          },
          {
            "text": "نَحْبِسُ النَّفَسَ أَثْنَاءَ الانْحِنَاءِ",
            "correct": false
          },
          {
            "text": "نَقْفِزُ مِنْ مَكَانٍ مُرْتَفِعٍ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "البُومَةُ الحَكِيمَةُ (36)",
          "left": "مَسْكُ الكَتِفِ وَإِدَارَةُ الرَّأْسِ بِبُطْءٍ مَعَ الزَّفِيرِ"
        },
        {
          "right": "ضَخُّ السَّاقِ (39)",
          "left": "الارْتِكَازُ عَلَى الحَائِطِ وَضَغْطُ الكَعْبِ الخَلْفِيِّ عَلَى الأَرْضِ"
        },
        {
          "right": "القِطَّةُ وَالبَقَرَةُ (42)",
          "left": "تَقْوِيسُ الظَّهْرِ لِلْأَعْلَى مَعَ الزَّفِيرِ وَإِرْخَاؤُهُ مَعَ الشَّهِيقِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ التَّمَدُّدِ العَضَلِيِّ وَفَكِّ التَّوَتُّرِ (36..42):",
        "correct": [
          "البُومَةُ الحَكِيمَةُ وَتَفْعِيلُ الذِّرَاعِ",
          "انْحِنَاءَةُ الجَاذِبِيَّةِ",
          "ضَخُّ السَّاقِ وَثَنْيُ القَدَمِ",
          "المُنَشِّطُ المَائِيُّ وَالقِطَّةُ وَالبَقَرَةُ"
        ],
        "wrong": [
          "الحَرَكَاتُ العَنِيفَةُ المُفَاجِئَةُ",
          "تَقْوِيسُ الظَّهْرِ أَثْنَاءَ القِرَاءَةِ"
        ]
      },
      "applyStep": "أُطَبِّقُ تَمْرِينَ البُومَةِ الحَكِيمَةِ وَالقِطَّةِ وَالبَقَرَةِ لِإِرْخَاءِ عَضَلَاتِ الرَّقَبَةِ وَالظَّهْرِ بَعْدَ الكِتَابَةِ."
    }
  },
  {
    "w": 8,
    "secNum": 2,
    "heavenName": "سَمَاءُ الأَحَدِ الثَّانِيَةُ (هـ و ز ح)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ وَالفَقَارِيَّاتِ وَاللَّافَقَارِيَّاتِ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "ح",
    "jummal": 8,
    "prophet": "نُوحٌ (ع)",
    "virtue": "الثَّبَاتُ",
    "unitHeader": "الوَحْدَةُ الثَّامِنَةُ : نَبِيُّ اللهِ نُوحٌ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "صَنَعَ نَبِيُّ اللهِ نُوحٌ (ع) السَّفِينَةَ الكَبِيرَةَ بِأَمْرِ اللهِ وَثَبَتَ عَلَى دَعْوَةِ التَّوْحِيدِ، فَحَمَلَ فِيهَا المُؤْمِنِينَ وَمِنْ كُلِّ زَوْجَيْنِ اثْنَيْنِ وَنَجَوْا مِنَ الطُّوفَانْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): نَارُ الكِبْرِ وَالعِنَادِ فِي قُلُوبِ المَلَأِ المُتَرَفِينَ حِينَ احْتَقَرُوا الفُقَرَاءَ وَضَرَبُوا نَبِيَّ اللهِ وَوَصَّوْا أَبْنَاءَهُمْ بِعَدَاوَتِهِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ فِي عِبَادَةِ الأَصْنَامِ الخَمْسَةِ (وَدٍّ وَسُوَاعٍ وَيَغُوثَ وَيَعُوقَ وَنَسْرٍ)، وَسُخْرِيَتُهُمْ مِنْ صُنْعِ السَّفِينَةِ فِي البَرِّ، وَنِفَاقُ امْرَأَةِ نُوحٍ، وَوَهْمُ ابْنِهِ كَنْعَانَ حِينَ ظَنَّ أَنَّ الجَبَلَ يَعْصِمُهُ مِنْ أَمْرِ اللهِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): دَعْوَةُ نُوحٍ قَوْمَهُ إِلَى التَّفَكُّرِ العَقْلِيِّ فِي خَلْقِ السَّمَاوَاتِ السَّبْعِ وَالأَرْضِ، وَغَرْسُهُ الأَشْجَارَ فِي التُّرَابِ أَرْبَعِينَ سَنَةً، وَصُنْعُهُ أَوَانِيَ الفَخَّارِ مِنَ الطِّينِ لِتَعَلُّمِ حِكْمَةِ الرَّحْمَةِ، وَعَوْدَةُ الحَمَامَةِ بِغُصْنِ الزَّيْتُونِ وَأَثَرِ الطِّينِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): صَبْرُ نُوحٍ فِي الطَّاعَةِ وَكَوْنُهُ «عَبْدًا شَكُورًا»، وَأَمَانَةُ الحَمَامَةِ فِي مُقَابِلِ شَهْوَةِ الغُرَابِ، وَفَوَرَانُ التَّنُّورِ فِي دَارِ العَجُوزِ المُؤْمِنَةِ، وَانْهِمَارُ مَاءِ السَّمَاءِ وَتَفَجُّرُ عُيُونِ الأَرْضِ لِنَجَاةِ الطَّائِعِينَ وَتَطْهِيرِ الأَرْضِ.",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ الأَحَدِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ ثَمَانِيَةٍ لِيُكْمِلَ دَوْرَةَ الطَّبَائِعِ الأَرْبَعِ فِي مَنْزِلَةِ المَاءِ وَالشُّكْرِ وَالطَّاعَةْ، وَهُوَ شَيْخُ المُرْسَلِينَ وَأَوَّلُ أُولِي العَزْمِ نَبِيُّ اللهِ نُوحٌ عَلَيْهِ السَّلَامْ. مَنَحَهُ اللهُ أَطْوَلَ أَعْمَارِ الأَنْبِيَاءِ فَعَاشَ أَلْفَيْنِ وَخَمْسَمِائَةِ سَنَةٍ وَبَنَى مَسْجِدَ الكُوفَةِ المُبَارَكْ، وَوُصِفَ فِي القُرْآنِ بِأَنَّهُ عَبْدٌ شَكُورٌ لِأَنَّهُ كَانَ إِذَا أَكَلَ طَعَامًا أَوْ شَرِبَ مَاءً أَوْ لَبِسَ ثَوْبًا يَسْتُرُ بَدَنَهُ رَفَعَ صَوْتَهُ حَامِدًا شَاكِرًا لِرَبِّ العَالَمِينْ. بَعَثَهُ اللهُ إِلَى قَوْمِهِ بَعْدَ أَنْ خَدَعَتْهُمْ رِيحُ الوَهْمِ فَعَبَدُوا خَمْسَةَ أَصْنَامٍ مِنْ حِجَارَةٍ هِيَ وَدٌّ وَسُوَاعٌ وَيَغُوثُ وَيَعُوقُ وَنَسْرْ، وَاشْتَعَلَتْ فِي قُلُوبِ مُتَرَفِيهِمْ نَارُ الكِبْرِ وَالغَضَبِ وَالعُدْوَانْ.",
      "وَقَفَ نَبِيُّ اللهِ بَيْنَهُمْ يَدْعُوهُمْ بِكُلِّ حِكْمَةٍ وَلُطْفٍ لَيْلًا وَنَهَارًا وَفِي كُلِّ سَحَرٍ وَمَسَاءْ، وَهُوَ لَا يَشِحُّ عَلَيْهِمْ بِالنَّصِيحَةِ وَالدُّعَاءْ، بَلْ نَصَحَ قَوْمَهُ أَنْ يَتَفَكَّرُوا بِعُقُولِهِمْ كَيْفَ خَلَقَ اللهُ سَبْعَ سَمَاوَاتٍ طِبَاقًا وَجَعَلَ القَمَرَ فِيهِنَّ نُورًا وَالشَّمْسَ سِرَاجًا وَالأَرْضَ بِسَاطًا لِلسَّعْيِ وَالعُمْرَانْ، وَأَنَّهُمْ إِنْ أَطَاعُوا اللهَ وَاسْتَغْفَرُوهُ يُرْسِلِ السَّمَاءَ عَلَيْهِمْ مِدْرَارًا وَيُمْدِدْهُمْ بِأَمْوَالٍ وَبَنِينَ وَجَنَّاتٍ وَأَنْهَارْ. فَآمَنَ مَعَهُ الفُقَرَاءُ وَأَصْحَابُ الحِرَفِ الشَّرِيفَةِ المتَوَاضِعُونْ، بَيْنَمَا تَكَبَّرَ الأَغْنِيَاءُ وَطَلَبُوا مِنْهُ أَنْ يَطْرُدَ الفُقَرَاءَ مِنْ مَجْلِسِهْ، فَرَفَضَ نَبِيُّ اللهِ بِعَدْلِهِ وَقَالَ وَمَا أَنَا بِطَارِدِ المُؤْمِنِينَ الأَطْهَارْ. وَوَضَعَ المُسْتَكْبِرُونَ أَصَابِعَهُمْ فِي آذَانِهِمْ لِئَلَّا يَسْمَعُوا صَوْتَ الحَقِّ وَكَانُوا يَضْرِبُونَهُ حَتَّى يُغْشَى عَلَيْهْ، فَإِذَا أَفَاقَ اغْتَسَلَ بِالمَاءِ الطَّهُورِ وَعَادَ يُنَحِّي عَنْهُمْ طَرِيقَ البَاطِلِ تِسْعَمِائَةٍ وَخَمْسِينَ سَنَةً بِصَبْرٍ جَمِيلْ.",
      "وَلَمَّا رَأَى الرَّجُلَ مِنْهُمْ يَحْمِلُ وَلَدَهُ الصَّغِيرَ عَلَى كَتِفِهِ وَيُوصِيهِ بِتَكْذِيبِ نَبِيِّ اللهْ، وَأَوْحَى اللهُ إِلَيْهِ أَنَّهُ لَنْ يُؤْمِنَ مِنْ قَوْمِكَ إِلَّا مَنْ قَدْ آمَنَ وَأَنَّهُمْ لَا يَلِدُونَ إِلَّا فَاجِرًا كَفَّارًا، دَعَا رَبَّهُ قَائِلًا رَبِّ إِنِّي مَغْلُوبٌ فَانْتَصِرْ وَلَا تَذَرْ عَلَى الأَرْضِ مِنَ الكَافِرِينَ دَيَّارًا. فَأَمَرَهُ اللهُ أَنْ يَغْرِسَ بِيَدَيْهِ أَشْجَارَ السَّاجِ وَالنَّخْلِ فِي التُّرَابِ وَيَسْقِيَهَا بِالمَاءِ أَرْبَعِينَ سَنَةً حَتَّى كَبُرَتْ وَقَوِيَتْ أَغْصَانُهَا، ثُمَّ قَطَعَهَا وَنَشَرَ أَخْشَابَهَا، وَنَحَّى عَنْهَا القُشُورَ اليَابِسَةَ لِيَبْنِيَ سَفِينَةَ النَّجَاةِ الكَبِيرَةَ مِنْ ثَلَاثِ طَبَقَاتٍ فِي سَاحَةٍ وَاسِعَةٍ بِأَرْضِ الكُوفَةِ بِأَعْيُنِ اللهِ وَوَحْيِهْ. وَعَلَّمَهُ المَلَكُ جِبْرِيلُ هَنْدَسَةَ السَّفِينَةِ فَثَبَّتَ فِيهَا المَسَامِيرَ المُبَارَكَةَ بِأَسْمَاءِ أَنْوَارِ أَهْلِ البَيْتِ الخَمْسَةِ الأَطْهَارْ، وَكَانَ قَوْمُهُ يَمُرُّونَ بِهِ وَيَسْخَرُونَ مِنْ صُنْعِ السَّفِينَةِ فَوْقَ الرِّمَالْ، فَيَرُدُّ عَلَيْهِمْ بِثَبَاتِ العَقْلِ وَاليَقِينِ إِنْ تَسْخَرُوا مِنَّا فَإِنَّا نَسْخَرُ مِنْكُمْ كَمَا تَسْخَرُونْ.",
      "وَلَمَّا تَمَّ بِنَاءُ السَّفِينَةِ مِنْ ذَوَاتِ الدُّسُرِ وَالأَلْوَاحْ، رَفَعَتِ المَلَائِكَةُ البَيْتَ المَعْمُورَ إِلَى السَّمَاءْ، وَظَهَرَتِ العَلَامَةُ المَوْعُودَةُ حِينَ فَارَ التَّنُّورُ بِالمَاءِ فِي دَارِ امْرَأَةٍ عَجُوزٍ مُؤْمِنَةٍ صَالِحَةْ. فَأَمَرَ اللهُ نَبِيَّهُ فَأَدْخَلَ فِي الطَّبَقَةِ الأُولَى مِنْ كُلِّ زَوْجَيْنِ اثْنَيْنِ مِنَ الحَيَوَانَاتِ وَالأَزْوَاجِ الثَّمَانِيَةِ مِنَ الأَنْعَامْ، وَفِي الطَّبَقَةِ الثَّانِيَةِ الطُّيُورَ وَالطَّعَامْ، وَحَمَلَ مَعَهُ جَسَدَ أَبِينَا آدَمَ عَلَيْهِ السَّلَامُ وَمَوَارِيثَ الأَنْبِيَاءِ وَمِنْ كُلِّ حُبُوبٍ نَافِعَةٍ لِلقُوتِ وَالزِّرَاعَةْ. وَصَعِدَ مَعَهُ فِي الطَّبَقَةِ العُلْيَا أَبْنَاؤُهُ الثَّلَاثَةُ سَامٌ وَحَامٌ وَيَافِثُ وَالمُؤْمِنُونَ وَكَانُوا ثَمَانِينَ مُؤْمِنًا وَمُؤْمِنَةْ، وَقَالَ لَهُمُ ارْكَبُوا فِيهَا بِسْمِ اللهِ مَجْرَاهَا وَمُرْسَاهَا إِنَّ رَبِّي لَغَفُورٌ رَحِيمٌ بِعِبَادِهْ، وَكَانَ الدِّيكُ الأَبْيَضُ يُؤَذِّنُ لَهُمْ فِي أَوْقَاتِ الصَّلَاةِ فِي طَهَارَةٍ وَنِظَامْ.",
      "فَتَحَ اللهُ أَبْوَابَ السَّمَاءِ بِمَاءٍ مُنْهَمِرٍ أَرْبَعِينَ يَوْمًا وَفَجَّرَ الأَرْضَ عُيُونًا حَتَّى صَارَتِ الأَرْضُ كُلُّهَا كَأَنَّهَا بُحُورٍ عَمِيقَةٍ تَلْتَقِي أَمْوَاجُهَا العَالِيَةُ كَالجِبَالْ. وَهَلَكَتِ امْرَأَةُ نُوحٍ الَّتِي خَانَتْ بِالنِّفَاقِ وَكَانَتْ تَكْشِفُ أَسْرَارَ المُؤْمِنِينَ لِلجَبَابِرَةِ الأَشْرَارْ، وَنَادَى نَبِيُّ اللهِ ابْنَهُ كَنْعَانَ يَا بُنَيَّ ارْكَبْ مَعَنَا وَلَا تَكُنْ مَعَ الكَافِرِينْ، فَأَبَى الابْنُ بِسَبَبِ الكِبْرِ وَرِيحِ الوَهْمِ وَقَالَ سَآوِي إِلَى جَبَلٍ يَعْصِمُنِي مِنَ المَاءْ. فَقَالَ لَهُ أَبُوهُ لَا عَاصِمَ اليَوْمَ مِنْ أَمْرِ اللهِ إِلَّا مَنْ رَحِمْ، وَحَالَ بَيْنَهُمَا المَوْجُ فَكَانَ مِنَ المُغْرَقِينْ، وَأَعْلَمَ اللهُ نَبِيَّهُ أَنَّ هٰذَا الابْنَ لَيْسَ مِنْ أَهْلِهِ لِأَنَّهُ عَمَلٌ غَيْرُ صَالِحٍ خَالَفَ طَرِيقَ الإِيمَانِ وَالطَّاعَةْ.",
      "جَرَتِ السَّفِينَةُ بِأَمَانِ اللهِ وَطَافَتْ حَوْلَ مَكَانِ الكَعْبَةِ المُشَرَّفَةِ سَبْعَةَ أَشْوَاطْ، ثُمَّ أَصْدَرَ اللهُ أَمْرَهُ العَظِيمَ يَا أَرْضُ ابْلَعِي مَاءَكِ وَيَا سَمَاءُ أَقْلِعِي وَغِيضَ المَاءُ وَقُضِيَ الأَمْرُ وَاسْتَوَتِ السَّفِينَةُ عَلَى جَبَلِ الجُودِيِّ بِسَلَامْ. فَأَرْسَلَ نَبِيُّ اللهِ الغُرَابَ لِيَأْتِيَهُ بِخَبَرِ الأَرْضِ فَانْشَغَلَ بِشَهْوَةِ بَطْنِهِ وَلَمْ يَرْجِعْ، ثُمَّ أَرْسَلَ الحَمَامَةُ البَيْضَاءَ فَأَطَاعَتْ وَعَادَتْ تَحْمِلُ بِمِنْقَارِهَا غُصْنَ زَيْتُونٍ أَخْضَرَ وَفِي رِجْلَيْهَا أَثَرُ الطِّينْ، فَعَرَفَ أَنَّ الأَرْضَ قَدْ ظَهَرَتْ فَدَعَا لِلْحَمَامَةِ بِالبَرَكَةِ وَالأَمَانْ. وَأَوْحَى اللهُ إِلَيْهِ يَا نُوحُ اهْبِطْ بِسَلَامٍ مِنَّا وَبَرَكَاتٍ عَلَيْكَ، فَنَزَلُوا بِقَدَمٍ ثَابِتَةٍ وَطَبَخَ نَبِيُّ اللهِ بِيَدِهِ مَا بَقِيَ مَعَهُمْ مِنْ أَصْنَافِ الحُبُوبِ فِي قِدْرٍ وَاحِدَةٍ فَأَكَلُوا وَحَمِدُوا اللهْ، وَصَنَعَ أَوَانِيَ الفَخَّارِ مِنَ الطِّينِ فَعَلَّمَهُ اللهُ بِهَا حِكْمَةَ الرَّحْمَةِ بِالعِبَادِ وَأَنَّهُ أَرْسَلَهُ رَحْمَةً لِلْمُؤْمِنِينْ. وَبَنَوْا قَرْيَةَ الثَّمَانِينَ وَجَعَلَ اللهُ ذُرِّيَّتَهُ مِنْ أَبْنَائِهِ الثَّلَاثَةِ هُمُ البَاقِينَ فِي الأَرْضِ وَوَعَدَهُ أَلَّا يُغْرِقَ الأَرْضَ بِطُوفَانٍ عَامٍّ بَعْدَهُ أَبَدًا، وَأَبْقَى ثَنَاءَهُ العَطِرَ سَلَامٌ عَلَى نُوحٍ فِي العَالَمِينْ، وَسَلَّمَ الوَصِيَّةَ وَمَوَارِيثَ النُّبُوَّةِ لِابْنِهِ الطَّائِعِ سَامٍ، وَدُفِنَ جَسَدُهُ الطَّاهِرُ فِي النَّجَفِ الأَشْرَفِ بِجِوَارِ أَبِينَا آدَمَ عَلَيْهِمَا السَّلَامْ."
    ],
    "words": [
      {
        "word": "رَحْمَةً",
        "desc": "وسط متصل / ساكن: ـحْـ",
        "raw": "رَحْمَةً (وسط متصل / ساكن: ـحْـ)"
      },
      {
        "word": "الأَلْوَاحْ",
        "desc": "آخر منفصل / ساكن وقفا: حْ",
        "raw": "الأَلْوَاحْ (آخر منفصل / ساكن وقفا: حْ)"
      },
      {
        "word": "حَمَلَ",
        "desc": "أول منفصل / متحرك بالفتح: حَـ",
        "raw": "حَمَلَ (أول منفصل / متحرك بالفتح: حَـ)"
      },
      {
        "word": "الحَمَامَةُ",
        "desc": "أول متصل / متحرك بالفتح: ـحَـ",
        "raw": "الحَمَامَةُ (أول متصل / متحرك بالفتح: ـحَـ)"
      },
      {
        "word": "سَحَرٍ",
        "desc": "وسط متصل / متحرك بالفتح: ـحَـ",
        "raw": "سَحَرٍ (وسط متصل / متحرك بالفتح: ـحَـ)"
      },
      {
        "word": "سَاحَةٍ",
        "desc": "وسط منفصل / متحرك بالفتح: حَـ",
        "raw": "سَاحَةٍ (وسط منفصل / متحرك بالفتح: حَـ)"
      },
      {
        "word": "نَصَحَ",
        "desc": "آخر متصل / متحرك بالفتح: ـحَ",
        "raw": "نَصَحَ (آخر متصل / متحرك بالفتح: ـحَ)"
      },
      {
        "word": "حُبُوبٍ",
        "desc": "أول منفصل / متحرك بالضم: حُـ",
        "raw": "حُبُوبٍ (أول منفصل / متحرك بالضم: حُـ)"
      },
      {
        "word": "نُوحٌ",
        "desc": "آخر منفصل / متحرك بالضم: حٌ",
        "raw": "نُوحٌ (آخر منفصل / متحرك بالضم: حٌ)"
      },
      {
        "word": "حِكْمَةٍ",
        "desc": "أول منفصل / متحرك بالكسر: حِـ",
        "raw": "حِكْمَةٍ (أول منفصل / متحرك بالكسر: حِـ)"
      },
      {
        "word": "نَحَّى",
        "desc": "وسط متصل / مضعف بالفتح: ـحَّـ",
        "raw": "نَحَّى (وسط متصل / مضعف بالفتح: ـحَّـ)"
      },
      {
        "word": "يَشِحُّ",
        "desc": "آخر متصل / مضعف بالضم: ـحُّ",
        "raw": "يَشِحُّ (آخر متصل / مضعف بالضم: ـحُّ)"
      },
      {
        "word": "يُنَحِّي",
        "desc": "وسط متصل / مضعف بالكسر: ـحِّـ",
        "raw": "يُنَحِّي (وسط متصل / مضعف بالكسر: ـحِّـ)"
      },
      {
        "word": "حَامِدًا",
        "desc": "أول منفصل / ممدود بالألف: حَا",
        "raw": "حَامِدًا (أول منفصل / ممدود بالألف: حَا)"
      },
      {
        "word": "بُحُورٍ",
        "desc": "وسط متصل / ممدود بالواو: ـحُو",
        "raw": "بُحُورٍ (وسط متصل / ممدود بالواو: ـحُو)"
      },
      {
        "word": "رَحِيمٌ",
        "desc": "وسط متصل / ممدود بالياء: ـحِي",
        "raw": "رَحِيمٌ (وسط متصل / ممدود بالياء: ـحِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الحَاءِ (ح): النُّطْقُ السَّلِيمُ لِحَرْفِ الحَاءِ الصَّافِي مِنْ مَخْرَجِ وَسَطِ الحَلْقِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الحَمْدِ وَالشُّكْرِ وَدُعَاءِ رُكُوبِ السَّفِينَةِ: ﴿بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا إِنَّ رَبِّي لَغَفُورٌ رَحِيمٌ﴾."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "القَوْسُ المَفْتُوحُ وَالشَّكْلُ الثُّمَانِيُّ (المُثَمَّنُ) وَقَوْسُ السَّمَاءِ: مُشَاهَدَةُ انْحِنَاءِ حَرْفِ الحَاءِ (ح) الخَالِي مِنَ النِّقَاطِ كَجِسْمِ السَّفِينَةِ الَّتِي تَجْرِي فَوْقَ المَوْجِ وَكَقَوْسِ الأَمَانِ فِي السَّمَاءِ، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «الشَّكْلِ الثُّمَانِيِّ» ذِي الأَضْلَاعِ الثَّمَانِيَةِ، وَالتَّفَكُّرُ البَصَرِيُّ فِي السَّمَاوَاتِ السَّبْعِ وَالشَّمْسِ وَالقَمَرِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ شَيْخِ المُرْسَلِينَ وَآدَابُ الاسْتِمَاعِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ قِصَّةِ نُوحٍ (عَلَيْهِ السَّلَامُ) الكَامِلَةِ، وَتَعَلُّمُ فَتْحِ الأُذُنِ لِسَمَاعِ النَّصِيحَةِ وَالحِكْمَةِ، وَالحَذَرُ مِنْ فِعْلِ المُسْتَكْبِرِينَ الَّذِينَ وَضَعُوا أَصَابِعَهُمْ فِي آذَانِهِمْ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ ثَمَانِيَةٌ (8): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (8) وَرَسْمِ حَرْفِ الحَاءِ (ح)، وَإِدْرَاكُ مَفْهُومِ الثَّمَانِيَةِ فِي القِصَّةِ (النَّبِيُّ الثَّامِنُ، اكْتِمَالُ السَّمَاءِ الثَّانِيَةِ بِثَمَانِيَةِ أَنْبِيَاءَ، الأَزْوَاجُ الثَّمَانِيَةُ مِنَ الأَنْعَامِ، الثَّمَانُونَ مُؤْمِنًا فِي السَّفِينَةِ، وَبِنَاءُ «قَرْيَةِ ثَمَانِينَ»)، وَتَدْرِيبُ اليَدِ عَلَى مَهَارَةِ الغَرْسِ، وَالنِّجَارَةِ، وَتَشْكِيلِ الفَخَّارِ مِنَ الطِّينِ، وَتَقْدِيرِ أَصْحَابِ الحِرَفِ وَالصَّنَائِعِ اليَدَوِيَّةِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ التَّوَازُنِ وَصُعُودِ الطَّبَقَاتِ وَالهُبُوطِ الآمِنِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ التَّوَازُنِ البَدَنِيِّ الدَّقِيقِ (كَثَبَاتِ الرُّكَّابِ فِي السَّفِينَةِ ذَاتِ الطَّبَقَاتِ الثَّلَاثِ)، وَرِيَاضَةِ المَشْيِ وَالهُبُوطِ المُتَوَازِنِ مِنَ المُرْتَفَعَاتِ اقْتِدَاءً بِهُبُوطِ نُوحٍ وَالمُؤْمِنِينَ مِنْ جَبَلِ الجُودِيِّ بِسَلَامٍ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الأَخْشَابِ وَالفَخَّارِ وَطَبْخِ الحُبُوبِ: تَعَلُّمُ خَصَائِصِ الأَشْجَارِ وَقَانُونِ طَفْوِ السُّفُنِ فَوْقَ المَاءِ، وَصِنَاعَةِ الأَوَانِي الفَخَّارِيَّةِ لِحِفْظِ الطَّعَامِ وَالمَاءِ، وَالقِيمَةِ الغِذَائِيَّةِ لِـ«طَبَقِ الحُبُوبِ المُبَارَكِ» الَّذِي طَبَخَهُ نُوحٌ بَعْدَ الرُّسُوِّ، وَضَبْطِ شَهْوَةِ البَطْنِ حَتَّى لَا تَشْغَلَ الإِنْسَانَ عَنْ وَاجِبِهِ (كَمَا انْشَغَلَ الغُرَابُ)، وَأَدَبِ حَمْدِ اللهِ عِنْدَ الأَكْلِ وَالشُّرْبِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ نَظَافَةِ المَرْكَبِ وَحِفْظِ الأَسْرَارِ وَمِيزَانِ الصَّلَاحِ: تَعَلُّمُ آدَابِ الاغْتِسَالِ بِالمَاءِ الطَّهُورِ وَنَظَافَةِ المَسْكَنِ وَالمَرْكَبِ، وَشُكْرِ اللهِ عِنْدَ ارْتِدَاءِ الثِّيَابِ السَّاتِرَةِ، وَأَدَبِ حِفْظِ أَسْرَارِ البَيْتِ وَالأَمَانَةِ، وَإِدْرَاكِ أَنَّ الكَرَامَةَ عِنْدَ اللهِ هِيَ بِالتَّقْوَى وَالعَمَلِ الصَّالِحِ لَا بِالغِنَى أَوِ النَّسَبِ وَحْدَهُ."
      }
    },
    "grammar": {
      "topic": "مُطَابَقَةُ المُبْتَدَأِ وَالخَبَرِ لِلمُذَكَّرِ وَالمُؤَنَّثْ",
      "rule": "إِذَا كَانَ المُبْتَدَأُ مُذَكَّرًا جَاءَ الخَبَرُ مُذَكَّرًا، وَإِذَا كَانَ المُبْتَدَأُ مُؤَنَّثًا (بِالتَّاءِ المَرْبُوطَةِ ة) جَاءَ الخَبَرُ مُؤَنَّثًا.",
      "example": "الحِصَانُ سَرِيعٌ (مُذَكَّرٌ) — الحَمَامَةُ وَدِيعَةٌ (مُؤَنَّثٌ).",
      "focusWord": "الحَمَامَةُ وَدِيعَةٌ",
      "q": "اخْتَرِ الخَبَرَ المُنَاسِبَ لِلمُبْتَدَأِ المُؤَنَّثِ: «السَّفِينَةُ ...»:",
      "opts": [
        "كَبِيرَةٌ",
        "كَبِيرٌ",
        "يَسْبَحُ",
        "فِي"
      ]
    },
    "earIirab": {
      "topic": "تَنْوِينُ الضَّمِّ عَلَى التَّاءِ المَرْبُوطَةِ (ـةٌ) وَتَنْوِينُ الفَتْحِ (ـةً)",
      "rule": "التَّاءُ المَرْبُوطَةُ فِي آخِرِ الاِسْمِ المُؤَنَّثِ تُرْفَعُ بـ (ـةٌ) وَتُنْصَبُ بـ (ـةً) دُونَ إِضَافَةِ أَلِفْ.",
      "sentence": "رَكِبَ نُوحٌ سَفِينَةً وَاسِعَةً.",
      "targetWord": "سَفِينَةً",
      "caseAns": "مَنْصُوبٌ بِالفَتْحَةِ (ـً)"
    },
    "math": {
      "numVal": 8,
      "numName": "ثَمَانِيَةٌ",
      "eqDisplay": "4 + 4 = 8",
      "subDisplay": "8 - 3 = 5",
      "compDisplay": "6 < 8",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "4 + 4 = ؟",
        "ans": "8 (ثَمَانِيَةٌ)",
        "wrong": [
          "6 (سِتَّةٌ)",
          "9 (تِسْعَةٌ)",
          "7 (سَبْعَةٌ)"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "8 - 3 = ؟",
        "ans": "5 (خَمْسَةٌ)",
        "wrong": [
          "4 (أَرْبَعَةٌ)",
          "2 (اثْنَانِ)",
          "6 (سِتَّةٌ)"
        ]
      }
    },
    "sport": {
      "title": "خُرْطُومُ الفِيلِ وَاللَّانِهَايَةُ السَّمْعِيَّةُ البَصَرِيَّةُ",
      "middleText": "أُلْصِقُ أُذُنِي بِكَتِفِي وَأَمُدُّ ذِرَاعِي لِلأَمَامِ كَخُرْطُومِ الفِيلِ لِأَرْسُمَ اللَّانِهَايَةَ فِي الهَوَاءْ. يُوَحِّدُ هٰذَا التَّمْرِينُ حَاسَّتَيِ السَّمْعِ وَالبَصَرِ وَيُقَوِّي تَوَازُنَ الجِسْمِ الكَامِلْ."
    },
    "sci": {
      "title": "مُخْتَبَرُ عَالَمِ الحَيَوَانِ: عَازِلُ الدُّهُونِ وَأَصْدَافُ الحِمَايَةِ",
      "summaryThird": "تُثْبِتُ التَّجْرِبَةُ أَنَّ طَبَقَةَ الدُّهُونِ تَحْتَ جِلْدِ الدُّبِّ القُطْبِيِّ وَالحُوتِ تَعْزِلُ البُرُودَةَ الشَّدِيدَةَ، كَمَا تَحْمِي القَوْقَعَةُ الكِلْسِيَّةُ الصُّلْبَةُ جِسْمَ الحَلَزُونِ الطَّرِيّْ.",
      "focusConcept": "طَبَقَةُ الدُّهُونِ وَالفِرَاءُ",
      "factAns": "حِمَايَةُ الحَيَوَانِ مِنْ بَرْدِ الثُّلُوجْ"
    },
    "rightsSummary": {
      "title": "حَقُّ البَطْنِ وَالطَّعَامِ الحَلَالِ (حُور وَسُرُور - 8)",
      "storySentence": "جَلَسَتْ حُورُ وَسُرُورٌ عَلَى المَائِدَةِ وَتَعَلَّمَا أَنَّ حَقَّ البَطْنِ هُوَ تَنَاوُلُ الطَّعَامِ الحَلَالِ الصِّحِّيِّ بِاعْتِدَالٍ، وَالبَدْءُ بِالتَّسْمِيَةِ وَالخَتْمُ بِالحَمْدْ.",
      "applyAction": "أُسَمِّي اللهَ قَبْلَ الأَكْلِ وَلَا أَمْلَأُ مَعِدَتِي إِلَى التُّخْمَةْ."
    },
    "rightsFullTitle": "(8) حق البطن",
    "rightsQuote": "وَأَمَّا حَقُّ بَطْنِكَ فَأَنْ لا تَجْعَلَهُ وِعَاءً لِقَلِيل مِنَ الْحَرَامِ وَلا لِكَثِير، وَأَنْ تَقْتَصِدَ لَهُ فِي الْحَلالِ وَلا تُخرِجَهُ مِنْ حَدِّ التَّقْوِيَةِ إلَى حَدِّ التَّهْوِينِ  وَذَهَاب الْمُرُوَّةِ، وَضَبْطُهُ إذَا هَمَّ بالْجُوعِ والظمأ فَإنَّ الشَّبْعَ الْمُنْتَهِي بصَاحِبهِ إلَى التُّخمِ مَكْسَلَةٌ وَمَثْبَطَةٌ وَمَقْطَعَةٌ عَنْ كُلِّ برِّ وَكَرَم. وَإنَّ الري الْمُنْتَهِي بصَاحِبهِ إلَى السُّكْرِ مَسْخَفَةٌ وَمَجْهَلَةٌ وَمَذْهَبَةٌ لِلْمُرُوَّةِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (8) حق البطن",
        "text": "وَأَمَّا حَقُّ بَطْنِكَ فَأَنْ لا تَجْعَلَهُ وِعَاءً لِقَلِيل مِنَ الْحَرَامِ وَلا لِكَثِير، وَأَنْ تَقْتَصِدَ لَهُ فِي الْحَلالِ وَلا تُخرِجَهُ مِنْ حَدِّ التَّقْوِيَةِ إلَى حَدِّ التَّهْوِينِ  وَذَهَاب الْمُرُوَّةِ، وَضَبْطُهُ إذَا هَمَّ بالْجُوعِ والظمأ فَإنَّ الشَّبْعَ الْمُنْتَهِي بصَاحِبهِ إلَى التُّخمِ مَكْسَلَةٌ وَمَثْبَطَةٌ وَمَقْطَعَةٌ عَنْ كُلِّ برِّ وَكَرَم. وَإنَّ الري الْمُنْتَهِي بصَاحِبهِ إلَى السُّكْرِ مَسْخَفَةٌ وَمَجْهَلَةٌ وَمَذْهَبَةٌ لِلْمُرُوَّةِ. — وَفِي سِيرَةِ نُوحٌ (ع): آدَابُ نَظَافَةِ المَرْكَبِ وَحِفْظِ الأَسْرَارِ وَمِيزَانِ الصَّلَاحِ: تَعَلُّمُ آدَابِ الاغْتِسَالِ بِالمَاءِ الطَّهُورِ وَنَظَافَةِ المَسْكَنِ وَالمَرْكَبِ، وَشُكْرِ اللهِ عِنْدَ ارْتِدَاءِ الثِّيَابِ السَّاتِرَةِ، وَأَدَبِ حِفْظِ أَسْرَارِ البَيْتِ وَالأَمَانَةِ، وَإِدْرَاكِ أَنَّ الكَرَامَةَ عِنْدَ اللهِ هِيَ بِالتَّقْوَى وَالعَمَلِ الصَّالِحِ لَا بِالغِنَى أَوِ النَّسَبِ وَحْدَهُ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق البطن",
        "text": "وصل أحد أقاربنا من السفر حاملًا هدية فاخرة: علبة من الشوكولاتة الأجنبية الراقية. اعتذرت أمي عن أخذها، فنظرنا أنا وإخوتي إليها بحزن، وشعر الضيف بموقفنا، فأصرّ على ترك الهدية. ما إن غادر الضيف حتى هرعنا نطلب من أمي تذوقها، لكنها قالت بحسم: \"هذه الشوكولاتة تحوي مكونات لا يجوز لنا أكلها.\" وأضافت: \"ديننا يمنعنا عن تناول أنواع من المسكرات ودهون الخنزير، وهذه الشوكولاتة تحتوي عليها، فهي أجنبية الصنع.\" حاولنا التوسل إليها لنأخذ \"لقمة واحدة\"، لكنها لم تتراجع. أخذت العلبة وفرّغت محتواها في كيس للتخلص منه لاحقًا. انزعجنا بشدة، ولم نفهم سبب هذا التقييد على شيء بدا شهياً جدًا. لم تتركنا أمي في حزننا طويلاً. صنعت لنا إناءً كبيرًا من سلطة الفواكه الطازجة، فنسينا الشوكولاتة وأقبلنا على الأكل. كان الطعم لذيذًا، لكنني أكلتُ بشراهة غير منضبطة حتى شعرت ببطني منتفخة. لم يمضِ وقت طويل حتى بدأ الألم الحاد. ذهبتُ للنوم وأنا أتلوى، وهمست لنفسي بندم: \"لو أنني لم آكل بعد شبعي شرهاً، لكنتُ استمتعت بالفواكه دون هذا الألم المزعج. حق البطن ليس في أن تملأه حتى يثقل عليك.\" عند موعد الغداء، سيطر عليّ الخوف من تكرار الألم، فرفضتُ الأكل اليوم، وعزمت أن لا آكل حتى الغد. أعلنت بعناد أنني لن آكل شيئًا. أصرّت أمي: \"لا تبالغي في ردة فعلك، الامتناع عن الطعام يضرّك أيضًا!\" لكنني بقيت على رأيي. مرّ الوقت، ولم آكل حتى العشاء. نمتُ، لكنني استيقظت في الليل على جوع شديد ومؤلم. لم أجد طعامًا جاهزًا، وخشيت معاتبة أمي، فشربت الكثير من الماء. ثم تذكرت السكاكر التي خبأتها قد كانت إحدى صديقاتي بالمدرسة اعطتني اياها، فأكلتُ منها بسرعة."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق البطن",
        "text": "زاد الوضع سوءًا: شعرت بالوهن والتعب، وألم جوعي، وبدأت أسناني تؤلمني بسبب السكاكر. لقد آذيت بطني كثيرًا: مرة بالإفراط، ومرة بالتفريط، ومرة برداءة الاختيار. في الصباح، اعترفت لأمي بكل شيء حدث. نظرت إلي بهدوء، وسألت: \"هل تعلّمتِ الدرس الآن؟\" ثم أضافت بتأكيد: \"عندما تأكلين، نظفي أسنانك جيدًا لتتخلصي من آثار السكر.\" دون انتظار جوابي، حضرت لي فطورًا صحيًا: بيضًا، وخضارًا طازجة، وكوبًا من الحليب الدافئ. كنت آكل هذا الفطور البسيط وأشعر كأنه أشهى طعام في العالم. عندما انتهيت، شكرت الله بعمق لأنني أكلت هذه المرة باعتدال، فلم أشعر بأي ألم. قمت لأغسل أسناني، وشعرت براحة كبيرة، وقررت أن ألتزم بالطعام المفيد والكمية المناسبة دائمًا. ابتسمت أمي وقالت لي: \"تذكري يا صغيرتي، حق البطن أن تمنحيه القوة دون أن تسببي له الأذى أو الضعف. وخذي بهذه القاعدة: ثلث لطعامك، وثلث لشرابك، وثلث لنفسك.\" ضحك إخوتي، وأخذت أختي الصغيرة تكرر العبارة وتصفق بيديها فرحًا. لقد فهمنا جميعًا أن حق البطن يكمن في الاعتدال الذي ينفعنا ويحمينا من الألم."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّانِيَةُ: عَالَمُ الحَيَوَانِ",
      "topic": "التَّجْرِبَتَانِ (3 وَ4): عَالَمِي الصَّغِيرُ وَالفَحْصُ المِجْهَرِيُّ — أَغْطِيَةُ الحَيَوَانَاتِ وَحَرَارَتُهَا",
      "coverImg": "assets/y7/scince/s8.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s8.1.jpg",
          "text": "التَّجْرِبَةُ (3) عَالَمِي الصَّغِيرُ وَالفَحْصُ المِجْهَرِيُّ: نَسْتَخْدِمُ العَدَسَةَ المُكَبِّرَةَ وَالمِجْهَرَ وَدَفْتَرَ المُشَاهَدَاتِ لِفَحْصِ الكَائِنَاتِ الصَّغِيرَةِ وَتَصْنِيفِ اللَّافَقَارِيَّاتِ، فَنُلَاحِظُ قُرُونَ الاسْتِشْعَارِ وَالهَيْكَلَ الخَارِجِيَّ الصُّلْبَ وَالأَرْجُلَ المَفْصِلِيَّةَ."
        },
        {
          "img": "assets/y7/scince/s8.2.jpg",
          "text": "التَّجْرِبَةُ (4) أَغْطِيَةُ الحَيَوَانَاتِ وَحَرَارَتُهَا: نُقَارِنُ أَثَرَ العَزْلِ الحَرَارِيِّ بِتَغْلِيفِ أَكْوَابِ المَاءِ الدَّافِئِ بِعَيِّنَاتٍ مِنَ الفَرْوِ وَالرِّيشِ وَقِيَاسِ الحَرَارَةِ بِالمِيزَانِ، فَنَسْتَنْتِجُ أَنَّ الفَرْوَ وَالرِّيشَ يَعْزِلَانِ الحَرَارَةَ وَيَحْفَظَانِ دِفْءَ أَجْسَامِ الثَّدْيِيَّاتِ وَالطُّيُورِ."
        }
      ],
      "text": "التَّجْرِبَةُ (3) عَالَمِي الصَّغِيرُ وَالفَحْصُ المِجْهَرِيُّ: نَسْتَخْدِمُ العَدَسَةَ المُكَبِّرَةَ وَالمِجْهَرَ وَدَفْتَرَ المُشَاهَدَاتِ لِفَحْصِ الكَائِنَاتِ الصَّغِيرَةِ وَتَصْنِيفِ اللَّافَقَارِيَّاتِ، فَنُلَاحِظُ قُرُونَ الاسْتِشْعَارِ وَالهَيْكَلَ الخَارِجِيَّ الصُّلْبَ وَالأَرْجُلَ المَفْصِلِيَّةَ. التَّجْرِبَةُ (4) أَغْطِيَةُ الحَيَوَانَاتِ وَحَرَارَتُهَا: نُقَارِنُ أَثَرَ العَزْلِ الحَرَارِيِّ بِتَغْلِيفِ أَكْوَابِ المَاءِ الدَّافِئِ بِعَيِّنَاتٍ مِنَ الفَرْوِ وَالرِّيشِ وَقِيَاسِ الحَرَارَةِ بِالمِيزَانِ، فَنَسْتَنْتِجُ أَنَّ الفَرْوَ وَالرِّيشَ يَعْزِلَانِ الحَرَارَةَ وَيَحْفَظَانِ دِفْءَ أَجْسَامِ الثَّدْيِيَّاتِ وَالطُّيُورِ.",
      "q1": {
        "q": "مَا الأَدَاةُ الَّتِي نَسْتَخْدِمُهَا فِي تَجْرِبَةِ (عَالَمِي الصَّغِيرُ) لِتَكْبِيرِ وَفَحْصِ قُرُونِ الاسْتِشْعَارِ وَالأَرْجُلِ المَفْصِلِيَّةِ؟",
        "focusWord": "العَدَسَةُ المُكَبِّرَةُ وَالمِجْهَرُ",
        "options": [
          {
            "text": "العَدَسَةُ المُكَبِّرَةُ وَالمِجْهَرُ",
            "correct": true
          },
          {
            "text": "المِيزَانُ الزُّنْبُرُكِيُّ",
            "correct": false
          },
          {
            "text": "البُوصَلَةُ المِغْنَاطِيسِيَّةُ",
            "correct": false
          },
          {
            "text": "القِمْعُ البَلَاسْتِيكِيُّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَاذَا نَسْتَنْتِجُ مِنْ تَجْرِبَةِ تَغْلِيفِ كُوبِ المَاءِ الدَّافِئِ بِالفَرْوِ وَالرِّيشِ؟",
        "focusWord": "العَزْلُ الحَرَارِيُّ",
        "options": [
          {
            "text": "أَنَّ الفَرْوَ وَالرِّيشَ يَعْزِلَانِ الحَرَارَةَ وَيَحْفَظَانِ حَرَارَةَ الجِسْمِ",
            "correct": true
          },
          {
            "text": "أَنَّ الفَرْوَ يُبَرِّدُ المَاءَ فَوْرًا",
            "correct": false
          },
          {
            "text": "أَنَّ الرِّيشَ يُذِيبُ الزُّجَاجَ",
            "correct": false
          },
          {
            "text": "أَنَّ الحَرَارَةَ لَا تُقَاسُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِمَاذَا نَقِيسُ دَرَجَةَ حَرَارَةِ المَاءِ الدَّافِئِ فِي التَّجْرِبَةِ الرَّابِعَةِ؟",
        "focusWord": "مِيزَانُ حَرَارَةٍ",
        "options": [
          {
            "text": "بِمِيزَانِ الحَرَارَةِ (الثِّرْمُومِتْرِ)",
            "correct": true
          },
          {
            "text": "بِالمِسْطَرَةِ الخَشَبِيَّةِ",
            "correct": false
          },
          {
            "text": "بِالسَّمَّاعَةِ الطِّبِّيَّةِ",
            "correct": false
          },
          {
            "text": "بِالمِقَصِّ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "العَدَسَةُ المُكَبِّرَةُ وَالمِجْهَرُ",
          "left": "فَحْصُ الهَيْكَلِ الخَارِجِيِّ وَالأَرْجُلِ المَفْصِلِيَّةِ"
        },
        {
          "right": "الفَرْوُ وَالرِّيشُ",
          "left": "عَزْلٌ حَرَارِيٌّ يَحْفَظُ حَرَارَةَ أَجْسَامِ الثَّدْيِيَّاتِ وَالطُّيُورِ"
        },
        {
          "right": "مِيزَانُ الحَرَارَةِ",
          "left": "قِيَاسُ دَرَجَةِ حَرَارَةِ المَاءِ الدَّافِئِ فِي الأَكْوَابِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَدَوَاتِ وَنَتَائِجَ تَجْرِبَتَيِ الفَحْصِ المِجْهَرِيِّ وَأَغْطِيَةِ الحَيَوَانَاتِ:",
        "correct": [
          "عَدَسَةٌ مُكَبِّرَةٌ وَمِجْهَرٌ",
          "عَيِّنَاتُ فَرْوٍ وَرِيشٍ",
          "مِيزَانُ حَرَارَةٍ",
          "حِفْظُ حَرَارَةِ الجِسْمِ بِالعَزْلِ"
        ],
        "wrong": [
          "أَسْلَاكٌ كَهْرَبَائِيَّةٌ",
          "مِلْحُ الطَّعَامِ"
        ]
      },
      "applyStep": "أَسْتَخْدِمُ العَدَسَةَ المُكَبِّرَةَ لِمُلَاحَظَةِ الحَشَرَاتِ فِي الحَدِيقَةِ دُونَ إِيذَائِهَا وَأُدَوِّنُ صِفَاتِهَا فِي دَفْتَرِي."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt8.jpg",
      "title": "تَمَارِينُ الجُمْبَازِ اليَدَوِيِّ المُتَقَدِّمِ (المَجْمُوعَةُ السَّابِعَةُ: 43..49)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِلْعَزْفِ العَصَبِيِّ لِلْأَصَابِعِ، تَقْوِيَةِ اسْتِقْلَالِيَّةِ نِصْفَيِ الدِّمَاغِ، وَتَهْيِئَةِ مَهَارَاتِ الكِتَابَةِ!",
      "slideText": "🖐️ تَمَارِينُ الجُمْبَازِ اليَدَوِيِّ المُتَقَدِّمِ (المَجْمُوعَةُ السَّابِعَةُ — التَّمَارِينُ 43 إِلَى 49): (43) السَّبَّابَةُ وَالخِنْصِرُ بِالتَّبَادُلِ الفَوْرِيِّ بَيْنَ اليَدَيْنِ. (44) عَلامَةُ النَّصْرِ بِيَدٍ وَالإِعْجَابِ بِاليَدِ الأُخْرَى ثُمَّ عَكْسُهُمَا مَعًا. (45) السُّلَّمُ العَنْكَبُوتِيُّ بِمُلَامَسَةِ إِبْهَامِ يَدٍ لِسَبَّابَةِ الأُخْرَى صُعُودًا. (46) حَلَقَاتُ الأَصَابِعِ المُتَدَاخِلَةُ كَالسِّلْسِلَةِ. (47) الدَّائِرَةُ وَالمُرَبَّعُ (رَسْمُ دَائِرَةٍ بِاليُمْنَى وَمُرَبَّعٍ بِاليُسْرَى فِي نَفْسِ الوَقْتِ). (48) القَرْعُ المُتَفَاوِتُ عَلَى الطَّاوِلَةِ. (49) تَدْوِيرُ المِعْصَمِ الأَيْمَنِ مَعَ الكَاحِلِ الأَيْسَرِ.",
      "q1": {
        "q": "مَا الفَائِدَةُ العِلْمِيَّةُ لِتَمَارِينِ الجُمْبَازِ اليَدَوِيِّ المُتَقَدِّمِ (43..49)؟",
        "focusWord": "الجُمْبَازُ اليَدَوِيُّ المُتَقَدِّمُ",
        "options": [
          {
            "text": "العَزْفُ العَصَبِيُّ لِلْأَصَابِعِ وَتَقْوِيَةُ اسْتِقْلَالِيَّةِ نِصْفَيِ الدِّمَاغِ وَتَهْيِئَةُ مَهَارَاتِ الكِتَابَةِ وَالخَطِّ",
            "correct": true
          },
          {
            "text": "تَقْوِيَةُ عَضَلَاتِ البَطْنِ فَقَطْ",
            "correct": false
          },
          {
            "text": "تَعَلُّمُ السِّبَاحَةِ",
            "correct": false
          },
          {
            "text": "تَبْرِيدُ الجِلْدِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (الدَّائِرَةِ وَالمُرَبَّعِ 47) وَتَمْرِينَ (النَّصْرِ وَالإِعْجَابِ 44)؟",
        "focusWord": "الدَّائِرَةُ وَالمُرَبَّعُ",
        "options": [
          {
            "text": "نَرْسُمُ بِاليُمْنَى دَائِرَةً وَبِاليُسْرَى مُرَبَّعًا فِي نَفْسِ الوَقْتِ، وَنُبَدِّلُ بَيْنَ عَلَامَتَيِ النَّصْرِ وَالإِعْجَابِ",
            "correct": true
          },
          {
            "text": "نَرْسُمُ بِالْقَلَمِ عَلَى الدَّفْتَرِ بِيَدٍ وَاحِدَةٍ",
            "correct": false
          },
          {
            "text": "نُغْلِقُ الكَفَّيْنِ طَوَالَ الوَقْتِ",
            "correct": false
          },
          {
            "text": "نَصْفِقُ بِاليَدَيْنِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَاذَا نُحَرِّكُ مَعًا فِي التَّمْرِينِ رَقْمِ (49: المِعْصَمُ وَالكَاحِلُ)؟",
        "focusWord": "المِعْصَمُ وَالكَاحِلُ",
        "options": [
          {
            "text": "تَدْوِيرُ مِعْصَمِ اليَدِ اليُمْنَى فِي دَوَائِرَ بِالهَوَاءِ بِالتَّزَامُنِ مَعَ تَدْوِيرِ كَاحِلِ القَدَمِ اليُسْرَى",
            "correct": true
          },
          {
            "text": "تَحْرِيكُ الرَّأْسِ فَقَطْ",
            "correct": false
          },
          {
            "text": "ثَنْيُ الرُّكْبَتَيْنِ مَعًا",
            "correct": false
          },
          {
            "text": "إِغْمَاضُ العَيْنَيْنِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "النَّصْرُ وَالإِعْجَابُ (44)",
          "left": "عَلَامَةُ النَّصْرِ بِاليُمْنَى وَالإِبْهَامُ بِاليُسْرَى ثُمَّ عَكْسُهُمَا"
        },
        {
          "right": "السُّلَّمُ العَنْكَبُوتِيُّ (45)",
          "left": "مُلَامَسَةُ إِبْهَامِ يَدٍ بِسَبَّابَةِ الأُخْرَى صُعُودًا كَالعَنْكَبُوتِ"
        },
        {
          "right": "الدَّائِرَةُ وَالمُرَبَّعُ (47)",
          "left": "رَسْمُ دَائِرَةٍ بِاليُمْنَى وَمُرَبَّعٍ بِاليُسْرَى فِي نَفْسِ الوَقْتِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الجُمْبَازِ اليَدَوِيِّ المُتَقَدِّمِ (43..49):",
        "correct": [
          "السَّبَّابَةُ وَالخِنْصِرُ وَالنَّصْرُ وَالإِعْجَابُ",
          "السُّلَّمُ العَنْكَبُوتِيُّ وَحَلَقَاتُ الأَصَابِعِ",
          "الدَّائِرَةُ وَالمُرَبَّعُ فِي الهَوَاءِ",
          "القَرْعُ المُتَفَاوِتُ وَالمِعْصَمُ وَالكَاحِلُ"
        ],
        "wrong": [
          "الشَّدُّ القَوِيُّ عَلَى القَلَمِ",
          "تَشَنُّجُ الأَصَابِعِ"
        ]
      },
      "applyStep": "أُدَرِّبُ أَصَابِعِي عَلَى تَمْرِينِ السُّلَّمِ العَنْكَبُوتِيِّ وَحَلَقَاتِ الأَصَابِعِ قَبْلَ الكِتَابَةِ وَالرَّسْمِ."
    }
  },
  {
    "w": 9,
    "secNum": 3,
    "heavenName": "سَمَاءُ الاثْنَيْنِ الثَّالِثَةُ (ط ي ك ل)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّالِثَةُ: عَالَمُ النَّبَاتِ وَالأَحْيَاءِ الدَّقِيقَةِ وَالمَنَاعَةِ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "ط",
    "jummal": 9,
    "prophet": "لُوطٌ (ع)",
    "virtue": "الطَّهَارَةُ",
    "unitHeader": "الوَحْدَةُ التَّاسِعَةُ : نَبِيُّ اللهِ لُوطٌ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "دَعَا نَبِيُّ اللهِ لُوطٌ (ع) قَوْمَهُ إِلَى الطَّهَارَةِ وَالنَّقَاءِ وَالِابْتِعَادِ عَنِ الفَوَاحِشِ، فَنَجَّى اللهُ لُوطًا وَأَهْلَهُ المُؤْمِنِينَ بِرَحْمَتِهِ لِأَنَّهُمْ أُنَاسٌ يَتَطَهَّرُونْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الدَّافِعَةُ وَالمُوقِدَةُ وَالبَادِئَةُ وَالغَضَبِيَّةُ): شُعْلَةُ المُبَادَرَةِ الإِيمَانِيَّةِ فِي قَلْبِ لُوطٍ (﴿فَآمَنَ لَهُ لُوطٌ﴾) وَحَمِيَّتُهُ الشُّجَاعَةُ فِي حِمَايَةِ ضُيُوفِهِ؛ وَفِي مُقَابِلِهَا نَارُ الشُّحِّ وَالغَضَبِ فِي صُدُورِ أَهْلِ سَدُومَ، وَالنَّارُ الَّتِي أَوْقَدَتْهَا امْرَأَتُهُ الخَائِنَةُ «وَالِعَةُ» فَوْقَ السَّطْحِ، وَنَارُ العَذَابِ الَّتِي طَبَخَتْ حِجَارَةَ السِّجِّيلِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ حِينَ تَمَثَّلَ لَهُمْ إِبْلِيسُ لِيُعَلِّمَهُمْ قَطْعَ السَّبِيلِ، وَدُخَانُ الخِيَانَةِ فِي الهَوَاءِ وَحِيلَةُ طَلَبِ المِلْحِ الكَاذِبَةُ، وَوَهْمُهُمْ أَنَّهُمْ يَغْلِبُونَ ضُيُوفَ لُوطٍ حَتَّى طَمَسَتِ المَلَائِكَةُ أَعْيُنَهُمْ بِنَفْخَةِ جِبْرِيلَ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): زِرَاعَةُ لُوطٍ لِلأَرْضِ بِيَدِهِ، وَحِكْمَتُهُ العَقْلِيَّةُ فِي تَأْخِيرِ دُخُولِ الضُّيُوفِ إِلَى اللَّيْلِ وَاسْتِشْهَادِهمْ أَرْبَعَ مَرَّاتٍ عَلَى قَوْمِهِ، وَطَلَبُهُ «الرُّكْنَ الشَّدِيدَ»، وَاقْتِلَاعُ القُرَى الأَرْبَعِ مِنْ تَخُومِ التُّرَابِ وَقَلْبُهَا وَإِمْطَارُهَا بِحِجَارَةٍ مِنْ طِينٍ (سِجِّيلٍ مَنْضُودٍ) لِتَبْقَى آيَةً عَقْلِيَّةً لِلمُتَوَسِّمِينَ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): طَهَارَةُ آلِ لُوطٍ وَعِفَّتُهُمْ بِالمَاءِ وَالزَّوَاجِ الحَلَالِ (﴿إِنَّهُمْ أُنَاسٌ يَتَطَهَّرُونَ﴾)، وَإِيثَارُهُ الضُّيُوفَ بِأَطْيَبِ الطَّعَامِ، وَتَحَوُّلُ دِيَارِ الفَاسِدِينَ إِلَى البُحَيْرَةِ المَالِحَةِ المَيِّتَةِ (بَحْرِ لُوطٍ).",
    "storyParagraphs": [
      "فِي مَطْلَعِ فَلَكِ يَوْمِ الاثْنَيْنِ الجَمِيلْ، يَأْتِي النَّبِيُّ الرَّقْمُ تِسْعَةٍ فِي مَنْزِلَةِ النَّارِ الدَّافِعَةِ وَالمُوقِدَةِ لِلْحَقِّ وَالغَاضِبَةِ لِلهْ، وَهُوَ نَبِيُّ اللهِ لُوطٌ عَلَيْهِ السَّلَامْ. كَانَ ابْنَ أَخِي إِبْرَاهِيمَ الخَلِيلِ وَأَوَّلَ مَنْ بَادَرَ وَآمَنَ بِدَعْوَتِهِ فِي بَابِلَ وَهَاجَرَ مَعَهُ إِلَى الأَرْضِ المُبَارَكَةْ، فَبَعَثَهُ اللهُ نَبِيًّا إِلَى أَهْلِ سَدُومَ وَقُرَاهَا الأَرْبَعِ الَّتِي كَانَتْ تَقَعُ عَلَى الطَّرِيقِ العَامِّ وَالسَّبِيلِ المُقِيمْ. أَنْعَمَ اللهُ عَلَى أَهْلِ تِلْكَ القُرَى بِبَسَاتِينَ خَضْرَاءَ وَأَنْهَارٍ جَارِيَةٍ وَأَشْجَارٍ تَصْدَحُ فَوْقَهَا أَسْرَابُ طُيُورٍ جَمِيلَةْ، لٰكِنَّهُمْ كَمَا أَخْبَرَنَا أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ بَدَأَ فَسَادُهُمْ حِينَ اشْتَعَلَتْ فِي صُدُورِهِمْ نَارُ الشُّحِّ وَالبُخْلِ فَكَرِهُوا إِطْعَامَ المُسَافِرِينَ العَابِرِينْ. فَجَاءَهُمْ إِبْلِيسُ يَنْفُخُ رِيحَ الوَهْمِ وَالشَّرِّ وَعَلَّمَهُمْ أَنْ يَقْطَعُوا طَرِيقَ المَارَّةِ وَيَسْلُبُوا أَمْوَالَهُمْ، وَاجْتَمَعُوا فِي نَوَادِيهِمْ عَلَى المُنْكَرِ فَكَانُوا يَرْمُونَ العَابِرِينَ بِالحَصَى وَيَسْخَرُونَ مِنْهُمْ بِلَا حَيَاءٍ وَتَرَكُوا النَّظَافَةَ وَالتَّطَهُّرَ بِالمَاءْ، وَخَالَفُوا مَا خَلَقَ اللهُ الإِنْسَانَ عَلَيْهِ مِنْ فِطْرَةٍ سَلِيمَةٍ وَزَوَاجٍ حَلَالْ.",
      "عَاشَ نَبِيُّ اللهِ بَيْنَهُمْ ثَلَاثِينَ سَنَةً طَاهِرًا عَفِيفًا يَزْرَعُ الحَقْلَ بِيَدِهِ وَيَحْصُدُ القَمْحَ وَالشَّعِيرَ لِيُطْعِمَ كُلَّ ضَيْفٍ يَحُطُّ رَحْلَهُ فِي دَارِهِ الكَرِيمَةْ، وَكَانَ يُعَطِّرُ مَنْزِلَهُ وَثِيَابَهُ بِالمَاءِ وَالنَّظَافَةِ وَأَطْيَبِ رَائِحَةٍ مِنْ عُطُورٍ طَبِيعِيَّةٍ زَكِيَّةْ. وَوَقَفَ يَنْصَحُ قَوْمَهُ بِالحِكْمَةِ وَالعَقْلِ قَائِلًا يَا قَوْمِ اتَّقُوا اللهَ وَلَا تَقْطَعُوا السَّبِيلَ وَلَا تَأْتُوا فِي نَادِيكُمُ المُنْكَرَ وَاسْلُكُوا الصِّرَاطْ المُسْتَقِيمَ فَإِنِّي لَا أَسْأَلُكُمْ عَلَيْهِ أَجْرًا إِنْ أَجْرِيَ إِلَّا عَلَى رَبِّ العَالَمِينْ. فَاشْتَعَلَتْ فِي قُلُوبِهِمْ نَارُ الغَضَبِ وَالعِنَادِ وَسَخِرُوا مِنْ نَظَافَتِهِ وَطَهَارَةِ أَهْلِهِ قَائِلِينَ أَخْرِجُوا آلَ لُوطٍ مِنْ قَرْيَتِكُمْ إِنَّهُمْ أُنَاسٌ يَتَطَهَّرُونْ، وَتَحَدَّوْهُ بِغُرُورِهِمْ أَنْ يَأْتِيَهُمْ بِعَذَابِ اللهِ إِنْ كَانَ مِنَ الصَّادِقِينْ. فَدَعَا نَبِيُّ اللهِ رَبَّهُ قَائِلًا رَبِّ انْصُرْنِي عَلَى القَوْمِ المُفْسِدِينْ، وَنَجِّنِي وَأَهْلِي مِمَّا يَعْمَلُونْ.",
      "فَاسْتَجَابَ اللهُ دُعَاءَهُ وَهَبَطَ المَلَائِكَةُ جِبْرِيلُ وَمِيكَائِيلُ وَإِسْرَافِيلُ مِنَ السَّمَاءِ فِي صُورَةِ شُبَّانٍ ضُيُوفٍ حِسَانِ الوُجُوهْ، وَمَرُّوا أَوَّلًا عَلَى إِبْرَاهِيمَ الخَلِيلِ فَبَشَّرُوهُ بِإِسْحَاقَ وَأَخْبَرُوهُ بِأَمْرِ قَوْمِ لُوطٍ ثُمَّ سَارُوا إِلَى سَدُومْ. وَكَانَ اللهُ قَدْ أَمَرَ المَلَائِكَةَ أَلَّا يُعَذِّبُوا القَوْمَ حَتَّى يَشْهَدَ عَلَيْهِمْ نَبِيُّهُمْ أَرْبَعَ شَهَادَاتْ، فَلَمَّا وَصَلَ الضُّيُوفُ إِلَى مَزْرَعَةِ لُوطٍ رَحَّبَ بِهِمْ وَأَبْطَأَ بِهِمُ المَشْيَ بِحِكْمَةِ عَقْلِهِ حَتَّى يَدْخُلُوا دَارَهُ فِي ظَلَامِ اللَّيْلِ فَلَا يَرَاهُمُ المُفْسِدُونْ، وَشَهِدَ أَمَامَهُمْ فِي الطَّرِيقِ أَرْبَعَ مَرَّاتٍ بِشَرِّ أَهْلِ هٰذِهِ القَرْيَةِ وَخُبْثِ أَعْمَالِهِمْ. وَلَمَّا دَخَلُوا الدَّارَ آثَرَهُمْ نَبِيُّ اللهِ بِأَطْيَبِ الدَّقِيقِ وَاللَّحْمِ وَلَمْ يَكُنْ عِنْدَ عِيَالِهِ إِلَّا قَلِيلٌ مِنْ خُبْزِ الشَّعِيرْ، لٰكِنَّ امْرَأَةَ لُوطٍ وَاسْمُهَا وَالِعَةُ خَانَتْ أَمَانَةَ بَيْتِهَا بِالنِّفَاقْ، فَخَرَجَتْ إِلَى الجِيرَانِ تَطْلُبُ المِلْحَ حِيلَةً وَأَخْبَرَتْهُمْ سِرًّا بِوُجُودِ الضُّيُوفْ، ثُمَّ صَعِدَتْ إِلَى السَّطْحِ وَأَوْقَدَتْ نَارًا فِي اللَّيْلِ لِتَجْمَعَ الأَشْرَارْ.",
      "فَجَاءَ قَوْمُهُ يُهْرَعُونَ إِلَى بَابِهِ مُسْرِعِينَ بِالغَضَبِ وَالعدْوَانْ، فَأَغْلَقَ نَبِيُّ اللهِ البَابَ وَوَقَفَ خَلْفَهُ بِشَجَاعَةٍ يَحْمِي ضُيُوفَهُ وَيَقُولُ يَا قَوْمِ اتَّقُوا اللهَ وَلَا تُخْزُونِ فِي ضَيْفِي أَلَيْسَ مِنْكُمْ رَجُلٌ رَشِيدٌ عَاقِلٌ يَعِيشُ فِي زَوَاجٍ حَلَالٍ هُوَ أَطْهَرُ لَكُمْ عِنْدَ اللهْ. وَلَمَّا حَاوَلُوا كَسْرَ البَابِ ضَاقَ صَدْرُهُ وَقَالَ لَوْ أَنَّ لِي بِكُمْ قُوَّةً أَوْ آوِي إِلَى رُكْنٍ شَدِيدْ، وَقَدْ بَيَّنَ أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ أَنَّ القُوَّةَ هِيَ قُوَّةُ القَائِمِ بِالحَقِّ وَالرُّكْنَ الشَّدِيدَ هُمْ أَنْصَارُهُ الشُّجْعَانْ، وَمِنْ بَعْدِ لُوطٍ مَا بَعَثَ اللهُ نَبِيًّا إِلَّا فِي عَشِيرَةٍ قَوِيَّةٍ تَحْمِيهْ. حِينَئِذٍ قَالَتِ المَلَائِكَةُ يَا لُوطُ إِنَّا رُسُلُ رَبِّكَ لَنْ يَصِلُوا إِلَيْكْ، وَخَرَجَ جِبْرِيلُ فَضَرَبَ وُجُوهَ المُعْتَدِينَ بِجَنَاحِهِ فَطَمَسَ اللهُ أَعْيُنَهُمْ فَعَمُوا فِي الحَالِ وَصَارُوا يَتَخَبَّطُونَ عَلَى الجُدْرَانْ.",
      "أَمَرَتِ المَلَائِكَةُ نَبِيَّ اللهِ أَنْ يَسْرِيَ مَعَ أَهْلِهِ وَبَنَاتِهِ المُؤْمِنَاتِ فِي آخِرِ اللَّيْلْ، وَأَنْ يَمْشِيَ هُوَ خَلْفَهُمْ وَيَتَّبِعَ أَدْبَارَهُمْ لِيَحْرُسَهُمْ فِي المَسِيرْ، وَلَا يَلْتَفِتَ مِنْهُمْ أَحَدٌ إِلَى الوَرَاءِ إِلَّا امْرَأَتَهُ الخَائِنَةَ فَإِنَّهُ مُصِيبُهَا مَا أَصَابَ القَوْمَ الظَّالِمِينْ. وَعِنْدَ طُلُوعِ الصُّبْحِ أَدْخَلَ جِبْرِيلُ جَنَاحَهُ تَحْتَ قُرَاهُمُ الأَرْبَعِ المُؤْتَفِكَاتِ مِنْ أَعْمَاقِ الأَرْضِ وَرَفَعَهَا إِلَى السَّمَاءِ حَتَّى سَمِعَتِ المَلَائِكَةُ صِيَاحَ دِيَكَتِهِمْ، ثُمَّ قَلَبَهَا فَجَعَلَ عَالِيَهَا سَافِلَهَا، فَلَمَّا سَمِعَتِ امْرَأَةُ لُوطٍ صَوْتَ الهَدَّةِ التَفَتَتْ إِلَى الوَرَاءِ تَبْكِي عَلَى قَوْمِهَا الأَشْرَارِ فَأَصَابَهَا العَذَابُ مَعَهُمْ. وَأَرْسَلَ اللهُ عَلَيْهِمْ وَعَلَى كُلِّ مُسَافِرٍ مِنْهُمْ مَطَرًا عَجِيبًا مِنْ حِجَارَةٍ مِنْ طِينٍ مَطْبُوخٍ بِالنَّارِ هُوَ السِّجِّيلُ المَنْضُودُ المُسَوَّمُ عِنْدَ رَبِّكَ لِلمُسْرِفِينْ، الَّذِي حَطَّمَ دِيَارَ الظُّلْمِ وَحَوَّلَ مَكَانَهَا إِلَى بُحَيْرَةٍ مَالِحَةٍ مَيِّتَةٍ لِتَكُونَ آيَةً وَعِبْرَةً لِلمُتَوَسِّمِينَ العُقَلَاءِ فِي كُلِّ وَطَنٍ وَمَكَانْ. وَنَجَّى اللهُ لُوطًا وَبَنَاتِهِ الطَّاهِرَاتِ إِلَى الأَرْضِ المُبَارَكَةِ عِنْدَ عَمِّهِ إِبْرَاهِيمَ الخَلِيلْ، وَآتَاهُ حُكْمًا وَعِلْمًا وَأَدْخَلَهُ فِي رَحْمَتِهِ لِأَنَّهُ مِنَ الصَّالِحِينَ وَاللهُ قَوِيٌّ عَزِيزٌ لَطِيفٌ بِعِبَادِهِ المُتَطَهِّرِينْ."
    ],
    "words": [
      {
        "word": "فِطْرَةٍ",
        "desc": "وسط متصل / ساكن: ـطْـ",
        "raw": "فِطْرَةٍ (وسط متصل / ساكن: ـطْـ)"
      },
      {
        "word": "الصِّرَاطْ",
        "desc": "آخر منفصل / ساكن وقفا: طْ",
        "raw": "الصِّرَاطْ (آخر منفصل / ساكن وقفا: طْ)"
      },
      {
        "word": "طَرِيقَ",
        "desc": "أول منفصل / متحرك بالفتح: طَـ",
        "raw": "طَرِيقَ (أول منفصل / متحرك بالفتح: طَـ)"
      },
      {
        "word": "فَطَمَسَ",
        "desc": "أول متصل / متحرك بالفتح: ـطَـ",
        "raw": "فَطَمَسَ (أول متصل / متحرك بالفتح: ـطَـ)"
      },
      {
        "word": "مَطَرًا",
        "desc": "وسط متصل / متحرك بالفتح: ـطَـ",
        "raw": "مَطَرًا (وسط متصل / متحرك بالفتح: ـطَـ)"
      },
      {
        "word": "وَطَنٍ",
        "desc": "وسط منفصل / متحرك بالفتح: طَـ",
        "raw": "وَطَنٍ (وسط منفصل / متحرك بالفتح: طَـ)"
      },
      {
        "word": "هَبَطَ",
        "desc": "آخر متصل / متحرك بالفتح: ـطَ",
        "raw": "هَبَطَ (آخر متصل / متحرك بالفتح: ـطَ)"
      },
      {
        "word": "طُيُورٍ",
        "desc": "أول منفصل / متحرك بالضم: طُـ",
        "raw": "طُيُورٍ (أول منفصل / متحرك بالضم: طُـ)"
      },
      {
        "word": "لُوطٌ",
        "desc": "آخر منفصل / متحرك بالضم: طٌ",
        "raw": "لُوطٌ (آخر منفصل / متحرك بالضم: طٌ)"
      },
      {
        "word": "طِينٍ",
        "desc": "أول منفصل / متحرك بالكسر: طِـ",
        "raw": "طِينٍ (أول منفصل / متحرك بالكسر: طِـ)"
      },
      {
        "word": "حَطَّمَ",
        "desc": "وسط متصل / مضعف بالفتح: ـطَّـ",
        "raw": "حَطَّمَ (وسط متصل / مضعف بالفتح: ـطَّـ)"
      },
      {
        "word": "يَحُطُّ",
        "desc": "آخر متصل / مضعف بالضم: ـطُّ",
        "raw": "يَحُطُّ (آخر متصل / مضعف بالضم: ـطُّ)"
      },
      {
        "word": "يُعَطِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـطِّـ",
        "raw": "يُعَطِّرُ (وسط متصل / مضعف بالكسر: ـطِّـ)"
      },
      {
        "word": "طَاهِرًا",
        "desc": "أول منفصل / ممدود بالألف: طَا",
        "raw": "طَاهِرًا (أول منفصل / ممدود بالألف: طَا)"
      },
      {
        "word": "عُطُورٍ",
        "desc": "وسط متصل / ممدود بالواو: ـطُو",
        "raw": "عُطُورٍ (وسط متصل / ممدود بالواو: ـطُو)"
      },
      {
        "word": "لَطِيفٌ",
        "desc": "وسط متصل / ممدود بالياء: ـطِي",
        "raw": "لَطِيفٌ (وسط متصل / ممدود بالياء: ـطِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الطَّاءِ (ط): النُّطْقُ السَّلِيمُ لِحَرْفِ الطَّاءِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ أُصُولِ الثَّنَايَا العُلْيَا مَعَ إِطْبَاقِ اللِّسَانِ وَاسْتِعْلَائِهِ (أَقْوَى الحُرُوفِ العَرَبِيَّةِ كَالرُّكْنِ الشَّدِيدِ)، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى التَّرْحِيبِ بِالضَّيْفِ وَصَوْنِهِ عَنِ السُّخْرِيَةِ وَالبُهْتَانِ وَإِفْشَاءِ أَسْرَارِ البُيُوتِ."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الحَلْقَةُ المُحَصَّنَةُ وَالعَمُودُ القَائِمُ وَالشَّكْلُ التُّسَاعِيُّ: مُشَاهَدَةُ اجْتِمَاعِ الحَلْقَةِ المُغْلَقَةِ مَعَ الأَلِفِ العَمُودِيِّ الشَّامِخِ فِي حَرْفِ الطَّاءِ (ط) كَالحِصْنِ المَنِيعِ وَالرُّكْنِ الشَّدِيدِ، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «الشَّكْلِ التُّسَاعِيِّ» ذِي الأَضْلَاعِ التِّسْعَةِ، وَفَهْمُ مَعْنَى ﴿لِلْمُتَوَسِّمِينَ﴾ أَيْ أَصْحَابِ البَصِيرَةِ وَالنَّظَرِ العَاقِلِ، مَعَ تَعَلُّمِ غَضِّ البَصَرِ وَعَدَمِ الِالتِفَاتِ إِلَى البَاطِلِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ لُوطٍ الكَامِلَةُ وَطَهَارَةُ المَسْمَعِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ لُوطٍ، وَتَعَلُّمُ تَنْزِيهِ الأُذُنِ عَنْ سَمَاعِ المُنْكَرِ وَالهُزْءِ فِي المَجَالِسِ، وَالامْتِثَالِ السَّمْعِيِّ لِأَمْرِ اللهِ بِالمَسِيرِ دُونَ الِالتِفَاتِ إِلَى أَصْوَاتِ الهَالِكِينَ (كَمَا التَفَتَتِ امْرَأَتُهُ عِنْدَ سَمَاعِ الهَدَّةِ)، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ تِسْعَةٌ (9): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (9) وَرَسْمِ حَرْفِ الطَّاءِ (ط)، وَإِدْرَاكُ مَفْهُومِ التِّسْعَةِ (النَّبِيُّ التَّاسِعُ، وَقِيمَةُ الطَّاءِ فِي حِسَابِ الجُمَّلِ = 9، وَتَمَامُ مَرَاتِبِ الآحَادِ)، وَتَدْرِيبُ اليَدِ عَلَى الزِّرَاعَةِ، وَإِكْرَامِ الضَّيْفِ، وَإِحْكَامِ إِغْلَاقِ البَابِ لِلْحِمَايَةِ، وَكَفِّ اليَدِ عَنْ خَذْفِ الحَصَى وَإِيذَاءِ المَارَّةِ فِي الطُّرُقَاتِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ المَسِيرِ المُنْتَظِمِ وَتَثْبِيتِ الاتِّجَاهِ لِلأَمَامِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ المَشْيِ الهَادِئِ ثُمَّ السَّرِيعِ فِي صَفٍّ مُنْتَظِمٍ (كَمَسِيرِ لُوطٍ خَلْفَ أَهْلِهِ لِحِمَايَتِهِمْ: ﴿وَاتَّبِعْ أَدْبَارَهُمْ﴾)، مَعَ تَمْرِينِ الجَرْيِ وَالمَشْيِ إِلَى الأَمَامِ بِرَأْسٍ ثَابِتٍ دُونَ التِفَاتٍ إِلَى الوَرَاءِ (﴿وَلَا يَلْتَفِتْ مِنْكُمْ أَحَدٌ﴾)، وَاحْتِرَامِ آدَابِ الطَّرِيقِ العَامِّ (السَّبِيلِ المُقِيمِ)."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الزِّرَاعَةِ وَالمِلْحِ وَالحِجَارَةِ الطِّينِيَّةِ (السِّجِّيلِ): تَعَلُّمُ كَيْفَ يَتَحَوَّلُ الطِّينُ المَعْجُونُ بِالمَاءِ إِذَا طُبِخَ بِالنَّارِ إِلَى حَجَرٍ صُلْبٍ (فَخَّارٍ وَسِجِّيلٍ)، وَمَعْرِفَةِ خَصَائِصِ المِلْحِ فِي الطَّعَامِ وَالفَرْقِ العِلْمِيِّ بَيْنَ المَاءِ العَذْبِ وَالمَاءِ الشَّدِيدِ المُلُوحَةِ فِي البَحْرِ المَيِّتِ، وَفَضِيلَةِ الإِيثَارِ وَالكَرَمِ فِي إِطْعَامِ الضُّيُوفِ وَالمُسَافِرِينَ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "وسَامُ الطَّهَارَةِ (﴿إِنَّهُمْ أُنَاسٌ يَتَطَهَّرُونَ﴾) وَأَدَبُ المَجَالِسِ: تَعَلُّمُ آدَابِ الاسْتِنْجَاءِ وَالتَّطَهُّرِ التَّامِّ بِالمَاءِ بَعْدَ قَضَاءِ الحَاجَةِ، وَحِفْظِ الفِطْرَةِ السَّلِيمَةِ وَالعِفَّةِ وَالحَيَاءِ، وَالتَّأَدُّبِ فِي المَجَالِسِ وَالنَّوَادِي بِالسَّتْرِ وَالوَقَارِ، وَحِفْظِ أَمَانَةِ البَيْتِ وَالجِوَارِ."
      }
    },
    "grammar": {
      "topic": "بِنَاءُ جُمْلَةٍ اسْمِيَّةٍ تَامَّةٍ بِوَصْفٍ جَمِيلْ",
      "rule": "نَسْتَطِيعُ إِضَافَةَ صِفَةٍ بَعْدَ الخَبَرِ لِتَزْدَادَ الجُمْلَةُ الاِسْمِيَّةُ وُضُوحًا وَجَمَالًا.",
      "example": "الطَّعَامُ طَيِّبٌ نَافِعٌ — المَطَرُ مَاءٌ طَهُورٌ.",
      "focusWord": "المَطَرُ مَاءٌ طَهُورٌ",
      "q": "مَا هُوَ إِعْرَابُ كَلِمَةِ «الطَّالِبُ» فِي جُمْلَةِ «الطَّالِبُ نَظِيفٌ»؟",
      "opts": [
        "مُبْتَدَأٌ مَرْفُوعٌ",
        "فِعْلٌ مَاضٍ",
        "حَرْفُ جَرٍّ",
        "اسْمٌ مَجْرُورٌ"
      ]
    },
    "earIirab": {
      "topic": "تَمْيِيزُ الضَّمَّتَيْنِ (ـٌ) وَالكَسْرَتَيْنِ (ـٍ) بِالسَّمْعْ",
      "rule": "نَسْمَعُ تَنْوِينَ الضَّمِّ (ـٌ) فِي الخَبَرِ المَرْفُوعِ، وَتَنْوِينَ الكَسْرِ (ـٍ) فِي الاِسْمِ المَجْرُورْ.",
      "sentence": "الطَّائِرُ فَوْقَ غُصْنٍ أَخْضَرَ.",
      "targetWord": "غُصْنٍ",
      "caseAns": "مَجْرُورٌ بِالكَسْرَةِ (ـٍ)"
    },
    "math": {
      "numVal": 9,
      "numName": "تِسْعَةٌ",
      "eqDisplay": "4 + 5 = 9",
      "subDisplay": "9 - 4 = 5",
      "compDisplay": "9 > 8",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "4 + 5 = ؟",
        "ans": "9 (تِسْعَةٌ)",
        "wrong": [
          "7 (سَبْعَةٌ)",
          "8 (ثَمَانِيَةٌ)",
          "10 (عَشَرَةٌ)"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "9 - 4 = ؟",
        "ans": "5 (خَمْسَةٌ)",
        "wrong": [
          "4 (أَرْبَعَةٌ)",
          "6 (سِتَّةٌ)",
          "3 (ثَلَاثَةٌ)"
        ]
      }
    },
    "sport": {
      "title": "تَتَبُّعُ البِنْدُولِ بِالعَيْنَيْنِ مَعَ ثَبَاتِ الرَّأْسِ",
      "middleText": "أُثَبِّتُ رَأْسِي تَمَامًا وَأَتَتَبَّعُ بِعَيْنَيَّ حَرَكَةَ كُرَةٍ أَوْ قَلَمٍ يَتَحَرَّكُ يَمِينًا وَيَسَارًا بِهُدُوءْ. يَمْنَحُ هٰذَا التَّمْرِينُ العَيْنَيْنِ قُوَّةَ التَّثْبِيتِ البَصَرِيِّ وَيُهَدِّئُ الذِّهْنْ."
    },
    "sci": {
      "title": "عَالَمُ النَّبَاتِ وَالبِنَاءُ الضَّوْئِيُّ",
      "summaryThird": "يَمْتَصُّ النَّبَاتُ المَاءَ بِجُذُورِهِ وَيَرْفَعُهُ عَبْرَ السَّاقِ إِلَى الأَوْرَاقِ الخَضْرَاءِ، فَتَصْنَعُ الغِذَاءَ بِضَوْءِ الشَّمْسِ وَتُطْلِقُ الأُكْسِجِينَ النَّقِيَّ لِنَتَنَفَّسَهْ.",
      "focusConcept": "الأَوْرَاقُ الخَضْرَاءُ",
      "factAns": "صُنْعُ الغِذَاءِ بِضَوْءِ الشَّمْسِ وَإِطْلَاقُ الأُكْسِجِينْ"
    },
    "rightsSummary": {
      "title": "حَقُّ العِفَّةِ وَالطَّهَارَةِ (حُور وَسُرُور - 9)",
      "storySentence": "تَعَلَّمَ سُرُورٌ وَحُورُ أَنَّ الطَّهَارَةَ وَالحَيَاءَ وَسِتْرَ البَدَنِ بِالثِّيَابِ النَّظِيفَةِ المُحْتَشِمَةِ شُعْبَةٌ مِنْ شُعَبِ الإِيمَانِ تَحْفَظُ كَرَامَةَ الإِنْسَانْ.",
      "applyAction": "أَحْرِصُ عَلَى طَهَارَةِ بَدَنِي وَثِيَابِي وَأَتَحَلَّى بِالحَيَاءِ وَالأَدَبْ."
    },
    "rightsFullTitle": "(9) حق الفرج",
    "rightsQuote": "وَأَمَّا حَـقُّ فَرْجِكَ فَحِفْظُهُ مِمَّا لا يَحِلُّ لَكَ وَالاسْتِعَانَةُ عَلَيْهِ بغَضِّ الْبَصَرِ – فَإنَّهُ مِنْ أَعْوَنِ الأَعْوَانِ- وَكَثْرَةُ ذِكْرِ الْمَوتِ وَالتَّهَدُّدِ لِنَفْسِكَ باللهِ وَالتَّخوِيفِ لَهَا بهِ، وَباللهِ الْعِصْمَةُ وَالتَّأْيِيدُ وَلا حَوْلَ وَلا قُوَّةَ إلا بهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (9) حق الفرج",
        "text": "وَأَمَّا حَـقُّ فَرْجِكَ فَحِفْظُهُ مِمَّا لا يَحِلُّ لَكَ وَالاسْتِعَانَةُ عَلَيْهِ بغَضِّ الْبَصَرِ – فَإنَّهُ مِنْ أَعْوَنِ الأَعْوَانِ- وَكَثْرَةُ ذِكْرِ الْمَوتِ وَالتَّهَدُّدِ لِنَفْسِكَ باللهِ وَالتَّخوِيفِ لَهَا بهِ، وَباللهِ الْعِصْمَةُ وَالتَّأْيِيدُ وَلا حَوْلَ وَلا قُوَّةَ إلا بهِ. — وَفِي سِيرَةِ لُوطٌ (ع): وسَامُ الطَّهَارَةِ (﴿إِنَّهُمْ أُنَاسٌ يَتَطَهَّرُونَ﴾) وَأَدَبُ المَجَالِسِ: تَعَلُّمُ آدَابِ الاسْتِنْجَاءِ وَالتَّطَهُّرِ التَّامِّ بِالمَاءِ بَعْدَ قَضَاءِ الحَاجَةِ، وَحِفْظِ الفِطْرَةِ السَّلِيمَةِ وَالعِفَّةِ وَالحَيَاءِ، وَالتَّأَدُّبِ فِي المَجَالِسِ وَالنَّوَادِي بِالسَّتْرِ وَالوَقَارِ، وَحِفْظِ أَمَانَةِ البَيْتِ وَالجِوَارِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الفرج",
        "text": "سمعت حور يومًا بعض صديقاتها يتحدثن بحماس عن أنهم يحبون أصدقاء من الذكور. توقفت حور وصديقتها البريئة بدهشة وقالتا: \"لكننا ما زلنا صغارًا، ما معنى هذا؟\" عادت حور إلى المنزل وفي ذهنها علامات استفهام. جلست قرب أمها وقالت: \"أمي، البنات في المدرسة يقولون إنهم يحبون الأولاد. و يدعون انهم يريدون الزواج اليس هذا فظيع؟\" ابتسمت الأم وقالت بلطف: \"يا حبيبتي، ليس من الخطأ أن يميل الفتيان للفتيات والفتيات للفتيان، فهذا شعور طبيعي خلقه الله فينا لاستمرار الحياة. لكن كل شيء له وقته المناسب. الأطفال والصغار قبل أن يصبحوا شبابًا لا يستطيعون خدمة أنفسهم بشكل كامل، فكيف لهم أن يبنوا عائلة؟ لهذا وضع الله لنا ضابطًا لشعورنا، ليحمينا من التهور والاستعجال.\" قالت حور: \"أجل يا أمي، هذا صحيح. لقد شعرت أن صديقاتي أخطأن في كلامهن. فهن حتى في درس الإملاء لم يتقنّ بعد، فكيف لهن أن يكون لهن عائلة؟\" ضحكت الأم وقالت: \"صحيح يا صغيرتي. وهناك أمر آخر، أجسامكم تحتاج أن تنمو بهدوء حتى تثمر وتستعد للحياة فالفتيات و الفتيان يحتاجون اجسام قوية ناضجة تستطيع العمل و تحمل المشقة و الحماية للشبان و الحمل و الرعاية للصغار للشابات و لا ننسى نضج التفكير حتى يبنو اطفال متزنين.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الفرج",
        "text": "تدخل أخوها الصغير قائلاً: \"أمي، أليس من أفضل الحلول لمن لا يستطيع الزواج أن يغض بصره ولا ينظر لما لا يستطيع فعله؟\" ابتسمت الأم وقالت: \"أحسنت يا صغيري. نعم هذا يشمل كل جوانب الحياة. إن العفاف حصن جميل نحمي به جسدنا ونفوسنا وأرواحنا حتى يحين الوقت المناسب لنستخدمها في الخير. فلا ننظر، ولا نقول، ولا نلمس، ولا نسمح لأحد أن يتجاوز حدود الاحترام معنا، حتى لا نفقد توازننا.\" رفعت حور رأسها وقالت: \"أمي، لكنك أنت أيضًا تحافظين على عفافك مع أنك متزوجة!\" ضحكت الأم بحنان وقالت: \"بالطبع يا صغيرتي، هذا الحصن ليس للصغار فقط. هو للصغير ليكبر سليمًا، وللكبير ليبني عائلة جميلة متزنة ويحافظ عليها.\" ثم أضافت الأم بنبرة هادئة: \"نحن جميعًا في النهاية سنقف أمام الله ونحاسب. فلنكن كما أحب الله لنا أن نكون: ناجحين في امتحان الحياة، محافظين على أنفسنا، وحافظين على غيرنا من الأذى.\" ابتسمت حور وأخوها نور وقالا معًا: \"سنحافظ على حصننا يا أمي!\" حقوق الأفعال"
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّالِثَةُ: النَّبَاتُ وَالأَحْيَاءُ الدَّقِيقَةُ",
      "topic": "الدَّرْسَانِ (1 وَ2): عَالَمُ النَّبَاتِ — عَالَمُ الفِطْرِيَّاتِ",
      "coverImg": "assets/y7/scince/s9.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s9.1.jpg",
          "text": "الدَّرْسُ (1) عَالَمُ النَّبَاتِ: أَجْزَاؤُهُ جُذُورٌ وَسَاقٌ وَأَوْرَاقٌ وَأَزْهَارٌ، وَعَنَاصِرُ نُمُوِّهِ شَمْسٌ وَمَاءٌ وَهَوَاءٌ وَتُرْبَةٌ. يُصَنَّفُ إِلَى لَاوِعَائِيَّةٍ (حَزَازِيَّاتٍ)، وَوِعَائِيَّةٍ لَابَذْرِيَّةٍ (سَرْخَسِيَّاتٍ)، وَمُعَرَّاةِ البُذُورِ (الصَّنَوْبَرِ)، وَمُغَطَّاةِ البُذُورِ (فِلْقَةٍ وَفِلْقَتَيْنِ)، وَيَصْنَعُ غِذَاءَهُ بِالبِنَاءِ الضَّوْئِيِّ وَيُطْلِقُ الأُكْسِجِينَ."
        },
        {
          "img": "assets/y7/scince/s9.2.jpg",
          "text": "الدَّرْسُ (2) الفِطْرِيَّاتُ: تَتَكَوَّنُ مِنْ قُبَّعَةٍ وَخَيَاشِيمَ وَسَاقٍ وَغَزْلٍ فِطْرِيٍّ، وَتَتَكَاثَرُ بِالأَبْوَاءِ (كَـعَفَنِ الخُبْزِ) أَوِ التَّبَرْعُمِ (كَالخَمِيرَةِ). مِنْهَا غِذَائِيَّةٌ (عِيشُ الغُرَابِ، الكَمْأَةُ)، وَنَافِعَةٌ (الخَمِيرَةُ لِلْخُبْزِ، وَالبِنْسِلْيُومُ لِصِنَاعَةِ دَوَاءِ البِنْسِلِينِ)، وَضَارَّةٌ تُسَبِّبُ تَعَفُّنَ الأَغْذِيَةِ."
        }
      ],
      "text": "الدَّرْسُ (1) عَالَمُ النَّبَاتِ: أَجْزَاؤُهُ جُذُورٌ وَسَاقٌ وَأَوْرَاقٌ وَأَزْهَارٌ، وَعَنَاصِرُ نُمُوِّهِ شَمْسٌ وَمَاءٌ وَهَوَاءٌ وَتُرْبَةٌ. يُصَنَّفُ إِلَى لَاوِعَائِيَّةٍ (حَزَازِيَّاتٍ)، وَوِعَائِيَّةٍ لَابَذْرِيَّةٍ (سَرْخَسِيَّاتٍ)، وَمُعَرَّاةِ البُذُورِ (الصَّنَوْبَرِ)، وَمُغَطَّاةِ البُذُورِ (فِلْقَةٍ وَفِلْقَتَيْنِ)، وَيَصْنَعُ غِذَاءَهُ بِالبِنَاءِ الضَّوْئِيِّ وَيُطْلِقُ الأُكْسِجِينَ. الدَّرْسُ (2) الفِطْرِيَّاتُ: تَتَكَوَّنُ مِنْ قُبَّعَةٍ وَخَيَاشِيمَ وَسَاقٍ وَغَزْلٍ فِطْرِيٍّ، وَتَتَكَاثَرُ بِالأَبْوَاءِ (كَـعَفَنِ الخُبْزِ) أَوِ التَّبَرْعُمِ (كَالخَمِيرَةِ). مِنْهَا غِذَائِيَّةٌ (عِيشُ الغُرَابِ، الكَمْأَةُ)، وَنَافِعَةٌ (الخَمِيرَةُ لِلْخُبْزِ، وَالبِنْسِلْيُومُ لِصِنَاعَةِ دَوَاءِ البِنْسِلِينِ)، وَضَارَّةٌ تُسَبِّبُ تَعَفُّنَ الأَغْذِيَةِ.",
      "q1": {
        "q": "بِأَيِّ عَمَلِيَّةٍ يَصْنَعُ النَّبَاتُ الأَخْضَرُ غِذَاءَهُ فِي الأَوْرَاقِ وَيُطْلِقُ غَازَ الأُكْسِجِينِ لِلْحَيَاةِ؟",
        "focusWord": "البِنَاءُ الضَّوْئِيُّ",
        "options": [
          {
            "text": "بِعَمَلِيَّةِ البِنَاءِ الضَّوْئِيِّ",
            "correct": true
          },
          {
            "text": "بِالتَّخَمُّرِ الكُحُولِيِّ",
            "correct": false
          },
          {
            "text": "بِالتَّبَخُّرِ المَائِيِّ",
            "correct": false
          },
          {
            "text": "بِالانْشِطَارِ الثُّنَائِيِّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الفِطْرُ النَّافِعُ الَّذِي يُسْتَخْدَمُ فِي صِنَاعَةِ دَوَاءِ المُضَادِّ الحَيَوِيِّ (البِنْسِلِينِ)؟",
        "focusWord": "البِنْسِلْيُومُ",
        "options": [
          {
            "text": "فِطْرُ البِنْسِلْيُومِ",
            "correct": true
          },
          {
            "text": "عَفَنُ الخُبْزِ الضَّارُّ",
            "correct": false
          },
          {
            "text": "صَدَأُ النَّبَاتِ",
            "correct": false
          },
          {
            "text": "سَعْفَةُ الرَّأْسِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَيْفَ تَتَكَاثَرُ فِطْرِيَّاتُ الخَمِيرَةِ الَّتِي تُخَمِّرُ العَجِينَ لِصُنْعِ الخُبْزِ؟",
        "focusWord": "بِالتَّبَرْعُمِ",
        "options": [
          {
            "text": "بِالتَّبَرْعُمِ",
            "correct": true
          },
          {
            "text": "بِالبُذُورِ الزَّهْرِيَّةِ",
            "correct": false
          },
          {
            "text": "بِالوِلَادَةِ",
            "correct": false
          },
          {
            "text": "بِالأَصْوَاطِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "النَّبَاتَاتُ الوِعَائِيَّةُ البَذْرِيَّةُ",
          "left": "مُعَرَّاةُ البُذُورِ (الصَّنَوْبَرُ) وَمُغَطَّاةُ البُذُورِ (فِلْقَةٌ وَفِلْقَتَانِ)"
        },
        {
          "right": "فِطْرِيَّاتٌ غِذَائِيَّةٌ",
          "left": "عِيشُ الغُرَابِ وَالكَمْأَةُ"
        },
        {
          "right": "فِطْرِيَّاتٌ نَافِعَةٌ لِلدَّوَاءِ وَالخُبْزِ",
          "left": "الخَمِيرَةُ وَالبِنْسِلْيُومُ (البِنْسِلِينُ)"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَنَافِعَ النَّبَاتَاتِ وَالفِطْرِيَّاتِ النَّافِعَةِ:",
        "correct": [
          "إِطْلَاقُ غَازِ الأُكْسِجِينِ",
          "تَخْمِيرُ العَجِينِ بِالخَمِيرَةِ",
          "صِنَاعَةُ البِنْسِلِينِ الدَّوَائِيِّ",
          "عِيشُ الغُرَابِ وَالكَمْأَةُ"
        ],
        "wrong": [
          "الفِطْرُ البَرِّيُّ السَّامُّ",
          "تَعَفُّنُ الأَغْذِيَةِ المَكْشُوفَةِ"
        ]
      },
      "applyStep": "أَسْقِي النَّبَاتَاتِ وَأَحْفَظُ الطَّعَامَ فِي الثَّلَّاجَةِ مُغَطًّى لِحِمَايَتِهِ مِنْ فِطْرِيَّاتِ العَفَنِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt9.jpg",
      "title": "تَمَارِينُ الإِيقَاعِ الحَرَكِيِّ وَالذَّاكِرَةِ العَامِلَةِ (المَجْمُوعَةُ الثَّامِنَةُ: 50..56)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِرَبْطِ الصَّوْتِ وَالحَرَكَةِ، زِيَادَةِ سُرْعَةِ البَدِيهَةِ، وَالتَّحَكُّمِ الذَّاتِيِّ!",
      "slideText": "🎵 تَمَارِينُ الإِيقَاعِ الحَرَكِيِّ وَالذَّاكِرَةِ العَامِلَةِ (المَجْمُوعَةُ الثَّامِنَةُ — التَّمَارِينُ 50 إِلَى 56): (50) إِيقَاعُ المِرْآةِ العَكْسِيَّةِ مَعَ المُدَرِّبِ. (51) شَفْرَةُ الأَلْوَانِ الحَرَكِيَّةِ (أَخْضَرُ = قَفْزٌ، أَصْفَرُ = جُلُوسٌ، أَحْمَرُ = ثَبَاتٌ). (52) صَدَى التَّصْفِيقِ المُشَفَّرِ بِالتَّرْبِيتِ عَلَى الرُّكْبَتَيْنِ. (53) المِشْيَةُ المُزْدَوَجَةُ (خُطْوَتَانِ لِلْأَمَامِ + تَصْفِيقَةٌ خَلْفَ الظَّهْرِ + خُطْوَةٌ لِلْخَلْفِ). (54) تَجْمِيدُ التِّمْثَالِ عِنْدَ تَوَقُّفِ الصَّوْتِ (5 ثَوَانٍ). (55) الكُرَةُ الصَّامِتَةُ مَعَ العَدِّ التَّنَازُلِيِّ الهَامِسِ (10، 9، 8...). (56) بُوصَلَةُ الاتِّجَاهَاتِ الأَرْبَعِ.",
      "q1": {
        "q": "مَا دَلَالَةُ الأَلْوَانِ الثَّلَاثَةِ فِي تَمْرِينِ (شَفْرَةِ الأَلْوَانِ الحَرَكِيَّةِ 51)؟",
        "focusWord": "شَفْرَةُ الأَلْوَانِ الحَرَكِيَّةِ",
        "options": [
          {
            "text": "الأَخْضَرُ = قَفْزٌ، وَالأَصْفَرُ = جُلُوسٌ، وَالأَحْمَرُ = ثَبَاتٌ",
            "correct": true
          },
          {
            "text": "الأَحْمَرُ = جَرْيٌ سَرِيعٌ",
            "correct": false
          },
          {
            "text": "الأَخْضَرُ = نَوْمٌ",
            "correct": false
          },
          {
            "text": "كُلُّ الأَلْوَانِ تَعْنِي الجُلُوسَ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (المِشْيَةِ المُزْدَوَجَةِ 53) لِتَقْوِيَةِ الذَّاكِرَةِ العَامِلَةِ؟",
        "focusWord": "المِشْيَةُ المُزْدَوَجَةُ",
        "options": [
          {
            "text": "المَشْيُ لِلْأَمَامِ خُطْوَتَيْنِ، ثُمَّ التَّوَقُّفُ وَالتَّصْفِيقُ خَلْفَ الظَّهْرِ مَرَّةً وَاحِدَةً، ثُمَّ خُطْوَةٌ لِلْخَلْفِ",
            "correct": true
          },
          {
            "text": "الجَرْيُ لِلْأَمَامِ فَقَطْ",
            "correct": false
          },
          {
            "text": "القَفْزُ عَلَى قَدَمٍ وَاحِدَةٍ",
            "correct": false
          },
          {
            "text": "التَّدَحْرُجُ عَلَى البِسَاطِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَاذَا يَفْعَلُ الطِّفْلُ فِي تَمْرِينِ (الكُرَةِ الصَّامِتَةِ 55) وَتَمْرِينِ (تَجْمِيدِ التِّمْثَالِ 54)؟",
        "focusWord": "الكُرَةُ الصَّامِتَةُ وَتَجْمِيدُ التِّمْثَالِ",
        "options": [
          {
            "text": "يَتَجَمَّدُ كَتِمْثَالٍ لـ5 ثَوَانٍ عِنْدَ تَوَقُّفِ الصَّوْتِ، وَيُمَرِّرُ الكُرَةَ مَعَ الهَمْسِ بِأَرْقَامٍ تَنَازُلِيَّةٍ (10، 9، 8...)",
            "correct": true
          },
          {
            "text": "يَصْرُخُ بِأَعْلَى صَوْتِهِ",
            "correct": false
          },
          {
            "text": "يَرْمِي الكُرَةَ عَلَى الجِدَارِ",
            "correct": false
          },
          {
            "text": "يَتَحَرَّكُ بَعْدَ تَوَقُّفِ الصَّوْتِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "شَفْرَةُ الأَلْوَانِ الحَرَكِيَّةِ (51)",
          "left": "أَخْضَرُ = قَفْزٌ، أَصْفَرُ = جُلُوسٌ، أَحْمَرُ = ثَبَاتٌ"
        },
        {
          "right": "المِشْيَةُ المُزْدَوَجَةُ (53)",
          "left": "خُطْوَتَانِ لِلْأَمَامِ وَتَصْفِيقَةٌ خَلْفَ الظَّهْرِ وَخُطْوَةٌ لِلْخَلْفِ"
        },
        {
          "right": "الكُرَةُ الصَّامِتَةُ (55)",
          "left": "تَمْرِيرُ الكُرَةِ مَعَ العَدِّ التَّنَازُلِيِّ الهَامِسِ (10، 9، 8...)"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الإِيقَاعِ الحَرَكِيِّ وَالذَّاكِرَةِ العَامِلَةِ (50..56):",
        "correct": [
          "إِيقَاعُ المِرْآةِ العَكْسِيَّةِ",
          "شَفْرَةُ الأَلْوَانِ وَصَدَى التَّصْفِيقِ",
          "المِشْيَةُ المُزْدَوَجَةُ وَتَجْمِيدُ التِّمْثَالِ",
          "الكُرَةُ الصَّامِتَةُ وَبُوصَلَةُ الاتِّجَاهَاتِ"
        ],
        "wrong": [
          "التَّسَرُّعُ دُونَ انْتِبَاهٍ لِلْإِشَارَةِ",
          "الفَوْضَى الصَّوْتِيَّةُ"
        ]
      },
      "applyStep": "أَلْعَبُ تَمْرِينَ شَفْرَةِ الأَلْوَانِ الحَرَكِيَّةِ وَالكُرَةِ الصَّامِتَةِ مَعَ إِخْوَتِي لِتَقْوِيَةِ سُرْعَةِ البَدِيهَةِ وَالتَّحَكُّمِ الذَّاتِيِّ."
    }
  },
  {
    "w": 10,
    "secNum": 3,
    "heavenName": "سَمَاءُ الاثْنَيْنِ الثَّالِثَةُ (ط ي ك ل)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّالِثَةُ: عَالَمُ النَّبَاتِ وَالأَحْيَاءِ الدَّقِيقَةِ وَالمَنَاعَةِ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "ي",
    "jummal": 10,
    "prophet": "يَحْيَى (ع)",
    "virtue": "الحَنَانُ",
    "unitHeader": "الوَحْدَةُ العَاشِرَةُ : نَبِيُّ اللهِ يَحْيَى (عَلَيْهِ السَّلَامُ)",
    "storyThird": "آتَى اللهُ نَبِيَّهُ يَحْيَى (ع) الحِكْمَةَ وَالفَهْمَ مُنْذُ طُفُولَتِهِ، وَكَانَ بَارًّا بِوَالِدَيْهِ رَحِيمَ القَلْبِ كَثِيرَ الخَشْيَةِ وَالدُّعَاءِ للهْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): تَهْذِيبُ قُوَّةِ الغَضَبِ فِي وَصِيَّةِ عِيسَى لِيَحْيَى: «لَا تَغْضَبْ، وَإِذَا غَضِبْتَ فَاذْكُرْ عَظَمَةَ اللهِ»؛ وَفِي مُقَابِلِهَا نَارُ الحِقْدِ وَالعُدْوَانِ فِي صَدْرِ المَلِكِ الطَّاغِيَةِ وَالمَرْأَةِ البَاغِيَةِ حِينَ طَلَبَتْ رَأْسَ يَحْيَى فِي طَسْتٍ مِنْ ذَهَبٍ، وَفَوَرَانُ دَمِ يَحْيَى عَلَى الأَرْضِ غَضَبًا لِلهِ حَتَّى انْتَقَمَ اللهُ مِنَ الظَّالِمِينَ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الغَفْلَةِ وَالوَهْمِ فِي دَعْوَةِ الصِّبْيَانِ لَهُ إِلَى اللَّعِبِ فَرَدَّهَا بِقَوْلِهِ: «مَا لِلَّعِبِ خُلِقْنَا»، وَرِيحُ الإِغْوَاءِ حِينَ تَمَثَّلَ لَهُ إِبْلِيسُ بِمَعَالِيقِ الشَّهَوَاتِ فَطَرَدَهُ، وَوَهْمُ المَلِكِ الظَّالِمِ أَنَّ قَتْلَ النَّبِيِّ يُخْفِي صَوْتَ الحَقِّ حَتَّى نَطَقَ الرَّأْسُ الشَّرِيفُ فِي الطَّسْتِ: «اتَّقِ اللهَ، فَإِنَّهَا لَا تَحِلُّ لَكَ!». C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): إِيتَاءُ اللهِ لِيَحْيَى ﴿الْحُكْمَ صَبِيًّا﴾ وَأَخْذُهُ الكِتَابَ بِقُوَّةِ العَقْلِ، وَتَعْلِيمُهُ النَّاسَ الكَلِمَاتِ الخَمْسَ فِي بَيْتِ المَقْدِسِ، وَخَسْفُ التُّرَابِ بِالمَلِكِ الظَّالِمِ وَالبَغِيِّ، وَبُكَاءُ الأَرْضِ وَالسَّمَاءِ عَلَيْهِ أَرْبَعِينَ صَبَاحًا، وَسُكُونُ دَمِهِ الطَّاهِرِ فِي التُّرَابِ بَعْدَ تَحَقُّقِ القِصَاصِ العَادِلِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): كَوْنُهُ «حَصُورًا» زَاهِدًا مُتَعَفِّفًا عَنْ شَهَوَاتِ الدُّنْيَا، وَ«حَنَانًا» رَقِيقَ القَلْبِ غَزِيرَ الدَّمْعِ مِنْ خَشْيَةِ اللهِ، وَ«بَرًّا بِوَالِدَيْهِ»، وَتَعْمِيدُهُ لِلنَّاسِ وَتَطْهِيرُهُمْ بِالمَاءِ الطَّهُورِ فِي نَهْرِ الأُرْدُنِّ تَوْبَةً إِلَى اللهِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الاثْنَيْنِ الجَمِيلْ، يَأْتِي النَّبِيُّ الرَّقْمُ عَشَرَةٍ عَلَى تَمَامِ أَصَابِعِ اليَدَيْنِ فِي مَنْزِلَةِ الرِّيحِ الَّتِي تَكْشِفُ الوَهْمَ وَاللَّهْوِ بِنَسِيمِ الحِكْمَةِ وَالجِدِّ وَاليَقِينِ، وَهُوَ نَبِيُّ اللهِ يَحْيَى بْنُ زَكَرِيَّا عَلَيْهِمَا السَّلَامْ. كَانَ مَوْلِدُهُ مُعْجِزَةً وَآيَةً بَاهِرَةً بَعْدَ أَنْ دَعَا أَبُوهُ زَكَرِيَّا رَبَّهُ فِي المِحْرَابِ وَقَدْ بَلَغَ الكِبَرَ وَكَانَتْ زَوْجَتُهُ الصَّالِحَةُ إِيشَاعُ أُخْتُ حَنَّةَ أُمِّ مَرْيَمَ عَاقِرًا لَا تَلِدْ، فَبَشَّرَتْهُ المَلَائِكَةُ بِغُلَامٍ زَكِيٍّ سَمَّاهُ اللهُ مِنْ فَوْقِ عَرْشِهِ يَحْيَى وَلَمْ يَجْعَلْ لَهُ مِنْ قَبْلُ سَمِيًّا لِأَنَّ اللهَ يُحْيِي بِهِ القُلُوبَ وَالإِيمَانْ. وَوُلِدَ يَحْيَى بَعْدَ سِتَّةِ أَشْهُرٍ مِنْ حَمْلِ أُمِّهِ كَمَا وُلِدَ مِنْ بَعْدِهِ شَبِيهُهُ الإِمَامُ الحُسَيْنُ عَلَيْهِ السَّلَامْ، وَكَانَ يَحْيَى وَهُوَ فِي بَطْنِ أُمِّهِ قَدْ سَجَدَ تَصْدِيقًا وَتَحِيَّةً لِابْنِ خَالَتِهِ عِيسَى كَلِمَةِ اللهِ فِي بَطْنِ مَرْيَمَ العَذْرَاءْ.",
      "نَشَأَ يَحْيَى مُبَارَكًا يَخْدُمُ مَسْجِدَ بَيْتِ المَقْدِسِ بِيَدَيْهِ الصَّغِيرَتَيْنِ فَيَكْنُسُهُ وَيُنَظِّفُهُ وَيُسْرِجُ قَنَادِيلَهُ لِلمُصَلِّينْ، وَآتَاهُ اللهُ الحُكْمَ وَالفَهْمَ وَهُوَ مَا زَالَ صَبِيًّا صَغِيرًا فِي سِنِّ الطُّفُولَةْ، وَأَوْحَى إِلَيْهِ يَا يَحْيَى خُذِ الكِتَابَ بِقُوَّةٍ أَيْ بِجِدِّ العَقْلِ وَعَزِيمَةِ الطَّاعَةْ. وَفِي يَوْمٍ نَادَاهُ الصِّبْيَانُ الصِّغَارُ وَقَالُوا لَهُ تَعَالَ نَلْعَبْ يَا يَحْيَى، فَرَفَضَ رِيحَ الغَفْلَةِ وَاللَّهْوِ وَقَالَ لَهُمْ بِلِسَانِ الحِكْمَةِ مَا لِلَّعِبِ خُلِقْنَا وَإِنَّمَا خُلِقْنَا لِلْعِلْمِ وَالعِبَادَةِ وَالسَّعْيْ. وَكَبِرَ غُلَامًا يَافِعًا طَاهِرَ الثِّيَابِ وَالقَلْبِ يُطِيعُ رَبَّهُ وَيَبَرُّ وَالِدَيْهِ بِأَدَبٍ وَرِقَّةٍ وَلَمْ يَكُنْ جَبَّارًا عَصِيًّا، وَجَعَلَهُ اللهُ حَنَانًا مِنْ لَدُنْهُ وَزَكَاةً وَسَيِّدًا حَكِيمًا وَحَصُورًا عَفِيفًا زَاهِدًا فِي شَهَوَاتِ الدُّنْيَا وَهُوَ نَبِيٌّ كَرِيمٌ مِنَ الصَّالِحِينْ.",
      "كَانَ أَبُوهُ زَكَرِيَّا إِذَا وَعَظَ النَّاسَ وَحَضَرَ يَحْيَى لَا يَذْكُرُ النَّارَ شَفَقَةً عَلَى قَلْبِهِ الرَّحِيمْ، حَتَّى حَضَرَ يَحْيَى يَوْمًا وَسَمِعَ وَصْفَ العَذَابِ فَسَارَ فِي الجِبَالِ يَبْكِي حُبًّا وَخَشْيَةً لِلهِ حَتَّى وَجَدَهُ أَبُوهُ وَأُمُّهُ عِنْدَ رَاعِي غَنَمٍ فَأَعَادَاهُ إِلَى الدَّارْ، وَجَرَتِ الدُّمُوعُ مِنْ أَطْهَرِ عُيُونٍ عَلَى خَدَّيْهِ الشَّرِيفَيْنِ فَوَضَعَتْ لَهُ أُمُّهُ قِطْعَتَيْنِ مِنَ اللِّبَادِ النَّاعِمِ عَلَى وَجْنَتَيْهِ لِتَحْمِيَهُمَا مِنْ حَرِّ الدُّمُوعْ. وَكَانَ يَلْبَسُ الثِّيَابَ المُتَوَاضِعَةَ المَنْسُوجَةَ مِنْ لِيفِ الشَّجَرِ وَالصُّوفْ، وَيَأْكُلُ مِنْ خُبْزِ الشَّعِيرِ وَثَمَرِ الخَرُّوبِ وَيِبْسِ العُشْبِ النَّظِيفِ مَعَ العَسَلِ الجَبَلِيِّ الحَلَالْ، وَيَغْتَسِلُ وَيُطَهِّرُ التَّائِبِينَ بِالمَاءِ العَذْبِ الجَارِي فِي نَهْرِ الأُرْدُنّْ. وَظَهَرَ لَهُ إِبْلِيسُ يَوْمًا وَعَلَيْهِ مَعَالِيقُ الشَّهَوَاتِ وَأَخْبَرَهُ أَنَّ شِبَعَ البَطْنِ هُوَ الَّذِي يُثْقِلُ النَّاسَ عَنِ الصَّلَاةِ وَالذِّكْرِ وَلٰكِنْ لَيْسَ لَهُ عَلَى يَحْيَى سَبِيلْ، فَعَاشَ يَحْيَى خَفِيفَ البَطْنِ مُشْرِقَ الرُّوحِ تَسْجُدُ مَعَهُ الأَشْجَارُ وَتَأْنَسُ بِهِ الوُحُوشُ وَالأُسُودُ فِي البَرَارِي فَلَا تُؤْذِيهْ.",
      "أَوْحَى اللهُ إِلَى يَحْيَى خَمْسَ كَلِمَاتٍ مُبَارَكَاتٍ فَجَمَعَ النَّاسَ فِي مَسْجِدِ بَيْتِ المَقْدِسِ وَعَلَّمَهُمْ أَنْ يَعْبُدُوا اللهَ وَحْدَهُ لَا شَرِيكَ لَهْ، وَأَنْ يُقِيمُوا الصَّلَاةَ بِخُشُوعٍ دُونَ التِفَاتْ، وَأَنْ يَصُومُوا فَإِنَّ الصَّائِمَ كَحَامِلِ المِسْكِ الطَّيِّبْ، وَأَنْ يَتَصَدَّقُوا عَلَى الفُقَرَاءْ، وَأَنْ يَذْكُرُوا اللهَ كَثِيرًا فَإِنَّ ذِكْرَ اللهِ حِصْنٌ حَصِينٌ مِنَ الشَّيْطَانْ. وَتَحَاوَرَ يَحْيَى مَعَ ابْنِ خَالَتِهِ عِيسَى عَلَيْهِمَا السَّلَامُ فِي الخَوْفِ وَالرَّجَاءِ وَحُسْنِ الظَّنِّ بِاللهْ، وَسَأَلَهُ عَمَّا يُقَرِّبُهُ مِنْ رِضْوَانِ اللهِ فَقَالَ لَهُ عِيسَى لَا تَغْضَبْ وَإِذَا غَضِبْتَ فَاذْكُرْ عَظَمَةَ اللهِ فَتَسْكُنَ نَفْسُكْ، فَسَارَا مَعًا يَدْعُوَانِ النَّاسَ إِلَى كُلِّ خَيْرٍ وَهُدًى، وَكَانَ عَمَلُهُ كُلُّهُ سَعْيٌ مُبَارَكٌ قَدْ رَضِيَ اللهُ عَنْهُ فِي الدُّنْيَا وَالآخِرَةْ.",
      "وَفِي ذٰلِكَ الزَّمَانِ أَرَادَ مَلِكُ البِلَادِ الظَّالِمُ هِيرُودُسُ أَنْ يَتَزَوَّجَ فَتَاةً مُحَرَّمَةً عَلَيْهِ فِي شَرِيعَةِ اللهْ، فَوَقَفَ نَبِيُّ اللهِ يَحْيَى بِشَجَاعَةِ الحَقِّ وَأَعْلَنَ أَمَامَ الجَمِيعِ أَنَّ هٰذَا الزَّوَاجَ حَرَامٌ لَا يَحِلُّ فِي دِينِ اللهْ. فَاشْتَعَلَتْ نَارُ الغَضَبِ وَالحِقْدِ فِي صَدْرِ أُمِّ الفَتَاةِ البَاغِيَةْ، فَزَيَّنَتِ ابْنَتَهَا لِتُغْوِيَ المَلِكَ بِرِيحِ الوَهْمِ وَالشَّهْوَةِ وَتَطْلُبَ مِنْهُ رَأْسَ نَبِيِّ اللهِ يَحْيَى فِي طَسْتٍ مِنْ ذَهَبْ. أَرْسَلَ المَلِكُ الظَّالِمُ جُنُودَهُ إِلَى مِحْرَابِ يَحْيَى وَهُوَ سَاجِدٌ يُصَلِّي لِرَبِّهِ فِي خُشُوعٍ وَسَلَامْ، فَقَطَعُوا رَأْسَهُ الشَّرِيفَ ظُلْمًا وَوَضَعُوهُ فِي الطَّسْتِ أَمَامَ المَلِكِ الطَّاغِيَةْ، فَنَطَقَ رَأْسُ يَحْيَى بِلِسَانٍ فَصِيحٍ بِقُدْرَةِ اللهِ وَقَالَ لِلمَلِكِ اتَّقِ اللهَ فَإِنَّهَا لَا تَحِلُّ لَكْ! فَأَمَرَ اللهُ الأَرْضَ فِي الحَالِ فَخَسَفَتْ بِالمَلِكِ وَالبَغِيِّ وَابْتَلَعَتْهُمْ فِي التُّرَابْ، وَبَكَتِ السَّمَاءُ وَالأَرْضُ عَلَى يَحْيَى أَرْبَعِينَ صَبَاحًا بِالحُمْرَةِ كَمَا بَكَتْ مِنْ بَعْدِهِ عَلَى شَبِيهِهِ سَيِّدِ الشُّهَدَاءِ الإِمَامِ الحُسَيْنِ عَلَيْهِ السَّلَامْ، وَظَلَّ دَمُ يَحْيَى الطَّاهِرُ يَفُورُ عَلَى الأَرْضِ حَتَّى سَلَّطَ اللهُ عَلَى القَتَلَةِ جَيْشَ بُخْتَنَصَّرَ فَاقْتَصَّ مِنْهُمْ فَسَكَنَ الدَّمُ بِإِذْنِ اللهْ، وَبَقِيَ مَقَامُ رَأْسِهِ الشَّرِيفِ مُكَرَّمًا فِي مَسْجِدِ دِمَشْقَ وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا."
    ],
    "words": [
      {
        "word": "خَيْرٍ",
        "desc": "وسط متصل / ساكن: ـيْـ",
        "raw": "خَيْرٍ (وسط متصل / ساكن: ـيْـ)"
      },
      {
        "word": "السَّعْيْ",
        "desc": "آخر متصل / ساكن وقفا: ـيْ",
        "raw": "السَّعْيْ (آخر متصل / ساكن وقفا: ـيْ)"
      },
      {
        "word": "يَحْيَى",
        "desc": "أول منفصل / متحرك بالفتح: يَـ",
        "raw": "يَحْيَى (أول منفصل / متحرك بالفتح: يَـ)"
      },
      {
        "word": "اليَقِينِ",
        "desc": "أول متصل / متحرك بالفتح: ـيَـ",
        "raw": "اليَقِينِ (أول متصل / متحرك بالفتح: ـيَـ)"
      },
      {
        "word": "خَشْيَةً",
        "desc": "وسط متصل / متحرك بالفتح: ـيَـ",
        "raw": "خَشْيَةً (وسط متصل / متحرك بالفتح: ـيَـ)"
      },
      {
        "word": "آيَةً",
        "desc": "وسط منفصل / متحرك بالفتح: يَـ",
        "raw": "آيَةً (وسط منفصل / متحرك بالفتح: يَـ)"
      },
      {
        "word": "رَضِيَ",
        "desc": "آخر متصل / متحرك بالفتح: ـيَ",
        "raw": "رَضِيَ (آخر متصل / متحرك بالفتح: ـيَ)"
      },
      {
        "word": "يُطِيعُ",
        "desc": "أول منفصل / متحرك بالضم: يُـ",
        "raw": "يُطِيعُ (أول منفصل / متحرك بالضم: يُـ)"
      },
      {
        "word": "سَعْيٌ",
        "desc": "آخر متصل / متحرك بالضم: ـيٌ",
        "raw": "سَعْيٌ (آخر متصل / متحرك بالضم: ـيٌ)"
      },
      {
        "word": "يِبْسِ",
        "desc": "أول منفصل / متحرك بالكسر: يِـ",
        "raw": "يِبْسِ (أول منفصل / متحرك بالكسر: يِـ)"
      },
      {
        "word": "صَبِيًّا",
        "desc": "وسط متصل / مضعف بالفتح: ـيَّـ",
        "raw": "صَبِيًّا (وسط متصل / مضعف بالفتح: ـيَّـ)"
      },
      {
        "word": "نَبِيٌّ",
        "desc": "آخر متصل / مضعف بالضم: ـيٌّ",
        "raw": "نَبِيٌّ (آخر متصل / مضعف بالضم: ـيٌّ)"
      },
      {
        "word": "سَيِّدًا",
        "desc": "وسط متصل / مضعف بالكسر: ـيِّـ",
        "raw": "سَيِّدًا (وسط متصل / مضعف بالكسر: ـيِّـ)"
      },
      {
        "word": "يَافِعًا",
        "desc": "أول منفصل / ممدود بالألف: يَا",
        "raw": "يَافِعًا (أول منفصل / ممدود بالألف: يَا)"
      },
      {
        "word": "عُيُونٍ",
        "desc": "وسط متصل / ممدود بالواو: ـيُو",
        "raw": "عُيُونٍ (وسط متصل / ممدود بالواو: ـيُو)"
      },
      {
        "word": "يُحْيِي",
        "desc": "وسط/آخر متصل / ممدود بالياء: ـيِي",
        "raw": "يُحْيِي (وسط/آخر متصل / ممدود بالياء: ـيِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ اليَاءِ (ي): النُّطْقُ السَّلِيمُ لِحَرْفِ اليَاءِ مِنْ مَخْرَجِ وَسَطِ اللِّسَانِ مَعَ مَا يُحَاذِيهِ مِنَ الحَنَكِ الأَعْلَى (وَلِيَاءِ المَدِّ مِنَ الجَوْفِ)، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الإِكْثَارِ مِنْ ذِكْرِ اللهِ (الحِصْنِ الحَصِينِ) وَقَوْلِ كَلِمَةِ الحَقِّ بِشَجَاعَةٍ وَأَدَبٍ."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "المُنْحَنَى المُتَّصِلُ وَالنُّقْطَتَانِ السُّفْلِيَّتَانِ وَالشَّكْلُ العُشَارِيُّ: مُشَاهَدَةُ انْسِيَابِ حَرْفِ اليَاءِ (ي / يـ) وَتَحْتَهُ نُقْطَتَانِ مُتَجَاوِرَتَانِ كَالعَيْنَيْنِ البَاكِيَتَيْنِ مِنْ خَشْيَةِ اللهِ أَوْ كَالشَّبِيهَيْنِ (يَحْيَى وَالحُسَيْنِ عَلَيْهِمَا السَّلَامُ)، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «الشَّكْلِ العُشَارِيِّ» وَ«النَّجْمَةِ العُشَارِيَّةِ» ذَاتِ الرُّؤُوسِ العَشَرَةِ، وَتَدْرِيبُ العَيْنِ عَلَى عَدَمِ الِالتِفَاتِ أَثْنَاءَ الصَّلَاةِ، وَالتَّفَكُّرُ فِي حُمْرَةِ الشَّفَقِ فِي السَّمَاءِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ يَحْيَى الكَامِلَةُ وَالإِنْصَاتُ لِلْمَوْعِظَةِ وَالكَلِمَاتِ الخَمْسِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ يَحْيَى وَوَصَايَاهُ الخَمْسِ، وَتَدْرِيبُ الأُذُنِ عَلَى حُبِّ سَمَاعِ العِلْمِ وَالمَوْعِظَةِ فِي المَسْجِدِ (كَمَا كَانَ يَحْيَى يَسْتَمِعُ لِمَوْعِظَةِ أَبِيهِ زَكَرِيَّا)، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ عَشَرَةٌ (10): تَدْرِيبُ اليَدِ عَلَى العَدِّ بِأَصَابِعِ اليَدَيْنِ العَشَرَةِ كَامِلَةً (5 + 5 = 10، أَيْ ضِعْفُ الكَلِمَاتِ الخَمْسِ)، وَكِتَابَةِ الرَّقْمِ (10) الَّذِي يَجْمَعُ الوَاحِدَ وَالصِّفْرَ (بِدَايَةُ مَرْتَبَةِ العَشَرَاتِ وَقِيمَةُ اليَاءِ فِي حِسَابِ الجُمَّلِ = 10)، وَتَدْرِيبُ اليَدِ عَلَى إِمْسَاكِ الكِتَابِ بِقُوَّةٍ وَأَدَبٍ، وَخِدْمَةِ المَسَاجِدِ وَكَنْسِهَا وَتَنْظِيفِهَا، وَإِعْطَاءِ الصَّدَقَةِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السَّيْرِ فِي الطَّبِيعَةِ وَالجِبَالِ وَطُولِ القِيَامِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ المَشْيِ النَّشِيطِ فِي البَرَارِي وَصُعُودِ الجِبَالِ وَالسَّيْرِ عَلَى ضِفَافِ الأَنْهَارِ، وَتَمَارِينِ قُوَّةِ السَّاقَيْنِ فِي طُولِ الوُقُوفِ وَالسُّجُودِ، وَالحَرَكَةِ الهَادِفَةِ الجَادَّةِ البَعِيدَةِ عَنِ العَبَثِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الخَرُّوبِ وَالشَّعِيرِ وَالعَسَلِ وَفَوَائِدِ الصِّيَامِ: تَعَلُّمُ القِيمَةِ الغِذَائِيَّةِ العَالِيَةِ لِثَمَرِ الخَرُّوبِ وَخُبْزِ الشَّعِيرِ وَالعَسَلِ الجَبَلِيِّ وَالبُقُولِ البَرِّيَّةِ، وَمَعْرِفَةِ الحِكْمَةِ الطِّبِّيَّةِ وَالرُّوحِيَّةِ فِي خِفَّةِ المَعِدَةِ وَالصِّيَامِ الَّذِي يُطَيِّبُ الرُّوحَ كَصُرَّةِ المِسْكِ وَيَحْمِي الإِنْسَانَ مِنْ كَسَلِ التُّخَمَةِ وَالشِّبَعِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ العِفَّةِ التَّامَّةِ (الحَصُورِ) وَالبِرِّ وَحِلْمِ النَّفْسِ: تَعَلُّمُ خُلُقِ العِفَّةِ وَالنَّزَاهَةِ وَالزُّهْدِ فِي اللِّبَاسِ النَّظِيفِ المُتَوَاضِعِ، وَالاغْتِسَالِ بِالمَاءِ الجَارِي الطَّهُورِ، وَبِرِّ الوَالِدَيْنِ، وَكَظْمِ الغَيْظِ بِذِكْرِ اللهِ، وَالتَّمَسُّكِ بِشَرِيعَةِ اللهِ فِي حِفْظِ حُدُودِ الحَلَالِ وَالحَرَامِ."
      }
    },
    "grammar": {
      "topic": "الجُمْلَةُ الاِسْمِيَّةُ: تَطْبِيقٌ شَامِلٌ مَعَ حَرْفِ اليَاءْ",
      "rule": "كُلُّ جُمْلَةٍ اسْمِيَّةٍ تَبْدَأُ بِاسْمٍ مَرْفُوعٍ (مُبْتَدَأٌ) وَتَتِمُّ بِخَبَرٍ مَرْفُوعٍ (خَبَرٌ).",
      "example": "اليَقِينُ نُورٌ — اليَدُ نَظِيفَةٌ — اليَنْبُوعُ صَافٍ.",
      "focusWord": "اليَقِينُ نُورٌ",
      "q": "مَا نَوْعُ جُمْلَةِ «اليَدُ نَظِيفَةٌ»؟",
      "opts": [
        "جُمْلَةٌ اسْمِيَّةٌ",
        "جُمْلَةٌ فِعْلِيَّةٌ",
        "شِبْهُ جُمْلَةٍ",
        "فِعْلُ أَمْرٍ"
      ]
    },
    "earIirab": {
      "topic": "مُرَاجَعَةُ الرَّفْعِ بِالضَّمَّةِ فِي رُكْنَيِ الجُمْلَةِ الاِسْمِيَّةْ",
      "rule": "المُبْتَدَأُ وَالخَبَرُ شَرِيكَانِ مَرْفُوعَانِ دَائِمًا بِالضَّمَّةِ فِي الجُمْلَةِ الاِسْمِيَّةْ.",
      "sentence": "اليَوْمُ مُشْرِقٌ.",
      "targetWord": "مُشْرِقٌ",
      "caseAns": "خَبَرٌ مَرْفُوعٌ بِالضَّمَّةِ (ـٌ)"
    },
    "math": {
      "numVal": 10,
      "numName": "عَشَرَةٌ",
      "eqDisplay": "5 + 5 = 10",
      "subDisplay": "10 - 5 = 5",
      "compDisplay": "10 > 9",
      "q1": {
        "stem": "مَا هُوَ اسْمُ العَدَدِ (10) بِالعَرَبِيَّةِ؟",
        "focus": "10",
        "ans": "عَشَرَةٌ",
        "wrong": [
          "وَاحِدٌ",
          "عِشْرُونَ",
          "مِائَةٌ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ مَا يُكْمِلُ العَشَرَةَ:",
        "focus": "5 + 5 = ؟",
        "ans": "10 (عَشَرَةٌ)",
        "wrong": [
          "8 (ثَمَانِيَةٌ)",
          "9 (تِسْعَةٌ)",
          "15"
        ]
      }
    },
    "sport": {
      "title": "بِيَانُو الأَصَابِعِ المُتَعَاكِسُ",
      "middleText": "أَضَعُ كَفَّيَّ عَلَى الطَّاوِلَةِ وَأَرْفَعُ أَصَابِعَ اليَدِ اليُمْنَى وَاليُسْرَى بِالتَّعَاكُسِ كَعَزْفِ البِيَانُو. يُقَوِّي هٰذَا التَّمْرِينُ أَعْصَابَ الأَصَابِعِ الدَّقِيقَةَ لإِتْقَانِ الكِتَابَةِ وَالرَّسْمْ."
    },
    "sci": {
      "title": "الكَائِنَاتُ المِجْهَرِيَّةُ: البَكْتِيرْيَا النَّافِعَةُ",
      "summaryThird": "تُوجَدُ كَائِنَاتٌ حَيَّةٌ دَقِيقَةٌ لَا نَرَاهَا إِلَّا بِالمِجْهَرِ؛ مِنْهَا البَكْتِيرْيَا النَّافِعَةُ الَّتِي تُحَوِّلُ الحَلِيبَ إِلَى لَبَنٍ رَائِبٍ وَتُسَاعِدُ أَمْعَاءَنَا عَلَى الهَضْمْ.",
      "focusConcept": "البَكْتِيرْيَا النَّافِعَةُ",
      "factAns": "تَحْوِيلُ الحَلِيبِ إِلَى لَبَنٍ وَمُسَاعَدَةُ الهَضْمْ"
    },
    "rightsSummary": {
      "title": "القِصَّةُ الجَامِعَةُ: أَمَانَةُ الجَوَارِحِ السَّبْعَةِ (حُور وَسُرُور - 10)",
      "storySentence": "رَاجَعَ سُرُورٌ وَحُورُ مِيثَاقَ الجَوَارِحِ: قَلْبٌ يُوَحِّدُ اللهَ، وَلِسَانٌ يَصْدُقُ، وَعَيْنٌ تَتَأَمَّلُ، وَأُذُنٌ تُنْصِتُ، وَيَدٌ تُعْطِي، وَرِجْلٌ تَسْعَى لِلخَيْرِ، وَبَطْنٌ يَكْتَفِي بِالحَلَالْ.",
      "applyAction": "أَجْعَلُ جَمِيعَ أَعْضَاءِ جِسْمِي شَاهِدَةً لِي بِالخَيْرِ وَالطَّاعَةْ."
    },
    "rightsFullTitle": "(10) حق الصلاة",
    "rightsQuote": "فَأَمَّا حَقُّ الصَّلاةِ فَأَنْ تَعْلَمَ أنّهَا وِفَادَةٌ إلَى اللهِ وَأَنَّكَ قَائِمٌ بهَا بَيْنَ يَدَيِ اللهِ، فَإذَا عَلِمْتَ ذَلِكَ كُنْتَ خَلِيقًا أَنْ تَقُومَ فِيهَا مَقَامَ الذَّلِيلِ الرَّاغِب الرَّاهِب الْخَائِفِ الرَّاجِي الْمِسْكِينِ الْمُتَضَرِّعِ الْمُعَظِّمِ مَنْ قَامَ بَيْنَ يَدَيْهِ بالسُّكُونِ وَالإطْرَاقِ وَخُشُوعِ الأَطْرَافِ وَلِينِ الْجَنَاحَ وَحُسْنِ الْمُنَاجَاةِ لَهُ فِي نَفْسِهِ وَالطَّلَب إلَيْهِ فِي فَكَاكِ رَقَبَتِكَ الَّتِي أَحَاطَتْ بهِ خَطِيئَتُكَ وَاسْتَهلَكَتْهَا ذُنُوبُكَ. وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (10) حق الصلاة",
        "text": "فَأَمَّا حَقُّ الصَّلاةِ فَأَنْ تَعْلَمَ أنّهَا وِفَادَةٌ إلَى اللهِ وَأَنَّكَ قَائِمٌ بهَا بَيْنَ يَدَيِ اللهِ، فَإذَا عَلِمْتَ ذَلِكَ كُنْتَ خَلِيقًا أَنْ تَقُومَ فِيهَا مَقَامَ الذَّلِيلِ الرَّاغِب الرَّاهِب الْخَائِفِ الرَّاجِي الْمِسْكِينِ الْمُتَضَرِّعِ الْمُعَظِّمِ مَنْ قَامَ بَيْنَ يَدَيْهِ بالسُّكُونِ وَالإطْرَاقِ وَخُشُوعِ الأَطْرَافِ وَلِينِ الْجَنَاحَ وَحُسْنِ الْمُنَاجَاةِ لَهُ فِي نَفْسِهِ وَالطَّلَب إلَيْهِ فِي فَكَاكِ رَقَبَتِكَ الَّتِي أَحَاطَتْ بهِ خَطِيئَتُكَ وَاسْتَهلَكَتْهَا ذُنُوبُكَ. وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ يَحْيَى (ع): آدَابُ العِفَّةِ التَّامَّةِ (الحَصُورِ) وَالبِرِّ وَحِلْمِ النَّفْسِ: تَعَلُّمُ خُلُقِ العِفَّةِ وَالنَّزَاهَةِ وَالزُّهْدِ فِي اللِّبَاسِ النَّظِيفِ المُتَوَاضِعِ، وَالاغْتِسَالِ بِالمَاءِ الجَارِي الطَّهُورِ، وَبِرِّ الوَالِدَيْنِ، وَكَظْمِ الغَيْظِ بِذِكْرِ اللهِ، وَالتَّمَسُّكِ بِشَرِيعَةِ اللهِ فِي حِفْظِ حُدُودِ الحَلَالِ وَالحَرَامِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصلاة",
        "text": "اتصال حور: شبكة القلب في أحد الأيام الهادئة، كانت حور تنجز واجباتها، فصادَفَتْ فكرةً صعبةً لم تستطع فهمها. احتاجت إلى الاتصال بصديقتها، لكن الإنترنت كان مقطوعاً! قالت بضجر: \"أوه! لا أستطيع حل السؤال ولا يمكنني الاتصال بصديقتي! ولا حتى البحث عن الشرح!\" سمعتها أمها وقالت بلطف: \"لا تتذمري. يمكنني مساعدتك، لكني سأدلك على طريقة أفضل بكثير.\" \"لا تقلقي يا حور، هناك اتصال أهم بكثير من الإنترنت... إنها الصلاة! ألا ترين أن وقتها قد حان؟ تعالي اتصلي معي بالله تعالى، واطلبي منه أن يفتح عقلك لتفهمي. وتأكدي أنه كريم يعطي أكثر مما نتخيل.\" توقفت حور لحظة وسألت بتأمل: \"هل يعني هذا أنني أتصل بالله كلما صليت؟\" أجابت الأم بابتسامة: \"نعم يا صغيرتي، ولكن عليكِ أن تتصلي بقلبك قبل جسدك، وأن تركزي بعقلك في كل كلمة تقولينها.\" 🩵 توضأت حور، ثم وقفت في مصلاها. أغمضت عينيها قليلاً، وتخيلت نفسها تدخل غرفة مليئة بالنور والهدوء. تذكرت كلمات أمها: \"كوني مهذبة في اتصالك، فنحن وقوف بين يدي مدير الكون.\" رفعت يديها بتأدب وقالت: \"الله أكبر\"... شعرت وكأنها اختارت اسم المتصل الأهم في حياتها. أحست أن من سيجيبها أكبر من كل شيء، وسيسمع لها بلا انقطاع. سكتت لحظة، ثم بدأت تقرأ سورة الفاتحة. شعرت بالراحة والسعادة لجمال الكلمات التي تعبر عن أفضل ما تريد قوله في هذا الاتصال المقدس. 💫 في الركوع، كادت تلتفت نحو أختها الصغيرة التي حاولت سحب كتابها، لكن أمها انتبهت وأبعدتها بهدوء، قائلة: \"لا تشتتي ذهنك فينقطع الاتصال، ولا يصل كلامك واضحاً من قلبك يا حور.\" أكملت حور صلاتها بهدوء، وهي تشعر بسكينة غريبة تملأ صدرها. حين وصلت إلى السجود، همست في قلبها: \"يارب... سامحني إن أخطأت، وساعدني لأكون أفضل.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصلاة",
        "text": "\"أعلم أنك تريد لنا الأفضل، يا الله... أكثر مما يريده الجميع.\" شعرت بِخِفّة جميلة، وكأن الله يسمعها ويرد عليها بطمأنينة تغمر روحها. 🌹 بعد الصلاة، جلست حور على السجادة، وأمسكت المسبحة. بدأت بالتسبيح: \"الله أكبر...\" كانت تتحرك الخرزات بين أصابعها، وكلما قالت \"الله أكبر\" شعرت بعظمته تملأ قلبها، وكأنها ترى الكون كله من حولها. ثم قالت: \"الحمد لله\"... تذكرت بيتها الدافئ، وجه أمها المبتسم، والكتاب الذي بين يديها. شعرت أن قلبها يمتلئ بالدفء، وأن كل شيء حولها هو هدية جميلة من الله. بعد ذلك، قالت: \"سبحان الله\"... تذكرت ألوان الزهور ودقة النملة وحكمة الشمس والقمر. شعرت بروعة خلق الله وكماله في كل شيء. أخيراً، رفعت يديها ودعت بقلب خاشع: \"يا الله... ساعدني أنا وأصدقائي لنفهم واجباتنا، ولننشر الخير. واجعلنا ننجح في ما ينفعنا.\" \"يا الله... إني أحبك.\" جاء صوت أمها ناعماً من خلفها: \"هكذا تكون الصلاة يا حور، صلة حية من القلب إلى السماء.\" نظرت حور إلى السماء من النافذة وابتسمت ابتسامة عرفان: \"الآن فهمت يا أمي... لقد وجدت الواي فاي الحقيقي!\" \"... شبكة مع الله لا تنقطع أبداً.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّالِثَةُ: النَّبَاتُ وَالأَحْيَاءُ الدَّقِيقَةُ",
      "topic": "الدَّرْسَانِ (3 وَ4): البَكْتِيرْيَا — الطَّلَائِعِيَّاتُ",
      "coverImg": "assets/y7/scince/s10.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s10.1.jpg",
          "text": "الدَّرْسُ (3) البَكْتِيرْيَا: كَائِنَاتٌ دَقِيقَةٌ تَتَكَوَّنُ مِنْ جِدَارٍ خَلَوِيٍّ وَسِيتُوبْلَازْمَ وَمِنْطَقَةٍ نَوَوِيَّةٍ وَسَوْطٍ لِلْحَرَكَةِ، وَتَتَكَاثَرُ بِالانْشِطَارِ الثُّنَائِيِّ. أَنْوَاعُهَا كُرَوِيَّةٌ وَعَصَوِيَّةٌ وَحَلَزُونِيَّةٌ وَضَمَّةٌ؛ مِنْهَا نَافِعَةٌ لِصِنَاعَةِ الأَلْبَانِ وَتَثْبِيتِ النَّيْتْرُوجِينِ، وَمِنْهَا ضَارَّةٌ تُسَبِّبُ التَّسَمُّمَ الغِذَائِيَّ."
        },
        {
          "img": "assets/y7/scince/s10.2.jpg",
          "text": "الدَّرْسُ (4) الطَّلَائِعِيَّاتُ: كَائِنَاتٌ لَهَا نَوَاةٌ وَسِيتُوبْلَازْمُ وَفَجْوَةٌ مُنْقَبِضَةٌ، وَتَتَحَرَّكُ بِالأَسْوَاطِ أَوِ الأَهْدَابِ. أَنْوَاعُهَا شَبِيهَةُ النَّبَاتِ (الطَّحَالِبُ، اليُوغْلِينَا الَّتِي تُنْتِجُ الأُكْسِجِينَ)، وَشَبِيهَةُ الحَيَوَانِ (الأَمِيبَا، البَرَامِيسْيُومُ)، وَشَبِيهَةُ الفِطْرِ (العَفَنُ الغَرَوِيُّ)."
        }
      ],
      "text": "الدَّرْسُ (3) البَكْتِيرْيَا: كَائِنَاتٌ دَقِيقَةٌ تَتَكَوَّنُ مِنْ جِدَارٍ خَلَوِيٍّ وَسِيتُوبْلَازْمَ وَمِنْطَقَةٍ نَوَوِيَّةٍ وَسَوْطٍ لِلْحَرَكَةِ، وَتَتَكَاثَرُ بِالانْشِطَارِ الثُّنَائِيِّ. أَنْوَاعُهَا كُرَوِيَّةٌ وَعَصَوِيَّةٌ وَحَلَزُونِيَّةٌ وَضَمَّةٌ؛ مِنْهَا نَافِعَةٌ لِصِنَاعَةِ الأَلْبَانِ وَتَثْبِيتِ النَّيْتْرُوجِينِ، وَمِنْهَا ضَارَّةٌ تُسَبِّبُ التَّسَمُّمَ الغِذَائِيَّ. الدَّرْسُ (4) الطَّلَائِعِيَّاتُ: كَائِنَاتٌ لَهَا نَوَاةٌ وَسِيتُوبْلَازْمُ وَفَجْوَةٌ مُنْقَبِضَةٌ، وَتَتَحَرَّكُ بِالأَسْوَاطِ أَوِ الأَهْدَابِ. أَنْوَاعُهَا شَبِيهَةُ النَّبَاتِ (الطَّحَالِبُ، اليُوغْلِينَا الَّتِي تُنْتِجُ الأُكْسِجِينَ)، وَشَبِيهَةُ الحَيَوَانِ (الأَمِيبَا، البَرَامِيسْيُومُ)، وَشَبِيهَةُ الفِطْرِ (العَفَنُ الغَرَوِيُّ).",
      "q1": {
        "q": "مَا الأَشْكَالُ الأَرْبَعَةُ لِخَلَايَا البَكْتِيرْيَا؟",
        "focusWord": "أَنْوَاعُ البَكْتِيرْيَا",
        "options": [
          {
            "text": "كُرَوِيَّةٌ، وَعَصَوِيَّةٌ، وَحَلَزُونِيَّةٌ، وَضَمَّةٌ",
            "correct": true
          },
          {
            "text": "مُثَلَّثَةٌ وَمُرَبَّعَةٌ فَقَطْ",
            "correct": false
          },
          {
            "text": "ذَاتُ رِيشٍ وَمِنْقَارٍ",
            "correct": false
          },
          {
            "text": "ذَاتُ قُشُورٍ وَزَعَانِفَ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا فَائِدَةُ البَكْتِيرْيَا النَّافِعَةِ لِلْإِنْسَانِ وَالبِيئَةِ؟",
        "focusWord": "صِنَاعَةُ الأَلْبَانِ",
        "options": [
          {
            "text": "صِنَاعَةُ الأَلْبَانِ وَصِحَّةُ الهَضْمِ وَتَثْبِيتُ النَّيْتْرُوجِينِ فِي التُّرْبَةِ",
            "correct": true
          },
          {
            "text": "تَسَبُّبُ المَلَارْيَا",
            "correct": false
          },
          {
            "text": "إِفْسَادُ المَاءِ النَّقِيِّ",
            "correct": false
          },
          {
            "text": "صِنَاعَةُ الزُّجَاجِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "أَيٌّ مِنَ الطَّلَائِعِيَّاتِ يُشْبِهُ النَّبَاتَ وَيُنْتِجُ كَمِّيَّاتٍ هَائِلَةً مِنَ الأُكْسِجِينِ فِي البِحَارِ؟",
        "focusWord": "الطَّحَالِبُ وَاليُوغْلِينَا",
        "options": [
          {
            "text": "الطَّحَالِبُ وَاليُوغْلِينَا",
            "correct": true
          },
          {
            "text": "الأَمِيبَا المُمْرِضَةُ",
            "correct": false
          },
          {
            "text": "عَفَنُ الخُبْزِ",
            "correct": false
          },
          {
            "text": "دُودَةُ الأَرْضِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "البَكْتِيرْيَا النَّافِعَةُ",
          "left": "صِنَاعَةُ الأَلْبَانِ وَتَثْبِيتُ النَّيْتْرُوجِينِ فِي التُّرْبَةِ"
        },
        {
          "right": "طَلَائِعِيَّاتٌ شَبِيهَةُ النَّبَاتِ",
          "left": "الطَّحَالِبُ وَاليُوغْلِينَا المُنْتِجَةُ لِلْأُكْسِجِينِ"
        },
        {
          "right": "طَلَائِعِيَّاتٌ شَبِيهَةُ الحَيَوَانِ",
          "left": "الأَمِيبَا وَالبَرَامِيسْيُومُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ فَوَائِدَ البَكْتِيرْيَا وَالطَّلَائِعِيَّاتِ وَطُرُقَ الوِقَايَةِ مِنْ أَضْرَارِهَا:",
        "correct": [
          "صِنَاعَةُ اللَّبَنِ الزَّبَادِيِّ",
          "إِنْتَاجُ الطَّحَالِبِ لِلْأُكْسِجِينِ",
          "شُرْبُ المَاءِ النَّقِيِّ",
          "غَسْلُ اليَدَيْنِ وَالطَّعَامِ"
        ],
        "wrong": [
          "شُرْبُ المِيَاهِ المُلَوَّثَةِ",
          "تَرْكُ الطَّعَامِ مَكْشُوفًا لِلذُّبَابِ"
        ]
      },
      "applyStep": "أَشْرَبُ المَاءَ النَّقِيَّ وَأَتَنَاوَلُ اللَّبَنَ الزَّبَادِيَّ المُفِيدَ لِصِحَّةِ الهَضْمِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt10.jpg",
      "title": "تَمَارِينُ الإِيقَاظِ الحِسِّيِّ وَالحَرَكَاتِ الأَرْضِيَّةِ (المَجْمُوعَةُ التَّمْهِيدِيَّةُ الأُولَى: 1..7)",
      "subtitle": "7 دَقَائِقَ تَأْسِيسِيَّةً لِتَرْطِيبِ الدِّمَاغِ، رَسْمِ خَرِيطَةِ الجَسَدِ، وَدَمْجِ المُنْعَكَسَاتِ الفِطْرِيَّةِ قَبْلَ الحَرَكَةِ!",
      "slideText": "💧 تَمَارِينُ الإِيقَاظِ الحِسِّيِّ وَالحَرَكَاتِ الأَرْضِيَّةِ (المَجْمُوعَةُ التَّمْهِيدِيَّةُ الأُولَى — 7 دَقَائِقَ تَأْسِيسِيَّةً): (1) رَشَفَاتُ المَاءِ الوَاعِيَةُ (إِبْقَاءُ رَشْفَةِ المَاءِ فِي الفَمِ لِثَانِيَتَيْنِ قَبْلَ البَلْعِ لِتَرْطِيبِ الدِّمَاغِ). (2) الضَّغْطُ العَمِيقُ لِلْمَفَاصِلِ (الكَتِفَيْنِ، المِرْفَقَيْنِ، الرُّكْبَتَيْنِ). (3) نَجْمَةُ البَحْرِ (فَتْحُ الأَطْرَافِ مَعَ الشَّهِيقِ) وَالشَّرْنَقَةُ (ضَمُّ الرُّكْبَتَيْنِ مَعَ الزَّفِيرِ). (4) التَّدَحْرُجُ الأُسْطُوَانِيُّ كَقِطْعَةٍ وَاحِدَةٍ. (5) انْحِنَاءَةُ المَوْزَةِ يَمِينًا وَيَسَارًا. (6) الطَّائِرُ المُحَلِّقُ عَلَى البَطْنِ. (7) الزَّحْفُ التَّبَادُلِيُّ الفِطْرِيُّ.",
      "q1": {
        "q": "لِمَاذَا نَبْدَأُ بِـ (رَشَفَاتِ المَاءِ الوَاعِيَةِ 1) وَ(الضَّغْطِ العَمِيقِ لِلْمَفَاصِلِ 2)؟",
        "focusWord": "رَشَفَاتُ المَاءِ وَالضَّغْطُ العَمِيقُ",
        "options": [
          {
            "text": "لِتَرْطِيبِ الدِّمَاغِ وَتَنْشِيطِ التَّوْصِيلِ العَصَبِيِّ وَرَسْمِ خَرِيطَةِ الجَسَدِ فِي الدِّمَاغِ",
            "correct": true
          },
          {
            "text": "لِلشُّعُورِ بِالنُّعَاسِ",
            "correct": false
          },
          {
            "text": "لِإِتْعَابِ المَفَاصِلِ",
            "correct": false
          },
          {
            "text": "لِتَبْرِيدِ المَعِدَةِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (نَجْمَةِ البَحْرِ وَالشَّرْنَقَةِ 3) عَلَى البِسَاطِ؟",
        "focusWord": "نَجْمَةُ البَحْرِ وَالشَّرْنَقَةُ",
        "options": [
          {
            "text": "يَسْتَلْقِي عَلَى ظَهْرِهِ وَيَفْتَحُ أَطْرَافَهُ كَالنَّجْمَةِ مَعَ الشَّهِيقِ، ثُمَّ يَضُمُّ رُكْبَتَيْهِ وَذِرَاعَيْهِ لِصَدْرِهِ كَالشَّرْنَقَةِ مَعَ الزَّفِيرِ",
            "correct": true
          },
          {
            "text": "يَقْفِزُ وَاقِفًا فِي الهَوَاءِ",
            "correct": false
          },
          {
            "text": "يَجْرِي حَوْلَ الطَّاوِلَةِ",
            "correct": false
          },
          {
            "text": "يَقِفُ عَلَى رَأْسِهِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا فَائِدَةُ تَمْرِينِ (الزَّحْفِ التَّبَادُلِيِّ الفِطْرِيِّ 7) وَتَمْرِينِ (الطَّائِرِ المُحَلِّقِ 6)؟",
        "focusWord": "الطَّائِرُ المُحَلِّقُ وَالزَّحْفُ التَّبَادُلِيُّ",
        "options": [
          {
            "text": "تَقْوِيَةُ عَضَلَاتِ الظَّهْرِ وَالرَّقَبَةِ، وَرَبْطُ نِصْفَيِ الدِّمَاغِ بِتَحْرِيكِ اليَدِ اليُمْنَى مَعَ الرُّكْبَةِ اليُسْرَى",
            "correct": true
          },
          {
            "text": "إِيذَاءُ الرُّكْبَتَيْنِ",
            "correct": false
          },
          {
            "text": "إِضْعَافُ التَّوَازُنِ",
            "correct": false
          },
          {
            "text": "تَعْطِيلُ التنَفُّسِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "رَشَفَاتُ المَاءِ الوَاعِيَةُ (1)",
          "left": "تَرْطِيبُ الدِّمَاغِ وَتَنْشِيطُ التَّوْصِيلِ العَصَبِيِّ"
        },
        {
          "right": "نَجْمَةُ البَحْرِ وَالشَّرْنَقَةُ (3)",
          "left": "فَتْحُ الأَطْرَافِ مَعَ الشَّهِيقِ وَضَمُّهَا مَعَ الزَّفِيرِ"
        },
        {
          "right": "الطَّائِرُ المُحَلِّقُ (6)",
          "left": "رَفْعُ الصَّدْرِ وَالأَطْرَافِ قَلِيلًا عَنِ الأَرْضِ لِتَقْوِيَةِ الظَّهْرِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الإِيقَاظِ الحِسِّيِّ وَالحَرَكَاتِ الأَرْضِيَّةِ التَّمْهِيدِيَّةِ:",
        "correct": [
          "رَشَفَاتُ المَاءِ الوَاعِيَةُ",
          "الضَّغْطُ العَمِيقُ لِلْمَفَاصِلِ",
          "نَجْمَةُ البَحْرِ وَالشَّرْنَقَةُ وَانْحِنَاءَةُ المَوْزَةِ",
          "الطَّائِرُ المُحَلِّقُ وَالزَّحْفُ التَّبَادُلِيُّ"
        ],
        "wrong": [
          "البَدْءُ بِالرِّيَاضَةِ دُونَ شُرْبِ مَاءٍ",
          "السُّقُوطُ العَنِيفُ عَلَى الأَرْضِ"
        ]
      },
      "applyStep": "أَبْدَأُ يَوْمِي بِرَشَفَاتِ المَاءِ الوَاعِيَةِ وَالضَّغْطِ اللَّطِيفِ عَلَى المَفَاصِلِ وَتَمْرِينِ نَجْمَةِ البَحْرِ وَالشَّرْنَقَةِ."
    }
  },
  {
    "w": 11,
    "secNum": 3,
    "heavenName": "سَمَاءُ الاثْنَيْنِ الثَّالِثَةُ (ط ي ك ل)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّالِثَةُ: عَالَمُ النَّبَاتِ وَالأَحْيَاءِ الدَّقِيقَةِ وَالمَنَاعَةِ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "ك",
    "jummal": 20,
    "prophet": "زَكَرِيَّا (ع)",
    "virtue": "الدُّعَاءُ",
    "unitHeader": "الوَحْدَةُ الحَادِيَةَ عَشْرَةَ : نَبِيُّ اللهِ زَكَرِيَّا (عَلَيْهِ السَّلَامُ)",
    "storyThird": "دَعَا نَبِيُّ اللهِ زَكَرِيَّا (ع) رَبَّهُ فِي المِحْرَابِ بِنِدَاءٍ خَفِيٍّ وَخُشُوعٍ أَنْ يَهَبَهُ وَلَدًا صَالِحًا، فَاسْتَجَابَ اللهُ دُعَاءَهُ وَبَشَّرَهُ بِيَحْيَى (ع).",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): اشْتِعَالُ الرَّأْسِ شَيْبًا فِي الكِبَرِ (﴿وَاشْتَعَلَ الرَّأْسُ شَيْبًا﴾) مَعَ سَكِينَةِ القَلْبِ بِالدُّعَاءِ؛ وَفِي المُقَابِلِ نَارُ الحِقْدِ وَالعُدْوَانِ فِي قُلُوبِ قَتَلَةِ الأَنْبِيَاءِ حِينَ طَارَدُوا زَكَرِيَّا بَعْدَ قَتْلِ ابْنِهِ يَحْيَى وَقَطَعُوا الشَّجَرَةَ بِالمِنْشَارِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): وَسْوَسَةُ إِبْلِيسَ الكَاذِبَةِ حِينَ ادَّعَى أَنَّ المُنَادِيَ فِي المِحْرَابِ شَيْطَانٌ فَقَطَعَهَا اللهُ بِآيَةِ الصَّمْتِ، وَبُهْتَانُ إِبْلِيسَ ضِدَّ زَكَرِيَّا عِنْدَ مَوْلِدِ عِيسَى فَبَرَّأَهُ اللهُ، وَمَكْرُهُ حِينَ أَمْسَكَ بِهُدْبَةِ ثَوْبِ زَكَرِيَّا لِيَدُلَّ الظَّالِمِينَ عَلَى الشَّجَرَةِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): تَفَكُّرُ زَكَرِيَّا العَقْلِيُّ حِينَ رَأَى فَاكِهَةَ الصَّيْفِ فِي الشِّتَاءِ وَفَاكِهَةَ الشِّتَاءِ فِي الصَّيْفِ فِي مِحْرَابِ مَرْيَمَ، وَوَضْعُهُ التُّرَابَ عَلَى جَبْهَتِهِ حُزْنًا عَلَى الحُسَيْنِ (عَلَيْهِ السَّلَامُ)، وَانْشِقَاقُ الشَّجَرَةِ الرَّاسِخَةِ فِي التُّرَابِ لِتَحْتَضِنَهُ، وَثَبَاتُهُ الكَامِلُ دَاخِلَهَا دُونَ تَأَوُّهٍ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): جَرَيَانُ قَلَمِ زَكَرِيَّا فِي مَاءِ نَهْرِ الأُرْدُنِّ عَكْسَ التَّيَّارِ لِيَفُوزَ بِكَفَالَةِ مَرْيَمَ، وَدُمُوعُهُ الخَاشِعَةُ فِي النِّدَاءِ الخَفِيِّ وَفِي مُصَابِ كَرْبَلَاءَ، وَعِفَّتُهُ فِي أَكْلِهِ مِنْ كَسْبِ يَدِهِ فِي مِهْنَةِ النِّجَارَةِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الاثْنَيْنِ الجَمِيلْ، يَأْتِي النَّبِيُّ الرَّقْمُ أَحَدَ عَشَرَ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلِ وَالسَّكِينَةِ وَالثَّبَاتْ، وَهُوَ نَبِيُّ اللهِ زَكَرِيَّا عَلَيْهِ السَّلَامْ. كَانَ مَنْبَتُهُ فِي أَرْضِ الشَّامِ وَبَيْتِ المَقْدِسْ، وَكَانَ شَيْخًا جَلِيلًا عَالِمًا يَحْفَظُ آيَاتِ اللهِ فِي كُلِّ كِتَابٍ مُنَزَّلْ، وَيَعْمَلُ بِيَدَيْهِ الكَرِيمَتَيْنِ فِي مِهْنَةِ النِّجَارَةِ لِيَأْكُلَ مِنْ كَسْبِ يَدِهِ الحَلَالِ وَيَتَصَدَّقَ عَلَى المَسَاكِينْ، فَكَانَ عَبْدًا شَكُورًا لِرَبِّ العَالَمِينْ. وَلَمَّا وُلِدَتِ السَّيِّدَةُ مَرْيَمُ العَذْرَاءُ يَتِيمَةً وَنَذَرَتْهَا أُمُّهَا حَنَّةُ لِخِدْمَةِ بَيْتِ المَقْدِسْ، تَنَافَسَ العُبَّادُ أَيُّهُمْ يَكْفُلُ مَرْيَمَ فِي الدَّارْ، فَذَهَبُوا إِلَى نَهْرِ الأُرْدُنِّ وَأَلْقَوْا أَقْلَامَهُمُ الخَشَبِيَّةَ فِي المَاءِ لِإِجْرَاءِ القُرْعَةْ، فَغَاصَتْ أَقْلَامُهُمْ جَمِيعًا إِلَّا قَلَمَ زَكَرِيَّا فَإِنَّهُ طَفَا فَوْقَ المَاءِ وَسَارَ عَكْسَ جَرَيَانِ النَّهْرِ بِآيَةٍ مِنَ المَلِكِ القَدِيرْ، وَبِذٰلِكَ كَفَلَ زَكَرِيَّا مَرْيَمَ لِأَنَّهُ نَبِيٌّ أَمِينٌ وَخَالَتُهَا هِيَ زَوْجَتُهُ الصَّالِحَةُ إِيشَاعْ.",
      "بَنَى زَكَرِيَّا بِيَدِهِ غُرْفَةً عَالِيَةً طَاهِرَةً فِي المَسْجِدِ هِيَ المِحْرَابُ وَكَانَ يُغْلِقُ عَلَيْهَا سَبْعَةَ أَبْوَابٍ لِتَتَعَبَّدَ فِيهِ مَرْيَمُ فِي سَتْرٍ وَعِفَّةٍ بَعِيدًا عَنِ الأَبْصَارْ، وَكَانَ كُلَّمَا فَتَحَ الأَبْوَابَ وَدَخَلَ عَلَيْهَا المِحْرَابَ وَجَدَ عِنْدَهَا رِزْقًا عَجِيبًا لَا يَجِدُهُ النَّاسُ، فَيَجِدُ عِنْدَهَا فَاكِهَةَ الصَّيْفِ فِي الشِّتَاءِ وَفَاكِهَةَ الشِّتَاءِ فِي الصَّيْفْ. فَسَأَلَهَا يَا مَرْيَمُ أَنَّى لَكِ هٰذَا الرِّزْقُ الطَّيِّبْ، قَالَتْ هُوَ مِنْ عِنْدِ اللهِ إِنَّ اللهَ يَرْزُقُ مَنْ يَشَاءُ بِغَيْرِ حِسَابْ. عِنْدَ ذٰلِكَ تَفَكَّرَ زَكَرِيَّا بِعَقْلِهِ وَخَافَ أَنْ يَخْلُوَ بَيْتُ النُّبُوَّةِ مِنْ بَعْدِهِ مِنْ وَصِيٍّ أَمِينٍ يَحْفَظُ الدِّينَ وَمَوَارِيثَ الأَنْبِيَاءْ، فَعَلِمَ أَنَّ القَادِرَ الَّذِي أَتَى بِالثِّمَارِ فِي غَيْرِ أَوَانِهَا قَادِرٌ عَلَى أَنْ يَرْزُقَهُ وَلَدًا صَالِحًا، فَهُوَ لَا يَشُكُّ أَبَدًا فِي قُدْرَةِ رَبِّهِ وَإِنْ بَلَغَ مِنْ الكِبَرِ عِتِيًّا وَوَهَنَ عَظْمُهُ وَاشْتَعَلَ رَأْسُهُ شَيْبًا وَكَانَتِ امْرَأَتُهُ عَاقِرًا لَا تَلِدْ.",
      "وَكَمَا رَوَى أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ سَأَلَ زَكَرِيَّا رَبَّهُ أَنْ يُعَلِّمَهُ أَسْمَاءَ الخَمْسَةِ الأَطْهَارِ أَصْحَابِ الكِسَاءْ، فَنَزَلَ جِبْرِيلُ وَعَلَّمَهُ إِيَّاهَا وَخَتَمَهَا بِحُرُوفِ النُّورِ كَافْ هَاءْ يَاءْ عَيْنْ صَادْ الَّتِي تَبْدَأُ بِحَرْفِ الكَافِ رَمْزِ أَرْضِ كَرْبَلَاءَ وَالصَّبْرِ العَظِيمْ، فَكَانَ زَكَرِيَّا إِذَا ذَكَرَ اسْمَ مُحَمَّدٍ وَعَلِيٍّ وَفَاطِمَةَ وَالحَسَنِ انْشَرَحَ صَدْرُهُ وَإِذَا ذَكَرَ اسْمَ الحُسَيْنِ فَاضَتْ عَيْنَاهُ بِالدُّمُوعْ. فَأَخْبَرَهُ جِبْرِيلُ بِمَا سَيَجْرِي عَلَى الحُسَيْنِ مِنْ عَطَشٍ وَصَبْرْ، فَوَضَعَ زَكَرِيَّا التُّرَابَ عَلَى جَبْهَتِهِ وَبَقِيَ ثَلَاثَةَ أَيَّامٍ فِي مَسْجِدِهِ يَبْكِي حُزْنًا وَدَعَا رَبَّهُ أَنْ يَرْزُقَهُ وَلَدًا تَقَرُّ بِهِ عَيْنُهُ فِي كِبَرِهِ ثُمَّ يُفْجَعُ بِهِ شَهِيدًا لِيُوَاسِيَ بِهِ حَبِيبَهُ النَّبِيَّ مُحَمَّدًا صَلَّى اللهُ عَلَيْهِ وَآلِهِ فِي مُصَابِ وَلَدِهِ الحُسَيْنْ.",
      "وَقَفَ زَكَرِيَّا فِي جَوْفِ اللَّيْلِ فِي أَطْهَرِ مَكَانٍ يُصَلِّي، وَتَوَكَّلَ عَلَى خَالِقِهِ وَنَادَى رَبَّهُ نِدَاءً خَفِيًّا بِالإِخْلَاصْ، وَقَالَ رَبِّ إِنِّي وَهَنَ العَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُنْ بِدُعَائِكَ رَبِّ مِنَ الخَائِبِينْ، فَهَبْ لِي مِنْ لَدُنْكَ وَلِيًّا يَرِثُنِي وَيَرِثُ مِنْ آلِ يَعْقُوبَ العِلْمَ وَالنُّبُوَّةَ وَاجْعَلْهُ رَبِّ رَضِيًّا فِي المُؤْمِنِينْ. فَنَادَاهُ مَلَكٌ كَرِيمٌ مَعَ المَلَائِكَةِ وَهُوَ قَائِمٌ يُصَلِّي فِي المِحْرَابِ أَنَّ اللهَ يُبَشِّرُكَ بِيَحْيَى مُصَدِّقًا بِكَلِمَةٍ مِنَ اللهِ وَسَيِّدًا وَحَصُورًا وَنَبِيًّا مِنَ الصَّالِحِينْ. فَجَاءَ إِبْلِيسُ يُحَاوِلُ أَنْ يُوَسْوِسَ لَهُ بِرِيحِ الوَهْمِ أَنَّ الصَّوْتَ لَمْ يَكُنْ مِنَ المَلَائِكَةِ الأَبْرَارْ، فَسَأَلَ زَكَرِيَّا رَبَّهُ أَنْ يَجْعَلَ لَهُ آيَةً وَعَلَامَةً تَقْطَعُ شَكَّ الوَسْوَاسْ، فَقَالَ اللهُ آيَتُكَ أَلَّا تُكَلِّمَ النَّاسَ ثَلَاثَةَ أَيَّامٍ إِلَّا رَمْزًا أَيْ بِالإِشَارَةِ بِيَدِكَ وَرَأْسِكَ وَأَنْتَ سَلِيمُ اللِّسَانِ مَعَ قُدْرَتِكَ عَلَى ذِكْرِ رَبِّكَ كَثِيرًا وَالتَّسْبِيحِ بِالعَشِيِّ وَالإِبْكَارْ.",
      "خَرَجَ زَكَرِيَّا عَلَى قَوْمِهِ مِنْ مِحْرَابِهِ المُبَارَكْ، فَأَشَارَ بِيَدِهِ إِلَيْهِمْ أَنْ سَبِّحُوا اللهَ بُكْرَةً وَعَشِيًّا، وَكَانَ يَخْرُجُ إِلَى تَسْبِيحِ رَبِّهِ مُبَكِّرًا فِي الصَّبَاحِ وَفِي المَسَاءْ. وَأَصْلَحَ اللهُ لَهُ زَوْجَتَهُ فَوَلَدَتْ لَهُ نَبِيَّ اللهِ يَحْيَى لِسِتَّةِ أَشْهُرٍ لِأَنَّهُمْ كَانُوا يُسَارِعُونَ فِي الخَيْرَاتِ وَيَدْعُونَ اللهَ رَغَبًا وَرَهَبًا وَكَانُوا لَهُ خَاشِعِينْ. وَعَاشَ زَكَرِيَّا يُرَبِّي وَلَدَهُ يَحْيَى بِالحَنَانِ وَالعِلْمِ لِأَنَّهُ أَبٌ حَكِيمٌ رَحِيمْ، وَحِينَ وَلَدَتْ مَرْيَمُ نَبِيَّ اللهِ عِيسَى وَحَاوَلَ إِبْلِيسُ رَمْيَ زَكَرِيَّا بِالبُهْتَانِ أَنْطَقَ اللهُ عِيسَى فِي المَهْدِ فَبَرَّأَ مَرْيَمَ وَزَكَرِيَّا التَّقِيَّ الكَرِيمْ، حَتَّى قَتَلَ الطَّاغِيَةُ وَلَدَهُ يَحْيَى ظُلْمًا فِي المِحْرَابْ، فَصَبَرَ زَكَرِيَّا وَاحْتَسَبَ أَجْرَهُ عِنْدَ المَلِكِ الغَفُورْ.",
      "ثُمَّ عَدَا الأَشْرَارُ مِنْ قَتَلَةِ الأَنْبِيَاءِ خَلْفَ زَكَرِيَّا لِيَقْتُلُوهُ مِنْ جَدِيدْ، فَمَشَى زَكَرِيَّا وَسَلَكَ طَرِيقَ البُسْتَانِ فَنَادَتْهُ شَجَرَةٌ كَبِيرَةٌ رَاسِخَةٌ فِي التُّرَابِ يَا نَبِيَّ اللهِ هَلُمَّ إِلَى الدَّاخِلْ، وَانْشَقَّ جِذْعُهَا بِإِذْنِ اللهِ فَدَخَلَ زَكَرِيَّا فِي جَوْفِهَا وَانْطَبَقَتْ عَلَيْهِ لِتَسْتُرَهُ وَتَحْمِيَهْ. لٰكِنَّ إِبْلِيسَ الخَبِيثَ جَاءَ وَأَمْسَكَ بِطَرَفِ ثَوْبِ زَكَرِيَّا حَتَّى بَقِيَتْ هُدْبَةٌ صَغِيرَةٌ مِنْ ثَوْبِهِ ظَاهِرَةً خَارِجَ الشَّجَرَةْ، ثُمَّ دَلَّ الأَعْدَاءَ الظَّالِمِينَ عَلَيْهِ وَأَوْحَى إِلَيْهِمْ أَنْ يَقْطَعُوا الشَّجَرَةَ بِالمِنْشَارْ. فَلَمَّا وَصَلَ المِنْشَارُ إِلَى رَأْسِ زَكَرِيَّا أَوْحَى اللهُ إِلَيْهِ أَنْ يَصْبِرَ وَلَا يَتَأَوَّهَ لِيَنَالَ أَعْلَى مَقَامِ الصَّابِرِينْ، فَكَبَتَ زَكَرِيَّا أَلَمَهُ وَلَمْ يَنْطِقْ بِأَنَّةٍ وَاحِدَةٍ حَتَّى لَقِيَ اللهَ شَهِيدًا كَامِلًا فِي صَبْرِهِ وَطَاعَتِهِ مَعَ ابْنِهِ يَحْيَى فِي أَعْلَى جِنَانِ الخُلْدْ."
    ],
    "words": [
      {
        "word": "يَكْفُلُ",
        "desc": "وسط متصل / ساكن: ـكْـ",
        "raw": "يَكْفُلُ (وسط متصل / ساكن: ـكْـ)"
      },
      {
        "word": "المُبَارَكْ",
        "desc": "آخر منفصل / ساكن وقفا: كْ",
        "raw": "المُبَارَكْ (آخر منفصل / ساكن وقفا: كْ)"
      },
      {
        "word": "كَفَلَ",
        "desc": "أول منفصل / متحرك بالفتح: كَـ",
        "raw": "كَفَلَ (أول منفصل / متحرك بالفتح: كَـ)"
      },
      {
        "word": "الكِبَرِ",
        "desc": "أول متصل / متحرك بالفتح: ـكَـ",
        "raw": "الكِبَرِ (أول متصل / متحرك بالفتح: ـكَـ)"
      },
      {
        "word": "مَكَانٍ",
        "desc": "وسط متصل / متحرك بالفتح: ـكَـ",
        "raw": "مَكَانٍ (وسط متصل / متحرك بالفتح: ـكَـ)"
      },
      {
        "word": "زَكَرِيَّا",
        "desc": "وسط منفصل / متحرك بالفتح: كَـ",
        "raw": "زَكَرِيَّا (وسط منفصل / متحرك بالفتح: كَـ)"
      },
      {
        "word": "سَلَكَ",
        "desc": "آخر متصل / متحرك بالفتح: ـكَ",
        "raw": "سَلَكَ (آخر متصل / متحرك بالفتح: ـكَ)"
      },
      {
        "word": "كُلَّمَا",
        "desc": "أول منفصل / متحرك بالضم: كُـ",
        "raw": "كُلَّمَا (أول منفصل / متحرك بالضم: كُـ)"
      },
      {
        "word": "مَلَكٌ",
        "desc": "آخر متصل / متحرك بالضم: ـكٌ",
        "raw": "مَلَكٌ (آخر متصل / متحرك بالضم: ـكٌ)"
      },
      {
        "word": "كِتَابٍ",
        "desc": "أول منفصل / متحرك بالكسر: كِـ",
        "raw": "كِتَابٍ (أول منفصل / متحرك بالكسر: كِـ)"
      },
      {
        "word": "تَوَكَّلَ",
        "desc": "وسط متصل / مضعف بالفتح: ـكَّـ",
        "raw": "تَوَكَّلَ (وسط متصل / مضعف بالفتح: ـكَّـ)"
      },
      {
        "word": "يَشُكُّ",
        "desc": "آخر متصل / مضعف بالضم: ـكُّ",
        "raw": "يَشُكُّ (آخر متصل / مضعف بالضم: ـكُّ)"
      },
      {
        "word": "مُبَكِّرًا",
        "desc": "وسط متصل / مضعف بالكسر: ـكِّـ",
        "raw": "مُبَكِّرًا (وسط متصل / مضعف بالكسر: ـكِّـ)"
      },
      {
        "word": "كَامِلًا",
        "desc": "أول منفصل / ممدود بالألف: كَا",
        "raw": "كَامِلًا (أول منفصل / ممدود بالألف: كَا)"
      },
      {
        "word": "شَكُورًا",
        "desc": "وسط متصل / ممدود بالواو: ـكُو",
        "raw": "شَكُورًا (وسط متصل / ممدود بالواو: ـكُو)"
      },
      {
        "word": "حَكِيمٌ",
        "desc": "وسط متصل / ممدود بالياء: ـكِي",
        "raw": "حَكِيمٌ (وسط متصل / ممدود بالياء: ـكِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الكَافِ (ك): النُّطْقُ السَّلِيمُ لِحَرْفِ الكَافِ مِنْ مَخْرَجِ أَقْصَى اللِّسَانِ مَعَ الحَنَكِ الأَعْلَى، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الدُّعَاءِ الخَفِيِّ الخَاشِعِ، وَآدَابِ الصَّمْتِ عَنِ الفُضُولِ وَالشَّكْوَى، وَالتَّسْبِيحِ بِالعَشِيِّ وَالإِبْكَارِ، وَالتَّوَسُّلِ بِأَسْمَاءِ أَصْحَابِ الكِسَاءِ الخَمْسَةِ (عَلَيْهِمُ السَّلَامُ)."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "زَاوِيَةُ المِحْرَابِ وَالشَّارَةُ الدَّاخِلِيَّةُ وَالمُتَوَازِيَانِ (11): مُشَاهَدَةُ شَكْلِ حَرْفِ الكَافِ (ك) الَّذِي يَنْتَصِبُ ثُمَّ يَنْبَسِطُ كَالمِحْرَابِ الحَاضِنِ وَفِي دَاخِلِهِ شَارَةُ الكَافِ الصَّغِيرَةُ (ء) كَالمُصَلِّي القَائِمِ فِي المِحْرَابِ أَوْ كَزَكَرِيَّا دَاخِلَ الشَّجَرَةِ، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (11) المُرَكَّبِ مِنْ خَطَّيْنِ عَمُودِيَّيْنِ مُتَوَازِيَيْنِ (كَعَمُودَيِ المِحْرَابِ أَوْ كَالأَبِ زَكَرِيَّا وَابْنِهِ يَحْيَى)، وَالتَّعَرُّفُ عَلَى لُغَةِ الإِشَارَةِ البَصَرِيَّةِ (الرَّمْزِ)."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ زَكَرِيَّا الكَامِلَةُ وَالتَّمْيِيزُ بَيْنَ نِدَاءِ المَلَكِ وَوَسْوَسَةِ الوَهْمِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ زَكَرِيَّا، وَتَدْرِيبُ الأُذُنِ وَالعَقْلِ عَلَى التَّمْيِيزِ بَيْنَ صَوْتِ الحَقِّ وَوَسْوَسَةِ البَاطِلِ، وَالإِنْصَاتِ فِي أَوْقَاتِ الصَّمْتِ وَالتَّأَمُّلِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ أَحَدَ عَشَرَ (11) وَالعِشْرُونَ (20): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (11) وَمَعْرِفَةِ قِيمَةِ الكَافِ العَشْرِيَّةِ (20 = عَشَرَتَانِ كَامِلَتَانِ لِليَدَيْنِ وَالرِّجْلَيْنِ)، وَرَسْمِ حَرْفِ الكَافِ بِأَشْكَالِهِ (كـ / ـكـ / ـك / ك)، وَتَدْرِيبُ اليَدِ عَلَى مِهْنَةِ النِّجَارَةِ الشَّرِيفَةِ، وَإِحْكَامِ إِغْلَاقِ الأَبْوَابِ لِلْحِفْظِ وَالأَمَانَةِ، وَالتَّعْبِيرِ بِلُغَةِ الإِشَارَةِ الهَادِفَةِ (﴿إِلَّا رَمْزًا﴾)."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ القِيَامِ المُتَوَازِنِ وَالمَشْيِ الصَّامِتِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ الوُقُوفِ الصَّحِيحِ لِتَقْوِيَةِ عِظَامِ السَّاقَيْنِ وَالرُّكْبَتَيْنِ (كَمَا قَامَ زَكَرِيَّا يُصَلِّي فِي المِحْرَابِ رَغْمَ كِبَرِ سِنِّهِ)، وَتَمْرِينِ «المَشْيِ الهَادِئِ الصَّامِتِ» بِخُطُوَاتٍ مُتَوَازِنَةٍ، وَالجَرْيِ السَّرِيعِ عِنْدَ الحَاجَةِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ فَوَاكِهِ الصَّيْفِ وَالشِّتَاءِ وَطِيبِ الكَسْبِ اليَدَوِيِّ: تَعَلُّمُ تَصْنِيفِ ثِمَارِ الفُصُولِ (فَاكِهَةِ الصَّيْفِ وَفَاكِهَةِ الشِّتَاءِ) وَكَيْفَ تَحْفَظُ صِحَّةَ البَدَنِ وَتُقَوِّي العِظَامَ عِنْدَ الكِبَرِ، وَإِدْرَاكِ قِيمَةِ الأَكْلِ مِنْ عَمَلِ اليَدِ الحَلَالِ كَمَا كَانَ زَكَرِيَّا يَعْمَلُ نَجَّارًا لِيَأْكُلَ وَيُطْعِمَ أَهْلَهُ وَالفُقَرَاءَ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الكَفَالَةِ وَالمِحْرَابِ وَالصَّبْرِ الكَامِلِ: تَعَلُّمُ آدَابِ رِعَايَةِ الأَيْتَامِ وَصَوْنِ السَّتْرِ وَالحَيَاءِ (كَمَا أَغْلَقَ زَكَرِيَّا سَبْعَةَ أَبْوَابٍ عَلَى مِحْرَابِ السَّيِّدَةِ مَرْيَمَ حِفْظًا لَهَا)، وَالتَّنَزُّهِ عَنْ بُهْتَانِ الأَشْرَارِ، وَحِفْظِ طَرَفِ الثَّوْبِ وَنَظَافَتِهِ، وَالصَّبْرِ وَالتَّسْلِيمِ التَّامِّ لِأَمْرِ اللهِ دُونَ جَزَعٍ أَوْ تَأَوُّهٍ."
      }
    },
    "grammar": {
      "topic": "الجُمْلَةُ الفِعْلِيَّةُ: تَبْدَأُ بِفِعْلٍ",
      "rule": "الجُمْلَةُ الفِعْلِيَّةُ هِيَ كُلُّ جُمْلَةٍ تَبْدَأُ بِفِعْلٍ، وَتَتَكَوَّنُ مِنْ رُكْنَيْنِ أَسَاسِيَّيْنِ هُمَا: الفِعْلُ وَالفَاعِلْ.",
      "example": "كَتَبَ التِّلْمِيذُ الدَّرْسَ — شَكَرَ العَبْدُ رَبَّهُ.",
      "focusWord": "كَتَبَ التِّلْمِيذُ",
      "q": "أَيُّ جُمْلَةٍ مِنْ هٰذِهِ الجُمَلِ هِيَ «جُمْلَةٌ فِعْلِيَّةٌ» تَبْدَأُ بِفِعْلْ؟",
      "opts": [
        "كَتَبَ التِّلْمِيذُ الدَّرْسَ",
        "الكِتَابُ مُفِيدٌ",
        "الكَعْبَةُ مُشَرَّفَةٌ",
        "الشَّمْسُ سَاطِعَةٌ"
      ]
    },
    "earIirab": {
      "topic": "رَفْعُ الفَاعِلِ بِالضَّمَّةِ الظَّاهِرَةِ (ـُ)",
      "rule": "الفَاعِلُ هُوَ مَنْ قَامَ بِالفِعْلِ، وَيَكُونُ مَرْفُوعًا دَائِمًا بِالضَّمَّةِ (ـُ) عَلَى آخِرِهْ.",
      "sentence": "كَتَبَ الكَاتِبُ الحِكْمَةَ.",
      "targetWord": "الكَاتِبُ",
      "caseAns": "فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 21,
      "numName": "وَاحِدٌ وَعِشْرُونَ",
      "eqDisplay": "1 + 20 = 21",
      "subDisplay": "21 - 1 = 20",
      "compDisplay": "21 > 20",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (21) بِالعَرَبِيَّةِ؟",
        "focus": "21",
        "ans": "وَاحِدٌ وَعِشْرُونَ",
        "wrong": [
          "اثْنَا عَشَرَ",
          "عِشْرُونَ",
          "وَاحِدٌ وَثَلَاثُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ تَرْكِيبَ الآحَادِ وَالعَشَرَاتِ:",
        "focus": "1 + 20 = ؟",
        "ans": "21 (وَاحِدٌ وَعِشْرُونَ)",
        "wrong": [
          "12",
          "20",
          "31"
        ]
      }
    },
    "sport": {
      "title": "المِشْيَةُ المُتَقَاطِعَةُ لِتَنْشِيطِ الذَّاكِرَةِ",
      "middleText": "أَرْفَعُ رُكْبَتِي اليُمْنَى وَأَلْمِسُهَا بِمِرْفَقِ يَدِي اليُسْرَى ثُمَّ أُبَدِّلُ بِانْتِظَامْ. يُنَشِّطُ هٰذَا التَّقَاطُعُ الحَرَكِيُّ مَرَاكِزَ القِرَاءَةِ وَالحِسَابِ فِي الدِّمَاغْ."
    },
    "sci": {
      "title": "المَنَاعَةُ وَالوِقَايَةُ مِنْ عَالَمِ الفَيْرُوسَاتِ",
      "summaryThird": "الفَيْرُوسَاتُ كَائِنَاتٌ دَقِيقَةٌ جِدًّا قَدْ تُسَبِّبُ الزُّكَامَ، وَنَحْمِي أَجْسَامَنَا مِنْهَا بِغَسْلِ اليَدَيْنِ بِالمَاءِ وَالصَّابُونِ وَتَنَاوُلِ الفَوَاكِهِ الغَنِيَّةِ بِالفِيتَامِينَاتْ.",
      "focusConcept": "الوِقَايَةُ وَالنَّظَافَةُ",
      "factAns": "حِمَايَةُ الجِسْمِ مِنَ الفَيْرُوسَاتِ وَالأَمْرَاضْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الصَّلَاةِ وَالخُشُوعِ (حُور وَسُرُور - 11)",
      "storySentence": "تَوَضَّأَ سُرُورٌ وَوَقَفَ مَعَ حُورَ فِي الصَّلَاةِ بِسَكِينَةٍ، وَتَعَلَّمَا أَنَّ حَقَّ الصَّلَاةِ هُوَ إِقَامَتُهَا فِي وَقْتِهَا بِطَهَارَةٍ وَإِقْبَالٍ بِالقَلْبِ عَلَى اللهْ.",
      "applyAction": "أُحَافِظُ عَلَى صَلَاتِي فِي وَقْتِهَا بِوُضُوءٍ مُتْقَنٍ وَخُشُوعْ."
    },
    "rightsFullTitle": "(11) حق الصوم",
    "rightsQuote": "وَأَمَّا حَقُّ الصَّوْمِ فَأَنْ تَعْلَمَ أَنَّهُ حِجَابٌ ضَرَبَهُ اللهُ عَلَى لِسَانِكَ وَسَمْعِكَ وبَصَرِكَ وَفَرْجِكَ وبَطْنِكَ لِيَسْتر’َكَ بهِ مِن النَّارِ وَهَكَذَا جَاءَ فِي الْحَديثِ “الصَّوْمُ جُنَّةٌ مِنَ النَّارِ” فَإنْ سَكَنَتْ أَطْرَافُـكَ فِي حَجَبَتِهَا3 رَجَوْتَ أَنْ تَكُونَ مَحْجُوبًا. وَإنْ أَنْتَ تَرَكْتَهَا تَضْطَرِبُ فِي حِجَابهَا وتَرْفَعُ جَنَبَاتِ الْحِجَاب فَتُطّلِعُ إلَى مَا لَيْسَ لَهَا بالنَّظْرَةِ الدَّاعِيـَةِ لِلشَّهْوَةِ وَالقُوَّةِ الْخَارِجَةِ عَنْ حَدِّ التَّقِيَّةِ للهِ لَمْ تَأمَنْ أَنْ تَخرِقَ الْحِجَابَ وَتَخرُجَ مِنْهُ. وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (11) حق الصوم",
        "text": "وَأَمَّا حَقُّ الصَّوْمِ فَأَنْ تَعْلَمَ أَنَّهُ حِجَابٌ ضَرَبَهُ اللهُ عَلَى لِسَانِكَ وَسَمْعِكَ وبَصَرِكَ وَفَرْجِكَ وبَطْنِكَ لِيَسْتر’َكَ بهِ مِن النَّارِ وَهَكَذَا جَاءَ فِي الْحَديثِ “الصَّوْمُ جُنَّةٌ مِنَ النَّارِ” فَإنْ سَكَنَتْ أَطْرَافُـكَ فِي حَجَبَتِهَا3 رَجَوْتَ أَنْ تَكُونَ مَحْجُوبًا. وَإنْ أَنْتَ تَرَكْتَهَا تَضْطَرِبُ فِي حِجَابهَا وتَرْفَعُ جَنَبَاتِ الْحِجَاب فَتُطّلِعُ إلَى مَا لَيْسَ لَهَا بالنَّظْرَةِ الدَّاعِيـَةِ لِلشَّهْوَةِ وَالقُوَّةِ الْخَارِجَةِ عَنْ حَدِّ التَّقِيَّةِ للهِ لَمْ تَأمَنْ أَنْ تَخرِقَ الْحِجَابَ وَتَخرُجَ مِنْهُ. وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ زَكَرِيَّا (ع): آدَابُ الكَفَالَةِ وَالمِحْرَابِ وَالصَّبْرِ الكَامِلِ: تَعَلُّمُ آدَابِ رِعَايَةِ الأَيْتَامِ وَصَوْنِ السَّتْرِ وَالحَيَاءِ (كَمَا أَغْلَقَ زَكَرِيَّا سَبْعَةَ أَبْوَابٍ عَلَى مِحْرَابِ السَّيِّدَةِ مَرْيَمَ حِفْظًا لَهَا)، وَالتَّنَزُّهِ عَنْ بُهْتَانِ الأَشْرَارِ، وَحِفْظِ طَرَفِ الثَّوْبِ وَنَظَافَتِهِ، وَالصَّبْرِ وَالتَّسْلِيمِ التَّامِّ لِأَمْرِ اللهِ دُونَ جَزَعٍ أَوْ تَأَوُّهٍ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصوم",
        "text": "في ليلةٍ من ليالي شعبان الهادئة، خرجت حور مع عائلتها إلى الشرفة، يبحثون عن الهلال. وفجأة صاح أخوها فرحًا: \"انظري يا حور! الهلال هناك، صغير مثل خيطٍ من نور!\" ضحكت حور وقالت: \"غدًا سنصوم! كم أنا متحمّسة!\" قال أخوها بحماس: \"وأنا أيضًا! أحب شهر الصيام رغم الجوع والعطش، لأنه يجعلني أشعر أني أقوى وأنظف من الداخل.\" ابتسمت الأم وقالت: \"أحسنت يا بُنيّ، فالصيام ليس فقط عن الطعام والشراب، بل عن كل ما يؤذي قلوبنا. إنه حجابٌ نحتمي به ليحمينا الله من النار.\" نظرت حور متعجّبة: \"حجاب؟ يعني مثل الغطاء؟\" أجابت الأم: \"نعم، لكنه غطاء من نورٍ يغطي لسانك، وعينك، وأذنك، وبطنك، حتى تحفظك من الخطأ.\" 🩵 في الصباح: استيقظت العائلة على صوت الأم تنادي للسحور. جلسوا يأكلون، فقالت حور بابتسامة: \"أريد أن أكون اليوم صائمةً حقيقية، لا جائعة فقط!\" ضحك أخوها وقال: \"ما رأيك أن نقرأ بعد الفجر صفحة من القرآن؟ إنه يساعدنا على الصبر ويقوّي قلوبنا.\" قالت الأم: \"فكرة جميلة… فالصبر زينة الصيام، ومن صبر نال الحجاب الكامل.\" 💧 في منتصف النهار: اشتدّ الحر، وعطشت حور كثيرًا. جاءت أختها الصغيرة تريد اللعب، فقالت حور بانزعاج:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصوم",
        "text": "\"اذهبي الآن، أنا متعبة!\" جلست الصغيرة حزينة، ونظرت إلى الأرض. بعد لحظات، شعرت حور بالندم، فاقتربت منها وقالت برقة: \"تعالي يا حبيبتي، أرسم لك هلالًا لتلوّنيه، مثل الذي رأيناه أمس في السماء.\" فرحت الصغيرة، وركضت نحو أمها تُريها الرسم. ابتسمت الأم وقالت وهي تقرأ آية: \"كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ.\" 🌅 عند الغروب: جلس الجميع حول المائدة، ينتظرون الأذان. نظر الأخ إلى الطعام وقال بحسرة: \"كم أشتاق لقضم تمرتي الأولى!\" قالت حور: \"اصبر يا أخي، ما بقي إلا دقائق. الصبر نصف الحجاب!\" ضحك الأب وقال: \"جميل ما قلتِ يا حور. الله يعلمنا في الصيام كيف نتحكم بأجسادنا، لا أن تتحكم هي بنا.\" رنّ صوت الأذان، فابتسم الجميع وقالوا: \"بسم الله!\" وأخذوا أول لقمة، فشعروا بفرحٍ غامرٍ وسلامٍ داخلي. قالت حور وهي تمسك يد أمها: \"الآن فهمت معنى الصوم… إنه حجاب يجعل قلبي أنقى، لا بطني فارغًا فقط.\" ابتسمت الأم، وقالت: \"بارك الله فيكِ يا صغيرتي، من حفظ حجابه في الصوم، حفظه الله من النار.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّالِثَةُ: النَّبَاتُ وَالأَحْيَاءُ الدَّقِيقَةُ",
      "topic": "الدَّرْسَانِ (5 وَ6): العَتَائِقُ — الفَيْرُوسَاتُ",
      "coverImg": "assets/y7/scince/s11.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s11.1.jpg",
          "text": "الدَّرْسُ (5) العَتَائِقُ: كَائِنَاتٌ دَقِيقَةٌ لَهَا جِدَارٌ خَلَوِيٌّ وَسَوْطٌ وَتُقَاوِمُ الظُّرُوفَ القَاسِيَةَ جِدًّا؛ فَمِنْهَا مَا يَتَحَمَّلُ الحَرَارَةَ وَالحُمُوضَةَ الشَّدِيدَةَ فِي اليَنَابِيعِ الحَارَّةِ، وَمِنْهَا المُحِبَّةُ لِلْمُلُوحَةِ الشَّدِيدَةِ، وَالمُنْتِجَةُ لِغَازِ المِيثَانِ، وَتُفِيدُ فِي إِنْتَاجِ الغَازِ الحَيَوِيِّ وَمُعَالَجَةِ المِيَاهِ."
        },
        {
          "img": "assets/y7/scince/s11.2.jpg",
          "text": "الدَّرْسُ (6) الفَيْرُوسَاتُ: تَتَكَوَّنُ مِنْ مَادَّةٍ وِرَاثِيَّةٍ وَمِحْفَظَةٍ وَأَشْوَاكٍ بُرُوتِينِيَّةٍ، وَلَا تَنْشَطُ إِلَّا دَاخِلَ خَلَايَا الكَائِنَاتِ الحَيَّةِ. مِنْهَا فَيْرُوسَاتٌ تَنَفُّسِيَّةٌ (الإِنْفِلْوَنْزَا)، وَفَيْرُوسَاتُ الطَّفْحِ، وَآكِلُ البَكْتِيرْيَا (البَكْتِيرْيُوفَاجُ)؛ وَالمُضَادَّاتُ الحَيَوِيَّةُ لَا تَقْتُلُ الفَيْرُوسَاتِ بَلْ نَحْمِي أَنْفُسَنَا بِاللَّقَاحَاتِ وَالنَّظَافَةِ."
        }
      ],
      "text": "الدَّرْسُ (5) العَتَائِقُ: كَائِنَاتٌ دَقِيقَةٌ لَهَا جِدَارٌ خَلَوِيٌّ وَسَوْطٌ وَتُقَاوِمُ الظُّرُوفَ القَاسِيَةَ جِدًّا؛ فَمِنْهَا مَا يَتَحَمَّلُ الحَرَارَةَ وَالحُمُوضَةَ الشَّدِيدَةَ فِي اليَنَابِيعِ الحَارَّةِ، وَمِنْهَا المُحِبَّةُ لِلْمُلُوحَةِ الشَّدِيدَةِ، وَالمُنْتِجَةُ لِغَازِ المِيثَانِ، وَتُفِيدُ فِي إِنْتَاجِ الغَازِ الحَيَوِيِّ وَمُعَالَجَةِ المِيَاهِ. الدَّرْسُ (6) الفَيْرُوسَاتُ: تَتَكَوَّنُ مِنْ مَادَّةٍ وِرَاثِيَّةٍ وَمِحْفَظَةٍ وَأَشْوَاكٍ بُرُوتِينِيَّةٍ، وَلَا تَنْشَطُ إِلَّا دَاخِلَ خَلَايَا الكَائِنَاتِ الحَيَّةِ. مِنْهَا فَيْرُوسَاتٌ تَنَفُّسِيَّةٌ (الإِنْفِلْوَنْزَا)، وَفَيْرُوسَاتُ الطَّفْحِ، وَآكِلُ البَكْتِيرْيَا (البَكْتِيرْيُوفَاجُ)؛ وَالمُضَادَّاتُ الحَيَوِيَّةُ لَا تَقْتُلُ الفَيْرُوسَاتِ بَلْ نَحْمِي أَنْفُسَنَا بِاللَّقَاحَاتِ وَالنَّظَافَةِ.",
      "q1": {
        "q": "بِمَاذَا تَتَمَيَّزُ العَتَائِقُ عَنْ غَيْرِهَا مِنَ الكَائِنَاتِ الدَّقِيقَةِ؟",
        "focusWord": "مُقَاوَمَةُ القَسْوَةِ",
        "options": [
          {
            "text": "تَحَمُّلُ الحَرَارَةِ وَالحُمُوضَةِ وَالمُلُوحَةِ الشَّدِيدَةِ فِي اليَنَابِيعِ وَالبُحَيْرَاتِ المَالِحَةِ",
            "correct": true
          },
          {
            "text": "العَيْشُ دَاخِلَ الزُّهُورِ فَقَطْ",
            "correct": false
          },
          {
            "text": "الطَّيَرَانُ بِالأَجْنِحَةِ",
            "correct": false
          },
          {
            "text": "التَّنَفُّسُ بِالخَيَاشِيمِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "أَيْنَ تَنْشَطُ الفَيْرُوسَاتُ وَتَتَكَاثَرُ؟",
        "focusWord": "دَاخِلَ خَلَايَا الكَائِنَاتِ",
        "options": [
          {
            "text": "تَنْشَطُ وَتَتَكَاثَرُ دَاخِلَ خَلَايَا الكَائِنَاتِ الحَيَّةِ فَقَطْ",
            "correct": true
          },
          {
            "text": "تَنْمُو كَالأَشْجَارِ فِي الغَابَاتِ",
            "correct": false
          },
          {
            "text": "تَتَغَذَّى عَلَى الصُّخُورِ النَّارِيَّةِ",
            "correct": false
          },
          {
            "text": "تُقْتَلُ بِالمُضَادَّاتِ الحَيَوِيَّةِ البَكْتِيرِيَّةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الفَيْرُوسُ النَّافِعُ الَّذِي يُسَمَّى (آكِلَ البَكْتِيرْيَا) وَيُنَظِّمُ مُجْتَمَعَاتِ المِيكْرُوبَاتِ؟",
        "focusWord": "البَكْتِيرْيُوفَاجُ",
        "options": [
          {
            "text": "البَكْتِيرْيُوفَاجُ (آكِلُ البَكْتِيرْيَا)",
            "correct": true
          },
          {
            "text": "فَيْرُوسُ الإِنْفِلْوَنْزَا",
            "correct": false
          },
          {
            "text": "الأَمِيبَا",
            "correct": false
          },
          {
            "text": "عِيشُ الغُرَابِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "العَتَائِقُ",
          "left": "تَعِيشُ فِي اليَنَابِيعِ الحَارَّةِ وَالبُحَيْرَاتِ الشَّدِيدَةِ المُلُوحَةِ"
        },
        {
          "right": "البَكْتِيرْيُوفَاجُ",
          "left": "فَيْرُوسٌ آكِلٌ لِلْبَكْتِيرْيَا يُنَظِّمُ المِيكْرُوبَاتِ"
        },
        {
          "right": "الوِقَايَةُ مِنَ الفَيْرُوسَاتِ",
          "left": "اللَّقَاحَاتُ وَتَقْوِيَةُ المَنَاعَةِ وَغَسْلُ اليَدَيْنِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرِ الحَقَائِقَ الصَّحِيحَةَ عَنِ العَتَائِقِ وَالفَيْرُوسَاتِ:",
        "correct": [
          "العَتَائِقُ تَتَحَمَّلُ الحَرَارَةَ وَالمُلُوحَةَ",
          "الفَيْرُوسُ لَهُ مِحْفَظَةٌ وَمَادَّةٌ وِرَاثِيَّةٌ",
          "اللَّقَاحَاتُ تَحْمِي مِنَ الفَيْرُوسَاتِ",
          "المُضَادَّاتُ الحَيَوِيَّةُ لَا تَقْتُلُ الفَيْرُوسَاتِ"
        ],
        "wrong": [
          "أَخْذُ مُضَادٍّ حَيَوِيٍّ بِدُونِ اسْتِشَارَةِ الطَّبِيبِ",
          "إِهْمَالُ النَّظَافَةِ عِنْدَ الزُّكَامِ"
        ]
      },
      "applyStep": "أَحْرِصُ عَلَى النَّظَافَةِ وَتَقْوِيَةِ المَنَاعَةِ وَلَا أَتَنَاوَلُ المُضَادَّاتِ الحَيَوِيَّةَ إِلَّا بِأَمْرِ الطَّبِيبِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt11.jpg",
      "title": "تَمَارِينُ الجُمْبَازِ الفَمَوِيِّ وَاللِّسَانِيِّ (المَجْمُوعَةُ التَّمْهِيدِيَّةُ الثَّانِيَةُ: 8..14)",
      "subtitle": "7 دَقَائِقَ يَوْمِيًّا لِتَهْيِئَةِ مَخَارِجِ النُّطْقِ، تَقْوِيَةِ عَضَلَاتِ الوَجْهِ وَاللِّسَانِ، وَضَبْطِ التَّنَفُّسِ!",
      "slideText": "🗣️ تَمَارِينُ الجُمْبَازِ الفَمَوِيِّ وَاللِّسَانِيِّ (المَجْمُوعَةُ التَّمْهِيدِيَّةُ الثَّانِيَةُ — 7 دَقَائِقَ يَوْمِيًّا): (8) خُدُودُ البَالُونِ (مَلْءُ الخَدَّيْنِ بِالهَوَاءِ وَنَقْلُهُ بَيْنَ الأَيْمَنِ وَالأَيْسَرِ لـ10 ثَوَانٍ). (9) مَسَّاحَةُ اللِّسَانِ (تَمْرِيرُ اللِّسَانِ دَائِرِيًّا فَوْقَ الأَسْنَانِ مِنْ الدَّاخِلِ). (10) بُوصَلَةُ اللِّسَانِ فِي الأَرْبَعِ جِهَاتٍ. (11) طَقْطَقَةُ الفَرَسِ بِإِلْصَاقِ اللِّسَانِ بِسَقْفِ الحَلْقِ. (12) الأَسَدُ وَالسَّمَكَةُ لِتَقْوِيَةِ عَضَلَاتِ الوَجْهِ وَالشَّفَتَيْنِ. (13) النَّفْخُ المُوَجَّهُ لِكُرَةٍ قُطْنِيَّةٍ فِي مَسَارٍ. (14) رَفْرَفَةُ الشِّفَاهِ مَعَ الزَّفِيرِ المُرِيحِ.",
      "q1": {
        "q": "مَا الهَدَفُ مِنْ تَمَارِينِ الجُمْبَازِ الفَمَوِيِّ وَاللِّسَانِيِّ قَبْلَ القِرَاءَةِ وَالنُّطْقِ؟",
        "focusWord": "تَهْيِئَةُ مَخَارِجِ النُّطْقِ",
        "options": [
          {
            "text": "تَهْيِئَةُ مَخَارِجِ النُّطْقِ، وَتَقْوِيَةُ عَضَلَاتِ الوَجْهِ وَاللِّسَانِ، وَضَبْطُ طُولِ النَّفَسِ",
            "correct": true
          },
          {
            "text": "تَقْوِيَةُ عَضَلَاتِ السَّاقَيْنِ",
            "correct": false
          },
          {
            "text": "تَعَلُّمُ الجَرْيِ السَّرِيعِ",
            "correct": false
          },
          {
            "text": "إِجْهَادُ الحَنْجَرَةِ بِالصُّرَاخِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (مَسَّاحَةِ اللِّسَانِ 9) وَتَمْرِينَ (طَقْطَقَةِ الفَرَسِ 11)؟",
        "focusWord": "مَسَّاحَةُ اللِّسَانِ وَطَقْطَقَةُ الفَرَسِ",
        "options": [
          {
            "text": "يُمَرِّرُ لِسَانَهُ دَائِرِيًّا فَوْقَ أَسْنَانِهِ مِنَ الدَّاخِلِ، وَيُلْصِقُ لِسَانَهُ بِسَقْفِ حَلْقِهِ ثُمَّ يُطْلِقُهُ كَصَوْتِ الفَرَسِ",
            "correct": true
          },
          {
            "text": "يَعَضُّ لِسَانَهُ بِقُوَّةٍ",
            "correct": false
          },
          {
            "text": "يَحْبِسُ نَفَسَهُ دُونَ حَرَكَةٍ",
            "correct": false
          },
          {
            "text": "يَشْرَبُ مَاءً مُثَلَّجًا",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَاذَا يُعَلِّمُنَا تَمْرِينُ (النَّفْخِ المُوَجَّهِ 13) لِكُرَةٍ قُطْنِيَّةٍ خَفِيفَةٍ دَاخِلَ مَسَارٍ مَرْسُومٍ؟",
        "focusWord": "النَّفْخُ المُوَجَّهُ",
        "options": [
          {
            "text": "التَّحَكُّمَ فِي طُولِ النَّفَسِ وَتَوْجِيهَ الزَّفِيرِ بِبُطْءٍ وَدِقَّةٍ",
            "correct": true
          },
          {
            "text": "النَّفْخَ العَشْوَائِيَّ القَوِيَّ",
            "correct": false
          },
          {
            "text": "سُرْعَةَ الرَّكْضِ",
            "correct": false
          },
          {
            "text": "رَفْعَ الأَثْقَالِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "خُدُودُ البَالُونِ (8)",
          "left": "نَقْلُ الهَوَاءِ بَيْنَ الخَدِّ الأَيْمَنِ وَالأَيْسَرِ بِالتَّنَاوُبِ"
        },
        {
          "right": "الأَسَدُ وَالسَّمَكَةُ (12)",
          "left": "فَتْحُ الفَمِ بِاتِّسَاعٍ ثُمَّ ضَمُّ الشَّفَتَيْنِ لِلْأَمَامِ بِالتَّنَاوُبِ"
        },
        {
          "right": "النَّفْخُ المُوَجَّهُ (13)",
          "left": "تَحْرِيكُ كُرَةٍ قُطْنِيَّةٍ فِي مَسَارٍ لِلتَّحَكُّمِ فِي طُولِ النَّفَسِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الجُمْبَازِ الفَمَوِيِّ وَاللِّسَانِيِّ لِلفَصَاحَةِ:",
        "correct": [
          "خُدُودُ البَالُونِ وَمَسَّاحَةُ اللِّسَانِ",
          "بُوصَلَةُ اللِّسَانِ وَطَقْطَقَةُ الفَرَسِ",
          "الأَسَدُ وَالسَّمَكَةُ",
          "النَّفْخُ المُوَجَّهُ وَرَفْرَفَةُ الشِّفَاهِ"
        ],
        "wrong": [
          "الصُّرَاخُ المُؤْذِي لِلْأَحْبَالِ الصَّوْتِيَّةِ",
          "التَّكَلُّمُ بِسُرْعَةٍ دُونَ تَنَفُّسٍ"
        ]
      },
      "applyStep": "أُطَبِّقُ تَمَارِينَ الجُمْبَازِ الفَمَوِيِّ وَاللِّسَانِيِّ (خُدُودَ البَالُونِ وَمَسَّاحَةَ اللِّسَانِ وَطَقْطَقَةَ الفَرَسِ) قَبْلَ قِرَاءَةِ القِصَّةِ."
    }
  },
  {
    "w": 12,
    "secNum": 3,
    "heavenName": "سَمَاءُ الاثْنَيْنِ الثَّالِثَةُ (ط ي ك ل)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الثَّالِثَةُ: عَالَمُ النَّبَاتِ وَالأَحْيَاءِ الدَّقِيقَةِ وَالمَنَاعَةِ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "ل",
    "jummal": 30,
    "prophet": "إِسْمَاعِيلُ (ع)",
    "virtue": "الطَّاعَةُ",
    "unitHeader": "الوَحْدَةُ الثَّانِيَةَ عَشْرَةَ : نَبِيُّ اللهِ إِسْمَاعِيلُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "أَطَاعَ نَبِيُّ اللهِ إِسْمَاعِيلُ (ع) رَبَّهُ وَوَالِدَهُ إِبْرَاهِيمَ (ع) بِصَبْرٍ جَمِيلٍ، وَتَعَاوَنَا مَعًا فِي رَفْعِ قَوَاعِدِ الكَعْبَةِ المُشَرَّفَةِ وَالدُّعَاءِ لِلأُمَّةْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ): حَرَارَةُ العَطَشِ فِي وَادِي مَكَّةَ القَاحِلِ قَبْلَ نَبْعِ زَمْزَمَ، وَتَذَمُّرُ الزَّوْجَةِ الأُولَى وَسُخْطُهَا عَلَى المَعِيشَةِ، وَمُحَاوَلَةُ إِبْلِيسَ إِثَارَةَ الخَوْفِ وَالعِصْيَانِ عِنْدَ المَذْبَحِ فَرُجِمَ بِالجَمَرَاتِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَسْوَسَةِ الَّتِي نَفَثَهَا إِبْلِيسُ لِإِبْرَاهِيمَ وَهَاجَرَ وَإِسْمَاعِيلَ لِيُوهِمَهُمْ أَنَّ الرُّؤْيَا شَيْطَانِيَّةٌ فَرَدُّوهُ بِاليَقِينِ، وَطَيَرَانُ الطَّيْرِ فِي الهَوَاءِ فَوْقَ الوَادِي دَلِيلًا صَادِقًا لِقَبِيلَةِ جُرْهُمَ عَلَى وُجُودِ المَاءِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): رَكْضُ إِسْمَاعِيلَ بِعَقِبِهِ عَلَى تُرَابِ مَكَّةَ، وَتَحْوِيطُ السَّيِّدَةِ هَاجَرَ لِلْمَاءِ بِالتُّرَابِ، وَثَبَاتُ إِسْمَاعِيلَ سَنَةً كَامِلَةً فِي مَكَانِهِ وَفَاءً بِوَعْدِهِ، وَرَفْعُهُ قَوَاعِدَ الكَعْبَةِ المُشَرَّفَةِ مِنْ صُخُورِ الجِبَالِ الخَمْسَةِ مَعَ أَبِيهِ إِبْرَاهِيمَ، وَدَفْنُهُ فِي حِجْرِ إِسْمَاعِيلَ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): تَفَجُّرُ مَاءِ زَمْزَمَ العَذْبِ المُبَارَكِ، وَانْسِيَابُ إِسْمَاعِيلَ فِي الطَّاعَةِ وَالحِلْمِ وَالتَّسْلِيمِ كَالْمَاءِ الصَّافِي حِينَ قَالَ: ﴿يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ سَتَجِدُنِي إِنْ شَاءَ اللَّهُ مِنَ الصَّابِرِينَ﴾، وَشُكْرُ الزَّوْجَةِ الثَّانِيَةِ الصَّالِحَةِ الَّتِي قَدَّمَتِ اللَّبَنَ وَالمَاءَ وَغَسَلَتْ رَأْسَ الخَلِيلِ.",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ الاثْنَيْنِ الجَمِيلْ، يَأْتِي النَّبِيُّ الرَّقْمُ اثْنَا عَشَرَ عَلَى عَدَدِ شُهُورِ السَّنَةِ الكَامِلَةِ لِيُتِمَّ دَوْرَةَ الطَّبَائِعِ الأَرْبَعِ فِي مَنْزِلَةِ المَاءِ وَالطَّاعَةِ وَالتَّسْلِيمْ، وَهُوَ ذَبِيحُ اللهِ وَصَادِقُ الوَعْدِ نَبِيُّ اللهِ إِسْمَاعِيلُ عَلَيْهِ السَّلَامْ. اسْتَجَابَ اللهُ دُعَاءَ أَبِيهِ إِبْرَاهِيمَ الخَلِيلِ حِينَ سَأَلَ رَبَّهُ أَنْ يَهَبَ لَهُ مِنَ الصَّالِحِينَ فَبَشَّرَهُ اللهُ بِغُلَامٍ ذِي حِلْمٍ وَأَنَاةٍ وَصَبْرٍ كَبِيرْ، وُلِدَ مِنْ أُمِّهِ الطَّاهِرَةِ السَّيِّدَةِ هَاجَرَ لِيَكُونَ جَدَّ النَّبِيِّ الخَاتَمِ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَآلِهِ الأَطْهَارْ. وَبِأَمْرٍ مِنَ اللهِ سَارَ الخَلِيلُ بِزَوْجَتِهِ هَاجَرَ وَطِفْلِهِ الرَّضِيعِ عَلَى البُرَاقِ وَمَعَهُمْ جِبْرِيلُ حَتَّى أَسْكَنَهُمَا فِي وَادِي مَكَّةَ عِنْدَ بَيْتِ اللهِ المُحَرَّمِ حَيْثُ لَا زَرْعَ هُنَاكَ وَلَا مَاءْ، فَقَالَتْ هَاجَرُ بِإِيمَانٍ وَتَسْلِيمٍ إِذَنْ لَا يُضَيِّعُنَا اللهُ أَبَدًا.",
      "وَلَمَّا نَفِدَ المَاءُ وَعَطِشَ الطِّفْلُ الصَّغِيرُ سَعَتْ أُمُّهُ هَاجَرُ بِرِجْلَيْهَا بَيْنَ جَبَلَيِ الصَّفَا وَالمَرْوَةِ سَبْعَةَ أَشْوَاطٍ تَطْلُبُ الغَوْثَ مِنْ رَبِّ العِبَادْ، فَـلَطَفَ اللهُ بِهِمَا وَأَرْسَلَ المَلَكَ جِبْرِيلَ عِنْدَ مَوْضِعِ زَمْزَمْ، وَرَكَضَ الطِّفْلُ بِعَقِبِ رِجْلِهِ عَلَى التُّرَابِ فَتَفَجَّرَتْ عَيْنُ مَاءِ زَمْزَمَ الصَّافِيَةُ تَفُورُ بِالبَرَكَةِ وَالشِّفَاءْ. فَجَعَلَتْ هَاجَرُ تَحُوطُ المَاءَ بِالتُّرَابِ بِيَدَيْهَا وَتَقُولُ زُمِّي زُمِّي لِئَلَّا يَسِيحَ فِي الوَادِي، فَشَرِبَا وَعَاشَا فِي أَمَانْ. وَرَأَتْ قَبِيلَةُ جُرْهُمَ العَرَبِيَّةُ الطُّيُورَ تَحُومُ فِي الهَوَاءِ فَعَلِمُوا بِعُقُولِهِمْ أَنَّهَا تَطِيرُ فَوْقَ مَاءٍ عَذْبْ، فَاسْتَأْذَنُوا السَّيِّدَةَ هَاجَرَ بِأَدَبٍ أَنْ يَسْكُنُوا جِوَارَهَا فَأَذِنَتْ لَهُمْ، وَنَشَأَ الصَّبِيُّ بَيْنَهُمْ فَأَلْهَمَهُ اللهُ وَفَتَقَ مَنْطِقَهُ بِأَفْصَحِ لِسَانٍ وَأَجْمَلِ لُغَةٍ عَرَبِيَّةٍ مُبِينَةْ، وَكَانَ أَوَّلَ مَنْ ذَلَّلَ الخَيْلَ البَرِّيَّةَ بَعْدَ أَنْ كَانَتْ وَحْشِيَّةً فَرَكِبَهَا بِفُرُوسِيَّةٍ وَمَهَارَةٍ وَأَتْقَنَ الرِّمَايَةَ بِالقَوْسِ وَالسِّهَامْ.",
      "وَلَمَّا كَبِرَ الغُلَامُ وَبَلَغَ مَعَ أَبِيهِ السَّعْيَ فِي الحَيَاةِ وَالعِبَادَةْ، رَأَى إِبْرَاهِيمُ فِي مَنَامِهِ لَيْلَةَ التَّرْوِيَةِ أَنَّهُ يَذْبَحُ ابْنَهُ امْتِحَانًا عَظِيمًا مِنْ رَبِّ العَالَمِينْ، وَقَالَ لَهُ يَا بُنَيَّ إِنِّي أَرَى فِي المَنَامِ أَنِّي أَذْبَحُكَ فَانْظُرْ مَاذَا تَرَى. فَأَجَابَ الفَتَى الصَّابِرُ بِطَاعَةٍ صَافِيَةٍ كَالمَاءِ النَّقِيِّ يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ سَتَجِدُنِي إِنْ شَاءَ اللهُ مِنَ الصَّابِرِينْ. وَجَاءَ إِبْلِيسُ فِي صُورَةِ شَيْخٍ يَنْفُخُ رِيحَ الوَهْمِ لِيَمْنَعَ إِبْرَاهِيمَ وَهَاجَرَ وَالابْنَ عَنْ طَاعَةِ اللهْ، فَرَدُّوهُ بِيَقِينِهِمْ وَرَجَمُوهُ بِسَبْعِ حَصَيَاتٍ عِنْدَ الجَمَرَاتِ الثَّلَاثِ فِي مِنًى. وَطَلَبَ الابْنُ البَارُّ مِنْ أَبِيهِ بِأَدَبٍ أَنْ يَشُدَّ رِبَاطَ يَدَيْهِ وَيَكُبَّهُ عَلَى جَبِينِهِ حَتَّى لَا تَأْخُذَهُ الرَّأْفَةُ عِنْدَ النَّظَرِ إِلَى وَجْهِهْ، وَأَنْ يَحْمِلَ قَمِيصَهُ إِلَى أُمِّهِ هَاجَرَ لِيُسَلِّيَ فُؤَادَهَا الحَنُونْ. فَلَمَّا أَسْلَمَا لِأَمْرِ اللهِ وَتَلَّهُ لِلْجَبِينِ وَوَضَعَ السِّكِّينَ، انْقَلَبَتِ السِّكِّينُ بِأَمْرِ اللهِ وَلَمْ تَقْطَعْ، وَنَادَاهُ اللهُ يَا إِبْرَاهِيمُ قَدْ صَدَّقْتَ الرُّؤْيَا إِنَّا كَذٰلِكَ نَجْزِي المُحْسِنِينْ، وَفَدَاهُ اللهُ بِكَبْشٍ أَمْلَحَ عَظِيمٍ رَعَى فِي الجَنَّةِ أَرْبَعِينَ خَرِيفًا لِيَبْقَى الفِدَاءُ سُنَّةً فِي الحَجِّ وَتَذْكِيرًا بِالفِدَاءِ الأَعْظَمِ لِسِبْطِ النُّبُوَّةِ الإِمَامِ الحُسَيْنِ عَلَيْهِ السَّلَامْ.",
      "تَزَوَّجَ نَبِيُّ اللهِ امْرَأَةً مِنْ قَوْمِهِ فَزَارَهُمْ أَبُوهُ إِبْرَاهِيمُ عَلَى البُرَاقِ وَسَأَلَهَا عَنْ حَالِهِمْ وَالابْنُ غَائِبٌ فِي الصَّيْدِ وَالكَسْبْ، فَشَكَتِ الفَقْرَ وَلَمْ تَشْكُرْ نِعْمَةَ اللهِ وَلَمْ تُكْرِمِ الضَّيْفْ، فَأَوْصَى إِبْرَاهِيمُ أَنْ يُغَيِّرَ الابْنُ عَتَبَةَ بَابِهْ. فَفَهِمَ الابْنُ بِعَقْلِهِ وَصِيَّةَ أَبِيهِ وَفَارَقَهَا وَتَزَوَّجَ امْرَأَةً ثَانِيَةً صَالِحَةً كَرِيمَةً مِنْ جُرْهُمَ، فَلَمَّا زَارَهُمْ إِبْرَاهِيمُ حَمِدَتِ اللهَ وَشَكَرَتْ نِعْمَتَهُ وَقَدَّمَتْ لَهُ اللَّبَنَ وَاللَّحْمَ الطَّيِّبَ وَغَسَلَتْ رَأْسَهُ بِالمَاءِ الطَّهُورِ وَهُوَ وَاقِفٌ عَلَى حَجَرِ المَقَامِ فَأَوْصَى ابْنَهُ أَنْ يُثَبِّتَ عَتَبَةَ بَابِهِ المُبَارَكَةْ. ثُمَّ عَادَ الخَلِيلُ وَتَعَاوَنَ مَعَ ابْنِهِ فِي رَفْعِ قَوَاعِدِ الكَعْبَةِ المُشَرَّفَةِ وَإِتْقَانِ العَمَلْ، فَكَانَ الابْنُ يَحْمِلُ الحِجَارَةَ بِيَدَيْهِ القَوِيَّتَيْنِ وَيُنَاوِلُهَا أَبَاهُ وَوَضَعَا الحَجَرَ الأَسْوَدَ فِي رُكْنِهِ وَهُمَا يَدْعُوَانِ رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ العَلِيمُ وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَابْعَثْ فِيهِمْ رَسُولًا مِنْهُمْ عَلَّمَ النَّاسَ الكِتَابَ وَالحِكْمَةَ وَزَكَّاهُمْ، فَاسْتَجَابَ اللهُ دُعَاءَهُمَا بِبِعْثَةِ خَاتَمِ المُرْسَلِينْ.",
      "وَكَانَ نَبِيُّ اللهِ مَشْهُورًا بِصِدْقِ الوَعْدِ كَمَا رَوَى الإِمَامُ الصَّادِقُ عَلَيْهِ السَّلَامْ، فَقَدْ وَاعَدَ رَجُلًا أَنْ يَنْتَظِرَهُ فِي مَكَانٍ فَنَسِيَ الرَّجُلُ المَوْعِدْ، فَلَزِمَ نَبِيُّ اللهِ مَكَانَهُ سَنَةً كَامِلَةً يَعْبُدُ اللهَ وَيُصَلِّي حَتَّى عَادَ الرَّجُلُ بَعْدَ عَامٍ فَوَجَدَهُ وَاقِفًا فِي انْتِظَارِهْ، فَأَثْنَى اللهُ عَلَيْهِ فِي القُرْآنِ الكَرِيمِ إِنَّهُ كَانَ صَادِقَ الوَعْدِ وَكَانَ رَسُولًا نَبِيًّا، وَكَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ وَكَانَ عِنْدَ رَبِّهِ مَرْضِيًّا. وَجَعَلَ اللهُ فِي ذُرِّيَّتِهِ البَرَكَةَ فَرَزَقَهُ اثْنَيْ عَشَرَ وَلَدًا نَقِيبًا وُلِدُوا مِنْ نَسْلِ خَيْرِ وَلَدٍ وَغُلَامٍ حَلِيمٍ مُطِيعٍ لِرَبِّهْ، وَلَاحَ نُورُ التَّوْحِيدِ فِي قُلُوبِ المُؤْمِنِينَ بِدَعْوَتِهِ الَّتِي ظَلَّتْ نِبْرَاسًا يَدُلُّ النَّاسَ عَلَى الخَيْرِ وَالطَّهَارَةْ، حَتَّى أَوْصَى بِمَوَارِيثِ النُّبُوَّةِ وَدُفِنَ جَسَدُهُ الطَّاهِرُ مَعَ أُمِّهِ السَّيِّدَةِ هَاجَرَ فِي حِجْرِ الكَعْبَةِ المُشَرَّفَةِ فِي أَطْهَرِ بُقْعَةٍ مِنَ الأَرْضْ."
    ],
    "words": [
      {
        "word": "حِلْمٍ",
        "desc": "وسط متصل / ساكن: ـلْـ",
        "raw": "حِلْمٍ (وسط متصل / ساكن: ـلْـ)"
      },
      {
        "word": "العَمَلْ",
        "desc": "آخر متصل / ساكن وقفا: ـلْ",
        "raw": "العَمَلْ (آخر متصل / ساكن وقفا: ـلْ)"
      },
      {
        "word": "لَطَفَ",
        "desc": "أول منفصل / متحرك بالفتح: لَـ",
        "raw": "لَطَفَ (أول منفصل / متحرك بالفتح: لَـ)"
      },
      {
        "word": "فَلَزِمَ",
        "desc": "أول متصل / متحرك بالفتح: ـلَـ",
        "raw": "فَلَزِمَ (أول متصل / متحرك بالفتح: ـلَـ)"
      },
      {
        "word": "بَلَغَ",
        "desc": "وسط متصل / متحرك بالفتح: ـلَـ",
        "raw": "بَلَغَ (وسط متصل / متحرك بالفتح: ـلَـ)"
      },
      {
        "word": "وَلَدٍ",
        "desc": "وسط منفصل / متحرك بالفتح: لَـ",
        "raw": "وَلَدٍ (وسط منفصل / متحرك بالفتح: لَـ)"
      },
      {
        "word": "جَعَلَ",
        "desc": "آخر متصل / متحرك بالفتح: ـلَ",
        "raw": "جَعَلَ (آخر متصل / متحرك بالفتح: ـلَ)"
      },
      {
        "word": "لُغَةٍ",
        "desc": "أول منفصل / متحرك بالضم: لُـ",
        "raw": "لُغَةٍ (أول منفصل / متحرك بالضم: لُـ)"
      },
      {
        "word": "إِسْمَاعِيلُ",
        "desc": "آخر متصل / متحرك بالضم: ـلُ",
        "raw": "إِسْمَاعِيلُ (آخر متصل / متحرك بالضم: ـلُ)"
      },
      {
        "word": "لِسَانٍ",
        "desc": "أول منفصل / متحرك بالكسر: لِـ",
        "raw": "لِسَانٍ (أول منفصل / متحرك بالكسر: لِـ)"
      },
      {
        "word": "عَلَّمَ",
        "desc": "وسط متصل / مضعف بالفتح: ـلَّـ",
        "raw": "عَلَّمَ (وسط متصل / مضعف بالفتح: ـلَّـ)"
      },
      {
        "word": "يَدُلُّ",
        "desc": "آخر متصل / مضعف بالضم: ـلُّ",
        "raw": "يَدُلُّ (آخر متصل / مضعف بالضم: ـلُّ)"
      },
      {
        "word": "يُصَلِّي",
        "desc": "وسط متصل / مضعف بالكسر: ـلِّـ",
        "raw": "يُصَلِّي (وسط متصل / مضعف بالكسر: ـلِّـ)"
      },
      {
        "word": "لَاحَ",
        "desc": "أول منفصل / ممدود بالألف: لَا",
        "raw": "لَاحَ (أول منفصل / ممدود بالألف: لَا)"
      },
      {
        "word": "قُلُوبِ",
        "desc": "وسط متصل / ممدود بالواو: ـلُو",
        "raw": "قُلُوبِ (وسط متصل / ممدود بالواو: ـلُو)"
      },
      {
        "word": "حَلِيمٍ",
        "desc": "وسط متصل / ممدود بالياء: ـلِي",
        "raw": "حَلِيمٍ (وسط متصل / ممدود بالياء: ـلِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ اللَّامِ (ل): النُّطْقُ السَّلِيمُ لِحَرْفِ اللَّامِ مِنْ مَخْرَجِ أَدْنَى حَافَّتَيِ اللِّسَانِ إِلَى مُنْتَهَى طَرَفِهِ مَعَ مَا يُحَاذِيهِ مِنْ لِثَةِ الأَسْنَانِ العُلْيَا، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَمَعْرِفَةُ أَنَّ إِسْمَاعِيلَ هُوَ أَوَّلُ مَنْ فَتَقَ اللهُ لِسَانَهُ بِالعَرَبِيَّةِ الفُصْحَى المُبِينَةِ، وَتَعْوِيدُ اللِّسَانِ عَلَى «صِدْقِ الوَعْدِ» وَالشُّكْرِ وَالدُّعَاءِ القُرْآنِيِّ: ﴿رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ﴾."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "العَمُودُ القَائِمُ وَالحَوْضُ المُنْحَنِي وَالشَّكْلُ الاثْنَا عَشَرِيُّ: مُشَاهَدَةُ شَكْلِ حَرْفِ اللَّامِ (ل) الَّذِي يَبْدَأُ عَمُودِيًّا شَامِخًا كَجِدَارِ الكَعْبَةِ ثُمَّ يَنْحَنِي فِي أَسْفَلِهِ كَحَوْضِ بِئْرِ زَمْزَمَ وَكَعَتَبَةِ البَابِ وَحِجْرِ إِسْمَاعِيلَ نِصْفِ الدَّائِرِيِّ، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى «الشَّكْلِ الاثْنَيْ عَشَرِيِّ» ذِي الأَضْلَاعِ الاثْنَيْ عَشَرَ، وَتَدْرِيبُ العَيْنِ عَلَى قِرَاءَةِ دَلَائِلِ الطَّبِيعَةِ (كَرُؤْيَةِ الطَّيْرِ فِي السَّمَاءِ دَلِيلًا عَلَى المَاءِ)."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ الذَّبِيحِ صَادِقِ الوَعْدِ وَطَاعَةُ الوَالِدَيْنِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ إِسْمَاعِيلَ الكَامِلَةِ، وَتَدْرِيبُ الأُذُنِ عَلَى حُسْنِ اسْتِمَاعِ أَمْرِ الوَالِدَيْنِ وَفَهْمِ وَصَايَا الحُكَمَاءِ (كَمَا فَقِهَ إِسْمَاعِيلُ وَصِيَّةَ أَبِيهِ فِي تَغْيِيرِ عَتَبَةِ بَابِهِ ثُمَّ تَثْبِيتِهَا)، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ اثْنَا عَشَرَ (12) وَالثَّلَاثُونَ (30): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (12) وَمَعْرِفَةِ قِيمَةِ اللَّامِ (30 = عَدَدُ أَيَّامِ الشَّهْرِ الكَامِلِ)، وَإِدْرَاكُ مَفْهُومِ الاثْنَيْ عَشَرَ فِي القِصَّةِ وَالكَوْنِ (النَّبِيُّ الثَّانِيَ عَشَرَ، اكْتِمَالُ السَّمَاءِ الثَّالِثَةِ بِـ 12 نَبِيًّا، شُهُورُ السَّنَةِ الـ 12، وَأَبْنَاءُ إِسْمَاعِيلَ الـ 12 نَقِيبًا)، وَتَدْرِيبُ اليَدِ عَلَى مَهَارَةِ البِنَاءِ وَمُنَاوَلَةِ الحِجَارَةِ، وَالرِّمَايَةِ بِالقَوْسِ، وَإِعْطَاءِ الزَّكَاةِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ الرَّكْضِ وَالسَّعْيِ وَالفُرُوسِيَّةِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ الدَّفْعِ بِالعَقِبِ وَالسَّعْيِ بَيْنَ الصَّفَا وَالمَرْوَةِ، وَرِيَاضَةِ الفُرُوسِيَّةِ وَتَثْبِيتِ القَدَمَيْنِ عِنْدَ رُكُوبِ الخَيْلِ (إِذْ كَانَ إِسْمَاعِيلُ أَوَّلَ مَنْ ذَلَّلَ الخَيْلَ البَرِّيَّةَ وَرَكِبَهَا)، وَالوُقُوفِ الصَّابِرِ الثَّابِتِ وَفَاءً بِالمَوْعِدِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ مَاءِ زَمْزَمَ وَاللَّبَنِ وَاللَّحْمِ وَشُكْرِ النِّعْمَةِ: تَعَلُّمُ الخَصَائِصِ العِلْمِيَّةِ وَالمَعْدِنِيَّةِ الفَرِيدَةِ لِمَاءِ زَمْزَمَ الَّذِي لَا يَنْضَبُ وَأَنَّهُ «طَعَامُ طُعْمٍ وَشِفَاءُ سُقْمٍ»، وَفَوَائِدِ الغِذَاءِ الكَامِلِ مِنَ اللَّبَنِ وَاللَّحْمِ الطَّيِّبِ، وَأَدَبِ الرِّضَا وَالشُّكْرِ عَلَى الرِّزْقِ الحَلَالِ وَإِكْرَامِ الضَّيْفِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ صِدْقِ الوَعْدِ وَالبِرِّ وَأَمْرِ الأَهْلِ بِالصَّلَاةِ وَالزَّكَاةِ: تَعَلُّمُ خُلُقِ الوَفَاءِ التَّامِّ بِالوَعْدِ، وَبِرِّ الوَالِدَيْنِ وَإِكْرَامِ الأُمِّ (كَمَا طَلَبَ إِسْمَاعِيلُ إِرْسَالَ قَمِيصِهِ لِأُمِّهِ هَاجَرَ)، وَتَطْهِيرِ البَيْتِ وَالكَعْبَةِ، وَأَمْرِ الأُسْرَةِ بِالمُحَافَظَةِ عَلَى الصَّلَاةِ وَالزَّكَاةِ وَالعِفَّةِ وَشُكْرِ المُنْعِمِ."
      }
    },
    "grammar": {
      "topic": "أَزْمِنَةُ الفِعْلِ (1): الفِعْلُ المَاضِي المَبْنِيُّ عَلَى الفَتْحْ",
      "rule": "الفِعْلُ المَاضِي يَدُلُّ عَلَى عَمَلٍ حَدَثَ وَانْتَهَى، وَتَكُونُ حَرَكَةُ آخِرِهِ الفَتْحَةَ (ـَ).",
      "example": "لَعِبَ الطِّفْلُ — رَفَعَ إِبْرَاهِيمُ القَوَاعِدَ — نَزَلَ المَطَرُ.",
      "focusWord": "رَفَعَ",
      "q": "أَيُّ فِعْلٍ مِنْ هٰذِهِ الأَفْعَالِ هُوَ «فِعْلٌ مَاضٍ» حَدَثَ وَانْتَهَى؟",
      "opts": [
        "رَفَعَ",
        "يَرْفَعُ",
        "اِرْفَعْ",
        "الرَّفْعُ"
      ]
    },
    "earIirab": {
      "topic": "الفَتْحَةُ عَلَى الفِعْلِ المَاضِي وَالضَّمَّةُ عَلَى الفَاعِلْ",
      "rule": "فِي جُمْلَةِ الفِعْلِ المَاضِي نَسْمَعُ الفَتْحَةَ فِي آخِرِ الفِعْلِ (ـَ) تَتْبَعُهَا الضَّمَّةُ فِي آخِرِ الفَاعِلِ (ـُ).",
      "sentence": "لَمَعَ البَرْقُ فِي السَّمَاءِ.",
      "targetWord": "البَرْقُ",
      "caseAns": "فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 32,
      "numName": "اثْنَانِ وَثَلَاثُونَ",
      "eqDisplay": "2 + 30 = 32",
      "subDisplay": "32 - 2 = 30",
      "compDisplay": "32 > 23",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (32) بِالعَرَبِيَّةِ؟",
        "focus": "32",
        "ans": "اثْنَانِ وَثَلَاثُونَ",
        "wrong": [
          "ثَلَاثَةٌ وَعِشْرُونَ",
          "ثَلَاثُونَ",
          "اثْنَانِ وَأَرْبَعُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "32 - 2 = ؟",
        "ans": "30 (ثَلَاثُونَ)",
        "wrong": [
          "20 (عِشْرُونَ)",
          "23",
          "34"
        ]
      }
    },
    "sport": {
      "title": "قُبَّعَةُ التَّفْكِيرِ وَتَدْلِيكُ الأُذُنِ",
      "middleText": "أُدَلِّكُ حَوَافَّ أُذُنَيَّ الخَارِجِيَّةَ بِأَصَابِعِي مِنَ الأَعْلَى إِلَى الأَسْفَلِ بِلُطْفٍ ثَلَاثَ مَرَّاتْ. يُوقِظُ هٰذَا التَّمْرِينُ حَاسَّةَ السَّمْعِ وَيَزِيدُ الِانْتِبَاهَ السَّمْعِيَّ لِلإِعْرَابِ وَالأَصْوَاتْ."
    },
    "sci": {
      "title": "مُخْتَبَرُ النَّبَاتِ: الزَّهْرَةُ المُلَوَّنَةُ وَتَنَفُّسُ الخَمِيرَةِ",
      "summaryThird": "تُظْهِرُ تَجْرِبَةُ الزَّهْرَةِ البَيْضَاءِ فِي المَاءِ المُلَوَّنِ كَيْفَ تَنْقُلُ الأَنَابِيبُ الشَّعْرِيَّةُ فِي السَّاقِ المَاءَ لِلأَوْرَاقِ، بَيْنَمَا تَتَغَذَّى الخَمِيرَةُ النَّافِعَةُ لِتَرْفَعَ العَجِينْ.",
      "focusConcept": "الأَنَابِيبُ النَّاقِلَةُ فِي السَّاقِ",
      "factAns": "رَفْعُ المَاءِ وَالغِذَاءِ إِلَى الزَّهْرَةِ وَالأَوْرَاقْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الصَّوْمِ وَالصَّبْرِ (حُور وَسُرُور - 12)",
      "storySentence": "تَعَلَّمَتْ حُورُ أَنَّ الصَّوْمَ دِرْعٌ يَحْمِي الإِنْسَانَ وَيُعَلِّمُهُ الصَّبْرَ وَالشُّعُورَ بِالجَائِعِينَ، وَأَنَّ الصَّوْمَ الحَقِيقِيَّ يَشْمَلُ كَفَّ اللِّسَانِ وَالجَوَارِحِ عَنِ الأَذَى.",
      "applyAction": "أُدَرِّبُ نَفْسِي عَلَى الصَّبْرِ وَضَبْطِ النَّفْسِ وَمُسَاعَدَةِ الفُقَرَاءْ."
    },
    "rightsFullTitle": "(12) حق الحج",
    "rightsQuote": "وَأَمَّا حَقُّ الحَجّ أَنْ تَعْلَمَ أَنّه وِفادةٌ إلى رَبّكَ، و فِرارٌ إليه من ذُنوبكَ وفيهِ قبولُ تَوبتِكَ وقَضاءُ الفَرضِ الَّذي أوجَبَه الله عَليك.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (12) حق الحج",
        "text": "وَأَمَّا حَقُّ الحَجّ أَنْ تَعْلَمَ أَنّه وِفادةٌ إلى رَبّكَ، و فِرارٌ إليه من ذُنوبكَ وفيهِ قبولُ تَوبتِكَ وقَضاءُ الفَرضِ الَّذي أوجَبَه الله عَليك. — وَفِي سِيرَةِ إِسْمَاعِيلُ (ع): آدَابُ صِدْقِ الوَعْدِ وَالبِرِّ وَأَمْرِ الأَهْلِ بِالصَّلَاةِ وَالزَّكَاةِ: تَعَلُّمُ خُلُقِ الوَفَاءِ التَّامِّ بِالوَعْدِ، وَبِرِّ الوَالِدَيْنِ وَإِكْرَامِ الأُمِّ (كَمَا طَلَبَ إِسْمَاعِيلُ إِرْسَالَ قَمِيصِهِ لِأُمِّهِ هَاجَرَ)، وَتَطْهِيرِ البَيْتِ وَالكَعْبَةِ، وَأَمْرِ الأُسْرَةِ بِالمُحَافَظَةِ عَلَى الصَّلَاةِ وَالزَّكَاةِ وَالعِفَّةِ وَشُكْرِ المُنْعِمِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الحج",
        "text": "🌟 القصة: “حور والوفادة إلى الله – رحلة الحج في المدرسة” في صباح مشمس، دخلت حور إلى المدرسة وهي متحمسة أكثر من أي يوم آخر. قالت لنفسها: “اليوم سيحدث شيء مختلف… أسبوع الحج!” التقت أصدقائها في الساحة، حيث كانت المعلمة قد زينت المكان بشكل جميل، وأعدت مكعبًا أسود يمثل الكعبة. ابتسمت المعلمة وقالت: “أطفالنا الأعزاء، اليوم سنقوم برحلة الحج… ليس إلى مكة، بل في قلوبنا وأرواحنا أولاً.” حور شعرت بالدهشة: “معنى ذلك أننا سنذهب إلى بيت الله بقلوبنا قبل أجسادنا!” 🕊️ بداية الرحلة: الإحرام وزعت المعلمة أقمصة بيضاء على الجميع وقالت: “هذا لباس الإحرام، يذكركم أن تتركوا الشجار والكلام السيئ، وأن تكون قلوبكم صافية.” ارتدت حور قميصها الأبيض وتمنت في نفسها: “يا رب، أريد أن أبدأ بيوم نظيف مثل صفحة بيضاء.” 🔄 الطواف حول الكعبة بدأ الأطفال يطوفون حول المكعب الأسود وهم يرددون الدعاء بصوت خافت: “اللهم تقبل منا…” همست حور لصديقتها: “أشعر وكأننا ندور حول النور!”"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الحج",
        "text": "ابتسمت المعلمة وقالت: “الطواف يا حور هو إعلان الحب والطاعة لله، قلبك يدور حول رضاه.” 🏃‍♀️ السعي بين الصفا والمروة جهزت المعلمة ممرًا صغيرًا يمثل السعي. “السعي يا أطفال يعني الجهد في الخير، مثل أم إسماعيل التي ركضت لأجل ولدها.” حور شعرت بالحماس وهي تمشي ذهابًا وإيابًا: “يعني كل مرة أساعد فيها أحدًا، أنا أسعى لله!” 🪨 رمي الجمرات وضعت المعلمة ثلاث صناديق مكتوب عليها: “الكذب – الغضب – الأنانية”. “الآن يا أطفال، دعونا نفرغ قلوبنا من الذنوب، نرميها بعيدًا.” أمسكت حور بكرات الورق ورمتها في الصناديق: “ها قد فررتُ إلى الله… لم يبق شيء يثقل قلبي!” شعرت بقلبها خفيفًا، وكأنها تنفس روحًا جديدة. 🌅 نهاية الرحلة جلست حور مع أصدقائها حول السجادة. قالت المعلمة بهدوء: “تعلمتم اليوم أن الحج ليس مجرد طواف وسعي، بل هو وفادة إلى الله، وفرار من الذنوب، وقبول للتوبة، وطاعة لأمر الله.” ابتسمت حور وقالت بخجل وامتنان: “الآن فهمت… الحج هو أن أرجع إلى الله بقلب أبيض. سأحافظ على طهارتي وأفعالي الطيبة دائمًا، لأكون من الذين حجوا بقلوبهم قبل أجسادهم.”"
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الثَّالِثَةُ: النَّبَاتُ وَالأَحْيَاءُ الدَّقِيقَةُ",
      "topic": "التَّجْرِبَتَانِ (5 وَ6): الزَّهْرَةُ الَّتِي تُغَيِّرُ لَوْنَهَا — عَجِينَةُ الخُبْزِ وَفُقَّاعَاتُ الخَمِيرَةِ",
      "coverImg": "assets/y7/scince/s12.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s12.1.jpg",
          "text": "التَّجْرِبَةُ (5) الزَّهْرَةُ الَّتِي تُغَيِّرُ لَوْنَهَا: نَضَعُ زَهْرَةً بَيْضَاءَ فِي كَأْسِ مَاءٍ مُضَافٍ إِلَيْهِ مُلَوِّنُ طَعَامٍ، فَنُلَاحِظُ صُعُودَ المَاءِ المُلَوَّنِ عَبْرَ أَوْعِيَةِ السَّاقِ وَتَغَيُّرَ لَوْنِ البَتَلَاتِ، مِمَّا يُثْبِتُ نَقْلَ السَّاقِ لِلْمَاءِ وَالغِذَاءِ فِي النَّبَاتَاتِ الوِعَائِيَّةِ."
        },
        {
          "img": "assets/y7/scince/s12.2.jpg",
          "text": "التَّجْرِبَةُ (6) عَجِينَةُ الخُبْزِ وَفُقَّاعَاتُ الخَمِيرَةِ: نَخْلِطُ الطَّحِينَ وَالمَاءَ الدَّافِئَ وَالخَمِيرَةَ فِي وِعَاءٍ وَنُغَطِّيهِ، فَتَتَكَاثَرُ فِطْرِيَّاتُ الخَمِيرَةِ بِالتَّبَرْعُمِ وَتُطْلِقُ فُقَّاعَاتِ غَازٍ تَنْفُخُ العَجِينَ لِنَصْنَعَ الخُبْزَ الشَّهِيَّ."
        }
      ],
      "text": "التَّجْرِبَةُ (5) الزَّهْرَةُ الَّتِي تُغَيِّرُ لَوْنَهَا: نَضَعُ زَهْرَةً بَيْضَاءَ فِي كَأْسِ مَاءٍ مُضَافٍ إِلَيْهِ مُلَوِّنُ طَعَامٍ، فَنُلَاحِظُ صُعُودَ المَاءِ المُلَوَّنِ عَبْرَ أَوْعِيَةِ السَّاقِ وَتَغَيُّرَ لَوْنِ البَتَلَاتِ، مِمَّا يُثْبِتُ نَقْلَ السَّاقِ لِلْمَاءِ وَالغِذَاءِ فِي النَّبَاتَاتِ الوِعَائِيَّةِ. التَّجْرِبَةُ (6) عَجِينَةُ الخُبْزِ وَفُقَّاعَاتُ الخَمِيرَةِ: نَخْلِطُ الطَّحِينَ وَالمَاءَ الدَّافِئَ وَالخَمِيرَةَ فِي وِعَاءٍ وَنُغَطِّيهِ، فَتَتَكَاثَرُ فِطْرِيَّاتُ الخَمِيرَةِ بِالتَّبَرْعُمِ وَتُطْلِقُ فُقَّاعَاتِ غَازٍ تَنْفُخُ العَجِينَ لِنَصْنَعَ الخُبْزَ الشَّهِيَّ.",
      "q1": {
        "q": "مَاذَا تُثْبِتُ لَنَا تَجْرِبَةُ تَغَيُّرِ لَوْنِ بَتَلَاتِ الزَّهْرَةِ البَيْضَاءِ عِنْدَ وَضْعِهَا فِي المَاءِ المُلَوَّنِ؟",
        "focusWord": "صُعُودُ المَاءِ عَبْرَ السَّاقِ",
        "options": [
          {
            "text": "صُعُودَ المَاءِ عَبْرَ أَوْعِيَةِ السَّاقِ لِتَغْذِيَةِ الأَوْرَاقِ وَالأَزْهَارِ",
            "correct": true
          },
          {
            "text": "نُزُولَ المَاءِ مِنَ البَتَلَاتِ لِلْكَأْسِ",
            "correct": false
          },
          {
            "text": "تَحَوُّلَ الزَّهْرَةِ إِلَى فِطْرٍ",
            "correct": false
          },
          {
            "text": "تَوَقُّفَ النَّبَاتِ عَنِ النُّمُوِّ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الكَائِنُ الحَيُّ الدَّقِيقُ الَّذِي يَتَكَاثَرُ بِالتَّبَرْعُمِ وَيُطْلِقُ غَازًا يَنْفُخُ عَجِينَةَ الخُبْزِ؟",
        "focusWord": "الخَمِيرَةُ",
        "options": [
          {
            "text": "فِطْرُ الخَمِيرَةِ النَّافِعُ",
            "correct": true
          },
          {
            "text": "فَيْرُوسُ الإِنْفِلْوَنْزَا",
            "correct": false
          },
          {
            "text": "طُحْلُبُ البَحْرِ",
            "correct": false
          },
          {
            "text": "دُودَةُ الأَرْضِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الأَدَوَاتُ اللَّازِمَةُ لِتَجْرِبَةِ الزَّهْرَةِ المُلَوَّنَةِ؟",
        "focusWord": "زَهْرَةٌ بَيْضَاءُ وَمُلَوِّنُ طَعَامٍ",
        "options": [
          {
            "text": "زَهْرَةٌ بَيْضَاءُ وَكَأْسُ مَاءٍ وَمُلَوِّنُ طَعَامٍ",
            "correct": true
          },
          {
            "text": "مِصْبَاحٌ يَدَوِيٌّ وَكُرَةٌ",
            "correct": false
          },
          {
            "text": "طِينٌ وَخَلٌّ",
            "correct": false
          },
          {
            "text": "مِغْنَاطِيسٌ وَمَسَامِيرُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "سَاقُ الزَّهْرَةِ الوِعَائِيُّ",
          "left": "يَنْقُلُ المَاءَ المُلَوَّنَ إِلَى البَتَلَاتِ"
        },
        {
          "right": "تَبَرْعُمُ الخَمِيرَةِ",
          "left": "يُطْلِقُ فُقَّاعَاتِ غَازٍ تَنْفُخُ عَجِينَةَ الخُبْزِ"
        },
        {
          "right": "مُلَوِّنُ الطَّعَامِ فِي الكَأْسِ",
          "left": "يُظْهِرُ مَسَارَ صُعُودِ المَاءِ فِي النَّبَاتِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَنَاصِرَ تَجْرِبَتَيِ الزَّهْرَةِ المُلَوَّنَةِ وَعَجِينَةِ الخَمِيرَةِ:",
        "correct": [
          "زَهْرَةٌ بَيْضَاءُ وَمَاءٌ مُلَوَّنٌ",
          "صُعُودُ المَاءِ عَبْرَ السَّاقِ",
          "طَحِينٌ وَمَاءٌ وَخَمِيرَةٌ",
          "انْتِفَاخُ العَجِينِ بِالغَازِ"
        ],
        "wrong": [
          "بُرَادَةُ حَدِيدٍ",
          "صُخُورٌ بُرْكَانِيَّةٌ"
        ]
      },
      "applyStep": "أُجَرِّبُ وَضْعَ سَاقِ نَبَاتٍ أَوْ زَهْرَةٍ بَيْضَاءَ فِي مَاءٍ مُلَوَّنٍ وَأُرَاقِبُ صُعُودَ المَاءِ إِلَى البَتَلَاتِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt12.jpg",
      "title": "تَمَارِينُ الجُمْبَازِ البَصَرِيِّ المَكَانِيِّ وَالهَنْدَسَةِ الذِّهْنِيَّةِ (المَجْمُوعَةُ التَّاسِعَةُ: 57..63)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِتَنْمِيَةِ التَّخَيُّلِ الهَنْدَسِيِّ، التَّنَاظُرِ البَصَرِيِّ، وَدِقَّةِ المُلَاحَظَةِ وَالتَّرْكِيزِ!",
      "slideText": "📐 تَمَارِينُ الجُمْبَازِ البَصَرِيِّ المَكَانِيِّ وَالهَنْدَسَةِ الذِّهْنِيَّةِ (المَجْمُوعَةُ التَّاسِعَةُ — التَّمَارِينُ 57 إِلَى 63): (57) الرَّسْمُ المُتَنَاظِرُ بِاليَدَيْنِ حَوْلَ خَطِّ المُنْتَصَفِ. (58) المَتَاهَةُ البَصَرِيَّةُ الصَّامِتَةُ بِالعَيْنَيْنِ فَقَطْ دُونَ قَلَمٍ. (59) التَّدْوِيرُ الذِّهْنِيُّ لِلْأَشْكَالِ الهَنْدَسِيَّةِ. (60) فُسَيْفِسَاءُ الأَجْزَاءِ وَالكُلِّ (التَّانْجْرَامُ الهَنْدَسِيُّ). (61) اسْتِخْرَاجُ الشَّكْلِ المَخْفِيِّ وَسَطَ الخُطُوطِ. (62) البِنَاءُ مِنْ مُخَطَّطٍ بِالمُكَعَّبَاتِ. (63) إِكْمَالُ المَصْفُوفَةِ المَنْطِقِيَّةِ وَالأنْمَاطِ.",
      "q1": {
        "q": "كَيْفَ نَحُلُّ تَمْرِينَ (المَتَاهَةِ البَصَرِيَّةِ الصَّامِتَةِ 58) وَتَمْرِينَ (التَّدْوِيرِ الذِّهْنِيِّ 59)؟",
        "focusWord": "المَتَاهَةُ البَصَرِيَّةُ وَالتَّدْوِيرُ الذِّهْنِيُّ",
        "options": [
          {
            "text": "نَتَتَبَّعُ مَسَارَ المَتَاهَةِ بِالعَيْنَيْنِ فَقَطْ دُونَ قَلَمٍ، وَنَتَخَيَّلُ كَيْفَ يَبْدُو الشَّكْلُ الهَنْدَسِيُّ إِذَا دَارَ يَمِينًا أَوْ يَسَارًا",
            "correct": true
          },
          {
            "text": "نُلَوِّنُ الوَرَقَةَ كُلَّهَا بِالأَسْوَدِ",
            "correct": false
          },
          {
            "text": "نُمَزِّقُ وَرَقَةَ المَتَاهَةِ",
            "correct": false
          },
          {
            "text": "نُغْمِضُ أَعْيُنَنَا",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَاذَا يَبْنِي الطِّفْلُ فِي تَمْرِينِ (فُسَيْفِسَاءِ الأَجْزَاءِ وَالكُلِّ 60) وَتَمْرِينِ (البِنَاءِ مِنْ مُخَطَّطٍ 62)؟",
        "focusWord": "فُسَيْفِسَاءُ الأَجْزَاءِ وَالبِنَاءُ مِنْ مُخَطَّطٍ",
        "options": [
          {
            "text": "يُرَكِّبُ قِطَعًا هَنْدَسِيَّةً لِبِنَاءِ شَكْلٍ مُرَكَّبٍ، وَيَبْنِي بِالمُكَعَّبَاتِ مُجَسَّمًا يُطَابِقُ البِطَاقَةَ المَرْسُومَةَ",
            "correct": true
          },
          {
            "text": "يَرْمِي المُكَعَّبَاتِ عَلَى الأَرْضِ",
            "correct": false
          },
          {
            "text": "يَخْلِطُ السَّوَائِلَ",
            "correct": false
          },
          {
            "text": "يَقْفِزُ فَوْقَ الحَبْلِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا المَهَارَةُ العَقْلِيَّةُ الَّتِي يُنَمِّيهَا تَمْرِينُ (إِكْمَالِ المَصْفُوفَةِ المَنْطِقِيَّةِ 63)؟",
        "focusWord": "إِكْمَالُ المَصْفُوفَةِ المَنْطِقِيَّةِ",
        "options": [
          {
            "text": "مُلَاحَظَةُ القَاعِدَةِ الثَّابِتَةِ الَّتِي تَتَغَيَّرُ بِهَا الأَشْكَالُ وَاكْتِشَافُ الشَّكْلِ المَفْقُودِ الَّذِي يُكْمِلُ النَّمَطَ",
            "correct": true
          },
          {
            "text": "التَّخْمِينُ العَشْوَائِيُّ بِلَا تَفْكِيرٍ",
            "correct": false
          },
          {
            "text": "الرَّكْضُ السَّرِيعُ",
            "correct": false
          },
          {
            "text": "تَقْوِيَةُ عَضَلَاتِ السَّاقِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "المَتَاهَةُ البَصَرِيَّةُ الصَّامِتَةُ (58)",
          "left": "تَتَبُّعُ المَسَارِ بِالعَيْنَيْنِ فَقَطْ دُونَ قَلَمٍ أَوْ إِصْبَعٍ"
        },
        {
          "right": "فُسَيْفِسَاءُ الأَجْزَاءِ وَالكُلِّ (60)",
          "left": "تَرْكِيبُ مُثَلَّثَاتٍ وَمُرَبَّعَاتٍ لِبِنَاءِ شَكْلٍ مُرَكَّبٍ"
        },
        {
          "right": "إِكْمَالُ المَصْفُوفَةِ المَنْطِقِيَّةِ (63)",
          "left": "اكْتِشَافُ الشَّكْلِ المَفْقُودِ الَّذِي يُكْمِلُ النَّمَطَ الهَنْدَسِيَّ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الجُمْبَازِ البَصَرِيِّ المَكَانِيِّ وَالهَنْدَسَةِ الذِّهْنِيَّةِ (57..63):",
        "correct": [
          "الرَّسْمُ المُتَنَاظِرُ بِاليَدَيْنِ",
          "المَتَاهَةُ البَصَرِيَّةُ الصَّامِتَةُ وَالتَّدْوِيرُ الذِّهْنِيُّ",
          "فُسَيْفِسَاءُ الأَجْزَاءِ وَاسْتِخْرَاجُ الشَّكْلِ المَخْفِيِّ",
          "البِنَاءُ مِنْ مُخَطَّطٍ وَالمَصْفُوفَةُ المَنْطِقِيَّةُ"
        ],
        "wrong": [
          "التَّسَرُّعُ دُونَ مُلَاحَظَةِ النَّمَطِ",
          "تَرْكُ التَّرْكِيزِ البَصَرِيِّ"
        ]
      },
      "applyStep": "أُدَرِّبُ بَصَرِي وَذِهْنِي عَلَى حَلِّ المَتَاهَاتِ البَصَرِيَّةِ بِالعَيْنَيْنِ وَتَرْكِيبِ الأَشْكَالِ الهَنْدَسِيَّةِ."
    }
  },
  {
    "w": 13,
    "secNum": 4,
    "heavenName": "سَمَاءُ الثُّلَاثَاءِ الرَّابِعَةُ (م ن س ع)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الرَّابِعَةُ: عُلُومُ الأَرْضِ وَالجِيُولُوجْيَا وَالطَّقْسِ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "م",
    "jummal": 40,
    "prophet": "مُوسَى (ع)",
    "virtue": "الشَّجَاعَةُ",
    "unitHeader": "الوَحْدَةُ الثَّالِثَةَ عَشْرَةَ الكَامِلَةُ: نَبِيُّ اللهِ مُوسَى الكَلِيمُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "وَقَفَ نَبِيُّ اللهِ مُوسَى (ع) بِشَجَاعَةٍ وَتَوَكُّلٍ أَمَامَ البَحْرِ قَائِلًا: (إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ)، فَضَرَبَ البَحْرَ بِعَصَاهُ فَانْفَلَقَ طَرِيقًا يَبَسًا آمِنًا.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الدَّافِعَةُ وَالنُّورَانِيَّةُ مُقَابِلَ نَارِ الطُّغْيَانِ وَالحَسَدِ): النَّارُ النُّورَانِيَّةُ فِي الشَّجَرَةِ المُبَارَكَةِ بِوَادِي طُوًى، وَجَمْرَةُ النَّارِ الَّتِي وَضَعَهَا مُوسَى الطِّفْلُ فِي فَمِهِ لِيَدْفَعَ عَنْ نَفْسِهِ قَتْلَ فِرْعَوْنَ، وَغَيْرَتُهُ الشُّجَاعَةُ فِي إِغَاثَةِ المَظْلُومِ؛ وَفِي مُقَابِلِهَا نَارُ الكِبْرِ وَالغَضَبِ فِي صَدْرِ فِرْعَوْنَ (﴿أَنَا رَبُّكُمُ الْأَعْلَىٰ﴾) وَحَسَدُ قَارُونَ وَالسَّامِرِيِّ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ): رِيحُ الوَهْمِ وَالتَّخْيِيلِ فِي حِبَالِ السَّحَرَةِ وَعِصِيِّهِمْ (﴿يُخَيَّلُ إِلَيْهِ مِن سِحْرِهِمْ أَنَّهَا تَسْعَىٰ﴾)، وَوَهْمُ السَّامِرِيِّ فِي صُنْعِ العِجْلِ الجَسَدِ الَّذِي لَهُ خُوَارٌ بِنَفْخِ الهَوَاءِ، وَادِّعَاءُ فِرْعَوْنَ الكَاذِبُ وَاسْتِخْفَافُهُ بِعُقُولِ قَوْمِهِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ): صُعُودُ جَبَلِ الطُّورِ وَنُزُولُ الأَلْوَاحِ المَنْحُوتَةِ وَفِيهَا تَفْصِيلُ كُلِّ شَيْءٍ، وَتَدْبِيرُ مُوسَى وَشُعَيْبٍ العَقْلِيُّ فِي مَدْيَنَ، وَانْدِكَاكُ الجَبَلِ تَصَاعُدًا وَخُشُوعًا لِعَظَمَةِ اللهِ، وَخَسْفُ التُّرَابِ بِقَارُونَ وَكُنُوزِهِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): حِفْظُ تَابُوتِ الرَّضِيعِ مُوسَى فِي مَاءِ اليَمِّ (النِّيلِ)، وَسَقْيُهُ لِلبِنْتَيْنِ بِتَوَاضُعٍ وَمُرُوءَةٍ، وَتَفَجُّرُ اثْنَتَيْ عَشْرَةَ عَيْنًا مِنَ الحَجَرِ، وَانْفِلَاقُ البَحْرِ طَاعَةً لِلهِ لِنَجَاةِ المُؤْمِنِينَ وَإِغْرَاقِ فِرْعَوْنَ وَجُنُودِهِ، وَمُرَافَقَتُهُ لِلْخَضِرِ (عَلَيْهِ السَّلَامُ) عِنْدَ مَجْمَعِ البَحْرَيْنِ.",
    "storyParagraphs": [
      "فِي مَطْلَعِ فَلَكِ يَوْمِ الثُّلَاثَاءِ العَظِيمْ، يَأْتِي النَّبِيُّ الرَّقْمُ ثَلَاثَةَ عَشَرَ فِي مَنْزِلَةِ النَّارِ المُرْشِدَةِ وَالنُّورِ السَّاطِعِ الَّذِي يَكْسِرُ طُغْيَانَ الجَبَابِرَةْ، وَهُوَ كَلِيمُ اللهِ وَثَالِثُ أُولِي العَزْمِ نَبِيُّ اللهِ مُوسَى بْنُ عِمْرَانَ عَلَيْهِ السَّلَامْ. وُلِدَ فِي أَرْضِ مِصْرَ فِي زَمَنِ الطَّاغِيَةِ فِرْعَوْنَ الَّذِي اشْتَعَلَتْ فِي صَدْرِهِ نَارُ الكِبْرِ وَالغَضَبِ فَعَلَا فِي الأَرْضِ وَاسْتَضْعَفَ بَنِي إِسْرَائِيلَ وَكَانَ يَذْبَحُ أَبْنَاءَهُمْ خَوْفًا مِنْ مَوْلِدِ مُوسَى. فَأَوْحَى اللهُ إِلَى أُمِّ مُوسَى الصَّالِحَةِ يُوحَانِذَ أَنْ أَرْضِعِيهِ فَإِذَا خِفْتِ عَلَيْهِ فَأَلْقِيهِ فِي اليَمِّ وَلَا تَخَافِي وَلَا تَحْزَنِي إِنَّا رَادُّوهُ إِلَيْكِ وَجَاعِلُوهُ مِنَ المُرْسَلِينْ. فَوَضَعَتْهُ فِي تَابُوتٍ خَشَبِيٍّ صَنَعَهُ لَهَا مُؤْمِنُ آلِ فِرْعَوْنَ حِزْقِيلُ النَّجَّارْ، وَسَارَ التَّابُوتُ فِي مَاءِ النِّيلِ بِحِفْظِ اللهِ حَتَّى وَصَلَ إِلَى قَصْرِ فِرْعَوْنْ، فَرَأَتْهُ السَّيِّدَةُ الطَّاهِرَةُ آسِيَةُ بِنْتُ مُزَاحِمٍ امْرَأَةُ فِرْعَوْنَ وَأَلْقَى اللهُ عَلَيْهِ مَحَبَّةً مِنْهُ فَقَالَتْ قُرَّتُ عَيْنٍ لِي وَلَكَ لَا تَقْتُلُوهُ عَسَى أَنْ يَنْفَعَنَا أَوْ نَتَّخِذَهُ وَلَدًا.",
      "تَبِعَتْهُ أُخْتُهُ كُلْثُومُ عَنْ بُعْدٍ وَحَرَّمَ اللهُ عَلَيْهِ المَرَاضِعَ فَلَمْ يَقْبَلْ ثَدْيَ أَيِّ مُرْضِعَةٍ فِي القَصْرْ، فَدَلَّتْهُمْ أُخْتُهُ عَلَى أُمِّهِ فَرَدَّهُ اللهُ إِلَى حِضْنِ أُمِّهِ كَيْ تَقَرَّ عَيْنُهَا وَلَا تَحْزَنَ وَلِتَعْلَمَ أَنَّ وَعْدَ اللهِ حَقٌّ يَقِينْ. وَفِي يَوْمٍ أَمْسَكَ الطِّفْلُ مُوسَى بِلِحْيَةِ فِرْعَوْنَ فَهَمَّ الطَّاغِيَةُ بِقَتْلِهْ، فَقَالَتْ آسِيَةُ إِنَّهُ طِفْلٌ لَا يَعْقِلُ وَوَضَعَتْ أَمَامَهُ يَاقُوتَةً وَجَمْرَةَ نَارْ، فَحَوَّلَ جِبْرِيلُ يَدَ مُوسَى إِلَى الجَمْرَةِ فَوَضَعَهَا فِي فَمِهِ فَأَحْدَثَتْ ثِقَلًا خَفِيفًا فِي لِسَانِهِ وَنَجَا مِنْ مَكْرِ فِرْعَوْنْ. وَلَمَّا بَلَغَ أَشُدَّهُ وَاسْتَوَى آتَاهُ اللهُ حُكْمًا وَعِلْمًا وَقُوَّةً فِي البَدَنْ، وَدَخَلَ المَدِينَةَ يَوْمًا فَوَجَدَ رَجُلًا مِنْ جُنُودِ فِرْعَوْنَ يَظْلِمُ رَجُلًا مُسْتَضْعَفًا مِنْ شِيعَتِهِ، فَاسْتَغَاثَهُ المَظْلُومُ فَوَكَزَ مُوسَى الجُنْدِيَّ الظَّالِمَ بِيَدِهِ لِيَدْفَعَ عُدْوَانَهُ فَمَاتَ الجُنْدِيُّ. وَجَاءَ مُؤْمِنُ آلِ فِرْعَوْنَ يَسْعَى مِنْ أَقْصَى المَدِينَةِ يُحَذِّرُ مُوسَى مِنْ تَآمُرِ المَلَأِ عَلَى قَتْلِهْ، فَخَرَجَ مُوسَى مِنْهَا خَائِفًا يَتَرَقَّبُ وَهُوَ يَدْعُو رَبِّ نَجِّنِي مِنَ القَوْمِ الظَّالِمِينْ.",
      "تَوَجَّهَ مُوسَى تِلْقَاءَ أَرْضِ مَدْيَنَ وَمَشَى بِرِجْلَيْهِ فِي البَرِّيَّةِ يَأْكُلُ مِنْ وَرَقِ الشَّجَرِ الأَخْضَرِ حَتَّى وَصَلَ إِلَى مَاءِ مَدْيَنْ، فَوَجَدَ عَلَيْهِ جَمَاعَةً مِنَ الرُّعَاةِ يَسْقُونَ وَوَجَدَ مِنْ دُونِهِمُ امْرَأَتَيْنِ هُمَا ابْنَتَا نَبِيِّ اللهِ شُعَيْبٍ تَذُودَانِ غَنَمَهُمَا بِحَيَاءٍ وَعِفَّةٍ لِأَنَّ أَبَاهُمَا شَيْخٌ كَبِيرْ. فَتَقَدَّمَ مُوسَى بِمُرُوءَةٍ وَرَفَعَ بِيَدِهِ الصَّخْرَةَ العَظِيمَةَ عَنْ فَمِ البِئْرِ وَسَقَى لَهُمَا ثُمَّ تَوَلَّى إِلَى الظِّلِّ فَقَالَ رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرْ. فَجَاءَتْهُ إِحْدَاهُمَا تَمْشِي عَلَى اسْتِحْيَاءٍ تَدْعُوهُ إِلَى أَبِيهَا شُعَيْبٍ لِيَجْزِيَهُ أَجْرَ مَا سَقَى، فَمَشَى مُوسَى أَمَامَهَا عِفَّةً وَأَدَبًا وَطَلَبَ مِنْهَا أَنْ تَرْمِيَ الحَصَى لِتَدُلَّهُ عَلَى الطَّرِيقِ حَتَّى لَا تَصِفَ الرِّيحُ ثِيَابَهَا، فَقَالَتْ لِأَبِيهَا يَا أَبَتِ اسْتَأْجِرْهُ إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ القَوِيُّ الأَمِينْ. فَزَوَّجَهُ شُعَيْبٌ ابْنَتَهُ صَفُورَا عَلَى أَنْ يَرْعَى غَنَمَهُ ثَمَانِيَ حِجَجٍ وَأَتَمَّهَا مُوسَى عَشْرَ سِنِينَ كَامِلَةً بِأَمَانَةٍ وَوَفَاءْ، وَأَعْطَاهُ شُعَيْبٌ العَصَا المُبَارَكَةَ الَّتِي نَزَلَتْ مِنَ الجَنَّةِ مَعَ آدَمَ وَتَوَارَثَهَا الأَنْبِيَاءْ.",
      "وَلَمَّا قَضَى الأَجَلَ وَسَارَ بِأَهْلِهِ فِي لَيْلَةٍ بَارِدَةٍ مُظْلِمَةٍ آنَسَ مِنْ جَانِبِ الطُّورِ نَارًا فَسَارَ لِيَأْتِيَ أَهْلَهُ مِنْهَا بِقَبَسٍ أَوْ يَجِدَ عَلَى النَّارِ هُدًى. فَلَمَّا أَتَاهَا رَأَى نُورًا يَسْطَعُ مِنْ شَجَرَةٍ خَضْرَاءَ مُبَارَكَةٍ وَنُودِيَ يَا مُوسَى إِنِّي أَنَا اللهُ رَبُّ العَالَمِينَ فَاخْلَعْ نَعْلَيْكَ إِنَّكَ بِالوَادِ المُقَدَّسِ طُوًى وَأَنَا اخْتَرْتُكَ فَاسْتَمِعْ لِمَا يُوحَى. فَوَقَفَ مُوسَى بِتَوَاضُعٍ حَافِيَ القَدَمَيْنِ عَلَى التُّرَابِ الطَّاهِرْ، وَسَأَلَهُ رَبُّهُ وَمَا تِلْكَ بِيَمِينِكَ يَا مُوسَى قَالَ هِيَ عَصَايَ أَتَوَكَّأُ عَلَيْهَا وَأَهُشُّ بِهَا عَلَى غَنَمِي، فَأَمَرَهُ أَنْ يُلْقِيَهَا فَأَلْقَاهَا فَإِذَا هِيَ حَيَّةٌ تَسْعَى ثُمَّ أَخَذَهَا بِيَدِهِ فَعَادَتْ سِيرَتَهَا الأُولَى، وَأَدْخَلَ يَدَهُ فِي جَيْبِهِ فَخَرَجَتْ بَيْضَاءَ تَشِعُّ نُورًا مِنْ غَيْرِ سُوءْ. وَأَمَرَهُ اللهُ أَنْ يَذْهَبَ إِلَى فِرْعَوْنَ إِنَّهُ طَغَى، فَدَعَا مُوسَى رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي وَاجْعَلْ لِي وَزِيرًا مِنْ أَهْلِي هَارُونَ أَخِي اشْدُدْ بِهِ أَزْرِي وَأَشْرِكْهُ فِي أَمْرِي، فَاسْتَجَابَ اللهُ سُؤْلَهُ وَقَالَ لَا تَخَافَا إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَى.",
      "ذَهَبَ مُوسَى وَهَارُونُ إِلَى فِرْعَوْنَ فَكَلَّمَاهُ قَوْلًا لَيِّنًا وَأَرَيَاهُ آيَةَ العَصَا وَاليَدِ البَيْضَاءْ، فَكَذَّبَ فِرْعَوْنُ وَجَمَعَ السَّحَرَةَ فِي يَوْمِ الزِّينَةِ لِيَغْلِبُوا الحَقَّ بِرِيحِ الوَهْمْ. فَلَمَّا أَلْقَوْا حِبَالَهُمْ وَعِصِيَّهُمْ خُيِّلَ لِلنَّاسِ مِنْ سِحْرِهِمْ أَنَّهَا تَسْعَى، فَأَوْحَى اللهُ إِلَى مُوسَى أَنْ أَلْقِ عَصَاكَ فَأَلْقَاهَا فَتَحَوَّلَتْ ثُعْبَانًا مُبِينًا لَقِفَ كُلَّ مَا صَنَعُوا مِنْ وَهْمٍ وَكَذِبْ، فَعَرَفَ السَّحَرَةُ بِعُقُولِهِمْ أَنَّ هٰذِهِ مُعْجِزَةٌ مِنَ السَّمَاءِ فَأُلْقِيَ السَّحَرَةُ سُجَّدًا قَالُوا آمَنَّا بِرَبِّ هَارُونَ وَمُوسَى وَصَبَرُوا عَلَى ظُلْمِ فِرْعَوْنْ. وَأَرْسَلَ اللهُ عَلَى فِرْعَوْنَ وَقَوْمِهِ تِسْعَ آيَاتٍ بَيِّنَاتٍ هِيَ العَصَا وَاليَدُ وَالسِّنُونَ وَنَقْصُ الثَّمَرَاتِ وَالطُّوفَانُ وَالجَرَادُ وَالقُمَّلُ وَالضَّفَادِعُ وَالدَّمُ آيَاتٍ مُفَصَّلَاتٍ فَاسْتَكْبَرُوا، وَطَلَبَ فِرْعَوْنُ مِنْ وَزِيرِهِ هَامَانَ أَنْ يَطْبُخَ لَهُ الآجُرَّ مِنَ الطِّينِ وَيَبْنِيَ صَرْحًا عَالِيًا بِوَهْمِ الاطِّلَاعِ عَلَى السَّمَاءِ وَقَتَلَ السَّيِّدَةَ آسِيَةَ شَهِيدَةً صَابِرَةً بَعْدَ أَنْ رَأَتْ بَيْتَهَا فِي الجَنَّةْ.",
      "أَوْحَى اللهُ إِلَى مُوسَى أَنْ أَسْرِ بِعِبَادِي لَيْلًا فَسَارَ بِبَنِي إِسْرَائِيلَ وَحَمَلَ مَعَهُ تَابُوتَ عِظَامِ نَبِيِّ اللهِ يُوسُفَ عَلَيْهِ السَّلَامُ وَفَاءً بِوَصِيَّتِهْ. فَلَحِقَهُمْ فِرْعَوْنُ بِجُنُودِهِ عِنْدَ شُرُوقِ الشَّمْسِ حَتَّى وَقَفُوا أَمَامَ البَحْرِ وَقَالَ أَصْحَابُ مُوسَى إِنَّا لَمُدْرَكُونْ، فَقَالَ مُوسَى بِيَقِينٍ رَاسِخٍ كَلَّا إِنَّ مَعِيَ رَبِّي سَيَهْدِينْ! وَضَرَبَ البَحْرَ بِعَصَاهُ فَانْفَلَقَ البَحْرُ اثْنَيْ عَشَرَ طَرِيقًا يَابِسًا عَلَى عَدَدِ الأَسْبَاطِ وَكَانَ كُلُّ فِرْقٍ كَالطَّوْدِ العَظِيمْ، فَعَبَرَ مُوسَى وَالمُؤْمِنُونَ بِسَلَامٍ وَدَخَلَ فِرْعَوْنُ وَجُنُودُهُ فَـأَطْبَقَ اللهُ عَلَيْهِمْ مَوْجَ اليَمِّ فَغَرِقُوا أَجْمَعِينْ، وَنَجَّى اللهُ فِرْعَوْنَ بِبَدَنِهِ المَيِّتِ فَوْقَ الشَّاطِئِ لِيَكُونَ آيَةً وَعِبْرَةً لِلْعَالَمِينْ.",
      "وَفِي سَيْرِهِمْ ظَلَّلَ اللهُ عَلَيْهِمُ الغَمَامَ وَأَنْزَلَ عَلَيْهِمُ المَنَّ وَالسَّلْوَى طَعَامًا طَيِّبًا، وَضَرَبَ مُوسَى الحَجَرَ بِعَصَاهُ فَانْفَجَرَتْ مِنْهُ اثْنَتَا عَشْرَةَ عَيْنًا مِنْ مَاءٍ عَذْبٍ قَدْ عَلِمَ كُلُّ أُنَاسٍ مَشْرَبَهُمْ. وَذَهَبَ مُوسَى إِلَى مِيقَاتِ رَبِّهِ أَرْبَعِينَ لَيْلَةً عِنْدَ جَبَلِ الطُّورِ وَاسْتَخْلَفَ أَخَاهُ هَارُونْ، وَسَأَلَ رَبَّهُ الرُّؤْيَةَ تَبْكِيتًا لِسُفَهَاءِ قَوْمِهِ فَتَجَلَّى اللهُ لِلْجَبَلِ فَجَعَلَهُ دَكًّا وَخَرَّ مُوسَى صَعِقًا ثُمَّ أَفَاقَ سَاجِدًا، وَكَتَبَ اللهُ لَهُ فِي الأَلْوَاحِ التَّوْرَاةَ وَأَتَمَّ لَهُ النُّورَ وَالمَوْعِظَةْ، وَكانَ اللهُ يُكَلِّمُ مُوسَى تَكْلِيمًا فَسُمِّيَ كَلِيمٌ كَرِيمْ. وَلَمَّا رَجَعَ وَجَدَ السَّامِرِيَّ قَدْ خَدَعَ القَوْمَ بِصُنْعِ عِجْلٍ مِنْ ذَهَبٍ يَدْخُلُ فِيهِ الهَوَاءُ فَيُصْدِرُ صَوْتًا، فَأَحْرَقَ مُوسَى العِجْلَ وَنَسَفَهُ فِي البَحْرِ وَتَابَ القَوْمُ إِلَى بَارِئِهِمْ.",
      "وَتَعَلَّمَ مُوسَى أَسْرَارَ الحِكْمَةِ الغَيْبِيَّةِ فِي رِحْلَتِهِ مَعَ فَتَاهُ يُوشَعَ بْنِ نُونٍ إِلَى مَجْمَعِ البَحْرَيْنِ عِنْدَ العَبْدِ الصَّالِحِ الخَضِرِ عَلَيْهِ السَّلَامُ فِي قِصَّةِ خَرْقِ السَّفِينَةِ وَبِنَاءِ الجِدَارِ لِليَتِيمَيْنْ. كَمَا وَعَظَ مُوسَى قَارُونَ الَّذِي تَكَبَّرَ بِكُنُوزِهِ وَأَمَرَهُ بِإِخْرَاجِ الزَّكَاةِ فَبَغَى وَحَسَدَ مُوسَى فَخَسَفَ اللهُ بِهِ وَبِدَارِهِ الأَرْضْ. وَكَانَ مُوسَى شَدِيدَ الحَيَاءِ وَالسَّتْرِ يَغْتَسِلُ وَحْدَهُ فَبَرَّأَهُ اللهُ مِمَّا قَالَ المُتَقَوِّلُونْ، وَقَضَى بِالحَقِّ فِي آيَةِ البَقَرَةِ الصَّفْرَاءِ الَّتِي أَحْيَا اللهُ بِهَا القَتِيلَ لِيَكْشِفَ قَاتِلَهْ، وَبَشَّرَ قَوْمَهُ بِنَبِيِّ اللهِ مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَأَهْلِ بَيْتِهِ الأَئِمَّةِ الاثْنَيْ عَشَرَ عَلَى عَدَدِ النُّقَبَاءْ. وَظَلَّ نَبِيُّ اللهِ يُجَاهِدُ وَيُعَلِّمُ النَّاسَ شَرِيعَةَ اللهِ فِي التَّوْرَاةِ الَّتِي يَحْكُمُ بِهَا النَّبِيُّونَ الَّذِينَ أَسْلَمُوا لِأَمْرِ اللهِ المَلِكِ الحَكَمِ العَدْلْ، وَهُوَ عَلَى دِينِ رَبِّهِ مُقِيمٌ ثَابِتْ، حَتَّى سَلَّمَ الوَصِيَّةَ وَمَوَارِيثَ النُّبُوَّةِ إِلَى وَصِيِّهِ الأَمِينْ يُوشَعَ بْنِ نُونٍ عَلَيْهِ السَّلَامْ."
    ],
    "words": [
      {
        "word": "أَمْرِي",
        "desc": "وسط متصل / ساكن: ـمْـ",
        "raw": "أَمْرِي (وسط متصل / ساكن: ـمْـ)"
      },
      {
        "word": "الأَمِينْ",
        "desc": "آخر متصل / ساكن وقفًا: ـمْ",
        "raw": "الأَمِينْ (آخر متصل / ساكن وقفًا: ـمْ)"
      },
      {
        "word": "مَشَى",
        "desc": "أول منفصل / متحرك بالفتح: مَـ",
        "raw": "مَشَى (أول منفصل / متحرك بالفتح: مَـ)"
      },
      {
        "word": "المَدِينَةَ",
        "desc": "أول متصل / متحرك بالفتح: ـمَـ",
        "raw": "المَدِينَةَ (أول متصل / متحرك بالفتح: ـمَـ)"
      },
      {
        "word": "ثَمَرَاتٍ",
        "desc": "وسط متصل / متحرك بالفتح: ـمَـ",
        "raw": "ثَمَرَاتٍ (وسط متصل / متحرك بالفتح: ـمَـ)"
      },
      {
        "word": "أَمَانَةٍ",
        "desc": "وسط منفصل / متحرك بالفتح: مَـ",
        "raw": "أَمَانَةٍ (وسط منفصل / متحرك بالفتح: مَـ)"
      },
      {
        "word": "عَلِمَ",
        "desc": "آخر متصل / متحرك بالفتح: ـمَ",
        "raw": "عَلِمَ (آخر متصل / متحرك بالفتح: ـمَ)"
      },
      {
        "word": "مُقِيمٌ",
        "desc": "أول منفصل / متحرك بالضم: مُـ",
        "raw": "مُقِيمٌ (أول منفصل / متحرك بالضم: مُـ)"
      },
      {
        "word": "كَلِيمٌ",
        "desc": "آخر متصل / متحرك بالضم: ـمٌ",
        "raw": "كَلِيمٌ (آخر متصل / متحرك بالضم: ـمٌ)"
      },
      {
        "word": "مِصْرَ",
        "desc": "أول منفصل / متحرك بالكسر: مِـ",
        "raw": "مِصْرَ (أول منفصل / متحرك بالكسر: مِـ)"
      },
      {
        "word": "أَتَمَّ",
        "desc": "وسط/آخر متصل / مضعف بالفتح: ـمَّ",
        "raw": "أَتَمَّ (وسط/آخر متصل / مضعف بالفتح: ـمَّ)"
      },
      {
        "word": "اليَمُّ",
        "desc": "آخر متصل / مضعف بالضم: ـمُّ",
        "raw": "اليَمُّ (آخر متصل / مضعف بالضم: ـمُّ)"
      },
      {
        "word": "يُكَلِّمُ",
        "desc": "وسط متصل / مضعف بالكسر: ـمِّـ",
        "raw": "يُكَلِّمُ (وسط متصل / مضعف بالكسر: ـمِّـ)"
      },
      {
        "word": "مَاءٍ",
        "desc": "أول منفصل / ممدود بالألف: مَا",
        "raw": "مَاءٍ (أول منفصل / ممدود بالألف: مَا)"
      },
      {
        "word": "مُوسَى",
        "desc": "أول منفصل / ممدود بالواو: مُو",
        "raw": "مُوسَى (أول منفصل / ممدود بالواو: مُو)"
      },
      {
        "word": "أَمِينٌ",
        "desc": "وسط منفصل / ممدود بالياء: مِي",
        "raw": "أَمِينٌ (وسط منفصل / ممدود بالياء: مِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ المِيمِ (م): النُّطْقُ السَّلِيمُ لِحَرْفِ المِيمِ مِنْ مَخْرَجِ انْطِبَاقِ الشَّفَتَيْنِ مَعَ غُنَّةٍ مِنَ الخَيْشُومِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى دُعَاءِ الفَصَاحَةِ وَالبَيَانِ: ﴿رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي * وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي * يَفْقَهُوا قَوْلِي﴾."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الحَلْقَةُ المَمْدُودَةُ (كَالعَصَا وَاليَدِ البَيْضَاءِ) وَالشَّكْلُ الثَّلَاثَ عَشَرِيُّ: مُشَاهَدَةُ شَكْلِ حَرْفِ المِيمِ (م / مـ) المُرَكَّبِ مِنْ حَلْقَةٍ مُضِيئَةٍ كَاليَدِ البَيْضَاءِ يَمْتَدُّ مِنْهَا خَطٌّ مُسْتَقِيمٌ كَعَصَا مُوسَى (عَلَيْهِ السَّلَامُ)، وَالتَّعَرُّفُ البَصَرِيُّ عَلَى التَّمْيِيزِ بَيْنَ الحَقِيقَةِ البَصَرِيَّةِ (آيَةِ العَصَا) وَالخِدَاعِ البَصَرِيِّ الوَهْمِيِّ (حِبَالِ السَّحَرَةِ)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ كَلِيمِ اللهِ وَالإِنْصَاتُ لِلوَحْيِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ مُوسَى الكَامِلَةِ، وَتَدْرِيبُ الأُذُنِ عَلَى الإِنْصَاتِ الخَاشِعِ لِكَلامِ اللهِ كَمَا سَمِعَ مُوسَى نِدَاءَ رَبِّهِ فِي الوَادِي المُقَدَّسِ طُوًى: ﴿فَاسْتَمِعْ لِمَا يُوحَىٰ﴾، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ ثَلَاثَةَ عَشَرَ (13) وَالأَرْبَعُونَ (40): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (13) وَمَعْرِفَةِ قِيمَةِ المِيمِ (40 = أَرْبَعُ عَشَرَاتٍ كَامِلَةٍ تُوَافِقُ أَرْبَعِينَ لَيْلَةً فِي مِيقَاتِ مُوسَى)، وَإِدْرَاكُ آيَاتِ مُوسَى التِّسْعِ وَالعيُونِ الاثْنَتَيْ عَشْرَةَ، وَتَدْرِيبُ اليَدِ عَلَى القُوَّةِ وَالأَمَانَةِ (﴿الْقَوِيُّ الْأَمِينُ﴾) فِي رَفْعِ الصَّخْرَةِ وَسَقْيِ المَاءِ وَحَمْلِ الأَلْوَاحِ وَالاتِّكَاءِ عَلَى العَصَا وَهُشِّ وَرَقِ الشَّجَرِ لِلغَنَمِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السَّيْرِ الطَّوِيلِ وَخَلْعِ النَّعْلَيْنِ وَتَسَلُّقِ الجَبَلِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ المَشْيِ الطَّوِيلِ (مِنْ مِصْرَ إِلَى مَدْيَنَ وَالعَوْدَةِ)، وَفَائِدَةِ المَشْيِ حَافِيَ القَدَمَيْنِ عَلَى التُّرَابِ الطَّاهِرِ تَوَاضُعًا وَصِحَّةً (﴿فَاخْلَعْ نَعْلَيْكَ إِنَّكَ بِالْوَادِ الْمُقَدَّسِ طُوًى﴾)، وَرِيَاضَةِ صُعُودِ الجِبَالِ وَعُبُورِ المَمَرَّاتِ المُنْفَلِقَةِ فِي البَحْرِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الرَّضَاعَةِ الطَّبِيعِيَّةِ وَالمَنِّ وَالسَّلْوَى وَالبُقُولِ الزِّرَاعِيَّةِ: تَعَلُّمُ أَهَمِّيَّةِ حَلِيبِ الأُمِّ الطَّبِيعِيِّ لِلرَّضِيعِ، وَمَعْرِفَةِ القِيمَةِ الغِذَائِيَّةِ لِـ«المَنِّ» (العَسَلِ النَّدِيِّ عَلَى الشَّجَرِ) وَ«السَّلْوَى» (طَائِرِ السُّمَانَى)، وَخَصَائِصِ نَبَاتَاتِ الأَرْضِ المَذْكُورَةِ فِي القِصَّةِ (البَقْلِ وَالقِثَّاءِ وَالفُومِ/الثُّومِ وَالحِنْطَةِ وَالعَدَسِ وَالبَصَلِ)، وَفَضْلِ الكَسْبِ بِرَعْيِ الغَنَمِ وَأَخْذِ الأَجْرِ بِالأَمَانَةِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الحَيَاءِ التَّامِّ وَالمُرُوءَةِ وَمُشَارَكَةِ الأَخِ: تَعَلُّمُ خُلُقِ الحَيَاءِ وَسَتْرِ البَدَنِ (كَمَا كَانَ مُوسَى يَغْتَسِلُ مُنْفَرِدًا مَسْتُورًا عَنِ الأَعْيُنِ فَبَرَّأَهُ اللهُ مِمَّا قَالُوا)، وَأَدَبِ الغَيْرَةِ وَالعِفَّةِ فِي مَشْيِهِ أَمَامَ ابْنَةِ شُعَيْبٍ لِئَلَّا يَصِفَ الهَوَاءُ ثِيَابَهَا، وَمَحَبَّةِ الأَخِ وَإِشْرَاكِهِ فِي الخَيْرِ (كَمَا سَأَلَ اللهَ أَنْ يَجْعَلَ أَخَاهُ هَارُونَ وَزِيرًا وَشَرِيكًا لَهُ)."
      }
    },
    "grammar": {
      "topic": "أَزْمِنَةُ الفِعْلِ (2): الفِعْلُ المُضَارِعُ المَرْفُوعُ بِالضَّمَّةْ",
      "rule": "الفِعْلُ المُضَارِعُ يَدُلُّ عَلَى عَمَلٍ يَحْدُثُ الآنَ، وَيَبْدَأُ بـ (أ، ن، ي، ت) وَيُرْفَعُ بِالضَّمَّةِ (ـُ).",
      "example": "يَمْشِي المُؤْمِنُ — تَشْرَبُ المَاعِزُ — نَقْرَأُ الكِتَابَ.",
      "focusWord": "يَمْشِي / يَكْتُبُ",
      "q": "أَيُّ فِعْلٍ مِنْ هٰذِهِ الأَفْعَالِ هُوَ «فِعْلٌ مُضَارِعٌ» يَحْدُثُ الآنَ؟",
      "opts": [
        "يَكْتُبُ",
        "كَتَبَ",
        "اُكْتُبْ",
        "مَكْتَبٌ"
      ]
    },
    "earIirab": {
      "topic": "ضَمَّةُ الفِعْلِ المُضَارِعِ وَضَمَّةُ الفَاعِلْ",
      "rule": "الفِعْلُ المُضَارِعُ يُرْفَعُ بِالضَّمَّةِ (ـُ)، وَالفَاعِلُ بَعْدَهُ يُرْفَعُ أَيْضًا بِالضَّمَّةِ (ـُ).",
      "sentence": "يَنْزِلُ المَطَرُ مِنَ الغَيْمِ.",
      "targetWord": "يَنْزِلُ المَطَرُ",
      "caseAns": "مَرْفُوعَانِ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 43,
      "numName": "ثَلَاثَةٌ وَأَرْبَعُونَ",
      "eqDisplay": "3 + 40 = 43",
      "subDisplay": "43 - 3 = 40",
      "compDisplay": "43 > 34",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (43) بِالعَرَبِيَّةِ؟",
        "focus": "43",
        "ans": "ثَلَاثَةٌ وَأَرْبَعُونَ",
        "wrong": [
          "أَرْبَعَةٌ وَثَلَاثُونَ",
          "أَرْبَعُونَ",
          "ثَلَاثَةٌ وَخَمْسُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ تَرْكِيبَ الآحَادِ وَالعَشَرَاتِ:",
        "focus": "3 + 40 = ؟",
        "ans": "43 (ثَلَاثَةٌ وَأَرْبَعُونَ)",
        "wrong": [
          "34",
          "40",
          "47"
        ]
      }
    },
    "sport": {
      "title": "تَشَابُكُ الهُدُوءِ وَالتَّوَازُنِ العَصَبِيِّ",
      "middleText": "أُشَبِّكُ يَدَيَّ أَمَامَ صَدْرِي مَعَ تَقَاطُعِ الكَاحِلَيْنِ وَأَتَنَفَّسُ بِهُدُوءٍ وَسَكِينَةْ. يُعِيدُ هٰذَا التَّمْرِينُ التَّوَازُنَ العَصَبِيَّ لِلجِسْمِ وَيَمْنَحُ العَقْلَ ثِقَةً وَهُدُوءًا."
    },
    "sci": {
      "title": "جِيُولُوجْيَا الأَرْضِ: طَبَقَاتُ الكَوْكَبِ وَعَالَمُ الصُّخُورِ",
      "summaryThird": "تَتَكَوَّنُ الكُرَةُ الأَرْضِيَّةُ مِنْ قِشْرَةٍ صَخْرِيَّةٍ خَارِجِيَّةٍ نَعِيشُ عَلَيْهَا، تَلِيهَا طَبَقَةُ الوِشَاحِ ثُمَّ اللُّبُّ الحَارُّ فِي المَرْكَزِ، وَتَتَنَوَّعُ صُخُورُهَا بَيْنَ نَارِيَّةٍ وَرُسُوبِيَّةٍ وَمُتَحَوِّلَةْ.",
      "focusConcept": "القِشْرَةُ الأَرْضِيَّةُ",
      "factAns": "الطَّبَقَةُ الخَارِجِيَّةُ الَّتِي نَعِيشُ وَنَزْرَعُ عَلَيْهَا"
    },
    "rightsSummary": {
      "title": "حَقُّ الحَجِّ وَتَعْظِيمِ شَعَائِرِ اللهِ (حُور وَسُرُور - 13)",
      "storySentence": "شَاهَدَ سُرُورٌ صُورَةَ الكَعْبَةِ المُشَرَّفَةِ وَعَرَفَ أَنَّ الحَجَّ هُوَ وِفَادَةٌ إِلَى بَيْتِ اللهِ الحَرَامِ تَجْمَعُ قُلُوبَ المُؤْمِنِينَ عَلَى التَّوْحِيدِ وَالسَّلَامِ وَالأُخُوَّةْ.",
      "applyAction": "أُعَظِّمُ بَيْتَ اللهِ الحَرَامَ وَأَتَّجِهُ نَحْوَ القِبْلَةِ بِأَدَبٍ وَاحْتِرَامْ."
    },
    "rightsFullTitle": "(13) حق الصدقة + (14) حق الهدي",
    "rightsQuote": "وَأَمَّا حَقُّ الصَّدَقَةِ فَأَنْ تَعْلَمَ أنَّها ذُخرُكَ عِنْدَ رَبكَ وَوَديعَتُكَ الَّتِي لا تَحْتَاجُ إلَى الإشْهَادِ، فَإذا عَلِمْتَ ذَلِك كُنْتَ بمَا اسْتَودَعْتَهُ سِرًّا أَوْثقَ بمَا اسْتَوْدَعْتَهُ عَلانِيَةً، وَكُنْتَ جَدِيرًا أَنْ تَكونَ أَسْرَرْتَ إلَيْهِ أَمْرًا أَعْلَنْتَهُ، وَكَانَ الأَمْرُ بَيْنَكَ وبَيْنَهُ فِيهَا سِرًّا عَلَى كُلِّ حَال وَلَمْ تَسْتَظْهِرْ عَلَيْهِ فِيمَا اسْتَوْدَعْتَهُ مِنْهَا بإشْهَادِ الأَسْمَاعِ وَالأَبْصَارِ عَلَيْهِ بهَا كَأنَّهَا أَوْثقُ فِي نَفْسِكَ لا كَأنَّكَ لا تثِقُ بهِ فِي تَأْديَةِ وَديعَتِكَ إلَيْكَ، ثُمَّ لَمْ تَمْتَنَّ بهَا عَلَى أَحَد لأَنّهَا لَكَ فَإذا امْتَنَنْتَ بهَا لَمْ تَأْمَنْ أَنْ تَكُونَ بهَا مِثْلَ تَهْـجِينِ  حَالِكَ مِنْهَا إلَى مَنْ مَنَنْتَ بهَا عَلَيْهِ لأَنَّ فِي ذلِكَ دَلِيلاً عَلَى أَنّكَ لَمْ تُرِدْ نفْسَكَ بهَـا، وَلَوْ أَرَدْتَ نفْسَكَ بهَا لَمْ تَمْتَنَّ بهَا عَلَى أَحَد. وَلا قُوَّةَ إلا باللهِ. | وَأمَّا حَقُّ الهَدْيِ فَأَنْ تُخلِصَ بهَا الإرَادَةَ إلَى رَبكَ وَالتَّعَرُّضَ لِرَحْمَتِهِ وَقَبُولِهِ ولا تُرِيدَ عُيُونَ النَّاظِرِينَ دُونهُ، فـَإذَا كُنْتَ كَذَلِكَ لَمْ تَكُنْ مُتَكَلِّفًا ولا مُتَصَنِّعًا وَكُنْتَ إنَّمَا تَقْصِدُ إلَى الله. وَاعْلَمْ أَنَّ الله يُرَادُ بالْيَسِيرِ وَلا يُرَادُ بالْعَسِيرِ كَمَا أَرَادَ بخَلْقِهِ التَّيْسِيرَ وَلَمْ يُرِدْ بهِمُ التَّعْسِيرَ، وَكَذَلِكَ التَّذَلُّلَ أَوْلَى بكَ مِن التَّدَهْقُنِ  لأَنَّ الْكُلْفَةَ وَالْمَئونَةَ فِي الْمُتَدَهْقِنِينَ. فَأمَّا التَّذَلُّلُ وَالتَّمَسْكُنُ فَلا كُلْفَةَ فِيهِمَا وَلا مَئونةَ عَلَيْهِمَا لأَنَّهُمَا الْخِلْقَةَ وهُمَا مَوجُودَانِ فِي الطَّبيعَةِ. وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (13) حق الصدقة + (14) حق الهدي",
        "text": "وَأَمَّا حَقُّ الصَّدَقَةِ فَأَنْ تَعْلَمَ أنَّها ذُخرُكَ عِنْدَ رَبكَ وَوَديعَتُكَ الَّتِي لا تَحْتَاجُ إلَى الإشْهَادِ، فَإذا عَلِمْتَ ذَلِك كُنْتَ بمَا اسْتَودَعْتَهُ سِرًّا أَوْثقَ بمَا اسْتَوْدَعْتَهُ عَلانِيَةً، وَكُنْتَ جَدِيرًا أَنْ تَكونَ أَسْرَرْتَ إلَيْهِ أَمْرًا أَعْلَنْتَهُ، وَكَانَ الأَمْرُ بَيْنَكَ وبَيْنَهُ فِيهَا سِرًّا عَلَى كُلِّ حَال وَلَمْ تَسْتَظْهِرْ عَلَيْهِ فِيمَا اسْتَوْدَعْتَهُ مِنْهَا بإشْهَادِ الأَسْمَاعِ وَالأَبْصَارِ عَلَيْهِ بهَا كَأنَّهَا أَوْثقُ فِي نَفْسِكَ لا كَأنَّكَ لا تثِقُ بهِ فِي تَأْديَةِ وَديعَتِكَ إلَيْكَ، ثُمَّ لَمْ تَمْتَنَّ بهَا عَلَى أَحَد لأَنّهَا لَكَ فَإذا امْتَنَنْتَ بهَا لَمْ تَأْمَنْ أَنْ تَكُونَ بهَا مِثْلَ تَهْـجِينِ  حَالِكَ مِنْهَا إلَى مَنْ مَنَنْتَ بهَا عَلَيْهِ لأَنَّ فِي ذلِكَ دَلِيلاً عَلَى أَنّكَ لَمْ تُرِدْ نفْسَكَ بهَـا، وَلَوْ أَرَدْتَ نفْسَكَ بهَا لَمْ تَمْتَنَّ بهَا عَلَى أَحَد. وَلا قُوَّةَ إلا باللهِ. | وَأمَّا حَقُّ الهَدْيِ فَأَنْ تُخلِصَ بهَا الإرَادَةَ إلَى رَبكَ وَالتَّعَرُّضَ لِرَحْمَتِهِ وَقَبُولِهِ ولا تُرِيدَ عُيُونَ النَّاظِرِينَ دُونهُ، فـَإذَا كُنْتَ كَذَلِكَ لَمْ تَكُنْ مُتَكَلِّفًا ولا مُتَصَنِّعًا وَكُنْتَ إنَّمَا تَقْصِدُ إلَى الله. وَاعْلَمْ أَنَّ الله يُرَادُ بالْيَسِيرِ وَلا يُرَادُ بالْعَسِيرِ كَمَا أَرَادَ بخَلْقِهِ التَّيْسِيرَ وَلَمْ يُرِدْ بهِمُ التَّعْسِيرَ، وَكَذَلِكَ التَّذَلُّلَ أَوْلَى بكَ مِن التَّدَهْقُنِ  لأَنَّ الْكُلْفَةَ وَالْمَئونَةَ فِي الْمُتَدَهْقِنِينَ. فَأمَّا التَّذَلُّلُ وَالتَّمَسْكُنُ فَلا كُلْفَةَ فِيهِمَا وَلا مَئونةَ عَلَيْهِمَا لأَنَّهُمَا الْخِلْقَةَ وهُمَا مَوجُودَانِ فِي الطَّبيعَةِ. وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ مُوسَى (ع): آدَابُ الحَيَاءِ التَّامِّ وَالمُرُوءَةِ وَمُشَارَكَةِ الأَخِ: تَعَلُّمُ خُلُقِ الحَيَاءِ وَسَتْرِ البَدَنِ (كَمَا كَانَ مُوسَى يَغْتَسِلُ مُنْفَرِدًا مَسْتُورًا عَنِ الأَعْيُنِ فَبَرَّأَهُ اللهُ مِمَّا قَالُوا)، وَأَدَبِ الغَيْرَةِ وَالعِفَّةِ فِي مَشْيِهِ أَمَامَ ابْنَةِ شُعَيْبٍ لِئَلَّا يَصِفَ الهَوَاءُ ثِيَابَهَا، وَمَحَبَّةِ الأَخِ وَإِشْرَاكِهِ فِي الخَيْرِ (كَمَا سَأَلَ اللهَ أَنْ يَجْعَلَ أَخَاهُ هَارُونَ وَزِيرًا وَشَرِيكًا لَهُ)."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصدقة",
        "text": "في يومٍ مشمس، كانت حور تجلس في غرفتها تصنع مزهرية جميلة من المعجون. لكنها لاحظت أنها تحتاج إلى المزيد منه لإكمال الزخارف. تذكرت أنها أعطت قطعة لأختها الصغيرة قبل قليل، فأسرعت لتأخذها منها، فبدأت الطفلة تبكي. سمعها الأخ الأكبر نور وقال: \"ماذا تفعلين يا حور؟ لقد وهبتِها هذا المعجون، فهو ملكها الآن!\" جاءت الأم إلى الغرفة وسألت برفق: \"ما الذي يحدث هنا؟\" شرحت حور أنها تحتاج المعجون لإكمال مزهريتها. ابتسمت الأم وقالت بحنان: \"يا صغيرتي، عندما نعطي شيئًا للآخرين، فإننا في الحقيقة نهديه لله تعالى، والله لا يضيع أجر المحسنين.\" فكرت حور قليلًا ثم قالت بابتسامة: \"أنتِ محقة يا أمي، الله أكرم منا جميعًا!\" أعادت حور المعجون لأختها الصغيرة، ثم أخذت المزهرية التي صنعتها ووضعتها في صندوق صغير. أضافت إليه رسالة، وفيها ظرف به بعض النقود. ناداها نور قائلًا: \"حان الوقت يا أختي لتنفيذ خطتنا!\" استأذنا الأم للذهاب إلى الدكان، وخرجا سويًا."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصدقة",
        "text": "توقفا أمام منزل متواضع، تعيش فيه امرأة مسنّة مريضة. وضع نور الصندوق أمام الباب وطرقه بلطف، ثم تراجع مع أخته ليريا ما سيحدث. فتحت المرأة الباب، ورأت الصندوق. فتحته ووجدت المزهرية الجميلة، ثم أخرجت الرسالة وقرأت بصوت مرتجف: \"إلى المرأة الصابرة... الله لا ينسى أحدًا.\" لمعت الدموع في عينيها وهي تحتضن الصندوق بشوقٍ وامتنان. همست حور لأخيها: \"كلما مررنا من هنا نسمع سعالها، وكانت تتمنى لو تستطيع شراء الدواء... كانت تؤلمني، أما الآن فقد ارتحت!\" ثم سألت بخجل: \"هل نخبر أمنا؟ ربما تعطينا مصروفًا إضافيًا!\" ضحك نور بهدوء وقال: \"لا داعي يا أختي، من نريد أن يعرف... قد علم بالفعل.\" عادا إلى البيت وهما يشعران بسعادة غامرة. قالت حور مبتسمة: \"سنشتري غدًا...\" فأكمل نور وهو يبتسم: \"اليوم اشترينا شيئًا في عالمٍ آخر!\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الهدي",
        "text": "الهدية الصادقة والبطانية الصغيرة أعلنت الأم أن الخالة قد أنجبت طفلة، وأنهم سيذهبون لزيارتها. قررت حور أن تعد هدية للمولودة الجديدة، لكنها لم تجد شيئًا مناسبًا. تذكرت حور بطانيتها الصوفية الصغيرة التي كانت تحتضنها في طفولتها. كانت البطانية قديمة لكنها دافئة وناعمة وتحمل ذكريات عزيزة. قررت حور أن تغسلها وتطويها بعناية. أما الأخ، فذهب إلى السوق واشترى لعبة بلاستيكية كبيرة تصدر موسيقى صاخبة وأضواء مبهرة. سألت حور بفضول: \"لماذا اخترت هذه اللعبة الصاخبة يا أخي؟ أنت مرهق من البحث!\" رد الأخ وهو يتأفف: \"لأن الهدية يجب أن تكون ملفتة للنظر حتى يراها الجميع في غرفة الخالة ويقولوا: 'انظروا كم هي غالية وجميلة!'\" ابتسمت حور وقالت: \"ألا تتذكر ما علمتنا إياه أمي؟ العطاء كأنه هدية لله تعالى أولاً. لا نحتاج لعيون الناس ولا لكل هذا التكلف بشيء قد لا ينفع الطفلة حديثة الولادة.\" وفي اليوم التالي، حمل كلٌّ منهما هديته، وقد امتلأت القلوب حماسًا للقاء الخالة والمولودة الجديدة. الإخلاص يقابل التكلف في غرفة الخالة، جلس الأخ ينتظر بصبر أن يدخل زوار آخرون ليروا هديته. كانت حور هادئة، قدمت بطانيتها الصغيرة الدافئة فورًا للخالة. ابتسمت الخالة وشكرت حور بحرارة: \"يا لها من هدية صادقة وضرورية! هذه البطانية الناعمة أفضل من أي شيء آخر لطفلتي.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الهدي",
        "text": "جاء دور الأخ ليقدم هديته. ضغط على زر اللعبة فجأة، فبدأت الموسيقى الصاخبة والأضواء القوية تملأ الغرفة. انزعجت الطفلة وبدأت بالبكاء بصوت عالٍ. اضطرت الخالة لإطفاء اللعبة ووضعها في مكان بعيد. همست حور في أذن أخيها: \"الله يُرادُ باليَسيرِ والنافع يا أخي، ليس بالعسير الذي يؤذي. عمل القلب الصادق (كالبطانية الدافئة) أثمن وأسهل من كل هذا التكلف الزائد.\" في تلك اللحظة، شعر الأخ بالخجل من تصنعه. لقد نسي أن الهدف هو منفعة الطفلة، وليس الإعجاب بثرائه. وبينما غادروا بيت الخالة، كان الصمت بينهما يحمل معنى التغيير الذي بدأ ينمو في قلبه. جمال البساطة والتذلل عندما عادوا إلى البيت، كانت حور سعيدة لأن هديتها جلبت الدفء والراحة، بينما كان الأخ حزيناً. قالت الأم بحنان: \"العطاء الصادق لا يحتاج إلى تكلّف أو تَصنُّع. التذلل والتواضع في العطاء أفضل لنا؛ لأن التكلف يرهقنا ويجعلنا نبحث عن مدح الناس، بينما البساطة توصل النفع الحقيقي للآخرين.\" نظر الأخ إلى حور وقال بصدق: \"لقد كنتُ متكلفاً وأبحث عن نظرات الإعجاب بدلاً من منفعة الطفلة. تعلمتُ اليوم أن الهدية الحقيقية هي تلك التي تُقدم بإخلاص، وبأسهل طريقة، بلا تكلف.\" ضحكت حور: \"صحيح! المهم أن المتلقي الحقيقي للهدية قد رآها وقبلها بالفعل، وهو الله سبحانه وتعالى.\" حقوق الأئمة"
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الرَّابِعَةُ: كَوْكَبُ الأَرْضِ",
      "topic": "الدَّرْسُ (1): جِيُولُوجْيَا الأَرْضِ وَالصُّخُورُ (طَبَقَاتُ الأَرْضِ، دَوْرَةُ الصُّخُورِ، الظَّوَاهِرُ الجِيُولُوجِيَّةُ، وَالثَّرَوَاتُ)",
      "coverImg": "assets/y7/scince/s13.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s13.1.jpg",
          "text": "الدَّرْسُ (1) جِيُولُوجْيَا الأَرْضِ وَالصُّخُورُ: (1) طَبَقَاتُ بَاطِنِ الأَرْضِ: القِشْرَةُ الأَرْضِيَّةُ (قَارِّيَّةٌ وَمُحِيطِيَّةٌ صُلْبَةٌ)، وَالوِشَاحُ/السِّتَارُ (صُخُورٌ شَدِيدَةُ الحَرَارَةِ)، وَلُبُّ الأَرْضِ (خَارِجِيٌّ سَائِلٌ يَصْنَعُ المِغْنَاطِيسِيَّةَ وَدَاخِلِيٌّ صُلْبٌ). (2) أَنْوَاعُ الصُّخُورِ: نَارِيَّةٌ مِنْ تَبْرِيدِ الصُّهَارَةِ (جَرَانِيتُ، بَازَلْتُ)، وَرُسُوبِيَّةٌ ذَاتُ طَبَقَاتٍ وَأَحَافِيرَ (حَجَرٌ جِيرِيٌّ)، وَمُتَحَوِّلَةٌ بِالحَرَارَةِ وَالضَّغْطِ (رُخَامٌ). (3) الظَّوَاهِرُ الجِيُولُوجِيَّةُ: حَرَكَةُ الصَّفَائِحِ التِّكْتُونِيَّةِ وَالبَرَاكِينُ وَالزَّلَازِلُ وَالتَّجْوِيَةُ. (4) الثَّرَوَاتُ: المَعَادِنُ (حَدِيدٌ، نُحَاسٌ، ذَهَبٌ) وَالتُّرْبَةُ الزِّرَاعِيَّةُ وَالمِيَاهُ الجَوْفِيَّةُ."
        }
      ],
      "text": "الدَّرْسُ (1) جِيُولُوجْيَا الأَرْضِ وَالصُّخُورُ: (1) طَبَقَاتُ بَاطِنِ الأَرْضِ: القِشْرَةُ الأَرْضِيَّةُ (قَارِّيَّةٌ وَمُحِيطِيَّةٌ صُلْبَةٌ)، وَالوِشَاحُ/السِّتَارُ (صُخُورٌ شَدِيدَةُ الحَرَارَةِ)، وَلُبُّ الأَرْضِ (خَارِجِيٌّ سَائِلٌ يَصْنَعُ المِغْنَاطِيسِيَّةَ وَدَاخِلِيٌّ صُلْبٌ). (2) أَنْوَاعُ الصُّخُورِ: نَارِيَّةٌ مِنْ تَبْرِيدِ الصُّهَارَةِ (جَرَانِيتُ، بَازَلْتُ)، وَرُسُوبِيَّةٌ ذَاتُ طَبَقَاتٍ وَأَحَافِيرَ (حَجَرٌ جِيرِيٌّ)، وَمُتَحَوِّلَةٌ بِالحَرَارَةِ وَالضَّغْطِ (رُخَامٌ). (3) الظَّوَاهِرُ الجِيُولُوجِيَّةُ: حَرَكَةُ الصَّفَائِحِ التِّكْتُونِيَّةِ وَالبَرَاكِينُ وَالزَّلَازِلُ وَالتَّجْوِيَةُ. (4) الثَّرَوَاتُ: المَعَادِنُ (حَدِيدٌ، نُحَاسٌ، ذَهَبٌ) وَالتُّرْبَةُ الزِّرَاعِيَّةُ وَالمِيَاهُ الجَوْفِيَّةُ.",
      "q1": {
        "q": "مَا الطَّبَقَاتُ الثَّلَاثُ الرَّئِيسِيَّةُ لِبَاطِنِ كَوْكَبِ الأَرْضِ؟",
        "focusWord": "طَبَقَاتُ بَاطِنِ الأَرْضِ",
        "options": [
          {
            "text": "القِشْرَةُ الأَرْضِيَّةُ، وَالوِشَاحُ (السِّتَارُ)، وَلُبُّ الأَرْضِ (الخَارِجِيُّ وَالدَّاخِلِيُّ)",
            "correct": true
          },
          {
            "text": "التُّرُوبُوسْفِيرُ وَالسِّتْرَاتُوسْفِيرُ",
            "correct": false
          },
          {
            "text": "الجُذُورُ وَالسَّاقُ وَالأَوْرَاقُ",
            "correct": false
          },
          {
            "text": "البُرُوتُونُ وَالنِّيُوتْرُونُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "إِلَى أَيِّ نَوْعٍ مِنَ الصُّخُورِ يَنْتَمِي الجَرَانِيتُ وَالبَازَلْتُ النَّاتِجَانِ عَنْ تَبْرِيدِ الصُّهَارَةِ؟",
        "focusWord": "صُخُورٌ نَارِيَّةٌ",
        "options": [
          {
            "text": "الصُّخُورُ النَّارِيَّةُ",
            "correct": true
          },
          {
            "text": "الصُّخُورُ الرُّسُوبِيَّةُ",
            "correct": false
          },
          {
            "text": "الكُتَلُ الجَلِيدِيَّةُ",
            "correct": false
          },
          {
            "text": "المَحَالِيلُ المَائِيَّةُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَيْفَ يَتَكَوَّنُ صَخْرُ الرُّخَامِ الصُّلْبُ الجَمِيلُ؟",
        "focusWord": "صُخُورٌ مُتَحَوِّلَةٌ",
        "options": [
          {
            "text": "هُوَ صَخْرٌ مُتَحَوِّلٌ تَغَيَّرَ بِفِعْلِ الحَرَارَةِ وَالضَّغْطِ الشَّدِيدَيْنِ",
            "correct": true
          },
          {
            "text": "مِنْ تَجَمُّدِ مَاءِ المَطَرِ",
            "correct": false
          },
          {
            "text": "مِنْ أَوْرَاقِ الأَشْجَارِ",
            "correct": false
          },
          {
            "text": "مِنْ غَازِ الأُكْسِجِينِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "صُخُورٌ نَارِيَّةٌ",
          "left": "تَتَكَوَّنُ مِنْ تَبْرِيدِ الصُّهَارَةِ مِثْلَ الجَرَانِيتِ وَالبَازَلْتِ"
        },
        {
          "right": "صُخُورٌ رُسُوبِيَّةٌ",
          "left": "طَبَقَاتٌ وَرَوَاسِبُ وَأَحَافِيرُ مِثْلَ الحَجَرِ الجِيرِيِّ"
        },
        {
          "right": "صُخُورٌ مُتَحَوِّلَةٌ",
          "left": "تَغَيَّرَتْ بِالحَرَارَةِ وَالضَّغْطِ مِثْلَ الرُّخَامِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَكْنُونَاتِ وَثَرَوَاتِ جِيُولُوجْيَا كَوْكَبِ الأَرْضِ:",
        "correct": [
          "الجَرَانِيتُ وَالبَازَلْتُ (صُخُورٌ نَارِيَّةٌ)",
          "الحَجَرُ الجِيرِيُّ وَالرُّخَامُ",
          "المَعَادِنُ كَالحَدِيدِ وَالنُّحَاسِ وَالذَّهَبِ",
          "التُّرْبَةُ الزِّرَاعِيَّةُ وَالمِيَاهُ الجَوْفِيَّةُ"
        ],
        "wrong": [
          "النُّجُومُ الغَازِيَّةُ",
          "البِلَاسْتِيكُ الصِّنَاعِيُّ"
        ]
      },
      "applyStep": "أَتَفَكَّرُ فِي عَظَمَةِ خَلْقِ اللهِ لِلْجِبَالِ الرَّوَاسِي وَالصُّخُورِ وَالمَعَادِنِ وَأُحَافِظُ عَلَى ثَرَوَاتِ الأَرْضِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt13.jpg",
      "title": "تَمَارِينُ الجُمْبَازِ السَّمْعِيِّ اللُّغَوِيِّ وَالتَّرْمِيزِ الصَّوْتِيِّ (المَجْمُوعَةُ الحَادِيَةَ عَشْرَةَ: 71..77)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا بِالأُذُنِ وَاللِّسَانِ وَالعَيْنِ وَاليَدِ لِتَأْسِيسِ الفَصَاحَةِ وَالوَعْيِ الصَّوْتِيِّ وَالتَّهْيِئَةِ لِلْقِرَاءَةِ وَالخَطِّ!",
      "slideText": "🎵📖 تَمَارِينُ الجُمْبَازِ السَّمْعِيِّ اللُّغَوِيِّ وَالتَّرْمِيزِ الصَّوْتِيِّ (المَجْمُوعَةُ 11 — التَّمَارِينُ 71 إِلَى 77): (71) مِيزَانُ المَقَاطِعِ الصَّوْتِيَّةِ بِالتَّصْفِيقِ أَوِ المُكَعَّبَاتِ. (72) البُوصَلَةُ الصَّوْتِيَّةُ لِلْحَرَكَاتِ (رَفْعُ اليَدِ لِلْفَتْحَةِ، خَفْضُهَا لِلْكَسْرَةِ، وَضَمُّهَا لِلضَّمَّةِ). (73) الإِبْدَالُ الصَّوْتِيُّ لِحَرْفٍ فِي الكَلِمَةِ. (74) النَّقْشُ الحِسِّيُّ لِحَرْفٍ أَوْ رَقْمٍ مَرْسُومٍ عَلَى الكَفِّ أَوِ الظَّهْرِ. (75) قِطَارُ الكَلِمَاتِ (كَلِمَةٌ تَبْدَأُ بِآخِرِ حَرْفٍ مِنَ السَّابِقَةِ مِثْلَ: رَمْلٌ ← بَدْرٌ ← قِطَارٌ). (76) هَنْدَسَةُ الجُمْلَةِ التَّامَّةِ. (77) الخَرِيطَةُ القَصَصِيَّةُ (البِدَايَةُ، المَكَانُ، الحَدَثُ، وَالحَلُّ).",
      "q1": {
        "q": "كَيْفَ نُمَثِّلُ الحَرَكَاتِ الثَّلَاثَ بِيَدِنَا فِي تَمْرِينِ (البُوصَلَةِ الصَّوْتِيَّةِ 72)؟",
        "focusWord": "البُوصَلَةُ الصَّوْتِيَّةُ",
        "options": [
          {
            "text": "رَفْعُ اليَدِ لِلْفَتْحَةِ، وَخَفْضُهَا لِلْكَسْرَةِ، وَضَمُّهَا لِلضَّمَّةِ",
            "correct": true
          },
          {
            "text": "إِغْلَاقُ العَيْنَيْنِ لِكُلِّ الحَرَكَاتِ",
            "correct": false
          },
          {
            "text": "القَفْزُ لِلْخَلْفِ",
            "correct": false
          },
          {
            "text": "عَدَمُ تَحْرِيكِ اليَدِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا قَاعِدَةُ لُعْبَةِ (قِطَارِ الكَلِمَاتِ 75) وَتَمْرِينِ (النَّقْشِ الحِسِّيِّ 74)؟",
        "focusWord": "قِطَارُ الكَلِمَاتِ وَالنَّقْشُ الحِسِّيُّ",
        "options": [
          {
            "text": "نَنْطِقُ كَلِمَةً تَبْدَأُ بِالحَرْفِ الأَخِيرِ لِلْكَلِمَةِ السَّابِقَةِ، وَنَتَعَرَّفُ بِاللَّمْسِ عَلَى الحَرْفِ المَرْسُومِ عَلَى الكَفِّ",
            "correct": true
          },
          {
            "text": "نُكَرِّرُ نَفْسَ الكَلِمَةِ عَشْرَ مَرَّاتٍ",
            "correct": false
          },
          {
            "text": "نَرْكُضُ فِي السَّاحَةِ",
            "correct": false
          },
          {
            "text": "نَلْعَبُ بِالمَاءِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا اللَّوْحَاتُ الأَرْبَعُ فِي تَمْرِينِ (الخَرِيطَةِ القَصَصِيَّةِ 77) لِإِعَادَةِ سَرْدِ القِصَّةِ؟",
        "focusWord": "الخَرِيطَةُ القَصَصِيَّةُ",
        "options": [
          {
            "text": "البِدَايَةُ، وَالمَكَانُ، وَالحَدَثُ، وَالحَلُّ",
            "correct": true
          },
          {
            "text": "الأَرْقَامُ فَقَطْ",
            "correct": false
          },
          {
            "text": "الأَلْوَانُ الحَارَّةُ فَقَطْ",
            "correct": false
          },
          {
            "text": "حُرُوفُ العِلَّةِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "البُوصَلَةُ الصَّوْتِيَّةُ (72)",
          "left": "رَفْعُ اليَدِ لِلْفَتْحَةِ وَخَفْضُهَا لِلْكَسْرَةِ وَضَمُّهَا لِلضَّمَّةِ"
        },
        {
          "right": "النَّقْشُ الحِسِّيُّ (74)",
          "left": "تَحَسُّسُ حَرْفٍ أَوْ رَقْمٍ مَرْسُومٍ عَلَى الكَفِّ مَعَ إِغْمَاضِ العَيْنَيْنِ"
        },
        {
          "right": "الخَرِيطَةُ القَصَصِيَّةُ (77)",
          "left": "سَرْدُ القِصَّةِ بِتَرْتِيبِ: البِدَايَةِ، المَكَانِ، الحَدَثِ، وَالحَلِّ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ الجُمْبَازِ السَّمْعِيِّ اللُّغَوِيِّ وَالتَّرْمِيزِ الصَّوْتِيِّ (71..77):",
        "correct": [
          "مِيزَانُ المَقَاطِعِ وَالبُوصَلَةُ الصَّوْتِيَّةُ",
          "الإِبْدَالُ الصَّوْتِيُّ وَالنَّقْشُ الحِسِّيُّ",
          "قِطَارُ الكَلِمَاتِ وَهَنْدَسَةُ الجُمْلَةِ",
          "الخَرِيطَةُ القَصَصِيَّةُ الرُّبَاعِيَّةُ"
        ],
        "wrong": [
          "القِرَاءَةُ بِلَا ضَبْطٍ لِلْحَرَكَاتِ",
          "بَعْثَرَةُ كَلِمَاتِ الجُمْلَةِ"
        ]
      },
      "applyStep": "أُطَبِّقُ البُوصَلَةَ الصَّوْتِيَّةَ بِيَدِي عِنْدَ سَمَاعِ الحَرَكَاتِ وَأَلْعَبُ قِطَارَ الكَلِمَاتِ مَعَ أُسْرَتِي."
    }
  },
  {
    "w": 14,
    "secNum": 4,
    "heavenName": "سَمَاءُ الثُّلَاثَاءِ الرَّابِعَةُ (م ن س ع)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الرَّابِعَةُ: عُلُومُ الأَرْضِ وَالجِيُولُوجْيَا وَالطَّقْسِ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "ن",
    "jummal": 50,
    "prophet": "سُلَيْمَانُ (ع)",
    "virtue": "الحِكْمَةُ",
    "unitHeader": "الوَحْدَةُ الرَّابِعَةَ عَشْرَةَ : نَبِيُّ اللهِ سُلَيْمَانُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "سَمِعَ نَبِيُّ اللهِ سُلَيْمَانُ (ع) نَمْلَةً صَغِيرَةً تُحَذِّرُ أَخَوَاتِهَا حَتَّى لَا يَحْطِمَهَا الجُنُودُ، فَتَبَسَّمَ ضَاحِكًا وَأَوْقَفَ جَيْشَهُ رَحْمَةً بِهَا وَشُكْرًا لِنِعْمَةِ اللهْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (القُوَّةُ المُسَخَّرَةُ مُقَابِلَ نَارِ الوَهْمِ وَالاسْتِكْبَارِ): تَسْخِيرُ النَّارِ وَالحَرَارَةِ لإِذَابَةِ النُّحَاسِ (﴿وَأَسَلْنَا لَهُ عَيْنَ الْقِطْرِ﴾) لِصِنَاعَةِ القُدُورِ الرَّاسِيَاتِ وَالعُمْرَانِ، وَتَقْيِيدُ مَرَدَةِ الشَّيَاطِينِ النَّارِيِّينَ فِي الأَصْفَادِ؛ وَفِي مُقَابِلِهَا انْكِشَافُ زَيْفِ عِبَادَةِ الشَّمْسِ النَّارِيَّةِ الَّتِي كَانَ يَسْجُدُ لَهَا قَوْمُ سَبَأٍ، وَرَدُّ الشَّمْسِ لِسُلَيْمَانَ لِيُصَلِّيَ العَصْرَ فِي وَقْتِهَا. B. الرِّيحُ (المُسَخَّرَةُ بِالحَقِّ مُقَابِلَ رِيحِ السِّحْرِ وَالوَهْمِ): تَسْخِيرُ الرِّيحِ الرُّخَاءِ الطَّيِّبَةِ وَالرِّيحِ العَاصِفَةِ القَوِيَّةِ تَحْمِلُ بِسَاطَ سُلَيْمَانَ وَجُنُودَهُ فِي الهَوَاءِ إِلَى الأَرْضِ المُبَارَكَةِ، وَإِبْطَالُ رِيحِ السِّحْرِ وَالأَكَاذِيبِ الَّتِي افْتَرَتْهَا الشَّيَاطِينُ عَلَى مُلْكِ سُلَيْمَانَ (﴿وَمَا كَفَرَ سُلَيْمَانُ﴾)، وَسُقُوطُ وَهْمِ الجِنِّ بِادِّعَاءِ عِلْمِ الغَيْبِ عِنْدَ مَوْتِهِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ وَالعُمْرَانُ): حُكْمُ سُلَيْمَانَ العَقْلِيُّ الدَّقِيقُ فِي حَرْثِ الأَرْضِ وَالكَرْمِ، وَحِكْمَةُ النَّمْلَةِ فِي وَادِي النَّمْلِ وَمَسَاكِنِهَا التُّرَابِيَّةِ، وَبِنَاءُ المَحَارِيبِ وَإِتْمَامُ بَيْتِ المَقْدِسِ، وَاخْتِبَارُ عَقْلِ بِلْقِيسَ بِتَنْكِيرِ عَرْشِهَا، وَأَكْلُ دَابَّةِ الأَرْضِ (الأَرَضَةِ التُّرَابِيَّةِ) لِمِنْسَأَتِهِ. D. المَاءُ (الطَّاعَةُ وَالشُّكْرُ وَالزُّهْدُ): غَوْصُ الغَوَّاصِينَ فِي أَعْمَاقِ مَاءِ البَحْرِ لاسْتِخْرَاجِ الجَوَاهِرِ، وَجَرَيَانُ المَاءِ الصَّافِي تَحْتَ الصَّرْحِ المُمَرَّدِ مِنْ قَوَارِيرَ، وَتَوَاضُعُ سُلَيْمَانَ وَزُهْدُهُ فِي أَكْلِ خُبْزِ الشَّعِيرِ مِنْ عَمَلِ يَدِهِ وَشُكْرُهُ الدَّائِمُ: ﴿رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ﴾.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الثُّلَاثَاءِ العَظِيمْ، يَأْتِي النَّبِيُّ الرَّقْمُ أَرْبَعَةَ عَشَرَ كَالبَدْرِ الكَامِلِ فِي مَنْزِلَةِ الرِّيحِ الطَّيِّبَةِ المُسَخَّرَةِ بِأَمْرِ الرَّحْمٰنْ، وَهُوَ نَبِيُّ اللهِ سُلَيْمَانُ بْنُ دَاوُودَ عَلَيْهِمَا السَّلَامْ. وَهَبَهُ اللهُ الحِكْمَةَ وَالفَهْمَ مُنْذُ صِغَرِهِ حِينَ حَكَمَ مَعَ أَبِيهِ دَاوُودَ فِي قَضِيَّةِ الحَرْثِ وَالبُسْتَانِ الَّذِي رَعَتْ فِيهِ غَنَمُ القَوْمِ لَيْلًا، فَفَهَّمَهَا اللهُ سُلَيْمَانَ لِيَعُودَ الكَرْمُ أَخْضَرَ كَمَا كَانَ وَيَسْتَفِيدَ صَاحِبُهُ مِنْ لَبَنِ الغَنَمِ وَصُوفِهَا فِي عَدْلٍ وَإِحْسَانْ. وَوَرِثَ سُلَيْمَانُ أَبَاهُ دَاوُودَ فِي النُّبُوَّةِ وَالعِلْمِ وَدَعَا رَبَّهُ بِقَلْبٍ خَاشِعٍ مُنِيبٍ قَائِلًا رَبِّ اغْفِرْ لِي وَهَبْ لِي مُلْكًا لَا يَنْبَغِي لِأَحَدٍ مِنْ بَعْدِي إِنَّكَ أَنْتَ الوَهَّابُ المَنَّانْ.",
      "فَاسْتَجَابَ اللهُ دُعَاءَهُ وَنَالَ مُلْكًا عَظِيمًا لَمْ يُعْطَهُ أَحَدٌ فِي العَالَمِينْ، فَسَخَّرَ اللهُ لَهُ الرِّيحَ تَجْرِي بِأَمْرِهِ رُخَاءً طَيِّبَةً حَيْثُ أَصَابَ وَعَاصِفَةً تَحْمِلُ بِسَاطَهُ الوَاسِعَ إِلَى الأَرْضِ المُبَارَكَةِ غُدُوُّهَا شَهْرٌ وَرَوَاحُهَا شَهْرٌ فِي الفَضَاءْ، وَأَسَالَ لَهُ عَيْنَ القِطْرِ وَهُوَ النُّحَاسُ المُذَابُ كَالْمَاءْ، وَسَخَّرَ لَهُ الشَّيَاطِينَ وَالجِنَّ فَمِنْهُمْ كُلُّ بَنَّاءٍ يَبْنِي المَحَارِيبَ العَالِيَةَ وَيَصْنَعُ الجِفَانَ الوَاسِعَةَ كَالأَحْوَاضِ وَالقُدُورَ الرَّاسِيَاتِ لإِطْعَامِ المَسَاكِينْ، وَمِنْهُمْ كُلُّ غَوَّاصٍ يَغُوصُ فِي البِحَارِ لاسْتِخْرَاجِ اللُّؤْلُؤِ وَالمَرْجَانْ، وَقَيَّدَ المَرَدَةَ الأَشْرَارَ فِي الأَصْفَادِ وَجَمَعَ كُتُبَ السِّحْرِ الكَاذِبَةِ فَدَفَنَهَا تَحْتَ كُرْسِيِّهِ لِيَحْمِيَ النَّاسَ مِنْ رِيحِ الوَهْمِ وَالبُهْتَانْ، فَكَانَ سُلَيْمَانُ مُنَزَّهًا عَنِ السِّحْرِ كَمَا شَهِدَ اللهُ لَهُ وَمَا كَفَرَ سُلَيْمَانُ وَلٰكِنَّ الشَّيَاطِينَ كَفَرُوا بِمَا صَنَعُوا مِنَ الزُّورِ وَالعِصْيَانْ. وَرَغْمَ هٰذَا المُلْكِ الكَبِيرِ كَانَ سُلَيْمَانُ يَنْسِجُ سِلَالَ الخُوصِ بِيَدِهِ وَيَأْكُلُ مِنْ كَسْبِهِ خُبْزَ الشَّعِيرِ وَيَقُومُ اللَّيْلَ خَاشِعًا عَمَلًا بِأَمْرِ اللهِ اعْمَلُوا آلَ دَاوُودَ شُكْرًا.",
      "وَعَلَّمَهُ اللهُ مَنْطِقَ الطَّيْرِ وَالحَيَوَانِ فَكَانَ يَفْهَمُ تَسْبِيحَ الطُّيُورِ فِي السَّمَاءِ وَأَصْوَاتَ الكَائِنَاتِ فِي البَرِّ وَالبَحْرْ. وَفِي يَوْمٍ حُشِرَ لِسُلَيْمَانَ جُنُودُهُ مِنَ الجِنِّ وَالإِنْسِ وَالطَّيْرِ فَهُمْ يُوزَعُونَ فِي نِظَامٍ بَدِيعْ، حَتَّى إِذَا أَتَوْا عَلَى وَادِي النَّمْلِ خَافَتْ نَمْلَةٌ حَكِيمَةٌ عَلَى قَوْمِهَا فَنَادَتْ يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ لَا يَحْطِمَنَّكُمْ سُلَيْمَانُ وَجُنُودُهُ وَهُمْ لَا يَشْعُرُونْ. فَسَمِعَ سُلَيْمَانُ كَلَامَهَا حِينَ نَقَلَتْهُ الرِّيحُ إِلَى أُذُنِهِ فَتَبَسَّمَ ضَاحِكًا مِنْ قَوْلِهَا وَأَوْقَفَ الجَيْشَ إِكْرَامًا لَهَا حَتَّى أَمِنَ النَّمْلُ فِي مَسَاكِنِهِ التُّرَابِيَّةْ، وَرَفَعَ يَدَيْهِ يَشْكُرُ كُلَّ نِعْمَةٍ وَهَبَهَا اللهُ لَهُ قَائِلًا رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهْ.",
      "ثُمَّ تَفَقَّدَ سُلَيْمَانُ الطَّيْرَ فَلَمْ يَرَ الهُدْهُدَ المَسْؤُولَ عَنْ دَلَالَةِ الجَيْشِ عَلَى المَاءِ تَحْتَ التُّرَابْ، فَمَكَثَ الهُدْهُدُ غَيْرَ بَعِيدٍ ثُمَّ جَاءَ فَنَطَقَ بِخَبَرٍ صَادِقٍ مِنْ أَرْضِ سَبَأٍ فِي اليَمَنْ، وَأَخْبَرَهُ أَنَّ مَلِكَتَهُمْ بِلْقِيسَ وَقَوْمَهَا قَدْ خَدَعَهُمُ الشَّيْطَانُ فَسَجَدُوا لِلشَّمْسِ مِنْ دُونِ اللهِ الَّذِي يَعْلَمُ السِّرَّ وَالعَلَنْ. فَكَتَبَ سُلَيْمَانُ كِتَابًا يَبْدَأُ بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ أَلَّا تَعْلُوا عَلَيَّ وَأْتُونِي مُسْلِمِينْ، فَأَرْسَلَتْ بِلْقِيسُ هَدِيَّةً مِنْ ذَهَبٍ لِتَخْتَبِرَهُ فَرَفَضَ سُلَيْمَانُ هَدِيَّةَ الدُّنْيَا وَقَالَ فَمَا آتَانِيَ اللهُ خَيْرٌ مِمَّا آتَاكُمْ. وَلَمَّا أَقْبَلَتْ بِلْقِيسُ سَأَلَ سُلَيْمَانُ أَيُّكُمْ يَأْتِينِي بِعَرْشِهَا قَبْلَ أَنْ يَأْتُونِي مُسْلِمِينْ، فَقَالَ وَصِيُّهُ الصِّدِّيقُ آصِفُ بْنُ بَرْخِيَا الَّذِي عِنْدَهُ عِلْمٌ مِنَ الكِتَابِ وَحَرْفٌ وَاحِدٌ مِنَ الاسْمِ الأَعْظَمِ أَنَا آتِيكَ بِهِ قَبْلَ أَنْ يَرْتَدَّ إِلَيْكَ طَرْفُكْ! فَدَعَا آصِفُ رَبَّهُ فَغَاصَ العَرْشُ فِي الأَرْضِ مِنْ سَبَأٍ وَظَهَرَ أَمَامَ سُلَيْمَانَ فِي لَحْظَةٍ وَاحِدَةْ، فَسَجَدَ سُلَيْمَانُ شَاكِرًا وَأَمَرَ بِتَغْيِيرِ بَعْضِ زِينَةِ العَرْشِ لِيَخْتَبِرَ عَقْلَ بِلْقِيسَ فَعَرَفَتْهُ بِحِكْمَتِهَا، ثُمَّ أَدْخَلَهَا الصَّرْحَ المُمَرَّدَ المَبْنِيَّ مِنْ زُجَاجِ القَوَارِيرِ الصَّافِي فَوْقَ المَاءِ الجَارِي، فَظَنَّتْهُ لُجَّةَ مَاءٍ وَكَشَفَتْ عَنْ سَاقَيْهَا، فَأَخْبَرَهَا سُلَيْمَانُ أَنَّهُ صَرْحٌ مُمَرَّدٌ مِنْ قَوَارِيرْ، فَأَدْرَكَتْ بِعَقْلِهَا الحَقِيقَةَ وَتَرَكَتْ عِبَادَةَ الشَّمْسِ قَائِلَةً رَبِّ إِنِّي ظَلَمْتُ نَفْسِي وَأَسْلَمْتُ مَعَ سُلَيْمَانَ لِلهِ رَبِّ العَالَمِينْ.",
      "وَكَانَ سُلَيْمَانُ يُحِبُّ الصَّلَاةَ وَذِكْرَ رَبِّهْ، وَفِي عَشِيَّةِ يَوْمٍ عُرِضَتْ عَلَيْهِ الخُيُولُ الأَصِيلَةُ الصَّافِنَاتُ الجِيَادُ المُعَدَّةُ لِلْجِهَادِ فِي سَبِيلِ اللهِ وَقَالَ إِنِّي أَحْبَبْتُ حُبَّ الخَيْرِ عَنْ ذِكْرِ رَبِّي حَتَّى غَرَبَتِ الشَّمْسُ وَتَوَارَتْ بِالحِجَابْ، فَسَأَلَ اللهَ قَائِلًا رُدُّوهَا عَلَيَّ، فَرَدَّ اللهُ لَهُ الشَّمْسَ بِآيَةٍ بَاهِرَةٍ حَتَّى صَلَّى العَصْرَ فِي وَقْتِهَا وَمَسَحَ بِيَدِهِ الكَرِيمَةِ عَلَى سُوقِ الخَيْلِ وَأَعْنَاقِهَا تَكْرِيمًا لَهَا، وَفِي كُلِّ ابْتِلَاءٍ كَانَ يَرْجِعُ إِلَى رَبِّهِ كَمَا قَالَ تَعَالَى ثُمَّ أَنَابَ إِلَى المَوْلَى العَلِيمْ. وَفِي خِتَامِ عُمْرِهِ وَقَفَ سُلَيْمَانُ فِي قُبَّةِ العِبَادَةِ مُتَّكِئًا عَلَى عَصَاهُ وَمِنْسَأَتِهِ يَقُولُ لِلمُؤْمِنِينَ نَحْنُ نُطِيعُ اللهَ بِالإِخْلَاصِ وَاليَقِينْ، فَقَبَضَ اللهُ رُوحَهُ الطَّاهِرَةَ وَهُوَ وَاقِفٌ مُتَّكِئٌ عَلَى عَصَاهُ حَتَّى أَتَمَّتِ الجِنُّ بِنَاءَ المَسْجِدِ دُونَ أَنْ يَعْلَمُوا بِمَوْتِهْ، حَتَّى أَكَلَتْ دَابَّةُ الأَرْضِ الأَرَضَةُ مِنْسَأَتَهُ فَخَرَّ عَلَى الأَرْضِ فَتَبَيَّنَتْ الجِنُّ وَعَلِمَ النَّاسُ أَنَّ الجِنَّ لَا يَعْلَمُونَ الغَيْبَ وَأَنَّ العِلْمَ وَالمُلْكَ كُلَّهُ لِلهِ رَبِّ العَالَمِينْ."
    ],
    "words": [
      {
        "word": "مَنْطِقَ",
        "desc": "وسط متصل / ساكن: ـنْـ",
        "raw": "مَنْطِقَ (وسط متصل / ساكن: ـنْـ)"
      },
      {
        "word": "اليَقِينْ",
        "desc": "آخر متصل / ساكن وقفا: ـنْ",
        "raw": "اليَقِينْ (آخر متصل / ساكن وقفا: ـنْ)"
      },
      {
        "word": "نَمْلَةٌ",
        "desc": "أول منفصل / متحرك بالفتح: نَـ",
        "raw": "نَمْلَةٌ (أول منفصل / متحرك بالفتح: نَـ)"
      },
      {
        "word": "فَنَطَقَ",
        "desc": "أول متصل / متحرك بالفتح: ـنَـ",
        "raw": "فَنَطَقَ (أول متصل / متحرك بالفتح: ـنَـ)"
      },
      {
        "word": "صَنَعُوا",
        "desc": "وسط متصل / متحرك بالفتح: ـنَـ",
        "raw": "صَنَعُوا (وسط متصل / متحرك بالفتح: ـنَـ)"
      },
      {
        "word": "أَنَابَ",
        "desc": "وسط منفصل / متحرك بالفتح: نَـ",
        "raw": "أَنَابَ (وسط منفصل / متحرك بالفتح: نَـ)"
      },
      {
        "word": "أَمِنَ",
        "desc": "آخر متصل / متحرك بالفتح: ـنَ",
        "raw": "أَمِنَ (آخر متصل / متحرك بالفتح: ـنَ)"
      },
      {
        "word": "نُطِيعُ",
        "desc": "أول منفصل / متحرك بالضم: نُـ",
        "raw": "نُطِيعُ (أول منفصل / متحرك بالضم: نُـ)"
      },
      {
        "word": "سُلَيْمَانُ",
        "desc": "آخر منفصل / متحرك بالضم: نُ",
        "raw": "سُلَيْمَانُ (آخر منفصل / متحرك بالضم: نُ)"
      },
      {
        "word": "نِعْمَةٍ",
        "desc": "أول منفصل / متحرك بالكسر: نِـ",
        "raw": "نِعْمَةٍ (أول منفصل / متحرك بالكسر: نِـ)"
      },
      {
        "word": "بَنَّاءٍ",
        "desc": "وسط متصل / مضعف بالفتح: ـنَّـ",
        "raw": "بَنَّاءٍ (وسط متصل / مضعف بالفتح: ـنَّـ)"
      },
      {
        "word": "الجِنُّ",
        "desc": "آخر متصل / مضعف بالضم: ـنُّ",
        "raw": "الجِنُّ (آخر متصل / مضعف بالضم: ـنُّ)"
      },
      {
        "word": "إِنِّي",
        "desc": "وسط متصل / مضعف بالكسر: ـنِّـ",
        "raw": "إِنِّي (وسط متصل / مضعف بالكسر: ـنِّـ)"
      },
      {
        "word": "نَالَ",
        "desc": "أول منفصل / ممدود بالألف: نَا",
        "raw": "نَالَ (أول منفصل / ممدود بالألف: نَا)"
      },
      {
        "word": "جُنُودُهُ",
        "desc": "وسط متصل / ممدود بالواو: ـنُو",
        "raw": "جُنُودُهُ (وسط متصل / ممدود بالواو: ـنُو)"
      },
      {
        "word": "مُنِيبٍ",
        "desc": "وسط متصل / ممدود بالياء: ـنِي",
        "raw": "مُنِيبٍ (وسط متصل / ممدود بالياء: ـنِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ النُّونِ (ن): النُّطْقُ السَّلِيمُ لِحَرْفِ النُّونِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ لِثَةِ الثَّنَايَا العُلْيَا مَعَ الغُنَّةِ الرَّنَّانَةِ مِنَ الخَيْشُومِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى افْتِتَاحِ الكُتُبِ وَالأَعْمَالِ بِالبَسْمَلَةِ الكَامِلَةِ كَكِتَابِ سُلَيْمَانَ: ﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾، وَدُعَاءِ الشُّكْرِ وَالحَمْدِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الإِنَاءُ المُنْحَنِي وَالنُّقْطَةُ العُلْيَا وَسُرْعَةُ الطَّرْفِ وَبَدْرُ التَّمَامِ (14): مُشَاهَدَةُ شَكْلِ حَرْفِ النُّونِ (ن) الَّذِي يُشْبِهُ الجَفْنَةَ الوَاسِعَةَ أَوْ قُبَّةَ الصَّرْحِ وَفَوْقَهَا نُقْطَةٌ مُنِيرَةٌ كَالهُدْهُدِ الرَّاصِدِ فِي الفَضَاءِ أَوْ كَالبَدْرِ الكَامِلِ لَيْلَةَ أَرْبَعَةَ عَشَرَ (14)، وَتَدْرِيبُ العَيْنِ عَلَى دِقَّةِ المُلَاحَظَةِ وَالتَّفَقُّدِ (﴿وَتَفَقَّدَ الطَّيْرَ﴾)، وَالتَّمْيِيزِ البَصَرِيِّ بَيْنَ الزُّجَاجِ الشَّفَّافِ (القَوَارِيرِ) وَاللُّجَّةِ المَائِيَّةِ، وَإِدْرَاكِ مِقْدَارِ «ارْتِدَادِ الطَّرْفِ» (رَمْشَةِ العَيْنِ)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ سُلَيْمَانَ الكَامِلَةُ وَالإِنْصَاتُ لِمَنْطِقِ الطَّيْرِ وَالنَّمْلِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ سُلَيْمَانَ، وَتَدْرِيبُ الأُذُنِ عَلَى الإِنْصَاتِ الدَّقِيقِ لِأَصْوَاتِ الطَّبِيعَةِ وَالطُّيُورِ وَالكَائِنَاتِ الصَّغِيرَةِ كَمَا سَمِعَ سُلَيْمَانُ هَمْسَ النَّمْلَةِ وَحَدِيثَ الهُدْهُدِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ قَبْلَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ أَرْبَعَةَ عَشَرَ (14) وَالخَمْسُونَ (50): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (14) وَمَعْرِفَةِ قِيمَةِ النُّونِ العَشْرِيَّةِ (50 = خَمْسُ عَشَرَاتٍ وَنِصْفُ المِائَةِ)، وَحِسَابِ الزَّمَنِ وَالمَسَافَاتِ (غُدُوُّهَا شَهْرٌ وَرَوَاحُهَا شَهْرٌ = 60 يَوْمًا)، وَتَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّسَائِلِ الهَادِفَةِ، وَسَفِّ الخُوصِ (نَسْجِ السِّلَالِ مِنْ سَعَفِ النَّخْلِ كَمَا كَانَ يَعْمَلُ سُلَيْمَانُ بِيَدِهِ)، وَالمَسْحِ الرَّحِيمِ عَلَى أَعْنَاقِ الخَيْلِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ المَسِيرِ المُنَظَّمِ وَالانتِبَاهِ لِمَوْطِئِ القَدَمِ وَالوُقُوفِ الثَّابِتِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى المَشْيِ العَسْكَرِيِّ المُنْتَظِمِ فِي صُفُوفٍ مُرَتَّبَةٍ (﴿فَهُمْ يُوزَعُونَ﴾ أَيْ يُجْمَعُ أَوَّلُهُمْ إِلَى آخِرِهِمْ بِنِظَامٍ)، مَعَ اليَقَظَةِ التَّامَّةِ لِمَوْطِئِ القَدَمِ حَتَّى لَا تَدُوسَ الرِّجْلُ نَمْلَةً أَوْ نَبْتَةً صَغِيرَةً، وَتَمْرِينِ الوُقُوفِ الثَّابِتِ المُتَّزِنِ بِالاتِّكَاءِ عَلَى العَصَا (المِنْسَأَةِ)."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ النُّحَاسِ وَالزُّجَاجِ وَتَنْظِيمِ النَّمْلِ وَخُبْزِ الشَّعِيرِ: تَعَلُّمُ كَيْفَ يَنْصَهِرُ مَعْدِنُ النُّحَاسِ (القِطْرِ) بِالحَرَارَةِ لِتُصْنَعَ مِنْهُ الأَوَانِي وَالقُدُورُ الكَبِيرَةُ، وَكَيْفَ يُصْنَعُ الزُّجَاجُ الشَّفَّافُ (القَوَارِيرُ) مِنَ الرَّمْلِ، وَدِرَاسَةِ النِّظَامِ الغِذَائِيِّ العَجِيبِ لِمَمْلَكَةِ النَّمْلِ فِي تَخْزِينِ الحُبُوبِ، وَالاقْتِدَاءِ بِكَرَمِ سُلَيْمَانَ فِي إِطْعَامِ النَّاسِ مَعَ زُهْدِهِ فِي أَكْلِ خُبْزِ الشَّعِيرِ مِنْ كَسْبِ يَدِهِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ التَّوَاضُعِ عِنْدَ المُلْكِ وَالعِفَّةِ عَنْ هَدَايَا الرِّشْوَةِ وَالمُحَافَظَةِ عَلَى الصَّلَاةِ: تَعَلُّمُ خُلُقِ التَّوَاضُعِ وَالتَّبَسُّمِ اللَّطِيفِ مَعَ الضُّعَفَاءِ، وَالنَّزَاهَةِ وَالعِفَّةِ عَنْ قَبُولِ الهَدَايَا الَّتِي يُرَادُ بِهَا التَّنَازُلُ عَنِ الحَقِّ، وَحِفْظِ سَتْرِ الثِّيَابِ وَالأَدَبِ عِنْدَ المَشْيِ، وَالحِرْصِ الشَّدِيدِ عَلَى أَدَاءِ الصَّلَاةِ فِي أَوَّلِ وَقْتِهَا."
      }
    },
    "grammar": {
      "topic": "أَزْمِنَةُ الفِعْلِ (3): فِعْلُ الأَمْرِ المَبْنِيُّ عَلَى السُّكُونْ",
      "rule": "فِعْلُ الأَمْرِ يَدُلُّ عَلَى طَلَبِ القِيَامِ بِعَمَلٍ نَافِعٍ، وَتَكُونُ حَرَكَةُ آخِرِهِ السُّكُونَ (ـْ).",
      "example": "اُنْظُرْ إِلَى النَّمْلَةِ — اِحْفَظْ لِسَانَكَ — اِعْمَلْ بِحِكْمَةٍ.",
      "focusWord": "اُنْظُرْ",
      "q": "أَيُّ فِعْلٍ مِنْ هٰذِهِ الأَفْعَالِ هُوَ «فِعْلُ أَمْرٍ» مَبْنِيٌّ عَلَى السُّكُونْ؟",
      "opts": [
        "اُنْظُرْ",
        "نَظَرَ",
        "يَنْظُرُ",
        "النَّظَرُ"
      ]
    },
    "earIirab": {
      "topic": "وَقْفَةُ السُّكُونِ (ـْ) فِي فِعْلِ الأَمْرِ وَنَصْبُ المَفْعُولِ بِهْ",
      "rule": "نَقِفُ بِالسُّكُونِ عَلَى آخِرِ فِعْلِ الأَمْرِ (ـْ)، وَنَنْصِبُ الاِسْمَ الَّذِي وَقَعَ عَلَيْهِ الطَّلَبُ بِالفَتْحَةِ (ـَ).",
      "sentence": "اِحْفَظِ العَهْدَ بِأَمَانَةٍ.",
      "targetWord": "العَهْدَ",
      "caseAns": "مَفْعُولٌ بِهِ مَنْصُوبٌ بِالفَتْحَةِ (ـَ)"
    },
    "math": {
      "numVal": 54,
      "numName": "أَرْبَعَةٌ وَخَمْسُونَ",
      "eqDisplay": "4 + 50 = 54",
      "subDisplay": "54 - 4 = 50",
      "compDisplay": "45 < 54",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (54) بِالعَرَبِيَّةِ؟",
        "focus": "54",
        "ans": "أَرْبَعَةٌ وَخَمْسُونَ",
        "wrong": [
          "خَمْسَةٌ وَأَرْبَعُونَ",
          "خَمْسُونَ",
          "أَرْبَعَةٌ وَسِتُّونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "54 - 4 = ؟",
        "ans": "50 (خَمْسُونَ)",
        "wrong": [
          "40 (أَرْبَعُونَ)",
          "45",
          "58"
        ]
      }
    },
    "sport": {
      "title": "تَنَفُّسُ البَالُونِ البَطْنِيُّ العَمِيقُ",
      "middleText": "أَضَعُ يَدَيَّ عَلَى بَطْنِي وَآخُذُ شَهِيقًا عَمِيقًا مِنَ الأَنْفِ حَتَّى يَرْتَفِعَ بَطْنِي كَالبَالُونِ ثُمَّ أَزْفِرُ بِبُطْءْ. يُجَدِّدُ هٰذَا التَّمْرِينُ الأُكْسِجِينَ فِي الدِّمَاغِ وَيَمْنَحُ الجِسْمَ هُدُوءًا وَتَرْكِيزًا."
    },
    "sci": {
      "title": "التَّضَارِيسُ وَالغِلَافُ المَائِيُّ: الجِبَالُ وَالأَنْهَارُ وَالبِحَارُ",
      "summaryThird": "تَتَنَوَّعُ تَضَارِيسُ الأَرْضِ بَيْنَ جِبَالٍ شَامِخَةٍ تُثَبِّتُ القِشْرَةَ الأَرْضِيَّةَ وَسُهُولٍ خَضْرَاءَ، وَتَجْرِي المِيَاهُ العَذْبَةُ فِي الأَنْهَارِ بَيْنَمَا تُغَطِّي البِحَارُ وَالمُحِيطَاتُ المَالِحَةُ مُعْظَمَ كَوْكَبِنَا.",
      "focusConcept": "الأَنْهَارُ وَاليَنَابِيعُ",
      "factAns": "مَصْدَرُ المِيَاهِ العَذْبَةِ لِلشُّرْبِ وَالزِّرَاعَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الهَدْيِ وَالإِخْلَاصِ لله (حُور وَسُرُور - 14)",
      "storySentence": "تَعَلَّمَ سُرُورٌ وَحُورُ أَنَّ كُلَّ عَمَلٍ صَالِحٍ نُقَدِّمُهُ يَجِبُ أَنْ يَكُونَ خَالِصًا لِوَجْهِ اللهِ تَعَالَى دُونَ رِيَاءٍ أَوْ تَفَاخُرٍ أَمَامَ النَّاسْ.",
      "applyAction": "أُتْقِنُ عَمَلِي وَدِرَاسَتِي إِخْلَاصًا للهِ وَحُبًّا لِلخَيْرْ."
    },
    "rightsFullTitle": "(15) حق سائسك بالسلطان + (16) حق سائسك بالعلم",
    "rightsQuote": "فأَمَّا حَقُّ سَائِسِكَ بالسُّلْطَانِ فَأَنْ تَعْلَمَ أنّكَ جُعِلْتَ لَهُ فِتنَة وأنَّهُ مُبْتَلىً فِيكَ بمَا جَعَلَهُ اللهُ لَهُ عَلَيْكَ مِنَ السُّلْطَانِ وَأَنْ تُخلِصَ لَهُ فِي النَّصِيحَةِ وَأَنْ لاتُمَاحِكَهُ وَقَدْ بُسِطْتَ يَدُهُ عَلَيْكَ فَتَكُونَ سَبَبَ هَلاكِ نفْسِكَ وَهلاكِهِ. وتَذَلَّلْ وتَلَطَّفْ لإِعْطَائِهِ مِنَ الرِّضَا مَا يَكُفُّهُ عَنْكَ وَلا يَضُرُّ بدينِكَ وتَسْتَعِينُ عَلَيْهِ فِي ذلِكَ باللهِ. ولا تُعَازَّهُ ولا تُعَانِدَهُ فَإنَّكَ إنْ فَعَلْتَ ذلِكَ عَقَقْتَهُ  وَعَقَقْتَ نَفْسَكَ فَعَرَضْتَهَا لِمَكرُوهِهِ وَعَرَضْتَهُ لِلْهَلَكَةِ فِيكَ وَكُنْتَ خَلِيقًا أَنْ تَكُونَ مُعِينًا لَهُ عَلَى نفْسِكَ وَشَرِيكًا لَهُ فِيمَا أَتى إلَيْكَ. وَلا قُوَّةَ إلا باللهِ. | وأَمَّا حَقُّ سَائِسِكَ بالعِلْــــــــمِ فالتَّعْظِيمُ لَهُ والتَّوْقِيرُ لِمَجْلِسِهِ وَحُسْــــنُ الاسْـــــــــــــتِمَاعِ إليهِ وَالإقْبَــــــالُ عَلَيْه  وَالْمَعُونةُ لَهُ عَلَى نفْسِكَ فِيمَــــا لا غِنَى بكَ عَنْهُ مِنْ الْعِلْمِ بأَنْ تُفَرِّغَ لَهُ عَقلَكَ وَتُحْضِرَهُ فَهْمَــــــــــــــكَ وتُزَكِّي لَهُ قَلْبَكَ وتُجَلِّى لَهُ بَصَرَكَ بتَرْكِ اللّذَّاتِ وَنقْص الشّهَوَاتِ، وَأَنْ تَعْلَــــــــــمَ أَنَّكَ فِيمَا أَلقَى إلَيْكَ رَسُولُهُ إلَى مَنْ لَقِيَكَ مِنْ أَهْلِ الْجَهْلِ فَلَزِمَكَ حُسْنُ التَّأْدِيَةِ عَنْهُ إلَيْهِمْ، ولا تَخُنْهُ فِي تَأْدِيَةِ رِسَـــــــــــــــالَتِهِ وَالْقِيَامِ بهَا عَنْهُ إذا تَقَلَّدْتَهَا. وَلا حَوْلَ وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (15) حق سائسك بالسلطان + (16) حق سائسك بالعلم",
        "text": "فأَمَّا حَقُّ سَائِسِكَ بالسُّلْطَانِ فَأَنْ تَعْلَمَ أنّكَ جُعِلْتَ لَهُ فِتنَة وأنَّهُ مُبْتَلىً فِيكَ بمَا جَعَلَهُ اللهُ لَهُ عَلَيْكَ مِنَ السُّلْطَانِ وَأَنْ تُخلِصَ لَهُ فِي النَّصِيحَةِ وَأَنْ لاتُمَاحِكَهُ وَقَدْ بُسِطْتَ يَدُهُ عَلَيْكَ فَتَكُونَ سَبَبَ هَلاكِ نفْسِكَ وَهلاكِهِ. وتَذَلَّلْ وتَلَطَّفْ لإِعْطَائِهِ مِنَ الرِّضَا مَا يَكُفُّهُ عَنْكَ وَلا يَضُرُّ بدينِكَ وتَسْتَعِينُ عَلَيْهِ فِي ذلِكَ باللهِ. ولا تُعَازَّهُ ولا تُعَانِدَهُ فَإنَّكَ إنْ فَعَلْتَ ذلِكَ عَقَقْتَهُ  وَعَقَقْتَ نَفْسَكَ فَعَرَضْتَهَا لِمَكرُوهِهِ وَعَرَضْتَهُ لِلْهَلَكَةِ فِيكَ وَكُنْتَ خَلِيقًا أَنْ تَكُونَ مُعِينًا لَهُ عَلَى نفْسِكَ وَشَرِيكًا لَهُ فِيمَا أَتى إلَيْكَ. وَلا قُوَّةَ إلا باللهِ. | وأَمَّا حَقُّ سَائِسِكَ بالعِلْــــــــمِ فالتَّعْظِيمُ لَهُ والتَّوْقِيرُ لِمَجْلِسِهِ وَحُسْــــنُ الاسْـــــــــــــتِمَاعِ إليهِ وَالإقْبَــــــالُ عَلَيْه  وَالْمَعُونةُ لَهُ عَلَى نفْسِكَ فِيمَــــا لا غِنَى بكَ عَنْهُ مِنْ الْعِلْمِ بأَنْ تُفَرِّغَ لَهُ عَقلَكَ وَتُحْضِرَهُ فَهْمَــــــــــــــكَ وتُزَكِّي لَهُ قَلْبَكَ وتُجَلِّى لَهُ بَصَرَكَ بتَرْكِ اللّذَّاتِ وَنقْص الشّهَوَاتِ، وَأَنْ تَعْلَــــــــــمَ أَنَّكَ فِيمَا أَلقَى إلَيْكَ رَسُولُهُ إلَى مَنْ لَقِيَكَ مِنْ أَهْلِ الْجَهْلِ فَلَزِمَكَ حُسْنُ التَّأْدِيَةِ عَنْهُ إلَيْهِمْ، ولا تَخُنْهُ فِي تَأْدِيَةِ رِسَـــــــــــــــالَتِهِ وَالْقِيَامِ بهَا عَنْهُ إذا تَقَلَّدْتَهَا. وَلا حَوْلَ وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ سُلَيْمَانُ (ع): آدَابُ التَّوَاضُعِ عِنْدَ المُلْكِ وَالعِفَّةِ عَنْ هَدَايَا الرِّشْوَةِ وَالمُحَافَظَةِ عَلَى الصَّلَاةِ: تَعَلُّمُ خُلُقِ التَّوَاضُعِ وَالتَّبَسُّمِ اللَّطِيفِ مَعَ الضُّعَفَاءِ، وَالنَّزَاهَةِ وَالعِفَّةِ عَنْ قَبُولِ الهَدَايَا الَّتِي يُرَادُ بِهَا التَّنَازُلُ عَنِ الحَقِّ، وَحِفْظِ سَتْرِ الثِّيَابِ وَالأَدَبِ عِنْدَ المَشْيِ، وَالحِرْصِ الشَّدِيدِ عَلَى أَدَاءِ الصَّلَاةِ فِي أَوَّلِ وَقْتِهَا."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق سائسك بالسلطان",
        "text": "🌿 نور وحور: حكمة التعامل مع السلطة قالت حور لأخيها: \"ما بك يا أخي؟ أراك غريبًا هذا الأسبوع!\" جلس بجانبها، وقال بنبرة هادئة: \"يا أختي، اسمعي ما حدث معنا هذا الأسبوع. أتى ناظر جديد إلى مدرستنا. عندما جاء الناظر الجديد، بدأ يتعامل بصرامة شديدة. وقف أحد الطلاب على الحائط ساعتين لأنه تأخر دقيقتين! وآخر جعله يحمل حقيبته طوال اليوم عقابًا لأنه نسي كتابه. شعرنا جميعًا أن الأمر فظيع، لكنني قررت أن أصبر وأراقب طريقة تصرفه أولًا.\" \"في اليوم التالي، رأيته يعاقب طالبًا بقسوة مفرطة بأن أوقفه في الشمس لرميه كيسًا في الأرض. اقتربت وقلت له بهدوء: 'أستاذي، نحن نحتاج النظام، لكن العقاب في الشمس قد يمنع الطالب من التركيز في الدرس القادم، وهذا يضعف تعلمه.' نظر إليّ متفاجئًا وغاضبًا، لكن كأنه وجد كلامي منطقيًا.\" \"ولكن طالبًا آخر واجهه بعناد ورفع صوته على عقابه بالطرد في أمر لم يقم به، من رسم على الحائط. فكانت النتيجة أن عوقب بضربه بالمسطرة. فهمت حينها أن الجدال والغضب لا يحلان المشكلة."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق سائسك بالسلطان",
        "text": "قررت أن أختار كلماتي وتوقيت نصحي بعناية. عندما هدأ اقتربت وقلت له بابتسامة: 'أنت هدفك الأساسي هو النظام، وهذا هدف صحيح، لكن هل يمكننا أن نجد اقتراحًا بديلاً يحافظ على النظام دون أن يضر الطالب نفسيًا؟ فنحن نستطيع وضع كاميرات مراقبة تثبت من الجاني الذي يرسم على الحائط.' نظر إليّ بتقدير هذه المرة، ثم غيّر قراره بطرد التلميذ.\" \"وفي الفسحة، طلب مني الناظر أن أساعده بإحضار المسطرة لمعاقبة بعض زملائي بتهمة الركض في الساحة خشية إسقاط الآخرين. قلت بهدوء: 'أعتذر يا أستاذ، لا أستطيع أن أؤذي أحدًا.' نظر إليّ بغضب، ولكني شعرت بالفخر لأنني لم أكن شريكًا في الظلم.\" قالت حور بابتسامة فهم: \"فهمت يا نور! إن الحل ليس في القوة أو المواجهة، بل في العقل والحكمة.\" أجاب نور بابتسامة عريضة: \"بالضبط يا أختي! بهذه الطريقة — الصبر والنصيحة والوقار واللطف والثبات على الحق — نحمي أنفسنا ونساعد الآخرين، ونكسب احترام من له سلطة علينا.\" قالت حور: \"الآن عرفت أن الكلمة الطيبة الحكيمة تفتح أبوابًا لا تفتحها القوة!\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق سائسك بالعلم",
        "text": "🌤️ نور وحور ودرس الإخلاص كان صباح الجمعة جميلاً وهادئًا، استيقظت العائلة على نداء الأم: \"هيا يا صغاري، استعدوا واغتسلوا وارتدوا ثيابكم، سنذهب إلى درس الجمعة للصغار قبل صلاة الجمعة.\" استعد الجميع، وخرجوا معًا إلى المسجد. وعند وصولهم، قال نور لأخته: \"اجلسي في مكان جيد يا حور، فأنا سأجلس في الصف الأمامي.\" ابتسمت حور وقالت: \"حسنًا يا أخي، لكن كن مركزًا، حتى لا تضيع منك أي معلومة.\" فأجاب نور بابتسامة: \"سأحاول بجد، فدرس اليوم عن سورة الإخلاص، ونحن لا غِنى لنا عن الإخلاص في كل أعمالنا.\" جلست حور في مكانها وقالت في نفسها: \"سيبدأ الدرس الآن، يجب أن أركز... فأنا أحب دروس معلمنا في الأخلاق والقرآن.\" بدأ المعلم يشرح، وبينما الجميع يستمع، خطر في بال نور أن ينظر إلى هاتفه، ثم قال في نفسه: \"هذه معلومات أعرفها، لكن... لا، لن أفعل! حتى لو عرفتُ بعضها، فهناك بحر واسع مما لا أعرفه. سأركز أكثر، فالعلم أمانة.\" انتهى الدرس، وأدّوا صلاة الجمعة، ثم عادوا إلى البيت. في الطريق سأل نور أخته: \"هل فهمتِ درس الإخلاص جيدًا يا حور؟\" قالت حور: \"حاولت ما استطعت، لكن هناك أمور لم أفهمها، مثلاً: المعلم قال إن الإخلاص والتوحيد يدلان على نفس السورة، ما الرابط بينهما؟\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق سائسك بالعلم",
        "text": "قال نور: \"أحسنتِ السؤال، يا أختي الصغيرة. الإخلاص يعني أن نقصد الله وحده، والتوحيد يعني ألا نعبد سواه. وسورة قل هو الله أحد تجمع المعنيين معًا.\" فرحت حور وقالت: \"فهمت الآن! وعندما نعود إلى البيت سأعلم أختي الصغيرة سورة التوحيد، فهذا واجبي، لأن المعلم قال: من تعلَّم علمًا، فليكن كالنهر، يشرب ويسقي غيره.\" ابتسم نور وقال: \"أحسنتِ يا أختي، هكذا يكون طالب العلم الصادق.\" وفي المساء، جلست حور تُعلم أختها الصغيرة السورة. سألتها أختها: \"ما معنى الصمد؟\" ترددت حور، ولم تعرف الجواب، فاستحت وقالت بتردد: \"أظن أنه يعني الصلب!\" سمعت الأم فقالت برفق: \"يا حور، لا تقولي ما لا تعرفين، فقولي لا أعلم أفضل من قولٍ بلا علم، لأن العلم أمانة يا صغيرتي.\" خفضت حور رأسها بخجل، ثم قالت بهدوء: \"أعدك يا أمي، أن أتعلم أكثر، وأحفظ الأمانة في كلامي وعلمي.\" ابتسمت الأم وقالت: \"هكذا يكون الإخلاص يا ابنتي، أن نطلب العلم لله، ونتحدث بما نعلم، ونصمت عمّا لا نعلم.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الرَّابِعَةُ: كَوْكَبُ الأَرْضِ",
      "topic": "الدَّرْسُ (2): التَّضَارِيسُ وَالغِلَافُ المَائِيُّ (اليَابِسَةُ وَالمَاءُ، التَّضَارِيسُ، الغِلَافُ المَائِيُّ، وَدَوْرَةُ المَاءِ)",
      "coverImg": "assets/y7/scince/s14.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s14.1.jpg",
          "text": "الدَّرْسُ (2) التَّضَارِيسُ وَالغِلَافُ المَائِيُّ: (1) خَرِيطَةُ اليَابِسَةِ وَالمَاءِ: تُغَطِّي المِيَاهُ 71% مِنَ الأَرْضِ وَاليَابِسَةُ 29%، وَتَضُمُّ 7 قَارَّاتٍ وَ5 مُحِيطَاتٍ، وَيُحَدِّدُ خَطُّ الاسْتِوَاءِ وَخَطُّ غِرِينِتْشَ المَوَاقِعَ. (2) تَضَارِيسُ اليَابِسَةِ: الجِبَالُ وَالتِّلَالُ، وَالهِضَابُ وَالسُّهُولُ الخِصْبَةُ، وَالأَوْدِيَةُ وَالصَّحَارِي. (3) أَقْسَامُ الغِلَافِ المَائِيِّ: مِيَاهٌ مَالِحَةٌ (المُحِيطَاتُ وَالبِحَارُ)، وَمِيَاهٌ عَذْبَةٌ (الأَنْهَارُ وَالبُحَيْرَاتُ وَاليَنَابِيعُ وَالجَلِيدُ وَالمِيَاهُ الجَوْفِيَّةُ). (4) دَوْرَةُ المَاءِ: التَّبَخُّرُ وَالتَّكَاثُفُ ثُمَّ الهُطُولُ وَالجَرَيَانُ لِاسْتِمْرَارِ الحَيَاةِ."
        }
      ],
      "text": "الدَّرْسُ (2) التَّضَارِيسُ وَالغِلَافُ المَائِيُّ: (1) خَرِيطَةُ اليَابِسَةِ وَالمَاءِ: تُغَطِّي المِيَاهُ 71% مِنَ الأَرْضِ وَاليَابِسَةُ 29%، وَتَضُمُّ 7 قَارَّاتٍ وَ5 مُحِيطَاتٍ، وَيُحَدِّدُ خَطُّ الاسْتِوَاءِ وَخَطُّ غِرِينِتْشَ المَوَاقِعَ. (2) تَضَارِيسُ اليَابِسَةِ: الجِبَالُ وَالتِّلَالُ، وَالهِضَابُ وَالسُّهُولُ الخِصْبَةُ، وَالأَوْدِيَةُ وَالصَّحَارِي. (3) أَقْسَامُ الغِلَافِ المَائِيِّ: مِيَاهٌ مَالِحَةٌ (المُحِيطَاتُ وَالبِحَارُ)، وَمِيَاهٌ عَذْبَةٌ (الأَنْهَارُ وَالبُحَيْرَاتُ وَاليَنَابِيعُ وَالجَلِيدُ وَالمِيَاهُ الجَوْفِيَّةُ). (4) دَوْرَةُ المَاءِ: التَّبَخُّرُ وَالتَّكَاثُفُ ثُمَّ الهُطُولُ وَالجَرَيَانُ لِاسْتِمْرَارِ الحَيَاةِ.",
      "q1": {
        "q": "كَمْ تَبْلُغُ نِسْبَةُ المِيَاهِ وَنِسْبَةُ اليَابِسَةِ عَلَى سَطْحِ كَوْكَبِ الأَرْضِ؟",
        "focusWord": "71% مِيَاهٌ وَ29% يَابِسَةٌ",
        "options": [
          {
            "text": "71% مِيَاهٌ وَ29% يَابِسَةٌ (7 قَارَّاتٍ وَ5 مُحِيطَاتٍ)",
            "correct": true
          },
          {
            "text": "50% مِيَاهٌ وَ50% يَابِسَةٌ",
            "correct": false
          },
          {
            "text": "10% مِيَاهٌ وَ90% يَابِسَةٌ",
            "correct": false
          },
          {
            "text": "100% يَابِسَةٌ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا مَصَادِرُ المِيَاهِ العَذْبَةِ فِي الغِلَافِ المَائِيِّ لِلْأَرْضِ؟",
        "focusWord": "المِيَاهُ العَذْبَةُ",
        "options": [
          {
            "text": "الأَنْهَارُ وَالبُحَيْرَاتُ وَاليَنَابِيعُ وَالجَلِيدُ وَالمِيَاهُ الجَوْفِيَّةُ",
            "correct": true
          },
          {
            "text": "المُحِيطَاتُ المَالِحَةُ فَقَطْ",
            "correct": false
          },
          {
            "text": "الكُثْبَانُ الرَّمْلِيَّةُ",
            "correct": false
          },
          {
            "text": "الصُّخُورُ النَّارِيَّةُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا المَرَاحِلُ الأَسَاسِيَّةُ لِدَوْرَةِ المَاءِ فِي الطَّبِيعَةِ؟",
        "focusWord": "دَوْرَةُ المَاءِ",
        "options": [
          {
            "text": "التَّبَخُّرُ وَالتَّكَاثُفُ (تَكْوِينُ السُّحُبِ) ثُمَّ الهُطُولُ وَالجَرَيَانُ",
            "correct": true
          },
          {
            "text": "الانْصِهَارُ البُرْكَانِيُّ فَقَطْ",
            "correct": false
          },
          {
            "text": "الانْقِسَامُ الخَلَوِيُّ",
            "correct": false
          },
          {
            "text": "الانْكِسَارُ الضَّوْئِيُّ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "تَوْزِيعُ سَطْحِ الأَرْضِ",
          "left": "71% مِيَاهٌ وَ29% يَابِسَةٌ (7 قَارَّاتٍ وَ5 مُحِيطَاتٍ)"
        },
        {
          "right": "تَضَارِيسُ اليَابِسَةِ",
          "left": "الجِبَالُ وَالتِّلَالُ وَالهِضَابُ وَالسُّهُولُ وَالأَوْدِيَةُ"
        },
        {
          "right": "دَوْرَةُ المَاءِ",
          "left": "التَّبَخُّرُ وَالتَّكَاثُفُ وَالهُطُولُ وَالجَرَيَانُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَنَاصِرَ التَّضَارِيسِ وَالغِلَافِ المَائِيِّ الصَّحِيحَةَ:",
        "correct": [
          "7 قَارَّاتٍ وَ5 مُحِيطَاتٍ",
          "الأَنْهَارُ وَاليَنَابِيعُ وَالمِيَاهُ الجَوْفِيَّةُ",
          "السُّهُولُ الخِصْبَةُ وَالهِضَابُ",
          "التَّبَخُّرُ وَالتَّكَاثُفُ وَالهُطُولُ"
        ],
        "wrong": [
          "إِهْدَارُ المَاءِ العَذْبِ",
          "تَلْوِيثُ الأَنْهَارِ بِالنُّفَايَاتِ"
        ]
      },
      "applyStep": "أُحَافِظُ عَلَى كُلِّ قَطْرَةِ مَاءٍ عَذْبٍ وَلَا أُسْرِفُ فِي اسْتِخْدَامِ المِيَاهِ أَثْنَاءَ الوُضُوءِ وَالغَسِيلِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt14.jpg",
      "title": "تَمَارِينُ البَصِيرَةِ الاجْتِمَاعِيَّةِ وَالحُقُوقِ وَالضَّبْطِ الأَخْلَاقِيِّ (المَجْمُوعَةُ الثَّانِيَةَ عَشْرَةَ: 78..84)",
      "subtitle": "10 دَقَائِقَ يَوْمِيًّا لِرَبْطِ يَقَظَةِ العَقْلِ بِنَقَاءِ السُّلُوكِ، وَفَهْمِ الآخَرِينَ، وَحِفْظِ الحُقُوقِ، وَالمُرَاقَبَةِ الذَّاتِيَّةِ!",
      "slideText": "⚖️❤️ تَمَارِينُ البَصِيرَةِ الاجْتِمَاعِيَّةِ وَالحُقُوقِ وَالضَّبْطِ الأَخْلَاقِيِّ (المَجْمُوعَةُ 12 — التَّمَارِينُ 78 إِلَى 84): (78) مِرْآةُ المَلَامِحِ لِفَهْمِ المَشَاعِرِ. (79) تَبْدِيلُ زَاوِيَةِ النَّظَرِ بَيْنَ طِفْلَيْنِ مُتَقَابِلَيْنِ. (80) مِيزَانُ الحُقُوقِ (تَصْنِيفُ المَوَاقِفِ فِي كِفَّةِ «حَقٌّ لِي» وَكِفَّةِ «وَاجِبٌ عَلَيَّ وَأَمَانَةٌ أَحْفَظُهَا»). (81) البِنَاءُ الصَّامِتُ بِالتَّعَاوُنِ وَالابْتِسَامَةِ. (82) جِسْرُ الحُلُولِ الأَرْبَعَةِ عِنْدَ الخِلَافِ (أَهْدَأُ وَأَتَنَفَّسُ ← أَسْمَعُ غَيْرِي ← أَقْتَرِحُ حَلًّا عَادِلًا ← نَتَصَافَحُ). (83) بُوصَلَةُ الأَمَانَةِ وَالمِعْيَارُ الصَّحِيحُ. (84) أَثَرُ اليَوْمِ الطَّيِّبِ (مَعْلُومَةٌ لِلْعَقْلِ، عَمَلٌ مُتْقَنٌ بِاليَدِ، وَخَيْرٌ لِلْغَيْرِ بِالقَلْبِ).",
      "q1": {
        "q": "مَا الخُطُوَاتُ الأَرْبَعُ فِي تَمْرِينِ (جِسْرِ الحُلُولِ الأَرْبَعَةِ 82) عِنْدَ حُدُوثِ خِلَافٍ؟",
        "focusWord": "جِسْرُ الحُلُولِ الأَرْبَعَةِ",
        "options": [
          {
            "text": "(1) أَهْدَأُ وَأَتَنَفَّسُ، (2) أَسْمَعُ غَيْرِي، (3) أَقْتَرِحُ حَلًّا عَادِلًا، (4) نَتَصَافَحُ",
            "correct": true
          },
          {
            "text": "الصُّرَاخُ وَالمُخَاصَمَةُ",
            "correct": false
          },
          {
            "text": "مُقَاطَعَةُ الزَّمِيلِ",
            "correct": false
          },
          {
            "text": "البُكَاءُ وَالغَضَبُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُصَنِّفُ المَوَاقِفَ اليَوْمِيَّةَ فِي تَمْرِينِ (مِيزَانِ الحُقُوقِ 80)؟",
        "focusWord": "مِيزَانُ الحُقُوقِ",
        "options": [
          {
            "text": "نَضَعُهَا فِي كِفَّةِ «حَقٌّ لِي» وَكِفَّةِ «وَاجِبٌ عَلَيَّ وَأَمَانَةٌ أَحْفَظُهَا»",
            "correct": true
          },
          {
            "text": "نَأْخُذُ كُلَّ شَيْءٍ لِأَنْفُسِنَا فَقَطْ",
            "correct": false
          },
          {
            "text": "نَنْسَى حُقُوقَ الآخَرِينَ",
            "correct": false
          },
          {
            "text": "نَتْرُكُ الوَاجِبَاتِ اليَوْمِيَّةَ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الآثَارُ الثَّلَاثَةُ الَّتِي يَخْتَتِمُ بِهَا الطِّفْلُ يَوْمَهُ فِي تَمْرِينِ (أَثَرِ اليَوْمِ الطَّيِّبِ 84)؟",
        "focusWord": "أَثَرُ اليَوْمِ الطَّيِّبِ",
        "options": [
          {
            "text": "مَعْلُومَةٌ نَافِعَةٌ (عَقْلٌ)، وَعَمَلٌ مُتْقَنٌ (يَدٌ)، وَخَيْرٌ قَدَّمَهُ لِغَيْرِهِ (قَلْبٌ)",
            "correct": true
          },
          {
            "text": "كَثْرَةُ اللَّعِبِ وَالسَّهَرِ فَقَطْ",
            "correct": false
          },
          {
            "text": "تَضْيِيعُ الوَقْتِ",
            "correct": false
          },
          {
            "text": "إِيذَاءُ الجِيرَانِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "مِيزَانُ الحُقُوقِ (80)",
          "left": "كِفَّةُ «حَقٌّ لِي» وَكِفَّةُ «وَاجِبٌ عَلَيَّ وَأَمَانَةٌ أَحْفَظُهَا»"
        },
        {
          "right": "جِسْرُ الحُلُولِ الأَرْبَعَةِ (82)",
          "left": "أَهْدَأُ وَأَتَنَفَّسُ ← أَسْمَعُ غَيْرِي ← أَقْتَرِحُ حَلًّا عَادِلًا ← نَتَصَافَحُ"
        },
        {
          "right": "أَثَرُ اليَوْمِ الطَّيِّبِ (84)",
          "left": "مَعْلُومَةٌ نَافِعَةٌ لِلْعَقْلِ وَعَمَلٌ مُتْقَنٌ بِاليَدِ وَخَيْرٌ لِلْقَلْبِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ تَمَارِينَ البَصِيرَةِ الاجْتِمَاعِيَّةِ وَالحُقُوقِ وَالضَّبْطِ الأَخْلَاقِيِّ (78..84):",
        "correct": [
          "مِرْآةُ المَلَامِحِ وَتَبْدِيلُ زَاوِيَةِ النَّظَرِ",
          "مِيزَانُ الحُقُوقِ وَالبِنَاءُ الصَّامِتُ",
          "جِسْرُ الحُلُولِ الأَرْبَعَةِ عِنْدَ الخِلَافِ",
          "بُوصَلَةُ الأَمَانَةِ وَأَثَرُ اليَوْمِ الطَّيِّبِ"
        ],
        "wrong": [
          "الأَنَانِيَّةُ وَالغَضَبُ عِنْدَ الخِلَافِ",
          "الغِشُّ عِنْدَ غِيَابِ الرَّقِيبِ"
        ]
      },
      "applyStep": "أُحَاسِبُ نَفْسِي كُلَّ مَسَاءٍ بِتَمْرِينِ (أَثَرِ اليَوْمِ الطَّيِّبِ): مَعْلُومَةٌ لِعَقْلِي، وَعَمَلٌ مُتْقَنٌ بِيَدِي، وَخَيْرٌ بِقَلْبِي."
    }
  },
  {
    "w": 15,
    "secNum": 4,
    "heavenName": "سَمَاءُ الثُّلَاثَاءِ الرَّابِعَةُ (م ن س ع)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الرَّابِعَةُ: عُلُومُ الأَرْضِ وَالجِيُولُوجْيَا وَالطَّقْسِ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "س",
    "jummal": 60,
    "prophet": "عِيسَى (ع)",
    "virtue": "الرَّحْمَةُ",
    "unitHeader": "الوَحْدَةُ الخَامِسَةَ عَشْرَةَ الكَامِلَةُ: نَبِيُّ اللهِ عِيسَى المَسِيحُ رُوحُ اللهِ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "أَرْسَلَ اللهُ نَبِيَّهُ عِيسَى (ع) بِالإِنْجِيلِ وَالرَّحْمَةِ، فَكَانَ يَمْسَحُ بِيَدِهِ عَلَى المَرِيضِ فَيَشْفِيهِ اللهُ بِإِذْنِهِ وَيَدْعُو النَّاسَ إِلَى المَحَبَّةِ وَالسَّلَامْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ مُقَابِلَ نُورِ الإِنْجِيلِ وَالحِكْمَةِ): نَارُ الحَسَدِ وَالبَغْيِ فِي صُدُورِ المُتَكَبِّرِينَ الَّذِينَ أَرَادُوا المَكْرَ بِعِيسَى فَرَفَعَهُ اللهُ إِلَيْهِ؛ وَفِي مُقَابِلِهَا نُورُ الإِنْجِيلِ وَالآيَاتِ البَيِّنَاتِ. B. الرِّيحُ (الوَهْمُ وَالغُلُوُّ مُقَابِلَ نَفْخَةِ الرُّوحِ الإِلٰهِيَّةِ): رِيحُ الوَهْمِ وَالافْتِرَاءِ الَّتِي رَدَّهَا عِيسَى الرَّضِيعُ بِنُطْقِهِ فِي المَهْدِ: ﴿إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا﴾، وَنَفْخُهُ فِي الطِّينِ فَيَكُونُ طَيْرًا بِإِذْنِ اللهِ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ وَالطِّبُّ وَالزُّهْدُ): تَشْكِيلُ الطِّينِ التُّرَابِيِّ طَيْرًا بِإِذْنِ اللهِ، وَمَعْرِفَةُ خَوَاصِّ النَّبَاتَاتِ وَالأَغْذِيَةِ الشَّافِيَةِ، وَجُلُوسُهُ عَلَى التُّرَابِ تَوَاضُعًا لِرَبِّهِ. D. المَاءُ (الطَّاعَةُ وَالنَّقَاءُ وَالسَّلَامُ): جَدْوَلُ المَاءِ السَّرِيِّ الَّذِي أَجْرَاهُ اللهُ تَحْتَ مَرْيَمَ الصِّدِّيقَةِ عِنْدَ النَّخْلَةِ، وَطَهَارَةُ قَلْبِ عِيسَى وَالحَوَارِيِّينَ فِي نُصْرَةِ دِينِ اللهِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الثُّلَاثَاءِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ خَمْسَةَ عَشَرَ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلِ وَالحِكْمَةِ وَالطِّبِّ النَّافِعْ، وَهُوَ رُوحُ اللهِ وَكَلِمَتُهُ وَرَابِعُ أُولِي العَزْمِ نَبِيُّ اللهِ عِيسَى بْنُ مَرْيَمَ المَسِيحُ عَلَيْهِمَا السَّلَامْ. اصْطَفَى اللهُ أُمَّهُ السَّيِّدَةَ الطَّاهِرَةَ مَرْيَمَ بِنْتَ عِمْرَانَ وَطَهَّرَهَا عَلَى نِسَاءِ زَمَانِهَا، فَكَانَتْ تَعْبُدُ اللهَ فِي مِحْرَابِ مَسْجِدِ بَيْتِ المَقْدِسِ بِخُشُوعٍ وَإِخْلَاصْ، وَأَرْسَلَ اللهُ إِلَيْهَا المَلَكَ جِبْرِيلَ رُوحَ القُدُسْ فَبَشَّرَهَا بِكَلِمَةٍ مِنَ اللهِ اسْمُهُ المَسِيحُ عِيسَى بْنُ مَرْيَمَ وَجِيهًا فِي الدُّنْيَا وَالآخِرَةِ وَمِنَ المُقَرَّبِينْ.",
      "وَخَرَجَتْ مَرْيَمُ إِلَى مَكَانٍ قَصِيٍّ شَرْقِيٍّ عِنْدَ جِذْعِ النَّخْلَةِ، فَنَادَاهَا المَلَكُ أَلَّا تَحْزَنِي قَدْ جَعَلَ رَبُّكِ تَحْتَكِ سَرِيًّا وَهُوَ جَدْوَلُ مَاءٍ عَذْبٍ صَافٍ، وَهُزِّي إِلَيْكِ بِجِذْعِ النَّخْلَةِ تُسَاقِطْ عَلَيْكِ رُطَبًا جَنِيًّا فَكُلِي وَاشْرَبِي وَقَرِّي عَيْنًا. وَلَمَّا أَتَتْ بِهِ قَوْمَهَا تَحْمِلُهُ وَسَأَلُوهَا بِنَارِ الظَّنِّ وَالوَهْمِ أَشَارَتْ إِلَيْهِ، فَنَطَقَ الرَّضِيعُ عِيسَى فِي المَهْدِ بِفَصَاحَةٍ وَبَيَانٍ قَائِلًا إِنِّي عَبْدُ اللهِ آتَانِيَ الكِتَابَ وَجَعَلَنِي نَبِيًّا وَجَعَلَنِي مُبَارَكًا أَيْنَ مَا كُنْتُ وَأَوْصَانِي بِالصَّلَاةِ وَالزَّكَاةِ مَا دُمْتُ حَيًّا وَبَرًّا بِوَالِدَتِي وَلَمْ يَجَعَلْنِي جَبَّارًا شَقِيًّا، فَسَجَدَ المُؤْمِنُونَ شُكْرًا لِلهِ وَبَرَّأَ اللهُ مَرْيَمَ الصِّدِّيقَةَ بِآيَةٍ بَاهِرَةْ.",
      "وَكَبِرَ نَبِيُّ اللهِ عِيسَى عَلَيْهِ السَّلَامُ فِي زُهْدٍ وَطَهَارَةٍ، فَلَبِسَ الصُّوفَ النَّظِيفَ البَسِيطَ وَأَكَلَ مِنْ طَيِّبَاتِ نَبَاتِ الأَرْضِ وَالعَسَلِ الحَلَالْ، وَسَارَ سَائِحًا فِي القُرَى وَالبَسَاتِينِ يَدْعُو بَنِي إِسْرَائِيلَ إِلَى عِبَادَةِ اللهِ الوَاحِدِ الأَحَدْ. وَعَلَّمَهُ اللهُ التَّوْرَاةَ وَالحِكْمَةَ وَأَنْزَلَ عَلَيْهِ كِتَابَ الإِنْجِيلِ فِيهِ هُدًى وَنُورٌ وَمَوْعِظَةٌ حَسَنَةٌ، وَكَانَ يُفَسِّرُ لِلنَّاسِ آيَاتِ اللهِ وَيُحِلُّ لَهُمْ بَعْضَ الَّذِي حُرِّمَ عَلَيْهِمْ وَيَأْمُرُهُمْ بِالرَّحْمَةِ وَالتَّسَامُحِ وَإِطْعَامِ الجَائِعِ وَمُسَاعَدَةِ الضَّعِيفْ.",
      "وَأَيَّدَ اللهُ نَبِيَّهُ عِيسَى بِمُعْجِزَاتٍ عَظِيمَةٍ تَدُلُّ عَلَى صِدْقِ نُبُوَّتِهْ؛ فَكَانَ يَصْنَعُ بِيَدِهِ مِنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَيَنْفُخُ فِيهِ فَيَكُونُ طَيْرًا يَطِيرُ بِإِذْنِ اللهْ، وَكَانَ يَمَسُّ بِيَدِهِ المُبَارَكَةِ المَرِيضَ فَيُبْرِئُ الأَكْمَهَ الَّذِي وُلِدَ بِلَا بَصَرٍ وَالأَبْرَصَ وَيُحْيِي المَوْتَى بِإِذْنِ اللهْ، وَيُنَبِّئُ النَّاسَ بِمَا يَأْكُلُونَ وَمَا يَدَّخِرُونَ فِي بُيُوتِهِمْ مِنْ قَمْحٍ وَعَسَلٍ وَثِمَارْ. وَفِي كُلِّ آيَةٍ كَانَ يُذَكِّرُ قَوْمَهُ بِالتَّوْحِيدِ الخَالِصِ قَائِلًا إِنَّ اللهَ رَبِّي وَرَبُّكُمْ فَاعْبُدُوهُ هٰذَا صِرَاطٌ مُسْتَقِيمٌ، فَسَبَّحَ الحَوَارِيُّونَ المَوْلَى العَظِيمَ وَقَالُوا نَحْنُ أَنْصَارُ اللهِ آمَنَّا بِاللهِ وَاشْهَدْ بِأَنَّا مُسْلِمُونْ.",
      "وَعَلَّمَ عِيسَى تَلَامِيذَهُ الحَوَارِيِّينَ سِيرَتَهُ العَطِرَةَ فِي الطِّبِّ وَالعِلْمِ وَالتَّوَاضُعْ، وَأَنْزَلَ اللهُ عَلَيْهِمْ بِدُعَائِهِ مَائِدَةً مِنَ السَّمَاءِ تَكُونُ لَهُمْ عِيدًا لِأَوَّلِهِمْ وَآخِرِهِمْ وَآيَةً مِنَ اللهِ الرَّزَّاقْ، فَقَدَّمُوا لِلْمَسَاكِينِ طَعَامًا طَيِّبًا وَعَسَلًا صَافِيًا وَشَكَرُوا رَبَّهُمْ قَوْلًا حَسَنًا. كَمَا بَشَّرَ عِيسَى قَوْمَهُ بِمَبْعَثِ خَاتَمِ الأَنْبِيَاءِ مُحَمَّدٍ المُصْطَفَى صَلَّى اللهُ عَلَيْهِ وَآلِهِ كَمَا فِي سُورَةٌ مُبَارَكَةٌ هِيَ سُورَةُ الصَّفِّ: ﴿وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ﴾.",
      "وَلَمَّا أَحَسَّ عِيسَى مِنْ أَعْدَائِهِ الكُفْرَ وَالمَكْرَ وَأَرَادُوا الإِسَاءَةَ إِلَيْهِ، يَسَّرَ اللهُ لَهُ النَّجَاةَ وَطَهَّرَهُ وَرَفَعَهُ إِلَى السَّمَاءِ حَيًّا مُكَرَّمًا، وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلٰكِنْ شُبِّهَ لَهُمْ، وَحَفِظَ وَصِيُّهُ الأَمِينُ شَمْعُونُ الصَّفَا شَرِيعَتَهُ وَحِكْمَتَهُ، وَسَيَنْزِلُ المَسِيحُ عِيسَى بْنُ مَرْيَمَ إِلَى الأَرْضِ فِي آخِرِ الزَّمَانِ لِيَمْلَأَهَا مَعَ إِمَامِ الحَقِّ قِسْطًا وَعَدْلًا وَسَلَامًا، فَهُوَ رَسُولٌ كَرِيمٌ وَمَسِيحٌ مُبَارَكٌ وَمُقَدَّسٌ يُحِبُّهُ المُؤْمِنُونَ فِي كُلِّ زَمَانْ."
    ],
    "words": [
      {
        "word": "مَسْجِدِ",
        "desc": "وسط متصل / ساكن: ـسْـ",
        "raw": "مَسْجِدِ (وسط متصل / ساكن: ـسْـ)"
      },
      {
        "word": "القُدُسْ",
        "desc": "آخر متصل / ساكن وقفا: ـسْ",
        "raw": "القُدُسْ (آخر متصل / ساكن وقفا: ـسْ)"
      },
      {
        "word": "سَجَدَ",
        "desc": "أول منفصل / متحرك بالفتح: سَـ",
        "raw": "سَجَدَ (أول منفصل / متحرك بالفتح: سَـ)"
      },
      {
        "word": "فَسَبَّحَ",
        "desc": "أول متصل / متحرك بالفتح: ـسَـ",
        "raw": "فَسَبَّحَ (أول متصل / متحرك بالفتح: ـسَـ)"
      },
      {
        "word": "عَسَلًا",
        "desc": "وسط متصل / متحرك بالفتح: ـسَـ",
        "raw": "عَسَلًا (وسط متصل / متحرك بالفتح: ـسَـ)"
      },
      {
        "word": "حَسَنًا",
        "desc": "وسط منفصل / متحرك بالفتح: سَـ",
        "raw": "حَسَنًا (وسط منفصل / متحرك بالفتح: سَـ)"
      },
      {
        "word": "لَبِسَ",
        "desc": "آخر متصل / متحرك بالفتح: ـسَ",
        "raw": "لَبِسَ (آخر متصل / متحرك بالفتح: ـسَ)"
      },
      {
        "word": "سُورَةٌ",
        "desc": "أول منفصل / متحرك بالضم: سُـ",
        "raw": "سُورَةٌ (أول منفصل / متحرك بالضم: سُـ)"
      },
      {
        "word": "مُقَدَّسٌ",
        "desc": "آخر منفصل / متحرك بالضم: سٌ",
        "raw": "مُقَدَّسٌ (آخر منفصل / متحرك بالضم: سٌ)"
      },
      {
        "word": "سِيرَتَهُ",
        "desc": "أول منفصل / متحرك بالكسر: سِـ",
        "raw": "سِيرَتَهُ (أول منفصل / متحرك بالكسر: سِـ)"
      },
      {
        "word": "يَسَّرَ",
        "desc": "وسط متصل / مضعف بالفتح: ـسَّـ",
        "raw": "يَسَّرَ (وسط متصل / مضعف بالفتح: ـسَّـ)"
      },
      {
        "word": "يَمَسُّ",
        "desc": "آخر متصل / مضعف بالضم: ـسُّ",
        "raw": "يَمَسُّ (آخر متصل / مضعف بالضم: ـسُّ)"
      },
      {
        "word": "يُفَسِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـسِّـ",
        "raw": "يُفَسِّرُ (وسط متصل / مضعف بالكسر: ـسِّـ)"
      },
      {
        "word": "سَائِحًا",
        "desc": "أول منفصل / ممدود بالألف: سَا",
        "raw": "سَائِحًا (أول منفصل / ممدود بالألف: سَا)"
      },
      {
        "word": "رَسُولٌ",
        "desc": "وسط متصل / ممدود بالواو: ـسُو",
        "raw": "رَسُولٌ (وسط متصل / ممدود بالواو: ـسُو)"
      },
      {
        "word": "مَسِيحٌ",
        "desc": "وسط متصل / ممدود بالياء: ـسِي",
        "raw": "مَسِيحٌ (وسط متصل / ممدود بالياء: ـسِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "1. اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ السِّينِ (س): النُّطْقُ السَّلِيمُ لِحَرْفِ السِّينِ المُرَقَّقِ المَهْمُوسِ الرِّخْوِ ذِي الصَّفِيرِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ الثَّنَايَا السُّفْلَى، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى إِفْشَاءِ السَّلَامِ وَالكَلِمَةِ الطَّيِّبَةِ: ﴿وَالسَّلَامُ عَلَيَّ يَوْمَ وُلِدتُّ وَيَوْمَ أَمُوتُ وَيَوْمَ أُبْعَثُ حَيًّا﴾."
      },
      "2": {
        "heading": "2. العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الأَسْنَانُ الثَّلَاثَةُ المُتَوَازِيَةُ وَنِصْفُ الدَّائِرَةِ وَالرَّقْمُ (15): مُشَاهَدَةُ شَكْلِ حَرْفِ السِّينِ (س / سـ / ـسـ / ـس) المُرَكَّبِ مِنْ ثَلَاثِ سِنَاتٍ مُتَنَاسِقَةٍ تَرْمُزُ لِلانتِظَامِ وَالاعْتِدَالِ تَلِيهَا كَأْسٌ نِصْفُ دَائِرِيَّةٍ، وَالتَّفَكُّرُ فِي نِعْمَةِ البَصَرِ حِينَ أَبْرَأَ عِيسَى الأَكْمَهَ بِإِذْنِ اللهِ لِيُبْصِرَ نُورَ السَّمَاءِ وَالأَرْضِ."
      },
      "3": {
        "heading": "3. الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ عِيسَى المَسِيحِ الكَامِلَةُ وَالإِنْصَاتُ لِمَوَاعِظِ الإِنْجِيلِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ عِيسَى وَأُمِّهِ مَرْيَمَ الصِّدِّيقَةِ (عَلَيْهِمَا السَّلَامُ)، وَتَمْيِيزُ صَفِيرِ السِّينِ المُرَقَّقِ عَنْ صَفِيرِ الصَّادِ المُفَخَّمِ مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "4. اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ خَمْسَةَ عَشَرَ (15) وَالسِّتُّونَ (60): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (15) وَمَعْرِفَةِ قِيمَةِ السِّينِ العَشْرِيَّةِ (60 = سِتُّ عَشَرَاتٍ تُوَافِقُ 60 دَقِيقَةً فِي السَّاعَةِ)، وَتَدْرِيبُ اليَدِ عَلَى المَسْحِ بِرِفْقٍ عَلَى رَأْسِ اليَتِيمِ وَمُدَاوَاةِ المَرِيضِ وَتَشْكِيلِ الصَّلْصَالِ النَّافِعِ."
      },
      "5": {
        "heading": "5. الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السِّيَاحَةِ التَّأَمُّلِيَّةِ وَالمَشْيِ النَّشِيطِ فِي الطَّبِيعَةِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى المَشْيِ المُتَوَازِنِ فِي الهَوَاءِ الطَّلْقِ وَالبَسَاتِينِ مَعَ التَّنَفُّسِ العَمِيقِ، اقْتِدَاءً بِسَيْرِ عِيسَى المَسِيحِ فِي الأَرْضِ لِنَشْرِ العِلْمِ وَالسَّلَامِ وَتَفَقُّدِ المَرْضَى وَالفُقَرَاءِ."
      },
      "6": {
        "heading": "6. البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الطِّبِّ الوِقَائِيِّ وَالرُّطَبِ الجَنِيِّ وَالمَائِدَةِ الطَّيِّبَةِ: تَعَلُّمُ قَاعِدَةِ الطِّبِّ الذَّهَبِيَّةِ (عَدَمِ إِدْخَالِ الطَّعَامِ عَلَى الطَّعَامِ قَبْلَ هَضْمِهِ)، وَمَعْرِفَةِ الفَوَائِدِ الغِذَائِيَّةِ لِلرُّطَبِ وَالتَّمْرِ وَالعَسَلِ وَالبُقُولِ النَّافِعَةِ، وَآدَابِ المَائِدَةِ وَشُكْرِ نِعْمَةِ اللهِ."
      },
      "7": {
        "heading": "7. الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الطَّهَارَةِ البَاطِنَةِ وَالظَّاهِرَةِ وَبِرِّ الوَالِدَيْنِ وَاللِّبَاسِ النَّظِيفِ: تَعَلُّمُ الاقْتِدَاءِ بِطَهَارَةِ السَّيِّدَةِ مَرْيَمَ البَتُولِ وَابْنِهَا المَسِيحِ (عَلَيْهِمَا السَّلَامُ)، وَارْتِدَاءِ الثِّيَابِ النَّظِيفَةِ المُحْتَشِمَةِ، وَبِرِّ الوَالِدَةِ وَالتَّوَاضُعِ مَعَ النَّاسِ دُونَ جَبَرُوتٍ أَوْ شَقَاءٍ."
      }
    },
    "grammar": {
      "topic": "الجُمْلَةُ الفِعْلِيَّةُ: الفَاعِلُ هُوَ مَنْ قَامَ بِالفِعْلْ",
      "rule": "لِكُلِّ فِعْلٍ فَاعِلٌ قَامَ بِهِ، وَنَسْأَلُ عَنْهُ بـ (مَنْ فَعَلَ؟)، وَيَكُونُ الفَاعِلُ مَرْفُوعًا بِالضَّمَّةِ دَائِمًا.",
      "example": "سَبَحَ الغَوَّاصُ — سَطَعَتِ الشَّمْسُ — سَاعَدَ الطَّبِيبُ المَرِيضَ.",
      "focusWord": "الطَّبِيبُ",
      "q": "أَيْنَ «الفَاعِلُ» فِي جُمْلَةِ «سَاعَدَ الطَّبِيبُ المَرِيضَ»؟",
      "opts": [
        "الطَّبِيبُ",
        "سَاعَدَ",
        "المَرِيضَ",
        "فِي"
      ]
    },
    "earIirab": {
      "topic": "سَمَاعُ الضَّمَّةِ الظَّاهِرَةِ (ـُ) عَلَى الفَاعِلْ",
      "rule": "عِنْدَمَا نَسْأَلُ: مَنْ قَامَ بِالفِعْلِ؟ نَجِدُ الفَاعِلَ مَرْفُوعًا بِالضَّمَّةِ الظَّاهِرَةِ فِي آخِرِهْ.",
      "sentence": "يَسِيرُ القِطَارُ عَلَى السِّكَّةِ.",
      "targetWord": "القِطَارُ",
      "caseAns": "فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 65,
      "numName": "خَمْسَةٌ وَسِتُّونَ",
      "eqDisplay": "5 + 60 = 65",
      "subDisplay": "65 - 5 = 60",
      "compDisplay": "65 > 56",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (65) بِالعَرَبِيَّةِ؟",
        "focus": "65",
        "ans": "خَمْسَةٌ وَسِتُّونَ",
        "wrong": [
          "سِتَّةٌ وَخَمْسُونَ",
          "سِتُّونَ",
          "خَمْسَةٌ وَسَبْعُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ تَرْكِيبَ الآحَادِ وَالعَشَرَاتِ:",
        "focus": "5 + 60 = ؟",
        "ans": "65 (خَمْسَةٌ وَسِتُّونَ)",
        "wrong": [
          "56",
          "60",
          "70"
        ]
      }
    },
    "sport": {
      "title": "تَمْرِينُ البُومَةِ لإِرَاحَةِ الرَّقَبَةِ وَالبَصَرِ",
      "middleText": "أُمْسِكُ كَتِفِي بِيَدِي وَأُدِيرُ رَأْسِي بِلُطْفٍ مِنْ يَسَارٍ إِلَى يَمِينٍ مَعَ الزَّفِيرِ العَمِيقْ. يُزِيلُ هٰذَا التَّمْرِينُ تَوَتُّرَ عَضَلَاتِ الرَّقَبَةِ وَيُوَسِّعُ مَجَالَ الرُّؤْيَةِ وَالِانْتِبَاهْ."
    },
    "sci": {
      "title": "الطَّقْسُ وَالمُنَاخُ وَالفُصُولُ الأَرْبَعَةُ",
      "summaryThird": "يَدُورُ كَوْكَبُ الأَرْضِ حَوْلَ نَفْسِهِ كُلَّ 24 سَاعَةً فَيَتَعَاقَبُ اللَّيْلُ وَالنَّهَارُ، وَيَدُورُ حَوْلَ الشَّمْسِ فِي سَنَةٍ كَامِلَةٍ فَتَتَعَاقَبُ الفُصُولُ الأَرْبَعَةُ (الشِّتَاءُ وَالرَّبِيعُ وَالصَّيْفُ وَالخَرِيفُ).",
      "focusConcept": "دَوَرَانُ الأَرْضِ حَوْلَ نَفْسِهَا",
      "factAns": "تَعَاقُبُ اللَّيْلِ وَالنَّهَارِ كُلَّ 24 سَاعَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الصَّدَقَةِ وَالزَّكَاةِ (حُور وَسُرُور - 15)",
      "storySentence": "تَصَدَّقَ سُرُورٌ وَحُورُ مِنْ حَصَّالَتِهِمَا بِسُرُورٍ، وَعَرَفَا أَنَّ الصَّدَقَةَ تُطَهِّرُ المَالَ وَتُدْخِلُ الفَرَحَ عَلَى قُلُوبِ الفُقَرَاءِ دُونَ مَنٍّ وَلَا أَذًى.",
      "applyAction": "أُقَدِّمُ صَدَقَتِي بِيَدٍ كَرِيمَةٍ وَوَجْهٍ مُبْتَسِمْ."
    },
    "rightsFullTitle": "(17) حق السائس بالملك + (18) حق الرعية بالسلطان",
    "rightsQuote": "وأمَّا حَقُّ سَائِسِكَ بالمِلْكِ فَنَحْوٌ مِنْ سَائِسِكَ بالسُّلْطَانِ إلاّ أَنَّ هذَا يَمْلِكُ مَـــــــــــــــا لا يَمْلِكُهُ ذاكَ، تَلْزِمُكَ طَاعَتُهُ فِيمَــــــــــا دَقَّ وَجَلَّ مِنْكَ إلاّ أَنْ تُخرِجَكَ مِنْ وُجُـــــــــوب حَقِّ الله، ويَحُولَ بَينَكَ وبَيْنَ حَقِّهِ وَحُقُوقِ الخَلْقِ، فَــــــإذَا قَضَيْتَهُ رَجَــــــــــــــــــعْتَ إلَى حَقِّهِ  فَتَشَاغَلْتَ بهِ. ولا قُوَّةَ إلاّ باللهِ. | فأَمَّا حُقُوقُ رَعِيَّتِكَ بالسُّلْطَانِ فَأَنْ تَعْلَمَ  أَنَّكَ إنَّمَا اسْتَرْعَيْتَهُمْ بفَضْلِ قُوَّتِكَ عَلَيْهِمْ فَإنَّهُ إنَّمَا أَحَلَّهُـــــــــــمْ مَحَلَّ الرَّعِيَّةِ لَكَ ضَعْفُهُمْ وَذُلُّهُمْ، فَمَــــا أَوْلَى مَنْ كَفَاكَهُ ضَعْفُهُ وَذُلُّهُ حَتَّى صَيَّرَهُ لَكَ رَعِيَّةً وَصَيَّرَ حُكْمَكَ عَلَيْهِ نَافِذاً، لا يَمْتَنِعُ مِنْـــــــــــــــــكَ بعِزَّة وَلا قُوَّة وَلا يَسْتَنْصِرُ فِيمَا تَعَاظَمَــــــهُ مِنْكَ إلا (باللهِ) بالرَّحْمَةِ وَالْحِيَاطَةِ  وَالأَناةِ  ، وَمَـــــــــا أَولاكَ إذَا عَرَفْتَ مَا أَعْطَــــــــــاكَ الله مِنْ فَضْلِ هذِهِ الْعِزَّةِ وَالقُوَّةِ الَّتِي قَهَرْتَ بهَـــــــــــا أَنْ تَكُونَ لِلّهِ شَاكِراً، وَمَـــــنْ شَكَرَ الله أَعْطَاهُ فِيمَا أَنعَمَ عَلَيْهِ. ولا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (17) حق السائس بالملك + (18) حق الرعية بالسلطان",
        "text": "وأمَّا حَقُّ سَائِسِكَ بالمِلْكِ فَنَحْوٌ مِنْ سَائِسِكَ بالسُّلْطَانِ إلاّ أَنَّ هذَا يَمْلِكُ مَـــــــــــــــا لا يَمْلِكُهُ ذاكَ، تَلْزِمُكَ طَاعَتُهُ فِيمَــــــــــا دَقَّ وَجَلَّ مِنْكَ إلاّ أَنْ تُخرِجَكَ مِنْ وُجُـــــــــوب حَقِّ الله، ويَحُولَ بَينَكَ وبَيْنَ حَقِّهِ وَحُقُوقِ الخَلْقِ، فَــــــإذَا قَضَيْتَهُ رَجَــــــــــــــــــعْتَ إلَى حَقِّهِ  فَتَشَاغَلْتَ بهِ. ولا قُوَّةَ إلاّ باللهِ. | فأَمَّا حُقُوقُ رَعِيَّتِكَ بالسُّلْطَانِ فَأَنْ تَعْلَمَ  أَنَّكَ إنَّمَا اسْتَرْعَيْتَهُمْ بفَضْلِ قُوَّتِكَ عَلَيْهِمْ فَإنَّهُ إنَّمَا أَحَلَّهُـــــــــــمْ مَحَلَّ الرَّعِيَّةِ لَكَ ضَعْفُهُمْ وَذُلُّهُمْ، فَمَــــا أَوْلَى مَنْ كَفَاكَهُ ضَعْفُهُ وَذُلُّهُ حَتَّى صَيَّرَهُ لَكَ رَعِيَّةً وَصَيَّرَ حُكْمَكَ عَلَيْهِ نَافِذاً، لا يَمْتَنِعُ مِنْـــــــــــــــــكَ بعِزَّة وَلا قُوَّة وَلا يَسْتَنْصِرُ فِيمَا تَعَاظَمَــــــهُ مِنْكَ إلا (باللهِ) بالرَّحْمَةِ وَالْحِيَاطَةِ  وَالأَناةِ  ، وَمَـــــــــا أَولاكَ إذَا عَرَفْتَ مَا أَعْطَــــــــــاكَ الله مِنْ فَضْلِ هذِهِ الْعِزَّةِ وَالقُوَّةِ الَّتِي قَهَرْتَ بهَـــــــــــا أَنْ تَكُونَ لِلّهِ شَاكِراً، وَمَـــــنْ شَكَرَ الله أَعْطَاهُ فِيمَا أَنعَمَ عَلَيْهِ. ولا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ عِيسَى (ع): آدَابُ الطَّهَارَةِ البَاطِنَةِ وَالظَّاهِرَةِ وَبِرِّ الوَالِدَيْنِ وَاللِّبَاسِ النَّظِيفِ: تَعَلُّمُ الاقْتِدَاءِ بِطَهَارَةِ السَّيِّدَةِ مَرْيَمَ البَتُولِ وَابْنِهَا المَسِيحِ (عَلَيْهِمَا السَّلَامُ)، وَارْتِدَاءِ الثِّيَابِ النَّظِيفَةِ المُحْتَشِمَةِ، وَبِرِّ الوَالِدَةِ وَالتَّوَاضُعِ مَعَ النَّاسِ دُونَ جَبَرُوتٍ أَوْ شَقَاءٍ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق السائس بالملك",
        "text": "🌿 قصة: \"تسابقوا في الخير\" كانت الأم تُحضِّر الغداء في المطبخ، وعند الظهيرة نادت بصوتٍ لطيف: \"يا حور، يا نور، هيا لتناول الطعام!\" أسرع نور و حور إلى المائدة، وقد امتلأت وجوههما بالحماس. لكن قبل أن يبدأوا الأكل، قالت الأم بابتسامة: \"اليوم يبدو أنكما تحملان سرًّا جميلًا، ماذا حدث في المدرسة؟\" ضحكت حور وقالت: \"ماما! بعد الفرصة، رأينا عاملة النظافة تجلس على المقعد وتقول: آه ظهري يؤلمني قليلاً...\" وأضافت نور بسرعة قبل أن تكمّل أخته: \"فقلت لها: لا تقلقي خالتي! سنساعدك اليوم!\" ابتسمت الأم، بينما تابع نور بفخر: \"أخذت أنا المكنسة وبدأت أجمع الأوراق عن الأرض، وجاءت أصدقائي واحدًا تلو الآخر يساعدونني!\" ضحكت حور وقالت: \"وأنا كنت أمسح الطاولات مع صديقتي ليان، وصرنا نتسابق من ينهي أسرع!\" ثم أكملت وهي تلمع عيناها بالفرح: \"وخالتي العاملة كانت تضحك وتقول: أنتم أجمل هدية اليوم!\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق السائس بالملك",
        "text": "وضعت الأم الملعقة برفق، ونظرت إليهما بحنان وقالت: \"أحسنتم يا أحبائي... هكذا يكون الإنسان الذي يسوس بملك الله، فالله جعلنا نملك أشياء صغيرة — كأن نأمر أو نساعد أو نرشد — لكن علينا أن نكون رحماء بمن حولنا، لا متكبرين.\" ثم أضافت وهي تنظر إلى الصحون أمامها: \"كما أنني الآن أملك هذا الطعام، لكن عليَّ أن أشارككم به، وأن أقدّمه بحب، لا بمنة، لأن الله هو الرازق وليس أنا.\" قال نور وهو يضحك: \"إذن يا ماما نحن أيضًا نسوس بالملك؟\" ضحكت الأم وقالت: \"نعم يا حبيبي، كل من يُعين ويَرحم من تحته فهو سائسٌ برحمةٍ وعدل، لا بسلطةٍ وتكبر.\" ثم حمل الجميع الأطباق ليضعوها في المطبخ، وقالت حور بصوتٍ عالٍ: \"اليوم سنساعدك أنتِ يا أمي كما ساعدنا الخالة!\" ضحكت الأم وقالت: \"ما أجمل أن يتحول العمل إلى حب، والرحمة إلى عادة.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرعية بالسلطان",
        "text": "🩵 قصة: المديرة التي غيرت المدرسة في أحد أيام المدرسة، جلست حور وصديقاتها في ساحة المدرسة أثناء وقت الاستراحة، وبدأت حور تقول بحماس: \"هل تعلمن يا صديقاتي كيف أصبحت مدرستنا بهذا الجمال والنظام؟\" قالت سارة: \"أكيد لأن المديرة صارمة جدًا وتحب النظام!\" ابتسمت حور وقالت: \"هي تحب النظام نعم، لكنها أيضًا رحيمة وتحبنا، وتريد أن نكون أقوياء وناجحين مثلها.\" ثم تابعت قائلة: \"لقد سمعتُها مرة تقول للمعلمة: ’أنا لم أصل إلى مكاني إلا بالاجتهاد وتوفيق الله،"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرعية بالسلطان",
        "text": "لذلك أريد أن أساعد طلابي ليكونوا أقوياء بصدقهم وعلمهم.‘\" قالت ليان: \"ولهذا صارت المدرسة أجمل، والمديرة صارت تعاملنا كأننا أبناءها.\" ابتسمت حور وقالت: \"نعم، فهي تذكّرنا دائمًا أن من كان في مكان قوة، عليه أن يكون رحيمًا بالضعفاء، وأن يشكر الله على نعمته، لأن القوة الحقيقية هي أن نساعد غيرنا على النهوض لا أن نعلو عليهم.\" ثم قالت البنات جميعًا بصوت واحد: \"الحمد لله على مديرة مثلها، علمتنا أن الرحمة قوة، والشكر بقاء.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الرَّابِعَةُ: كَوْكَبُ الأَرْضِ",
      "topic": "الدَّرْسُ (3): الأَغْلِفَةُ وَالطَّقْسُ وَحَرَكَاتُ الأَرْضِ (الأَغْلِفَةُ الأَرْبَعَةُ، الغِلَافُ الجَوِّيُّ، الطَّقْسُ وَالمُنَاخُ، وَالفُصُولُ الأَرْبَعَةُ)",
      "coverImg": "assets/y7/scince/s15.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s15.1.jpg",
          "text": "الدَّرْسُ (3) الأَغْلِفَةُ وَالطَّقْسُ وَحَرَكَاتُ الأَرْضِ: (1) أَغْلِفَةُ الأَرْضِ الأَرْبَعَةُ: الغِلَافُ الصَّخْرِيُّ وَالمَائِيُّ، وَالغِلَافُ الجَوِّيُّ (طَبَقَةُ الغَازَاتِ وَالهَوَاءِ)، وَالغِلَافُ الحَيَوِيُّ (كَافَّةُ الكَائِنَاتِ الحَيَّةِ). (2) طَبَقَاتُ الغِلَافِ الجَوِّيِّ: التُّرُوبُوسْفِيرُ وَالسِّتْرَاتُوسْفِيرُ (الطَّقْسُ وَالأُوزُونُ)، وَالمِيزُوسْفِيرُ وَالثِّرْمُوسْفِيرُ (الشُّهُبُ وَالأَقْمَارُ الصِّنَاعِيَّةُ)، وَالإِكْسُوسْفِيرُ (الفَضَاءُ الخَارِجِيُّ). (3) الطَّقْسُ وَالمُنَاخُ: الطَّقْسُ حَالَةُ الجَوِّ لِفَتْرَةٍ قَصِيرَةٍ، وَالمُنَاخُ مُتَوَسِّطُ الجَوِّ لِفَتَرَاتٍ طَوِيلَةٍ. (4) حَرَكَاتُ الأَرْضِ: تَدُورُ حَوْلَ نَفْسِهَا يَوْمِيًّا فَيَتَعَاقَبُ اللَّيْلُ وَالنَّهَارُ، وَتَدُورُ حَوْلَ الشَّمْسِ سَنَوِيًّا فَتَحْدُثُ الفُصُولُ الأَرْبَعَةُ."
        }
      ],
      "text": "الدَّرْسُ (3) الأَغْلِفَةُ وَالطَّقْسُ وَحَرَكَاتُ الأَرْضِ: (1) أَغْلِفَةُ الأَرْضِ الأَرْبَعَةُ: الغِلَافُ الصَّخْرِيُّ وَالمَائِيُّ، وَالغِلَافُ الجَوِّيُّ (طَبَقَةُ الغَازَاتِ وَالهَوَاءِ)، وَالغِلَافُ الحَيَوِيُّ (كَافَّةُ الكَائِنَاتِ الحَيَّةِ). (2) طَبَقَاتُ الغِلَافِ الجَوِّيِّ: التُّرُوبُوسْفِيرُ وَالسِّتْرَاتُوسْفِيرُ (الطَّقْسُ وَالأُوزُونُ)، وَالمِيزُوسْفِيرُ وَالثِّرْمُوسْفِيرُ (الشُّهُبُ وَالأَقْمَارُ الصِّنَاعِيَّةُ)، وَالإِكْسُوسْفِيرُ (الفَضَاءُ الخَارِجِيُّ). (3) الطَّقْسُ وَالمُنَاخُ: الطَّقْسُ حَالَةُ الجَوِّ لِفَتْرَةٍ قَصِيرَةٍ، وَالمُنَاخُ مُتَوَسِّطُ الجَوِّ لِفَتَرَاتٍ طَوِيلَةٍ. (4) حَرَكَاتُ الأَرْضِ: تَدُورُ حَوْلَ نَفْسِهَا يَوْمِيًّا فَيَتَعَاقَبُ اللَّيْلُ وَالنَّهَارُ، وَتَدُورُ حَوْلَ الشَّمْسِ سَنَوِيًّا فَتَحْدُثُ الفُصُولُ الأَرْبَعَةُ.",
      "q1": {
        "q": "مَا الطَّبَقَتَانِ الجَوِّيَّتَانِ اللَّتَانِ يَحْدُثُ فِيهِمَا الطَّقْسُ وَتُوجَدُ فِيهِمَا طَبَقَةُ الأُوزُونِ الحَامِيَةُ؟",
        "focusWord": "التُّرُوبُوسْفِيرُ وَالسِّتْرَاتُوسْفِيرُ",
        "options": [
          {
            "text": "التُّرُوبُوسْفِيرُ وَالسِّتْرَاتُوسْفِيرُ",
            "correct": true
          },
          {
            "text": "القِشْرَةُ وَالوِشَاحُ",
            "correct": false
          },
          {
            "text": "النَّوَاةُ وَالسِّيتُوبْلَازْمُ",
            "correct": false
          },
          {
            "text": "حِزَامُ كَايْبَرَ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الفَرْقُ بَيْنَ الطَّقْسِ وَالمُنَاخِ؟",
        "focusWord": "الطَّقْسُ وَالمُنَاخُ",
        "options": [
          {
            "text": "الطَّقْسُ حَالَةُ الجَوِّ لِفَتْرَةٍ قَصِيرَةٍ، وَالمُنَاخُ مُتَوَسِّطُ الجَوِّ لِفَتَرَاتٍ طَوِيلَةٍ",
            "correct": true
          },
          {
            "text": "الطَّقْسُ فِي البَحْرِ وَالمُنَاخُ فِي الجَبَلِ فَقَطْ",
            "correct": false
          },
          {
            "text": "لَا فَرْقَ بَيْنَهُمَا أَبَدًا",
            "correct": false
          },
          {
            "text": "المُنَاخُ يَتَغَيَّرُ كُلَّ دَقِيقَةٍ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَاذَا يَنْتُجُ عَنْ دَوَرَانِ الأَرْضِ حَوْلَ نَفْسِهَا يَوْمِيًّا وَدَوَرَانِهَا حَوْلَ الشَّمْسِ سَنَوِيًّا؟",
        "focusWord": "حَرَكَاتُ الأَرْضِ",
        "options": [
          {
            "text": "تَعَاقُبُ اللَّيْلِ وَالنَّهَارِ يَوْمِيًّا، وَتَعَاقُبُ الفُصُولِ الأَرْبَعَةِ سَنَوِيًّا",
            "correct": true
          },
          {
            "text": "تَوَقُّفُ الرِّيَاحِ وَالأَمْطَارِ",
            "correct": false
          },
          {
            "text": "ثَوَرَانُ البَرَاكِينِ",
            "correct": false
          },
          {
            "text": "تَكَوُّنُ المَعَادِنِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الغِلَافُ الحَيَوِيُّ",
          "left": "يَشْمَلُ كَافَّةَ الكَائِنَاتِ الحَيَّةِ عَلَى الأَرْضِ"
        },
        {
          "right": "دَوَرَانُ الأَرْضِ حَوْلَ نَفْسِهَا يَوْمِيًّا",
          "left": "تَعَاقُبُ اللَّيْلِ وَالنَّهَارِ"
        },
        {
          "right": "دَوَرَانُ الأَرْضِ حَوْلَ الشَّمْسِ سَنَوِيًّا",
          "left": "تَعَاقُبُ الفُصُولِ الأَرْبَعَةِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَغْلِفَةَ الأَرْضِ وَطَبَقَاتِ الغِلَافِ الجَوِّيِّ الصَّحِيحَةَ:",
        "correct": [
          "الغِلَافُ الصَّخْرِيُّ وَالمَائِيُّ وَالجَوِّيُّ وَالحَيَوِيُّ",
          "التُّرُوبُوسْفِيرُ وَالسِّتْرَاتُوسْفِيرُ",
          "المِيزُوسْفِيرُ وَالثِّرْمُوسْفِيرُ وَالإِكْسُوسْفِيرُ",
          "تَعَاقُبُ اللَّيْلِ وَالنَّهَارِ وَالفُصُولِ الأَرْبَعَةِ"
        ],
        "wrong": [
          "دُخَانُ المَصَانِعِ المُلَوِّثُ لِلْهَوَاءِ",
          "حَرْقُ النُّفَايَاتِ فِي الغَابَاتِ"
        ]
      },
      "applyStep": "أُرَاقِبُ حَالَةَ الطَّقْسِ كُلَّ صَبَاحٍ وَأَشْكُرُ اللهَ عَلَى نِعْمَةِ الغِلَافِ الجَوِّيِّ وَتَعَاقُبِ اللَّيْلِ وَالنَّهَارِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt15.jpg",
      "title": "الدَّرْسُ (4): المَسَارُ الأَوَّلُ (8 دَقَائِقَ وَنِصْفٌ) — رُوتِينُ 25 دَقِيقَةً المُتَكَامِلُ",
      "subtitle": "الوَعْيُ، الاسْتِطَالَةُ، النُّمُوُّ العَضَلِيُّ، الاسْتِجَابَةُ العَصَبِيَّةُ، وَالتَّدَفُّقُ",
      "slideText": "⏱️ الدَّرْسُ (4) المَسَارُ الأَوَّلُ (8 دَقَائِقَ وَنِصْفٌ مِنْ رُوتِينِ 25 دَقِيقَةً المُتَكَامِلِ): (1) الوَعْيُ (دَقِيقَةٌ وَنِصْفٌ): التَّنَفُّسُ الإِيقَاعِيُّ (شَهِيقٌ 4 ثَوَانٍ، زَفِيرٌ 7-8 ثَوَانٍ). (2) الاسْتِطَالَةُ (دَقِيقَةٌ وَنِصْفٌ): تَمَدُّدُ أَوْتَارِ الرُّكْبَةِ بِالانْحِنَاءِ الأَمَامِيِّ. (3) النُّمُوُّ العَضَلِيُّ: الضَّغْطُ عَلَى الحَائِطِ (8-12 عَدَّةً). (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَةٌ وَنِصْفٌ): لَمْسُ مَنَاطِقِ الجِسْمِ بِالتَّبَادُلِ. (5) التَّدَفُّقُ (يُؤَدَّى أَخِيرًا فَقَطْ): وَضْعِيَّةُ الفَرَاشَةِ.",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي (التَّنَفُّسَ الإِيقَاعِيَّ) فِي فَقْرَةِ الوَعْيِ مِنَ الدَّرْسِ الرَّابِعِ؟",
        "focusWord": "التَّنَفُّسُ الإِيقَاعِيُّ",
        "options": [
          {
            "text": "شَهِيقٌ هَادِئٌ فِي 4 ثَوَانٍ، وَزَفِيرٌ طَوِيلٌ فِي 7 إِلَى 8 ثَوَانٍ",
            "correct": true
          },
          {
            "text": "حَبْسُ النَّفَسِ دَقِيقَةً كَامِلَةً",
            "correct": false
          },
          {
            "text": "التَّنَفُّسُ السَّرِيعُ المَسْمُوعُ",
            "correct": false
          },
          {
            "text": "إِخْرَاجُ الزَّفِيرِ فِي ثَانِيَةٍ وَاحِدَةٍ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا تَمْرِينُ النُّمُوِّ العَضَلِيِّ وَتَمْرِينُ الاسْتِطَالَةِ فِي الدَّرْسِ الرَّابِعِ؟",
        "focusWord": "الضَّغْطُ عَلَى الحَائِطِ وَأَوْتَارُ الرُّكْبَةِ",
        "options": [
          {
            "text": "تَمَدُّدُ أَوْتَارِ الرُّكْبَةِ لِلِاسْتِطَالَةِ، وَالضَّغْطُ عَلَى الحَائِطِ (8-12 عَدَّةً) لِلنُّمُوِّ العَضَلِيِّ",
            "correct": true
          },
          {
            "text": "الجَرْيُ لِمَسَافَةِ كِيلُومِتْرٍ",
            "correct": false
          },
          {
            "text": "القَفْزُ مِنَ الكُرْسِيِّ",
            "correct": false
          },
          {
            "text": "النَّوْمُ عَلَى البَطْنِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِأَيِّ وَضْعِيَّةٍ نَخْتَتِمُ الدَّرْسَ الرَّابِعَ فِي مَرْحَلَةِ (التَّدَفُّقِ)؟",
        "focusWord": "وَضْعِيَّةُ الفَرَاشَةِ",
        "options": [
          {
            "text": "وَضْعِيَّةُ الفَرَاشَةِ (تُؤَدَّى أَخِيرًا فَقَطْ لِلِاسْتِرْخَاءِ وَالمُرُونَةِ)",
            "correct": true
          },
          {
            "text": "تَمْرِينُ القَفْزِ السَّرِيعِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ الشَّدِّ العَضَلِيِّ",
            "correct": false
          },
          {
            "text": "الرَّكْضُ فِي المَكَانِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ فِي الدَّرْسِ الرَّابِعِ",
          "left": "التَّنَفُّسُ الإِيقَاعِيُّ (شَهِيقٌ 4ث، زَفِيرٌ 7-8ث)"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ",
          "left": "الضَّغْطُ عَلَى الحَائِطِ (8-12 عَدَّةً)"
        },
        {
          "right": "التَّدَفُّقُ الختَامِيُّ",
          "left": "وَضْعِيَّةُ الفَرَاشَةِ الهَادِئَةُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ الرَّابِعِ (المَسَارِ الأَوَّلِ — 8 دَقَائِقَ وَنِصْفٌ):",
        "correct": [
          "التَّنَفُّسُ الإِيقَاعِيُّ (4-7-8)",
          "تَمَدُّدُ أَوْتَارِ الرُّكْبَةِ",
          "الضَّغْطُ عَلَى الحَائِطِ (8-12 عَدَّةً)",
          "لَمْسُ مَنَاطِقِ الجِسْمِ وَوَضْعِيَّةُ الفَرَاشَةِ"
        ],
        "wrong": [
          "الوُقُوفُ المُفَاجِئُ بَعْدَ التَّدَفُّقِ",
          "إِهْمَالُ تَمَدُّدِ الأَوْتَارِ"
        ]
      },
      "applyStep": "أُطَبِّقُ الدَّرْسَ الرَّابِعَ بِالتَّرْتِيبِ: التَّنَفُّسُ الإِيقَاعِيُّ، تَمَدُّدُ أَوْتَارِ الرُّكْبَةِ، الضَّغْطُ عَلَى الحَائِطِ، وَوَضْعِيَّةُ الفَرَاشَةِ."
    }
  },
  {
    "w": 16,
    "secNum": 4,
    "heavenName": "سَمَاءُ الثُّلَاثَاءِ الرَّابِعَةُ (م ن س ع)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الرَّابِعَةُ: عُلُومُ الأَرْضِ وَالجِيُولُوجْيَا وَالطَّقْسِ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "ع",
    "jummal": 70,
    "prophet": "اليَسَعُ (ع)",
    "virtue": "الإِحْسَانُ",
    "unitHeader": "الوَحْدَةُ السَّادِسَةَ عَشْرَةَ : نَبِيُّ اللهِ الْيَسَعُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "خَلَفَ نَبِيُّ اللهِ اليَسَعُ (ع) نَبِيَّ اللهِ إِلْيَاسَ (ع) فِي هِدَايَةِ النَّاسِ وَالإِحْسَانِ إِلَى الأَرَامِلِ وَاليَتَامَى، فَبَارَكَ اللهُ لَهُمْ فِي الثِّمَارِ وَالأَرْزَاقْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (البَغْيُ وَالطَّمَعُ مُقَابِلَ نُورِ الِاصْطِفَاءِ): نَارُ الظُّلْمِ وَالغَضَبِ فِي قُلُوبِ الجَبَابِرَةِ مِنْ مُلُوكِ بَنِي إِسْرَائِيلَ الَّذِينَ طَارَدُوا إِلْيَاسَ وَالْيَسَعَ، وَنَارُ الطَّمَعِ فِي نَفْسِ الدَّائِنِ القَاسِي الَّذِي أَرَادَ اسْتِعْبَادَ يَتِيمَيْنِ؛ وَفِي مُقَابِلِهَا نُورُ الِاصْطِفَاءِ الإِلٰهِيِّ لِلْيَسَعَ: ﴿وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ﴾. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ مُقَابِلَ نَفَسِ الدُّعَاءِ): رِيحُ الوَهْمِ فِي عِبَادَةِ صَنَمِ «بَعْلٍ» الَّذِي لَا يَسْمَعُ وَلَا يَنْفَعُ، وَوَهْمُ الخَادِمِ الطَّمَّاعِ الَّذِي كَذَبَ لِيَأْخُذَ المَالَ خِفْيَةً فَكَشَفَ اللهُ سِرَّهُ لِنَبِيِّهِ الْيَسَعَ. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ وَإِحْيَاءُ الأَرْضِ): اسْتِخْرَاجُ المِلْحِ المَعْدِنِيِّ مِنَ الأَرْضِ وَإِلْقَاؤُهُ فِي عَيْنِ المَاءِ لِتَطْهِيرِهَا وَإِحْيَاءِ تُرْبَةِ أَرِيحَا المِقْلَاةِ حَتَّى أَثْمَرَتْ أَشْجَارُهَا، وَإِطْعَامُ الجِيَاعِ مِنْ حَصَادِ الشَّعِيرِ وَالحِنْطَةِ فِي سَنَةِ القَحْطِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): عُبُورُ الْيَسَعَ عَلَى مَاءِ النَّهْرِ طَاعَةً لِلهِ، وَتَحَوُّلُ المَاءِ المُرِّ إِلَى عَذْبٍ زُلَالٍ، وَفَيَضَانُ الزَّيْتِ المُبَارَكِ فِي أَوَانِي الأَرْمَلَةِ المِسْكِينَةِ، وَاغْتِسَالُ المَرِيضِ الأَبْرَصِ بِمَاءِ النَّهْرِ سَبْعَ مَرَّاتٍ تَوَاضُعًا لِأَمْرِ النَّبِيِّ حَتَّى طَهُرَ بَدَنُهُ.",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ الثُّلَاثَاءِ العَظِيمْ، يَأْتِي النَّبِيُّ الرَّقْمُ سِتَّةَ عَشَرَ فِي مَنْزِلَةِ المَاءِ وَالطَّاعَةِ وَالتَّوَاضُعِ وَالبَرَكَةِ الفَائِضَةْ، وَهُوَ العَبْدُ الصَّالِحُ نَبِيُّ اللهِ الْيَسَعْ. كَانَ فِي شَبَابِهِ تِلْمِيذًا مُخْلِصًا يُلَازِمُ نَبِيَّ اللهِ إِلْيَاسَ عَلَيْهِ السَّلَامُ وَيَعْبُدُ اللهَ مَعَهُ فِي الجِبَالِ وَالأَوْدِيَةِ هَرَبًا مِنْ ظُلْمِ المُلُوكِ الجَبَابِرَةِ الَّذِينَ تَرَكُوا طَاعَةَ اللهِ وَأَصَرُّوا عَلَى عِبَادَةِ صَنَمِ بَعْلٍ بِرِيحِ الوَهْمِ وَالعِنَادْ. وَكَانَ الفتَى الصَّالِحُ يَصْبُبُ المَاءَ الطَّهُورَ عَلَى يَدَيْ مُعَلِّمِهِ إِلْيَاسَ بِأَدَبٍ وَتَوَاضُعٍ وَيَتَعَلَّمُ مِنْهُ الحِكْمَةَ وَالاسْمَ الأَعْظَمْ، فَلَمَّا أَرَادَ اللهُ أَنْ يَرْفَعَ نَبِيَّهُ إِلْيَاسَ وَيَكْسُوَهُ النُّورَ أَلْقَى إِلْيَاسُ رِدَاءَهُ الصُّوفِيَّ المُبَارَكَ عَلَى تِلْمِيذِهِ وَوَصِيِّهِ الأَمِينِ، فَاصْطَفَاهُ اللهُ نَبِيًّا وَرَسُولًا إِلَى بَنِي إِسْرَائِيلَ وَذَكَرَهُ فِي القُرْآنِ الكَرِيمِ مَعَ الأَنْبِيَاءِ المُفَضَّلِينَ فَقَالَ تَعَالَى وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الكِفْلِ وَكُلٌّ مِنَ الأَخْيَارْ.",
      "أَقْبَلَ نَبِيُّ اللهِ إِلَى شَاطِئِ نَهْرِ الأُرْدُنِّ فَبَسَطَ رِدَاءَ النُّبُوَّةِ عَلَى المَاءِ وَدَعَا رَبَّهُ بِيَقِينٍ رَاسِخٍ، فَمَشَى وَعَبَرَ فَوْقَ مَاءِ النَّهْرِ كَمَا يَمْشِي عَلَى اليَابِسَةِ بِإِذْنِ اللهِ القَدِيرْ، فَعَلِمَ أَبْنَاءُ الأَنْبِيَاءِ وَالمُؤْمِنُونَ أَنَّ اللهَ قَدْ جَعَلَهُ خَلِيفَةً لِإِلْيَاسَ وَأَيَّدَهُ بِالآيَاتِ البَيِّنَاتْ. ثُمَّ دَخَلَ مَدِينَةَ أَرِيحَا فَجَاءَهُ أَهْلُهَا يَشْكُونَ إِلَيْهِ أَنَّ مَاءَ عَيْنِهِمُ الوَحِيدَةِ مُرٌّ مَالِحٌ يُفْسِدُ الزَّرْعَ وَيُسْقِطُ الثِّمَارَ حَتَّى يَبِسَتْ أَرْضُهُمْ، فَطَلَبَ مِنْهُمْ صَحْنًا جَدِيدًا فِيهِ مِلْحٌ طَبِيعِيٌّ مِنْ مَعَادِنِ التُّرَابِ وَمَشَى بِتَوَاضُعٍ إِلَى رَأْسِ النَّبْعْ، فَأَلْقَى المِلْحَ بِيَدِهِ فِي المَاءِ وَدَعَا رَبَّهُ فَتَفَجَّرَتْ عُيُونُ المَاءِ صَافِيَةً وَنَبَعَ مِنْهَا مَاءٌ عَذْبٌ فُرَاتٌ سَقَى النَّاسَ وَالأَشْجَارَ وَأَحْيَا التُّرَابَ بَعْدَ مَوْتِهْ.",
      "وَكَانَ نَبِيُّ اللهِ رَحِيمًا بِالأَرَامِلِ وَالأَيْتَامِ لَا يُصَعِّرُ خَدَّهُ لِفَقِيرٍ أَبَدًا؛ فَفِي يَوْمٍ جَاءَتْهُ أَرْمَلَةُ رَجُلٍ مُؤْمِنٍ تَبْكِي وَقَالَتْ يَا نَبِيَّ اللهِ إِنَّ زَوْجِي كَانَ عَبْدًا خَاشِعًا لِرَبِّهِ وَقَدْ مَاتَ وَعَلَيْهِ دَيْنٌ، وَجَاءَ صَاحِبُ الدَّيْنِ القَاسِي يُرِيدُ أَنْ يَأْخُذَ وَلَدَيَّ اليَتِيمَيْنِ لِيَخْدُمَاهُ، وَلَيْسَ عِنْدِي فِي البَيْتِ إِلَّا قَارُورَةٌ صَغِيرَةٌ فِيهَا قَلِيلٌ مِنْ دُهْنِ الزَّيْتْ! فَأَمَرَهَا نَبِيُّ اللهِ أَنْ تَسْتَعِيرَ مِنْ جِيرَانِهَا أَوْعِيَةً وَأَوَانِيَ فَارِغَةً كَثِيرَةً، وَأَنْ تُغْلِقَ بَابَ بَيْتِهَا فِي سَتْرٍ وَعِفَّةٍ عَلَيْهَا وَعَلَى يَتِيمَيْهَا ثُمَّ تَسْكُبَ مِنْ تِلْكَ القَارُورَةِ الصَّغِيرَةِ وَتُكَبِّرَ اللهْ. فَسَكَبَتِ الأُمُّ الصَّابِرَةُ وَفَاضَ الزَّيْتُ الطَّاهِرُ كَالنَّبْعِ الجَارِي حَتَّى امْتَلَأَتْ جَمِيعُ الأَوَانِي فِي البَيْتِ بِمَا وَعَدَ اللهُ الصَّابِرِينَ مِنْ فَضْلِهْ، فَبَاعَتْ مِنْهُ وَقَضَتْ دَيْنَهَا وَعَاشَتْ مَعَ يَتِيمَيْهَا فِي كِفَايَةٍ وَنَعِيمٍ كَرِيمْ.",
      "وَفِي سَنَةِ القَحْطِ وَالجَدْبِ جَاءَ رَجُلٌ مُؤْمِنٌ بِعِشْرِينَ رَغِيفًا مِنْ خُبْزِ شَعِيرٍ وَسُنْبُلٍ أَخْضَرَ هَدِيَّةً لِلنَّبِيِّ، وَكَانَ عِنْدَهُ مِائَةُ رَجُلٍ مِنَ الفُقَرَاءِ الجِيَاعْ، فَأَمَرَ الْيَسَعُ خَادِمَهُ أَنْ يُقَدِّمَ الخُبْزَ لِلْمِائَةِ جَمِيعًا! فَتَعَجَّبَ الخَادِمُ كَيْفَ يَكْفِي هٰذَا القَلِيلُ مِائَةَ رَجُلْ؟ فَقَالَ النَّبِيُّ قَدِّمْهُ لَهُمْ فَإِنَّ اللهَ قَدْ بَارَكَ فِيهِ وَنَعَّمَ عَلَى عِبَادِهِ الَّذِينَ يَدْعُونَ رَبَّهُمْ بِالإِخْلَاصْ، فَأَكَلَ المِائَةُ كُلُّهُمْ حَتَّى شَبِعُوا وَفَضَلَ مِنَ الخُبْزِ بَقِيَّةٌ كَثِيرَةْ. كَمَا جَمَعَ التَّلَامِيذُ يَوْمًا بُقُولًا بَرِّيَّةً لِيَطْبُخُوهَا فَوَقَعَ فِيهَا حَنْظَلٌ مُرٌّ سَامٌّ دُونَ أَنْ يَعْلَمُوا، فَلَمَّا ذَاقُوهَا صَاحُوا إِنَّ فِي القِدْرِ سُمًّا يَا نَبِيَّ اللهْ، فَأَلْقَى الْيَسَعُ حَفْنَةً مِنْ دَقِيقِ القَمْحِ فِي القِدْرِ وَسَمَّى اللهَ فَتَحَوَّلَ المُرُّ إِلَى غِذَاءٍ طَيِّبٍ حَلَالٍ لَا ضَرَرَ فِيهِ.",
      "وَذَاعَ صِيتُ نَبِيِّ اللهِ الْيَسَعَ حَتَّى جَاءَهُ قَائِدٌ كَبِيرٌ قَدْ أَصَابَ جِلْدَهُ دَاءُ البَرَصِ يَطْلُبُ الشِّفَاءْ، فَلَمْ يَخْرُجِ النَّبِيُّ لِمَوْكِبِهِ تَوَاضُعًا لِلهِ بَلْ أَرْسَلَ إِلَيْهِ أَنِ اذْهَبْ فَاغْتَسِلْ فِي مَاءِ نَهْرِ الأُرْدُنِّ سَبْعَ مَرَّاتٍ يَطْهُرْ بَدَنُكَ بِإِذْنِ اللهْ. فَغَضِبَ القَائِدُ فِي البِدَايَةِ بِرِيحِ الكِبْرِ ثُمَّ نَصَحَهُ أَصْحَابُهُ بِالعَقْلِ فَنَزَلَ فِي مَاءِ النَّهْرِ بِنَفْسِهِ وَاغْتَسَلَ سَبْعَ مَرَّاتٍ طَاعَةً لِأَمْرِ النَّبِيِّ، فَشَفَاهُ اللهُ وَعَادَ جِلْدُهُ نَقِيًّا طَاهِرًا كَجِلْدِ الطِّفْلِ الصَّغِيرْ! فَجَاءَ القَائِدُ بِهَدَايَا كَثِيرَةٍ مِنَ الذَّهَبِ وَالفضَّةِ فَرَفَضَ نَبِيُّ اللهِ أَنْ يَأْخُذَ عَلَى آيَاتِ اللهِ أَجْرًا لِأَنَّهُ كَانَ زَاهِدًا عَابِدًا يَبْتَغِي وَجْهَ اللهِ الَّذِي يَشِعُّ نُورُهُ فِي القُلُوبِ الطَّاهِرَةْ، وَحِينَ لَحِقَ خَادِمُهُ الطَّمَّاعُ بِالقَائِدِ سِرًّا وَكَذَبَ لِيَأْخُذَ المَالَ أَعْلَمَ اللهُ نَبِيَّهُ بِالوَحْيِ فَوَعَظَهُ وَبَيَّنَ لِلنَّاسِ أَنَّ العِفَّةَ وَالصِّدْقَ هُمَا كَنْزُ المُؤْمِنِينَ الأَبْرَارْ. وَظَلَّ نَبِيُّ اللهِ الْيَسَعُ يَدْعُو قَوْمَهُ إِلَى التَّوْحِيدِ وَالإِحْسَانِ وَهُوَ عَبْدٌ مُطِيعٌ لِمَوْلَاهُ حَتَّى أَوْصَى بِمَوَارِيثِ النُّبُوَّةِ إِلَى وَصِيِّهِ نَبِيِّ اللهِ ذِي الكِفْلِ عَلَيْهِمَا السَّلَامْ."
    ],
    "words": [
      {
        "word": "يَعْبُدُ",
        "desc": "وسط متصل / ساكن: ـعْـ",
        "raw": "يَعْبُدُ (وسط متصل / ساكن: ـعْـ)"
      },
      {
        "word": "الْيَسَعْ",
        "desc": "آخر متصل / ساكن وقفا: ـعْ",
        "raw": "الْيَسَعْ (آخر متصل / ساكن وقفا: ـعْ)"
      },
      {
        "word": "عَبَرَ",
        "desc": "أول منفصل / متحرك بالفتح: عَـ",
        "raw": "عَبَرَ (أول منفصل / متحرك بالفتح: عَـ)"
      },
      {
        "word": "فَعَلِمَ",
        "desc": "أول متصل / متحرك بالفتح: ـعَـ",
        "raw": "فَعَلِمَ (أول متصل / متحرك بالفتح: ـعَـ)"
      },
      {
        "word": "شَعِيرٍ",
        "desc": "وسط متصل / متحرك بالفتح: ـعَـ",
        "raw": "شَعِيرٍ (وسط متصل / متحرك بالفتح: ـعَـ)"
      },
      {
        "word": "وَعَدَ",
        "desc": "وسط منفصل / متحرك بالفتح: عَـ",
        "raw": "وَعَدَ (وسط منفصل / متحرك بالفتح: عَـ)"
      },
      {
        "word": "نَبَعَ",
        "desc": "آخر متصل / متحرك بالفتح: ـعَ",
        "raw": "نَبَعَ (آخر متصل / متحرك بالفتح: ـعَ)"
      },
      {
        "word": "عُيُونُ",
        "desc": "أول منفصل / متحرك بالضم: عُـ",
        "raw": "عُيُونُ (أول منفصل / متحرك بالضم: عُـ)"
      },
      {
        "word": "مُطِيعٌ",
        "desc": "آخر متصل / متحرك بالضم: ـعٌ",
        "raw": "مُطِيعٌ (آخر متصل / متحرك بالضم: ـعٌ)"
      },
      {
        "word": "عِفَّةٍ",
        "desc": "أول منفصل / متحرك بالكسر: عِـ",
        "raw": "عِفَّةٍ (أول منفصل / متحرك بالكسر: عِـ)"
      },
      {
        "word": "نَعَّمَ",
        "desc": "وسط متصل / مضعف بالفتح: ـعَّـ",
        "raw": "نَعَّمَ (وسط متصل / مضعف بالفتح: ـعَّـ)"
      },
      {
        "word": "يَشِعُّ",
        "desc": "آخر متصل / مضعف بالضم: ـعُّ",
        "raw": "يَشِعُّ (آخر متصل / مضعف بالضم: ـعُّ)"
      },
      {
        "word": "يُصَعِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـعِّـ",
        "raw": "يُصَعِّرُ (وسط متصل / مضعف بالكسر: ـعِّـ)"
      },
      {
        "word": "عَابِدًا",
        "desc": "أول منفصل / ممدود بالألف: عَا",
        "raw": "عَابِدًا (أول منفصل / ممدود بالألف: عَا)"
      },
      {
        "word": "يَدْعُونَ",
        "desc": "وسط متصل / ممدود بالواو: ـعُو",
        "raw": "يَدْعُونَ (وسط متصل / ممدود بالواو: ـعُو)"
      },
      {
        "word": "نَعِيمٍ",
        "desc": "وسط متصل / ممدود بالياء: ـعِي",
        "raw": "نَعِيمٍ (وسط متصل / ممدود بالياء: ـعِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ العَيْنِ (ع): النُّطْقُ السَّلِيمُ لِحَرْفِ العَيْنِ مِنْ مَخْرَجِ وَسَطِ الحَلْقِ بِصَوْتٍ صَافٍ عَمِيقٍ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الدُّعَاءِ بِالبَرَكَةِ فِي القَلِيلِ لِيَصِيرَ كَثِيرًا، وَالصِّدْقِ فِي القَوْلِ وَالأَمَانَةِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "فَتْحَةُ النَّبْعِ وَالتَّحَوُّلُ الهَنْدَسِيُّ لِلْعَيْنِ وَالرَّقْمُ (16): مُشَاهَدَةُ شَكْلِ حَرْفِ العَيْنِ (ع / عـ / ـعـ / ـع) الَّذِي يُشْبِهُ فَتْحَةَ نَبْعِ المَاءِ فِي أَوَّلِ الكَلِمَةِ ثُمَّ يُغْلَقُ وَيُطْمَسُ كَالْإِنَاءِ المَمْلُوءِ فِي وَسَطِ الكَلِمَةِ وَآخِرِهَا المُتَّصِلِ (كَمَا فِي كَلِمَةِ: الْيَسَع)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (16) (4 × 4 = 16، وَهُوَ تَمَامُ السَّمَاءِ الرَّابِعَةِ وَعَدَدُ كَلِمَاتِ المِيزَانِ الصَّوْتِيِّ)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ الْيَسَعَ الكَامِلَةُ وَأَدَبُ التِّلْمِيذِ مَعَ مُعَلِّمِهِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ الْيَسَعَ الكَامِلَةِ فِي القُرْآنِ وَتُرَاثِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى حُسْنِ اسْتِمَاعِ التِّلْمِيذِ لِمُعَلِّمِهِ كَمَا لَازَمَ الْيَسَعُ نَبِيَّ اللهِ إِلْيَاسَ وَسَمِعَ حِكْمَتَهُ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ سِتَّةَ عَشَرَ (16) وَالسَّبْعُونَ (70): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (16) وَمَعْرِفَةِ قِيمَةِ العَيْنِ العَشْرِيَّةِ (70 = سَبْعُ عَشَرَاتٍ)، وَتَدْرِيبُ اليَدِ عَلَى سَكْبِ السَّوَائِلِ (المَاءِ وَالزَّيْتِ) فِي الأَوَانِي بِاتِّزَانٍ دُونَ إِرَاقَةٍ، وَإِعَانَةِ الأَرَامِلِ وَالأَيْتَامِ وَقَضَاءِ حَوَائِجِ المُحْتَاجِينَ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ العُبُورِ المُتَّزِنِ وَالسِّبَاحَةِ وَالاغْتِسَالِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ التَّوَازُنِ وَالمَشْيِ النَّشِيطِ عِنْدَ شَوَاطِئِ الأَنْهَارِ، وَرِيَاضَةِ السِّبَاحَةِ وَالاغْتِسَالِ بِالمَاءِ الطَّهُورِ لِتَقْوِيَةِ العَضَلَاتِ وَتَنْشِيطِ الدَّوْرَةِ الدَّمَوِيَّةِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ تَنْقِيَةِ المِيَاهِ وَالمِلْحِ الطَّبِيعِيِّ وَزَيْتِ الزَّيْتُونِ وَالشَّعِيرِ: تَعَلُّمُ الفَرْقِ بَيْنَ المَاءِ العَذْبِ الصَّالِحِ لِلشُّرْبِ وَالزِّرَاعَةِ وَالمَاءِ الآسِنِ المُرِّ، وَمَعْرِفَةِ خَوَاصِّ المِلْحِ الطَّبِيعِيِّ فِي التَّطْهِيرِ، وَالفَوَائِدِ الغِذَائِيَّةِ العَظِيمَةِ لِزَيْتِ الزَّيْتُونِ وَخُبْزِ الشَّعِيرِ الَّذِي أَشْبَعَ اللهُ بِهِ القَوْمَ بِبَرَكَةِ الْيَسَعَ (عَلَيْهِ السَّلَامُ)."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ طَهَارَةِ البَدَنِ بِالمَاءِ وَالتَّعَفُّفِ عَنْ أَمْوَالِ النَّاسِ: تَعَلُّمُ أَهَمِّيَّةِ الاغْتِسَالِ وَالنَّظَافَةِ لِشِفَاءِ الجِلْدِ وَالبَدَنِ، وَآدَابِ إِغْلَاقِ بَابِ البَيْتِ وَالسَّتْرِ عِنْدَ قَضَاءِ الحَوَائِجِ (كَمَا أَمَرَ الْيَسَعُ الأَرْمَلَةَ أَنْ تُغْلِقَ بَابَهَا عَلَيْهَا وَعَلَى يَتِيمَيْهَا وَهِيَ تَسْكُبُ الزَّيْتَ)، وَالتَّعَفُّفِ التَّامِّ عَنِ الطَّمَعِ فِي هَدَايَا النَّاسِ."
      }
    },
    "grammar": {
      "topic": "الجُمْلَةُ الفِعْلِيَّةُ: المَفْعُولُ بِهِ هُوَ مَنْ وَقَعَ عَلَيْهِ الفِعْلْ",
      "rule": "المَفْعُولُ بِهِ هُوَ الاِسْمُ الَّذِي وَقَعَ عَلَيْهِ فِعْلُ الفَاعِلِ، وَتَكُونُ عَلَامَةُ إِعْرَابِهِ النَّصْبَ بِالفَتْحَةِ (ـَ).",
      "example": "عَرَفَ العَالِمُ الحَقِيقَةَ — قَطَفَ الفَلَّاحُ العِنَبَ.",
      "focusWord": "العِنَبَ",
      "q": "أَيْنَ «المَفْعُولُ بِهِ» المَنْصُوبُ فِي جُمْلَةِ «قَطَفَ الفَلَّاحُ العِنَبَ»؟",
      "opts": [
        "العِنَبَ",
        "قَطَفَ",
        "الفَلَّاحُ",
        "مِنْ"
      ]
    },
    "earIirab": {
      "topic": "تَمْيِيزُ الفَتْحَةِ الظَّاهِرَةِ (ـَ) عَلَى المَفْعُولِ بِهْ",
      "rule": "نَسْمَعُ فِي آخِرِ المَفْعُولِ بِهِ صَوْتَ الفَتْحَةِ المَفْتُوحَةِ (ـَ) أَوْ تَنْوِينِ الفَتْحِ (ـًا).",
      "sentence": "عَلَّمَ المُعَلِّمُ التِّلْمِيذَ عِلْمًا نَافِعًا.",
      "targetWord": "التِّلْمِيذَ",
      "caseAns": "مَفْعُولٌ بِهِ مَنْصُوبٌ بِالفَتْحَةِ (ـَ)"
    },
    "math": {
      "numVal": 76,
      "numName": "سِتَّةٌ وَسَبْعُونَ",
      "eqDisplay": "6 + 70 = 76",
      "subDisplay": "76 - 6 = 70",
      "compDisplay": "67 < 76",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (76) بِالعَرَبِيَّةِ؟",
        "focus": "76",
        "ans": "سِتَّةٌ وَسَبْعُونَ",
        "wrong": [
          "سَبْعَةٌ وَسِتُّونَ",
          "سَبْعُونَ",
          "سِتَّةٌ وَثَمَانُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "76 - 6 = ؟",
        "ans": "70 (سَبْعُونَ)",
        "wrong": [
          "60 (سِتُّونَ)",
          "67",
          "80"
        ]
      }
    },
    "sport": {
      "title": "القَفْزُ النَّجْمِيُّ المُنْتَظَمُ لِتَنْشِيطِ القَلْبِ",
      "middleText": "أَقْفِزُ بِخِفَّةٍ مَعَ فَتْحِ الذِّرَاعَيْنِ وَالسَّاقَيْنِ كَالنَّجْمَةِ ثُمَّ ضَمِّهِمَا بِإِيقَاعٍ هَادِئْ. يُقَوِّي هٰذَا التَّمْرِينُ عَضَلَةَ القَلْبِ وَالرِّئَتَيْنِ وَيَمْنَحُ الجِسْمَ حَيَوِيَّةً وَنَشَاطًا."
    },
    "sci": {
      "title": "مُخْتَبَرُ الجِيُولُوجْيَا وَالطَّقْسِ: البُرْكَانُ وَتَكَوُّنُ السُّحُبِ",
      "summaryThird": "فِي المُخْتَبَرِ نُحَاكِي فَوَرَانَ البُرْكَانِ بِتَفَاعُلِ الخَلِّ الحَامِضِيِّ مَعَ بِيْكَرْبُونَاتِ الصُّودِيُومِ، وَنَصْنَعُ سَحَابَةً دَاخِلَ البَرْطَمَانِ بِتَكَثُّفِ البُخَارِ الدَّافِئِ عِنْدَ مُلَامَسَةِ الثَّلْجْ.",
      "focusConcept": "تَكَثُّفُ بُخَارِ المَاءِ",
      "factAns": "تَحَوُّلُ البُخَارِ إِلَى سُحُبٍ وَقَطَرَاتِ مَطَرْ"
    },
    "rightsSummary": {
      "title": "حَقُّ المُعَلِّمِ وَالعِلْمِ (حُور وَسُرُور - 16)",
      "storySentence": "وَقَفَ سُرُورٌ وَحُورُ تَقْدِيرًا لِمُعَلِّمِهِمَا، وَتَعَلَّمَا أَنَّ حَقَّ المُعَلِّمِ هُوَ تَوْقِيرُهُ، وَالإِنْصَاتُ لِشَرْحِهِ بِأَدَبٍ، وَالعَمَلُ بِمَا يُعَلِّمُنَا مِنَ الخَيْرْ.",
      "applyAction": "أَحْتَرِمُ مُعَلِّمِي وَأَشْكُرُهُ وَأَسْتَمِعُ لِدَرْسِهِ بِانْتِبَاهْ."
    },
    "rightsFullTitle": "(19) حق الرعية + (20) حق الزوجة + (21) حق الرعية بملك اليمين",
    "rightsQuote": "بالعلم وأمَّا حَقُّ رَعِيَّتِكَ بالعِلْمِ فَأَنْ تَعْلَــمَ أَنَّ اللهَ قَدْ جَعَلَكَ لَهُمْ فِيمَـــــــا آتاكَ مِنَ الْعِلْمِ وَولاّكَ مِنْ خَزَانةِ الْحِكْمَةِ، فَــــــــــإنْ أَحْسَنْتَ فِيمَــــــا ولاّكَ اللهُ مِنْ ذلِكَ وَقُمْتَ بهِ لَهُمْ مَقَامَ الخَـــــازِنِ الشَّفِيقِ النَّـــــــاصِحِ لِمَـــولاهُ فِي عَبيدِهِ، الصَّــــــابرِ الْمُحْتَسِب الَّذِي إذَا رأَى ذا حَـــــاجَة أَخرَجَ لَهُ مِنَ الأَمْوَالِ الَّتِي فِي يَدَيهِ كُنْتَ رَاشِدًا، وَكُنْتَ لـــــــــــــِذَلِكَ آمِلاً مُعْتَقِدًا وَإلاّ كُنْتَ لَهُ خَائِنًا وَلِخَلقِهِ ظَالِمًا وَلِسَلْبهِ وَعِزِّهِ مُتَعَرِّضًا. | وَأمَّــــــــــــــا حَقُّ رَعِيَّتِكَ بمِلْكِ النّكَاحِ فَأَنْ تَعْلَمَ أَنَّ اللَّهَ جَـعَـلَـهَـا سَكَنًا وَمُسْتَرَاحًا وَأُنْسًـــــــــا وَوَاقِيةً، وَكَذَلِكَ كُلُّ وَاحِد مِنْكُمَا يَجِبُ أَنْ يَحْمَدَ اللَّهَ عَلَى صَاحِبهِ، ويَعْلَـــــــــــــمَ أَنَّ ذَلِكَ نِعْمَةٌ مِنْهُ عَلَيْهِ. وَوَجَبَ أَنْ يُحْسِــــــــــنَ صُحْبَةَ نِعْمَةِ اللَّهِ وَيُكْرِمَهَا ويَرْفَقَ بهَا وَإنْ كَانَ حَقُّكَ عَلَيْهَا أَغْلَظَ  وَطَاعَتِكَ بهَا أَلْزَمَ فِيمَا أَحْببْتَ وَكَرِهْتَ مَا لَمْ تَكنْ مَعْصِيةً، فإنَّ لَهَا حَقُّ الرَّحــــــــْمَةُ وَالْمُؤَانَسَةِ، وَمَوْضِعُ السُّكُونِ إلَيهَا قَضَاءَ اللَّذَّةِ الَّتِي لا بُدَّ مِنْ قَضَائِهَــــــــا وَذَلِكَ عَظِيـــــمٌ. وَلا قُوَّةَ إلا باللهِ. | وَأمَّا حَقُّ رَعِيَّتِكَ بمِلْكِ اليَمِينِ فَأَنْ تَعْلَمَ أنَهُ خَلْقُ رَبكَ، وَلَحْمُــــكَ وَدَمُــــكَ وَأَنَّـــــــــــكَ تَمْلِكُهُ لا أنْتَ صَنَعْتَهُ دُونَ اللَّهِ وَلا خَلَقْتَ لَهُ سَمْعًـــــا وَلا بَصَرًا وَلا أَجْرَيتَ لَهُ رِزْقًا وَلَكِنَّ اللَّهَ كَفَاكَ ذَلِكَ، ثُمَّ سَخَّرَهُ لَكَ وَائْتَمَنَكَ عَلَيْهِ وَاسْتَوْدَعَكَ إيَّـــــاهُ لِتَحْفَظَهُ فِيهِ وتَسِيرَ فِيهِ بسِيرَتِهِ فَتُطْعِمَهُ مِمَّا تَأْكُلُ وَتُلْبسَهُ مِمَّا تَلْبَسُ وَلا تُكَلِّفَهُ مَـــــــــا لا يُطِيقُ، فَإنْ كَرِهْتَ (هُ) خَرَجْتَ إلَى اللَّهِ مِنْهُ وَاسْتَبْدَلْتَ بهِ وَلَـمْ تُعَذِّبْ خَلْقَ اللَّهِ وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (19) حق الرعية + (20) حق الزوجة + (21) حق الرعية بملك اليمين",
        "text": "بالعلم وأمَّا حَقُّ رَعِيَّتِكَ بالعِلْمِ فَأَنْ تَعْلَــمَ أَنَّ اللهَ قَدْ جَعَلَكَ لَهُمْ فِيمَـــــــا آتاكَ مِنَ الْعِلْمِ وَولاّكَ مِنْ خَزَانةِ الْحِكْمَةِ، فَــــــــــإنْ أَحْسَنْتَ فِيمَــــــا ولاّكَ اللهُ مِنْ ذلِكَ وَقُمْتَ بهِ لَهُمْ مَقَامَ الخَـــــازِنِ الشَّفِيقِ النَّـــــــاصِحِ لِمَـــولاهُ فِي عَبيدِهِ، الصَّــــــابرِ الْمُحْتَسِب الَّذِي إذَا رأَى ذا حَـــــاجَة أَخرَجَ لَهُ مِنَ الأَمْوَالِ الَّتِي فِي يَدَيهِ كُنْتَ رَاشِدًا، وَكُنْتَ لـــــــــــــِذَلِكَ آمِلاً مُعْتَقِدًا وَإلاّ كُنْتَ لَهُ خَائِنًا وَلِخَلقِهِ ظَالِمًا وَلِسَلْبهِ وَعِزِّهِ مُتَعَرِّضًا. | وَأمَّــــــــــــــا حَقُّ رَعِيَّتِكَ بمِلْكِ النّكَاحِ فَأَنْ تَعْلَمَ أَنَّ اللَّهَ جَـعَـلَـهَـا سَكَنًا وَمُسْتَرَاحًا وَأُنْسًـــــــــا وَوَاقِيةً، وَكَذَلِكَ كُلُّ وَاحِد مِنْكُمَا يَجِبُ أَنْ يَحْمَدَ اللَّهَ عَلَى صَاحِبهِ، ويَعْلَـــــــــــــمَ أَنَّ ذَلِكَ نِعْمَةٌ مِنْهُ عَلَيْهِ. وَوَجَبَ أَنْ يُحْسِــــــــــنَ صُحْبَةَ نِعْمَةِ اللَّهِ وَيُكْرِمَهَا ويَرْفَقَ بهَا وَإنْ كَانَ حَقُّكَ عَلَيْهَا أَغْلَظَ  وَطَاعَتِكَ بهَا أَلْزَمَ فِيمَا أَحْببْتَ وَكَرِهْتَ مَا لَمْ تَكنْ مَعْصِيةً، فإنَّ لَهَا حَقُّ الرَّحــــــــْمَةُ وَالْمُؤَانَسَةِ، وَمَوْضِعُ السُّكُونِ إلَيهَا قَضَاءَ اللَّذَّةِ الَّتِي لا بُدَّ مِنْ قَضَائِهَــــــــا وَذَلِكَ عَظِيـــــمٌ. وَلا قُوَّةَ إلا باللهِ. | وَأمَّا حَقُّ رَعِيَّتِكَ بمِلْكِ اليَمِينِ فَأَنْ تَعْلَمَ أنَهُ خَلْقُ رَبكَ، وَلَحْمُــــكَ وَدَمُــــكَ وَأَنَّـــــــــــكَ تَمْلِكُهُ لا أنْتَ صَنَعْتَهُ دُونَ اللَّهِ وَلا خَلَقْتَ لَهُ سَمْعًـــــا وَلا بَصَرًا وَلا أَجْرَيتَ لَهُ رِزْقًا وَلَكِنَّ اللَّهَ كَفَاكَ ذَلِكَ، ثُمَّ سَخَّرَهُ لَكَ وَائْتَمَنَكَ عَلَيْهِ وَاسْتَوْدَعَكَ إيَّـــــاهُ لِتَحْفَظَهُ فِيهِ وتَسِيرَ فِيهِ بسِيرَتِهِ فَتُطْعِمَهُ مِمَّا تَأْكُلُ وَتُلْبسَهُ مِمَّا تَلْبَسُ وَلا تُكَلِّفَهُ مَـــــــــا لا يُطِيقُ، فَإنْ كَرِهْتَ (هُ) خَرَجْتَ إلَى اللَّهِ مِنْهُ وَاسْتَبْدَلْتَ بهِ وَلَـمْ تُعَذِّبْ خَلْقَ اللَّهِ وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ اليَسَعُ (ع): آدَابُ طَهَارَةِ البَدَنِ بِالمَاءِ وَالتَّعَفُّفِ عَنْ أَمْوَالِ النَّاسِ: تَعَلُّمُ أَهَمِّيَّةِ الاغْتِسَالِ وَالنَّظَافَةِ لِشِفَاءِ الجِلْدِ وَالبَدَنِ، وَآدَابِ إِغْلَاقِ بَابِ البَيْتِ وَالسَّتْرِ عِنْدَ قَضَاءِ الحَوَائِجِ (كَمَا أَمَرَ الْيَسَعُ الأَرْمَلَةَ أَنْ تُغْلِقَ بَابَهَا عَلَيْهَا وَعَلَى يَتِيمَيْهَا وَهِيَ تَسْكُبُ الزَّيْتَ)، وَالتَّعَفُّفِ التَّامِّ عَنِ الطَّمَعِ فِي هَدَايَا النَّاسِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرعية",
        "text": "حور وحبها للتعليم في صباح أحد الأيام، جلست حور مع صديقاتها في الصف، وابتسمت المعلمة وقالت: \"اليوم أريد من كل واحدة منكن كتابة موضوع إنشائي عن مهنتها المستقبلية، ولماذا اختارتها.\" رفعت حور يدها وقالت بحماس: \"أريد أن أصبح معلمة، لأنني أحب المساعدة والتعليم. أحب كيف تصنع المعلمات فرقًا في حياتنا.\" ابتسمت المعلمة وأشارت لها أن تتابع: \"تذكري، أن المعلم ليس مجرد من يعطي الدروس، بل من يهتم بالطلاب ويفهم احتياجاتهم ويعلمهم بالصبر والرحمة.\" قالت إحدى الطالبات الأخرى: \"أنا لا أحب أن أصبح معلمة، لأن التعليم مسؤولية كبيرة، ولا أظن أنني سأتمكن من القيام بها جيدًا.\" أجابت المعلمة بحكمة:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرعية",
        "text": "\"أحسنتِ، فعلاً. المعلم الذي لا يتحمل مسؤولية نقل العلم يضر بالطلاب، ويجعلهم يفتقرون للمعرفة، وهذا الضرر يتراكم على المجتمع كله.\" نظرت حور لصديقاتها وقالت: \"أفهم الآن أن المعلم الصادق ليس فقط من يعلم، بل من يتحلى بالرحمة والصبر والنصح، ويعطي كل طالب حقه. إذا أحسن المعلم فالله يكافئه، وإذا أساء أو ظلم يمنعه الله من أن يكون معلماً.\" ابتسمت إحدى صديقاتها وقالت: \"الدرس أصبح واضحًا، أن المعلم مسؤول عن حياة وعقول طلابه، والتعليم أمانة يجب أن نحترمها.\" وأتمت حور حديثها قائلة: \"لذلك أحب التعليم، ليس فقط لنقل المعلومات، بل لأجعل كل طالب يشعر بالاهتمام والفهم، وأساعده على النمو، كما أراد الله أن يكون المعلم أداة لنفع الناس.\" فقالت المعلمة واجب المعلم لا ان يعطيكم سمكة بل يعلمكم الصيد"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الزوجة",
        "text": "🌙 قصة: رحمة في المساء عاد الأب مساءً من عمله، وجهه شاحب وتعبه واضح. دخل البيت بخطوات بطيئة، فركض نحوه نور وحور وهما يناديان بقلق: – أبي، ماذا بك؟ تبدو مريضًا! ابتسم الأب رغم الألم، وقال بصوت مبحوح: – لا تقلقا، فقط متعب قليلًا من العمل. اقتربت الأم، وضعت يدها على جبينه وقالت بحنان: – حرارتك مرتفعة، يجب أن ترتاح فورًا. ساعدته في الجلوس، وقدّمت له الحساء الدافئ، ثم جلست قربه تمسح جبينه بالماء، وتهمس بالدعاء: – اللهم اشفه وعافه. جلس نور صامتًا يراقب، بينما همست حور: – أمي تبدو متعبة، لكنها لا تتوقف عن العناية بأبي. قال نور: – لأن الرحمة تجعل التعب سهلاً، هي تخاف عليه أكثر من نفسها. في تلك الليلة، سهرت الأم إلى جوار الأب، تتابع حرارته وتبدّل الكمادات، حتى غلبها النعاس فجراً. وفي الصباح، استيقظ الأب وقد تحسنت حاله، لكن حين دخل المطبخ، وجد الأم على الأريكة ممدةً، تمسك رأسها بتعب. اقترب منها بقلق: – يبدو أنكِ أصبتِ بعدواي يا عزيزتي! ابتسمت وقالت بصوت خافت:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الزوجة",
        "text": "– يبدو ذلك، لكن لا بأس، أنت الآن بخير. نظر إليها الأب بحنان، وقال: – الآن دوري أنا لأرعاكِ كما رعيتِني. دخل المطبخ، وأعدّ الزهورات والفطائر، ثم أيقظ حور ونور وقال: – هيا يا صغيرَيّ، ساعداني في إعداد الفطور لأمكما. ابتسم نور وهو يحمل الأطباق، وقال: – أبي صار الممرّض اليوم! ضحكت حور وأضافت: – وأمي المريضة الطيبة التي كانت بطلتنا أمس. جلسوا جميعًا حول المائدة، يتناولون الفطور بصمت ودفء، وفي عيونهم امتنان وحبّ عميق. قال الأب وهو ينظر إلى أطفاله: \"الرحمة بيننا هي ما يجعل بيتنا جميلاً، فكلما تعب أحدنا، وجد الآخر بجانبه.\" رفعت حور رأسها وقالت بهدوء: – الآن فهمت يا أبي... الله جعل الزواج سكنًا ورحمة، مثل ما قال القرآن. ابتسم الأب والأم معًا، وغمرهم شعور بالسكينة... كأن البيت كله يهمس بالحب."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرعية بملك اليمين",
        "text": "في مساءٍ هادئ، جلست حور تشاهد مع أمها قصة يوسف عليه السلام على شاشة التلفاز. وبينما كانت القصة تُعرض، التفتت إلى أمها وقالت: – يا أمي، لماذا كان يوسف عبدًا؟ وما معنى أنه كان يُباع ويُشترى؟ ولماذا كان يطيع من اشتراه؟ ابتسمت الأم وقالت برفق: – يا ابنتي، في ذلك الزمان كان بعض الناس يُستعبدون إذا لم تكن لهم قوة أو قوم يحمونهم، فيصبحون خدمًا عند الأقوياء. كان هذا نظامًا قديمًا في المجتمعات قبل أن يتعلم الناس المساواة والرحمة. فقال نور متعجبًا: – إذن، هل يوسف عليه السلام لم يكن قويًا؟ قالت الأم: – بل كان الأقوى يا بنيّ، ولكن حكمة الله شاءت أن يمر بهذه المواقف ليعلّم الناس أن الكرامة الحقيقية ليست في القوة الجسدية، بل في الصبر والإيمان. لقد أراد الله أن يرفع يوسف من حال العبد إلى حال الحاكم، ليُري الناس أن من يعبد الله وحده هو الحر حقًا."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الرعية بملك اليمين",
        "text": "فقالت حور: – لو كنت مكانهم لتمردت، ولم أطع من اشتراني! ضحكت الأم برفق وقالت: – هذا قد يكون ممكنًا عندما تكونين قوية، يا حور، أما أولئك فكانوا ضعفاء لا حول لهم ولا قوة. لكن حين صار الناس أحرارًا أقوياء في عقولهم وإيمانهم، انتهى زمن الاستعباد. قال نور مبتسمًا: – نعم يا أمي، الحمد لله أننا أحرار اليوم. ابتسمت الأم وقالت: – الحرية الحقيقية يا أحبتي، هي في أن نكون عبيدًا لله وحده، لا لأهوائنا ولا للناس. حقوق الرحم"
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الرَّابِعَةُ: الجِيُولُوجْيَا وَالطَّقْسُ",
      "topic": "التَّجْرِبَتَانِ (7 وَ8): البُرْكَانُ الحَقِيقِيُّ — سَحَابَةُ البَرْطَمَانِ",
      "coverImg": "assets/y7/scince/s16.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s16.1.jpg",
          "text": "التَّجْرِبَةُ (7) البُرْكَانُ الحَقِيقِيُّ: نُشَكِّلُ مُجَسَّمًا طِينِيًّا لِلْبُرْكَانِ لَهُ فُوَّهَةٌ، وَنَضَعُ بِدَاخِلِهِ بِيْكَرْبُونَاتِ الصُّودْيُومِ وَمُلَوِّنًا أَحْمَرَ ثُمَّ نَسْكُبُ الخَلَّ، فَيَفُورُ المَزِيجُ كَالحِمَمِ الفَوَّارَةِ مُوضِّحًا كَيْفَ تَنْدَفِعُ الصُّهَارَةُ مِنْ بَاطِنِ الأَرْضِ عَبْرَ الغِلَافِ الصَّخْرِيِّ."
        },
        {
          "img": "assets/y7/scince/s16.2.jpg",
          "text": "التَّجْرِبَةُ (8) سَحَابَةُ البَرْطَمَانِ: نَصُبُّ مَاءً دَافِئًا فِي بَرْطَمَانٍ زُجَاجِيٍّ وَنَرُشُّ رَذَاذًا خَفِيفًا بِالدَّاخِلِ ثُمَّ نَضَعُ مُكَعَّبَاتِ الثَّلْجِ فِي الأَعْلَى، فَيَتَكَاثَفُ البُخَارُ السَّاخِنُ عِنْدَ مُلَامَسَةِ السَّطْحِ البَارِدِ وَتَتَشَكَّلُ سَحَابَةٌ حَقِيقِيَّةٌ دَاخِلَ البَرْطَمَانِ."
        }
      ],
      "text": "التَّجْرِبَةُ (7) البُرْكَانُ الحَقِيقِيُّ: نُشَكِّلُ مُجَسَّمًا طِينِيًّا لِلْبُرْكَانِ لَهُ فُوَّهَةٌ، وَنَضَعُ بِدَاخِلِهِ بِيْكَرْبُونَاتِ الصُّودْيُومِ وَمُلَوِّنًا أَحْمَرَ ثُمَّ نَسْكُبُ الخَلَّ، فَيَفُورُ المَزِيجُ كَالحِمَمِ الفَوَّارَةِ مُوضِّحًا كَيْفَ تَنْدَفِعُ الصُّهَارَةُ مِنْ بَاطِنِ الأَرْضِ عَبْرَ الغِلَافِ الصَّخْرِيِّ. التَّجْرِبَةُ (8) سَحَابَةُ البَرْطَمَانِ: نَصُبُّ مَاءً دَافِئًا فِي بَرْطَمَانٍ زُجَاجِيٍّ وَنَرُشُّ رَذَاذًا خَفِيفًا بِالدَّاخِلِ ثُمَّ نَضَعُ مُكَعَّبَاتِ الثَّلْجِ فِي الأَعْلَى، فَيَتَكَاثَفُ البُخَارُ السَّاخِنُ عِنْدَ مُلَامَسَةِ السَّطْحِ البَارِدِ وَتَتَشَكَّلُ سَحَابَةٌ حَقِيقِيَّةٌ دَاخِلَ البَرْطَمَانِ.",
      "q1": {
        "q": "مَا المَادَّتَانِ اللَّتَانِ تَتَفَاعَلَانِ مَعَ المُلَوِّنِ الأَحْمَرِ لِإِحْدَاثِ فَوَرَانِ مُجَسَّمِ البُرْكَانِ؟",
        "focusWord": "خَلٌّ وَبِيْكَرْبُونَاتٌ",
        "options": [
          {
            "text": "الخَلُّ وَبِيْكَرْبُونَاتُ الصُّودْيُومِ",
            "correct": true
          },
          {
            "text": "المِلْحُ وَالرَّمْلُ",
            "correct": false
          },
          {
            "text": "الزَّيْتُ وَالسُّكَّرُ",
            "correct": false
          },
          {
            "text": "الحَدِيدُ وَالنُّحَاسُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "لِمَاذَا نَضَعُ الثَّلْجَ أَعْلَى البَرْطَمَانِ الَّذِي يَحْتَوِي عَلَى مَاءٍ دَافِئٍ فِي تَجْرِبَةِ (سَحَابَةُ البَرْطَمَانِ)؟",
        "focusWord": "تَكَاثُفُ البُخَارِ",
        "options": [
          {
            "text": "لِتَبْرِيدِ البُخَارِ الصَّاعِدِ فَيَتَكَاثَفُ وَيُكَوِّنُ غَيْمَةً (سَحَابَةً)",
            "correct": true
          },
          {
            "text": "لِإِشْعَالِ النَّارِ",
            "correct": false
          },
          {
            "text": "لِتَلْوِينِ الزُّجَاجِ",
            "correct": false
          },
          {
            "text": "لِإِذَابَةِ الرَّمْلِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الظَّاهِرَةُ الجَوِّيَّةُ الَّتِي تُحَاكِيهَا تَجْرِبَةُ سَحَابَةِ البَرْطَمَانِ؟",
        "focusWord": "تَشَكُّلُ الغُيُومِ",
        "options": [
          {
            "text": "تَشَكُّلُ الغُيُومِ وَتَكَاثُفُ بُخَارِ المَاءِ فِي الغِلَافِ الجَوِّيِّ",
            "correct": true
          },
          {
            "text": "كُسُوفُ الشَّمْسِ",
            "correct": false
          },
          {
            "text": "الزَّلَازِلُ الأَرْضِيَّةُ",
            "correct": false
          },
          {
            "text": "المَدُّ وَالجَزْرُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الخَلُّ وَبِيْكَرْبُونَاتُ الصُّودْيُومِ",
          "left": "فَوَرَانُ الحِمَمِ فِي تَجْرِبَةِ البُرْكَانِ الحَقِيقِيِّ"
        },
        {
          "right": "المَاءُ الدَّافِئُ فِي البَرْطَمَانِ",
          "left": "يُصْعِدُ بُخَارَ المَاءِ إِلَى الأَعْلَى"
        },
        {
          "right": "الثَّلْجُ أَعْلَى البَرْطَمَانِ",
          "left": "يُبَرِّدُ البُخَارَ فَيَتَكَاثَفُ وَيُكَوِّنُ سَحَابَةً"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَدَوَاتِ تَجْرِبَتَيِ البُرْكَانِ الحَقِيقِيِّ وَسَحَابَةِ البَرْطَمَانِ:",
        "correct": [
          "طِينٌ وَتُرَابٌ لِمُجَسَّمِ البُرْكَانِ",
          "خَلٌّ وَبِيْكَرْبُونَاتٌ وَمُلَوِّنٌ أَحْمَرُ",
          "بَرْطَمَانٌ وَمَاءٌ دَافِئٌ",
          "مُكَعَّبَاتُ ثَلْجٍ لِتَكْثِيفِ السَّحَابَةِ"
        ],
        "wrong": [
          "أَسْلَاكٌ وَبَطَّارِيَّةٌ",
          "عَدَسَةٌ وَعَيِّنَةُ حَشَرَاتٍ"
        ]
      },
      "applyStep": "أُنفِّذُ تَجْرِبَةَ سَحَابَةِ البَرْطَمَانِ فِي المَنْزِلِ لِأَرَى كَيْفَ يَتَكَاثَفُ البُخَارُ وَيَصْنَعُ الغُيُومَ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt16.jpg",
      "title": "الدَّرْسُ (5): المَسَارُ الثَّانِي (7 دَقَائِقَ وَنِصْفٌ) — رُوتِينُ 25 دَقِيقَةً المُتَكَامِلُ",
      "subtitle": "دَوَرَانُ الجِذْعِ، تَمَدُّدُ الوَرِكِ المَائِلِ، السُّكْوَاتُ الجَانِبِيُّ، وَوَضْعِيَّةُ القُرْفُصَاءِ المُرِيحَةِ",
      "slideText": "🏃 الدَّرْسُ (5) المَسَارُ الثَّانِي (7 دَقَائِقَ وَنِصْفٌ مِنْ رُوتِينِ 25 دَقِيقَةً المُتَكَامِلِ): (1) الوَعْيُ (دَقِيقَةٌ وَنِصْفٌ): دَوَرَانُ الجِذْعِ بِهُدُوءٍ يَمِينًا وَيَسَارًا. (2) الاسْتِطَالَةُ (دَقِيقَةٌ وَنِصْفٌ): تَمَدُّدُ الوَرِكِ المَائِلِ. (3) النُّمُوُّ العَضَلِيُّ: السُّكْوَاتُ الجَانِبِيُّ (10-15 عَدَّةً). (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَتَانِ): الرَّدُّ الفَوْرِيُّ عَلَى الإِشَارَاتِ الصَّوْتِيَّةِ. (5) التَّدَفُّقُ (يُؤَدَّى أَخِيرًا فَقَطْ): وَضْعِيَّةُ القُرْفُصَاءِ المُرِيحَةِ (دَقِيقَةٌ وَاحِدَةٌ).",
      "q1": {
        "q": "مَا تَمْرِينُ الوَعْيِ وَتَمْرِينُ الاسْتِطَالَةِ فِي الدَّرْسِ الخَامِسِ (المَسَارِ الثَّانِي)؟",
        "focusWord": "دَوَرَانُ الجِذْعِ وَتَمَدُّدُ الوَرِكِ",
        "options": [
          {
            "text": "دَوَرَانُ الجِذْعِ لِلْوَعْيِ، وَتَمَدُّدُ الوَرِكِ المَائِلِ لِلِاسْتِطَالَةِ (دَقِيقَةٌ وَنِصْفٌ لِكُلٍّ مِنْهُمَا)",
            "correct": true
          },
          {
            "text": "النَّوْمُ عَلَى الظَّهْرِ",
            "correct": false
          },
          {
            "text": "القَفْزُ عَلَى الحَبْلِ",
            "correct": false
          },
          {
            "text": "التَّعَلُّقُ عَلَى العَارِضَةِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَمْ عَدَّةً نُؤَدِّي فِي تَمْرِينِ (السُّكْوَاتِ الجَانِبِيِّ) لِلنُّمُوِّ العَضَلِيِّ فِي الدَّرْسِ الخَامِسِ؟",
        "focusWord": "السُّكْوَاتُ الجَانِبِيُّ",
        "options": [
          {
            "text": "مِنْ 10 إِلَى 15 عَدَّةً بِتَوَازُنٍ وَانْتِظَامٍ",
            "correct": true
          },
          {
            "text": "عَدَّةٌ وَاحِدَةٌ فَقَطْ",
            "correct": false
          },
          {
            "text": "100 عَدَّةٍ سَرِيعَةٍ",
            "correct": false
          },
          {
            "text": "بِدُونِ ثَنْيِ الرُّكْبَتَيْنِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا تَمْرِينُ التَّدَفُّقِ الخِتَامِيُّ فِي الدَّرْسِ الخَامِسِ؟",
        "focusWord": "وَضْعِيَّةُ القُرْفُصَاءِ المُرِيحَةِ",
        "options": [
          {
            "text": "وَضْعِيَّةُ القُرْفُصَاءِ المُرِيحَةِ لِمُدَّةِ دَقِيقَةٍ وَاحِدَةٍ",
            "correct": true
          },
          {
            "text": "الجَرْيُ السَّرِيعُ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ الضَّغْطِ",
            "correct": false
          },
          {
            "text": "رمْيُ الكُرَةِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ",
          "left": "دَوَرَانُ الجِذْعِ وَتَمَدُّدُ الوَرِكِ المَائِلِ"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ",
          "left": "السُّكْوَاتُ الجَانِبِيُّ (10-15 عَدَّةً)"
        },
        {
          "right": "الاسْتِجَابَةُ وَالتَّدَفُّقُ",
          "left": "الرَّدُّ عَلَى الإِشَارَاتِ الصَّوْتِيَّةِ ثُمَّ وَضْعِيَّةُ القُرْفُصَاءِ المُرِيحَةِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ الخَامِسِ (المَسَارِ الثَّانِي — 7 دَقَائِقَ وَنِصْفٌ):",
        "correct": [
          "دَوَرَانُ الجِذْعِ (دَقِيقَةٌ وَنِصْفٌ)",
          "تَمَدُّدُ الوَرِكِ المَائِلِ",
          "السُّكْوَاتُ الجَانِبِيُّ (10-15 عَدَّةً)",
          "الرَّدُّ عَلَى الإِشَارَاتِ الصَّوْتِيَّةِ وَالقُرْفُصَاءُ المُرِيحَةُ"
        ],
        "wrong": [
          "تَجَاهُلُ الإِشَارَاتِ الصَّوْتِيَّةِ",
          "أَدَاءُ التَّدَفُّقِ فِي البِدَايَةِ"
        ]
      },
      "applyStep": "أُطَبِّقُ الدَّرْسَ الخَامِسَ: دَوَرَانَ الجِذْعِ، تَمَدُّدَ الوَرِكِ المَائِلِ، السُّكْوَاتَ الجَانِبِيَّ، وَأَخْتَتِمُ بِوَضْعِيَّةِ القُرْفُصَاءِ المُرِيحَةِ."
    }
  },
  {
    "w": 17,
    "secNum": 5,
    "heavenName": "سَمَاءُ الأَرْبِعَاءِ الخَامِسَةُ (ف ص ق ر)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الخَامِسَةُ: عُلُومُ الفَلَكِ وَالفَضَاءِ وَالنِّظَامِ الشَّمْسِيِّ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "ف",
    "jummal": 80,
    "prophet": "يُوسُفُ (ع)",
    "virtue": "العَفْوُ",
    "unitHeader": "الوَحْدَةُ السَّابِعَةَ عَشْرَةَ الكَامِلَةُ: نَبِيُّ اللهِ يُوسُفُ الصِّدِّيقُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "حَفِظَ نَبِيُّ اللهِ يُوسُفُ (ع) خَزَائِنَ القَمْحِ فِي مِصْرَ بِالحِكْمَةِ، وَعِنْدَمَا جَاءَهُ إِخْوَتُهُ عَفَا عَنْهُمْ قَائِلًا: (لَا تَثْرِيبَ عَلَيْكُمُ اليَوْمَ يَغْفِرُ اللهُ لَكُمْ).",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الغَضَبُ وَالحَسَدُ مُقَابِلَ قُوَّةِ الدَّفْعِ الإِيمَانِيَّةِ وَالنُّورِ): نَارُ الحَسَدِ وَالغَضَبِ فِي قُلُوبِ إِخْوَةِ يُوسُفَ حِينَ أَلْقَوْهُ فِي الجُبِّ، وَنَارُ الهَوَى وَالغَضَبِ الَّتِي أَوْدَعَتْهُ السِّجْنَ ظُلْمًا، وَحَرَارَةُ السِّنِينَ السَّبْعِ العِجَافِ؛ وَفِي مُقَابِلِهَا قُوَّةُ «الدَّفْعِ» النُّورَانِيَّةُ فِي نَفْسِ يُوسُفَ الَّتِي صَرَفَ اللهُ بِهَا عَنْهُ السُّوءَ وَالفَحْشَاءَ، وَكَظْمُهُ الغَيْظَ وَدَفْعُهُ السَّيِّئَةَ بِالحَسَنَةِ عِنْدَ العَفْوِ عَنْ إِخْوَتِهِ، وَنُورُ الشَّمْسِ وَالقَمَرِ وَالكَوَاكِبِ السَّاجِدَةِ. B. الرِّيحُ (الوَهْمُ وَالكَذِبُ مُقَابِلَ رِيحِ القَمِيصِ الطَّيِّبَةِ): رِيحُ الوَهْمِ وَالكَذِبِ حِينَ جَاءَ إِخْوَتُهُ عَلَى قَمِيصِهِ بِدَمٍ كَذِبٍ وَادَّعَوْا أَنَّ الذِّئْبَ أَكَلَهُ، وَتُهْمَةُ السَّرِقَةِ البَاطِلَةُ؛ وَفِي مُقَابِلِهَا الرِّيحُ الطَّيِّبَةُ الَّتِي حَمَلَتْ عِطْرَ قَمِيصِ يُوسُفَ الجَنِّيِّ مِنْ مِصْرَ إِلَى كَنْعَانَ حَتَّى قَالَ يَعْقُوبُ: ﴿إِنِّي لَأَجِدُ رِيحَ يُوسُفَ﴾. C. التُّرَابُ (العَقْلُ وَالتَّفَكُّرُ وَالخَزَائِنُ): صَخْرَةُ قَعْرِ الجُبِّ الَّتِي جَلَسَ عَلَيْهَا يُوسُفُ، وَتَدْبِيرُهُ العَقْلِيُّ العَظِيمُ لِخَزَائِنِ الأَرْضِ وَزِرَاعَةِ التُّرْبَةِ سَبْعَ سِنِينَ دَأَبًا وَحِفْظِ القَمْحِ فِي سُنْبُلِهِ (﴿فَذَرُوهُ فِي سُنبُلِهِ﴾) لِحِمَايَتِهِ مِنَ التَّلَفِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): مَاءُ البِئْرِ الَّذِي أَدْلَى فِيهِ الوَارِدُ دَلْوَهُ، وَمَاءُ النِّيلِ وَالأَمْطَارِ فِي عَامِ الغَوْثِ (﴿فِيهِ يُغَاثُ النَّاسُ وَفِيهِ يَعْصِرُونَ﴾)، وَتَهْذِيبُ يُوسُفَ لِلشَّهْوَةِ بِالعِفَّةِ الكَامِلَةِ وَالزُّهْدِ فِي الطَّعَامِ حَتَّى لَا يَشْبَعَ وَفِي الرَّعِيَّةِ جَائِعٌ.",
    "storyParagraphs": [
      "فِي مَطْلَعِ فَلَكِ يَوْمِ الأَرْبِعَاءِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ سَبْعَةَ عَشَرَ فِي مَنْزِلَةِ النَّارِ الدَّافِعَةِ الَّتِي تَدْفَعُ نَارَ الحَسَدِ وَالغَضَبِ بِالعَفْوِ وَتَدْفَعُ السُّوءَ بِالعِفَّةِ وَالنُّورْ، وَهُوَ الصِّدِّيقُ الكَرِيمُ نَبِيُّ اللهِ يُوسُفْ. كَانَ فِي طُفُولَتِهِ قُرَّةَ عَيْنِ أَبِيهِ نَبِيِّ اللهِ يَعْقُوبَ عَلَيْهِمَا السَّلَامْ، وَفِي لَيْلَةٍ مُبَارَكَةٍ رَأَى فِي مَنَامِهِ أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالقَمَرَ سَاجِدِينَ لَهْ، فَقَالَ لَهُ أَبُوهُ يَا بُنَيَّ لَا تَقْصُصْ رُؤْيَاكَ عَلَى إِخْوَتِكَ فَيَكِيدُوا لَكَ كَيْدًا إِنَّ الشَّيْطَانَ لِلْإِنْسَانِ عَدُوٌّ مُبِينْ، وَكَذٰلِكَ يَجْتَبِيكَ رَبُّكَ وَيُعَلِّمُكَ مِنْ تَأْوِيلِ الأَحَادِيثِ وَيُتِمُّ نِعْمَتَهُ عَلَيْكَ وَعَلَى آلِ يَعْقُوبْ.",
      "وَاشْتَعَلَتْ نَارُ الحَسَدِ وَالغَضَبِ فِي قُلُوبِ إِخْوَتِهِ العَشَرَةِ فَأَخَذُوهُ مَعَهُمْ إِلَى البَرِّيَّةِ وَأَلْقَوْهُ فِي غَيَابَتِ الجُبِّ العَمِيقْ. فَنَزَلَ المَلَكُ جِبْرِيلُ بِأَمْرِ اللهِ فَأَجْلَسَهُ عَلَى صَخْرَةٍ فِي البِئْرِ وَآنَسَ وَحْشَتَهُ وَأَلْبَسَهُ قَمِيصَ جَدِّهِ إِبْرَاهِيمَ الخَلِيلِ الَّذِي نَزَلَ مِنَ الجَنَّةِ وَأَوْحَى اللهُ إِلَيْهِ لَتُنَبِّئَنَّهُمْ بِأَمْرِهِمْ هٰذَا وَهُمْ لَا يَشْعُرُونْ. وَرَجَعَ إِخْوَتُهُ عِشَاءً يَبْكُونَ بِرِيحِ الوَهْمِ وَجَاؤُوا عَلَى قَمِيصِهِ بِدَمٍ كَذِبٍ قَالُوا يَا أَبَانَا إِنَّا ذَهَبْنَا نَسْتَبِقُ وَتَرَكْنَا يُوسُفَ عِنْدَ مَتَاعِنَا فَأَكَلَهُ الذِّئْبْ! فَنَظَرَ يَعْقُوبُ بِعَقْلِهِ إِلَى القَمِيصِ السَّلِيمِ وَقَالَ مَا أَحْلَمَ هٰذَا الذِّئْبَ أَكَلَ ابْنِي وَلَمْ يَشُقَّ قَمِيصَهُ، بَلْ سَوَّلَتْ لَكُمْ أَنْفُسُكُمْ أَمْرًا فَصَبْرٌ جَمِيلٌ وَاللهُ المُسْتَعَانُ عَلَى مَا تَصِفُونْ.",
      "وَجَاءَتْ قَافِلَةٌ تَسِيرُ فِي الطَّرِيقِ فَأَرْسَلُوا وَارِدَهُمْ فَأَدْلَى دَلْوَهُ فِي مَاءِ البِئْرِ فَتَعَلَّقَ بِهَا الغُلَامُ المُنِيرُ فَقَالَ يَا بُشْرَى هٰذَا غُلَامْ، وَبَاعُوهُ فِي مِصْرَ بِثَمَنٍ بَخْسٍ دَرَاهِمَ مَعْدُودَةٍ مِنْ فِضَّةٍ قَلِيلَةْ. فَاشْتَرَاهُ عَزِيزُ مِصْرَ وَقَالَ لِامْرَأَتِهِ أَكْرِمِي مَثْوَاهْ، وَلَمَّا بَلَغَ الفَتَى أَشُدَّهُ آتَاهُ اللهُ حُكْمًا وَعِلْمًا وَجَمَالًا يَفُوقُ ضَوْءَ البَدْرْ. وَحَاوَلَتِ امْرَأَةُ العَزِيزِ أَنْ تَدْعُوَهُ إِلَى المَعْصِيَةِ فَقَالَ بِعِفَّةٍ وَطَهَارَةٍ مَعَاذَ اللهِ إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ إِنَّهُ لَا يُفْلِحُ الظَّالِمُونْ، وَاسْتَبَقَا البَابَ فَقُدَّ قَمِيصُهُ مِنْ دُبُرٍ، وَهٰكَذَا دَفَعَ اللهُ وَصَرَفَ عَنْهُ السُّوءَ وَالفَحْشَاءَ إِنَّهُ مِنْ عِبَادِنَا المُخْلَصِينْ. وَأَنْطَقَ اللهُ طِفْلًا رَضِيعًا فِي المَهْدِ مِنْ أَهْلِهَا شَهِدَ بِبَرَاءَتِهِ لِأَنَّ قَمِيصَهُ شُقَّ مِنْ خَلْفِهْ، وَقَالَ يُوسُفُ رَبِّ السِّجْنُ أَحَبُّ إِلَيَّ مِمَّا يَدْعُونَنِي إِلَيْهِ لِأَنَّ المِؤْمِنَ الصَّادِقَ يَكُفُّ عَنِ الحَرَامِ وَيَحْفَظُ طَاعَةَ رَبِّهْ.",
      "دَخَلَ يُوسُفُ السِّجْنَ مَظْلُومًا فَصَبَرَ وَدَعَا السَّجِينَيْنِ إِلَى تَوْحِيدِ اللهِ الوَاحِدِ القَهَّارْ، وَفَسَّرَ رُؤْيَاهُمَا بِالعِلْمِ الَّذِي عَلَّمَهُ رَبُّهْ، وَبَقِيَ فِي السِّجْنِ بِضْعَ سِنِينَ يُسَبِّحُ اللهَ حَتَّى نَزَلَ جِبْرِيلُ وَعَلَّمَهُ الدُّعَاءَ بِحَقِّ مُحَمَّدٍ وَآلِهِ الأَطْهَارِ فَـخَفَّفَ اللهُ عَنْهُ البَلَاءَ وَجَاءَهُ الفَرَجُ القَرِيبْ. فَقَدْ رَأَى مَلِكُ مِصْرَ فِي مَنَامِهِ سَبْعَ بَقَرَاتٍ سِمَانٍ يَأْكُلُهُنَّ سَبْعٌ عِجَافٌ وَسَبْعَ سُنْبُلَاتٍ خُضْرٍ وَأُخَرَ يَابِسَاتْ، فَفَسَّرَهَا يُوسُفُ بِتَدْبِيرٍ عَقْلِيٍّ بَاهِرٍ أَنْ يَزْرَعُوا سَبْعَ سِنِينَ دَأَبًا وَيَتْرُكُوا الحَبَّ فِي سُنْبُلِهِ لِئَلَّا يَفْسُدَ فَيَأْكُلُوا مِنْهُ فِي السَّبْعِ الشِّدَادِ ثُمَّ يَأْتِيَ عَامٌ فِيهِ يُغَاثُ النَّاسُ بِالمَطَرِ وَفِيهِ يَعْصِرُونَ الثِّمَارْ. وَرَفَضَ الخُرُوجَ مِنَ السِّجْنِ حَتَّى ظَهَرَتْ بَرَاءَتُهُ أَمَامَ المَلِكِ وَالنَّاسِ وَشَهِدَتِ امْرَأَةُ العَزِيزِ أَنَّهُ مِنَ الصَّادِقِينْ، وَقَالَ وَمَا أُبَرِّئُ نَفْسِي إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي إِنَّ رَبِّي غَفُورٌ رَحِيمْ.",
      "أَكْرَمَ المَلِكُ يُوسُفَ وَقَالَ إِنَّكَ اليَوْمَ لَدَيْنَا مَكِينٌ أَمِينْ، قَالَ اجْعَلْنِي عَلَى خَزَائِنِ الأَرْضِ إِنِّي حَفِيظٌ عَلِيمْ. فَـنَفَعَ اللهُ بِعِلْمِهِ وَأَمَانَتِهِ أَهْلَ مِصْرَ وَالشَّامِ جَمِيعًا، وَكَانَ لَا يَشْبَعُ فِي أَيَّامِ القَحْطِ حَتَّى لَا يَنْسَى الجِيَاعْ. وَجَاءَ إِخْوَةُ يُوسُفَ يَطْلُبُونَ الكَيْلَ فَعَرَفَهُمْ وَهُمْ لَهُ مُنْكِرُونْ، فَأَكْرَمَهُمْ لِأَنَّهُ كَانَ يُوَفِّي الكَيْلَ بِالعَدْلِ، وَطَلَبَ مِنْهُمْ أَنْ يَأْتُوا بِأَخِيهِ بِنْيَامِينَ فَلَمَّا جَاؤُوا بِهِ أَسَرَّ إِلَيْهِ أَنِّي أَنَا أَخُوكَ فَلَا تَبْتَئِسْ، وَجَعَلَ السِّقَايَةَ فِي رَحْلِ أَخِيهِ لِيَبْقَى عِنْدَهُ فِي أَمَانْ.",
      "وَلَمَّا عَادَ إِخْوَتُهُ فِي المَرَّةِ الثَّالِثَةِ وَشَكَوُا الضُّرَّ وَالفَقْرَ رَقَّ فُؤَادُ يُوسُفَ لَهُمْ وَقَالَ هَلْ عَلِمْتُمْ مَا فَعَلْتُمْ بِيُوسُفَ وَأَخِيهِ إِذْ أَنْتُمْ جَاهِلُونْ؟ قَالُوا أَإِنَّكَ لَأَنْتَ يُوسُفْ؟ قَالَ أَنَا يُوسُفُ وَهٰذَا أَخِي قَدْ مَنَّ اللهُ عَلَيْنَا إِنَّهُ مَنْ يَتَّقِ وَيَصْبِرْ فَإِنَّ اللهَ لَا يُضِيعُ أَجْرَ المُحْسِنِينْ. فَاعْتَذَرُوا إِلَيْهِ فَكَبَتَ الغَضَبَ وَعَفَا عَنْهُمْ فَوْرًا وَقَالَ لَا تَثْرِيبَ عَلَيْكُمُ اليَوْمَ يَغْفِرُ اللهُ لَكُمْ، وَأَرْسَلَ مَعَهُمْ قَمِيصَهُ المُبَارَكَ فَلَمَّا فَصَلَتِ العِيرُ شَمَّ يَعْقُوبُ عِطْرَهُ مَعَ الهَوَاءِ، فَلَمَّا أَلْقَوُا القَمِيصَ عَلَى وَجْهِ يَعْقُوبَ ارْتَدَّ بَصِيرًا فَفَرِحَ آلُ يَعْقُوبَ وَدَخَلُوا مِصْرَ آمِنِينْ. وَاستَقْبَلَهُمْ يُوسُفُ بِالبِرِّ وَالتَّوَاضُعِ وَرَفَعَ أَبَوَيْهِ عَلَى العَرْشِ وَخَرُّوا لِلهِ سُجَّدًا شَاكِرِينْ، وَقَالَ يَا أَبَتِ هٰذَا تَأْوِيلُ رُؤْيَايَ مِنْ قَبْلُ قَدْ جَعَلَهَا رَبِّي حَقًّا إِنَّ رَبِّي لَطِيفٌ لِمَا يَشَاءُ إِنَّهُ هُوَ العَلِيمُ الحَكِيمْ، رَبِّ قَدْ آتَيْتَنِي مِنَ المُلْكِ وَعَلَّمْتَنِي مِنْ تَأْوِيلِ الأَحَادِيثِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالآخِرَةِ تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينْ."
    ],
    "words": [
      {
        "word": "نَفْسِي",
        "desc": "وسط متصل / ساكن: ـفْـ",
        "raw": "نَفْسِي (وسط متصل / ساكن: ـفْـ)"
      },
      {
        "word": "يُوسُفْ",
        "desc": "آخر متصل / ساكن وقفا: ـفْ",
        "raw": "يُوسُفْ (آخر متصل / ساكن وقفا: ـفْ)"
      },
      {
        "word": "فَصَبْرٌ",
        "desc": "أول منفصل / متحرك بالفتح: فَـ",
        "raw": "فَصَبْرٌ (أول منفصل / متحرك بالفتح: فَـ)"
      },
      {
        "word": "فَفَرِحَ",
        "desc": "أول متصل / متحرك بالفتح: ـفَـ",
        "raw": "فَفَرِحَ (أول متصل / متحرك بالفتح: ـفَـ)"
      },
      {
        "word": "نَفَعَ",
        "desc": "وسط متصل / متحرك بالفتح: ـفَـ",
        "raw": "نَفَعَ (وسط متصل / متحرك بالفتح: ـفَـ)"
      },
      {
        "word": "دَفَعَ",
        "desc": "وسط منفصل / متحرك بالفتح: فَـ",
        "raw": "دَفَعَ (وسط منفصل / متحرك بالفتح: فَـ)"
      },
      {
        "word": "صَرَفَ",
        "desc": "آخر متصل / متحرك بالفتح: ـفَ",
        "raw": "صَرَفَ (آخر متصل / متحرك بالفتح: ـفَ)"
      },
      {
        "word": "فُؤَادُ",
        "desc": "أول منفصل / متحرك بالضم: فُـ",
        "raw": "فُؤَادُ (أول منفصل / متحرك بالضم: فُـ)"
      },
      {
        "word": "لَطِيفٌ",
        "desc": "آخر متصل / متحرك بالضم: ـفٌ",
        "raw": "لَطِيفٌ (آخر متصل / متحرك بالضم: ـفٌ)"
      },
      {
        "word": "فِضَّةٍ",
        "desc": "أول منفصل / متحرك بالكسر: فِـ",
        "raw": "فِضَّةٍ (أول منفصل / متحرك بالكسر: فِـ)"
      },
      {
        "word": "خَفَّفَ",
        "desc": "وسط متصل / مضعف بالفتح: ـفَّـ",
        "raw": "خَفَّفَ (وسط متصل / مضعف بالفتح: ـفَّـ)"
      },
      {
        "word": "يَكُفُّ",
        "desc": "آخر متصل / مضعف بالضم: ـفُّ",
        "raw": "يَكُفُّ (آخر متصل / مضعف بالضم: ـفُّ)"
      },
      {
        "word": "يُوَفِّي",
        "desc": "وسط متصل / مضعف بالكسر: ـفِّـ",
        "raw": "يُوَفِّي (وسط متصل / مضعف بالكسر: ـفِّـ)"
      },
      {
        "word": "فَاطِرَ",
        "desc": "أول منفصل / ممدود بالألف: فَا",
        "raw": "فَاطِرَ (أول منفصل / ممدود بالألف: فَا)"
      },
      {
        "word": "غَفُورٌ",
        "desc": "وسط متصل / ممدود بالواو: ـفُو",
        "raw": "غَفُورٌ (وسط متصل / ممدود بالواو: ـفُو)"
      },
      {
        "word": "حَفِيظٌ",
        "desc": "وسط متصل / ممدود بالياء: ـفِي",
        "raw": "حَفِيظٌ (وسط متصل / ممدود بالياء: ـفِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الفَاءِ (ف): النُّطْقُ السَّلِيمُ لِحَرْفِ الفَاءِ المَهْمُوسِ مِنْ مَخْرَجِ بَاطِنِ الشَّفَةِ السُّفْلَى مَعَ أَطْرَافِ الثَّنَايَا العُلْيَا، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى كَلِمَةِ العِفَّةِ ﴿مَعَاذَ اللَّهِ﴾، وَكَلِمَةِ العَفْوِ وَالتَّسَامُحِ: ﴿لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ يَغْفِرُ اللَّهُ لَكُمْ وَهُوَ أَرْحَمُ الرَّاحِمِينَ﴾، وَحِفْظِ اللِّسَانِ عَنِ الكَذِبِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الحَلْقَةُ المُسْتَدِيرَةُ وَالنُّقْطَةُ العُلْيَا وَالفَلَكُ الشَّمْسِيُّ وَالرَّقْمُ (17): مُشَاهَدَةُ شَكْلِ حَرْفِ الفَاءِ (ف) المُرَكَّبِ مِنْ رَأْسٍ دَائِرِيٍّ كَفُوَّهَةِ البِئْرِ يَمْتَدُّ فِي صَحْنٍ مُنْبَسِطٍ وَفَوْقَهُ نُقْطَةٌ مُضِيئَةٌ كَكَوْكَبٍ فِي السَّمَاءِ، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (17) (مَجْمُوعِ رَكَعَاتِ الفَرَائِضِ اليَوْمِيَّةِ السَّبْعَ عَشْرَةَ)، وَرُؤْيَةِ النِّظَامِ الفَلَكِيِّ (الشَّمْسِ وَالقَمَرِ وَالأَحَدَ عَشَرَ كَوْكَبًا)، وَمُعْجِزَةِ ارْتِدَادِ البَصَرِ إِلَى عَيْنَيْ يَعْقُوبَ عِنْدَ إِلْقَاءِ قَمِيصِ يُوسُفَ عَلَى وَجْهِهِ."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "أَحْسَنُ القَصَصِ وَتَأْوِيلُ الأَحَادِيثِ: الاسْتِمَاعُ الوَاعِي لِـ«أَحْسَنِ القَصَصِ» فِي سِيرَةِ نَبِيِّ اللهِ يُوسُفَ الكَامِلَةِ، وَتَدْرِيبُ الأُذُنِ عَلَى حُسْنِ الإِصْغَاءِ لِشَكْوَى المَظْلُومِينَ وَالمَسْجُونِينَ وَالمُحْتَاجِينَ وَفَهْمِ مَعَانِي الكَلَامِ (﴿وَعَلَّمْتَنِي مِن تَأْوِيلِ الْأَحَادِيثِ﴾)، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ سَبْعَةَ عَشَرَ (17) وَالثَّمَانُونَ (80) وَالحِسَابُ الاقْتِصَادِيُّ: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (17) وَمَعْرِفَةِ قِيمَةِ الفَاءِ العَشْرِيَّةِ (80 = ثَمَانِي عَشَرَاتٍ)، وَحِسَابِ السَّبْعِ السِّنِينَ الخِصْبَةِ وَالسَّبْعِ العِجَافِ وَعَامِ الغَوْثِ (7 + 7 + 1 = 15 عَامًا)، وَتَدْرِيبُ اليَدِ عَلَى الكَيْلِ العَادِلِ بِالصُّوَاعِ، وَحِفْظِ الحُبُوبِ دَاخِلَ السَّنَابِلِ، وَرَسْمِ حَرْفِ الفَاءِ بِأَشْكَالِهِ (فـ / ـفـ / ـف / ف)."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السِّبَاقِ وَالجَرْيِ السَّرِيعِ هَرَبًا مِنَ السُّوءِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ العَدْوِ وَالمُسَابَقَةِ النَّافِعَةِ (﴿إِنَّا ذَهَبْنَا نَسْتَبِقُ﴾)، وَسُرْعَةِ الجَرْيِ لِدَفْعِ الأَذَى وَالفِرَارِ مِنْ مَوَاطِنِ المَعْصِيَةِ كَمَا اسْتَبَقَ يُوسُفُ إِلَى البَابِ (﴿وَاسْتَبَقَا الْبَابَ﴾) حِفْظًا لِطَاعَةِ رَبِّهِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ تَخْزِينِ الحُبُوبِ فِي السَّنَابِلِ وَآدَابُ التَّقَشُّفِ عِنْدَ الأَزَمَاتِ: تَعَلُّمُ الاكْتِشَافِ العِلْمِيِّ القُرْآنِيِّ فِي حِفْظِ القَمْحِ وَالشَّعِيرِ دَاخِلَ قِشْرِ السُّنْبُلَةِ (﴿فَذَرُوهُ فِي سُنبُلِهِ﴾) لِحِمَايَتِهِ مِنَ السُّوسِ وَالرُّطُوبَةِ سَبْعَ سِنِينَ، وَعُلُومِ عَصْرِ الثِّمَارِ النَّافِعَةِ كَالزَّيْتُونِ وَالعِنَبِ وَالسِّمْسِمِ، وَالتَّأَسِّي بِيُوسُفَ الَّذِي كَانَ يَجُوعُ أَيَّامَ القَحْطِ وَهُوَ عَلَى خَزَائِنِ الأَرْضِ قَائِلًا: «أَخَافُ إِنْ شَبِعْتُ أَنْ أَنْسَى الجِيَاعَ!»."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ العِفَّةِ الكُبْرَى وَحِفْظِ القَمِيصِ وَالصَّفْحِ الجَمِيلِ: تَعَلُّمُ خُلُقِ العِفَّةِ التَّامَّةِ وَتَحْصِينِ النَّفْسِ فِي السِّرِّ وَالعَلَنِ (إِذْ إِنَّ مَوْضِعَ يُوسُفَ هُوَ قِمَّةُ العِفَّةِ وَالنَّزَاهَةِ)، وَكَظْمِ الغَيْظِ وَالعَفْوِ عِنْدَ المَقْدِرَةِ، وَإِكْرَامِ الوَالِدَيْنِ وَرَفْعِهِمَا فِي أَعْلَى مَقَامٍ."
      }
    },
    "grammar": {
      "topic": "تَكَامُلُ أَرْكَانِ الجُمْلَةِ الفِعْلِيَّةِ: (فِعْلٌ + فَاعِلٌ + مَفْعُولٌ بِهِ)",
      "rule": "تَتَكَامَلُ الجُمْلَةُ الفِعْلِيَّةُ بِفِعْلٍ فِي البِدَايَةِ، يَلِيهِ فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ، ثُمَّ مَفْعُولٌ بِهِ مَنْصُوبٌ بِالفَتْحَةِ.",
      "example": "حَفِظَ (فِعْلٌ) يُوسُفُ (فَاعِلٌ) القَمْحَ (مَفْعُولٌ بِهِ).",
      "focusWord": "حَفِظَ يُوسُفُ القَمْحَ",
      "q": "مَا هُوَ تَرْتِيبُ أَرْكَانِ جُمْلَةِ «فَتَحَ التِّلْمِيذُ الكِتَابَ»؟",
      "opts": [
        "فِعْلٌ + فَاعِلٌ + مَفْعُولٌ بِهِ",
        "مُبْتَدَأٌ + خَبَرٌ",
        "حَرْفُ جَرٍّ + اسْمٌ مَجْرُورٌ",
        "اسْمٌ + حَرْفٌ"
      ]
    },
    "earIirab": {
      "topic": "المُقَارَنَةُ السَّمْعِيَّةُ بَيْنَ ضَمَّةِ الفَاعِلِ وَفَتْحَةِ المَفْعُولِ بِهْ",
      "rule": "الفَاعِلُ مَرْفُوعٌ دَائِمًا بـ (ـُ)، وَالمَفْعُولُ بِهِ مَنْصُوبٌ دَائِمًا بـ (ـَ).",
      "sentence": "فَحَصَ الطَّبِيبُ المَرِيضَ.",
      "targetWord": "المَرِيضَ",
      "caseAns": "مَفْعُولٌ بِهِ مَنْصُوبٌ بِالفَتْحَةِ (ـَ)"
    },
    "math": {
      "numVal": 87,
      "numName": "سَبْعَةٌ وَثَمَانُونَ",
      "eqDisplay": "7 + 80 = 87",
      "subDisplay": "87 - 7 = 80",
      "compDisplay": "87 > 78",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (87) بِالعَرَبِيَّةِ؟",
        "focus": "87",
        "ans": "سَبْعَةٌ وَثَمَانُونَ",
        "wrong": [
          "ثَمَانِيَةٌ وَسَبْعُونَ",
          "ثَمَانُونَ",
          "سَبْعَةٌ وَتِسْعُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ تَرْكِيبَ الآحَادِ وَالعَشَرَاتِ:",
        "focus": "7 + 80 = ؟",
        "ans": "87 (سَبْعَةٌ وَثَمَانُونَ)",
        "wrong": [
          "78",
          "80",
          "90"
        ]
      }
    },
    "sport": {
      "title": "جِلْسَةُ الفَرَاشَةِ المَرِنَةُ مَعَ التَّنَفُّسِ",
      "middleText": "أَجْلِسُ بِظَهْرٍ مُسْتَقِيمٍ وَأَضُمُّ بَاطِنَ قَدَمَيَّ مَعًا ثُمَّ أُحَرِّكُ رُكْبَتَيَّ بِلُطْفٍ كَجَنَاحَيِ الفَرَاشَةْ. يُكْسِبُ هٰذَا التَّمْرِينُ مَفَاصِلَ الحَوْضِ وَالسَّاقَيْنِ مَرَانَةً وَرَاحَةً."
    },
    "sci": {
      "title": "الكَوْنُ الفَسِيحُ: المَجَرَّاتُ وَالنُّجُومُ وَالسُّدُمُ",
      "summaryThird": "يَضُمُّ الكَوْنُ الفَسِيحُ مِلْيَارَاتِ المَجَرَّاتِ، وَتَقَعُ مَجْمُوعَتُنَا الشَّمْسِيَّةُ فِي مَجَرَّةِ دَرْبِ التَّبَّانَةِ، وَتُولَدُ النُّجُومُ المُنِيرَةُ دَاخِلَ سُحُبٍ كَوْنِيَّةٍ تُسَمَّى السُّدُمْ.",
      "focusConcept": "مَجَرَّةُ دَرْبِ التَّبَّانَةِ",
      "factAns": "المَجَرَّةُ الَّتِي تَضُمُّ شَمْسَنَا وَكَوْكَبَ الأَرْضْ"
    },
    "rightsSummary": {
      "title": "حَقُّ المُتَعَلِّمِ وَطَالِبِ العِلْمِ (حُور وَسُرُور - 17)",
      "storySentence": "شَرَحَتْ حُورُ لِأَخِيهَا الصَّغِيرِ دَرْسَ الحُرُوفِ بِرِفْقٍ وَصَبْرٍ، لِأَنَّ مِنْ حَقِّ المُتَعَلِّمِ أَنْ نُعَلِّمَهُ بِلُطْفٍ وَتَبْسِيطٍ وَتَشْجِيعْ.",
      "applyAction": "أُسَاعِدُ إِخْوَتِي وَأَصْدِقَائِي فِي التَّعَلُّمِ بِكُلِّ لُطْفٍ وَتَوَاضُعْ."
    },
    "rightsFullTitle": "(22) حق الأم + (23) حق الأب",
    "rightsQuote": "فَحَقُّ أُمِّكَ، فَـــــــــأَنْ تَعْلَمَ أَنَّهَا حَمَلَتكَ حَيْثُ لا يَحْمِلُ أَحَدٌ أَحَدًا وَأَطْعَمَتكَ مِنْ ثَمَرَةِ قَلْبها مَا لا يُطْعِمُ أَحَدٌ أَحَدًا، وَأَنَّهَا وَقَتكَ بسَمْعِهَـــــــا وبَصَرِهَــــــا ويَدِهَــــا وَرِجْلهـــــا وَشَعْرِهَا وبَشَرِهَا وَجَمِيعِ جَوَارِحِهَـــــا مُسْتَبشِرَةً بذَلِكَ، فَرِحَـــــــــــةً مُوَابلَةً (1)، مُحْتَمِلَةً لِمَـــــــــا فِيهِ مَكْرُوهُهــا وأَلَمُهـــا وثِقْلُهـــا وَغَمُّهَا حَتَّى دَفَعَتهَا عَنْكَ يَدُ الـــــــــــــقُدْرَةِ وَأَخرَجَتكَ إلَى الأَرضِ فَرَضِيَتْ أَنْ تَشْبَــــــعَ وتجــــــــــــُوعُ هِيَ، وَتَكْسُوكَ وَتعْرَى، وَتُرْوِيكَ وَتَظْمَـــــــــأُ، وَتُظِلُّكَ وتَضْحَى، وَتُنَعِّمَـــــــكَ ببُؤْسِهَـــــــــــــــا، وَتُلَذِّذُكَ بالنَّوْمِ بأَرَقِهَا، وَكَانَ بَطْنُهَــــــا لَكَ وِعَاءً، وَحِجْرُهَـــا لَكَ حِوَاءً ، وثَدْيُهَا لَكَ سِقَاءً، ونَفْسُهَـــا لَكَ وِقَــــــــــــاءً، تُبَاشِرُ حَرَّ الدُّنيَا وبَرْدِهَـــــــــــــــــــا لَكَ وَدُونَكَ، فَتَشْكُرَهَا عَلَى قَدْرِ ذَلِكَ وَلا تَقْدِرُ عَلَيْهِ إلاّ بعَونِ اللَّهِ وَتَوفِيقِهِ. | وَأمَّا حَقُّ أَبيكَ فَتَعْلَــــــــــمَ أنَّهُ أَصْلُكَ، وَأنَّكَ فَرْعُــــــهُ، وَأَنَّكَ لَوْلاهُ لَمْ تَكُنْ. فَمَهْمَــــــــــا رَأيْتَ فِي نفْسِكَ مِمَّا يُعْجِبُكَ فَاعْلَمْ أَنَّ أَبَاكَ أَصْلُ النِّعْمَةِ عَلَيْكَ فِيهِ وَاحْمَــــــــــــــــــدِ اللَّهَ وَاشْكُرْهُ عَلَى قَدْرِ ذَلِكَ وَلا قُوَّةَ إلاّ باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (22) حق الأم + (23) حق الأب",
        "text": "فَحَقُّ أُمِّكَ، فَـــــــــأَنْ تَعْلَمَ أَنَّهَا حَمَلَتكَ حَيْثُ لا يَحْمِلُ أَحَدٌ أَحَدًا وَأَطْعَمَتكَ مِنْ ثَمَرَةِ قَلْبها مَا لا يُطْعِمُ أَحَدٌ أَحَدًا، وَأَنَّهَا وَقَتكَ بسَمْعِهَـــــــا وبَصَرِهَــــــا ويَدِهَــــا وَرِجْلهـــــا وَشَعْرِهَا وبَشَرِهَا وَجَمِيعِ جَوَارِحِهَـــــا مُسْتَبشِرَةً بذَلِكَ، فَرِحَـــــــــــةً مُوَابلَةً (1)، مُحْتَمِلَةً لِمَـــــــــا فِيهِ مَكْرُوهُهــا وأَلَمُهـــا وثِقْلُهـــا وَغَمُّهَا حَتَّى دَفَعَتهَا عَنْكَ يَدُ الـــــــــــــقُدْرَةِ وَأَخرَجَتكَ إلَى الأَرضِ فَرَضِيَتْ أَنْ تَشْبَــــــعَ وتجــــــــــــُوعُ هِيَ، وَتَكْسُوكَ وَتعْرَى، وَتُرْوِيكَ وَتَظْمَـــــــــأُ، وَتُظِلُّكَ وتَضْحَى، وَتُنَعِّمَـــــــكَ ببُؤْسِهَـــــــــــــــا، وَتُلَذِّذُكَ بالنَّوْمِ بأَرَقِهَا، وَكَانَ بَطْنُهَــــــا لَكَ وِعَاءً، وَحِجْرُهَـــا لَكَ حِوَاءً ، وثَدْيُهَا لَكَ سِقَاءً، ونَفْسُهَـــا لَكَ وِقَــــــــــــاءً، تُبَاشِرُ حَرَّ الدُّنيَا وبَرْدِهَـــــــــــــــــــا لَكَ وَدُونَكَ، فَتَشْكُرَهَا عَلَى قَدْرِ ذَلِكَ وَلا تَقْدِرُ عَلَيْهِ إلاّ بعَونِ اللَّهِ وَتَوفِيقِهِ. | وَأمَّا حَقُّ أَبيكَ فَتَعْلَــــــــــمَ أنَّهُ أَصْلُكَ، وَأنَّكَ فَرْعُــــــهُ، وَأَنَّكَ لَوْلاهُ لَمْ تَكُنْ. فَمَهْمَــــــــــا رَأيْتَ فِي نفْسِكَ مِمَّا يُعْجِبُكَ فَاعْلَمْ أَنَّ أَبَاكَ أَصْلُ النِّعْمَةِ عَلَيْكَ فِيهِ وَاحْمَــــــــــــــــــدِ اللَّهَ وَاشْكُرْهُ عَلَى قَدْرِ ذَلِكَ وَلا قُوَّةَ إلاّ باللهِ. — وَفِي سِيرَةِ يُوسُفُ (ع): آدَابُ العِفَّةِ الكُبْرَى وَحِفْظِ القَمِيصِ وَالصَّفْحِ الجَمِيلِ: تَعَلُّمُ خُلُقِ العِفَّةِ التَّامَّةِ وَتَحْصِينِ النَّفْسِ فِي السِّرِّ وَالعَلَنِ (إِذْ إِنَّ مَوْضِعَ يُوسُفَ هُوَ قِمَّةُ العِفَّةِ وَالنَّزَاهَةِ)، وَكَظْمِ الغَيْظِ وَالعَفْوِ عِنْدَ المَقْدِرَةِ، وَإِكْرَامِ الوَالِدَيْنِ وَرَفْعِهِمَا فِي أَعْلَى مَقَامٍ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الأم",
        "text": "في صباح يوم مشمس، قالت الأم لطفليها: \"سأذهب لزيارة جدتكم لبعض الوقت، الطعام جاهز، السرير مجهز، وبعض الألعاب أيضاً. ضعوا قانونًا: لا تخرجوا من المنزل، وإذا احتجتم شيئًا فاتصلوا بي.\" ابتسم نور وقال: \"حسنًا يا أمي، سنهتم بأختنا الصغيرة!\" وأومأت حور بحماس: \"لن ندعها تشعر بالوحدة!\" 1️⃣ التذكير بالأصل والفضل بدأت حور بإطعام أختها الصغيرة، فقالت وهي تضحك: \"انظري، أمي كانت دائمًا تطعمنا حتى عندما كانت متعبة… ونحن اليوم سنتذكر ذلك!\" ضحكت الطفلة الصغيرة وأخذت قطعة خبز بيديها الصغيرة. 2️⃣ التضحيات الجسدية نور جمع الألعاب المبعثرة ورتبها، قائلاً: \"لن نترك هذه الفوضى! كما كانت أمي تنقل كل شيء لنا عندما كنا صغاراً.\" حور ساعدته في حمل الوسائد الصغيرة لوضعها بجانب السرير. 3️⃣ تحمل المشقة برضى بدأت الطفلة الصغيرة بالبكاء لأنها أرادت لعبة محددة، فهدأتها حور: \"صغيرتي، سنأخذ اللعبة بعد قليل، اصبري… أمي كانت تفعل معنا نفس الشيء.\" نور أضاف بابتسامة: \"الصبر مفتاح الراحة!\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الأم",
        "text": "4️⃣ تفانيها بعد الولادة حرص نور على أن تشرب الطفلة الحليب في الوقت المحدد، قائلاً: \"لن ننسى هذا، تمامًا كما كانت أمي تفعل بعد ولادتنا… كانت تسهر لتطعمنا.\" 5️⃣ وقايتها لهم بنفسها حور رتبت الألعاب في أماكن آمنة، ومنعت الطفلة من الاقتراب من الطاولة العالية، وقالت: \"لا تقلقي، لن تضرّي نفسك… مثلما كانت أمي تحمينا من كل شيء خطير.\" 6️⃣ خدمتها الدائمة رغم تعب الدنيا حتى بعد ساعة من غياب الأم، استمر نور وحور في الاهتمام بالطفلة الصغيرة، وغسلوا الصحون بعد الفطور، ورتبوا الغرفة، بينما قال نور: \"أتمنى أن نشعر الأم بالسعادة عندما تعود.\" حور أومأت وقالت: \"هذا أقل شيء يمكننا فعله بعد كل ما فعلته لأجلنا.\" 7️⃣ وجوب الشكر والعجز عن مكافأتها عندما عادت الأم، وجدت الأطفال قد اعتنوا بالطفلة والبيت مرتب: \"أبهرتماني اليوم، لكن لا شيء يعادل ما بذلته لأجلكم منذ ولادتكم!\" ابتسم نور وحور وقالا: \"نحن نشكرك يا أمي، لكننا نعلم أننا لن نتمكن أبدًا من رد كل جميلك.\" ضحكت الأم وعانقتهم: \"الله يبارك فيكم… أشعر بالراحة لأنكم تعلمتم أن تعتنوا بالآخرين كما اهتممت بكم.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الأب",
        "text": "🌳 حور ونور وظلّ الأب عاد الأب مع غروب الشمس، كتفاه منحنيان وكأنهما يحملان جبلاً من التعب. أسرعت حور لفتح الباب، فيما هرع نور إلى المطبخ: \"سأحضر لك عصيرًا باردًا يا أبي!\" جلس الأب على الأريكة، وأسلم رأسه إلى وسادتها كما يسلم الجندي سلاحه بعد معركة. حملقت حور في يديه المتقرحتين، وفجأة... انحنت وقبلت يده اليمنى في صمت. رفع الأب رأسه مبتسمًا: \"ما هذا يا حوراء؟\" فأجابت بدموع تلمع في عينيها: \"أشكرها لأنها تبني عالمي.\" في تلك اللحظة، عاد نور بالعصير، ثم أضاف: \"انتظر! سأعود!\" وعاد بعد قليل بمنشفة دافئة يمسح بها قدمي أبيه. قال الأب بصوت مخنوق: \"لماذا كل هذا الاهتمام اليوم؟\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الأب",
        "text": "أجاب نور: \"لأن المعلمة قالت اليوم: إذا أردتم أن تعرفوا معنى العطاء، فانظروا إلى يد أبيكم عند العودة.\" أومأت حور: \"كنت أظن أن الأب مجرد شخص يعمل... لكنني اليوم رأيت في عينيك أنك تحمل أحلامنا على كتفيك.\" قامت الأم من المطبخ تحمل الطبق، وقالت بدموع: \"هذا هو أجمل درس في البر رأيته في حياتي.\" ضحك الأب ضحكة خفيفة: \"الحقيقة... كنت متعبًا جدًا، لكنكم جعلتموني أشعر أن تعبي له طعم، وله قيمة.\" قال نور وهو يعانقه: \"لا، بل أنت من تعلمنا أن افضل  شيء في الدنيا هو أن يكون للإنسان أبٌ يستحق كل هذا الحب.\" اللمسة الأخيرة: وفي الصباح، وجد الأب في حقيبة عمله رسالة صغيرة: \"شكرًا لأنك تترك بصمتك على العالم كل يوم... من أجلنا.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الخَامِسَةُ: الفَلَكُ وَالكَوْنُ",
      "topic": "الدَّرْسُ (1): الكَوْنُ وَالمَجَرَّاتُ وَالنُّجُومُ (الكَوْنُ الشَّاسِعُ، دَرْبُ التَّبَّانَةِ، دَوْرَةُ حَيَاةِ النُّجُومِ، وَالرَّصْدُ الفَلَكِيُّ)",
      "coverImg": "assets/y7/scince/s17.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s17.1.jpg",
          "text": "الدَّرْسُ (1) الكَوْنُ وَالمَجَرَّاتُ وَالنُّجُومُ: (1) الكَوْنُ الشَّاسِعُ وَالتَّمَدُّدُ: بَدَأَ الكَوْنُ مُنْذُ مِلْيَارَاتِ السِّنِينَ وَتَتَبَاعَدُ المَجَرَّاتُ فِيهِ بِاسْتِمْرَارٍ، وَيَتَكَوَّنُ مِنْ مَجَرَّاتٍ وَنُجُومٍ وَسُدُمٍ. (2) المَجَرَّاتُ وَدَرْبُ التَّبَّانَةِ: أَشْكَالُ المَجَرَّاتِ حَلَزُونِيَّةٌ وَإِهْلِيلَجِيَّةٌ وَغَيْرُ مُنْتَظِمَةٍ، وَمَجَرَّتُنَا (دَرْبُ التَّبَّانَةِ) حَلَزُونِيَّةٌ ضَخْمَةٌ وَتَقَعُ شَمْسُنَا فِي أَحَدِ أَذْرُعِهَا الخَارِجِيَّةِ. (3) أَسْرَارُ النُّجُومِ: كُرَاتٌ غَازِيَّةٌ عِمْلَاقَةٌ سَاخِنَةٌ تَتَدَرَّجُ أَلْوَانُهَا وَحَرَارَتُهَا مِنَ الزَّرْقَاءِ (الأَشَدِّ حَرَارَةً) إِلَى الحَمْرَاءِ. (4) رَصْدُ الكَوْنِ: بِالتِّلِسْكُوبَاتِ وَالمَسَابِرِ وَالمَحَطَّاتِ الفَضَائِيَّةِ."
        }
      ],
      "text": "الدَّرْسُ (1) الكَوْنُ وَالمَجَرَّاتُ وَالنُّجُومُ: (1) الكَوْنُ الشَّاسِعُ وَالتَّمَدُّدُ: بَدَأَ الكَوْنُ مُنْذُ مِلْيَارَاتِ السِّنِينَ وَتَتَبَاعَدُ المَجَرَّاتُ فِيهِ بِاسْتِمْرَارٍ، وَيَتَكَوَّنُ مِنْ مَجَرَّاتٍ وَنُجُومٍ وَسُدُمٍ. (2) المَجَرَّاتُ وَدَرْبُ التَّبَّانَةِ: أَشْكَالُ المَجَرَّاتِ حَلَزُونِيَّةٌ وَإِهْلِيلَجِيَّةٌ وَغَيْرُ مُنْتَظِمَةٍ، وَمَجَرَّتُنَا (دَرْبُ التَّبَّانَةِ) حَلَزُونِيَّةٌ ضَخْمَةٌ وَتَقَعُ شَمْسُنَا فِي أَحَدِ أَذْرُعِهَا الخَارِجِيَّةِ. (3) أَسْرَارُ النُّجُومِ: كُرَاتٌ غَازِيَّةٌ عِمْلَاقَةٌ سَاخِنَةٌ تَتَدَرَّجُ أَلْوَانُهَا وَحَرَارَتُهَا مِنَ الزَّرْقَاءِ (الأَشَدِّ حَرَارَةً) إِلَى الحَمْرَاءِ. (4) رَصْدُ الكَوْنِ: بِالتِّلِسْكُوبَاتِ وَالمَسَابِرِ وَالمَحَطَّاتِ الفَضَائِيَّةِ.",
      "q1": {
        "q": "مَا اسْمُ مَجَرَّتِنَا وَمَا شَكْلُهَا الفَلَكِيُّ؟",
        "focusWord": "دَرْبُ التَّبَّانَةِ",
        "options": [
          {
            "text": "مَجَرَّةُ دَرْبِ التَّبَّانَةِ، وَهِيَ مَجَرَّةٌ حَلَزُونِيَّةٌ ضَخْمَةٌ",
            "correct": true
          },
          {
            "text": "مَجَرَّةٌ مُرَبَّعَةٌ صَغِيرَةٌ",
            "correct": false
          },
          {
            "text": "كَوْكَبُ المِرِّيخِ",
            "correct": false
          },
          {
            "text": "سَحَابَةُ التُّرُوبُوسْفِيرِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا النُّجُومُ الأَشَدُّ حَرَارَةً حَسَبَ أَلْوَانِهَا الفَلَكِيَّةِ؟",
        "focusWord": "النُّجُومُ الزَّرْقَاءُ",
        "options": [
          {
            "text": "النُّجُومُ الزَّرْقَاءُ هِيَ الأَشَدُّ حَرَارَةً وَالحَمْرَاءُ هِيَ الأَقَلُّ حَرَارَةً",
            "correct": true
          },
          {
            "text": "النُّجُومُ السَّوْدَاءُ",
            "correct": false
          },
          {
            "text": "النُّجُومُ الخَضْرَاءُ",
            "correct": false
          },
          {
            "text": "الكُوَيْكِبَاتُ الصَّخْرِيَّةُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِمَاذَا يَرْصُدُ العُلَمَاءُ النُّجُومَ وَالمَجَرَّاتِ وَيَسْتَكْشِفُونَ الفَضَاءَ؟",
        "focusWord": "التِّلِسْكُوبَاتُ وَالمَسَابِرُ",
        "options": [
          {
            "text": "بِتِلِسْكُوبَاتِ الرَّصْدِ وَالمَرْكَبَاتِ وَالمَسَابِرِ وَالمَحَطَّاتِ الفَضَائِيَّةِ",
            "correct": true
          },
          {
            "text": "بِالسَّمَّاعَةِ الطِّبِّيَّةِ",
            "correct": false
          },
          {
            "text": "بِالإِنْبِيقِ الزُّجَاجِيِّ",
            "correct": false
          },
          {
            "text": "بِالمِحْرَاثِ الزِّرَاعِيِّ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "مَجَرَّةُ دَرْبِ التَّبَّانَةِ",
          "left": "مَجَرَّةٌ حَلَزُونِيَّةٌ تَقَعُ شَمْسُنَا فِي أَحَدِ أَذْرُعِهَا الخَارِجِيَّةِ"
        },
        {
          "right": "النُّجُومُ",
          "left": "كُرَاتٌ غَازِيَّةٌ عِمْلَاقَةٌ سَاخِنَةٌ تَبْدَأُ مِنْ سُحُبِ الغَازِ (السُّدُمِ)"
        },
        {
          "right": "المَحَطَّاتُ الفَضَائِيَّةُ",
          "left": "مُخْتَبَرَاتٌ عِلْمِيَّةٌ تَسْبَحُ فِي الفَضَاءِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَكْنُونَاتِ الكَوْنِ وَأَدَوَاتِ رَصْدِهِ الفَلَكِيِّ:",
        "correct": [
          "المَجَرَّاتُ وَالنُّجُومُ وَالسُّدُمُ",
          "مَجَرَّةُ دَرْبِ التَّبَّانَةِ الحَلَزُونِيَّةُ",
          "تِلِسْكُوبَاتُ الرَّصْدِ الفَلَكِيِّ",
          "المَرْكَبَاتُ وَالمَحَطَّاتُ الفَضَائِيَّةُ"
        ],
        "wrong": [
          "الشُّعَيْرَاتُ الدَّمَوِيَّةُ",
          "الصُّخُورُ الرُّسُوبِيَّةُ"
        ]
      },
      "applyStep": "أَتَأَمَّلُ السَّمَاءَ وَالنُّجُومَ لَيْلًا وَأُسَبِّحُ اللهَ خَالِقَ المَجَرَّاتِ وَالكَوْنِ الشَّاسِعِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt17.jpg",
      "title": "الدَّرْسُ (9): مَسَارُ القُوَّةِ وَالتَّفْرِيغِ العَضَلِيِّ لِلطُّلَّابِ",
      "subtitle": "بَرْنَامَجٌ تَدْرِيبِيٌّ رِيَاضِيٌّ مُتَكَامِلٌ لِلطُّلَّابِ",
      "slideText": "💪 الدَّرْسُ (9) مَسَارُ القُوَّةِ وَالتَّفْرِيغِ العَضَلِيِّ لِلطُّلَّابِ: (1) الوَعْيُ (دَقِيقَتَانِ): تَنَفُّسٌ مُنْتَظَمٌ (شَهِيقٌ 4 ثَوَانٍ — زَفِيرٌ 6 ثَوَانٍ). (2) الاسْتِطَالَةُ (دَقِيقَةٌ وَنِصْفٌ): التَّعَلُّقُ عَلَى العَارِضَةِ لِفَكِّ ضَغْطِ الفَقَرَاتِ. (3) النُّمُوُّ العَضَلِيُّ (40 ثَانِيَةً): تَمْرِينُ الضَّغْطِ (8-12 عَدَّةً). (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَةٌ وَنِصْفٌ): التَّبْدِيلُ السَّرِيعُ لِلْحَرَكَةِ. (5) التَّدَفُّقُ (3 دَقَائِقَ): الشَّدُّ العَضَلِيُّ المُتَدَرِّجُ وَالارْتِخَاءُ (شَدٌّ 5 ثَوَانٍ ← ارْتِخَاءٌ 10 ثَوَانٍ ← شَدٌّ 5 ثَوَانٍ).",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي التَّنَفُّسَ فِي فَقْرَةِ (الوَعْيِ) وَتَمْرِينَ (الاسْتِطَالَةِ) فِي الدَّرْسِ التَّاسِعِ؟",
        "focusWord": "شَهِيقٌ 4ث وَزَفِيرٌ 6ث وَالتَّعَلُّقُ",
        "options": [
          {
            "text": "شَهِيقٌ فِي 4 ثَوَانٍ وَزَفِيرٌ فِي 6 ثَوَانٍ (دَقِيقَتَانِ)، ثُمَّ التَّعَلُّقُ عَلَى العَارِضَةِ (دَقِيقَةٌ وَنِصْفٌ)",
            "correct": true
          },
          {
            "text": "الجُلُوسُ بِلَا تَنَفُّسٍ",
            "correct": false
          },
          {
            "text": "الرَّكْضُ السَّرِيعُ فَقَطْ",
            "correct": false
          },
          {
            "text": "القَفْزُ عَلَى قَدَمٍ وَاحِدَةٍ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا تَمْرِينُ (النُّمُوِّ العَضَلِيِّ) فِي مَسَارِ القُوَّةِ وَالتَّفْرِيغِ العَضَلِيِّ؟",
        "focusWord": "تَمْرِينُ الضَّغْطِ",
        "options": [
          {
            "text": "تَمْرِينُ الضَّغْطِ (8-12 عَدَّةً خِلَالَ 40 ثَانِيَةً)",
            "correct": true
          },
          {
            "text": "تَمْرِينُ النَّفْخِ فِي البَالُونِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ المَتَاهَةِ البَصَرِيَّةِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ الجُلُوسِ عَلَى الكُرْسِيِّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَيْفَ يُؤَدَّى تَمْرِينُ (التَّدَفُّقِ 3 دَقَائِقَ) فِي نِهَايَةِ الدَّرْسِ التَّاسِعِ؟",
        "focusWord": "الشَّدُّ العَضَلِيُّ وَالارْتِخَاءُ",
        "options": [
          {
            "text": "شَدُّ العَضَلَاتِ لِمُدَّةِ 5 ثَوَانٍ ثُمَّ ارْتِخَاءٌ تَامٌّ لِمُدَّةِ 10 ثَوَانٍ بِالتَّنَاوُبِ",
            "correct": true
          },
          {
            "text": "الشَّدُّ المُتَوَاصِلُ بِلَا ارْتِخَاءٍ",
            "correct": false
          },
          {
            "text": "القَفْزُ العَالِي",
            "correct": false
          },
          {
            "text": "الدَّوَرَانُ السَّرِيعُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ (الدَّرْسُ 9)",
          "left": "شَهِيقٌ 4ث وَزَفِيرٌ 6ث + التَّعَلُّقُ عَلَى العَارِضَةِ"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ (40 ثَانِيَةً)",
          "left": "تَمْرِينُ الضَّغْطِ (8-12 عَدَّةً)"
        },
        {
          "right": "التَّدَفُّقُ (3 دَقَائِقَ)",
          "left": "شَدٌّ عَضَلِيٌّ 5 ثَوَانٍ ثُمَّ ارْتِخَاءٌ 10 ثَوَانٍ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ التَّاسِعِ (مَسَارِ القُوَّةِ وَالتَّفْرِيغِ العَضَلِيِّ):",
        "correct": [
          "تَنَفُّسٌ (شَهِيقٌ 4ث - زَفِيرٌ 6ث)",
          "التَّعَلُّقُ لِلِاسْتِطَالَةِ (دَقِيقَةٌ وَنِصْفٌ)",
          "تَمْرِينُ الضَّغْطِ (8-12 عَدَّةً)",
          "التَّبْدِيلُ السَّرِيعُ وَالشَّدُّ ثُمَّ الارْتِخَاءُ"
        ],
        "wrong": [
          "الشَّدُّ العَضَلِيُّ دُونَ ارْتِخَاءٍ",
          "حَبْسُ النَّفَسِ أَثْنَاءَ تَمْرِينِ الضَّغْطِ"
        ]
      },
      "applyStep": "أُطَبِّقُ مَسَارَ القُوَّةِ وَالتَّفْرِيغِ العَضَلِيِّ وَأَخْتَتِمُ بِالشَّدِّ العَضَلِيِّ (5 ثَوَانٍ) ثُمَّ الارْتِخَاءِ التَّامِّ (10 ثَوَانٍ)."
    }
  },
  {
    "w": 18,
    "secNum": 5,
    "heavenName": "سَمَاءُ الأَرْبِعَاءِ الخَامِسَةُ (ف ص ق ر)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الخَامِسَةُ: عُلُومُ الفَلَكِ وَالفَضَاءِ وَالنِّظَامِ الشَّمْسِيِّ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "ص",
    "jummal": 90,
    "prophet": "صَالِحٌ (ع)",
    "virtue": "الرِّفْقُ",
    "unitHeader": "الوَحْدَةُ الثَّامِنَةَ عَشْرَةَ : نَبِيُّ اللهِ صَالِحٌ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "أَرْسَلَ اللهُ نَبِيَّهُ صَالِحًا (ع) إِلَى قَوْمِ ثَمُودَ بِآيَةِ النَّاقَةِ العَظِيمَةِ الَّتِي تَسْقِيهِمُ الحَلِيبَ، وَأَوْصَاهُمْ بِالرِّفْقِ بِهَا وَتَرْكِ الظُّلْمِ وَالإِفْسَادْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الحَسَدُ وَالطُّغْيَانُ مُقَابِلَ نُورِ النَّصِيحَةِ): نَارُ الكِبْرِ وَالبَطَرِ فِي قُلُوبِ المُسْتَكْبِرِينَ مِنْ ثَمُودَ، وَنَارُ المَكْرِ فِي الرَّهْطِ التِّسْعَةِ الَّذِينَ تَقَاسَمُوا بِاللهِ لَيُبَيِّتُنَّ صَالِحًا وَأَهْلَهُ لَيْلًا، وَاحْمِرَارُ وُجُوهِهِمْ ثُمَّ اسْوِدَادُهَا فِي الأَيَّامِ الثَّلَاثَةِ وَنُزُولُ الصَّاعِقَةِ الحَارِقَةِ مِنَ السَّمَاءِ؛ وَفِي مُقَابِلِهَا نُورُ صَالِحٍ وَإِيمَانُ المُسْتَضْعَفِينَ. B. الرِّيحُ (الوَهْمُ وَالتَّطَيُّرُ مُقَابِلَ طُولِ النَّفَسِ وَصَيْحَةِ الحَقِّ): رِيحُ الوَهْمِ فِي عِبَادَتِهِمْ لِلأَصْنَامِ السَّبْعِينَ، وَادِّعَاؤُهُمْ أَنَّ صَالِحًا رَجُلٌ مَسْحُورٌ، وَتَشَاؤُمُهُمْ البَاطِلُ بِهِ وَبِأَصْحَابِهِ، وَطُولُ نَفَسِ صَالِحٍ فِي مَوْعِظَتِهِمْ دَهْرًا طَوِيلًا، فَأَخَذَتْهُمْ صَيْحَةُ المَلَكِ جِبْرِيلَ القَاصِمَةُ فِي الهَوَاءِ فَقَطَعَتْ قُلُوبَهُمْ فِي أَجْوَافِهِمْ. C. التُّرَابُ (العَقْلُ وَالنَّحْتُ وَالصَّخْرَةُ): مَهَارَةُ ثَمُودَ العَقْلِيَّةُ فِي نَحْتِ الجِبَالِ بُيُوتًا فَرِهِينَ وَاتِّخَاذِ القُصُورِ فِي السُّهُولِ، وَانْفِلَاقُ الصَّخْرَةِ الصَّمَّاءِ التُّرَابِيَّةِ («الهَضْبَةِ») عَنْ نَاقَةٍ حَيَّةٍ وَبَرَاءَ عُشَرَاءَ، وَرَضْخُ المَلَائِكَةِ لِلْمُفْسِدِينَ التِّسْعَةِ بِالصَّخْرِ فِي الغَارِ، وَالرَّجْفَةُ الزِّلْزَالِيَّةُ الَّتِي أَخَذَتْهُمْ مِنْ تَحْتِ أَرْجُلِهِمْ. D. المَاءُ (الطَّاعَةُ وَقِسْمَةُ الشِّرْبِ وَاللَّبَنُ): قِسْمَةُ مَاءِ البِئْرِ بَيْنَ النَّاقَةِ وَالقَوْمِ (﴿لَهَا شِرْبٌ وَلَكُمْ شِرْبُ يَوْمٍ مَّعْلُومٍ﴾)، وَسَقْيُ النَّاقَةِ لِلنَّاسِ جَمِيعًا مِنْ لَبَنِهَا الفَائِضِ العَذْبِ فِي يَوْمِ شِرْبِهَا، وَتَوَاضُعُ المُؤْمِنِينَ وَطَاعَتُهُمْ لِأَمْرِ اللهِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الأَرْبِعَاءِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ ثَمَانِيَةَ عَشَرَ فِي مَنْزِلَةِ الرِّيحِ الَّتِي تُبَدِّدُ أَوْهَامَ الأَصْنَامِ وَالتَّطَيُّرِ بِطُولِ النَّفَسِ وَالصَّبْرِ وَالنَّصِيحَةِ الصَّادِقَةْ، وَهُوَ نَبِيُّ اللهِ صَالِحٌ بْنُ عُبَيْدٍ عَلَيْهِ السَّلَامْ. بَعَثَهُ اللهُ وَهُوَ ابْنُ سِتَّ عَشْرَةَ سَنَةً إِلَى قَوْمِهِ ثَمُودَ أَصْحَابِ الحِجْرِ الَّذِينَ سَكَنُوا بَيْنَ الحِجَازِ وَالشَّامِ فِي وَادِي القُرَى، وَكَانَ اللهُ قَدْ جَعَلَهُمْ خُلَفَاءَ فِي الأَرْضِ مِنْ بَعْدِ قَوْمِ عَادٍ وَمَكَّنَهُمْ فِيهَا وَمَنَحَهُمْ قُوَّةً فِي الأَبْدَانِ وَالعُقُولْ؛ فَبَنَوْا فِي سُهُولِهَا قُصُورًا شَاهِقَةً وَجَابُوا الصَّخْرَ بِالوَادِ وَنَحَتُوا مِنَ الجِبَالِ بُيُوتًا فَرِهِينَ آمِنِينَ بَيْنَ جَنَّاتٍ وَعُيُونٍ وَزُرُوعٍ وَنَخْلٍ طَلْعُهَا هَضِيمٌ نَاضِجٌ طَيِّبْ. لٰكِنَّهُمْ بَطِرُوا النِّعْمَةَ وَخَدَعَتْهُمْ رِيحُ الوَهْمِ فَـصَنَعُوا سَبْعِينَ صَنَمًا يَعْبُدُونَهَا مِنْ دُونِ اللهِ وَتَكَبَّرَ مَلَؤُهُمْ عَلَى الضُّعَفَاءْ.",
      "وَقَفَ صَالِحٌ بَيْنَهُمْ طَوِيلَ النَّفَسِ يَدْعُوهُمْ بِالحِكْمَةِ وَالعَقْلِ دَهْرًا طَوِيلًا حَتَّى شَابَ شَعْرُهُ كَمَا ذُكِرَ فِي صُحُفِ الأَنْبِيَاءْ، وَقَالَ يَا قَوْمِ اعْبُدُوا اللهَ مَا لَكُمْ مِنْ إِلٰهٍ غَيْرُهُ هُوَ أَنْشَأَكُمْ مِنَ الأَرْضِ وَاسْتَعْمَرَكُمْ فِيهَا فَاسْتَغْفِرُوهُ ثُمَّ تُوبُوا إِلَيْهِ إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ وَلَا تُطِيعُوا أَمْرَ المُسْرِفِينَ الَّذِينَ يُفْسِدُونَ فِي الأَرْضِ وَلَا يُصْلِحُونْ. فَانْقَسَمَ القَوْمُ إِلَى فَرِيقَيْنِ يَخْتَصِمُونَ، وَقَالَ المُسْتَكْبِرُونَ يَا صَالِحُ قَدْ كُنْتَ فِينَا مَرْجُوًّا قَبْلَ هٰذَا أَتَنْهَانَا أَنْ نَعْبُدَ مَا يَعْبُدُ آبَاؤُنَا أَبَشَرًا مِنَّا وَاحِدًا نَتَّبِعُهْ! ثُمَّ امْتَحَنُوا المُؤْمِنِينَ المُسْتَضْعَفِينَ وَسَأَلُوهُمْ أَتَعْلَمُونَ أَنَّ صَالِحًا مُرْسَلٌ مِنْ رَبِّهْ؟ فَأَجَابَ المُؤْمِنُونَ بِثَبَاتٍ إِنَّا بِالَّذِي أُرْسِلَ بِهِ مُؤْمِنُونْ، بَيْنَمَا قَالَ الكُفَّارُ بِرِيحِ الوَهْمِ وَالظَّنِّ إِنَّا اطَّيَّرْنَا بِكَ وَبِمَنْ مَعَكَ وَإِنَّمَا أَنْتَ مِنَ المُسَحَّرِينَ فَأْتِ بِآيَةٍ إِنْ كُنْتَ مِنَ الصَّادِقِينْ!",
      "وَفِي يَوْمِ عِيدِهِمُ اجْتَمَعَتْ ثَمُودُ عِنْدَ أَصْنَامِهِمْ وَطَلَبُوا مِنْ صَالِحٍ تَعْجِيزًا لَهُ أَنْ يُخْرِجَ لَهُمْ مِنْ صَخْرَةٍ صَمَّاءَ عَظِيمَةٍ مُنْفَرِدَةٍ فِي الهَضْبَةِ نَاقَةً عُشَرَاءَ حَامِلًا وَبَرَاءَ صَهْبَاءَ تَمْشِي أَمَامَ أَعْيُنِهِمْ. فَأَخَذَ عَلَيْهِمْ صَالِحٌ العُهُودَ وَالمَوَاثِيقَ لَئِنْ أَجَابَهُمُ اللهُ لَيُؤْمِنُنَّ بِهْ، ثُمَّ قَامَ فَصَلَّى رَكْعَتَيْنِ خَاشِعَتَيْنِ وَرَفَعَ يَدَيْهِ يَدْعُو رَبَّهُ الَّذِي اصْطَفَى أَنْبِيَاءَهُ بِالحَقِّ المَبِينْ. فَتَحَرَّكَتِ الصَّخْرَةُ الصَّمَّاءُ وَانْفَلَقَتْ بِإِذْنِ اللهِ وَخَرَجَتْ مِنْ جَوْفِ التُّرَابِ وَالحَجَرِ نَاقَةٌ عَظِيمَةٌ مُبَارَكَةٌ كَمَا طَلَبُوا تَمَامًا وَوَلَدَتْ سَقْبَهَا الصَّغِيرَ وَهُوَ الفَصِيلُ الَّذِي كَانَ يَتْبَعُهَا فِي كُلِّ مَكَانْ! فَآمَنَ جُنْدَعُ بْنُ عَمْرٍو وَالعُقَلَاءُ مِنْ قَوْمِهِ وَخَلَصَ إِيمَانُهُمْ لِلهِ، وَأَمَّا الأَكْثَرُونَ فَاسْتَحَبُّوا العَمَى عَلَى الهُدَى وَصَدُّوا عَنْ صِرَاطٍ مُسْتَقِيمْ.",
      "أَقَامَ صَالِحٌ نِظَامَ العَدْلِ فِي المَاءِ فَقَالَ لَهُمْ هٰذِهِ نَاقَةُ اللهِ لَكُمْ آيَةً فَذَرُوهَا تَأْكُلْ فِي أَرْضِ اللهِ، لَهَا شِرْبٌ وَلَكُمْ شِرْبُ يَوْمٍ مَعْلُومٍ، فَلَا تَمَسُّوهَا بِسُوءٍ فَيَأْخُذَكُمْ عَذَابُ يَوْمٍ عَظِيمْ. فَكَانَتِ النَّاقَةُ تَشْرَبُ مَاءَ البِئْرِ كُلَّهُ فِي يَوْمٍ فَتَسْقِي القَبِيلَةَ كُلَّهَا صَغِيرَهُمْ وَكَبِيرَهُمْ مِنْ لَبَنِهَا الغَزِيرِ الطَّيِّبِ فَيَمْلَؤُونَ أَوَانِيَهُمْ وَقُدُورَهُمْ مَجَّانًا، وَفِي اليَوْمِ التَّالِي يَشْرَبُ القَوْمُ مَاءَ البِئْرِ وَتَخْرُجُ النَّاقَةُ تَرْعَى فِي أَرْضِ اللهِ بِنِظَامٍ عَادِلٍ لَا نَقْصٌ فِيهِ وَلَا ضِيقْ.",
      "وَلٰكِنَّ الكِبْرَ وَالحَسَدَ أَعْمَى قُلُوبَ الأَشْرَارِ وَكَانَ فِي المَدِينَةِ تِسْعَةُ رَهْطٍ يُفْسِدُونَ فِي الأَرْضِ وَلَا يُصْلِحُونْ، وَحَرَّضَتْهُمُ امْرَأَتَانِ شِرِّيرَتَانِ هُمَا قَطَامِ وَعُنَيْزَةُ فَنَادَوْا أَشْقَى القَوْمِ وَهُوَ قُدَارُ بْنُ سَالِفٍ أُحَيْمِرُ ثَمُودَ الَّذِي قَالَ عَنْهُ رَسُولُ اللهِ مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَآلِهِ لِأَمِيرِ المُؤْمِنِينَ عَلِيٍّ عَلَيْهِ السَّلَامُ أَشْقَى الأَوَّلِينَ عَاقِرُ النَّاقَةِ وَأَشْقَى الآخِرِينَ قَاتِلُكَ يَا عَلِيُّ! فَكَمَنَ الشَّقِيُّ قُدَارُ وَمَعَهُ مِصْدَعُ بْنُ دَهْرٍ لِلنَّاقَةِ عِنْدَ مَمَرِّهَا فَرَمَوْهَا بِالسَّهْمِ وَضَرَبُوا عُرْقُوبَهَا بِالسَّيْفِ فَتَعَاطَى فَعَقَرَ، وَرَضِيَ القَوْمُ كُلُّهُمْ بِعَقْرِهَا فَعَمَّهُمُ الذَّنْبُ جَمِيعًا كَمَا بَيَّنَ الإِمَامُ عَلِيٌّ عَلَيْهِ السَّلَامُ أَنَّهُ عَقَرَ نَاقَةَ ثَمُودَ رَجُلٌ وَاحِدٌ فَعَمَّهُمُ اللهُ بِالعَذَابِ لَمَّا عَمُّوهَا بِالرِّضَا! وَهَرَبَ وَلَدُهَا الفَصِيلُ الصَّغِيرُ يَصْعَدُ الجَبَلَ العَالِيَ وَهُوَ يَبْكِي دُمُوعًا، وَوَقَفَ عَلَى صَخْرَةٍ فَرَغَا ثَلَاثَ رَغَوَاتٍ يَشْكُو إِلَى اللهِ، فَانْفَلَقَتْ لَهُ الصَّخْرَةُ وَدَخَلَ فِيهَا.",
      "جَاءَ صَالِحٌ يَبْكِي حُزْنًا عَلَى كُفْرِهِمْ وَقَالَ لِكُلِّ رَغْوَةٍ مِنْ رَغَوَاتِ الفَصِيلِ أَجَلُ يَوْمٍ؛ تَمَتَّعُوا فِي دَارِكُمْ ثَلَاثَةَ أَيَّامٍ ذٰلِكَ وَعْدٌ غَيْرُ مَكْذُوبٍ، وَآيَةُ العَذَابِ أَنْ تَصْفَرَّ وُجُوهُكُمْ يَوْمَ الخَمِيسِ وَتَحْمَرَّ يَوْمَ الجُمُعَةِ وَتَسْوَدَّ يَوْمَ السَّبْتِ! فَلَمْ يَتُوبُوا بَلِ اجْتَمَعَ التِّسْعَةُ المُفْسِدُونَ وَتَقَاسَمُوا بِاللهِ لَيُبَيِّتُنَّ صَالِحًا وَأَهْلَهُ لَيْلًا فَيَقْتُلُوهُ ثُمَّ يَكْذِبُوا عَلَى أَوْلِيَائِهْ! فَحَفِظَ اللهُ نَبِيَّهُ وَأَرْسَلَ المَلَائِكَةَ فَرَضَخَتِ التِّسْعَةَ بِالصَّخْرِ فِي الغَارِ الَّذِي اخْتَبَؤُوا فِيهِ فَأَهْلَكَتْهُمْ قَبْلَ قَوْمِهِمْ وَمَكَرُوا مَكْرًا وَمَكَرْنَا مَكْرًا وَهُمْ لَا يَشْعُرُونْ.",
      "وَلَمَّا رَأَتْ ثَمُودُ تَغَيُّرَ أَلْوَانِ وُجُوهِهِمْ فِي الأَيَّامِ الثَّلَاثَةِ كَمَا فَصَّلَ لَهُمْ صَالِحٌ أَيْقَنُوا بِالهَلَاكْ، وَفِي صَبِيحَةِ اليَوْمِ الرَّابِعِ يَوْمِ الأَحَدِ أَصَابَ الظَّالِمِينَ مَا كَانُوا يُوعَدُونَ؛ فَأَخَذَتْهُمُ الرَّجْفَةُ مِنْ تَحْتِ أَرْجُلِهِمْ وَصَاحَ بِهِمُ المَلَكُ جِبْرِيلُ صَيْحَةً وَاحِدَةً هِيَ الطَّاغِيَةُ مَعَ صَاعِقَةِ العَذَابِ الهُونِ فَدَمْدَمَ عَلَيْهِمْ رَبُّهُمْ بِذَنْبِهِمْ فَسَوَّاهَا وَلَا يَخَافُ عُقْبَاهَا وَأَصْبَحُوا فِي دِيَارِهِمْ جَاثِمِينَ كَهَشِيمِ المُحْتَظِرِ كَأَنْ لَمْ يَغْنَوْا فِيهَا! وَنَجَّى اللهُ صَالِحًا وَالَّذِينَ آمَنُوا مَعَهُ بِرَحْمَتِهِ مِنْ خِزْيِ يَوْمِئِذٍ، فَوَقَفَ صَالِحٌ يُخَاطِبُهُمْ قَائِلًا يَا قَوْمِ لَقَدْ أَبْلَغْتُكُمْ رِسَالَةَ رَبِّي وَنَصَحْتُ لَكُمْ وَلٰكِنْ لَا تُحِبُّونَ النَّاصِحِينْ. ثُمَّ سَارَ صَالِحٌ عَلَى نَاقَةٍ حَمْرَاءَ خِطَامُهَا مِنْ لِيفٍ وَمَعَهُ مِائَةٌ وَعِشْرُونَ مِنَ المُؤْمِنِينَ حَاجًّا إِلَى الكَعْبَةِ المُشَرَّفَةِ فِي مَكَّةَ يَمْشُونَ مُلَبِّينَ خَاشِعِينَ حَتَّى عَبَدَ اللهَ عِنْدَ البَيْتِ العَتِيقِ وَقَبَضَهُ اللهُ إِلَيْهِ وَهُوَ ابْنُ ثَمَانٍ وَخَمْسِينَ سَنَةً، وَجَعَلَ اللهُ سِيرَتَهُ مَوْعِظَةً لِكُلِّ مُؤْمِنٍ بَصِيرٍ يَعْلَمُ أَنَّ اللهَ يُفَصِّلُ الآيَاتِ وَيَقُصُّ الحَقَّ فِي أَحْسَنِ القَصَصْ."
    ],
    "words": [
      {
        "word": "اصْطَفَى",
        "desc": "وسط متصل / ساكن: ـصْـ",
        "raw": "اصْطَفَى (وسط متصل / ساكن: ـصْـ)"
      },
      {
        "word": "القَصَصْ",
        "desc": "آخر متصل / ساكن وقفا: ـصْ",
        "raw": "القَصَصْ (آخر متصل / ساكن وقفا: ـصْ)"
      },
      {
        "word": "صَنَعُوا",
        "desc": "أول منفصل / متحرك بالفتح: صَـ",
        "raw": "صَنَعُوا (أول منفصل / متحرك بالفتح: صَـ)"
      },
      {
        "word": "فَصَلَّى",
        "desc": "أول متصل / متحرك بالفتح: ـصَـ",
        "raw": "فَصَلَّى (أول متصل / متحرك بالفتح: ـصَـ)"
      },
      {
        "word": "نَصَحْتُ",
        "desc": "وسط متصل / متحرك بالفتح: ـصَـ",
        "raw": "نَصَحْتُ (وسط متصل / متحرك بالفتح: ـصَـ)"
      },
      {
        "word": "أَصَابَ",
        "desc": "وسط منفصل / متحرك بالفتح: صَـ",
        "raw": "أَصَابَ (وسط منفصل / متحرك بالفتح: صَـ)"
      },
      {
        "word": "خَلَصَ",
        "desc": "آخر متصل / متحرك بالفتح: ـصَ",
        "raw": "خَلَصَ (آخر متصل / متحرك بالفتح: ـصَ)"
      },
      {
        "word": "صُحُفِ",
        "desc": "أول منفصل / متحرك بالضم: صُـ",
        "raw": "صُحُفِ (أول منفصل / متحرك بالضم: صُـ)"
      },
      {
        "word": "نَقْصٌ",
        "desc": "آخر متصل / متحرك بالضم: ـصٌ",
        "raw": "نَقْصٌ (آخر متصل / متحرك بالضم: ـصٌ)"
      },
      {
        "word": "صِرَاطٍ",
        "desc": "أول منفصل / متحرك بالكسر: صِـ",
        "raw": "صِرَاطٍ (أول منفصل / متحرك بالكسر: صِـ)"
      },
      {
        "word": "فَصَّلَ",
        "desc": "وسط متصل / مضعف بالفتح: ـصَّـ",
        "raw": "فَصَّلَ (وسط متصل / مضعف بالفتح: ـصَّـ)"
      },
      {
        "word": "يَقُصُّ",
        "desc": "آخر متصل / مضعف بالضم: ـصُّ",
        "raw": "يَقُصُّ (آخر متصل / مضعف بالضم: ـصُّ)"
      },
      {
        "word": "يُفَصِّلُ",
        "desc": "وسط متصل / مضعف بالكسر: ـصِّـ",
        "raw": "يُفَصِّلُ (وسط متصل / مضعف بالكسر: ـصِّـ)"
      },
      {
        "word": "صَالِحٌ",
        "desc": "أول منفصل / ممدود بالألف: صَا",
        "raw": "صَالِحٌ (أول منفصل / ممدود بالألف: صَا)"
      },
      {
        "word": "قُصُورًا",
        "desc": "وسط متصل / ممدود بالواو: ـصُو",
        "raw": "قُصُورًا (وسط متصل / ممدود بالواو: ـصُو)"
      },
      {
        "word": "بَصِيرٍ",
        "desc": "وسط متصل / ممدود بالياء: ـصِي",
        "raw": "بَصِيرٍ (وسط متصل / ممدود بالياء: ـصِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الصَّادِ (ص): النُّطْقُ السَّلِيمُ لِحَرْفِ الصَّادِ المُفَخَّمِ المُطْبَقِ ذِي الصَّفِيرِ القَوِيِّ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ الصَّفْحَةِ الدَّاخِلِيَّةِ لِلثَّنَايَا السُّفْلَى مَعَ اسْتِعْلَاءِ أَقْصَى اللِّسَانِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَنْزِيهُ اللِّسَانِ عَنِ القَسَمِ عَلَى البَاطِلِ وَعَنِ التَّشَاؤُمِ وَالتَّطَيُّرِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الصَّخْرَةُ المُنْفَلِقَةُ وَتَدَرُّجُ الأَلْوَانِ الثَّلَاثَةِ وَالرَّقْمُ (18): مُشَاهَدَةُ شَكْلِ حَرْفِ الصَّادِ (ص) الَّذِي يُشْبِهُ هَضْبَةَ الصَّخْرِ المُطْبَقَةَ وَتَلِيهَا سِنٌّ وَحَوْضٌ عَمِيقٌ كَحَوْضِ السُّقْيَا، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (18) (9 + 9 = 18، وَهُوَ ضِعْفُ الرَّهْطِ التِّسْعَةِ وَمِفْتَاحُ قِيمَةِ الصَّادِ العَشْرِيَّةِ: 90)، وَإِدْرَاكُ تَحَوُّلِ الأَلْوَانِ الثَّلَاثَةِ فِي أَيَّامِ الإِنْذَارِ (الأَصْفَرِ، فَالأَحْمَرِ، فَالأَسْوَدِ)، وَهَنْدَسَةِ نَحْتِ البُيُوتِ فِي الجِبَالِ."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ صَالِحٍ وَثَمُودَ الكَامِلَةُ وَرُغَاءُ الفَصِيلِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ صَالِحٍ الكَامِلَةِ فِي القُرْآنِ وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى قَبُولِ النَّصِيحَةِ الصَّادِقَةِ قَبْلَ فَوَاتِ الأَوَانِ (﴿وَلَٰكِن لَّا تُحِبُّونَ النَّاصِحِينَ﴾)، وَالتَّفَكُّرُ فِي أَثَرِ الصَّوْتِ الشَّدِيدِ (الصَّيْحَةِ وَالصَّاعِقَةِ) وَرُغَاءِ الفَصِيلِ الثَّلَاثِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ ثَمَانِيَةَ عَشَرَ (18) وَالتِّسْعُونَ (90) وَالقِسْمَةُ العَادِلَةُ: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (18) وَمَعْرِفَةِ قِيمَةِ الصَّادِ العَشْرِيَّةِ (90 = تِسْعُ عَشَرَاتٍ)، وَمَعْرِفَةِ الأَعْدَادِ الوَارِدَةِ فِي القِصَّةِ (التِّسْعَةِ الرَّهْطِ، وَالأَيَّامِ الثَّلَاثَةِ، وَالسَّبْعِينَ صَنَمًا، وَالمِائَةِ وَالعِشْرِينَ مُؤْمِنًا)، وَتَدْرِيبُ اليَدِ عَلَى النَّحْتِ وَالبِنَاءِ النَّافِعِ، وَالقِسْمَةِ العَادِلَةِ لِلْمَاءِ وَالطَّعَامِ، وَالرِّفْقِ بِالحَيَوَانَاتِ وَعَدَمِ إِيذَائِهَا."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ صُعُودِ الهِضَابِ وَطُولِ النَّفَسِ وَالسَّعْيِ فِي الحَجِّ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ صُعُودِ الجِبَالِ مَعَ تَنْظِيمِ الشَّهِيقِ وَالزَّفِيرِ لِاكْتِسَابِ لِيَاقَةِ «طُولِ النَّفَسِ» وَالتَّحَمُّلِ البَدَنِيِّ، وَالسَّعْيِ وَالطَّوَافِ فِي الحَجِّ (حَيْثُ حَجَّ نَبِيُّ اللهِ صَالِحٌ مَعَ المُؤْمِنِينَ إِلَى الكَعْبَةِ المُشَرَّفَةِ يَمْشُونَ مُلَبِّينَ)، وَتَمَارِينِ قُوَّةِ السَّاقَيْنِ وَالعُرْقُوبَيْنِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ لَبَنِ الإِبِلِ وَالزُّرُوعِ وَالنَّخْلِ ذِي الطَّلْعِ الهَضِيمِ: تَعَلُّمُ القِيمَةِ الغِذَائِيَّةِ وَالدَّوَائِيَّةِ العَالِيَةِ لِلَبَنِ النُّوقِ، وَمَعْرِفَةِ دَوْرَةِ المِيَاهِ الجَوْفِيَّةِ فِي الآبَارِ وَالعُيُونِ، وَدِرَاسَةِ خَصَائِصِ النَّخِيلِ وَ«الطَّلْعِ الهَضِيمِ» (الرُّطَبِ النَّاعِمِ النَّاضِجِ المُنْضَمِّ فِي أَكْمَامِهِ الَّذِي ذَكَرَهُ صَالِحٌ لِقَوْمِهِ فِي سُورَةِ الشُّعَرَاءِ)."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الرَّحْمَةِ بِالحَيَوَانِ وَحِفْظِ النِّعْمَةِ وَعَدَمِ الرِّضَا بِالظُّلْمِ: تَعَلُّمُ حُرْمَةِ ظُلْمِ الحَيَوَانِ وَإِيذَائِهِ (فَإِنَّ أُمَّةً كَامِلَةً هَلَكَتْ لِأَنَّهَا عَقَرَتْ نَاقَةً وَاحِدَةً وَرَضِيَتْ بِعَقْرِهَا)، وَالحَذَرِ مِنْ مَكَائِدِ السُّوءِ وَالفَسَادِ، وَالتَّحَلِّي بِالعِفَّةِ وَالتَّوَاضُعِ عِنْدَ سُكْنَى القُصُورِ وَالبُيُوتِ الوَاسِعَةِ."
      }
    },
    "grammar": {
      "topic": "الفَاعِلُ المُؤَنَّثُ وَتَاءُ التَّأْنِيثِ السَّاكِنَةُ (ـتْ)",
      "rule": "إِذَا كَانَ الفَاعِلُ اسْمًا مُؤَنَّثًا نُضِيفُ تَاءَ التَّأْنِيثِ السَّاكِنَةَ (ـتْ) فِي آخِرِ الفِعْلِ المَاضِي، أَوْ (تَـ) فِي أَوَّلِ المُضَارِعْ.",
      "example": "شَرِبَتِ النَّاقَةُ المَاءَ — تَطِيرُ العُصْفُورَةُ فِي الفَضَاءِ.",
      "focusWord": "شَرِبَتِ النَّاقَةُ",
      "q": "اخْتَرِ الفِعْلَ المُنَاسِبَ لِلفَاعِلِ المُؤَنَّثِ: «... الشَّمْسُ صَبَاحًا»:",
      "opts": [
        "أَشْرَقَتِ",
        "أَشْرَقَ",
        "يُشْرِقُ",
        "فِي"
      ]
    },
    "earIirab": {
      "topic": "رَفْعُ الفَاعِلِ المُؤَنَّثِ بِالضَّمَّةِ (ـُ)",
      "rule": "الفَاعِلُ المُؤَنَّثُ كَالفَاعِلِ المُذَكَّرِ يَكُونُ مَرْفُوعًا دَائِمًا بِالضَّمَّةِ الظَّاهِرَةِ (ـُ).",
      "sentence": "صَدَحَتِ العُصْفُورَةُ فَوْقَ الشَّجَرَةِ.",
      "targetWord": "العُصْفُورَةُ",
      "caseAns": "فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 98,
      "numName": "ثَمَانِيَةٌ وَتِسْعُونَ",
      "eqDisplay": "8 + 90 = 98",
      "subDisplay": "98 - 8 = 90",
      "compDisplay": "89 < 98",
      "q1": {
        "stem": "كَيْفَ نَقْرَأُ العَدَدَ المُرَكَّبَ (98) بِالعَرَبِيَّةِ؟",
        "focus": "98",
        "ans": "ثَمَانِيَةٌ وَتِسْعُونَ",
        "wrong": [
          "تِسْعَةٌ وَثَمَانُونَ",
          "تِسْعُونَ",
          "مِائَةٌ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "98 - 8 = ؟",
        "ans": "90 (تِسْعُونَ)",
        "wrong": [
          "80 (ثَمَانُونَ)",
          "89",
          "100"
        ]
      }
    },
    "sport": {
      "title": "وُقُوفُ اللَّقْلَقِ المُتَوَازِنُ عَلَى قَدَمٍ وَاحِدَةٍ",
      "middleText": "أَقِفُ مُسْتَقِيمًا وَأَرْفَعُ إِحْدَى قَدَمَيَّ عَنِ الأَرْضِ مَعَ فَرْدِ الذِّرَاعَيْنِ لِحِفْظِ التَّوَازُنِ ثُمَّ أُبَدِّلُ القَدَمْ. يُقَوِّي هٰذَا التَّمْرِينُ المِخَيْخَ المَسْؤُولَ عَنِ التَّوَازُنِ وَيَزِيدُ الثَّبَاتَ البَدَنِيّْ."
    },
    "sci": {
      "title": "النِّظَامُ الشَّمْسِيُّ وَالكَوَاكِبُ الثَّمَانِيَةُ",
      "summaryThird": "تَقَعُ الشَّمْسُ فِي مَرْكَزِ نِظَامِنَا الشَّمْسِيِّ، وَتَدُورُ حَوْلَهَا 8 كَوَاكِبَ بِتَرْتِيبٍ مُحْكَمٍ هِيَ: (عُطَارِدُ، الزُّهَرَةُ، الأَرْضُ، المِرِّيخُ، المُشْتَرِي، زُحَلُ، أُورَانُوسُ، نِبْتُونُ).",
      "focusConcept": "كَوْكَبُ الأَرْضِ الثَّالِثُ",
      "factAns": "الكَوْكَبُ المَائِيُّ المُعْتَدِلُ الصَّالِحُ لِلحَيَاةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ القَائِدِ وَالرَّعِيَّةِ وَالنِّظَامِ (حُور وَسُرُور - 18)",
      "storySentence": "عَرَفَ سُرُورٌ أَنَّ النِّظَامَ وَالعَدْلَ وَالرِّفْقَ بِالضُّعَفَاءِ وَالتَّعَاوُنَ عَلَى الخَيْرِ هِيَ الأَسَاسُ الَّذِي تَسْعَدُ بِهِ الأُسْرَةُ وَالمُجْتَمَعْ.",
      "applyAction": "أَلْتَزِمُ بِالنِّظَامِ وَأَرْفُقُ بِالصَّغِيرِ وَالضَّعِيفْ."
    },
    "rightsFullTitle": "(24) حق الولد + (25) حق الأخ",
    "rightsQuote": "وَأمَّا حَقُّ وَلَدِكَ فَتَعْلَمَ أنَّهُ مِنْكَ وَمُضَافٌ إلَيكَ فِي عَاجِلِ الدُنْيَـــــــــا بخَيْرِهِ وَشَرِّهِ، وَأَنَّكَ مَسْئولٌ عَمَّــــــا ولِّيتَهُ مِنْ حُسْنِ الأَدَب وَالدّلالَةِ عَلَى رَبـــــــــهِ وَالْمَعُونةِ لَهُ عَلَى طَاعَتِهِ فِيكَ وَفِي نفْسِهِ، فَمُثابٌ عَلَى ذلِكَ وَمُعَاقَبٌ، فَـــــــــاعْمَلْ فِي أَمْرِهِ عَمَلَ الْمُتَزَيِّنِ بحُسْنِ أَثرِهِ عَلَيْهِ فِي عَاجِلِ الدُّنْيَا، الْمُعْذِرِ إلَى رَبهِ فِيمَـــــــا بَيْنَكَ وبَيْنَهُ بحُسْنِ الْقِيَامِ عَلَيْهِ وَالأَخذُ لَهُ مِنْهُ. وَلا قُوَّةَ إلا باللهِ. | وَأَمّا حَقُّ أَخِيكَ فَتَعْلَمَ أَنّهُ يَدُكَ الَّتِي تَبسُطُهَــــــا، وَظَهْرُكَ الَّذِي تَلْتَجِئُ إلَيـــــــــــهِ، وَعِزُّكَ الَّذِي تَعْتَمِدُ عَلَيهِ، وَقُوَّتُكَ الَّتِي تَصُولُ بهَـــا، فَلا تَتَّخِذْهُ سِلاحًا عـــَلَى مَــعــْصــِيـةِ اللَّهِ ولا عُدَّةً لِلظُّلْمِ بحَــــــــــقِّ اللَّهِ، ولا تَدَعْ نُصْرتَهُ عَلَى نفْسِــــــــهِ وَمَعُونتِهِ عَلَى عَدُوِّهِ وَالْحَوْلَ بَيْنَهُ وبَيْنَ شَيَاطينهِ وتَأْديَةِ النَّصِيحَةِ إلَيهِ والإقبَالِ عَلَيْهِ فِي اللَّهِ فَــــــــــإنْ انقَادَ لِرَبهِ وَأَحْسَنَ الإجَابَةَ لَهُ وَإلاّ فَلْيَكُنِ اللهُ آثرَ عِنْدَكَ وَأَكْرَمَ عَلَيْكَ مِنْهُ .",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (24) حق الولد + (25) حق الأخ",
        "text": "وَأمَّا حَقُّ وَلَدِكَ فَتَعْلَمَ أنَّهُ مِنْكَ وَمُضَافٌ إلَيكَ فِي عَاجِلِ الدُنْيَـــــــــا بخَيْرِهِ وَشَرِّهِ، وَأَنَّكَ مَسْئولٌ عَمَّــــــا ولِّيتَهُ مِنْ حُسْنِ الأَدَب وَالدّلالَةِ عَلَى رَبـــــــــهِ وَالْمَعُونةِ لَهُ عَلَى طَاعَتِهِ فِيكَ وَفِي نفْسِهِ، فَمُثابٌ عَلَى ذلِكَ وَمُعَاقَبٌ، فَـــــــــاعْمَلْ فِي أَمْرِهِ عَمَلَ الْمُتَزَيِّنِ بحُسْنِ أَثرِهِ عَلَيْهِ فِي عَاجِلِ الدُّنْيَا، الْمُعْذِرِ إلَى رَبهِ فِيمَـــــــا بَيْنَكَ وبَيْنَهُ بحُسْنِ الْقِيَامِ عَلَيْهِ وَالأَخذُ لَهُ مِنْهُ. وَلا قُوَّةَ إلا باللهِ. | وَأَمّا حَقُّ أَخِيكَ فَتَعْلَمَ أَنّهُ يَدُكَ الَّتِي تَبسُطُهَــــــا، وَظَهْرُكَ الَّذِي تَلْتَجِئُ إلَيـــــــــــهِ، وَعِزُّكَ الَّذِي تَعْتَمِدُ عَلَيهِ، وَقُوَّتُكَ الَّتِي تَصُولُ بهَـــا، فَلا تَتَّخِذْهُ سِلاحًا عـــَلَى مَــعــْصــِيـةِ اللَّهِ ولا عُدَّةً لِلظُّلْمِ بحَــــــــــقِّ اللَّهِ، ولا تَدَعْ نُصْرتَهُ عَلَى نفْسِــــــــهِ وَمَعُونتِهِ عَلَى عَدُوِّهِ وَالْحَوْلَ بَيْنَهُ وبَيْنَ شَيَاطينهِ وتَأْديَةِ النَّصِيحَةِ إلَيهِ والإقبَالِ عَلَيْهِ فِي اللَّهِ فَــــــــــإنْ انقَادَ لِرَبهِ وَأَحْسَنَ الإجَابَةَ لَهُ وَإلاّ فَلْيَكُنِ اللهُ آثرَ عِنْدَكَ وَأَكْرَمَ عَلَيْكَ مِنْهُ . — وَفِي سِيرَةِ صَالِحٌ (ع): آدَابُ الرَّحْمَةِ بِالحَيَوَانِ وَحِفْظِ النِّعْمَةِ وَعَدَمِ الرِّضَا بِالظُّلْمِ: تَعَلُّمُ حُرْمَةِ ظُلْمِ الحَيَوَانِ وَإِيذَائِهِ (فَإِنَّ أُمَّةً كَامِلَةً هَلَكَتْ لِأَنَّهَا عَقَرَتْ نَاقَةً وَاحِدَةً وَرَضِيَتْ بِعَقْرِهَا)، وَالحَذَرِ مِنْ مَكَائِدِ السُّوءِ وَالفَسَادِ، وَالتَّحَلِّي بِالعِفَّةِ وَالتَّوَاضُعِ عِنْدَ سُكْنَى القُصُورِ وَالبُيُوتِ الوَاسِعَةِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الولد",
        "text": "🌱 «ثمار التربية» جلس الأب مع أطفاله في الحديقة، يحمل شتلة صغيرة. قال:\"سنساعد هذه الشتلة لتصبح شجرة كبيرة. وكما نعتني بها، سنعتني بقلوبنا.\" بدأ يحفر الأرض، وقال لحور: \"التربة الطيبة مثل القلب الطيب.يجب أن ننقيها من الحجارة.\" سألت حور: \"مثل الغضب والحقد؟\" أجاب:\"نعم. ومن ينتقي كلامه، تثمر أعماله.\" أحضر نور الماء وقال: \"لماذا لا نملأ الجورة كلها؟\" ضحك الأب:\"الإفراط يفسد الزرع. والتربية تحتاج تدرجًا.\" بعد أسبوع، لاحظ نور سوسة على الأغصان."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الولد",
        "text": "همس:\"أبي، هناك آفة!\" قال الأب:\"كما نحمي الشجرة، يجب أن نحفظ أنفسنا من رفاق السوء.\" وفي يوم ممطر، قالت حور: \"المطر يؤذيها!\" أجاب الأب:\"بل يغسل غبارها. والمصائب تظهر صبرنا.\" مرت أشهر، وأثمرت الشجرة. قال نور:\"لقد نجحت!\" صمت الأب ثم قال:\"النجاح الحقيقي هو أن تثمر وأنت منحنيٌ متواضع، لا مغرور.\" ذات مساء،جلسوا تحت ظل الشجرة. قالت حور:\"أصبحت كبيرة!\" رد الأب:\"وكبرتم أنتم أيضًا. الفرق أنها تثمر مرة في السنة، وأنتم تثمرون كل يوم بأخلاقكم.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الأخ",
        "text": "🌟 الأخوّة.. اختبار حقيقي كان اليوم مميزاً في المدرسة.. يوم اختبار الرياضيات. جلس نور وحور في الفصل، والأجواء مشحونة بالتوتر. قبل بدء الامتحان بثوانٍ، همس الصديق محمد في أذن نور: \"أنت بارع في الرياضيات..ساعدني اليوم! لن يعلم أحد.\" تجمّد نور في مكانه. نظرة حور إليه كانت تقول كل شيء.. كان الصراع في عينيه واضحاً. خرجوا من الفصل بعد الامتحان، كان محمد غاضباً: \"كنت أعتقد أنك صديقي الحقيقي!\" أجاب نور بصوت هادئ: \"لو ساعدتك على الغش،لكنت قد سرقت منك أكثر من الدرجات.. سرقت شرفك.\" في طريق العودة إلى البيت، سألت حور أخاها: \"هل تشعر بالندم لأنك لم تساعده؟\" أجاب نور وهو يمسك يدها:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الأخ",
        "text": "\"لو خسرت صدقة محمد من أجل الغش،لكنت قد خسرت احترامي لنفسي أولاً.\" في اليوم التالي، جاء محمد ومعذرة في عينيه: \"أنت محق..لو قبلت مساعدتك لكنت الآن خائناً لنفسي قبل أي أحد.\" احتضنه نور: \"الصديق الحقيقي لا يضعك في موقف يخجل منه أحد.\" الخاتمة: في المساء،كتبت حور في مذكراتها: \"تعلمت اليوم أن الأخوّة الحقيقية.. ليست أن تقول نعم لكل ما يطلبه منك صديقك، بل أن تقول لا عندما تكون هذه'لا' هي أجمل هدية تقدمها له.\" حقوق الآخرين"
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الخَامِسَةُ: الفَلَكُ وَالكَوْنُ",
      "topic": "الدَّرْسُ (2): النِّظَامُ الشَّمْسِيُّ وَكَوَاكِبُهُ (الكَوَاكِبُ الصَّخْرِيَّةُ، الكَوَاكِبُ العِمْلَاقَةُ، الكَوَاكِبُ القَزَمَةُ، وَالمَدَارَاتُ)",
      "coverImg": "assets/y7/scince/s18.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s18.1.jpg",
          "text": "الدَّرْسُ (2) النِّظَامُ الشَّمْسِيُّ وَكَوَاكِبُهُ: (1) الشَّمْسُ وَالكَوَاكِبُ الصَّخْرِيَّةُ: الشَّمْسُ نَجْمُ المَرْكَزِ وَمَصْدَرُ الضَّوْءِ وَالحَرَارَةِ، وَتَلِيهَا عُطَارِدُ وَالزُّهَرَةُ (الأَقْرَبُ وَالأَشَدُّ حَرَارَةً)، ثُمَّ الأَرْضُ (كَوْكَبُ الحَيَاةِ) وَالمِرِّيخُ (الكَوْكَبُ الأَحْمَرُ). (2) الكَوَاكِبُ العِمْلَاقَةُ: عِمْلَاقَا الغَازِ (المُشْتَرِي الأَكْبَرُ وَزُحَلُ ذُو الحَلَقَاتِ)، وَعِمْلَاقَا الجَلِيدِ (أُورَانُوسُ المَائِلُ وَنِبْتُونُ الأَزْرَقُ). (3) الكَوَاكِبُ القَزَمَةُ وَالأَجْرَامُ: بُلُوتُو، وَحِزَامُ الكُوَيْكِبَاتِ بَيْنَ المِرِّيخِ وَالمُشْتَرِي، وَالمُذَنَّبَاتُ الجَلِيدِيَّةُ وَالنَّيَازِكُ. (4) المَدَارَاتُ: مَسَارَاتٌ بَيْضَوِيَّةٌ ثَابِتَةٌ تَحْكُمُهَا الجَاذِبِيَّةُ وَيُحِيطُ بِهَا حِزَامُ كَايْبَرَ."
        }
      ],
      "text": "الدَّرْسُ (2) النِّظَامُ الشَّمْسِيُّ وَكَوَاكِبُهُ: (1) الشَّمْسُ وَالكَوَاكِبُ الصَّخْرِيَّةُ: الشَّمْسُ نَجْمُ المَرْكَزِ وَمَصْدَرُ الضَّوْءِ وَالحَرَارَةِ، وَتَلِيهَا عُطَارِدُ وَالزُّهَرَةُ (الأَقْرَبُ وَالأَشَدُّ حَرَارَةً)، ثُمَّ الأَرْضُ (كَوْكَبُ الحَيَاةِ) وَالمِرِّيخُ (الكَوْكَبُ الأَحْمَرُ). (2) الكَوَاكِبُ العِمْلَاقَةُ: عِمْلَاقَا الغَازِ (المُشْتَرِي الأَكْبَرُ وَزُحَلُ ذُو الحَلَقَاتِ)، وَعِمْلَاقَا الجَلِيدِ (أُورَانُوسُ المَائِلُ وَنِبْتُونُ الأَزْرَقُ). (3) الكَوَاكِبُ القَزَمَةُ وَالأَجْرَامُ: بُلُوتُو، وَحِزَامُ الكُوَيْكِبَاتِ بَيْنَ المِرِّيخِ وَالمُشْتَرِي، وَالمُذَنَّبَاتُ الجَلِيدِيَّةُ وَالنَّيَازِكُ. (4) المَدَارَاتُ: مَسَارَاتٌ بَيْضَوِيَّةٌ ثَابِتَةٌ تَحْكُمُهَا الجَاذِبِيَّةُ وَيُحِيطُ بِهَا حِزَامُ كَايْبَرَ.",
      "q1": {
        "q": "مَا الكَوَاكِبُ الصَّخْرِيَّةُ الأَرْبَعَةُ الأَقْرَبُ إِلَى الشَّمْسِ؟",
        "focusWord": "الكَوَاكِبُ الصَّخْرِيَّةُ",
        "options": [
          {
            "text": "عُطَارِدُ، وَالزُّهَرَةُ، وَالأَرْضُ، وَالمِرِّيخُ",
            "correct": true
          },
          {
            "text": "المُشْتَرِي وَزُحَلُ وَأُورَانُوسُ وَنِبْتُونُ",
            "correct": false
          },
          {
            "text": "بُلُوتُو وَالقَمَرُ",
            "correct": false
          },
          {
            "text": "الشَّمْسُ وَالمُذَنَّبَاتُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا أَكْبَرُ كَوَاكِبِ المَجْمُوعَةِ الشَّمْسِيَّةِ وَمَا الكَوْكَبُ المُمَيَّزُ بِحَلَقَاتِهِ الجَمِيلَةِ؟",
        "focusWord": "المُشْتَرِي وَزُحَلُ",
        "options": [
          {
            "text": "المُشْتَرِي هُوَ الأَكْبَرُ، وَزُحَلُ هُوَ ذُو الحَلَقَاتِ (عِمْلَاقَا الغَازِ)",
            "correct": true
          },
          {
            "text": "عُطَارِدُ وَالمِرِّيخُ",
            "correct": false
          },
          {
            "text": "بُلُوتُو وَالزُّهَرَةُ",
            "correct": false
          },
          {
            "text": "الأَرْضُ وَالقَمَرُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "أَيْنَ يَقَعُ حِزَامُ الكُوَيْكِبَاتِ الصَّخْرِيَّةِ فِي النِّظَامِ الشَّمْسِيِّ؟",
        "focusWord": "حِزَامُ الكُوَيْكِبَاتِ",
        "options": [
          {
            "text": "بَيْنَ كَوْكَبَيِ المِرِّيخِ وَالمُشْتَرِي",
            "correct": true
          },
          {
            "text": "بَيْنَ الأَرْضِ وَالقَمَرِ",
            "correct": false
          },
          {
            "text": "دَاخِلَ الغِلَافِ الجَوِّيِّ",
            "correct": false
          },
          {
            "text": "فِي مَرْكَزِ الشَّمْسِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الكَوَاكِبُ الصَّخْرِيَّةُ",
          "left": "عُطَارِدُ وَالزُّهَرَةُ وَالأَرْضُ وَالمِرِّيخُ"
        },
        {
          "right": "عِمْلَاقَا الغَازِ",
          "left": "المُشْتَرِي الأَكْبَرُ وَزُحَلُ ذُو الحَلَقَاتِ"
        },
        {
          "right": "عِمْلَاقَا الجَلِيدِ",
          "left": "أُورَانُوسُ المَائِلُ وَنِبْتُونُ الأَزْرَقُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَكْنُونَاتِ النِّظَامِ الشَّمْسِيِّ الصَّحِيحَةَ:",
        "correct": [
          "الشَّمْسُ نَجْمُ المَرْكَزِ",
          "الأَرْضُ كَوْكَبُ الحَيَاةِ وَالمِرِّيخُ الكَوْكَبُ الأَحْمَرُ",
          "المُشْتَرِي وَزُحَلُ وَأُورَانُوسُ وَنِبْتُونُ",
          "حِزَامُ الكُوَيْكِبَاتِ وَحِزَامُ كَايْبَرَ"
        ],
        "wrong": [
          "ثَبَاتُ الكَوَاكِبِ بِلَا مَدَارَاتٍ",
          "دَوَرَانُ الشَّمْسِ حَوْلَ القَمَرِ"
        ]
      },
      "applyStep": "أَرْسُمُ كَوَاكِبَ المَجْمُوعَةِ الشَّمْسِيَّةِ الثَّمَانِيَةَ بِالتَّرْتِيبِ مِنْ عُطَارِدَ إِلَى نِبْتُونَ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt18.jpg",
      "title": "الدَّرْسُ (2): التَّوَازُنُ المَرْكَزِيُّ (المَسَارُ الثَّانِي) + الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ",
      "subtitle": "الوَقْتُ: 30 دَقِيقَةً يَوْمِيًّا | الهَدَفُ: طَاقَةٌ، مُرُونَةٌ، وَقُوَّةٌ مُتَكَامِلَةٌ",
      "slideText": "⚖️🕌 الدَّرْسُ (2) التَّوَازُنُ المَرْكَزِيُّ (المَسَارُ الثَّانِي — 30 دَقِيقَةً يَوْمِيًّا): (1) ضَبْطُ الطَّاقَةِ: التَّنَفُّسُ البَطْنِيُّ العَمِيقُ. (2) فَكُّ ضَغْطِ الفَقَرَاتِ: فَتْحُ مَفَاصِلِ الحَوْضِ وَالكَتِفَيْنِ. (3) البِنَاءُ العَضَلِيُّ: تَمْرِينُ القُرْفُصَاءِ (Squats). (4) تَقْوِيَةُ الاتِّزَانِ: المَشْيُ بِدِقَّةٍ عَلَى خَطٍّ مُسْتَقِيمٍ. (5) الاسْتِجَابَةُ العَصَبِيَّةُ: التَّوَافُقُ الحَرَكِيُّ بَيْنَ العَيْنِ وَاليَدِ. (6) التَّدَفُّقُ وَالاسْتِرْخَاءُ: تَمَدُّدٌ خَفِيفٌ وَاسْتِرْخَاءٌ عَضَلِيٌّ. • ثَانِيًا: الهَنْدَسَةُ الحَرَكِيَّةُ لِلْعِبَادَةِ — الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ (التَّأْرِيضُ): الِاعْتِمَادُ عَلَى الأَعْضَاءِ السَّبْعَةِ لِلسُّجُودِ، تَدَفُّقُ الدَّمِ لِلْفَصِّ الأَمَامِيِّ لِلدِّمَاغِ، وَتَفْرِيغُ الشِّحْنَاتِ السَّاكِنَةِ لِلْأَرْضِ.",
      "q1": {
        "q": "مَا الفَوَائِدُ الطِّبِّيَّةُ وَالفِيزْيَائِيَّةُ لِلسُّجُودِ عَلَى الأَعْضَاءِ السَّبْعَةِ فِي (الهَنْدَسَةِ الحَرَكِيَّةِ لِلْعِبَادَةِ)؟",
        "focusWord": "الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ",
        "options": [
          {
            "text": "تَدَفُّقُ الدَّمِ وَالأُكْسِجِينِ لِلْفَصِّ الأَمَامِيِّ لِلدِّمَاغِ، وَتَفْرِيغُ الشِّحْنَاتِ الكَهْرَبَائِيَّةِ السَّاكِنَةِ لِلْأَرْضِ (التَّأْرِيضُ)",
            "correct": true
          },
          {
            "text": "إِجْهَادُ الرَّقَبَةِ",
            "correct": false
          },
          {
            "text": "تَقْلِيلُ التَّرْكِيزِ",
            "correct": false
          },
          {
            "text": "شَدُّ الأَعْصَابِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا تَمْرِينُ البِنَاءِ العَضَلِيِّ وَتَمْرِينُ الاتِّزَانِ فِي الدَّرْسِ الثَّانِي (التَّوَازُنِ المَرْكَزِيِّ)؟",
        "focusWord": "القُرْفُصَاءُ وَالمَشْيُ عَلَى خَطٍّ",
        "options": [
          {
            "text": "تَمْرِينُ القُرْفُصَاءِ (Squats) لِلْبِنَاءِ العَضَلِيِّ، وَالمَشْيُ بِدِقَّةٍ عَلَى خَطٍّ مُسْتَقِيمٍ لِتَقْوِيَةِ الاتِّزَانِ",
            "correct": true
          },
          {
            "text": "النَّوْمُ الطَّوِيلُ",
            "correct": false
          },
          {
            "text": "القَفْزُ العَشْوَائِيُّ",
            "correct": false
          },
          {
            "text": "حَبْسُ النَّفَسِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَمْ عَدَدُ أَعْضَاءِ السُّجُودِ الَّتِي تَرْتَكِزُ عَلَى الأَرْضِ فِي الصَّلَاةِ؟",
        "focusWord": "الأَعْضَاءُ السَّبْعَةُ",
        "options": [
          {
            "text": "سَبْعَةُ أَعْضَاءٍ (الجَبْهَةُ، وَالكَفَّانِ، وَالرُّكْبَتَانِ، وَإِبْهَامَا القَدَمَيْنِ)",
            "correct": true
          },
          {
            "text": "عُضْوَانِ فَقَطْ",
            "correct": false
          },
          {
            "text": "أَرْبَعَةُ أَعْضَاءٍ فَقَطْ",
            "correct": false
          },
          {
            "text": "عَشَرَةُ أَعْضَاءٍ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "البِنَاءُ العَضَلِيُّ فِي التَّوَازُنِ المَرْكَزِيِّ",
          "left": "تَمْرِينُ القُرْفُصَاءِ (Squats)"
        },
        {
          "right": "الاسْتِجَابَةُ العَصَبِيَّةُ",
          "left": "التَّوَافُقُ الحَرَكِيُّ بَيْنَ العَيْنِ وَاليَدِ"
        },
        {
          "right": "الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ (التَّأْرِيضُ)",
          "left": "تَدَفُّقُ الدَّمِ لِلْفَصِّ الأَمَامِيِّ وَتَفْرِيغُ الشِّحْنَاتِ السَّاكِنَةِ لِلْأَرْضِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَنَاصِرَ الدَّرْسِ الثَّانِي (التَّوَازُنِ المَرْكَزِيِّ وَالهَنْدَسَةِ الطِّبِّيَّةِ لِلسُّجُودِ):",
        "correct": [
          "التَّنَفُّسُ البَطْنِيُّ العَمِيقُ وَفَتْحُ المَفَاصِلِ",
          "تَمْرِينُ القُرْفُصَاءِ (Squats)",
          "المَشْيُ بِدِقَّةٍ عَلَى خَطٍّ مُسْتَقِيمٍ",
          "السُّجُودُ عَلَى الأَعْضَاءِ السَّبْعَةِ وَالتَّأْرِيضُ"
        ],
        "wrong": [
          "النَّقْرُ السَّرِيعُ فِي السُّجُودِ دُونَ طُمَأْنِينَةٍ",
          "تَقْوِيسُ الظَّهْرِ فِي القُرْفُصَاءِ"
        ]
      },
      "applyStep": "أُتِمُّ سُجُودِي عَلَى الأَعْضَاءِ السَّبْعَةِ بِطُمَأْنِينَةٍ وَأُطَبِّقُ تَمْرِينَ التَّنَفُّسِ البَطْنِيِّ وَالقُرْفُصَاءِ."
    }
  },
  {
    "w": 19,
    "secNum": 5,
    "heavenName": "سَمَاءُ الأَرْبِعَاءِ الخَامِسَةُ (ف ص ق ر)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الخَامِسَةُ: عُلُومُ الفَلَكِ وَالفَضَاءِ وَالنِّظَامِ الشَّمْسِيِّ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "ق",
    "jummal": 100,
    "prophet": "إِسْحَاقُ (ع)",
    "virtue": "البَرَكَةُ",
    "unitHeader": "الوَحْدَةُ التَّاسِعَةَ عَشْرَةَ : نَبِيُّ اللهِ إِسْحَاقُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "بَارَكَ اللهُ فِي نَبِيِّهِ إِسْحَاقَ (ع) وَجَعَلَ فِي ذُرِّيَّتِهِ الأَنْبِيَاءَ وَالصَّالِحِينَ، وَكَانَ إِمَامًا يَهْدِي النَّاسَ بِأَمْرِ اللهِ إِلَى إِقَامِ الصَّلَاةِ وَإِيتَاءِ الزَّكَاةِ وَفِعْلِ الخَيْرَاتْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (حَرَارَةُ الضِّيَافَةِ وَالشُّكْرِ مُقَابِلَ نَارِ العَذَابِ): شَوْيُ إِبْرَاهِيمَ لِلعِجْلِ الحَنِيذِ عَلَى الحِجَارَةِ المُحْمَاةِ إِكْرَامًا لِلضُّيُوفِ المَلَائِكَةِ الَّذِينَ جَاؤُوا بِبِشَارَةِ إِسْحَاقَ، وَنُورُ النُّبُوَّةِ وَالهِدَايَةِ فِي بَيْتِ إِبْرَاهِيمَ وَإِسْحَاقَ؛ وَفِي مُقَابِلِهَا نَارُ الحِجَارَةِ المَنْضُودَةِ الَّتِي حَمَلَتْهَا المَلَائِكَةُ لِإِهْلَاكِ المُفْسِدِينَ. B. الرِّيحُ (تَبْدِيدُ وَهْمِ اليَأْسِ بِنَفَسِ البُشْرَى): رِيحُ التَّعَجُّبِ وَالاسْتِبْعَادِ البَشَرِيِّ حِينَ قَالَتْ سَارَةُ: ﴿أَأَلِدُ وَأَنَا عَجُوزٌ وَهَٰذَا بَعْلِي شَيْخًا إِنَّ هَٰذَا لَشَيْءٌ عَجِيبٌ﴾، فَبَدَّدَتْهَا المَلَائِكَةُ بِنَفَسِ اليَقِينِ: ﴿أَتَعْجَبِينَ مِنْ أَمْرِ اللَّهِ رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ﴾. C. التُّرَابُ (العَقْلُ وَالعِلْمُ وَالأَرْضُ المُبَارَكَةُ): بُشْرَى إِسْحَاقَ بِأَنَّهُ «غُلَامٌ عَلِيمٌ» صَاحِبُ عَقْلٍ وَحِكْمَةٍ، وَإِحْيَاءُ رَحِمِ سَارَةَ بَعْدَ اليُبُوسَةِ كَمَا تُحْيَا الأَرْضُ المَيْتَةُ، وَسُكْنَى إِسْحَاقَ فِي الأَرْضِ المُقَدَّسَةِ (الشَّامِ وَفِلَسْطِينَ) وَمَدْفَنُهُ فِي مَغَارَةِ المَكْفِيلَةِ بِالخَلِيلِ مَعَ أَبِيهِ وَأُمِّهِ وَوَلَدِهِ يَعْقُوبَ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَالبَرَكَةُ المُمْتَدَّةُ): طَاعَةُ إِسْحَاقَ التَّامَّةُ لِلهِ وَلِأَبِيهِ إِبْرَاهِيمَ، وَحَفْرُهُ لِآبَارِ المَاءِ العَذْبِ فِي الشَّامِ لِسَقْيِ النَّاسِ وَالأَنْعَامِ بِتَوَاضُعٍ وَسَلَامٍ، وَإِفَاضَةُ مَاءِ الرَّحْمَةِ وَالبَرَكَاتِ الإِلٰهِيَّةِ عَلَى أَهْلِ البَيْتِ (﴿وَجَعَلْنَا لَهُمْ لِسَانَ صِدْقٍ عَلِيًّا﴾).",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الأَرْبِعَاءِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ تِسْعَةَ عَشَرَ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلِ وَالعِلْمِ الرَّاسِخِ وَالبَرَكَةِ المُقَدَّسَةْ، وَهُوَ الغُلَامُ العَلِيمُ نَبِيُّ اللهِ إِسْحَاقْ. كَانَ أَبُوهُ إِبْرَاهِيمُ الخَلِيلُ عَلَيْهِ السَّلَامُ يُحِبُّ إِكْرَامَ الضُّيُوفِ فِي الأَرْضِ المُبَارَكَةِ بِالشَّامِ، وَفِي يَوْمٍ جَاءَتْهُ المَلَائِكَةُ الكِرَامُ جِبْرِيلُ وَمِيكَائِيلُ وَإِسْرَافِيلُ فِي صُورَةِ ضُيُوفٍ حِسَانِ الوُجُوهِ فَـقَدَّمَ لَهُمُ التَّحِيَّةَ وَالسَّلَامْ، وَرَاغَ إِلَى أَهْلِهِ فَجَاءَ بِعِجْلٍ سَمِينٍ حَنِيذٍ مَشْوِيٍّ عَلَى الرَّضْفِ وَالحِجَارَةِ السَّاخِنَةِ فَـقَرَّبَهُ إِلَيْهِمْ بِكَرَمٍ وَأَدَبٍ وَقَالَ أَلَا تَأْكُلُونْ. فَلَمَّا رَأَى أَيْدِيَهُمْ لَا تَصِلُ إِلَى الطَّعَامِ أَوْجَسَ مِنْهُمْ خِيفَةً، فَقَالُوا لَا تَخَفْ إِنَّا رُسُلُ رَبِّكَ مِنَ المَلَائِكَةِ، وَبَشَّرُوهُ بِغُلَامٍ عَلِيمٍ هُوَ إِسْحَاقُ وَمِنْ وَرَاءِ إِسْحَاقَ يَعْقُوبْ!",
      "وَكَانَتْ أُمُّهُ السَّيِّدَةُ الصَّالِحَةُ سَارَةُ قَائِمَةً تَسْمَعُ كَلَامَ المَلَائِكَةِ، فَضَحِكَتْ مُسْتَبْشِرَةً وَأَقْبَلَتْ فِي رَنَّةٍ وَصَكَّتْ وَجْهَهَا تَعَجُّبًا وَقَالَتْ يَا وَيْلَتَى أَأَلِدُ وَأَنَا عَجُوزٌ عَقِيمٌ ابْنَةُ تِسْعِينَ سَنَةً وَهٰذَا بَعْلِي شَيْخًا كَبِيرًا إِنَّ هٰذَا لَشَيْءٌ عَجِيبْ! قَالُوا أَتَعْجَبِينَ مِنْ أَمْرِ اللهِ رَحْمَتُ اللهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ البَيْتِ إِنَّهُ حَمِيدٌ مَجِيدْ. فَـصَدَقَ وَعْدُ اللهِ وَأَشْرَقَ نُورُ الوَجْهِ فِي جَبِينِ سَارَةَ، وَوُلِدَ إِسْحَاقُ بَعْدَ أَخِيهِ إِسْمَاعِيلَ عَطَاءً وَنَافِلَةً مِنَ الرَّحْمٰنِ، فَـقَبِلَ إِبْرَاهِيمُ النِّعْمَةَ سَاجِدًا وَقَالَ الحَمْدُ لِلهِ الَّذِي وَهَبَ لِي عَلَى الكِبَرِ إِسْمَاعِيلَ وَإِسْحَاقَ إِنَّ رَبِّي لَسَمِيعُ الدُّعَاءِ، رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءْ.",
      "نَشَأَ إِسْحَاقُ فِي حِضْنِ النُّبُوَّةِ شَابًّا عَاقِلًا حَلِيمًا قَدْ وَهَبَهُ اللهُ لِسَانَ صِدْقٍ عَلِيًّا وَعُقُولَ الحُكَمَاءِ الأَبْرَارْ. وَجَعَلَهُ اللهُ نَبِيًّا مِنَ الصَّالِحِينَ وَأَوْحَى إِلَيْهِ وَإِلَى أَبِيهِ وَابْنِهِ يَعْقُوبَ فِعْلَ الخَيْرَاتِ وَإِقَامَ الصَّلَاةِ وَإِيتَاءَ الزَّكَاةِ، وَأَخْلَصَهُمْ بِخَالِصَةٍ ذِكْرَى الدَّارِ الآخِرَةِ وَجَعَلَهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِهِ لَمَّا صَبَرُوا وَكَانُوا بِآيَاتِ اللهِ يُوقِنُونْ. وَسَافَرَ إِسْحَاقُ مَعَ أَبِيهِ حَاجًّا إِلَى الكَعْبَةِ المُشَرَّفَةِ فِي مَكَّةَ وَالْتَقَى بِأَخِيهِ إِسْمَاعِيلَ فِي مَحَبَّةٍ وَوِئَامْ، وَعِنْدَمَا حَضَرَتْ إِبْرَاهِيمَ الوَفَاةُ جَمَعَ بَنِيهِ وَأَوْصَاهُمْ بِالثَّبَاتِ عَلَى التَّوْحِيدِ وَمَحَبَّةِ النَّبِيِّ الخَاتَمِ مُحَمَّدٍ وَأَهْلِ بَيْتِهِ الأَطْهَارْ.",
      "عَاشَ نَبِيُّ اللهِ إِسْحَاقُ فِي أَرْضِ الشَّامِ وَفِلَسْطِينَ المُبَارَكَةِ يَزْرَعُ التُّرَابَ الطَّيِّبَ فَيُبَارِكُ اللهُ فِي زَرْعِهِ مِائَةَ ضِعْفٍ وَيَحْفِرُ آبَارَ المَاءِ العَذْبِ لِيَسْقِيَ النَّاسَ وَالأَنْعَامَ، وَإِذَا نَازَعَهُ الجُهَّالُ عَلَى بِئْرٍ تَرَكَهَا لَهُمْ بِحِلْمٍ وَسَلَامٍ وَحَفَرَ غَيْرَهَا حَتَّى أَحَبَّهُ الجَمِيعُ وَعَرَفُوا أَنَّ مَعَهُ تَأْيِيدَ المَلِكِ الخَلَّاقْ. وَتَزَوَّجَ إِسْحَاقُ السَّيِّدَةَ رِفْقَا بِنْتَ بَتُوئِيلَ فَدَعَا رَبَّهُ فَـرَزَقَ اللهُ نَبِيَّهُ تَوْأَمَيْنِ هُمَا عِيصُو وَيَعْقُوبُ المُلَقَّبُ بِإِسْرَائِيلْ.",
      "وَلَمَّا كَبِرَ إِسْحَاقُ وَضَعُفَ بَصَرُهُ أَرَادَ أَنْ يَدْعُوَ بِدَعْوَةِ البَرَكَةِ النَّبَوِيَّةِ، فَدَبَّرَ اللهُ بِحِكْمَتِهِ أَنْ تَقَدَّمَ يَعْقُوبُ بِطَعَامٍ طَيِّبٍ لِأَبِيهِ، فَمَسَحَ إِسْحَاقُ عَلَى يَعْقُوبَ وَدَعَا لَهُ أَنْ يَجْعَلَ اللهُ النُّبُوَّةَ وَالكِتَابَ وَالأَسْبَاطَ الاثْنَيْ عَشَرَ فِي ذُرِّيَّتِهْ. وَلَمَّا جَاءَ أَخُوهُ عِيصُو غَضِبَ فِي البِدَايَةِ، فَوَعَظَهُ أَبُوهُ إِسْحَاقُ بِحِكْمَةٍ وَهُدُوءٍ كَمَا رَوَى الإِمَامُ الصَّادِقُ عَلَيْهِ السَّلَامُ وَدَعَا لِعِيصُو أَنْ يُكْثِرَ اللهُ نَسْلَهُ وَيُوَسِّعَ رِزْقَهُ فِي الأَرْضِ وَأَوْصَى يَعْقُوبَ بِالمَسِيرِ إِلَى أَخْوَالِهِ حَتَّى يَسْكُنَ غَضَبُ أَخِيهِ وَيَسُودَ الوِفَاقْ.",
      "وَمِنْ حِكْمَةِ إِسْحَاقَ وَرَحْمَتِهِ أَنَّهُ مَرَّ يَوْمًا مَعَ سَائِلٍ فَقِيرٍ وَرَأَى رَجُلًا بَخِيلًا يَأْكُلُ ثَلَاثَةَ أَرْغِفَةٍ وَيَمْنَعُ السَّائِلَ أَنْ يَتَصَدَّقَ عَلَيْهِ بِرَغِيفٍ وَاحِدٍ، فَوَعَظَهُ إِسْحَاقُ وَبَيَّنَ لِلنَّاسِ أَنَّ الصَّدَقَةَ تَدْفَعُ البَلَاءَ وَتَحْفَظُ النِّعْمَةْ. وَاعْتَقَدَ أَبْنَاءُ يَعْقُوبَ وَالأَسْبَاطُ بِتَوْحِيدِ اللهِ كَمَا قَالُوا لِأَبِيهِمْ نَعْبُدُ إِلٰهَكَ وَإِلٰهَ آبَائِكَ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ إِلٰهًا وَاحِدًا وَنَحْنُ لَهُ مُسْلِمُونْ. وَتَعَلَّمَ المُؤْمِنُونَ مِنْ سِيرَتِهِ أَنَّ اللهَ يُحَقِّقُ وَعْدَهُ لِلصَّادِقِينَ وَيُنْجِي كُلَّ عَبْدٍ ذِي تَقْوَى يَخَافُ عِقَابَ رَبِّهِ وَيَثْبُتُ عَلَى دِينِ اللهِ فَلَا يَشُقُّ عَصَا الطَّاعَةِ، بَلْ يَكُونُ هُوَ لِلْخَيْرِ سَبَّاقٌ أَمِينْ، وَعَاشَ نَبِيُّ اللهِ إِسْحَاقُ مِائَةً وَثَمَانِينَ سَنَةً يُعَلِّمُ النَّاسَ الحِكْمَةَ حَتَّى تَوَفَّاهُ اللهُ وَدَفَنَهُ ابْنَاهُ يَعْقُوبُ وَعِيصُو فِي مَغَارَةِ الخَلِيلِ بِجِوَارِ أَبِيهِ إِبْرَاهِيمَ وَأُمِّهِ سَارَةَ فِي أَمَانٍ وَنُورٍ مُشْرِقٍ."
    ],
    "words": [
      {
        "word": "تَقْوَى",
        "desc": "وسط متصل / ساكن: ـقْـ",
        "raw": "تَقْوَى (وسط متصل / ساكن: ـقْـ)"
      },
      {
        "word": "إِسْحَاقْ",
        "desc": "آخر منفصل / ساكن وقفا: قْ",
        "raw": "إِسْحَاقْ (آخر منفصل / ساكن وقفا: قْ)"
      },
      {
        "word": "قَدَّمَ",
        "desc": "أول منفصل / متحرك بالفتح: قَـ",
        "raw": "قَدَّمَ (أول منفصل / متحرك بالفتح: قَـ)"
      },
      {
        "word": "فَقَرَّبَهُ",
        "desc": "أول متصل / متحرك بالفتح: ـقَـ",
        "raw": "فَقَرَّبَهُ (أول متصل / متحرك بالفتح: ـقَـ)"
      },
      {
        "word": "قَبِلَ",
        "desc": "أول منفصل / متحرك بالفتح: قَـ",
        "raw": "قَبِلَ (أول منفصل / متحرك بالفتح: قَـ)"
      },
      {
        "word": "رَزَقَ",
        "desc": "وسط/آخر منفصل / متحرك بالفتح: قَ",
        "raw": "رَزَقَ (وسط/آخر منفصل / متحرك بالفتح: قَ)"
      },
      {
        "word": "صَدَقَ",
        "desc": "آخر متصل / متحرك بالفتح: ـقَ",
        "raw": "صَدَقَ (آخر متصل / متحرك بالفتح: ـقَ)"
      },
      {
        "word": "قُلُوبَ",
        "desc": "أول منفصل / متحرك بالضم: قُـ",
        "raw": "قُلُوبَ (أول منفصل / متحرك بالضم: قُـ)"
      },
      {
        "word": "سَبَّاقٌ",
        "desc": "آخر منفصل / متحرك بالضم: قٌ",
        "raw": "سَبَّاقٌ (آخر منفصل / متحرك بالضم: قٌ)"
      },
      {
        "word": "قِيلَ",
        "desc": "أول منفصل / متحرك بالكسر: قِـ",
        "raw": "قِيلَ (أول منفصل / متحرك بالكسر: قِـ)"
      },
      {
        "word": "حَقَّقَ",
        "desc": "وسط متصل / مضعف بالفتح: ـقَّـ",
        "raw": "حَقَّقَ (وسط متصل / مضعف بالفتح: ـقَّـ)"
      },
      {
        "word": "يَشُقُّ",
        "desc": "آخر متصل / مضعف بالضم: ـقُّ",
        "raw": "يَشُقُّ (آخر متصل / مضعف بالضم: ـقُّ)"
      },
      {
        "word": "يُحَقِّقُ",
        "desc": "وسط متصل / مضعف بالكسر: ـقِّـ",
        "raw": "يُحَقِّقُ (وسط متصل / مضعف بالكسر: ـقِّـ)"
      },
      {
        "word": "قَائِمَةً",
        "desc": "أول منفصل / ممدود بالألف: قَا",
        "raw": "قَائِمَةً (أول منفصل / ممدود بالألف: قَا)"
      },
      {
        "word": "عُقُولَ",
        "desc": "وسط متصل / ممدود بالواو: ـقُو",
        "raw": "عُقُولَ (وسط متصل / ممدود بالواو: ـقُو)"
      },
      {
        "word": "مُقِيمَ",
        "desc": "وسط متصل / ممدود بالياء: ـقِي",
        "raw": "مُقِيمَ (وسط متصل / ممدود بالياء: ـقِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ القَافِ (ق): النُّطْقُ السَّلِيمُ لِحَرْفِ القَافِ المَجْهُورِ المُفَخَّمِ ذِي القَلْقَلَةِ الوَاضِحَةِ عِنْدَ السُّكُونِ مِنْ مَخْرَجِ أَقْصَى اللِّسَانِ مَعَ مَا يُحَاذِيهِ مِنَ الحَنَكِ الأَعْلَى اللَّحْمِيِّ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الحَمْدِ وَالشُّكْرِ: ﴿الْحَمْدُ لِلَّهِ الَّذِي وَهَبَ لِي عَلَى الْكِبَرِ إِسْمَاعِيلَ وَإِسْحَاقَ إِنَّ رَبِّي لَسَمِيعُ الدُّعَاءِ﴾، وَدُعَاءِ الذُّرِّيَّةِ الطَّيِّبَةِ وَإِقَامِ الصَّلَاةِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الحَلْقَةُ العَمِيقَةُ وَالنُّقْطَتَانِ العُلْوِيَّتَانِ وَالشَّكْلُ التِّسْعَ عَشَرِيُّ: مُشَاهَدَةُ شَكْلِ حَرْفِ القَافِ (ق / قـ / ـقـ / ـق) المُرَكَّبِ مِنْ رَأْسٍ دَائِرِيٍّ وَكَأْسٍ عَمِيقَةٍ نِصْفِ دَائِرِيَّةٍ تَنْزِلُ تَحْتَ السَّطْرِ (تَمْيِيزًا لَهَا عَنْ صَحْنِ الفَاءِ المُنْبَسِطِ) وَفَوْقَهَا نُقْطَتَانِ مُتَجَاوِرَتَانِ كَالْأَخَوَيْنِ (إِسْمَاعِيلَ وَإِسْحَاقَ، أَوْ وَلَدَيْ إِسْحَاقَ التَّوْأَمَيْنِ: يَعْقُوبَ وَعِيصُو)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (19) (المُؤَلَّفِ مِنْ وَاحِدٍ وَتِسْعَةٍ، وَالمُوَافِقِ لِعددِ حُرُوفِ البَسْمَلَةِ الشَّرِيفَةِ: 19 حَرْفًا)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ البِشَارَةِ الكُبْرَى وَمِيثَاقِ النُّبُوَّةِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ إِسْحَاقَ الكَامِلَةِ فِي القُرْآنِ الكَرِيمِ (فِي 17 مَوْضِعًا) وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ البُشْرَى الطَّيِّبَةِ وَوَصَايَا الآبَاءِ لِلأَبْنَاءِ بِالثَّبَاتِ عَلَى التَّوْحِيدِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ تِسْعَةَ عَشَرَ (19) وَالمِائَةُ (100): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (19) وَالانتِقَالِ الكَبِيرِ فِي حِسَابِ الجُمَّلِ إِلَى مَرْتَبَةِ المِئَاتِ مَعَ حَرْفِ القَافِ (ق = 100 = عَشْرُ عَشَرَاتٍ كَامِلَةٍ)، وَحِسَابِ أَعْمَارِ البِشَارَةِ (إِبْرَاهِيمُ 120 أَوْ 100 سَنَةٍ، وَسَارَةُ 90 سَنَةً، وَعُمُرُ إِسْحَاقَ 180 سَنَةً)، وَتَدْرِيبُ اليَدِ عَلَى تَقْدِيمِ الضِّيَافَةِ السَّرِيعَةِ لِلضَّيْفِ، وَالزِّرَاعَةِ وَحَفْرِ السَّوَاقِي."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ القِيَامِ لِخِدْمَةِ الضَّيْفِ وَالسَّعْيِ فِي الحَجِّ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى خِفَّةِ الحَرَكَةِ وَالقِيَامِ النَّشِيطِ لِخِدْمَةِ الضُّيُوفِ وَالوَالِدَيْنِ (كَمَا قَامَتْ سَارَةُ تَخْدُمُ ضُيُوفَ إِبْرَاهِيمَ: ﴿وَامْرَأَتُهُ قَائِمَةٌ﴾)، وَرِيَاضَةِ المَشْيِ المُبَارَكِ مِنْ أَرْضِ الشَّامِ إِلَى مَكَّةَ المُكَرَّمَةِ لِأَدَاءِ مَنَاسِكِ الحَجِّ وَزِيَارَةِ أَخِيهِ إِسْمَاعِيلَ عِنْدَ الكَعْبَةِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الشِّوَاءِ الصِّحِّيِّ عَلَى الحَجَرِ (العِجْلِ الحَنِيذِ) وَبَرَكَةِ الزَّرْعِ: تَعَلُّمُ الطَّرِيقَةِ الصِّحِّيَّةِ فِي طَهْيِ اللَّحْمِ (الحَنِيذِ المَشْوِيِّ عَلَى الحِجَارَةِ السَّاخِنَةِ بِدُونِ دُخَانٍ مُحْتَرِقٍ حَتَّى يَسِيلَ دَسَمُهُ وَيَنْضَجَ)، وَمَعْرِفَةِ فَوَائِدِ الأَلْبَانِ وَالثِّمَارِ فِي الأَرْضِ المُقَدَّسَةِ، وَأَدَبِ تَقْرِيبِ الطَّعَامِ لِلضَّيْفِ بِرِفْقٍ: ﴿أَلَا تَأْكُلُونَ﴾."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ المَحَبَّةِ الأَخَوِيَّةِ وَالصَّدَقَةِ وَالتَّسْلِيمِ لِقَضَاءِ اللهِ: تَعَلُّمُ خُلُقِ المَحَبَّةِ وَالتَّآخِي بَيْنَ الإِخْوَةِ (كَمَا كَانَ بَيْنَ إِسْمَاعِيلَ وَإِسْحَاقَ مِنْ وُدٍّ وَتَعَاوُنٍ)، وَآدَابِ التَّبَسُّمِ اللَّطِيفِ وَإِكْرَامِ الضَّيْفِ وَالسَّائِلِ، وَالرِّضَا التَّامِّ بِمَا قَسَمَهُ اللهُ مِنْ مَوَاهِبَ وَوَصَايَا."
      }
    },
    "grammar": {
      "topic": "التَّحْوِيلُ الذَّكِيُّ بَيْنَ الجُمْلَةِ الاِسْمِيَّةِ وَالجُمْلَةِ الفِعْلِيَّةْ",
      "rule": "إِذَا بَدَأْنَا بِالاِسْمِ صَارَتِ الجُمْلَةُ اسْمِيَّةً (القَمَرُ طَلَعَ)، وَإِذَا بَدَأْنَا بِالفِعْلِ صَارَتِ الجُمْلَةُ فِعْلِيَّةً (طَلَعَ القَمَرُ).",
      "example": "الفَلَّاحُ يَحْصُدُ القَمْحَ (اسْمِيَّةٌ) ⬅️ يَحْصُدُ الفَلَّاحُ القَمْحَ (فِعْلِيَّةٌ).",
      "focusWord": "طَلَعَ القَمَرُ / القَمَرُ طَلَعَ",
      "q": "حَوِّلِ الجُمْلَةَ الاِسْمِيَّةَ «المَطَرُ يَنْزِلُ» إِلَى جُمْلَةٍ فِعْلِيَّةْ:",
      "opts": [
        "يَنْزِلُ المَطَرُ",
        "المَطَرُ غَزِيرٌ",
        "فِي المَطَرِ",
        "هٰذَا مَطَرٌ"
      ]
    },
    "earIirab": {
      "topic": "ثَبَاتُ الضَّمَّةِ عَلَى الاِسْمِ: مُبْتَدَأً أَوْ فَاعِلًا",
      "rule": "كَلِمَةُ (القَمَرُ) مَرْفُوعَةٌ بِالضَّمَّةِ سَوَاءٌ أَجَاءَتْ مُبْتَدَأً فِي (القَمَرُ أَنَارَ) أَمْ فَاعِلًا فِي (أَنَارَ القَمَرُ).",
      "sentence": "أَشْرَقَ القَمَرُ فِي اللَّيْلِ.",
      "targetWord": "القَمَرُ",
      "caseAns": "فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ (ـُ)"
    },
    "math": {
      "numVal": 100,
      "numName": "مِائَةٌ",
      "eqDisplay": "90 + 10 = 100",
      "subDisplay": "100 - 10 = 90",
      "compDisplay": "100 > 99",
      "q1": {
        "stem": "مَا هُوَ اسْمُ العَدَدِ (100) بِالعَرَبِيَّةِ؟",
        "focus": "100",
        "ans": "مِائَةٌ",
        "wrong": [
          "عَشَرَةٌ",
          "تِسْعُونَ",
          "خَمْسُونَ"
        ]
      },
      "q2": {
        "stem": "احْسِبْ مَا يُكْمِلُ المِائَةَ:",
        "focus": "90 + 10 = ؟",
        "ans": "100 (مِائَةٌ)",
        "wrong": [
          "80 (ثَمَانُونَ)",
          "99",
          "95"
        ]
      }
    },
    "sport": {
      "title": "القُرْفُصَاءُ الصِّحِّيَّةُ السَّلِيمَةُ",
      "middleText": "أَثْنِي رُكْبَتَيَّ فِي جِلْسَةِ القُرْفُصَاءِ مَعَ إِبْقَاءِ الظَّهْرِ مُسْتَقِيمًا وَالكَعْبَيْنِ عَلَى الأَرْضِ ثُمَّ أَقِفُ بِنَشَاطْ. يُقَوِّي هٰذَا التَّمْرِينُ عَضَلَاتِ الفَخِذَيْنِ وَالحَوْضِ وَيَحْفَظُ مَرَانَةَ الرُّكْبَتَيْنْ."
    },
    "sci": {
      "title": "القَمَرُ وَأَطْوَارُهُ وَالظَّوَاهِرُ الفَلَكِيَّةُ",
      "summaryThird": "يَدُورُ القَمَرُ حَوْلَ الأَرْضِ كُلَّ شَهْرٍ قَمَرِيٍّ وَيَعْكِسُ نُورَ الشَّمْسِ، فَنَرَاهُ يَبْدَأُ هِلَالًا ثُمَّ تَرْبِيعًا ثُمَّ بَدْرًا مُكْتَمِلًا، وَتُحْدِثُ جَاذِبِيَّتُهُ ظَاهِرَةَ المَدِّ وَالجَزْرِ فِي البِحَارْ.",
      "focusConcept": "أَطْوَارُ القَمَرِ (الهِلَالُ وَالبَدْرُ)",
      "factAns": "انْعِكَاسُ ضَوْءِ الشَّمْسِ أَثْنَاءَ دَوَرَانِ القَمَرْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الجَلِيسِ وَالأُلْفَةِ (حُور وَسُرُور - 19)",
      "storySentence": "تَعَلَّمَتْ حُورُ وَسُرُورٌ أَنَّ مِنْ حَقِّ الجَلِيسِ وَالصَّاحِبِ أَنْ نَلْقَاهُ بِوَجْهٍ بَشُوشٍ، وَنَفْسَحَ لَهُ فِي المَجْلِسِ، وَنَحْفَظَ وُدَّهُ وَسِرَّهْ.",
      "applyAction": "أَبْتَسِمُ لِجَلِيسِي وَأَتَحَدَّثُ مَعَهُ بِأَدَبٍ وَمَوَدَّةْ."
    },
    "rightsFullTitle": "(26) حق المنعم على مولاه + (27) حق المولى الجارية عليه نعمتك + (28) حق ذي المعروف",
    "rightsQuote": "وَأَمّــــــــــــا حَقُّ الْمُنْعِمِ عَلَيْكَ بالْولاءِ  فَــأَنْ تَعْلَمَ أَنّهُ أَنفَقَ فِيكَ مَالَـــهُ، وَأَخرَجَكَ مِن ذُلِّ الرِّقِ وَوَحْشَــــــــــــــتِهِ إلَى عِزِّ الحُرِّيةِ وأُنسِهـــــا، وَأَطْلَقَكَ مِنْ أَسْرِ الْمِلْكَةِ، وَفَـــــكَّ عَنْكَ حـــــِلَقَ الْعُبُودِيَّةِ ، وَأَوْجَدَكَ رَائِحَة الْعِزِّ، وَأَخرَجَكَ مِنْ سِجْنِ القَهْرِ، وَدَفَـــــــــــعَ عَنْكَ الْعُسْرَ، وبَسَطَ لَكَ لِسَـــــــــــانَ الإنْصَافِ، وَأَبَاحَكَ الدُنْيَــــــــا كُلَّهَا فَمَلَّكَكَ نفْسَــــــكَ، وَحَلَّ أَسْرَكَ، وَفَرَّغَكَ لِعِبَادَةِ رَبكَ، وَاحْتَمَلَ بذَلِكَ التَّقْصِيرَ فِي مَالِهِ، فَتَعْلَـــــــــــمَ أَنّهُ أَوْلَى الخَلْقِ بكَ بَعْـــــدَ أُولي رَحِمِكَ فِي حَيَاتِكَ وَمَوْتِكَ، وَأَحَقَّ الخَــــــــــــــلْقِ بنَصْرِكَ وَمَعُونَتِكَ وَمُكَانفَتِكَ فِي ذَات اللَّهِ، فَلا تُؤثِرْ عَلَيْهِ نفْسَكَ مَا احْتَاجَ إلَيْكَ. | وَأَمَّـــــــــــــــــا حَقُّ مَوْلاكَ  الْجَارِيَةِ عَلَيْهِ نِعْمَتُكَ فَأَنْ تَعْلَمَ أَنَّ اللهَ جَعَلَكَ حَــامِيَةً عَلَيْهِ، وَوَاقِيَــــــــــــةً وناصِرًا وَمَعْقِلاً، وَجَعَلَهُ لَكَ وَسِيلَةً وَسَبَباً بَيْنَكَ وَبَيْنَهُ فَبالْحَرِيِّ أَنْ يَحْجُبَكَ عَنِ النَّــــــــــــــارِ فَيَكُونَ فِي ذَلِكَ ثَوَابٌ مِنْهُ فِي الآجِلِ، ويَحْكُمُ لَكَ بمِيرَاثِهِ فِي الْعَاجِلِ إذَا لم يَكُنْ لَهُ رَحِــــــــــــــــــمٌ، مُكَافَأَةً لِمَـــــــــــا أَنفَقْتَهُ مِنْ مَالِكَ عَلَيْــــــــــهِ وَقُمْتَ بهِ مِنْ حَقِّـــــهِ بَعْدَ إنفَاقِ مَالِكَ، فَإنْ لَمْ تَقُمْ بحَقِّهِ خِيفَ عَلَيْكَ أَنْ لا يَطِيبَ لَكَ مِيرَاثُهُ. وَلا قُوَّةَ إلا باللهِ. | وَأمّا حَقُّ ذِي المَعْرُوفِ عَلَيكَ فَـــــــأَنْ تَشْكُرَهُ وتَذْكُرَ مَعْرُوفَهُ وتَنْشُرَ لَهُ الْمَقَــــــــــالَةَ الْحَسَنَةَ، وَتُخلِصَ لَهُ الدُّعَـــــاءَ فِيمَــــا بَينَكَ وبَيْنَ اللَّهِ سُبْحَانَهُ، فَإنّكَ إذَا فَعَلْتَ ذَلِكَ كُنْتَ قَدْ شَكَرْتَهُ سِرًّا وَعَلانِيَـةً. ثُمَّ إنْ أَمْكَنَ مُكَافَأَتَهُ بالْفِعْلِ كَافَأتَهُ وإلاّ كُنْتَ مُرْصِدًا لَهُ مُوطِّنًا نَفْسَكَ عَلَيْهَا.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (26) حق المنعم على مولاه + (27) حق المولى الجارية عليه نعمتك + (28) حق ذي المعروف",
        "text": "وَأَمّــــــــــــا حَقُّ الْمُنْعِمِ عَلَيْكَ بالْولاءِ  فَــأَنْ تَعْلَمَ أَنّهُ أَنفَقَ فِيكَ مَالَـــهُ، وَأَخرَجَكَ مِن ذُلِّ الرِّقِ وَوَحْشَــــــــــــــتِهِ إلَى عِزِّ الحُرِّيةِ وأُنسِهـــــا، وَأَطْلَقَكَ مِنْ أَسْرِ الْمِلْكَةِ، وَفَـــــكَّ عَنْكَ حـــــِلَقَ الْعُبُودِيَّةِ ، وَأَوْجَدَكَ رَائِحَة الْعِزِّ، وَأَخرَجَكَ مِنْ سِجْنِ القَهْرِ، وَدَفَـــــــــــعَ عَنْكَ الْعُسْرَ، وبَسَطَ لَكَ لِسَـــــــــــانَ الإنْصَافِ، وَأَبَاحَكَ الدُنْيَــــــــا كُلَّهَا فَمَلَّكَكَ نفْسَــــــكَ، وَحَلَّ أَسْرَكَ، وَفَرَّغَكَ لِعِبَادَةِ رَبكَ، وَاحْتَمَلَ بذَلِكَ التَّقْصِيرَ فِي مَالِهِ، فَتَعْلَـــــــــــمَ أَنّهُ أَوْلَى الخَلْقِ بكَ بَعْـــــدَ أُولي رَحِمِكَ فِي حَيَاتِكَ وَمَوْتِكَ، وَأَحَقَّ الخَــــــــــــــلْقِ بنَصْرِكَ وَمَعُونَتِكَ وَمُكَانفَتِكَ فِي ذَات اللَّهِ، فَلا تُؤثِرْ عَلَيْهِ نفْسَكَ مَا احْتَاجَ إلَيْكَ. | وَأَمَّـــــــــــــــــا حَقُّ مَوْلاكَ  الْجَارِيَةِ عَلَيْهِ نِعْمَتُكَ فَأَنْ تَعْلَمَ أَنَّ اللهَ جَعَلَكَ حَــامِيَةً عَلَيْهِ، وَوَاقِيَــــــــــــةً وناصِرًا وَمَعْقِلاً، وَجَعَلَهُ لَكَ وَسِيلَةً وَسَبَباً بَيْنَكَ وَبَيْنَهُ فَبالْحَرِيِّ أَنْ يَحْجُبَكَ عَنِ النَّــــــــــــــارِ فَيَكُونَ فِي ذَلِكَ ثَوَابٌ مِنْهُ فِي الآجِلِ، ويَحْكُمُ لَكَ بمِيرَاثِهِ فِي الْعَاجِلِ إذَا لم يَكُنْ لَهُ رَحِــــــــــــــــــمٌ، مُكَافَأَةً لِمَـــــــــــا أَنفَقْتَهُ مِنْ مَالِكَ عَلَيْــــــــــهِ وَقُمْتَ بهِ مِنْ حَقِّـــــهِ بَعْدَ إنفَاقِ مَالِكَ، فَإنْ لَمْ تَقُمْ بحَقِّهِ خِيفَ عَلَيْكَ أَنْ لا يَطِيبَ لَكَ مِيرَاثُهُ. وَلا قُوَّةَ إلا باللهِ. | وَأمّا حَقُّ ذِي المَعْرُوفِ عَلَيكَ فَـــــــأَنْ تَشْكُرَهُ وتَذْكُرَ مَعْرُوفَهُ وتَنْشُرَ لَهُ الْمَقَــــــــــالَةَ الْحَسَنَةَ، وَتُخلِصَ لَهُ الدُّعَـــــاءَ فِيمَــــا بَينَكَ وبَيْنَ اللَّهِ سُبْحَانَهُ، فَإنّكَ إذَا فَعَلْتَ ذَلِكَ كُنْتَ قَدْ شَكَرْتَهُ سِرًّا وَعَلانِيَـةً. ثُمَّ إنْ أَمْكَنَ مُكَافَأَتَهُ بالْفِعْلِ كَافَأتَهُ وإلاّ كُنْتَ مُرْصِدًا لَهُ مُوطِّنًا نَفْسَكَ عَلَيْهَا. — وَفِي سِيرَةِ إِسْحَاقُ (ع): آدَابُ المَحَبَّةِ الأَخَوِيَّةِ وَالصَّدَقَةِ وَالتَّسْلِيمِ لِقَضَاءِ اللهِ: تَعَلُّمُ خُلُقِ المَحَبَّةِ وَالتَّآخِي بَيْنَ الإِخْوَةِ (كَمَا كَانَ بَيْنَ إِسْمَاعِيلَ وَإِسْحَاقَ مِنْ وُدٍّ وَتَعَاوُنٍ)، وَآدَابِ التَّبَسُّمِ اللَّطِيفِ وَإِكْرَامِ الضَّيْفِ وَالسَّائِلِ، وَالرِّضَا التَّامِّ بِمَا قَسَمَهُ اللهُ مِنْ مَوَاهِبَ وَوَصَايَا."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المنعم على مولاه",
        "text": "🌿 قصة: حرية القلوب لا تُشترى في مساء هادئ، عاد نور غاضبًا من المدرسة وهو يجرّ حقيبته بعصبية، بينما تبعته حور وفي يدها كومة من الدفاتر. قالت حور بضيق: – نور! هذا ليس عدلاً! لماذا أحمل حقيبتك طوال الطريق وأحل واجباتك ثم أرتّب غرفتك فوق ذلك؟! ابتسم نور بابتسامة انتصار: – لأنني أكبر منك، وعليك طاعتي! وقفت حور في منتصف الصالة، وضربت الأرض بقدمها: – هذا ليس حباً ولا أخوّة، هذا اسمه استعباد! سمعت الأم الحوار فاقتربت بهدوء وجلست بينهما: – تعاليا يا أبنائي.. سأحكي لكما قصة من زمن رسول الله ﷺ، قصة رجل اسمه سلمان الفارسي، لعلكما تفهمان الفرق بين الأخوّة والاستعباد. جلس نور متجهماً، بينما اقتربت حور باهتمام. قالت الأم: – سلمان كان يبحث عن الحق، فترك بلده وأهله، وبيع كعبد عند اليهود في المدينة. وحين جاء النبي ﷺ إلى المدينة، عرف سلمان أنه الحق الذي بحث عنه العمر كله. لكنه كان عبداً، لا يستطيع أن يكون حراً إلا إذا دفع ثمن حريته. سأل نور بدهشة: – يعني لم يتركوه مجاناً؟"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المنعم على مولاه",
        "text": "– لا، قالوا له: نعتقك إن زرعت ثلاثمئة نخلة ودفعت أربعين أوقية من الذهب! وكان ذلك مستحيلاً على عبد فقير… لكن ماذا فعل النبي ﷺ؟ نظر الطفلان منتظرين. تابعت الأم: – جمع الصحابة النخل شجرة شجرة، وغرسوها مع سلمان بأيديهم، ثم جاء النبي ﷺ ووضع النخل بيده فبارك الله فيه، ثم جاء صحابي بالذهب فأكمل سلمان حريته. صار سلمان إنساناً حراً، لا يملك أحد عليه سلطة بعد الله. رفعت الأم عينيها بثبات نحو نور: – هل تعرف يا نور لماذا أُعجب النبي بسلمان؟ لأنه لم يقبل أن يعيش ذليلاً، ولم يستعبد أحداً معه. الحر الحقيقي لا يُذِلّ أحداً ولا يستخدم قوته على من هم أضعف منه. خفض نور رأسه بخجل: – لكنني لم أقصد أن أذل حور… أجابته الأم برفق: – حين تجعل غيرك يعمل مكانك، ويحمل عنك ما تقدر عليه، ويخدمك بلا مقابل… فأنت تستعبده دون أن تشعر. اقتربت حور من نور وقالت: – أنا أختك يا نور، لست خادمتك. لو طلبت مساعدتي بحب، سأساعدك من قلبي، لكن لا تفرض نفسك عليّ. تنهد نور، ثم أخذ حقيبته من يدها: – أنت على حق يا حور. سامحيني. سأحل واجباتي بنفسي، وسأساعدك إن احتجتِ. ابتسمت الأم: – هكذا يكون الشكر للنّعم. من أعانك فاشكره، ومن أحبك فلا تَظلِمه. وتذكّرا: القلوب لا تُستعبد."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المولى الجارية عليه نعمتك",
        "text": "🏠 قصة: ألوان على الجدار... ودرس في القلب في أحد المساءات، صرخ الأب من غرفة المعيشة: \"أحتاجكم هنا الآن!\" اجتمع الجميع مسرعين... كانت لينا الصغيرة تتسلل خلف أمها متخفية. الأب (مشيراً للجدار بإحباط): \"أنظروا! من فعل هذا؟\" الجدار كان لوحة فوضوية:شمس مبتسمة، بيت صغير، وعصافير طائرة في كل مكان! نور (متهكماً): \"مذهل! تحول بيتنا إلى معرض فني!\" حور(تتمسك بضحكتها): \"في الحقيقة... العصافير جميلة!\" الأب (ينزل إلى مستوى لينا): \"يا حبيبتي، أتعرفين من رسم هذا؟\" لينا(تتجمد في مكانها): \"كنت أريد... أن أجعل البيت أجمل... أنا آسفة.\" الأب (يبتسم بنظرة حانية): \"رسوماتك رائعة يا مبدعتي الصغيرة... لكن هل تعرفين المشكلة؟\" لينا(تهز رأسها): \"لا... لا أعرف\" الأب: \"المشكلة أن الجدار ليس مكاناً للرسم... والحل ليس الاعتذار فقط!\" لينا(بعيون دامعة): \"ماذا أفعل؟\" الأب (ينظر للجميع): \"سنقوم بمشروع عائلي... إعادة تلوين الجدار! من ينضم؟\" الأم (تحتضن لينا): \"بالطبع! بيتنا يعني كلنا\" بدأت المعجزة..."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المولى الجارية عليه نعمتك",
        "text": "الأب يحرك الفرشاة بإيقاع منتظم،ونور يحمل السلم بفخر. الأب: \"نور، قوتك كنز... لكن لا تستخدمه إلا لرفع من حولك\" نور(يمسك الفرشاة بإصرار): \"سأكون السند الذي تثقون به\" حور تنشر الجرائد بحركات راقصة. الأم (تغمز): \"أنتِ متألقة في الترتيب... علمي أختك دقة يدك\" حور(تناول لينا فرشاة صغيرة): \"تعالي يا فنانتي... لنبدع معاً على الحائط الصحيح!\" لينا (تلوّن بحماس): \"أنا أصلح خطئي! أنا كبيرة!\" بعد ساعات... وقفوا أمام تحفة فنية من نوع آخر. الأب (بعينين تبرقان فخراً): \"اليوم لم نلمع جداراً فقط... بل علمنا أن القيادة الحقيقية هي خدمة من نحب\" الأم (تضع يدها على كتفه): \"البيوت تبنيها أيادينا عندما تلتقي قلوبنا\" حور (تضحك): \"اكتشفنا أن أجمل الألوان... هي تلك التي تمزجها أيدينا معاً\" نور: \"من اليوم... لا عمل يصعب بيد واحدة... ولا خطأ يعظم بقلوب متسامحة\" لينا (تركض حاملة ورقة رسم): \"قراري نهائي! من اليوم... الورق هو مملكتي!\" انفجر الجميع في ضحك... وامتلأ البيت بلون جديد. لون الأسرة."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق ذي المعروف",
        "text": "حور ونور.. وجزاء لا يُنسى في يوم مشمس، قررت العائلة نزهة في السوق. بين الأضواء والألوان، كانت لينا تنتقل بحماس بين المحلات. وفجأة... صمت مخيف اخترق الجولة! \"لينا! أين أنتِ؟\" صرخت الأم بصوت بدأ يكسوه الذعر. بدأت الفوضى تسيطر. الأب يتفحص الممرات بحذر، حور تركض بين المحلات، ونور يبحث في الزوايا. لاحظ صاحب محل لطيف ذعرهم، فاقترب مسرعاً: \"فقدتم أحداً؟ لا تقلقوا، السوق كعائلة واحدة!\" في دقائق، تحول المكان إلى فرقة إنقاذ... سمعوا صوتاً من بعيد: \"وجدتها! عند محل الألعاب!\" ركض الجميع. هناك وقفت لينا تبكي، ممسكة بدميتها. احتضنها الأب بقوة وكاد يبكي من الفرح والراحة. صافح الأب صاحب المحل بحرارة، الذي أجاب مبتسماً بتواضع: \"سلامة طفلتكم أهم شيء، هذا واجب!\" جزاء الإحسان: الدرس الحقيقي"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق ذي المعروف",
        "text": "في طريق العودة، جلست لينا بين أمها وأبيها، لا تزال ترتجف قليلاً. جلس نور وحور في المقعد الخلفي بصمت غير معتاد. همس نور لأخته: \"هل رأيتِ كيف تصرف هذا البائع؟ لقد ترك عمله وكأن الأمر يخصه هو. لا أصدق كم كنت خائفاً!\" أجابت حور بتأثر: \"نعم، لم أكن أعرف أن أشكرهم! هل كلمة 'شكراً' كافية يا أبي؟\" أمسك الأب يد الأم وقال: \"الشكر باللسان واجب، يا أطفال. لكن هذا الرجل بذل وقته وجهده من أجلنا. حق ذي المعروف عليه أعظم من مجرد كلمة.\" نظرت الأم إلى الأطفال وقالت: \"لقد قررنا أنا وأبوكم أن رد الجميل لن يكون باللسان فقط. سنجعل محله وجهتنا الدائمة، وسندعو كل من نعرفه ليتعامل معه. هذا هو الدعم الحقيقي الذي يستحقه من أحسن إلينا.\" أجاب نور بابتسامة فهم: \"أجل! هكذا يرد الجميل بالجميل و المحسن بأحسن مما صنع.\" ابتسم الأبوان، مدركين أن هذه النزهة القصيرة حملت معها درساً في الإحسان ورد المعروف، أعظم من أي شيء خططوا له."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الخَامِسَةُ: الفَلَكُ وَالكَوْنُ",
      "topic": "الدَّرْسُ (3): القَمَرُ وَالظَّوَاهِرُ الفَلَكِيَّةُ (حَرَكَةُ القَمَرِ، أَطْوَارُ القَمَرِ، الكُسُوفُ وَالخُسُوفُ، وَالمَدُّ وَالجَزْرُ)",
      "coverImg": "assets/y7/scince/s19.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s19.1.jpg",
          "text": "الدَّرْسُ (3) القَمَرُ وَالظَّوَاهِرُ الفَلَكِيَّةُ: (1) القَمَرُ وَحَرَكَتُهُ: جِرْمٌ صَخْرِيٌّ تَابِعٌ لِلْأَرْضِ يَدُورُ حَوْلَهَا شَهْرِيًّا وَنَرَى دَائِمًا وَجْهًا وَاحِدًا مِنْهُ. (2) أَطْوَارُ القَمَرِ: هِلَالٌ، تَرْبِيعٌ، بَدْرٌ، وَمَحَاقٌ، وَنُحَدِّدُ بِهَا الأَشْهُرَ الهِجْرِيَّةَ. (3) الكُسُوفُ وَالخُسُوفُ: كُسُوفُ الشَّمْسِ عِنْدَمَا يَقَعُ القَمَرُ بَيْنَ الأَرْضِ وَالشَّمْسِ (وَلَا نَنْظُرُ إِلَيْهِ مُبَاشَرَةً)، وَخُسُوفُ القَمَرِ عِنْدَمَا تَقَعُ الأَرْضُ بَيْنَ القَمَرِ وَالشَّمْسِ. (4) ظَاهِرَةُ المَدِّ وَالجَزْرِ: ارْتِفَاعُ وَانْخِفَاضُ مِيَاهِ البَحْرِ بِسَبَبِ جَاذِبِيَّةِ القَمَرِ لِلْأَرْضِ مِمَّا يُجَدِّدُ مِيَاهَ الشَّوَاطِئِ."
        }
      ],
      "text": "الدَّرْسُ (3) القَمَرُ وَالظَّوَاهِرُ الفَلَكِيَّةُ: (1) القَمَرُ وَحَرَكَتُهُ: جِرْمٌ صَخْرِيٌّ تَابِعٌ لِلْأَرْضِ يَدُورُ حَوْلَهَا شَهْرِيًّا وَنَرَى دَائِمًا وَجْهًا وَاحِدًا مِنْهُ. (2) أَطْوَارُ القَمَرِ: هِلَالٌ، تَرْبِيعٌ، بَدْرٌ، وَمَحَاقٌ، وَنُحَدِّدُ بِهَا الأَشْهُرَ الهِجْرِيَّةَ. (3) الكُسُوفُ وَالخُسُوفُ: كُسُوفُ الشَّمْسِ عِنْدَمَا يَقَعُ القَمَرُ بَيْنَ الأَرْضِ وَالشَّمْسِ (وَلَا نَنْظُرُ إِلَيْهِ مُبَاشَرَةً)، وَخُسُوفُ القَمَرِ عِنْدَمَا تَقَعُ الأَرْضُ بَيْنَ القَمَرِ وَالشَّمْسِ. (4) ظَاهِرَةُ المَدِّ وَالجَزْرِ: ارْتِفَاعُ وَانْخِفَاضُ مِيَاهِ البَحْرِ بِسَبَبِ جَاذِبِيَّةِ القَمَرِ لِلْأَرْضِ مِمَّا يُجَدِّدُ مِيَاهَ الشَّوَاطِئِ.",
      "q1": {
        "q": "مَتَى يَحْدُثُ كُسُوفُ الشَّمْسِ وَمَتَى يَحْدُثُ خُسُوفُ القَمَرِ؟",
        "focusWord": "الكُسُوفُ وَالخُسُوفُ",
        "options": [
          {
            "text": "الكُسُوفُ عِنْدَ وُقُوعِ القَمَرِ بَيْنَ الأَرْضِ وَالشَّمْسِ، وَالخُسُوفُ عِنْدَ وُقُوعِ الأَرْضِ بَيْنَهُمَا",
            "correct": true
          },
          {
            "text": "عِنْدَمَا يَصْطَدِمُ المِرِّيخُ بِالمُشْتَرِي",
            "correct": false
          },
          {
            "text": "عِنْدَمَا تَغِيبُ الغُيُومُ",
            "correct": false
          },
          {
            "text": "كُلَّ يَوْمٍ عِنْدَ الظَّهِيرَةِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا فَوَائِدُ رُؤْيَةِ أَطْوَارِ القَمَرِ (الهِلَالِ وَالتَّرْبِيعِ وَالبَدْرِ وَالمَحَاقِ)؟",
        "focusWord": "التَّقْوِيمُ الهِجْرِيُّ",
        "options": [
          {
            "text": "نُحَدِّدُ بِهَا الأَشْهُرَ الهِجْرِيَّةَ وَمَوَاقِيتَ الصِّيَامِ وَالحَجِّ",
            "correct": true
          },
          {
            "text": "نَقِيسُ بِهَا حَرَارَةَ البَرَاكِينِ",
            "correct": false
          },
          {
            "text": "نَصْنَعُ بِهَا البَطَّارِيَّاتِ",
            "correct": false
          },
          {
            "text": "نُصَفِّي بِهَا المِيَاهَ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا السَّبَبُ العِلْمِيُّ لِظَاهِرَةِ المَدِّ وَالجَزْرِ (ارْتِفَاعِ وَانْخِفَاضِ مِيَاهِ البَحْرِ)؟",
        "focusWord": "جَاذِبِيَّةُ القَمَرِ",
        "options": [
          {
            "text": "قُوَّةُ جَاذِبِيَّةِ القَمَرِ لِمِيَاهِ الأَرْضِ",
            "correct": true
          },
          {
            "text": "حَرَكَةُ الأَسْمَاكِ الصَّغِيرَةِ",
            "correct": false
          },
          {
            "text": "تَسَاقُطُ أَوْرَاقِ الشَّجَرِ",
            "correct": false
          },
          {
            "text": "تَبَرْعُمُ الخَمِيرَةِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "كُسُوفُ الشَّمْسِ",
          "left": "يَقَعُ القَمَرُ بَيْنَ الأَرْضِ وَالشَّمْسِ"
        },
        {
          "right": "خُسُوفُ القَمَرِ",
          "left": "تَقَعُ الأَرْضُ بَيْنَ القَمَرِ وَالشَّمْسِ"
        },
        {
          "right": "المَدُّ وَالجَزْرُ",
          "left": "ارْتِفَاعُ وَانْخِفَاضُ مِيَاهِ البَحْرِ بِسَبَبِ جَاذِبِيَّةِ القَمَرِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرِ الحَقَائِقَ الصَّحِيحَةَ عَنِ القَمَرِ وَالظَّوَاهِرِ الفَلَكِيَّةِ:",
        "correct": [
          "أَطْوَارُ القَمَرِ: هِلَالٌ وَتَرْبِيعٌ وَبَدْرٌ وَمَحَاقٌ",
          "تَحْدِيدُ الأَشْهُرِ الهِجْرِيَّةِ",
          "عَدَمُ النَّظَرِ لِكُسُوفِ الشَّمْسِ مُبَاشَرَةً",
          "المَدُّ وَالجَزْرُ بِجَاذِبِيَّةِ القَمَرِ"
        ],
        "wrong": [
          "النَّظَرُ لِلْكُسُوفِ بِالعَيْنِ المُجَرَّدَةِ",
          "القَمَرُ نَجْمٌ غَازِيٌّ مُلْتَهِبٌ"
        ]
      },
      "applyStep": "أُرَاقِبُ أَطْوَارَ القَمَرِ فِي السَّمَاءِ مِنْ هِلَالِ أَوَّلِ الشَّهْرِ الهِجْرِيِّ حَتَّى يَكْتَمِلَ بَدْرًا."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt19.jpg",
      "title": "الدَّرْسُ (8): مَسَارُ الحَرَكَةِ وَالرَّشَاقَةِ لِلطُّلَّابِ",
      "subtitle": "بَرْنَامَجٌ تَدْرِيبِيٌّ رِيَاضِيٌّ مُتَكَامِلٌ لِلطُّلَّابِ",
      "slideText": "🤸 الدَّرْسُ (8) مَسَارُ الحَرَكَةِ وَالرَّشَاقَةِ لِلطُّلَّابِ: (1) الوَعْيُ (دَقِيقَتَانِ): تَحْرِيكُ الرَّأْسِ بِبُطْءٍ (10 مَرَّاتٍ يَمِينًا، وَ10 مَرَّاتٍ يَسَارًا). (2) الاسْتِطَالَةُ (دَقِيقَةٌ وَنِصْفٌ): لَمْسُ الأَصَابِعِ مِنَ الجُلُوسِ مَعَ مَدِّ السَّاقَيْنِ. (3) النُّمُوُّ العَضَلِيُّ (40 ثَانِيَةً): تَمْرِينُ السُّكْوَاتِ (10-15 عَدَّةً). (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَتَانِ): تَغْيِيرُ الاتِّجَاهِ (تَمْرِينُ يَمِينٍ-يَسَارٍ بِتَبْدِيلٍ كُلَّ 3 ثَوَانٍ). (5) التَّدَفُّقُ (دَقِيقَةٌ وَاحِدَةٌ): وَضْعِيَّةُ الطِّفْلِ لِلِاسْتِرْخَاءِ وَإِرَاحَةِ الظَّهْرِ.",
      "q1": {
        "q": "كَيْفَ نَبْدَأُ فَقْرَةَ (الوَعْيِ) وَفَقْرَةَ (الاسْتِطَالَةِ) فِي الدَّرْسِ الثَّامِنِ (مَسَارِ الحَرَكَةِ وَالرَّشَاقَةِ)؟",
        "focusWord": "تَحْرِيكُ الرَّأْسِ وَلَمْسُ الأَصَابِعِ",
        "options": [
          {
            "text": "تَحْرِيكُ الرَّأْسِ (10 مَرَّاتٍ يَمِينًا وَ10 يَسَارًا)، ثُمَّ لَمْسُ أَصَابِعِ القَدَمَيْنِ مِنَ الجُلُوسِ (دَقِيقَةٌ وَنِصْفٌ)",
            "correct": true
          },
          {
            "text": "القَفْزُ مِنَ المَكَانِ العَالِي",
            "correct": false
          },
          {
            "text": "حَمْلُ الأَثْقَالِ",
            "correct": false
          },
          {
            "text": "الجَرْيُ لِلْخَلْفِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (الاسْتِجَابَةِ العَصَبِيَّةِ) فِي مَسَارِ الحَرَكَةِ وَالرَّشَاقَةِ؟",
        "focusWord": "تَغْيِيرُ الاتِّجَاهِ كُلَّ 3 ثَوَانٍ",
        "options": [
          {
            "text": "تَغْيِيرُ الاتِّجَاهِ (يَمِينًا وَيَسَارًا) بِتَبْدِيلٍ سَرِيعٍ كُلَّ 3 ثَوَانٍ لِمُدَّةِ دَقِيقَتَيْنِ",
            "correct": true
          },
          {
            "text": "الوُقُوفُ بِلَا حَرَكَةٍ",
            "correct": false
          },
          {
            "text": "الجُلُوسُ عَلَى الكُرْسِيِّ",
            "correct": false
          },
          {
            "text": "النَّوْمُ عَلَى الظَّهْرِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا وَضْعِيَّةُ (التَّدَفُّقِ) الخِتَامِيَّةُ فِي الدَّرْسِ الثَّامِنِ؟",
        "focusWord": "وَضْعِيَّةُ الطِّفْلِ",
        "options": [
          {
            "text": "وَضْعِيَّةُ الطِّفْلِ (رُكْبَتَانِ مَثْنِيَّتَانِ وَجَبِينٌ عَلَى الأَرْضِ لِمُدَّةِ دَقِيقَةٍ وَاحِدَةٍ)",
            "correct": true
          },
          {
            "text": "تَمْرِينُ الضَّغْطِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ التَّعَلُّقِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ القَفْزِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ (الدَّرْسُ 8)",
          "left": "تَحْرِيكُ الرَّأْسِ (10 يَمِينًا وَ10 يَسَارًا) + لَمْسُ الأَصَابِعِ"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ (40 ثَانِيَةً)",
          "left": "تَمْرِينُ السُّكْوَاتِ (10-15 عَدَّةً)"
        },
        {
          "right": "الاسْتِجَابَةُ وَالتَّدَفُّقُ",
          "left": "تَغْيِيرُ الاتِّجَاهِ كُلَّ 3 ثَوَانٍ ثُمَّ وَضْعِيَّةُ الطِّفْلِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ الثَّامِنِ (مَسَارِ الحَرَكَةِ وَالرَّشَاقَةِ):",
        "correct": [
          "تَحْرِيكُ الرَّأْسِ يَمِينًا وَيَسَارًا",
          "لَمْسُ الأَصَابِعِ مِنَ الجُلُوسِ",
          "تَمْرِينُ السُّكْوَاتِ (10-15 عَدَّةً)",
          "تَغْيِيرُ الاتِّجَاهِ وَوَضْعِيَّةُ الطِّفْلِ"
        ],
        "wrong": [
          "تَحْرِيكُ الرَّأْسِ بِعُنْفٍ",
          "تَرْكُ فَقْرَةِ التَّدَفُّقِ وَالاسْتِرْخَاءِ"
        ]
      },
      "applyStep": "أُطَبِّقُ مَسَارَ الحَرَكَةِ وَالرَّشَاقَةِ: تَحْرِيكَ الرَّأْسِ، لَمْسَ الأَصَابِعِ، السُّكْوَاتَ، تَغْيِيرَ الاتِّجَاهِ، وَوَضْعِيَّةَ الطِّفْلِ."
    }
  },
  {
    "w": 20,
    "secNum": 5,
    "heavenName": "سَمَاءُ الأَرْبِعَاءِ الخَامِسَةُ (ف ص ق ر)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ الخَامِسَةُ: عُلُومُ الفَلَكِ وَالفَضَاءِ وَالنِّظَامِ الشَّمْسِيِّ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "ر",
    "jummal": 200,
    "prophet": "هَارُونُ (ع)",
    "virtue": "المَوَدَّةُ",
    "unitHeader": "الوَحْدَةُ العِشْرُونَ : نَبِيُّ اللهِ هَارُونُ الوَزِيرُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "كَانَ نَبِيُّ اللهِ هَارُونُ (ع) فَصِيحَ اللِّسَانِ مُحِبًّا لِأَخِيهِ مُوسَى (ع)، فَوَقَفَ مَعَهُ بِمَوَدَّةٍ وَصَبْرٍ فِي تَبْلِيغِ رِسَالَةِ اللهِ وَتَأْلِيفِ القُلُوبْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (فِتْنَةُ العِجْلِ وَالحَسَدُ مُقَابِلَ ضِيَاءِ الفُرْقَانِ): نَارُ السَّامِرِيِّ الَّتِي أَذَابَ بِهَا الذَّهَبَ لِيَفْتِنَ القَوْمَ، وَنَارُ الحَسَدِ فِي مَنْ حَسَدَ هَارُونَ، وَحَمِيَّةُ مُوسَى وَهَارُونَ لِلتَّوْحِيدِ؛ وَفِي مُقَابِلِهَا النُّورُ وَالضِّيَاءُ الَّذِي آتَاهُ اللهُ مُوسَى وَهَارُونَ: ﴿وَلَقَدْ آتَيْنَا مُوسَىٰ وَهَارُونَ الْفُرْقَانَ وَضِيَاءً وَذِكْرًا لِّلْمُتَّقِينَ﴾. B. الرِّيحُ (خُوَارُ الوَهْمِ وَالبُهْتَانُ مُقَابِلَ الطِّيبِ السَّمَاوِيِّ): رِيحُ الوَهْمِ فِي الهَوَاءِ الدَّاخِلِ فِي جَوْفِ العِجْلِ، وَرِيحُ التُّهْمَةِ البَاطِلَةِ حِينَ اتَّهَمَ الجُهَّالُ مُوسَى بَعْدَ وَفَاةِ هَارُونَ؛ وَفِي مُقَابِلِهَا الرِّيحُ الطَّيِّبَةُ الزَّكِيَّةُ عِنْدَ سَرِيرِ هَارُونَ عَلَى الجَبَلِ وَظُهُورُ سَرِيرِهِ فِي الهَوَاءِ بَيْنَ السَّمَاءِ وَالأَرْضِ لِتَبْرِئَةِ أَخِيهِ. C. التُّرَابُ (العَقْلُ وَحِفْظُ الوَحْدَةِ وَالجَبَلُ): حِكْمَةُ هَارُونَ العَقْلِيَّةُ البَالِغَةُ فِي حِفْظِ وَحْدَةِ بَنِي إِسْرَائِيلَ وَحقْنِ دِمَائِهِمْ حَتَّى يَرْجِعَ مُوسَى، وَاخْضِرَارُ عَصَا هَارُونَ اليَابِسَةِ بِاللَّوْزِ، وَصُعُودُهُ إِلَى جَبَلِ هُورَ التُّرَابِيِّ الشَّامِخِ عِنْدَ وَفَاتِهِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَالفَصَاحَةُ): طَاعَةُ هَارُونَ التَّامَّةُ لِلهِ وَلِأَخِيهِ مُوسَى، وَلِينُ جَانِبِهِ وَتَوَاضُعُهُ العَظِيمُ حَتَّى أَحَبَّتْهُ القُلُوبُ، وَانْسِيَابُ بَيَانِهِ الفَصِيحِ، وَنَجَاتُهُ مَعَ مُوسَى عِنْدَ انْفِلَاقِ مَاءِ البَحْرِ.",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ الأَرْبِعَاءِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ عِشْرُونَ فِي مَنْزِلَةِ المَاءِ وَالطَّاعَةِ وَالتَّوَاضُعِ وَعُذُوبَةِ البَيَانْ، وَهُوَ الوَزِيرُ الصَّابِرُ نَبِيُّ اللهِ هَارُونُ بْنُ عِمْرَانَ عَلَيْهِمَا السَّلَامْ. ذَكَرَ اللهُ اسْمَهُ فِي القُرْآنِ الكَرِيمِ عِشْرِينَ مَرَّةً عَلَى عَدَدِ مَرْتَبَتِهِ العِشْرِينَ فِي مِيزَانِ النُّورْ، وَكَانَ أَكْبَرَ مِنْ أَخِيهِ مُوسَى بِثَلَاثِ سِنِينَ وَكَانَ طَوِيلَ القَامَةِ مَهِيبَ الطَّلْعَةِ لَيِّنَ الجَانِبِ مَحْبُوبًا فِي قُلُوبِ النَّاسِ وَأَفْصَحَ النَّاسِ لِسَانًا. وَلَمَّا بَعَثَ اللهُ مُوسَى الكَلِيمَ إِلَى فِرْعَوْنَ دَعَا مُوسَى رَبَّهُ قَائِلًا وَاجْعَلْ لِي وَزِيرًا مِنْ أَهْلِي هَارُونَ أَخِي اشْدُدْ بِهِ أَزْرِي وَأَشْرِكْهُ فِي أَمْرِي كَيْ نُسَبِّحَكَ كَثِيرًا وَنَذْكُرَكَ كَثِيرًا وَأَخِي هَارُونُ هُوَ أَفْصَحُ مِنِّي لِسَانًا فَأَرْسِلْهُ مَعِيَ رِدْءًا يُصَدِّقُنِي، فَوَهَبَهُ اللهُ مِنْ رَحْمَةٍ وَاسِعَةٍ أَخَاهُ هَارُونَ نَبِيًّا وَرَسُولًا كَرِيمًا.",
      "سَارَ هَارُونُ مَعَ أَخِيهِ مُوسَى إِلَى قَصْرِ فِرْعَوْنَ يُؤَيِّدُهُ بِبَيَانِهِ الفَصِيحِ وَثَبَاتِهْ، وَلَمَّا رَأَى السَّحَرَةُ آيَةَ العَصَا البَاهِرَةَ خَرُّوا سُجَّدًا وَقَالُوا آمَنَّا بِرَبِّ العَالَمِينَ رَبِّ مُوسَى وَهَارُونْ! وَأَوْحَى اللهُ إِلَى مُوسَى وَهَارُونَ أَنْ تَبَوَّآ لِقَوْمِكُمَا بِمِصْرَ بُيُوتًا وَاجْعَلُوا بُيُوتَكُمْ قِبْلَةً طَاهِرَةً وَأَقِيمُوا الصَّلَاةَ، ثُمَّ نَجَّاهُمَا اللهُ وَقَوْمَهُمَا مِنَ الكَرْبِ العَظِيمِ حِينَ انْفَلَقَ البَحْرُ، وَآتَاهُمَا الكِتَابَ المُسْتَبِينَ وَالفُرْقَانَ وَضِيَاءً وَهَدَاهُمَا الصِّرَاطَ المُسْتَقِيمْ.",
      "وَلَمَّا ذَهَبَ مُوسَى إِلَى مِيقَاتِ رَبِّهِ أَرْبَعِينَ لَيْلَةً عِنْدَ جَبَلِ الطُّورِ قَالَ لِأَخِيهِ هَارُونَ اخْلُفْنِي فِي قَوْمِي وَأَصْلِحْ وَلَا تَتَّبِعْ سَبِيلَ المُفْسِدِينْ. فَقَامَ هَارُونُ فِي قَوْمِهِ نَاصِحًا أَمِينًا، لٰكِنَّ السَّامِرِيَّ المُنَافِقَ اسْتَغَلَّ غِيَابَ مُوسَى وَصَنَعَ مِنَ الحُلِيِّ عِجْلًا جَسَدًا لَهُ خُوَارٌ بِرِيحِ الوَهْمِ وَالفِتْنَةْ! فَوَقَفَ هَارُونُ يُنْذِرُهُمْ بِقُوَّةٍ وَيَقُولُ يَا قَوْمِ إِنَّمَا فُتِنْتُمْ بِهِ وَإِنَّ رَبَّكُمُ الرَّحْمٰنُ فَاتَّبِعُونِي وَأَطِيعُوا أَمْرِي. فَتَمَرَّدَ الأَكْثَرُونَ وَثَبَتَ مَعَ هَارُونَ اثْنَا عَشَرَ أَلْفًا مِنَ المُؤْمِنِينَ الصَّادِقِينَ اعْتَزَلُوا عَبَدَةَ العِجْلْ. وَلَمَّا رَجَعَ مُوسَى غَضْبَانَ أَسِفًا وَأَخَذَ بِرَأْسِ أَخِيهِ يَجُرُّهُ إِلَيْهِ ظَانًّا أَنَّهُ قَصَّرَ، قَالَ لَهُ هَارُونُ بِأَدَبٍ وَحِكْمَةٍ يَا ابْنَ أُمَّ إِنَّ القَوْمَ اسْتَضْعَفُونِي وَكَادُوا يَقْتُلُونَنِي فَلَا تُشْمِتْ بِيَ الأَعْدَاءَ، إِنِّي خَشِيتُ أَنْ تَقُولَ فَرَّقْتَ بَيْنَ بَنِي إِسْرَائِيلَ وَلَمْ تَرْقُبْ قَوْلِي! فَعَلِمَ مُوسَى حِكْمَةَ أَخِيهِ وَصَبْرَهُ فِي حِفْظِ الوَحْدَةِ فَرَحِمَ مَوْقِفَهُ وَدَعَا قَائِلًا رَبِّ اغْفِرْ لِي وَلِأَخِي وَأَدْخِلْنَا فِي رَحْمَتِكَ وَأَنْتَ أَرْحَمُ الرَّاحِمِينْ، وَهُوَ العَلِيُّ الكَبِيرْ.",
      "وَكَانَ لِهَارُونَ ثَلَاثَةُ أَبْنَاءٍ طَاهِرِينَ هُمْ شَبَّرٌ وَشَبِيرٌ وَمُشَبِّرٌ، وَعَلَى أَسْمَائِهِمْ سَمَّى النَّبِيُّ مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَآلِهِ أَبْنَاءَ أَمِيرِ المُؤْمِنِينَ عَلِيٍّ وَالسَّيِّدَةِ فَاطِمَةَ الحَسَنَ وَالحُسَيْنَ وَالمُحْسِنَ عَلَيْهِمُ السَّلَامْ، وَقَالَ النَّبِيُّ لِعَلِيٍّ أَنْتَ مِنِّي بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى إِلَّا أَنَّهُ لَا نَبِيَّ بَعْدِي، كَمَا أَمَرَ اللهُ بِسَدِّ جَمِيعِ الأَبْوَابِ الشَّارِعَةِ إِلَى قُبَّةِ المَسْجِدِ إِلَّا بَابَ مُوسَى وَهَارُونَ لِطَهَارَتِهِمَا كَمَا سُدَّتِ الأَبْوَابُ فِي مَسْجِدِ المَدِينَةِ إِلَّا بَابَ عَلِيٍّ وَفَاطِمَةْ. وَحِينَ حَسَدَ بَعْضُ القَوْمِ هَارُونَ عَلَى مَقَامِهِ جُمِعَتْ عِصِيُّ الأَسْبَاطِ الاثْنَيْ عَشَرَ فِي قُبَّةِ الزَّمَانِ فَأَزْهَرَتْ عَصَا هَارُونَ اليَابِسَةُ وَحْدَهَا فِي الصَّبَاحِ وَأَثْمَرَتْ لَوْزًا أَخْضَرَ طَيِّبًا فَـقَرَّ بِآيَةِ اللهِ عُيُونُ المُؤْمِنِينَ وَجَعَلَ اللهُ النُّبُوَّةَ وَالحُبْرِيَّةَ فِي ذُرِّيَّةِ هَارُونْ.",
      "وَفِي خِتَامِ عُمْرِهِ المَيْمُونْ، أَوْحَى اللهُ إِلَى مُوسَى أَنْ يَصْعَدَ مَعَ أَخِيهِ هَارُونَ إِلَى جَبَلِ هُورَ العَالِي، فَرَأَيَا شَجَرَةً خَضْرَاءَ وَبَيْتًا فِيهِ سَرِيرٌ مُنِيرٌ يَفُوحُ بِالطِّيبِ الجَمِيلْ، فَنَامَ هَارُونُ عَلَى السَّرِيرِ بِسَكِينَةٍ وَسَلَامٍ فَقَبَضَ اللهُ رُوحَهُ الطَّاهِرَةَ بِلُطْفٍ وَرُفِعَ السَّرِيرُ إِلَى السَّمَاءْ. فَلَمَّا نَزَلَ مُوسَى حَزِينًا اتَّهَمَهُ الجُهَّالُ بِرِيحِ الوَهْمِ لِأَنَّهُمْ كَانُوا يُحِبُّونَ لِينَ هَارُونَ، فَدَعَا مُوسَى رَبَّهُ فَأَظْهَرَ اللهُ المَلَائِكَةَ تَحْمِلُ سَرِيرَ هَارُونَ بَيْنَ السَّمَاءِ وَالأَرْضِ وَنَطَقَ هَارُونُ بِإِذْنِ اللهِ مُعْلِنًا بَرَاءَةَ أَخِيهِ مُوسَى الكَلِيمْ. وَحُفِظَتْ عِمَامَةُ هَارُونَ المُبَارَكَةُ فِي تَابُوتِ السَّكِينَةِ بَقِيَّةً مِمَّا تَرَكَ آلُ مُوسَى وَآلُ هَارُونْ، وَبَقِيَ نُورُهُ يَهْدِي مَنْ سَارَ عَلَى الحَقِّ وَمَنْ يُقَرِّبُ النَّاسَ إِلَى الطَّاعَةِ فَلَا يَضُرُّ أَحَدًا بَلْ يَنْطِقُ بِالحِكْمَةِ؛ فَسَلَامٌ عَلَى مُوسَى وَهَارُونَ فِي العَالَمِينَ وَهُوَ عِنْدَ رَبِّهِ نَبِيٌّ شَاكِرٌ أَمِينْ."
    ],
    "words": [
      {
        "word": "أَمْرِي",
        "desc": "وسط متصل / ساكن: ـرْ",
        "raw": "أَمْرِي (وسط متصل / ساكن: ـرْ)"
      },
      {
        "word": "الكَبِيرْ",
        "desc": "آخر متصل / ساكن وقفا: ـرْ",
        "raw": "الكَبِيرْ (آخر متصل / ساكن وقفا: ـرْ)"
      },
      {
        "word": "رَحْمَةٍ",
        "desc": "أول منفصل / متحرك بالفتح: رَ",
        "raw": "رَحْمَةٍ (أول منفصل / متحرك بالفتح: رَ)"
      },
      {
        "word": "فَرَحِمَ",
        "desc": "أول متصل / متحرك بالفتح: ـرَ",
        "raw": "فَرَحِمَ (أول متصل / متحرك بالفتح: ـرَ)"
      },
      {
        "word": "تَرَكَ",
        "desc": "وسط متصل / متحرك بالفتح: ـرَ",
        "raw": "تَرَكَ (وسط متصل / متحرك بالفتح: ـرَ)"
      },
      {
        "word": "وَزِيرًا",
        "desc": "وسط منفصل / متحرك بالفتح: رَ",
        "raw": "وَزِيرًا (وسط منفصل / متحرك بالفتح: رَ)"
      },
      {
        "word": "سَارَ",
        "desc": "آخر منفصل / متحرك بالفتح: رَ",
        "raw": "سَارَ (آخر منفصل / متحرك بالفتح: رَ)"
      },
      {
        "word": "رُسُلًا",
        "desc": "أول منفصل / متحرك بالضم: رُ",
        "raw": "رُسُلًا (أول منفصل / متحرك بالضم: رُ)"
      },
      {
        "word": "سَرِيرٌ",
        "desc": "آخر متصل / متحرك بالضم: ـرٌ",
        "raw": "سَرِيرٌ (آخر متصل / متحرك بالضم: ـرٌ)"
      },
      {
        "word": "رِدْءًا",
        "desc": "أول منفصل / متحرك بالكسر: رِ",
        "raw": "رِدْءًا (أول منفصل / متحرك بالكسر: رِ)"
      },
      {
        "word": "فَرَّقْتَ",
        "desc": "وسط متصل / مضعف بالفتح: ـرَّ",
        "raw": "فَرَّقْتَ (وسط متصل / مضعف بالفتح: ـرَّ)"
      },
      {
        "word": "يَضُرُّ",
        "desc": "آخر متصل / مضعف بالضم: ـرُّ",
        "raw": "يَضُرُّ (آخر متصل / مضعف بالضم: ـرُّ)"
      },
      {
        "word": "يُقَرِّبُ",
        "desc": "وسط متصل / مضعف بالكسر: ـرِّ",
        "raw": "يُقَرِّبُ (وسط متصل / مضعف بالكسر: ـرِّ)"
      },
      {
        "word": "الرَّاحِمِينَ",
        "desc": "أول متصل / ممدود بالألف: ـرَا",
        "raw": "الرَّاحِمِينَ (أول متصل / ممدود بالألف: ـرَا)"
      },
      {
        "word": "هَارُونُ",
        "desc": "وسط منفصل / ممدود بالواو: رُو",
        "raw": "هَارُونُ (وسط منفصل / ممدود بالواو: رُو)"
      },
      {
        "word": "وَزِيرًا",
        "desc": "وسط متصل / ممدود بالياء: ـرِي",
        "raw": "وَزِيرًا (وسط متصل / ممدود بالياء: ـرِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الرَّاءِ (ر): النُّطْقُ السَّلِيمُ لِحَرْفِ الرَّاءِ المَجْهُورِ المُتَوَسِّطِ ذِي الِانْحِرَافِ وَالتَّكْرِيرِ المَوْزُونِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ مَا يُحَاذِيهِ مِنْ لِثَةِ الثَّنَايَا العُلْيَا، وَإِدْرَاكُ تَفْخِيمِهِ فِي الفَتْحِ وَالضَّمِّ وَتَرْقِيقِهِ فِي الكَسْرِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَالتَّأَسِّي بِفَصَاحَةِ هَارُونَ فِي تَسْخِيرِ اللِّسَانِ لِنُصْرَةِ الحَقِّ وَالتَّسْبِيحِ الكَثِيرِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الهِلَالُ المُنْحَدِرُ وَإِزْهَارُ الغُصْنِ وَالرَّقْمُ (20): مُشَاهَدَةُ شَكْلِ حَرْفِ الرَّاءِ (ر / ـر) الَّذِي يُشْبِهُ هِلَالَ النُّورِ أَوْ غُصْنَ اللَّوْزِ المُنْحَنِي الَّذِي يَنْزِلُ تَحْتَ السَّطْرِ بِلَا نِقَاطٍ (وَهُوَ مِنَ الحُرُوفِ السِّتَّةِ الَّتِي تَتَّصِلُ بِمَا قَبْلَهَا وَلَا تَتَّصِلُ بِمَا بَعْدَهَا)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (20) (تَمَامِ العِشْرِينَ نَبِيًّا وَخِتَامِ الفَلَكِ الخَامِسِ، وَالمُوَافِقِ لِـ 20 مَرَّةً ذُكِرَ فِيهَا اسْمُ هَارُونَ فِي القُرْآنِ)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ هَارُونَ الكَامِلَةِ وَحَدِيثُ المَنْزِلَةِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ هَارُونَ الكَامِلَةِ وَفَهْمِ مَعْنَى قَوْلِ النَّبِيِّ مُحَمَّدٍ (صَلَّى اللهُ عَلَيْهِ وَآلِهِ) لِلْإِمَامِ عَلِيٍّ (عَلَيْهِ السَّلَامُ): «أَنْتَ مِنِّي بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى»، وَتَدْرِيبُ الأُذُنِ عَلَى طَاعَةِ النَّاصِحِ الأَمِينِ عِنْدَ الفِتَنِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمُعَاوَنَةُ):",
        "body": "الرَّقْمُ عِشْرُونَ (20) وَالمِئَتَانِ (200) وَالاثْنَا عَشَرَ أَلْفًا: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (20) وَمَعْرِفَةِ قِيمَةِ الرَّاءِ المِئَوِيَّةِ (ر = 200 = عَشْرُ عِشْرِينَاتٍ)، وَإِدْرَاكِ أَعْدَادِ القِصَّةِ (20 مَوْضِعًا فِي القُرْآنِ، وَلَدَاهُ شَبَّرٌ وَشَبِيرٌ وَثَالِثُهُمَا مُشَبِّرٌ = 3، وَالاثْنَا عَشَرَ سِبْطًا، وَالاثْنَا عَشَرَ أَلْفًا الثَّابِتُونَ مَعَهُ)، وَتَدْرِيبُ اليَدِ عَلَى شَدِّ أَزْرِ الأَخِ وَمُعَاوَنَتِهِ فِي الأَعْمَالِ الصَّالِحَةِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ المَسِيرِ المُرَافِقِ وَتَسَلُّقِ جَبَلِ هُورَ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى المَشْيِ المُتَوَازِي المُنْتَظِمِ خُطْوَةً بِخُطْوَةٍ مَعَ الأَخِ وَالرَّفِيقِ (كَمَسِيرِ مُوسَى وَهَارُونَ معًا)، وَرِيَاضَةِ صُعُودِ الجِبَالِ العَالِيَةِ بِهِمَّةٍ وَثَبَاتٍ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ شَجَرِ اللَّوْزِ وَثَمَرِهِ النَّافِعِ لِلدِّمَاغِ وَالصَّدْرِ: تَعَلُّمُ الفَوَائِدِ الغِذَائِيَّةِ العَظِيمَةِ لِثَمَرِ «اللَّوْزِ» الَّذِي أَثْمَرَتْ بِهِ عَصَا هَارُونَ المُبَارَكَةُ، وَكَيْفَ يُقَوِّي الدِّمَاغَ وَالحِفْظَ وَيُلَيِّنُ الحَلْقَ وَالصَّدْرَ لِلفَصَاحَةِ وَالبَيَانِ، وَحُسْنِ اسْتِخْدَامِ طَحِينِ اللَّوْزِ وَزَيْتِهِ الطَّيِّبِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ طَهَارَةِ البَيْتِ وَحِفْظِ الأُخُوَّةِ وَالحِلْمِ عِنْدَ الغَضَبِ: تَعَلُّمُ آدَابِ طَهَارَةِ المَسْجِدِ وَالبُيُوتِ القَرِيبَةِ مِنْهُ (كَبَابِ هَارُونَ وَبَابِ عَلِيٍّ)، وَمُخَاطَبَةِ الأَخِ عِنْدَ العِتَابِ بِأَلْطَفِ العِبَارَاتِ الَّتِي تُذَكِّرُ بِرحِمِ الأُمِّ: ﴿يَا ابْنَ أُمَّ﴾، وَحِفْظِ الوَدَائِعِ وَتَجَنُّبِ التَّفْرِقَةِ."
      }
    },
    "grammar": {
      "topic": "حُرُوفُ الجَرِّ المُنْفَصِلَةُ: (مِنْ، إِلَى، عَنْ، عَلَى، فِي)",
      "rule": "حُرُوفُ الجَرِّ تَدْخُلُ عَلَى الأَسْمَاءِ فَقَطْ، فَتَجْعَلُ حَرَكَةَ آخِرِ الاِسْمِ بَعْدَهَا الكَسْرَةَ (ـِ).",
      "example": "خَرَجَ النَّهْرُ مِنَ الجَبَلِ وَسَارَ إِلَى السَّهْلِ.",
      "focusWord": "مِنْ / إِلَى / فِي / عَلَى",
      "q": "أَيُّ كَلِمَةٍ فِي جُمْلَةِ «الرُّمَّانُ عَلَى الشَّجَرَةِ» هِيَ «حَرْفُ جَرٍّ»؟",
      "opts": [
        "عَلَى",
        "الرُّمَّانُ",
        "الشَّجَرَةِ",
        "أَحْمَرُ"
      ]
    },
    "earIirab": {
      "topic": "جَرُّ الاِسْمِ بِالكَسْرَةِ الظَّاهِرَةِ (ـِ) بَعْدَ (مِنْ وَإِلَى)",
      "rule": "الاِسْمُ الوَاقِعُ بَعْدَ (مِنْ) أَوْ (إِلَى) يُسَمَّى اسْمًا مَجْرُورًا وَعَلَامَةُ جَرِّهِ الكَسْرَةُ (ـِ).",
      "sentence": "سَافَرَ التَّاجِرُ مِنَ المَدِينَةِ إِلَى القَرْيَةِ.",
      "targetWord": "القَرْيَةِ",
      "caseAns": "اسْمٌ مَجْرُورٌ بِالكَسْرَةِ (ـِ)"
    },
    "math": {
      "numVal": 11,
      "numName": "أَحَدَ عَشَرَ",
      "eqDisplay": "1 + 10 = 11",
      "subDisplay": "11 - 1 = 10",
      "compDisplay": "11 > 10",
      "q1": {
        "stem": "احْسِبْ تَرْكِيبَ الآحَادِ وَالعَشَرَاتِ:",
        "focus": "1 + 10 = ؟",
        "ans": "11 (أَحَدَ عَشَرَ)",
        "wrong": [
          "10",
          "21",
          "12"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "11 - 1 = ؟",
        "ans": "10 (عَشَرَةٌ)",
        "wrong": [
          "1 (وَاحِدٌ)",
          "12",
          "9"
        ]
      }
    },
    "sport": {
      "title": "دَوَرَانُ الكَتِفَيْنِ لِلخَلْفِ وَفَتْحُ الصَّدْرِ",
      "middleText": "أُدِيرُ كَتِفَيَّ فِي حَلَقَاتٍ دَائِرِيَّةٍ هَادِئَةٍ لِلخَلْفِ مَعَ الشَّهِيقِ العَمِيقْ. يَفْتَحُ هٰذَا التَّمْرِينُ القَفَصَ الصَّدْرِيَّ لِلتَّنَفُّسِ السَّلِيمِ وَيُصَحِّحُ اسْتِقَامَةَ الظَّهْرْ."
    },
    "sci": {
      "title": "مُخْتَبَرُ الفَلَكِ: المَجْمُوعَةُ الشَّمْسِيَّةُ وَانْعِكَاسُ الضَّوْءِ",
      "summaryThird": "نُصَمِّمُ فِي المُخْتَبَرِ نَمُوذَجَ المَجْمُوعَةِ الشَّمْسِيَّةِ، وَنُجَرِّبُ بِمِصْبَاحٍ يَدَوِيٍّ وَكُرَةٍ كَيْفَ يَسِيرُ الضَّوْءُ فِي خُطُوطٍ مُسْتَقِيمَةٍ لِيُنِيرَ نِصْفَ الكُرَةِ المُوَاجِهَ لَهُ وَيَتَكَوَّنَ الظِّلُّ خَلْفَهَا.",
      "focusConcept": "انْعِكَاسُ الضَّوْءِ وَتَكَوُّنُ الظِّلِّ",
      "factAns": "سَيْرُ الضَّوْءِ فِي خُطُوطٍ مُسْتَقِيمَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ مَنْ يُعَاوِنُنَا وَيَعْمَلُ مَعَنَا (حُور وَسُرُور - 20)",
      "storySentence": "تَعَلَّمَ سُرُورٌ وَحُورُ أَنَّ كُلَّ مَنْ يَخْدِمُنَا أَوْ يُسَاعِدُنَا فِي عَمَلٍ لَهُ حَقُّ الاحْتِرَامِ وَالكَلِمَةِ الطَّيِّبَةِ، وَإِعْطَائِهِ حَقَّهُ كَامِلًا وَمُسَاعَدَتِهِ عِنْدَ الحَاجَةْ.",
      "applyAction": "أَشْكُرُ كُلَّ مَنْ يُسَاعِدُنِي وَأُعَامِلُهُ بِتَوَاضُعٍ وَإِحْسَانْ."
    },
    "rightsFullTitle": "(29) حق المؤذن + (30) حق الإمام في الصلاة",
    "rightsQuote": "وَأمّا حَقُّ الْمُؤَذِّنِ فَأَنْ تَعْلَمَ أنّهُ مُذَكِّرُكَ برَبكَ وَدَاعِـــــيكَ إلَى حَظِّكَ وَأَفْضَلُ أَعْوَانِكَ عَلَى قَضَـــــــــــاءِ الْفَرِيضَةِ الَّتِي افتَرَضَهَا اللهُ عَلَيْكَ فَتَشْكُرَهُ عَلَى ذَلِكَ شُكْرَكَ لِلْمُحْسِنِ إلَيكَ. وَإنْ كُنْتَ فِي بَيْتِكَ مُهْتَمًّا لِذَلِكَ لَمْ تَكُنْ للهِ فِي أَمْرِهِ مُتَّهِمــــــاً وَعَلِمْتَ أنَّهُ نِعْمَةٌ مِن اللَّهِ عَلَيْكَ، لا شَكَّ فِيهَــــا، فَــــــــــــأَحْسِنْ صُحْبَةَ نِعْمَةِ اللَّهِ بحَمْدِ اللَّهِ عَلَيْهَــــــا عَلَى كُلِّ حَال. وَلا قُوَّةَ إلا باللهِ. | وَأمّا حَقُّ إمَامِكَ فِي صَلاتِكَ فَــــــــــــــــــأَنْ تَعلَمَ أنّهُ قَدْ تَقَلَّدَ السِّفَارَةَ فِيمَــــا بَيْنَكَ وبَيْنَ اللَّهِ وَالْوِفَادَةَ إلَى رَبكَ، وتَكَلَّمَ عَنْكَ وَلَمْ تَتَكَلَّـــــمْ عَنْهُ، وَدعَا لَكَ وَلَمْ تَدْعُ لَهُ، وَطَلَبَ فِيكَ وَلَـــــــــــــــــمْ تَطْلُبْ فِيهِ، وَكَفَاكَ هَمَّ الْمَقَــــــــامِ بَينَ يدي اللهِ وَالمُسَـــــــــاءَلَةَ لَهُ فِيكَ وَلَمْ تَكْفِهِ ذَلِكَ، فَــــــــــــإنْ كَانَ فِي شَيْء مِنْ ذَلِكَ تَقْصِيرٌ كَانَ بهِ دُونَكَ، وَإنْ كَانَ آثِمـــــــــــــاً لَمْ تَكُنْ شَرِيكَهُ فِيهِ وَلَمْ يَكُنْ لَهُ عَلَيكَ فَضلٌ، فَوقَى نَفْسَكَ بنَفْســـــــــــــــِهِ، وَوَقَى صـَلاتَكَ بصَلاتِهِ، فَتَشْكُرَ لَهُ عَلَى ذلِكَ. ولا حَوْلَ ولا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (29) حق المؤذن + (30) حق الإمام في الصلاة",
        "text": "وَأمّا حَقُّ الْمُؤَذِّنِ فَأَنْ تَعْلَمَ أنّهُ مُذَكِّرُكَ برَبكَ وَدَاعِـــــيكَ إلَى حَظِّكَ وَأَفْضَلُ أَعْوَانِكَ عَلَى قَضَـــــــــــاءِ الْفَرِيضَةِ الَّتِي افتَرَضَهَا اللهُ عَلَيْكَ فَتَشْكُرَهُ عَلَى ذَلِكَ شُكْرَكَ لِلْمُحْسِنِ إلَيكَ. وَإنْ كُنْتَ فِي بَيْتِكَ مُهْتَمًّا لِذَلِكَ لَمْ تَكُنْ للهِ فِي أَمْرِهِ مُتَّهِمــــــاً وَعَلِمْتَ أنَّهُ نِعْمَةٌ مِن اللَّهِ عَلَيْكَ، لا شَكَّ فِيهَــــا، فَــــــــــــأَحْسِنْ صُحْبَةَ نِعْمَةِ اللَّهِ بحَمْدِ اللَّهِ عَلَيْهَــــــا عَلَى كُلِّ حَال. وَلا قُوَّةَ إلا باللهِ. | وَأمّا حَقُّ إمَامِكَ فِي صَلاتِكَ فَــــــــــــــــــأَنْ تَعلَمَ أنّهُ قَدْ تَقَلَّدَ السِّفَارَةَ فِيمَــــا بَيْنَكَ وبَيْنَ اللَّهِ وَالْوِفَادَةَ إلَى رَبكَ، وتَكَلَّمَ عَنْكَ وَلَمْ تَتَكَلَّـــــمْ عَنْهُ، وَدعَا لَكَ وَلَمْ تَدْعُ لَهُ، وَطَلَبَ فِيكَ وَلَـــــــــــــــــمْ تَطْلُبْ فِيهِ، وَكَفَاكَ هَمَّ الْمَقَــــــــامِ بَينَ يدي اللهِ وَالمُسَـــــــــاءَلَةَ لَهُ فِيكَ وَلَمْ تَكْفِهِ ذَلِكَ، فَــــــــــــإنْ كَانَ فِي شَيْء مِنْ ذَلِكَ تَقْصِيرٌ كَانَ بهِ دُونَكَ، وَإنْ كَانَ آثِمـــــــــــــاً لَمْ تَكُنْ شَرِيكَهُ فِيهِ وَلَمْ يَكُنْ لَهُ عَلَيكَ فَضلٌ، فَوقَى نَفْسَكَ بنَفْســـــــــــــــِهِ، وَوَقَى صـَلاتَكَ بصَلاتِهِ، فَتَشْكُرَ لَهُ عَلَى ذلِكَ. ولا حَوْلَ ولا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ هَارُونُ (ع): آدَابُ طَهَارَةِ البَيْتِ وَحِفْظِ الأُخُوَّةِ وَالحِلْمِ عِنْدَ الغَضَبِ: تَعَلُّمُ آدَابِ طَهَارَةِ المَسْجِدِ وَالبُيُوتِ القَرِيبَةِ مِنْهُ (كَبَابِ هَارُونَ وَبَابِ عَلِيٍّ)، وَمُخَاطَبَةِ الأَخِ عِنْدَ العِتَابِ بِأَلْطَفِ العِبَارَاتِ الَّتِي تُذَكِّرُ بِرحِمِ الأُمِّ: ﴿يَا ابْنَ أُمَّ﴾، وَحِفْظِ الوَدَائِعِ وَتَجَنُّبِ التَّفْرِقَةِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المؤذن",
        "text": "🕌 قصة: نداء لا يشبهه نداء في مساء جميل، كانت حور ونور يلعبان بدراجتيهما في حديقة المنزل، يضحكان ويتسابقان بين الأشجار والزهور. كانت لحظات مليئة بالمرح والحرية. وفجأة… ارتفع صوت الأذان من المسجد القريب: \"الله أكبر… الله أكبر\" كان وقت المغرب قد حان. وقفت الأم ونادت بحنان: –\"حور، نور… هيا إلى الداخل، هذا وقت الصلاة.\" توقّف الطفلان ببطء، ونظر كل منهما للآخر باستياء واضح. قالت حور بصوت منخفض: –\"لكننا نلعب الآن…\" وأضاف نور وهو يرفع دراجته بتردد: –\"لو كان اللعب قليلاً فقط…\" لاحظ الأب ذلك فاقترب منهما وجلس بينهما قائلاً بلطف: –\"أتعلمون يا أحبتي، الأذان يشبه رنة الهاتف... لكنه ليس مكالمة عادية!\" نظر إليه الطفلان باهتمام، فتساءلت حور: –\"مكالمة من يكون؟\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المؤذن",
        "text": "أجاب الأب بحنان: –\"عندما يرن هاتف المنزل، تركضون لتعرفوا من المتصل... فما بالكم عندما يكون المتصل هو الله؟!\" قال نور متحمساً: –\"الله يتصل بنا؟!\" أكملت الأم: –\"نعم يا نور، إنها مكالمة خاصة جداً... نداء من ملك السماوات والأرض!\" قالت حور وهي تترك الدراجة: –\"إذاً لا نجعله ينتظر!\" وصاح نور وهو يركض: –\"أنا سأرد على مكالمة الله أولاً!\" ضحك الأب وقال: –\"من يجيب نداء الله أولاً... يكون الأقرب إليه وأحب إليه\" وهكذا… تحولت لحظة التذمر إلى لحظة حُب واشتياق للصلاة. لأن من فهم الأذان…أحبه."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الإمام في الصلاة",
        "text": "نور وحق الإمام في صباح جمعة مشمس، خرج نور مع فرقة كشافته متجهين إلى مسجد مجاور لأداء صلاة الجمعة. كان الجميع يرتدون زيهم الكشفي الأنيق، ويتحدثون بحماس عن اليوم المميز. توقف القائد أحمد عند بوابة المسجد وقال لهم: \"يا أبطال، اليوم سنتعلم درسًا من أهم دروس الصلاة: كيف نكون مأمومين صالحين، وما حقوق إمامنا علينا!\" دخل نور المسجد وهو يتساءل في نفسه: \"حقوق الإمام؟ أليس هو الذي يصلي بنا فحسب؟\" لاحظ نور كيف كان الإمام الشيخ طه واقفًا في ساحة المسجد، محاطًا بمجموعة من الناس. كان يرد على أسئلتهم بابتسامة هادئة، ويوجه الأطفال بلطف لترتيب صفوفهم. سمع رجلًا يسأل عن حكم تأخير الصلاة، ورأى الإمام يشرح له بأسلوب واضح وبسيط. قال نور في نفسه: \"يا له من شخص! إنه لا يؤدي الصلاة فقط، بل يعلم الناس ويرشدهم!\" بدأت الصلاة، ووقفت فرقة الكشافة في الصفوف الأولى. لاحظ نور أن بعض الصبية في الخلف يتكلمون ويضحكون. رأى كيف التفت إليهم الإمام نظرة عابرة فيها توجيه لطيف، ثم استمر في صلاته. بعد انتهاء الصلاة، تجمع القائد أحمد بالكشافة في ركن من فناء المسجد وقال: \"لقد لاحظت أن بعض الإخوة كان يتكلم أثناء الصلاة. أتدرون لماذا هذا خطأ؟\" صمت الجميع، فتحدث القائد: \"الإمام ليس قارئًا عاديًا، إنه سفيرنا إلى الله! إنه يقف في المقام الكريم الذي قال عنه الله تعالى. وهو يدعو لنا ويتكلم عنا، بينما نحن نصغي فقط!\" ثم نظر إلى نور وسأله: \"ما الذي فهمته اليوم يا نور؟\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الإمام في الصلاة",
        "text": "فأجاب نور بحماس: \"فهمت أن الإمام يحمل همًّا كبيرًا! إنه يتحمل مسؤولية صلاتنا جميعًا، ويدعو لنا، ويقف بين يدي الله نيابة عنا. إنه مثل القائد في الرحلة الذي يهدينا الطريق!\" ابتسم القائد وقال: \"أحسنت! والآن اسمعوا يا أبطال: 1. الإمام يتكلم بالقراءة والدعاء نيابة عنا جميعًا، فنصغي له بإنصات واحترام. 2. لا نسبقه في التكبير أو الركوع أو السجود، فهو قائدنا في هذه الرحلة الإيمانية. 3. ندعو له في سجودنا، لأنه يخدمنا ويحمّل نفسه مسؤوليتنا. 4. إذا نسي أو أخطأ، نذكّره برفق وأدب، كما نصحح لأخينا.\" وبينما هم يغادرون المسجد، رأى نور الإمام الشيخ طه يساعد رجلًا مسنًا على صعود الدرج، ثم يعانق شابًا كان يبكي في زاوية المسجد. في هذه اللحظة، أدرك نور أن الإمامة ليست منصبًا شكليًا، بل هي خدمة وريادة ورحمة. بعد العودة إلى البيت، كان نور متحمسًا  و هو يحكي لأخته حور ما حدث. استمعت له بحماس ثم قالت: \"الآن فهمت معنى أن الإمام يتكلم عنا ولم نتكلم عنه! فهو  يساعدنا لنصل إلى رضا الله!\" فأكمل نور: \"وهو كالقائد في السفينة، إن صلحت طريقه، وصلت سفينتنا جميعًا!\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ الخَامِسَةُ: الفَلَكُ وَالفَضَاءُ",
      "topic": "التَّجْرِبَتَانِ (9 وَ10): مُجَسَّمُ المَجْمُوعَةِ الشَّمْسِيَّةِ — مَنْظُومَةُ الأَرْضِ وَالقَمَرِ وَالشَّمْسِ",
      "coverImg": "assets/y7/scince/s20.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s20.1.jpg",
          "text": "التَّجْرِبَةُ (9) مُجَسَّمُ المَجْمُوعَةِ الشَّمْسِيَّةِ: نُلَوِّنُ كُرَاتِ الفِلِّينِ بِأَلْوَانِ الشَّمْسِ وَالكَوَاكِبِ وَنَرْبِطُهَا بِالخُيُوطِ عَلَى حَامِلٍ مُعَلَّقٍ حَسَبَ تَرْتِيبِ مَدَارَاتِهَا لِنَعْرِفَ مَوْقِعَ كَوْكَبِ الأَرْضِ وَتَنَوُّعَ الكَوَاكِبِ الصَّخْرِيَّةِ وَالعِمْلَاقَةِ."
        },
        {
          "img": "assets/y7/scince/s20.2.jpg",
          "text": "التَّجْرِبَةُ (10) مَنْظُومَةُ الأَرْضِ وَالقَمَرِ وَالشَّمْسِ: نُسَلِّطُ ضَوْءَ مِصْبَاحٍ يَدَوِيٍّ (يُمَثِّلُ الشَّمْسَ) عَلَى مُجَسَّمِ الكُرَةِ الأَرْضِيَّةِ وَكُرَةِ القَمَرِ، وَنُدِيرُ الأَرْضَ وَنُحَرِّكُ القَمَرَ حَوْلَهَا لِنُشَاهِدَ تَعَاقُبَ اللَّيْلِ وَالنَّهَارِ وَأَطْوَارَ القَمَرِ وَظَاهِرَتَيِ الكُسُوفِ وَالخُسُوفِ."
        }
      ],
      "text": "التَّجْرِبَةُ (9) مُجَسَّمُ المَجْمُوعَةِ الشَّمْسِيَّةِ: نُلَوِّنُ كُرَاتِ الفِلِّينِ بِأَلْوَانِ الشَّمْسِ وَالكَوَاكِبِ وَنَرْبِطُهَا بِالخُيُوطِ عَلَى حَامِلٍ مُعَلَّقٍ حَسَبَ تَرْتِيبِ مَدَارَاتِهَا لِنَعْرِفَ مَوْقِعَ كَوْكَبِ الأَرْضِ وَتَنَوُّعَ الكَوَاكِبِ الصَّخْرِيَّةِ وَالعِمْلَاقَةِ. التَّجْرِبَةُ (10) مَنْظُومَةُ الأَرْضِ وَالقَمَرِ وَالشَّمْسِ: نُسَلِّطُ ضَوْءَ مِصْبَاحٍ يَدَوِيٍّ (يُمَثِّلُ الشَّمْسَ) عَلَى مُجَسَّمِ الكُرَةِ الأَرْضِيَّةِ وَكُرَةِ القَمَرِ، وَنُدِيرُ الأَرْضَ وَنُحَرِّكُ القَمَرَ حَوْلَهَا لِنُشَاهِدَ تَعَاقُبَ اللَّيْلِ وَالنَّهَارِ وَأَطْوَارَ القَمَرِ وَظَاهِرَتَيِ الكُسُوفِ وَالخُسُوفِ.",
      "q1": {
        "q": "مَاذَا يُمَثِّلُ المِصْبَاحُ اليَدَوِيُّ المُنِيرُ فِي تَجْرِبَةِ مَنْظُومَةِ الأَرْضِ وَالقَمَرِ وَالشَّمْسِ؟",
        "focusWord": "الشَّمْسُ",
        "options": [
          {
            "text": "يُمَثِّلُ نَجْمَ الشَّمْسِ مَصْدَرَ الضَّوْءِ",
            "correct": true
          },
          {
            "text": "يُمَثِّلُ القَمَرَ المُعْتِمَ",
            "correct": false
          },
          {
            "text": "يُمَثِّلُ حِزَامَ الكُوَيْكِبَاتِ",
            "correct": false
          },
          {
            "text": "يُمَثِّلُ الغُيُومَ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَاذَا نُشَاهِدُ عِنْدَ تَدْوِيرِ مُجَسَّمِ الأَرْضِ أَمَامَ ضَوْءِ المِصْبَاحِ اليَدَوِيِّ؟",
        "focusWord": "تَعَاقُبُ اللَّيْلِ وَالنَّهَارِ",
        "options": [
          {
            "text": "تَعَاقُبَ اللَّيْلِ (الجزءِ المُظْلِمِ) وَالنَّهَارِ (الجزءِ المُضِيءِ)",
            "correct": true
          },
          {
            "text": "ذَوَبَانَ الكُرَةِ الأَرْضِيَّةِ",
            "correct": false
          },
          {
            "text": "تَكَوُّنَ السَّلَايْمِ",
            "correct": false
          },
          {
            "text": "تَفَاعُلَ الخَلِّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الأَدَوَاتُ المُسْتَخْدَمَةُ لِصُنْعِ مُجَسَّمِ المَجْمُوعَةِ الشَّمْسِيَّةِ المَعَلَّقِ؟",
        "focusWord": "كُرَاتُ فِلِّينٍ وَأَلْوَانٌ",
        "options": [
          {
            "text": "كُرَاتُ فِلِّينٍ، وَأَلْوَانٌ، وَخُيُوطٌ، وَحَامِلٌ",
            "correct": true
          },
          {
            "text": "بَطَاطَا وَمَسَامِيرُ",
            "correct": false
          },
          {
            "text": "مَلْفُوفٌ بَنَفْسَجِيٌّ",
            "correct": false
          },
          {
            "text": "طَحِينٌ وَخَمِيرَةٌ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "كُرَاتُ الفِلِّينِ المُلَوَّنَةُ",
          "left": "تَرْتِيبُ كَوَاكِبِ المَجْمُوعَةِ الشَّمْسِيَّةِ فِي مَدَارَاتِهَا"
        },
        {
          "right": "المِصْبَاحُ اليَدَوِيُّ فِي التَّجْرِبَةِ",
          "left": "يُمَثِّلُ الشَّمْسَ الَّتِي تُضِيءُ الأَرْضَ وَالقَمَرَ"
        },
        {
          "right": "تَحْرِيكُ كُرَةِ القَمَرِ حَوْلَ الأَرْضِ",
          "left": "يُوضِّحُ أَطْوَارَ القَمَرِ وَالكُسُوفَ وَالخُسُوفَ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَدَوَاتِ وَنَتَائِجَ تَجْرِبَتَيِ الفَلَكِ وَالفَضَاءِ:",
        "correct": [
          "كُرَاتُ فِلِّينٍ وَأَلْوَانٌ وَخُيُوطٌ",
          "مِصْبَاحٌ يَدَوِيٌّ وَمُجَسَّمُ الأَرْضِ",
          "فَهْمُ تَعَاقُبِ اللَّيْلِ وَالنَّهَارِ",
          "مُشَاهَدَةُ الكُسُوفِ وَالخُسُوفِ"
        ],
        "wrong": [
          "مِقْيَاسُ الحُمُوضَةِ pH",
          "فِطْرُ البِنْسِلْيُومِ"
        ]
      },
      "applyStep": "أُنفِّذُ تَجْرِبَةَ المِصْبَاحِ اليَدَوِيِّ وَالكُرَةِ فِي غُرْفَةٍ خَافِتَةِ الإِضَاءَةِ لِأَرَى كَيْفَ يَتَعَاقَبُ اللَّيْلُ وَالنَّهَارُ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt20.jpg",
      "title": "الدَّرْسُ (3): القُوَّةُ وَالتَّدَفُّقُ الكَامِلُ (المَسَارُ الثَّالِثُ) + دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ",
      "subtitle": "الوَقْتُ: 30 دَقِيقَةً يَوْمِيًّا | الهَدَفُ: طَاقَةٌ، مُرُونَةٌ، وَقُوَّةٌ مُتَكَامِلَةٌ",
      "slideText": "🌟🕌 الدَّرْسُ (3) القُوَّةُ وَالتَّدَفُّقُ الكَامِلُ (المَسَارُ الثَّالِثُ — 30 دَقِيقَةً يَوْمِيًّا): (1) ضَبْطُ الطَّاقَةِ: الاسْتِقَامَةُ النُّورَانِيَّةُ. (2) فَكُّ ضَغْطِ الفَقَرَاتِ: تَمْرِينُ التَّعَلُّقِ الطِّبِّيِّ عَلَى العَارِضَةِ. (3) البِنَاءُ العَضَلِيُّ: تَمْرِينُ الضَّغْطِ (Push-ups). (4) تَقْوِيَةُ الاتِّزَانِ: السُّكُونُ الكَوَانْتِيُّ. (5) الاسْتِجَابَةُ العَصَبِيَّةُ: التَّوَافُقُ الحَرَكِيُّ بَيْنَ العَيْنِ وَاليَدِ. (6) التَّدَفُّقُ وَالاسْتِرْخَاءُ: تَمَدُّدٌ خَفِيفٌ وَاسْتِرْخَاءٌ عَضَلِيٌّ. • ثَانِيًا: الهَنْدَسَةُ الحَرَكِيَّةُ لِلْعِبَادَةِ (دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ): اسْتِطَالَةُ البَدَنِ وَالعَمُودِ الفَقَرِيِّ، اسْتِطَالَةُ عَضَلَاتِ الفَخِذِ الخَلْفِيَّةِ، وَتَوَازُنُ الدَّمِ لِلنِّصْفِ العُلْوِيِّ.",
      "q1": {
        "q": "مَا الفَوَائِدُ الصِّحِّيَّةُ لـ (دِينَامِيكِيَّةِ الرُّكُوعِ الطِّبِّيِّ) فِي الهَنْدَسَةِ الحَرَكِيَّةِ لِلْعِبَادَةِ؟",
        "focusWord": "دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ",
        "options": [
          {
            "text": "اسْتِطَالَةُ العَمُودِ الفَقَرِيِّ وَعَضَلَاتِ الفَخِذِ الخَلْفِيَّةِ، وَتَوَازُنُ تَدَفُّقِ الدَّمِ لِلنِّصْفِ العُلْوِيِّ",
            "correct": true
          },
          {
            "text": "ضَغْطُ الفَقَرَاتِ وَتَقْوِيسُ الظَّهْرِ",
            "correct": false
          },
          {
            "text": "إِيقَافُ الدَّوْرَةِ الدَّمَوِيَّةِ",
            "correct": false
          },
          {
            "text": "شَدُّ الرَّقَبَةِ لِلْأَعْلَى",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا التَّمْرِينُ الَّذِي يُسْتَخْدَمُ لـ (فَكِّ ضَغْطِ الفَقَرَاتِ) فِي الدَّرْسِ الثَّالِثِ (المَسَارِ الثَّالِثِ)؟",
        "focusWord": "تَمْرِينُ التَّعَلُّقِ الطِّبِّيِّ",
        "options": [
          {
            "text": "تَمْرِينُ التَّعَلُّقِ الطِّبِّيِّ عَلَى العَارِضَةِ",
            "correct": true
          },
          {
            "text": "الجُلُوسُ المُنْحَنِي",
            "correct": false
          },
          {
            "text": "حَمْلُ الحَقِيبَةِ الثَّقِيلَةِ",
            "correct": false
          },
          {
            "text": "القَفْزُ عَلَى الأَرْضِ الصُّلْبَةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا تَمْرِينُ (البِنَاءِ العَضَلِيِّ) فِي المَسَارِ الثَّالِثِ؟",
        "focusWord": "الضَّغْطُ (Push-ups)",
        "options": [
          {
            "text": "تَمْرِينُ الضَّغْطِ (Push-ups)",
            "correct": true
          },
          {
            "text": "تَمْرِينُ الغَمْزِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ النَّفْخِ",
            "correct": false
          },
          {
            "text": "تَمْرِينُ التَّثَاؤُبِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "فَكُّ ضَغْطِ الفَقَرَاتِ (المَسَارُ 3)",
          "left": "تَمْرِينُ التَّعَلُّقِ الطِّبِّيِّ عَلَى العَارِضَةِ"
        },
        {
          "right": "البِنَاءُ العَضَلِيُّ",
          "left": "تَمْرِينُ الضَّغْطِ (Push-ups)"
        },
        {
          "right": "دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ",
          "left": "اسْتِطَالَةُ العَمُودِ الفَقَرِيِّ وَعَضَلَاتِ الفَخِذِ الخَلْفِيَّةِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَنَاصِرَ الدَّرْسِ الثَّالِثِ (القُوَّةِ وَالتَّدَفُّقِ الكَامِلِ وَالرُّكُوعِ الطِّبِّيِّ):",
        "correct": [
          "الاسْتِقَامَةُ النُّورَانِيَّةُ",
          "تَمْرِينُ التَّعَلُّقِ الطِّبِّيِّ وَالضَّغْطِ (Push-ups)",
          "السُّكُونُ الكَوَانْتِيُّ وَالتَّوَافُقُ الحَرَكِيُّ",
          "دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ بِاسْتِوَاءِ الظَّهْرِ"
        ],
        "wrong": [
          "تَقْوِيسُ الظَّهْرِ فِي الرُّكُوعِ",
          "تَرْكُ التَّمَدُّدِ وَالاسْتِرْخَاءِ"
        ]
      },
      "applyStep": "أُقِيمُ ظَهْرِي مُسْتَوِيًا فِي الرُّكُوعِ أَثْنَاءَ الصَّلَاةِ وَأُطَبِّقُ تَمْرِينَ التَّعَلُّقِ الطِّبِّيِّ وَالضَّغْطِ."
    }
  },
  {
    "w": 21,
    "secNum": 6,
    "heavenName": "سَمَاءُ الخَمِيسِ السَّادِسَةُ (ش ت ث خ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ الكِلَاسِيكِيَّةُ وَالطَّاقَةُ وَالصَّوْتُ وَالضَّوْءُ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "ش",
    "jummal": 300,
    "prophet": "شُعَيْبٌ (ع)",
    "virtue": "العَدْلُ",
    "unitHeader": "الوَحْدَةُ الحَادِيَةُ وَالعِشْرُونَ : نَبِيُّ اللهِ شُعَيْبٌ خَطِيبُ الأَنْبِيَاءِ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "دَعَا نَبِيُّ اللهِ شُعَيْبٌ (ع) أَهْلَ مَدْيَنَ إِلَى عِبَادَةِ اللهِ وَإِيفَاءِ الكَيْلِ وَالمِيزَانِ بِالعَدْلِ وَالأَمَانَةِ، وَنَهَاهُمْ عَنْ بَخْسِ النَّاسِ أَشْيَاءَهُمْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (الحَمِيَّةُ وَنُورُ المَحَبَّةِ مُقَابِلَ نَارِ الطَّمَعِ وَالظُّلَّةِ): حَرَارَةُ الشَّوْقِ وَالمَحَبَّةِ الإِلٰهِيَّةِ فِي قَلْبِ شُعَيْبٍ، وَغَيْرَتُهُ الشَّدِيدَةُ فِي دَفْعِ الفَسَادِ عَنِ الأَرْضِ؛ وَفِي مُقَابِلِهَا نَارُ الطَّمَعِ وَالاسْتِكْبَارِ فِي مَلَأِ مَدْيَنَ الَّذِينَ تَوَعَّدُوهُ بِالرَّجْمِ، وَالحَرُّ الشَّدِيدُ الَّذِي غَلَتْ مِنْهُ مِيَاهُ الأَيْكَةِ سَبْعَةَ أَيَّامٍ ثُمَّ النَّارُ الَّتِي أَمْطَرَتْهَا عَلَيْهِمُ السَّحَابَةُ فِي «عَذَابِ يَوْمِ الظُّلَّةِ». B. الرِّيحُ (الوَهْمُ وَالسُّخْرِيَةُ مُقَابِلَ صَيْحَةِ الحَقِّ): رِيحُ الوَهْمِ وَالاسْتِهْزَاءِ حِينَ قَالُوا لِشُعَيْبٍ: ﴿أَصَلَاتُكَ تَأْمُرُكَ﴾ وَقَالُوا: ﴿إِنَّمَا أَنتَ مِنَ الْمُسَحَّرِينَ﴾، وَحَبْسُ اللهِ لِلهَوَاءِ وَالنَّسِيمِ عَنْ أَصْحَابِ الأَيْكَةِ، وَأَخْذُ الظَّالِمِينَ مِنْ مَدْيَنَ بِصَيْحَةِ المَلَكِ جِبْرِيلَ القَاصِمَةِ. C. التُّرَابُ (العَقْلُ وَالمِيزَانُ وَالرَّجْفَةُ): حُجَّةُ شُعَيْبٍ العَقْلِيَّةُ البَالِغَةُ فِي إِصْلَاحِ المعَامَلَاتِ وَتَحْرِيمِ بَخْسِ الأَوْزَانِ وَقَرْضِ الدَّرَاهِمِ وَالدَّنَانِيرِ، وَالصَّخْرَةُ الكَبِيرَةُ عَلَى فَمِ بِئْرِ مَدْيَنَ، وَزَلْزَلَةُ التُّرَابِ بِالمُطَفِّفِينَ فِي «الرَّجْفَةِ» حَتَّى أَصْبَحُوا فِي دِيَارِهِمْ جَاثِمِينَ. D. المَاءُ (الطَّاعَةُ وَدُمُوعُ المَحَبَّةِ وَمَاءُ مَدْيَنَ): دُمُوعُ شُعَيْبٍ الصَّافِيَةُ الَّتِي سَالَتْ حُبًّا وَطَاعَةً لِلهِ حَتَّى رَدَّ اللهُ بَصَرَهُ ثَلَاثَ مَرَّاتٍ وَأَخْدَمَهُ الكَلِيمَ مُوسَى، وَمَاءُ مَدْيَنَ الَّذِي سَقَى عِنْدَهُ مُوسَى لِابْنَتَيْ شُعَيْبٍ بِعِفَّةٍ وَمُرُوءَةٍ، وَالرِّضَا بِالحَلَالِ الصَّافِي: ﴿بَقِيَّتُ اللَّهِ خَيْرٌ لَّكُمْ﴾.",
    "storyParagraphs": [
      "فِي مَطْلَعِ فَلَكِ يَوْمِ الخَمِيسِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ وَاحِدٌ وَعِشْرُونَ فِي مَنْزِلَةِ النَّارِ وَالحَمِيَّةِ لإِقَامَةِ القِسْطِ وَدَفْعِ ظُلْمِ المُطَفِّفِينْ، وَهُوَ خَطِيبُ الأَنْبِيَاءِ نَبِيُّ اللهِ شُعَيْبٌ عَلَيْهِ السَّلَامْ. سُمِّيَ خَطِيبَ الأَنْبِيَاءِ لِفَصَاحَتِهِ وَحُسْنِ مَوْعِظَتِهْ، وَكَانَ كَمَا رَوَى الإِمَامُ الصَّادِقُ عَلَيْهِ السَّلَامُ عَبْدًا خَاشِعًا يَبْكِي مِنْ شَوْقِهِ وَمَحَبَّتِهِ لِلهِ حَتَّى ذَهَبَ بَصَرُهُ ثَلَاثَ مَرَّاتٍ وَرَدَّ اللهُ إِلَيْهِ بَصَرَهُ فِي كُلِّ مَرَّةٍ، وَأَوْحَى اللهُ إِلَيْهِ يَا شُعَيْبُ إِنْ كُنْتَ تَبْكِي خَوْفًا مِنَ النَّارِ فَقَدْ أَجَرْتُكَ وَإِنْ كُنْتَ تَبْكِي شَوْقًا إِلَى الجَنَّةِ فَقَدْ أَبَحْتُهَا لَكْ، فَقَالَ شُعَيْبٌ وَقَدْ خَشَعَ قَلْبُهُ يَا رَبِّ أَنْتَ تَعْلَمُ أَنِّي مَا بَكَيْتُ لِذٰلِكَ وَلٰكِنْ هٰكَذَا عُقِدَ قَلْبِي عَلَى مَحَبَّتِكْ! فَأَوْحَى اللهُ إِلَيْهِ هَنِيئًا لَكَ يَا شُعَيْبُ لَأُخْدِمَنَّكَ كَلِيمِي مُوسَى بْنَ عِمْرَانْ.",
      "بَعَثَ اللهُ شُعَيْبًا إِلَى قَوْمِهِ أَهْلِ مَدْيَنَ وَكَانُوا يَعِيشُونَ فِي رَغَدٍ وَعَيْشٌ وَاسِعْ، لٰكِنَّهُمْ كَفَرُوا بِنِعْمَةِ اللهِ وَأَشْعَلَ الطَّمَعُ فِي صُدُورِهِمْ نَارَ الجَشَعِ وَالغِشِّ؛ فَكَانُوا إِذَا اشْتَرَوْا مِنَ النَّاسِ أَخَذُوا وَافِيًا وَإِذَا بَاعُوهُمْ أَنْقَصُوا المِكْيَالَ وَالمِيزَانَ وَقَرَضُوا أَطْرَافَ الدَّرَاهِمِ وَالدَّنَانِيرِ وَقَعَدُوا بِكُلِّ صِرَاطٍ يُوعِدُونَ المُؤْمِنِينَ وَيَصُدُّونَ عَنْ سَبِيلِ اللهْ. فَقَامَ شُعَيْبٌ يَعِظُهُمْ بِالعَقْلِ وَالحِكْمَةِ قَائِلًا يَا قَوْمِ اعْبُدُوا اللهَ مَا لَكُمْ مِنْ إِلٰهٍ غَيْرُهُ قَدْ جَاءَتْكُمْ بَيِّنَةٌ مِنْ رَبِّكُمْ فَأَوْفُوا الكَيْلَ وَالمِيزَانَ بِالقِسْطِ وَلَا تَبْخَسُوا النَّاسَ أَشْيَاءَهُمْ وَلَا تَعْثَوْا فِي الأَرْضِ مُفْسِدِينْ، بَقِيَّتُ اللهِ خَيْرٌ لَكُمْ إِنْ كُنْتُمْ مُؤْمِنِينْ؛ وَقَدْ بَيَّنَ أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ أَنَّ بَقِيَّةَ اللهِ هِيَ الرِّبْحُ الحَلَالُ الطَّيِّبُ وَهِيَ فِي بَاطِنِ الآيَةِ الإِمَامُ المَهْدِيُّ المُنْتَظَرُ الَّذِي يَمْلَأُ الأَرْضَ قِسْطًا وَعَدْلًا.",
      "سَخِرَ المُسْتَكْبِرُونَ مِنْ شُعَيْبٍ بِرِيحِ الوَهْمِ وَالاسْتِهْزَاءِ وَقَالُوا يَا شُعَيْبُ أَصَلَاتُكَ تَأْمُرُكَ أَنْ نَتْرُكَ مَا يَعْبُدُ آبَاؤُنَا أَوْ أَنْ نَفْعَلَ فِي أَمْوَالِنَا مَا نَشَاءُ إِنَّكَ لَأَنْتَ الحَلِيمُ الرَّشِيدْ! وَقَالُوا مَا نَفْقَهُ كَثِيرًا مِمَّا تَقُولُ وَإِنَّا لَنَرَاكَ فِينَا ضَعِيفًا وَلَوْلَا رَهْطُكَ لَرَجَمْنَاكَ، وَهَدَّدُوهُ قَائِلِينَ لَنُخْرِجَنَّكَ يَا شُعَيْبُ وَالَّذِينَ آمَنُوا مَعَكَ مِنْ قَرْيَتِنَا! فَأَجَابَهُمْ شُعَيْبٌ بِثَبَاتٍ يَا قَوْمِ أَرَهْطِي أَعَزُّ عَلَيْكُمْ مِنَ اللهِ وَاتَّخَذْتُمُوهُ وَرَاءَكُمْ ظِهْرِيًّا، إِنْ أُرِيدُ إِلَّا الإِصْلَاحَ مَا اسْتَطَعْتُ وَمَا تَوْفِيقِي إِلَّا بِاللهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبْ، وَيَا قَوْمِ لَا يَجْرِمَنَّكُمْ شِقَاقِي أَنْ يُصِيبَكُمْ مِثْلُ مَا أَصَابَ قَوْمَ نُوحٍ أَوْ قَوْمَ هُودٍ أَوْ قَوْمَ صَالِحٍ وَمَا قَوْمُ لُوطٍ مِنْكُمْ بِبَعِيدْ، وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ إِنَّ رَبِّي رَحِيمٌ وَدُودْ.",
      "فَلَمَّا أَصَرُّوا عَلَى الكُفْرِ وَالتَّطْفِيفِ فَتَحَ شُعَيْبٌ يَدَيْهِ بِالدُّعَاءِ قَائِلًا رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالحَقِّ وَأَنْتَ خَيْرُ الفَاتِحِينْ! فَنَجَّى اللهُ شُعَيْبًا وَالَّذِينَ آمَنُوا مَعَهُ بِرَحْمَتِهِ، وَأَرْسَلَ عَلَى الظَّالِمِينَ مِنْ مَدْيَنَ الرَّجْفَةَ فَزَلْزَلَتْ بِهِمُ الأَرْضُ وَأَخَذَتْهُمْ صَيْحَةُ المَلَكِ جِبْرِيلَ فَأَصْبَحُوا فِي دِيَارِهِمْ خَاشِعِينَ جَاثِمِينَ كَأَنْ لَمْ يَغْنَوْا فِيهَا، فَتَوَلَّى عَنْهُمْ شُعَيْبٌ وَقَالَ يَا قَوْمِ لَقَدْ أَبْلَغْتُكُمْ رِسَالَاتِ رَبِّي وَنَصَحْتُ لَكُمْ فَكَيْفَ آسَى عَلَى قَوْمٍ كَافِرِينْ.",
      "ثُمَّ بَعَثَ اللهُ نَبِيَّهُ شُعَيْبًا فِي رِسَالَةٍ ثَانِيَةٍ إِلَى «أَصْحَابِ الأَيْكَةِ» وَهُمْ أَهْلُ الغَابَاتِ وَالبَسَاتِينِ المُلْتَفَّةِ الَّذِينَ كَانُوا يَبْخَسُونَ المِيزَانَ وَيَقْطَعُونَ الطَّرِيقْ، فَأَمَرَهُمْ شُعَيْبٌ قَائِلًا أَوْفُوا الكَيْلَ وَلَا تَكُونُوا مِنَ المُخْسِرِينَ وَزِنُوا بِالقِسْطَاسِ المُسْتَقِيمْ، وَبَشَّرَ الطَّائِعِينَ بِالجَنَّةِ كَمَا يُبَشِّرُ الأَنْبِيَاءُ كُلَّ عَبْدٍ رَشِيدٍ يَتَّقِي اللهْ. فَكَذَّبُوهُ وَقَالُوا إِنَّمَا أَنْتَ مِنَ المُسَحَّرِينَ وَمَا أَنْتَ إِلَّا بَشَرٌ مِثْلُنَا فَأَسْقِطْ عَلَيْنَا كِسَفًا مِنَ السَّمَاءِ إِنْ كُنْتَ مِنَ الصَّادِقِينْ! فَحَبَسَ اللهُ عَنْهُمُ الرِّيحَ سَبْعَةَ أَيَّامٍ وَسَلَّطَ عَلَيْهِمْ حَرًّا شَدِيدًا حَتَّى غَلَا المَاءُ فِي الآبَارِ وَجَفَّ كُلُّ عُشْبٍ أَخْضَرَ فِي أَرْضِهِمْ، ثُمَّ أَظَلَّتْهُمْ سَحَابَةٌ فِي الفَضَاءِ هِيَ الظُّلَّةُ فَخَرَجُوا جَمِيعًا يَجْمَعُونَ أَمْوَالَهُمْ تَحْتَهَا يَظُنُّونَ أَنَّ فِيهَا مَاءً بَارِدًا، فَأَمْطَرَتْ عَلَيْهِمُ السَّحَابَةُ نَارًا مِنْ عِنْدِ اللهِ فَهَلَكُوا بِعَذَابِ يَوْمِ الظُّلَّةِ إِنَّهُ كَانَ عَذَابَ يَوْمٍ عَظِيمْ، وَنَجَا شُعَيْبٌ وَالمُؤْمِنُونَ الَّذِينَ يَخْشَوْنَ رَبَّهُمْ، فَـشَكَرَ شُعَيْبٌ مَوْلَاهُ وَسَجَدَ لَهُ فَشَهِدَ التَّائِبُونَ بِوَحْدَانِيَّةِ اللهْ.",
      "عَاشَ شُعَيْبٌ فِي مَدْيَنَ شَيْخًا كَبِيرًا وَكَانَتْ عِنْدَهُ مَوَارِيثُ الأَنْبِيَاءِ وَعَصَا آدَمَ الخَضْرَاءُ مِنْ شَجَرِ الآسِ فِي الجَنَّةْ. وَكَانَتْ لَهُ ابْنَتَانِ عَفِيفَتَانِ تَرْعَيَانِ غَنَمَهُ فِي حَيَاءٍ وَوَقَارٍ عِنْدَ مَاءِ مَدْيَنَ حَتَّى وَصَلَ نَبِيُّ اللهِ مُوسَى بْنُ عِمْرَانَ عَلَيْهِ السَّلَامُ فَرَفَعَ الصَّخْرَةَ العَظِيمَةَ عَنِ البِئْرِ وَسَقَى لَهُمَا ثُمَّ تَوَلَّى إِلَى الظِّلِّ. فَجَاءَتْهُ إِحْدَاهُمَا تَمْشِي عَلَى اسْتِحْيَاءٍ تَدْعُوهُ إِلَى أَبِيهَا، فَاسْتَقْبَلَهُ شُعَيْبٌ بِكَرَمِ الضِّيَافَةِ وَقَدَّمَ لَهُ الطَّعَامَ الحَلَالَ الَّذِي نَبَشَ أَصْلَهُ مِنْ طَيِّبَاتِ الأَرْضِ وَقَالَ لَا تَخَفْ نَجَوْتَ مِنَ القَوْمِ الظَّالِمِينْ. وَقَالَتِ ابْنَتُهُ يَا أَبَتِ اسْتَأْجِرْهُ إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ القَوِيُّ الأَمِينْ، فَزَوَّجَهُ شُعَيْبٌ ابْنَتَهُ صَفُورَا عَلَى أَنْ يَرْعَى غَنَمَهُ ثَمَانِيَ حِجَجٍ وَأَتَمَّهَا مُوسَى عَشْرَ سِنِينَ كَامِلَةً، وَجَعَلَ اللهُ لِمُوسَى أَجْرًا مُبَارَكًا كُلَّمَا وَلَدَتِ الغَنَمُ سَخْلَةً مُرَقَّطَةً، وَأَعْطَاهُ شُعَيْبٌ العَصَا المُبَارَكَةَ الَّتِي يَأْتِي بِهَا الآيَاتِ وَيَهُشُّ بِهَا عَلَى غَنَمِهِ وَهُوَ شَاكِرٌ لِفَضْلِ رَبِّ العَالَمِينَ ذِي المُلْكِ وَالعَرْشْ."
    ],
    "words": [
      {
        "word": "عُشْبٍ",
        "desc": "وسط متصل / ساكن: ـشْـ",
        "raw": "عُشْبٍ (وسط متصل / ساكن: ـشْـ)"
      },
      {
        "word": "العَرْشْ",
        "desc": "آخر منفصل / ساكن وقفا: شْ",
        "raw": "العَرْشْ (آخر منفصل / ساكن وقفا: شْ)"
      },
      {
        "word": "شَكَرَ",
        "desc": "أول منفصل / متحرك بالفتح: شَـ",
        "raw": "شَكَرَ (أول منفصل / متحرك بالفتح: شَـ)"
      },
      {
        "word": "فَشَهِدَ",
        "desc": "أول متصل / متحرك بالفتح: ـشَـ",
        "raw": "فَشَهِدَ (أول متصل / متحرك بالفتح: ـشَـ)"
      },
      {
        "word": "خَشَعَ",
        "desc": "وسط متصل / متحرك بالفتح: ـشَـ",
        "raw": "خَشَعَ (وسط متصل / متحرك بالفتح: ـشَـ)"
      },
      {
        "word": "رَشَدَ",
        "desc": "وسط منفصل / متحرك بالفتح: شَـ",
        "raw": "رَشَدَ (وسط منفصل / متحرك بالفتح: شَـ)"
      },
      {
        "word": "نَبَشَ",
        "desc": "آخر متصل / متحرك بالفتح: ـشَ",
        "raw": "نَبَشَ (آخر متصل / متحرك بالفتح: ـشَ)"
      },
      {
        "word": "شُعَيْبٌ",
        "desc": "أول منفصل / متحرك بالضم: شُـ",
        "raw": "شُعَيْبٌ (أول منفصل / متحرك بالضم: شُـ)"
      },
      {
        "word": "عَيْشٌ",
        "desc": "آخر متصل / متحرك بالضم: ـشٌ",
        "raw": "عَيْشٌ (آخر متصل / متحرك بالضم: ـشٌ)"
      },
      {
        "word": "شِقَاقِي",
        "desc": "أول منفصل / متحرك بالكسر: شِـ",
        "raw": "شِقَاقِي (أول منفصل / متحرك بالكسر: شِـ)"
      },
      {
        "word": "بَشَّرَ",
        "desc": "وسط متصل / مضعف بالفتح: ـشَّـ",
        "raw": "بَشَّرَ (وسط متصل / مضعف بالفتح: ـشَّـ)"
      },
      {
        "word": "يَهُشُّ",
        "desc": "آخر متصل / مضعف بالضم: ـشُّ",
        "raw": "يَهُشُّ (آخر متصل / مضعف بالضم: ـشُّ)"
      },
      {
        "word": "يُبَشِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـشِّـ",
        "raw": "يُبَشِّرُ (وسط متصل / مضعف بالكسر: ـشِّـ)"
      },
      {
        "word": "شَاكِرٌ",
        "desc": "أول منفصل / ممدود بالألف: شَا",
        "raw": "شَاكِرٌ (أول منفصل / ممدود بالألف: شَا)"
      },
      {
        "word": "يَخْشَوْنَ",
        "desc": "وسط متصل / ممدود بالواو: ـشَوْ",
        "raw": "يَخْشَوْنَ (وسط متصل / ممدود بالواو: ـشَوْ)"
      },
      {
        "word": "رَشِيدٍ",
        "desc": "وسط منفصل / ممدود بالياء: شِي",
        "raw": "رَشِيدٍ (وسط منفصل / ممدود بالياء: شِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الشِّينِ (ش): النُّطْقُ السَّلِيمُ لِحَرْفِ الشِّينِ المَهْمُوسِ الرِّخْوِ ذِي صِفَةِ «التَّفَشِّي» (انْتِشَارِ الهَوَاءِ فِي الفَمِ) مِنْ مَخْرَجِ وَسَطِ اللِّسَانِ مَعَ مَا يُحَاذِيهِ مِنَ الحَنَكِ الأَعْلَى، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَالتَّأَسِّي بِبَلَاغَةِ «خَطِيبِ الأَنْبِيَاءِ» فِي قَوْلِهِ: ﴿إِنْ أُرِيدُ إِلَّا الْإِصْلَاحَ مَا اسْتَطَعْتُ وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ﴾، وَالتَّسْلِيمِ عَلَى الإِمَامِ المَهْدِيِّ (عَجَّلَ اللهُ فَرَجَهُ) بِلَقَبِهِ القُرْآنِيِّ فِي قِصَّةِ شُعَيْبٍ: «السَّلَامُ عَلَيْكَ يَا بَقِيَّةَ اللهِ فِي أَرْضِهِ»."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الأَسْنَانُ الثَّلَاثَةُ وَالنِّقَاطُ الثَّلَاثُ (كَالمِيزَانِ المُتَعَادِلِ) وَالرَّقْمُ (21): مُشَاهَدَةُ شَكْلِ حَرْفِ الشِّينِ (ش / شـ / ـشـ / ـش) المُرَكَّبِ مِنْ ثَلَاثِ سِنَاتٍ مُتَسَاوِيَةٍ تَلِيهَا كَأْسٌ نِصْفُ دَائِرِيَّةٍ وَفَوْقَهَا ثَلَاثُ نِقَاطٍ تَنْتَظِمُ فِي مُثَلَّثٍ مُتَسَاوِي الأَضْلَاعِ كَرَأْسِ المِيزَانِ («القِسْطَاسِ المُسْتَقِيمِ»)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (21) (3 × 7 = 21، المُوَافِقِ لِلنِّقَاطِ الثَّلَاثِ فِي الشِّينِ وَلِلقِيمَةِ 300)، وَشُكْرُ اللهِ عَلَى نِعْمَةِ البَصَرِ الَّتِي رَدَّهَا اللهُ لِشُعَيْبٍ ثَلَاثَ مَرَّاتٍ."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ شُعَيْبٍ الكَامِلَةِ مَعَ مَدْيَنَ وَالأَيْكَةِ وَضِيَافَةِ مُوسَى: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ شُعَيْبٍ الكَامِلَةِ فِي القُرْآنِ الكَرِيمِ (فِي 11 مَوْضِعًا) وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى الإِصْغَاءِ لِلمَوْعِظَةِ الحَسَنَةِ وَعَدَمِ الاسْتِخْفَافِ بِالنَّصِيحَةِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ وَاحِدٌ وَعِشْرُونَ (21) وَالثَّلَاثُمِائَةٍ (300) وَالمِكْيَالُ وَالمِيزَانُ: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (21) وَمَعْرِفَةِ قِيمَةِ الشِّينِ المِئَوِيَّةِ (ش = 300 = ثَلَاثُ مِئَاتٍ كَامِلَةٍ عَلَى عَدَدِ نِقَاطِ الشِّينِ الثَّلَاثِ)، وَحِسَابِ سِنِي إِجَارَةِ مُوسَى عِنْدَ شُعَيْبٍ (8 حِجَجٍ وَأَتَمَّهَا 10 سِنِينَ)، وَتَدْرِيبُ اليَدِ عَلَى إِيفَاءِ الكَيْلِ وَالوَزْنِ بِالقِسْطَاسِ المُسْتَقِيمِ، وَرَعْيِ الغَنَمِ المُرَقَّطَةِ، وَغَرْسِ الأَشْجَارِ النَّافِعَةِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ التَّوَازُنِ وَالمَشْيِ عَلَى الصِّرَاطِ المُسْتَقِيمِ وَإِمَاطَةِ الأَذَى: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ الاتِّزَانِ البَدَنِيِّ الدَّقِيقِ كَكَفَّتَيِ المِيزَانِ، وَالمَشْيِ بِأَدَبٍ وَاسْتِحْيَاءٍ (﴿تَمْشِي عَلَى اسْتِحْيَاءٍ﴾)، وَتَمْهِيدِ الطُّرُقَاتِ لِلمَارَّةِ بَدَلَ القُعُودِ فِيهَا لِلإِيذَاءِ (﴿وَلَا تَقْعُدُوا بِكُلِّ صِرَاطٍ تُوعِدُونَ﴾)."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الأَشْجَارِ المُلْتَفَّةِ (الأَيْكَةِ) وَالأَلْبَانِ وَبَرَكَةِ الرِّزْقِ الحَلَالِ: تَعَلُّمُ فَوَائِدِ الغَابَاتِ وَالأَشْجَارِ الخَضْرَاءِ المُلْتَفَّةِ («الأَيْكَةِ») فِي تَلْطِيفِ الهَوَاءِ وَإِعْطَاءِ الثِّمَارِ وَالأَخْشَابِ (كَعَصَا الأَنْبِيَاءِ مِنْ شَجَرِ الآسِ الجَنِّيِّ)، وَمَعْرِفَةِ القِيمَةِ الغِذَائِيَّةِ لِأَلْبَانِ الأَغْنَامِ، وَإِدْرَاكِ أَنَّ الكَسْبَ الحَلَالَ الطَّيِّبَ (﴿بَقِيَّتُ اللَّهِ﴾) يُبَارِكُ اللهُ فِيهِ وَيَحْفَظُ صِحَّةَ البَدَنِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الحَيَاءِ وَالنَّزَاهَةِ فِي المُعَامَلَةِ وَالوَفَاءِ بِالعَقْدِ: تَعَلُّمُ خُلُقِ العِفَّةِ وَالحَيَاءِ التَّامِّ فِي المَشْيِ وَالكَلَامِ وَعَدَمِ مُزَاحَمَةِ الرِّجَالِ (كَمَا صَنَعَتِ ابْنَتَا شُعَيْبٍ عِنْدَ مَاءِ مَدْيَنَ)، وَالأَمَانَةِ التَّامَّةِ فِي البَيْعِ وَالشِّرَاءِ وَعَدَمِ بَخْسِ النَّاسِ أَشْيَاءَهُمْ، وَالوَفَاءِ بِالعُهُودِ وَإِكْرَامِ الأَجِيرِ القَوِيِّ الأَمِينِ."
      }
    },
    "grammar": {
      "topic": "الجَارُّ وَالمَجْرُورُ فِي الجُمْلَةِ التَّامَّةْ",
      "rule": "يَتَكَوَّنُ الجَارُّ وَالمَجْرُورُ مِنْ (حَرْفِ جَرٍّ + اسْمٍ مَجْرُورٍ بِالكَسْرَةِ) لِتَوْضِيحِ مَكَانِ أَوْ هَدَفِ الفِعْلْ.",
      "example": "غَرَّدَ العُصْفُورُ عَلَى الشَّجَرَةِ — أَشْرَقَتِ الشَّمْسُ فِي السَّمَاءِ.",
      "focusWord": "عَلَى الشَّجَرَةِ",
      "q": "مَا هُوَ إِعْرَابُ كَلِمَةِ «الشَّجَرَةِ» فِي جُمْلَةِ «العُصْفُورُ عَلَى الشَّجَرَةِ»؟",
      "opts": [
        "اسْمٌ مَجْرُورٌ بِالكَسْرَةِ",
        "فَاعِلٌ مَرْفُوعٌ",
        "فِعْلٌ مَاضٍ",
        "مَفْعُولٌ بِهِ مَنْصُوبٌ"
      ]
    },
    "earIirab": {
      "topic": "تَمْيِيزُ الكَسْرَةِ (ـِ) فِي آخِرِ الاِسْمِ المَجْرُورْ",
      "rule": "أَيْنَمَا سَمِعْنَا حَرْفَ الجَرِّ (فِي، عَلَى، مِنْ، إِلَى) فَإِنَّ الاِسْمَ بَعْدَهُ يُكْسَرُ بـ (ـِ).",
      "sentence": "يَجْلِسُ الفَلَّاحُ تَحْتَ الشَّجَرَةِ فِي الظِّلِّ.",
      "targetWord": "الظِّلِّ",
      "caseAns": "اسْمٌ مَجْرُورٌ بِالكَسْرَةِ (ـِ)"
    },
    "math": {
      "numVal": 25,
      "numName": "خَمْسَةٌ وَعِشْرُونَ",
      "eqDisplay": "5 + 20 = 25",
      "subDisplay": "25 - 5 = 20",
      "compDisplay": "25 < 30",
      "q1": {
        "stem": "احْسِبْ تَرْكِيبَ العَدَدِ مِنْ آحَادِهِ وَعَشَرَاتِهِ:",
        "focus": "5 + 20 = ؟",
        "ans": "25 (خَمْسَةٌ وَعِشْرُونَ)",
        "wrong": [
          "52",
          "20",
          "35"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "25 - 5 = ؟",
        "ans": "20 (عِشْرُونَ)",
        "wrong": [
          "30 (ثَلَاثُونَ)",
          "15",
          "28"
        ]
      }
    },
    "sport": {
      "title": "إِشْرَاقَةُ الشَّمْسِ الصَّبَاحِيَّةُ لإِطَالَةِ القَوَامِ",
      "middleText": "أَمُدُّ ذِرَاعَيَّ عَالِيًا فَوْقَ رَأْسِي فِي دَائِرَةٍ وَاسِعَةٍ مَعَ أَخْذِ شَهِيقٍ عَمِيقٍ ثُمَّ أُرْخِيهِمَا مَعَ الزَّفِيرْ. يُطِيلُ هٰذَا التَّمْرِينُ العَمُودَ الفَقَرِيَّ وَيَمْلَأُ الرِّئَتَيْنِ بِالهَوَاءِ النَّقِيّْ."
    },
    "sci": {
      "title": "الفِيزْيَاءُ الكِلَاسِيكِيَّةُ: القُوَّةُ وَالحَرَكَةُ وَالآلَاتُ البَسِيطَةُ",
      "summaryThird": "تَتَحَرَّكُ الأَجْسَامُ بِقُوَّةِ الدَّفْعِ أَوِ السَّحْبِ وَتَجْذِبُهَا الجَاذِبِيَّةُ نَحْوَ الأَرْضِ، وَتُسَاعِدُنَا الآلَاتُ البَسِيطَةُ كَالرَّافِعَةِ وَالبَكَرَةِ وَالعَجَلَةِ عَلَى رَفْعِ الأَثْقَالِ بِيُسْرْ.",
      "focusConcept": "قُوَّةُ الجَاذِبِيَّةِ وَالآلَاتُ البَسِيطَةُ",
      "factAns": "حِفْظُ تَوَازُنِ الأَجْسَامِ وَتَسْهِيلُ الحَرَكَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ صَاحِبِ المَعْرُوفِ وَالعَدْلِ (حُور وَسُرُور - 21)",
      "storySentence": "تَعَلَّمَ سُرُورٌ أَنَّ مَنْ صَنَعَ إِلَيْنَا مَعْرُوفًا فَحَقُّهُ عَلَيْنَا أَنْ نَشْكُرَهُ وَنُكَافِئَهُ بِالإِحْسَانِ وَنَدْعُوَ لَهُ بِالخَيْرِ، وَأَنْ نَعْدِلَ فِي كُلِّ أَمْرٍ.",
      "applyAction": "أَقُولُ لِمَنْ أَحْسَنَ إِلَيَّ: جَزَاكَ اللهُ خَيْرًا."
    },
    "rightsFullTitle": "(31) حق الجليس + (32) حق الجار",
    "rightsQuote": "وَأمّــــا حَقُّ الجَلِيسِ فَأَنْ تُلِينَ لَهُ كَنَفَكَ ، وَتُطِيبَ لَهُ جَانِبَكَ، وَتُنْصِفَهُ فِي مُجَارَاةِ اللَّفْظِ ولا تُغْرِق  فِي نَزْعِ اللَّحْــظِ إذَا لَحَظْتَ وتَقْصُدَ فِي اللَّفْظِ إلَى إفْهَــــــــامِهِ إذَا لَفَظْتَ. وَإنْ كُنْتَ الْجَلِيــــــــــــــــــسَ إلَيْهِ كُنْتَ فِي الْقِيَـــــــــــــــامِ عَنْهُ بالْخِيَارِ وَإنْ كَانَ الجَالِسَ إلَيكَ كَانَ بالخِيَـــــــــارِ. ولا تَقُومُ إلا بــإذْنِهِ. وَلا قُوَّةَ إلا باللهِ. | وَأمّــا حَقُّ الجَارِ فَحِفْظُهُ غَائِبًا وَكَرَامَتُهُ شَاهِدًا ونُصْرَتُهُ وَمَعُونتُهُ فِي الحَـالَينِ جَمِيعــاً.  لا تَتَّبعْ لَهُ عَوْرَةً ولا تَبحَثْ لَهُ عَنْ سَوْءَ (ة) لِتَعْرِفَهَــــــــــا، فَإنْ عَرَفْتَهَــــــا مِنْهُ عَنْ غَيْرِ إرَادَة مِنْكَ وَلا تَكَلُّف كُنْتَ لِمَــــا عَلِمْتَ حِصْنـــاً حَصِينـــاً وَسِتْرًا سَــــــــــــتِيرًا، لَوْ بَحَثتِ الأَسِنَّةُ عَنْهُ ضَمِيرًا لَمْ تَتَّصِلْ إلَيْه لانطِوَائِهِ عَلَيهِ. لا تَسْــتَمِعْ عَلَيهِ مِنْ حَيْثُ لا يَعْلَـــمُ. لا تُسَلِّمْهُ عِنْدَ شَـــــــــــديدَة، ولا تَحْسُدْهُ عِنْـــــــــــدَ نِعْمَة. تُقِيلُ عَثْرَتهُ وتَغْفِرْ زَلَّتَـــــــــهُ. ولا تَدَّخِرْ حِلْمَكَ عَنْهُ إذَا جَهِلَ عَلَيْــــــــــــــــــكَ، ولا تَخرُجْ أَنْ تَكُونَ سُلَّمًا لَهُ. تَرُدُّ عَنهُ لِسَانَ الشَّتِيمَةِ، وَتُبْطِلُ فِيهِ كَيْدَ حَـــــــــــامِلِ النَّصِيحَةِ، وَتُعَــــــاشِرَهُ مُعَاشَرَةً كَرِيمَةً. وَلا حَوْلَ وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (31) حق الجليس + (32) حق الجار",
        "text": "وَأمّــــا حَقُّ الجَلِيسِ فَأَنْ تُلِينَ لَهُ كَنَفَكَ ، وَتُطِيبَ لَهُ جَانِبَكَ، وَتُنْصِفَهُ فِي مُجَارَاةِ اللَّفْظِ ولا تُغْرِق  فِي نَزْعِ اللَّحْــظِ إذَا لَحَظْتَ وتَقْصُدَ فِي اللَّفْظِ إلَى إفْهَــــــــامِهِ إذَا لَفَظْتَ. وَإنْ كُنْتَ الْجَلِيــــــــــــــــــسَ إلَيْهِ كُنْتَ فِي الْقِيَـــــــــــــــامِ عَنْهُ بالْخِيَارِ وَإنْ كَانَ الجَالِسَ إلَيكَ كَانَ بالخِيَـــــــــارِ. ولا تَقُومُ إلا بــإذْنِهِ. وَلا قُوَّةَ إلا باللهِ. | وَأمّــا حَقُّ الجَارِ فَحِفْظُهُ غَائِبًا وَكَرَامَتُهُ شَاهِدًا ونُصْرَتُهُ وَمَعُونتُهُ فِي الحَـالَينِ جَمِيعــاً.  لا تَتَّبعْ لَهُ عَوْرَةً ولا تَبحَثْ لَهُ عَنْ سَوْءَ (ة) لِتَعْرِفَهَــــــــــا، فَإنْ عَرَفْتَهَــــــا مِنْهُ عَنْ غَيْرِ إرَادَة مِنْكَ وَلا تَكَلُّف كُنْتَ لِمَــــا عَلِمْتَ حِصْنـــاً حَصِينـــاً وَسِتْرًا سَــــــــــــتِيرًا، لَوْ بَحَثتِ الأَسِنَّةُ عَنْهُ ضَمِيرًا لَمْ تَتَّصِلْ إلَيْه لانطِوَائِهِ عَلَيهِ. لا تَسْــتَمِعْ عَلَيهِ مِنْ حَيْثُ لا يَعْلَـــمُ. لا تُسَلِّمْهُ عِنْدَ شَـــــــــــديدَة، ولا تَحْسُدْهُ عِنْـــــــــــدَ نِعْمَة. تُقِيلُ عَثْرَتهُ وتَغْفِرْ زَلَّتَـــــــــهُ. ولا تَدَّخِرْ حِلْمَكَ عَنْهُ إذَا جَهِلَ عَلَيْــــــــــــــــــكَ، ولا تَخرُجْ أَنْ تَكُونَ سُلَّمًا لَهُ. تَرُدُّ عَنهُ لِسَانَ الشَّتِيمَةِ، وَتُبْطِلُ فِيهِ كَيْدَ حَـــــــــــامِلِ النَّصِيحَةِ، وَتُعَــــــاشِرَهُ مُعَاشَرَةً كَرِيمَةً. وَلا حَوْلَ وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ شُعَيْبٌ (ع): آدَابُ الحَيَاءِ وَالنَّزَاهَةِ فِي المُعَامَلَةِ وَالوَفَاءِ بِالعَقْدِ: تَعَلُّمُ خُلُقِ العِفَّةِ وَالحَيَاءِ التَّامِّ فِي المَشْيِ وَالكَلَامِ وَعَدَمِ مُزَاحَمَةِ الرِّجَالِ (كَمَا صَنَعَتِ ابْنَتَا شُعَيْبٍ عِنْدَ مَاءِ مَدْيَنَ)، وَالأَمَانَةِ التَّامَّةِ فِي البَيْعِ وَالشِّرَاءِ وَعَدَمِ بَخْسِ النَّاسِ أَشْيَاءَهُمْ، وَالوَفَاءِ بِالعُهُودِ وَإِكْرَامِ الأَجِيرِ القَوِيِّ الأَمِينِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الجليس",
        "text": "قصة: زيارة غيرت شيئًا في البيت في مساء يوم هادئ، قالت الأم: \"ستزورنا عائلة عمي هادي اليوم، جهزوا أنفسكم لاستقبالهم بأدب.\" رن الجرس، وفتحت حور الباب بابتسامة وقالت: \"أهلاً وسهلاً، تفضلوا.\" جلس الضيوف في غرفة الجلوس. اقترب ابن عمهم الصغير حمزة من نور وسأله: \"هل يمكنني اللعب بهذه اللعبة؟\" كان نور قد جهزها سابقا ليلعبوا بها، قال بابتسامة: \"أكيد، تفضل، هيا نلعب معًا.\" ثم بدأت ابنة عمهم مريم تتحدث إلى حور عن المدرسة، فقاطعتها حور مرتين بإجابات سريعة. لاحظت الأم ذلك وهمست لها: \"اتركي صديقتك تكمل كلامها، الاحترام في الاستماع قبل الكلام.\" فقالت حور بابتسامة اعتذار:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الجليس",
        "text": "\"تفضلي يا مريم، أكملي حديثك.\" جلس الأب يتحدث مع عمهم هادي ، وكان نور يجلس بجواره لكنه كان يتلفت ويطيل النظر نحو هاتف الضيف الموضوع على الطاولة. نبهه والده بصوت منخفض: \"يا نور، من أدب الجلوس ألا نزعج الآخرين بنظرات الفضول.\" فخفض نور رأسه وقال: \"معك حق يا أبي.\" بعد قليل، أرادت مريم أن تغيّر مكان جلوسها، فنهضت حور فورًا وقالت: \"اجلسي مكاني إذا أردت، خذي راحتك.\" وعندما انتهت الزيارة، ونهض الضيوف للانصراف، تبعتهم الأسرة و وقفوا احترامًا حتى ذهبوا ثم اغلقوا الباب . وعند الباب قال الأب لأبنائه بعد أن ودّعوا الضيوف: \"اتعلمون ان الجتماع يورث محبة القلوب.\" ابتسمت الأم وأضافت: \"وخير الجلسات ما كانت خالية من آفات اللسان.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الجار",
        "text": "\"جيران القلوب الطيبة\" في حيٍ هادئ تسوده الألفة، كانت تعيش عائلة حور ونور بجوار عائلة العم أبي سامي. كان الجيران متآلفين كأسرة واحدة، تتداخل ضحكاتهم في ساحات البيوت، وتتعاون أياديهم في السراء والضراء. ذات ظهيرة، بينما كان نور يشعر بالملل، نظر من النافذة فرأى دراجة سامي اللامعة متوقفة في الحديقة المشتركة. تمايلت في نفسه رغبة جامحة لركوبها، وقال في نفسه: \"سامي صديقي.. لن يغضب لو استخدمتها قليلاً!\" انطلق نور بالدراجة بسرعة، لكن فرحته لم تدم طويلاً. اصطدمت العجلة الأمامية بحجر كبير، وسقط نور على الأرض، وانكسرت سلسلة الدراجة. ارتعب الفتى وأسرع بإعادة الدراجة إلى مكانها، ثم فر إلى بيته وقلبه يخفق كالطبل. في المساء، سمعوا صوت سامي يتساءل بحيرة: \"دراجتي! كيف تعطلت فجأة؟ كنت أستخدمها صباحًا وكانت تعمل بشكل جيد!\" شعر نور بثقل الخطأ يكاد يخنقه، فتقدم بخطوات متثاقلة وقال بصوت خافت: \"أنا المسؤول يا سامي.. أخذت الدراجة دون استئذان، وأسفت على ما حدث.\" لم يغضب سامي، بل وضع يده على كتف نور وقال: \"خطأك في الأخذ دون إذن، لكن اعترافك شجاعة تكسر الخطأ. الدراجة نصلحها، لكن تذكر: الاستئذان يحفظ الحقوق، ويبني الثقة بين الجيران.\" شعر نور وكأن جبلاً أزيح عن صدره، وهمس: \"شكرًا لأنك علمتني أن الاعتراف أفضل من الهرب.\" وفي اليوم التالي، جاءت صديقة حور  بالمدرسة  \"ليان\" لزيارتها لانجاز مشروع مدرسي. نظرت حول الحديقة المشتركة وسألت باستغراب: \"لماذا تشاركون الجيران الحديقة؟ لو كنت مكانكم لطالبتُ بتخصيصها لكم وحدكم!\" تأثرت حور بكلام صديقتها، وفي المساء قالت لأمها بحيرة: \"ماما، ليان تقول إنه من الأفضل ألا نشارك الجيران الحديقة.\" ابتسمت الأم بحكمة وأجابت: \"يا بنيتي، الجيران نعمة. الكلمات كالبذور.. بعضها يزرع الود، وبعضها يزرع الشقاق. اختاري دائماً الكلام الذي يجمع القلوب لا يفرقها.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الجار",
        "text": "في اليوم التالي، عندما عادت ليان، استقبلتها أم حور بحرارة وقالت: \"نحن نحب جيراننا كأهلنا، والمشاركة تزيد المودة بيننا.\" خجلت ليان واعترفت: \"كنت مخطئة.. تعلمت أن لا أتحدث إلا بما يجمع الناس، لا يفرقهم.\" بعد أيام، تجمع الجارات في حفلة شاي صغيرة في الحديقة. وقفت ام سامي متجهًتا إلى جيرانها وقالت: \"جيراننا الأعزاء.. العفو عند المقدرة، والصبر على زلات الصغار، والحرص على العلاقات الطيبة.. هذا هو سر سعادتنا.\" أضافت أم نور: \"الجيرة الصالحة كنز.. تحمينا، تساندنا، وتجعل الحياة أجمل.\" وهكذا تعلم الجميع أن: ✅الاعتراف بالخطأ يمحوه، والكتمان يضاعفه ✅الاستئذان أدب يحترم حقوق الآخرين ✅الكلمة الطيبة جسر، والكلمة السيئة حاجز ✅حسن الجوار من أسباب السعادة والبركة 🌿 لأن الجيران قد يكونون أقرب من بعض الأهل.. فلنحفظ حقوقهم، ونرعى ودهم."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ",
      "topic": "الدُّرُوسُ (2، 3، 4): القُوَى وَقَوَانِينُ الحَرَكَةِ — الشُّغْلُ وَالطَّاقَةُ وَالآلَاتُ البَسِيطَةُ — الفِيزْيَاءُ الحَرَارِيَّةُ",
      "coverImg": "assets/y7/scince/s21.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s21.1.jpg",
          "text": "الدَّرْسُ (2) القُوَى وَقَوَانِينُ الحَرَكَةِ: نَصِفُ الحَرَكَةَ بِالمَسَافَةِ وَالسُّرْعَةِ وَالتَّسَارُعِ، وَتُغَيِّرُ قُوَّةُ الدَّفْعِ وَالسَّحْبِ حَرَكَةَ الأَجْسَامِ. قَوَانِينُ نِيُوتِنَ الثَّلَاثَةُ: الأَوَّلُ (القُصُورُ الذَّاتِيُّ)، وَالثَّانِي (القُوَّةُ = الكُتْلَةُ × التَّسَارُعِ)، وَالثَّالِثُ (لِكُلِّ فِعْلٍ رَدُّ فِعْلٍ مُسَاوٍ وَمُعَاكِسٌ)؛ وَمِنَ القُوَى الطَّبِيعِيَّةِ الجَاذِبِيَّةُ وَالاحْتِكَاكُ وَمُقَاوَمَةُ الهَوَاءِ وَالمَاءِ."
        },
        {
          "img": "assets/y7/scince/s21.3.jpg",
          "text": "الدَّرْسُ (3) الشُّغْلُ وَالطَّاقَةُ وَالآلَاتُ البَسِيطَةُ: الشُّغْلُ قُوَّةٌ تُحَرِّكُ جِسْمًا مَسَافَةً (وَحْدَتُهُ الجُولُ)، وَالقُدْرَةُ سُرْعَةُ إِنْجَازِ الشُّغْلِ (وَحْدَتُهَا الوَاتُ). تَتَبَادَلُ طَاقَةُ الوَضْعِ وَطَاقَةُ الحَرَكَةِ دَائِمًا لِأَنَّ الطَّاقَةَ لَا تَفْنَى بَلْ تَتَحَوَّلُ، وَتُسَهِّلُ الآلَاتُ البَسِيطَةُ (الرَّافِعَةُ، البَكَرَةُ، المُنْحَدَرُ، العَجَلَةُ، البُرْغِي، الإِسْفِينُ) إِنْجَازَ الشُّغْلِ."
        },
        {
          "img": "assets/y7/scince/s21.4.jpg",
          "text": "الدَّرْسُ (4) الفِيزْيَاءُ الحَرَارِيَّةُ وَالدِّينَامِيكَا الحَرَارِيَّةُ: الحَرَارَةُ طَاقَةٌ نَاتِجَةٌ عَنْ حَرَكَةِ الجُزَيْئَاتِ، وَتُقَاسُ بِالسِّيلْسِيُوسِ (C°) وَالفِهْرِنْهَايْتِ (F°) وَالكِلْفِنِ (K). تَنْتَقِلُ الحَرَارَةُ مِنَ السَّاخِنِ لِلْبَارِدِ بِالتَّوْصِيلِ (فِي الجَوَامِدِ) وَالحَمْلِ (فِي السَّوَائِلِ وَالغَازَاتِ) وَالإِشْعَاعِ، وَتَتَمَدَّدُ المَوَادُّ بِالتَّسْخِينِ وَتَنْكَمِشُ بِالتَّبْرِيدِ لِذٰلِكَ تُوضَعُ فَوَاصِلُ الأَمَانِ فِي الجُسُورِ."
        }
      ],
      "text": "الدَّرْسُ (2) القُوَى وَقَوَانِينُ الحَرَكَةِ: نَصِفُ الحَرَكَةَ بِالمَسَافَةِ وَالسُّرْعَةِ وَالتَّسَارُعِ، وَتُغَيِّرُ قُوَّةُ الدَّفْعِ وَالسَّحْبِ حَرَكَةَ الأَجْسَامِ. قَوَانِينُ نِيُوتِنَ الثَّلَاثَةُ: الأَوَّلُ (القُصُورُ الذَّاتِيُّ)، وَالثَّانِي (القُوَّةُ = الكُتْلَةُ × التَّسَارُعِ)، وَالثَّالِثُ (لِكُلِّ فِعْلٍ رَدُّ فِعْلٍ مُسَاوٍ وَمُعَاكِسٌ)؛ وَمِنَ القُوَى الطَّبِيعِيَّةِ الجَاذِبِيَّةُ وَالاحْتِكَاكُ وَمُقَاوَمَةُ الهَوَاءِ وَالمَاءِ. الدَّرْسُ (3) الشُّغْلُ وَالطَّاقَةُ وَالآلَاتُ البَسِيطَةُ: الشُّغْلُ قُوَّةٌ تُحَرِّكُ جِسْمًا مَسَافَةً (وَحْدَتُهُ الجُولُ)، وَالقُدْرَةُ سُرْعَةُ إِنْجَازِ الشُّغْلِ (وَحْدَتُهَا الوَاتُ). تَتَبَادَلُ طَاقَةُ الوَضْعِ وَطَاقَةُ الحَرَكَةِ دَائِمًا لِأَنَّ الطَّاقَةَ لَا تَفْنَى بَلْ تَتَحَوَّلُ، وَتُسَهِّلُ الآلَاتُ البَسِيطَةُ (الرَّافِعَةُ، البَكَرَةُ، المُنْحَدَرُ، العَجَلَةُ، البُرْغِي، الإِسْفِينُ) إِنْجَازَ الشُّغْلِ. الدَّرْسُ (4) الفِيزْيَاءُ الحَرَارِيَّةُ وَالدِّينَامِيكَا الحَرَارِيَّةُ: الحَرَارَةُ طَاقَةٌ نَاتِجَةٌ عَنْ حَرَكَةِ الجُزَيْئَاتِ، وَتُقَاسُ بِالسِّيلْسِيُوسِ (C°) وَالفِهْرِنْهَايْتِ (F°) وَالكِلْفِنِ (K). تَنْتَقِلُ الحَرَارَةُ مِنَ السَّاخِنِ لِلْبَارِدِ بِالتَّوْصِيلِ (فِي الجَوَامِدِ) وَالحَمْلِ (فِي السَّوَائِلِ وَالغَازَاتِ) وَالإِشْعَاعِ، وَتَتَمَدَّدُ المَوَادُّ بِالتَّسْخِينِ وَتَنْكَمِشُ بِالتَّبْرِيدِ لِذٰلِكَ تُوضَعُ فَوَاصِلُ الأَمَانِ فِي الجُسُورِ.",
      "q1": {
        "q": "مَا نَصُّ قَانُونِ نِيُوتِنَ الثَّالِثِ فِي الحَرَكَةِ؟",
        "focusWord": "قَانُونُ نِيُوتِنَ الثَّالِثُ",
        "options": [
          {
            "text": "لِكُلِّ فِعْلٍ رَدُّ فِعْلٍ مُسَاوٍ لَهُ فِي المِقْدَارِ وَمُعَاكِسٌ فِي الاتِّجَاهِ",
            "correct": true
          },
          {
            "text": "الطَّاقَةُ تَفْنَى وَتَخْتَفِي",
            "correct": false
          },
          {
            "text": "الحَرَارَةُ تَنْتَقِلُ مِنَ البَارِدِ لِلسَّاخِنِ",
            "correct": false
          },
          {
            "text": "الأَجْسَامُ لَا تَتَأَثَّرُ بِالجَاذِبِيَّةِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الآلَاتُ البَسِيطَةُ السِّتُّ الَّتِي تُسَهِّلُ عَلَيْنَا إِنْجَازَ الشُّغْلِ؟",
        "focusWord": "الآلَاتُ البَسِيطَةُ",
        "options": [
          {
            "text": "الرَّافِعَةُ، وَالبَكَرَةُ، وَالمُنْحَدَرُ، وَالعَجَلَةُ، وَالبُرْغِي، وَالإِسْفِينُ",
            "correct": true
          },
          {
            "text": "القِمْعُ وَالبَرْطَمَانُ وَالكَأْسُ",
            "correct": false
          },
          {
            "text": "التِّلِسْكُوبُ وَالمِجْهَرُ",
            "correct": false
          },
          {
            "text": "الرِّئَةُ وَالقَلْبُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الطُّرُقُ الثَّلَاثُ لِانْتِقَالِ الحَرَارَةِ، وَلِمَاذَا تُوضَعُ فَوَاصِلُ الأَمَانِ فِي الجُسُورِ؟",
        "focusWord": "انْتِقَالُ الحَرَارَةِ وَالتَّمَدُّدُ",
        "options": [
          {
            "text": "التَّوْصِيلُ وَالحَمْلُ وَالإِشْعَاعُ، وَتُوضَعُ الفَوَاصِلُ لِحِمَايَةِ الجُسُورِ عِنْدَ التَّمَدُّدِ الحَرَارِيِّ",
            "correct": true
          },
          {
            "text": "التَّبَخُّرُ وَالهُطُولُ فَقَطْ",
            "correct": false
          },
          {
            "text": "الانْشِطَارُ وَالتَّبَرْعُمُ",
            "correct": false
          },
          {
            "text": "الترْشِيحُ وَالتَّبْخِيرُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "قَوَانِينُ نِيُوتِنَ لِلْحَرَكَةِ",
          "left": "القُصُورُ الذَّاتِيُّ، وَالتَّسَارُعُ، وَلِكُلِّ فِعْلٍ رَدُّ فِعْلٍ"
        },
        {
          "right": "الآلَاتُ البَسِيطَةُ",
          "left": "الرَّافِعَةُ وَالبَكَرَةُ وَالمُنْحَدَرُ وَالعَجَلَةُ وَالبُرْغِي وَالإِسْفِينُ"
        },
        {
          "right": "طُرُقُ انْتِقَالِ الحَرَارَةِ",
          "left": "التَّوْصِيلُ فِي الجَوَامِدِ وَالحَمْلُ فِي المَوَائِعِ وَالإِشْعَاعُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَفَاهِيمَ الفِيزْيَاءِ الكِلَاسِيكِيَّةِ وَالحَرَارِيَّةِ الصَّحِيحَةَ:",
        "correct": [
          "وَحْدَةُ الشُّغْلِ الجُولُ وَالقُدْرَةِ الوَاتُ",
          "الرَّافِعَةُ وَالبَكَرَةُ وَالمُنْحَدَرُ",
          "مَقَايِيسُ الحَرَارَةِ C° وَF° وَK",
          "حِفْظُ الطَّاقَةِ وَتَحَوُّلُهَا"
        ],
        "wrong": [
          "فَنَاءُ الطَّاقَةِ مِنَ الكَوْنِ",
          "انْكِمَاشُ الحَدِيدِ بِالتَّسْخِينِ"
        ]
      },
      "applyStep": "أُطَبِّقُ مَبْدَأَ كَفَاءَةِ الطَّاقَةِ بِإِطْفَاءِ المَصَابِيحِ وَالأَجْهِزَةِ غَيْرِ المُسْتَخْدَمَةِ لِتَقْلِيلِ فَقْدِ الطَّاقَةِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt21.jpg",
      "title": "خُطَّةُ التَّدْرِيبِ الرِّيَاضِيِّ المُتَكَامِلَةُ: 6 فَقَرَاتٍ لِتَحْقِيقِ التَّوَازُنِ وَالأَدَاءِ",
      "subtitle": "الوَعْيُ، الاسْتِطَالَةُ، النُّمُوُّ العَضَلِيُّ، قَوَاعِدُ السَّلَاسَةِ، الاسْتِجَابَةُ العَصَبِيَّةُ، وَالتَّدَفُّقُ",
      "slideText": "📋 خُطَّةُ التَّدْرِيبِ الرِّيَاضِيِّ المُتَكَامِلَةُ (6 فَقَرَاتٍ × 5 دَقَائِقَ): (1) الوَعْيُ (5 د): وُقُوفٌ مُسْتَقِيمٌ وَتَنَفُّسٌ بَطْنِيٌّ (شَهِيقٌ 4ث، زَفِيرٌ 6ث)، دَوَرَانُ الرَّأْسِ وَالكَتِفَيْنِ، وَسُكُونٌ تَامٌّ. (2) الاسْتِطَالَةُ (5 د): تَعَلُّقٌ عَلَى عَارِضَةٍ، انْحِنَاءٌ أَمَامِيٌّ جَالِسٌ، وَوَضْعِيَّةُ الفَرَاشَةِ. (3) النُّمُوُّ العَضَلِيُّ (5 د): 8-12 عَدَّةَ ضَغْطٍ، 10-15 عَدَّةَ سُكْوَاتٍ، وَ40 ثَانِيَةً بِلَانْكُ (الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ، تَوَقَّفْ قَبْلَ الاهْتِزَازِ). (4) قَوَاعِدُ السَّلَاسَةِ: نَفِّذِ الوَحَدَاتِ بِالتَّرْتِيبِ، وَبَعْدَ التَّدَفُّقِ لَا تَقِفْ فَجْأَةً. (5) الاسْتِجَابَةُ العَصَبِيَّةُ (5 د): لَمْسُ الكَتِفِ الأَيْسَرِ ثُمَّ الفَخِذِ الأَيْمَنِ، خُطُوَاتُ تَغْيِيرِ الاتِّجَاهِ، وَالرَّمْيُ الخَيَالِيُّ. (6) التَّدَفُّقُ (5 د): شَدٌّ عَضَلِيٌّ تَدْرِيجِيٌّ (5ث شَدٌّ، 10ث ارْتِخَاءٌ)، وَضْعِيَّةُ الطِّفْلِ، وَاسْتِلْقَاءٌ هَادِئٌ.",
      "q1": {
        "q": "مَا القَاعِدَةُ الذَّهَبِيَّةُ فِي فَقْرَةِ (النُّمُوِّ العَضَلِيِّ) وَفِي فَقْرَةِ (الاسْتِجَابَةِ العَصَبِيَّةِ)؟",
        "focusWord": "الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ",
        "options": [
          {
            "text": "فِي النُّمُوِّ العَضَلِيِّ (الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ، تَوَقَّفْ قَبْلَ الاهْتِزَازِ)، وَفِي الاسْتِجَابَةِ العَصَبِيَّةِ (السُّرْعَةُ أَهَمُّ مِنَ الكَمَالِ)",
            "correct": true
          },
          {
            "text": "الاهْتِزَازُ الشَّدِيدُ أَثْنَاءَ التَّمْرِينِ",
            "correct": false
          },
          {
            "text": "البُطْءُ فِي الاستِجَابَةِ العَصَبِيَّةِ",
            "correct": false
          },
          {
            "text": "تَرْكُ التَّنَفُّسِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا القَاعِدَةُ الرَّابِعَةُ مِنْ (قَوَاعِدِ السَّلَاسَةِ) بَعْدَ الانْتِهَاءِ مِنْ فَقْرَةِ التَّدَفُّقِ وَالاسْتِلْقَاءِ؟",
        "focusWord": "بَعْدَ التَّدَفُّقِ لَا تَقِفْ فَجْأَةً",
        "options": [
          {
            "text": "بَعْدَ التَّدَفُّقِ لَا تَقِفْ فَجْأَةً (بَلِ انْهَضْ بِهُدُوءٍ وَتَدَرُّجٍ)",
            "correct": true
          },
          {
            "text": "اقْفِزْ فَوْرًا بِأَقْصَى سُرْعَةٍ",
            "correct": false
          },
          {
            "text": "ارْكُضْ نَحْوَ البَابِ",
            "correct": false
          },
          {
            "text": "احْبِسْ نَفَسَكَ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا التَّمَارِينُ الثَّلَاثَةُ فِي فَقْرَةِ (النُّمُوِّ العَضَلِيِّ — 5 دَقَائِقَ)؟",
        "focusWord": "ضَغْطٌ وَسُكْوَاتٌ وَبِلَانْكُ",
        "options": [
          {
            "text": "8-12 عَدَّةَ ضَغْطٍ (بُوش أَب)، وَ10-15 عَدَّةَ سُكْوَاتٍ، وَ40 ثَانِيَةً بِلَانْكُ",
            "correct": true
          },
          {
            "text": "النَّوْمُ وَالجُلُوسُ فَقَطْ",
            "correct": false
          },
          {
            "text": "تَلْوِينُ الكُرَاتِ",
            "correct": false
          },
          {
            "text": "شُرْبُ العَصِيرِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "قَاعِدَةُ النُّمُوِّ العَضَلِيِّ",
          "left": "الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ، تَوَقَّفْ قَبْلَ الاهْتِزَازِ"
        },
        {
          "right": "قَاعِدَةُ الاسْتِجَابَةِ العَصَبِيَّةِ",
          "left": "السُّرْعَةُ أَهَمُّ مِنَ الكَمَالِ"
        },
        {
          "right": "قَاعِدَةُ السَّلَاسَةِ بَعْدَ التَّدَفُّقِ",
          "left": "بَعْدَ التَّدَفُّقِ لَا تَقِفْ فَجْأَةً"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ فَقَرَاتِ وَقَوَاعِدَ خُطَّةِ التَّدْرِيبِ الرِّيَاضِيِّ المُتَكَامِلَةِ:",
        "correct": [
          "الوَعْيُ وَالتَّنَفُّسُ البَطْنِيُّ (4ث شَهِيقٌ، 6ث زَفِيرٌ)",
          "التَّعَلُّقُ وَالانْحِنَاءُ وَالفَرَاشَةُ لِلِاسْتِطَالَةِ",
          "ضَغْطٌ وَسُكْوَاتٌ وَبِلَانْكُ بِجَوْدَةٍ عَالِيَةٍ",
          "التَّدَفُّقُ الخِتَامِيُّ وَعَدَمُ الوُقُوفِ فَجْأَةً"
        ],
        "wrong": [
          "الوُقُوفُ المُفَاجِئُ بَعْدَ الاسْتِلْقَاءِ",
          "إِجْهَادُ الجِسْمِ بَعْدَ بَدْءِ الاهْتِزَازِ"
        ]
      },
      "applyStep": "أَلْتَزِمُ بِقَوَاعِدِ السَّلَاسَةِ فِي تَدْرِيبِي اليَوْمِيِّ وَلَا أَقِفُ فَجْأَةً بَعْدَ فَقْرَةِ التَّدَفُّقِ وَالاسْتِرْخَاءِ."
    }
  },
  {
    "w": 22,
    "secNum": 6,
    "heavenName": "سَمَاءُ الخَمِيسِ السَّادِسَةُ (ش ت ث خ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ الكِلَاسِيكِيَّةُ وَالطَّاقَةُ وَالصَّوْتُ وَالضَّوْءُ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "ت",
    "jummal": 400,
    "prophet": "دَاوُودُ (ع)",
    "virtue": "الحَمْدُ",
    "unitHeader": "الوَحْدَةُ الثَّانِيَةُ وَالعِشْرُونَ : نَبِيُّ اللهِ دَاوُودُ ذُو الأَيْدِ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "آتَى اللهُ نَبِيَّهُ دَاوُودَ (ع) الزَّبُورَ وَالصَّوْتَ الحَسَنَ فَسَبَّحَتْ مَعَهُ الجِبَالُ وَالطَّيْرُ، وَأَلَانَ لَهُ الحَدِيدَ لِيَصْنَعَ بِيَدِهِ وَيَأْكُلَ مِنْ عَمَلِهِ حَامِدًا شَاكِرًا.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (طُغْيَانُ جَالُوتَ مُقَابِلَ نُورِ الشَّجَاعَةِ وَإِلَانَةِ الحَدِيدِ): نَارُ الجَبَرُوتِ وَالبَغْيِ فِي جَيْشِ الطَّاغِيَةِ جَالُوتَ الَّذِي أَخْرَجَ بَنِي إِسْرَائِيلَ مِنْ دِيَارِهِمْ؛ وَفِي مُقَابِلِهَا شَجَاعَةُ الفَتَى دَاوُودَ الَّذِي قَتَلَ جَالُوتَ، وَمُعْجِزَةُ إِلَانَةِ الحَدِيدِ الصُّلْبِ فِي يَدَيْهِ كَالشَّمْعِ وَالعَجِينِ بِلَا نَارٍ وَلَا مِطْرَقَةٍ. B. الرِّيحُ (الوَهْمُ وَالهَوَى مُقَابِلَ أَنْفَاسِ التَّسْبِيحِ مَعَ الطَّيْرِ): رِيحُ الوَهْمِ وَالجبْنِ فِي قَوْلِ الضُّعَفَاءِ: ﴿لَا طَاقَةَ لَنَا الْيَوْمَ بِجَالُوتَ وَجُنُودِهِ﴾، وَالتَّحْذِيرُ مِنْ رِيحِ الهَوَى فِي الحُكْمِ (﴿وَلَا تَتَّبِعِ الْهَوَىٰ﴾)؛ وَفِي مُقَابِلِهَا تَسْخِيرُ الهَوَاءِ لِصَوْتِ دَاوُودَ الرَّخِيمِ حَتَّى كَانَتِ الطَّيْرُ تَحْشُرُ فِي الفَضَاءِ أَوَّابَةً تُسَبِّحُ بِتَسْبِيحِهِ. C. التُّرَابُ (العَقْلُ وَالحِجَارَةُ النَّاطِقَةُ وَمَعْدِنُ الحَدِيدِ): الحَصَيَاتُ التُّرَابِيَّةُ الثَّلَاثُ الَّتِي نَطَقَتْ لِدَاوُودَ فِي الطَّرِيقِ وَصَارَتْ حَجَرًا وَاحِدًا صَرَعَ جَالُوتَ، وَتَسْبِيحُ الجِبَالِ الرَّاسِيَاتِ مَعَهُ، وَاسْتِخْرَاجُ مَعْدِنِ الحَدِيدِ مِنَ الأَرْضِ لِصِنَاعَةِ الدُّرُوعِ السَّابِغَاتِ، وَحُكْمُهُ العَقْلِيُّ بِالحَقِّ وَفَصْلِ الخِطَابِ فِي قَضِيَّةِ النِّعَاجِ وَالحَرْثِ. D. المَاءُ (الطَّاعَةُ وَالابْتِلَاءُ بِالنَّهْرِ وَدُمُوعُ الأَوَّابِينَ): نَهْرُ المَاءِ الَّذِي ابْتَلَى اللهُ بِهِ جُنُودَ طَالُوتَ لِتَهْذِيبِ الشَّهْوَةِ وَإِظْهَارِ الطَّاعَةِ (فَثَبَتَ الثَّلَاثُمِائَةٍ وَالثَّلَاثَةَ عَشَرَ عَلَى عَدَدِ أَهْلِ بَدْرٍ وَأَصْحَابِ الإِمَامِ المَهْدِيِّ)، وَدُمُوعُ دَاوُودَ الغَزِيرَةُ فِي سُجُودِهِ وَتَوَاضُعُهُ فِي الأَكْلِ مِنْ كَسْبِ يَدِهِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الخَمِيسِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ اثْنَانِ وَعِشْرُونَ فِي مَنْزِلَةِ الرِّيحِ الطَّيِّبَةِ الَّتِي تَحْمِلُ أَنْفَاسَ التَّسْبِيحِ وَالتَّوْبَةِ مَعَ الجِبَالِ وَالطَّيْرِ فِي الآفَاقْ، وَهُوَ العَبْدُ الأَوَّابُ ذُو الأَيْدِ نَبِيُّ اللهِ دَاوُودُ عَلَيْهِ السَّلَامْ. كَانَ فِي صِبَاهُ أَصْغَرَ إِخْوَتِهِ يَرْعَى الغَنَمَ لِأَبِيهِ إِيشَا فِي أَرْضِ فِلَسْطِينَ بِأَمَانَةٍ وَقُوَّةٍ حَتَّى كَانَ يَحْمِي غَنَمَهُ مِنَ الأَسَدِ وَالذِّئْبْ. وَفِي ذٰلِكَ الزَّمَانِ تَسَلَّطَ المَلِكُ الجَبَّارُ جَالُوتُ عَلَى بَنِي إِسْرَائِيلَ وَأَخْرَجَهُمْ مِنْ دِيَارِهِمْ، فَبَعَثَ اللهُ لَهُمُ المَلِكَ العَالِمَ القَوِيَّ طَالُوتَ وَجَاءَتِ المَلَائِكَةُ تَحْمِلُ تَابُوتَ السَّكِينَةِ آيَةً لِمُلْكِهْ.",
      "فَصَلَ طَالُوتُ بِالجُنُودِ وَابْتَلَاهُمُ اللهُ بِنَهْرِ مَاءٍ عَذْبٍ لِيَخْتَبِرَ طَاعَتَهُمْ وَصَبْرَهُمْ عَنِ الشَّهْوَةِ، فَلَمْ يَثْبُتْ مَعَهُ إِلَّا ثَلَاثُمِائَةٍ وَثَلَاثَةَ عَشَرَ مُؤْمِنًا اغْتَرَفُوا غُرْفَةً وَاحِدَةً بِأَيْدِيهِمْ، وَكَانَ فِيهِمْ إِيشَا وَأَبْنَاؤُهُ وَأَصْغَرُهُمُ الفَتَى الشُّجَاعُ دَاوُودْ. وَفِي الطَّرِيقِ نَطَقَتْ ثَلَاثُ حَصَيَاتٍ مِنْ حِجَارَةِ التُّرَابِ بِإِذْنِ اللهِ وَقَالَتْ يَا دَاوُودُ خُذْنَا فَبِنَا تَقْتُلُ جَالُوتَ، فَوَضَعَهَا فِي مِخْلَاتِهِ فَصَارَتْ حَجَرًا وَاحِدًا بِقُدْرَةِ المَلِكِ الخَلَّاقْ. وَلَمَّا بَرَزُوا لِجَالُوتَ وَجُنُودِهِ قَالَ المُؤْمِنُونَ كَمْ مِنْ فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللهِ وَاللهُ مَعَ الصَّابِرِينْ، وَدَعَوْا رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى القَوْمِ الكَافِرِينْ! فَتَقَدَّمَ الفَتَى دَاوُودُ بِيَقِينٍ رَاسِخٍ وَوَضَعَ الحَجَرَ فِي مِقْلَاعِهِ وَرَمَى بِهِ مَعَ الهَوَاءِ فَصَكَّ جَبْهَةَ الطَّاغِيَةِ فَـقَتَلَ دَاوُودُ جَالُوتْ، وَهَزَمَ اللهُ جَيْشَ الظَّالِمِينْ.",
      "وَآتَاهُ اللهُ المُلْكَ وَالحِكْمَةَ وَعَلَّمَهُ مِمَّا يَشَاءُ، وَأَنْزَلَ عَلَيْهِ كِتَابَ الزَّبُورِ وَفِيهِ المَوَاعِظُ وَالتَّحْمِيدُ وَالبِشَارَةُ بِمُحَمَّدٍ وَأَهْلِ بَيْتِهِ الأَبْرَارْ: ﴿وَلَقَدْ كَتَبْنَا فِي الزَّبُورِ مِن بَعْدِ الذِّكْرِ أَنَّ الْأَرْضَ يَرِثُهَا عِبَادِيَ الصَّالِحُونَ﴾. وَوَهَبَهُ اللهُ صَوْتًا جَمِيلًا لَمْ يُسْمَعْ مِثْلُهُ قَطُّ؛ فَكَانَ إِذَا قَرَأَ الزَّبُورَ وَرَتَّلَ آيَاتِهِ كَمَا يُرَتِّلُ الخَاشِعُونَ سَبَّحَتْ مَعَهُ الجِبَالُ الرَّاسِيَاتُ وَاجْتَمَعَتِ الطَّيْرُ فِي السَّمَاءِ تُسَبِّحُ مَعَهُ بِالعَشِيِّ وَالإِشْرَاقْ. وَكَانَ دَاوُودُ أَعْبَدَ أَهْلِ زَمَانِهِ؛ يَصُومُ يَوْمًا وَيُفْطِرُ يَوْمًا، وَيَقُومُ ثُلُثَ اللَّيْلِ يُنَاجِي رَبَّهُ وَهُوَ فِي مِحْرَابِهِ قَانِتٌ خَاشِعْ.",
      "وَرَغْمَ مُلْكِهِ العَظِيمِ كَانَ دَاوُودُ يَتَنَزَّهُ عَنِ الأَكْلِ مِنْ بَيْتِ المَالِ، فَأَلَانَ اللهُ لَهُ الحَدِيدَ الصُّلْبَ فِي يَدَيْهِ كَالشَّمْعِ وَالعَجِينِ بِلَا نَارٍ وَلَا مِطْرَقَةٍ، وَقَالَ لَهُ اعْمَلْ سَابِغَاتٍ وَقَدِّرْ فِي السَّرْدِ وَاعْمَلُوا صَالِحًا إِنِّي بِمَا تَعْمَلُونَ بَصِيرْ. فَكَانَ دَاوُودُ يَنْسِجُ بِأَصَابِعِهِ حَلَقَاتِ الدُّرُوعِ الحَدِيدِيَّةِ المُتْقَنَةِ الَّتِي تَقِي المُؤْمِنِينَ فِي بَأْسِهِمْ، فَيَبِيعُ الدِّرْعَ فَـيَقْتَاتُ بِثَمَنِهَا خُبْزَ الشَّعِيرِ مِنْ عَمَلِ يَدِهِ وَيَتَصَدَّقُ بِالبَاقِي عَلَى الفُقَرَاءِ وَالمَسَاكِينْ.",
      "وَشَدَّ اللهُ مُلْكَهُ وَآتَاهُ الحِكْمَةَ وَفَصْلَ الخِطَابِ وَهُوَ القَضَاءُ بِالبَيِّنَةِ وَاليَمِينْ، وَقَالَ اللهُ لَهُ يَا دَاوُودُ إِنَّا جَعَلْنَاكَ خَلِيفَةً فِي الأَرْضِ فَاحْكُمْ بَيْنَ النَّاسِ بِالحَقِّ وَلَا تَتَّبِعِ الهَوَى فَيُضِلَّكَ عَنْ سَبِيلِ اللهْ. وَفِي يَوْمٍ أَرَادَ اللهُ أَنْ يُعَلِّمَهُ أَدَبًا دَقِيقًا فِي القَضَاءِ؛ فَبَيْنَمَا هُوَ فِي مِحْرَابِهِ إِذْ تَسَوَّرَ عَلَيْهِ مَلَكَانِ فِي صُورَةِ خَصْمَيْنِ دَخَلَا مِنْ فَوْقِ الجِدَارِ فَفَزِعَ مِنْهُمْ، قَالُوا لَا تَخَفْ خَصْمَانِ بَغَى بَعْضُنَا عَلَى بَعْضٍ فَاحْكُمْ بَيْنَنَا بِالحَقِّ وَلَا تُشْطِطْ، إِنَّ هٰذَا أَخِي لَهُ تِسْعٌ وَتِسْعُونَ نَعْجَةً وَلِيَ نَعْجَةٌ وَاحِدَةٌ فَقَالَ أَكْفِلْنِيهَا وَعَزَّنِي فِي الخِطَابْ! فَأَسْرَعَ دَاوُودُ قَبْلَ أَنْ يَسْمَعَ جَوَابَ الطَّرَفِ الثَّانِي وَقَالَ لَقَدْ ظَلَمَكَ بِسُؤَالِ نَعْجَتِكَ إِلَى نِعَاجِهْ! فَعَرَجَ المَلَكَانِ إِلَى السَّمَاءِ وَعَلِمَ دَاوُودُ أَنَّمَا فَتَنَّاهُ أَيِ اخْتَبَرْنَاهُ فِي عَدَمِ التَّسَرُّعِ قَبْلَ سَمَاعِ الخَصْمِ الآخَرِ كَمَا بَيَّنَ أَئِمَّةُ أَهْلِ البَيْتِ عَلَيْهِمُ السَّلَامُ فِي تَنْزِيهِ أَنْبِيَاءِ اللهِ الكِرَامْ، فَاسْتَغْفَرَ رَبَّهُ وَخَرَّ رَاكِعًا سَاجِدًا وَأَنَابَ وَبَكَى أَرْبَعِينَ يَوْمًا حَتَّى نَبَتَ العُشْبُ مِنْ دُمُوعِهِ حَوْلَ رَأْسِهِ وَقَالَ يَا رَبِّ قَدْ تُبْتُ إِلَيْكَ، فَغَفَرَ اللهُ لَهُ وَقَالَ وَإِنَّ لَهُ عِنْدَنَا لَزُلْفَى وَحُسْنَ مَآبْ.",
      "وَحَكَمَ دَاوُودُ مَعَ ابْنِهِ سُلَيْمَانَ فِي قَضِيَّةِ الحَرْثِ وَالكَرْمِ الَّذِي نَفَشَتْ فِيهِ غَنَمُ القَوْمِ لَيْلًا فَأَكَلَتْ عِنَبَهُ وَأَغْصَانَهُ، فَفَهَّمَهَا اللهُ سُلَيْمَانَ وَكُلًّا آتَى حُكْمًا وَعِلْمًا، وَتَرَكَ دَاوُودُ مُلْكَهُ وَعِلْمَهُ وَأَسَاسَ بَيْتِ المَقْدِسِ مِيرَاثًا لِابْنِهِ سُلَيْمَانَ عَلَيْهِمَا السَّلَامْ. وَكَانَ دَاوُودُ يُعَلِّمُ قَوْمَهُ أَنَّ مَنْ تَبِعَ هُدَى اللهِ فَتَحَ اللهُ لَهُ أَبْوَابَ الخَيْرِ، وَأَنَّ النَّاصِحَ الصَّادِقَ يَبُتُّ أَسْبَابَ الظُّلْمِ وَالخِلَافِ وَسَكَتَ عَنْ قَوْلِ البَاطِلِ، لِأَنَّ العَبْدَ المُنِيبَ يَتُوبُ فِي كُلِّ حِينٍ وَلَا تَمِيلُ نَفْسُهُ إِلَى الهَوَى، بَلْ يَكُونُ كُلُّ وَاحِدٍ مِنْهُمْ هُوَ عَلَى الحَقِّ ثَابِتٌ أَمِينٌ يَطْلُبُ رِضَا اللهِ بِقَلْبٍ سَلِيمٍ كُلَّمَا أَقْبَلَ لَيْلٌ أَوْ بَاتَ يُسَبِّحُ رَبَّ العَالَمِينْ."
    ],
    "words": [
      {
        "word": "يَقْتَاتُ",
        "desc": "وسط متصل / ساكن: ـتْـ",
        "raw": "يَقْتَاتُ (وسط متصل / ساكن: ـتْـ)"
      },
      {
        "word": "جَالُوتْ",
        "desc": "آخر منفصل / ساكن وقفا: تْ",
        "raw": "جَالُوتْ (آخر منفصل / ساكن وقفا: تْ)"
      },
      {
        "word": "تَبِعَ",
        "desc": "أول منفصل / متحرك بالفتح: تَـ",
        "raw": "تَبِعَ (أول منفصل / متحرك بالفتح: تَـ)"
      },
      {
        "word": "فَتَحَ",
        "desc": "أول متصل / متحرك بالفتح: ـتَـ",
        "raw": "فَتَحَ (أول متصل / متحرك بالفتح: ـتَـ)"
      },
      {
        "word": "قَتَلَ",
        "desc": "وسط متصل / متحرك بالفتح: ـتَـ",
        "raw": "قَتَلَ (وسط متصل / متحرك بالفتح: ـتَـ)"
      },
      {
        "word": "تَرَكَ",
        "desc": "أول منفصل / متحرك بالفتح: تَـ",
        "raw": "تَرَكَ (أول منفصل / متحرك بالفتح: تَـ)"
      },
      {
        "word": "سَكَتَ",
        "desc": "آخر متصل / متحرك بالفتح: ـتَ",
        "raw": "سَكَتَ (آخر متصل / متحرك بالفتح: ـتَ)"
      },
      {
        "word": "تُبْتُ",
        "desc": "أول منفصل / متحرك بالضم: تُـ",
        "raw": "تُبْتُ (أول منفصل / متحرك بالضم: تُـ)"
      },
      {
        "word": "ثَابِتٌ",
        "desc": "آخر متصل / متحرك بالضم: ـتٌ",
        "raw": "ثَابِتٌ (آخر متصل / متحرك بالضم: ـتٌ)"
      },
      {
        "word": "تِلْكَ",
        "desc": "متحرك بالكسر: تِـ",
        "raw": "تِلْكَ (متحرك بالكسر: تِـ)"
      },
      {
        "word": "رَتَّلَ",
        "desc": "وسط منفصل / مضعف بالفتح: تَّـ",
        "raw": "رَتَّلَ (وسط منفصل / مضعف بالفتح: تَّـ)"
      },
      {
        "word": "يَبُتُّ",
        "desc": "آخر متصل / مضعف بالضم: ـتُّ",
        "raw": "يَبُتُّ (آخر متصل / مضعف بالضم: ـتُّ)"
      },
      {
        "word": "يُرَتِّلُ",
        "desc": "وسط منفصل / مضعف بالكسر: تِّـ",
        "raw": "يُرَتِّلُ (وسط منفصل / مضعف بالكسر: تِّـ)"
      },
      {
        "word": "تَابُوتُ",
        "desc": "أول منفصل / ممدود بالألف: تَا",
        "raw": "تَابُوتُ (أول منفصل / ممدود بالألف: تَا)"
      },
      {
        "word": "يَتُوبُ",
        "desc": "وسط متصل / ممدود بالواو: ـتُو",
        "raw": "يَتُوبُ (وسط متصل / ممدود بالواو: ـتُو)"
      },
      {
        "word": "تَمِيلُ",
        "desc": "وسط متصل / ممدود بالياء: ـتِي",
        "raw": "تَمِيلُ (وسط متصل / ممدود بالياء: ـتِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ التَّاءِ (ت): النُّطْقُ السَّلِيمُ لِحَرْفِ التَّاءِ المَهْمُوسِ الشَّدِيدِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ أُصُولِ الثَّنَايَا العُلْيَا مَعَ هَمْسٍ لَطِيفٍ عِنْدَ السُّكُونِ وَالوَقْفِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى التَّرْتِيلِ الحَسَنِ وَالتَّسْبِيحِ بِالعَشِيِّ وَالإِشْرَاقِ، وَدُعَاءِ الثَّبَاتِ: ﴿رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا﴾، وَتَعَلُّمِ «فَصْلِ الخِطَابِ» (البَيَانِ الفَاصِلِ بَيْنَ الحَقِّ وَالبَاطِلِ بِالبَيِّنَةِ)."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الصَّحْنُ المُنْبَسِطُ وَحَلَقَاتُ السَّرْدِ الهَنْدَسِيَّةُ وَالرَّقْمُ (22): مُشَاهَدَةُ شَكْلِ حَرْفِ التَّاءِ (ت / تـ / ـتـ / ـت) المُرَكَّبِ مِنْ صَحْنٍ مُسْتَوٍ كَتَابُوتِ السَّكِينَةِ أَوْ كَفَّتَيِ القَضَاءِ وَفَوْقَهُ نُقْطَتَانِ مُتَسَاوِيَتَانِ (كَالْخَصْمَيْنِ المَاثِلَيْنِ أَمَامَ القَاضِي العَادِلِ)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (22) (المُؤَلَّفِ مِنْ رَقْمَيْنِ مُتَسَاوِيَيْنِ 2 وَ 2 فِي تَوَازُنٍ تَامٍّ)، وَمُلَاحَظَةُ دِقَّةِ تَشَابُكِ الحَلَقَاتِ الحَدِيدِيَّةِ الدَّائِرِيَّةِ فِي «السَّرْدِ» (الدُّرُوعِ السَّابِغَاتِ: ﴿وَقَدِّرْ فِي السَّرْدِ﴾)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ دَاوُودَ الكَامِلَةُ وَأَدَبُ القَاضِي فِي سَمَاعِ الخَصْمَيْنِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ دَاوُودَ فِي القُرْآنِ الكَرِيمِ (فِي 16 مَوْضِعًا) وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى القَاعِدَةِ العَدْلِيَّةِ الكُبْرَى الَّتِي تَعَلَّمَهَا دَاوُودُ: أَلَّا يَحْكُمَ لِأَحَدِ الخَصْمَيْنِ حَتَّى يَسْمَعَ كَلَامَ الخَصْمِ الآخَرِ، وَتَذَوُّقُ جَمَالِ الأَصْوَاتِ المُسَبِّحَةِ فِي الطَّبِيعَةِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ اثْنَانِ وَعِشْرُونَ (22) وَالأَرْبَعُمِائَةٍ (400) وَإِكْمَالُ المِائَةِ (99 + 1): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (22) وَمَعْرِفَةِ قِيمَةِ التَّاءِ المِئَوِيَّةِ (ت = 400 = أَرْبَعُ مِئَاتٍ كَامِلَةٍ)، وَحِسَابِ مَسْأَلَةِ النِّعَاجِ فِي القُرْآنِ الكَرِيمِ (99 نَعْجَةً + نَعْجَةٌ وَاحِدَةٌ = 100)، وَعَدَدِ جُنُودِ طَالُوتَ الصَّابِرِينَ (313)، وَتَدْرِيبُ اليَدِ عَلَى الصِّنَاعَةِ الدَّقِيقَةِ وَالأَكْلِ مِنْ عَمَلِ اليَدِ كَمَا كَانَ دَاوُودُ يَنْسِجُ الدُّرُوعَ بِيَدَيْهِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ ثَبَاتِ الأَقْدَامِ وَقِيَامِ اللَّيْلِ وَخُرُوجِ السُّجُودِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى تَمَارِينِ الرُّسُوخِ وَثَبَاتِ القَدَمَيْنِ عَلَى الأَرْضِ عِنْدَ الرَّمْيِ وَالمُوَاجَهَةِ، وَرِيَاضَةِ القِيَامِ وَالرُّكُوعِ وَالسُّجُودِ التَّعَبُّدِيِّ (﴿فَخَرَّ رَاكِعًا وَأَنَابَ﴾)، وَنَشَاطِ البَدَنِ فِي قِيَامِ ثُلُثِ اللَّيْلِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ صَوْمِ دَاوُودَ وَالاقْتِصَادِ فِي شُرْبِ المَاءِ وَخُبْزِ الشَّعِيرِ: تَعَلُّمُ النِّظَامِ الصِّحِّيِّ الأَعْظَمِ فِي «صِيَامِ دَاوُودَ» (كَانَ يَصُومُ يَوْمًا وَيُفْطِرُ يَوْمًا، وَيَنَامُ نِصْفَ اللَّيْلِ وَيَقُومُ ثُلُثَهُ وَيَنَامُ سُدُسَهُ)، وَفَائِدَةِ الاكْتِفَاءِ بِغُرْفَةٍ وَاحِدَةٍ مِنَ المَاءِ عِنْدَ العَطَشِ الشَّدِيدِ بَعْدَ التَّعَبِ (كَمَا شَرِبَ المُؤْمِنُونَ غُرْفَةً بِاليَدِ مِنْ نَهْرِ طَالُوتَ فَروُوا وَنَشِطُوا، بَيْنَمَا كَسِلَ مَنْ أَسْرَفَ فِي الشُّرْبِ)، وَبَرَكَةِ أَكْلِ خُبْزِ الشَّعِيرِ مِنْ كَسْبِ اليَدِ الحَلَالِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ النَّزَاهَةِ التَّامَّةِ عَنْ بَيْتِ المَالِ وَالعَدْلِ بَيْنَ الخُصُومِ: تَعَلُّمُ خُلُقِ العِفَّةِ وَالتَّنَزُّهِ عَنْ أَمْوَالِ النَّاسِ حَتَّى لَوْ كَانَ الإِنْسَانُ مَلِكًا أَوْ قَاضِيًا، وَتَنْزِيهِ أَنْبِيَاءِ اللهِ الكِرَامِ عَنْ كُلِّ قَبِيحٍ (كَمَا نَزَّهَ أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ نَبِيَّ اللهِ دَاوُودَ عَنْ أَبَاطِيلِ الإِسْرَائِيلِيَّاتِ)، وَحُرْمَةِ تَسَوُّرِ الجُدْرَانِ وَالدُّخُولِ عَلَى النَّاسِ مِنْ غَيْرِ الأَبْوَابِ."
      }
    },
    "grammar": {
      "topic": "حُرُوفُ الجَرِّ المُتَّصِلَةُ بِالاِسْمِ: (البَاءُ بـ، اللَّامُ لـ، الكَافُ كـ)",
      "rule": "تَتَّصِلُ الحُرُوفُ (بِـ، لِـ، كَـ) بِأَوَّلِ الاِسْمِ فَتَجُرُّ آخِرَهُ بِالكَسْرَةِ (ـِ) مِثْلَ: (بِالقَلَمِ، لِلمُعَلِّمِ، كَالأَسَدِ).",
      "example": "كَتَبْتُ بِالقَلَمِ — الحَمْدُ للهِ — العِلْمُ كَالنُّورِ.",
      "focusWord": "بِالقَلَمِ / كَالنُّورِ",
      "q": "مَا هِيَ حَرَكَةُ آخِرِ كَلِمَةِ «القَلَمِ» بَعْدَ اتِّصَالِ حَرْفِ البَاءِ بِهَا فِي «بِالقَلَمِ»؟",
      "opts": [
        "الكَسْرَةُ (ـِ) لِأَنَّهُ مَجْرُورٌ",
        "الضَّمَّةُ (ـُ)",
        "الفَتْحَةُ (ـَ)",
        "السُّكُونُ (ـْ)"
      ]
    },
    "earIirab": {
      "topic": "سَمَاعُ الكَسْرَةِ مَعَ حُرُوفِ الجَرِّ المُتَّصِلَةِ (بِـ / لِـ / كَـ)",
      "rule": "سَوَاءٌ أَكَانَ حَرْفُ الجَرِّ مُنْفَصِلًا (فِي) أَمْ مُتَّصِلًا (بِـ)، فَإِنَّ الاِسْمَ بَعْدَهُ يُجَرُّ بِالكَسْرَةِ (ـِ).",
      "sentence": "قَطَفْتُ التَّمْرَ بِاليَدِ.",
      "targetWord": "بِاليَدِ",
      "caseAns": "اسْمٌ مَجْرُورٌ بِالبَاءِ وَعَلَامَتُهُ الكَسْرَةُ (ـِ)"
    },
    "math": {
      "numVal": 36,
      "numName": "سِتَّةٌ وَثَلَاثُونَ",
      "eqDisplay": "6 + 30 = 36",
      "subDisplay": "36 - 6 = 30",
      "compDisplay": "36 < 40",
      "q1": {
        "stem": "احْسِبْ تَرْكِيبَ الآحَادِ وَالعَشَرَاتِ:",
        "focus": "6 + 30 = ؟",
        "ans": "36 (سِتَّةٌ وَثَلَاثُونَ)",
        "wrong": [
          "63",
          "30",
          "46"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الطَّرْحِ:",
        "focus": "36 - 6 = ؟",
        "ans": "30 (ثَلَاثُونَ)",
        "wrong": [
          "6 (سِتَّةٌ)",
          "26",
          "40"
        ]
      }
    },
    "sport": {
      "title": "المَشْيُ المُتَوَازِنُ عَلَى الخَطِّ المُسْتَقِيمِ",
      "middleText": "أَمْشِي خُطْوَةً تِلْوَ الأُخْرَى عَلَى خَطٍّ مُسْتَقِيمٍ مَرْسُومٍ عَلَى الأَرْضِ وَرَأْسِي مَرْفُوعٌ لِلأَمَامْ. يُقَوِّي هٰذَا التَّمْرِينُ التَّآزُرَ الحَرَكِيَّ البَصَرِيَّ وَدِقَّةَ التَّحَكُّمِ فِي الخُطُوَاتْ."
    },
    "sci": {
      "title": "الصَّوْتُ وَالكَهْرَبَاءُ وَقُوَّةُ المِغْنَاطِيسِ",
      "summaryThird": "يَنْتَقِلُ الصَّوْتُ عَلَى شَكْلِ مَوْجَاتٍ اهْتِزَازِيَّةٍ فِي الهَوَاءِ، وَتَسْرِي الكَهْرَبَاءُ فِي الدَّارَةِ المُغْلَقَةِ لِتُضِيءَ المِصْبَاحَ، بَيْنَمَا يَجْذِبُ المِغْنَاطِيسُ الحَدِيدَ بِقُطْبَيْهِ الشَّمَالِيِّ وَالجَنُوبِيّْ.",
      "focusConcept": "الدَّارَةُ الكَهْرَبَائِيَّةُ وَالمِغْنَاطِيسُ",
      "factAns": "إِضَاءَةُ المِصْبَاحِ وَجَذْبُ المَعَادِنِ الحَدِيدِيَّةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الأُمِّ الغَالِيَةِ (حُور وَسُرُور - 22)",
      "storySentence": "قَبَّلَتْ حُورُ وَسُرُورٌ يَدَ أُمِّهِمَا الحَنُونَةِ، وَعَرَفَا أَنَّ حَقَّ الأُمِّ عَظِيمٌ لِأَنَّهَا حَمَلَتْنَا وَأَرْضَعَتْنَا وَسَهِرَتْ عَلَى رَاحَتِنَا وَأَحَاطَتْنَا بِالحُبِّ وَالدُّعَاءْ.",
      "applyAction": "أُطِيعُ أُمِّي بِسُرُورٍ وَأُسَاعِدُهَا وَأَدْعُو لَهَا كُلَّ يَوْمْ."
    },
    "rightsFullTitle": "(33) حق الصاحب + (34) حق الشريك",
    "rightsQuote": "وَأمـــــــــــــّا حَقُّ الصَّاحِب فَأَنْ تَصْحَبَهُ بالفَضلِ مَـــــــا وَجَدْتَ إلَيهِ سَبيلاً وإلا فَلا أَقَلَّ مِنَ الإنصَــــــــافِ، وَأَنْ تُكْرِمَهُ كَمَا يـُكْرِمُكَ، وَتـحْفَظَـــــــــــــــــهُ كَمَا يـَحْفَظُكَ، ولا يَسْبقَكَ فِيمَــا بَينَكَ وبَينَهُ إلَى مـَكْرَمَة، فَـــــــــــــإنْ سَبَقَكَ كَافَـــأتَهُ. ولا تُقَصِّرَ بهِ عَمَّا يَسْتَحِقُّ مِنَ الْمَوَدَّةِ. تُلْزِمُ نفْسَكَ نصِيحَتَهُ وَحِيَـــــــــاطَتَهُ وَمُعَاضَدتَهُ عَلَى طَـــــاعَةِ رَبهِ وَمَعُونتَهُ عَلَى نَفْسِهِ فِيمَــــــــا لا يَهُمُّ بهِ مِنْ مَعْصِيةِ رَبهِ، ثُمَّ تَكُونُ (عَلَيْهِ) رَحْمَةً ولا تَكُونُ عَلَيهِ عَذَاباً. ولا قُوَّةَ إلا باللهِ. | وَأمّــا حَقُّ الشَّرِيكِ، فَإنْ غَابَ كَفَيْتَـــــــــــــــــهُ، وَإنْ حَضَرَ سَــــــــــــاويْتَهُ، ولا تَعْزِمْ عَلَى حُكْمِكَ دُونَ حُكْمِـــــهِ، وَلا تَعمَــــــــــــــــــلْ برَأْيكَ دُونَ مُنــــاظَرَتهِ، وتَحْفَظُ عَلَيْهِ مَالَهُ وَتنْفِي عَنْهُ خِيَانتَهُ فِيمَـا عَزَّ أَو هَانَ فَإنَّهُ بَلَغَنَا أَنَّ “يَدَ اللهِ عَلَى الشَّرِيـكَيْنِ مَــــــــــــــــــا لَمْ يَتَخاوَنا”. ولا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (33) حق الصاحب + (34) حق الشريك",
        "text": "وَأمـــــــــــــّا حَقُّ الصَّاحِب فَأَنْ تَصْحَبَهُ بالفَضلِ مَـــــــا وَجَدْتَ إلَيهِ سَبيلاً وإلا فَلا أَقَلَّ مِنَ الإنصَــــــــافِ، وَأَنْ تُكْرِمَهُ كَمَا يـُكْرِمُكَ، وَتـحْفَظَـــــــــــــــــهُ كَمَا يـَحْفَظُكَ، ولا يَسْبقَكَ فِيمَــا بَينَكَ وبَينَهُ إلَى مـَكْرَمَة، فَـــــــــــــإنْ سَبَقَكَ كَافَـــأتَهُ. ولا تُقَصِّرَ بهِ عَمَّا يَسْتَحِقُّ مِنَ الْمَوَدَّةِ. تُلْزِمُ نفْسَكَ نصِيحَتَهُ وَحِيَـــــــــاطَتَهُ وَمُعَاضَدتَهُ عَلَى طَـــــاعَةِ رَبهِ وَمَعُونتَهُ عَلَى نَفْسِهِ فِيمَــــــــا لا يَهُمُّ بهِ مِنْ مَعْصِيةِ رَبهِ، ثُمَّ تَكُونُ (عَلَيْهِ) رَحْمَةً ولا تَكُونُ عَلَيهِ عَذَاباً. ولا قُوَّةَ إلا باللهِ. | وَأمّــا حَقُّ الشَّرِيكِ، فَإنْ غَابَ كَفَيْتَـــــــــــــــــهُ، وَإنْ حَضَرَ سَــــــــــــاويْتَهُ، ولا تَعْزِمْ عَلَى حُكْمِكَ دُونَ حُكْمِـــــهِ، وَلا تَعمَــــــــــــــــــلْ برَأْيكَ دُونَ مُنــــاظَرَتهِ، وتَحْفَظُ عَلَيْهِ مَالَهُ وَتنْفِي عَنْهُ خِيَانتَهُ فِيمَـا عَزَّ أَو هَانَ فَإنَّهُ بَلَغَنَا أَنَّ “يَدَ اللهِ عَلَى الشَّرِيـكَيْنِ مَــــــــــــــــــا لَمْ يَتَخاوَنا”. ولا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ دَاوُودُ (ع): آدَابُ النَّزَاهَةِ التَّامَّةِ عَنْ بَيْتِ المَالِ وَالعَدْلِ بَيْنَ الخُصُومِ: تَعَلُّمُ خُلُقِ العِفَّةِ وَالتَّنَزُّهِ عَنْ أَمْوَالِ النَّاسِ حَتَّى لَوْ كَانَ الإِنْسَانُ مَلِكًا أَوْ قَاضِيًا، وَتَنْزِيهِ أَنْبِيَاءِ اللهِ الكِرَامِ عَنْ كُلِّ قَبِيحٍ (كَمَا نَزَّهَ أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ نَبِيَّ اللهِ دَاوُودَ عَنْ أَبَاطِيلِ الإِسْرَائِيلِيَّاتِ)، وَحُرْمَةِ تَسَوُّرِ الجُدْرَانِ وَالدُّخُولِ عَلَى النَّاسِ مِنْ غَيْرِ الأَبْوَابِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصاحب",
        "text": "قصة حور ونور: صداقة تعبر عن الامتنان في صباح أحد الأيام، وهما في طريقهما إلى المدرسة، قال نور لأخته حور: \"ما أجمل صحبتك يا أختي! كلما هممتُ أنسى قنينة الماء، إذا بك قد أحضرتِها لي\". فأجابته حور وهي تمدُّها إليه: \"ها هي ذا اليوم أيضًا، خذها يا أخي. إني أكره أن تعطش ولا تجد ما تروي به ظمأك\". وعندما وصلا إلى المدرسة، وجدا أصدقاءهما في انتظارهما. وقد علم الأصدقاء أن حور كانت تشكو من ألم في قدميها اليوم السابق، فبادروا إلى حمل حقيبتها وساعدوها حتى وصلت إلى فصلها. قالت حور ممتنة: \"ما أعظمكم من أصدقاء! تسرُّ القلوب بصحبتكم، ويعتمد عليكم في الشدائد.\" أما هم فاكتفوا بالابتسام ردًا على كلماتها. وفي طريق عودتها إلى البيت، كانت حور تفكر: \"ليتني أستطيع مكافأة هؤلاء الأصدقاء على لطفهم.\" ولما وصلت إلى المنزل، حكت لأمها عن ما لاقته من ودٍّ ومعونة من أصحابها. ففرحت الأم وقالت: \"أتعلمين يا بنيتي أنهم يقولون: الصديق ثم الطريق؟\" فأضاف نور ضاحكًا: \"بل حور خير صديق في الطريق!\" فضحك الجميع متذكرين قنينة الماء."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصاحب",
        "text": "ثم قالت حور: \"لقد خطرت لي فكرة! سأهدي أصدقائي كتيبات صغيرة للأدعية، مثل الذي أقرأ فيه بعد الصلاة. فأحب أن يشعروا بالراحة والطمأنينة مثلما أشعر.\" فسأل نور: \"أفلا أحصل أنا أيضًا على أحد هذه الكتيبات؟\" أجابت حور: \"كلا، هذه الهدايا خاصة بأصدقائي الذين يساعدونني دائمًا.\" فتدخلت الأم قائلة: \"يا بنيتي، إن من أدب الصحبة أن نحسن إلى الصاحب، سواء أحسن إلينا أم لم يحسن. فالإحسان لا يقتصر على المقابل.\" فقالت حور: \"ولكنه يا أمي لا يساعدني في شيء!\" فأجابت الأم: \"أليس هو من يرافقك إلى المدرسة ويؤنس وحشتك في الطريق؟\" فقال نور: \"صدقتِ يا أمي! سأهدي أختي أجمل هدية غدًا لتريها كم أقدر صحبتها.\" في الصباح التالي، جهزت حور الكتيبات لأصدقائها، وقبل أن يخرجا من البيت، قدم نور لأخته هدية - قارورة ماء جديدة بدل القديمة - قائلاً: \"خذي هذه يا أختي هدية مني، عربون شكر على حسن صحبتك.\" فقالت حور: \"وخُذ أنت هذا الكتيب يا أخي. إن كنتُ أحب صحبة أصدقائي، فأنت خيرهم جميعًا.\" ثم خرجا إلى المدرسة معًا، يضحكان ويتبادلان أطراف الحديث، وقد ازدادت روابط المودة بينهما متانةً وقوة."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الشريك",
        "text": "قصة الشراكة الحقيقية: نور وسليم ومشروع العلوم في فصل الشتاء الماضي، قرر نور - تلميذ الصف السادس - المشاركة في مسابقة العلوم المدرسية مع صديقه سليم. بعد مناقشات عديدة، اتفقا على بناء مولّد كهربائي بسيط، واشتريا معًا المواد اللازمة من مصروفهما الشخصي. بدأ العمل بحماس، لكن سليم غاب فجأة بسبب مرض أخيه الصغير. استمر نور في العمل وحده ثلاثة أيام، يشعر بتعب متزايد وامتعاض خفي: \"لماذا أتحمل العبء كله؟هذا ليس عدلاً!\" عندما عاد سليم، كان مفاجئًا لما حدث. نظر إلى العمل المنفرد بنور وقال بغضب: \"كيف تستطيع الاستمرار من دوني؟لقد تجاهلت رأيي تمامًا!\" انفجر الخلاف كالبركان. دفع نور أدوات سليم بعيدًا، بينما انتزع سليم الأسلاك المشتركة من يد نور. تقطعت أواصر الصداقة، وكاد مشروعهما يتحول إلى حطام. في تلك الليلة، تذكر نور كلمات والده الحكيمة: \"يا بني،الشريك كالساعد للجسد - إذا غاب كفيته، وإذا حضر ساويته، وإذا اختلفتما فاشتركا في الحلم قبل المشاركة في العمل.\" في الصباح التالي، وبينما كان سليم جالسًا وحيدًا في الفناء، اقترب منه نور وقال:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الشريك",
        "text": "\"لقد أخطأت حين استبعدتك...كان علينا أن نعمل معًا، لا أن تتفوق إحدانا على الآخر.\" أجاب سليم بصوت خافت: \"وأنا أخطأت حين تخليت عنك في أصعب الأوقات.\" بدأت المصالحة بكلمات بسيطة، لكنها كانت مؤثرة. أعادا تقسيم المهام: نور يتولى التركيب الميكانيكي، وسليم يهتم بالدوائر الكهربائية. كانا يتشاوران قبل كل خطوة، ويصحح كل منهما للآخر، ويتناوبان على التشجيع عندما يشعر أحدهما بالإرهاق. في يوم العرض النهائي، وقف المولّد شامخًا يُضيء المصباح الصغير. قال المعلم مبهورًا: \"النتيجة مذهلة...لكن ما أعجبني حقًا هو رحلتكما معًا من الصراع إلى التعاون.\" لم يفوزا بالجائزة الأولى فقط، بل اكتشفا سرًا أعظم: \"الشراكة الحقيقية ليست مجرد تقسيم العمل،بل هي مشاركة الأحلام وتحمل المسؤولية معًا.\" وفي نهاية اليوم، كتب نور في مذكراته: \"تعلمت اليوم أن يد الله مع الشريكين عندما يكون قلبهما معًا،وعقلهما مفتوح، وإرادتهما موحدة.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ",
      "topic": "الدُّرُوسُ (5، 6، 7، 8): فِيزْيَاءُ الأَمْوَاجِ وَالصَّوْتِ وَالضَّوْءِ — الكَهْرَبَاءُ وَالمِغْنَاطِيسِيَّةُ — الفِيزْيَاءُ الذَّرِّيَّةُ وَالنِّسْبِيَّةُ — مَبَادِئُ الكَوَانْتَمِ",
      "coverImg": "assets/y7/scince/s22.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s22.1.jpg",
          "text": "الدَّرْسُ (5) فِيزْيَاءُ الأَمْوَاجِ وَالصَّوْتِ وَالضَّوْءِ: المَوْجَةُ تَنْقُلُ الطَّاقَةَ دُونَ نَقْلِ المَادَّةِ (مُسْتَعْرِضَةٌ وَطُولِيَّةٌ ذَاتُ قِمَّةٍ وَقَاعٍ). الصَّوْتُ يَنْشَأُ مِنِ اهْتِزَازِ الأَجْسَامِ وَيَحْتَاجُ لِوَسَطٍ مَادِّيٍّ، أَمَّا الضَّوْءُ فَيَسِيرُ فِي خُطُوطٍ مُسْتَقِيمَةٍ وَيَنْعَكِسُ وَيَنْكَسِرُ وَهُوَ جُزْءٌ مِنَ الطَّيْفِ الكَهْرُومِغْنَاطِيسِيِّ."
        },
        {
          "img": "assets/y7/scince/s22.2.jpg",
          "text": "الدَّرْسُ (6) الكَهْرَبَاءُ وَالمِغْنَاطِيسِيَّةُ: الشِّحْنَاتُ المُخْتَلِفَةُ تَتَجَاذَبُ وَالمُتَشَابِهَةُ تَتَنَافَرُ، وَالتَّيَّارُ الكَهْرَبَائِيُّ سَرَيَانُ الإِلِكْتْرُونَاتِ فِي المَوَصِّلَاتِ كَالنُّحَاسِ. لِلْمِغْنَاطِيسِ قُطْبٌ شَمَالِيٌّ وَجَنُوبِيٌّ، وَالمُوَلِّدُ يُحَوِّلُ الحَرَكَةَ لِكَهْرَبَاءَ بَيْنَمَا المُحَرِّكُ يُحَوِّلُ الكَهْرَبَاءَ لِحَرَكَةٍ."
        },
        {
          "img": "assets/y7/scince/s22.3.jpg",
          "text": "الدَّرْسُ (7) الفِيزْيَاءُ الذَّرِّيَّةُ وَالنَّوَوِيَّةُ وَالزَّمَكَانُ: تَتَكَوَّنُ الذَّرَّةُ مِنْ نَوَاةٍ (بُرُوتُونَاتٍ وَنِيُوتْرُونَاتٍ مَبْنِيَّةٍ مِنْ كَوَارْكَاتٍ) وَإِلِكْتْرُونَاتٍ. القُوَى الكَوْنِيَّةُ الأَرْبَعُ: الجَاذِبِيَّةُ، وَالكَهْرُومِغْنَاطِيسِيَّةُ، وَالنَّوَوِيَّةُ القَوِيَّةُ، وَالنَّوَوِيَّةُ الضَّعِيفَةُ؛ وَتَشْرَحُ النِّسْبِيَّةُ نَسِيجَ الزَّمَكَانِ وَمُعَادَلَةَ أَيْنِشْتَايْنَ (E=mc²)."
        },
        {
          "img": "assets/y7/scince/s22.4.jpg",
          "text": "الدَّرْسُ (8) مَبَادِئُ فِيزْيَاءِ الكَمِّ (الكَوَانْتَمِ): الكَوَانْتَمُ حِزَمٌ مُحَدَّدَةٌ مِنَ الطَّاقَةِ، وَالفُوتُونَاتُ جُسَيْمَاتُ الضَّوْءِ. يَمْتَلِكُ الضَّوْءُ وَالجُسَيْمَاتُ طَبِيعَةً مُزْدَوِجَةً (مَوْجَةٌ وَجُسَيْمٌ)، وَيَقْفِزُ الإِلِكْتْرُونُ بَيْنَ المَدَارَاتِ بـ(القَفْزَةِ الكَمِّيَّةِ) مُطْلِقًا فُوتُونًا، وَيَتَوَاجَدُ فِي سَحَابَةٍ احْتِمَالِيَّةٍ."
        }
      ],
      "text": "الدَّرْسُ (5) فِيزْيَاءُ الأَمْوَاجِ وَالصَّوْتِ وَالضَّوْءِ: المَوْجَةُ تَنْقُلُ الطَّاقَةَ دُونَ نَقْلِ المَادَّةِ (مُسْتَعْرِضَةٌ وَطُولِيَّةٌ ذَاتُ قِمَّةٍ وَقَاعٍ). الصَّوْتُ يَنْشَأُ مِنِ اهْتِزَازِ الأَجْسَامِ وَيَحْتَاجُ لِوَسَطٍ مَادِّيٍّ، أَمَّا الضَّوْءُ فَيَسِيرُ فِي خُطُوطٍ مُسْتَقِيمَةٍ وَيَنْعَكِسُ وَيَنْكَسِرُ وَهُوَ جُزْءٌ مِنَ الطَّيْفِ الكَهْرُومِغْنَاطِيسِيِّ. الدَّرْسُ (6) الكَهْرَبَاءُ وَالمِغْنَاطِيسِيَّةُ: الشِّحْنَاتُ المُخْتَلِفَةُ تَتَجَاذَبُ وَالمُتَشَابِهَةُ تَتَنَافَرُ، وَالتَّيَّارُ الكَهْرَبَائِيُّ سَرَيَانُ الإِلِكْتْرُونَاتِ فِي المَوَصِّلَاتِ كَالنُّحَاسِ. لِلْمِغْنَاطِيسِ قُطْبٌ شَمَالِيٌّ وَجَنُوبِيٌّ، وَالمُوَلِّدُ يُحَوِّلُ الحَرَكَةَ لِكَهْرَبَاءَ بَيْنَمَا المُحَرِّكُ يُحَوِّلُ الكَهْرَبَاءَ لِحَرَكَةٍ. الدَّرْسُ (7) الفِيزْيَاءُ الذَّرِّيَّةُ وَالنَّوَوِيَّةُ وَالزَّمَكَانُ: تَتَكَوَّنُ الذَّرَّةُ مِنْ نَوَاةٍ (بُرُوتُونَاتٍ وَنِيُوتْرُونَاتٍ مَبْنِيَّةٍ مِنْ كَوَارْكَاتٍ) وَإِلِكْتْرُونَاتٍ. القُوَى الكَوْنِيَّةُ الأَرْبَعُ: الجَاذِبِيَّةُ، وَالكَهْرُومِغْنَاطِيسِيَّةُ، وَالنَّوَوِيَّةُ القَوِيَّةُ، وَالنَّوَوِيَّةُ الضَّعِيفَةُ؛ وَتَشْرَحُ النِّسْبِيَّةُ نَسِيجَ الزَّمَكَانِ وَمُعَادَلَةَ أَيْنِشْتَايْنَ (E=mc²). الدَّرْسُ (8) مَبَادِئُ فِيزْيَاءِ الكَمِّ (الكَوَانْتَمِ): الكَوَانْتَمُ حِزَمٌ مُحَدَّدَةٌ مِنَ الطَّاقَةِ، وَالفُوتُونَاتُ جُسَيْمَاتُ الضَّوْءِ. يَمْتَلِكُ الضَّوْءُ وَالجُسَيْمَاتُ طَبِيعَةً مُزْدَوِجَةً (مَوْجَةٌ وَجُسَيْمٌ)، وَيَقْفِزُ الإِلِكْتْرُونُ بَيْنَ المَدَارَاتِ بـ(القَفْزَةِ الكَمِّيَّةِ) مُطْلِقًا فُوتُونًا، وَيَتَوَاجَدُ فِي سَحَابَةٍ احْتِمَالِيَّةٍ.",
      "q1": {
        "q": "مَا الفَرْقُ بَيْنَ انْتِشَارِ الصَّوْتِ وَانْتِشَارِ الضَّوْءِ؟",
        "focusWord": "الصَّوْتُ وَالضَّوْءُ",
        "options": [
          {
            "text": "الصَّوْتُ يَحْتَاجُ لِوَسَطٍ مَادِّيٍّ لِانْتِشَارِهِ، بَيْنَمَا الضَّوْءُ مَوْجَةٌ كَهْرُومِغْنَاطِيسِيَّةٌ تَنْتَقِلُ حَتَّى فِي الفَرَاغِ",
            "correct": true
          },
          {
            "text": "الصَّوْتُ أَسْرَعُ مِنَ الضَّوْءِ",
            "correct": false
          },
          {
            "text": "الضَّوْءُ لَا يَنْعَكِسُ عَنِ المَرَايَا",
            "correct": false
          },
          {
            "text": "الصَّوْتُ لَا يَنْشَأُ مِنَ الاهْتِزَازِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الفَرْقُ بَيْنَ المُوَلِّدِ الكَهْرَبَائِيِّ وَالمُحَرِّكِ الكَهْرَبَائِيِّ؟",
        "focusWord": "المُوَلِّدُ وَالمُحَرِّكُ",
        "options": [
          {
            "text": "المُوَلِّدُ يُحَوِّلُ الحَرَكَةَ إِلَى كَهْرَبَاءَ، وَالمُحَرِّكُ يُحَوِّلُ الكَهْرَبَاءَ إِلَى حَرَكَةٍ",
            "correct": true
          },
          {
            "text": "كِلَاهُمَا يَصْنَعُ الخَشَبَ العَازِلَ",
            "correct": false
          },
          {
            "text": "المُوَلِّدُ يُبَرِّدُ المَاءَ فَقَطْ",
            "correct": false
          },
          {
            "text": "لَا عَلَاقَةَ لَهُمَا بِالمِغْنَاطِيسِيَّةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا القُوَى الكَوْنِيَّةُ الأَرْبَعُ فِي الفِيزْيَاءِ الحَدِيثَةِ؟",
        "focusWord": "القُوَى الكَوْنِيَّةُ الأَرْبَعُ",
        "options": [
          {
            "text": "الجَاذِبِيَّةُ، وَالكَهْرُومِغْنَاطِيسِيَّةُ، وَالقُوَّةُ النَّوَوِيَّةُ القَوِيَّةُ، وَالقُوَّةُ النَّوَوِيَّةُ الضَّعِيفَةُ",
            "correct": true
          },
          {
            "text": "التَّبَخُّرُ وَالتَّكَاثُفُ وَالهُطُولُ وَالجَرَيَانُ",
            "correct": false
          },
          {
            "text": "الشَّهِيقُ وَالزَّفِيرُ وَالهَضْمُ وَالنَّبْضُ",
            "correct": false
          },
          {
            "text": "الرِّيَاحُ وَالأَمْطَارُ فَقَطْ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "المَوْجَةُ وَالصَّوْتُ وَالضَّوْءُ",
          "left": "انْعِكَاسُ وَانْكِسَارُ الضَّوْءِ وَاهْتِزَازُ الصَّوْتِ فِي الأَوْسَاطِ"
        },
        {
          "right": "المُوَلِّدُ وَالمُحَرِّكُ الكَهْرَبَائِيُّ",
          "left": "تَحْوِيلٌ مُتَبَادَلٌ بَيْنَ الطَّاقَةِ الحَرَكِيَّةِ وَالكَهْرَبَائِيَّةِ"
        },
        {
          "right": "مَبَادِئُ فِيزْيَاءِ الكَوَانْتَمِ",
          "left": "الفُوتُونَاتُ وَازْدِوَاجِيَّةُ المَوْجَةِ وَالجُسَيْمِ وَالقَفْزَةُ الكَمِّيَّةُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَفَاهِيمَ الأَمْوَاجِ وَالكَهْرَبَاءِ وَالفِيزْيَاءِ الحَدِيثَةِ الصَّحِيحَةَ:",
        "correct": [
          "النُّحَاسُ مُوَصِّلٌ وَالخَشَبُ عَازِلٌ",
          "مُعَادَلَةُ أَيْنِشْتَايْنَ E=mc²",
          "الفُوتُونَاتُ جُسَيْمَاتُ الضَّوْءِ",
          "السَّحَابَةُ الاحْتِمَالِيَّةُ لِلْإِلِكْتْرُونِ"
        ],
        "wrong": [
          "لَمْسُ الأَسْلَاكِ المَكْشُوفَةِ بِأَيْدٍ مُبَلَّلَةٍ",
          "انْتِقَالُ الصَّوْتِ فِي الفَرَاغِ الكَوْنِيِّ"
        ]
      },
      "applyStep": "أَحْذَرُ مِنْ لَمْسِ المَقَابِسِ الكَهْرَبَائِيَّةِ وَأُمَيِّزُ بَيْنَ المَوَادِّ المَوَصِّلَةِ كَالنُّحَاسِ وَالمَوَادِّ العَازِلَةِ كَالخَشَبِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt22.jpg",
      "title": "خُطَّةُ التَّدْرِيبِ الرِّيَاضِيِّ المُتَكَامِلَةُ: 6 فَقَرَاتٍ جَدِيدَةٍ إِضَافِيَّةٍ",
      "subtitle": "تَنَفُّسُ (4-7-8)، التَّأَمُّلُ فِي الامْتِنَانِ، السُّكْوَاتُ الجَانِبِيُّ، وَالبِلَانْكُ العَكْسِيُّ",
      "slideText": "🌿 خُطَّةُ التَّدْرِيبِ الرِّيَاضِيِّ المُتَكَامِلَةُ (6 فَقَرَاتٍ جَدِيدَةٍ إِضَافِيَّةٍ): (1) الوَعْيُ (5 د): تَنَفُّسُ (4-7-8) مِنَ الأَنْفِ، دَوَرَانُ الجِذْعِ بِرِفْقٍ (Twist)، وَالتَّأَمُّلُ فِي الامْتِنَانِ (التَّفَكُّرُ فِي 3 نِعَمٍ تَشْعُرُ بِالامْتِنَانِ لَهَا). (2) الاسْتِطَالَةُ (5 د): تَمَدُّدُ أَوْتَارِ الرُّكْبَةِ، تَمَدُّدُ الوَرِكِ المَائِلِ (Lunge)، وَتَمَدُّدُ العَمُودِ الفَقَرِيِّ اللَّطِيفُ عَلَى الظَّهْرِ. (3) النُّمُوُّ العَضَلِيُّ (5 د): ضَغْطٌ عَلَى الحَائِطِ، سُكْوَاتٌ جَانِبِيٌّ أَوْ سُومُو سُكْوَاتٌ، وَبِلَانْكُ عَكْسِيٌّ (30-60 ثَانِيَةً). (4) قَوَاعِدُ السَّلَاسَةِ: شُرْبُ المَاءِ بِانْتِظَامٍ قَبْلَ وَبَعْدَ التَّمْرِينِ وَتَجَنُّبُ التَّشَتُّتِ. (5) الاسْتِجَابَةُ العَصَبِيَّةُ (5 د): لَمْسُ الكَاحِلِ الأَيْسَرِ بِاليَدِ اليُمْنَى، الرَّدُّ عَلَى إِشَارَاتٍ صَوْتِيَّةٍ، وَإِمْسَاكُ كُرَةٍ صَغِيرَةٍ بِتَبَادُلٍ سَرِيعٍ. (6) التَّدَفُّقُ (5 د): وَضْعِيَّةُ الفَرَاشَةِ، القُرْفُصَاءُ المُرِيحَةُ، وَالتَّأَمُّلُ الوَاعِي لِلنَّفَسِ.",
      "q1": {
        "q": "مَاذَا نَفْعَلُ فِي تَمْرِينِ (التَّأَمُّلِ فِي الامْتِنَانِ) ضِمْنَ فَقْرَةِ الوَعْيِ؟",
        "focusWord": "التَّأَمُّلُ فِي الامْتِنَانِ",
        "options": [
          {
            "text": "نُفَكِّرُ بَصَمْتٍ وَهُدُوءٍ فِي ثَلَاثَةِ أَشْيَاءَ وَنِعَمٍ نَشْعُرُ بِالامْتِنَانِ وَالشُّكْرِ لِلهِ عَلَيْهَا",
            "correct": true
          },
          {
            "text": "نَرْكُضُ بِسُرْعَةٍ",
            "correct": false
          },
          {
            "text": "نَغْضَبُ وَنَصْرُخُ",
            "correct": false
          },
          {
            "text": "نَشْتَكِي مِنَ التَّعَبِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا التَّمَارِينُ الثَّلَاثَةُ لِلنُّمُوِّ العَضَلِيِّ فِي الخُطَّةِ الإِضَافِيَّةِ؟",
        "focusWord": "بِلَانْكُ عَكْسِيٌّ وَسُكْوَاتٌ جَانِبِيٌّ",
        "options": [
          {
            "text": "ضَغْطٌ عَلَى الحَائِطِ، وَسُكْوَاتٌ جَانِبِيٌّ، وَبِلَانْكُ عَكْسِيٌّ (Reverse Plank)",
            "correct": true
          },
          {
            "text": "النَّوْمُ عَلَى الكُرْسِيِّ",
            "correct": false
          },
          {
            "text": "قِرَاءَةُ الجَرِيدَةِ",
            "correct": false
          },
          {
            "text": "شُرْبُ القَهْوَةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا النَّصِيحَةُ المُهِمَّةُ فِي قَوَاعِدِ السَّلَاسَةِ قَبْلَ وَبَعْدَ التَّمْرِينِ؟",
        "focusWord": "شُرْبُ المَاءِ بِانْتِظَامٍ",
        "options": [
          {
            "text": "التَّأَكُّدُ مِنْ شُرْبِ المَاءِ بِانْتِظَامٍ قَبْلَ وَبَعْدَ التَّمْرِينِ وَالقيَامُ بِالتَّمَارِينِ بِوَعْيٍ دُونَ تَشَتُّتٍ",
            "correct": true
          },
          {
            "text": "عَدَمُ شُرْبِ المَاءِ طَوَالَ اليَوْمِ",
            "correct": false
          },
          {
            "text": "اللَّعِبُ بِالهَاتِفِ أَثْنَاءَ التَّمْرِينِ",
            "correct": false
          },
          {
            "text": "تَرْكُ الإِحْمَاءِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "التَّأَمُّلُ فِي الامْتِنَانِ",
          "left": "التَّفَكُّرُ فِي 3 نِعَمٍ نَشْعُرُ بِالامْتِنَانِ وَالشُّكْرِ لَهَا"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ الإِضَافِيُّ",
          "left": "الضَّغْطُ عَلَى الحَائِطِ وَالسُّكْوَاتُ الجَانِبِيُّ وَالبِلَانْكُ العَكْسِيُّ"
        },
        {
          "right": "قَوَاعِدُ السَّلَاسَةِ",
          "left": "شُرْبُ المَاءِ قَبْلَ وَبَعْدَ التَّمْرِينِ وَتَجَنُّبُ التَّشَتُّتِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ عَنَاصِرَ الخُطَّةِ الرِّيَاضِيَّةِ الإِضَافِيَّةِ الجَدِيدَةِ:",
        "correct": [
          "تَنَفُّسُ (4-7-8) وَالتَّأَمُّلُ فِي الامْتِنَانِ",
          "تَمَدُّدُ أَوْتَارِ الرُّكْبَةِ وَالعَمُودِ الفَقَرِيِّ",
          "السُّكْوَاتُ الجَانِبِيُّ وَالبِلَانْكُ العَكْسِيُّ",
          "شُرْبُ المَاءِ قَبْلَ وَبَعْدَ التَّمْرِينِ"
        ],
        "wrong": [
          "التَّشَتُّتُ أَثْنَاءَ التَّمْرِينِ",
          "تَرْكُ شُرْبِ المَاءِ"
        ]
      },
      "applyStep": "أَشْرَبُ المَاءَ قَبْلَ وَبَعْدَ التَّمْرِينِ وَأَتَفَكَّرُ كُلَّ يَوْمٍ فِي ثَلَاثِ نِعَمٍ أَحْمَدُ اللهَ عَلَيْهَا."
    }
  },
  {
    "w": 23,
    "secNum": 6,
    "heavenName": "سَمَاءُ الخَمِيسِ السَّادِسَةُ (ش ت ث خ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ الكِلَاسِيكِيَّةُ وَالطَّاقَةُ وَالصَّوْتُ وَالضَّوْءُ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "ث",
    "jummal": 500,
    "prophet": "إِلْيَاسُ (ع)",
    "virtue": "الإِخْلَاصُ",
    "unitHeader": "الوَحْدَةُ الثَّالِثَةُ وَالعِشْرُونَ الكَامِلَةُ: نَبِيُّ اللهِ إِلْيَاسُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "دَعَا نَبِيُّ اللهِ إِلْيَاسُ (ع) قَوْمَهُ إِلَى إِخْلَاصِ العِبَادَةِ للهِ وَحْدَهُ وَتَرْكِ عِبَادَةِ الصَّنَمِ (بَعْل)، فَأَنْزَلَ اللهُ الغَيْثَ النَّافِعَ بَعْدَ إِيمَانِ الصَّادِقِينْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (البَغْيُ وَالقَحْطُ مُقَابِلَ النُّورِ السَّمَاوِيِّ): نَارُ الكِبْرِ وَالظُّلْمِ فِي قَلْبِ المَلِكِ الجَبَّارِ وَامْرَأَتِهِ الطَّاغِيَةِ الَّتِي قَتَلَتِ المُؤْمِنَ الصَّادِقَ لِتَغْصِبَ بُسْتَانَهُ، وَحَرَارَةُ الجَفَافِ وَالقَحْطِ الَّذِي أَمْسَكَ اللهُ فِيهِ المَطَرَ ثَلَاثَ سِنِينَ؛ وَفِي مُقَابِلِهَا النُّورُ الَّذِي أَلْبَسَهُ اللهُ إِلْيَاسَ عِنْدَ رَفْعِهِ وَنَارُ القُرْبَانِ الَّتِي أَظْهَرَتْ حَقَّ التَّوْحِيدِ. B. الرِّيحُ (الوَهْمُ وَالصَّنَمُ الأَجْوَفُ مُقَابِلَ الطَّيَرَانِ المَلَكُوتِيِّ): رِيحُ الوَهْمِ وَالضَّلَالِ فِي عِبَادَةِ أَهْلِ بَعْلَبَكَّ لِصَنَمِ «بَعْلٍ» الذَّهَبِيِّ وَاعْتِقَادِهِمُ البَاطِلِ أَنَّهُ يَدْفَعُ الضُّرَّ؛ وَفِي مُقَابِلِهَا تَسْخِيرُ الهَوَاءِ وَالآفَاقِ لِإِلْيَاسَ حِينَ أَعْطَاهُ اللهُ قُوَّةَ المَلَائِكَةِ فَأَصْبَحَ يَطِيرُ مَعَهُمْ فِي السَّمَاءِ. C. التُّرَابُ (العَقْلُ وَالثَّبَاتُ وَالكُهُوفُ وَبَرَكَةُ الحَرْثِ): حُجَّةُ إِلْيَاسَ العَقْلِيَّةُ الدَّامِغَةُ: ﴿أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ * اللَّهَ رَبَّكُمْ وَرَبَّ آبَائِكُمُ الْأَوَّلِينَ﴾، وَاخْتِبَاؤُهُ فِي كُهُوفِ الجِبَالِ التُّرَابِيَّةِ سَبْعَ سِنِينَ يَتَفَكَّرُ وَيُسَبِّحُ اللهَ وَيُعَفِّرُ جَبْهَتَهُ فِي التُّرَابِ، وَبَرَكَةُ جَرَّةِ الدَّقِيقِ التُّرَابِيِّ فِي بَيْتِ الأُمِّ المُؤْمِنَةِ. D. المَاءُ (الطَّاعَةُ وَالغَيْثُ وَالبُكَاءُ عَلَى سَيِّدِ الشُّهَدَاءِ): دُمُوعُ إِلْيَاسَ الخَاشِعَةُ (كَمَا فِي الكَافِي أَنَّهُ بَكَى مَعَ رَسُولِ اللهِ صَلَّى اللهُ عَلَيْهِ وَآلِهِ عَلَى مَا يَجْرِي عَلَى عَلِيٍّ وَالحُسَيْنِ عَلَيْهِمَا السَّلَامُ)، وَنُزُولُ المَاءِ وَالغَيْثِ المِدْرَارِ بِدُعَائِهِ بَعْدَ ثَلَاثِ سِنِينَ مِنْ حَبْسِ القَطْرِ، وَاجْتِمَاعُهُ السَّنَوِيُّ مَعَ الخَضِرِ عِنْدَ مَاءِ زَمْزَمَ وَعَرَفَاتٍ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الخَمِيسِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ ثَلَاثَةٌ وَعِشْرُونَ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلِ وَالثَّبَاتِ الرَّاسِخِ وَالزُّهْدِ فِي الدُّنْيَا، وَهُوَ العَبْدُ الأَوَّاهُ نَبِيُّ اللهِ إِلْيَاسُ عَلَيْهِ السَّلَامُ مِنْ ذُرِّيَّةِ هَارُونَ أَخِي مُوسَى الكَلِيمْ. اصْطَفَاهُ اللهُ وَجَعَلَهُ مِنْ عِبَادِهِ المُخْلَصِينَ وَبَعَثَ نَبِيَّهُ إِلَى قَوْمِهِ فِي مَدِينَةِ بَعْلَبَكَّ فِي أَرْضِ الشَّامِ وَلُبْنَانَ الخَضْرَاءْ. وَقَدْ خَدَعَتْهُمْ رِيحُ الوَهْمِ وَالضَّلَالِ فَتَرَكُوا عِبَادَةَ اللهِ وَصَنَعُوا لِأَنْفُسِهِمْ صَنَمًا كَبِيرًا مِنْ ذَهَبٍ اسْمُهُ بَعْلٌ، وَطَغَى مَلِكُهُمْ وَامْرَأَتُهُ الشِّرِّيرَةُ فَقَتَلَا جَارَهُمُ المُؤْمِنَ الصَّالِحَ ظُلْمًا لِيَغْصِبَا بُسْتَانَهُ الجَمِيلْ.",
      "وَقَفَ إِلْيَاسُ أَمَامَ المَلِكِ وَالقَوْمِ بِشَجَاعَةٍ وَثَبَتَ عَلَى الحَقِّ يُخَاطِبُ عُقُولَهُمْ بِالحِكْمَةِ قَائِلًا أَلَا تَتَّقُونْ، أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الخَالِقِينَ اللهَ رَبَّكُمْ وَرَبَّ آبَائِكُمُ الأَوَّلِينْ! فَكَذَّبُوهُ بِكِبْرِهِمْ وَأَرَادُوا قَتْلَهْ، فَصَعِدَ إِلْيَاسُ إِلَى الجِبَالِ العَالِيَةِ وَسَكَنَ فِي الكُهُوفِ التُّرَابِيَّةِ سَبْعَ سِنِينَ يَعْبُدُ رَبَّهُ وَيَصُومُ النَّهَارَ وَيَقُومُ اللَّيْلْ، وَكَانَ اللهُ يُرْسِلُ إِلَيْهِ الطَّيْرَ بِرِزْقِهِ كُلَّ يَوْمْ. وَغَضِبَ اللهُ عَلَى الظَّالِمِينَ فَحَبَسَ عَنْهُمْ مَاءَ المَطَرِ ثَلَاثَ سِنِينَ حَتَّى جَفَّتِ الأَنْهَارُ وَيَبِسَ كُلُّ زَرْعٍ وَحَرْثٍ فِي أَرْضِهِمْ.",
      "وَنَزَلَ إِلْيَاسُ يَوْمًا فَاسْتَضَافَتْهُ امْرَأَةٌ مُؤْمِنَةٌ كَرِيمَةٌ هِيَ أُمُّ نَبِيِّ اللهِ اليَسَعِ بْنِ أَخْطُوبَ، وَلَمْ يَكُنْ عِنْدَهَا إِلَّا حَفْنَةٌ مِنْ دَقِيقِ القَمْحِ وَقَلِيلٌ مِنَ الزَّيْتْ، فَآثَرَتْ نَبِيَّ اللهِ وَخَبَزَتْ لَهُ قُرْصًا مِنْ خُبْزِ الحِنْطَةِ الطَّيِّبْ، فَدَعَا إِلْيَاسُ رَبَّهُ فَـكَثَّرَ اللهُ الدَّقِيقَ فِي الجَرَّةِ وَالزَّيْتَ فِي الإِنَاءِ فَلَمْ يَنْفَدَا طِيلَةَ أَيَّامِ القَحْطِ، كَمَا يُكَثِّرُ اللهُ الخَيْرَ وَالثِّمَارَ لِلْمُحْسِنِينَ وَشَفَى اللهُ بِدُعَائِهِ وَلَدَهَا اليَسَعَ فَصَارَ تِلْمِيذًا مُلَازِمًا لِإِلْيَاسَ يَسِيرُ عَلَى أَثَرِ هُدَاهْ.",
      "وَلَمَّا اشْتَدَّ البَلَاءُ عَلَى القَوْمِ نَزَلَ إِلْيَاسُ إِلَى المَلِكِ لِيُقِيمَ عَلَيْهِمُ الحُجَّةَ العَقْلِيَّةَ القَاطِعَةْ، وَاتَّفَقَ مَعَهُمْ أَنْ يَدْعُوَ كَهَنَةُ الصَّنَمِ بَعْلٍ صَنَمَهُمْ وَيَدْعُوَ إِلْيَاسُ اللهَ رَبَّ العَالَمِينْ. فَنَادَى الكَهَنَةُ صَنَمَهُمْ مِنَ الصَّبَاحِ إِلَى المَسَاءِ فَلَمْ يَسْمَعْ لَهُمْ وَلَمْ يَسْتَجِبْ لِأَنَّهُ جَمَادٌ لَا يَنْفَعْ! ثُمَّ تَقَدَّمَ إِلْيَاسُ بِقَلْبٍ خَاشِعٍ وَدَعَا اللهَ الوَاحِدَ القَهَّارَ، فَأَنْزَلَ اللهُ نَارًا أَكَلَتِ القُرْبَانَ تَصْدِيقًا لِنَبِيِّهِ ثُمَّ أَرْسَلَ السَّحَابَ وَأَنْزَلَ مِنَ السَّمَاءِ المَاءَ الطَّهُورَ فَـأُغِيثُوا بَعْدَ القَحْطِ، وَجَرَى فِي الأَوْدِيَةِ مَاءٌ عَذْبٌ وَغَيْثٌ غَزِيرٌ أَحْيَا التُّرَابَ وَالشَّجَرْ.",
      "فَآمَنَ العُقَلَاءُ، لٰكِنَّ الأَكْثَرِينَ عَادُوا إِلَى العِنَادِ وَالطُّغْيَانِ، كَمَا رَوَى الإِمَامُ الصَّادِقُ عَلَيْهِ السَّلَامُ أَنَّ إِلْيَاسَ كَانَ يَبْكِي فِي سُجُودِهِ شَوْقًا إِلَى اللهِ وَحُزْنًا عَلَى كُفْرِ قَوْمِهِ وَيَقُولُ أَتَرَانِي تُعَذِّبُنِي وَقَدْ أَظْمَأْتُ لَكَ هَوَاجِرِي وَعَفَّرْتُ لَكَ فِي التُّرَابِ وَجْهِي وَاجْتَنَبْتُ لَكَ المَعَاصِي! فَأَوْحَى اللهُ إِلَيْهِ اِرْفَعْ رَأْسَكَ فَإِنِّي غَيْرُ مُعَذِّبِكَ. وَظَلَّ إِلْيَاسُ يَحُثُّ قَوْمَهُ عَلَى التَّوْبَةِ، فَلَمَّا تَمَادَوْا فِي ظُلْمِهِمْ أَكْرَمَ اللهُ نَبِيَّهُ كَرَامَةً عَظِيمَةً؛ فَأَلْقَى إِلْيَاسُ رِدَاءَهُ الصُّوفِيَّ إِلَى وَصِيِّهِ اليَسَعَ عَلَيْهِ السَّلَامْ، وَكَسَاهُ اللهُ الرِّيشَ وَأَلْبَسَهُ النُّورَ وَرَفَعَ عَنْهُ الحَاجَةَ إِلَى الطَّعَامِ وَالشَّرَابِ فَطَارَ مَعَ المَلَائِكَةِ فِي آفَاقِ السَّمَاءِ فَهُوَ إِنْسِيٌّ مَلَكِيٌّ وَأَرْضِيٌّ سَمَاوِيٌّ.",
      "وَجَعَلَ اللهُ إِلْيَاسَ مُوَكَّلًا بِالفَلَوَاتِ وَالأَفْلَاكِ يَلْتَقِي مَعَ أَخِيهِ العَبْدِ الصَّالِحِ الخَضِرِ عَلَيْهِمَا السَّلَامُ كُلَّ عَامٍ فِي مَوْسِمِ الحَجِّ عِنْدَ الكَعْبَةِ وَعَرَفَاتٍ، وَقَدْ نَزَلَ إِلْيَاسُ عَلَى رَسُولِ اللهِ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَآلِهِ فِي السَّفَرِ فَأَكَلَ مَعَهُ مِنْ مَائِدَةِ الجَنَّةِ، وَتَحَدَّثَا عَمَّا سَيَجْرِي عَلَى أَمِيرِ المُؤْمِنِينَ عَلِيٍّ وَسَيِّدِ الشُّهَدَاءِ الحُسَيْنِ عَلَيْهِمَا السَّلَامُ فَـثَقُلَ هَمُّهُمَا وَبَكَيَا مَعًا. وَأَبْقَى اللهُ ذِكْرَ إِلْيَاسَ وَثَنَاءَهُ عَطِرًا فِي العَالَمِينَ فَقَالَ تَعَالَى وَتَرَكْنَا عَلَيْهِ فِي الآخِرِينَ سَلَامٌ عَلَى إِلْ يَاسِينَ إِنَّا كَذٰلِكَ نَجْزِي المُحْسِنِينَ إِنَّهُ مِنْ عِبَادِنَا المُؤْمِنِينْ؛ لِيَكُونَ قُدْوَةً لِكُلِّ عَبْدٍ ثَابِتٍ عَلَى الحَقِّ فَثَبَتَ قَلْبُهُ بِاليَقِينِ وَتَعَلَّمَ مِنْ عُلُومِ الأَنْبِيَاءِ وَمَا تَرَكُوهُ مِنْ عِلْمٍ وَمِيرَاثٍ زَاخِرٍ وَخَيْرِ تُرَاثْ."
    ],
    "words": [
      {
        "word": "مَثْوَى",
        "desc": "وسط متصل / ساكن: ـثْـ",
        "raw": "مَثْوَى (وسط متصل / ساكن: ـثْـ)"
      },
      {
        "word": "تُرَاثْ",
        "desc": "آخر منفصل أو متصل / ساكن وقفا: ثْ",
        "raw": "تُرَاثْ (آخر منفصل أو متصل / ساكن وقفا: ثْ)"
      },
      {
        "word": "ثَبَتَ",
        "desc": "أول منفصل / متحرك بالفتح: ثَـ",
        "raw": "ثَبَتَ (أول منفصل / متحرك بالفتح: ثَـ)"
      },
      {
        "word": "فَثَبَتَ",
        "desc": "أول متصل / متحرك بالفتح: ـثَـ",
        "raw": "فَثَبَتَ (أول متصل / متحرك بالفتح: ـثَـ)"
      },
      {
        "word": "مَثَلَ",
        "desc": "وسط متصل / متحرك بالفتح: ـثَـ",
        "raw": "مَثَلَ (وسط متصل / متحرك بالفتح: ـثَـ)"
      },
      {
        "word": "أَثَرِ",
        "desc": "وسط منفصل / متحرك بالفتح: ثَـ",
        "raw": "أَثَرِ (وسط منفصل / متحرك بالفتح: ثَـ)"
      },
      {
        "word": "بَعَثَ",
        "desc": "آخر متصل / متحرك بالفتح: ـثَ",
        "raw": "بَعَثَ (آخر متصل / متحرك بالفتح: ـثَ)"
      },
      {
        "word": "ثَقُلَ",
        "desc": "أول منفصل / متحرك بالفتح: ثَـ",
        "raw": "ثَقُلَ (أول منفصل / متحرك بالفتح: ثَـ)"
      },
      {
        "word": "غَيْثٌ",
        "desc": "آخر متصل / متحرك بالضم: ـثٌ",
        "raw": "غَيْثٌ (آخر متصل / متحرك بالضم: ـثٌ)"
      },
      {
        "word": "ثِمَارَ",
        "desc": "أول منفصل / متحرك بالكسر: ثِـ",
        "raw": "ثِمَارَ (أول منفصل / متحرك بالكسر: ثِـ)"
      },
      {
        "word": "كَثَّرَ",
        "desc": "وسط متصل / مضعف بالفتح: ـثَّـ",
        "raw": "كَثَّرَ (وسط متصل / مضعف بالفتح: ـثَّـ)"
      },
      {
        "word": "يَحُثُّ",
        "desc": "آخر متصل / مضعف بالضم: ـثُّ",
        "raw": "يَحُثُّ (آخر متصل / مضعف بالضم: ـثُّ)"
      },
      {
        "word": "يُكَثِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـثِّـ",
        "raw": "يُكَثِّرُ (وسط متصل / مضعف بالكسر: ـثِّـ)"
      },
      {
        "word": "ثَابِتٍ",
        "desc": "أول منفصل / ممدود بالألف: ثَا",
        "raw": "ثَابِتٍ (أول منفصل / ممدود بالألف: ثَا)"
      },
      {
        "word": "مَبْعُوثُونَ",
        "desc": "وسط متصل / ممدود بالواو: ـثُو",
        "raw": "مَبْعُوثُونَ (وسط متصل / ممدود بالواو: ـثُو)"
      },
      {
        "word": "أُغِيثُوا",
        "desc": "وسط متصل / ممدود بالياء: ـثِي",
        "raw": "أُغِيثُوا (وسط متصل / ممدود بالياء: ـثِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الثَّاءِ (ث): النُّطْقُ السَّلِيمُ لِحَرْفِ الثَّاءِ اللِّثَوِيِّ المَهْمُوسِ الرِّخْوِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا العُلْيَا، وَالتَّمْيِيزُ الصَّوْتِيُّ الدَّقِيقُ بَيْنَهُ وَبَيْنَ السِّينِ وَالتَّاءِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى التَّسْلِيمِ القُرْآنِيِّ: ﴿سَلَامٌ عَلَىٰ إِلْ يَاسِينَ﴾ (أَيِ النَّبِيِّ إِلْيَاسَ، وَفِي بَاطِنِ التَّأْوِيلِ عِنْدَ أَهْلِ البَيْتِ: آلِ يَاسِينَ أَيْ آلِ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَآلِهِ)."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الصَّحْنُ المُنْبَسِطُ وَالنِّقَاطُ الثَّلَاثُ العُلْوِيَّةُ وَالرَّقْمُ (23): مُشَاهَدَةُ شَكْلِ حَرْفِ الثَّاءِ (ث / ثـ / ـثـ / ـث) المُرَكَّبِ مِنْ صَحْنٍ مُسْتَوٍ كَالأَرْضِ المُمَهَّدَةِ وَفَوْقَهُ ثَلَاثُ نِقَاطٍ تَنْتَظِمُ فِي مُثَلَّثٍ مُتَسَاوِي الأَضْلَاعِ كَقِمَّةِ الجَبَلِ الشَّامِخِ، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (23) (المُؤَلَّفِ مِنْ 3 وَ 20، وَالمُوَافِقِ لِنِقَاطِ الثَّاءِ الثَّلَاثِ وَلِسنِي القَحْطِ الثَّلَاثِ)، وَالنَّظَرُ التَّأَمُّلِيُّ فِي تَكْوِينِ السُّحُبِ المَاطِرَةِ وَقِمَمِ جِبَالِ لُبْنَانَ وَالشَّامِ."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ إِلْيَاسَ الكَامِلَةُ وَمُنَاجَاةُ السُّجُودِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ إِلْيَاسَ الكَامِلَةِ فِي القُرْآنِ الكَرِيمِ وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ دُعَاءِ إِلْيَاسَ الخَاشِعِ فِي سُجُودِهِ بِالسُّرْيَانِيَّةِ وَالعَرَبِيَّةِ الَّذِي رَوَاهُ الإِمَامُ الصَّادِقُ (عَلَيْهِ السَّلَامُ)، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ ثَلَاثَةٌ وَعِشْرُونَ (23) وَالخَمْسُمِائَةٍ (500): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (23) وَمَعْرِفَةِ قِيمَةِ الثَّاءِ المِئَوِيَّةِ (ث = 500 = خَمْسُ مِئَاتٍ كَامِلَةٍ وَنِصْفُ الأَلْفِ)، وَحِسَابِ سِنِي القَحْطِ الثَّلَاثِ وَسِنِي الكَهْفِ السَّبْعِ (3 + 7 = 10)، وَتَدْرِيبُ اليَدِ عَلَى رَسْمِ حَرْفِ الثَّاءِ وَوَضْعِ نِقَاطِهِ الثَّلَاثِ بِتَنَاسُقٍ، وَالمُشَارَكَةِ الكَرِيمَةِ فِي إِطْعَامِ الضَّيْفِ وَلَوْ مِنْ قُرْصِ خُبْزٍ صَغِيرٍ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ صُعُودِ الجِبَالِ وَالجَرْيِ فِي البَرَارِي وَإِطَالَةِ السُّجُودِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ تَسَلُّقِ المُرْتَفَعَاتِ وَالمَشْيِ القَوِيِّ الثَّابِتِ فِي الجِبَالِ وَالفَلَوَاتِ، وَتَمْرِينِ المَفَاصِلِ عَلَى الثَّبَاتِ وَالاسْتِرْخَاءِ أَثْنَاءَ إِطَالَةِ الرُّكُوعِ وَالسُّجُودِ لِلهِ تَعَالَى."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ دَقِيقِ الحِنْطَةِ وَالزَّيْتِ وَالثِّمَارِ وَالزُّهْدِ: تَعَلُّمُ كَيْفَ يُصْنَعُ قُرْصُ الخُبْزِ الصِّحِّيُّ مِنْ دَقِيقِ القَمْحِ الكَامِلِ وَزَيْتِ الزَّيْتُونِ النَّقِيِّ، وَمَعْرِفَةِ نَبَاتَاتِ الجِبَالِ وَالثِّمَارِ الطَّيِّبَةِ، وَالتَّأَسِّي بِقَنَاعَةِ إِلْيَاسَ وَزُهْدِهِ حَتَّى رَفَعَ اللهُ عَنْهُ شَهْوَةَ الطَّعَامِ وَالشَّرَابِ الدُّنْيَوِيِّ وَغَذَّاهُ بِالتَّسْبِيحِ وَطَعَامِ الجَنَّةِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الإِخْلَاصِ وَإِكْرَامِ الضَّيْفِ وَحِفْظِ حُقُوقِ الجِيرَانِ: تَعَلُّمُ خُلُقِ الإِخْلَاصِ لِلهِ فِي السِّرِّ وَالعَلَنِ، وَإِيثَارِ الضَّيْفِ عَلَى النَّفْسِ (كَمَا فَعَلَتِ الأُمُّ المُؤْمِنَةُ مَعَ إِلْيَاسَ فَبَارَكَ اللهُ فِي بَيْتِهَا وَشَفَى ابْنَهَا اليَسَعَ)، وَحُرْمَةِ أَخْذِ بُسْتَانِ الجَارِ أَوْ أَثَاثِهِ بِالظُّلْمِ وَالبُهْتَانِ."
      }
    },
    "grammar": {
      "topic": "تَوْسِيعُ الجُمْلَةِ التَّامَّةِ بِالجَارِّ وَالمَجْرُورْ",
      "rule": "تَصِيرُ الجُمْلَةُ الفِعْلِيَّةُ أَوِ الاِسْمِيَّةُ أَكْثَرَ ثَرَاءً عِنْدَمَا نُضِيفُ إِلَيْهَا الجَارَّ وَالمَجْرُورَ فِي نِهَايَتِهَا.",
      "example": "نَبَتَ الثَّمَرُ فِي البُسْتَانِ — الثَّلْجُ أَبْيَضُ عَلَى الجَبَلِ.",
      "focusWord": "نَبَتَ الثَّمَرُ فِي البُسْتَانِ",
      "q": "أَكْمِلِ الجُمْلَةَ بِجَارٍّ وَمَجْرُورٍ صَحِيحِ الضَّبْطِ: «يَسْقُطُ الثَّلْجُ ...»:",
      "opts": [
        "عَلَى الجَبَلِ",
        "عَلَى الجَبَلَ",
        "عَلَى الجَبَلُ",
        "الجَبَلُ"
      ]
    },
    "earIirab": {
      "topic": "اجْتِمَاعُ الحَرَكَاتِ الثَّلَاثِ فِي جُمْلَةٍ وَاحِدَةْ (ـُ / ـَ / ـِ)",
      "rule": "نَسْمَعُ فِي الجُمْلَةِ التَّامَّةِ: ضَمَّةَ الفَاعِلِ (ـُ)، وَفَتْحَةَ المَفْعُولِ (ـَ)، وَكَسْرَةَ المَجْرُورِ (ـِ).",
      "sentence": "حَرَثَ الفَلَّاحُ الأَرْضَ بِالمِحْرَاثِ.",
      "targetWord": "الفَلَّاحُ / الأَرْضَ / بِالمِحْرَاثِ",
      "caseAns": "الضَّمَّةُ لِلفَاعِلِ وَالفَتْحَةُ لِلمَفْعُولِ وَالكَسْرَةُ لِلمَجْرُورْ"
    },
    "math": {
      "numVal": 48,
      "numName": "ثَمَانِيَةٌ وَأَرْبَعُونَ",
      "eqDisplay": "8 + 40 = 48",
      "subDisplay": "48 - 8 = 40",
      "compDisplay": "48 < 50",
      "q1": {
        "stem": "احْسِبْ تَرْكِيبَ العَدَدِ:",
        "focus": "8 + 40 = ؟",
        "ans": "48 (ثَمَانِيَةٌ وَأَرْبَعُونَ)",
        "wrong": [
          "84",
          "40",
          "58"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ لإِكْمَالِ الخَمْسِينَ:",
        "focus": "48 + 2 = ؟",
        "ans": "50 (خَمْسُونَ)",
        "wrong": [
          "46",
          "52",
          "49"
        ]
      }
    },
    "sport": {
      "title": "تَثْبِيتُ الجِذْعِ وَقُوَّةُ الِاسْتِقَامَةِ",
      "middleText": "أَقِفُ بِاسْتِقَامَةٍ وَأَشُدُّ عَضَلَاتِ بَطْنِي وَظَهْرِي بِثَبَاتٍ مَعَ التَّنَفُّسِ الهَادِئِ لِعَشْرِ ثَوَانٍ. يَدْعَمُ هٰذَا التَّمْرِينُ عَضَلَاتِ الجِذْعِ الدَّاخِلِيَّةَ وَيَمْنَحُ الجِسْمَ قُوَّةً وَثَبَاتًا."
    },
    "sci": {
      "title": "فِيزْيَاءُ النُّورِ وَتِقْنِيَاتُ الطَّاقَةِ النَّظِيفَةِ",
      "summaryThird": "يَتَكَوَّنُ ضَوْءُ الشَّمْسِ الأَبْيَضُ مِنْ أَلْوَانِ الطَّيْفِ السَّبْعَةِ، وَتَقُومُ الأَلْوَاحُ الشَّمْسِيَّةُ الحَدِيثَةُ بِتَحْوِيلِ الضَّوْءِ مُبَاشَرَةً إِلَى طَاقَةٍ كَهْرَبَائِيَّةٍ نَظِيفَةٍ تُحَافِظُ عَلَى البِيئَةْ.",
      "focusConcept": "الأَلْوَاحُ الشَّمْسِيَّةُ",
      "factAns": "تَحْوِيلُ ضَوْءِ الشَّمْسِ إِلَى كَهْرَبَاءَ نَظِيفَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الأَبِ الكَرِيمِ (حُور وَسُرُور - 23)",
      "storySentence": "اسْتَقْبَلَ سُرُورٌ وَحُورُ أَبَاهُمَا بِابْتِسَامَةٍ وَمَحَبَّةٍ، وَعَرَفَا أَنَّ الأَبَ هُوَ سَنَدُنَا الَّذِي يَرْعَانَا وَيُعَلِّمُنَا وَيَسْعَى فِي رِزْقِنَا، فَحَقُّهُ الطَّاعَةُ وَالتَّوْقِيرُ وَالشُّكْرْ.",
      "applyAction": "أَبَرُّ أَبِي وَأَحْتَرِمُهُ وَأَحْفَظُ وَصَايَاهُ النَّافِعَةْ."
    },
    "rightsFullTitle": "(35) حق المال + (36) حق الغريم الطالب",
    "rightsQuote": "وَأمّا حَقُّ المَالِ، فَأَنْ لا تَأْخُذَهُ إلاّ مِنْ حِلِّهِ، ولا تُنْفِقَهُ إلاّ فِي حِلِّهِ، وَلا تُحَرِّفْــــــــــــــــــهُ عَنْ مَـــــــــوَاضِعِهِ، ولا تَصْرِفَهُ عَنْ حَقَـــــــــــــــائِقِهِ، ولا تَجْعَلْهُ إذا كَانَ مِنَ اللَّهِ إلاّ إلَيهِ وَسَبَباً إلَى اللَّهِ. ولا تُـــــــــؤثِرَ بهِ عَلَى نفْسِـــــــكَ مَنْ لَعَلَّهُ لا يَحْمَدُكَ، وَبالْحَرِيِّ أَنْ لا يُحْســـــــــــــــِنَ خِلافَتَــــــــهُ فِي تَرِكَتِكَ ولا يَعْمَلُ فِيهِ بطَـــــــــاعَةِ ربكَ فَتَكُونَ مُعِينًا لَهُ عَلَى ذلِكَ أَو بمَـــــــا أَحْدَثَ فِي مَالِكَ أَحْسَنَ نَظَرًا لِنَفْسِهِ، فَيَعْمَلَ بطَاعَةِ رَبهِ فَيَذْهَبَ بالْغَنِيمَةِ وتَبُوءَ بالإثمِ وَالْحَسْرَةِ وَالنَّدَامَةِ مَعَ التَّبعَةِ. وَلا قُوَّةَ إلا باللهِ. | وَأمّا حَقُّ الغَرِيمِ الطَّالِب لَكَ، فَإنْ كُنْتَ مُوسِرًا أَوفَيتَهُ وَكَفَيتَهُ وَأَغْنَيتَهُ وَلَـــــــــــمْ ترْدُدْهُ وتَمْطُلْهُ فَإنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَآلِهِ – قَالَ – “مَـطَلُ الغَنِيَّ ظُلْـــــــــــــــمٌ”. وَإنْ كُنْتَ مُعْسِرًا أَرْضَيتَــــــــــــــهُ بحُسْنِ القَوْلِ وَطَلَبتَ إلَيهِ طَلَباً جَـــمِيلاً وَرَدَدتَهُ عَنْ نفْسِكَ ردًّا لَطِيفًا، وَلَمْ تَجْمَعَ عَلَيْهِ ذهَابَ مَالِهِ وَسُوءَ مُعَامَلَتِهِ فَإنَّ ذلِكَ لؤمٌ. ولا قُوَّةَ إلاّ باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (35) حق المال + (36) حق الغريم الطالب",
        "text": "وَأمّا حَقُّ المَالِ، فَأَنْ لا تَأْخُذَهُ إلاّ مِنْ حِلِّهِ، ولا تُنْفِقَهُ إلاّ فِي حِلِّهِ، وَلا تُحَرِّفْــــــــــــــــــهُ عَنْ مَـــــــــوَاضِعِهِ، ولا تَصْرِفَهُ عَنْ حَقَـــــــــــــــائِقِهِ، ولا تَجْعَلْهُ إذا كَانَ مِنَ اللَّهِ إلاّ إلَيهِ وَسَبَباً إلَى اللَّهِ. ولا تُـــــــــؤثِرَ بهِ عَلَى نفْسِـــــــكَ مَنْ لَعَلَّهُ لا يَحْمَدُكَ، وَبالْحَرِيِّ أَنْ لا يُحْســـــــــــــــِنَ خِلافَتَــــــــهُ فِي تَرِكَتِكَ ولا يَعْمَلُ فِيهِ بطَـــــــــاعَةِ ربكَ فَتَكُونَ مُعِينًا لَهُ عَلَى ذلِكَ أَو بمَـــــــا أَحْدَثَ فِي مَالِكَ أَحْسَنَ نَظَرًا لِنَفْسِهِ، فَيَعْمَلَ بطَاعَةِ رَبهِ فَيَذْهَبَ بالْغَنِيمَةِ وتَبُوءَ بالإثمِ وَالْحَسْرَةِ وَالنَّدَامَةِ مَعَ التَّبعَةِ. وَلا قُوَّةَ إلا باللهِ. | وَأمّا حَقُّ الغَرِيمِ الطَّالِب لَكَ، فَإنْ كُنْتَ مُوسِرًا أَوفَيتَهُ وَكَفَيتَهُ وَأَغْنَيتَهُ وَلَـــــــــــمْ ترْدُدْهُ وتَمْطُلْهُ فَإنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَآلِهِ – قَالَ – “مَـطَلُ الغَنِيَّ ظُلْـــــــــــــــمٌ”. وَإنْ كُنْتَ مُعْسِرًا أَرْضَيتَــــــــــــــهُ بحُسْنِ القَوْلِ وَطَلَبتَ إلَيهِ طَلَباً جَـــمِيلاً وَرَدَدتَهُ عَنْ نفْسِكَ ردًّا لَطِيفًا، وَلَمْ تَجْمَعَ عَلَيْهِ ذهَابَ مَالِهِ وَسُوءَ مُعَامَلَتِهِ فَإنَّ ذلِكَ لؤمٌ. ولا قُوَّةَ إلاّ باللهِ. — وَفِي سِيرَةِ إِلْيَاسُ (ع): آدَابُ الإِخْلَاصِ وَإِكْرَامِ الضَّيْفِ وَحِفْظِ حُقُوقِ الجِيرَانِ: تَعَلُّمُ خُلُقِ الإِخْلَاصِ لِلهِ فِي السِّرِّ وَالعَلَنِ، وَإِيثَارِ الضَّيْفِ عَلَى النَّفْسِ (كَمَا فَعَلَتِ الأُمُّ المُؤْمِنَةُ مَعَ إِلْيَاسَ فَبَارَكَ اللهُ فِي بَيْتِهَا وَشَفَى ابْنَهَا اليَسَعَ)، وَحُرْمَةِ أَخْذِ بُسْتَانِ الجَارِ أَوْ أَثَاثِهِ بِالظُّلْمِ وَالبُهْتَانِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المال",
        "text": "كان نور يتجول في متجر الألعاب القريب من منزله حين لفت انتباهه مجسم سيارة روبوت يمكن التحكم بها عن بعد. توقف طويلاً أمامها، راقبها بإعجاب وقال في نفسه: \"كم أتمنى هذه اللعبة… لكن من أين أحصل على ثمنها؟\" فكر نور قليلًا، ثم قال في نفسه: \"لو طلبت المال من أبي فسيرفض… سيقول إنها لعبة غير مهمة… لكنه لا يفهم كم أهتم بها!\" راودته فكرة سيئة: \"سآخذ المال دون أن أخبر أحدًا…\" لكن سرعان ما شعر بثقل الفكرة في قلبه فقال: \"لا، هذا خطأ… المال ليس مالي.\" وأثناء سيره بجانب بيت جارهم العم سامي سمعه يقول عبر الهاتف: \"يا ليت أجد من يساعدني اليوم في تنظيف الحديقة، لا وقت لدي!\" فتحت الكلمات بابًا في عقل نور. اقترب وسلّم وقال: — \"عمي سامي، هل يمكنني مساعدتك مقابل أجر؟\" ابتسم الرجل وقال: — \"ولم لا يا نور؟ العمل ليس عيبًا.\" استأذن نور والديه، وذهب لينظف حديقة العم سامي. تعب، وتلطخت ملابسه بالتراب، لكنه كان سعيدًا. وفي نهاية العمل، أعطاه العم أجره وقال له: \"أنت شاب مسؤول… كسبت مالك بتعب وجهد.\" عاد نور إلى البيت وهو يشعر بقيمة المال الذي كسبه. في المساء استعد للذهاب إلى متجر الألعاب، فسألته أخته الصغيرة حور:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المال",
        "text": "— \"أخي نور… هل ستحضر لي شيئًا معك؟ \" فكّر قليلًا وقال: — \"ربما.\" في المتجر أمسك اللعبة التي حلم بها طويلًا، ثم توقف فجأة. قال في نفسه: \"هذه اللعبة ثمن كل تعبي… وسأملّ منها بعد أيام وربما تنكسر… هل هذا اختيار ذكي؟\" اقترب من قسم الأدوات المدرسية، فوجد مجموعة أقلام ممتازة كان يحتاجها منذ فترة. قال: \"هذه الأقلام ستفيدني… وسأشتري مثلها لإخواتي أيضاً.\" ومرّ بعدها فوجد مجموعة صحون جميلة فسأل نفسه: \"لم لا أشتريها لأمي؟ ستكون سعيدة بهذا.\" عاد نور إلى البيت سعيدًا، أعطى أخواته الاقلام، وقدّم لأمه مجموعة الصحون فقالت وهي متأثرة: \"بارك الله فيك يا نور… هذا مال حلال مبارك.\" بعد عام… كان نور يجلس مع أخته حور في المطبخ وهم يستخدمون الصحون نفسها، فقالت حور مبتسمة: — \"نور، أتذكر أول مرة عملت فيها؟! ما زلنا نستخدم ما اشتريته يومها!\" ضحك نور وقال: — \"نعم… وتعلمت يومها أن المال إذا جاء من طريق طيب واستُخدم في الخير… صار بركة.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الغريم الطالب",
        "text": "كان نور يحتفظ ببعض المال من مصروفه الأسبوعي ليشتري به شيئًا يحتاجه لاحقًا. وفي يوم من الأيام جاءت أخته حور وقالت له: – نور، أيمكنك أن تُقرضني بعض المال؟ صديقتي مريم ستحتفل بعيد ميلادها وأريد أن أشتري لها هدية بسيطة. سأعيده لك الأسبوع القادم عندما آخذ مصروفي. ابتسم نور وقال: – لا مشكلة يا أختي، هذا المال أمانة عندك، وأحتاجه الأسبوع القادم. أخذت حور المال وذهبت مسرورة. اشترت الهدية وأهدتها لصديقتها وكانت سعيدة جدًا. الأسبوع التالي اقترب نور من حور وسألها بهدوء: – حور، هل يمكنك أن تعيدي لي المبلغ اليوم كما وعدتِ؟ ترددت حور قليلًا ثم قالت: – ليس الآن… ثم ماذا ستفعل بالمال؟ أنت لا تحتاجه بشيء مهم! تعجب نور من كلامها وأحس بالضيق، فهذا ليس عدلًا. ذهب إلى أمهما وحكى لها ما حدث. موقف الأم"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الغريم الطالب",
        "text": "جلست الأم معهما وقالت بصوت هادئ وحكيم: – يا حور، الدين أمانة ويجب رده في الوقت المتفق عليه. من الخطأ أن تؤخري حق أخيك أو تستهيني به. ثم التفتت إلى نور: – وأنت يا نور، اصبر على أختك وأحسن الكلام معها. اطلب حقك بلطف، ولا تغضب ولا تظلم. ثم قالت: – أعطوها فرصة أسبوعًا آخر، وليكن هذا درسًا في الأمانة والخلق. وافق نور وصبر، وشعرت حور بالخجل من نفسها لأنها أخّرت حق أخيها وظنّت أن الأمر بسيط. الأسبوع الذي بعده جاءت حور إلى نور وهي تحمل المال، وقالت معتذرة: – سامحني يا أخي، تأخرتُ في رد حقك، وهذا خطأ مني. شكرًا لصبرك. ابتسم نور وقال: – المهم أنك وفيتِ بوعدك، وأنا مسامحك. ابتسمت الأم وقالت: – هكذا تكون الأخلاق بين الإخوة، لا ظلم ولا مماطلة ولا سوء معاملة."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ الحَدِيثَةُ وَفِيزْيَاءُ الكَمِّ",
      "topic": "الدَّرْسَانِ (9 وَ10): الظَّوَاهِرُ العَجِيبَةُ فِي فِيزْيَاءِ الكَمِّ — تِقْنِيَاتُ فِيزْيَاءِ الكَمِّ وَالمُسْتَقْبَلُ",
      "coverImg": "assets/y7/scince/s23.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s23.1.jpg",
          "text": "الدَّرْسُ (9) الظَّوَاهِرُ العَجِيبَةُ فِي فِيزْيَاءِ الكَمِّ: (1) التَّرَاكُبُ الكَمُومِيُّ: وُجُودُ الجُسَيْمِ فِي حَالَتَيْنِ مُخْتَلِفَتَيْنِ فِي نَفْسِ الوَقْتِ كَعُمْلَةٍ تَدُورُ قَبْلَ أَنْ تَسْتَقِرَّ عِنْدَ قِيَاسِهَا. (2) التَّشَابُكُ الكَمُومِيُّ: جُسَيْمَانِ مُتَرَابِطَانِ يَسْتَجِيبَانِ فِي اللَّحْظَةِ نَفْسِهَا مَهْمَا تَبَاعَدَتِ المَسَافَاتُ. (3) النَّفَقُ الكَمُومِيُّ: عُبُورُ الجُسَيْمِ لِلْحَوَاجِزِ وَهُوَ سِرُّ انْدِمَاجِ الذَّرَّاتِ فِي الشَّمْسِ. (4) الكَمُّ فِي الطَّبِيعَةِ: البِنَاءُ الضَّوْئِيُّ فِي النَّبَاتِ وَبُوصَلَةُ الطُّيُورِ المُهَاجِرَةِ."
        },
        {
          "img": "assets/y7/scince/s23.2.jpg",
          "text": "الدَّرْسُ (10) تِقْنِيَاتُ فِيزْيَاءِ الكَمِّ وَالمُسْتَقْبَلُ: (1) اللَّيْزَرُ وَالرَّقَائِقُ الإِلِكْتْرُونِيَّةُ: فُوتُونَاتٌ مُتَطَابِقَةٌ فِي حُزْمَةٍ ضَيِّقَةٍ وَمُعَالِجَاتٌ تُشَغِّلُ الهَوَاتِفَ وَالحَوَاسِيبَ. (2) الحَاسُوبُ الكَمُومِيُّ: يَعْتَمِدُ عَلَى (الكِيُوبِتِ الكَمُومِيِّ) الَّذِي يَحْمِلُ حَالَاتٍ مُتَعَدِّدَةً فِي وَقْتٍ وَاحِدٍ لِحَلِّ المَسَائِلِ الضَّخْمَةِ فِي ثَوَانٍ. (3) التَّشْفِيرُ الكَمُومِيُّ: حِمَايَةُ البَيَانَاتِ بِأَمَانٍ فَائِقٍ. (4) أَجْهِزَةُ المُسْتَقْبَلِ: الرَّنِينُ المِغْنَاطِيسِيُّ الطِّبِّيُّ، وَالمَوَصِّلَاتُ الفَائِقَةُ، وَالمَجَاهِرُ الإِلِكْتْرُونِيَّةُ."
        }
      ],
      "text": "الدَّرْسُ (9) الظَّوَاهِرُ العَجِيبَةُ فِي فِيزْيَاءِ الكَمِّ: (1) التَّرَاكُبُ الكَمُومِيُّ: وُجُودُ الجُسَيْمِ فِي حَالَتَيْنِ مُخْتَلِفَتَيْنِ فِي نَفْسِ الوَقْتِ كَعُمْلَةٍ تَدُورُ قَبْلَ أَنْ تَسْتَقِرَّ عِنْدَ قِيَاسِهَا. (2) التَّشَابُكُ الكَمُومِيُّ: جُسَيْمَانِ مُتَرَابِطَانِ يَسْتَجِيبَانِ فِي اللَّحْظَةِ نَفْسِهَا مَهْمَا تَبَاعَدَتِ المَسَافَاتُ. (3) النَّفَقُ الكَمُومِيُّ: عُبُورُ الجُسَيْمِ لِلْحَوَاجِزِ وَهُوَ سِرُّ انْدِمَاجِ الذَّرَّاتِ فِي الشَّمْسِ. (4) الكَمُّ فِي الطَّبِيعَةِ: البِنَاءُ الضَّوْئِيُّ فِي النَّبَاتِ وَبُوصَلَةُ الطُّيُورِ المُهَاجِرَةِ. الدَّرْسُ (10) تِقْنِيَاتُ فِيزْيَاءِ الكَمِّ وَالمُسْتَقْبَلُ: (1) اللَّيْزَرُ وَالرَّقَائِقُ الإِلِكْتْرُونِيَّةُ: فُوتُونَاتٌ مُتَطَابِقَةٌ فِي حُزْمَةٍ ضَيِّقَةٍ وَمُعَالِجَاتٌ تُشَغِّلُ الهَوَاتِفَ وَالحَوَاسِيبَ. (2) الحَاسُوبُ الكَمُومِيُّ: يَعْتَمِدُ عَلَى (الكِيُوبِتِ الكَمُومِيِّ) الَّذِي يَحْمِلُ حَالَاتٍ مُتَعَدِّدَةً فِي وَقْتٍ وَاحِدٍ لِحَلِّ المَسَائِلِ الضَّخْمَةِ فِي ثَوَانٍ. (3) التَّشْفِيرُ الكَمُومِيُّ: حِمَايَةُ البَيَانَاتِ بِأَمَانٍ فَائِقٍ. (4) أَجْهِزَةُ المُسْتَقْبَلِ: الرَّنِينُ المِغْنَاطِيسِيُّ الطِّبِّيُّ، وَالمَوَصِّلَاتُ الفَائِقَةُ، وَالمَجَاهِرُ الإِلِكْتْرُونِيَّةُ.",
      "q1": {
        "q": "مَا الظَّاهِرَةُ الكَمُومِيَّةُ الَّتِي تُمَكِّنُ الذَّرَّاتِ فِي قَلْبِ الشَّمْسِ مِنَ الانْدِمَاجِ لِإِنْتَاجِ الدِّفْءِ وَالضِّيَاءِ؟",
        "focusWord": "النَّفَقُ الكَمُومِيُّ",
        "options": [
          {
            "text": "ظَاهِرَةُ النَّفَقِ الكَمُومِيِّ (عُبُورُ الجُسَيْمِ لِلْحَوَاجِزِ)",
            "correct": true
          },
          {
            "text": "التَّبَخُّرُ المَائِيُّ",
            "correct": false
          },
          {
            "text": "الاحْتِكَاكُ المِيكَانِيكِيُّ",
            "correct": false
          },
          {
            "text": "المَدُّ وَالجَزْرُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "بِمَاذَا يَتَمَيَّزُ (الكِيُوبِتُ الكَمُومِيُّ) فِي الحَاسُوبِ الكَمُومِيِّ عَنِ البِتِّ التَّقْلِيدِيِّ (0 أَوْ 1)؟",
        "focusWord": "الكِيُوبِتُ الكَمُومِيُّ",
        "options": [
          {
            "text": "يُمَثِّلُ حَالَاتٍ مُتَعَدِّدَةً فِي وَقْتٍ وَاحِدٍ فَيَحُلُّ المَسَائِلَ الضَّخْمَةَ فِي ثَوَانٍ",
            "correct": true
          },
          {
            "text": "يَعْمَلُ بِالفَحْمِ وَالحَطَبِ",
            "correct": false
          },
          {
            "text": "أَبْطَأُ مِنَ المِعْدَادِ الخَشَبِيِّ",
            "correct": false
          },
          {
            "text": "لَا يُخَزِّنُ أَيَّ مَعْلُومَةٍ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "أَيْنَ نَرَى تَطْبِيقَاتِ فِيزْيَاءِ الكَمِّ فِي الطَّبِيعَةِ وَالطِّبِّ الحَدِيثِ؟",
        "focusWord": "تَطْبِيقَاتُ الكَمِّ",
        "options": [
          {
            "text": "فِي البِنَاءِ الضَّوْئِيِّ وَبُوصَلَةِ الطُّيُورِ، وَفِي جِهَازِ الرَّنِينِ المِغْنَاطِيسِيِّ وَاللَّيْزَرِ",
            "correct": true
          },
          {
            "text": "فِي طَحْنِ الحُبُوبِ بِالرَّحَى فَقَطْ",
            "correct": false
          },
          {
            "text": "فِي حَفْرِ الآبَارِ اليَدَوِيَّةِ",
            "correct": false
          },
          {
            "text": "فِي رَعْيِ الأَغْنَامِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "التَّرَاكُبُ وَالتَّشَابُكُ الكَمُومِيُّ",
          "left": "وُجُودُ الجُسَيْمِ فِي حَالَتَيْنِ مَعًا وَتَرَابُطُ التَّوْأَمِ الكَمُومِيِّ"
        },
        {
          "right": "النَّفَقُ الكَمُومِيُّ",
          "left": "اخْتِرَاقُ الجُسَيْمِ لِلْحَوَاجِزِ وَسِرُّ إِشْرَاقِ الشَّمْسِ"
        },
        {
          "right": "الحَاسُوبُ وَالتَّشْفِيرُ الكَمُومِيُّ",
          "left": "الكِيُوبِتُ الفَائِقُ السُّرْعَةِ وَحِمَايَةُ البَيَانَاتِ بِأَمَانٍ تَامٍّ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ ظَوَاهِرَ وَتِقْنِيَاتِ فِيزْيَاءِ الكَمِّ وَالمُسْتَقْبَلِ:",
        "correct": [
          "التَّرَاكُبُ وَالتَّشَابُكُ وَالنَّفَقُ الكَمُومِيُّ",
          "أَشِعَّةُ اللَّيْزَرِ وَالرَّقَائِقُ الإِلِكْتْرُونِيَّةُ",
          "الحَاسُوبُ الكَمُومِيُّ (الكِيُوبِتُ)",
          "الرَّنِينُ المِغْنَاطِيسِيُّ وَالمَوَصِّلَاتُ الفَائِقَةُ"
        ],
        "wrong": [
          "إِسَاءَةُ اسْتِخْدَامِ التِّقْنِيَةِ",
          "تَوْجِيهُ أَشِعَّةِ اللَّيْزَرِ إِلَى العَيْنِ"
        ]
      },
      "applyStep": "أَسْتَخْدِمُ الأَجْهِزَةَ الإِلِكْتْرُونِيَّةَ وَالحَوَاسِيبَ فِي طَلَبِ العِلْمِ النَّافِعِ وَلَا أُوَجِّهُ أَشِعَّةَ اللَّيْزَرِ إِلَى أَعْيُنِ الآخَرِينَ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt23.jpg",
      "title": "الدَّرْسُ (6): المَسَارُ الثَّالِثُ (7 دَقَائِقَ وَنِصْفٌ) — تَأَمُّلٌ، مُرُونَةٌ، وَقُوَّةٌ هَادِئَةٌ",
      "subtitle": "التَّأَمُّلُ فِي الامْتِنَانِ، تَمَدُّدُ العَمُودِ الفَقَرِيِّ، البِلَانْكُ العَكْسِيُّ، وَتَبَادُلُ الكُرَةِ",
      "slideText": "🧘‍♂️ الدَّرْسُ (6) المَسَارُ الثَّالِثُ (7 دَقَائِقَ وَنِصْفٌ — تَأَمُّلٌ، مُرُونَةٌ، وَقُوَّةٌ هَادِئَةٌ): (1) الوَعْيُ (دَقِيقَتَانِ): التَّأَمُّلُ فِي الامْتِنَانِ مَعَ شَهِيقٍ (4 ثَوَانٍ) وَزَفِيرٍ (7-8 ثَوَانٍ). (2) الاسْتِطَالَةُ (دَقِيقَتَانِ): تَمَدُّدُ العَمُودِ الفَقَرِيِّ اللَّطِيفُ عَلَى الظَّهْرِ مَعَ ثَنْيِ الرُّكْبَتَيْنِ. (3) النُّمُوُّ العَضَلِيُّ (30-60 ثَانِيَةً): تَمْرِينُ بِلَانْكٍ عَكْسِيٍّ. (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَةٌ وَنِصْفٌ): تَبَادُلُ الكُرَةِ السَّرِيعُ بَيْنَ زَمِيلَيْنِ. (5) التَّدَفُّقُ (يُؤَدَّى أَخِيرًا فَقَطْ — دَقِيقَةٌ وَاحِدَةٌ): التَّأَمُّلُ الوَاعِي وَالجُلُوسُ الهَادِئُ.",
      "q1": {
        "q": "مَا الهَدَفُ مِنْ (الدَّرْسِ السَّادِسِ: المَسَارِ الثَّالِثِ — 7 دَقَائِقَ وَنِصْفٌ)؟",
        "focusWord": "تَأَمُّلٌ، مُرُونَةٌ، وَقُوَّةٌ هَادِئَةٌ",
        "options": [
          {
            "text": "الجَمْعُ بَيْنَ التَّأَمُّلِ فِي الامْتِنَانِ، وَمُرُونَةِ العَمُودِ الفَقَرِيِّ، وَالقُوَّةِ الهَادِئَةِ",
            "correct": true
          },
          {
            "text": "الإِجْهَادُ الشَّدِيدُ",
            "correct": false
          },
          {
            "text": "الصُّرَاخُ العَالِي",
            "correct": false
          },
          {
            "text": "الجَرْيُ فِي الشَّارِعِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ (البِلَانْكِ العَكْسِيِّ) فِي فَقْرَةِ النُّمُوِّ العَضَلِيِّ؟",
        "focusWord": "بِلَانْكٌ عَكْسِيٌّ",
        "options": [
          {
            "text": "الارْتِكَازُ عَلَى الكَفَّيْنِ وَالكَعْبَيْنِ مَعَ رَفْعِ الجِسْمِ وَالحَوْضِ مُسْتَقِيمًا لِمُدَّةِ 30 إِلَى 60 ثَانِيَةً",
            "correct": true
          },
          {
            "text": "الاسْتِلْقَاءُ عَلَى البَطْنِ وَالنَّوْمُ",
            "correct": false
          },
          {
            "text": "الوُقُوفُ عَلَى الرَّأْسِ",
            "correct": false
          },
          {
            "text": "الجُلُوسُ عَلَى الكُرْسِيِّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا تَمْرِينُ الاسْتِجَابَةِ العَصَبِيَّةِ فِي الدَّرْسِ السَّادِسِ؟",
        "focusWord": "تَبَادُلُ الكُرَةِ",
        "options": [
          {
            "text": "تَبَادُلُ الكُرَةِ بِيَقَظَةٍ وَتَرْكِيزٍ لِمُدَّةِ دَقِيقَةٍ وَنِصْفٍ",
            "correct": true
          },
          {
            "text": "رَكْلُ الكُرَةِ بَعِيدًا",
            "correct": false
          },
          {
            "text": "إِخْفَاءُ الكُرَةِ",
            "correct": false
          },
          {
            "text": "إِغْمَاضُ العَيْنَيْنِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ (الدَّرْسُ 6)",
          "left": "التَّأَمُّلُ فِي الامْتِنَانِ مَعَ شَهِيقٍ 4ث وَزَفِيرٍ 7-8ث"
        },
        {
          "right": "الاسْتِطَالَةُ وَالنُّمُوُّ العَضَلِيُّ",
          "left": "تَمَدُّدُ العَمُودِ الفَقَرِيِّ اللَّطِيفُ + البِلَانْكُ العَكْسِيُّ"
        },
        {
          "right": "الاسْتِجَابَةُ وَالتَّدَفُّقُ",
          "left": "تَبَادُلُ الكُرَةِ ثُمَّ التَّأَمُّلُ الوَاعِي الهَادِئُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ السَّادِسِ (المَسَارِ الثَّالِثِ — 7 دَقَائِقَ وَنِصْفٌ):",
        "correct": [
          "التَّأَمُّلُ فِي الامْتِنَانِ (دَقِيقَتَانِ)",
          "تَمَدُّدُ العَمُودِ الفَقَرِيِّ اللَّطِيفُ",
          "بِلَانْكٌ عَكْسِيٌّ (30-60 ثَانِيَةً)",
          "تَبَادُلُ الكُرَةِ وَالتَّأَمُّلُ الوَاعِي"
        ],
        "wrong": [
          "اللَّعِبُ العَنِيفُ بِالكُرَةِ",
          "إِهْمَالُ اسْتِقَامَةِ الظَّهْرِ"
        ]
      },
      "applyStep": "أُطَبِّقُ المَسَارَ الثَّالِثَ (تَمَدُّدَ العَمُودِ الفَقَرِيِّ وَالبِلَانْكَ العَكْسِيَّ وَتَبَادُلَ الكُرَةِ وَالتَّأَمُّلَ الوَاعِيَ)."
    }
  },
  {
    "w": 24,
    "secNum": 6,
    "heavenName": "سَمَاءُ الخَمِيسِ السَّادِسَةُ (ش ت ث خ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّادِسَةُ: الفِيزْيَاءُ الكِلَاسِيكِيَّةُ وَالطَّاقَةُ وَالصَّوْتُ وَالضَّوْءُ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "خ",
    "jummal": 600,
    "prophet": "إِدْرِيسُ (ع)",
    "virtue": "العِلْمُ",
    "unitHeader": "الوَحْدَةُ الرَّابِعَةُ وَالعِشْرُونَ الكَامِلَةُ: نَبِيُّ اللهِ أَخْنُوخُ (إِدْرِيسُ الصِّدِّيقُ عَلَيْهِ السَّلَامُ)",
    "storyThird": "كَانَ نَبِيُّ اللهِ إِدْرِيسُ (ع) صِدِّيقًا نَبِيًّا، وَهُوَ أَوَّلُ مَنْ خَطَّ بِالقَلَمِ وَعَلَّمَ النَّاسَ الحِسَابَ وَخِيَاطَةَ الثِّيَابِ، وَرَفَعَهُ اللهُ مَكَانًا عَلِيًّا.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (طُغْيَانُ الجَبَّارِ مُقَابِلَ حَرَارَةِ الشَّمْسِ وَنُورِ الرِّفْعَةِ): نَارُ الظُّلْمِ وَالغَضَبِ فِي قَلْبِ المَلِكِ الجَبَّارِ «بِيُورَاسِبَ» الَّذِي قَتَلَ صَاحِبَ الضَّيْعَةِ المُؤْمِنَ ظُلْمًا، وَحَرَارَةُ الشَّمْسِ الشَّدِيدَةُ الَّتِي شَفَعَ أَخْنُوخُ لِلْمَلَكِ المُوَكَّلِ بِهَا فَنَالَ رِفْعَةَ السَّمَاءِ. B. الرِّيحُ (الوَهْمُ وَشَهَادَةُ الزُّورِ مُقَابِلَ أَجْنِحَةِ المَلَائِكَةِ): رِيحُ الوَهْمِ وَالكَذِبِ حِينَ دَبَّرَتِ امْرَأَةُ المَلِكِ شُهُودَ الزُّورِ لِغَصْبِ الضَّيْعَةِ؛ وَفِي مُقَابِلِهَا رِيحُ العُرُوجِ السَّمَاوِيِّ حِينَ حَمَلَهُ المَلَكُ عَلَى جَنَاحِهِ يَصْعَدُ بِهِ فِي الهَوَاءِ إِلَى السَّمَاوَاتِ العُلَا. C. التُّرَابُ (العَقْلُ وَعِلْمُ النُّجُومِ وَالهَنْدَسَةِ وَالرَّمَادُ): حِكْمَةُ أَخْنُوخَ العَقْلِيَّةُ فِي تَعْلِيمِ النَّاسِ تَخْطِيطَ المُدُنِ وَالحِسَابَ وَهَيْئَةَ الأَفْلَاكِ، وَاخْتِبَاؤُهُ فِي كَهْفِ الجَبَلِ يَعْبُدُ اللهَ، وَتَعْفِيرُ قَوْمِهِ وُجُوهَهُمْ بِالتُّرَابِ وَالرَّمَادِ نَدَمًا وَتَوْبَةً حَتَّى رَحِمَهُمُ اللهُ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَعودَةُ الغَيْثِ وَزِيَارَةُ الكُوفَةِ): دُمُوعُ التَّوْبَةِ وَتَوَاضُعُ أَخْنُوخَ لِرَبِّهِ، وَعَوْدَةُ المَطَرِ وَنَبْعِ العُيُونِ بِدُعَائِهِ بَعْدَ عِشْرِينَ سَنَةً مِنَ الجَفَافِ، وَسُنَّةُ الاغْتِسَالِ بِالمَاءِ الطَّهُورِ عِنْدَ مَقَامِ بَيْتِهِ فِي مَسْجِدِ السَّهْلَةِ بِالكُوفَةِ.",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ الخَمِيسِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ أَرْبَعَةٌ وَعِشْرُونَ فِي مَنْزِلَةِ المَاءِ وَالطَّاعَةِ وَالتَّوَاضُعِ وَالحِكْمَةِ العَالِيَةْ، وَهُوَ الصِّدِّيقُ النَّبِيُّ أَخْنُوخْ. سُمِّيَ فِي القُرْآنِ الكَرِيمِ إِدْرِيسَ لِكَثْرَةِ دِرَاسَتِهِ لِصُحُفِ جَدِّهِ آدَمَ وَشِيثٍ عَلَيْهِمَا السَّلَامُ وَكَثْرَةِ تَفَكُّرِهِ فِي عَظَمَةِ خَلْقِ اللهْ، وَهُوَ أَوَّلُ مَنْ خَطَّ بِالقَلَمِ عَلَى الصُّحُفِ وَعَلَّمَ النَّاسَ الحِسَابَ وَمَطَالِعَ النُّجُومِ وَقِسْمَةَ اليَوْمِ إِلَى أَرْبَعٍ وَعِشْرِينَ سَاعَةً. وَكَانَ النَّاسُ قَبْلَهُ يَلْبَسُونَ الجُلُودَ، فَهَدَاهُ اللهُ بِعَقْلِهِ إِلَى نَسْجِ الكَتَّانِ وَهُوَ أَوَّلُ مَنْ خَاطَ الثِّيَابَ بِالإِبْرَةِ وَخَيْطٍ متِينٍ؛ فَكَانَ يَعْمَلُ بِيَدِهِ فِي مَسْجِدِ السَّهْلَةِ بِالكُوفَةِ وَمَعَ كُلِّ غَرْزَةِ إِبْرَةٍ يُسَبِّحُ اللهَ قَائِلًا سُبُّوحٌ قُدُّوسٌ رَبُّ المَلَائِكَةِ وَالرُّوحِ، وَيَتَصَدَّقُ بِمَا يَكْسِبُ عَلَى الفُقَرَاءِ وَلا يَبْخَلُ بِشَيْءٍ مِنْ طَعَامِهِ أَبَدًا.",
      "وَفِي زَمَانِهِ حَكَمَ مَلِكٌ جَبَّارٌ اسْمُهُ بِيُورَاسِبُ اشْتَعَلَتْ فِي صَدْرِهِ نَارُ الطَّمَعِ وَالظُّلْمْ، فَرَأَى ضَيْعَةً خَضْرَاءَ كَثِيرَةَ الأَنْهَارِ وَالأَشْجَارِ لِرَجُلٍ مُؤْمِنٍ صَالِحٍ، فَطَلَبَ مِنْهُ أَنْ يَبِيعَهَا لَهُ فَرَفَضَ المُؤْمِنُ لِأَنَّهَا قُوتُ عِيَالِهْ. فَمَكَرَتِ امْرَأَةُ المَلِكِ الشِّرِّيرَةُ بِرِيحِ الوَهْمِ وَالكَذِبِ وَجَاءَتْ بِشُهُودِ زُورٍ فَقَتَلُوا الرَّجُلَ المُؤْمِنَ ظُلْمًا وَغَصَبُوا بُسْتَانَهْ! فَغَضِبَ اللهُ لِوَلِيِّهِ المَظْلُومِ وَأَوْحَى إِلَى نَبِيِّهِ أَخْنُوخَ أَنْ أَنْذِرِ المَلِكَ الجَبَّارَ بِأَنِّي سَأَنْتَقِمُ مِنْهُ وَأُسَلِّطُ عَلَى قَوْمِهِ القَحْطَ العَظِيمْ. فَدَخَلَ أَخْنُوخُ عَلَى المَلِكِ بِشَجَاعَةٍ وَبَلَّغَهُ رِسَالَةَ اللهِ فَخَرَجَ مِنْ عِنْدِهِ مَحْفُوظًا بِعِنَايَةِ الرَّحْمٰنْ.",
      "أَمَرَ اللهُ نَبِيَّهُ أَخْنُوخَ أَنْ يَعْتَزِلَ القَوْمَ، فَصَعِدَ إِلَى كَهْفٍ فِي جَبَلٍ شَامِخٍ يَعْبُدُ اللهَ وَوكَّلَ اللهُ بِهِ مَلَكًا يَأْتِيهِ بِطَعَامِهِ عِنْدَ كُلِّ مَسَاءٍ بَعْدَ صِيَامِهْ. وَحَبَسَ اللهُ مَاءَ السَّمَاءِ وَنَبْعَ الأَرْضِ عَنْ مَدِينَةِ الجَبَّارِ عِشْرِينَ سَنَةً حَتَّى جَفَّتِ العُيُونُ وَيَبِسَ الزَّرْعُ وَهَلَكَ المَلِكُ الظَّالِمُ، فَعَلِمَ القَوْمُ أَنَّ البَلَاءَ نَزَلَ بِهِمْ لِظُلْمِهِمْ لِنَبِيِّ اللهِ أَخْنُوخْ. فَتَابُوا إِلَى اللهِ تَوْبَةً صَادِقَةً وَلَبِسُوا المَسُوحَ الخَشِنَةَ وَوَضَعُوا التُّرَابَ وَالرَّمَادَ عَلَى رُؤُوسِهِمْ تَوَاضُعًا لِلهِ وَبَكَوْا وَتَضَرَّعُوا، فَأَوْحَى اللهُ إِلَى أَخْنُوخَ أَنِ ادْعُ لِقَوْمِكَ فَقَدْ رَحِمْتُهُمْ؛ فَدَعَا أَخْنُوخُ رَبَّهُ الَّذِي سَخَّرَ السَّحَابَ وَيُسَخِّرُ الرِّيَاحَ فَنَزَلَ المَطَرُ الغَزِيرُ وَعَادَ الخَيْرُ إِلَى البِلَادْ.",
      "وَكَانَ أَخْنُوخُ عَبْدًا زَاهِدًا خَاشِعًا يَصْعَدُ لَهُ فِي كُلِّ يَوْمٍ مِنَ العِبَادَةِ وَالتَّسْبِيحِ مِثْلُ عَمَلِ جَمِيعِ أَهْلِ الأَرْضِ، فَعَجِبَتِ المَلَائِكَةُ مِنْ كَثْرَةِ عِبَادَتِهِ فَنَزَلَ مَلَكُ المَوْتِ بِإِذْنِ اللهِ فِي صُورَةِ إِنْسَانٍ لِيَصْحَبَهُ وَيَخْتَبِرَ صَبْرَهُ وَإِخْلَاصَهْ. فَسَارَا مَعًا فِي البَرِّيَّةِ ثَلَاثَةَ أَيَّامٍ وَأَخْنُوخُ صَائِمٌ، وَمَرَّا بِزَرْعٍ وَكَرْمِ عِنَبٍ وَغَنَمٍ فَدَعَاهُ الرَّفِيقُ لِيَأْكُلَ مِنْهَا فَرَفَضَ أَخْنُوخُ بِورَعِهِ وَقَالَ سُبْحَانَ اللهِ لا آكُلُ مِنْ مَالِ غَيْرِي بِلَا إِذْنٍ، حَتَّى عَرَفَ أَنَّ رَفِيقَهُ هُوَ مَلَكُ المَوْتِ عَلَيْهِ السَّلَامْ! وَكَانَ أَخْنُوخُ أَيْضًا قَدْ دَعَا بِالاسْمِ الأَعْظَمِ وَشَفَعَ لِمَلَكٍ مِنَ المَلَائِكَةِ فَرَدَّ اللهُ جَنَاحَهُ وَمَقَامَهُ، كَمَا دَعَا اللهَ أَنْ يُخَفِّفَ ثِقَلَ الشَّمْسِ وَحَرَّهَا عَنِ المَلَكِ المُوَكَّلِ بِهَا، فَقَالَ المَلَكُ يَا نَبِيَّ اللهِ مَا حَاجَتُكَ؟ فَسَأَلَ أَخْنُوخُ أَنْ يَصْعَدَ إِلَى السَّمَاءِ لِيَرَى مَلَكُوتَ السَّمَاوَاتِ وَيَزْدَادَ يَقِينًا وَخَشْيَةً.",
      "فَحَمَلَهُ المَلَكُ بِأَمْرِ اللهِ عَلَى جَنَاحِهِ وَطَارَ بِهِ فِي الفَضَاءِ حَتَّى بَلَغَ السَّمَاءَ الرَّابِعَةَ حَيْثُ فَلَكُ الشَّمْسِ المُنِيرْ، وَقَبَضَ مَلَكُ المَوْتِ رُوحَهُ سَاعَةً ثُمَّ أَحْيَاهُ اللهُ وَأَرَاهُ الجَنَّةَ؛ فَلَمَّا دَخَلَ الجَنَّةَ وَطَابَ لَهُ نَعِيمُهَا تَعَلَّقَ بِشَجَرَةٍ مِنْ أَشْجَارِهَا وَقَالَ وَعِزَّةِ رَبِّي لا أَخْرُجُ مِنْهَا بَعْدَ أَنْ أَذَاقَنِي اللهُ المَوْتَ وَأَحْيَانِي وَأَدْخَلَنِي جَنَّتَهْ! فَأَوْحَى اللهُ إِلَى المَلَائِكَةِ خَلُّوا سَبِيلَ عَبْدِي فَإِنَّهُ عَلَى الحَقِّ وَقَدْ رَسَخَ يَقِينُهُ فِي قَلْبِهِ، وَبَقِيَ حَيًّا فِي السَّمَاءِ يَأْكُلُ مِنْ شَجَرَةِ خُلْدٍ وَخُوخٍ وَرُمَّانٍ وَأَطْيَبِ الثِّمَارِ وَتُسَبِّحُ المَلَائِكَةُ مَعَهْ. وَقَالَ اللهُ تَعَالَى فِيهِ وَاذْكُرْ فِي الكِتَابِ إِدْرِيسَ إِنَّهُ كَانَ صِدِّيقًا نَبِيًّا وَرَفَعْنَاهُ مَكَانًا عَلِيًّا؛ لِيَعْلَمَ كُلُّ مُؤْمِنٍ أَنَّ اللهَ يَرْفَعُ مَنْ يَتَوَاضَعُ لَهُ وَيُطَهِّرُ قَلْبَهُ حَتَّى لَا يَضُخُّ فِي عُرُوقِهِ إِلَّا حُبُّ الخَيْرِ وَتَمْسَحَ الصَّدَقَةُ كُلَّ وَجَعٍ أَوْ وَسَخٍ عَنِ النَّفْسِ فَيَسْعَدَ فِي الدُّنْيَا وَالآخِرَةِ."
    ],
    "words": [
      {
        "word": "يَبْخَلُ",
        "desc": "وسط متصل / ساكن: ـخْـ",
        "raw": "يَبْخَلُ (وسط متصل / ساكن: ـخْـ)"
      },
      {
        "word": "أَخْنُوخْ",
        "desc": "آخر منفصل / ساكن وقفا: خْ",
        "raw": "أَخْنُوخْ (آخر منفصل / ساكن وقفا: خْ)"
      },
      {
        "word": "خَلْقِ",
        "desc": "أول منفصل / متحرك بالفتح: خَـ",
        "raw": "خَلْقِ (أول منفصل / متحرك بالفتح: خَـ)"
      },
      {
        "word": "فَخَرَجَ",
        "desc": "أول متصل / متحرك بالفتح: ـخَـ",
        "raw": "فَخَرَجَ (أول متصل / متحرك بالفتح: ـخَـ)"
      },
      {
        "word": "دَخَلَ",
        "desc": "وسط منفصل / متحرك بالفتح: خَـ",
        "raw": "دَخَلَ (وسط منفصل / متحرك بالفتح: خَـ)"
      },
      {
        "word": "أَخَذَ",
        "desc": "وسط منفصل / متحرك بالفتح: خَـ",
        "raw": "أَخَذَ (وسط منفصل / متحرك بالفتح: خَـ)"
      },
      {
        "word": "رَسَخَ",
        "desc": "آخر متصل / متحرك بالفتح: ـخَ",
        "raw": "رَسَخَ (آخر متصل / متحرك بالفتح: ـخَ)"
      },
      {
        "word": "خُلْدٍ",
        "desc": "أول منفصل / متحرك بالضم: خُـ",
        "raw": "خُلْدٍ (أول منفصل / متحرك بالضم: خُـ)"
      },
      {
        "word": "وَسَخٌ",
        "desc": "آخر متصل أو منفصل / متحرك بالضم: ـخٌ / خٌ",
        "raw": "وَسَخٌ (آخر متصل أو منفصل / متحرك بالضم: ـخٌ / خٌ)"
      },
      {
        "word": "خِطَابٍ",
        "desc": "متحرك بالكسر: خِـ",
        "raw": "خِطَابٍ (متحرك بالكسر: خِـ)"
      },
      {
        "word": "سَخَّرَ",
        "desc": "وسط متصل / مضعف بالفتح: ـخَّـ",
        "raw": "سَخَّرَ (وسط متصل / مضعف بالفتح: ـخَّـ)"
      },
      {
        "word": "يَضُخُّ",
        "desc": "آخر منفصل / مضعف بالضم: خُّ",
        "raw": "يَضُخُّ (آخر منفصل / مضعف بالضم: خُّ)"
      },
      {
        "word": "يُسَخِّرُ",
        "desc": "وسط متصل / مضعف بالكسر: ـخِّـ",
        "raw": "يُسَخِّرُ (وسط متصل / مضعف بالكسر: ـخِّـ)"
      },
      {
        "word": "خَاشِعًا",
        "desc": "أول منفصل / ممدود بالألف: خَا",
        "raw": "خَاشِعًا (أول منفصل / ممدود بالألف: خَا)"
      },
      {
        "word": "خُوخٍ",
        "desc": "ممدود بالواو: خُو",
        "raw": "خُوخٍ (ممدود بالواو: خُو)"
      },
      {
        "word": "مَخِيطٍ",
        "desc": "وسط متصل / ممدود بالياء: ـخِي",
        "raw": "مَخِيطٍ (وسط متصل / ممدود بالياء: ـخِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الخَاءِ (خ): النُّطْقُ السَّلِيمُ لِحَرْفِ الخَاءِ المَهْمُوسِ الرِّخْوِ المُسْتَعْلِي (المُفَخَّمِ) مِنْ مَخْرَجِ أَدْنَى الحَلْقِ مِمَّا يَلِي الفَمَ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعَلُّمُ أَنَّ أَخْنُوخَ سُمِّيَ «إِدْرِيسَ» لِكَثْرَةِ دِرَاسَتِهِ لِكُتُبِ اللهِ وَتَسْبِيحِهِ بِـ«سُبُّوحٌ قُدُّوسٌ رَبُّ المَلَائِكَةِ وَالرُّوحِ» حَتَّى كَانَ يَصْعَدُ لَهُ كُلَّ يَوْمٍ مِثْلُ عَمَلِ جَمِيعِ أَهْلِ الأَرْضِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "المَوْجَةُ الحَلْقِيَّةُ وَالنُّقْطَةُ الفَلَكِيَّةُ العُلْيَا وَالرَّقْمُ (24): مُشَاهَدَةُ شَكْلِ حَرْفِ الخَاءِ (خ / خـ / ـخـ / ـخ) المُرَكَّبِ مِنْ حَاجِبٍ مُنْحَنٍ وَبَطْنٍ نِصْفِ دَائِرِيٍّ وَفَوْقَ رَأْسِهِ نُقْطَةٌ عَالِيَةٌ كَالشَّمْسِ فِي الفَلَكِ الرَّابِعِ (مَكَانِ رَفْعِ أَخْنُوخَ)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (24) (6 × 4 = 24؛ سِتُّ سَمَاوَاتٍ فِي أَرْبَعِ طَبَائِعَ، وَعَدَدُ سَاعَاتِ اليَوْمِ وَاللَّيْلَةِ الَّتِي قَسَّمَهَا أَخْنُوخُ بِحِسَابِ الشَّمْسِ وَالفَلَكِ)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ أَخْنُوخَ الكَامِلَةِ وَدُعَاءُ السَّهْلَةِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ أَخْنُوخَ (إِدْرِيسَ) فِي القُرْآنِ الكَرِيمِ وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ مَوَاعِظِ الحِكْمَةِ وَدُعَاءِ المكْرُوبِ فِي بَيْتِ إِدْرِيسَ بِمَسْجِدِ السَّهْلَةِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ أَرْبَعَةٌ وَعِشْرُونَ (24) وَالسِّتُّمِائَةٍ (600) وَالخَطُّ وَالخِيَاطَةُ: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (24) وَمَعْرِفَةِ قِيمَةِ الخَاءِ المِئَوِيَّةِ (خ = 600 = سِتُّ مِئَاتٍ كَامِلَةٍ)، وَتَدْرِيبُ اليَدِ عَلَى الصَّنْعَتَيْنِ الشَّرِيفَتَيْنِ اللَّتَيْنِ ابْتَدَأَهُمَا نَبِيُّ اللهِ أَخْنُوخُ بِيَدِهِ: إِمْسَاكُ القَلَمِ لِلْخَطِّ، وَإِدْخَالُ الخَيْطِ فِي الإِبْرَةِ لِخِيَاطَةِ الثِّيَابِ المَخِيطَةِ مِنْ أَلْيَافِ الكَتَّانِ الطَّبِيعِيِّ وَالصُّوفِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السَّيْرِ فِي الفَلَوَاتِ وَصُعُودِ المُرْتَفَعَاتِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى رِيَاضَةِ المَشْيِ الطَّوِيلِ وَالسِّيَاحَةِ فِي الأَرْضِ طَلَبًا لِلْعِلْمِ وَالتَّفَكُّرِ (كَمَا خَرَجَ أَخْنُوخُ يَسِيحُ فِي الأَرْضِ عِشْرِينَ سَنَةً)، وَتَمَارِينِ الاتِّزَانِ وَالارْتِقَاءِ النَّشِيطِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ النَّسِيجِ الطَّبِيعِيِّ (الكَتَّانِ) وَمَوَاسِمِ الزِّرَاعَةِ وَالرُّمَّانِ: تَعَلُّمُ كَيْفَ تُسْتَخْرَجُ الخُيُوطُ مِنْ نَبَاتِ «الكَتَّانِ» لِحِيَاكَةِ الأَقْمِشَةِ المُرِيحَةِ لِلْبَدَنِ (بَعْدَ أَنْ كَانَ النَّاسُ يَلْبَسُونَ الجُلُودَ)، وَمَعْرِفَةِ حِسَابِ الفُصُولِ الأَرْبَعَةِ لِمَوَاعِيدِ الزَّرْعِ وَالحَصَادِ، وَالقِيمَةِ الغِذَائِيَّةِ لِلرُّمَّانِ وَالعِنَبِ فِي الضَّيْعَةِ المُبَارَكَةِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ سَتْرِ البَدَنِ بِالثِّيَابِ المَخِيطَةِ وَالغُسْلِ وَالشَّفَاعَةِ لِلإِخْوَانِ: تَعَلُّمُ فَضْلِ سَتْرِ الجَسَدِ بِالثِّيَابِ النَّظِيفَةِ المَخِيطَةِ الوَاسِعَةِ، وَآدَابِ الطَّهَارَةِ وَالاغْتِسَالِ قَبْلَ دُخُولِ المَسَاجِدِ، وَحُبِّ الشَّفَاعَةِ وَالدُّعَاءِ لِلْإِخْوَانِ بِلَا طَمَعٍ (كَمَا شَفَعَ أَخْنُوخُ لِمَلَكِ الشَّمْسِ وَلِلْمَلَكِ المُعَاقَبِ)."
      }
    },
    "grammar": {
      "topic": "الصِّفَةُ وَالمَوْصُوفُ فِي الجُمْلَةِ التَّامَّةْ",
      "rule": "الصِّفَةُ تَتْبَعُ الاِسْمَ الَّذِي قَبْلَهَا (المَوْصُوفَ) فِي الرَّفْعِ بِالضَّمَّةِ، وَالنَّصْبِ بِالفَتْحَةِ، وَالجَرِّ بِالكَسْرَةْ.",
      "example": "الخُبْزُ السَّاخِنُ لَذِيذٌ — قَرَأْتُ فِي الكِتَابِ المُفِيدِ.",
      "focusWord": "الكِتَابِ المُفِيدِ",
      "q": "اخْتَرِ الصِّفَةَ المَضْبُوطَةَ بِالحَرَكَةِ الصَّحِيحَةِ: «أَكَلْتُ الخُبْزَ ...»:",
      "opts": [
        "الطَّازَجَ",
        "الطَّازَجُ",
        "الطَّازَجِ",
        "طَازَجٌ"
      ]
    },
    "earIirab": {
      "topic": "تَنَاغُمُ حَرَكَةِ الصِّفَةِ مَعَ المَوْصُوفِ سَمْعِيًّا",
      "rule": "أُذُنُنَا تَسْمَعُ الصِّفَةَ تُقَلِّدُ حَرَكَةَ المَوْصُوفِ تَمَامًا: ضَمَّةٌ مَعَ ضَمَّةٍ، وَفَتْحَةٌ مَعَ فَتْحَةٍ، وَكَسْرَةٌ مَعَ كَسْرَةْ.",
      "sentence": "يَرْعَى الخَرُوفُ الصَّغِيرُ فِي الحَقْلِ الأَخْضَرِ.",
      "targetWord": "الأَخْضَرِ",
      "caseAns": "صِفَةٌ مَجْرُورَةٌ بِالكَسْرَةِ (ـِ)"
    },
    "math": {
      "numVal": 64,
      "numName": "أَرْبَعَةٌ وَسِتُّونَ",
      "eqDisplay": "4 + 60 = 64",
      "subDisplay": "64 - 4 = 60",
      "compDisplay": "64 > 46",
      "q1": {
        "stem": "أَيُّ العَدَدَيْنِ أَكْبَرُ: (64 أَمْ 46)؟",
        "focus": "64 [ ؟ ] 46",
        "ans": "64 أَكْبَرُ مِنْ 46",
        "wrong": [
          "46 أَكْبَرُ",
          "مُتَسَاوِيَانِ",
          "0"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "4 + 60 = ؟",
        "ans": "64 (أَرْبَعَةٌ وَسِتُّونَ)",
        "wrong": [
          "46",
          "60",
          "74"
        ]
      }
    },
    "sport": {
      "title": "الخُطْوَةُ الجَانِبِيَّةُ الرَّشِيقَةُ لِلتَّوَازُنِ",
      "middleText": "أَخْطُو خُطْوَةً جَانِبِيَّةً لِليَمِينِ ثُمَّ لِليَسَارِ بِخِفَّةٍ وَتَنَاسُقٍ مَعَ حَرَكَةِ الذِّرَاعَيْنْ. يُنَشِّطُ هٰذَا التَّمْرِينُ الدَّوْرَةَ الدَّمَوِيَّةَ وَيَمْنَحُ الجِسْمَ رَشَاقَةً وَخِفَّةً فِي الحَرَكَةْ."
    },
    "sci": {
      "title": "مُخْتَبَرُ الطَّاقَةِ وَالفِيزْيَاءِ: بَطَّارِيَّةُ البَطَاطَا وَكَثَافَةُ السَّوَائِلِ",
      "summaryThird": "فِي المُخْتَبَرِ نُوَلِّدُ تَيَّارًا كَهْرَبَائِيًّا خَفِيفًا مِنْ ثَمَرَةِ البَطَاطَا، وَنُشَاهِدُ فِي أُنْبُوبِ الكَثَافَةِ كَيْفَ يَسْتَقِرُّ العَسَلُ الثَّقِيلُ فِي الأَسْفَلِ وَيَطْفُو الزَّيْتُ الخَفِيفُ فَوْقَ المَاءْ.",
      "focusConcept": "اخْتِلَافُ كَثَافَةِ السَّوَائِلِ",
      "factAns": "طَفْوُ الزَّيْتِ الخَفِيفِ فَوْقَ المَاءِ وَغَوْصُ العَسَلْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الصَّغِيرِ وَالوَلَدِ (حُور وَسُرُور - 24)",
      "storySentence": "تَعَلَّمَ سُرُورٌ وَحُورُ أَنَّ مِنْ حَقِّ الطِّفْلِ الصَّغِيرِ أَنْ نَرْحَمَهُ، وَنُحْسِنَ تَرْبِيَتَهُ، وَنُعَلِّمَهُ كِتَابَ اللهِ وَالأَخْلَاقَ الحَسَنَةَ بِالقُدْوَةِ الصَّالِحَةْ.",
      "applyAction": "أَعْطِفُ عَلَى الصِّغَارِ وَأَكُونُ قُدْوَةً طَيِّبَةً لَهُمْ."
    },
    "rightsFullTitle": "(37) حق الخليط + (38) حق الخصم",
    "rightsQuote": "وَأمّــــــا حَقُّ الخَلِيطِ  فَأَنْ لا تَغُرَّهُ ولا تَغُشَّـهُ ولا تُكَذِبَهُ ولا تُغَفِّلَهُ ولا تَخــــــــدَعَهُ ولا تَعمَلْ فِي انتِقَـــاضِهِ عَمَلَ الْعَدُوِّ الَّذِي لا يُبقِي عَلَى صَـــــــاحِبهِ وَإنِ اطْمَأَنَّ إلَيكَ اسْتَقْصَيتَ لَهُ عَلَى نفْسِـكَ وَعَلِمْتَ أَنَّ غَبْنَ الْمُسْتَرْسِلِ رِِبًا. ولا قُوَّةَ إلا باللهِ. | حق الخصم المدعي عليك",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (37) حق الخليط + (38) حق الخصم",
        "text": "وَأمّــــــا حَقُّ الخَلِيطِ  فَأَنْ لا تَغُرَّهُ ولا تَغُشَّـهُ ولا تُكَذِبَهُ ولا تُغَفِّلَهُ ولا تَخــــــــدَعَهُ ولا تَعمَلْ فِي انتِقَـــاضِهِ عَمَلَ الْعَدُوِّ الَّذِي لا يُبقِي عَلَى صَـــــــاحِبهِ وَإنِ اطْمَأَنَّ إلَيكَ اسْتَقْصَيتَ لَهُ عَلَى نفْسِـكَ وَعَلِمْتَ أَنَّ غَبْنَ الْمُسْتَرْسِلِ رِِبًا. ولا قُوَّةَ إلا باللهِ. | حق الخصم المدعي عليك — وَفِي سِيرَةِ إِدْرِيسُ (ع): آدَابُ سَتْرِ البَدَنِ بِالثِّيَابِ المَخِيطَةِ وَالغُسْلِ وَالشَّفَاعَةِ لِلإِخْوَانِ: تَعَلُّمُ فَضْلِ سَتْرِ الجَسَدِ بِالثِّيَابِ النَّظِيفَةِ المَخِيطَةِ الوَاسِعَةِ، وَآدَابِ الطَّهَارَةِ وَالاغْتِسَالِ قَبْلَ دُخُولِ المَسَاجِدِ، وَحُبِّ الشَّفَاعَةِ وَالدُّعَاءِ لِلْإِخْوَانِ بِلَا طَمَعٍ (كَمَا شَفَعَ أَخْنُوخُ لِمَلَكِ الشَّمْسِ وَلِلْمَلَكِ المُعَاقَبِ)."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الخليط",
        "text": "نور وسليم: الاحترام في لحظات الصداقة جلس نور وسليم بجانب بعضهما في حصة الرسم. كان نور فخوراً بأقلامه الملونة الجديدة، بينما كان سليم يحمل أقلاماً عادية. مد سليم يده ليأخذ قلماً من علبة نور دون استئذان. قال نور بهدوء: \"هذا قلمي يا سليم.\" نظر سليم إليه بنظرة حادة، وتراجع ببطء، مُمسكاً بقبضته. جلس صامتاً للحظات، ثم همس: \"كان عليّ أن أطلب الإذن.\" بينما كان نور منشغلاً بالرسم، حاول سليم استبدال قلمه المكسور بأحد أقلام نور الجديدة. نظر حوله، ثم أمسك القلم بسرعة، لكنه توقف للحظة وأعاده بخفة قبل أن يلاحظ نور. شعر بالندم، وواصل الرسم بقلمه المكسور. انقلبت علبة الألوان فجأة وتناثرت محتوياتها على الأرض. وقف الاثنان مذهولين، ثم نظر كل منهما إلى الآخر. بدأ سليم بالاعتذار: \"آسف، كنتُ سأعيدها.\" ردّ نور: \"لا بأس، لنساعد بعضنا.\" انحنى الاثنان معاً يجمعان الألوان."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الخليط",
        "text": "أثناء جمع الألوان، قال سليم: \"كنت مخطئاً عندما أردت أخذ قلمك.\" أجاب نور: \"وأنا كنتُ سأعطيك إياه لو طلبتَ.\" تقدّم سليم بقلبه المكسور: \"هل تريد أن نتبادل الأقلام اليوم؟\" ابتسم نور: \"بل سنشارك جميع الأقلام معاً.\" في نهاية الحصة، رسم الاثنان لوحة جميلة معاً، وتعهّدا على احترام ملكية بعضهما، والتعاون دائماً. أدركا أن الأخطاء قد تحدث، لكن الاعتذار والتعاون هما ما يبني صداقة حقيقية."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الخصم",
        "text": "وَأمّــــــــا حَقُّ الخَصْمِ المُدَّعِي عَلَيْكَ، فَإنْ كَانَ مَا يَدَّعِي عَلَيكَ حَقّــــــــاً لَمْ تنفَسِخ فِي حُجَّتِهِ وَلَمْ تَعمَلْ فِي إبطَـــــالِ دَعْوَتِهِ وَكُنْتَ خَصْــــــــــمَ نفْسِكَ لَهُ والحَـــاكِمَ عَلَيْهَا والشَّـــاهِدَ لَهُ بحَقِّهِ دُونَ شَهَادَةِ الشُّهُودِ، فَـــــــــإنَّ ذلِكَ حَقُّ اللَّهِ عَلَيْكَ، وَإنْ كَانَ مَـــا يَدَّعِيهِ بَـــــــــاطِلاً رَفَقْتَ بهِ وَرَوَّعْتَهُ  ونـــــاشَدتهُ بدِينِه وَكَسَرْتَ حِدَّتهُ عَنكَ بذِكْرِ اللهِ وَأَلْقَيْتَ حَشْوَ الْكَلامِ وَلَغَطَـــــــهُ  الَّذِي لا صمت ثقيل. ثم انفجرت حور: \"لقد كسرته! كنت مهملاً!\" تذكّر نور كلمات والده عن الإنصاف، : \"أنت محقة. سأصلح هذا.\" اليوم التالي: الكتاب المفقود والاتهام في صباح اليوم التالي، لم تجد حور كتابها المفضل. تذكرت قلمها المكسور، وانفجر غضبها المكبوت: \"أخذت كتابي انتقاماً! أعرفه!\" شعر نور بالظلم. لكنه نظر إلى عيني حور، وتذكر: \"حتى لو أخطأ الخصم، لا نرد الغضب بغضب.\" اقترب منها بهدوء: \"حور، أقسم بالله أنني لم ألمس كتابك. دعنا نبحث عنه معاً.\" وبالفعل وجدا الكتاب تحت أوراقها المدرسية. شعرت حور بالخجل، لكنها لم تستطع الاعتذار فوراً. التصعيد: شحذ سيف العداوة الأجواء ظلت متوترة. في أحد الأيام، وبينما كان نور منشغلاً بتركيب puzzle، أخذت حور قطعة مهمة ورمتها بعيداً: \"هذا لأنك كسرت قلمي!\" شعر نور بغضب يغلي، لكنه تذكر قول والده: \"اكسر حدة غضب خصمك بذكر الله، لا بتصعيد الغضب.\" تنهد ثم قال بصوت هادئ: \"بسم الله الرحمن الرحيم. حور، أنا آسف على كسر قلمك. لم أقصد إيذاءك. وغضبي لن يصلح ما فات.\" التحول والمصالحة سقطت القطعة من يد حور، وانهمرت دموع صامتة على خديها. قالت: \"وأنا آسفة.. على الاتهام وعلى كل شيء.\" جلسا معاً على الأرض، بين قطع الـ puzzle المتناثرة. لم يعودا يفكران في الفوز أو الخسارة. قال نور: \"غضبنا جعلنا نرى بعضنا كأعداء.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الخصم",
        "text": "أضافت حور: \"والعدل يعني أن أرى ألمك حتى لو كنت أنا المتألمة.\" اتفقا على ميثاق شرف: إذا اختلفا، سيذكران الله أولاً، ويتنافسان في الإنصاف لا في الانتصار. وفي تلك الليلة، كتبت حور في مذكرتها: \"تعلمت أن الحق لا ينفصل عن الرحمة، وأن أنصف أخي حتى من نفسي، هي أعظم قوة.\" حق الخصم المدعى عليه وَأمّــــــا حَقُّ الخَصْمِ الْمُدَّعَى عَلَيهِ فَإنْ كَانَ مَــــــــا تدَّعِيهِ حَقًّا أَجْمَلْتَ فِي مُقَـــــاوَلَتِهِ بمَخرَجِ الدَّعْوَى، فَإنّ لِلدَّعْوَى غِلْظَةً فِي سَــــــــــــــمْعِ الْمُدَّعَى عَلَيهِ. وَقَصَــــــــــــــــدْتَ قَصْدَ حُجَّتِكَ بالرِّفْقِ وَأَمْهَلِ الْمُهْلَةِ وَأبْينِ الْبَيَـــــــانِ وَألطَفِ اللُّطْفِ ولَمْ تَتشَـــــــاغَلْ عَنْ حُجَّتِكَ بمُنازَعَتِهِ بالقِيلِ وَالقَــــــــــــــــالِ فَتَذهَبْ عَنْكَ حُجَّتُكَ ولا يَكُونَ لَكَ فِي ذَلِكَ دَرْكٌ. ولا قُوَّةَ إلا باللهِ. بعد أن تصالح نور وحور حول القلم المكسور وكتاب حور المفقود، ظهرت مشكلة جديدة صغيرة: أثناء ترتيب puzzle، وجدت حور أن بعض القطع مفقودة أو لم يضعها نور في مكانها الصحيح، فتهمته بالخطأ أو الإهمال. شعرت حور بالاستياء، وبدأت بالكلام الحاد، لكن نور تذكر حق الخصم المدعى عليه: لم يكن هو سبب فقدان القطع أو الإهمال عمدًا، لذلك تحدث بهدوء وأوضح موقفه باللطف. قال نور: \"أخي، لم أقصد خطأً في ترتيب القطع، دعينا نبحث معًا عن القطع المفقودة.\" أعطى حور فرصة للتفهم، ولم يغضب أو يرفع صوته. لاحظت حور هدوءه وأسلوبه اللطيف، وبدأت هي أيضًا بالبحث بلا لوم. النتيجة: تعلمت حور درسًا مهمًا: حتى إذا شعرت بالخطأ، يجب الاستماع والتأكد قبل إصدار الاتهام. تعمّق شعور الأخوة بينهما، وأدركا أن الإنصاف والرفق مع الخصم المدعى عليه يزيل الخلاف ويقوي العلاقة."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّادِسَةُ: عَالَمُ الطَّاقَةِ وَالفِيزْيَاءِ",
      "topic": "التَّجْرِبَتَانِ (11 وَ12): بَطَّارِيَّةُ البَطَاطَا — لُعْبَةُ طَبَقَاتِ السَّوَائِلِ",
      "coverImg": "assets/y7/scince/s24.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s24.1.jpg",
          "text": "التَّجْرِبَةُ (11) بَطَّارِيَّةُ البَطَاطَا: نَغْرِسُ مَسَامِيرَ وَمَعَادِنَ (نُحَاسًا وَزِنْكًا) فِي حَبَّتَيْ بَطَاطَا وَنُوَصِّلُ الأَسْلَاكَ وَالمَلَاقِطَ بِمِصْبَاحِ (LED) فِي دَائِرَةٍ مُغْلَقَةٍ، فَتَتَحَوَّلُ الطَّاقَةُ الكِيمْيَائِيَّةُ فِي البَطَاطَا إِلَى طَاقَةٍ كَهْرَبَائِيَّةٍ تُضِيءُ المِصْبَاحَ."
        },
        {
          "img": "assets/y7/scince/s24.2.jpg",
          "text": "التَّجْرِبَةُ (12) لُعْبَةُ طَبَقَاتِ السَّوَائِلِ: نَسْكُبُ سَوَائِلَ مُتَنَوِّعَةً (عَسَلًا، صَابُونًا سَائِلًا، مَاءً مُلَوَّنًا، وَزَيْتًا) فِي كَأْسٍ زُجَاجِيٍّ ثُمَّ نُسْقِطُ أَجْسَامًا صَغِيرَةً (مِسْمَارًا، حَبَّةَ عِنَبٍ، سَدَّادَةَ فِلِّينٍ)، فَتَتَرَتَّبُ السَّوَائِلُ فِي طَبَقَاتٍ حَسَبَ اخْتِلَافِ الكَثَافَةِ (الأَثْقَلُ بِالأَسْفَلِ وَالأَخَفُّ بِالأَعْلَى)."
        }
      ],
      "text": "التَّجْرِبَةُ (11) بَطَّارِيَّةُ البَطَاطَا: نَغْرِسُ مَسَامِيرَ وَمَعَادِنَ (نُحَاسًا وَزِنْكًا) فِي حَبَّتَيْ بَطَاطَا وَنُوَصِّلُ الأَسْلَاكَ وَالمَلَاقِطَ بِمِصْبَاحِ (LED) فِي دَائِرَةٍ مُغْلَقَةٍ، فَتَتَحَوَّلُ الطَّاقَةُ الكِيمْيَائِيَّةُ فِي البَطَاطَا إِلَى طَاقَةٍ كَهْرَبَائِيَّةٍ تُضِيءُ المِصْبَاحَ. التَّجْرِبَةُ (12) لُعْبَةُ طَبَقَاتِ السَّوَائِلِ: نَسْكُبُ سَوَائِلَ مُتَنَوِّعَةً (عَسَلًا، صَابُونًا سَائِلًا، مَاءً مُلَوَّنًا، وَزَيْتًا) فِي كَأْسٍ زُجَاجِيٍّ ثُمَّ نُسْقِطُ أَجْسَامًا صَغِيرَةً (مِسْمَارًا، حَبَّةَ عِنَبٍ، سَدَّادَةَ فِلِّينٍ)، فَتَتَرَتَّبُ السَّوَائِلُ فِي طَبَقَاتٍ حَسَبَ اخْتِلَافِ الكَثَافَةِ (الأَثْقَلُ بِالأَسْفَلِ وَالأَخَفُّ بِالأَعْلَى).",
      "q1": {
        "q": "مَا تَحَوُّلُ الطَّاقَةِ الَّذِي يَحْدُثُ فِي تَجْرِبَةِ بَطَّارِيَّةِ البَطَاطَا لِإِضَاءَةِ مِصْبَاحِ (LED)؟",
        "focusWord": "تَحَوُّلُ المَادَّةِ لِطَاقَةٍ",
        "options": [
          {
            "text": "تَحَوُّلُ الطَّاقَةِ الكِيمْيَائِيَّةِ فِي البَطَاطَا وَالمَعَادِنِ إِلَى طَاقَةٍ كَهْرَبَائِيَّةٍ وَضَوْئِيَّةٍ",
            "correct": true
          },
          {
            "text": "تَحَوُّلُ الضَّوْءِ إِلَى بَطَاطَا",
            "correct": false
          },
          {
            "text": "تَجَمُّدُ المَاءِ بِالثَّلْجِ",
            "correct": false
          },
          {
            "text": "انْكِسَارُ الضَّوْءِ فِي المَوْشُورِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "لِمَاذَا تَتَرَتَّبُ السَّوَائِلُ (العَسَلُ وَالصَّابُونُ وَالمَاءُ وَالزَّيْتُ) فَوْقَ بَعْضِهَا فِي طَبَقَاتٍ دُونَ أَنْ تَخْتَلِطَ؟",
        "focusWord": "اخْتِلَافُ الكَثَافَةِ",
        "options": [
          {
            "text": "بِسَبَبِ اخْتِلَافِ الكَثَافَةِ؛ فَالسَّائِلُ الأَعْلَى كَثَافَةً (الأَثْقَلُ) يَسْتَقِرُّ فِي الأَسْفَلِ",
            "correct": true
          },
          {
            "text": "لِأَنَّ الكَأْسَ مَصْنُوعٌ مِنَ الخَشَبِ",
            "correct": false
          },
          {
            "text": "بِسَبَبِ القُوَّةِ المِغْنَاطِيسِيَّةِ",
            "correct": false
          },
          {
            "text": "بِسَبَبِ تَبَرْعُمِ الخَمِيرَةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "فِي تَجْرِبَةِ طَبَقَاتِ السَّوَائِلِ، أَيْنَ يَسْتَقِرُّ المِسْمَارُ المَعْدِنِيُّ وَأَيْنَ تَطْفُو سَدَّادَةُ الفِلِّينِ؟",
        "focusWord": "الطُّفُوُّ وَالغَرَقُ",
        "options": [
          {
            "text": "يَغُوصُ المِسْمَارُ الأَثْقَلُ إِلَى الأَسْفَلِ فِي العَسَلِ، وَتَطْفُو سَدَّادَةُ الفِلِّينِ الخَفِيفَةُ فِي الأَعْلَى",
            "correct": true
          },
          {
            "text": "يَطْفُو المِسْمَارُ فَوْقَ الزَّيْتِ",
            "correct": false
          },
          {
            "text": "تَغُوصُ الفِلِّينَةُ تَحْتَ العَسَلِ",
            "correct": false
          },
          {
            "text": "يَتَبَخَّرُ المِسْمَارُ فَوْرًا",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "بَطَّارِيَّةُ البَطَاطَا",
          "left": "تَوْلِيدُ كَهْرَبَاءَ تُضِيءُ مِصْبَاحَ LED عَبْرَ دَائِرَةٍ مُغْلَقَةٍ"
        },
        {
          "right": "طَبَقَاتُ السَّوَائِلِ المُلَوَّنَةُ",
          "left": "تَدَرُّجُ السَّوَائِلِ حَسَبَ اخْتِلَافِ الكَثَافَةِ (الأَثْقَلُ بِالأَسْفَلِ)"
        },
        {
          "right": "إِسْقَاطُ الأَجْسَامِ فِي الكَأْسِ",
          "left": "مُشَاهَدَةُ الطُّفُوِّ وَالغَرَقِ حَسَبَ كَثَافَةِ كُلِّ جِسْمٍ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَدَوَاتِ تَجْرِبَتَيِ بَطَّارِيَّةِ البَطَاطَا وَطَبَقَاتِ السَّوَائِلِ:",
        "correct": [
          "بَطَاطَا وَمَسَامِيرُ وَأَسْلَاكٌ",
          "مِصْبَاحُ LED صَغِيرٌ",
          "عَسَلٌ وَصَابُونٌ وَمَاءٌ وَزَيْتٌ",
          "مُقَارَنَةُ الكَثَافَةِ وَالطُّفُوِّ وَالغَرَقِ"
        ],
        "wrong": [
          "لَمْسُ كَهْرَبَاءِ المَنْزِلِ الخطِرَةِ",
          "شُرْبُ سَوَائِلِ التَّجْرِبَةِ الصَّابُونِيَّةِ"
        ]
      },
      "applyStep": "أُنفِّذُ تَجْرِبَةَ طَبَقَاتِ السَّوَائِلِ (العَسَلِ وَالمَاءِ وَالزَّيْتِ) فِي كَأْسٍ شَفَّافٍ لِأُشَاهِدَ اخْتِلَافَ الكَثَافَةِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt24.jpg",
      "title": "الدَّرْسُ (12): مَسَارُ التَّحَمُّلِ وَالصَّفَاءِ — رُوتِينٌ تَدْرِيبِيٌّ مُتَكَامِلٌ فِي 30 دَقِيقَةً",
      "subtitle": "الفَحْصُ البَصَرِيُّ، تَمَدُّدُ الوَرِكِ، الجُلُوسُ عَلَى الحَائِطِ، رَمْيُ الكُرَةِ، وَوَضْعِيَّةُ السَّعَادَةِ",
      "slideText": "🏔️ الدَّرْسُ (12) مَسَارُ التَّحَمُّلِ وَالصَّفَاءِ (رُوتِينٌ مُتَكَامِلٌ فِي 30 دَقِيقَةً): (1) الوَعْيُ (دَقِيقَتَانِ): الفَحْصُ البَصَرِيُّ الهَادِئُ مَعَ الجُلُوسِ المُسْتَقِيمِ. (2) الاسْتِطَالَةُ (دَقِيقَتَانِ): تَمَدُّدُ الوَرِكِ أَثْنَاءَ الجُلُوسِ. (3) النُّمُوُّ العَضَلِيُّ (30-60 ثَانِيَةً): الجُلُوسُ عَلَى الحَائِطِ (Wall Sit) لِقُوَّةِ السَّاقَيْنِ وَالتَّحَمُّلِ. (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَةٌ وَنِصْفٌ): رَمْيُ الكُرَةِ وَالتِقَاطُهَا بِتَرْكِيزٍ. (5) التَّدَفُّقُ (يُؤَدَّى أَخِيرًا فَقَطْ — دَقِيقَةٌ وَاحِدَةٌ): وَضْعِيَّةُ السَّعَادَةِ وَالاسْتِرْخَاءِ التَّامِّ عَلَى الظَّهْرِ.",
      "q1": {
        "q": "مَا التَّمْرِينُ الَّذِي يَبْنِي قُوَّةَ التَّحَمُّلِ فِي عَضَلَاتِ السَّاقَيْنِ ضِمْنَ (الدَّرْسِ الثَّانِيَ عَشَرَ: مَسَارِ التَّحَمُّلِ وَالصَّفَاءِ)؟",
        "focusWord": "الجُلُوسُ عَلَى الحَائِطِ",
        "options": [
          {
            "text": "تَمْرِينُ الجُلُوسِ عَلَى الحَائِطِ (Wall Sit) لِمُدَّةِ 30 إِلَى 60 ثَانِيَةً",
            "correct": true
          },
          {
            "text": "النَّوْمُ عَلَى السَّرِيرِ",
            "correct": false
          },
          {
            "text": "تَحْرِيكُ الأَصَابِعِ فَقَطْ",
            "correct": false
          },
          {
            "text": "شُرْبُ المَاءِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا تَمْرِينُ الوَعْيِ وَتَمْرِينُ الاسْتِطَالَةِ فِي مَسَارِ التَّحَمُّلِ وَالصَّفَاءِ؟",
        "focusWord": "الفَحْصُ البَصَرِيُّ وَتَمَدُّدُ الوَرِكِ",
        "options": [
          {
            "text": "الفَحْصُ البَصَرِيُّ (دَقِيقَتَانِ)، وَتَمَدُّدُ الوَرِكِ أَثْنَاءَ الجُلُوسِ (دَقِيقَتَانِ)",
            "correct": true
          },
          {
            "text": "الرَّكْضُ السَّرِيعُ",
            "correct": false
          },
          {
            "text": "القَفْزُ عَلَى الحَبْلِ",
            "correct": false
          },
          {
            "text": "التَّدَحْرُجُ الأُسْطُوَانِيُّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِمَاذَا نَخْتَتِمُ مَسَارَ التَّحَمُّلِ وَالصَّفَاءِ فِي فَقْرَةِ (التَّدَفُّقِ)؟",
        "focusWord": "وَضْعِيَّةُ السَّعَادَةِ",
        "options": [
          {
            "text": "وَضْعِيَّةُ السَّعَادَةِ (الاسْتِلْقَاءُ الهَادِئُ عَلَى الظَّهْرِ لِمُدَّةِ دَقِيقَةٍ وَاحِدَةٍ)",
            "correct": true
          },
          {
            "text": "القَفْزُ العَالِي",
            "correct": false
          },
          {
            "text": "تَمْرِينُ الضَّغْطِ",
            "correct": false
          },
          {
            "text": "الجَرْيُ فِي المَكَانِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ (الدَّرْسُ 12)",
          "left": "الفَحْصُ البَصَرِيُّ + تَمَدُّدُ الوَرِكِ أَثْنَاءَ الجُلُوسِ"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ وَالتَّحَمُّلُ",
          "left": "الجُلُوسُ عَلَى الحَائِطِ (30-60 ثَانِيَةً)"
        },
        {
          "right": "الاسْتِجَابَةُ وَالتَّدَفُّقُ",
          "left": "رَمْيُ الكُرَةِ ثُمَّ وَضْعِيَّةُ السَّعَادَةِ وَالاسْتِرْخَاءِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ الثَّانِيَ عَشَرَ (مَسَارِ التَّحَمُّلِ وَالصَّفَاءِ):",
        "correct": [
          "الفَحْصُ البَصَرِيُّ (دَقِيقَتَانِ)",
          "تَمَدُّدُ الوَرِكِ (دَقِيقَتَانِ)",
          "الجُلُوسُ عَلَى الحَائِطِ (30-60 ثَانِيَةً)",
          "رَمْيُ الكُرَةِ وَوَضْعِيَّةُ السَّعَادَةِ"
        ],
        "wrong": [
          "الاسْتِسْلَامُ السَّرِيعُ أَثْنَاءَ التَّمْرِينِ",
          "إِيذَاءُ الظَّهْرِ"
        ]
      },
      "applyStep": "أُدَرِّبُ عَضَلَاتِي عَلَى قُوَّةِ التَّحَمُّلِ بِتَمْرِينِ الجُلُوسِ عَلَى الحَائِطِ (30 ثَانِيَةً) ثُمَّ أَسْتَرْخِي فِي وَضْعِيَّةِ السَّعَادَةِ."
    }
  },
  {
    "w": 25,
    "secNum": 7,
    "heavenName": "سَمَاءُ الجُمُعَةِ السَّابِعَةُ (ذ ض ظ غ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّابِعَةُ: الكِيمْيَاءُ وَالمَادَّةُ وَالمَحَالِيلُ وَالكِيمْيَاءُ الحَيَوِيَّةُ",
    "natureLabel": "طَاقَةُ النَّارِ (الحَمِيَّةُ فِي الحَقِّ وَإِطْفَاءُ الغَضَبِ وَالحَسَدِ)",
    "ltr": "ذ",
    "jummal": 700,
    "prophet": "ذُو الكِفْلِ (ع)",
    "virtue": "الوَفَاءُ",
    "unitHeader": "الوَحْدَةُ الخَامِسَةُ وَالعِشْرُونَ الكَامِلَةُ: نَبِيُّ اللهِ ذُو الكِفْلِ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "تَكَفَّلَ نَبِيُّ اللهِ ذُو الكِفْلِ (ع) بِالقَضَاءِ بَيْنَ النَّاسِ بِالعَدْلِ وَالصَّبْرِ وَالوَفَاءِ بِالعَهْدِ دُونَ غَضَبٍ، فَأَثْنَى اللهُ عَلَيْهِ فِي الصَّابِرِينَ الأَخْيَارْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (إِخْمَادُ نَارِ الغَضَبِ وَدَفْعُ إِبْلِيسَ النَّارِيِّ): تَكَفُّلُ ذِي الكِفْلِ بِعَدَمِ الغَضَبِ، وَمُحَاوَلَةُ إِبْلِيسَ وَجُنُودِهِ («الأَبْيَضِ») إِشْعَالَ نَارِ الغَضَبِ فِي صَدْرِهِ بِإِيقَاظِهِ وَقْتَ القَيْلُولَةِ وَالحَرِّ ثَلَاثَةَ أَيَّامٍ مُتَتَالِيَةٍ، فَدَفَعَ ذُو الكِفْلِ نَارَ الشَّيْطَانِ بِنُورِ الحِلْمِ وَالعَزْمِ. B. الرِّيحُ (وَسْوَسَةُ الوَهْمِ مُقَابِلَ نَفَسِ الذِّكْرِ): رِيحُ الوَهْمِ وَالحِيلَةِ الكَاذِبَةِ الَّتِي تَمَثَّلَ بِهَا إِبْلِيسُ فِي صُورَةِ شَيْخٍ مَظْلُومٍ يَشْكُو ظُلْمَ قَوْمِهِ ثُمَّ يَهْرَبُ مِنْ مَجْلِسِ القَضَاءِ؛ وَفِي مُقَابِلِهَا أَنْفَاسُ الذِّكْرِ وَالتَّسْبِيحِ الَّتِي كَانَ ذُو الكِفْلِ يُحْيِي بِهَا لَيْلَهُ قَائِمًا. C. التُّرَابُ (العَقْلُ وَالحِكْمَةُ وَالخَاتَمُ المَنْقُوشُ): حِكْمَةُ ذِي الكِفْلِ العَقْلِيَّةُ حِينَ أَعْطَى «خَاتَمَهُ» المَعْدِنِيَّ لِلْمُشْتَكِي لِيَكُونَ حُجَّةً وَبُرْهَانًا، ثُمَّ ذَهَابُهُ بِنَفْسِهِ إِلَى بَيْتِهِ وَتَسَوُّرُ إِبْلِيسَ لِلسَّقْفِ وَالجِدَارِ، وَثَبَاتُ ذِي الكِفْلِ كَالجَبَلِ الرَّاسِخِ فِي مَجْلِسِ العَدْلِ. D. المَاءُ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ الشَّهْوَةِ): تَهْذِيبُ شَهْوَةِ الطَّعَامِ وَالشَّرَابِ بِصِيَامِ النَّهَارِ دَائِمًا، وَتَوَاضُعُهُ التَّامُّ حِينَ أَمْسَكَ بِيَدِ الشَّيْخِ الشَّاكِي وَسَارَ مَعَهُ فِي حَرِّ الظَّهِيرَةِ لِيَنْصُرَهُ، وَإِدْخَالُ اللهِ لَهُ فِي مَاءِ رَحْمَتِهِ الوَاسِعَةِ: ﴿وَأَدْخَلْنَاهُمْ فِي رَحْمَتِنَا﴾.",
    "storyParagraphs": [
      "فِي مَطْلَعِ فَلَكِ يَوْمِ الجُمُعَةِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ خَمْسَةٌ وَعِشْرُونَ فِي مَنْزِلَةِ النَّارِ الدَّافِعَةِ الَّتِي تَدْفَعُ نَارَ الغَضَبِ وَتَهْزِمُ الشَّيْطَانَ بِنُورِ الحِلْمِ وَالصَّبْرِ العَظِيمْ، وَهُوَ العَبْدُ الصَّالِحُ نَبِيُّ اللهِ ذُو الكِفْلِ عَلَيْهِ السَّلَامْ. وَقَدْ أَمرَ اللهُ بِذِكْرِهِ وَالثَّنَاءِ عَلَيْهِ فِي القُرْآنِ الكَرِيمِ مَعَ الأَنْبِيَاءِ الصَّابِرِينَ الأَخْيَارِ فَقَالَ تَعَالَى وَاذْكُرْ إِسْمَاعِيلَ وَاليَسَعَ وَذَا الكِفْلِ وَكُلٌّ مِنَ الأَخْيَارِ، وَقَالَ وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الكِفْلِ كُلٌّ مِنَ الصَّابِرِينَ وَأَدْخَلْنَاهُمْ فِي رَحْمَتِنَا إِنَّهُمْ مِنَ الصَّالِحِينْ.",
      "كَمَا رَوَى الإِمَامُ البَاقِرُ وَالإِمَامُ الصَّادِقُ عَلَيْهِمَا السَّلَامُ، كَانَ نَبِيُّ اللهِ اليَسَعُ قَدْ كَبِرَ سِنُّهُ فِي بَنِي إِسْرَائِيلَ فَجَمَعَ أَصْحَابَهُ وَقَالَ مَنْ يَتَكَفَّلُ لِي بِثَلَاثِ خِصَالٍ أَسْتَخْلِفْهُ مِنْ بَعْدِي؛ أَنْ يَصُومَ النَّهَارَ، وَيَقُومَ اللَّيْلَ، وَلَا يَغْضَبَ إِذَا جَلَسَ لِلْقَضَاءِ بَيْنَ النَّاسْ؟ فَسَكَتَ القَوْمُ لِصُعُوبَةِ هٰذَا الشَّرْطِ، فَقَامَ شَابٌّ مُؤْمِنٌ صَادِقٌ هُوَ عُوَيْدِيَا وَقَالَ أَنَا أَتَكَفَّلُ لَكَ بِذٰلِكَ يَا نَبِيَّ اللهْ! فَأَعَادَ اليَسَعُ السُّؤَالَ ثَلَاثَ مَرَّاتٍ وَفِي كُلِّ مَرَّةٍ يَقُومُ ذٰلِكَ الشَّابُّ الشُّجَاعُ وَيَتَكَفَّلُ بِهَا، فَاسْتَخْلَفَهُ اليَسَعُ وَسَلَّمَهُ مَوَارِيثَ النُّبُوَّةِ وَسُمِّيَ ذَا الكِفْلِ لِأَنَّهُ تَكَفَّلَ بِتِلْكَ الخِصَالِ الثَّلَاثِ فَوَفَى بِهَا أَتَمَّ الوَفَاءْ، كَمَا كَفَلَ مِائَةَ نَبِيٍّ مِنْ أَنْبِيَاءِ اللهِ وَأَخْفَاهُمْ عَنْ بَطْشِ المُلُوكِ الظَّالِمِينَ وَعَالَهُمْ بِالطَّعَامِ الطَّيِّبِ وَالمَاءِ حَتَّى نَجَوْا مِنْ كُلِّ أَذًى وَسُوءْ.",
      "كَانَ ذُو الكِفْلِ يَصُومُ النَّهَارَ كُلَّهُ وَيَقُومُ اللَّيْلَ كُلَّهُ يُصَلِّي وَيَذْكُرُ رَبَّهُ، وَلَا يَنَامُ إِلَّا سَاعَةً وَاحِدَةً فِي وَسَطِ النَّهَارِ عِنْدَ القَيْلُولَةِ لِيَسْتَرِيحَ جَسَدُهْ. فاغْتَاظَ إِبْلِيسُ اللَّعِينُ مِنْ صَبْرِهِ وَحِلْمِهِ وَجَمَعَ جُنُودَهُ مِنَ الشَّيَاطِينِ وَقَالَ مَنْ لِي بِذِي الكِفْلِ يُوقِعُهُ فِي الغَضَبْ؟ فَقَامَ عِفْرِيتٌ مِنْهُمُ اسْمُهُ الأَبْيَضُ وَقَالَ أَنَا أَكْفِيكَهْ! فَـذَهَبَ الشَّيْطَانُ فِي صُورَةِ شَيْخٍ كَبِيرٍ وَانْتَظَرَ حَتَّى حَانَ وَقْتُ الظَّهِيرَةِ وَأَغْلَقَ ذُو الكِفْلِ بَابَهُ لِيَنَامَ سَاعَتَهُ الوَحِيدَةَ، فَجَاءَ وَطَرَقَ البَابَ بِقُوَّةٍ وَصَاحَ أَنَا رَجُلٌ مَظْلُومٌ، فَذَكَرَ لَهُ أَنَّ قَوْمَهُ ظَلَمُوهُ وَأَخَذُوا حَقَّهْ! فَفَتَحَ لَهُ ذُو الكِفْلِ بِحِلْمٍ وَهُدُوءٍ دُونَ أَنْ يَغْضَبَ، وَقَالَ لَهُ رُحْ إِلَى مَجْلِسِ القَضَاءِ فَإِذَا جَلَسْتُ أَخَذْتُ لَكَ بِحَقِّكَ. فَذَهَبَ وَفَاتَتْ نَبِيَّ اللهِ نَوْمَتُهُ، وَلَمَّا جَلَسَ فِي المَسْجِدِ يَنْتَظِرُ الشَّيْخَ لَمْ يَأْتِ!",
      "وَفِي اليَوْمِ الثَّانِي قَامَ ذُو الكِفْلِ اللَّيْلَ كُلَّهُ وَصَامَ النَّهَارَ، فَلَمَّا وَضَعَ رَأْسَهُ وَقْتَ القَيْلُولَةِ وَقَدْ غَلَبَهُ النُّعَاسُ عَادَ الشَّيْخُ نَفْسُهُ يَدُقُّ البَابَ بِشِدَّةٍ وَيَصِيحُ إِنَّ قَوْمِي ظَلَمُونِي! فَفَتَحَ لَهُ ذُو الكِفْلِ بِابْتِسَامَةٍ وَصَبْرٍ وَلَمْ يَغْضَبْ، وَأَعْطَاهُ خَاتَمَهُ الشَّرِيفَ وَقَالَ خُذْ هٰذَا الخَاتَمَ وَائْتِ بِهِ قَوْمَكَ فَإِنَّهُمْ إِذَا رَأَوْا خَاتَمِي أَطَاعُوا وَحَضَرُوا مَعَكَ إِلَى مَجْلِسِ العَدْلْ. فَـأَخَذَ الشَّيْخُ الخَاتَمَ وَمَضَى، وَضَاعَتْ قَيْلُولَةُ نَبِيِّ اللهِ لِليَوْمِ الثَّانِي، وَلَمَّا جَلَسَ لِلْقَضَاءِ لَمْ يَحْضُرِ الشَّيْخُ!",
      "وَفِي اليَوْمِ الثَّالِثِ اشْتَدَّ التَّعَبُ وَالسَّهَرُ عَلَى نَبِيِّ اللهِ ذِي الكِفْلِ، فَأَمَرَ أَهْلَهُ وَحُرَّاسَ البَابِ أَلَّا يَدَعُوا أَحَدًا يَقْرَبُ بَابَهُ فِي تِلْكَ السَّاعَةِ لِيَنَامَ قَلِيلًا. فَجَاءَ الشَّيْطَانُ فَمَنَعَهُ الحُرَّاسُ، فَتَسَوَّرَ الحَائِطَ وَنَزَلَ مِنْ كُوَّةِ السَّقْفِ إِلَى دَاخِلِ البَيْتِ وَأَيْقَظَ ذَا الكِفْلِ مِنْ نَوْمِهِ! فَنَظَرَ ذُو الكِفْلِ بِعَقْلِهِ إِلَى البَابِ المَقْفَلِ وَعَرَفَ أَنَّهُ الشَّيْطَانُ فَقَالَ لَهُ أَعَدُوَّ اللهِ أَنْتَ؟ قَالَ نَعَمْ، أَعْيَيْتَنِي فِي كُلِّ شَيْءٍ فَأَرَدْتُ أَنْ أُغْضِبَكَ فَعَجَزْتُ عَنْكَ! فَلَمْ يَغْضَبْ ذُو الكِفْلِ بَلِ اسْتَعَاذَ بِاللهِ الَّذِي أَذَلَّ الشَّيْطَانَ وَيُذِلُّ كَيْدَ المَاكِرِينْ، وَكَذَّبَ وَسْوَسَتَهُ كَمَا يُكَذِّبُ المُؤْمِنُ الكَيِّسُ أَوْهَامَ البَاطِلْ.",
      "أَحَبَّ اللهُ صَبْرَ عَبْدِهِ ذِي الكِفْلِ وَثَبَّتَهُ، وَبَقِيَ ذُو الكِفْلِ يَحْكُمُ بَيْنَ النَّاسِ بِالعَدْلِ وَيُطْعِمُ الجِيَاعَ طَعَامًا طَيِّبًا حَلَالًا هُوَ لِلآكِلِينَ لَذِيذٌ هَنِيءٌ، وَيَدْعُوهُمْ إِلَى الإِخْلَاصِ لِلهِ فَلَا يَشُذُّ أَحَدٌ عَنْ طَرِيقِ الحَقِّ، بَلْ يَكونُ كُلُّ مُؤْمِنٍ هُوَ بِحَبْلِ اللهِ آخِذٌ مَاسِكٌ يَتَعَلَّمُ مِنْ ذِكْرِ الأَنْبِيَاءِ وَسِيرَةِ الكَفِيلِ الحَلِيمِ، وَيَقُولُ عِنْدَ نُزُولِ السَّكِينَةِ فِي قَلْبِهِ هٰذَا النُّورُ الإِلٰهِيُّ قَدْ نَفَذَ إِلَى الرُّوحِ فَصَارَ القَلْبُ بِطَاعَةِ اللهِ فَرِحًا مُلْتَذّْ."
    ],
    "words": [
      {
        "word": "يَذْكُرُ",
        "desc": "وسط متصل / ساكن: ـذْ",
        "raw": "يَذْكُرُ (وسط متصل / ساكن: ـذْ)"
      },
      {
        "word": "خُذْ",
        "desc": "آخر متصل / ساكن: ـذْ",
        "raw": "خُذْ (آخر متصل / ساكن: ـذْ)"
      },
      {
        "word": "ذَهَبَ",
        "desc": "أول منفصل / متحرك بالفتح: ذَ",
        "raw": "ذَهَبَ (أول منفصل / متحرك بالفتح: ذَ)"
      },
      {
        "word": "فَذَكَرَ",
        "desc": "أول متصل / متحرك بالفتح: ـذَ",
        "raw": "فَذَكَرَ (أول متصل / متحرك بالفتح: ـذَ)"
      },
      {
        "word": "أَذًى",
        "desc": "وسط منفصل / متحرك بالفتح: ذَ",
        "raw": "أَذًى (وسط منفصل / متحرك بالفتح: ذَ)"
      },
      {
        "word": "عَذَابَ",
        "desc": "وسط متصل أو منفصل / متحرك بالفتح: ـذَ / ذَ",
        "raw": "عَذَابَ (وسط متصل أو منفصل / متحرك بالفتح: ـذَ / ذَ)"
      },
      {
        "word": "أَخَذَ",
        "desc": "آخر متصل / متحرك بالفتح: ـذَ",
        "raw": "أَخَذَ (آخر متصل / متحرك بالفتح: ـذَ)"
      },
      {
        "word": "ذُرِّيَّةِ",
        "desc": "أول منفصل / متحرك بالضم: ذُ",
        "raw": "ذُرِّيَّةِ (أول منفصل / متحرك بالضم: ذُ)"
      },
      {
        "word": "لَذِيذٌ",
        "desc": "آخر متصل / متحرك بالضم: ـذٌ",
        "raw": "لَذِيذٌ (آخر متصل / متحرك بالضم: ـذٌ)"
      },
      {
        "word": "ذِكْرِ",
        "desc": "أول منفصل / متحرك بالكسر: ذِ",
        "raw": "ذِكْرِ (أول منفصل / متحرك بالكسر: ذِ)"
      },
      {
        "word": "كَذَّبَ",
        "desc": "وسط متصل / مضعف بالفتح: ـذَّ",
        "raw": "كَذَّبَ (وسط متصل / مضعف بالفتح: ـذَّ)"
      },
      {
        "word": "يَشُذُّ",
        "desc": "آخر متصل / مضعف بالضم: ـذُّ",
        "raw": "يَشُذُّ (آخر متصل / مضعف بالضم: ـذُّ)"
      },
      {
        "word": "يُكَذِّبُ",
        "desc": "وسط متصل / مضعف بالكسر: ـذِّ",
        "raw": "يُكَذِّبُ (وسط متصل / مضعف بالكسر: ـذِّ)"
      },
      {
        "word": "ذَا",
        "desc": "أول منفصل / ممدود بالألف: ذَا",
        "raw": "ذَا (أول منفصل / ممدود بالألف: ذَا)"
      },
      {
        "word": "ذُو",
        "desc": "أول منفصل / ممدود بالواو: ذُو",
        "raw": "ذُو (أول منفصل / ممدود بالواو: ذُو)"
      },
      {
        "word": "لَذِيذٌ",
        "desc": "وسط متصل / ممدود بالياء: ـذِي",
        "raw": "لَذِيذٌ (وسط متصل / ممدود بالياء: ـذِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الذَّالِ (ذ): النُّطْقُ السَّلِيمُ لِحَرْفِ الذَّالِ اللِّثَوِيِّ المَجْهُورِ الرِّخْوِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا العُلْيَا، وَالتَّمْيِيزُ الصَّوْتِيُّ الدَّقِيقُ بَيْنَهُ وَبَيْنَ الزَّايِ وَالظَّاءِ وَالثَّاءِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الاستِعَاذَةِ بِاللهِ عِنْدَ الغَضَبِ: ﴿وَإِمَّا يَنزَغَنَّكَ مِنَ الشَّيْطَانِ نَزْغٌ فَاسْتَعِذْ بِاللَّهِ﴾، وَالوَفَاءِ بِالعَهْدِ وَالكَفَالَةِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الزَّاوِيَةُ المُنْحَنِيَةُ المُسْتَقِرَّةُ عَلَى السَّطْرِ وَالنُّقْطَةُ العُلْيَا وَالرَّقْمُ (25): مُشَاهَدَةُ شَكْلِ حَرْفِ الذَّالِ (ذ / ـذ) الَّذِي يَسْتَقِرُّ عَلَى السَّطْرِ بثَبَاتٍ (تَمْيِيزًا لَهُ عَنِ الزَّايِ النَّازِلَةِ تَحْتَ السَّطْرِ) وَفَوْقَهُ نُقْطَةٌ مُنِيرَةٌ (وَهُوَ مِنَ الحُرُوفِ السِّتَّةِ الَّتِي تَتَّصِلُ بِمَا قَبْلَهَا وَلَا تَتَّصِلُ بِمَا بَعْدَهَا)، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (25) (مُرَبَّعِ الخَمْسَةِ الكَامِلِ: 5 × 5 = 25، وَهُوَ عَدَدُ الأَنْبِيَاءِ المَذْكُورِينَ تَفْصِيلًا فِي القُرْآنِ الكَرِيمِ)."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ ذِي الكِفْلِ الكَامِلَةِ وَصَبْرِ الحَلِيمِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ ذِي الكِفْلِ فِي القُرْآنِ الكَرِيمِ وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ شَكْوَى المَظْلُومِ بِهُدُوءٍ وَسَعَةِ صَدْرٍ حَتَّى فِي أَوْقَاتِ التَّعَبِ وَالرَّاحَةِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ خَمْسَةٌ وَعِشْرُونَ (25) وَالسَّبْعُمِائَةٍ (700): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (25) وَمَعْرِفَةِ قِيمَةِ الذَّالِ المِئَوِيَّةِ (ذ = 700 = سَبْعُ مِئَاتٍ كَامِلَةٍ، كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِائَةُ حَبَّةٍ)، وَإِدْرَاكِ أَعْدَادِ القِصَّةِ (الكَفَالَاتِ الثَّلَاثِ، وَالأَيَّامِ الثَّلَاثَةِ، وَالمِائَةِ نَبِيٍّ الَّذِينَ كَفَلَهُمْ وَحَمَاهُمْ)، وَتَدْرِيبُ اليَدِ عَلَى الإِمْسَاكِ بِيَدِ الضَّعِيفِ لإِعَانَتِهِ، وَإِغْلَاقِ الأَبْوَابِ بِإِحْكَامٍ عِنْدَ النَّوْمِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ قِيَامِ اللَّيْلِ وَالمَشْيِ فِي قَضَاءِ الحَوَائِجِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى قُوَّةِ القِيَامِ فِي الصَّلَاةِ، وَرِيَاضَةِ المَشْيِ النَّشِيطِ فِي قَضَاءِ حَوَائِجِ النَّاسِ دُونَ كَسَلٍ أَوْ تَذَمُّرٍ (كَمَا مَشَى ذُو الكِفْلِ مَعَ الشَّاكِي فِي الظَّهِيرَةِ)، مَعَ مَعْرِفَةِ فَائِدَةِ «القَيْلُولَةِ» القصِيرَةِ فِي إِرَاحَةِ القَدَمَيْنِ وَالجَسَدِ لِمُوَاصَلَةِ العَمَلِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الصِّيَامِ الصِّحِّيِّ وَتَنْظِيمِ النَّوْمِ وَالطَّعَامِ النَّافِعِ: تَعَلُّمُ فَوَائِدِ الصِّيَامِ فِي تَصْفِيَةِ الذِّهْنِ وَتَهْدِئَةِ الأَعْصَابِ وَمَنْعِ الغَضَبِ، وَأَهَمِّيَّةِ القَيْلُولَةِ النَّهَارِيَّةِ لِعَوْنِ البَدَنِ عَلَى قِيَامِ اللَّيْلِ، وَتَذَوُّقِ الغِذَاءِ الطَّيِّبِ الحَلَالِ عِنْدَ الإِفْطَارِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الحِلْمِ وَكَظْمِ الغَيْظِ وَالاسْتِئْذَانِ عِنْدَ البُيُوتِ: تَعَلُّمُ خُلُقِ الحِلْمِ العَظِيمِ فَلَا يَغْضَبُ الطِّفْلُ وَلَا يَصْرُخُ إِذَا أَيْقَظَهُ أَحَدٌ أَوْ أَزْعَجَهُ، وَمَعْرِفَةِ أَدَبِ الاسْتِئْذَانِ وَعَدَمِ إِزْعَاجِ النَّائِمِينَ وَقْتَ الرَّاحَةِ وَالقَيْلُولَةِ (﴿ثَلَاثُ عَوْرَاتٍ لَّكُمْ﴾)."
      }
    },
    "grammar": {
      "topic": "أَسْمَاءُ الإِشَارَةِ فِي بِدَايَةِ الجُمْلَةِ: (هٰذَا، هٰذِهِ، هٰؤُلَاءِ)",
      "rule": "نُشِيرُ بـ (هٰذَا) لِلمُفْرَدِ المُذَكَّرِ، وَبـ (هٰذِهِ) لِلمُفْرَدَةِ المُؤَنَّثَةِ، وَبـ (هٰؤُلَاءِ) لِجَمْعِ العُقَلَاءِ، وَيَأْتِي الخَبَرُ بَعْدَهَا مَرْفُوعًا بِالضَّمَّةْ.",
      "example": "هٰذَا ذَهَبٌ لَامِعٌ — هٰذِهِ ذُرَةٌ نَاضِجَةٌ.",
      "focusWord": "هٰذَا / هٰذِهِ",
      "q": "اخْتَرِ اسْمَ الإِشَارَةِ المُنَاسِبَ لِلجُمْلَةِ: «... شَجَرَةٌ مُثْمِرَةٌ»:",
      "opts": [
        "هٰذِهِ",
        "هٰذَا",
        "هُوَ",
        "مِنْ"
      ]
    },
    "earIirab": {
      "topic": "رَفْعُ الاِسْمِ بَعْدَ اسْمِ الإِشَارَةِ بِالضَّمَّةِ (ـٌ)",
      "rule": "عِنْدَمَا نَقُولُ (هٰذَا كِتَابٌ) نَسْمَعُ تَنْوِينَ الضَّمِّ (ـٌ) عَلَى الخَبَرِ المَرْفُوعْ.",
      "sentence": "هٰذَا تِلْمِيذٌ ذَكِيٌّ.",
      "targetWord": "تِلْمِيذٌ",
      "caseAns": "خَبَرٌ مَرْفُوعٌ بِالضَّمَّةِ (ـٌ)"
    },
    "math": {
      "numVal": 75,
      "numName": "خَمْسَةٌ وَسَبْعُونَ",
      "eqDisplay": "5 + 70 = 75",
      "subDisplay": "75 - 5 = 70",
      "compDisplay": "75 > 57",
      "q1": {
        "stem": "احْسِبْ تَرْكِيبَ العَدَدِ:",
        "focus": "5 + 70 = ؟",
        "ans": "75 (خَمْسَةٌ وَسَبْعُونَ)",
        "wrong": [
          "57",
          "70",
          "85"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ الجَمْعِ:",
        "focus": "50 + 25 = ؟",
        "ans": "75 (خَمْسَةٌ وَسَبْعُونَ)",
        "wrong": [
          "65",
          "80",
          "100"
        ]
      }
    },
    "sport": {
      "title": "مَرَانَةُ المِعْصَمَيْنِ وَالكَاحِلَيْنِ الدَّائِرِيَّةُ",
      "middleText": "أُدِيرُ مِعْصَمَيَّ وَكَاحِلَيَّ فِي دَوَائِرَ نَاعِمَةٍ بِالاتِّجَاهَيْنِ مَعَ التَّنَفُّسِ المُنْتَظَمْ. يُلَيِّنُ هٰذَا التَّمْرِينُ المَفَاصِلَ الطَّرَفِيَّةَ وَيَحْمِي اليَدَيْنِ وَالقَدَمَيْنِ مِنَ الإِجْهَادْ."
    },
    "sci": {
      "title": "حَالَاتُ المَادَّةِ الثَّلَاثُ وَعَنَاصِرُ الطَّبِيعَةِ",
      "summaryThird": "تُوجَدُ المَادَّةُ مِنْ حَوْلِنَا فِي 3 حَالَاتٍ: صُلْبَةٌ ثَابِتَةُ الشَّكْلِ كَالثَّلْجِ وَالحَدِيدِ، وَسَائِلَةٌ تَأْخُذُ شَكْلَ الإِنَاءِ كَالمَاءِ، وَغَازِيَّةٌ تَنْتَشِرُ فِي المَكَانِ كَالهَوَاءِ وَالبُخَارْ.",
      "focusConcept": "حَالَاتُ المَادَّةِ (صُلْبَةٌ، سَائِلَةٌ، غَازِيَّةٌ)",
      "factAns": "تَحَوُّلُ المَاءِ بَيْنَ الثَّلْجِ وَالسَّائِلِ وَالبُخَارِ بِالحَرَارَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الأَخِ وَالأُخْتِ (حُور وَسُرُور - 25)",
      "storySentence": "تَعَاوَنَ سُرُورٌ مَعَ أُخْتِهِ حُورَ فِي تَرْتِيبِ المَكْتَبَةِ، وَتَعَلَّمَا أَنَّ الأَخَ وَالأُخْتَ هُمَا السَّنَدُ وَالعِزُّ، وَحَقُّهُمَا المَحَبَّةُ وَالمُشَارَكَةُ وَالتَّسَامُحْ.",
      "applyAction": "أُحِبُّ إِخْوَتِي وَأُعَاوِنُهُمْ وَأَفْرَحُ لِنَجَاحِهِمْ."
    },
    "rightsFullTitle": "(39) حق المستشير + (40) حق المشير",
    "rightsQuote": "وَأمّــــــــــــا حَقُّ المُسْتَشِيرِ، فَإنْ حَضَرَكَ لَهُ وَجْهُ رَأْى جَهَدْتَ لَهُ فِي النَّصِيحَـــــــــةِ، وَأَشَرْتَ عَلَيهِ بمَا تَعْلَمُ أَنَّكَ لَوْ كُنْتَ مَكَانهُ عَمِلْتَ بهِ، وَذَلِكَ لِيَكُنْ مِنْكَ فِي رَحْمَة وَلِين، فَإنَّ اللِّينَ يُؤْنِسُ الْوَحْشَةَ وَإنَّ الْغِلْظَ يُوحِشُ مَوضِعَ الأنْسِ. وَإنْ لَمْ يَحْضُرْكَ لَهُ رَأيٌ وَعَرَفْتَ لَهُ مَنْ تثِقُ برَأيِهِ وَترْضَى بهِ لِنَفْسِكَ دَلَلْتَهُ عَلَيْهِ وَأَرْشَدتَهُ إلَيْهِ، فَكُنْتَ لَمْ تَـــــــــــــألُهُ خَيرًا  وَلَمْ تَدَّخِرْهُ نُصْحاً. ولا حَوْلَ ولا قُوَّةَ إلا باللهِ. | وَأمّـــــــــا حَقُّ المُشِيرِ عَلَيْكَ فَلا تتَّهِمْهُ فِيمَا لا يُوافِقُكَ عَلَيهِ مِنْ رَأْيِهِ إذا أَشَــــــارَ عَلَيْكَ فَإنَّمَا هِيَ الآرَاءُ وَتصَرُّفُ النَّــــاسِ فِيهَــــــا وَاختِلافُهُمْ. فَكُنْ عَلَيهِ فِي رَأيِهِ بالخِيَارِ إذا اتَّهمْتَ رَأْيَهُ، فَأَمّا تُهْمتُهُ فَلا تَجُوزُ لَكَ إذَا كَانَ عِنْدكَ مِمَّنْ يَسْتَحِقُّ الْمُشَاوَرَةَ . وَلا تَدَعْ شُكْرَهُ عَلَى مَـا بَدَا لَكَ مِن إشْــــــــخاصِ رَأْيِهِ وَحُسْنِ وَجْهِ مَشُورَتِهِ، فَإذا وَافَقَكَ حَمِدتَ اللَّهَ وَقَبلْتَ ذلِكَ مِن أَخِيكَ بالشُّــــــــــــــــــــــــكْرِ والإرْصَادِ بالْمُكَافَأَةِ فِي مِثلِهَـــــا إنْ فَزِعَ إلَيْكَ.  وَلا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (39) حق المستشير + (40) حق المشير",
        "text": "وَأمّــــــــــــا حَقُّ المُسْتَشِيرِ، فَإنْ حَضَرَكَ لَهُ وَجْهُ رَأْى جَهَدْتَ لَهُ فِي النَّصِيحَـــــــــةِ، وَأَشَرْتَ عَلَيهِ بمَا تَعْلَمُ أَنَّكَ لَوْ كُنْتَ مَكَانهُ عَمِلْتَ بهِ، وَذَلِكَ لِيَكُنْ مِنْكَ فِي رَحْمَة وَلِين، فَإنَّ اللِّينَ يُؤْنِسُ الْوَحْشَةَ وَإنَّ الْغِلْظَ يُوحِشُ مَوضِعَ الأنْسِ. وَإنْ لَمْ يَحْضُرْكَ لَهُ رَأيٌ وَعَرَفْتَ لَهُ مَنْ تثِقُ برَأيِهِ وَترْضَى بهِ لِنَفْسِكَ دَلَلْتَهُ عَلَيْهِ وَأَرْشَدتَهُ إلَيْهِ، فَكُنْتَ لَمْ تَـــــــــــــألُهُ خَيرًا  وَلَمْ تَدَّخِرْهُ نُصْحاً. ولا حَوْلَ ولا قُوَّةَ إلا باللهِ. | وَأمّـــــــــا حَقُّ المُشِيرِ عَلَيْكَ فَلا تتَّهِمْهُ فِيمَا لا يُوافِقُكَ عَلَيهِ مِنْ رَأْيِهِ إذا أَشَــــــارَ عَلَيْكَ فَإنَّمَا هِيَ الآرَاءُ وَتصَرُّفُ النَّــــاسِ فِيهَــــــا وَاختِلافُهُمْ. فَكُنْ عَلَيهِ فِي رَأيِهِ بالخِيَارِ إذا اتَّهمْتَ رَأْيَهُ، فَأَمّا تُهْمتُهُ فَلا تَجُوزُ لَكَ إذَا كَانَ عِنْدكَ مِمَّنْ يَسْتَحِقُّ الْمُشَاوَرَةَ . وَلا تَدَعْ شُكْرَهُ عَلَى مَـا بَدَا لَكَ مِن إشْــــــــخاصِ رَأْيِهِ وَحُسْنِ وَجْهِ مَشُورَتِهِ، فَإذا وَافَقَكَ حَمِدتَ اللَّهَ وَقَبلْتَ ذلِكَ مِن أَخِيكَ بالشُّــــــــــــــــــــــــكْرِ والإرْصَادِ بالْمُكَافَأَةِ فِي مِثلِهَـــــا إنْ فَزِعَ إلَيْكَ.  وَلا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ ذُو الكِفْلِ (ع): آدَابُ الحِلْمِ وَكَظْمِ الغَيْظِ وَالاسْتِئْذَانِ عِنْدَ البُيُوتِ: تَعَلُّمُ خُلُقِ الحِلْمِ العَظِيمِ فَلَا يَغْضَبُ الطِّفْلُ وَلَا يَصْرُخُ إِذَا أَيْقَظَهُ أَحَدٌ أَوْ أَزْعَجَهُ، وَمَعْرِفَةِ أَدَبِ الاسْتِئْذَانِ وَعَدَمِ إِزْعَاجِ النَّائِمِينَ وَقْتَ الرَّاحَةِ وَالقَيْلُولَةِ (﴿ثَلَاثُ عَوْرَاتٍ لَّكُمْ﴾)."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المستشير",
        "text": "قصة حق المستشير: حور ونور في الحديقة بينما كانت عائلة حور ونور تستمتع باللعب في الحديقة، لاحظت حور ونجورها كرة طفل صغير تُركل بقوة وتصيب الأطفال الآخرين أحيانًا. استشارت حور أخاها نور: – \"ماذا نفعل؟ هل نواجهه أو نتشاجر معه؟ إنه قد يؤذي أختي الصغيرة!\" ابتسم نور وقال: – \"لو تركت الخيار لي، ربما رددت الكرة عليه كما يفعل، لكن أظن الأفضل أن نستشير أمي.\" ذهبا إلى الأم وشرحا الموقف. بابتسامة هادئة، قالت الأم:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المستشير",
        "text": "– \"هذا سلوك خاطئ، والطريقة المناسبة هي النصح لا العقاب، فاذهبا وأخبراه بلطف بما قد يفعله من أذى للآخرين.\" ذهبت حور لتحدث الطفل: – \"إن ما تفعله قد يؤذي الأطفال. إذا استمريت، سأخبر والديك.\" توقف الطفل عن اللعب قليلاً، ثم غادر المكان بهدوء. بعد قليل، قابلت الأم والدة الطفل، ونصحتها برفق: – \"ابنك كثير النشاط وقد يؤذي نفسه أو الآخرين أحيانًا. راقبي تحركاته ووجهيه بلطف.\" بهذه الطريقة، تعلم حور ونور أن استشارة الكبير أو الموجه عند المواقف الصعبة أفضل من اتخاذ القرارات بعنف، وأن اللين والإرشاد يحققان الفائدة للجميع."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المشير",
        "text": "قصة حور ونور: درس المشورة بينما كانت عائلة حور ونور بالحديقة، كانا يلعبان مع أصدقائهما. وفجأة، بدأ طفل صغير بالركل العشوائي للكرة، فأصاب بعض الأطفال. ترددت حور وقالت: \"أخي، هل نواجهه أو نتشاجر معه؟ فهو قد يؤذي أختي الصغيرة.\" ابتسم نور وقال: \"لو ترك الخيار لي، ربما كنت سأرد بالمثل، لكن هذا خطأ. دعينا نستشير أمنا.\" ذهبا إلى والدتهما وأخبراها بما حدث. استمعت الأم بهدوء، وقالت: \"أفضل طريقة هي توجيهه بالنصيحة أولاً، وليس بالغضب أو العقاب.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المشير",
        "text": "ذهبت حور لتحدث الطفل، ونصحتها الأم: \"أخبريه بهدوء أن ما يفعله قد يؤذي غيره، وأن الاستمرار سيجعلنا نبلغ والدَيه.\" فعلاً، توقّف الطفل عن ركل الكرة لبضع لحظات، ثم رحل لاحقًا. لاحقًا، قابلت الأم والدة الطفل وشرحت لها الموقف بهدوء، وقدمت نصيحة لمراقبة نشاط طفلها دون غضب، بل باللين والرحمة. النهاية: تعلم نور وحور أن الاستماع لنصيحة الأم والعمل بها أفضل من التصرف وفق الغضب، وأن من يقدم النصيحة يستحق الاحترام والتقدير، حتى لو اختلفوا معها في الرأي."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّابِعَةُ: السِّيمْيَاءُ وَالخِيمْيَاءُ وَالكِيمْيَاءُ",
      "topic": "الدُّرُوسُ (1، 2، 3): الخِيمْيَاءُ وَالسِّيمْيَاءُ القَدِيمَةُ — وِلَادَةُ الكِيمْيَاءِ العِلْمِيَّةِ وَأَدَوَاتِهَا — العَنَاصِرُ وَهَنْدَسَةُ الجَدْوَلِ الدَّوْرِيِّ",
      "coverImg": "assets/y7/scince/s25.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s25.1.jpg",
          "text": "الدَّرْسُ (1) الخِيمْيَاءُ وَالسِّيمْيَاءُ القَدِيمَةُ وَفَلْسَفَةُ المَادَّةِ: سَعَتِ السِّيمْيَاءُ لِمَعْرِفَةِ طَبَائِعِ المَوَادِّ وَعَلَامَاتِهَا (التُّرَابِ وَالمَاءِ وَالهَوَاءِ وَالنَّارِ، وَالحَارِّ وَالبَارِدِ وَالرَّطْبِ وَاليَابِسِ)، وَحَاوَلَتِ الخِيمْيَاءُ تَنْقِيَةَ المَعَادِنِ وَرَبَطَتِ الذَّهَبَ بِالشَّمْسِ وَالفِضَّةَ بِالقَمَرِ وَالحَدِيدَ بِالمِرِّيخِ، مِمَّا مَهَّدَ لِظُهُورِ الكِيمْيَاءِ الحَدِيثَةِ."
        },
        {
          "img": "assets/y7/scince/s25.2.jpg",
          "text": "الدَّرْسُ (2) وِلَادَةُ الكِيمْيَاءِ العِلْمِيَّةِ وَأَدَوَاتِهَا: قَامَتْ عَلَى المَنْهَجِ التَّجْرِيبِيِّ وَعِلْمِ المِيزَانِ (قِيَاسِ الأَوْزَانِ وَالنِّسَبِ)، وَابْتَكَرَ العُلَمَاءُ أَدَوَاتِ المُخْتَبَرِ كَالإِنْبِيقِ (لِتَقْطِيرِ السَّوَائِلِ) وَالبُوتَقَةِ وَالهَاوُنِ وَالدَّوَارِقِ لِعَمَلِيَّاتِ التَّقْطِيرِ وَالتَّرْشِيحِ وَالتَّبَلْوُرِ وَصِنَاعَةِ الوَرَقِ وَالصَّابُونِ وَالزُّجَاجِ وَالدَّوَاءِ."
        },
        {
          "img": "assets/y7/scince/s25.3.jpg",
          "text": "الدَّرْسُ (3) العَنَاصِرُ وَهَنْدَسَةُ الجَدْوَلِ الدَّوْرِيِّ: العُنْصُرُ مَادَّةٌ نَقِيَّةٌ تَتَكَوَّنُ مِنْ نَوْعٍ وَاحِدٍ مِنَ الذَّرَّاتِ. يُنَظِّمُ الجَدْوَلُ الدَّوْرِيُّ العَنَاصِرَ تَصَاعُدِيًّا حَسَبَ العَدَدِ الذَّرِّيِّ فِي مَجْمُوعَاتٍ وَدَوْرَاتٍ؛ وَعَائِلَاتُهَا: الفِلِزَّاتُ اللَّامِعَةُ المَوَصِّلَةُ (كَالحَدِيدِ Fe)، وَاللَّافِلِزَّاتُ (كَالأُكْسِجِينِ O وَالهِيدْرُوجِينِ H)، وَالغَازَاتُ النَّبِيلَةُ المُسْتَقِرَّةُ."
        }
      ],
      "text": "الدَّرْسُ (1) الخِيمْيَاءُ وَالسِّيمْيَاءُ القَدِيمَةُ وَفَلْسَفَةُ المَادَّةِ: سَعَتِ السِّيمْيَاءُ لِمَعْرِفَةِ طَبَائِعِ المَوَادِّ وَعَلَامَاتِهَا (التُّرَابِ وَالمَاءِ وَالهَوَاءِ وَالنَّارِ، وَالحَارِّ وَالبَارِدِ وَالرَّطْبِ وَاليَابِسِ)، وَحَاوَلَتِ الخِيمْيَاءُ تَنْقِيَةَ المَعَادِنِ وَرَبَطَتِ الذَّهَبَ بِالشَّمْسِ وَالفِضَّةَ بِالقَمَرِ وَالحَدِيدَ بِالمِرِّيخِ، مِمَّا مَهَّدَ لِظُهُورِ الكِيمْيَاءِ الحَدِيثَةِ. الدَّرْسُ (2) وِلَادَةُ الكِيمْيَاءِ العِلْمِيَّةِ وَأَدَوَاتِهَا: قَامَتْ عَلَى المَنْهَجِ التَّجْرِيبِيِّ وَعِلْمِ المِيزَانِ (قِيَاسِ الأَوْزَانِ وَالنِّسَبِ)، وَابْتَكَرَ العُلَمَاءُ أَدَوَاتِ المُخْتَبَرِ كَالإِنْبِيقِ (لِتَقْطِيرِ السَّوَائِلِ) وَالبُوتَقَةِ وَالهَاوُنِ وَالدَّوَارِقِ لِعَمَلِيَّاتِ التَّقْطِيرِ وَالتَّرْشِيحِ وَالتَّبَلْوُرِ وَصِنَاعَةِ الوَرَقِ وَالصَّابُونِ وَالزُّجَاجِ وَالدَّوَاءِ. الدَّرْسُ (3) العَنَاصِرُ وَهَنْدَسَةُ الجَدْوَلِ الدَّوْرِيِّ: العُنْصُرُ مَادَّةٌ نَقِيَّةٌ تَتَكَوَّنُ مِنْ نَوْعٍ وَاحِدٍ مِنَ الذَّرَّاتِ. يُنَظِّمُ الجَدْوَلُ الدَّوْرِيُّ العَنَاصِرَ تَصَاعُدِيًّا حَسَبَ العَدَدِ الذَّرِّيِّ فِي مَجْمُوعَاتٍ وَدَوْرَاتٍ؛ وَعَائِلَاتُهَا: الفِلِزَّاتُ اللَّامِعَةُ المَوَصِّلَةُ (كَالحَدِيدِ Fe)، وَاللَّافِلِزَّاتُ (كَالأُكْسِجِينِ O وَالهِيدْرُوجِينِ H)، وَالغَازَاتُ النَّبِيلَةُ المُسْتَقِرَّةُ.",
      "q1": {
        "q": "مَا الجِهَازُ الكِيمْيَائِيُّ الَّذِي ابْتَكَرَهُ العُلَمَاءُ المُسْلِمُونَ لِتَقْطِيرِ السَّوَائِلِ وَالعُطُورِ؟",
        "focusWord": "الإِنْبِيقُ",
        "options": [
          {
            "text": "الإِنْبِيقُ (إِلَى جَانِبِ البُوتَقَةِ وَالمِيزَانِ الدَّقِيقِ)",
            "correct": true
          },
          {
            "text": "التِّلِسْكُوبُ الفَضَائِيُّ",
            "correct": false
          },
          {
            "text": "السَّمَّاعَةُ الطِّبِّيَّةُ",
            "correct": false
          },
          {
            "text": "البَكَرَةُ الحَدِيدِيَّةُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ رَتَّبَ العُلَمَاءُ العَنَاصِرَ الكِيمْيَائِيَّةَ فِي هَنْدَسَةِ الجَدْوَلِ الدَّوْرِيِّ؟",
        "focusWord": "الجَدْوَلُ الدَّوْرِيُّ",
        "options": [
          {
            "text": "تَرْتِيبًا تَصَاعُدِيًّا حَسَبَ العَدَدِ الذَّرِّيِّ (عَدَدِ البُرُوتُونَاتِ) فِي أَعْمِدَةٍ وَصُفُوفٍ",
            "correct": true
          },
          {
            "text": "حَسَبَ طَعْمِهَا وَرَائِحَتِهَا",
            "correct": false
          },
          {
            "text": "حَسَبَ تَارِيخِ الشُّهُورِ الهِجْرِيَّةِ",
            "correct": false
          },
          {
            "text": "بِشَكْلٍ عَشْوَائِيٍّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا الرُّمُوزُ الكِيمْيَائِيَّةُ العَالَمِيَّةُ لِعَنَاصِرِ الهِيدْرُوجِينِ وَالأُكْسِجِينِ وَالحَدِيدِ؟",
        "focusWord": "H وَ O وَ Fe",
        "options": [
          {
            "text": "الهِيدْرُوجِينُ (H)، وَالأُكْسِجِينُ (O)، وَالحَدِيدُ (Fe)",
            "correct": true
          },
          {
            "text": "الهِيدْرُوجِينُ (Fe) وَالحَدِيدُ (O)",
            "correct": false
          },
          {
            "text": "كُلُّهَا تُكْتَبُ بِرَمْزٍ وَاحِدٍ (X)",
            "correct": false
          },
          {
            "text": "لَيْسَ لِلْعَنَاصِرِ رُمُوزٌ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الإِنْبِيقُ وَالبُوتَقَةُ وَالمِيزَانُ",
          "left": "أَدَوَاتُ المُخْتَبَرِ لِلتَّقْطِيرِ وَالصَّهْرِ وَقِيَاسِ الأَوْزَانِ"
        },
        {
          "right": "الجَدْوَلُ الدَّوْرِيُّ لِلْعَنَاصِرِ",
          "left": "تَرْتِيبُ العَنَاصِرِ تَصَاعُدِيًّا حَسَبَ العَدَدِ الذَّرِّيِّ"
        },
        {
          "right": "عَائِلَاتُ العَنَاصِرِ",
          "left": "الفِلِزَّاتُ المَوَصِّلَةُ وَاللَّافِلِزَّاتُ وَالغَازَاتُ النَّبِيلَةُ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ إِنْجَازَاتِ الكِيمْيَاءِ العِلْمِيَّةِ وَعَنَاصِرِ الجَدْوَلِ الدَّوْرِيِّ:",
        "correct": [
          "المَنْهَجُ التَّجْرِيبِيُّ وَعِلْمُ المِيزَانِ",
          "جِهَازُ الإِنْبِيقِ لِلتَّقْطِيرِ",
          "الهِيدْرُوجِينُ (H) وَالأُكْسِجِينُ (O) وَالحَدِيدُ (Fe)",
          "صِنَاعَةُ الوَرَقِ وَالصَّابُونِ وَالزُّجَاجِ"
        ],
        "wrong": [
          "الشَّعْوَذَةُ بِلَا تَجْرِبَةٍ",
          "خَلْطُ المَوَادِّ الكِيمْيَائِيَّةِ الخَطِرَةِ"
        ]
      },
      "applyStep": "أَتَعَلَّمُ رُمُوزَ العَنَاصِرِ الأَسَاسِيَّةِ فِي حَيَاتِنَا مِثْلَ الأُكْسِجِينِ (O) وَالهِيدْرُوجِينِ (H) وَالحَدِيدِ (Fe)."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt25.jpg",
      "title": "الدَّرْسُ (10): مَسَارُ التَّنْشِيطِ الحَيَوِيِّ — رُوتِينٌ تَدْرِيبِيٌّ مُتَكَامِلٌ فِي 30 دَقِيقَةً",
      "subtitle": "التَّنَفُّسُ المُتَنَاوِبُ، التَّمَدُّدُ الجَانِبِيُّ، تَمَارِينُ الذِّرَاعَيْنِ، القَفْزُ عَلَى الحَبْلِ، وَوَضْعِيَّةُ القِطَّةِ وَالكَلْبِ",
      "slideText": "⚡ الدَّرْسُ (10) مَسَارُ التَّنْشِيطِ الحَيَوِيِّ (رُوتِينٌ مُتَكَامِلٌ فِي 30 دَقِيقَةً): (1) الوَعْيُ (دَقِيقَةٌ وَنِصْفٌ): التَّنَفُّسُ المُتَنَاوِبُ عَبْرَ فَتْحَتَيِ الأَنْفِ. (2) الاسْتِطَالَةُ (دَقِيقَةٌ وَنِصْفٌ): التَّمَدُّدُ الجَانِبِيُّ لِلْجِذْعِ وَالذِّرَاعِ. (3) النُّمُوُّ العَضَلِيُّ (8-12 عَدَّةً): تَمَارِينُ الذِّرَاعَيْنِ. (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَةٌ وَنِصْفٌ): القَفْزُ عَلَى الحَبْلِ بِتَنَاسُقٍ وَخِفَّةٍ. (5) التَّدَفُّقُ (يُؤَدَّى أَخِيرًا فَقَطْ — 3 دَقَائِقَ): وَضْعِيَّةُ القِطَّةِ وَالكَلْبِ لِإِطَالَةِ وَإِرَاحَةِ العَمُودِ الفَقَرِيِّ.",
      "q1": {
        "q": "كَيْفَ نُؤَدِّي تَمْرِينَ الوَعْيِ فِي بِدَايَةِ (الدَّرْسِ العَاشِرِ: مَسَارِ التَّنْشِيطِ الحَيَوِيِّ)؟",
        "focusWord": "التَّنَفُّسُ المُتَنَاوِبُ",
        "options": [
          {
            "text": "بِالتَّنَفُّسِ المُتَنَاوِبِ الهَادِئِ عَبْرَ فَتْحَتَيِ الأَنْفِ لِمُدَّةِ دَقِيقَةٍ وَنِصْفٍ",
            "correct": true
          },
          {
            "text": "بِالصُّرَاخِ العَالِي",
            "correct": false
          },
          {
            "text": "بِحَبْسِ النَّفَسِ",
            "correct": false
          },
          {
            "text": "بِالتَّنَفُّسِ مِنَ الفَمِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا تَمْرِينُ النُّمُوِّ العَضَلِيِّ وَتَمْرِينُ الاسْتِجَابَةِ العَصَبِيَّةِ فِي مَسَارِ التَّنْشِيطِ الحَيَوِيِّ؟",
        "focusWord": "تَمَارِينُ الذِّرَاعَيْنِ وَالقَفْزُ عَلَى الحَبْلِ",
        "options": [
          {
            "text": "تَمَارِينُ الذِّرَاعَيْنِ (8-12 عَدَّةً)، وَالقَفْزُ عَلَى الحَبْلِ (دَقِيقَةٌ وَنِصْفٌ)",
            "correct": true
          },
          {
            "text": "النَّوْمُ عَلَى البِسَاطِ",
            "correct": false
          },
          {
            "text": "الجُلُوسُ الطَّوِيلُ",
            "correct": false
          },
          {
            "text": "قِرَاءَةُ الكِتَابِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "بِأَيِّ تَمْرِينٍ نَخْتَتِمُ مَسَارَ التَّنْشِيطِ الحَيَوِيِّ فِي فَقْرَةِ التَّدَفُّقِ (3 دَقَائِقَ)؟",
        "focusWord": "وَضْعِيَّةُ القِطَّةِ وَالكَلْبِ",
        "options": [
          {
            "text": "وَضْعِيَّةُ القِطَّةِ وَالكَلْبِ لِمُرُونَةِ وَإِرْخَاءِ الظَّهْرِ",
            "correct": true
          },
          {
            "text": "الرَّكْضُ السَّرِيعُ",
            "correct": false
          },
          {
            "text": "القَفْزُ العَالِي",
            "correct": false
          },
          {
            "text": "الشَّدُّ العَنِيفُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ (الدَّرْسُ 10)",
          "left": "التَّنَفُّسُ المُتَنَاوِبُ + التَّمَدُّدُ الجَانِبِيُّ"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ وَالاسْتِجَابَةُ",
          "left": "تَمَارِينُ الذِّرَاعَيْنِ (8-12 عَدَّةً) + القَفْزُ عَلَى الحَبْلِ"
        },
        {
          "right": "التَّدَفُّقُ الخِتَامِيُّ (3 دَقَائِقَ)",
          "left": "وَضْعِيَّةُ القِطَّةِ وَالكَلْبِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ العَاشِرِ (مَسَارِ التَّنْشِيطِ الحَيَوِيِّ):",
        "correct": [
          "التَّنَفُّسُ المُتَنَاوِبُ (دَقِيقَةٌ وَنِصْفٌ)",
          "التَّمَدُّدُ الجَانِبِيُّ",
          "تَمَارِينُ الذِّرَاعَيْنِ وَالقَفْزُ عَلَى الحَبْلِ",
          "وَضْعِيَّةُ القِطَّةِ وَالكَلْبِ (3 دَقَائِقَ)"
        ],
        "wrong": [
          "حَمْلُ أَوْزَانٍ ثَقِيلَةٍ جِدًّا",
          "القَفْزُ الحَافِي عَلَى الأَحْجَارِ"
        ]
      },
      "applyStep": "أُطَبِّقُ مَسَارَ التَّنْشِيطِ الحَيَوِيِّ: التَّنَفُّسَ المُتَنَاوِبَ، التَّمَدُّدَ الجَانِبِيَّ، القَفْزَ عَلَى الحَبْلِ، وَوَضْعِيَّةَ القِطَّةِ وَالكَلْبِ."
    }
  },
  {
    "w": 26,
    "secNum": 7,
    "heavenName": "سَمَاءُ الجُمُعَةِ السَّابِعَةُ (ذ ض ظ غ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّابِعَةُ: الكِيمْيَاءُ وَالمَادَّةُ وَالمَحَالِيلُ وَالكِيمْيَاءُ الحَيَوِيَّةُ",
    "natureLabel": "طَاقَةُ الرِّيحِ (تَبْدِيدُ الوَهْمِ بِنُورِ اليَقِينِ وَالصَّبْرِ)",
    "ltr": "ض",
    "jummal": 800,
    "prophet": "شَمْوِيلُ (ع)",
    "virtue": "الحَقُّ",
    "unitHeader": "الوَحْدَةُ السَّادِسَةُ وَالعِشْرُونَ : نَبِيُّ اللهِ شَمْوِيلُ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "حَكَمَ نَبِيُّ اللهِ شَمْوِيلُ (ع) بَيْنَ قَوْمِهِ بِالحَقِّ وَالحِكْمَةِ، وَبَيَّنَ لَهُمْ أَنَّ القِيَادَةَ الحَقَّةَ تَقُومُ عَلَى بَسْطَةِ العِلْمِ وَالقُوَّةِ فِي طَاعَةِ اللهْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (حَمِيَّةُ الجِهَادِ مُقَابِلَ نَارِ الكِبْرِ وَالحَسَدِ): نَارُ الكِبْرِ وَالعَصَبِيَّةِ فِي قُلُوبِ أَغْنِيَاءِ بَنِي إِسْرَائِيلَ حِينَ اعْتَرَضُوا عَلَى طَالُوتَ وَقَالُوا: ﴿أَنَّىٰ يَكُونُ لَهُ الْمُلْكُ عَلَيْنَا وَنَحْنُ أَحَقُّ بِالْمُلْكِ مِنْهُ﴾؛ وَفِي مُقَابِلِهَا نُورُ البَصِيرَةِ فِي قَلْبِ شَمْوِيلَ وَغَلَيَانُ دُهْنِ القُدْسِ الزَّيْتِيِّ فِي القَرْنِ آيَةً عَلَى اخْتِيَارِ المَلِكِ الحَقِّ. B. الرِّيحُ (رِيحُ الادِّعَاءِ وَالوَهْمِ مُقَابِلَ حَمْلِ المَلَائِكَةِ لِلتَّابُوتِ فِي الهَوَاءِ): رِيحُ الوَهْمِ وَالادِّعَاءِ الفَارِغِ حِينَ قَالُوا: ﴿وَمَا لَنَا أَلَّا نُقَاتِلَ فِي سَبِيلِ اللَّهِ﴾ فَلَمَّا كُتِبَ عَلَيْهِمُ القِتَالُ تَوَلَّوْا إِلَّا قَلِيلًا مِنْهُمْ؛ وَفِي مُقَابِلِهَا هُبُوطُ المَلَائِكَةِ فِي جَوِّ السَّمَاءِ وَالرِّيحِ تَحْمِلُ «التَّابُوتَ» وَفِيهِ «السَّكِينَةُ» (رِيحٌ هَفَّافَةٌ طَيِّبَةٌ مِنَ الجَنَّةِ تُثَبِّتُ القُلُوبَ). C. التُّرَابُ (العَقْلُ وَالعِلْمُ وَبَسْطَةُ الجِسْمِ وَالعَصَا): المِيزَانُ العَقْلِيُّ الإِلٰهِيُّ الَّذِي أَعْلَنَهُ شَمْوِيلُ لِلْقَوْمِ: أَنَّ القِيَادَةَ وَالإِمَامَةَ تَكُونُ بِاصْطِفَاءِ اللهِ وَبِـ«البَسْطَةِ فِي العِلْمِ وَالجِسْمِ» لَا بِكَثْرَةِ المَالِ وَالتُّرَابِ، وَمِقْيَاسُ عَصَا الأنْبِيَاءِ الخَشَبِيَّةِ لِطُولِ قَامَةِ المَلِكِ. D. المَاءُ (الطَّاعَةُ وَالسَّقَّاءُ المُتَوَاضِعُ وَالنَّهْرُ): تَوَاضُعُ طَالُوتَ الَّذِي كَانَ يَسْقِي المَاءَ وَيَبْحَثُ عَنْ حِمَارِ أَبِيهِ الضَّائِعِ فَدَخَلَ عَلَى نَبِيِّ اللهِ شَمْوِيلَ، وَطَاعَةُ الفِئَةِ المُؤْمِنَةِ القَلِيلَةِ لأَمْرِ نَبِيِّهِمْ وَمَلِكِهِمْ عِنْدَ نَهْرِ المَاءِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الجُمُعَةِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ سِتَّةٌ وَعِشْرُونَ فِي مَنْزِلَةِ الرِّيحِ الَّتِي تَكْشِفُ مَا أَضْمَرَتْهُ الصُّدُورُ وَتَحْمِلُ فِيهَا المَلَائِكَةُ تَابُوتَ السَّكِينَةِ بَيْنَ السَّمَاءِ وَالأَرْضْ، وَهُوَ نَبِيُّ اللهِ شَمْوِيلُ بْنُ بَالِي عَلَيْهِ السَّلَامُ الَّذِي ذَكَرَهُ اللهُ فِي القُرْآنِ الكَرِيمِ بِوَصْفِهِ الشَّرِيفِ إِذْ قَالُوا لِنَبِيٍّ لَهُمُ ابْعَثْ لَنَا مَلِكًا نُقَاتِلْ فِي سَبِيلِ اللهْ. كَانَتْ أُمُّهُ امْرَأَةً مُؤْمِنَةً صَالِحَةً دَعَتِ اللهَ بِقَلْبٍ خَاضِعٍ مُتَضَرِّعٍ أَنْ يَرْزُقَهَا وَلَدًا تَجْعَلُهُ خَادِمًا لِبَيْتِ المَقْدِسِ، فَاسْتَجَابَ اللهُ دُعَاءَهَا وَوَلَدَتْ شَمْوِيلَ وَمَعْنَى اسْمِهِ سَمِعَ اللهُ دُعَائِي.",
      "نَشَأَ شَمْوِيلُ فِي المَسْجِدِ طِفْلًا طَاهِرًا يَخْدُمُ العَالِمَ الشَّيْخَ عِيلِي وَيَتَعَلَّمُ التَّوْرَاةَ وَالحِكْمَةْ، وَفِي لَيْلَةٍ هَادِئَةٍ أَشْرَقَ نُورُ الوَحْيِ فِي المَسْجِدِ وَنَادَاهُ المَلَكُ جِبْرِيلُ بِأَمْرِ اللهِ فَقَالَ شَمْوِيلُ بِأَدَبٍ وَطَاعَةٍ لَبَّيْكَ يَا رَبِّ إِنَّ عَبْدَكَ يَسْمَعْ! فَجَعَلَهُ اللهُ نَبِيًّا كَرِيمًا بعدَ أَنْ كَانَ بَنُو إِسْرَائِيلَ قَدْ ضَيَّعُوا عَهْدَ اللهِ وَتَرَكُوا الطَّاعَةَ؛ فَسَلَّطَ اللهُ عَلَيْهِمُ العَمَالِقَةَ بِقِيَادَةِ جَالُوتَ فَأَخْرَجُوهُمْ مِنْ دِيَارِهِمْ وَأَبْنَائِهِمْ وَغَلَبُوهُمْ عَلَى تَابُوتِ المِيثَاقِ الَّذِي كَانَتْ فِيهِ بَقِيَّةُ الأَلْوَاحِ وَعَصَا مُوسَى وَعِمَامَةُ هَارُونْ، فَعَاشَ القَوْمُ فِي ذُلٍّ وَضِيقٍ شَدِيدْ.",
      "جَاءَ أَشْرَافُ القَوْمِ إِلَى نَبِيِّ اللهِ شَمْوِيلَ وَقَالُوا لَهُ ابْعَثْ لَنَا مَلِكًا نُقَاتِلْ فِي سَبِيلِ اللهِ! فَكَشَفَ شَمْوِيلُ بِبَصِيرَتِهِ ضَعْفَ عَزِيمَتِهِمْ وَقَالَ هَلْ عَسَيْتُمْ إِنْ كُتِبَ عَلَيْكُمُ القِتَالُ أَلَّا تُقَاتِلُوا؟ قَالُوا بِرِيحِ الادِّعَاءِ وَالوَهْمِ وَمَا لَنَا أَلَّا نُقَاتِلَ فِي سَبِيلِ اللهِ وَقَدْ أُخْرِجْنَا مِنْ دِيَارِنَا وَأَبْنَائِنَا! فَدَعَا شَمْوِيلُ رَبَّهُ الَّذِي فَضَّلَ أَوْلِيَاءَهُ بِالحِكْمَةِ وَهُوَ يُفَضِّلُ أَهْلَ العِلْمِ وَالتَّقْوَى؛ فَأَنْزَلَ اللهُ عَلَيْهِ عَصَا النُّبُوَّةِ وَقَرْنًا فِيهِ دُهْنُ القُدْسِ مِنْ زَيْتِ الزَّيْتُونِ المُبَارَكِ، وَأَوْحَى إِلَيْهِ أَنَّ مَلِكَهُمْ هُوَ الرَّجُلُ الَّذِي يَكُونُ طُولُ قَامَتِهِ عَلَى مِقْدَارِ هٰذِهِ العَصَا التَّامِّ، وَإِذَا دَخَلَ عَلَيْكَ فَارَ الزَّيْتُ وَغَلَا دَاخِلَ القَرْنِ!",
      "وَفِي ذٰلِكَ اليَوْمِ كَانَ هُنَاكَ شَابٌّ مُؤْمِنٌ عَالِمٌ شُجَاعٌ وَمُتَوَاضِعٌ مِنْ سِبْطِ بِنْيَامِينَ أَخِي يُوسُفَ اسْمُهُ طَالُوتُ يَعْمَلُ دَبَّاغًا أَوْ سَقَّاءً يَسْقِي المَاءَ لِلنَّاسِ، وَقَدْ ضَلَّ حِمَارٌ لِأَبِيهِ فِي الجِبَالِ فَخَرَجَ طَالُوتُ مَعَ غُلَامِهِ يَبْحَثَانِ عَنْهُ فِي التُّرَابِ وَالأَوْدِيَةِ حَتَّى مَرَّا بِبَيْتِ نَبِيِّ اللهِ شَمْوِيلَ فَقَالَا لِنَدْخُلْ عَلَى نَبِيِّ اللهِ نَسْأَلْهُ الدُّعَاءَ وَالإِرْشَادْ. فَلَمَّا دَخَلَ طَالُوتُ عَلَى شَمْوِيلَ فَارَ دُهْنُ الزَّيْتِ فِي القَرْنِ فَوَرَانًا عَجِيبًا، فَقَامَ شَمْوِيلُ وَقَاسَ طُولَ طَالُوتَ بِالعَصَا فَإِذَا هُوَ عَلَى قَدْرِهَا سَوَاءً بِسَوَاءٍ لَمْ يَزِدْ وَلَمْ يَنْقُصْ! فَبَشَّرَهُ شَمْوِيلُ وَدَهَنَ رَأْسَهُ بِدُهْنِ القُدْسِ ثُمَّ خَرَجَ إِلَى بَنِي إِسْرَائِيلَ وَقَالَ إِنَّ اللهَ قَدْ بَعَثَ لَكُمْ طَالُوتَ مَلِكًا!",
      "اشْتَعَلَتْ نَارُ الكِبْرِ وَالحَسَدِ فِي قُلُوبِ الأَغْنِيَاءِ فَقَالُوا أَنَّى يَكُونُ لَهُ المُلْكُ عَلَيْنَا وَنَحْنُ أَحَقُّ بِالمُلْكِ مِنْهُ وَلَمْ يُؤْتَ سَعَةً مِنَ المَالْ! فَرَدَّ عَلَيْهِمْ شَمْوِيلُ بِمِيزَانِ العَقْلِ وَالتُّرَابِ قَائِلًا إِنَّ اللهَ اصْطَفَاهُ عَلَيْكُمْ وَزَادَهُ بَسْطَةً فِي العِلْمِ وَالجِسْمِ وَاللهُ يُؤْتِي مُلْكَهُ مَنْ يَشَاءُ وَاللهُ وَاسِعٌ عَلِيمْ؛ وَقَدْ بَيَّنَ الإِمَامُ البَاقِرُ وَالإِمَامُ الصَّادِقُ عَلَيْهِمَا السَّلَامُ أَنَّ هٰذِهِ الآيَةَ هِيَ مِيزَانُ إِمَامَةِ أَمِيرِ المُؤْمِنِينَ عَلِيٍّ وَأَهْلِ البَيْتِ الَّذِينَ اصْطَفَاهُمُ اللهُ بِالعِلْمِ الكَامِلِ وَالشَّجَاعَةِ العُظْمَى.",
      "ثُمَّ أَعْلَنَ شَمْوِيلُ الآيَةَ السَّمَاوِيَّةَ الكُبْرَى وَقَالَ إِنَّ آيَةَ مُلْكِهِ أَنْ يَأْتِيَكُمُ التَّابُوتُ فِيهِ سَكِينَةٌ مِنْ رَبِّكُمْ وَبَقِيَّةٌ مِمَّا تَرَكَ آلُ مُوسَى وَآلُ هَارُونَ تَحْمِلُهُ المَلَائِكَةُ إِنَّ فِي ذٰلِكَ لَآيَةً لَكُمْ إِنْ كُنْتُمْ مُؤْمِنِينْ! فَنَظَرَ القَوْمُ بِأَعْيُنِهِمْ إِلَى السَّمَاءِ فَإِذَا المَلَائِكَةُ تَنْزِلُ فِي الهَوَاءِ بَيْنَ السَّمَاءِ وَالأَرْضِ تَحْمِلُ تَابُوتَ السَّكِينَةِ المُذَهَّبَ حَتَّى وَضَعَ الأَمِينُ جِبْرِيلُ وَالمَلَائِكَةُ التَّابُوتَ فِي دَارِ طَالُوتَ أَمَامَ النَّاسِ جَمِيعًا! فَـخَضَعَ القَوْمُ لِلحَقِّ وَأَقَرُّوا بِمُلْكِ طَالُوتَ وَنُبُوَّةِ شَمْوِيلَ فَلَا يَعَضُّ الظَّالِمُ أَصَابِعَهُ إِلَّا نَدَمًا إِذَا خَالَفَ أَمْرَ اللهْ.",
      "وَخَرَجَ الجَيْشُ فَـضَرَبَ اللهُ لَهُمْ مَثَلَ الابْتِلَاءِ بِالنَّهْرِ، فَتَوَلَّى الأَكْثَرُونَ وَثَبَتَ مَعَ طَالُوتَ وَدَاوُودَ ثَلَاثُمِائَةٍ وَثَلَاثَةَ عَشَرَ مُؤْمِنًا فَضَمِنَ اللهُ لَهُمُ النَّصْرَ العَظِيمَ وَعَادَتْ لَهُمْ كَرَامَتُهُمْ فِي كُلِّ أَرْضْ. وَبَقِيَ نَبِيُّ اللهِ شَمْوِيلُ يَقْضِي بَيْنَ النَّاسِ بِالعَدْلِ فَلَا يَأْخُذُ مِنْ أَحَدٍ هَدِيَّةً وَلَا رِشْوَةً وَيُعَلِّمُهُمْ أَنَّ مَنْ أَطَاعَ اللهَ صَارَ قَلْبُهُ مُنِيرًا يَسْبَحُ فِي نَعِيمٍ وَنُورٍ وَفَيْضٌ مِنَ السَّكِينَةِ، وَمَهْمَا أَصَابَ الإِنْسَانَ مِنْ تَعَبٍ أَوْ مَرَضٍ أَوْ ضُرٍّ فَسَجَدَ لِلهِ كَشَفَ اللهُ ضُرَّهُ وَأَعْطَاهُ مِنْ فَضْلِهِ الكَبِيرْ."
    ],
    "words": [
      {
        "word": "فَضْلِهِ",
        "desc": "وسط متصل / ساكن: ـضْـ",
        "raw": "فَضْلِهِ (وسط متصل / ساكن: ـضْـ)"
      },
      {
        "word": "أَرْضْ",
        "desc": "آخر منفصل / ساكن وقفا: ضْ",
        "raw": "أَرْضْ (آخر منفصل / ساكن وقفا: ضْ)"
      },
      {
        "word": "ضَرَبَ",
        "desc": "أول منفصل / متحرك بالفتح: ضَـ",
        "raw": "ضَرَبَ (أول منفصل / متحرك بالفتح: ضَـ)"
      },
      {
        "word": "فَضَمِنَ",
        "desc": "أول متصل / متحرك بالفتح: ـضَـ",
        "raw": "فَضَمِنَ (أول متصل / متحرك بالفتح: ـضَـ)"
      },
      {
        "word": "خَضَعَ",
        "desc": "وسط متصل / متحرك بالفتح: ـضَـ",
        "raw": "خَضَعَ (وسط متصل / متحرك بالفتح: ـضَـ)"
      },
      {
        "word": "وَضَعَ",
        "desc": "وسط منفصل / متحرك بالفتح: ضَـ",
        "raw": "وَضَعَ (وسط منفصل / متحرك بالفتح: ضَـ)"
      },
      {
        "word": "فَرَضَ",
        "desc": "آخر منفصل أو متصل / متحرك بالفتح: ضَ / ـضَ",
        "raw": "فَرَضَ (آخر منفصل أو متصل / متحرك بالفتح: ضَ / ـضَ)"
      },
      {
        "word": "ضُرٍّ",
        "desc": "أول منفصل / متحرك بالضم: ضُـ",
        "raw": "ضُرٍّ (أول منفصل / متحرك بالضم: ضُـ)"
      },
      {
        "word": "فَيْضٌ",
        "desc": "آخر متصل / متحرك بالضم: ـضٌ",
        "raw": "فَيْضٌ (آخر متصل / متحرك بالضم: ـضٌ)"
      },
      {
        "word": "ضِيَاءٍ",
        "desc": "أول منفصل / متحرك بالكسر: ضِـ",
        "raw": "ضِيَاءٍ (أول منفصل / متحرك بالكسر: ضِـ)"
      },
      {
        "word": "فَضَّلَ",
        "desc": "وسط متصل / مضعف بالفتح: ـضَّـ",
        "raw": "فَضَّلَ (وسط متصل / مضعف بالفتح: ـضَّـ)"
      },
      {
        "word": "يَعَضُّ",
        "desc": "آخر متصل / مضعف بالضم: ـضُّ",
        "raw": "يَعَضُّ (آخر متصل / مضعف بالضم: ـضُّ)"
      },
      {
        "word": "يُفَضِّلُ",
        "desc": "وسط متصل / مضعف بالكسر: ـضِّـ",
        "raw": "يُفَضِّلُ (وسط متصل / مضعف بالكسر: ـضِّـ)"
      },
      {
        "word": "ضَامِنٌ",
        "desc": "ممدود بالألف: ضَا",
        "raw": "ضَامِنٌ (ممدود بالألف: ضَا)"
      },
      {
        "word": "وُضُوءٍ",
        "desc": "وسط منفصل / ممدود بالواو: ضُو",
        "raw": "وُضُوءٍ (وسط منفصل / ممدود بالواو: ضُو)"
      },
      {
        "word": "ضِيقٍ",
        "desc": "ممدود بالياء: ضِي",
        "raw": "ضِيقٍ (ممدود بالياء: ضِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الضَّادِ (ض): النُّطْقُ السَّلِيمُ لِحَرْفِ الضَّادِ المُفَخَّمِ المُطْبَقِ المُسْتَطِيلِ المَجْهُورِ مِنْ مَخْرَجِ إِحْدَى حَافَّتَيِ اللِّسَانِ أَوْ كِلْتَيْهِمَا مَعَ مَا يُحَاذِيهَا مِنَ الأَضْرَاسِ العُلْيَا (وَهُوَ أَعَزُّ حُرُوفِ العَرَبِيَّةِ وَبِهِ سُمِّيَتْ لُغَةَ الضَّادِ)، وَالتَّمْيِيزُ الصَّوْتِيُّ الدَّقِيقُ بَيْنَهُ وَبَيْنَ الظَّاءِ (اللِّثَوِيَّةِ) وَالدَّالِ (المُرَقَّقَةِ)، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى صِدْقِ الوَعْدِ وَعَدَمِ الادِّعَاءِ قَبْلَ الابْتِلَاءِ (﴿هَلْ عَسَيْتُمْ إِن كُتِبَ عَلَيْكُمُ الْقِتَالُ أَلَّا تُقَاتِلُوا﴾)."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "القُبَّةُ البَيْضَاوِيَّةُ المَنْقُوطَةُ وَمِقْيَاسُ الطُّولِ وَالرَّقْمُ (26): مُشَاهَدَةُ شَكْلِ حَرْفِ الضَّادِ (ض / ضـ / ـضـ / ـض) المُرَكَّبِ مِنْ قُبَّةٍ بَيْضَاوِيَّةٍ تَلِيهَا سِنٌّ صَغِيرَةٌ وَكَأْسٌ عَمِيقَةٌ وَفَوْقَ القُبَّةِ نُقْطَةٌ مُنِيرَةٌ كَالتَّاجِ أَوْ كَالتَّابُوتِ السَّمَاوِيِّ المَحْمُولِ فَوْقَ الرُّؤُوسِ، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (26) (مَجْمُوعِ حُرُوفِ اسْمِ الجَلَالَةِ أَوْ ضِعْفِ الـ 13)، وَتَعَلُّمُ النَّظَرِ إِلَى جَوْهَرِ الإِنْسَانِ (عِلْمِهِ وَعَقْلِهِ وَقُوَّتِهِ) لَا إِلَى مَظْهَرِ ثِيَابِهِ وَمَالِهِ."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ شَمْوِيلَ الكَامِلَةِ وَتَابُوتِ السَّكِينَةِ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ شَمْوِيلَ فِي سُورَةِ البَقَرَةِ وَفِي رِوَايَاتِ أَهْلِ البَيْتِ (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى الإِصْغَاءِ الخَاشِعِ لِنِدَاءِ الحَقِّ فِي اللَّيْلِ (كَمَا سَمِعَ الطِّفْلُ شَمْوِيلُ نِدَاءَ الوَحْيِ فِي بَيْتِ المَقْدِسِ فَقَالَ: لَبَّيْكَ رَبِّي!)، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ سِتَّةٌ وَعِشْرُونَ (26) وَالثَّمَانُمِائَةٍ (800) وَالقِيَاسُ الهَنْدَسِيُّ: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (26) وَمَعْرِفَةِ قِيمَةِ الضَّادِ المِئَوِيَّةِ (ض = 800 = ثَمَانِي مِئَاتٍ كَامِلَةٍ)، وَتَعَلُّمِ مَهَارَةِ «القِيَاسِ بِالأَدَوَاتِ» كَمَا كَانَ شَمْوِيلُ يَقِيسُ طُولَ الرِّجَالِ بِعَصَا النُّبُوَّةِ وَيَزِنُ الكَفَاءَةَ بِقَرْنِ الزَّيْتِ، وَرَسْمِ حَرْفِ الضَّادِ مَعَ إِبْرَازِ «سِنِّ الضَّادِ» وَنُقْطَتِهَا."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ البَسْطَةِ فِي الجِسْمِ وَاسْتِقَامَةِ القَامَةِ وَالمَسِيرِ الطَّوِيلِ: تَدْرِيبُ الرِّجْلَيْنِ وَالجَسَدِ عَلَى تَمَارِينِ التَّمَدُّدِ وَاسْتِقَامَةِ الظَّهْرِ وَالقَامَةِ لِتَحْقِيقِ ﴿وَزَادَهُ بَسْطَةً فِي الْعِلْمِ وَالْجِسْمِ﴾، وَرِيَاضَةِ المَشْيِ النَّشِيطِ فِي البَحْثِ عَنِ الضَّالَّةِ وَإِعَانَةِ الوَالِدَيْنِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الزَّيْتِ المُبَارَكِ (دُهْنِ القُدْسِ) وَالغِذَاءِ المُنَمِّي لِلعَقْلِ وَالبَدَنِ: تَعَلُّمُ فَوَائِدِ زَيْتِ الزَّيْتُونِ النَّقِيِّ أَكْلًا وَادِّهَانًا فِي تَقْوِيَةِ الأَعْصَابِ وَالعِظَامِ (حَيْثُ كَانَ الأَنْبِيَاءُ يَدْهُنُونَ بِزَيْتِ القُدْسِ المُبَارَكِ)، وَأَهَمِّيَّةِ الغِذَاءِ الطَّبِيعِيِّ المتَوَازِنِ الَّذِي يَبْنِي قُوَّةَ العَقْلِ (العِلْمِ) وَقُوَّةَ العَضَلَاتِ (الجِسْمِ) مَعًا."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ الرِّضَا بِحُكْمِ اللهِ وَتَرْكِ الحَسَدِ وَالتَّفَاخُرِ بِالأَمْوَالِ: تَعَلُّمُ أَنَّ كَرَامَةَ الإِنْسَانِ عِنْدَ اللهِ بِالتَّقْوَى وَالعِلْمِ وَالأَمَانَةِ لَا بِكَثْرَةِ المَالِ وَالثِّيَابِ، وَالتَّسْلِيمِ الكَامِلِ لِمَنِ اخْتَارَهُ اللهُ إِمَامًا وَقَائِدًا (كَمَا بَيَّنَ أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ أَنَّ آيَةَ طَالُوتَ وَشَمْوِيلَ هِيَ أَصْلٌ فِي إِمَامَةِ أَمِيرِ المُؤْمِنِينَ وَالأَئِمَّةِ الأَطْهَارِ)."
      }
    },
    "grammar": {
      "topic": "الضَّمَائِرُ المُنْفَصِلَةُ فِي بِدَايَةِ الجُمْلَةِ: (أَنَا، نَحْنُ، هُوَ، هِيَ)",
      "rule": "الضَّمَائِرُ (أَنَا، نَحْنُ، هُوَ، هِيَ) أَسْمَاءٌ نَبْدَأُ بِهَا الجُمْلَةَ الاِسْمِيَّةَ، وَيَأْتِي الخَبَرُ بَعْدَهَا مَرْفُوعًا بِالضَّمَّةْ.",
      "example": "أَنَا مُجْتَهِدٌ — نَحْنُ مُتَعَاوِنُونَ — هُوَ صَادِقٌ — هِيَ مُهَذَّبَةٌ.",
      "focusWord": "أَنَا / نَحْنُ / هُوَ / هِيَ",
      "q": "اخْتَرِ الضَّمِيرَ المُنَاسِبَ لِلجُمْلَةِ: «... طَالِبَةٌ نَجِيبَةٌ»:",
      "opts": [
        "هِيَ",
        "هُوَ",
        "نَحْنُ",
        "فِي"
      ]
    },
    "earIirab": {
      "topic": "رَفْعُ الخَبَرِ بَعْدَ الضَّمَائِرِ بِالضَّمَّةِ (ـٌ)",
      "rule": "الاِسْمُ الوَاقِعُ بَعْدَ الضَّمِيرِ المُنْفَصِلِ يُعْرَبُ خَبَرًا مَرْفُوعًا بِالضَّمَّةِ الظَّاهِرَةِ (ـٌ).",
      "sentence": "هُوَ قَاضٍ عَادِلٌ بِالحَقِّ.",
      "targetWord": "عَادِلٌ",
      "caseAns": "مَرْفُوعٌ بِالضَّمَّةِ (ـٌ)"
    },
    "math": {
      "numVal": 89,
      "numName": "تِسْعَةٌ وَثَمَانُونَ",
      "eqDisplay": "9 + 80 = 89",
      "subDisplay": "89 - 9 = 80",
      "compDisplay": "89 < 90",
      "q1": {
        "stem": "مَا هُوَ العَدَدُ التَّالِي مُبَاشَرَةً لِلعَدَدِ (89)؟",
        "focus": "89 + 1 = ؟",
        "ans": "90 (تِسْعُونَ)",
        "wrong": [
          "88",
          "80",
          "100"
        ]
      },
      "q2": {
        "stem": "احْسِبْ تَرْكِيبَ العَدَدِ:",
        "focus": "9 + 80 = ؟",
        "ans": "89 (تِسْعَةٌ وَثَمَانُونَ)",
        "wrong": [
          "98",
          "80",
          "79"
        ]
      }
    },
    "sport": {
      "title": "ضَمُّ الرُّكْبَتَيْنِ وَإِطَالَةُ الظَّهْرِ المُرِيحَةُ",
      "middleText": "أَجْلِسُ عَلَى البِسَاطِ وَأَضُمُّ رُكْبَتَيَّ إِلَى صَدْرِي بِلُطْفٍ مَعَ إِرْخَاءِ الكَتِفَيْنِ وَأَخْذِ زَفِيرٍ هَادِئْ. يُرِيحُ هٰذَا التَّمْرِينُ عَضَلَاتِ أَسْفَلِ الظَّهْرِ وَيَمْنَحُ الجِسْمَ سَكِينَةً وَاسْتِرْخَاءً."
    },
    "sci": {
      "title": "المَحَالِيلُ وَالتَّفَاعُلَاتُ وَالحَوَامِضُ الطَّبِيعِيَّةُ",
      "summaryThird": "عِنْدَمَا يَذُوبُ المِلْحُ أَوِ العَسَلُ فِي المَاءِ يَتَكَوَّنُ مَحْلُولٌ مُتَجَانِسٌ، وَتَحْتَوِي الفَوَاكِهُ كَاللَّيْمُونِ وَالرُّمَّانِ عَلَى أَحْمَاضٍ طَبِيعِيَّةٍ نَافِعَةٍ تُقَوِّي المَنَاعَةْ.",
      "focusConcept": "الذَّوَبَانُ وَالمَحْلُولُ المَائِيُّ",
      "factAns": "امْتِزَاجُ المِلْحِ أَوِ العَسَلِ فِي المَاءِ بِانْتِظَامْ"
    },
    "rightsSummary": {
      "title": "حَقُّ الجَارِ وَالصَّدِيقِ (حُور وَسُرُور - 26)",
      "storySentence": "أَهْدَتْ حُورُ وَسُرُورٌ طَبَقًا مِنَ التَّمْرِ وَالفَاكِهَةِ لِجَارِهِمَا، لِأَنَّ مِنْ حَقِّ الجَارِ إِكْرَامَهُ وَعِيَادَتَهُ إِذَا مَرِضَ وَكَفَّ الأَذَى عَنْهْ.",
      "applyAction": "أُحْسِنُ إِلَى جَارِي وَصَدِيقِي بِالسَّلَامِ وَالكَلِمَةِ الطَّيِّبَةْ."
    },
    "rightsFullTitle": "(41) حق المستنصح + (42) حق الناصح",
    "rightsQuote": "وَأمّــا حَقُّ المُسْتَنصِحِ فَإنَّ حَقَّهُ أَنْ تُؤَدِّيَ إلَيهِ النَّصِيحَةَ عَلَى الحَقِّ الَّذِي تَرَى لَهُ أنّهُ يحْمِلُ وَتخرُجَ المَخرَجَ الَّذِي يَلينُ عَلَى مَسَـــــــــــــامِعِهِ، وتُكَلِّمَهُ مِنَ الْكَلامِ بمَا يُطِيقُهُ عَقلُهُ، فَإنَّ لِكُلِّ عَقْل طَبقَــــــــــــــــــةً مِنَ الْكَلامِ يَعْرِفُــــــــهُ ويَجْتَنِبُهُ، وَلْيَكُنْ مَذهَبَكَ الرَّحْمَـــةَ. ولا قُوَّةَ إلا باللهِ. | وَأمّــــــا حَقُّ النَّاصِحِ فَأَنْ تُلِينَ لَهُ جَنَاحَكَ ثُمَّ تشرأب لَهُ قَلبَكَ وَتفْتَحَ لَهُ سَـــــــــمْعَكَ حتَّى تَفْهَمَ عَنهُ نصِيحَتَهُ، ثُمَّ تنْظُرَ فِيهَـــــا، فَإنْ كَانَ وُفّقَِ فِيهَا لِلصَّوَاب حَمِدْتَ اللَّهَ عَلَى ذَلِكَ وَقَبلْتَ مِنْـــــــــــــــــــهُ وَعَرَفْتَ لَهُ نَصِيحَتَهُ، وَإنْ لَمْ يَكُنْ وُفّقَِ لَهَا فِيهَا رَحِمْتَهُ وَلَمْ تتَّهِمَهُ وَعَلِمْتَ أَنَّهُ لَمْ يألُكَ نُصْحًا إلا أنَّهُ أَخطَـــــأَ إلا أَنْ يَكُونَ عِنْدَكَ مُسْتَحِقًّا لِلتُّهْمَةِ فلا تَعْبَـــــأْ بشيء مِنْ أَمْرِهِ عَلَى كُلِّ حَال. ولا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (41) حق المستنصح + (42) حق الناصح",
        "text": "وَأمّــا حَقُّ المُسْتَنصِحِ فَإنَّ حَقَّهُ أَنْ تُؤَدِّيَ إلَيهِ النَّصِيحَةَ عَلَى الحَقِّ الَّذِي تَرَى لَهُ أنّهُ يحْمِلُ وَتخرُجَ المَخرَجَ الَّذِي يَلينُ عَلَى مَسَـــــــــــــامِعِهِ، وتُكَلِّمَهُ مِنَ الْكَلامِ بمَا يُطِيقُهُ عَقلُهُ، فَإنَّ لِكُلِّ عَقْل طَبقَــــــــــــــــــةً مِنَ الْكَلامِ يَعْرِفُــــــــهُ ويَجْتَنِبُهُ، وَلْيَكُنْ مَذهَبَكَ الرَّحْمَـــةَ. ولا قُوَّةَ إلا باللهِ. | وَأمّــــــا حَقُّ النَّاصِحِ فَأَنْ تُلِينَ لَهُ جَنَاحَكَ ثُمَّ تشرأب لَهُ قَلبَكَ وَتفْتَحَ لَهُ سَـــــــــمْعَكَ حتَّى تَفْهَمَ عَنهُ نصِيحَتَهُ، ثُمَّ تنْظُرَ فِيهَـــــا، فَإنْ كَانَ وُفّقَِ فِيهَا لِلصَّوَاب حَمِدْتَ اللَّهَ عَلَى ذَلِكَ وَقَبلْتَ مِنْـــــــــــــــــــهُ وَعَرَفْتَ لَهُ نَصِيحَتَهُ، وَإنْ لَمْ يَكُنْ وُفّقَِ لَهَا فِيهَا رَحِمْتَهُ وَلَمْ تتَّهِمَهُ وَعَلِمْتَ أَنَّهُ لَمْ يألُكَ نُصْحًا إلا أنَّهُ أَخطَـــــأَ إلا أَنْ يَكُونَ عِنْدَكَ مُسْتَحِقًّا لِلتُّهْمَةِ فلا تَعْبَـــــأْ بشيء مِنْ أَمْرِهِ عَلَى كُلِّ حَال. ولا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ شَمْوِيلُ (ع): آدَابُ الرِّضَا بِحُكْمِ اللهِ وَتَرْكِ الحَسَدِ وَالتَّفَاخُرِ بِالأَمْوَالِ: تَعَلُّمُ أَنَّ كَرَامَةَ الإِنْسَانِ عِنْدَ اللهِ بِالتَّقْوَى وَالعِلْمِ وَالأَمَانَةِ لَا بِكَثْرَةِ المَالِ وَالثِّيَابِ، وَالتَّسْلِيمِ الكَامِلِ لِمَنِ اخْتَارَهُ اللهُ إِمَامًا وَقَائِدًا (كَمَا بَيَّنَ أَهْلُ البَيْتِ عَلَيْهِمُ السَّلَامُ أَنَّ آيَةَ طَالُوتَ وَشَمْوِيلَ هِيَ أَصْلٌ فِي إِمَامَةِ أَمِيرِ المُؤْمِنِينَ وَالأَئِمَّةِ الأَطْهَارِ)."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المستنصح",
        "text": "كان الشتاء يقترب، فقررت العائلة تجهيز خزانة الملابس. فتحت الأم الباب وقالت: \"هيا يا أحبائي،حان وقت استبدال ملابس الصيف بملابس الشتاء.\" أثناء الترتيب، اقترحت حور بحماس: \"لنقرر نحن ما نريد الاحتفاظ به قبل أن تتحدث أمي!\" لكن نور هز رأسه بحكمة: \"من الأفضل أن نستشير أمي أولاً،فهي أعلم بما يناسبنا.\" اتجها إلى أمهما وسألاها بأدب: \"كيف نميز بين ما نحتاجه وما لا نحتاجه؟\" ابتسمت الأم فرحة بوعيهما: \"أحسنتما!أولاً نختبر المقاسات، ثم نتأكد من حالة الملابس، وأخيراً نتبرع بما لا يناسبنا.\" وبينما هم يعملون، ظهرت المشكلة مع لينا الصغيرة التي أعلنت: \"لن أرتدي ملابس الشتاء الثقيلة!أفضل فساتيني الجميلة.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المستنصح",
        "text": "ابتسمت الأم، و اقتربت منها بهدوء: \"هل تسمحين لي أن أشرح لك لماذا نحتاج ملابس الشتاء؟\" بعد أن استمعت لينا لشرح أمها دون اقتناع، تدخل نور بلطف: \"دعيني أخبرك بما حدث معي يا لينا.في السنة الماضية، ارتديت الحذاء الصيفي في يوم بارد فابتل جواربي و شعرت ببرد شديد ، فمرضت أسبوعاً كاملاً.\" بدأت لينا تدرك أهمية الأمر، فقالت: \"حقا! ماذا افعل لا اريد ان امرض من البرد؟\" عرضت حور بحماس: \"لدي سترة لم تعد تناسبني،هل تريدين تجربتها انها تشعر بالدفء ؟\" عندما ارتدت لينا السترة، أعجبتها كثيراً: \"إنها جميلة!شكراً لكم.\" في نهاية اليوم، جمعتهم الأم وقالت: \"اليوم تساعدنا فأنجزنا شيئاًمهماً: طلب النصيحة  ساعدكم على اتخاذ طريق اسهل علي و عليكم و على من سيأخذ الملابس التي لم تعد تناسبكم. والتعاون بيننا يجعل المهمات أسهل وأجمل.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الناصح",
        "text": "وبينما كانت الأسرة تواصل ترتيب الملابس الشتوية وفرزها، دقّ باب المنزل. فتحت حور الباب، فإذا هو ابن خالتهم سليم جاء لزيارتهم. قال سليم وهو يضحك: – \"ما هذا يا جماعة؟ هل افتتحتم متجر ملابس هنا؟\" ضحك الجميع ودعوه للدخول. شرحوا له ما يفعلون: – \"نرتب الملابس القديمة، نختار ما نحتفظ به، وما سنتبرع به، وما يحتاج إصلاحًا.\" جلس سليم يراقب لفترة وهو صامت، ثم لاحظ شيئًا غريبًا. كان هناك معطف صوفي كبير وضعته حور في كيس للمهملات بسرعة. قال سليم بهدوء: – \"هل تسمحون لي بكلمة… نصيحة صغيرة؟\" رد نور بسرعة: – \"أكيد، تفضل، نصيحتك مهمة.\" أشار سليم إلى المعطف وقال: – \"هذا المعطف يبدو جديدًا جدًا، لماذا ترمون به؟\" قالت حور بلا اهتمام: – \"لأنه لم يعجبني… ثقيل جدًا ولا أحب لونه.\" فقال سليم بلطف: – \"لكننا الآن في شتاء بارد… هناك من يتمنى معطفًا واحدًا فقط ليدفئه. ربما رأيك في اللون ليس مهمًا أمام حاجة إنسان للدفء.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الناصح",
        "text": "سكتت حور قليلاً. كلامه دخل إلى قلبها. لكنها سألت بصدق: – \"وماذا تقترح؟\" قال سليم: – \"أقترح أن يكون اختيار التبرعات مبنيًا على حاجة الناس، لا على ذوقنا. ما دمنا سنعطي، فلنعطِ الأفضل.\" نظرت الأم إلى سليم وقالت بإعجاب: – \"نصيحتك طيبة يا سليم. جزاك الله خيرًا.\" نظر نور إليه بابتسامة: – \"وأنا أشكرك لأنك ذكّرتنا بنية العطاء الحقيقية.\" ثم التفت إلى حور وقال: – \"هل تغيرين رأيك بشأن المعطف؟\" هزت رأسها وقالت: – \"نعم. لقد قبلت النصيحة يبدو ذلك اكثر حكمة. سأضعه مع التبرعات… وأتمنى أن ينتفع به أحد.\" قالت الأم: – \"سليم الناصح كلنا نقدر نصيحتك. وابنائي: سماعكم باحترام و شكركم، و عظم تكبر افرحني. فلا أحد كبير على النصيحة، ولا أحد صغير عنها.\" ابتسم الجميع، وأكملوا ترتيب الملابس بنية صادقة وقلوب متعاونة."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّابِعَةُ: السِّيمْيَاءُ وَالخِيمْيَاءُ وَالكِيمْيَاءُ",
      "topic": "الدُّرُوسُ (4، 5، 6): الرَّوَابِطُ الكِيمْيَائِيَّةُ وَهَنْدَسَةُ الجُزَيْئَاتِ — المُرَكَّبَاتُ وَالمَخَالِيطُ وَالمَحَالِيلُ — التَّفَاعُلَاتُ الكِيمْيَائِيَّةُ وَالأَحْمَاضُ وَالقَوَاعِدُ",
      "coverImg": "assets/y7/scince/s26.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s26.1.jpg",
          "text": "الدَّرْسُ (4) الرَّوَابِطُ الكِيمْيَائِيَّةُ وَهَنْدَسَةُ الجُزَيْئَاتِ: تَتَّحِدُ الذَّرَّاتُ لِتَسْتَقِرَّ وَتَمْلَأَ مَدَارَاتِهَا الخَارِجِيَّةَ؛ وَأَنْوَاعُ الرَّوَابِطِ: الرَّابِطَةُ الأَيُونِيَّةُ بِالفَقْدِ وَالاكْتِسَابِ (كَمِلْحِ الطَّعَامِ)، وَالرَّابِطَةُ التَّسَاهُمِيَّةُ بِالمُشَارَكَةِ (كَجُزَيْءِ المَاءِ H2O)، وَالرَّابِطَةُ الفِلِزِّيَّةُ فِي المَعَادِنِ."
        },
        {
          "img": "assets/y7/scince/s26.2.jpg",
          "text": "الدَّرْسُ (5) المُرَكَّبَاتُ وَالمَخَالِيطُ وَالمَحَالِيلُ وَطُرُقُ الفَصْلِ: المُرَكَّبُ اتِّحَادٌ كِيمْيَائِيٌّ لِعُنْصُرَيْنِ أَوْ أَكْثَرَ بِصِفَاتٍ جَدِيدَةٍ (كَالمَاءِ وَالمِلْحِ)، أَمَّا المَخْلُوطُ فَمَزْجٌ دُونَ اتِّحَادٍ كِيمْيَائِيٍّ (غَيْرُ مُتَجَانِسٍ كَالسَّلَطَةِ وَالمُكَسَّرَاتِ، أَوْ مَحْلُولٌ مُتَجَانِسٌ كَذَوَبَانِ السُّكَّرِ فِي المَاءِ)؛ وَنَفْصِلُ المَوَادَّ بِالتَّرْشِيحِ وَالتَّبْخِيرِ وَالجَذْبِ المِغْنَاطِيسِيِّ."
        },
        {
          "img": "assets/y7/scince/s26.3.jpg",
          "text": "الدَّرْسُ (6) التَّفَاعُلَاتُ الكِيمْيَائِيَّةُ وَالأَحْمَاضُ وَالقَوَاعِدُ: التَّفَاعُلُ الكِيمْيَائِيُّ اتِّحَادُ مَوَادَّ لِتَكْوِينِ مَادَّةٍ جَدِيدَةٍ مَعَ حِفْظِ الكُتْلَةِ (كَمِّيَّةُ المَوَادِّ قَبْلَ التَّفَاعُلِ وَبَعْدَهُ مُتَسَاوِيَةٌ)، وَمِنْهُ الأَكْسَدَةُ وَالتَّفَاعُلَاتُ الطَّارِدَةُ وَالمَاصَّةُ لِلْحَرَارَةِ. وَمِقْيَاسُ الحُمُوضَةِ (pH) مِنْ 0 إِلَى 14: أَقَلُّ مِنْ 7 أَحْمَاضٌ (كَاللَّيْمُونِ وَالخَلِّ)، وَأَكْثَرُ مِنْ 7 قَوَاعِدُ (كَالصَّابُونِ)، وَرَقْمُ 7 مُتَعَادِلٌ (كَالمَاءِ النَّقِيِّ)."
        }
      ],
      "text": "الدَّرْسُ (4) الرَّوَابِطُ الكِيمْيَائِيَّةُ وَهَنْدَسَةُ الجُزَيْئَاتِ: تَتَّحِدُ الذَّرَّاتُ لِتَسْتَقِرَّ وَتَمْلَأَ مَدَارَاتِهَا الخَارِجِيَّةَ؛ وَأَنْوَاعُ الرَّوَابِطِ: الرَّابِطَةُ الأَيُونِيَّةُ بِالفَقْدِ وَالاكْتِسَابِ (كَمِلْحِ الطَّعَامِ)، وَالرَّابِطَةُ التَّسَاهُمِيَّةُ بِالمُشَارَكَةِ (كَجُزَيْءِ المَاءِ H2O)، وَالرَّابِطَةُ الفِلِزِّيَّةُ فِي المَعَادِنِ. الدَّرْسُ (5) المُرَكَّبَاتُ وَالمَخَالِيطُ وَالمَحَالِيلُ وَطُرُقُ الفَصْلِ: المُرَكَّبُ اتِّحَادٌ كِيمْيَائِيٌّ لِعُنْصُرَيْنِ أَوْ أَكْثَرَ بِصِفَاتٍ جَدِيدَةٍ (كَالمَاءِ وَالمِلْحِ)، أَمَّا المَخْلُوطُ فَمَزْجٌ دُونَ اتِّحَادٍ كِيمْيَائِيٍّ (غَيْرُ مُتَجَانِسٍ كَالسَّلَطَةِ وَالمُكَسَّرَاتِ، أَوْ مَحْلُولٌ مُتَجَانِسٌ كَذَوَبَانِ السُّكَّرِ فِي المَاءِ)؛ وَنَفْصِلُ المَوَادَّ بِالتَّرْشِيحِ وَالتَّبْخِيرِ وَالجَذْبِ المِغْنَاطِيسِيِّ. الدَّرْسُ (6) التَّفَاعُلَاتُ الكِيمْيَائِيَّةُ وَالأَحْمَاضُ وَالقَوَاعِدُ: التَّفَاعُلُ الكِيمْيَائِيُّ اتِّحَادُ مَوَادَّ لِتَكْوِينِ مَادَّةٍ جَدِيدَةٍ مَعَ حِفْظِ الكُتْلَةِ (كَمِّيَّةُ المَوَادِّ قَبْلَ التَّفَاعُلِ وَبَعْدَهُ مُتَسَاوِيَةٌ)، وَمِنْهُ الأَكْسَدَةُ وَالتَّفَاعُلَاتُ الطَّارِدَةُ وَالمَاصَّةُ لِلْحَرَارَةِ. وَمِقْيَاسُ الحُمُوضَةِ (pH) مِنْ 0 إِلَى 14: أَقَلُّ مِنْ 7 أَحْمَاضٌ (كَاللَّيْمُونِ وَالخَلِّ)، وَأَكْثَرُ مِنْ 7 قَوَاعِدُ (كَالصَّابُونِ)، وَرَقْمُ 7 مُتَعَادِلٌ (كَالمَاءِ النَّقِيِّ).",
      "q1": {
        "q": "مَا نَوْعُ الرَّابِطَةِ الكِيمْيَائِيَّةِ فِي جُزَيْءِ المَاءِ (H2O) وَفِي مِلْحِ الطَّعَامِ؟",
        "focusWord": "الرَّوَابِطُ الكِيمْيَائِيَّةُ",
        "options": [
          {
            "text": "رَابِطَةٌ تَسَاهُمِيَّةٌ فِي جُزَيْءِ المَاءِ، وَرَابِطَةٌ أَيُونِيَّةٌ فِي مِلْحِ الطَّعَامِ",
            "correct": true
          },
          {
            "text": "رَابِطَةٌ مِغْنَاطِيسِيَّةٌ فِي المَاءِ",
            "correct": false
          },
          {
            "text": "لَا تُوجَدُ رَوَابِطُ بَيْنَ الذَّرَّاتِ",
            "correct": false
          },
          {
            "text": "رَابِطَةٌ صَوْتِيَّةٌ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نَفْصِلُ الرَّمْلَ عَنِ المَاءِ، وَالأَمْلَاحَ الذَّائِبَةَ عَنِ المَاءِ، وَبُرَادَةَ الحَدِيدِ عَنِ الرَّمْلِ؟",
        "focusWord": "طُرُقُ فَصْلِ المَوَادِّ",
        "options": [
          {
            "text": "بِالتَّرْشِيحِ لِلرَّمْلِ، وَالتَّبْخِيرِ لِلْأَمْلَاحِ الذَّائِبَةِ، وَالجَذْبِ المِغْنَاطِيسِيِّ لِلْحَدِيدِ",
            "correct": true
          },
          {
            "text": "بِالتَّلْوِينِ فَقَطْ",
            "correct": false
          },
          {
            "text": "بِالكُسُوفِ وَالخُسُوفِ",
            "correct": false
          },
          {
            "text": "بِالسَّمَّاعَةِ الطِّبِّيَّةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَمْ تَبْلُغُ قِيمَةُ الرَّقْمِ الهِيدْرُوجِينِيِّ (pH) لِلْمَاءِ النَّقِيِّ المُتَعَادِلِ، وَلِلْأَحْمَاضِ، وَلِلْقَوَاعِدِ؟",
        "focusWord": "مِقْيَاسُ الحُمُوضَةِ pH",
        "options": [
          {
            "text": "رَقْمُ 7 مُتَعَادِلٌ (المَاءُ)، وَأَقَلُّ مِنْ 7 أَحْمَاضٌ (اللَّيْمُونُ)، وَأَكْثَرُ مِنْ 7 قَوَاعِدُ (الصَّابُونُ)",
            "correct": true
          },
          {
            "text": "رَقْمُ 14 لِلْمَاءِ النَّقِيِّ",
            "correct": false
          },
          {
            "text": "رَقْمُ 0 لِلصَّابُونِ",
            "correct": false
          },
          {
            "text": "رَقْمُ 100 لِلَّيْمُونِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الرَّابِطَةُ الأَيُونِيَّةُ وَالتَّسَاهُمِيَّةُ",
          "left": "مِلْحُ الطَّعَامِ (أَيُونِيَّةٌ) وَجُزَيْءُ المَاءِ H2O (تَسَاهُمِيَّةٌ)"
        },
        {
          "right": "طُرُقُ فَصْلِ المَخَالِيطِ",
          "left": "التَّرْشِيحُ وَالتَّبْخِيرُ وَالجَذْبُ المِغْنَاطِيسِيُّ"
        },
        {
          "right": "مِقْيَاسُ الحُمُوضَةِ (pH)",
          "left": "أَقَلُّ مِنْ 7 حَمْضِيٌّ، وَ7 مُتَعَادِلٌ، وَأَكْثَرُ مِنْ 7 قَاعِدِيٌّ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرِ المَفَاهِيمَ الصَّحِيحَةَ فِي المُرَكَّبَاتِ وَالتَّفَاعُلَاتِ الكِيمْيَائِيَّةِ:",
        "correct": [
          "جُزَيْءُ المَاءِ H2O مُرَكَّبٌ تَسَاهُمِيٌّ",
          "المَحْلُولُ مَخْلُوطٌ مُتَجَانِسٌ",
          "قَانُونُ حِفْظِ الكُتْلَةِ فِي التَّفَاعُلِ",
          "المَاءُ النَّقِيُّ مُتَعَادِلٌ (pH = 7)"
        ],
        "wrong": [
          "تَذَوُّقُ المُنَظِّفَاتِ الكِيمْيَائِيَّةِ",
          "مَزْجُ المُنَظِّفَاتِ المَنْزِلِيَّةِ الخَطِرَةِ"
        ]
      },
      "applyStep": "أُمَيِّزُ فِي مَطْبَخِنَا بَيْنَ المَخْلُوطِ غَيْرِ المُتَجَانِسِ (كَالسَّلَطَةِ) وَالمَحْلُولِ المُتَجَانِسِ (كَالمَاءِ وَالمِلْحِ)."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt26.jpg",
      "title": "الدَّرْسُ (11): مَسَارُ التَّوَازُنِ وَاليَقَظَةِ — رُوتِينٌ تَدْرِيبِيٌّ مُتَكَامِلٌ فِي 30 دَقِيقَةً",
      "subtitle": "لَفُّ الخَصْرِ، تَمَدُّدُ العَضَلَةِ الخَلْفِيَّةِ، الطَّعَنَاتُ الجَانِبِيَّةُ، الرَّدُّ عَلَى الإِشَارَاتِ، وَوَضْعِيَّةُ المُثَلَّثِ",
      "slideText": "🧭 الدَّرْسُ (11) مَسَارُ التَّوَازُنِ وَاليَقَظَةِ (رُوتِينٌ مُتَكَامِلٌ فِي 30 دَقِيقَةً): (1) الوَعْيُ (دَقِيقَةٌ وَنِصْفٌ): لَفُّ الخَصْرِ بِهُدُوءٍ وَتَوَازُنٍ. (2) الاسْتِطَالَةُ (دَقِيقَةٌ وَنِصْفٌ): تَمَدُّدُ العَضَلَةِ الخَلْفِيَّةِ لِلسَّاقِ. (3) النُّمُوُّ العَضَلِيُّ (10-15 عَدَّةً): الطَّعَنَاتُ الجَانِبِيَّةُ (Side Lunges). (4) الاسْتِجَابَةُ العَصَبِيَّةُ (دَقِيقَتَانِ): الجَرْيُ الخَفِيفُ وَالرَّدُّ الفَوْرِيُّ عَلَى الإِشَارَاتِ الصَّوْتِيَّةِ. (5) التَّدَفُّقُ (يُؤَدَّى أَخِيرًا فَقَطْ — دَقِيقَةٌ وَاحِدَةٌ): وَضْعِيَّةُ المُثَلَّثِ لِلْإِطَالَةِ وَالاتِّزَانِ.",
      "q1": {
        "q": "مَا تَمْرِينُ النُّمُوِّ العَضَلِيِّ فِي (الدَّرْسِ الحَادِيَ عَشَرَ: مَسَارِ التَّوَازُنِ وَاليَقَظَةِ)؟",
        "focusWord": "الطَّعَنَاتُ الجَانِبِيَّةُ",
        "options": [
          {
            "text": "تَمْرِينُ الطَّعَنَاتِ الجَانِبِيَّةِ (10-15 عَدَّةً) لِتَقْوِيَةِ السَّاقَيْنِ وَالتَّوَازُنِ",
            "correct": true
          },
          {
            "text": "النَّوْمُ عَلَى البَطْنِ",
            "correct": false
          },
          {
            "text": "الجُلُوسُ عَلَى الكُرْسِيِّ",
            "correct": false
          },
          {
            "text": "تَحْرِيكُ الأَصَابِعِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "كَيْفَ نَبْدَأُ فَقْرَتَيِ الوَعْيِ وَالاسْتِطَالَةِ فِي مَسَارِ التَّوَازُنِ وَاليَقَظَةِ؟",
        "focusWord": "لَفُّ الخَصْرِ وَتَمَدُّدُ العَضَلَةِ الخَلْفِيَّةِ",
        "options": [
          {
            "text": "لَفُّ الخَصْرِ (دَقِيقَةٌ وَنِصْفٌ)، ثُمَّ تَمَدُّدُ العَضَلَةِ الخَلْفِيَّةِ لِلسَّاقِ (دَقِيقَةٌ وَنِصْفٌ)",
            "correct": true
          },
          {
            "text": "القَفْزُ المُفَاجِئُ دُونَ إِحْمَاءٍ",
            "correct": false
          },
          {
            "text": "الصُّرَاخُ العَالِي",
            "correct": false
          },
          {
            "text": "إِغْمَاضُ العَيْنَيْنِ وَالجَرْيُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا وَضْعِيَّةُ (التَّدَفُّقِ) الخِتَامِيَّةُ فِي الدَّرْسِ الحَادِيَ عَشَرَ؟",
        "focusWord": "وَضْعِيَّةُ المُثَلَّثِ",
        "options": [
          {
            "text": "وَضْعِيَّةُ المُثَلَّثِ (دَقِيقَةٌ وَاحِدَةٌ تُؤَدَّى أَخِيرًا فَقَطْ)",
            "correct": true
          },
          {
            "text": "تَمْرِينُ الضَّغْطِ",
            "correct": false
          },
          {
            "text": "القَفْزُ عَلَى الحَبْلِ",
            "correct": false
          },
          {
            "text": "الجَرْيُ السَّرِيعُ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ (الدَّرْسُ 11)",
          "left": "لَفُّ الخَصْرِ + تَمَدُّدُ العَضَلَةِ الخَلْفِيَّةِ"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ",
          "left": "الطَّعَنَاتُ الجَانِبِيَّةُ (10-15 عَدَّةً)"
        },
        {
          "right": "الاسْتِجَابَةُ وَالتَّدَفُّقُ",
          "left": "الرَّدُّ عَلَى الإِشَارَاتِ الصَّوْتِيَّةِ ثُمَّ وَضْعِيَّةُ المُثَلَّثِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ الحَادِيَ عَشَرَ (مَسَارِ التَّوَازُنِ وَاليَقَظَةِ):",
        "correct": [
          "لَفُّ الخَصْرِ (دَقِيقَةٌ وَنِصْفٌ)",
          "تَمَدُّدُ العَضَلَةِ الخَلْفِيَّةِ",
          "الطَّعَنَاتُ الجَانِبِيَّةُ (10-15 عَدَّةً)",
          "الرَّدُّ عَلَى الإِشَارَاتِ وَوَضْعِيَّةُ المُثَلَّثِ"
        ],
        "wrong": [
          "الشَّدُّ المُفَاجِئُ لِلْعَضَلَةِ الخَلْفِيَّةِ",
          "تَجَاهُلُ فَقْرَةِ الإِحْمَاءِ"
        ]
      },
      "applyStep": "أُطَبِّقُ مَسَارَ التَّوَازُنِ وَاليَقَظَةِ: لَفَّ الخَصْرِ، تَمَدُّدَ العَضَلَةِ الخَلْفِيَّةِ، الطَّعَنَاتِ الجَانِبِيَّةَ، وَوَضْعِيَّةَ المُثَلَّثِ."
    }
  },
  {
    "w": 27,
    "secNum": 7,
    "heavenName": "سَمَاءُ الجُمُعَةِ السَّابِعَةُ (ذ ض ظ غ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّابِعَةُ: الكِيمْيَاءُ وَالمَادَّةُ وَالمَحَالِيلُ وَالكِيمْيَاءُ الحَيَوِيَّةُ",
    "natureLabel": "طَاقَةُ التُّرَابِ (العَقْلُ وَالتَّفَكُّرُ وَإِعْمَارُ الأَرْضِ بِالحِكْمَةِ)",
    "ltr": "ظ",
    "jummal": 900,
    "prophet": "حَنْظَلَةُ (ع)",
    "virtue": "النُّصْحُ",
    "unitHeader": "الوَحْدَةُ السَّابِعَةُ وَالعِشْرُونَ : نَبِيُّ اللهِ حَنْظَلَةُ بْنُ صَفْوَانَ نَبِيُّ أَصْحَابِ الرَّسِّ (عَلَيْهِ السَّلَامُ)",
    "storyThird": "نَصَحَ نَبِيُّ اللهِ حَنْظَلَةُ بنُ صَفْوَانَ (ع) قَوْمَهُ بِأَمَانَةٍ وَإِخْلَاصٍ لِيَعْبُدُوا اللهَ وَيَحْفَظُوا النِّعْمَةَ، فَكَانَ مِثَالًا لِلنَّاصِحِ الصَّادِقِ الأَمِينْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (البَغْيُ وَالظُّلْمُ وَالسَّحَابَةُ الحَارِقَةُ مُقَابِلَ نُورِ الشَّهَادَةِ): نَارُ الظُّلْمِ وَالقَسْوَةِ فِي قُلُوبِ أَصْحَابِ الرَّسِّ حِينَ طَرَحُوا نَبِيَّهُمْ فِي البِئْرِ، وَالنَّارُ السَّمَاوِيَّةُ الَّتِي أَمْطَرَتْهَا السَّحَابَةُ السَّوْدَاءُ فِي يَوْمِ عِيدِهِمْ فَأَحْرَقَتْهُمْ جَمِيعًا؛ وَفِي مُقَابِلِهَا نُورُ الإِيمَانِ فِي قَلْبِ حَنْظَلَةَ وَالعَبْدِ الصَّالِحِ الَّذِي كَانَ يَسْقِيهِ وَيُطْعِمُهُ سِرًّا. B. الرِّيحُ (وَسْوَسَةُ الشَّيْطَانِ فِي الشَّجَرِ وَالعَنْقَاءُ وَالرِّيحُ العَاصِفُ): رِيحُ الوَهْمِ حِينَ دَخَلَ إِبْلِيسُ فِي سَاقِ شَجَرَةِ «شَاهْ دِرَخْت» (مَلِكِ الشَّجَرِ) وَكَلَّمَهُمْ مِنْ جَوْفِهَا لِيَعْبُدُوهَا، وَطَيَرَانُ طَائِرِ «العَنْقَاءِ» الضَّخْمِ فِي الهَوَاءِ، ثُمَّ الرِّيحُ العَاصِفُ الحَمْرَاءُ الَّتِي حَبَسَتِ القَوْمَ عِنْدَ نُزُولِ العَذَابِ. C. التُّرَابُ (العَقْلُ وَجَبَلُ دَمَاوَنْدَ وَالصَّخْرَةُ وَالقَصْرُ المَشِيدُ): حُجَّةُ حَنْظَلَةَ العَقْلِيَّةُ فِي إِبْطَالِ عِبَادَةِ الشَّجَرِ وَإِهْلَاكِ اللهِ لِلعَنْقَاءِ بِدُعَائِهِ فَوْقَ الجَبَلِ، وَحَبْسُهُ فِي قَعْرِ الرَّسِّ (البِئْرِ المَحْفُورَةِ فِي التُّرَابِ) تَحْتَ الصَّخْرَةِ العَظِيمَةِ، وَثَبَاتُ بُنْيَانِ «القَصْرِ المَشِيدِ» الرَّاسِخِ الَّذِي يَرْمُزُ لِثَبَاتِ دِينِ إِسْلَامِ مُحَمَّدٍ (صَلَّى اللهُ عَلَيْهِ وَآلِهِ) الأَكْثَرِ إِقَامَةً وَرُسُوخًا. D. المَاءُ (الطَّاعَةُ وَالنَّهْرُ العَذْبُ وَالبِئْرُ المُعَطَّلَةُ): مَاءُ النَّهْرِ العَظِيمِ («الرَّسِّ») وَالعُيُونِ الاثْنَتَيْ عَشْرَةَ الَّتِي حَرَّمُوا عَلَى النَّاسِ وَالأَنْعَامِ الشُّرْبَ مِنْهَا تَعْظِيمًا لِلشَّجَرِ، فَدَعَا حَنْظَلَةُ رَبَّهُ فَغَارَ المَاءُ فِي الأَرْضِ، وَتَجَلِّي مَعْنَى «البِئْرِ المُعَطَّلَةِ» فِي تَعْطِيلِ النَّاسِ لِلِاسْتِفَادَةِ مِنْ مَعِينِ وَلَايَةِ أَمِيرِ المُؤْمِنِينَ عَلِيٍّ (عَلَيْهِ السَّلَامُ) الفَيَّاضِ بِالعِلْمِ وَالحَيَاةِ.",
    "storyParagraphs": [
      "فِي فَلَكِ يَوْمِ الجُمُعَةِ المُنِيرْ، يَأْتِي النَّبِيُّ الرَّقْمُ سَبْعَةٌ وَعِشْرُونَ فِي مَنْزِلَةِ التُّرَابِ وَالعَقْلِ وَالثَّبَاتِ العَظِيمِ فِي وَجْهِ الظُّلْمِ وَالأَوْثَانْ، وَهُوَ نَبِيُّ أَصْحَابِ الرَّسِّ حَنْظَلَةُ بْنُ صَفْوَانَ عَلَيْهِ السَّلَامْ. وَقَدْ ذَكَرَ اللهُ قِصَّةَ قَوْمِهِ فِي القُرْآنِ الكَرِيمِ مَعَ عَادٍ وَثَمُودَ، وَفَسَّرَ أَمِيرُ المُؤْمِنِينَ عَلِيٌّ وَالإِمَامُ الرِّضَا عَلَيْهِمَا السَّلَامُ خَبَرَهُمُ العَجِيبْ؛ فَقَدْ كَانَ أَصْحَابُ الرَّسِّ يَسْكُنُونَ فِي اثْنَتَيْ عَشْرَةَ قَرْيَةً عَامِرَةً عَلَى شَاطِئِ نَهْرٍ كَبِيرٍ يُسَمَّى الرَّسَّ فِي بِلَادِ المَشْرِقِ عَلَى أَسْمَاءِ شُهُورِ السَّنَةِ الِاثْنَيْ عَشَرْ، وَكَانُوا قَدْ غَرَسُوا فِي كُلِّ قَرْيَةٍ حَبَّةً مِنْ شَجَرِ الصَّنَوْبَرِ العِمْلَاقِ وَأَجْرَوْا إِلَيْهَا عَيْنًا غَزِيرَةً مِنَ المَاءِ العَذْبْ.",
      "فَخَدَعَهُمُ الشَّيْطَانُ بِرِيحِ الوَهْمِ وَدَخَلَ فِي جَوْفِ الشَّجَرَةِ الكُبْرَى وَكَلَّمَهُمْ مِنْ دَاخِلِهَا حَتَّى ظَنُّوا أَنَّ الشَّجَرَةَ إِلٰهٌ يَعْبُدُونَهُ مِنْ دُونِ اللهِ، وَمَنَعُوا النَّاسَ وَالأَنْعَامَ أَنْ يَشْرَبُوا قَطْرَةً مِنْ مَاءِ تِلْكَ العُيُونِ إِكْرَامًا لِلشَّجَرِ، فَكَانَ فِعْلُهُمْ قَبِيحًا وَمِنْ أَشَدِّ مَا يَفْعَلُ الإِنْسَانُ إِذَا صَارَ لِنَفْسِهِ ظَالِمًا جَاهِلًا. وَفِي زَمَانِهِمْ كَانَ هُنَاكَ طَائِرٌ ضَخْمٌ جِدًّا كَأَنَّهُ الجَبَلُ يُقَالُ لَهُ العَنْقَاءُ مَغْرِبٌ لِطُولِ عُنُقِهِ يَسْكُنُ فَوْقَ جَبَلٍ شَاهِقٍ اسْمُهُ دَمَاوَنْدُ، فَلَمَّا قَلَّ صَيْدُهُ انْقَضَّ مِنَ الجَوِّ عَلَى قُرَاهُمْ يَخْطَفُ الصِّبْيَانَ وَالجَوَارِيَ.",
      "فَفَزِعَ القَوْمُ إِلَى نَبِيِّهِمْ حَنْظَلَةَ بْنِ صَفْوَانَ وَقَالُوا يَا نَبِيَّ اللهِ ادْعُ لَنَا رَبَّكَ يُرِيحُنَا مِنْ هٰذَا الطَّائِرِ الكَاسِرِ وَنُؤْمِنُ بِكَ! فَرَفَعَ حَنْظَلَةُ يَدَيْهِ إِلَى السَّمَاءِ وَدَعَا رَبَّهُ العَلِيَّ الَّذِي لَهُ جَلَالٌ عَظِيمٌ، فَأَرْسَلَ اللهُ صَاعِقَةً أَحْرَقَتِ العَنْقَاءَ فَوْقَ الجَبَلِ وَانْقَطَعَ نَسْلُهَا مِنَ الدُّنْيَا، وَظَهَرَ لِلْقَوْمِ صِدْقُ نَبِيِّهِمْ، لٰكِنَّهُمْ نَقَضُوا عَهْدَهُمْ وَعَادُوا إِلَى عِبَادَةِ شَجَرِ الصَّنَوْبَرِ وَارْتِكَابِ الفَوَاحِشِ!",
      "فَقَامَ حَنْظَلَةُ يَدْعُو قَوْمَهُ بِالعَقْلِ وَالحِكْمَةِ لَيْلًا وَنَهَارًا وَيُعَظِّمُ شَعَائِرَ اللهِ كَمَا عَظَّمَ الأَنْبِيَاءُ تَوْحِيدَ الخَالِقِ، فَلَمَّا أَصَرُّوا عَلَى كُفْرِهِمْ دَعَا حَنْظَلَةُ رَبَّهُ قَائِلًا يَا رَبِّ إِنَّ عِبَادَكَ قَدْ كَذَّبُونِي وَعَبَدُوا شَجَرَةً لَا تَضُرُّ وَلَا تَنْفَعُ فَأَيْبِسْ أَشْجَارَهُمْ لِيَعْلَمُوا قُدْرَتَكْ! فَأَصْبَحَ القَوْمُ وَقَدْ يَبِسَتْ أَشْجَارُ الصَّنَوْبَرِ كُلُّهَا وَسَقَطَ وَرَقُهَا وَذَهَبَ مَا كَانَ لَهَا مِنْ ظِلٍّ وَارِفٍ وَغَارَتْ مِيَاهُ عُيُونِهِمْ! فَاسْتَشَاطَ الأَشْرَارُ غَضَبًا وَقَالُوا إِنَّ حَنْظَلَةَ سَحَرَ آلِهَتَنَا، وَأَجْمَعُوا أَمْرَهُمْ عَلَى قَتْلِهِ!",
      "فَحَفَرُوا فِي التُّرَابِ بِئْرًا عَمِيقَةً ضَيِّقَةَ المَدْخَلِ هِيَ الرَّسُّ، وَأَلْقَوْا نَبِيَّ اللهِ حَنْظَلَةَ فِي قَعْرِهَا وَلَمْ يَرْحَمُوهُ وَهُوَ يَسْتَغِيثُ بِاللهِ مَظْلُومًا صَابِرًا، وَأَطْبَقُوا عَلَى فَمِهَا صَخْرَةً كَبِيرَةً وَقَالُوا نَتْرُكُهُ يَمُوتُ عَطَشًا وَجُوعًا! فَظَلَّ حَنْظَلَةُ فِي قَعْرِ البِئْرِ يَعْبُدُ اللهَ وَأَنِينُهُ يُسْمَعُ مِنْ تَحْتِ الصَّخْرَةِ، وَلَمْ يَرْحَمْهُ مِنْهُمْ إِلَّا رَجُلٌ وَاحِدٌ مُؤْمِنٌ هُوَ غُلَامٌ أَسْوَدُ حَطَّابٌ كَانَ يَحْتَطِبُ الحَطَبَ فَيَبِيعُهُ وَيَشْتَرِي بِثَمَنِهِ طَعَامًا وَشَرَابًا، ثُمَّ يَأْتِي فِي السِّرِّ فَيُعِينُهُ اللهُ عَلَى زَحْزَحَةِ الصَّخْرَةِ عَنْ فَمِ البِئْرِ فَيُدْلِي الطَّعَامَ وَالمَاءَ إِلَى نَبِيِّ اللهِ حَنْظَلَةَ ثُمَّ يَرُدُّ الصَّخْرَةَ كَمَا كَانَتْ؛ لِأَنَّ المُؤْمِنَ الصَّادِقَ هُوَ لِعَهْدِ الأَنْبِيَاءِ حَافِظٌ أَمِينْ.",
      "وَفِي يَوْمٍ أَرَادَ اللهُ أَنْ يُكْرِمَ نَبِيَّهُ حَنْظَلَةَ بِالشَّهَادَةِ وَالرَّاحَةِ مِنْ أَذَى قَوْمِهِ؛ فَضَرَبَ اللهُ عَلَى أُذُنِ الغُلَامِ المُؤْمِنِ بِالنَّوْمِ فِي الغَابَةِ سَبْعَةَ أَيَّامٍ، وَقَبَضَ اللهُ رُوحَ نَبِيِّهِ حَنْظَلَةَ فِي البِئْرِ طَاهِرًا شَهِيدًا وَصَعِدَتْ رُوحُهُ إِلَى جَنَّاتِ النَّعِيمِ حَيْثُ النُّورُ الَّذِي لَا يَطَالُهُ مَنْعٌ وَلَا يَكُونُ عَنِ الأَبْرَارِ مَحْظُورًا أَبَدًا. وَلَمَّا اسْتَيْقَظَ الغُلَامُ الصَّالِحُ وَجَاءَ بِالطَّعَامِ وَرَفَعَ الصَّخْرَةَ وَجَدَ نَبِيَّ اللهِ قَدْ فَارَقَ الحَيَاةَ، فَبَكَى وَأَعَادَ الصَّخْرَةَ وَقَدْ نَجَا بِإِيمَانِهِ وَحْدَهُ.",
      "وَاجْتَمَعَ أَصْحَابُ الرَّسِّ الظَّالِمُونَ فِي يَوْمِ عِيدِهِمْ وَقَدْ حَظَرَ قَادَتُهُمْ عَلَى النَّاسِ اتِّبَاعَ الحَقِّ حَتَّى تَمَلَّأَتْ قُلُوبُهُمْ بِالكِبْرِ كَمَا يَكِظُّ الإِنَاءُ بِمَا فِيهِ، فَبَعَثَ اللهُ عَلَيْهِمْ رِيحًا عَاصِفًا حَمْرَاءَ حَبَسَتْهُمْ فِي مَكَانِهِمْ لَا يَسْتَطِيعُونَ الحَرَاكَ، وَصَارَتِ الأَرْضُ تَحْتَ أَقْدَامِهِمْ حَجَرَ كِبْرِيتٍ يَتَوَقَّدُ، وَأَظَلَّتْهُمْ سَحَابَةٌ سَوْدَاءُ كَـظُلَلٍ مِنَ الدُّخَانِ فَأَمْطَرَتْ عَلَيْهِمْ نَارًا كَالقُبَّةِ فَذَابَتْ أَبْدَانُهُمْ كَمَا يَذُوبُ الرَّصَاصُ فِي النَّارِ وَهَلَكُوا عَنْ آخِرِهِمْ! وَجَعَلَ اللهُ بِلَادَهُمْ آيَةً وَقَالَ تَعَالَى فَكَأَيِّنْ مِنْ قَرْيَةٍ أَهْلَكْنَاهَا وَهِيَ ظَالِمَةٌ فَهِيَ خَاوِيَةٌ عَلَى عُرُوشِهَا وَبِئْرٍ مُعَطَّلَةٍ وَقَصْرٍ مَشِيدْ؛ وَفِي بَاطِنِ هٰذِهِ الآيَةِ العَظِيمَةِ أَنَّ البِئْرَ المُعَطَّلَةَ هِيَ وَلَايَةُ أَمِيرِ المُؤْمِنِينَ عَلِيٍّ عَلَيْهِ السَّلَامُ وَتَعْطِيلُ النَّاسِ لِلِاسْتِفَادَةِ مِنْ مَعِينِ عِلْمِهَا العَذْبِ الصَّافِي، وَأَنَّ القَصْرَ المَشِيدَ هُوَ دِينُ إِسْلَامِ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَآلِهِ المَشِيدُ وَهُوَ الدِّينُ الأَكْثَرُ إِقَامَةً وَثَبَاتًا إِلَى يَوْمِ القِيَامَةْ. وَهٰكَذَا يَتَعَلَّمُ العَاقِلُ أَنْ حَفِظَ عَهْدَ اللهِ وَوَلَايَةَ أَوْلِيَائِهِ فَيَفُوزَ بِنُورِ البَصِيرَةِ كُلَّمَا قَامَ مِنَ اللَّيْلِ وَاسْتَيْقَظْ."
    ],
    "words": [
      {
        "word": "مَظْلُومًا",
        "desc": "وسط متصل / ساكن: ـظْـ",
        "raw": "مَظْلُومًا (وسط متصل / ساكن: ـظْـ)"
      },
      {
        "word": "اسْتَيْقَظْ",
        "desc": "آخر متصل / ساكن وقفا: ـظْ",
        "raw": "اسْتَيْقَظْ (آخر متصل / ساكن وقفا: ـظْ)"
      },
      {
        "word": "ظَهَرَ",
        "desc": "أول منفصل / متحرك بالفتح: ظَـ",
        "raw": "ظَهَرَ (أول منفصل / متحرك بالفتح: ظَـ)"
      },
      {
        "word": "فَظَلَّ",
        "desc": "أول متصل / متحرك بالفتح: ـظَـ",
        "raw": "فَظَلَّ (أول متصل / متحرك بالفتح: ـظَـ)"
      },
      {
        "word": "حَنْظَلَةُ",
        "desc": "وسط متصل / متحرك بالفتح: ـظَـ",
        "raw": "حَنْظَلَةُ (وسط متصل / متحرك بالفتح: ـظَـ)"
      },
      {
        "word": "حَظَرَ",
        "desc": "وسط منفصل / متحرك بالفتح: ظَـ",
        "raw": "حَظَرَ (وسط منفصل / متحرك بالفتح: ظَـ)"
      },
      {
        "word": "حَفِظَ",
        "desc": "آخر متصل / متحرك بالفتح: ـظَ",
        "raw": "حَفِظَ (آخر متصل / متحرك بالفتح: ـظَ)"
      },
      {
        "word": "ظُلَلٍ",
        "desc": "أول منفصل / متحرك بالضم: ظُـ",
        "raw": "ظُلَلٍ (أول منفصل / متحرك بالضم: ظُـ)"
      },
      {
        "word": "حَافِظٌ",
        "desc": "آخر متصل / متحرك بالضم: ـظٌ",
        "raw": "حَافِظٌ (آخر متصل / متحرك بالضم: ـظٌ)"
      },
      {
        "word": "ظِلٍّ",
        "desc": "أول منفصل / متحرك بالكسر: ظِـ",
        "raw": "ظِلٍّ (أول منفصل / متحرك بالكسر: ظِـ)"
      },
      {
        "word": "عَظَّمَ",
        "desc": "وسط متصل / مضعف بالفتح: ـظَّـ",
        "raw": "عَظَّمَ (وسط متصل / مضعف بالفتح: ـظَّـ)"
      },
      {
        "word": "يَكِظُّ",
        "desc": "آخر متصل / مضعف بالضم: ـظُّ",
        "raw": "يَكِظُّ (آخر متصل / مضعف بالضم: ـظُّ)"
      },
      {
        "word": "يُعَظِّمُ",
        "desc": "وسط متصل / مضعف بالكسر: ـظِّـ",
        "raw": "يُعَظِّمُ (وسط متصل / مضعف بالكسر: ـظِّـ)"
      },
      {
        "word": "ظَالِمًا",
        "desc": "أول منفصل / ممدود بالألف: ظَا",
        "raw": "ظَالِمًا (أول منفصل / ممدود بالألف: ظَا)"
      },
      {
        "word": "مَحْظُورًا",
        "desc": "وسط متصل / ممدود بالواو: ـظُو",
        "raw": "مَحْظُورًا (وسط متصل / ممدود بالواو: ـظُو)"
      },
      {
        "word": "عَظِيمٌ",
        "desc": "وسط متصل / ممدود بالياء: ـظِي",
        "raw": "عَظِيمٌ (وسط متصل / ممدود بالياء: ـظِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الظَّاءِ (ظ): النُّطْقُ السَّلِيمُ لِحَرْفِ الظَّاءِ اللِّثَوِيِّ المَجْهُورِ الرِّخْوِ المُفَخَّمِ المُطْبَقِ مِنْ مَخْرَجِ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا العُلْيَا مَعَ اسْتِعْلَاءِ أَقْصَى اللِّسَانِ وَإِطْبَاقِهِ، وَالتَّمْيِيزُ الصَّوْتِيُّ الدَّقِيقُ بَيْنَهُ وَبَيْنَ الضَّادِ (غَيْرِ اللِّثَوِيَّةِ) وَالذَّالِ (المُرَقَّقَةِ)، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْوِيدُ اللِّسَانِ عَلَى الِاسْتِعَاذَةِ مِنَ الظُّلْمِ وَالدُّعَاءِ بِحِفْظِ نِعْمَةِ الدِّينِ وَالوَلَايَةِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "القُبَّةُ المُطْبَقَةُ وَالأَلِفُ القَائِمَةُ كَالقَصْرِ المَشِيدِ وَالرَّقْمُ (27): مُشَاهَدَةُ شَكْلِ حَرْفِ الظَّاءِ (ظ / ظـ / ـظـ / ـظ) المُرَكَّبِ مِنْ قُبَّةٍ بَيْضَاوِيَّةٍ كَالصَّخْرَةِ المُطْبَقَةِ عِنْدَ البِئْرِ يَقُومُ عَلَى طَرَفِهَا عَمُودٌ شَامِخٌ مُنْتَصِبٌ كَالقَصْرِ المَشِيدِ الرَّاسِخِ وَفَوْقَهُ نُقْطَةٌ مُضِيئَةٌ، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (27) (مُكَعَّبِ الثَّلَاثَةِ الكَامِلِ: 3 × 3 × 3 = 27، وَالمُوَافِقِ لِقِيمَةِ الظَّاءِ المِئَوِيَّةِ: 900 = 30 × 30)، وَالِاتِّعَاظُ البَصَرِيُّ بِآيَةِ: ﴿وَبِئْرٍ مُّعَطَّلَةٍ وَقَصْرٍ مَّشِيدٍ﴾."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "قِصَّةُ حَنْظَلَةَ وَأَصْحَابِ الرَّسِّ الكَامِلَةُ: الِاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ نَبِيِّ اللهِ حَنْظَلَةَ بْنِ صَفْوَانَ كَمَا رَوَاهَا أَمِيرُ المُؤْمِنِينَ عَلِيٌّ وَالإِمَامُ الكَاظِمُ وَالإِمَامُ الرِّضَا (عَلَيْهِمُ السَّلَامُ)، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ أَنِينِ المَظْلُومِ وَإِغَاثَتِهِ وَعَدَمِ الِانْخِدَاعِ بِأَصْوَاتِ الدَّجَلِ وَالشَّيَاطِينِ، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ سَبْعَةٌ وَعِشْرُونَ (27) وَالتِّسْعُمِائَةٍ (900) وَشُهُورُ السَّنَةِ الِاثْنَا عَشَرَ: تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (27) وَمَعْرِفَةِ قِيمَةِ الظَّاءِ المِئَوِيَّةِ (ظ = 900 = تِسْعُ مِئَاتٍ كَامِلَةٍ، وَهِيَ أَعْلَى مَرْتَبَةٍ فِي المِئَاتِ قَبْلَ الأَلْفِ)، وَحِسَابِ القُرَى الِاثْنَتَيْ عَشْرَةَ المَحَاذِيَةِ لِشُهُورِ السَّنَةِ الِاثْنَيْ عَشَرَ، وَتَدْرِيبُ اليَدِ عَلَى جَمْعِ الحَطَبِ وَكَسْبِ الرِّزْقِ الحَلَالِ لِإِعَانَةِ المُحْتَاجِينَ كَمَا فَعَلَ العَبْدُ الأَسْوَدُ المُؤْمِنُ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ السَّيْرِ فِي الغَابَاتِ وَتَسَلُّقِ الجِبَالِ وَنُصْرَةِ المَظْلُومِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى المَشْيِ القَوِيِّ فِي الغَابَاتِ وَالأَوْدِيَةِ لِلِاحْتِطَابِ وَالعَمَلِ النَّافِعِ، وَخِفَّةِ السَّعْيِ لِإِنْقَاذِ المَكْرُوبِ وَإِيصَالِ الطَّعَامِ وَالمَاءِ إِلَيْهِ فِي السِّرِّ وَالعَلَنِ."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ شَجَرِ الصَّنَوْبَرِ وَحَبِّهِ الغِذَائِيِّ وَطَهَارَةِ المِيَاهِ: تَعَلُّمُ خَصَائِصِ شَجَرِ «الصَّنَوْبَرِ» الدَّائِمِ الخُضْرَةِ وَفَوَائِدِ بُذُورِهِ الغَنِيَّةِ بِالزُّيُوتِ النَّافِعَةِ لِلقَلْبِ وَالدِّمَاغِ (مَعَ تَعَلُّمِ أَنَّ الشَّجَرَ نِعْمَةٌ مَخْلُوقَةٌ لِلهِ نَنْتَفِعُ بِثَمَرِهَا وَظِلِّهَا وَلَا نَعْبُدُهَا)، وَأَنَّ مَاءَ الأَنْهَارِ وَالعُيُونِ حَقٌّ مَبْذُولٌ لِسَقْيِ النَّاسِ وَالدَّوَابِّ فَلَا يَجُوزُ تَعْطِيلُهُ أَوْ مَنْعُهُ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "آدَابُ العِفَّةِ الكَامِلَةِ وَتَحْرِيمِ الفَوَاحِشِ وَالوَفَاءِ لِلْأَوْلِيَاءِ: تَعَلُّمُ أَنَّ مِنْ أَعْظَمِ أَسْبَابِ هَلَاكِ أَصْحَابِ الرَّسِّ تَرْكَهُمُ العِفَّةَ وَالسَّتْرَ وَانْغِمَاسَهُمْ فِي الفَوَاحِشِ وَالغِشِّ كَمَا وَرَدَ فِي رِوَايَاتِ الإِمَامِ الصَّادِقِ (عَلَيْهِ السَّلَامُ)، وَتَعَلُّمُ خُلُقِ النَّظَافَةِ وَالحَيَاءِ وَالوَفَاءِ الصَّادِقِ لِأَنْبِيَاءِ اللهِ وَأَوْلِيَائِهِ."
      }
    },
    "grammar": {
      "topic": "ظَرْفُ الزَّمَانِ وَظَرْفُ المَكَانِ المَنْصُوبُ بِالفَتْحَةِ (ـَ)",
      "rule": "ظَرْفُ الزَّمَانِ (صَبَاحًا، ظُهْرًا) وَظَرْفُ المَكَانِ (فَوْقَ، تَحْتَ، أَمَامَ) أَسْمَاءٌ تُبَيِّنُ وَقْتَ أَوْ مَكَانَ الفِعْلِ وَتُفْتَحُ بِالفَتْحَةِ (ـَ).",
      "example": "جَلَسَ الظَّبْيُ تَحْتَ الشَّجَرَةِ ظُهْرًا.",
      "focusWord": "تَحْتَ / ظُهْرًا",
      "q": "أَيُّ كَلِمَةٍ فِي جُمْلَةِ «وَقَفَ العُصْفُورُ فَوْقَ الغُصْنِ» تَدُلُّ عَلَى «ظَرْفِ المَكَانِ»؟",
      "opts": [
        "فَوْقَ",
        "وَقَفَ",
        "العُصْفُورُ",
        "الغُصْنِ"
      ]
    },
    "earIirab": {
      "topic": "نَصْبُ الظَّرْفِ بِالفَتْحَةِ (ـَ) وَجَرُّ مَا بَعْدَهُ بِالكَسْرَةِ (ـِ)",
      "rule": "الظَّرْفُ مِثْلُ (فَوْقَ، تَحْتَ، أَمَامَ) مَفْتُوحٌ بـ (ـَ)، وَالاِسْمُ بَعْدَهُ مَجْرُورٌ بِالكَسْرَةِ (ـِ).",
      "sentence": "يَسْتَرِيحُ الفَلَّاحُ تَحْتَ الظِّلِّ ظُهْرًا.",
      "targetWord": "ظُهْرًا",
      "caseAns": "ظَرْفُ زَمَانٍ مَنْصُوبٌ بِالفَتْحَةِ (ـً)"
    },
    "math": {
      "numVal": 95,
      "numName": "خَمْسَةٌ وَتِسْعُونَ",
      "eqDisplay": "5 + 90 = 95",
      "subDisplay": "95 - 5 = 90",
      "compDisplay": "95 < 100",
      "q1": {
        "stem": "احْسِبْ تَرْكِيبَ العَدَدِ:",
        "focus": "5 + 90 = ؟",
        "ans": "95 (خَمْسَةٌ وَتِسْعُونَ)",
        "wrong": [
          "59",
          "90",
          "85"
        ]
      },
      "q2": {
        "stem": "كَمْ نُضِيفُ إِلَى (95) لِنَصِلَ إِلَى المِائَةِ (100)؟",
        "focus": "95 + ؟ = 100",
        "ans": "5 (خَمْسَةٌ)",
        "wrong": [
          "10 (عَشَرَةٌ)",
          "1 (وَاحِدٌ)",
          "15"
        ]
      }
    },
    "sport": {
      "title": "اسْتِقَامَةُ الظَّهْرِ الجِدَارِيَّةُ لِلقَوَامِ السَّلِيمِ",
      "middleText": "أَقِفُ مُسْنِدًا ظَهْرِي وَكَتِفَيَّ وَرَأْسِي إِلَى الجِدَارِ بِاسْتِقَامَةٍ تَامَّةٍ مَعَ التَّنَفُّسِ الهَادِئِ العَمِيقْ. يُدَرِّبُ هٰذَا التَّمْرِينُ الجِسْمَ عَلَى الوَقْفَةِ الصِّحِّيَّةِ السَّلِيمَةِ وَيَحْمِي العَمُودَ الفَقَرِيّْ."
    },
    "sci": {
      "title": "الكِيمْيَاءُ الحَيَوِيَّةُ وَالغِذَاءُ الطَّبِيعِيُّ الكَامِلُ",
      "summaryThird": "يَحْتَاجُ جِسْمُنَا إِلَى الغِذَاءِ الطَّبِيعِيِّ الكَامِلِ الغَنِيِّ بِالبُرُوتِينَاتِ وَالفِيتَامِينَاتِ وَالمَعَادِنِ كَالعَسَلِ وَزَيْتِ الزَّيْتُونِ وَالحُبُوبِ وَالفَوَاكِهِ لِبِنَاءِ الخَلَايَا وَتَجْدِيدِ النَّشَاطْ.",
      "focusConcept": "الغِذَاءُ الطَّبِيعِيُّ المُتَوَازِنُ",
      "factAns": "بِنَاءُ خَلَايَا الجِسْمِ وَتَقْوِيَةُ المَنَاعَةْ"
    },
    "rightsSummary": {
      "title": "حَقُّ النَّصِيحَةِ وَالمَشُورَةِ الصَّادِقَةِ (حُور وَسُرُور - 27)",
      "storySentence": "تَعَلَّمَ سُرُورٌ وَحُورُ أَنَّ مَنِ اسْتَشَارَنَا فَحَقُّهُ أَنْ نُشِيرَ عَلَيْهِ بِالأَمَانَةِ وَالصِّدْقِ، وَمَنْ نَصَحَنَا بِلُطْفٍ فَحَقُّهُ أَنْ نَقْبَلَ نَصِيحَتَهُ بِشُكْرٍ وَتَوَاضُعْ.",
      "applyAction": "أَنْصَحُ أَخِي بِلُطْفٍ فِي السِّرِّ وَأَقْبَلُ النَّصِيحَةَ النَّافِعَةْ."
    },
    "rightsFullTitle": "(43) حق الكبير + (44) حق الصغير + (45) حق السائل + (46) حق المسؤول",
    "rightsQuote": "وَأمّا حَقُّ الكبيرِ فَإنَّ حَقَّهُ تَوقِيرُ سِنِّهِ وَإجْلالِ إسْلامِهِ إذَا كَانَ مِنْ أَهْلِ الْفَضلِ فِي الإسْلامِ بتَقْدِيمِهِ فِيهِ وتَرْكِ مُقَابَلَتِهِ عِنْدَ الْخِصَــــــــــامِ ولا تَسْبقْهُ إلَى طَرِيق، ولا تَؤُمَّهُ فِي طـرِيق ولا تَسْـــــــتَجْهِلْهُ. وَإنْ جَهِلَ عَلَيْكَ تحَمَّلْتَ وَأَكْرَمتَهُ بحَقِّ إسْلامِهِ مَعَ سِنِّهِ فَإنّمَـــــــا حَقُّ السِّنِّ بقَدْرِ الإسْلامِ. ولا قُوَّةَ إلا باللهِ. | وَأمّـــــــــا حَقُّ الصَّغِيرِ فَرَحْمتُهُ وتَثقِيفُهُ وتَعْلِيمُهُ وَالعَفْوُ عَنْهُ وَالسِّترُ عَلَـــــــــــــــيهِ وَالرِّفْقُ بهِ وَالمَعُونَةُ لــــــــــــــــَهُ وَالسِّترُ عَلَى جَرَائِرِ حَدَاثتِهِ فَإنّهُ سَبَبٌ لِلتَّوبَةِ وَالْمُدَارَاةُ لَـــــــــــهُ وتَرْكُ مُمَاحَكَتِهِ، فَإنَّ ذَلِكَ أَدنى لِرُشْدِهِ. | وَأمّا حَقُّ السَّائِلِ فَإعْطَاؤُهُ إذا تَيَقَّنتَ صِدْقَهُ وَقَدَرْتَ عَلَى سَدِّ حَاجَتِهِ، وَالدُّعَاءُ لَهُ فِيمَـا نزَلَ بهِ، وَالْمُعَاوَنةُ لَهُ عَلَى طَلِبَتِهِ، وَإن شَكَكْتَ فِي صِدْقِهِ وَسَبَقْتَ إلَيهِ التُّهْمَةُ لَهُ وَلَمْ تَعْزِمْ عَلَى ذَلِكَ لَمْ تَأْمَنْ أَنْ يَكُونَ مِنْ كَيْدِ الشَّيْطَانِ أَرَادَ أَنْ يَصُدَّكَ عَنِ حَظِّكَ ويَحُولَ بَيْنَكَ وبَينَ التَّقَرُّب إلَى رَبكَ فَتَرَكْتَـــــــــــــهُ بسِترِهِ وَرَدَدتَهُ رَدًّا جَـــــــمِيلاً. وَإنْ غَلَبتَ نفْسَــــــــــــــــكَ فِي أَمْرِهِ وَأَعْطَيتَهُ عَلَى مَـــــا عَرَضَ فِي نفْسِكَ مِنْهُ، فإنَّ ذلِكَ مِنْ عَزْمِ الأُمُورِ. | وَأمّــــــــا حَقُّ المَسئولِ فَحَقُّهُ إنْ أَعْطَى قُبلَ مِنْهُ مَـــــــــــــا أَعْطَى بالشُّكْرِ لَهُ وَالمَعْرِفَةِ لِفَضْلِهِ وَطَلَبَ وَجْهِ الْعُذْرِ فِي مَنعِهِ، وَأَحْسَنَ بهِ الظَّنَّ. وَاعْلَمْ أنَّهُ إنْ مَنِعَ (فَ) مَالَهُ مَنَعَ وَأَنْ لَيْسَ التَّثرِيبُ فِي مَــــــــــالِه، وَإنْ كَانَ ظَالِمًا فَإنَّ الإنسَانَ لَظلُومٌ كَفَّارٌ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (43) حق الكبير + (44) حق الصغير + (45) حق السائل + (46) حق المسؤول",
        "text": "وَأمّا حَقُّ الكبيرِ فَإنَّ حَقَّهُ تَوقِيرُ سِنِّهِ وَإجْلالِ إسْلامِهِ إذَا كَانَ مِنْ أَهْلِ الْفَضلِ فِي الإسْلامِ بتَقْدِيمِهِ فِيهِ وتَرْكِ مُقَابَلَتِهِ عِنْدَ الْخِصَــــــــــامِ ولا تَسْبقْهُ إلَى طَرِيق، ولا تَؤُمَّهُ فِي طـرِيق ولا تَسْـــــــتَجْهِلْهُ. وَإنْ جَهِلَ عَلَيْكَ تحَمَّلْتَ وَأَكْرَمتَهُ بحَقِّ إسْلامِهِ مَعَ سِنِّهِ فَإنّمَـــــــا حَقُّ السِّنِّ بقَدْرِ الإسْلامِ. ولا قُوَّةَ إلا باللهِ. | وَأمّـــــــــا حَقُّ الصَّغِيرِ فَرَحْمتُهُ وتَثقِيفُهُ وتَعْلِيمُهُ وَالعَفْوُ عَنْهُ وَالسِّترُ عَلَـــــــــــــــيهِ وَالرِّفْقُ بهِ وَالمَعُونَةُ لــــــــــــــــَهُ وَالسِّترُ عَلَى جَرَائِرِ حَدَاثتِهِ فَإنّهُ سَبَبٌ لِلتَّوبَةِ وَالْمُدَارَاةُ لَـــــــــــهُ وتَرْكُ مُمَاحَكَتِهِ، فَإنَّ ذَلِكَ أَدنى لِرُشْدِهِ. | وَأمّا حَقُّ السَّائِلِ فَإعْطَاؤُهُ إذا تَيَقَّنتَ صِدْقَهُ وَقَدَرْتَ عَلَى سَدِّ حَاجَتِهِ، وَالدُّعَاءُ لَهُ فِيمَـا نزَلَ بهِ، وَالْمُعَاوَنةُ لَهُ عَلَى طَلِبَتِهِ، وَإن شَكَكْتَ فِي صِدْقِهِ وَسَبَقْتَ إلَيهِ التُّهْمَةُ لَهُ وَلَمْ تَعْزِمْ عَلَى ذَلِكَ لَمْ تَأْمَنْ أَنْ يَكُونَ مِنْ كَيْدِ الشَّيْطَانِ أَرَادَ أَنْ يَصُدَّكَ عَنِ حَظِّكَ ويَحُولَ بَيْنَكَ وبَينَ التَّقَرُّب إلَى رَبكَ فَتَرَكْتَـــــــــــــهُ بسِترِهِ وَرَدَدتَهُ رَدًّا جَـــــــمِيلاً. وَإنْ غَلَبتَ نفْسَــــــــــــــــكَ فِي أَمْرِهِ وَأَعْطَيتَهُ عَلَى مَـــــا عَرَضَ فِي نفْسِكَ مِنْهُ، فإنَّ ذلِكَ مِنْ عَزْمِ الأُمُورِ. | وَأمّــــــــا حَقُّ المَسئولِ فَحَقُّهُ إنْ أَعْطَى قُبلَ مِنْهُ مَـــــــــــــا أَعْطَى بالشُّكْرِ لَهُ وَالمَعْرِفَةِ لِفَضْلِهِ وَطَلَبَ وَجْهِ الْعُذْرِ فِي مَنعِهِ، وَأَحْسَنَ بهِ الظَّنَّ. وَاعْلَمْ أنَّهُ إنْ مَنِعَ (فَ) مَالَهُ مَنَعَ وَأَنْ لَيْسَ التَّثرِيبُ فِي مَــــــــــالِه، وَإنْ كَانَ ظَالِمًا فَإنَّ الإنسَانَ لَظلُومٌ كَفَّارٌ. — وَفِي سِيرَةِ حَنْظَلَةُ (ع): آدَابُ العِفَّةِ الكَامِلَةِ وَتَحْرِيمِ الفَوَاحِشِ وَالوَفَاءِ لِلْأَوْلِيَاءِ: تَعَلُّمُ أَنَّ مِنْ أَعْظَمِ أَسْبَابِ هَلَاكِ أَصْحَابِ الرَّسِّ تَرْكَهُمُ العِفَّةَ وَالسَّتْرَ وَانْغِمَاسَهُمْ فِي الفَوَاحِشِ وَالغِشِّ كَمَا وَرَدَ فِي رِوَايَاتِ الإِمَامِ الصَّادِقِ (عَلَيْهِ السَّلَامُ)، وَتَعَلُّمُ خُلُقِ النَّظَافَةِ وَالحَيَاءِ وَالوَفَاءِ الصَّادِقِ لِأَنْبِيَاءِ اللهِ وَأَوْلِيَائِهِ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الكبير",
        "text": "في صباحٍ صيفي حار، استيقظ نور وحور مبكرين وهما في قمة الحماس. اليوم وعدهم والدهم بالذهاب إلى النهر للسباحة وقضاء وقت ممتع معًا. كانت لينا الصغيرة تقفز بين الغرف فرحًا وهي تقول: – \"سنذهب إلى النهر! سنذهب إلى النهر!\" بدأ الجميع بالتحضير. حمل نور حقيبة الطعام لكنه شعر بثقلها، فقال: – \"حور، أعينيني قليلاً!\" فقالت وهي تساعده: – \"أكيد يا أخي، يد واحدة لا تصفق!\" خرجت العائلة وركبت السيارة. وبينما هم بالطريق، فجأة اصطدمت بهم سيارة أخرى من الخلف. نزل الأب بسرعة ليتفقد الأمر، فإذا برجل كبير في السن يقف معتذرًا ومرتبكًا. قال الرجل المسن: – \"سامحوني يا بنيّ… لم أركم جيدًا… بصري ضعف في الفترة الأخيرة.\" فقال الأب بلطف واحترام: – \"لا تقلق يا عم، أهم شيء أنك بخير.\" عاد الأب إلى السيارة وهو يقول: – \"هذا الرجل كبير في السن، ومن حقه علينا أن نراعيه. لكن يجب أن يساعده أحد في القيادة لأن بصره ضعيف وقد يؤذي نفسه أو غيره دون قصد.\" هز نور رأسه مفكرًا، وشعرت حور بالتعاطف وهي تقول:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الكبير",
        "text": "– \"صحيح… الكبير يحتاج معاملة خاصة ورحمة.\" واصلوا طريقهم، وتوقفوا عند بائع خضار مسن يبيع على الطريق. اشترى الأب بطيخة كبيرة، وحين حاول البائع حملها إلى السيارة، أسرع نور إليه وقال: – \"لا يا عم، دعني أحملها أنا.\" ابتسم الرجل العجوز وقال: – \"بارك الله فيك يا بني، الأخلاق الطيبة تظهر في الأفعال.\" ولما عادوا للسيارة قالت حور: – \"هذا الرجل طيب، دائمًا يعطينا فاكهة هدية حين نمر من هنا.\" وأضاف الأب: – \"سمعت أنه يعيش مع زوجته وحدهما، لم يُرزقا أولادًا. ومع ذلك يعمل ولا يطلب من أحد شيئًا. هكذا يكون الإنسان القوي الكريم.\" فقالت لينا الصغيرة ببراءة: – \"أنا أحبه… لأنه يعطيني تفاحة!\" فضحك الجميع. وصلت العائلة إلى النهر وأمضوا يومًا جميلاً باللعب والسباحة. لكن نور وحور تعلموا شيئًا أهم من اللعب: أن احترام كبار السن ليس خيارًا، بل خلق واجب، ورحمة قبل أن يكون كلامًا."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصغير",
        "text": "🍕 يوم البيتزا السعيد في صباح يوم جميل قالت الأم لأطفالها: \"ما رأيكم يا صغاري أن نصنع البيتزا معًا اليوم؟\" قفزت لينا الصغيرة فرحًا، وابتسم نور بحماس، وقالت حور: \"يا لها من فكرة رائعة يا أمي!\" جمعت الأسرة المكونات على الطاولة وجلست الأم بينهم ترشدهم بحب. قالت الأم : \"أول خطوة نضع الطحين ثم نضيف الخميرة، هيا يا نور ابدأ أنت.\" بدأ نور بإضافة المكونات، بينما تولّت حور العجن. أما لينا فكانت تراقب بفضول كبير. لكنها أرادت المشاركة أيضًا، فمدّت يدها الصغيرة إلى كيس الطحين فانقلب منها على الطاولة وعلى الأرض! تناثر الطحين في كل مكان كأنه ثلج أبيض. قالت لينا بخجل: \"آسفة… لم أقصد…\" ابتسمت الأم وربتت على كتفها: \"لا بأس يا حبيبتي، كلنا نتعلم. هيا ننظف معًا.\" ساعدتهم الأم في التنظيف ، فهي تعرف أن الصغار يخطئون أثناء التعلم. عادوا للعمل من جديد، وقالت الأم بلطف: \"حور، استمري في العجن، ونور أضف قليلًا من الماء. ولينا، أنتِ ستجلبين صحن الزيت.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق الصغير",
        "text": "فرحت لينا لأنها أصبحت جزءًا من العمل. وبعد أن انتهت العجينة، تركوها لتختمر. وبينما كانت الأم تجهز الحشوة، أخذت لينا كرة صغيرة من العجين وصنعت منها رغيفًا صغيرًا. لم تقل الأم شيئًا ولم تعاتبها، بل ابتسمت لأنها تعرف أن فضول الصغار جزء من التعلم. عندما ارتفعت العجينة وخمرت، بدأت العائلة تفرد العجينة وتضع الحشوة. وضعت الأم يدها فوق يد لينا وهي تعلمها كيف توزّع الجبن وتقول: \"هكذا يا صغيرتي… برفق حتى تصبح البيتزا جميلة.\" دخلت البيتزا الفرن وامتلأ البيت بالرائحة الشهية. وقف نور متحمسًا ليخرج الصينية من الفرن، لكنه نسي ارتداء الكفوف الحرارية، فاحترقت يده قليلًا! صاحت حور: \"يا إلهي يا نور! كدت توقع البيتزا و نخسر الغذاء !\" لكن الأم اقتربت بهدوء ومسكت يد نور ووضعتها تحت الماء البارد قائلة: \"المهم أنك بخير يا بطل، وهذه تجربة تعلمنا أن نستعمل أدوات الأمان.\" جلست لينا أمام الصينية وهي تقول: \"أريد أن آكل الآن!\" ضحكت الأم وقالت: \"لكنها ساخنة يا أميرة قلبي، أخبريني… ما أكثر شيء أحببته في هذا اليوم؟\" وبينما بدأت لينا تتكلم، كانت الأم تُلهيها بالكلام حتى يبرد الطعام . وبعد قليل اجتمعت العائلة على المائدة، وكل واحد منهم أمامه قطعة بيتزا صنعها بيده. جلسوا يأكلون وهم يضحكون ويتذكرون ما حدث. قالت الأم: \"أنتم رائعون، أحب عندما نعمل معًا كعائلة.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق السائل",
        "text": "قصة: يدٌ تعطي…وقلبٌ يرحم كان المساء هادئاً حين رنّ الهاتف في بيت نور. كانت الجارة على الخط، وصوت القلق واضح عليها: – الجارة: السلام عليكم… هل من الممكن أن تعطوني خافض حرارة؟ ابني مريض والصيدلية مغلقة. – الأم: وعليكم السلام طبعاً يا أختي… لا تقلقي. أسرعت الأم وأعطت الدواء لنور، وقالت بلطف: – الأم: خذه بسرعة للجارة، فالمرض لا ينتظر. أعطى نور الدواء وعاد مسرعاً. شعر يومها بالسعادة لأنه ساعد محتاجاً دون تردد. صباح اليوم التالي: سؤالٌ أصعب طرقت الجارة الباب مرة أخرى، لكن هذه المرة بعينين متعبتين وقالت للأم: – الجارة: أختي… هل يمكن أن تقرضيني بعض المال حتى نهاية الشهر؟ – الأم: والله يا أختي ليس عندي الآن ما أقدر أن أعطيك، لكن… أعرف امرأة طيبة تساعد الناس، سأدلك عليها. شكرت الجارة الأم وقالت: – الجارة: جزاكِ الله خيراً… الله يفرّج عنكم مثلما فرّجتم عني. باب خير جديد خرجت العائلة بعدها في السيارة. وبينما هم في الطريق، رأت الأم إعلاناً على لوحة: \"يوم صحي مجاني – فحوصات للأطفال\" قالت الأم بحماس: – هذا رائع! يجب أن أخبر الجارة، قد يفيد ابنها. واتصلت بالجارة لتخبرها، ففرحت كثيراً وشكرت الأم مراراً. عند الإشارة… درس مهم توقفت السيارة عند إشارة المرور، واقترب رجل كبير يطلب المال. انزعج نور وهمس:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق السائل",
        "text": "– ابتعد عن السيارة! هؤلاء يزعجون الناس! لكن الأب قال بحزم ولطف: – مهلاً يا نور… ليس كل من يسأل متسولاً كسولاً. ربما ضاقت به الدنيا. أخرج الأب بعض المال وأعطاه للرجل، ودعا له قائلاً: – الله يفرّج همك. ثم قال للأم: – المشكلة ليست في العطاء، بل في أن بعض الناس يستغل الحاجة. وفعلاً، اقترب آخرون بعد أن رأوا الأب يعطي، لكنه اكتفى برد جميل: – الله يرزقكم ويعطيكم من فضله. وانطلقت السيارة بعد أن فُتحت الإشارة، وساد بين الجميع صمت قصير… كان صمت تفكير. نهاية اليوم قالت حور: – أمي، اليوم رأيتك تساعدين الجارة بالكلام والمعلومة حتى وإن لم تستطيعي المال. وقال نور: – وأبي أعطى الرجل الأول، لكنه رد الآخرين برد لطيف… لم يجرح أحداً. ابتسم الأب وقال: – يا أولادي… السائل له حق. إن استطعتم فأعينوا، وإن شككتم فردّوا بالكلمة الطيبة، فالقلوب تُفتَح بالرحمة لا بالقسوة. ونظرت الأم إليهم وقالت: – المهم أن نحفظ كرامة من يسأل، فلا نُهينه ولا نطرده. وهكذا… لم يكن هذا مجرد يوم عابر، بل درس عميق تعلمته القلوب قبل العقول."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المسؤول",
        "text": "\"ساعتان من المسؤولية\" خرجت الأم مسرعة لأنها تلقت اتصالًا من خالتهم تُخبرها بأنها وضعت مولودها الجديد وتحتاج لمن يساعدها. ارتدت الأم عباءتها وقالت لأبنائها قبل أن تخرج: – \"يا نور، أنت ستكون مسؤولًا عن أختيك لساعتين فقط حتى أعود، أريدكما يا حور ولينا أن تتعاونا معه وتلتزمن بالهدوء.\" أومأ نور بثقة: – \"لا تقلقي يا أمي، أنا مسؤول.\" لكن الأمور لم تكن بهذه السهولة… مرت نصف ساعة، جلست لينا تلعب بالمكعبات بصمت، بينما كانت حور تريد أن تشاهد كرتونها المفضل. فقال لها نور: – \"اتفقنا أن نبقى هادئين، لا نريد أن نُتعب أمي.\" غضبت حور قليلاً: – \"أنا لم أطلب منك أن تكون مسؤولًا! لماذا تتحكم فينا؟\" هنا بدأت المواقف… الموقف الأول: الشكر عند العطاء حاول نور أن يكون لطيفًا فقال: – \"طيب يا حور، إن كنتِ تريدين مشاهدة التلفاز، يمكنني تشغيله لكِ بعد أن ننهي ترتيب الغرفة، ما رأيك؟\" ابتسمت حور: – \"شكرًا يا نور.\" هنا تم تطبيق فكرة: إذا قدم المسؤول شيئًا… يُشكر على ما أعطى. الموقف الثاني: الاعتراف بالفضل عندما ساعد نور لينا في تركيب المكعبات لتبقى هادئة، قالت حور: – \"بصراحة يا نور، أنت تحاول أن تجعل الوقت يمر بطريقة جيدة، أحسنت.\" تم تطبيق فكرة: الاعتراف بفضل المسؤول وتقدير جهوده. الموقف الثالث: التماس العذر عند المنع لاحقًا، طلبت لينا الخروج إلى الحديقة: – \"نور، أريد أن أخرج لألعب.\" أجاب نور: – \"لا يا لينا، أمي قالت نبقى في البيت.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق المسؤول",
        "text": "زعلت لينا وقالت: – \"أنت لا تريدني أن أفرح!\" تدخلت حور: – \"لا يا لينا، ربما نور معه حق… ربما خافت أمنا عليك.\" هنا تعلمت لينا التمس العذر عند المنع. الموقف الرابع: إحسان الظن بعد قليل قال نور: – \"لن نستطيع اللعب في المطبخ لأنه غير مرتب، ونخاف أن ينكسر شيء.\" قالت حور: – \"نور لا يقصد منعنا لمجرد التحكم، هو فقط يريد سلامتنا.\" إحسان الظن بالمسؤول. الموقف الخامس: لا لوم على ما لا يملك طلبت حور من نور أموالًا لطلب بيتزا: – \"نور، اتصل واطلب بيتزا!\" – \"ليس معي مال يا حور.\" – \"لكنني جائعة!\" – \"هذا كل ما يمكنني فعله الآن، دعيني أحضّر لكم ساندويشًا.\" هنا تعلموا أن لا لوم على المسؤول فيما لا يملك. الموقف السادس: تفهّم طبيعة البشر في النهاية تعب نور وضاق صدره قليلاً فقال بعصبية: – \"رجاءً التزموا قليلاً! لنعود كما طلبت أمي.\" سكتت حور ثم قالت: – \"نور آسفة، أنت متعب… هذا طبيعي… الإنسان يخطئ ويتعب.\" ابتسم نور: – \"لا بأس يا حور.\" تفهّم أن الإنسان قد يخطئ لأنه بشر. بعد ساعتين عادت الأم ووجدت البيت مرتبًا والأطفال متعاونين. قالت وهي سعيدة: – \"أحسنتم! لكن أخبروني… ماذا تعلمتم اليوم؟\" قال نور: – \"تعلمنا أن المسؤول يتعب أحيانًا لكنه يحاول.\" وقالت حور: – \"وأن علينا أن نشكره إذا ساعدنا.\" وقالت لينا: – \"وإذا لم يفعل ما نريد… نبحث له عن عذر!\" ابتسمت الأم وقالت: – \"هذا هو الأدب… وهذه هي الأخوّة.\""
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّابِعَةُ: السِّيمْيَاءُ وَالخِيمْيَاءُ وَالكِيمْيَاءُ",
      "topic": "الدَّرْسَانِ (7 وَ8): الكِيمْيَاءُ الحَيَوِيَّةُ وَكِيمْيَاءُ الغِذَاءِ وَالطَّبِيعَةِ — كِيمْيَاءُ النَّانُو وَالمَوَادُّ الذَّكِيَّةُ وَالخَضْرَاءُ",
      "coverImg": "assets/y7/scince/s27.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s27.1.jpg",
          "text": "الدَّرْسُ (7) الكِيمْيَاءُ الحَيَوِيَّةُ وَكِيمْيَاءُ الغِذَاءِ وَالطَّبِيعَةِ: (1) جُزَيْئَاتُ الحَيَاةِ: السُّكَّرِيَّاتُ وَالنَّشَوِيَّاتُ لِلطَّاقَةِ، وَالبُرُوتِينَاتُ لِبِنَاءِ الخَلَايَا وَالنُّمُوِّ، وَالدُّهُونُ وَالفِيتَامِينَاتُ لِحِمَايَةِ الجِسْمِ. (2) كِيمْيَاءُ الغِذَاءِ وَالطَّهْيِ: التَّخْمِيرُ، وَنُضْجُ الطَّعَامِ بِالحَرَارَةِ وَالإِنْزِيمَاتِ، وَحِفْظُ الغِذَاءِ بِالتَّجْفِيفِ وَالتَّمْلِيحِ. (3) الكِيمْيَاءُ الطَّبِيعِيَّةُ: البِنَاءُ الضَّوْئِيُّ وَالأَلْوَانُ الطَّبِيعِيَّةُ وَاسْتِخْلَاصُ الزُّيُوتِ العِطْرِيَّةِ. (4) كِيمْيَاءُ البِيئَةِ: التَّحَلُّلُ الطَّبِيعِيُّ وَالكِيمْيَاءُ الخَضْرَاءُ الصَّدِيقَةُ لِلْبِيئَةِ."
        },
        {
          "img": "assets/y7/scince/s27.2.jpg",
          "text": "الدَّرْسُ (8) كِيمْيَاءُ النَّانُو وَالمَوَادُّ الذَّكِيَّةُ وَالخَضْرَاءُ: (1) كِيمْيَاءُ النَّانُو الدَّقِيقَةُ: تَرْتِيبُ الذَّرَّاتِ بِدِقَّةٍ مُتَنَاهِيَةٍ لِصُنْعِ أَنَابِيبِ الكَرْبُونِ الفَائِقَةِ القُوَّةِ وَالكَبْسُولَاتِ الذَّكِيَّةِ وَالأَسْطُحِ الطَّارِدَةِ لِلْمَاءِ. (2) المَوَادُّ الذَّكِيَّةُ: مَوَادُّ ذَاتِيَّةُ الإِصْلَاحِ، وَسَبَائِكُ تَتَذَكَّرُ شَكْلَهَا بِالحَرَارَةِ، وَمَوَادُّ مُتَغَيِّرَةُ اللَّوْنِ. (3) البُولِيمَرَاتُ وَالمَوَادُّ الحَيَوِيَّةُ: البِلَاسْتِيكُ الحَيَوِيُّ المَصْنُوعُ مِنَ النَّبَاتَاتِ وَالقَابِلُ لِلتَّحَلُّلِ، وَحُبَيْبَاتُ حِفْظِ المَاءِ لِتَرْطِيبِ التُّرْبَةِ. (4) الكِيمْيَاءُ الخَضْرَاءُ وَالمُسْتَقْبَلُ: طَاقَةُ الهِيدْرُوجِينِ النَّظِيفَةُ وَإِعَادَةُ التَّدْوِيرِ."
        }
      ],
      "text": "الدَّرْسُ (7) الكِيمْيَاءُ الحَيَوِيَّةُ وَكِيمْيَاءُ الغِذَاءِ وَالطَّبِيعَةِ: (1) جُزَيْئَاتُ الحَيَاةِ: السُّكَّرِيَّاتُ وَالنَّشَوِيَّاتُ لِلطَّاقَةِ، وَالبُرُوتِينَاتُ لِبِنَاءِ الخَلَايَا وَالنُّمُوِّ، وَالدُّهُونُ وَالفِيتَامِينَاتُ لِحِمَايَةِ الجِسْمِ. (2) كِيمْيَاءُ الغِذَاءِ وَالطَّهْيِ: التَّخْمِيرُ، وَنُضْجُ الطَّعَامِ بِالحَرَارَةِ وَالإِنْزِيمَاتِ، وَحِفْظُ الغِذَاءِ بِالتَّجْفِيفِ وَالتَّمْلِيحِ. (3) الكِيمْيَاءُ الطَّبِيعِيَّةُ: البِنَاءُ الضَّوْئِيُّ وَالأَلْوَانُ الطَّبِيعِيَّةُ وَاسْتِخْلَاصُ الزُّيُوتِ العِطْرِيَّةِ. (4) كِيمْيَاءُ البِيئَةِ: التَّحَلُّلُ الطَّبِيعِيُّ وَالكِيمْيَاءُ الخَضْرَاءُ الصَّدِيقَةُ لِلْبِيئَةِ. الدَّرْسُ (8) كِيمْيَاءُ النَّانُو وَالمَوَادُّ الذَّكِيَّةُ وَالخَضْرَاءُ: (1) كِيمْيَاءُ النَّانُو الدَّقِيقَةُ: تَرْتِيبُ الذَّرَّاتِ بِدِقَّةٍ مُتَنَاهِيَةٍ لِصُنْعِ أَنَابِيبِ الكَرْبُونِ الفَائِقَةِ القُوَّةِ وَالكَبْسُولَاتِ الذَّكِيَّةِ وَالأَسْطُحِ الطَّارِدَةِ لِلْمَاءِ. (2) المَوَادُّ الذَّكِيَّةُ: مَوَادُّ ذَاتِيَّةُ الإِصْلَاحِ، وَسَبَائِكُ تَتَذَكَّرُ شَكْلَهَا بِالحَرَارَةِ، وَمَوَادُّ مُتَغَيِّرَةُ اللَّوْنِ. (3) البُولِيمَرَاتُ وَالمَوَادُّ الحَيَوِيَّةُ: البِلَاسْتِيكُ الحَيَوِيُّ المَصْنُوعُ مِنَ النَّبَاتَاتِ وَالقَابِلُ لِلتَّحَلُّلِ، وَحُبَيْبَاتُ حِفْظِ المَاءِ لِتَرْطِيبِ التُّرْبَةِ. (4) الكِيمْيَاءُ الخَضْرَاءُ وَالمُسْتَقْبَلُ: طَاقَةُ الهِيدْرُوجِينِ النَّظِيفَةُ وَإِعَادَةُ التَّدْوِيرِ.",
      "q1": {
        "q": "مَا جُزَيْئَاتُ الحَيَاةِ الأَسَاسِيَّةُ فِي الكِيمْيَاءِ الحَيَوِيَّةِ الَّتِي تَمُدُّنَا بِالطَّاقَةِ وَتَبْنِي خَلَايَانَا؟",
        "focusWord": "جُزَيْئَاتُ الحَيَاةِ",
        "options": [
          {
            "text": "السُّكَّرِيَّاتُ وَالنَّشَوِيَّاتُ (لِلطَّاقَةِ)، وَالبُرُوتِينَاتُ (لِلْبِنَاءِ)، وَالدُّهُونُ وَالفِيتَامِينَاتُ (لِلْحِمَايَةِ)",
            "correct": true
          },
          {
            "text": "الحَدِيدُ وَالنُّحَاسُ وَالذَّهَبُ فَقَطْ",
            "correct": false
          },
          {
            "text": "الصُّخُورُ النَّارِيَّةُ وَالرُّسُوبِيَّةُ",
            "correct": false
          },
          {
            "text": "الغَازَاتُ النَّبِيلَةُ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "بِمَاذَا يَتَمَيَّزُ (البِلَاسْتِيكُ الحَيَوِيُّ) فِي كِيمْيَاءِ البُولِيمَرَاتِ وَالكِيمْيَاءِ الخَضْرَاءِ؟",
        "focusWord": "البِلَاسْتِيكُ الحَيَوِيُّ",
        "options": [
          {
            "text": "يُصْنَعُ مِنَ النَّبَاتَاتِ كَالذُّرَةِ وَيَتَحَلَّلُ طَبِيعِيًّا دُونَ تَلْوِيثِ البِيئَةِ",
            "correct": true
          },
          {
            "text": "يَبْقَى مِلْيُونَ سَنَةٍ دُونَ تَحَلُّلٍ",
            "correct": false
          },
          {
            "text": "يُسَمِّمُ التُّرْبَةَ وَالأَسْمَاكَ",
            "correct": false
          },
          {
            "text": "يُصْنَعُ مِنَ الرَّصَاصِ السَّامِّ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا تَطْبِيقَاتُ كِيمْيَاءِ النَّانُو وَالمَوَادِّ الذَّكِيَّةِ المُتَطَوِّرَةِ؟",
        "focusWord": "كِيمْيَاءُ النَّانُو",
        "options": [
          {
            "text": "أَنَابِيبُ الكَرْبُونِ الفَائِقَةُ القُوَّةِ، وَالكَبْسُولَاتُ الدَّوَائِيَّةُ الذَّكِيَّةُ، وَالمَوَادُّ ذَاتِيَّةُ الإِصْلَاحِ",
            "correct": true
          },
          {
            "text": "حَرْقُ الفَحْمِ الحَجَرِيِّ",
            "correct": false
          },
          {
            "text": "تَلْوِيثُ الهَوَاءِ بِالدُّخَانِ",
            "correct": false
          },
          {
            "text": "رَمْيُ النُّفَايَاتِ فِي البَحْرِ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "جُزَيْئَاتُ الحَيَاةِ",
          "left": "السُّكَّرِيَّاتُ وَالبُرُوتِينَاتُ وَالدُّهُونُ وَالفِيتَامِينَاتُ"
        },
        {
          "right": "كِيمْيَاءُ النَّانُو وَالمَوَادُّ الذَّكِيَّةُ",
          "left": "أَنَابِيبُ الكَرْبُونِ وَالمَوَادُّ ذَاتِيَّةُ الإِصْلَاحِ وَالسَّبَائِكُ الذَّكِيَّةُ"
        },
        {
          "right": "الكِيمْيَاءُ الخَضْرَاءُ",
          "left": "البِلَاسْتِيكُ الحَيَوِيُّ وَوَقُودُ الهِيدْرُوجِينِ وَإِعَادَةُ التَّدْوِيرِ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ مَبَادِئَ الكِيمْيَاءِ الحَيَوِيَّةِ وَالكِيمْيَاءِ الخَضْرَاءِ الصَّدِيقَةِ لِلْبِيئَةِ:",
        "correct": [
          "تَنَاوُلُ السُّكَّرِيَّاتِ الطَّبِيعِيَّةِ وَالبُرُوتِينَاتِ وَالفِيتَامِينَاتِ",
          "اسْتِخْدَامُ البِلَاسْتِيكِ الحَيَوِيِّ القَابِلِ لِلتَّحَلُّلِ",
          "إِعَادَةُ تَدْوِيرِ النُّفَايَاتِ",
          "الاعْتِمَادُ عَلَى الطَّاقَةِ النَّظِيفَةِ"
        ],
        "wrong": [
          "رَمْيُ البِلَاسْتِيكِ الضَّارِّ فِي الطَّبِيعَةِ",
          "تَلْوِيثُ المِيَاهِ وَالتُّرْبَةِ"
        ]
      },
      "applyStep": "أُفَضِّلُ المَوَادَّ الطَّبِيعِيَّةَ وَأُشَارِكُ فِي إِعَادَةِ التَّدْوِيرِ لِحِمَايَةِ كَوْكَبِ الأَرْضِ مِنَ التَّلَوُّثِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt27.jpg",
      "title": "الدَّرْسُ (7): مَسَارُ التَّرْكِيزِ وَالمُرُونَةِ لِلطُّلَّابِ",
      "subtitle": "مُرَاقَبَةُ النَّفَسِ، تَمْرِينُ الفَرَاشَةِ، البِلَانْكُ، الرَّمْيُ الخَيَالِيُّ، وَالاسْتِرْخَاءُ",
      "slideText": "🎯 الدَّرْسُ (7) مَسَارُ التَّرْكِيزِ وَالمُرُونَةِ لِلطُّلَّابِ: (1) الوَعْيُ (دَقِيقَةٌ وَاحِدَةٌ): مُرَاقَبَةُ النَّفَسِ بِهُدُوءٍ وَسَكِينَةٍ. (2) الاسْتِطَالَةُ (دَقِيقَتَانِ): تَمْرِينُ الفَرَاشَةِ لِمُرُونَةِ الحَوْضِ. (3) النُّمُوُّ العَضَلِيُّ: تَمْرِينُ البِلَانْكِ (الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ، تَوَقَّفْ قَبْلَ الاهْتِزَازِ). (4) الاسْتِجَابَةُ العَصَبِيَّةُ: الرَّمْيُ الخَيَالِيُّ (السُّرْعَةُ أَهَمُّ مِنَ الكَمَالِ). (5) التَّدَفُّقُ (دَقِيقَةٌ وَاحِدَةٌ): الاسْتِرْخَاءُ التَّامُّ عَلَى الظَّهْرِ.",
      "q1": {
        "q": "مَا قَاعِدَةُ أَدَاءِ (تَمْرِينِ البِلَانْكِ) فِي مَسَارِ التَّرْكِيزِ وَالمُرُونَةِ؟",
        "focusWord": "الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ",
        "options": [
          {
            "text": "الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ، وَالتَّوَقُّفُ قَبْلَ بَدْءِ الاهْتِزَازِ",
            "correct": true
          },
          {
            "text": "الاسْتِمْرَارُ رَغْمَ الاهْتِزَازِ الشَّدِيدِ",
            "correct": false
          },
          {
            "text": "تَقْوِيسُ الظَّهْرِ لِلْأَسْفَلِ",
            "correct": false
          },
          {
            "text": "حَبْسُ النَّفَسِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا تَمْرِينُ الاسْتِطَالَةِ (دَقِيقَتَانِ) وَتَمْرِينُ الاسْتِجَابَةِ العَصَبِيَّةِ فِي الدَّرْسِ السَّابِعِ؟",
        "focusWord": "تَمْرِينُ الفَرَاشَةِ وَالرَّمْيُ الخَيَالِيُّ",
        "options": [
          {
            "text": "تَمْرِينُ الفَرَاشَةِ لِلِاسْتِطَالَةِ، وَالرَّمْيُ الخَيَالِيُّ السَّرِيعُ لِلِاسْتِجَابَةِ العَصَبِيَّةِ",
            "correct": true
          },
          {
            "text": "القَفْزُ عَلَى الحَبْلِ",
            "correct": false
          },
          {
            "text": "التَّعَلُّقُ عَلَى العَارِضَةِ",
            "correct": false
          },
          {
            "text": "الجَرْيُ فِي السَّاحَةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "كَيْفَ نَبْدَأُ وَنَخْتَتِمُ الدَّرْسَ السَّابِعَ (مَسَارَ التَّرْكِيزِ وَالمُرُونَةِ)؟",
        "focusWord": "مُرَاقَبَةُ النَّفَسِ وَالاسْتِرْخَاءُ",
        "options": [
          {
            "text": "نَبْدَأُ بِمُرَاقَبَةِ النَّفَسِ (دَقِيقَةٌ وَاحِدَةٌ)، وَنَخْتَتِمُ بِالاسْتِرْخَاءِ التَّامِّ عَلَى الظَّهْرِ (دَقِيقَةٌ وَاحِدَةٌ)",
            "correct": true
          },
          {
            "text": "نَبْدَأُ بِالجَرْيِ السَّرِيعِ",
            "correct": false
          },
          {
            "text": "نَخْتَتِمُ بِالقَفْزِ العَالِي",
            "correct": false
          },
          {
            "text": "بِلَا اسْتِرْخَاءٍ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الوَعْيُ وَالاسْتِطَالَةُ (الدَّرْسُ 7)",
          "left": "مُرَاقَبَةُ النَّفَسِ + تَمْرِينُ الفَرَاشَةِ (دَقِيقَتَانِ)"
        },
        {
          "right": "النُّمُوُّ العَضَلِيُّ (البِلَانْكُ)",
          "left": "الجَوْدَةُ أَهَمُّ مِنَ الكَمِّيَّةِ، تَوَقَّفْ قَبْلَ الاهْتِزَازِ"
        },
        {
          "right": "الاسْتِجَابَةُ وَالتَّدَفُّقُ",
          "left": "الرَّمْيُ الخَيَالِيُّ السَّرِيعُ ثُمَّ الاسْتِرْخَاءُ التَّامُّ"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ خُطُوَاتِ الدَّرْسِ السَّابِعِ (مَسَارِ التَّرْكِيزِ وَالمُرُونَةِ لِلطُّلَّابِ):",
        "correct": [
          "مُرَاقَبَةُ النَّفَسِ (دَقِيقَةٌ وَاحِدَةٌ)",
          "تَمْرِينُ الفَرَاشَةِ (دَقِيقَتَانِ)",
          "تَمْرِينُ البِلَانْكِ بِجَوْدَةٍ وَثَبَاتٍ",
          "الرَّمْيُ الخَيَالِيُّ وَالاسْتِرْخَاءُ الخِتَامِيُّ"
        ],
        "wrong": [
          "الاهْتِزَازُ فِي تَمْرِينِ البِلَانْكِ",
          "إِهْمَالُ فَقْرَةِ الاسْتِرْخَاءِ"
        ]
      },
      "applyStep": "أُطَبِّقُ مَسَارَ التَّرْكِيزِ وَالمُرُونَةِ: مُرَاقَبَةَ النَّفَسِ، تَمْرِينَ الفَرَاشَةِ، البِلَانْكَ المتْقَنَ، وَالاسْتِرْخَاءَ."
    }
  },
  {
    "w": 28,
    "secNum": 7,
    "heavenName": "سَمَاءُ الجُمُعَةِ السَّابِعَةُ (ذ ض ظ غ)",
    "sciGroupName": "المَجْمُوعَةُ العِلْمِيَّةُ السَّابِعَةُ: الكِيمْيَاءُ وَالمَادَّةُ وَالمَحَالِيلُ وَالكِيمْيَاءُ الحَيَوِيَّةُ",
    "natureLabel": "طَاقَةُ المَاءِ (الطَّاعَةُ وَالتَّوَاضُعُ وَتَهْذِيبُ النَّفْسِ)",
    "ltr": "غ",
    "jummal": 1000,
    "prophet": "مُحَمَّدٌ (ﷺ)",
    "virtue": "الخُلُقُ العَظِيمُ",
    "unitHeader": "الوَحْدَةُ الثَّامِنَةُ وَالعِشْرُونَ وَالخِتَامِيَّةُ الكَامِلَةُ: سَيِّدُ الكَائِنَاتِ وَخَاتَمُ الأَنْبِيَاءِ مُحَمَّدٌ المُصْطَفَى الكَامِلُ مَعْرِفَةً لِلْغَيْبِ (صَلَّى اللهُ عَلَيْهِ وَآلِهِ)",
    "storyThird": "بَعَثَ اللهُ خَاتَمَ الأَنْبِيَاءِ مُحَمَّدًا (ﷺ) رَحْمَةً لِلعَالَمِينَ لِيُتَمِّمَ مَكَارِمَ الأَخْلَاقِ، فَكَانَ قُدْوَتَنَا فِي الصِّدْقِ وَالأَمَانَةِ وَالرَّحْمَةِ وَنَشْرِ العِلْمِ وَالنُّورْ.",
    "naturesText": "أَوَّلًا: الهُوِيَّةُ الكَوْنِيَّةُ وَالطَّبَائِعُ الأَرْبَعُ لِلْوَحْدَةِ الطَّبَائِعُ الأَرْبَعُ فِي القِصَّةِ: A. النَّارُ (إِخْمَادُ نَارِ الشِّرْكِ وَفَارِسَ بِـ«النُّورِ الأَوَّلِ وَالسِّرَاجِ المُنِيرِ»): خُمُودُ نَارِ فَارِسَ الَّتِي لَمْ تَخْمُدْ أَلْفَ عَامٍ لَيْلَةَ مَوْلِدِهِ الشَّرِيفِ، وَدَفْعُهُ لِنَارِ الجَاهِلِيَّةِ وَالعَصَبِيَّةِ وَحُرُوبِ الأَحْزَابِ بِالشَّجَاعَةِ وَالعَفْوِ عِنْدَ المَقْدِرَةِ فِي فَتْحِ مَكَّةَ؛ وَفِي مُقَابِلِهَا نُورُهُ القُدْسِيُّ الَّذِي هُوَ أَوَّلُ مَا خَلَقَ اللهُ قَبْلَ الخَلْقِ، وَوَصْفُهُ القُرْآنِيُّ: ﴿وَدَاعِيًا إِلَى اللَّهِ بِإِذْنِهِ وَسِرَاجًا مُّنِيرًا﴾. B. الرِّيحُ (تَبْدِيدُ أَوْهَامِ الجَاهِلِيَّةِ وَالكَهَانَةِ بِالمِعْرَاجِ وَالوَحْيِ المَتِينِ): حَجْبُ الشَّيَاطِينِ عَنِ السَّمَاءِ بِالشُّهُبِ وَإِبْطَالُ رِيحِ الكَهَانَةِ وَالظُّنُونِ (﴿وَمَا يَنطِقُ عَنِ الْهَوَىٰ * إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ﴾)، وَنُصْرَتُهُ بِرِيحِ الصَّبَا يَوْمَ الخَنْدَقِ، وَتَسْخِيرُ الغَمَامَةِ فِي الفَضَاءِ تُظِلُّهُ حَيْثُمَا سَارَ، وَعُرُوجُهُ السَّمَاوِيُّ لَيْلَةَ الإِسْرَاءِ وَالمِعْرَاجِ حَتَّى بَلَغَ ﴿قَابَ قَوْسَيْنِ أَوْ أَدْنَىٰ﴾ وَاطَّلَعَ عَلَى مَلَكُوتِ الغَيْبِ. C. التُّرَابُ (العَقْلُ الكُلِّيُّ وَتَطْهِيرُ الكَعْبَةِ وَالغَارِ وَجَعْلُ الأَرْضِ مَسْجِدًا): كَمَالُ العَقْلِ المُحَمَّدِيِّ الأَعْلَى، وَتَعَبُّدُهُ فِي غَارِ حِرَاءٍ التُّرَابِيِّ فَوْقَ جَبَلِ النُّورِ، وَمَبِيتُهُ فِي غَارِ ثَوْرٍ، وَحَفْرُهُ الخَنْدَقَ بِيَدِهِ الشَّرِيفَةِ وَتَفَتُّتُ الصَّخْرَةِ العَظِيمَةِ تَحْتَ مِعْوَلِهِ، وَتَحْطِيمُهُ لِـ 360 صَنَمًا حَجَرِيًّا حَوْلَ الكَعْبَةِ، وَخَصِيصَتُهُ الكُبْرَى: «جُعِلَتْ لِيَ الأَرْضُ مَسْجِدًا وَطَهُورًا». D. المَاءُ (الرَّحْمَةُ المُهْدَاةُ وَالكَوْثَرُ وَنَبْعُ المَاءِ مِنْ بَيْنِ أَصَابِعِهِ وَغَدِيرُ خُمٍّ): كَوْنُهُ رَحْمَةً لِلعَالَمِينَ كَالغَيْثِ المُحْيِي، وَتَفَجُّرُ المَاءِ العَذْبِ مِنْ بَيْنِ أَصَابِعِهِ الشَّرِيفَةِ حَتَّى شَرِبَ الجَيْشُ وَتَوَضَّؤُوا، وَغَيَضُ مِيَاهِ بُحَيْرَةِ سَاوَةَ لَيْلَةَ مَوْلِدِهِ، وَعَطِيَّةُ نَهْرِ «الكَوْثَرِ» فِي الجَنَّةِ وَفِي ذُرِّيَّتِهِ الطَّاهِرَةِ مِنْ فَاطِمَةَ الزَّهْرَاءِ، وَإِكْمَالُ الدِّينِ يَوْمَ «غَدِيرِ خُمٍّ» عِنْدَ مَاءِ الغَدِيرِ بِإِقَامَةِ وَلَايَةِ أَمِيرِ المُؤْمِنِينَ عَلِيٍّ (عَلَيْهِ السَّلَامُ).",
    "storyParagraphs": [
      "فِي خِتَامِ فَلَكِ يَوْمِ الجُمُعَةِ المُنِيرِ وَتَمَامِ الأَفْلَاكِ السَّبْعَةِ العُلْيَا، يَأْتِي النَّبِيُّ الرَّقْمُ ثَمَانِيَةٌ وَعِشْرُونَ فِي مَنْزِلَةِ المَاءِ وَالرَّحْمَةِ العَامَّةِ وَالكَمَالِ وَمَعْرِفَةِ الغَيْبِ بِإِذْنِ اللهِ العَلِيمِ الخَبِيرْ، وَهُوَ سَيِّدُ الخَلْقِ وَخَاتَمُ النَّبِيِّينَ حَبِيبُ اللهِ مُحَمَّدٌ المُصْطَفَى بْنُ عَبْدِ اللهِ صَلَّى اللهُ عَلَيْهِ وَآلِهِ وَسَلَّمْ. خَلَقَ اللهُ نُورَ مُحَمَّدٍ وَأَهْلِ بَيْتِهِ قَبْلَ خَلْقِ السَّمَاوَاتِ وَالأَرْضِ بِآلَافِ السِّنِينَ يُسَبِّحُونَ اللهَ فِي عَالَمِ الغَيْبِ، وَبِحَقِّهِمْ تَابَ اللهُ عَلَى آدَمَ وَنَجَّى نُوحًا وَجَعَلَ النَّارَ بَرْدًا وَسَلَامًا عَلَى إِبْرَاهِيمَ، وَبَشَّرَ بِهِ جَمِيعُ الأَنْبِيَاءِ حَتَّى قَالَ عِيسَى ابْنُ مَرْيَمَ وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِنْ بَعْدِي اسْمُهُ أَحْمَدْ.",
      "وُلِدَ النَّبِيُّ مُحَمَّدٌ فِي مَكَّةَ المُكَرَّمَةِ فِي عَامِ الفِيلِ فِي السَّابِعَ عَشَرَ مِنْ شَهْرِ رَبِيعٍ الأَوَّلِ مِنْ أَبِيهِ عَبْدِ اللهِ وَأُمِّهِ السَّيِّدَةِ الطَّاهِرَةِ آمِنَةَ بِنْتِ وَهْبٍ، وَوُلِدَ سَاجِدًا لِلهِ رَافِعًا أُصْبُعَهُ بِالتَّوْحِيدِ؛ وَفِي لَيْلَةِ مَوْلِدِهِ أَشْرَقَ نُورٌ أَضَاءَ قُصُورَ الشَّامِ، وَخَمَدَتْ نَارُ فَارِسَ الَّتِي عُبِدَتْ أَلْفَ عَامٍ، وَانْشَقَّ إِيوَانُ كِسْرَى، وَفَاضَ وادي السَّمَاوَةِ وَغَاضَتْ بُحَيْرَةُ سَاوَةَ، وَتَسَاقَطَتِ الأَصْنَامُ عَلَى وُجُوهِهَا! وَأَوَاهُ اللهُ يَتِيمًا فِي كَفَالَةِ جَدِّهِ سَيِّدِ البَطْحَاءِ عَبْدِ المُطَّلِبِ ثُمَّ فِي حِضْنِ عَمِّهِ المُؤْمِنِ النَّاصِرِ أَبِي طَالِبٍ وَزَوْجَتِهِ الطَّاهِرَةِ فَاطِمَةَ بِنْتِ أَسَدٍ، وَكَانَتْ تَسِيرُ فَوْقَ رَأْسِهِ غَمَامَةٌ بَيْضَاءُ فِي الهَوَاءِ تُظِلُّهُ مِنْ حَرِّ الشَّمْسِ.",
      "نَشَأَ مُحَمَّدٌ أَعْقَلَ النَّاسِ وَأَطْهَرَهُمْ لَمْ يَسْجُدْ لِصَنَمٍ قَطُّ حَتَّى لَقَّبَهُ قَوْمُهُ بِالصَّادِقِ الأَمِينْ، وَوَضَعَ الحَجَرَ الأَسْوَدَ بِيَدَيْهِ الشَّرِيفَتَيْنِ فِي رُكْنِ الكَعْبَةِ بِحِكْمَةٍ مَنَعَتِ الخِلَافَ بَيْنَ القَبَائِلِ، وَتَزَوَّجَ السَّيِّدَةَ الطَّاهِرَةَ خَدِيجَةَ الكُبْرَى عَلَيْهَا السَّلَامُ فَوَاسَتْهُ بِمَالِهَا وَنَفْسِهَا، وَأَعْطَاهُ اللهُ الكَوْثَرَ وَهُوَ نَهْرُ النُّورِ فِي الجَنَّةِ وَالخَيْرُ الكَثِيرُ فِي ذُرِّيَّتِهِ الطَّاهِرَةِ مِنْ بِنْتِهِ سَيِّدَةِ نِسَاءِ العَالَمِينَ فَاطِمَةَ الزَّهْرَاءِ عَلَيْهَا السَّلَامْ. وَكَانَ يَتَحَنَّثُ وَيَتَفَكَّرُ فِي غَارِ حِرَاءٍ فَوْقَ جَبَلِ النُّورِ وَمَعَهُ رَبِيبُهُ الصَّبِيُّ الطَّاهِرُ عَلِيُّ بْنُ أَبِي طَالِبٍ، حَتَّى نَزَلَ عَلَيْهِ الرُّوحُ الأَمِينُ جِبْرِيلُ فِي السَّابِعِ وَالعِشْرِينَ مِنْ رَجَبٍ بِأَوَّلِ آيَاتِ القُرْآنِ العَظِيمِ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقْ؛ فَكَانَتِ السَّيِّدَةُ خَدِيجَةُ وَالإِمَامُ عَلِيٌّ أَوَّلَ مَنْ آمَنَ بِهِ وَصَلَّى خَلْفَهُ.",
      "صَبَرَ النَّبِيُّ مُحَمَّدٌ مَعَ أَهْلِ بَيْتِهِ وَأَصْحَابِهِ ثَلَاثَ سِنِينَ فِي شِعْبِ أَبِي طَالِبٍ، وَأَيَّدَهُ اللهُ بِالمُعْجِزَاتِ البَاهِرَةِ فَانْشَقَّ لَهُ القَمَرُ فِي السَّمَاءِ نِصْفَيْنِ، وَحَنَّ إِلَيْهِ الجِذْعُ اليَابِسُ، وَسَبَّحَ الحَصَى فِي كَفِّهِ، وَنَبَعَ المَاءُ العَذْبُ مِنْ بَيْنِ أَصَابِعِهِ! وَأَسْرَى اللهُ بِهِ لَيْلًا مِنَ المَسْجِدِ الحَرَامِ إِلَى المَسْجِدِ الأَقْصَى فَصَلَّى إِمَامًا بِالأَنْبِيَاءِ جَمِيعًا، ثُمَّ عَرَجَ بِهِ فِي السَّمَاوَاتِ السَّبْعِ عِنْدَ سِدْرَةِ المُنْتَهَى حَتَّى كَانَ قَابَ قَوْسَيْنِ أَوْ أَدْنَى فَمَا زَاغَ البَصَرُ وَمَا طَغَى، وَأَطْلَعَهُ اللهُ عَلَى أَسْرَارِ الغَيْبِ وَالكَوْنِ لِأَنَّ اللهَ عَالِمُ الغَيْبِ فَلَا يُظْهِرُ عَلَى غَيْبِهِ أَحَدًا إِلَّا مَنِ ارْتَضَى مِنْ رَسُولْ.",
      "وَلَمَّا تَآمَرَ المُشْرِكُونَ فِي دَارِ النَّدْوَةِ لِقَتْلِهِ لَيْلًا، بَاتَ أَمِيرُ المُؤْمِنِينَ عَلِيٌّ فِي فِرَاشِ النَّبِيِّ يَفْدِيهِ بِنَفْسِهِ فَأَنْزَلَ اللهُ فِيهِ وَمِنَ النَّاسِ مَنْ يَشْرِي نَفْسَهُ ابْتِغَاءَ مَرْضَاتِ اللهِ، وَخَرَجَ النَّبِيُّ وَهُوَ يَقْرَأُ سُورَةَ يس فَـأَغْشَى اللهُ أَبْصَارَ الأَعْدَاءِ فَلَمْ يُبْصِرُوهُ، وَسَارَ مُهَاجِرًا وَنَسَجَتِ العَنْكَبُوتُ خَيْطَهَا عَلَى فَمِ غَارِ ثَوْرٍ وَبَاضَتِ الحَمَامَةُ حَتَّى وَصَلَ إِلَى المَدِينَةِ المُنَوَّرَةِ فَآخَى بَيْنَ المُهَاجِرِينَ وَالأَنْصَارِ وَاتَّخَذَ عَلِيًّا أَخًا لَهُ فِي الدُّنْيَا وَالآخِرَةِ وَزَوَّجَهُ بِنْتَهُ فَاطِمَةَ الزَّهْرَاءَ بِأَمْرٍ مِنَ السَّمَاءْ.",
      "وَحَمَى اللهُ نَبِيَّهُ فِي بَدْرٍ وَأُحُدٍ وَالخَنْدَقِ وَخَيْبَرَ وَحُنَيْنٍ، وَجَمَعَ النَّبِيُّ عَبَاءَتَهُ عَلَى عَلِيٍّ وَفَاطِمَةَ وَالحَسَنِ وَالحُسَيْنِ فَنَزَلَتْ آيَةُ التَّطْهِيرِ، وَخَرَجَ بِهِمْ فِي آيَةِ المُبَاهَلَةِ فَجَعَلَ الحَسَنَ وَالحُسَيْنَ أَبْنَاءَهُ وَفَاطِمَةَ نِسَاءَهُ وَعَلِيًّا نَفْسَهُ! ثُمَّ دَخَلَ مَكَّةَ فَاتِحًا مُتَوَاضِعًا فَطَهَّرَ الكَعْبَةَ مِنَ الأَصْنَامِ، وَعَفَا عَنْ قُرَيْشٍ وَغَفَرَ لَهُمْ قَائِلًا اذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ، فَدَخَلَ النَّاسُ فِي دِينِ اللهِ أَفْوَاجًا.",
      "وَفِي السَّنَةِ العَاشِرَةِ لِلْهِجْرَةِ بَعْدَ حَجَّةِ الوَدَاعِ، نَزَلَتْ آيَةُ البَلَاغِ عِنْدَ مَاءِ غَدِيرِ خُمٍّ فِي الثَّامِنَ عَشَرَ مِنْ ذِي الحِجَّةِ يَا أَيُّهَا الرَّسُولُ بَلِّغْ مَا أُنْزِلَ إِلَيْكَ مِنْ رَبِّكَ؛ فَـبَلَّغَ المُصْطَفَى الرِّسَالَةَ كَمَا يُبَلِّغُ الأَمِينُ عَهْدَ رَبِّهِ، وَرَفَعَ يَدَ عَلِيِّ بْنِ أَبِي طَالِبٍ أَمَامَ أَكْثَرَ مِنْ مِائَةِ أَلْفٍ مِنَ المُسْلِمِينَ وَقَالَ مَنْ كُنْتُ مَوْلَاهُ فَهٰذَا عَلِيٌّ مَوْلَاهُ، اللَّهُمَّ وَالِ مَنْ وَالَاهُ وَعَادِ مَنْ عَادَاهُ! وَقَالَ إِنِّي تَارِكٌ فِيكُمُ الثَّقَلَيْنِ كِتَابَ اللهِ وَعِتْرَتِي أَهْلَ بَيْتِي مَا إِنْ تَمَسَّكْتُمْ بِهِمَا لَنْ تَضِلُّوا بَعْدِي أَبَدًا وَإِنَّهُمَا لَنْ يَفْتَرِقَا حَتَّى يَرِدَا عَلَيَّ الحَوْضَ؛ فَنَزَلَ قَوْلُهُ تَعَالَى اليَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الإِسْلَامَ دِينًا.",
      "كَانَ خُلُقُ النَّبِيِّ مُحَمَّدٍ القُرْآنَ كَمَا وَصَفَهُ رَبُّهُ وَإِنَّكَ لَعَلَى خُلُقٍ عَظِيمٍ، وَكَانَ بِالمُؤْمِنِينَ رَؤُوفًا رَحِيمًا يَغْفِرُ لِمَنْ أَسَاءَ إِلَيْهِ فَغَفَرَ اللهُ بِشَفَاعَتِهِ لِلتَّائِبِينَ الَّذِينَ يَسْتَغْفِرُونَ فِي الأَسْحَارِ عِنْدَ كُلِّ غَسَقٍ وَلَيْلٍ، وَحَذَّرَ أُمَّتَهُ مِنْ كُلِّ مَنْ يَغُشُّ النَّاسَ أَوْ يَتَّبِعُ الهَوَى، وَبَشَّرَهُمْ بِأَنَّ مِنْ ذُرِّيَّتِهِ اثْنَيْ عَشَرَ إِمَامًا هُدَاةً مَهْدِيِّينَ أَوَّلُهُمْ عَلِيٌّ وَخَاتَمُهُمُ المَهْدِيُّ الَّذِي يَحْمِلُ اسْمَهُ وَكُنْيَتَهُ فَيَمْلَأُ الأَرْضَ قِسْطًا وَعَدْلًا. وَبَعْدَ أَنْ بَلَغَ بِالأُمَّةِ ذُرْوَةَ الكَمَالِ وَالنُّورِ صَعِدَتْ رُوحُهُ المُقَدَّسَةُ إِلَى الرَّفِيقِ الأَعْلَى فِي المَدِينَةِ المُنَوَّرَةِ فِي الثَّامِنِ وَالعِشْرِينَ مِنْ شَهْرِ صَفَرٍ وَهُوَ ابْنُ ثَلَاثٍ وَسِتِّينَ سَنَةً، فَغَسَّلَهُ وَكَفَّنَهُ وَصَلَّى عَلَيْهِ أَخُوهُ وَوَصِيُّهُ أَمِيرُ المُؤْمِنِينَ عَلِيٌّ عَلَيْهِ السَّلَامْ؛ وَبَقِيَ نُورُهُ وَشَرِيعَتُهُ السَّمْحَاءُ كَالمَاءِ الطَّهُورِ وَالفَضْلِ الكَبِيرِ فَهُوَ لِلْأَرْوَاحِ شِفَاءٌ وَرَحْمَةٌ وَبَلَاغٌ مُبِينٌ، وَهُوَ فِي قُلُوبِ العَارِفِينَ نُورٌ سَاطِعٌ دَائِمٌ بَازِغٌ إِلَى يَوْمِ الدِّينِ وَلِرَبِّهِ عَبْدٌ شَكُورٌ غَفُورٌ رَحِيمْ."
    ],
    "words": [
      {
        "word": "مَغْفِرَةً",
        "desc": "وسط متصل / ساكن: ـغْـ",
        "raw": "مَغْفِرَةً (وسط متصل / ساكن: ـغْـ)"
      },
      {
        "word": "بَلِّغْ",
        "desc": "آخر متصل / ساكن: ـغْ",
        "raw": "بَلِّغْ (آخر متصل / ساكن: ـغْ)"
      },
      {
        "word": "غَفَرَ",
        "desc": "أول منفصل / متحرك بالفتح: غَـ",
        "raw": "غَفَرَ (أول منفصل / متحرك بالفتح: غَـ)"
      },
      {
        "word": "فَغَفَرَ",
        "desc": "أول متصل / متحرك بالفتح: ـغَـ",
        "raw": "فَغَفَرَ (أول متصل / متحرك بالفتح: ـغَـ)"
      },
      {
        "word": "شَغَلَ",
        "desc": "وسط متصل / متحرك بالفتح: ـغَـ",
        "raw": "شَغَلَ (وسط متصل / متحرك بالفتح: ـغَـ)"
      },
      {
        "word": "رَغَبَ",
        "desc": "وسط منفصل / متحرك بالفتح: غَـ",
        "raw": "رَغَبَ (وسط منفصل / متحرك بالفتح: غَـ)"
      },
      {
        "word": "بَلَغَ",
        "desc": "آخر متصل / متحرك بالفتح: ـغَ",
        "raw": "بَلَغَ (آخر متصل / متحرك بالفتح: ـغَ)"
      },
      {
        "word": "غُفْرَانَكَ",
        "desc": "أول منفصل / متحرك بالضم: غُـ",
        "raw": "غُفْرَانَكَ (أول منفصل / متحرك بالضم: غُـ)"
      },
      {
        "word": "بَلَاغٌ",
        "desc": "آخر منفصل / متحرك بالضم: غٌ",
        "raw": "بَلَاغٌ (آخر منفصل / متحرك بالضم: غٌ)"
      },
      {
        "word": "غِلٍّ",
        "desc": "أول منفصل / متحرك بالكسر: غِـ",
        "raw": "غِلٍّ (أول منفصل / متحرك بالكسر: غِـ)"
      },
      {
        "word": "رَغَّبَ",
        "desc": "وسط منفصل / مضعف بالفتح: غَّـ",
        "raw": "رَغَّبَ (وسط منفصل / مضعف بالفتح: غَّـ)"
      },
      {
        "word": "يَزُغُّ",
        "desc": "آخر منفصل / مضعف بالضم: غُّ",
        "raw": "يَزُغُّ (آخر منفصل / مضعف بالضم: غُّ)"
      },
      {
        "word": "يُرَغِّبُ",
        "desc": "وسط منفصل / مضعف بالكسر: غِّـ",
        "raw": "يُرَغِّبُ (وسط منفصل / مضعف بالكسر: غِّـ)"
      },
      {
        "word": "غَارِ",
        "desc": "أول منفصل / ممدود بالألف: غَا",
        "raw": "غَارِ (أول منفصل / ممدود بالألف: غَا)"
      },
      {
        "word": "يَبْغُونَ",
        "desc": "وسط متصل / ممدود بالواو: ـغُو",
        "raw": "يَبْغُونَ (وسط متصل / ممدود بالواو: ـغُو)"
      },
      {
        "word": "الصَّغِيرُ",
        "desc": "وسط متصل / ممدود بالياء: ـغِي",
        "raw": "الصَّغِيرُ (وسط متصل / ممدود بالياء: ـغِي)"
      }
    ],
    "limbs": {
      "1": {
        "heading": "اللِّسَانُ (النُّطْقُ وَالبَيَانُ اللُّغَوِيُّ):",
        "body": "حَرْفُ الغَيْنِ (غ): النُّطْقُ السَّلِيمُ لِحَرْفِ الغَيْنِ المَجْهُورِ الرِّخْوِ المُسْتَعْلِي (المُفَخَّمِ) مِنْ مَخْرَجِ أَدْنَى الحَلْقِ مِمَّا يَلِي الفَمَ، وَالتَّمْيِيزُ الصَّوْتِيُّ الدَّقِيقُ بَيْنَهُ وَبَيْنَ الخَاءِ (المَهْمُوسَةِ) وَالعَيْنِ وَالقَافِ، وَإِتْقَانُ أَصْوَاتِهِ العَشَرَةِ (سَاكِن 1، مُتَحَرِّك 3، مُضَعَّف 3، مَمْدُود 3) فِي مَوَاقِعِهِ الثَّلَاثَةِ عَبْرَ الكَلِمَاتِ الـ 16، وَتَعْطِيرُ اللِّسَانِ بِالصَّلَاةِ الكَامِلَةِ البَالِغَةِ: «اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ»، وَتَلَاوَةِ فَاتِحَةِ الكِتَابِ: ﴿غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ﴾، وَالبَلَاغِ الصَّادِقِ."
      },
      "2": {
        "heading": "العَيْنُ (البَصَرُ وَالتَّفَكُّرُ الهَنْدَسِيُّ):",
        "body": "الهِلَالُ العُلْوِيُّ وَالقَوْسُ الكَوْنِيُّ وَالنُّقْطَةُ الأَلْفِيَّةُ وَالرَّقْمُ (28): مُشَاهَدَةُ شَكْلِ حَرْفِ الغَيْنِ (غ / غـ / ـغـ / ـغ) المُرَكَّبِ مِنْ قَوْسٍ عُلْوِيٍّ وَقَوْسٍ سُفْلِيٍّ كَـ﴿قَابَ قَوْسَيْنِ أَوْ أَدْنَىٰ﴾ (تَلَاقِي قَوْسِ الغَيْبِ وَقَوْسِ الشَّهَادَةِ) وَفَوْقَهُ نُقْطَةُ النُّورِ المُحَمَّدِيِّ الأَوَّلِ، وَالتَّأَمُّلُ البَصَرِيُّ فِي الرَّقْمِ (28) (4 × 7 = 28؛ أَرْبَعُ طَبَائِعَ فِي سَبْعِ سَمَاوَاتٍ، وَهُوَ «العَدَدُ التَّامُّ» الكَامِلُ فِي الحِسَابِ لِأَنَّ مَجْمُوعَ قَوَاسِمِهِ 1 + 2 + 4 + 7 + 14 = 28)، وَالتَّأَسِّي بِبَصَرِ المُصْطَفَى الَّذِي لَمْ يَزِغْ فِي المِعْرَاجِ: ﴿مَا زَاغَ الْبَصَرُ وَمَا طَغَىٰ﴾."
      },
      "3": {
        "heading": "الأُذُنُ / السَّمْعُ (الإِنْصَاتُ وَالوَعْيُ القَصَصِيُّ):",
        "body": "السِّيرَةُ المُحَمَّدِيَّةُ الكَامِلَةُ وَأُذُنُ الخَيْرِ الوَاعِيَةُ: الاسْتِمَاعُ الوَاعِي لِفُصُولِ سِيرَةِ النَّبِيِّ الخَاتَمِ مُحَمَّدٍ (صَلَّى اللهُ عَلَيْهِ وَآلِهِ) مِنْ عَالَمِ الأَنْوَارِ وَالمَوْلِدِ وَالمَبْعَثِ وَالمِعْرَاجِ وَالهِجْرَةِ إِلَى الفَتْحِ وَالغَدِيرِ وَوَصِيَّةِ الثَّقَلَيْنِ، وَتَدْرِيبُ الأُذُنِ عَلَى سَمَاعِ القُرْآنِ الكَرِيمِ وَالإِنْصَاتِ لَهُ (﴿فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ﴾) كَمَا وَصَفَ اللهُ سَمْعَ نَبِيِّهِ: ﴿قُلْ أُذُنُ خَيْرٍ لَّكُمْ﴾، مَعَ ضَبْطِ الوَقْفِ السَّاكِنِ عِنْدَ الفَوَاصِلِ وَالنِّقَاطِ."
      },
      "4": {
        "heading": "اليَدُ (الحِسَابُ وَالكِتَابَةُ وَالمَهَارَةُ العَمَلِيَّةُ):",
        "body": "الرَّقْمُ ثَمَانِيَةٌ وَعِشْرُونَ (28) وَالأَلْفُ الكَامِلَةُ (1000): تَدْرِيبُ اليَدِ عَلَى كِتَابَةِ الرَّقْمِ (28) وَالبُلُوغِ إِلَى ذُرْوَةِ حِسَابِ الجُمَّلِ مَعَ حَرْفِ الغَيْنِ (غ = 1000 = عَشْرُ مِئَاتٍ كَامِلَةٍ، كَأَلْفِ شَهْرٍ فِي لَيْلَةِ القَدْرِ وَأَلْفِ بَابٍ مِنَ العِلْمِ يَفْتَحُ كُلُّ بَابٍ أَلْفَ بَابٍ عَلَّمَهَا رَسُولُ اللهِ لِأَمِيرِ المُؤْمِنِينَ عَلِيٍّ)، وَتَدْرِيبُ اليَدِ عَلَى الكَرَمِ وَالمُصَافَحَةِ وَالمَسْحِ عَلَى رَأْسِ اليَتِيمِ وَوَضْعِ الحَجَرِ الأَسْوَدِ فِي مَوْضِعِهِ بِالتَّعَاوُنِ وَالحِكْمَةِ."
      },
      "5": {
        "heading": "الرِّجْلَانِ (الرِّيَاضَةُ وَالحَرَكَةُ البَدَنِيَّةُ):",
        "body": "رِيَاضَةُ المِشْيَةِ المُحَمَّدِيَّةِ (كَأَنَّمَا يَنْحَطُّ مِنْ صَبَبٍ) وَقِيَامِ اللَّيْلِ: تَدْرِيبُ الرِّجْلَيْنِ عَلَى مِشْيَةِ النَّبِيِّ مُحَمَّدٍ (صَلَّى اللهُ عَلَيْهِ وَآلِهِ) الَّتِي وَصَفَهَا أَمِيرُ المُؤْمِنِينَ عَلِيٌّ بِأَنَّهُ كَانَ يَمْشِي بِقُوَّةٍ وَنَشَاطٍ وَتَوَاضُعٍ يَرْفَعُ قَدَمَيْهِ عَنِ الأَرْضِ رَفْعًا رَشِيقًا كَأَنَّمَا يَنْحَدِرُ مِنْ صَبَبٍ، وَرِيَاضَةِ الرُّكُوبِ وَالسِّبَاحَةِ وَالرِّمَايَةِ، وَالصَّبْرِ فِي قِيَامِ اللَّيْلِ شُكْرًا لِلهِ (﴿طَه * مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ﴾)."
      },
      "6": {
        "heading": "البَطْنُ (العُلُومُ الكَسْبِيَّةُ وَالغِذَاءُ الطَّيِّبُ):",
        "body": "عُلُومُ الطِّبِّ النَّبَوِيِّ وَآدَابِ المَائِدَةِ وَالطَّيِّبَاتِ: تَعَلُّمُ قَاعِدَةِ الصِّحَّةِ النَّبَوِيَّةِ العُظْمَى: «نَحْنُ قَوْمٌ لَا نَأْكُلُ حَتَّى نَجُوعَ، وَإِذَا أَكَلْنَا لَا نَشْبَعُ»، وَمَعْرِفَةِ الأَغْذِيَةِ الطَّبِيعِيَّةِ الَّتِي كَانَ يُحِبُّهَا رَسُولُ اللهِ (التَّمْرُ، وَزَيْتُ الزَّيْتُونِ، وَالعَسَلُ، وَالشَّعِيرُ بالتَّلْبِينَةِ، وَاليَقْطِينُ، وَاللَّبَنُ، وَالخَلُّ، وَالرُّمَّانُ)، وَشُرْبِ المَاءِ مَصًّا عَلَى ثَلَاثَةِ أَنْفَاسٍ مَعَ التَّسْمِيَةِ فِي أَوَّلِهِ وَالحَمْدِ فِي آخِرِهِ."
      },
      "7": {
        "heading": "الفَرْجُ (الآدَابُ وَالنَّظَافَةُ وَالطَّهَارَةُ وَالسَّتْرُ):",
        "body": "تَمَامُ مَكَارِمِ الأَخْلَاقِ وَآيَةُ التَّطْهِيرِ وَالحَيَاءِ الأَعْظَمِ: تَعَلُّمُ قَوْلِهِ الشَّرِيفِ: «إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الأَخْلَاقِ»، وَآيَةِ التَّطْهِيرِ فِي أَهْلِ الكِسَاءِ الخَمْسَةِ: ﴿إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا﴾، وَالسِّوَاكِ، وَالطِّيبِ، وَالحَيَاءِ التَّامِّ، وَالبَشَاشَةِ فِي وُجُوهِ النَّاسِ، وَالأَمَانَةِ الصَّادِقَةِ («الصَّادِقُ الأَمِينُ»)."
      }
    },
    "grammar": {
      "topic": "المُرَاجَعَةُ الكُبْرَى: بِنَاءُ الجُمْلَةِ التَّامَّةِ وَأَرْكَانِهَا",
      "rule": "أَتْقَنَّا هٰذَا العَامَ: أَقْسَامَ الكَلِمَةِ (اسْمٌ، فِعْلٌ، حَرْفٌ)، وَالجُمْلَةَ الاِسْمِيَّةَ (مُبْتَدَأٌ وَخَبَرٌ)، وَالجُمْلَةَ الفِعْلِيَّةَ (فِعْلٌ وَفَاعِلٌ وَمَفْعُولٌ بِهِ)، وَالجَارَّ وَالمَجْرُورْ.",
      "example": "العِلْمُ نُورٌ يَهْدِي العُقُولَ فِي الحَيَاةِ.",
      "focusWord": "العِلْمُ نُورٌ / يَهْدِي العُقُولَ",
      "q": "مَا هِيَ الحَرَكَةُ الإِعْرَابِيَّةُ الصَّحِيحَةُ لِلمُبْتَدَأِ وَالفَاعِلِ دَائِمًا؟",
      "opts": [
        "الرَّفْعُ بِالضَّمَّةِ (ـُ)",
        "النَّصْبُ بِالفَتْحَةِ (ـَ)",
        "الجَرُّ بِالكَسْرَةِ (ـِ)",
        "السُّكُونُ (ـْ)"
      ]
    },
    "earIirab": {
      "topic": "تَاجُ الإِعْرَابِ السَّمْعِيِّ: الضَّمَّةُ لِلرَّفْعِ، الفَتْحَةُ لِلنَّصْبِ، الكَسْرَةُ لِلجَرّْ",
      "rule": "نَقْرَأُ الجُمْلَةَ العَرَبِيَّةَ بِفَصَاحَةٍ: نَرْفَعُ المُبْتَدَأَ وَالخَبَرَ وَالفَاعِلَ بِالضَّمَّةِ (ـُ)، وَنَنْصِبُ المَفْعُولَ بِهِ بِالفَتْحَةِ (ـَ)، وَنَجُرُّ الاِسْمَ بَعْدَ حَرْفِ الجَرِّ بِالكَسْرَةِ (ـِ).",
      "sentence": "غَرَسَ العَالِمُ الحِكْمَةَ فِي القُلُوبِ.",
      "targetWord": "العَالِمُ / الحِكْمَةَ / القُلُوبِ",
      "caseAns": "العَالِمُ مَرْفُوعٌ بـ (ـُ) وَالحِكْمَةَ مَنْصُوبٌ بـ (ـَ) وَالقُلُوبِ مَجْرُورٌ بـ (ـِ)"
    },
    "math": {
      "numVal": 100,
      "numName": "مِائَةٌ كَامِلَةٌ",
      "eqDisplay": "50 + 50 = 100",
      "subDisplay": "100 - 50 = 50",
      "compDisplay": "100 > 99",
      "q1": {
        "stem": "احْسِبْ نَاتِجَ جَمْعِ العَدَدِ (99 + 1):",
        "focus": "99 + 1 = ؟",
        "ans": "100 (مِائَةٌ)",
        "wrong": [
          "98",
          "90 (تِسْعُونَ)",
          "10 (عَشَرَةٌ)"
        ]
      },
      "q2": {
        "stem": "احْسِبْ نَاتِجَ طَرْحِ المِائَةِ:",
        "focus": "100 - 50 = ؟",
        "ans": "50 (خَمْسُونَ)",
        "wrong": [
          "85",
          "60",
          "25"
        ]
      }
    },
    "sport": {
      "title": "الاسْتِرْخَاءُ التَّامُّ وَتَهْدِئَةُ العَضَلَاتِ وَالشُّكْرُ",
      "middleText": "أَجْلِسُ بِهُدُوءٍ وَأُرْخِي جَمِيعَ عَضَلَاتِ وَجْهِي وَكَتِفَيَّ وَيَدَيَّ مَعَ أَخْذِ شَهِيقٍ عَمِيقٍ وَزَفِيرٍ طَوِيلْ. يَمْنَحُ هٰذَا الاسْتِرْخَاءُ الخِتَامِيُّ جِسْمِي وَعَقْلِي الرَّاحَةَ وَالنَّشَاطَ المُتَجَدِّدْ."
    },
    "sci": {
      "title": "مُخْتَبَرُ الكِيمْيَاءِ الشَّامِلُ: الكَاشِفُ الطَّبِيعِيُّ وَالعَالِمُ الصَّغِيرُ",
      "summaryThird": "فِي خِتَامِ رِحْلَةِ العُلُومِ نَسْتَخْدِمُ الكَاشِفَ الطَّبِيعِيَّ المُلَوَّنَ لِلتَّفْرِيقِ بَيْنَ الحَوَامِضِ كَاللَّيْمُونِ وَالقَوَاعِدِ كَالصُّودَا، وَنُطَبِّقُ خُطُوَاتِ البَحْثِ العِلْمِيِّ: (المُلَاحَظَةُ، وَالتَّجْرِبَةُ، وَالِاسْتِنْتَاجُ).",
      "focusConcept": "خُطُوَاتُ المَنْهَجِ العِلْمِيِّ",
      "factAns": "المُلَاحَظَةُ الدَّقِيقَةُ وَالتَّجْرِبَةُ وَالِاسْتِنْتَاجْ"
    },
    "rightsSummary": {
      "title": "القِصَّةُ الخِتَامِيَّةُ: حُسْنُ الخُلُقِ مَعَ النَّاسِ جَمِيعًا (حُور وَسُرُور - 28)",
      "storySentence": "اخْتَتَمَ سُرُورٌ وَحُورُ كِتَابَ الحُقُوقِ بِالقَاعِدَةِ الذَّهَبِيَّةِ: أَنْ نُحِبَّ لِلنَّاسِ مَا نُحِبُّ لِأَنْفُسِنَا، وَنُعَامِلَ الجَمِيعَ بِالأَمَانَةِ وَالرَّحْمَةِ وَالسَّلَامِ وَالخُلُقِ الحَسَنْ.",
      "applyAction": "أُفْشِي السَّلَامَ وَأُعَامِلُ كُلَّ النَّاسِ بِأَحْسَنِ الأَخْلَاقْ."
    },
    "rightsFullTitle": "(47) حق من سرك الله به وعلى يديه + (48) حق من ساءك القضاء على يديه بقول أو فعل + (49) حق أهل ملتك عامة + (50) حق أهل الذمة",
    "rightsQuote": "وَأمّا حَقُّ مَنْ سَرَّكَ اللهُ بهِ وَعلَى يَدَيهِ، فَـــــــــــــإنْ كَانَ تَعَمَّدَهَا لَكَ حَمِدْتَ اللهَ أَوّلاً ثُــــــــمَّ شَكَرْتَهُ عَلَى ذلِكَ بقَدْرِهِ فِي مَوْضِـــــــــــعِ الجَزَاءِ وَكَافَأتَهُ عَلَى فَضْــــــــــــــــلِ الابْتِدَاءِ وَأَرْصَــــــــــــــدْتَ لَهُ الْمُكَافَأَةَ، وَإنْ لَمْ يَكُنْ تَعَمَّدَهَا حَمِدْتَ اللهَ وَشَكَرتَهُ وعَلِمْتَ أنَّهُ مِنْهُ، تَوَحَّدَكَ بهَا وأَحْبَبتَ هذا إذ كَانَ سَبَباً مِنْ أَسْبَاب نِعَـــــــمِ اللهِ عَلَيْكَ وَترْجُو لَهُ بَعْدَ ذلِكَ خَيرًا، فإنَّ أَسْبَابَ النِّعَمِ بَرَكَةٌ حَيثُ مَا كَانتْ وَإنْ كَانَ لَمْ يَتَعَمَّدَ. ولا قُوَّةَ إلا باللهِ. | وَأمّــــــا حَقُّ مَنْ سَاءَكَ القَضَاءُ عَلَى يَدَيهِ بقَوْل أَوْ فِعْل فَإنْ كَانَ تَعَمَّدَهَا كَانَ العَفْوُ أَوْلَى بكَ لِمَا فِيهِ لَهُ مِن القَمْعِ وَحُسْنَ الأَدَب مَعَ كَثِيرِ أَمْثالِهِ مِنَ الخَلْقِ، فإنَّ اللهَ يَقُولُ ﴿وَلَمَنِ انتَصَرَ بَعْــــــــــــدَ ظُلْمِهِ فَأُولئِكَ مَا عَلَيْهِمْ مِنْ سَبيلٍ. إنمَّا السّبيلُ عَلى الَّذين يظْلِمونَ النَّاسَ ويَبغونَ في الأرْضِ بغَيرِ الحَقِّ، أُولئِكَ لهُم عَذابٌ أليِمٌ. وَلمَنْ صَبَرَ وَغَفَرَ إنَّ ذلِكَ لََمِنْ عَزْمِ الأُمُور﴾ وَقَــــــــــــــــــالَ عَزَّ وَجَلَّ ﴿وَإنْ عَاقَبْتُمْ فَعَاقِبُوا بمِثلِ مَــــــــــــــا عُوقِبتُمْ به وَلَئِنْ صَبَرْتُمْ لَهُوَ خَيْرٌ لِلصَّابرِين﴾ هَـــــــــذا فِي الْعَمْدِ فَإنْ لَمْ يَكُنْ عَمْدًا لَمْ تَظْلِمْهُ بتَعَمُّدِ الانتِصَارِ مِنْهُ فَتَكُونَ قَدْ كَافَأتَهُ فِي تَعَمُّــد عَلَى خَطَــــــــــــــــأ. وَرَفِقْتَ بهِ وَرَدَدتَهُ بأَلْطَفِ مَا تقْدِرُ عَلَيْهِ. ولا قُوَّةَ إلا باللهِ. | وَأمّــــــــــا حَقُّ أَهْلِ مِلَّتِكَ عَامَّةً فَإضْـــــــــــمَارُ السَّلامَةِ وَنشْرِ جَنَــــــــــــــــاحِ الرَّحْمَةِ وَالرِّفْقِ بمُسِيئِهــــــــــــــــــــِمْ وَتأَلُّفُهُمْ وَاسْتِصْلاحُهُمْ وَشُكْرُ مُحْسِنِهِمْ إلَى نفْسِهِ وَإلَيْكَ، فَإنَّ إحْسَانهُ إلَى نفْسِهِ إحْسَانهُ إلَيكَ إذا كَفَّ عَنْكَ أَذاهُ وَكَفَاكَ مَئونتَهُ وَحَبَسَ عَنكَ نفْسَهُ فَعَمِّهِمْ جَمِيعًا بدَعْوَتِكَ وَانصُرْهُمْ جَمِيعـاً بنُصْرَتِكَ وَأَنزَلتَهُمْ جَمِيعـــــــــــــــاً مِنْكَ مَنَـــــــــــازِلَهُمْ، كَبيرَهُمْ بمَنْزِلَةِ الْوَالِـــــــــــدِ وَصَغِيرَهُمْ بمَنْزِلَةِ الْوَلَدِ وَأَوْسَـــــــــــــطَهُمْ بمَنْزِلَةِ الأَخِ. فَمَـنْ أَتـــــــــــــــاكَ تَعَاهَدْتَه بلُطْف وَرَحْمَة. وَصِلْ أَخَاكَ بمَا يَجِبُ لِلأَخِ عَلَى أَخِيهِ. | وَأمّــــــــــــــــــــــا حَقُّ أَهْلِ الذِّمَّةِ فَالحُكْمُ فِيهِـــــمْ أَنْ تَقبَلَ مِنْهُمْ مَا قَبِلَ اللهُ، وَتَفِي بمَا جَعَلَ اللهُ لَهُمْ مِنْ ذِمَّتِهِ وَعَهْدِهِ وَتكِلُهُمْ إلَيهِ فِيمَا طَلبُوا مِنْ أَنْفُسِهِــــــــــــــمْ وَأُجْبرُِوا عَلَيْهِ وَتحْكُمَ فِيهِمْ بمَـــــــــــــــــا حَكَمَ اللهُ بهِ عَلَى نفْسِكَ فِيمَا جَرَى بَيْنَكَ (وَبيْنَهمْ) مِنْ مُعَامَلَة وَلْيَكُنْ بَينَكَ وَبيْنَ ظُلْمِهِمْ مِنْ رِعَايَةِ ذِمَّةِ اللَّهِ وَالْوَفَاءِ بعَهْــــــــــــــدِهِ وَعَهْدِ رَسُولِ اللَّهِ – صَلَّى اللهُ عَلَيْهِ وَآلِهِ – حَائِلٌ فَإنَّهُ بَلَغَنَا أنَّهُ قَالَ “مَنْ ظَلَمَ مُعَاهِـــدًا كُنْتُ خَصْمَهُ” فَاتَّقِ اللَّهَ. ولا حَوْلَ ولا قُوَّةَ إلا باللهِ.",
    "rightsSlides": [
      {
        "title": "📜 نَصُّ رِسَالَةِ الحُقُوقِ: (47) حق من سرك الله به وعلى يديه + (48) حق من ساءك القضاء على يديه بقول أو فعل + (49) حق أهل ملتك عامة + (50) حق أهل الذمة",
        "text": "وَأمّا حَقُّ مَنْ سَرَّكَ اللهُ بهِ وَعلَى يَدَيهِ، فَـــــــــــــإنْ كَانَ تَعَمَّدَهَا لَكَ حَمِدْتَ اللهَ أَوّلاً ثُــــــــمَّ شَكَرْتَهُ عَلَى ذلِكَ بقَدْرِهِ فِي مَوْضِـــــــــــعِ الجَزَاءِ وَكَافَأتَهُ عَلَى فَضْــــــــــــــــلِ الابْتِدَاءِ وَأَرْصَــــــــــــــدْتَ لَهُ الْمُكَافَأَةَ، وَإنْ لَمْ يَكُنْ تَعَمَّدَهَا حَمِدْتَ اللهَ وَشَكَرتَهُ وعَلِمْتَ أنَّهُ مِنْهُ، تَوَحَّدَكَ بهَا وأَحْبَبتَ هذا إذ كَانَ سَبَباً مِنْ أَسْبَاب نِعَـــــــمِ اللهِ عَلَيْكَ وَترْجُو لَهُ بَعْدَ ذلِكَ خَيرًا، فإنَّ أَسْبَابَ النِّعَمِ بَرَكَةٌ حَيثُ مَا كَانتْ وَإنْ كَانَ لَمْ يَتَعَمَّدَ. ولا قُوَّةَ إلا باللهِ. | وَأمّــــــا حَقُّ مَنْ سَاءَكَ القَضَاءُ عَلَى يَدَيهِ بقَوْل أَوْ فِعْل فَإنْ كَانَ تَعَمَّدَهَا كَانَ العَفْوُ أَوْلَى بكَ لِمَا فِيهِ لَهُ مِن القَمْعِ وَحُسْنَ الأَدَب مَعَ كَثِيرِ أَمْثالِهِ مِنَ الخَلْقِ، فإنَّ اللهَ يَقُولُ ﴿وَلَمَنِ انتَصَرَ بَعْــــــــــــدَ ظُلْمِهِ فَأُولئِكَ مَا عَلَيْهِمْ مِنْ سَبيلٍ. إنمَّا السّبيلُ عَلى الَّذين يظْلِمونَ النَّاسَ ويَبغونَ في الأرْضِ بغَيرِ الحَقِّ، أُولئِكَ لهُم عَذابٌ أليِمٌ. وَلمَنْ صَبَرَ وَغَفَرَ إنَّ ذلِكَ لََمِنْ عَزْمِ الأُمُور﴾ وَقَــــــــــــــــــالَ عَزَّ وَجَلَّ ﴿وَإنْ عَاقَبْتُمْ فَعَاقِبُوا بمِثلِ مَــــــــــــــا عُوقِبتُمْ به وَلَئِنْ صَبَرْتُمْ لَهُوَ خَيْرٌ لِلصَّابرِين﴾ هَـــــــــذا فِي الْعَمْدِ فَإنْ لَمْ يَكُنْ عَمْدًا لَمْ تَظْلِمْهُ بتَعَمُّدِ الانتِصَارِ مِنْهُ فَتَكُونَ قَدْ كَافَأتَهُ فِي تَعَمُّــد عَلَى خَطَــــــــــــــــأ. وَرَفِقْتَ بهِ وَرَدَدتَهُ بأَلْطَفِ مَا تقْدِرُ عَلَيْهِ. ولا قُوَّةَ إلا باللهِ. | وَأمّــــــــــا حَقُّ أَهْلِ مِلَّتِكَ عَامَّةً فَإضْـــــــــــمَارُ السَّلامَةِ وَنشْرِ جَنَــــــــــــــــاحِ الرَّحْمَةِ وَالرِّفْقِ بمُسِيئِهــــــــــــــــــــِمْ وَتأَلُّفُهُمْ وَاسْتِصْلاحُهُمْ وَشُكْرُ مُحْسِنِهِمْ إلَى نفْسِهِ وَإلَيْكَ، فَإنَّ إحْسَانهُ إلَى نفْسِهِ إحْسَانهُ إلَيكَ إذا كَفَّ عَنْكَ أَذاهُ وَكَفَاكَ مَئونتَهُ وَحَبَسَ عَنكَ نفْسَهُ فَعَمِّهِمْ جَمِيعًا بدَعْوَتِكَ وَانصُرْهُمْ جَمِيعـاً بنُصْرَتِكَ وَأَنزَلتَهُمْ جَمِيعـــــــــــــــاً مِنْكَ مَنَـــــــــــازِلَهُمْ، كَبيرَهُمْ بمَنْزِلَةِ الْوَالِـــــــــــدِ وَصَغِيرَهُمْ بمَنْزِلَةِ الْوَلَدِ وَأَوْسَـــــــــــــطَهُمْ بمَنْزِلَةِ الأَخِ. فَمَـنْ أَتـــــــــــــــاكَ تَعَاهَدْتَه بلُطْف وَرَحْمَة. وَصِلْ أَخَاكَ بمَا يَجِبُ لِلأَخِ عَلَى أَخِيهِ. | وَأمّــــــــــــــــــــــا حَقُّ أَهْلِ الذِّمَّةِ فَالحُكْمُ فِيهِـــــمْ أَنْ تَقبَلَ مِنْهُمْ مَا قَبِلَ اللهُ، وَتَفِي بمَا جَعَلَ اللهُ لَهُمْ مِنْ ذِمَّتِهِ وَعَهْدِهِ وَتكِلُهُمْ إلَيهِ فِيمَا طَلبُوا مِنْ أَنْفُسِهِــــــــــــــمْ وَأُجْبرُِوا عَلَيْهِ وَتحْكُمَ فِيهِمْ بمَـــــــــــــــــا حَكَمَ اللهُ بهِ عَلَى نفْسِكَ فِيمَا جَرَى بَيْنَكَ (وَبيْنَهمْ) مِنْ مُعَامَلَة وَلْيَكُنْ بَينَكَ وَبيْنَ ظُلْمِهِمْ مِنْ رِعَايَةِ ذِمَّةِ اللَّهِ وَالْوَفَاءِ بعَهْــــــــــــــدِهِ وَعَهْدِ رَسُولِ اللَّهِ – صَلَّى اللهُ عَلَيْهِ وَآلِهِ – حَائِلٌ فَإنَّهُ بَلَغَنَا أنَّهُ قَالَ “مَنْ ظَلَمَ مُعَاهِـــدًا كُنْتُ خَصْمَهُ” فَاتَّقِ اللَّهَ. ولا حَوْلَ ولا قُوَّةَ إلا باللهِ. — وَفِي سِيرَةِ مُحَمَّدٌ (ﷺ): تَمَامُ مَكَارِمِ الأَخْلَاقِ وَآيَةُ التَّطْهِيرِ وَالحَيَاءِ الأَعْظَمِ: تَعَلُّمُ قَوْلِهِ الشَّرِيفِ: «إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الأَخْلَاقِ»، وَآيَةِ التَّطْهِيرِ فِي أَهْلِ الكِسَاءِ الخَمْسَةِ: ﴿إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا﴾، وَالسِّوَاكِ، وَالطِّيبِ، وَالحَيَاءِ التَّامِّ، وَالبَشَاشَةِ فِي وُجُوهِ النَّاسِ، وَالأَمَانَةِ الصَّادِقَةِ («الصَّادِقُ الأَمِينُ»)."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق من سرك الله به وعلى يديه",
        "text": "في صباح يوم جميل، كانت حور و لينا تجلسان في المطبخ تُعِدّان سلطة الفواكه، فقد طلبت منهما أمهما تجهيز شيء خفيف للفطور. كانت لينا تقطع الموز ببطء بينما حور تضيف العسل وتخلط الفواكه برفق. في تلك الأثناء كان نور في الخارج يلعب بدراجته في الحديقة. وبعد أن تعب شعر بالجوع فعاد إلى المنزل مسرعًا. دخل وشم رائحة الفواكه وقال بسعادة: – هل حضرتم هذه لأجلي؟ لقد جعت جدًا! ابتسمت حور وقالت: – لم نجهزها لك وحدك يا نور، لكنها ستكون لك معنا! فرح نور وشكرهما. دخل ليستحم بعد اللعب. وبينما كان في الحمّام وجد صابونا جديدا ذا رائحة جميلة جدًا. قال في نفسه بدهشة: – يا سلام! أمي اشترت لي هذا الصابون الجميل؟ كم هي رائعة! وبعد أن انتهى من استحمامه وبدأ يرتدي ثيابه، وجد على السرير ملابس جديدة مرتبة بعناية. تعجب وقال: – ما هذا أيضًا؟ لمن هذه الملابس؟ دخلت لينا وقالت: – هذه هدية من جدتنا. ازداد نور سعادة وقال: – يومي يبدو جميلًا! جلس ليكمل نقل الدرس الذي فاته من صديقه عبر مكالمة هاتفية، وعندما فتح دفتره وجد أن الدرس مكتوب بخط المعلم نفسه! استغرب واتصل بصديقه يسأله كيف حدث ذلك. فأخبره:"
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق من سرك الله به وعلى يديه",
        "text": "– عندما خرجت لتحضر أوراقًا للمعلم من غرفة المعلمين، كتب هو الدرس لك في دفترك لأنه لم يحب ان تتأخر عن الباقين من التلاميذ لخروجك من الصف. شعر نور بامتنان كبير. وفي المساء جلس مع أخته حور يحكي لها ما حدث معه طوال اليوم: – اليوم كان مليئًا بالمفاجآت يا حور! طعام لذيذ، وصابون جديد، وملابس هدية، وحتى المعلم ساعدني في الدرس! ابتسمت حور وقالت له: – يا نور، بعض الناس ربما تعمدوا إسعادك، مثل جدتنا. وبعضهم ربما لم يقصد إسعادك مباشرة لكن الله جعله سببًا لخير وصل إليك، مثل المعلم. لكن في النهاية، الله هو من يسوق إليك الخير بأسبابه. دخلت الأم وقالت: – وهذا لأنك يا نور بدأت صباحك بعمل طيب… أتذكر عندما علمت لينا اليوم سورة التوحيد بصبر ورفق؟! نظر إليها نور وقال: – نعم أتذكر. ابتسمت الأم وقالت: – من فعل خيرًا وجد خيرًا، والله لا يضيع تعب من يعمل لوجهه. رفع نور يديه وقال بقلب شاكر: – يا الله ما أجملك! الحمد لك يا رب على نعمك. وانتهى اليوم بقلوب ممتلئة رضا وامتنان، فقد تعلم نور أن من سرّه الله على يد الناس، فشكر الله أولاً ثم شكرهم، لأن الخير كله من الله، يأتي بأسبابه حيث يشاء."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق من ساءك القضاء على يديه بقول أو فعل",
        "text": "في صباح يومٍ هادئ، كانت حور تلعب مع أختها لينا في غرفة الألعاب. فجأةً تعالت الأصوات، فقد ضربت لينا أختها حور ظنًا منها أنّها أخذت لعبتها دون إذن. دخل نور بسرعة وحاول تهدئتهما، فاكتشف أنّ اللعبة لم تكن أصلًا للينا، وأنّها ظلمت أختها دون تأنٍ أو تأكد. هدّأ نور الموقف وقال بهدوء: \"لا يجوز أن نظلم أحدًا أو نتّهمه قبل أن نتأكد من الحقيقة.\" تصالحَت الأختان واعتذرت لينا من حور، ثم خرجوا جميعًا إلى المدرسة. وفي الطريق، رأى نور وحور ولدًا يرمي الحجارة نحو نافذة منزل وهو يضحك دون مبالاة، فكاد أن يكسر الزجاج ويتسبب بالأذى. خرج صاحب المنزل غاضبًا وطلب من نور وحور الشهادة على ما رأيا، لكنهما قالا بأدب: \"لقد سلمت النافذة من الأذى ولله الحمد، لكن هذا فعلٌ خاطئ ويجب أن لا يتكرر.\" استحيا الولد من كلامهما وابتعد. وبعد انتهاء اليوم الدراسي وأثناء عودتهم إلى البيت، رأوا الولد نفسه يقوم بسكب الزيت على الطريق حتى ينزلق المارّة ويسقطوا! وقف نور وحور بحزم ونظرا إليه نظرة غضب واستنكار، ثم قررا إخبار والدتهما بما فعله. عندما وصلا المنزل أخبرا أمّهما، فقامت الأم بالتواصل مع أهل ذلك الولد وأخبرتهم بما حدث. شكر الأهل الأم على نصحها، واعتذروا عمّا فعله ولدهم، وقرّروا معاقبته بعدم السماح له بالخروج من البيت دون مراقبة حتى يتأدب ويتعلم عدم إيذاء الآخرين."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق من ساءك القضاء على يديه بقول أو فعل",
        "text": "في المساء، بينما كان نور يقرأ درس التاريخ، سأل أمّه بحزن: \"لماذا يوجد في العالم من يؤذي غيره عن عمد؟ كيف قُتل أهل هيروشيما بتلك القنبلة الظالمة؟ وكيف يُظلم المستضعفون اليوم في غزة؟ ألا يستحق الظالمون العقاب؟\" أجابته أمّه بحكمة: \"بلى يا نور، فالظالم يجب أن يُردع، وقد قال الله تعالى في القرآن الكريم: ﴿وَلَمَنِ انتَصَرَ بَعْدَ ظُلْمِهِ فَأُولئِكَ مَا عَلَيْهِمْ مِنْ سَبيلٍ. إنمَّا السّبيلُ عَلى الَّذين يظْلِمونَ النَّاسَ ويَبغونَ في الأرْضِ بغَيرِ الحَقِّ، أُولئِكَ لهُم عَذابٌ أليِمٌ. وَلمَنْ صَبَرَ وَغَفَرَ إنَّ ذلِكَ لََمِنْ عَزْمِ الأُمُور﴾ ابتسم نور واطمأن قلبه، ثم ذهب هو وإخوته إلى النوم وهم يرددون مطمئنين: إنمَّا السّبيلُ عَلى الَّذين يظْلِمونَ النَّاسَ ويَبغونَ في الأرْضِ بغَيرِ الحَقِّ، أُولئِكَ لهُم عَذابٌ أليِمٌ."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق أهل ملتك عامة",
        "text": "رمضان.. مدرسة القلوب (1) افتتاح الجلسة: بعد صلاة الظهر في يوم رمضاني هادئ، جلست الأم مع أطفالها (نور، حور، لينا) تحت ضوء الشمس الدافئ. لم تكن جلسة عادية، بل كان جوها مفعمًا بالهدوء والحنان. قالت الأم بصوت ناعم: \"يا قرة عيني، رمضان ليس فقط للصوم عن الطعام، بل هو مدرسة لتعلم لغة القلوب. اليوم سنتذكر سوياً بعض المواقف التي مررنا بها، وكيف يمكننا أن نكون أفضل مع من حولنا.\" (2) موقف إضمار السلامة: الأم: \"نور، هل تتذكر ذلك اليوم في الحديقة عندما رأيت الطفل الصغير يقترب من أرجوحة متحركة بقوة؟\" تذكر نور، وتلمع عيناه: \"نعم، لقد ركضت بسرعة وسحبته بلطف من يده. كنت خائفاً عليه حقاً، وقلبي كان يخفق بشدة.\" الأم (بتعاطف): \"ذلك الخوف الذي شعرت به في قلبك هو شعور نبيل. إنه يعني أنك تحمل سلامة الآخرين في داخلك. هذه هي المسؤولية.\" (3) موقف نشر الرحمة: الأم (تلتفت إلى حور): \"وحور، ماذا عن الموقف الذي كسرت فيه لينا لعبتك المفضلة عن غير قصد؟\" حور (تنظر إلى لينا الصغيرة التي انكمشت قليلاً): \"في البداية غضبت جداً ورفعت صوتي عليها. لكنني رأيت دموعها في عينيها وخوفها. فتذكرت كم مرة أخطأت أنا أيضاً فسامحتها.\" الأم (مبتسمة): \"الرحمة ليست أن تسامح فقط، بل أن تضع نفسك مكان من أخطأ وتشعر بألمه. هذا ما فعلتيه.\" (4) موقف الرفق بالمسيئين: الأم: \"وذلك الطفل الذي كان يرمي الحجارة تجاهكم في الحديقة العامة، كيف كان رد فعلكم يا نور؟\" نور (يبتسم ابتسامة صغيرة): \"أخبرت الحور ولينا بالابتعاد. نظرت إليه بحزم لكني لم أصرخ أو أرد عليه. بعد قليل، جاء واعتذر. كان يريد فقط لفت انتباهنا للعب معه.\" العبرة: \"اللين يلين القلوب القاسية، يكون الشخص السيء هو فقط شخص حزين أو وحيد يحتاج إلى لطف.\" (5) موقف تألفهم واستصلاحهم: الأم: \"وماذا عن ذلك اليوم الذي رأيتم فيه ذلك الولد يلقي الزيت على الرصيف؟\" حور: \"نور اخبرك فقلتي لوالديه فاصبحا يحرصان على مراقبته ،لأنه إذا سقط أحد على هذا الزيت قد يؤذيه'. العبرة: \"الإصلاح الحقيقي هو أن تساعد المخطئ ليرى الخطأ بنفسه، لا أن توبخه فقط.\" (6) موقف شكر المحسن إليك وإلى نفسه: الأم: \"نور، لقد فرحت كثيراً بالصابون المعطر الذي اشتريته. اتذكر؟\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق أهل ملتك عامة",
        "text": "نور: \"نعم ظننته لي ! و كلما شممت رائحته الجميلة شكرتك امي \" العبرة: \"الشكر ليس مجرد كلمة، بل هو شعور يملأ القلب فيتحول إلى فعل جميل.\" (7) موقف معاملة المحسن بحسب أثره: الأم: \"أتتذكرون عندما اتصلت جارتنا الطيبة تحتاج دواء لابنها الذي ارتفاع حرارته، فأسرع نور بأخذ الدواء لها ؟\" حور: \"نعم، اتعلمين يا امي نحن نحب جارتنا هذه فهي كل مرة تعطينا زهرة جميلة من حديقتها اهديها لمعلمتي!\" العبرة: \"تقدير المعروف يزرع الخير ويجعله يستمر، كالشجرة الطيبة التي تثمر مرة بعد أخرى.\" (8) موقف عمِّهم جميعًا بدعوتك: الأم: \"وهل تذكرتم تلك الجارة في دعائكم؟\" حور: \"نعم، عندما اتذكر الاطفال المرضى اتألم لحالهم و ارجو الله ان يعينهم بالصحة والبركة. شعرت بأن هذا أقل شيء يمكنني فعله لاعينهم على ما يعانون.\" العبرة: \"الدعاء هو هدية لا تكلف مالاً، لكنها تصل إلى القلب والسماء.\" (9) موقف انصُرهم جميعًا بنصرتك: الأم: \"وماذا عن لما  سألتني يا نور عن اطفال غزة ؟\" نور: \"لم اتردد لحظة من مساندتهم بقلبي و ما استطيع من التوقف عن الشراء من اعدائهم و حتى كلما كان هناك فرصة لانصرهم بقولي و كلامي لن اقصر!\" العبرة: \"يد واحدة تصفق، لكن الأيدي معاً تُصفق بصوت يملأ العالم فرحاً. التعاون يجعل المساعدة أقوى.\" (10) موقف إنزالهم منازلهم حسب الكبر والصغر: الأم: \"في نزهتنا الأخيرة، رأيتكم تتعاملون مع الناس باحترام كبير. نور ساعد البائع المسن، وحور لعبت برفق مع لينا.\" نور: \"البائع كان متعباً. مساعدتي له كانت واجبة. وأما لينا فهي صغيرة ولا تفهم كل شيء، فاللين معها أفضل.\" العبرة: \"الاحترام للكبير والرفق بالصغير هما ميزان الإنسان المستقيم القلب.\" (11) موقف وصل أخاك بما يجب للأخ على أخيه: الأم (تنهي الجلسة بنظرة حانية تشملهم جميعاً): \"في النهاية، ما أجمل أن تكونوا سنداً لبعضكم. مثلما فعل نور عندما هدأ من خلافكم على اللعبة فكل الاطفال اخوانكم و لابد ان نحب الخير للجميع.\" حور (تضع يدها على كتف لينا): \"نعم، هو أخي الكبير. أحس أنني آمن عندما يكون . وأنا أحاول أن أكون الأخت العطوفة للينا.\" العبرة: \"الأسرة هي الملاذ الأول. وحقوق الأخوة هي خيط ناعم لكنه متين جداً، يربط القلوب ويحميها.\""
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق أهل الذمة",
        "text": "نور وحور في مسابقة العلوم العالمية كان نور (14 عاماً) وشقيقته حور (12 عاماً) يجلسان في غرفة المعيشة، تتوسطهما أوراق ومخططات لمشروع علمي طموح. قد تم اختيارهما لتمثيل مدرستهما في مسابقة العلوم العالمية التي ستجمع شباباً من مختلف دول العالم. قالت حور بنبرة متحمسة: \"أتعلم يا نور؟ سيكون هناك فريق من اليابان، وآخر من ألمانيا، وفريق من جنوب إفريقيا... أنا متوترة بعض الشيء!\" رد نور مبتسماً: \"ليس هناك داع للتوتر، يا حور. تذكري ما تعلمناه من أمنا: 'الناس سواسية كأسنان المشط'، والأهم هو التعلم والمعرفة الحقة\". الموقف الأول: البروفة الأخيرة قبيل المسابقة بيوم، كان الفريق الياباني يختبر جهاز الروبوت الخاص بهم في القاعة المجاورة. سمع نور وحور صوتاً مرتفعاً ثم انقطاعاً للتيار الكهربائي عن قاعة البروفة الخاصة بهما. دخل عليهم أحد المنظمين معتذراً: \"عذراً، هناك عطل مفاجئ في الكهرباء بسبب تجربة الفريق الياباني. قد نضطر لتأجيل بروفتكم\". نظرت حور إلى أخيها المتذمر، ثم قالت بهدوء: \"لا بأس، يمكننا مشاركة القاعة مع الفريق الياباني. الجميع هنا لهدف واحد\". العبرة: المساواة في المعاملة وتقدير الظروف الطارئة للآخرين. الموقف الثاني: الأزمة غير المتوقعة أثناء التحضير، لاحظ نور أن الفريق الهندي يعاني من مشكلة في توصيلات الجهاز الخاص بهم. بينما كان باقي المتسابقين منشغلين بأجهزتهم، اقترب نور منهم: \"هل يمكنني مساعدتكم؟ لقد واجهت مشكلة مشابهة من قبل\". نظر أعضاء الفريق الهندي بدهشة، ثم امتنان. أمضى نور معهم ساعة كاملة يساعدهم في حل المشكلة. العبرة: البر والإحسان ومد يد العون للجميع بغض النظر عن خلفياتهم. الموقف الثالث: المنافسة الشريفة في اليوم الأخير للمسابقة، كان التقييد شديداً بين فريق نور وحور والفريق الكندي. لاحظت حور أن أحد أعضاء الفريق الكندي قد أخطأ في تسجيل قراءة واحدة، وهو خطأ كان سيرجح كفة فريقها. همست لأخيها: \"نور، انظر... لقد أخطأوا في هذه القراءة\"."
      },
      {
        "title": "🌷 قِصَّةُ حُورَ وَسُرُورَ: حق أهل الذمة",
        "text": "رد نور دون تردد: \"يجب إخبارهم\"، ثم توجه إلى الفريق الكندي وأخبرهم بلطف بالخطأ. انتهت المسابقة بفوز الفريق الكندي بالمركز الأول، وفريق نور وحور بالمركز الثاني. العبرة: العدل المطلق ومراعاة الحقوق حتى في لحظات المنافسة القصوى. الموقف الرابع: بعد المسابقة بعد انتهاء المسابقة، تقدمت حور إلى الفريق الكندي مهنئة: \"أهنئكم، كان فوزكم مستحقاً\". ثم أضافت: \"لدي سؤال... لماذا اخترتم هذا التصميم بالذات؟\" أمضى الفريقان ساعة كاملة يتبادلون المعرفة والخبرات، متجاوزين حدود المنافسة. العبرة: الاعتراف بالفضل والشكر على الإنجازات، وبناء جسور التعاون. الخاتمة: الدرس المستفاد في طريق العودة إلى المنزل، قالت حور: \"كنت أعتقد أن المسابقة كانت حول الفوز، لكنني الآن أدركت أنها كانت حول التعلم والاحترام\". رد نور: \"صدقت يا حور. هكذا علمتنا أمي: 'أن تحكم عليهم بما تحكم به على نفسك'. عندما ساعدت الفريق الهندي، وعندما صححت للفريق الكندي خطأهم، لم أفعل ذلك لأنهم مختلفون عني، بل لأنني أعتبرهم إخوة في الإنسانية\". العبرة الأخيرة: الوفاء بعهد الله في عدم ظلم الآخرين، والعدل الذي يأمر به الدين، هو أساس التعامل مع كل الناس، بغض النظر عن أديانهم أو خلفياتهم. فَهذِهِ خَمْسُونَ حَقًّا مُحِيطًا بكَ لا تَخرُجْ مِنْهَــــــــا فِي حَال مِن الأَحْـــــــــــــــوَالِ، يَجِبُ عَلَيْكَ رِعَايَتُهَا وَالْعَمَلُ فِي تَأْدِيَتِهَا وَالاسْتِعَانَةُ باللهِ جَلَّ ثَنَاؤُهُ عَلَى ذَلِكَ. وَلا حَوْلَ وَلا قُوَّةَ إلا باللهِ وَالْحَمْدُ للهِ رَب العَالَمِينَ. في عالم مليء بالعدل، حيث لكل شخص حق محفوظ، عاش نور وحور ولينا. رأوا فيه كل شيء في مكانه الصحيح: الكبير له مكانته، الصغير يُراعى ويُرحم، المسؤول يؤدي واجبه، والسائل يُعطى بما يستحق، والخصم يُعامل بالعدل والرفق، والناصح يُستمع له، والمستشار تُقبل نصيحته، ومن أسعدهم الله بهم يُشكر ويُقدر. كانوا يشاهدون كيف يُعطى كل ذي حق حقه، وكيف تُكفَّ عن الأذى القلوب، وكيف يُردّ المعروف إلى أهله، وكيف يُصلح الناس بعضهم بعضًا باللين والحكمة. رأوا الرحمة في أعين الجميع، والتعاون في كل مكان، والسكينة تحيط بكل بيت وشارع. تعلم الأطفال أن الله تعالى هو المهيمن على كل شيء، وأن الاستعانة به هي طريق الوفاء بالحقوق، وأن الامتنان له هو مفتاح السعادة. أدركوا أن العالم يصبح أجمل عندما تُراعى الحقوق، وعندما يسود العدل بين الناس، وأن كل شخص مهما كان صغيرًا أو كبيرًا يمكنه أن يكون سببًا للخير. ابتسم نور وحور ولينا لبعضهما، وعرفت قلوبهم أن العدالة والرحمة ليست مجرد كلمات، بل حياة كاملة تُرى وتُحس في كل لحظة. وعلموا أن كل يوم فرصة جديدة لممارسة الحقوق، لنكون جميعًا سببًا في عالم يسوده الخير والسلام."
      }
    ],
    "science": {
      "groupTitle": "السَّمَاءُ العِلْمِيَّةُ السَّابِعَةُ: عَالَمُ الكِيمْيَاءِ",
      "topic": "التَّجْرِبَتَانِ (13 وَ14): السَّلَايْمُ السِّحْرِيُّ (تَرَابُطُ البُولِيمَرَاتِ) — كَاشِفُ المَلْفُوفِ البَنَفْسَجِيِّ وَتَغَيُّرُ الأَلْوَانِ",
      "coverImg": "assets/y7/scince/s28.1.jpg",
      "slides": [
        {
          "img": "assets/y7/scince/s28.1.jpg",
          "text": "التَّجْرِبَةُ (13) السَّلَايْمُ السِّحْرِيُّ: نَسْكُبُ الغِرَاءَ السَّائِلَ وَالأَلْوَانَ فِي وِعَاءِ خَلْطٍ ثُمَّ نُضِيفُ المُحَفِّزَ وَنَخْلِطُ بِالمِلْعَقَةِ، فَتَتَرَابَطُ الجُزَيْئَاتُ كِيمْيَائِيًّا (سَلَاسِلُ البُولِيمَرَاتِ) وَتَتَغَيَّرُ خَصَائِصُ المَوَادِّ السَّائِلَةِ لِتُصْبِحَ مَادَّةً مَطَّاطِيَّةً جَدِيدَةً هِيَ السَّلَايْمُ المَطَّاطِيُّ."
        },
        {
          "img": "assets/y7/scince/s28.2.jpg",
          "text": "التَّجْرِبَةُ (14) كَاشِفُ المَلْفُوفِ البَنَفْسَجِيِّ وَتَغَيُّرُ الأَلْوَانِ: نَنْقَعُ أَوْرَاقَ المَلْفُوفِ البَنَفْسَجِيِّ فِي مَاءٍ سَاخِنٍ لِنَحْصُلَ عَلَى كَاشِفٍ طَبِيعِيٍّ بَنَفْسَجِيٍّ، وَنُوَزِّعُهُ فِي كُؤُوسٍ شَفَّافَةٍ؛ عِنْدَ إِضَافَةِ عَصِيرِ اللَّيْمُونِ (حَمْضِيٍّ) يَتَحَوَّلُ اللَّوْنُ إِلَى الأَحْمَرِ، وَعِنْدَ إِضَافَةِ البِيْكَرْبُونَاتِ (قَاعِدِيٍّ) يَتَحَوَّلُ إِلَى الأَخْضَرِ."
        }
      ],
      "text": "التَّجْرِبَةُ (13) السَّلَايْمُ السِّحْرِيُّ: نَسْكُبُ الغِرَاءَ السَّائِلَ وَالأَلْوَانَ فِي وِعَاءِ خَلْطٍ ثُمَّ نُضِيفُ المُحَفِّزَ وَنَخْلِطُ بِالمِلْعَقَةِ، فَتَتَرَابَطُ الجُزَيْئَاتُ كِيمْيَائِيًّا (سَلَاسِلُ البُولِيمَرَاتِ) وَتَتَغَيَّرُ خَصَائِصُ المَوَادِّ السَّائِلَةِ لِتُصْبِحَ مَادَّةً مَطَّاطِيَّةً جَدِيدَةً هِيَ السَّلَايْمُ المَطَّاطِيُّ. التَّجْرِبَةُ (14) كَاشِفُ المَلْفُوفِ البَنَفْسَجِيِّ وَتَغَيُّرُ الأَلْوَانِ: نَنْقَعُ أَوْرَاقَ المَلْفُوفِ البَنَفْسَجِيِّ فِي مَاءٍ سَاخِنٍ لِنَحْصُلَ عَلَى كَاشِفٍ طَبِيعِيٍّ بَنَفْسَجِيٍّ، وَنُوَزِّعُهُ فِي كُؤُوسٍ شَفَّافَةٍ؛ عِنْدَ إِضَافَةِ عَصِيرِ اللَّيْمُونِ (حَمْضِيٍّ) يَتَحَوَّلُ اللَّوْنُ إِلَى الأَحْمَرِ، وَعِنْدَ إِضَافَةِ البِيْكَرْبُونَاتِ (قَاعِدِيٍّ) يَتَحَوَّلُ إِلَى الأَخْضَرِ.",
      "q1": {
        "q": "مَاذَا يَحْدُثُ لِجُزَيْئَاتِ الغِرَاءِ السَّائِلِ عِنْدَ إِضَافَةِ المُحَفِّزِ فِي تَجْرِبَةِ السَّلَايْمِ السِّحْرِيِّ؟",
        "focusWord": "تَرَابُطُ الجُزَيْئَاتِ",
        "options": [
          {
            "text": "تَتَرَابَطُ الجُزَيْئَاتُ كِيمْيَائِيًّا وَتُكَوِّنُ مَادَّةً مَطَّاطِيَّةً جَدِيدَةً (سَلَايْمَ)",
            "correct": true
          },
          {
            "text": "تَتَبَخَّرُ فِي الهَوَاءِ",
            "correct": false
          },
          {
            "text": "تَتَحَوَّلُ إِلَى حَدِيدٍ صُلْبٍ",
            "correct": false
          },
          {
            "text": "تَشْتَعِلُ بِالنَّارِ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "إِلَى أَيِّ لَوْنٍ يَتَحَوَّلُ مَاءُ المَلْفُوفِ البَنَفْسَجِيِّ عِنْدَ إِضَافَةِ اللَّيْمُونِ (الحَمْضِ) وَعِنْدَ إِضَافَةِ البِيْكَرْبُونَاتِ (القَاعِدَةِ)؟",
        "focusWord": "كَاشِفُ المَلْفُوفِ البَنَفْسَجِيِّ",
        "options": [
          {
            "text": "يَتَحَوَّلُ إِلَى الأَحْمَرِ مَعَ الحَمْضِ (اللَّيْمُونِ)، وَإِلَى الأَخْضَرِ مَعَ القَاعِدَةِ (البِيْكَرْبُونَاتِ)",
            "correct": true
          },
          {
            "text": "يَبْقَى أَسْوَدَ فِي الكَأْسَيْنِ",
            "correct": false
          },
          {
            "text": "يَتَحَوَّلُ إِلَى ذَهَبٍ",
            "correct": false
          },
          {
            "text": "يَخْتَفِي المَاءُ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَاذَا يُسَمَّى مَاءُ المَلْفُوفِ البَنَفْسَجِيِّ الَّذِي يَكْشِفُ لَنَا المَحَالِيلَ الحَمْضِيَّةَ وَالقَاعِدِيَّةَ بِتَغَيُّرِ لَوْنِهِ؟",
        "focusWord": "كَاشِفٌ طَبِيعِيٌّ",
        "options": [
          {
            "text": "كَاشِفٌ كِيمْيَائِيٌّ طَبِيعِيٌّ (مُؤَشِّرٌ طَبِيعِيٌّ)",
            "correct": true
          },
          {
            "text": "مُحَرِّكٌ كَهْرَبَائِيٌّ",
            "correct": false
          },
          {
            "text": "مِجْهَرٌ ضَوْئِيٌّ",
            "correct": false
          },
          {
            "text": "مِيزَانٌ حَرَارِيٌّ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "الغِرَاءُ السَّائِلُ + المُحَفِّزُ",
          "left": "تَرَابُطٌ كِيمْيَائِيٌّ يُنْتِجُ السَّلَايْمَ المَطَّاطِيَّ"
        },
        {
          "right": "مَاءُ المَلْفُوفِ + عَصِيرُ اللَّيْمُونِ",
          "left": "يَتَحَوَّلُ اللَّوْنُ إِلَى الأَحْمَرِ (مَحْلُولٌ حَمْضِيٌّ)"
        },
        {
          "right": "مَاءُ المَلْفُوفِ + البِيْكَرْبُونَاتُ",
          "left": "يَتَحَوَّلُ اللَّوْنُ إِلَى الأَخْضَرِ (مَحْلُولٌ قَاعِدِيٌّ)"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَدَوَاتِ وَنَتَائِجَ تَجْرِبَتَيِ السَّلَايْمِ السِّحْرِيِّ وَكَاشِفِ المَلْفُوفِ البَنَفْسَجِيِّ:",
        "correct": [
          "غِرَاءٌ سَائِلٌ وَمُحَفِّزٌ وَأَلْوَانٌ",
          "مَلْفُوفٌ بَنَفْسَجِيٌّ وَمَاءٌ سَاخِنٌ",
          "لَوْنٌ أَحْمَرُ مَعَ اللَّيْمُونِ الحَمْضِيِّ",
          "لَوْنٌ أَخْضَرُ مَعَ البِيْكَرْبُونَاتِ القَاعِدِيَّةِ"
        ],
        "wrong": [
          "شُرْبُ مَوَادِّ التَّجْرِبَةِ",
          "اللَّعِبُ بِالأَحْمَاضِ الحَارِقَةِ"
        ]
      },
      "applyStep": "أُجَرِّبُ كَاشِفَ المَلْفُوفِ البَنَفْسَجِيِّ الطَّبِيعِيَّ فِي المَنْزِلِ مَعَ عَصِيرِ اللَّيْمُونِ وَبِيْكَرْبُونَاتِ الصُّودْيُومِ وَأَغْسِلُ يَدَيَّ بَعْدَ التَّجْرِبَةِ."
    },
    "sportExact": {
      "img": "assets/y6/sports/sprt28.jpg",
      "title": "مَنْهَجُ الرِّيَاضَةِ الحَيَوِيَّةِ فِي مَدْرَسَةِ عِلِّيُّونَ — 30 دَقِيقَةً يَوْمِيًّا لِبِنَاءِ الجَسَدِ وَالرُّوحِ",
      "subtitle": "البُرُوتُوكُولُ الرِّيَاضِيُّ اليَوْمِيُّ (6 وَحَدَاتٍ × 5 دَقَائِقَ) + الهَنْدَسَةُ الحَرَكِيَّةُ التَّطْبِيقِيَّةُ لِلْعِبَادَةِ",
      "slideText": "🏆🕌 مَنْهَجُ الرِّيَاضَةِ الحَيَوِيَّةِ فِي مَدْرَسَةِ عِلِّيُّونَ (30 دَقِيقَةً يَوْمِيًّا لِبِنَاءِ الجَسَدِ وَالرُّوحِ): • أَوَّلًا: البُرُوتُوكُولُ الرِّيَاضِيُّ اليَوْمِيُّ (6 وَحَدَاتٍ × 5 دَقَائِقَ): (1) مِحْوَرُ الوَعْيِ (عِلِّيُّونَ): الاسْتِقَامَةُ النُّورَانِيَّةُ وَضَبْطُ الطَّاقَةِ وَالتَّنَفُّسِ. (2) النُّمُوُّ وَالاسْتِطَالَةُ (Decompression): فَكُّ ضَغْطِ الفَقَرَاتِ بِالتَّعَلُّقِ وَدَعْمُ الطُّولِ. (3) البِنَاءُ وَالنُّمُوُّ العَضَلِيُّ: المُقَاوَمَةُ وَبِنَاءُ كُتْلَةٍ عَضَلِيَّةٍ (Push-ups، Squats، Plank). (4) الاسْتِجَابَةُ العَصَبِيَّةُ: تَحْفِيزُ السَّيَّالَاتِ العَصَبِيَّةِ وَالتَّوَازُنِ. (6) التَّدَفُّقُ وَالاسْتِرْخَاءُ: تَمَدُّدٌ خَفِيفٌ وَتَهْدِئَةُ الجِهَازِ العَصَبِيِّ. • ثَانِيًا: الهَنْدَسَةُ الحَرَكِيَّةُ التَّطْبِيقِيَّةُ لِلْعِبَادَةِ: (1) دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ (زَاوِيَةُ 90° لِاسْتِطَالَةِ العَضَلَاتِ وَتَوَازُنِ ضَغْطِ الدَّمِ). (2) الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ (التَّأْرِيضُ وَتَفْرِيغُ الشِّحْنَاتِ وَتَدَفُّقُ الدَّمِ لِلدِّمَاغِ). (3) مِيكَانِيكَا الاسْتِرَاحَةِ وَفِيزْيَاءُ الوُضُوءِ (تَطْهِيرُ الهَالَةِ وَتَوَازُنُ الجِهَازِ العَصَبِيِّ HRV).",
      "q1": {
        "q": "مَا المَحَاوِرُ الرَّئِيسِيَّةُ لِلْبُرُوتُوكُولِ الرِّيَاضِيِّ اليَوْمِيِّ (30 دَقِيقَةً) فِي مَدْرَسَةِ عِلِّيُّونَ؟",
        "focusWord": "البُرُوتُوكُولُ الرِّيَاضِيُّ اليَوْمِيُّ",
        "options": [
          {
            "text": "مِحْوَرُ الوَعْيِ، وَالنُّمُوُّ وَالاسْتِطَالَةُ (فَكُّ ضَغْطِ الفَقَرَاتِ)، وَالبِنَاءُ العَضَلِيُّ، وَالاسْتِجَابَةُ العَصَبِيَّةُ، وَالتَّدَفُّقُ وَالاسْتِرْخَاءُ",
            "correct": true
          },
          {
            "text": "الجَرْيُ العَشْوَائِيُّ دُونَ تَنَفُّسٍ",
            "correct": false
          },
          {
            "text": "النَّوْمُ طَوَالَ اليَوْمِ",
            "correct": false
          },
          {
            "text": "رَفْعُ الأَثْقَالِ الخَطِرَةِ فَقَطْ",
            "correct": false
          }
        ]
      },
      "q2": {
        "q": "مَا الأَرْكَانُ الثَّلَاثَةُ لـ (الهَنْدَسَةِ الحَرَكِيَّةِ التَّطْبِيقِيَّةِ لِلْعِبَادَةِ) فِي مَنْهَجِ مَدْرَسَةِ عِلِّيُّونَ؟",
        "focusWord": "الهَنْدَسَةُ الحَرَكِيَّةُ لِلْعِبَادَةِ",
        "options": [
          {
            "text": "(1) دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ (90°)، وَ(2) الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ (التَّأْرِيضُ)، وَ(3) فِيزْيَاءُ الوُضُوءِ",
            "correct": true
          },
          {
            "text": "السَّهَرُ وَالتَّعَبُ",
            "correct": false
          },
          {
            "text": "العَجَلَةُ فِي الصَّلَاةِ",
            "correct": false
          },
          {
            "text": "تَرْكُ الطُّمَأْنِينَةِ",
            "correct": false
          }
        ]
      },
      "q3": {
        "q": "مَا التَّمَارِينُ الثَّلَاثَةُ الأَسَاسِيَّةُ لـ (البِنَاءِ وَالنُّمُوِّ العَضَلِيِّ) فِي البُرُوتُوكُولِ اليَوْمِيِّ؟",
        "focusWord": "Push-ups وَ Squats وَ Plank",
        "options": [
          {
            "text": "الضَّغْطُ (Push-ups)، وَالقُرْفُصَاءُ (Squats)، وَالبِلَانْكُ (Plank)",
            "correct": true
          },
          {
            "text": "الغَمْزُ وَالتَّثَاؤُبُ فَقَطْ",
            "correct": false
          },
          {
            "text": "الجُلُوسُ عَلَى الأَرِيكَةِ",
            "correct": false
          },
          {
            "text": "اللَّعِبُ الإِلِكْتْرُونِيُّ",
            "correct": false
          }
        ]
      },
      "sadaqahPairs": [
        {
          "right": "دِينَامِيكِيَّةُ الرُّكُوعِ الطِّبِّيِّ (90°)",
          "left": "اسْتِطَالَةُ العَضَلَاتِ وَتَوَازُنُ ضَغْطِ الدَّمِ"
        },
        {
          "right": "الهَنْدَسَةُ الطِّبِّيَّةُ لِلسُّجُودِ (التَّأْرِيضُ)",
          "left": "تَفْرِيغُ الشِّحْنَاتِ السَّاكِنَةِ وَتَدَفُّقُ الدَّمِ لِلدِّمَاغِ"
        },
        {
          "right": "مِيكَانِيكَا الاسْتِرَاحَةِ (فِيزْيَاءُ الوُضُوءِ)",
          "left": "تَطْهِيرُ الهَالَةِ وَتَوَازُنُ الجِهَازِ العَصَبِيِّ (HRV)"
        }
      ],
      "giftBasket": {
        "prompt": "اِخْتَرْ أَرْكَانَ مَنْهَجِ الرِّيَاضَةِ الحَيَوِيَّةِ فِي مَدْرَسَةِ عِلِّيُّونَ:",
        "correct": [
          "الاسْتِقَامَةُ النُّورَانِيَّةُ وَفَكُّ ضَغْطِ الفَقَرَاتِ",
          "البِنَاءُ العَضَلِيُّ (Push-ups، Squats، Plank)",
          "دِينَامِيكِيَّةُ الرُّكُوعِ (90°) وَتَأْرِيضُ السُّجُودِ",
          "فِيزْيَاءُ الوُضُوءِ وَتَهْدِئَةُ الجِهَازِ العَصَبِيِّ"
        ],
        "wrong": [
          "العَجَلَةُ فِي الرُّكُوعِ وَالسُّجُودِ",
          "إِهْمَالُ الرِّيَاضَةِ اليَوْمِيَّةِ"
        ]
      },
      "applyStep": "أَجْمَعُ كُلَّ يَوْمٍ بَيْنَ البُرُوتُوكُولِ الرِّيَاضِيِّ المَتْقَنِ (30 دَقِيقَةً) وَإِتْقَانِ الوُضُوءِ وَالرُّكُوعِ وَالسُّجُودِ لِبِنَاءِ الجَسَدِ وَالرُّوحِ."
    }
  }
];
    window.buildAndRegisterY7Section(Y7_ALL_28_WEEKS);
})();