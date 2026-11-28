#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
محطة التشغيل والبث المحلي لمنصة «مدرسة العلم» (PC / LAN / P2P Delta Relay)
- تشغّل المنصة بدون إنترنت على الحاسوب وتبثّها لجميع الهواتف والحواسيب على نفس الراوتر (LAN).
- تستجيب وتكتشف تلقائياً الأجهزة المحدّثة عبر UDP Broadcast (المنفذ 8766) لتبادل التحديثات بلا إنترنت.
"""
import os
import sys
import json
import base64
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HTTP_PORT = 8765
UDP_PORT = 8766

if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)
    BUNDLE_DIR = getattr(sys, '_MEIPASS', BASE_DIR)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    BUNDLE_DIR = BASE_DIR

RELAY_OVERRIDE_DIR = os.path.join(BASE_DIR, '.al3lm_local_updates')
os.makedirs(RELAY_OVERRIDE_DIR, exist_ok=True)


def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'


def discover_lan_peers(timeout=1.2):
    peers = set()
    my_ip = get_lan_ip()
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        sock.settimeout(timeout)
        sock.sendto(b'AL3LM_DISCOVER', ('255.255.255.255', UDP_PORT))
        while True:
            data, addr = sock.recvfrom(256)
            msg = data.decode('utf-8', errors='ignore').strip()
            if msg.startswith('AL3LM_PEER_') and addr[0] != my_ip:
                port = msg.split('_')[-1]
                peers.add(f"http://{addr[0]}:{port}")
    except Exception:
        pass
    return sorted(peers)


def start_udp_responder():
    def _listen():
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(('0.0.0.0', UDP_PORT))
            while True:
                data, addr = sock.recvfrom(256)
                if data.strip() == b'AL3LM_DISCOVER':
                    sock.sendto(f'AL3LM_PEER_{HTTP_PORT}'.encode('utf-8'), addr)
        except Exception:
            pass
    t = threading.Thread(target=_listen, daemon=True)
    t.start()


class Al3lmMeshHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def translate_path(self, path):
        clean = path.split('?', 1)[0].split('#', 1)[0].lstrip('/')
        if not clean:
            clean = 'index.html'
        override_candidate = os.path.normpath(os.path.join(RELAY_OVERRIDE_DIR, clean))
        if override_candidate.startswith(os.path.normpath(RELAY_OVERRIDE_DIR)) and os.path.isfile(override_candidate):
            return override_candidate
        local_candidate = os.path.normpath(os.path.join(BASE_DIR, clean))
        if os.path.exists(local_candidate):
            return local_candidate
        return os.path.normpath(os.path.join(BUNDLE_DIR, clean))

    def do_GET(self):
        clean = self.path.split('?', 1)[0]
        if clean == '/mesh-node-info':
            ip = get_lan_ip()
            payload = {'lanIp': ip, 'port': HTTP_PORT, 'lanUrl': f'http://{ip}:{HTTP_PORT}'}
            raw = json.dumps(payload).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)
            return

        if clean == '/mesh-discover-lan-peers':
            raw = json.dumps({'peers': discover_lan_peers()}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)
            return

        return super().do_GET()

    def do_POST(self):
        clean = self.path.split('?', 1)[0]
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length) if length > 0 else b'{}'

        if clean == '/mesh-store-override':
            try:
                data = json.loads(body.decode('utf-8'))
                rel_path = data.get('path', '').lstrip('/').replace('..', '')
                b64 = data.get('base64', '')
                if rel_path and b64:
                    dest = os.path.join(RELAY_OVERRIDE_DIR, rel_path)
                    os.makedirs(os.path.dirname(dest), exist_ok=True)
                    with open(dest, 'wb') as f:
                        f.write(base64.b64decode(b64))
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception:
                self.send_response(400)
                self.end_headers()
            return

        if clean == '/mesh-store-manifest':
            try:
                dest = os.path.join(RELAY_OVERRIDE_DIR, 'update-manifest.json')
                with open(dest, 'wb') as f:
                    f.write(body)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception:
                self.send_response(400)
                self.end_headers()
            return

        self.send_response(404)
        self.end_headers()


if __name__ == '__main__':
    start_udp_responder()
    lan_ip = get_lan_ip()
    print('=' * 66)
    print('  بسم الله — محطة تشغيل وبث «مدرسة العلم» المحلية (LAN + P2P)')
    print('=' * 66)
    print(f'  [1] على هذا الحاسوب:              http://localhost:{HTTP_PORT}')
    print(f'  [2] للهواتف والأجهزة في الشبكة:   http://{lan_ip}:{HTTP_PORT}')
    print('=' * 66)
    threading.Timer(0.8, lambda: webbrowser.open(f'http://localhost:{HTTP_PORT}')).start()
    server = ThreadingHTTPServer(('0.0.0.0', HTTP_PORT), Al3lmMeshHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
