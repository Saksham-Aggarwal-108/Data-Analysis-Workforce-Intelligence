# Career AI 5-Stage End-to-End User Journey Specification

## 1. Journey Architecture Overview

The **Career AI Command Center** structures the user experience into a 5-stage workflow:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      5-STAGE CAREER AI USER JOURNEY                     │
├─────────────────────────────────────────────────────────────────────────┤
│ STAGE 1: PROFILE & RESUME INTELLIGENCE                                  │
│   - Resume Upload (PDF/DOCX/TXT) or Manual Profile Entry                │
│   - Skill Extraction & Context Evidence Classification                  │
│   - Profile Completeness Score & Experience Alignment Status            │
├─────────────────────────────────────────────────────────────────────────┤
│ STAGE 2: DATASET PROVENANCE & MARKET GROUNDING                          │
│   - Dataset Lineage Audit (17,443 Raw -> 17,442 Usable Analytical Rows) │
│   - Empirical Market Salary Bounds & Top Demanded Skills                │
├─────────────────────────────────────────────────────────────────────────┤
│ STAGE 3: VISUAL CAREER PATH GRAPH (DAG)                                 │
│   - Visual Node Graph connecting Current Profile to Target Roles        │
│   - Role Alignment % Badges and Experience Range Indicators             │
├─────────────────────────────────────────────────────────────────────────┤
│ STAGE 4: EXPLAINABLE GAP ANALYSIS & DEMAND MATRIX                       │
│   - Core Skill Coverage Ratio: N / M = X%                               │
│   - Market Demand x Your Skills 2D Scatter Quadrant Matrix              │
│   - Deterministic Ranked Skill Gap Breakdown Table                      │
├─────────────────────────────────────────────────────────────────────────┤
│ STAGE 5: PERSONALIZED ROADMAP & COPILOT CHAT                            │
│   - Time-Scaled Learning Phases with "Why Scheduled Now" Callouts       │
│   - Skipped Skills Overrides & Priority Mode Adjustments                │
│   - Add-to-Roadmap Portfolio Project Recommender                        │
│   - Context-Grounded AI Career Copilot Chat Drawer                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stage-by-Stage Functional Specifications

### Stage 1: Profile & Resume Intelligence
* **Inputs**: PDF, DOCX, or TXT resume document, or manual skill input tags.
* **Extraction**: Text is analyzed against 120+ canonical skill aliases and sentence context keywords.
* **Outputs**: CandidateProfile JSON object with `evidence_level` (`PROFESSIONAL`, `PROJECT`, `COURSEWORK`, `INTEREST`), `inferred_level` (1-5), and `profile_completeness_pct`.

### Stage 2: Market Evidence Grounding
* **Dataset Audit**: Displays 17,443 raw job postings $\rightarrow$ 17,442 usable clean analytical rows ($99.99\%$ retention).
* **Metrics**: Displays overall average salary ($14.85$ Lakhs), bounds ($3.0\text{L} - 50.0\text{L}$), and top skill frequencies.

### Stage 3: Visual Career Path Graph
* **Visual Graph**: DAG nodes connecting candidate profile state to target roles (`Data Analyst`, `Data Scientist`, `ML Engineer`, `Backend Developer`, `AI Engineer`, `Data Engineer`).

### Stage 4: Explainable Gap Analysis & Matrix
* **Core Skill Coverage**: `$N / M = X\%$` ratio displaying matched core skills vs total required core skills.
* **Market $\times$ Skills Matrix**: 2D scatter matrix displaying skills across 4 quadrants (*Strong Advantage*, *Learn Next*, *Maintain*, *Low Priority*).

### Stage 5: Personalized Learning Roadmap & Copilot
* **Dynamic Roadmaps**: Scaled timeline durations based on weekly study hours ($2 - 40$ hrs/wk) and priority mode (*Standard*, *Accelerated*, *Deep Mastery*).
* **Copilot Chat**: Structured JSON responses providing context-aware guidance with zero hallucination.
