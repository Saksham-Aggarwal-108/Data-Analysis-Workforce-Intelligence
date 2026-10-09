# Final 60-Second Model Explanation

**Project**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  

---

## 60-Second Spoken Script

> *"Our primary analytical model evaluates senior professional success using the SDS Personality Traits dataset ($N=161$). We evaluate five standardized inputs—Neuroticism, Extraversion, Openness, Agreeableness, and Conscientiousness—against a binary high/low success target.*
> 
> *To prevent data leakage, preprocessing feature scaling occurs strictly within each cross-validation fold. We selected a Random Forest Classifier ($n\_estimators=100$, $max\_depth=5$, $random\_state=42$) because it captures non-linear interactions without overfitting on small sample sizes.*
> 
> *In 5-fold stratified cross-validation, the model achieved an ROC-AUC of 0.9928 ± 0.0048. To rigorously stress-test this result, we conducted Grouped-ID CV ($0.9927 \pm 0.0094$) to prevent repeated-subject leakage, and 50-fold Repeated CV ($0.9957 \pm 0.0080$). Feature importance confirms Conscientiousness ($d=+2.05$, $\text{OR}=8.56$) as the top positive predictor, and Neuroticism ($d=-1.97$) as negative.*
> 
> *Crucially, this is an exploratory model on a benchmark sample. We explicitly state: 'ANALYTICAL ESTIMATE — NOT A HIRING SCORE.' It is designed for talent coaching and capability planning, not automated employment filtering."*
