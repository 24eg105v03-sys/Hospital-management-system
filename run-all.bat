@echo off
echo ========================================================
echo  Starting Hospital Management System (CarePulse HMS)
echo ========================================================

start "HMS Backend (Port 8080)" cmd /k "cd /d backend && java -XX:TieredStopAtLevel=1 -Xms64m -Xmx256m -Xss256k -XX:CICompilerCount=2 -XX:+UseSerialGC -jar target\hospital-backend-1.0.0.jar"
start "HMS React Frontend (Port 3000)" cmd /k "cd /d frontend && npm run dev"

echo Backend URL : http://localhost:8080
echo Frontend URL: http://localhost:3000
echo H2 Console  : http://localhost:8080/h2-console
echo ========================================================
pause
