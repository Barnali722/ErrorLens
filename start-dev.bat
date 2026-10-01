@echo off
echo.
echo ========================================
echo  ErrorLens - Starting Development Server
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend API Server...
echo.
start "ErrorLens Backend" cmd /k "cd backend && node server.js"

timeout /t 2 /nobreak > nul

echo [2/2] Backend is running on http://localhost:3000
echo.
echo ========================================
echo  READY TO TEST!
echo ========================================
echo.
echo Backend API:  http://localhost:3000/api/health
echo Frontend:     Open frontend\index.html in your browser
echo.
echo Or use these URLs to test:
echo - Health Check: http://localhost:3000/api/health
echo - Examples:     http://localhost:3000/api/examples
echo - Languages:    http://localhost:3000/api/languages
echo.
echo Press Ctrl+C in the Backend window to stop the server.
echo.
pause
