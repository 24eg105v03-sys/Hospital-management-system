@echo off
title HMS Backend Server (Port 8080)
echo ========================================================
echo   CarePulse Hospital Management System - BACKEND
echo ========================================================
echo.
echo   Backend URL : http://localhost:8080
echo   H2 Console  : http://localhost:8080/h2-console
echo.
echo Starting backend server on port 8080...
cd /d "%~dp0"
java -XX:TieredStopAtLevel=1 -Xms64m -Xmx256m -Xss256k -XX:CICompilerCount=2 -XX:+UseSerialGC -jar target\hospital-backend-1.0.0.jar
pause
