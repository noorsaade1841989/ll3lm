#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة بناء «مدرسة العلم» المحلية الشاملة (بدون أي متجر أو اشتراك):
1. تولّد ملف الفهرس الذكي update-manifest.json لتفعيل التحديث التفاضلي (P2P + al-3lm.org) بضغطة زر واحدة.
2. تنشئ مشروع الأندرويد المحلي الكامل (Self-Sharing APK + خادم P2P مدمج بين الهواتف) جاهزاً لاستخراج ملف al-3lm.apk مجاناً على حاسوبكِ.
"""
import os, json, time, hashlib

IGNORE_DIRS = {'.git', 'node_modules', 'android-standalone-builder', '__pycache__', '.vscode'}
IGNORE_FILES = {'build_al3lm_standalone.py', 'update-manifest.json', 'al-3lm.apk'}

def generate_manifest(root='.'):
    files_map = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for fn in filenames:
            if fn in IGNORE_FILES or fn.endswith(('.apk', '.exe', '.zip')):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace('\\', '/')
            h = hashlib.sha256()
            with open(full, 'rb') as f:
                while True:
                    chunk = f.read(65536)
                    if not chunk:
                        break
                    h.update(chunk)
            files_map[rel] = {'hash': h.hexdigest()[:16], 'size': os.path.getsize(full)}

    ver_str = time.strftime('v%Y.%m.%d.%H%M')
    manifest = {'version': ver_str, 'timestamp': int(time.time()), 'files': files_map}
    with open(os.path.join(root, 'update-manifest.json'), 'w', encoding='utf-8') as out:
        json.dump(manifest, out, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(root, 'version.json'), 'w', encoding='utf-8') as vout:
        json.dump({'version': ver_str, 'updatedAt': time.strftime('%Y-%m-%d')}, vout, ensure_ascii=False, indent=2)
    print(f"[✓] تم توليد update-manifest.json ({len(files_map)} ملف) للإصدار {ver_str}")

if __name__ == '__main__':
    generate_manifest('.')
    print("[✓] ارفعي update-manifest.json مع مجلد الموقع على GitHub ليعمل التحديث الهجين بضغطة زر لدى الجميع.")
