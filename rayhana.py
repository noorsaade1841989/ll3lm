import os
import re
import json
import time
import threading
import subprocess
from pathlib import Path
import requests
import customtkinter as ctk
from tkinter import filedialog, messagebox


def hide_console_window():
    """إخفاء نافذة الكونسول السوداء خلف الواجهة في ويندوز"""
    if os.name == "nt":
        try:
            import ctypes
            hwnd = ctypes.windll.kernel32.GetConsoleWindow()
            if hwnd:
                ctypes.windll.user32.ShowWindow(hwnd, 0)
        except Exception:
            pass


ctk.set_appearance_mode("System")
ctk.set_default_color_theme("blue")
ctk.set_widget_scaling(0.92)
ctk.set_window_scaling(0.92)

FONT_FAMILY = "Tahoma"

ALI_AI_URL = "http://localhost:5001/v1/chat/completions"
DEFAULT_STAGE2_DIR = Path.home() / "Desktop" / "ll3lm"
RAYHANA_ROOT_DIR = Path.home() / "Desktop" / "ريحانة"

STRICT_ABJAD_LETTERS = [
    "أ", "ب", "ج", "د", "هـ", "و", "ز", "ح",
    "ط", "ي", "ك", "ل", "م", "ن", "س", "ع",
    "ف", "ص", "ق", "ر", "ش", "ت", "ث", "خ",
    "ذ", "ض", "ظ", "غ"
]

SEALS_META = {
    1: "المنطق والبيان",
    2: "البصيرة والفن الهندسي",
    3: "الرنين والتناغم الصوتي",
    4: "الرياضيات والمقدار",
    5: "الحركة والاتزان البدني",
    6: "العلوم وسنن الكون",
    7: "الآداب وتزكية السلوك",
}

ARABIC_DIGITS_MAP = {
    "0": "صفر", "٠": "صفر",
    "1": "واحد", "١": "واحد",
    "2": "اثنان", "٢": "اثنان",
    "3": "ثلاثة", "٣": "ثلاثة",
    "4": "أربعة", "٤": "أربعة",
    "5": "خمسة", "٥": "خمسة",
    "6": "ستة", "٦": "ستة",
    "7": "سبعة", "٧": "سبعة",
    "8": "ثمانية", "٨": "ثمانية",
    "9": "تسعة", "٩": "تسعة",
    "10": "عشرة", "١٠": "عشرة",
}


def sanitize_for_tts_and_points(raw_text: str) -> str:
    """
    تنقية النص وترتيبه في نقاط واضحة ومقروءة للقارئ الآلي:
    - إزالة الأقواس والشرطات المائلة والرموز المعيقة
    - إزالة الأرقام أو تحويل الأرقام المفردة الواضحة إلى كلمات عربية
    - إزالة الحروف اللاتينية المشوهة الناتجة عن النموذج
    """
    if not raw_text:
        return ""

    txt = str(raw_text)
    txt = re.sub(r"<br\s*/?>", "\n", txt, flags=re.IGNORECASE)
    txt = re.sub(r"<[^>]+>", " ", txt)

    txt = re.sub(r"[A-Za-z]+", " ", txt)
    txt = re.sub(r"[^\u0600-\u06FF0-9٠-٩\n\s]", " ", txt)

    def _num_repl(m):
        tok = m.group(0)
        return ARABIC_DIGITS_MAP.get(tok, "")

    txt = re.sub(r"\b(?:10|١٠|[0-9٠-٩])\b", _num_repl, txt)
    txt = re.sub(r"[0-9٠-٩]+", " ", txt)
    txt = re.sub(r"[()\[\]{}«»\"'\\/\\|•●◆▪■★☆✳❖·=×÷+<>@#%^&*_~`]+", " ", txt)
    txt = re.sub(r"[:؛،,.\-–—!؟?]+", " ", txt)

    lines = []
    for ln in txt.splitlines():
        clean_ln = re.sub(r"\s+", " ", ln).strip()
        if len(clean_ln) >= 2:
            lines.append(clean_ln)

    return "\n".join(lines)


