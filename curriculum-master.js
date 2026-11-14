// ============================================================================
// القالب الإرشادي الموحد للمدارس الخاصة (curriculum-master.js)
// يظهر حصراً عند فتح مدرسة خاصة ويشرح للمعلم كيفية ملء المحطات الست
// ============================================================================
(function buildInstructionalTemplate() {
    const TARGET_Y = (typeof RAW_YEAR !== 'undefined') ? RAW_YEAR : 7;
    const ABJAD_LETTERS = [
        'أ','ب','ج','د','هـ','و','ز','ح','ط','ي','ك','ل','م','ن',
        'س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'
    ];
    const ABJAD_NUMS = [
        1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,
        100,200,300,400,500,600,700,800,900,1000
    ];
    const SUBJ_NAMES = {
        1: 'دَرْسُ المَنْطِقْ',
        2: 'الفَنُّ وَالكِتَابَةْ',
        3: 'الأَصْوَاتُ وَالمُوسِيقَى',
        4: 'الحِسَابُ وَالعَدَدْ',
        5: 'الرِّيَاضَةُ وَالتَّوَازُنْ',
        6: 'العُلُومُ وَالحَيَاةْ',
        7: 'الأَدَبُ وَالسُّلُوكْ'
    };

    // صورة إرشادية مدمجة تمنع سحب أي صور من مجلدات المدرسة الأساسية
    const TEMPLATE_SVG = "data:image/svg+xml;utf8," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
            <rect width="800" height="500" fill="#0f172a"/>
            <rect x="25" y="25" width="750" height="450" rx="28" fill="#1e293b" stroke="#38bdf8" stroke-width="4" stroke-dasharray="12 8"/>
            <text x="400" y="225" fill="#fde047" font-size="34" font-family="sans-serif" font-weight="bold" text-anchor="middle">مساحة الوسائط الإرشادية</text>
            <text x="400" y="285" fill="#e0f2fe" font-size="24" font-family="sans-serif" text-anchor="middle">في وضع التعديل: اضغط زر (+) أعلى اليمين أو اسحب صورة/فيديو إلى هنا</text>
        </svg>`
    );

    window.curriculumData = window.curriculumData || {};
    window.curriculumData[TARGET_Y] = {};

    for (let w = 1; w <= 28; w++) {
        const ltr = ABJAD_LETTERS[w - 1];
        const num = ABJAD_NUMS[w - 1];
        window.curriculumData[TARGET_Y][w] = {};

        for (let s = 1; s <= 7; s++) {
            const isOdd = (s % 2 === 1);
            const sName = SUBJ_NAMES[s];
            const useCard = (s === 2 || s === 3 || s === 4);

            const sampleQuestions = [1, 2, 3].map(qNum => ({
                isTrueFalse: isOdd,
                q: isOdd
                    ? `سُؤَالٌ إِرْشَادِيٌّ (${qNum}) بصِيغَةِ صَحّ أَوْ خَطَأ لِمَادَّةِ «${sName}»؟`
                    : `اكْتُبْ هُنَا نَصَّ السُّؤَالِ الإِرْشَادِيِّ (${qNum}) لِمَادَّةِ «${sName}»؟`,
                focusWord: `الكَلِمَةُ المِحْوَرِيَّةُ (${ltr})`,
                options: isOdd
                    ? [
                        { text: 'صَحّ ✔️ (الإِجَابَةُ الصَّحِيحَةُ)', correct: true },
                        { text: 'خَطَأ ✖️', correct: false }
                    ]
                    : [
                        { text: 'الخِيَارُ الصَّحِيحُ (عَدِّلِ النَّصَّ هُنَا)', correct: true },
                        { text: 'خِيَارٌ خَاطِئٌ ١', correct: false },
                        { text: 'خِيَارٌ خَاطِئٌ ٢', correct: false },
                        { text: 'خِيَارٌ خَاطِئٌ ٣', correct: false }
                    ]
            }));

            window.curriculumData[TARGET_Y][w][s] = {
                learn: {
                    introTitle: `قَالَبُ ${sName} — حَرْفُ (${ltr})`,
                    introGoal: `اكْتُبْ هُنَا الهَدَفَ التَّرْبَوِيَّ لِلدَّرْسِ، وَاضْغَطْ (+) لِإِدْرَاجِ صُورَةِ الغِلَافْ.`,
                    coverImg: TEMPLATE_SVG,
                    useVideo: false,
                    preferSlidesOnly: true,
                    slides: [
                        useCard ? {
                            cardData: {
                                mode: s === 2 ? 'eye-card' : (s === 3 ? 'ear-card' : 'hand-card'),
                                bgImg: TEMPLATE_SVG,
                                tag: sName,
                                glyph: s === 4 ? `${num}` : ltr,
                                word: `كَلِمَةُ الدَّرْسِ (${ltr})`,
                                visualTokens: s === 4 ? '⭐' : '',
                                feature: 'اكْتُبِ القَاعِدَةَ أَوِ المَهَارَةَ الفَرْعِيَّةَ هُنَا'
                            },
                            text: 'اكْتُبْ شَرْحَ البِطَاقَةِ التَّعْلِيمِيَّةِ الَّذِي سَيَقْرَؤُهُ النَّاطِقُ الصَّوْتِيُّ، أَوْ أَضِفْ شَرِيحَةً جَدِيدَةً مِنَ الشَّرِيطِ العُلْوِيّْ.'
                        } : {
                            img: TEMPLATE_SVG,
                            text: 'اكْتُبْ نَصَّ الشَّرِيحَةِ التَّعْلِيمِيَّةِ هُنَا، أَوْ حَوِّلِ العَرْضَ إِلَى (وَضْعِ الفِيدْيُو) مِنَ الشَّرِيطِ العُلْوِيِّ فِي وَضْعِ التَّعْدِيلْ.'
                        }
                    ]
                },
                play: {
                    questions: sampleQuestions,
                    sadaqahPairs: [
                        { right: 'العُنْصُرُ الأَوَّلُ (عَدِّلْهُ)', left: 'الجَوَابُ المُطَابِقُ ١' },
                        { right: 'العُنْصُرُ الثَّانِي (عَدِّلْهُ)', left: 'الجَوَابُ المُطَابِقُ ٢' },
                        { right: 'العُنْصُرُ الثَّالِثُ (عَدِّلْهُ)', left: 'الجَوَابُ المُطَابِقُ ٣' }
                    ],
                    sadaqahDecoy: 'خِيَارٌ إِضَافِيٌّ خَاطِئٌ لِلتَّمْمِيهْ',
                    giftBasket: {
                        prompt: 'اكْتُبْ تَعْلِيمَاتِ صُنْدُوقِ الهَدِيَّةِ (اخْتَرْ ٣ فُقَاعَاتٍ صَحِيحَةٍ):',
                        targetCount: 3,
                        items: [
                            { emoji: '🌟', label: 'عُنْصُرٌ صَحِيحٌ ١', good: true },
                            { emoji: '✨', label: 'عُنْصُرٌ صَحِيحٌ ٢', good: true },
                            { emoji: '💡', label: 'عُنْصُرٌ صَحِيحٌ ٣', good: true },
                            { emoji: '🚫', label: 'عُنْصُرٌ خَاطِئٌ ١', good: false },
                            { emoji: '⚠️', label: 'عُنْصُرٌ خَاطِئٌ ٢', good: false }
                        ]
                    }
                },
                apply: {
                    img: TEMPLATE_SVG,
                    steps: [
                        'اكْتُبِ الخُطْوَةَ العَمَلِيَّةَ الأُولَى وَضَعْ (الكَلِمَةَ المُهِمَّةَ) بَيْنَ قَوْسَيْنِ لِتُلَوَّنَ بِالأَحْمَرْ.',
                        'اكْتُبِ الخُطْوَةَ العَمَلِيَّةَ الثَّانِيَةَ لِلتَّطْبِيقِ أَوِ الكِتَابَةِ الوَرَقِيَّةْ.',
                        'اكْتُبِ الخُطْوَةَ الخِتَامِيَّةَ لِتَثْبِيتِ مَهَارَةِ الدَّرْسْ.'
                    ]
                }
            };
        }
    }
})();