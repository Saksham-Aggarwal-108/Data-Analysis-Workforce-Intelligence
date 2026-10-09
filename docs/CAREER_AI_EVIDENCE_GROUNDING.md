# Career AI Evidence Grounding & Market Provenance Standard

## 1. Overview
The **Career AI Evidence Grounding System** guarantees that all market demand figures, skill prevalence percentages, salary bounds, and role alignment metrics presented to the user originate directly from empirical backend calculations on the hackathon datasets (`DataScience Jobs.csv` and `Analytics Jobs.csv`).

The LLM layer is strictly prohibited from inventing market numbers, job posting counts, or salary ranges.

---

## 2. Evidence Provenance Metadata Standard
Every market claim returned by the backend API attaches a structured `provenance` metadata object:

```json
{
  "source_dataset": "Analytics Jobs.csv",
  "analytical_row_count": 15840,
  "metric": "Skill Occurrence Prevalence %",
  "calculation": "Count(Python mentions) / 15840 usable postings",
  "evidence_type": "OBSERVED_DATASET",
  "confidence": "HIGH"
}
```

### Taxonomy of Evidence Types:
1. **`OBSERVED_DATASET`**: Direct empirical count or percentage calculated from local dataset rows (e.g. Python prevalence = 68.4%).
2. **`DERIVED_FROM_DATASET`**: Calculated from dataset role co-occurrence metrics or mathematical skill gap algorithms.
3. **`EXTERNAL`**: Clearly labeled insights derived from external market research models when web search is enabled.
4. **`USER_PROVIDED`**: Explicit candidate input supplied in resume or manual profile form.
5. **`LLM_INTERPRETATION`**: Natural language synthesis of supplied evidence facts.

---

## 3. Dataset Audit & Row Retention Lineage
* **Raw Job Postings Total**: $17,443$ ($1,602$ DataScience Jobs + $15,841$ Analytics Jobs).
* **Excluded Rows**: $1$ row in Analytics Jobs due to missing null `key_skills`.
* **Total Clean Analytical Rows**: **$17,442$ Usable Postings** ($99.99\%$ retention rate).

---

## 4. Zero-Hallucination Copilot Enforcement
When a user asks a market or career query:
1. Candidate session profile, skill gaps, role requirements, and market prevalence values are serialized into the context payload.
2. If evidence for a specific queried skill is not present in local datasets, the system explicitly outputs:
   > *"Insufficient evidence in available project datasets."*
3. All Copilot chat responses include explicit dataset provenance badges in the UI.
