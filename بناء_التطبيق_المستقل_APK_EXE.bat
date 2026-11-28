@echo off
chcp 65001 >nul
title مدرسة العلم - بناء التطبيق المستقل وفهرس التحديث
color 1F
cd /d "%~dp0"
echo ================================================================
echo   توليد فهرس التحديث الذكي وبناء حزم APK و EXE محلياً
echo ================================================================
echo.
where python >nul 2>nul
if %errorlevel%==0 (
    python build_al3lm_local_apps.py
    pause
    goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
    py build_al3lm_local_apps.py
    pause
    goto :eof
)
echo يرجى تثبيت Python على الحاسوب لتشغيل أداة البناء.
pause
