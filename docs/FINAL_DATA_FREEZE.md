# Final Dataset Freeze & Lineage Document

**Project**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  
**Date**: October 8, 2026  

---

## 1. Dataset Inventory & Final Row Lineage

| Dataset Name | File Path | Raw Rows | Excluded Rows | Usable Analytical Rows | Target / Purpose | Retention Rate |
| :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **DataScience Jobs** | `datasets/DataScience Jobs.csv` | 1,602 | 0 | **1,602** | Role-wise market openings, salary spread, min experience requirements. | 100.00% |
| **Analytics Jobs** | `datasets/Analytics Jobs.csv` | 15,841 | 1 | **15,840** | Skill co-occurrence, skill demand frequency, salary band correlation. (1 row excluded due to missing `key_skills` value). | 99.99% |
| **JDS Skill Traits** | `datasets/JDS Skill Traits.xlsx` | 139 | 0 | **139** | Junior entry-level competency benchmarks & skill gap profiles. | 100.00% |
| **SDS Personality Traits** | `datasets/SDS Personality Traits.xlsx` | 161 | 0 | **161** | Senior success classification target (`success_classification_high_low`). Big Five predictors. | 100.00% |
| **Combined Market Evidence** | Postings Total | 17,443 | 1 | **17,442** | Synthesized market demand evidence layer. | **99.99%** |

---

## 2. Principle of Analytical Isolation

The 4 datasets represent fundamentally distinct observation units:
- Job postings vs. individual junior employee competencies vs. senior professional personality profiles.
- **NO row-wise cross-dataset merges** have been performed.
- Synthesized insights are generated at the **Workforce Strategy** abstraction layer by referencing each dataset's validated statistical findings independently.

---

## 3. SDS Primary Model Dataset Specifications

- **Dataset**: `SDS Personality Traits.xlsx` ($N = 161$)
- **Target Variable**: `success_classification_high_low` ($1 = \text{High Success}, 0 = \text{Low Success}$)
- **Class Balance**: High Success: 88 ($54.66\%$), Low Success: 73 ($45.34\%$)
- **Predictors**:
  1. `neuroticism`
  2. `extraversion`
  3. `openness_to_experience`
  4. `agreeableness`
  5. `conscientiousness`
- **Data Preprocessing**: Feature scaling via StandardScaler within cross-validation folds to prevent data leakage. Zero missing values imputed or altered.
