# Career AI Skill Evidence & Proficiency Model Specification

## 1. Overview
The **Skill Evidence & Proficiency Model** (Parts 4 & 5) eliminates arbitrary skill proficiency guessing by implementing a context-aware sentence analysis engine.

---

## 2. Skill Evidence Levels (Part 4)

Extracting a skill keyword from a resume document automatically classifies it into one of six evidence levels:

| Evidence Level | Sentence Context Keywords / Pattern | Confidence |
| :--- | :--- | :--- |
| **`PROFESSIONAL`** | Appears under work experience, job titles (Senior, Lead, Scientist), or repeated $\ge 3$ times | $0.95$ |
| **`PROJECT`** | Appears near "project", "developed", "built", "implemented", "deployed", "designed" | $0.90$ |
| **`DEMONSTRATED`** | Listed under technical skills or summary statement without specific project text | $0.85$ |
| **`COURSEWORK`** | Appears near "coursework", "academic", "class", "university", "studied", "degree" | $0.80$ |
| **`MENTIONED`** | Mentioned exactly once in skills list without supporting project detail | $0.75$ |
| **`INTEREST`** | Appears near "interested in", "learning", "looking to learn", "curious about" | $0.70$ |

---

## 3. Numerical Proficiency Inference Scale (Part 5)

Proficiency levels are mapped deterministically onto a 0 to 5 scale:

```
Level 0: Not Observed     (No evidence in candidate profile)
Level 1: Exposure         (Interests, curious about, introductory mention)
Level 2: Developing       (Coursework, academic projects, mentioned skills)
Level 3: Practical        (Project evidence, 1-2 years experience, demonstrated skills)
Level 4: Strong           (Professional experience >=2 yrs, multiple project implementations)
Level 5: Advanced         (Senior professional experience >=5 yrs, lead architecture evidence)
```

### Deterministic Inference Matrix:
```python
if evidence_level == "INTEREST":
    inferred_level = 1
elif evidence_level in ["COURSEWORK", "MENTIONED"]:
    inferred_level = 2
elif evidence_level == "PROJECT":
    inferred_level = 3 if experience_years < 2 else 4
elif evidence_level in ["PROFESSIONAL", "DEMONSTRATED"]:
    if experience_years >= 5:
        inferred_level = 5
    elif experience_years >= 2:
        inferred_level = 4
    else:
        inferred_level = 3
```

---

## 4. Transparency & Override Rules
* The user can manually adjust their proficiency level (L1 to L5) at any time in the UI.
* Manually set skills carry `evidence_level = "USER_PROVIDED"` and confidence $= 1.0$.
