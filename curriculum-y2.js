// ============================================================================
// منهج السنة الثانية (عمر سنتين - رموز بصرية وتفاعل صوتي خالص بلا نصوص كتابية)
// نظام 3 محطات فقط: (0: لوحة ورمز التمهيد -> 1: لعبة الرموز التفاعلية -> 5: رمز التطبيق)
// ============================================================================
window.curriculumData = window.curriculumData || {};
window.curriculumData[2] = {};

(function buildYear2PureSymbolicCurriculum() {
    // بيانات الـ 28 أسبوعاً لعمر السنتين (النصوص محفوظة للنطق الصوتي فقط ولا تُعرض كتابياً للطفل)
    const Y2_WEEKS = [
        [1,  'أ',  'آدَمُ عَلَيْهِ السَّلَامْ',      'الأَمَانَةْ',   'أَحْمَرْ',    '#ef4444', '🔴', 'دَائِرَةْ', '⭕', '🦁', 'أَسَدْ',    '🍎', 'تُفَّاحَةٌ وَاحِدَةْ', '🙌', 'ارْفَعْ يَدَيْكَ عَالِيًا كَالشَّجَرَةْ!', 'التُّفَّاحُ الطَّيِّبْ', '🍎', 'كُلْ قِطْعَةَ فَاكِهَةٍ وَقُلْ بِسْمِ اللهْ!', '🤲', 'ارْفَعْ يَدَيْكَ الصَّغِيرَتَيْنِ وَقُلْ يَا اللهْ!'],
        [2,  'ب',  'أَيُّوبُ عَلَيْهِ السَّلَامْ',   'الصَّبْرْ',     'أَزْرَقْ',    '#3b82f6', '🔵', 'مُرَبَّعْ', '🟦', '🦆', 'بَطَّةْ',   '🍌', 'مَوْزَتَانِ اثْنَتَانْ', '👏', 'صَفِّقْ بِيَدَيْكَ مَرَّتَيْنِ بِسُرُورْ!', 'المَاءُ النَّقِيّْ', '💧', 'اشْرَبْ كُوبَ مَاءٍ وَأَنْتَ جَالِسْ!', '🧼', 'اغْسِلْ يَدَيْكَ الحُلْوَتَيْنِ بِالمَاءْ!'],
        [3,  'ج',  'يُونُسُ عَلَيْهِ السَّلَامْ',    'التَّسْبِيحْ',  'أَصْفَرْ',    '#eab308', '🟡', 'مُثَلَّثْ', '🔺', '🐪', 'جَمَلْ',    '⭐', 'نَجْمَتَانِ اثْنَتَانْ', '🚶', 'امْشِ خُطْوَتَيْنِ فِي مَكَانِكَ بِنَشَاطْ!', 'الجَزَرُ اللَّذِيذْ', '🥕', 'تَذَوَّقِ الجَزَرَ الصِّحِّيَّ اللَّذِيذْ!', '💝', 'قُلْ لِمَامَا وَبَابَا شُكْرًا!'],
        [4,  'د',  'هُودٌ عَلَيْهِ السَّلَامْ',      'الشُّكْرْ',     'أَخْضَرْ',    '#22c55e', '🟢', 'نَجْمَةْ',  '⭐', '🐓', 'دِيكْ',     '🍊', 'بُرْتُقَالَةٌ وَاحِدَةْ', '🔄', 'دُرْ حَوْلَ نَفْسِكَ دَوْرَةً هَادِئَةْ!', 'الحَلِيبُ الدَّافِئْ', '🥛', 'اشْرَبْ رَشْفَةً مِنَ الحَلِيبِ المُفِيدْ!', '👂', 'أَنْصِتْ بِهُدُوءٍ عِنْدَمَا تُنَادِيكَ مَامَا!'],
        [5,  'هـ', 'إِبْرَاهِيمُ عَلَيْهِ السَّلَامْ', 'التَّفَكُّرْ',  'بُرْتُقَالِيّْ', '#f97316', '🟠', 'هِلَالْ',   '🌙', '🐱', 'هِرَّةْ',   '🍓', 'فَرَاوِلَتَانِ اثْنَتَانْ', '🌬️', 'خُذْ نَفَسًا عَمِيقًا كَأَنَّكَ تَشُمُّ وَرْدَةْ!', 'العَسَلُ الشَّافِي', '🍯', 'تَذَوَّقْ مِلْعَقَةَ عَسَلٍ صَغِيرَةْ!', '🌌', 'انْظُرْ إِلَى السَّمَاءِ وَابْتَسِمْ!'],
        [6,  'و',  'يَعْقُوبُ عَلَيْهِ السَّلَامْ',  'الرَّجَاءْ',    'وَرْدِيّْ',    '#ec4899', '🌸', 'قَلْبْ',    '❤️', '🌹', 'وَرْدَةْ',  '🌹', 'وَرْدَةٌ جَمِيلَةْ', '🕊️', 'افْتَحْ ذِرَاعَيْكَ كَجَنَاحَيِ العُصْفُورْ!', 'الفَوَاكِهُ الطَّازَجَةْ', '🍑', 'أَمْسِكِ الفَاكِهَةَ بِيَدِكَ النَّظِيفَةْ!', '🎁', 'أَعْطِ لُعْبَةً لِأَخِيكَ بِيَدِكَ اليُمْنَى!'],
        [7,  'ز',  'عُزَيْرٌ عَلَيْهِ السَّلَامْ',   'اليَقِينْ',     'بَنَفْسَجِيّْ', '#8b5cf6', '🟣', 'مُعَيَّنْ', '🔷', '🦒', 'زَرَافَةْ', '🫒', 'زَيْتُونَتَانِ اثْنَتَانْ', '🌳', 'قِفْ ثَابِتًا وَمُبْتَسِمًا كَالشَّجَرَةْ!', 'زَيْتُ الزَّيْتُونْ', '🫒', 'الْمِسْ ثَمَرَةَ الزَّيْتُونِ المُبَارَكَةْ!', '👣', 'امْشِ بِهُدُوءٍ دُونَ رَكْضٍ فِي الغُرْفَةْ!'],
        [8,  'ح',  'نُوحٌ عَلَيْهِ السَّلَامْ',      'الثَّبَاتْ',    'سَمَاوِيّْ',   '#06b6d4', '🩵', 'بَيْضَاوِيّْ', '🥚', '🕊️', 'حَمَامَةْ', '🍐', 'ثَمَرَتَانِ طَيِّبَتَانْ', '🤷', 'ارْفَعْ كَتِفَيْكَ لِلأَعْلَى ثُمَّ أَنْزِلْهُمَا!', 'التَّمْرُ الحُلْوْ', '🌴', 'كُلْ تَمْرَةً طَيِّبَةً تَمْنَحُكَ القُوَّةْ!', '🍽️', 'اجْلِسْ فِي مَكَانِكَ عِنْدَ تَنَاوُلِ الطَّعَامْ!'],
        [9,  'ط',  'لُوطٌ عَلَيْهِ السَّلَامْ',      'الطَّهَارَةْ',  'أَبْيَضْ',    '#64748b', '⚪', 'دَائِرَةْ', '⭕', '🦚', 'طَاوُوسْ',  '🧼', 'صَابُونَةٌ وَاحِدَةْ', '🦘', 'اقْفِزْ قَفْزَةً خَفِيفَةً فِي مَكَانِكْ!', 'الصَّابُونُ وَالرَّغْوَةْ', '🧼', 'افْرُكْ يَدَيْكَ بِالصَّابُونِ وَالمَاءْ!', '👕', 'حَافِظْ عَلَى قَمِيصِكَ نَظِيفًا وَجَمِيلًا!'],
        [10, 'ي',  'يَحْيَى عَلَيْهِ السَّلَامْ',    'الحَنَانْ',     'أَخْضَرْ',    '#16a34a', '🟢', 'قَلْبْ',    '💚', '🦌', 'يَحْمُورْ', '🖐️', 'يَدَانِ اثْنَتَانْ', '👐', 'افْتَحْ كَفَّيْكَ وَأَغْلِقْهُمَا بِمَرَحْ!', 'تَنْظِيفُ الأَسْنَانْ', '🪥', 'أَمْسِكْ فُرْشَاةَ أَسْنَانِكَ وَنَظِّفْهَا!', '🕌', 'قِفْ بِجَانِبِ مَامَا عَلَى سَجَّادَةِ الصَّلَاةْ!'],
        [11, 'ك',  'زَكَرِيَّا عَلَيْهِ السَّلَامْ', 'الدُّعَاءْ',    'أَزْرَقْ',    '#2563eb', '🔵', 'مُرَبَّعْ', '🟦', '🐑', 'كَبْشْ',    '⚽', 'كُرَةٌ وَاحِدَةْ', '⚽', 'دَحْرِجِ الكُرَةَ بِيَدَيْكَ إِلَى الأَمَامْ!', 'الكَمَّثْرَى اللَّذِيذَةْ', '🍐', 'أَشِرْ إِلَى الفَاكِهَةِ الصِّحِّيَّةِ وَابْتَسِمْ!', '🤝', 'شَارِكْ طَعَامَكَ الطَّيِّبَ مَعَ أُسْرَتِكْ!'],
        [12, 'ل',  'إِسْمَاعِيلُ عَلَيْهِ السَّلَامْ', 'الطَّاعَةْ',   'أَصْفَرْ',    '#ca8a04', '🟡', 'مُثَلَّثْ', '🔺', '🍋', 'لَيْمُونْ', '🍋', 'لَيْمُونَتَانِ اثْنَتَانْ', '🧎', 'انْحَنِ قَلِيلًا وَالْمِسْ رُكْبَتَيْكَ بِيَدَيْكْ!', 'اللَّبَنُ الرَّائِبْ', '🥣', 'تَنَاوَلْ مِلْعَقَةً مِنَ اللَّبَنِ المُفِيدْ!', '🕋', 'لَوِّحْ بِيَدِكَ لِصُورَةِ الكَعْبَةِ المُشَرَّفَةْ!'],
        [13, 'م',  'مُوسَى عَلَيْهِ السَّلَامْ',     'الشَّجَاعَةْ',  'أَحْمَرْ',    '#dc2626', '🔴', 'نَجْمَةْ',  '⭐', '🐐', 'مَاعِزْ',   '🍌', 'مَوْزَةٌ وَاحِدَةْ', '🦸', 'ارْفَعْ رَأْسَكَ وَامْشِ بِثِقَةٍ وَشَجَاعَةْ!', 'المَوْزُ المُغَذِّي', '🍌', 'قَشِّرِ المَوْزَةَ بِمُسَاعَدَةِ مَامَا وَكُلْهَا!', '🪙', 'ضَعْ صَدَقَةً صَغِيرَةً فِي صُنْدُوقِ الخَيْرْ!'],
        [14, 'ن',  'سُلَيْمَانُ عَلَيْهِ السَّلَامْ', 'الحِكْمَةْ',    'ذَهَبِيّْ',    '#d97706', '🟠', 'هِلَالْ',   '🌙', '🐝', 'نَحْلَةْ',  '🌴', 'نَخْلَتَانِ اثْنَتَانْ', '🐝', 'حَرِّكْ يَدَيْكَ بِخِفَّةٍ كَجَنَاحَيِ النَّحْلَةْ!', 'النَّوْمُ المُبَكِّرْ', '🛌', 'ضَعْ رَأْسَكَ عَلَى الوِسَادَةِ بِهُدُوءْ!', '😊', 'ابْتَسِمْ فِي وَجْهِ كُلِّ مَنْ تَرَاهُ اليَوْمْ!'],
        [15, 'س',  'عِيسَى عَلَيْهِ السَّلَامْ',     'الرَّحْمَةْ',   'سَمَاوِيّْ',   '#0284c7', '🩵', 'دَائِرَةْ', '⭕', '🐟', 'سَمَكَةْ',  '🐟', 'سَمَكَتَانِ اثْنَتَانْ', '🏊', 'حَرِّكْ ذِرَاعَيْكَ فِي الهَوَاءِ كَالسَّمَكَةْ!', 'الأَسْنَانُ النَّظِيفَةْ', '🦷', 'أَرِ مَامَا أَسْنَانَكَ النَّظِيفَةَ اللَّامِعَةْ!', '🙋', 'قُلْ حَاضِرْ يَا مَامَا بِصَوْتٍ جَمِيلْ!'],
        [16, 'ع',  'اليَسَعُ عَلَيْهِ السَّلَامْ',   'الإِحْسَانْ',   'بَنَفْسَجِيّْ', '#7c3aed', '🟣', 'مُعَيَّنْ', '🔷', '🐦', 'عُصْفُورْ', '🍇', 'عُنْقُودَانِ اثْنَانْ', '👋', 'لَوِّحْ بِيَدَيْكَ فِي الهَوَاءِ كَالعُصْفُورْ!', 'العِنَبُ الحُلْوْ', '🍇', 'اغْسِلْ حَبَّاتِ العِنَبِ بِالمَاءِ قَبْلَ أَكْلِهَا!', '📖', 'اجْلِسْ جِلْسَةً صَحِيحَةً وَهادِئَةً!'],
        [17, 'ف',  'يُوسُفُ عَلَيْهِ السَّلَامْ',    'العَفْوْ',      'وَرْدِيّْ',    '#db2777', '🌸', 'قَلْبْ',    '🩷', '🦋', 'فَرَاشَةْ', '🍓', 'فَرَاوِلَةٌ وَاحِدَةْ', '🦋', 'حَرِّكْ يَدَيْكَ بِلُطْفٍ كَالفَرَاشَةِ المُلَوَّنَةْ!', 'الفَرَاوِلَةُ الطَّازَجَةْ', '🍓', 'اشْمُمْ رَائِحَةَ الفَاكِهَةِ الزَّكِيَّةْ!', '🧸', 'ضَعْ لُعْبَتَكَ فِي سَلَّةِ الأَلْعَابِ بِنَفْسِكْ!'],
        [18, 'ص',  'صَالِحٌ عَلَيْهِ السَّلَامْ',    'الرِّفْقْ',     'أَخْضَرْ',    '#15803d', '🟢', 'مُرَبَّعْ', '🟩', '🐥', 'صُوصْ',     '📦', 'صُنْدُوقَانِ اثْنَانْ', '🏋️', 'اجْلِسِ القُرْفُصَاءَ ثُمَّ قِفْ بِنَشَاطْ!', 'الصِّحَّةُ وَالنَّشَاطْ', '💪', 'أَشِرْ إِلَى ذِرَاعَيْكَ القَوِيَّتَيْنْ!', '👶', 'امْسَحْ بِلُطْفٍ عَلَى رَأْسِ أَخِيكَ الصَّغِيرْ!'],
        [19, 'ق',  'إِسْحَاقُ عَلَيْهِ السَّلَامْ',  'البَرَكَةْ',    'أَصْفَرْ',    '#eab308', '🟡', 'هِلَالْ',   '🌙', '🌙', 'قَمَرْ',    '🎃', 'يَقْطِينَةٌ وَاحِدَةْ', '🤲', 'مُدَّ يَدَيْكَ لِلأَمَامِ ثُمَّ ضُمَّهُمَا لِصَدْرِكْ!', 'القَمْحُ وَالخُبْزْ', '🌾', 'كُلْ لُقْمَةَ خُبْزٍ صَغِيرَةً وَامْضُغْهَا جَيِّدًا!', '👀', 'انْظُرْ إِلَى اللَّوْحَةِ بِهُدُوءٍ وَانْتِبَاهْ!'],
        [20, 'ر',  'هَارُونُ عَلَيْهِ السَّلَامْ',   'المَوَدَّةْ',   'أَحْمَرْ',    '#e11d48', '🔴', 'دَائِرَةْ', '⭕', '🍎', 'رُمَّانْ',  '🍎', 'رُمَّانَتَانِ اثْنَتَانْ', '🙂', 'أَمِلْ رَأْسَكَ يَمِينًا وَيَسَارًا بِهُدُوءْ!', 'الرُّمَّانُ الأَحْمَرْ', '🍎', 'أَشِرْ إِلَى رَأْسِكَ وَشَعْرِكَ المُرَتَّبْ!', '🫂', 'عَانِقْ مَامَا عِنَاقًا دَافِئًا وَجَمِيلًا!'],
        [21, 'ش',  'شُعَيْبٌ عَلَيْهِ السَّلَامْ',   'العَدْلْ',      'بُرْتُقَالِيّْ', '#ea580c', '🟠', 'نَجْمَةْ',  '☀️', '☀️', 'شَمْسْ',    '🌳', 'شَجَرَتَانِ اثْنَتَانْ', '☀️', 'ارْفَعْ ذِرَاعَيْكَ كَالشَّمْسِ المُشْرِقَةْ!', 'أَشِعَّةُ الشَّمْسْ', '☀️', 'افْتَحِ النَّافِذَةَ مَعَ مَامَا لِيَدْخُلَ النُّورْ!', '🧻', 'نَاوِلْ مَامَا المِنْدِيلَ بِيَدِكَ الصَّغِيرَةْ!'],
        [22, 'ت',  'دَاوُودُ عَلَيْهِ السَّلَامْ',   'الحَمْدْ',      'أَحْمَرْ',    '#dc2626', '🔴', 'مُثَلَّثْ', '🔺', '🍎', 'تُفَّاحْ',  '🌴', 'تَمْرَتَانِ اثْنَتَانْ', '🧍', 'قِفْ مُعْتَدِلًا وَيَدَاكَ عَلَى خَصْرِكْ!', 'التِّينُ وَالتَّمْرْ', '🌴', 'قُلِ الحَمْدُ للهِ بَعْدَ الأَكْلْ!', '💖', 'قَبِّلْ يَدَ مَامَا الحَنُونَةْ!'],
        [23, 'ث',  'إِلْيَاسُ عَلَيْهِ السَّلَامْ',  'الإِخْلَاصْ',   'أَزْرَقْ',    '#0284c7', '🔵', 'مُعَيَّنْ', '🔷', '🦊', 'ثَعْلَبْ',  '🧊', 'قِطْعَةٌ وَاحِدَةْ', '🖐️', 'ارْفَعْ ثَلَاثَةَ أَصَابِعَ بِيَدِكَ الحُلْوَةْ!', 'الثَّوْبُ النَّظِيفْ', '👕', 'أَشِرْ إِلَى ثَوْبِكَ النَّظِيفِ المُرَتَّبْ!', '👑', 'ابْتَسِمْ لِبَابَا وَقَبِّلْ يَدَهُ الكَرِيمَةْ!'],
        [24, 'خ',  'إِدْرِيسُ عَلَيْهِ السَّلَامْ',  'العِلْمْ',      'أَخْضَرْ',    '#16a34a', '🟢', 'مُرَبَّعْ', '🟩', '🐑', 'خَرُوفْ',   '🥒', 'خِيَارَتَانِ اثْنَتَانْ', '🏃', 'اخْطُ خُطْوَةً وَاسِعَةً إِلَى الأَمَامْ!', 'الخُضْرَوَاتُ الطَّازَجَةْ', '🥒', 'كُلْ قِطْعَةَ خِيَارٍ طَازَجَةً وَمُنْعِشَةْ!', '🎨', 'الْعَبْ بِلُعْبَتِكَ بِهُدُوءٍ وَسُرُورْ!'],
        [25, 'ذ',  'ذُو الكِفْلِ عَلَيْهِ السَّلَامْ', 'الوَفَاءْ',    'أَصْفَرْ',    '#facc15', '🟡', 'دَائِرَةْ', '🟡', '🌽', 'ذُرَةْ',    '🌽', 'ذُرَتَانِ اثْنَتَانْ', '🤲', 'أَدِرْ كَفَّيْكَ فِي الهَوَاءِ بِلُطْفْ!', 'الذُّرَةُ الصَّفْرَاءْ', '🌽', 'أَشِرْ إِلَى أُذُنَيْكَ اللَّتَيْنِ تَسْمَعُ بِهِمَا!', '👋', 'لَوِّحْ بِيَدِكَ لِأَخِيكَ وَقُلْ أُحِبُّكْ!'],
        [26, 'ض',  'شَمْوِيلُ عَلَيْهِ السَّلَامْ',  'الحَقّْ',       'أَخْضَرْ',    '#4ade80', '🟢', 'بَيْضَاوِيّْ', '🟢', '🐸', 'ضِفْدَعْ',  '🦷', 'ضِرْسَانِ اثْنَانْ', '🐸', 'انْزِلْ قَلِيلًا ثُمَّ قِفْ كَالضِّفْدَعِ الصَّغِيرْ!', 'التَّنَفُّسُ الصِّحِّيّْ', '🫁', 'ضَعْ يَدَكَ عَلَى صَدْرِكَ وَاشْعُرْ بِتَنَفُّسِكْ!', '📚', 'ضَعْ كُرَّاسَتَكَ الصَّغِيرَةَ عَلَى الطَّاوِلَةْ!'],
        [27, 'ظ',  'حَنْظَلَةُ عَلَيْهِ السَّلَامْ', 'النُّصْحْ',     'بَنَفْسَجِيّْ', '#9333ea', '🟣', 'نَجْمَةْ',  '🌟', '🦌', 'ظَبْيْ',    '✉️', 'ظَرْفٌ وَاحِدْ', '🦌', 'حَرِّكْ قَدَمَيْكَ بِخِفَّةٍ كَالظَّبْيِ الرَّشِيقْ!', 'نَظَافَةُ الأَظَافِرْ', '🧼', 'انْظُرْ إِلَى أَظَافِرِ يَدَيْكَ النَّظِيفَةْ!', '🖍️', 'ارْسُمْ خَطًّا جَمِيلًا عَلَى وَرَقَتِكَ فَقَطْ!'],
        [28, 'غ',  'مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَآلِهْ', 'الخُلُقُ العَظِيمْ', 'سَمَاوِيّْ', '#0ea5e9', '🩵', 'قَلْبْ', '🩵', '☁️', 'غَيْمَةْ', '☁️', 'غَيْمَتَانِ اثْنَتَانْ', '🌟', 'ضَعْ يَدَكَ عَلَى قَلْبِكَ وَابْتَسِمْ ابْتِسَامَةً كَبِيرَةْ!', 'الغِذَاءُ الصِّحِّيُّ الكَامِلْ', '🥗', 'اشْكُرِ اللهَ عَلَى نِعْمَةِ المَاءِ وَالغِذَاءْ!', '🕊️', 'قُلِ السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهْ!']
    ];

    const ALL_COLORS = [
        { name: 'أَحْمَرْ', hex: '#ef4444', emoji: '🔴' },
        { name: 'أَزْرَقْ', hex: '#3b82f6', emoji: '🔵' },
        { name: 'أَصْفَرْ', hex: '#eab308', emoji: '🟡' },
        { name: 'أَخْضَرْ', hex: '#22c55e', emoji: '🟢' }
    ];
    const ALL_SHAPES = [
        { name: 'دَائِرَةْ', emoji: '⭕' },
        { name: 'مُرَبَّعْ', emoji: '🟦' },
        { name: 'مُثَلَّثْ', emoji: '🔺' },
        { name: 'نَجْمَةْ',  emoji: '⭐' },
        { name: 'قَلْبْ',    emoji: '❤️' }
    ];

    Y2_WEEKS.forEach(row => {
        const [
            w, ltr, prophet, virtue,
            colorName, colorHex, colorEmoji,
            shapeName, shapeEmoji,
            soundEmoji, soundWord,
            countEmoji, countLabel,
            sportEmoji, sportAction,
            sciTitle, sciEmoji, sciApply,
            rightEmoji, rightApply
        ] = row;

        const vidPath   = `assets/y2/videos/v${w}.mp4`;
        const artPath   = `assets/y2/art/art${w}.jpg`;
        const sportPath = `assets/y2/sports/sprt${w}.jpg`;
        const sciPath   = `assets/y2/scince/s${w}.jpg`;
        const rightPath = `assets/y2/rights/r${w}.jpg`;

        const otherColors = ALL_COLORS.filter(c => c.emoji !== colorEmoji).slice(0, 2);
        const otherShapes = ALL_SHAPES.filter(s => s.emoji !== shapeEmoji).slice(0, 2);
        const needCount   = (w % 2 === 0) ? 2 : 1;

        window.curriculumData[2][w] = {
            // 1. المنطق والقصص: رموز بصرية خالصة + فقاعات صوتية
            1: {
                learn: {
                    introTitle: `🌟 ${soundEmoji}`,
                    introGoal: `${colorEmoji}`,
                    introTTS: `${prophet} ، ${virtue}`,
                    coverImg: artPath,
                    video: vidPath,
                    useVideo: false,
                    slides: [{
                        img: artPath,
                        text: '',
                        tts: `الْمِسِ الفُقَاعَاتِ المُلَوَّنَةَ لِتَسْمَعَ وَتَكْتَشِفْ!`,
                        toddlerGame: {
                            type: 'bubbles',
                            promptTTS: `الْمِسِ الفُقَاعَاتِ المُلَوَّنَةَ لِتَسْمَعَ وَتَكْتَشِفْ!`,
                            targetEmoji: '🌟',
                            items: [
                                { emoji: '🌟', speak: prophet, good: true, color: colorHex },
                                { emoji: soundEmoji, speak: soundWord, good: true, color: '#0284c7' },
                                { emoji: '💛', speak: virtue, good: true, color: '#16a34a' }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: artPath,
                    steps: [`🌟 ${soundEmoji}`],
                    applyTTS: `ابْتَسِمْ وَقُلْ مَعَ مَامَا: ${soundWord}!`
                }
            },

            // 2. البصر والفن: مطابقة الشكل واللون بالرموز فقط دون أي حروف
            2: {
                learn: {
                    introTitle: `${shapeEmoji} ${colorEmoji}`,
                    introGoal: `🎨`,
                    introTTS: `${shapeName} ، لَوْنُهَا ${colorName}`,
                    coverImg: artPath,
                    slides: [{
                        img: artPath,
                        text: '',
                        tts: `ضَعْ شَكْلَ ${shapeName} فِي مَكَانِهِ المُلَوَّنْ!`,
                        toddlerGame: {
                            type: 'sorter',
                            promptTTS: `ضَعْ شَكْلَ ${shapeName} فِي مَكَانِهِ المُلَوَّنْ!`,
                            targetEmoji: shapeEmoji,
                            targetColor: colorHex,
                            items: [
                                { emoji: shapeEmoji, speak: `أَحْسَنْت! ${shapeName} ${colorName}`, good: true, color: colorHex },
                                { emoji: otherShapes[0].emoji, speak: otherShapes[0].name, good: false, color: otherColors[0].hex },
                                { emoji: otherShapes[1].emoji, speak: otherShapes[1].name, good: false, color: otherColors[1].hex }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: artPath,
                    steps: [`👉 ${colorEmoji} ${shapeEmoji}`],
                    applyTTS: `أَشِرْ بِإِصْبَعِكَ إِلَى اللَّوْنِ ${colorName} حَوْلَكْ!`
                }
            },

            // 3. السمع والأصوات: تمييز رمز الصوت وإدخاله في دائرة الاستماع
            3: {
                learn: {
                    introTitle: `👂 ${soundEmoji}`,
                    introGoal: `🔊`,
                    introTTS: `نَسْمَعُ صَوْتَ ${soundWord}`,
                    coverImg: artPath,
                    slides: [{
                        img: artPath,
                        text: '',
                        tts: `أَيْنَ ${soundWord}؟ الْـمِسْهُ لِيَدْخُلَ فِي دَائِرَةِ الصَّوْتْ!`,
                        toddlerGame: {
                            type: 'sorter',
                            promptTTS: `أَيْنَ ${soundWord}؟ الْـمِسْهُ لِيَدْخُلَ فِي دَائِرَةِ الصَّوْتْ!`,
                            targetEmoji: '🔊',
                            targetColor: '#f59e0b',
                            items: [
                                { emoji: soundEmoji, speak: `مُمْتَاز! ${soundWord}`, good: true, color: '#f59e0b' },
                                { emoji: '🚗', speak: 'سَيَّارَة', good: false, color: '#64748b' },
                                { emoji: '⏰', speak: 'سَاعَة', good: false, color: '#64748b' }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: artPath,
                    steps: [`🗣️ ${soundEmoji}`],
                    applyTTS: `قَلِّدْ صَوْتَ أَوِ اسْمَ ${soundWord} بِفَرَحْ!`
                }
            },

            // 4. اليد والكميات المحسوسة: عدّ بصري بالرموز فقط (ثمرة واحدة أو ثمرتان) بلا أرقام مكتوبة
            4: {
                learn: {
                    introTitle: `✋ ${countEmoji.repeat(needCount)}`,
                    introGoal: `🧺`,
                    introTTS: countLabel,
                    coverImg: artPath,
                    slides: [{
                        img: artPath,
                        text: '',
                        tts: `ضَعْ فِي السَّلَّةِ: ${countLabel}!`,
                        toddlerGame: {
                            type: 'counter_basket',
                            promptTTS: `ضَعْ فِي السَّلَّةِ: ${countLabel}!`,
                            targetEmoji: '🧺',
                            targetColor: '#8b5cf6',
                            needCount: needCount,
                            items: [
                                { emoji: countEmoji, speak: 'وَاحِدْ!', good: true, color: '#8b5cf6' },
                                { emoji: countEmoji, speak: 'اثْنَانْ! أَحْسَنْت!', good: true, color: '#8b5cf6' },
                                { emoji: countEmoji, speak: 'ثَلَاثَةْ!', good: true, color: '#8b5cf6' }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: artPath,
                    steps: [needCount === 2 ? '✌️' : '☝️'],
                    applyTTS: needCount === 2 ? 'ارْفَعْ إِصْبَعَيْنِ اثْنَيْنِ بِيَدِكَ الحُلْوَةْ!' : 'ارْفَعْ إِصْبَعًا وَاحِدًا بِيَدِكَ الحُلْوَةْ!'
                }
            },

            // 5. الرجلين والرياضة: فقاعات الحركة والمرح بالرموز فقط
            5: {
                learn: {
                    introTitle: `👣 ${sportEmoji}`,
                    introGoal: `🌟`,
                    introTTS: sportAction,
                    coverImg: sportPath,
                    slides: [{
                        img: sportPath,
                        text: '',
                        tts: `الْمِسْ نُجُومَ النَّشَاطِ وَحَرِّكْ جِسْمَكَ بِفَرَحْ!`,
                        toddlerGame: {
                            type: 'bubbles',
                            promptTTS: `الْمِسْ نُجُومَ النَّشَاطِ وَحَرِّكْ جِسْمَكَ بِفَرَحْ!`,
                            targetEmoji: sportEmoji,
                            items: [
                                { emoji: sportEmoji, speak: sportAction, good: true, color: '#16a34a' },
                                { emoji: '👏', speak: 'صَفِّقْ بِيَدَيْكْ!', good: true, color: '#0284c7' },
                                { emoji: '🌟', speak: 'أَنْتَ بَطَلٌ نَشِيطْ!', good: true, color: '#eab308' }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: sportPath,
                    steps: [`${sportEmoji} 👏`],
                    applyTTS: sportAction
                }
            },

            // 6. البطن والعلوم: فرز الطيب النافع عن الضار بالرموز وحدها
            6: {
                learn: {
                    introTitle: `${sciEmoji} 💪`,
                    introGoal: `🧺`,
                    introTTS: sciTitle,
                    coverImg: sciPath,
                    slides: [{
                        img: sciPath,
                        text: '',
                        tts: `ضَعْ ${sciTitle} فِي السَّلَّةِ الصِّحِّيَّةِ وَاتْرُكِ الأَشْيَاءَ الضَّارَّةْ!`,
                        toddlerGame: {
                            type: 'sorter',
                            promptTTS: `ضَعْ ${sciTitle} فِي السَّلَّةِ الصِّحِّيَّةِ وَاتْرُكِ الأَشْيَاءَ الضَّارَّةْ!`,
                            targetEmoji: '🧺',
                            targetColor: '#16a34a',
                            items: [
                                { emoji: sciEmoji, speak: `مُمْتَاز! ${sciTitle}`, good: true, color: '#16a34a' },
                                { emoji: '🪨', speak: 'لَا! هٰذَا حَجَرْ', good: false, color: '#64748b' },
                                { emoji: '👟', speak: 'لَا! هٰذَا حِذَاءْ', good: false, color: '#64748b' }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: sciPath,
                    steps: [`${sciEmoji} 😋`],
                    applyTTS: sciApply
                }
            },

            // 7. الأدب والسلوك: قلب المحبة والابتسامة بالرموز الصافية
            7: {
                learn: {
                    introTitle: `💝 ${rightEmoji}`,
                    introGoal: `😊`,
                    introTTS: rightApply,
                    coverImg: rightPath,
                    slides: [{
                        img: rightPath,
                        text: '',
                        tts: `الْـمِسْ قَلْبَ المَحَبَّةِ وَالابْتِسَامَةَ الجَمِيلَةْ!`,
                        toddlerGame: {
                            type: 'sorter',
                            promptTTS: `الْـمِسْ قَلْبَ المَحَبَّةِ وَالابْتِسَامَةَ الجَمِيلَةْ!`,
                            targetEmoji: '💝',
                            targetColor: '#e11d48',
                            items: [
                                { emoji: '💝', speak: rightApply, good: true, color: '#e11d48' },
                                { emoji: '😊', speak: 'ابْتِسَامَةٌ جَمِيلَةْ!', good: true, color: '#16a34a' },
                                { emoji: '💢', speak: 'لَا نَغْضَبْ!', good: false, color: '#64748b' }
                            ]
                        }
                    }]
                },
                play: { skipQuiz: true, skipSadaqah: true, skipGift: true, questions: [], sadaqahPairs: [] },
                apply: {
                    img: rightPath,
                    steps: [`${rightEmoji} 💝`],
                    applyTTS: rightApply
                }
            }
        };
    });

    // ============================================================================
    // محرك ألعاب التودلر الرمزي الصافي (بلا نصوص مكتوبة للطفل) لعمر السنتين
    // ============================================================================
    function injectToddlerSymbolicStyles() {
        if (document.getElementById('toddler-y2-styles')) return;
        const st = document.createElement('style');
        st.id = 'toddler-y2-styles';
        st.innerHTML = `
            .toddler-playground-wrap {
                width: 100%; height: 100%; display: flex; flex-direction: column;
                justify-content: center; align-items: center; padding: 1vmin; position: relative;
            }
            .toddler-top-split {
                width: 100%; height: 100%; flex: 1 1 auto; min-height: 0;
                display: grid; grid-template-columns: 1fr 1.15fr; gap: 1.8vmin; align-items: stretch;
            }
            @media (max-width: 700px) {
                .toddler-top-split { grid-template-columns: 1fr; grid-template-rows: 1fr 1.15fr; }
            }
            .toddler-scene-frame {
                position: relative; width: 100%; height: 100%; min-height: 0;
                border-radius: 26px; overflow: hidden; border: 4px solid #86efac;
                background: #0f172a; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 10px 24px rgba(0,0,0,0.16);
            }
            .toddler-scene-frame img { width: 100%; height: 100%; object-fit: contain; }
            .toddler-floating-speaker {
                position: absolute; bottom: 12px; left: 12px; z-index: 25;
                width: 54px; height: 54px; border-radius: 50%;
                background: linear-gradient(135deg, #fef08a, #eab308);
                border: 3px solid #ffffff; font-size: 1.7rem; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 6px 16px rgba(0,0,0,0.35); transition: transform 0.2s;
            }
            .toddler-floating-speaker:hover { transform: scale(1.12); }
            .toddler-game-arena {
                background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
                border: 4px dashed #4ade80; border-radius: 26px;
                padding: 2vmin; display: flex; flex-direction: column;
                justify-content: space-evenly; align-items: center; position: relative;
                box-shadow: inset 0 2px 12px rgba(0,0,0,0.05);
            }
            .toddler-drop-target {
                width: clamp(135px, 27vmin, 220px); height: clamp(110px, 21vmin, 165px);
                border: 5px dashed #0284c7; border-radius: 30px;
                background: rgba(224, 242, 254, 0.6);
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                gap: 6px; transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .toddler-drop-target.hover-glow {
                transform: scale(1.1); border-style: solid; background: #dcfce7;
                box-shadow: 0 0 24px rgba(34, 197, 94, 0.65);
            }
            .toddler-drop-target.success-pop {
                background: #dcfce7; border: 5px solid #16a34a; transform: scale(1.08);
            }
            .toddler-target-ghost {
                font-size: clamp(3.4rem, 9.5vmin, 5.4rem); line-height: 1;
                opacity: 0.45; filter: grayscale(30%); transition: 0.3s;
            }
            .toddler-drop-target.success-pop .toddler-target-ghost {
                opacity: 1; filter: grayscale(0%); transform: scale(1.18);
            }
            .toddler-dots-progress {
                font-size: clamp(1.3rem, 3.2vmin, 1.9rem); line-height: 1; letter-spacing: 4px;
            }
            .toddler-tokens-row {
                display: flex; align-items: center; justify-content: center;
                gap: clamp(14px, 3vmin, 28px); flex-wrap: wrap; width: 100%;
            }
            .toddler-draggable-btn {
                width: clamp(92px, 18.5vmin, 145px); height: clamp(92px, 18.5vmin, 145px);
                border-radius: 50%; background: #ffffff;
                border: 5px solid #cbd5e1; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 10px 22px rgba(0,0,0,0.14);
                transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                animation: toddlerFloat 2.4s ease-in-out infinite alternate;
            }
            .toddler-draggable-btn:nth-child(2) { animation-delay: 0.4s; }
            .toddler-draggable-btn:nth-child(3) { animation-delay: 0.8s; }
            @keyframes toddlerFloat {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-8px); }
            }
            .toddler-draggable-btn:hover {
                transform: scale(1.12) !important; border-color: #38bdf8;
                box-shadow: 0 14px 26px rgba(56, 189, 248, 0.38);
            }
            .toddler-draggable-btn.done-token {
                transform: scale(0) !important; opacity: 0; pointer-events: none;
            }
            .toddler-draggable-btn.popped-bubble {
                background: #dcfce7 !important; border-color: #22c55e !important;
                transform: scale(1.14) !important;
            }
            .toddler-tok-emoji {
                font-size: clamp(3rem, 8.8vmin, 4.8rem); line-height: 1; pointer-events: none;
            }
            /* تكبير الرمز في محطة التطبيق وإخفاء مظهر النصوص لعمر السنتين */
            body.y2-symbolic-mode .intro-info-title { font-size: clamp(2.8rem, 8vmin, 4.5rem) !important; }
            body.y2-symbolic-mode .intro-info-desc  { font-size: clamp(2rem, 6vmin, 3.2rem) !important; }
            body.y2-symbolic-mode .apply-step-num   { display: none !important; }
            body.y2-symbolic-mode .apply-step-row   { justify-content: center !important; padding: 16px !important; }
            body.y2-symbolic-mode .apply-step-text  { font-size: clamp(3.2rem, 9.5vmin, 5.2rem) !important; text-align: center !important; }
        `;
        document.head.appendChild(st);
    }

    function playRewardChimeSafe() {
        if (typeof playCorrectChime === 'function') playCorrectChime();
        else if (typeof playMagicalChime === 'function') playMagicalChime();
        else if (typeof GameEngine !== 'undefined' && GameEngine.playSound) GameEngine.playSound('success');
    }

    function playWrongToneSafe() {
        if (typeof playWrongTone === 'function') playWrongTone();
        else if (typeof GameEngine !== 'undefined' && GameEngine.playSound) GameEngine.playSound('error');
    }

    function buildToddlerPlaygroundDOM(defData) {
        if ((typeof RAW_YEAR !== 'undefined' && RAW_YEAR !== 2) || globalStep !== 1) return;
        const slideObj = defData?.learn?.slides?.[0];
        if (!slideObj || !slideObj.toddlerGame) return;

        const contentDiv = document.getElementById('main-content');
        const fancyCard = contentDiv ? contentDiv.querySelector('.fancy-card') : null;
        if (!fancyCard) return;

        injectToddlerSymbolicStyles();
        const gameCfg = slideObj.toddlerGame;
        window._activeSlideIdx = 0;

        // واجهة رمزية ١٠٠٪ بلا أي سطر كتابي، مع زر سماعة عائم لإعادة سماع التوجيه الصوتي
        fancyCard.innerHTML = `
            <div class="toddler-playground-wrap">
                <div class="toddler-top-split">
                    <div class="toddler-scene-frame">
                        <img src="${slideObj.img}" data-edit-asset-key="slide_img" alt="🌟">
                        <button type="button" class="toddler-floating-speaker" id="toddler-replay-voice" aria-label="استماع">🔊</button>
                    </div>
                    <div class="toddler-game-arena" id="toddler-arena"></div>
                </div>
            </div>
        `;

        const arena = document.getElementById('toddler-arena');
        const replayBtn = document.getElementById('toddler-replay-voice');
        if (replayBtn) {
            replayBtn.onclick = (e) => {
                e.stopPropagation();
                if (typeof speakText === 'function') speakText(gameCfg.promptTTS || '');
            };
        }

        // ١. لعبة الفقاعات الصوتية بالرموز الكبيرة فقط
        if (gameCfg.type === 'bubbles') {
            let poppedCount = 0;
            const totalBubbles = gameCfg.items.length;

            const topBadge = document.createElement('div');
            topBadge.style.cssText = 'font-size:clamp(2.6rem, 7vmin, 4rem); line-height:1;';
            topBadge.innerText = `✨ ${gameCfg.targetEmoji || '🌟'} ✨`;
            arena.appendChild(topBadge);

            const row = document.createElement('div');
            row.className = 'toddler-tokens-row';

            gameCfg.items.forEach((it) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'toddler-draggable-btn';
                btn.style.borderColor = it.color || '#38bdf8';
                btn.innerHTML = `<span class="toddler-tok-emoji">${it.emoji}</span>`;

                btn.onclick = () => {
                    if (typeof isSecretEditMode !== 'undefined' && isSecretEditMode) return;
                    if (!btn.classList.contains('popped-bubble')) {
                        btn.classList.add('popped-bubble');
                        poppedCount++;
                    }
                    playRewardChimeSafe();
                    if (typeof speakText === 'function') {
                        speakText(it.speak || '', () => {
                            if (poppedCount >= totalBubbles) {
                                updateNavButtons(true);
                                showCenterAction(() => handleNextClick(), true);
                            }
                        });
                    }
                };
                row.appendChild(btn);
            });
            arena.appendChild(row);
        }
        // ٢. لعبة الفرز وسلة العدّ بالرموز المحسوسة فقط (دون كلمات أو أرقام مكتوبة)
        else {
            const needed = gameCfg.needCount || 1;
            let currentDone = 0;

            const renderDots = (done, total) => {
                if (total <= 1) return '';
                let out = '';
                for (let i = 0; i < total; i++) out += (i < done) ? '⭐' : '⚪';
                return out;
            };

            const dropZone = document.createElement('div');
            dropZone.className = 'toddler-drop-target';
            dropZone.style.borderColor = gameCfg.targetColor || '#0284c7';
            dropZone.innerHTML = `
                <div class="toddler-target-ghost" id="toddler-ghost-icon">${gameCfg.targetEmoji || '🧺'}</div>
                <div class="toddler-dots-progress" id="toddler-dots-bar">${renderDots(0, needed)}</div>
            `;
            arena.appendChild(dropZone);

            const row = document.createElement('div');
            row.className = 'toddler-tokens-row';

            const handleTokenSuccess = (btn, it) => {
                if (btn.classList.contains('done-token')) return;
                btn.classList.add('done-token');
                currentDone++;
                playRewardChimeSafe();

                const ghost = document.getElementById('toddler-ghost-icon');
                const dotsBar = document.getElementById('toddler-dots-bar');
                dropZone.classList.add('success-pop');
                if (ghost) ghost.innerText = (needed > 1) ? it.emoji.repeat(currentDone) : it.emoji;
                if (dotsBar) dotsBar.innerText = renderDots(currentDone, needed);

                if (typeof speakText === 'function') {
                    speakText(it.speak || '', () => {
                        if (currentDone >= needed) {
                            playRewardChimeSafe();
                            updateNavButtons(true);
                            showCenterAction(() => handleNextClick(), true);
                        }
                    });
                }
            };

            const handleTokenWrong = (btn, it) => {
                btn.style.borderColor = '#ef4444';
                btn.style.background = '#fee2e2';
                playWrongToneSafe();
                if (typeof speakText === 'function' && it.speak) speakText(it.speak);
                setTimeout(() => {
                    btn.style.borderColor = it.color || '#cbd5e1';
                    btn.style.background = '#ffffff';
                }, 500);
            };

            let activeDraggedItem = null;
            let activeDraggedBtn = null;

            dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('hover-glow'); };
            dropZone.ondragleave = () => dropZone.classList.remove('hover-glow');
            dropZone.ondrop = (e) => {
                e.preventDefault();
                dropZone.classList.remove('hover-glow');
                if (!activeDraggedItem || !activeDraggedBtn || (typeof isSecretEditMode !== 'undefined' && isSecretEditMode)) return;
                if (activeDraggedItem.good) handleTokenSuccess(activeDraggedBtn, activeDraggedItem);
                else handleTokenWrong(activeDraggedBtn, activeDraggedItem);
            };

            const isEdit = (typeof isSecretEditMode !== 'undefined' && isSecretEditMode);
            const displayItems = isEdit ? gameCfg.items : [...gameCfg.items].sort(() => Math.random() - 0.5);

            displayItems.forEach((it) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'toddler-draggable-btn';
                btn.draggable = !isEdit;
                btn.style.borderColor = it.color || '#cbd5e1';
                btn.innerHTML = `<span class="toddler-tok-emoji">${it.emoji}</span>`;

                btn.ondragstart = () => { activeDraggedItem = it; activeDraggedBtn = btn; };
                btn.onclick = () => {
                    if (typeof isSecretEditMode !== 'undefined' && isSecretEditMode) return;
                    if (it.good) handleTokenSuccess(btn, it);
                    else handleTokenWrong(btn, it);
                };

                row.appendChild(btn);
            });
            arena.appendChild(row);
        }

        if (typeof isSecretEditMode !== 'undefined' && isSecretEditMode && typeof attachEditHooksToCurrentStation === 'function') {
            attachEditHooksToCurrentStation(defData);
        }
    }

    // ربط المحرك التفاعلي وضبط المسار الثلاثي الرمزي (0 -> 1 -> 5) لعمر السنتين
    function hookYear2SymbolicEngine() {
        if (typeof RAW_YEAR === 'undefined' || RAW_YEAR !== 2) return;
        if (window._y2SymbolicHooked || typeof window.renderCurrentStep !== 'function') return;
        window._y2SymbolicHooked = true;
        document.body.classList.add('y2-symbolic-mode');
        injectToddlerSymbolicStyles();

        const origRender = window.renderCurrentStep;
        window.renderCurrentStep = function() {
            const isEdit = (typeof isSecretEditMode !== 'undefined' && isSecretEditMode);
            if (!isEdit && (globalStep === 2 || globalStep === 3 || globalStep === 4)) {
                globalStep = 5;
            }

            origRender.apply(this, arguments);

            // إخفاء أيقونات محطات الأسئلة (2، 3، 4) من الشريط العلوي لطفل السنتين
            [2, 3, 4].forEach(stIdx => {
                const dot = document.getElementById('dot-' + stIdx);
                if (dot && !isEdit) dot.classList.add('hidden-station');
            });

            const defData = (typeof getActiveCurriculumObj === 'function') ? getActiveCurriculumObj() : null;
            if (!defData) return;

            if (globalStep === 0 && defData.learn?.introTTS && typeof speakText === 'function') {
                speakText(defData.learn.introTTS, () => {
                    if (typeof updateNavButtons === 'function') updateNavButtons(true);
                    if (typeof showCenterAction === 'function') showCenterAction(() => handleNextClick(), false);
                });
            } else if (globalStep === 1) {
                buildToddlerPlaygroundDOM(defData);
                const promptTTS = defData.learn?.slides?.[0]?.toddlerGame?.promptTTS;
                if (promptTTS && typeof speakText === 'function') {
                    speakText(promptTTS);
                }
            } else if (globalStep === 5 && defData.apply?.applyTTS && typeof speakText === 'function') {
                speakText(defData.apply.applyTTS, () => {
                    if (typeof updateNavButtons === 'function') updateNavButtons(true);
                    if (typeof showCenterAction === 'function') showCenterAction(() => completeLesson(activeViewSubj), true);
                });
            }
        };

        if (typeof window.handlePrevClick === 'function') {
            const origPrev = window.handlePrevClick;
            window.handlePrevClick = function() {
                const isEdit = (typeof isSecretEditMode !== 'undefined' && isSecretEditMode);
                if (!isEdit && globalStep === 5) {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    globalStep = 1;
                    window.renderCurrentStep();
                    return;
                }
                origPrev.apply(this, arguments);
            };
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', hookYear2SymbolicEngine);
    } else {
        setTimeout(hookYear2SymbolicEngine, 0);
    }
})();