# Career AI Explainable Role Matching & Gap Analysis Specification

## 1. Overview
The **Deterministic Skill Gap Engine** (Part 6) replaces black-box scoring algorithms with an auditable, explainable matching framework.

---

## 2. Mathematical Match Formulations

### A. Core Skill Coverage Ratio
$$\text{Core Coverage \%} = \frac{\sum \text{Matched Core Requirements}}{\text{Total Core Role Requirements}} \times 100$$

Example: 6 core skills matched out of 9 total core skills $= 66.7\%$.

### B. Weighted Role Alignment Score
$$\text{Role Fit Alignment \%} = \frac{\sum_{i=1}^{M} \min(c_i, r_i) \cdot w_i}{\sum_{i=1}^{M} r_i \cdot w_i} \times 100$$

Where:
* $c_i$ = Candidate skill level ($0$ to $5$) for requirement $i$.
* $r_i$ = Required skill level ($1$ to $5$) for requirement $i$.
* $w_i$ = Importance weight ($w_{\text{critical}} = 3$, $w_{\text{high}} = 2$, $w_{\text{medium}} = 1$).

### C. Deterministic Skill Gap Amount
$$\text{gap}_i = \max(0, r_i - c_i)$$

---

## 3. Explainable Output Breakdown Schema

For every evaluated role, the engine exposes:
1. `core_skill_coverage`: Text ratio `$N / M = X\%$`.
2. `strong_matches`: Skills where candidate level $\ge$ required level.
3. `partial_matches`: Skills where $0 < \text{candidate level} < \text{required level}$.
4. `critical_gaps`: Skills with zero candidate evidence and critical importance.
5. `transferable_skills`: Candidate skills not required by target role that add domain value.
6. `optional_matched_skills`: Preferred role skills present in candidate profile.
7. `experience_alignment_status`: Status label (`Aligned`, `Junior`, `Senior`).

---

## 4. Market Demand $\times$ Your Skills Quadrant Matrix (Part 15)

Skills are categorized into 4 quadrants based on market demand frequency and candidate proficiency:
* **Q1 (Top-Right): `STRONG ADVANTAGE`**: High Market Demand + High Candidate Skill.
* **Q2 (Top-Left): `LEARN NEXT (HIGH PRIORITY)`**: High Market Demand + Low Candidate Skill.
* **Q3 (Bottom-Left): `LOW PRIORITY`**: Low Market Demand + Low Candidate Skill.
* **Q4 (Bottom-Right): `MAINTAIN / TRANSFERABLE`**: Low Market Demand + High Candidate Skill.
