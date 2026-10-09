# FINAL PRESENTATION SPEAKER NOTES (10 SLIDES)
**Data Science Workforce Intelligence — SAS CU Hackathon (Team The Processors)**

---

### Slide 1: Title & Executive Problem
> *"Good morning judges. We are Team The Processors, presenting Data Science Workforce Intelligence. Organizations face a critical challenge: market job postings, skill requirements, early-career trajectory data, and senior success traits are scattered across fragmented silos. We built a unified platform to connect these evidence layers responsibly."*

### Slide 2: 5-Stage Analytical Architecture
> *"Instead of artificially merging four different datasets into one master table—which would manufacture synthetic records—we process four separate evidence layers: Market Intelligence, Skill Intelligence, Junior Career, Senior Success, and synthesize them into Workforce Strategy."*

### Slide 3: Data Quality & Preprocessing Lineage
> *"Our pipeline preserves 100% of raw dataset observations. We parsed regex salary ranges into Lakhs INR, tokenized 6,104 unique skill tokens, imputed missing job types to mode, and audited duplicate candidate IDs under grouped cross-validation."*

### Slide 4: Market Intelligence Layer (DataScience Jobs)
> *"Analyzing 1,602 market postings, advertised salary climbs monotonically from 4.2 Lakhs for entry roles up to 28.5 Lakhs for senior roles requiring 10+ years experience, establishing macro compensation baselines."*

### Slide 5: Skill Intelligence Layer (Analytics Jobs)
> *"Across 15,841 job postings, skill demand shifts across salary bands. Basic tools like Excel drop from 58% prevalence in entry 0-3L bands to 12% in senior 25-50L bands, whereas Python and Machine Learning rise to 65%."*

### Slide 6: Junior Career Intelligence Layer (JDS)
> *"On early-career candidates, AI/ML skills (d=+1.12) and coding skills (d=+0.94) show the strongest positive associations with high salary hike classification (>15% cutoff)."*

### Slide 7: Senior Success Intelligence Layer (SDS)
> *"On Senior Data Scientists, Big Five trait separation is clear: Conscientiousness (d=+2.05) and Emotional Stability (d=-1.97) strongly differentiate high-success cohorts, maintaining significance under Benjamini-Hochberg FDR adjustments (q < 0.01)."*

### Slide 8: Primary Machine Learning & Robustness Audit
> *"Our primary Random Forest model achieved a 5-Fold Stratified CV ROC-AUC of 0.9928. To test for data leakage, we performed Grouped-by-ID CV (0.9927, Delta=0.0001) and 50-Fold Repeated CV (0.9957), proving performance is stable and non-leaked."*

### Slide 9: Model Explainability & Evidence Mode
> *"We evaluate out-of-fold permutation importance drops, Logistic Odds Ratios (8.55 for Conscientiousness), and VIF (< 2.5). Every single finding is traceable through our interactive Evidence Mode drawer."*

### Slide 10: Workforce Strategy & Responsible AI
> *"All recommendations use 7-field decision cards. We strictly enforce Responsible AI: findings represent observational associations for executive coaching and talent strategy, NEVER automated candidate rejection filters. Thank you."*
