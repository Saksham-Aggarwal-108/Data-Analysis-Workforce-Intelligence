# Final Jury Q&A Reference Guide

**Project**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  

---

### 1. Why didn't you merge the datasets?
*Answer*: The 4 datasets describe distinct observation entities (job postings, junior competency evaluations, senior personality profiles) without a common unique key. Merging them row-wise would introduce synthetic, ungrounded associations. We preserve analytical isolation and synthesize findings at the Workforce Strategy layer.

### 2. Why is the ROC-AUC so high (0.9928)?
*Answer*: The SDS sample ($N=161$) exhibits strong separation between high and low success classes across extreme poles of Conscientiousness ($d=+2.05$) and Neuroticism ($d=-1.97$). Note that 0.9928 is cross-validated ROC-AUC, not accuracy.

### 3. Isn't this overfitting?
*Answer*: We conducted 50-fold Repeated Stratified CV ($0.9957 \pm 0.0080$) and Grouped-ID CV ($0.9927 \pm 0.0094$). Constraining tree depth (`max_depth=5`) prevents memorization while maintaining generalization across folds.

### 4. Why Random Forest?
*Answer*: Random Forest handles moderate sample sizes robustly, handles non-linear trait interactions without parametric assumptions, and provides interpretable feature importances (Gini + Permutation).

### 5. Why not neural networks?
*Answer*: With $N=161$, deep learning architectures would severely overfit, lack statistical interpretability, and require arbitrary hyperparameter tuning without validation benefits.

### 6. Why use personality data?
*Answer*: The SDS dataset was provided as part of the hackathon problem statement to explore senior professional success factors. We use it to uncover organizational behavioral traits.

### 7. Is personality causal?
*Answer*: No. Our findings represent observed statistical associations within the supplied sample, not direct causal mechanisms or deterministic human predictions.

### 8. Can companies use this for hiring?
*Answer*: Absolutely not. We explicitly label outputs as "ANALYTICAL ESTIMATE — NOT A HIRING SCORE" and enforce guardrails prohibiting automated hiring or candidate rejection.

### 9. What happens with a new candidate?
*Answer*: Career AI parses candidate experience/skills from their resume, matches them against observed market demand, calculates skill gaps, and generates an adaptive learning roadmap.

### 10. What is the innovation?
*Answer*: Connecting 4 heterogeneous evidence layers through a unified intelligence platform without invalid row-level merges, backed by evidence provenance and Responsible AI guardrails.

### 11. What is the biggest limitation?
*Answer*: Sample size ($N=161$ for SDS) and observational nature of job posting data. Operational deployment requires broader external validation.

### 12. Why only 161 observations?
*Answer*: $N=161$ is the complete, official sample size provided in `SDS Personality Traits.xlsx`.

### 13. Why not collect more data?
*Answer*: Hackathon rules require grounding analysis strictly in the provided datasets without introducing unverified external data sources.

### 14. What does Career AI add?
*Answer*: It operationalizes workforce market demand into individual capability development, candidate role matching, skill gap discovery, and grounded AI coaching.

### 15. How is Career AI different from ChatGPT?
*Answer*: Career AI relies on deterministic skill taxonomies, exact candidate evidence extraction, and grounded dataset provenance. It returns "Insufficient evidence" rather than hallucinating market statistics.

### 16. Where does your market data come from?
*Answer*: From `DataScience Jobs.csv` ($1,602$ records) and `Analytics Jobs.csv` ($15,840$ records).

### 17. Why are there 17,443 raw postings?
*Answer*: $1,602 + 15,841 = 17,443$ raw rows across the two market datasets.

### 18. Why is one Analytics row excluded?
*Answer*: One raw row in `Analytics Jobs.csv` contained a null `key_skills` string, leaving $15,840$ clean analytical rows ($99.99\%$ retention rate).

### 19. How do you prevent hallucination?
*Answer*: System prompts inject candidate skills, target role gaps, and observed market provenance directly into context. Prompt instructions force a structured JSON fallback on missing evidence.

### 20. What happens if the LLM is unavailable?
*Answer*: Career Copilot falls back on a deterministic, template-based response engine that presents gap analysis and recommended projects without crashing.

### 21. How does the skill-gap score work?
*Answer*: Gap score equals target role skill weight minus candidate verified proficiency, categorized into Critical Gap, Partial Alignment, or Verified Strength.

### 22. How is proficiency inferred?
*Answer*: Inferred on a 1–5 scale from evidence context (`PROFESSIONAL` $= 4-5$, `PROJECT` $= 3$, `DEMONSTRATED` $= 2-3$, `COURSEWORK` $= 1-2$).

### 23. How does the roadmap adapt?
*Answer*: Milestone durations scale dynamically based on weekly available learning hours, skill skipping, and user-selected portfolio projects.

### 24. What does Workforce Strategy actually produce?
*Answer*: Strategic talent recommendations balancing market demand, entry-level skill gaps, and senior success indicators for HR leaders.

### 25. What would you do with more time?
*Answer*: Conduct longitudinal validation studies, expand skill taxonomy embeddings, and integrate real-time market API feeds.
