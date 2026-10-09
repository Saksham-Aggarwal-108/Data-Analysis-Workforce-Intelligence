# DETERMINISTIC SKILL GAP ENGINE DOCUMENTATION

**Project Title**: Data Science Workforce Intelligence  
**Module**: Skill Gap Engine  
**Date**: October 8, 2026  

---

## 1. DETERMINISTIC MATHEMATICAL FORMULATION

Unlike LLM-based systems that hallucinate numerical gap scores, the **Deterministic Skill Gap Engine** calculates gaps mathematically using candidate skill levels ($L_{\text{user}} \in [0, 5]$) and role requirement levels ($L_{\text{required}} \in [1, 5]$):

$$\text{Gap} = \max(0, L_{\text{required}} - L_{\text{user}})$$

### Role Fit Alignment Coverage Percentage:
$$\text{Role Fit Coverage \%} = \left( \frac{\sum_{i \in \text{Skills}} \min(L_{\text{user}, i}, L_{\text{required}, i}) \cdot w_i}{\sum_{i \in \text{Skills}} L_{\text{required}, i} \cdot w_i} \right) \times 100$$

where weight $w_i = 3$ for `critical` importance, $w_i = 2$ for `high` importance, and $w_i = 1$ for `medium` importance.

---

## 2. SKILL GAP PRIORITY CLASSIFICATION

Gaps are categorized into priority tiers:
1. **Critical Gap**: Required level $> 0$, candidate level $= 0$, and skill importance is `critical` or `high`.
2. **Partial Match**: Candidate level $> 0$, but required level $> L_{\text{user}}$.
3. **Strong Match**: Candidate level $\ge L_{\text{required}}$ ($\text{Gap} = 0$).

---

## 3. RESPONSIBLE AI DISCLAIMER

- Role Fit Alignment Coverage Percentage represents **skill requirement coverage**, NOT hiring probability.
- It is an exploratory career development metric designed to guide upskilling priorities.