def clean_plain_label(raw_text: str) -> str:
    """تنظيف العناوين والأسئلة من الرموز والأقواس والشرطات المائلة"""
    if not raw_text:
        return ""
    txt = re.sub(r"<[^>]+>", " ", str(raw_text))
    txt = re.sub(r"[()\[\]{}«»\"'\\/\\|•●◆▪■★☆=×÷<>@#%^&*_~`]+", " ", txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt


def parse_quran_index(quran_text: str) -> dict[tuple[int, int], str]:
    """فهرسة قرآن.txt بصيغة سورة|آية|نص مع الحفاظ على التشكيل كما هو"""
    index: dict[tuple[int, int], str] = {}
    if not quran_text:
        return index
    for line in quran_text.splitlines():
        line = line.strip()
        m = re.match(r"^(\d+)\|(\d+)\|(.+)$", line)
        if m:
            s_num = int(m.group(1))
            a_num = int(m.group(2))
            index[(s_num, a_num)] = m.group(3).strip()
    return index


def extract_quran_ayat_for_logic_lesson(logic_chunk: str, quran_index: dict[tuple[int, int], str]) -> str:
    """استخراج الآيات القرآنية المرتبطة بدرس المنطق كما هي بتشكيلها"""
    if not logic_chunk or not quran_index:
        return ""
    found_ayat: list[str] = []
    for m in re.finditer(r"\((\d+)\s*:\s*(\d+)(?:\s*[\-–—]\s*(\d+))?\)", logic_chunk):
        surah = int(m.group(1))
        start_a = int(m.group(2))
        end_a = int(m.group(3)) if m.group(3) else start_a
        for a in range(start_a, min(end_a + 1, start_a + 25)):
            aya_txt = quran_index.get((surah, a))
            if aya_txt and aya_txt not in found_ayat:
                found_ayat.append(aya_txt)
    return " ".join(found_ayat[:6])


def _fit_chunks_to_count(chunks: list[str], target_count: int) -> list[str]:
    """ضبط قائمة المقاطع لتطابق عدد الوحدات المطلوب"""
    if target_count <= 0:
        return []
    if not chunks:
        return ["" for _ in range(target_count)]

    if len(chunks) == target_count:
        return chunks

    if len(chunks) > target_count:
        result: list[str] = []
        n = len(chunks)
        for i in range(target_count):
            start = (i * n) // target_count
            end = ((i + 1) * n) // target_count
            result.append("\n".join(chunks[start:end]).strip())
        return result

    result = []
    for i in range(target_count):
        base_chunk = chunks[i % len(chunks)]
        cycle_idx = (i // 28) + 1
        if cycle_idx > 1:
            result.append(f"{base_chunk}\nتوسيع الفهم في الدورة {cycle_idx}")
        else:
            result.append(base_chunk)
    return result


def split_book_into_units(text: str, total_units: int, book_kind: str = "generic") -> list[str]:
    """المهمة 1 و2: تقسيم الكتاب حسب بنيته وتوزيعه على العدد المطلوب من الأقسام"""
    if not text or not text.strip():
        return ["" for _ in range(total_units)]

    clean_t = text.strip()

    if book_kind == "logic":
        lesson_matches = list(re.finditer(r"(?m)^[•\-\*]?\s*درس\s+[\d٠-٩]+\s*[—\-–:].+$", clean_t))
        if len(lesson_matches) >= 4:
            chunks = []
            for i, m in enumerate(lesson_matches):
                s = m.start()
                e = lesson_matches[i + 1].start() if i + 1 < len(lesson_matches) else len(clean_t)
                chunks.append(clean_t[s:e].strip())
            return _fit_chunks_to_count(chunks, total_units)

    patterns = [
        r"(?m)^(?:#{1,4}\s*|\*\*)?(?:الوحدة|درس|الدرس)\s+[^\n]+$",
        r"(?m)^[\d٠-٩]+\s*[\.\-–—]\s*(?:الحرف|سؤال|صورة|الوسادة|زهرة|دوائر|الخيط|قطرات|سر|الصورة|دقائق|البذرة|ثِقَل|رنين|تعاقب|أغصان|رجع|مَعصرة|مِصفاة|العُود|رحيق|سحابة|نواة|إبرة|قرص|غصن|كفّتا|خيوط|نسيم|أوتاد|ينبوع)[^\n]*$",
    ]
    for pat in patterns:
        matches = list(re.finditer(pat, clean_t))
        if len(matches) >= 6:
            chunks = []
            for i, m in enumerate(matches):
                s = m.start()
                e = matches[i + 1].start() if i + 1 < len(matches) else len(clean_t)
                part = clean_t[s:e].strip()
                if len(part) > 15:
                    chunks.append(part)
            if len(chunks) >= 4:
                return _fit_chunks_to_count(chunks, total_units)

    paras = [p.strip() for p in re.split(r"\n\s*\n", clean_t) if len(p.strip()) > 15]
    if len(paras) < total_units:
        sents = [s.strip() for s in re.split(r"[.،؛\n]+", clean_t) if len(s.strip()) > 12]
        if sents:
            paras = sents
    return _fit_chunks_to_count(paras if paras else [clean_t], total_units)


def extract_age_level_from_book(chunk_text: str, age_year: int) -> str:
    """استخراج المستوى المطابق لعمر الطالب (8 إلى 14)"""
    if not chunk_text:
        return ""
    level_num = max(1, min(7, age_year - 7))
    pat = re.compile(rf"(?m)^[•\-\*]?\s*المستوى\s*{level_num}\b[^\n]*")
    m = pat.search(chunk_text)
    if m:
        first_lines = []
        for ln in chunk_text.splitlines()[:3]:
            if not re.match(r"^[•\-\*]?\s*(الهدف|المستوى)", ln.strip()):
                first_lines.append(ln.strip())
        return "\n".join(first_lines + [m.group(0).strip()]).strip()
    return chunk_text


def build_safe_lesson_entry(
    seal_id: int,
    seal_title: str,
    slide_points: list[str],
    apply_steps: list[str],
    intro_title: str = "",
    intro_goal: str = "",
) -> dict:
    """بناء بنية الدرس المحمية مع بقاء الأسئلة في مسار معزول غير معطِّل للدروس"""
    safe_pts = [p for p in slide_points if p.strip()] or [clean_plain_label(f"هذا درس {seal_title} قيد التحضير")]
    safe_steps = [s for s in apply_steps if s.strip()] or [clean_plain_label(f"أراجع نقاط {seal_title} وأعمل بها")]
    first_pt = safe_pts[0]
    second_pt = safe_pts[1] if len(safe_pts) > 1 else first_pt
    third_pt = safe_pts[2] if len(safe_pts) > 2 else first_pt
    wrong_fallback = clean_plain_label(f"غير وارد في درس {seal_title}")

    return {
        "learn": {
            "introTitle": intro_title or clean_plain_label(f"درس {seal_title}"),
            "introGoal": intro_goal or clean_plain_label(f"فهم {seal_title} وتطبيقه"),
            "slides": [
                {
                    "img": "",
                    "text": pt,
                    "labData": False,
                }
                for pt in safe_pts
            ],
        },
        "play": {
            "questions": [
                {
                    "q": f"ما الفكرة الأساسية في درس {seal_title}",
                    "focusWord": "",
                    "options": [
                        {"text": first_pt, "correct": True},
                        {"text": wrong_fallback, "correct": False},
                    ],
                },
                {
                    "q": f"أي عبارة توافق ما ورد في {intro_title or seal_title}",
                    "focusWord": "",
                    "options": [
                        {"text": second_pt, "correct": True},
                        {"text": wrong_fallback, "correct": False},
                    ],
                },
                {
                    "q": f"ماذا نستنتج من نقاط درس {seal_title}",
                    "focusWord": "",
                    "options": [
                        {"text": third_pt, "correct": True},
                        {"text": wrong_fallback, "correct": False},
                    ],
                },
            ],
            "sadaqahPairs": [
                {"right": clean_plain_label(seal_title), "left": first_pt},
                {"right": intro_title or clean_plain_label(seal_title), "left": second_pt},
                {"right": clean_plain_label("الخلاصة"), "left": third_pt},
            ],
            "sadaqahDecoy": wrong_fallback,
            "giftBasket": {
                "prompt": f"اختر العبارات الصحيحة من درس {seal_title}",
                "targetCount": 1,
                "items": [
                    {"emoji": "📘", "label": first_pt, "good": True},
                    {"emoji": "🚫", "label": wrong_fallback, "good": False},
                ],
            },
        },
        "apply": {
            "steps": safe_steps,
        },
    }


class RayhanaApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("ريحانة — المهام الخمس لبناء دورات مرحلة عبد")
        self._center_window(0.84, 0.86, min_w=1020, min_h=640)

        RAYHANA_ROOT_DIR.mkdir(parents=True, exist_ok=True)
        DEFAULT_STAGE2_DIR.mkdir(parents=True, exist_ok=True)

        self.is_running = False
        self.stop_flag = False
        self.quran_index: dict[tuple[int, int], str] = {}

        self.book_paths: dict[str, ctk.StringVar] = {
            "logic": ctk.StringVar(value=""),
            "quran": ctk.StringVar(value=""),
            "bayan": ctk.StringVar(value=""),
            "tajweed": ctk.StringVar(value=""),
            "math": ctk.StringVar(value=""),
            "sports": ctk.StringVar(value=""),
            "science": ctk.StringVar(value=""),
            "adab": ctk.StringVar(value=""),
        }

        self.year_var = ctk.StringVar(value="8")
        self.cycle_var = ctk.StringVar(value="1")
        self.output_dir_var = ctk.StringVar(value=str(DEFAULT_STAGE2_DIR))
        self.ali_url_var = ctk.StringVar(value=ALI_AI_URL)

        self._build_ui()
        self._auto_detect_books_in_folder(Path.cwd())
        self._auto_detect_books_in_folder(DEFAULT_STAGE2_DIR)

    def _center_window(self, w_ratio: float, h_ratio: float, min_w: int = 1020, min_h: int = 640):
        self.update_idletasks()
        sw = self.winfo_screenwidth()
        sh = self.winfo_screenheight()
        win_w = max(min_w, int(sw * w_ratio))
        win_h = max(min_h, int(sh * h_ratio))
        pos_x = max(0, int((sw - win_w) / 2))
        pos_y = max(0, int((sh - win_h) / 2))
        self.geometry(f"{win_w}x{win_h}+{pos_x}+{pos_y}")

    def _auto_detect_books_in_folder(self, folder: Path):
        if not folder.exists():
            return
        known_files = {
            "logic": ["كتاب المنطق.txt"],
            "quran": ["قرآن.txt", "quran.txt"],
            "tajweed": ["كتاب التجويد و الصوت.txt"],
            "sports": ["كتاب الرياضة.txt"],
            "bayan": ["كتاب البيان ٨ سنوات.txt", "كتاب البيان.txt"],
            "math": ["كتاب_الرياضيات_سن_08.txt", "كتاب الرياضيات.txt"],
            "science": ["علوم ٨سنوات.txt", "علوم.txt"],
            "adab": ["كتاب الآداب ٨ سنوات .txt", "كتاب الآداب ٨ سنوات.txt", "كتاب الآداب.txt"],
        }
        for key, candidates in known_files.items():
            if self.book_paths[key].get().strip():
                continue
            for name in candidates:
                p = folder / name
                if p.exists():
                    self.book_paths[key].set(str(p))
                    break

    def _build_ui(self):
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)

        top_bar = ctk.CTkFrame(self, corner_radius=8)
        top_bar.grid(row=0, column=0, padx=10, pady=(10, 6), sticky="ew")

        ctk.CTkLabel(
            top_bar, text="السنة:", font=(FONT_FAMILY, 13, "bold")
        ).pack(side="right", padx=(8, 4), pady=8)

        self.opt_year = ctk.CTkOptionMenu(
            top_bar,
            values=["8", "9", "10", "11", "12", "13", "14"],
            variable=self.year_var,
            font=(FONT_FAMILY, 13, "bold"),
            width=72,
            height=34,
        )
        self.opt_year.pack(side="right", padx=4, pady=8)

        ctk.CTkLabel(
            top_bar, text="الدورة:", font=(FONT_FAMILY, 13, "bold")
        ).pack(side="right", padx=(8, 4), pady=8)

        self.opt_cycle = ctk.CTkOptionMenu(
            top_bar,
            values=["1", "2", "3", "4", "5", "6", "7"],
            variable=self.cycle_var,
            font=(FONT_FAMILY, 13, "bold"),
            width=72,
            height=34,
        )
        self.opt_cycle.pack(side="right", padx=4, pady=8)

        ctk.CTkLabel(
            top_bar, text="مجلد الستيج 2:", font=(FONT_FAMILY, 12, "bold")
        ).pack(side="right", padx=(10, 4), pady=8)

        ctk.CTkEntry(
            top_bar, textvariable=self.output_dir_var, font=(FONT_FAMILY, 11), width=230, height=32
        ).pack(side="right", padx=4, pady=8)

        ctk.CTkButton(
            top_bar, text="📁 اختر", font=(FONT_FAMILY, 12, "bold"),
            width=64, height=32, command=self.pick_output_dir
        ).pack(side="right", padx=2, pady=8)

        self.btn_start = ctk.CTkButton(
            top_bar, text="▶ تنفيذ المهام الخمس للدورة", font=(FONT_FAMILY, 13, "bold"),
            fg_color="#059669", hover_color="#047857",
            height=36, command=self.start_generation
        )
        self.btn_start.pack(side="left", padx=4, pady=8)

        self.btn_stop = ctk.CTkButton(
            top_bar, text="⏹ إيقاف", font=(FONT_FAMILY, 13, "bold"),
            fg_color="#C62828", hover_color="#8E0000",
            width=76, height=36, state="disabled", command=self.stop_generation
        )
        self.btn_stop.pack(side="left", padx=4, pady=8)

        self.lbl_status = ctk.CTkLabel(
            top_bar, text="جاهز", font=(FONT_FAMILY, 12, "bold"), text_color="#2E7D32"
        )
        self.lbl_status.pack(side="left", padx=8)

        body = ctk.CTkFrame(self, fg_color="transparent")
        body.grid(row=1, column=0, padx=10, pady=(0, 10), sticky="nsew")
        body.grid_columnconfigure(0, weight=3)
        body.grid_columnconfigure(1, weight=2)
        body.grid_rowconfigure(0, weight=1)

        books_panel = ctk.CTkFrame(body, corner_radius=8)
        books_panel.grid(row=0, column=1, padx=(6, 0), pady=0, sticky="nsew")
        books_panel.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(
            books_panel, text="📚 الكتب الثمانية (تُوحَّد إلى الأختام السبعة)",
            font=(FONT_FAMILY, 13, "bold"), text_color="#047857"
        ).grid(row=0, column=0, columnspan=3, padx=8, pady=(8, 6), sticky="e")

        book_rows = [
            ("logic", "الختم 1 أصل: كتاب المنطق"),
            ("quran", "الختم 1 سند: القرآن الكريم"),
            ("bayan", "الختم 2: كتاب البيان"),
            ("tajweed", "الختم 3: التجويد والصوت"),
            ("math", "الختم 4: كتاب الرياضيات"),
            ("sports", "الختم 5: كتاب الرياضة"),
            ("science", "الختم 6: كتاب العلوم"),
            ("adab", "الختم 7: كتاب الآداب"),
        ]

        for r_idx, (key, label_txt) in enumerate(book_rows, start=1):
            ctk.CTkLabel(
                books_panel, text=label_txt, font=(FONT_FAMILY, 12, "bold"), anchor="e"
            ).grid(row=r_idx, column=2, padx=(4, 8), pady=4, sticky="e")

            ctk.CTkEntry(
                books_panel, textvariable=self.book_paths[key], font=(FONT_FAMILY, 11), height=28
            ).grid(row=r_idx, column=1, padx=4, pady=4, sticky="ew")

            ctk.CTkButton(
                books_panel, text="ملف", font=(FONT_FAMILY, 11, "bold"),
                width=52, height=28, command=lambda k=key: self.pick_book_file(k)
            ).grid(row=r_idx, column=0, padx=(8, 4), pady=4)

        ctk.CTkLabel(
            books_panel, text="رابط علي AI:", font=(FONT_FAMILY, 11, "bold"), anchor="e"
        ).grid(row=9, column=2, padx=(4, 8), pady=(10, 4), sticky="e")

        ctk.CTkEntry(
            books_panel, textvariable=self.ali_url_var, font=(FONT_FAMILY, 11), height=28
        ).grid(row=9, column=0, columnspan=2, padx=8, pady=(10, 4), sticky="ew")

        self.progress_bar = ctk.CTkProgressBar(books_panel)
        self.progress_bar.grid(row=10, column=0, columnspan=3, padx=8, pady=(10, 4), sticky="ew")
        self.progress_bar.set(0.0)

        self.lbl_progress = ctk.CTkLabel(
            books_panel, text="0 / 0", font=(FONT_FAMILY, 12, "bold")
        )
        self.lbl_progress.grid(row=11, column=0, columnspan=3, padx=8, pady=(0, 8))

        log_panel = ctk.CTkFrame(body, corner_radius=8)
        log_panel.grid(row=0, column=0, padx=(0, 6), pady=0, sticky="nsew")
        log_panel.grid_columnconfigure(0, weight=1)
        log_panel.grid_rowconfigure(1, weight=1)

        ctk.CTkLabel(
            log_panel, text="📝 سجل المهام الخمس (تقسيم ← تشكيل وأسئلة ← تجميع ← حقن)",
            font=(FONT_FAMILY, 13, "bold")
        ).grid(row=0, column=0, padx=8, pady=(8, 4), sticky="e")

        self.txt_log = ctk.CTkTextbox(log_panel, font=(FONT_FAMILY, 12), wrap="word")
        self.txt_log.grid(row=1, column=0, padx=8, pady=(0, 8), sticky="nsew")

    def log(self, msg: str):
        def _append():
            self.txt_log.insert("end", f"{msg}\n")
            self.txt_log.see("end")
        self.after(0, _append)

    def pick_book_file(self, key: str):
        chosen = filedialog.askopenfilename(
            title="اختر ملف الكتاب النصي",
            filetypes=[("Text Files", "*.txt"), ("All Files", "*.*")],
        )
        if chosen:
            self.book_paths[key].set(chosen)

    def pick_output_dir(self):
        chosen = filedialog.askdirectory(title="اختر مجلد منصة الستيج 2")
        if chosen:
            self.output_dir_var.set(chosen)

    def ensure_ali_running(self) -> bool:
        endpoint_model = self.ali_url_var.get().replace("/v1/chat/completions", "/api/v1/model")
        try:
            r = requests.get(endpoint_model, timeout=2)
            if r.status_code == 200:
                return True
        except Exception:
            pass

        exe_path = (
            r"C:\AI\koboldcpp_cu12.exe"
            if os.path.exists(r"C:\AI\koboldcpp_cu12.exe")
            else r"C:\AI\koboldcpp.exe"
        )
        if not os.path.exists(exe_path):
            return False

        if os.path.exists(r"C:\AI\qwen.kcpps"):
            cmd = [exe_path, "--config", r"C:\AI\qwen.kcpps", "--skiplauncher", "--quiet"]
        else:
            cmd = [
                exe_path, "--model", r"C:\AI\qwen2-7b-instruct-q4_k_m.gguf",
                "--usecuda", "--gpulayers", "99", "--contextsize", "8192",
                "--port", "5001", "--skiplauncher", "--quiet",
            ]

        self.after(0, lambda: self.lbl_status.configure(text="⚙️ تشغيل علي AI...", text_color="#EF6C00"))
        subprocess.Popen(cmd, creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0)

        for _ in range(30):
            time.sleep(1)
            if self.stop_flag:
                return False
            try:
                r = requests.get(endpoint_model, timeout=2)
                if r.status_code == 200:
                    return True
            except Exception:
                continue
        return False

    def call_ali_json(self, system_msg: str, user_msg: str) -> dict | None:
        url = self.ali_url_var.get().strip() or ALI_AI_URL
        payload = {
            "messages": [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            "temperature": 0.35,
            "max_tokens": 1800,
        }
        try:
            resp = requests.post(url, json=payload, timeout=180)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()
            content = re.sub(r"^```(?:json)?\s*", "", content, flags=re.IGNORECASE)
            content = re.sub(r"\s*```$", "", content).strip()
            match = re.search(r"\{.*\}", content, re.DOTALL)
            raw_json = match.group(0) if match else content
            raw_json = re.sub(r",\s*([}\]])", r"\1", raw_json)
            return json.loads(raw_json)
        except Exception:
            return None

    def task3_generate_seven_quiz_types_isolated(
        self,
        seal_title: str,
        intro_title: str,
        clean_points: list[str],
        ali_available: bool,
    ) -> dict:
        """
        خطوة معزولة لتوليد 7 أنواع من الأسئلة من نص السلايدات المنقّاة فقط:
        - 3 أسئلة اختيارية (فهم مباشر، تمييز وتحليل، تطبيق واستنتاج)
        - 3 أزواج مطابقة + مشتت واحد
        - 1 نشاط فرز وانتقاء (سلة الألماسة)
        عند أي تعثر في النموذج يعود للبديل الآمن دون المساس بالسلايدات.
        """
        first_pt = clean_points[0]
        second_pt = clean_points[1] if len(clean_points) > 1 else first_pt
        third_pt = clean_points[2] if len(clean_points) > 2 else first_pt
        wrong_fallback = clean_plain_label(f"غير وارد في درس {seal_title}")

        safe_play = {
            "questions": [
                {
                    "q": f"ما الفكرة الأساسية في درس {seal_title}",
                    "focusWord": "",
                    "options": [
                        {"text": first_pt, "correct": True},
                        {"text": wrong_fallback, "correct": False},
                    ],
                },
                {
                    "q": f"أي عبارة توافق ما ورد في {intro_title}",
                    "focusWord": "",
                    "options": [
                        {"text": second_pt, "correct": True},
                        {"text": wrong_fallback, "correct": False},
                    ],
                },
                {
                    "q": f"ماذا نستنتج من نقاط درس {seal_title}",
                    "focusWord": "",
                    "options": [
                        {"text": third_pt, "correct": True},
                        {"text": wrong_fallback, "correct": False},
                    ],
                },
            ],
            "sadaqahPairs": [
                {"right": clean_plain_label(seal_title), "left": first_pt},
                {"right": intro_title, "left": second_pt},
                {"right": clean_plain_label("الخلاصة"), "left": third_pt},
            ],
            "sadaqahDecoy": wrong_fallback,
            "giftBasket": {
                "prompt": f"اختر العبارات الصحيحة من درس {seal_title}",
                "targetCount": 1,
                "items": [
                    {"emoji": "📘", "label": first_pt, "good": True},
                    {"emoji": "🚫", "label": wrong_fallback, "good": False},
                ],
            },
        }

        if not ali_available:
            return safe_play

        joined_slides = "\n".join(clean_points)
        sys_quiz = (
            "أنت واضع أسئلة تعليمية بناءً حصراً على نص السلايدات المرفق دون أي إضافة من خارج النص. "
            "أنشئ 7 عناصر تقويمية متنوعة: "
            "أولاً 3 أسئلة اختيار من متعدد (الأول للفهم المباشر، الثاني للتمييز والتحليل، الثالث للاستنتاج والتطبيق). "
            "ثانياً 3 أزواج مطابقة (يمين ويسار) مع مشتت واحد خاطئ. "
            "ثالثاً سلة فرز وانتقاء لعناصر صحيحة وأخرى خاطئة. "
            "قواعد صارمة للقارئ الآلي: ممنوع الأرقام، ممنوع الأقواس، ممنوع الشرطة المائلة، ممنوع الحروف الأجنبية. "
            "أعد JSON فقط بالشكل التالي: "
            '{"questions":[{"q":"...","options":[{"text":"...","correct":true},{"text":"...","correct":false}]}],'
            '"sadaqahPairs":[{"right":"...","left":"..."}],'
            '"sadaqahDecoy":"...",'
            '"giftBasket":{"prompt":"...","targetCount":1,"items":[{"emoji":"📘","label":"...","good":true},{"emoji":"🚫","label":"...","good":false}]}}'
        )
        user_quiz = f"الختم {seal_title}\nنص السلايدات\n{joined_slides}"

        quiz_data = self.call_ali_json(sys_quiz, user_quiz)
        if not isinstance(quiz_data, dict):
            return safe_play

        valid_questions = []
        for q_item in (quiz_data.get("questions") or [])[:3]:
            q_txt = sanitize_for_tts_and_points(q_item.get("q", ""))
            opts = []
            has_correct = False
            for o_item in (q_item.get("options") or [])[:4]:
                o_txt = sanitize_for_tts_and_points(o_item.get("text", ""))
                is_corr = bool(o_item.get("correct"))
                if o_txt:
                    if is_corr:
                        has_correct = True
                    opts.append({"text": o_txt, "correct": is_corr})
            if q_txt and len(opts) >= 2:
                if not has_correct:
                    opts[0]["correct"] = True
                valid_questions.append({"q": q_txt, "focusWord": "", "options": opts})

        if len(valid_questions) == 3:
            safe_play["questions"] = valid_questions
        elif valid_questions:
            for idx_q, vq in enumerate(valid_questions):
                safe_play["questions"][idx_q] = vq

        valid_pairs = []
        seen_r, seen_l = set(), set()
        for p_item in (quiz_data.get("sadaqahPairs") or [])[:3]:
            r_txt = sanitize_for_tts_and_points(p_item.get("right", ""))
            l_txt = sanitize_for_tts_and_points(p_item.get("left", ""))
            if r_txt and l_txt and r_txt not in seen_r and l_txt not in seen_l:
                seen_r.add(r_txt)
                seen_l.add(l_txt)
                valid_pairs.append({"right": r_txt, "left": l_txt})

        if len(valid_pairs) >= 2:
            safe_play["sadaqahPairs"] = valid_pairs

        decoy_txt = sanitize_for_tts_and_points(quiz_data.get("sadaqahDecoy", ""))
        if decoy_txt and decoy_txt not in seen_l:
            safe_play["sadaqahDecoy"] = decoy_txt

        gb = quiz_data.get("giftBasket")
        if isinstance(gb, dict):
            g_prompt = sanitize_for_tts_and_points(gb.get("prompt", ""))
            g_items = []
            good_cnt = 0
            for it in (gb.get("items") or [])[:5]:
                lbl = sanitize_for_tts_and_points(it.get("label", ""))
                is_g = bool(it.get("good"))
                if lbl:
                    if is_g:
                        good_cnt += 1
                    g_items.append({
                        "emoji": "📘" if is_g else "🚫",
                        "label": lbl,
                        "good": is_g,
                    })
            if g_prompt and good_cnt >= 1 and len(g_items) >= 2:
                safe_play["giftBasket"] = {
                    "prompt": g_prompt,
                    "targetCount": min(good_cnt, 3),
                    "items": g_items,
                }

        return safe_play

    def task3_build_seal_slides_and_quizzes(
        self,
        year: int,
        cycle_num: int,
        abjad_char: str,
        seal_id: int,
        seal_title: str,
        raw_source_text: str,
        ali_available: bool,
    ) -> dict:
        """
        المهمة 3 على مرحلتين معزولتين لكل ختم:
        - المرحلة 3أ: بناء وتشكيل السلايدات وخطوات التطبيق (محمية بالكامل)
        - المرحلة 3ب: توليد أنواع الأسئلة السبعة من نص السلايدات المنقّاة ودمجها في الدرس
        """
        if not raw_source_text.strip():
            return build_safe_lesson_entry(seal_id, seal_title, [], [])

        clean_source = clean_plain_label(raw_source_text)[:1500]
        fallback_pts = [pt for pt in sanitize_for_tts_and_points(clean_source).splitlines() if pt.strip()]
        if not fallback_pts:
            fallback_pts = [clean_plain_label(f"هذا درس {seal_title} قيد التحضير")]

        intro_title = clean_plain_label(f"درس {seal_title}")
        intro_goal = clean_plain_label(f"فهم {seal_title} وتطبيقه")
        clean_points = fallback_pts[:4]
        clean_steps = [clean_points[0]]

        if ali_available:
            sys_slides = (
                "أنت مدقق لغوي ومعلم لمرحلة عبد (الأعمار 8 إلى 14 سنة). "
                "ضع التشكيل الكامل على الكلمات، ورتب الدرس في عناوين وأفكار ونقاط واضحة ومقروءة للشرائح. "
                "قواعد صارمة للقارئ الآلي: ممنوع الأرقام، ممنوع الأقواس، ممنوع الشرطة المائلة، ممنوع الحروف الأجنبية. "
                "أعد JSON فقط بالشكل التالي: "
                '{"introTitle": "...", "introGoal": "...", "slides_points": ["نقطة أولى مشكّلة", "نقطة ثانية مشكّلة"], "apply_steps": ["خطوة تطبيقية"]}'
            )
            user_slides = (
                f"السنة {year} الدورة {cycle_num} الحرف {abjad_char} الختم {seal_title}\n"
                f"النص المصدر\n{clean_source}"
            )
            data = self.call_ali_json(sys_slides, user_slides)
            if isinstance(data, dict):
                t_cand = sanitize_for_tts_and_points(data.get("introTitle", ""))
                g_cand = sanitize_for_tts_and_points(data.get("introGoal", ""))
                pts_cand = [
                    sanitize_for_tts_and_points(p)
                    for p in (data.get("slides_points") or [])
                    if sanitize_for_tts_and_points(p)
                ]
                stp_cand = [
                    sanitize_for_tts_and_points(s)
                    for s in (data.get("apply_steps") or [])
                    if sanitize_for_tts_and_points(s)
                ]
                if t_cand:
                    intro_title = t_cand
                if g_cand:
                    intro_goal = g_cand
                if pts_cand:
                    clean_points = pts_cand
                if stp_cand:
                    clean_steps = stp_cand

        lesson_entry = build_safe_lesson_entry(
            seal_id=seal_id,
            seal_title=seal_title,
            slide_points=clean_points,
            apply_steps=clean_steps,
            intro_title=intro_title,
            intro_goal=intro_goal,
        )

        try:
            lesson_entry["play"] = self.task3_generate_seven_quiz_types_isolated(
                seal_title=seal_title,
                intro_title=intro_title,
                clean_points=clean_points,
                ali_available=ali_available,
            )
        except Exception:
            pass

        return lesson_entry

    def start_generation(self):
        if self.is_running:
            return

        year = int(self.year_var.get())
        max_cycles = max(1, min(7, year - 7))
        cycle_num = min(max_cycles, max(1, int(self.cycle_var.get())))
        self.cycle_var.set(str(cycle_num))

        out_dir = Path(self.output_dir_var.get().strip() or str(DEFAULT_STAGE2_DIR))
        out_dir.mkdir(parents=True, exist_ok=True)

        self.is_running = True
        self.stop_flag = False
        self.btn_start.configure(state="disabled")
        self.btn_stop.configure(state="normal")
        self.txt_log.delete("1.0", "end")

        threading.Thread(
            target=self._run_five_tasks_pipeline,
            args=(year, cycle_num, out_dir),
            daemon=True,
        ).start()

    def stop_generation(self):
        self.stop_flag = True
        self.is_running = False
        self.lbl_status.configure(text="⏹ تم الإيقاف وحفظ التقدم", text_color="#C62828")

    def _read_file_safe(self, key: str) -> str:
        p_str = self.book_paths[key].get().strip()
        if not p_str or not os.path.exists(p_str):
            return ""
        try:
            with open(p_str, "r", encoding="utf-8") as f:
                return f.read()
        except Exception:
            return ""

    def _run_five_tasks_pipeline(self, year: int, cycle_num: int, out_dir: Path):
        max_cycles = max(1, min(7, year - 7))
        total_year_weeks = max_cycles * 28
        cycle_start_idx = (cycle_num - 1) * 28

        # المهمة 1: قراءة الكتب وتوحيدها على الأختام السبعة
        self.log(f"[المهمة 1] توحيد الكتب إلى الأختام السبعة للسنة {year} — الدورة {cycle_num}")
        quran_raw = self._read_file_safe("quran")
        self.quran_index = parse_quran_index(quran_raw)

        all_logic = split_book_into_units(self._read_file_safe("logic"), total_year_weeks, "logic")
        all_bayan = split_book_into_units(self._read_file_safe("bayan"), total_year_weeks, "bayan")
        all_tajweed_raw = split_book_into_units(self._read_file_safe("tajweed"), 28, "tajweed")
        all_math = split_book_into_units(self._read_file_safe("math"), total_year_weeks, "math")
        all_sports_raw = split_book_into_units(self._read_file_safe("sports"), 28, "sports")
        all_science = split_book_into_units(self._read_file_safe("science"), total_year_weeks, "science")
        all_adab = split_book_into_units(self._read_file_safe("adab"), total_year_weeks, "adab")

        # المهمة 2: استخراج حصة السنة والدورة إلى 28 قسماً لكل ختم
        self.log(f"[المهمة 2] استخراج 28 قسماً لكل ختم لعمر {year} سنوات (الدورة {cycle_num})")
        seals_28_sections: dict[int, list[str]] = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []}

        for local_i in range(28):
            global_i = cycle_start_idx + local_i
            base_logic = all_logic[global_i] if global_i < len(all_logic) else ""
            ayat_support = extract_quran_ayat_for_logic_lesson(base_logic, self.quran_index)
            seals_28_sections[1].append(f"{base_logic}\n{ayat_support}".strip())
            seals_28_sections[2].append(all_bayan[global_i] if global_i < len(all_bayan) else "")
            seals_28_sections[3].append(extract_age_level_from_book(all_tajweed_raw[local_i], year))
            seals_28_sections[4].append(all_math[global_i] if global_i < len(all_math) else "")
            seals_28_sections[5].append(extract_age_level_from_book(all_sports_raw[local_i], year))
            seals_28_sections[6].append(all_science[global_i] if global_i < len(all_science) else "")
            seals_28_sections[7].append(all_adab[global_i] if global_i < len(all_adab) else "")

        structured_dir = RAYHANA_ROOT_DIR / f"y{year}_c{cycle_num}_structured"
        structured_dir.mkdir(parents=True, exist_ok=True)
        for s_id in range(1, 8):
            with open(structured_dir / f"seal_{s_id}_28_units.json", "w", encoding="utf-8") as f:
                json.dump(seals_28_sections[s_id], f, ensure_ascii=False, indent=2)

        # المهمة 3: تشكيل وتنسيق الدروس وصناعة الأسئلة السبعة عبر علي AI
        self.log("[المهمة 3] تشكيل الدروس وتوليد الأسئلة السبعة عبر علي AI")
        ali_available = self.ensure_ali_running()
        if not ali_available:
            self.log("تنبيه: علي AI غير متصل، سيتم التنظيم المحلي الآمن دون تعطيل الدروس")

        formatted_by_seal: dict[int, list[dict]] = {s: [] for s in range(1, 8)}
        total_ops = 7 * 28
        done_ops = 0

        for s_id in range(1, 8):
            if self.stop_flag:
                break
            for local_i in range(28):
                if self.stop_flag:
                    break
                abjad_char = STRICT_ABJAD_LETTERS[local_i]
                done_ops += 1
                self._update_progress_ui(
                    done_ops,
                    total_ops,
                    f"المهمة 3: الختم {SEALS_META[s_id]} — حرف {abjad_char} ({local_i + 1}/28)"
                )
                raw_sec = seals_28_sections[s_id][local_i]
                lesson_obj = self.task3_build_seal_slides_and_quizzes(
                    year=year,
                    cycle_num=cycle_num,
                    abjad_char=abjad_char,
                    seal_id=s_id,
                    seal_title=SEALS_META[s_id],
                    raw_source_text=raw_sec,
                    ali_available=ali_available,
                )
                formatted_by_seal[s_id].append(lesson_obj)
                self.log(f"✔ ختم {s_id} ({SEALS_META[s_id]}) — حرف {abjad_char} (درس + 7 أنواع أسئلة)")

        if self.stop_flag:
            return

        # المهمة 4: التجميع العرضي حسب الحروف عبر الأختام السبعة
        self.log("[المهمة 4] تجميع الأختام السبعة معاً لكل حرف من الحروف الـ 28")
        grouped_by_letter: dict[str, dict[str, dict]] = {}
        for local_i in range(28):
            global_week_num = cycle_start_idx + local_i + 1
            w_key = str(global_week_num)
            grouped_by_letter[w_key] = {}
            for s_id in range(1, 8):
                grouped_by_letter[w_key][str(s_id)] = formatted_by_seal[s_id][local_i]

        # المهمة 5: الحقن النهائي في ملفات الدورة المستقلة
        self.log(f"[المهمة 5] حقن الدورة {cycle_num} في ملفات curriculum-y{year}-c{cycle_num}")
        json_out_path = out_dir / f"curriculum-y{year}-c{cycle_num}.json"
        js_out_path = out_dir / f"curriculum-y{year}-c{cycle_num}.js"

        with open(json_out_path, "w", encoding="utf-8") as f:
            json.dump({str(year): grouped_by_letter}, f, ensure_ascii=False, indent=2)

        js_content = (
            "window.curriculumData = window.curriculumData || {};\n"
            f"window.curriculumData[{year}] = window.curriculumData[{year}] || {{}};\n"
            f"Object.assign(window.curriculumData[{year}], "
            + json.dumps(grouped_by_letter, ensure_ascii=False, indent=2)
            + ");\n"
        )
        with open(js_out_path, "w", encoding="utf-8") as f:
            f.write(js_content)

        self.after(0, lambda: self._on_pipeline_finished(year, cycle_num, json_out_path, js_out_path))

    def _update_progress_ui(self, done: int, total: int, status_txt: str):
        ratio = max(0.0, min(1.0, done / max(1, total)))
        def _upd():
            self.progress_bar.set(ratio)
            self.lbl_progress.configure(text=f"{done} / {total}")
            self.lbl_status.configure(text=status_txt, text_color="#059669")
        self.after(0, _upd)

    def _on_pipeline_finished(self, year: int, cycle_num: int, json_path: Path, js_path: Path):
        self.is_running = False
        self.btn_start.configure(state="normal")
        self.btn_stop.configure(state="disabled")
        self.lbl_status.configure(text="✔ اكتملت المهام الخمس", text_color="#2E7D32")
        self.log(f"✔ ملف الجيسون للدورة {cycle_num}: {json_path}")
        self.log(f"✔ ملف الجافاسكريبت المحقون للستيج 2: {js_path}")
        messagebox.showinfo(
            "اكتملت ريحانة",
            f"تم تنفيذ المهام الخمس للسنة {year} — الدورة {cycle_num}\n\n"
            f"ملف الستيج 2:\n{js_path}\n\nملف الجيسون:\n{json_path}"
        )


if __name__ == "__main__":
    hide_console_window()
    app = RayhanaApp()
    app.mainloop()