@echo off
chcp 65001 >nul
title مدرسة العلم - محطة التشغيل والبث المحلي (LAN + P2P)
color 2F
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 (
    python al3lm_pc_server.py
    goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
    py al3lm_pc_server.py
    goto :eof
)
start "" "%~dp0index.html"
pause
