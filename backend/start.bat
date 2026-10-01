@echo off
cd /d "%~dp0"
echo Starting ErrorLens Backend Server...
echo.
call node server.js
pause
