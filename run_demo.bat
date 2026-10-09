@echo off
echo ============================================================
echo   DATA SCIENCE WORKFORCE INTELLIGENCE - LOCAL DEMO LAUNCHER
echo   SAS CU Hackathon - Team The Processors
echo ============================================================
echo.
echo [1/2] Starting FastAPI Analytical Backend on http://127.0.0.1:8000 ...
start "FastAPI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting React Vite Command Center UI on http://localhost:3000 ...
start "Vite Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================================
echo System startup commands executed!
echo - FastAPI Backend API: http://127.0.0.1:8000
echo - Swagger API Docs:    http://127.0.0.1:8000/docs
echo - Web Command Center:  http://localhost:3000
echo ============================================================
