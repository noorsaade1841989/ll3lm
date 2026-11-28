#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة البناء المحلي الشامل لمنصة «مدرسة العلم» (بدون أي متجر أو اشتراك خارجي):
١. تولّد فهرس التحديث الذكي (update-manifest.json) قبل كل رفع على GitHub ليعمل التحديث بضغطة زر.
٢. تجهّز وتبني حزمة الأندرويد المستقلة (al-3lm.apk) المزودة بميزة إرسال نفسها عبر البلوتوث وواتساب + بث التحديثات P2P.
٣. تبني ملف الحاسوب المستقل (Al3lm_Local_App.exe) للتشغيل بضغطة واحدة على Windows.
"""
import os
import sys
import json
import time
import shutil
import hashlib
import subprocess

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
IGNORE_DIRS = {'.git', 'node_modules', 'android-standalone-build', '.al3lm_local_updates', 'dist', 'build', '__pycache__'}
IGNORE_FILES = {
    'build_al3lm_local_apps.py',
    'بناء_التطبيق_المستقل_APK_EXE.bat',
    'update-manifest.json',
    'al-3lm.apk',
    'Al3lm_Local_App.exe'
}


def step1_generate_manifest():
    files_map = {}
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for fn in filenames:
            if fn in IGNORE_FILES or fn.endswith(('.apk', '.exe', '.spec')):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT_DIR).replace('\\', '/')
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
    with open(os.path.join(ROOT_DIR, 'update-manifest.json'), 'w', encoding='utf-8') as out:
        json.dump(manifest, out, ensure_ascii=False, separators=(',', ':'))

    with open(os.path.join(ROOT_DIR, 'version.json'), 'w', encoding='utf-8') as vout:
        json.dump({'version': ver_str, 'updatedAt': time.strftime('%Y-%m-%d')}, vout, ensure_ascii=False, indent=2)

    print(f'[1/3] تم توليد update-manifest.json و version.json بنجاح ({len(files_map)} ملف — الإصدار {ver_str}).')
    return ver_str


JAVA_BRIDGE_CODE = r"""package org.al3lm.school;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import androidx.core.content.FileProvider;
import org.json.JSONArray;
import java.io.*;
import java.net.*;
import java.util.*;

public class Al3lmNativeBridge {
    private final Context ctx;
    private final File relayRoot;

    public Al3lmNativeBridge(Context context) {
        this.ctx = context;
        this.relayRoot = new File(context.getFilesDir(), "mesh_relay");
        if (!this.relayRoot.exists()) this.relayRoot.mkdirs();
        startLocalPeerHttpServer();
        startUdpDiscoveryResponder();
    }

