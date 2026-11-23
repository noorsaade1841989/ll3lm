// ============================================================================
// منهج السنة الأولى فقط (curriculum-y1.js) — مقتصر حصراً على الفيديوهات الثمانية
// ============================================================================
(function buildYear1VideosOnly() {
    window.curriculumData = window.curriculumData || {};
    window.curriculumData[1] = {};

    // عناوين الفيديوهات الثمانية الأساسية للسنة الأولى (assets/y1/videos/v1.mp4 .. v8.mp4)
    const Y1_EIGHT_VIDEOS = [
        { id: 1, title: "قِصَّةُ آدَمَ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v1.mp4", cover: "assets/y4/art/art1.jpg" },
        { id: 2, title: "قِصَّةُ أَيُّوبَ الصَّبُورِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v2.mp4", cover: "assets/y4/art/art2.jpg" },
        { id: 3, title: "قِصَّةُ يُونُسَ ذِي النُّونِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v3.mp4", cover: "assets/y4/art/art3.jpg" },
        { id: 4, title: "قِصَّةُ هُودٍ الحَكِيمِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v4.mp4", cover: "assets/y4/art/art4.jpg" },
        { id: 5, title: "قِصَّةُ إِبْرَاهِيمَ الخَلِيلِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v5.mp4", cover: "assets/y4/art/art5.jpg" },
        { id: 6, title: "قِصَّةُ يَعْقُوبَ الصَّابِرِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v6.mp4", cover: "assets/y4/art/art6.jpg" },
        { id: 7, title: "قِصَّةُ عُزَيْرٍ المُتَفَكِّرِ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v7.mp4", cover: "assets/y4/art/art7.jpg" },
        { id: 8, title: "قِصَّةُ شَيْخِ المُرْسَلِينَ نُوحٍ عَلَيْهِ السَّلَامْ", video: "assets/y1/videos/v8.mp4", cover: "assets/y4/art/art8.jpg" }
    ];

    // ربط الأسابيع (1 إلى 28) بالفيديوهات الثمانية حصراً دون أي أسئلة أو شرائح أو تطبيقات إضافية
    for (let wNum = 1; wNum <= 28; wNum++) {
        const vidItem = Y1_EIGHT_VIDEOS[(wNum - 1) % Y1_EIGHT_VIDEOS.length];

        const cleanVideoLesson = {
            learn: {
                introTitle: `🎬 ${vidItem.title}`,
                introGoal: "🎵 مُشَاهَدَةٌ وَمُوسِيقَى",
                coverImg: vidItem.cover,
                video: vidItem.video,
                useVideo: true,
                videoAndMusicOnly: true,
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

        window.curriculumData[1][wNum] = {
            1: cleanVideoLesson,
            2: cleanVideoLesson,
            3: cleanVideoLesson,
            4: cleanVideoLesson,
            5: cleanVideoLesson,
            6: cleanVideoLesson,
            7: cleanVideoLesson
        };
    }
})();