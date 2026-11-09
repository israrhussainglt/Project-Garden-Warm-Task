@echo off
cd /d "%~dp0"
set "PY=python"
where python >nul 2>&1 || (where py >nul 2>&1 && set "PY=py")
where %PY% >nul 2>&1 || (echo Python is required. Install it from python.org, then double-click again. & pause & exit /b 1)
rem The minimized window keeps the server alive; close it to stop the site.
start "Gardens by the Bay server" /min %PY% -m http.server 8080
%SystemRoot%\system32\timeout.exe /t 1 /nobreak >nul
start "" "http://localhost:8080/"
