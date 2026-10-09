# RESUME INTELLIGENCE & PRIVACY GOVERNANCE

**Project Title**: Data Science Workforce Intelligence  
**Module**: Resume Intelligence  
**Date**: October 8, 2026  

---

## 1. RESUME PARSING SPECIFICATION

The **Resume Intelligence Engine** parses user resumes into structured `CandidateProfile` objects:

- **Supported Formats**: `.pdf`, `.docx`, `.txt`
- **File Validation**: Max file size 5 MB; extension white-listing.
- **Security & Privacy**:
  - In-memory text extraction without executing shell subprocesses.
  - Sanitization of unprintable control characters.
  - No permanent storage of raw resume files or personal identity details.
  - Parsing occurs locally within the FastAPI application session.

---

## 2. ENTITY EXTRACTION LOGIC

1. **Skills Extraction**: Reusable `SkillTaxonomy` alias mapping (over 120 raw skill patterns mapped to canonical keys across 15 categories).
2. **Experience Extraction**: Regex pattern matching for numerical year references (e.g. `3+ years experience`).
3. **Project Evidence**: Sentence extraction for project keywords (`built`, `developed`, `pipeline`, `model`, `dashboard`).
