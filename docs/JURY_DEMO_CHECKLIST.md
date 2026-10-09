# 7-MINUTE JURY DEMONSTRATION SEQUENCE & CHECKLIST
**Data Science Workforce Intelligence — SAS CU Hackathon (Team The Processors)**

---

## 1. Pre-Demo Verification Checklist

- [ ] **Backend Running**: FastAPI active on `http://127.0.0.1:8000` (`python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`).
- [ ] **Frontend Running**: React Vite active on `http://localhost:3000` (`npm run dev` or built bundle).
- [ ] **Data Files Present**: All 4 raw datasets in `./data/`.
- [ ] **API Health Check**: `http://127.0.0.1:8000/api/health` returns `[Status: Online]`.
- [ ] **Browser Zoom**: Set to $100\%$ at $1920\times1080$ or $1440\times900$ resolution.
- [ ] **Console Logs**: Verify zero red errors in DevTools.
- [ ] **Offline Readiness**: Local execution does NOT require external internet APIs.
- [ ] **Responsible AI Notice**: Verify `EthicalBanner` is visible.

---

## 2. 7-Minute Step-by-Step Presentation Script

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TIME   │ PAGE / ROUTE        │ KEY DEMONSTRATION ACTION & PRESENTER SCRIPT              │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 00:00  │ Executive Overview  │ Open http://localhost:3000. Point out project title,   │
│   -    │ (/)                 │ team name ("Team The Processors"), and dataset badges. │
│ 00:45  │                     │ Click "View Methodology" to show 10-step protocol and  │
│        │                     │ explain: "We analyze 4 separate evidence layers        │
│        │                     │ without false row-level merges."                       │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 00:45  │ Market Intelligence │ Click "Market Intelligence" tab. Point to question      │
│   -    │ (/market)           │ titles: "Which roles show strongest advertised salary?" │
│ 01:45  │                     │ Show salary progression by min experience (4.2L to    │
│        │                     │ 28.5L) and top employer hiring volume.                  │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 01:45  │ Skill Intelligence  │ Click "Skill Intelligence" tab. Show top skills bar     │
│   -    │ (/skills)           │ chart (Python 48.2%, SQL 42.6%). Open "Deep Skill       │
│ 02:45  │                     │ Explorer", select "PYTHON", and explain within-band     │
│        │                     │ prevalence shifting across salary tiers (0-3L to 25-50L)│
│        │                     │ and alias mapping transparency table.                   │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 02:45  │ Junior Career       │ Click "Junior Career" tab. Show Cohen's d effect size   │
│   -    │ (/junior)           │ chart (AI/ML d=+1.12, Coding d=+0.94). Point out        │
│ 03:30  │                     │ explicit "Observed Association, Not Causation" notice.  │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 03:30  │ Senior Success      │ Click "Senior Success" tab. PRIMARY MODEL MOMENT.      │
│   -    │ (/senior)           │ Show Big Five trait separation (Conscientiousness d=+2.05│
│ 05:15  │                     │ Neuroticism d=-1.97). Show Welch's t-test with FDR      │
│        │                     │ q-value adjustments (q < 0.01). Point to primary model  │
│        │                     │ ROC-AUC (0.9928 +- 0.0048).                             │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 05:15  │ Model Lab           │ Click "Model Lab" tab. Show candidate model table       │
│   -    │ (/models)           │ (Random Forest vs Logistic Regression vs Decision Tree).│
│ 06:15  │                     │ Show Phase 2.1 Sensitivity Check: Grouped-by-ID CV      │
│        │                     │ (0.9927, Delta=0.0001) and 50-Fold Repeated CV (0.9957).│
│        │                     │ Show Gini vs Permutation importance & Odds Ratios.      │
│        │                     │ Click "View Evidence" on a card to show 13-field modal! │
├────────┼─────────────────────┼─────────────────────────────────────────────────────────┤
│ 06:15  │ Workforce Strategy  │ Click "Workforce Strategy" tab. Show 7-field decision   │
│   -    │ (/workforce)        │ cards prioritizing FINDING -> INTERPRETATION ->         │
│ 07:00  │                     │ IMPLICATION. Conclude with Responsible AI guidance.     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Post-Demo Backup Assets
- Backup Deck / PPT PDF
- `SAS_CU_Hackathon_The_Processors_Final_Approach_Note.pdf` / `.docx`
- Project Source Code ZIP Archive
