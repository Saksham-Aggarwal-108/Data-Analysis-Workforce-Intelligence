from typing import Dict, Any, List, Optional
from app.career.project_recommender import ProjectRecommendationEngine
from app.career.taxonomy import SkillTaxonomy

class CareerRoadmapEngine:
    """
    Dynamic Career Roadmap Engine.
    Constructs a structured roadmap object tailored to candidate skill gaps,
    target role requirements, weekly study hours, and user adaptation overrides.
    Enhanced for Part 8 & 9 (Roadmap Personalization & Adaptation).
    """

    @classmethod
    def generate_roadmap(
        cls,
        gap_analysis: Dict[str, Any],
        weekly_hours: int = 10,
        career_goal: str = "Transition to target role",
        skipped_skills: Optional[List[str]] = None,
        priority_mode: str = "standard"  # 'standard', 'accelerated', 'deep_mastery'
    ) -> Dict[str, Any]:
        target_role = gap_analysis["target_role"]
        coverage_pct = gap_analysis["role_fit_coverage_pct"]
        all_ranked_gaps = gap_analysis["ranked_skill_gaps"]

        skipped_set = set([s.upper() for s in (skipped_skills or [])])
        ranked_gaps = [g for g in all_ranked_gaps if g["skill_key"].upper() not in skipped_set]

        # Calculate time multiplier based on weekly hours
        time_mult = max(0.4, round(10 / max(1, weekly_hours), 2))
        if priority_mode == "accelerated":
            time_mult = round(time_mult * 0.75, 2)
        elif priority_mode == "deep_mastery":
            time_mult = round(time_mult * 1.3, 2)

        phases: List[Dict[str, Any]] = []
        phase_counter = 1

        # Phase 1: Core Foundations (if any foundational gap exists)
        foundation_gaps = [g for g in ranked_gaps if g["category"] in ["Programming", "Data Analysis & Processing", "Databases", "Statistics & Mathematics"]]
        if foundation_gaps:
            skills_in_phase = [g["display_name"] for g in foundation_gaps[:3]]
            dur = max(1, round(3 * time_mult))
            phases.append({
                "phase_number": phase_counter,
                "title": f"Phase 0{phase_counter}: Core Foundations & Technical Prerequisites",
                "duration_weeks": dur,
                "duration_label": f"{dur} Weeks ({weekly_hours} hrs/wk)",
                "objective": f"Solidify foundational prerequisites required for {target_role}.",
                "why_now": f"Foundational prerequisite skills ({', '.join(skills_in_phase)}) must be mastered first before advancing to complex modeling or deployment.",
                "why_it_matters": f"Essential technical baseline ({', '.join(skills_in_phase)}) to ensure smooth progress in advanced topics.",
                "skills": skills_in_phase,
                "prerequisites": ["Basic Quantitative / Programming Literacy"],
                "concepts_to_learn": [
                    "Data structures and vector manipulation",
                    "SQL queries, joins, and aggregations",
                    "Descriptive statistics and probability distributions"
                ],
                "practice_tasks": [
                    "Complete 20 LeetCode / HackerRank SQL data manipulation queries",
                    "Perform exploratory data analysis on a public tabular dataset",
                    "Compute summary statistics and hypothesis tests in Python"
                ],
                "project": {
                    "title": "Exploratory Dataset Cleaning & SQL Analytics Suite",
                    "deliverables": ["GitHub repository with reproducible EDA notebook and SQL queries"],
                    "skills_addressed": skills_in_phase
                },
                "validation_checkpoint": "Can write complex SQL JOINs and execute data cleaning pipelines in Python without assistance."
            })
            phase_counter += 1

        # Phase 2: Core Machine Learning & Domain Modeling
        ml_gaps = [g for g in ranked_gaps if g["category"] in ["Machine Learning", "Deep Learning", "Generative AI & LLMs", "Data Engineering"]]
        if ml_gaps:
            skills_in_phase = [g["display_name"] for g in ml_gaps[:3]]
            dur = max(2, round(4 * time_mult))
            why_now_text = "Foundations are now covered; this phase addresses your highest priority critical skill gaps." if foundation_gaps else f"Your profile has foundational skills; you are ready to directly tackle core gaps in {', '.join(skills_in_phase)}."
            phases.append({
                "phase_number": phase_counter,
                "title": f"Phase 0{phase_counter}: Advanced Core Capabilities for {target_role}",
                "duration_weeks": dur,
                "duration_label": f"{dur} Weeks ({weekly_hours} hrs/wk)",
                "objective": f"Master core algorithms, frameworks, and domain patterns required for {target_role}.",
                "why_now": why_now_text,
                "why_it_matters": f"Addresses critical gaps ({', '.join(skills_in_phase)}) that directly impact technical interview evaluation.",
                "skills": skills_in_phase,
                "prerequisites": ["Phase 01 Foundations"] if foundation_gaps else ["Basic Python & Data Analysis"],
                "concepts_to_learn": [
                    "Supervised and unsupervised machine learning algorithms",
                    "Fold-isolated cross-validation and hyperparameter tuning",
                    "Feature engineering, feature importance, and model evaluation metrics"
                ],
                "practice_tasks": [
                    "Build a 5-fold cross-validated Random Forest and Logistic Regression pipeline",
                    "Audit model feature importance using SHAP and Permutation drops",
                    "Handle imbalanced datasets using StratifiedKFold and SMOTE"
                ],
                "project": {
                    "title": "Cross-Validated Predictive Modeling Engine",
                    "deliverables": ["End-to-end trained model pipeline with explainability artifacts and performance report"],
                    "skills_addressed": skills_in_phase
                },
                "validation_checkpoint": "Demonstrates clear understanding of train/val leakage prevention and model evaluation."
            })
            phase_counter += 1

        # Phase 3: Production & Deployment
        prod_gaps = [g for g in ranked_gaps if g["category"] in ["Cloud Computing", "DevOps & Systems", "MLOps", "Web Development"]]
        if prod_gaps or not phases:
            skills_in_phase = [g["display_name"] for g in prod_gaps[:3]] if prod_gaps else ["FastAPI", "Docker", "Git"]
            dur = max(1, round(3 * time_mult))
            phases.append({
                "phase_number": phase_counter,
                "title": f"Phase 0{phase_counter}: Production Serving, MLOps & Containerization",
                "duration_weeks": dur,
                "duration_label": f"{dur} Weeks ({weekly_hours} hrs/wk)",
                "objective": f"Package and serve models/analytics as production-ready microservices.",
                "why_now": "Core domain algorithms are complete; packaging for deployment is the final step for production readiness.",
                "why_it_matters": "Distinguishes junior practitioners from production engineers who can ship live systems.",
                "skills": skills_in_phase,
                "prerequisites": [f"Phase 0{phase_counter-1} Modeling"],
                "concepts_to_learn": [
                    "Containerization using Docker and multi-stage builds",
                    "Asynchronous REST API endpoint construction using FastAPI",
                    "Model tracking and monitoring using MLflow or Prometheus"
                ],
                "practice_tasks": [
                    "Containerize a Python application into a Docker image (<200MB)",
                    "Expose a predict endpoint with Pydantic payload validation",
                    "Set up GitHub Actions CI/CD workflow for automated testing"
                ],
                "project": {
                    "title": "Containerized Production Prediction API",
                    "deliverables": ["Dockerized FastAPI service with OpenAPI documentation and test coverage"],
                    "skills_addressed": skills_in_phase
                },
                "validation_checkpoint": "App runs cleanly in container with validated API responses."
            })
            phase_counter += 1

        # Phase 4: Capstone & Interview Preparation
        dur_cap = max(1, round(2 * time_mult))
        phases.append({
            "phase_number": phase_counter,
            "title": f"Phase 0{phase_counter}: Portfolio Capstone & Technical Interview Preparation",
            "duration_weeks": dur_cap,
            "duration_label": f"{dur_cap} Weeks ({weekly_hours} hrs/wk)",
            "objective": f"Build a public capstone project and rehearse role-specific technical interviews for {target_role}.",
            "why_now": "All technical skill gaps are now systematically bridged; final phase synthesizes portfolio evidence.",
            "why_it_matters": "Transforms individual skill proficiencies into a coherent public engineering portfolio.",
            "skills": ["Portfolio Development", "System Design", "Interview Practice"],
            "prerequisites": ["All prior roadmap phases"],
            "concepts_to_learn": [
                "Technical architecture documentation and system design",
                "Mock technical interviews and coding challenge practice",
                "Resume alignment and behavioral interview storytelling"
            ],
            "practice_tasks": [
                "Record a 3-minute video walkthrough of your capstone project",
                "Solve 10 mock system design / SQL / ML algorithm interview questions",
                "Align GitHub repositories with clear READMEs and architecture diagrams"
            ],
            "project": {
                "title": f"End-to-End {target_role} Enterprise Capstone",
                "deliverables": ["Public GitHub repository, live web application / API demo, and technical report"],
                "skills_addressed": ["System Design", "Portfolio Presentation"]
            },
            "validation_checkpoint": "Portfolio demonstrates complete production capability for target role."
        })

        total_weeks = sum(p["duration_weeks"] for p in phases)
        months = round(total_weeks / 4.33, 1)

        readiness_summary = f"Your candidate profile currently matches {coverage_pct}% of the requirements for {target_role}. With {weekly_hours} hours per week of focused study ({priority_mode.upper()} mode), your personalized roadmap will take approximately {total_weeks} weeks ({months} months) to achieve full production readiness."

        # Recommend Projects specifically matching gaps
        rec_engine = ProjectRecommendationEngine()
        portfolio_projects = rec_engine.get_recommendations_for_gaps(ranked_gaps)

        return {
            "target_role": target_role,
            "readiness_summary": readiness_summary,
            "total_roadmap_weeks": total_weeks,
            "estimated_total_weeks": total_weeks,
            "estimated_total_months": months,
            "weekly_hours": weekly_hours,
            "weekly_hours_allocated": weekly_hours,
            "priority_mode": priority_mode,
            "skipped_skills": list(skipped_set),
            "priorities": [g["display_name"] for g in ranked_gaps[:5]],
            "phases": phases,
            "portfolio_projects": portfolio_projects,
            "next_actions": [
                f"Begin Phase 01: Focus on {phases[0]['skills'][0] if phases[0]['skills'] else 'Core Foundations'}",
                f"Allocate {weekly_hours} hours this week for learning and practical coding exercises",
                "Track progress against validation checkpoints at the end of each phase"
            ]
        }
