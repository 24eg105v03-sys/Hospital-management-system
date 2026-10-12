@echo off
title HMS Frontend Web App (Port 3000)
echo ========================================================
echo   CarePulse Hospital Management System - FRONTEND
echo ========================================================
echo.
echo   Frontend URL: http://localhost:3000
echo.
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
echo.
echo Serving frontend files on port 3000...
cd /d "%~dp0"
python -m http.server 3000
pause
