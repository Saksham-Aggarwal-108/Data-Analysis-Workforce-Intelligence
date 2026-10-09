# CAREER AI DATA FLOW & API SPECIFICATION

**Project Title**: Data Science Workforce Intelligence  
**Module**: Career AI Data Flow  
**Date**: October 8, 2026  

---

## 1. END-TO-END DATA FLOW DIAGRAM

```
  [User Action]
       │
       ├── Upload Resume (.pdf, .docx, .txt)  ──► POST /api/career/parse-resume
       │                                               │
       ├── Manual Skill Entry / Target Role   ──► POST /api/career/profile
                                                       │
                                                       ▼
                                           ┌───────────────────────┐
                                           │ Skill Taxonomy Engine │
                                           └───────────┬───────────┘
                                                       │
                                                       ▼
                                           ┌───────────────────────┐
                                           │ Skill Gap Engine      │
                                           │ (Deterministic Match) │
                                           └───────────┬───────────┘
                                                       │
                                                       ▼
                                           ┌───────────────────────┐
                                           │ Market Evidence Layer │
                                           │ (17,443 Job Postings) │
                                           └───────────┬───────────┘
                                                       │
                                                       ▼
                                           ┌───────────────────────┐
                                           │ Dynamic Roadmap Engine│
                                           │ & Project Recommender │
                                           └───────────┬───────────┘
                                                       │
                                                       ▼
                                           ┌───────────────────────┐
                                           │ Interactive Copilot   │
                                           │ (POST /api/career/copilot)
                                           └───────────────────────┘
```

---

## 2. API ENDPOINTS SUMMARY

| HTTP Method | API Route | Description / Purpose | Input Payload | Output Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/career/parse-resume` | Safe resume text & skill parsing | Multipart `file` | Structured `CandidateProfile` |
| `POST` | `/api/career/profile` | Manual profile creation | `ManualProfileInput` | Normalized `CandidateProfile` |
| `GET` | `/api/career/roles` | Canonical target role definitions | None | List of `CareerRole` objects |
| `POST` | `/api/career/match` | Role fit matching or discovery ranking | `MatchRequestInput` | Role alignment matrix |
| `POST` | `/api/career/skill-gap` | Deterministic gap computation | `MatchRequestInput` | `SkillGapAnalysis` object |
| `POST` | `/api/career/roadmap` | Personalized multi-phase roadmap | `RoadmapRequestInput` | `CareerRoadmap` object |
| `POST` | `/api/career/copilot` | Interactive Q&A chat guidance | `CopilotQueryInput` | `CopilotChatResponse` |
| `GET` | `/api/career/market` | Dataset-grounded market overview | None | Market prevalence overview |
