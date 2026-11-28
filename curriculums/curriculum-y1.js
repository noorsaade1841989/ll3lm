// ============================================================================
// منهج السنة الأولى فقط (curriculum-y1.js) — سبعة فيديوهات عبر الأختام السبعة حصراً
// ============================================================================
(function buildYear1SevenVideos() {
    window.curriculumData = window.curriculumData || {};
    window.curriculumData[1] = {};

    // الفيديوهات السبعة الموزعة من 1 إلى 7 عبر الأختام السبعة (assets/y1/videos/v1.mp4 .. v7.mp4)
    const Y1_SEVEN_VIDEOS = [
        { id: 1, title: "قِصَّةُ آدَمَ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v1.mp4", cover: "assets/y4/art/art1.jpg" },
        { id: 2, title: "قِصَّةُ أَيُّوبَ الصَّبُورِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v2.mp4", cover: "assets/y4/art/art2.jpg" },
        { id: 3, title: "قِصَّةُ يُونُسَ ذِي النُّونِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v3.mp4", cover: "assets/y4/art/art3.jpg" },
        { id: 4, title: "قِصَّةُ هُودٍ الحَكِيمِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v4.mp4", cover: "assets/y4/art/art4.jpg" },
        { id: 5, title: "قِصَّةُ إِبْرَاهِيمَ الخَلِيلِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v5.mp4", cover: "assets/y4/art/art5.jpg" },
        { id: 6, title: "قِصَّةُ يَعْقُوبَ الصَّابِرِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v6.mp4", cover: "assets/y4/art/art6.jpg" },
        { id: 7, title: "قِصَّةُ عُزَيْرٍ المُتَفَكِّرِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v7.mp4", cover: "assets/y4/art/art7.jpg" }
    ];

    // ربط المحطات الـ 28 بالأختام السبعة: الختم 1 -> v1.mp4 ... الختم 7 -> v7.mp4 دون أي شرائح أو أسئلة أو موسيقى خلفية
    for (let wNum = 1; wNum <= 28; wNum++) {
        window.curriculumData[1][wNum] = {};
        for (let sealId = 1; sealId <= 7; sealId++) {
            const vidItem = Y1_SEVEN_VIDEOS[sealId - 1];
            window.curriculumData[1][wNum][sealId] = {
                learn: {
                    introTitle: vidItem.title,
                    introGoal: "مُشَاهَدَةٌ هَادِئَةٌ",
                    coverImg: vidItem.cover,
                    video: vidItem.video,
                    useVideo: true,
                    videoOnlyNoBgMusic: true,
                    skipQuiz: true,
                    skipApply: true,
                    slides: []
                },
                play: {
                    skipQuiz: true,
                    skipSadaqah: true,
                    skipGift: true,
                    questions: [],
                    sadaqahPairs: []
                },
                apply: {
                    skipApply: true,
                    img: vidItem.cover,
                    steps: []
                }
            };
        }
    }
})();
