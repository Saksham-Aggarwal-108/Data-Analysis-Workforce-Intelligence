# Final Competition Manifest

**Project**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  
**Status**: COMPETITION FROZEN — VERIFIED  
**Date**: October 8, 2026  

---

## 1. Project Identification

- **Project Title**: Data Science Workforce Intelligence
- **Team Name**: The Processors
- **Event**: SAS CU Hackathon 2026
- **Version**: 1.0.0 (Competition Locked)

---

## 2. Dataset Inventory

- `DataScience Jobs.csv`: 1,602 raw $\rightarrow$ 1,602 analytical rows
- `Analytics Jobs.csv`: 15,841 raw $\rightarrow$ 15,840 analytical rows (1 missing skills row excluded)
- `JDS Skill Traits.xlsx`: 139 rows
- `SDS Personality Traits.xlsx`: 161 rows
- **Total Usable Market Evidence**: 17,442 job postings (99.99% retention rate)
- **Analytical Isolation**: 0 row-wise cross-dataset merges

---

## 3. Machine Learning Model Manifest

- **Algorithm**: Random Forest Classifier
- **Hyperparameters**: `n_estimators = 100`, `max_depth = 5`, `random_state = 42`
- **Predictors**: Neuroticism, Extraversion, Openness to Experience, Agreeableness, Conscientiousness ($N = 161$)
- **Target**: `success_classification_high_low`
- **Validated Performance**:
  - 5-Fold Stratified ROC-AUC: $0.9928 \pm 0.0048$
  - Grouped-ID ROC-AUC: $0.9927 \pm 0.0094$
  - 50-Fold Repeated CV ROC-AUC: $0.9957 \pm 0.0080$
  - Accuracy: $0.9627 \pm 0.0177$ | F1 Score: $0.9654 \pm 0.0157$

---

## 4. Platform Capabilities

- **Market & Skill Intelligence**: Salary bands, experience bounds, demand shares, skill co-occurrence frequencies.
- **Career AI**: Resume text extraction (.pdf, .docx, .txt), evidence classification, proficiency inference, role matching, skill gap discovery, adaptive learning roadmaps, context-grounded Copilot.
- **Responsible AI**: Prominent disclaimers ("ANALYTICAL ESTIMATE — NOT A HIRING SCORE") and strict guardrails preventing automated candidate rejection.

---

## 5. Verification Metrics

- **Backend Test Suite**: 27 / 27 unit tests passed (0 failures, 0 errors)
- **Frontend Production Build**: 0 TypeScript errors, 0 build errors
- **API Inventory**: 18 audited endpoints
- **Startup Script**: `run_demo.bat` operational
