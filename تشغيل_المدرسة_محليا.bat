@echo off
chcp 65001 >nul
title مدرسة العلم - التشغيل والبث المحلي (LAN)
color 2F
cls
echo ================================================================
echo         بسم الله — تشغيل وبث «مدرسة العلم» محلياً
echo ================================================================
echo.
set LAN_IP=
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set LAN_IP=%%a
    goto :found_ip
)
:found_ip
if defined LAN_IP set LAN_IP=%LAN_IP: =%
if not defined LAN_IP set LAN_IP=localhost

echo لفتح المنصة على الهواتف والأجهزة المتصلة بنفس الراوتر:
echo     http://%LAN_IP%:8000
echo (أو اضغط على دائرة مدرسة العلم أعلى الصفحة واختر المشاركة عبر الشبكة المحلية لمسح رمز QR)
echo.
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 (
    start "" "http://%LAN_IP%:8000"
    python -m http.server 8000 --bind 0.0.0.0
    goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
    start "" "http://%LAN_IP%:8000"
    py -m http.server 8000 --bind 0.0.0.0
    goto :eof
)
start "" "%~dp0index.html"
pause