    // إرسال ملف التطبيق المثبّت نفسه (APK) عبر البلوتوث أو واتساب أو الشير لأي صديق!
    @JavascriptInterface
    public void shareInstalledApk() {
        try {
            File srcApk = new File(ctx.getApplicationInfo().sourceDir);
            File shareDir = new File(ctx.getCacheDir(), "shared_apk");
            if (!shareDir.exists()) shareDir.mkdirs();
            File outApk = new File(shareDir, "al-3lm.apk");
            if (!outApk.exists() || outApk.length() != srcApk.length()) {
                try (InputStream in = new FileInputStream(srcApk);
                     OutputStream out = new FileOutputStream(outApk)) {
                    byte[] buf = new byte[65536];
                    int len;
                    while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
                }
            }
            Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".fileprovider", outApk);
            Intent sendIntent = new Intent(Intent.ACTION_SEND);
            sendIntent.setType("application/vnd.android.package-archive");
            sendIntent.putExtra(Intent.EXTRA_STREAM, uri);
            sendIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            Intent chooser = Intent.createChooser(sendIntent, "إرسال تطبيق مدرسة العلم لصديق");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(chooser);
        } catch (Exception ignored) {}
    }

    // اكتشاف الهواتف أو الحواسيب المحدّثة في نفس الشبكة المحلية (بدون إنترنت)
    @JavascriptInterface
    public String discoverPeerUpdateServersJson() {
        JSONArray arr = new JSONArray();
        try (DatagramSocket sock = new DatagramSocket()) {
            sock.setBroadcast(true);
            sock.setSoTimeout(1200);
            byte[] msg = "AL3LM_DISCOVER".getBytes("UTF-8");
            sock.send(new DatagramPacket(msg, msg.length, InetAddress.getByName("255.255.255.255"), 8766));
            long end = System.currentTimeMillis() + 1200;
            Set<String> seen = new HashSet<>();
            while (System.currentTimeMillis() < end) {
                byte[] buf = new byte[128];
                DatagramPacket pkt = new DatagramPacket(buf, buf.length);
                sock.receive(pkt);
                String reply = new String(pkt.getData(), 0, pkt.getLength(), "UTF-8").trim();
                if (reply.startsWith("AL3LM_PEER_")) {
                    String port = reply.substring("AL3LM_PEER_".length());
                    String url = "http://" + pkt.getAddress().getHostAddress() + ":" + port;
                    if (seen.add(url)) arr.put(url);
                }
            }
        } catch (Exception ignored) {}
        return arr.toString();
    }

    @JavascriptInterface
    public void saveRelayFileBase64(String relPath, String b64) {
        try {
            String safe = relPath.replace("..", "").replaceFirst("^/+", "");
            File f = new File(relayRoot, safe);
            if (f.getParentFile() != null) f.getParentFile().mkdirs();
            try (FileOutputStream fos = new FileOutputStream(f)) {
                fos.write(Base64.decode(b64, Base64.DEFAULT));
            }
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public void saveRelayManifest(String jsonStr) {
        try {
            File f = new File(relayRoot, "update-manifest.json");
            try (FileOutputStream fos = new FileOutputStream(f)) {
                fos.write(jsonStr.getBytes("UTF-8"));
            }
        } catch (Exception ignored) {}
    }

    private void startLocalPeerHttpServer() {
        new Thread(() -> {
            try (ServerSocket server = new ServerSocket(8765)) {
                while (true) {
                    Socket client = server.accept();
                    new Thread(() -> servePeerFile(client)).start();
                }
            } catch (Exception ignored) {}
        }).start();
    }

    private void servePeerFile(Socket client) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
             OutputStream out = client.getOutputStream()) {
            String reqLine = in.readLine();
            if (reqLine == null || !reqLine.startsWith("GET ")) return;
            String rawPath = URLDecoder.decode(reqLine.split(" ")[1].split("\\?")[0], "UTF-8").replaceFirst("^/+", "");
            if (rawPath.isEmpty()) rawPath = "index.html";
            File ov = new File(relayRoot, rawPath);
            byte[] bytes = null;
            if (ov.exists() && ov.isFile()) {
                bytes = new byte[(int) ov.length()];
                try (FileInputStream fis = new FileInputStream(ov)) { fis.read(bytes); }
            } else {
                try (InputStream ais = ctx.getAssets().open("public/" + rawPath)) {
                    ByteArrayOutputStream bos = new ByteArrayOutputStream();
                    byte[] buf = new byte[16384];
                    int r;
                    while ((r = ais.read(buf)) != -1) bos.write(buf, 0, r);
                    bytes = bos.toByteArray();
                } catch (Exception ignored) {}
            }
            if (bytes == null) {
                out.write("HTTP/1.1 404 Not Found\r\nAccess-Control-Allow-Origin: *\r\n\r\n".getBytes());
                return;
            }
            String hdr = "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: " + bytes.length + "\r\n\r\n";
            out.write(hdr.getBytes());
            out.write(bytes);
        } catch (Exception ignored) {}
    }

    private void startUdpDiscoveryResponder() {
        new Thread(() -> {
            try (DatagramSocket sock = new DatagramSocket(8766)) {
                byte[] buf = new byte[128];
                while (true) {
                    DatagramPacket pkt = new DatagramPacket(buf, buf.length);
                    sock.receive(pkt);
                    String msg = new String(pkt.getData(), 0, pkt.getLength(), "UTF-8").trim();
                    if ("AL3LM_DISCOVER".equals(msg)) {
                        byte[] rep = "AL3LM_PEER_8765".getBytes("UTF-8");
                        sock.send(new DatagramPacket(rep, rep.length, pkt.getAddress(), pkt.getPort()));
                    }
                }
            } catch (Exception ignored) {}
        }).start();
    }
}
"""

MAIN_ACTIVITY_CODE = r"""package org.al3lm.school;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().addJavascriptInterface(
                new Al3lmNativeBridge(this.getApplicationContext()),
                "Al3lmNative"
            );
        }
    }
}
"""

FILE_PATHS_XML = r"""<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="shared_apk" path="shared_apk/" />
    <files-path name="mesh_relay" path="mesh_relay/" />
