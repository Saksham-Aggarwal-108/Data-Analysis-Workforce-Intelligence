# CAREER AI & WORKFORCE COPILOT ARCHITECTURE

**Project Title**: Data Science Workforce Intelligence  
**Subtitle**: Connecting Market Demand, Skills, Compensation, and Professional Success  
**Team**: The Processors  
**Module**: Career AI Architecture (System 2)  
**Date**: October 8, 2026  

---

## 1. SYSTEM ARCHITECTURE & SEPARATION OF CONCERNS

The **Data Science Workforce Intelligence** platform maintains a strict separation between two independent analytical systems:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       WORKFORCE INTELLIGENCE PLATFORM                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           │                                                       │
           ▼                                                       ▼
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│ SYSTEM 1: ANALYTICAL MODEL LAB      │  │ SYSTEM 2: CAREER AI COPILOT         │
│ - SDS Personality Dataset (N=161)   │  │ - Resume Parsing (PDF, DOCX, TXT)   │
│ - Big Five Trait Inputs             │  │ - Skill Taxonomy Normalization      │
│ - Random Forest Classifier (Frozen) │  │ - Market Dataset Grounding          │
│ - ROC-AUC = 0.9928 +- 0.0048         │  │ - Deterministic Skill Gap Engine    │
│ - Exploratory Success Analysis      │  │ - Dynamic Personalized Roadmaps     │
│ - STRICT NON-HIRING BOUNDARY        │  │ - Interactive AI Copilot Assistant  │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

---

## 2. CAREER AI ENGINE MODULES

1. **Resume Parser** (`backend/app/career/resume_parser.py`):
   - Secure text extraction for `.pdf`, `.docx`, `.txt` files with file size validation ($\le 5 \text{ MB}$) and text sanitization.
   - Extracts structured `CandidateProfile` containing candidate name, experience years, skills, projects, and target role preferences.
2. **Skill Taxonomy & Normalization Engine** (`backend/app/career/taxonomy.py`):
   - Maps raw skill text aliases (e.g., `React.js`, `ReactJS` $\rightarrow$ `REACT`) into canonical keys across 15 standardized skill categories.
3. **Market Evidence Service** (`backend/app/career/market_service.py`):
   - Reuses `DataScience Jobs.csv` (1,602 rows) and `Analytics Jobs.csv` (15,841 rows) to supply observed market demand, skill prevalence, and salary bounding with source metadata (`Observed Dataset Evidence`).
4. **Role Intelligence System** (`backend/app/career/role_intelligence.py`):
   - Pre-defined target roles (Data Analyst, Business Analyst, Data Scientist, ML Engineer, AI Engineer, Generative AI Engineer, Data Engineer, MLOps Engineer, Backend Developer, etc.) with required skill levels, importance ratings, and transparent confidence labels.
5. **Deterministic Skill Gap Engine** (`backend/app/career/skill_gap_engine.py`):
   - Calculates mathematical skill gaps ($\text{gap} = \text{required\_level} - \text{current\_level}$) and computes transparent Role Fit Alignment coverage percentages ($0\text{--}100\%$) without LLM hallucination.
6. **Dynamic Roadmap Engine** (`backend/app/career/roadmap_engine.py`):
   - Generates multi-phase personalized learning roadmaps (Phase 01 Foundations $\rightarrow$ Phase 02 Core Capabilities $\rightarrow$ Phase 03 Serving/MLOps $\rightarrow$ Phase 04 Capstone) adjusted dynamically for weekly study hours.
7. **Project Recommendation Engine** (`backend/app/career/project_recommender.py`):
   - Recommends practical portfolio projects (e.g. End-to-End Customer Churn Prediction Engine, RAG Assistant, Containerized FastAPI Service) tailored directly to missing skill gaps.
8. **Career Copilot AI Service** (`backend/app/career/copilot_llm.py`):
   - Provides interactive chat guidance, explaining why specific skills should be learned now and offering contextual career advice grounded in dataset evidence. Operates deterministically if no external LLM key is configured.
