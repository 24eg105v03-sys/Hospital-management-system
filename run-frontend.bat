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
echo Serving frontend files from "%~dp0frontend"...
cd /d "%~dp0frontend"
python -m http.server 3000
pause
