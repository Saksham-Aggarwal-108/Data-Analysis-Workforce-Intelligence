@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   DATA SCIENCE WORKFORCE INTELLIGENCE - LOCAL DEMO LAUNCHER
echo   SAS CU Hackathon - Team The Processors
echo ============================================================
echo.

:: 1. Detect Python executable
set "PY_CMD="
python --version >nul 2>&1
if not errorlevel 1 (
    set "PY_CMD=python"
) else (
    if exist "%USERPROFILE%\.local\bin\python.exe" (
        set "PY_CMD=%USERPROFILE%\.local\bin\python.exe"
    ) else if exist "%USERPROFILE%\.local\bin\python3.14.exe" (
        set "PY_CMD=%USERPROFILE%\.local\bin\python3.14.exe"
    ) else (
        where py >nul 2>&1 && set "PY_CMD=py"
    )
)

if "%PY_CMD%"=="" (
    echo [ERROR] No working Python installation found!
    echo Please make sure Python 3.10+ or uv Python is installed and accessible.
    pause
    exit /b 1
)

echo [1/2] Launching FastAPI Analytical Backend on http://127.0.0.1:8000 using %PY_CMD% ...
echo       (Note: Initial startup takes ~5-10 seconds to ingest 4 datasets and fit ML models)
start "FastAPI Backend" cmd /k "cd /d %~dp0backend && "%PY_CMD%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo [2/2] Launching React Vite Command Center UI on http://localhost:3000 ...
start "Vite Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo ============================================================
echo System startup commands executed successfully!
echo - FastAPI Backend API: http://127.0.0.1:8000
echo - Swagger API Docs:    http://127.0.0.1:8000/docs
echo - Web Command Center:  http://localhost:3000
echo ============================================================

