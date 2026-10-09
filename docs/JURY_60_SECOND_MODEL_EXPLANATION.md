# 60-SECOND MODEL EXPLANATION GUIDE

**Project Title**: Data Science Workforce Intelligence  
**Team**: The Processors  

---

## 1. PLAIN LANGUAGE VERSION (FOR NON-TECHNICAL JUDGES)

> *"We use the SDS dataset of 161 senior data scientists to understand how five standard personality traits — Neuroticism, Extraversion, Openness, Agreeableness, and Conscientiousness — relate to top job performance.*  
> *A Random Forest model analyzes these five trait scores and classifies candidates into high or low success with high accuracy.*  
> *We tested it using 5-fold cross-validation and 50-fold repeated sampling to make sure the results are steady and not a fluke.*  
> *The model finds strong statistical associations — showing Conscientiousness as the strongest positive indicator — but it does not claim personality causes success. It is designed for talent coaching, not automated hiring filters."*

---

## 2. TECHNICAL VERSION (FOR DATA SCIENCE / SAS JUDGES)

> *"Our primary model is a Random Forest Classifier (`n_estimators=100`, `max_depth=5`) trained on the SDS dataset ($N=161$) using five Big Five predictor dimensions.*  
> *Preprocessing uses `StandardScaler` fitted strictly inside training folds of a 5-Fold Stratified Cross-Validation pipeline.*  
> *The model achieves an out-of-fold ROC-AUC of **0.9928 ± 0.0048** (Accuracy = `0.9627`, Precision = `0.9548`, Recall = `0.9773`, F1 = `0.9654`).*  
> *Grouped-by-Candidate-ID sensitivity analysis yields an identical ROC-AUC of **0.9927 ± 0.0094** ($\Delta = 0.0001$), proving candidate ID duplication causes zero data leakage. 50-Fold Repeated CV yields **0.9957 ± 0.0080**.*  
> *Conscientiousness demonstrates the highest Gini ($0.3644$) and Permutation drop ($0.1429$), with a Logistic Odds Ratio of $8.56$ ($d = +2.05$, $p < 0.0001$). VIF diagnostics ($< 2.5$) confirm zero harmful multicollinearity."*
