@echo off
title HMS React Frontend Web App (Port 3000)
echo ========================================================
echo   CarePulse Hospital Management System - REACT FRONTEND
echo ========================================================
echo.
echo   Frontend URL: http://localhost:3000
echo.
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
echo.
echo Starting React Vite dev server on port 3000...
cd /d "%~dp0frontend"
call npm run dev
pause
