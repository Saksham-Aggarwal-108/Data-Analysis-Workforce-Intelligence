# SYSTEM ARCHITECTURE & SAS PROCEDURE MAPPING DOCUMENTATION

## 1. System Architecture Overview

The system is designed with a decoupled, high-performance web architecture:

```
                  ┌──────────────────────────────────────────────┐
                  │   REACT + TYPESCRIPT + TAILWIND FRONTEND     │
                  │   (Recharts, Lucide Icons, Glassmorphism UI)  │
                  └──────────────────────┬───────────────────────┘
                                         │ REST APIs (JSON)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             FASTAPI PYTHON BACKEND           │
                  │  (Uvicorn, Pydantic Data Contracts & CORS)   │
                  └──────────────────────┬───────────────────────┘
                                         │
        ┌───────────────────┬────────────┴───────┬────────────────────┐
        ▼                   ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  ┌─────────────────┐
│   MARKET     │    │    SKILL     │    │  JUNIOR CAREER  │  │ SENIOR SUCCESS  │
│ INTELLIGENCE │    │ INTELLIGENCE │    │  INTELLIGENCE   │  │  INTELLIGENCE   │
│ (DS Jobs)    │    │(Analytics J.)│    │ (JDS Skills)    │  │  (SDS Traits)   │
└──────────────┘    └──────────────┘    └─────────────────┘  └─────────────────┘
```

---

## 2. SAS Procedure & Tooling Mapping Matrix

To ensure that the analytical and machine learning framework can later be reproduced within SAS Enterprise Miner, SAS Visual Analytics, or SAS Viya, the modular Python logic maps directly to standard SAS procedures:

| Application Module | Python Implementation | Corresponding SAS Procedure / SAS Tool |
| :--- | :--- | :--- |
| **Data Ingestion** | `pandas.read_csv()`, `pd.read_excel()` | `PROC IMPORT OUT=work.dataset DATAFILE="..." DBMS=CSV;` |
| **Data Quality & Summary** | `DataQualityEngine.Profile_dataset()` | `PROC MEANS`, `PROC FREQ`, `PROC UNIVARIATE` |
| **Missing Value Imputation** | `DataPreprocessor.clean_analytics_jobs()` | `PROC STDIZE METHOD=MEDIAN`, `SAS Enterprise Miner Impute Node` |
| **Categorical Standardization** | Regex text parsing & string mapping | `PROC FORMAT`, `DATA step functions (UPCASE, STRIP)` |
| **Correlation Analysis** | `df.corr()`, `scipy.stats` | `PROC CORR DATA=work.dataset PEARSON;` |
| **Logistic Regression ML** | `sklearn.linear_model.LogisticRegression` | `PROC LOGISTIC DATA=work.sds MODEL success = neuroticism extraversion openness agreeableness conscientiousness;` |
| **Decision Tree ML** | `sklearn.tree.DecisionTreeClassifier` | `PROC HPSPLIT` or `SAS Enterprise Miner Decision Tree Node` |
| **Random Forest ML** | `sklearn.ensemble.RandomForestClassifier` | `PROC HPFOREST` or `SAS Viya Forest Action` |
| **Cross-Validation** | `StratifiedKFold(n_splits=5)` | `SAS Enterprise Miner Data Partition Node (Stratified 80/20 or K-Fold)` |
| **Model Assessment** | `roc_auc_score`, `confusion_matrix` | `PROC LOGISTIC ROC statement`, `SAS Model Studio Model Comparison` |
