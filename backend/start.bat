@echo off
cd /d "%~dp0"
echo Starting DevFix Backend Server...
echo.
call node server.js
pause
