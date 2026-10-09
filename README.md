# Data Science Workforce Intelligence

**Team**: The Processors  
**Event**: SAS CU Hackathon  
**Platform Version**: 1.0.0 (Competition Frozen)  

---

## Executive Overview

**Data Science Workforce Intelligence** is an end-to-end analytical intelligence platform designed to bridge market demand, skill expectations, early-career progression, and senior professional success. 

The platform synthesizes evidence across four heterogeneous datasets while strictly maintaining the **Principle of Analytical Isolation**—avoiding unjustified row-level dataset merges.

---

## Key Features

1. **Market Intelligence**: Analyzes job posting volumes, salary distributions, min experience requirements, and demand shares across Data Science and Analytics roles ($N = 17,442$ clean analytical postings).
2. **Skill Intelligence**: Evaluates skill co-occurrence frequencies, prevalence metrics, and salary band skill correlations.
3. **Junior Career Intelligence**: Benchmark evaluation of early-career entry traits and competency profiles ($N = 139$).
4. **Senior Success Intelligence & Model Lab**: Primary supervised learning pipeline on Big Five personality traits ($N = 161$) predicting high/low success. Features a Random Forest Classifier achieving a cross-validated ROC-AUC of $0.9928 \pm 0.0048$.
5. **Career AI Engine**:
   - **Resume Intelligence**: Resume text parsing with extension whitelist protection (.pdf, .docx, .txt) and file size caps ($\le 5\text{MB}$).
   - **Evidence Classification & Proficiency Inference**: Context-based evidence categorization (`PROFESSIONAL`, `PROJECT`, `DEMONSTRATED`, `COURSEWORK`) and 1–5 proficiency scale inference.
   - **Explainable Role Alignment & Skill Gap Engine**: Deterministic role suitability scoring and gap categorization.
   - **Adaptive Learning Roadmap**: Schedule adaptation based on weekly user availability, priority modes, skipped skills, and recommended portfolio projects.
   - **Context-Grounded Career Copilot**: Contextual Q&A engine backed by dataset provenance and strict fallback guardrails on out-of-scope queries.
6. **Responsible AI Guardrails**: Prominently displays *"ANALYTICAL ESTIMATE — NOT A HIRING SCORE"* disclaimers and explicitly restricts automated hiring or candidate rejection.

---

## Dataset Inventory & Provenance

| Dataset Name | Raw Rows | Excluded Rows | Analytical Rows | Target / Purpose |
| :--- | :---: | :---: | :---: | :--- |
| `DataScience Jobs.csv` | 1,602 | 0 | 1,602 | Market opening volumes & salary spread |
| `Analytics Jobs.csv` | 15,841 | 1 | 15,840 | Skill occurrence & prevalence correlation |
| `JDS Skill Traits.xlsx` | 139 | 0 | 139 | Junior competency benchmarks |
| `SDS Personality Traits.xlsx` | 161 | 0 | 161 | Senior success classification target |
| **Total Usable Postings** | **17,443** | **1** | **17,442** | **99.99% Retention Rate** |

---

## Frozen ML Model Specifications

- **Algorithm**: Random Forest Classifier
- **Hyperparameters**: `n_estimators = 100`, `max_depth = 5`, `random_state = 42`
- **Predictors**: Neuroticism, Extraversion, Openness to Experience, Agreeableness, Conscientiousness
- **Target**: `success_classification_high_low`
- **Validation Results**:
  - **5-Fold Stratified ROC-AUC**: $0.9928 \pm 0.0048$
  - **Grouped-ID ROC-AUC**: $0.9927 \pm 0.0094$
  - **50-Fold Repeated CV ROC-AUC**: $0.9957 \pm 0.0080$
  - **Accuracy**: $0.9627 \pm 0.0177$ | **F1 Score**: $0.9654 \pm 0.0157$

---

## Installation & Setup

### Prerequisites
- **Python**: 3.10+ (Recommended Python 3.14 via `uv` or system Python)
- **Node.js**: 18+ and `npm`

### Quick Start (Windows One-Click Launch)
Double-click or run from terminal:
```cmd
run_demo.bat
```
This batch script automatically validates environment dependencies, launches the FastAPI backend on `http://127.0.0.1:8000`, and starts the Vite frontend dev server on `http://localhost:3000`.

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# Install requirements:
pip install -r requirements.txt
# Run uvicorn server:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Test Suite Execution

To execute the backend test suite:
```bash
python -m unittest discover -s tests -p "test_*.py" -v
```
*Expected Result*: 27 / 27 tests passing ($0$ failures, $0$ errors).

To run the frontend production build check:
```bash
cd frontend
npm run build
```
*Expected Result*: $0$ TypeScript compilation errors, production `dist/` bundle created.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point & API endpoints
│   │   ├── ingestion.py           # Dataset loader
│   │   ├── quality.py             # Data quality & missing value engine
│   │   ├── preprocessing.py       # Data preprocessor & scaler
│   │   ├── analysis/              # Market, Skills, Junior & Senior statistical engines
│   │   ├── models/                # SDS Random Forest pipeline & sensitivity checks
│   │   └── career/                # Career AI, Resume Parser, Role Matching, Roadmap & Copilot
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main SPA router & navigation
│   │   ├── components/            # View dashboards (Market, Senior, Models, Career AI, Jury, etc.)
├── tests/                         # Unit tests & Phase 11 end-to-end / security test suites
├── docs/                          # Competition audits, scorecards, demo scripts & rubrics
├── datasets/                      # Raw dataset files
└── run_demo.bat                   # One-click demo launch script
```

---

## Responsible AI Disclaimer

> **ANALYTICAL ESTIMATE — NOT A HIRING SCORE**  
> Model predictions and personality associations presented in this platform are exploratory statistical estimates derived from benchmark data. They are designed exclusively for capability development, talent coaching, and workforce strategy. They MUST NOT be used as automated hiring, rejection, or employment evaluation filters.
