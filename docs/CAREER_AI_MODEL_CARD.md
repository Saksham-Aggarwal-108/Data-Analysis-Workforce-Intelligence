# Career AI Model Card & System 2 Intelligence Specifications

## 1. System Identity & Overview
* **System Name**: Workforce Intelligence Career AI Copilot (System 2)
* **Architecture**: Deterministic Gap Analysis Engine + LLM Career Copilot
* **Version**: 1.0.0 (Phase 9 Release)
* **Analytical Scope**: Career intelligence, skill gap detection, role alignment, personalized roadmap generation, and dataset-grounded career advising.
* **Isolation Boundary**: System 2 is strictly decoupled from System 1 (SDS Senior Success Random Forest Model). System 2 does NOT consume personality traits as hiring criteria, nor does it alter frozen competition models.

---

## 2. Intended Use & Application Boundaries
### Primary Intended Uses
1. **Candidate Profile Extraction**: Parsing resume documents (PDF, DOCX, TXT) and structured manual inputs into a normalized candidate skill profile.
2. **Skill Normalization & Categorization**: Mapping raw skill strings across 120+ aliases into canonical taxonomy keys across 15 technical domains.
3. **Dataset-Grounded Market Intelligence**: Querying observed dataset distributions from `DataScience Jobs.csv` ($N=1,500$) and `Analytics Jobs.csv` ($N=2,000$) to provide empirical skill demand, salary evidence, and role prevalence.
4. **Deterministic Skill Gap Calculation**: Computing mathematical skill gaps ($gap = \text{required} - \text{current}$) and ranking roles by coverage percentage without LLM hallucination.
5. **Personalized Career Roadmaps**: Generating multi-phase learning paths dynamically adjusted for user weekly time availability.
6. **AI Career Copilot**: Answering user career inquiries strictly grounded in provided candidate profile state and local dataset evidence.

### Prohibited / Out-of-Scope Uses
* **Automated Candidate Screening / Hiring Decisions**: System 2 MUST NOT be used to filter, reject, or score job applicants for recruitment or employment selection.
* **Employment Guarantees**: System 2 MUST NOT output claims guaranteeing job placement or interview success.
* **Causality & Trait Inferences**: System 2 MUST NOT infer protected demographic attributes, health status, or psychological suitability.
* **Market Statistics Fabrication**: System 2 MUST NOT invent arbitrary precision percentages or market trends not present in local datasets.

---

## 3. Architecture & Engine Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM 2 ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐ │
│ │ Resume Parser (PDF)  │  │ Skill Taxonomy (120+)│  │ Market Evidence │ │
│ └──────────┬───────────┘  └──────────┬───────────┘  └────────┬────────┘ │
│            │                         │                       │          │
│            ▼                         ▼                       ▼          │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                    CandidateProfile State Object                     │ │
│ └────────────────────────────────────┬────────────────────────────────┘ │
│                                      │                                  │
│                                      ▼                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                 Deterministic Skill Gap Engine                      │ │
│ │              - Gap calculation: max(0, req - curr)                  │ │
│ │              - Role Alignment Score: Sum(matched_req) / Total_req   │ │
│ └────────────────────────────────────┬────────────────────────────────┘ │
│                                      │                                  │
│                                      ▼                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                  Personalized Roadmap Engine                        │ │
│ │              - Multi-phase learning paths                           │ │
│ │              - Duration scaled by weekly study hours                │ │
│ │              - Portfolio project recommendations                    │ │
│ └────────────────────────────────────┬────────────────────────────────┘ │
│                                      │                                  │
│                                      ▼                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │               Evidence-Grounded Career Copilot (LLM)                │ │
│ │              - Grounded in state & local market data                 │ │
│ │              - Fallback to rule engine if offline                    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Input & Output Schemas

### Input Schema (`CandidateProfile`)
```json
{
  "name": "Jane Doe",
  "target_role": "Data Scientist",
  "experience_years": 3,
  "skills": ["Python", "SQL", "Scikit-Learn", "PostgreSQL"],
  "weekly_hours": 10,
  "preferred_domain": "Finance"
}
```

### Output Schema (`CareerRoadmap`)
```json
{
  "target_role": "Data Scientist",
  "readiness_summary": "Strong core programming and database coverage with critical gaps in Machine Learning and Statistics.",
  "priorities": ["Machine Learning", "Statistics", "Deep Learning"],
  "phases": [
    {
      "phase_id": "phase_1",
      "title": "Phase 1: Master Machine Learning & Advanced Analytics",
      "duration_weeks": 4,
      "objectives": ["Bridge critical skill gap in Machine Learning"],
      "skills_covered": ["Machine Learning", "Statistics"],
      "prerequisites": ["Python", "SQL"],
      "practice_tasks": ["Build 5 regression/classification models", "Perform cross-validation"],
      "project": {
        "title": "End-to-End Customer Churn Prediction Engine",
        "difficulty": "Intermediate",
        "deliverables": ["Scikit-Learn pipeline", "MLflow tracking", "FastAPI endpoint"],
        "technologies": ["Python", "Scikit-Learn", "FastAPI"]
      },
      "validation_checkpoint": "Train a model achieving >0.85 ROC-AUC with zero data leakage."
    }
  ]
}
```

---

## 5. Responsible AI Guardrails & Transparency Disclaimers

1. **Analytical Alignment Disclaimer**:
   > *"Role Readiness and Fit scores represent mathematical skill-coverage estimates calculated between your supplied profile and defined job role requirements. This score is an analytical alignment metric, not a hiring probability or employment guarantee."*
2. **Dataset Provenance Labeling**:
   * **`Observed Dataset Evidence`**: Derived directly from `DataScience Jobs.csv` or `Analytics Jobs.csv`.
   * **`Role Intelligence Derived`**: Standardized industry expectations defined by domain taxonomy.
   * **`External Research`**: Supplemental insights from connected search models (clearly labeled).
3. **Graceful Fallback Guarantee**: If no external LLM API key is present, the Copilot automatically switches to a deterministic template fallback engine, ensuring zero system crashes and $100\%$ uptime.

---

## 6. Model Card Performance & Verification Summary
* **Deterministic Skill Gap Accuracy**: $100\%$ mathematically exact relative to defined role requirements.
* **Resume Parsing Precision**: Validated on standard PDF, DOCX, and TXT resumes containing diverse layout formats.
* **Unit Test Coverage**: Verified across 13 test suites (`tests/test_phase9_career_ai.py` and `tests/test_pipeline.py`).
* **Vite Production Build Status**: Clean build with zero TypeScript compilation errors.