</paths>
"""


def step2_scaffold_and_build_apk():
    work_dir = os.path.join(ROOT_DIR, 'android-standalone-build')
    web_copy = os.path.join(work_dir, 'www')
    os.makedirs(web_copy, exist_ok=True)

    print('[2/3] جاري تحضير حزمة الأندرويد المستقلة (android-standalone-build)...')
    for item in os.listdir(ROOT_DIR):
        if item in IGNORE_DIRS or item in {'al-3lm.apk', 'Al3lm_Local_App.exe', 'build_al3lm_local_apps.py'}:
            continue
        src = os.path.join(ROOT_DIR, item)
        dst = os.path.join(web_copy, item)
        if os.path.isdir(src):
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)

    pkg_json = {
        "name": "al3lm-school-local",
        "version": "1.0.0",
        "private": True,
        "dependencies": {
            "@capacitor/core": "^6.0.0",
            "@capacitor/cli": "^6.0.0",
            "@capacitor/android": "^6.0.0"
        }
    }
    cap_cfg = {
        "appId": "org.al3lm.school",
        "appName": "مدرسة العلم",
        "webDir": "www",
        "bundledWebRuntime": False,
        "android": {"allowMixedContent": True}
    }
    with open(os.path.join(work_dir, 'package.json'), 'w', encoding='utf-8') as f:
        json.dump(pkg_json, f, indent=2)
    with open(os.path.join(work_dir, 'capacitor.config.json'), 'w', encoding='utf-8') as f:
        json.dump(cap_cfg, f, ensure_ascii=False, indent=2)

    # حفظ ملفات الجسر الأصلي للأندرويد جاهزة للحقن التلقائي
    patches_dir = os.path.join(work_dir, 'native-patches')
    os.makedirs(patches_dir, exist_ok=True)
    with open(os.path.join(patches_dir, 'Al3lmNativeBridge.java'), 'w', encoding='utf-8') as f:
        f.write(JAVA_BRIDGE_CODE)
    with open(os.path.join(patches_dir, 'MainActivity.java'), 'w', encoding='utf-8') as f:
        f.write(MAIN_ACTIVITY_CODE)
    with open(os.path.join(patches_dir, 'file_paths.xml'), 'w', encoding='utf-8') as f:
        f.write(FILE_PATHS_XML)

    if shutil.which('npm') is None:
        print('   [!] ملاحظة: ثبّتي Node.js و Android SDK على الحاسوب ثم أعيدي تشغيل هذا الملف ليخرج ملف al-3lm.apk تلقائياً.')
        return

    try:
        if not os.path.exists(os.path.join(work_dir, 'node_modules')):
            subprocess.run('npm install', cwd=work_dir, shell=True, check=True)
        if not os.path.exists(os.path.join(work_dir, 'android')):
            subprocess.run('npx cap add android', cwd=work_dir, shell=True, check=True)
        else:
            subprocess.run('npx cap copy android', cwd=work_dir, shell=True, check=True)

        java_pkg_dir = os.path.join(work_dir, 'android', 'app', 'src', 'main', 'java', 'org', 'al3lm', 'school')
        os.makedirs(java_pkg_dir, exist_ok=True)
        shutil.copy2(os.path.join(patches_dir, 'Al3lmNativeBridge.java'), os.path.join(java_pkg_dir, 'Al3lmNativeBridge.java'))
        shutil.copy2(os.path.join(patches_dir, 'MainActivity.java'), os.path.join(java_pkg_dir, 'MainActivity.java'))

        xml_dir = os.path.join(work_dir, 'android', 'app', 'src', 'main', 'res', 'xml')
        os.makedirs(xml_dir, exist_ok=True)
        shutil.copy2(os.path.join(patches_dir, 'file_paths.xml'), os.path.join(xml_dir, 'file_paths.xml'))

        gradlew = 'gradlew.bat' if os.name == 'nt' else './gradlew'
        android_dir = os.path.join(work_dir, 'android')
        subprocess.run(f'{gradlew} assembleDebug', cwd=android_dir, shell=True, check=True)
        built_apk = os.path.join(android_dir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
        if os.path.isfile(built_apk):
            dest_apk = os.path.join(ROOT_DIR, 'al-3lm.apk')
            shutil.copy2(built_apk, dest_apk)
            print(f'   [OK] تم بناء ملف الأندرويد المستقل بنجاح: {dest_apk}')
    except Exception as e:
        print(f'   [!] تم تجهيز مشروع الأندرويد بالكامل في android-standalone-build (تفاصيل البناء: {e})')


def step3_build_windows_exe():
    print('[3/3] فحص بناء مشغّل الحاسوب المستقل (Al3lm_Local_App.exe)...')
    if shutil.which('pyinstaller') is None:
        print('   [i] لتوليد ملف .exe مستقل للحاسوب شغّلي مرة واحدة: pip install pyinstaller ثم أعيدي تشغيل البناء.')
        return
    try:
        cmd = [
            'pyinstaller', '--noconfirm', '--onefile', '--name', 'Al3lm_Local_App',
            os.path.join(ROOT_DIR, 'al3lm_pc_server.py')
        ]
        subprocess.run(cmd, cwd=ROOT_DIR, check=True)
        built_exe = os.path.join(ROOT_DIR, 'dist', 'Al3lm_Local_App.exe')
        if os.path.isfile(built_exe):
            shutil.copy2(built_exe, os.path.join(ROOT_DIR, 'Al3lm_Local_App.exe'))
            print('   [OK] تم توليد Al3lm_Local_App.exe بنجاح في المجلد الرئيسي!')
    except Exception as e:
        print(f'   [!] تعذّر بناء الـ EXE تلقائياً: {e}')


if __name__ == '__main__':
    step1_generate_manifest()
    if '--manifest-only' not in sys.argv:
        step2_scaffold_and_build_apk()
        step3_build_windows_exe()
