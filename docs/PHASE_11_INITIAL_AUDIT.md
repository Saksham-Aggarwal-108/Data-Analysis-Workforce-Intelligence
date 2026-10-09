# Phase 11 Initial System Audit & Architectural Discovery Report

**Project**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  
**Phase**: Phase 11 (Final Integration, Stress Testing, Security Audit & Demo Hardening)  

---

## 1. System Inventory & Entry Points

### Primary Application Entry Points
* **Backend Entry Point**: `backend/app/main.py` (FastAPI application running on port `8000`).
* **Frontend Entry Point**: `frontend/src/main.tsx` $\rightarrow$ `App.tsx` (React + Vite single page application running on port `3000`).
* **Demo Launch Script**: `run_demo.bat` (Automated dual-process launcher for backend Uvicorn and frontend Vite).

---

## 2. API Endpoint Architecture Discovery

| HTTP Method | API Path | Module / Handler | Functional Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/senior/predict` | `app.main.predict_senior_success` | SDS Senior Success Random Forest model inference (System 1) |
| `GET` | `/api/senior/model` | `app.main.get_senior_model` | SDS cross-validation model pipeline results & metrics |
| `GET` | `/api/senior/stats` | `app.main.get_senior_stats` | VIF diagnostics & logistic regression statistical inference |
| `GET` | `/api/senior/audit` | `app.main.get_senior_audit` | Phase 2.1 statistical robustness & leakage audit gate |
| `POST` | `/api/career/parse-resume` | `app.main.parse_career_resume` | Safe parsing of PDF, DOCX, TXT resumes into CandidateProfile |
| `POST` | `/api/career/profile` | `app.main.create_career_profile` | Skill taxonomy normalization for manual profile input |
| `GET` | `/api/career/roles` | `app.main.get_career_roles` | Canonical target role catalog definitions |
| `POST` | `/api/career/match` | `app.main.match_career_roles` | Role alignment & discovery mode all-roles ranking |
| `POST` | `/api/career/skill-gap` | `app.main.get_skill_gaps` | Deterministic skill gap calculation |
| `POST` | `/api/career/roadmap` | `app.main.generate_career_roadmap` | Dynamic personalized learning roadmap generation |
| `POST` | `/api/career/copilot` | `app.main.query_career_copilot` | Context-grounded Career Copilot chat Assistant |
| `GET` | `/api/career/market` | `app.main.get_career_market` | Dataset-grounded market intelligence overview & provenance |
| `GET` | `/api/market/summary` | `app.main.get_market_summary` | DataScience Jobs.csv summary statistics |
| `GET` | `/api/skills/summary` | `app.main.get_skills_summary` | Analytics Jobs.csv summary statistics |
| `GET` | `/api/junior/summary` | `app.main.get_junior_summary` | JDS Skill Traits.xlsx summary statistics |
| `GET` | `/api/workforce/cards` | `app.main.get_workforce_cards` | Unified Workforce Strategy insight cards |
| `GET` | `/api/quality/audit` | `app.main.get_quality_audit` | Data Quality Engine audit logs |
| `GET` | `/api/export/lineage` | `app.main.export_lineage` | Data lineage JSON export |

---

## 3. Frontend Tab Routes Discovery

The application implements 10 primary view tabs inside `frontend/src/App.tsx`:
1. `overview`: Overview Dashboard & Analytical Pipeline Summary
2. `market`: Market Intelligence Layer (`DataScience Jobs.csv`)
3. `skills`: Skill Intelligence Layer (`Analytics Jobs.csv`)
4. `junior`: Junior Career Intelligence Layer (`JDS Skill Traits.xlsx`)
5. `senior`: Senior Success Intelligence Layer (`SDS Personality Traits.xlsx`)
6. `workforce`: Unified Workforce Strategy & Recommendations
7. `models`: Analytical Model Lab (System 1 SDS Random Forest & Diagnostics)
8. `quality`: Data Quality Engine & Audit Log Inspector
9. `jury`: Jury Mode & Executive Presentation View
10. `career`: Workforce Intelligence Career AI Command Center (System 2)

---

## 4. Analytical Model Freeze Verification

The following analytical artifacts and metrics are **FROZEN** and MUST NOT be modified:

* **Primary Model**: Random Forest Classifier
* **Hyperparameters**: `n_estimators = 100`, `max_depth = 5`, `random_state = 42`
* **Dataset**: `SDS Personality Traits.xlsx` ($N = 161$)
* **Inputs**: Neuroticism, Extraversion, Openness to Experience, Agreeableness, Conscientiousness
* **Target**: `success_classification_high_low`
* **Frozen Primary Validation Result**:
  * 5-fold Stratified ROC-AUC $= 0.9928 \pm 0.0048$
  * Accuracy $= 0.9627 \pm 0.0177$
  * Precision $= 0.9548 \pm 0.0284$
  * Recall $= 0.9773 \pm 0.0284$
  * F1 Score $= 0.9654 \pm 0.0157$
  * Grouped-ID ROC-AUC $= 0.9927 \pm 0.0094$
  * Repeated 50-fold ROC-AUC $= 0.9957 \pm 0.0080$

---

## 5. Phase 11 Risk Assessment & Mitigation Plan

### A. Integration Risks
* **State Synchronization**: Rapid user interactions (e.g. changing weekly study hours or target roles) could trigger out-of-order API responses.
* **Mitigation**: Verify backend handling and enforce input debounce / request guards in frontend state.

### B. Security & File Upload Risks
* **File Upload Safety**: Malformed PDF, DOCX, or TXT files could crash resume parsing if exceptions are unhandled.
* **Mitigation**: Wrap parsing in safe try-except blocks with clean user-facing error messages ($400/422$) instead of $500$ tracebacks. Enforce strict $\le 5\text{MB}$ file size checks and extension whitelisting.

### C. Copilot Grounding Risks
* **External LLM Outages**: Unavailable API keys or network timeouts could cause Copilot UI freezing.
* **Mitigation**: Fall back seamlessly to the deterministic evidence-grounded Copilot engine, ensuring $100\%$ uptime with zero white-screen crashes.

### D. Demo & Presentation Risks
* **Dual Process Startup**: Server startup order (FastAPI before Vite) must be handled cleanly.
* **Mitigation**: Update `run_demo.bat` with process health checks and clear URL notifications.
