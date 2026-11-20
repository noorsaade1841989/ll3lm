import os
import re
import sys
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
ALI_MODEL_API = "http://localhost:5001/api/v1/model"
DEFAULT_STAGE2_DIR = Path.home() / "Desktop" / "ll3lm"
RAYHANA_ROOT_DIR = Path.home() / "Desktop" / "ريحانة"

STRICT_ABJAD_LETTERS = [
    "أ", "ب", "ج", "د", "هـ", "و", "ز", "ح",
    "ط", "ي", "ك", "ل", "م", "ن", "س", "ع",
    "ف", "ص", "ق", "ر", "ش", "ت", "ث", "خ",
    "ذ", "ض", "ظ", "غ"
]

STRICT_ABJAD_NUMBERS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50,
    60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
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
    تنقية النص وترتيبه في نقاط واضحة ومقروءة:
    - إزالة الأقواس والشرطات المائلة والرموز المعيقة للقارئ الآلي
    - إزالة الأرقام أو تحويل الأرقام المفردة إلى كلمات عربية واضحة
    - فصل النقاط بأسطر نظيفة لتكون سهلة القراءة والتصفح تحت السلايدات
    """
    if not raw_text:
        return ""

    txt = str(raw_text)
    txt = re.sub(r"<br\s*/?>", "\n", txt, flags=re.IGNORECASE)
    txt = re.sub(r"<[^>]+>", " ", txt)

    # تحويل بعض الأرقام المفردة الواضحة إلى حروف أو إزالة الأرقام
    def _num_repl(m):
        tok = m.group(0)
        return ARABIC_DIGITS_MAP.get(tok, "")

    txt = re.sub(r"\b(?:10|١٠|[0-9٠-٩])\b", _num_repl, txt)
    txt = re.sub(r"[0-9٠-٩]+", " ", txt)

    # إزالة الأقواس والشرطات المائلة والرموز المزعجة للقارئ الآلي
    txt = re.sub(r"[()\[\]{}«»\"'\\/\\|•●◆▪■★☆✳❖•·=×÷+<>@#%^&*_~`]+", " ", txt)
    txt = re.sub(r"[:؛،,.\-–—!؟?]+", " ", txt)

    # ترتيب الأسطر كنقاط صافية بدون علامات ترقيم معيقة
    lines = []
    for ln in txt.splitlines():
        clean_ln = re.sub(r"\s+", " ", ln).strip()
        if len(clean_ln) >= 2:
            lines.append(clean_ln)

    if not lines:
        return ""

    # دمج الكلمات الزائدة وترتيب النقاط بوضوح
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
    """فهرسة قرآن.txt بصيغة سورة|آية|نص"""
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
    """
    يستخرج الشواهد القرآنية المرتبطة بدرس المنطق فقط لخدمة البرهان المنطقي
    """
    if not logic_chunk or not quran_index:
        return ""
    found_ayat: list[str] = []
    # البحث عن أنماط مثل (111: 1–5) أو (63: 1-6) أو (1: 1)
    for m in re.finditer(r"\((\d+)\s*:\s*(\d+)(?:\s*[\-–—]\s*(\d+))?\)", logic_chunk):
        surah = int(m.group(1))
        start_a = int(m.group(2))
        end_a = int(m.group(3)) if m.group(3) else start_a
        for a in range(start_a, min(end_a + 1, start_a + 25)):
            aya_txt = quran_index.get((surah, a))
            if aya_txt and aya_txt not in found_ayat:
                found_ayat.append(aya_txt)
    return " ".join(found_ayat[:6])


def split_book_into_units(text: str, total_units: int, book_kind: str = "generic") -> list[str]:
    """
    تقسيم النص إلى وحدات متوازنة بعدد وحدات السنة المطلوبة
    """
    if not text or not text.strip():
        return ["" for _ in range(total_units)]

    clean_t = text.strip()

    # تقسيم دروس كتاب المنطق حسب السطر التمهيدي أو "درس رقم"
    if book_kind == "logic":
        lesson_matches = list(re.finditer(r"(?m)^[•\-\*]?\s*درس\s+[\d٠-٩]+\s*[—\-–:].+$", clean_t))
        if len(lesson_matches) >= 4:
            chunks = []
            for i, m in enumerate(lesson_matches):
                s = m.start()
                e = lesson_matches[i + 1].start() if i + 1 < len(lesson_matches) else len(clean_t)
                chunks.append(clean_t[s:e].strip())
            return _fit_chunks_to_count(chunks, total_units)

    # تقسيم الدروس المرقمة بالحروف أو الوحدات أو الدروس
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

    # تقسيم متوازن على الفقرات أو الجمل
    paras = [p.strip() for p in re.split(r"\n\s*\n", clean_t) if len(p.strip()) > 15]
    if len(paras) < total_units:
        sents = [s.strip() for s in re.split(r"[.،؛\n]+", clean_t) if len(s.strip()) > 12]
        if sents:
            paras = sents
    return _fit_chunks_to_count(paras if paras else [clean_t], total_units)


def _fit_chunks_to_count(chunks: list[str], target_count: int) -> list[str]:
    """ضبط قائمة المقاطع لتطابق عدد الوحدات المطلوب دون نقص أو زيادة"""
    if target_count <= 0:
        return []
    if not chunks:
        return ["" for _ in range(target_count)]

    if len(chunks) == target_count:
        return chunks

    if len(chunks) > target_count:
        # تجميع متوازن للمقاطع الزائدة ضمن كل وحدة
        result: list[str] = []
        n = len(chunks)
        for i in range(target_count):
            start = (i * n) // target_count
            end = ((i + 1) * n) // target_count
            result.append("\n".join(chunks[start:end]).strip())
        return result

    # إذا كانت المقاطع أقل من المطلوب، نعيد توزيعها بتصاعد عمري/دوري
    result = []
    for i in range(target_count):
        base_chunk = chunks[i % len(chunks)]
        cycle_idx = (i // 28) + 1
        if cycle_idx > 1:
            result.append(f"{base_chunk}\nتوسيع الفهم في الدورة {cycle_idx}")
        else:
            result.append(base_chunk)
    return result


def extract_age_level_from_book(chunk_text: str, age_year: int) -> str:
    """
    يستخرج المستوى المطابق لعمر الطالب (8 إلى 14) من الكتب ذات المستويات العمرية (كالرياضة والتجويد)
    """
    if not chunk_text:
        return ""
    level_num = max(1, min(7, age_year - 7))
    # البحث عن سطر المستوى المطابق
    pat = re.compile(rf"(?m)^[•\-\*]?\s*المستوى\s*{level_num}\b[^\n]*")
    m = pat.search(chunk_text)
    if m:
        # أخذ التأصيل الأول + المستوى المطابق
        first_lines = []
        for ln in chunk_text.splitlines()[:3]:
            if not re.match(r"^[•\-\*]?\s*(الهدف|المستوى)", ln.strip()):
                first_lines.append(ln.strip())
        return "\n".join(first_lines + [m.group(0).strip()]).strip()
    return chunk_text


class RayhanaApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("ريحانة — مولّد مناهج مرحلة عبد (الربط مع علي AI)")
        self._center_window(0.84, 0.86, min_w=1020, min_h=640)

        RAYHANA_ROOT_DIR.mkdir(parents=True, exist_ok=True)
        DEFAULT_STAGE2_DIR.mkdir(parents=True, exist_ok=True)

        self.is_running = False
        self.stop_flag = False
        self.quran_index: dict[tuple[int, int], str] = {}

        # مسارات الكتب الثمانية
        self.book_paths: dict[str, ctk.StringVar] = {
            "logic": ctk.StringVar(value=""),
            "quran": ctk.StringVar(value=""),
            "tajweed": ctk.StringVar(value=""),
            "sports": ctk.StringVar(value=""),
            "bayan": ctk.StringVar(value=""),
            "math": ctk.StringVar(value=""),
            "science": ctk.StringVar(value=""),
            "adab": ctk.StringVar(value=""),
        }

        self.year_var = ctk.StringVar(value="8")
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
        """التقاط تلقائي لملفات الكتب إن وُجدت بنفس الأسماء المعروفة"""
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

        # الشريط العلوي: السنة (8-14) + مسار الحقن + أزرار التشغيل والإيقاف
        top_bar = ctk.CTkFrame(self, corner_radius=8)
        top_bar.grid(row=0, column=0, padx=10, pady=(10, 6), sticky="ew")

        ctk.CTkLabel(
            top_bar, text="سنة مرحلة عبد:", font=(FONT_FAMILY, 13, "bold")
        ).pack(side="right", padx=(8, 4), pady=8)

        self.opt_year = ctk.CTkOptionMenu(
            top_bar,
            values=["8", "9", "10", "11", "12", "13", "14"],
            variable=self.year_var,
            font=(FONT_FAMILY, 13, "bold"),
            width=80,
            height=34,
        )
        self.opt_year.pack(side="right", padx=4, pady=8)

        ctk.CTkLabel(
            top_bar, text="مجلد الستيج 2:", font=(FONT_FAMILY, 12, "bold")
        ).pack(side="right", padx=(10, 4), pady=8)

        ctk.CTkEntry(
            top_bar, textvariable=self.output_dir_var, font=(FONT_FAMILY, 11), width=260, height=32
        ).pack(side="right", padx=4, pady=8)

        ctk.CTkButton(
            top_bar, text="📁 اختر", font=(FONT_FAMILY, 12, "bold"),
            width=68, height=32, command=self.pick_output_dir
        ).pack(side="right", padx=2, pady=8)

        self.btn_start = ctk.CTkButton(
            top_bar, text="▶ توليد الجيسون مع علي AI", font=(FONT_FAMILY, 13, "bold"),
            fg_color="#059669", hover_color="#047857",
            height=36, command=self.start_generation
        )
        self.btn_start.pack(side="left", padx=4, pady=8)

        self.btn_stop = ctk.CTkButton(
            top_bar, text="⏹ إيقاف", font=(FONT_FAMILY, 13, "bold"),
            fg_color="#C62828", hover_color="#8E0000",
            width=80, height=36, state="disabled", command=self.stop_generation
        )
        self.btn_stop.pack(side="left", padx=4, pady=8)

        self.lbl_status = ctk.CTkLabel(
            top_bar, text="جاهز", font=(FONT_FAMILY, 12, "bold"), text_color="#2E7D32"
        )
        self.lbl_status.pack(side="left", padx=10)

        # الجسم الرئيسي: يمين الكتب الثمانية — يسار سجل التوليد والمعاينة
        body = ctk.CTkFrame(self, fg_color="transparent")
        body.grid(row=1, column=0, padx=10, pady=(0, 10), sticky="nsew")
        body.grid_columnconfigure(0, weight=3)
        body.grid_columnconfigure(1, weight=2)
        body.grid_rowconfigure(0, weight=1)

        books_panel = ctk.CTkFrame(body, corner_radius=8)
        books_panel.grid(row=0, column=1, padx=(6, 0), pady=0, sticky="nsew")
        books_panel.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(
            books_panel, text="📚 الكتب المرجعية (المنطق يستند إلى القرآن)",
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
            log_panel, text="📝 سجل التوليد والنقاط تحت السلايدات",
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
        """التحقق من تشغيل علي AI (Qwen 3 المحلي) أو محاولة تشغيله"""
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
        """إرسال طلب إلى علي AI واستخراج كائن JSON من الرد"""
        url = self.ali_url_var.get().strip() or ALI_AI_URL
        payload = {
            "messages": [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            "temperature": 0.45,
            "max_tokens": 1800,
        }
        try:
            resp = requests.post(url, json=payload, timeout=180)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()
            content = re.sub(r"^```(?:json)?\s*", "", content, flags=re.IGNORECASE)
            content = re.sub(r"\s*```$", "", content).strip()
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return json.loads(content)
        except Exception:
            return None

    def build_seal_lesson_with_ali(
        self,
        year: int,
        cycle_num: int,
        global_week: int,
        abjad_char: str,
        seal_id: int,
        seal_title: str,
        raw_source_text: str,
    ) -> dict:
        """
        يولّد محتوى الختم بنقاط واضحة تحت السلايدات ثم يشتق الأسئلة من نص السلايدات نفسه
        """
        clean_source = clean_plain_label(raw_source_text)[:1400]

        # 1. توليد الشرائح بنقاط مقروءة وخالية من الأرقام والأقواس والسلاش للقارئ الآلي
        sys_slides = (
            "أنت معلم ومصمم مناهج لمرحلة عبد (الأعمار 8 إلى 14 سنة). "
            "رتب المادة التعليمية في نقاط واضحة ومقروءة أسفل السلايدات. "
            "قواعد صارمة للقارئ الآلي: "
            "ممنوع كتابة أرقام. ممنوع كتابة أقواس. ممنوع كتابة شرطة مائلة أو سلاش. "
            "ممنوع كتابة فواصل أو نقطتين أو رموز غريبة. "
            "اكتب كل نقطة في سطر مستقل واضح ومباشر. "
            "أعد النتيجة بصيغة JSON فقط بالمفاتيح التالية: "
            '{"introTitle": "...", "introGoal": "...", "slides_points": ["نقطة أولى", "نقطة ثانية"], "apply_steps": ["خطوة عملية"]}'
        )
        user_slides = (
            f"السنة {year} الدورة {cycle_num} الحرف {abjad_char} الختم {seal_title}\n"
            f"المادة المصدر\n{clean_source}"
        )

        data = self.call_ali_json(sys_slides, user_slides)

        if isinstance(data, dict) and isinstance(data.get("slides_points"), list) and data["slides_points"]:
            intro_title = sanitize_for_tts_and_points(data.get("introTitle", "")) or clean_plain_label(f"درس {seal_title}")
            intro_goal = sanitize_for_tts_and_points(data.get("introGoal", "")) or clean_plain_label(f"فهم {seal_title} وتطبيقه")
            slide_points = [sanitize_for_tts_and_points(p) for p in data["slides_points"] if sanitize_for_tts_and_points(p)]
            apply_steps = [sanitize_for_tts_and_points(s) for s in (data.get("apply_steps") or []) if sanitize_for_tts_and_points(s)]
        else:
            intro_title = clean_plain_label(f"درس {seal_title}")
            intro_goal = clean_plain_label(f"تطبيق {seal_title}")
            slide_points = [sanitize_for_tts_and_points(clean_source)]
            apply_steps = [sanitize_for_tts_and_points(f"أطبق ما تعلمته في {seal_title}")]

        if not slide_points:
            slide_points = [clean_plain_label(f"هذا درس {seal_title} قيد التحضير")]
        if not apply_steps:
            apply_steps = [clean_plain_label(f"أراجع نقاط {seal_title} وأعمل بها")]

        joined_slide_text = "\n".join(slide_points)

        # 2. توليد الأسئلة والمطابقات وسلة الألماسة من نص السلايدات فقط
        sys_quiz = (
            "أنت واضع أسئلة تعليمية بناءً حصراً على نص السلايدات المرفق دون إضافة معلومات خارجية. "
            "ممنوع الأرقام والأقواس والسلاش في النصوص. "
            "أعد JSON فقط بالشكل التالي: "
            '{"questions":[{"q":"...","options":[{"text":"...","correct":true},{"text":"...","correct":false}]}],'
            '"sadaqahPairs":[{"right":"...","left":"..."}],'
            '"sadaqahDecoy":"...",'
            '"giftBasket":{"prompt":"...","targetCount":1,"items":[{"emoji":"📘","label":"...","good":true},{"emoji":"🚫","label":"...","good":false}]}}'
        )
        user_quiz = f"نص السلايدات\n{joined_slide_text}"
        quiz_data = self.call_ali_json(sys_quiz, user_quiz)

        questions = []
        sadaqah_pairs = []
        sadaqah_decoy = ""
        gift_basket = None

        if isinstance(quiz_data, dict):
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
                    questions.append({"q": q_txt, "focusWord": "", "options": opts})

            for p_item in (quiz_data.get("sadaqahPairs") or [])[:3]:
                r_txt = sanitize_for_tts_and_points(p_item.get("right", ""))
                l_txt = sanitize_for_tts_and_points(p_item.get("left", ""))
                if r_txt and l_txt:
                    sadaqah_pairs.append({"right": r_txt, "left": l_txt})

            sadaqah_decoy = sanitize_for_tts_and_points(quiz_data.get("sadaqahDecoy", ""))

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
                            "emoji": it.get("emoji") or "📘",
                            "label": lbl,
                            "good": is_g,
                        })
                if g_prompt and good_cnt >= 1 and len(g_items) >= 2:
                    gift_basket = {
                        "prompt": g_prompt,
                        "targetCount": min(good_cnt, 3),
                        "items": g_items,
                    }

        # بدائل مشتقة مباشرة من نقاط السلايدات إن لم يعد النموذج صيغة كاملة
        first_pt = slide_points[0]
        second_pt = slide_points[1] if len(slide_points) > 1 else first_pt

        if not questions:
            questions = [
                {
                    "q": f"ما الفكرة الواردة في درس {seal_title}",
                    "focusWord": "",
                    "options": [
                        {"text": first_pt, "correct": True},
                        {"text": clean_plain_label(f"هذا درس {seal_title} قيد التحضير"), "correct": False},
                    ],
                }
            ]

        if not sadaqah_pairs:
            sadaqah_pairs = [{"right": intro_title, "left": first_pt}]
        if not sadaqah_decoy:
            sadaqah_decoy = clean_plain_label("غير وارد في الشريحة")

        if not gift_basket:
            gift_basket = {
                "prompt": f"اختر العبارة الصحيحة من درس {seal_title}",
                "targetCount": 1,
                "items": [
                    {"emoji": "📘", "label": second_pt, "good": True},
                    {"emoji": "🚫", "label": sadaqah_decoy, "good": False},
                ],
            }

        slides_out = []
        for idx_p, pt in enumerate(slide_points):
            slides_out.append({
                "img": "",
                "text": pt,
                "labData": True if idx_p == 0 and seal_id in (2, 3, 4, 5, 6) else False,
            })

        return {
            "learn": {
                "introTitle": intro_title,
                "introGoal": intro_goal,
                "slides": slides_out,
            },
            "play": {
                "questions": questions,
                "sadaqahPairs": sadaqah_pairs,
                "sadaqahDecoy": sadaqah_decoy,
                "giftBasket": gift_basket,
            },
            "apply": {
                "steps": apply_steps,
            },
        }

    def start_generation(self):
        if self.is_running:
            return

        year = int(self.year_var.get())
        out_dir = Path(self.output_dir_var.get().strip() or str(DEFAULT_STAGE2_DIR))
        out_dir.mkdir(parents=True, exist_ok=True)

        self.is_running = True
        self.stop_flag = False
        self.btn_start.configure(state="disabled")
        self.btn_stop.configure(state="normal")
        self.txt_log.delete("1.0", "end")

        threading.Thread(target=self._run_pipeline, args=(year, out_dir), daemon=True).start()

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

    def _run_pipeline(self, year: int, out_dir: Path):
        cycles_count = max(1, min(7, year - 7))
        total_weeks = cycles_count * 28
        total_seals = total_weeks * 7

        self.log(f"بدء العمل للسنة {year} بعدد دورات {cycles_count} وإجمالي وحدات {total_weeks}")

        quran_raw = self._read_file_safe("quran")
        self.quran_index = parse_quran_index(quran_raw)

        logic_units = split_book_into_units(self._read_file_safe("logic"), total_weeks, "logic")
        bayan_units = split_book_into_units(self._read_file_safe("bayan"), total_weeks, "bayan")
        tajweed_raw_units = split_book_into_units(self._read_file_safe("tajweed"), 28, "tajweed")
        math_units = split_book_into_units(self._read_file_safe("math"), total_weeks, "math")
        sports_raw_units = split_book_into_units(self._read_file_safe("sports"), 28, "sports")
        science_units = split_book_into_units(self._read_file_safe("science"), total_weeks, "science")
        adab_units = split_book_into_units(self._read_file_safe("adab"), total_weeks, "adab")

        # تحضير المستويات العمرية للختم الثالث (التجويد) والخامس (الرياضة)
        tajweed_units = [extract_age_level_from_book(u, year) for u in tajweed_raw_units]
        sports_units = [extract_age_level_from_book(u, year) for u in sports_raw_units]

        json_out_path = out_dir / f"curriculum-y{year}.json"
        js_out_path = out_dir / f"curriculum-y{year}.js"

        curriculum_year_dict: dict[str, dict[str, dict]] = {}
        if json_out_path.exists():
            try:
                with open(json_out_path, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                if isinstance(loaded, dict) and str(year) in loaded and isinstance(loaded[str(year)], dict):
                    curriculum_year_dict = loaded[str(year)]
                    self.log("تم استئناف التقدم السابق من ملف الجيسون")
            except Exception:
                pass

        ali_available = self.ensure_ali_running()
        if not ali_available:
            self.log("تنبيه: لم يتم الوصول إلى علي AI المحلي وسيتم استخدام التنظيم المحلي المباشر")

        completed_steps = 0
        for w in range(1, total_weeks + 1):
            if self.stop_flag:
                break

            w_key = str(w)
            curriculum_year_dict.setdefault(w_key, {})
            cycle_num = ((w - 1) // 28) + 1
            abjad_idx = (w - 1) % 28
            abjad_char = STRICT_ABJAD_LETTERS[abjad_idx]

            for s in range(1, 8):
                if self.stop_flag:
                    break

                s_key = str(s)
                completed_steps += 1

                if s_key in curriculum_year_dict[w_key] and curriculum_year_dict[w_key][s_key]:
                    self._update_progress_ui(completed_steps, total_seals, f"الوحدة {w} الختم {s} محفوظ")
                    continue

                # تحديد مادة الختم: الختم 1 يأخذ المنطق ويستعين بالقرآن
                if s == 1:
                    base_logic = logic_units[w - 1]
                    ayat_support = extract_quran_ayat_for_logic_lesson(base_logic, self.quran_index)
                    src_txt = f"{base_logic}\n{ayat_support}".strip()
                elif s == 2:
                    src_txt = bayan_units[w - 1]
                elif s == 3:
                    src_txt = tajweed_units[abjad_idx]
                elif s == 4:
                    src_txt = math_units[w - 1]
                elif s == 5:
                    src_txt = sports_units[abjad_idx]
                elif s == 6:
                    src_txt = science_units[w - 1]
                else:
                    src_txt = adab_units[w - 1]

                self._update_progress_ui(
                    completed_steps,
                    total_seals,
                    f"توليد الوحدة {w} حرف {abjad_char} الختم {SEALS_META[s]}"
                )

                if src_txt.strip() and ali_available:
                    lesson_obj = self.build_seal_lesson_with_ali(
                        year=year,
                        cycle_num=cycle_num,
                        global_week=w,
                        abjad_char=abjad_char,
                        seal_id=s,
                        seal_title=SEALS_META[s],
                        raw_source_text=src_txt,
                    )
                elif src_txt.strip():
                    cleaned_pts = [
                        pt for pt in sanitize_for_tts_and_points(src_txt).splitlines() if pt.strip()
                    ] or [f"هذا درس {SEALS_META[s]} قيد التحضير"]
                    lesson_obj = {
                        "learn": {
                            "introTitle": f"درس {SEALS_META[s]}",
                            "introGoal": f"فهم وتطبيق {SEALS_META[s]}",
                            "slides": [
                                {
                                    "img": "",
                                    "text": pt,
                                    "labData": True if i == 0 and s in (2, 3, 4, 5, 6) else False,
                                }
                                for i, pt in enumerate(cleaned_pts[:4])
                            ],
                        },
                        "play": {
                            "questions": [
                                {
                                    "q": f"ما الفكرة الواردة في درس {SEALS_META[s]}",
                                    "focusWord": "",
                                    "options": [
                                        {"text": cleaned_pts[0], "correct": True},
                                        {"text": f"هذا درس {SEALS_META[s]} قيد التحضير", "correct": False},
                                    ],
                                }
                            ],
                            "sadaqahPairs": [{"right": SEALS_META[s], "left": cleaned_pts[0]}],
                            "sadaqahDecoy": "خيار غير مطابق",
                            "giftBasket": {
                                "prompt": f"اختر العبارة الصحيحة من درس {SEALS_META[s]}",
                                "targetCount": 1,
                                "items": [
                                    {"emoji": "📘", "label": cleaned_pts[0], "good": True},
                                    {"emoji": "🚫", "label": "خيار غير مطابق", "good": False},
                                ],
                            },
                        },
                        "apply": {
                            "steps": [cleaned_pts[0]]
                        },
                    }
                else:
                    prep_msg = f"هذا درس {SEALS_META[s]} قيد التحضير"
                    lesson_obj = {
                        "learn": {
                            "introTitle": prep_msg,
                            "introGoal": prep_msg,
                            "slides": [{"img": "", "text": prep_msg, "labData": False}],
                        },
                        "play": {
                            "questions": [
                                {
                                    "q": prep_msg,
                                    "focusWord": "",
                                    "options": [
                                        {"text": prep_msg, "correct": True},
                                        {"text": "بانتظار التحضير", "correct": False},
                                    ],
                                }
                            ],
                            "sadaqahPairs": [],
                            "sadaqahDecoy": "",
                            "giftBasket": {
                                "prompt": prep_msg,
                                "targetCount": 1,
                                "items": [{"emoji": "📘", "label": prep_msg, "good": True}],
                            },
                        },
                        "apply": {"steps": [prep_msg]},
                    }

                curriculum_year_dict[w_key][s_key] = lesson_obj
                self._write_outputs(year, curriculum_year_dict, json_out_path, js_out_path)
                self.log(f"✔ الوحدة {w} ({abjad_char}) — {SEALS_META[s]}")

        self.after(0, lambda: self._on_pipeline_finished(year, json_out_path, js_out_path))

    def _write_outputs(self, year: int, year_dict: dict, json_path: Path, js_path: Path):
        """كتابة ملف الجيسون وملف الجافاسكريبت المحقون في الستيج 2"""
        full_payload = {str(year): year_dict}
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(full_payload, f, ensure_ascii=False, indent=2)

        js_content = (
            "window.curriculumData = window.curriculumData || {};\n"
            f"window.curriculumData[{year}] = "
            + json.dumps(year_dict, ensure_ascii=False, indent=2)
            + ";\n"
        )
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(js_content)

    def _update_progress_ui(self, done: int, total: int, status_txt: str):
        ratio = max(0.0, min(1.0, done / max(1, total)))
        def _upd():
            self.progress_bar.set(ratio)
            self.lbl_progress.configure(text=f"{done} / {total}")
            self.lbl_status.configure(text=status_txt, text_color="#059669")
        self.after(0, _upd)

    def _on_pipeline_finished(self, year: int, json_path: Path, js_path: Path):
        self.is_running = False
        self.btn_start.configure(state="normal")
        self.btn_stop.configure(state="disabled")
        self.lbl_status.configure(text="✔ اكتمل التوليد والحقن", text_color="#2E7D32")
        self.log(f"تم حفظ ملف الجيسون: {json_path}")
        self.log(f"تم حقن ملف المنهج للستيج 2: {js_path}")
        if not self.stop_flag:
            messagebox.showinfo(
                "اكتملت ريحانة",
                f"تم توليد ملف المنهج للسنة {year} وحقنه في:\n{js_path}\n\nوملف الجيسون:\n{json_path}"
            )


if __name__ == "__main__":
    hide_console_window()
    app = RayhanaApp()
    app.mainloop()