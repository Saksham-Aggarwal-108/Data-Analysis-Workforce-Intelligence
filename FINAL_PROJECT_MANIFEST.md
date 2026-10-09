# FINAL PROJECT MANIFEST
## Competition-Grade SAS CU Hackathon Deliverables Package
**Data Science Workforce Intelligence — Team The Processors**

---

## 1. Project Metadata
- **Project Name**: Data Science Workforce Intelligence
- **Subtitle**: Connecting Market Demand, Skills, Compensation and Professional Success
- **Competition**: SAS CU Hackathon
- **Team**: Team The Processors
- **Release Version**: `v2.1.0-Validated`
- **Freeze Status**: **FROZEN & DEMO READY**

---

## 2. Source Datasets (`./data/`)
1. `DataScience Jobs.csv` ($N = 1,602$) — Market Intelligence Layer
2. `Analytics Jobs.csv` ($N = 15,841$) — Skill Intelligence Layer
3. `JDS Skill Traits.xlsx` ($N = 139$) — Junior Career Intelligence Layer
4. `SDS Personality Traits.xlsx` ($N = 161$) — Senior Success Intelligence Layer (PRIMARY ML)

---

## 3. Application Components
- **Backend**: FastAPI Python Server (`./backend/app/main.py`)
- **Frontend**: React + Vite + TypeScript Command Center (`./frontend/src/`)
- **API Engine**: 18 active REST endpoints (`/api/market/*`, `/api/skills/*`, `/api/junior/*`, `/api/senior/*`, `/api/workforce/*`, `/api/evidence/*`)
- **1-Click Startup**: `run_demo.bat`

---

## 4. Documentation Package
- `SAS_CU_Hackathon_The_Processors_Final_Approach_Note.md` — Final Approach Note.
- `SAS_CU_Hackathon_The_Processors_Final_Approach_Note.docx` — Formatted Word Approach Note.
- `PHASE_5_APPROACH_NOTE_REVISION_REPORT.md` — Phase 5 revision report.
- `PHASE_6_FINAL_SYSTEM_AUDIT.md` — Phase 6 system audit document.
- `PHASE_6_FINAL_QA_REPORT.md` — Master QA & freeze report.
- `docs/JURY_DEMO_CHECKLIST.md` — 7-minute jury demo checklist.
- `docs/JURY_3_MIN_BACKUP_DEMO.md` — 3-minute emergency backup demo script.
- `docs/JURY_QA.md` — 30-question technical & business Q&A defense.
- `docs/RUBRIC_FINAL_READINESS.md` — 100-mark rubric evidence readiness matrix.
- `docs/JURY_SPEAKER_NOTES.md` — 10-slide presentation speaker notes.

---

## 5. Primary Model Specification
- **Primary Model**: Random Forest Classifier (`v2.1.0-Validated`)
- **Dataset**: `SDS Personality Traits.xlsx` ($N = 161$)
- **Official 5-Fold Stratified CV ROC-AUC**: **$0.9928 \pm 0.0048$**
- **Accuracy**: $0.9627 \pm 0.0177$ | **F1-Score**: $0.9654 \pm 0.0157$
- **Grouped CV Sensitivity**: $\text{ROC-AUC} = 0.9927 \pm 0.0094$ ($\Delta = 0.0001$)
- **50-Fold Repeated CV**: $\text{ROC-AUC} = 0.9957 \pm 0.0080$
- **Out-of-Fold Confusion Matrix**: $\text{TN}=69, \text{FP}=4, \text{FN}=2, \text{TP}=86$

---

## 6. Responsible AI Restriction Notice
> Personality trait findings derived from `SDS Personality Traits.xlsx` represent observational multivariate associations. Personality variables are **PROHIBITED** from use as automated hiring filters or candidate rejection tools. Intended strictly for executive development coaching and workforce capability exploration.
