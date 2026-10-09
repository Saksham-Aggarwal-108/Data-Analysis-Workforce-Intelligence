# DEMO FAILSAFE & EMERGENCY OPERATIONAL PROTOCOL

**Project Title**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  

---

## 1. NORMAL DEMO LAUNCH PROCEDURE

Execute the 1-click startup script from the project root:
```cmd
run_demo.bat
```
This script:
1. Starts the FastAPI Uvicorn backend server on `http://127.0.0.1:8000`.
2. Starts the React Vite frontend server on `http://localhost:3000`.
3. Opens the browser directly to `http://localhost:3000`.

---

## 2. PORT CONFLICT RECOVERY

If port 8000 or 3000 is occupied by a background process:

### A. Kill Existing Python Uvicorn Processes:
```cmd
taskkill /F /IM python.exe
```

### B. Kill Existing Node Processes:
```cmd
taskkill /F /IM node.exe
```

### C. Relaunch Script:
```cmd
run_demo.bat
```

---

## 3. INDIVIDUAL SERVICE MANUAL STARTUP

If `run_demo.bat` experiences a shell script issue:

### Start Backend Manually:
```powershell
# Open Terminal 1
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Start Frontend Manually:
```powershell
# Open Terminal 2
cd frontend
cmd /c npm run dev
```

---

## 4. API UN-AVAILABILITY & REFRESH PROTOCOL

If the frontend displays `API Error` or fails to fetch dynamic cards:
1. Check backend status at `http://127.0.0.1:8000/api/health`.
2. If `{"status": "online"}` is returned, press **`Ctrl + F5`** in the browser to force clear client cache.
3. If backend is offline, restart terminal 1.

---

## 5. LIVE PREDICTION ENGINE FAILSAFE PROTOCOL

If the live prediction slider in `Jury Mode` or `Model Lab` fails to return an inference response:
1. **Verbal Failsafe Statement**:
   > *"The live prediction API calls our frozen Random Forest pipeline on port 8000. In our validated offline cross-validation audit, this exact model achieved an out-of-fold ROC-AUC of 0.9928 ± 0.0048 with 96.27% accuracy."*
2. Switch to **Model Lab** $\rightarrow$ **Candidate Models Performance Table** or **Jury Demo Mode** $\rightarrow$ **Validation Chain Card** to demonstrate pre-computed out-of-fold metrics and confusion matrix ($69/4/2/86$).

---

## 6. PRESENTER EMERGENCY NARRATIVE (HARDWARE/SYSTEM FAILURE)

If the presentation laptop completely loses display or crashes:
- Presenter opens **`SAS_CU_Hackathon_The_Processors_Final_Approach_Note.docx`** or printed **`docs/JURY_3_MINUTE_DEMO_SCRIPT.md`**.
- Deliver the **30-Second Emergency Pitch** (`docs/JURY_30_SECOND_PITCH.md`).
- Present pre-rendered architecture diagrams and offline metric summaries.
