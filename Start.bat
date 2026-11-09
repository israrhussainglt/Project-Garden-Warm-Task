@echo off
cd /d "%~dp0"
set "PY=python"
where python >nul 2>&1 || (where py >nul 2>&1 && set "PY=py")
where %PY% >nul 2>&1 || (echo Python is required. Install it from python.org, then double-click again. & pause & exit /b 1)
set "FW="
set /p ALLOW=Allow phones on your Wi-Fi to reach this demo (one-time Windows Firewall rule for port 8080)? [Y/N]: 
if /i "%ALLOW%"=="Y" set "FW=-AllowFirewall"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1" -Port 8080 %FW%
rem The minimized window keeps the server alive; close it to stop the site.
start "Gardens by the Bay server" /min %PY% "%~dp0serve.py" 8080
%SystemRoot%\system32\timeout.exe /t 1 /nobreak >nul
start "" "http://localhost:8080/"
