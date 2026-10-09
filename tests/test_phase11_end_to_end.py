import unittest
import json
import sys
import os

# Ensure backend path is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.career.taxonomy import SkillTaxonomy
from app.career.resume_parser import ResumeParser
from app.career.market_service import CareerMarketEvidenceService
from app.career.role_intelligence import RoleIntelligenceSystem
from app.career.skill_gap_engine import DeterministicSkillGapEngine
from app.career.roadmap_engine import CareerRoadmapEngine
from app.career.project_recommender import ProjectRecommendationEngine
from app.career.copilot_llm import CareerCopilotService
from app.analysis.market import MarketIntelligence
from app.analysis.skills import SkillIntelligence
from app.ingestion import DataIngestion
from app.quality import DataQualityEngine
from app.preprocessing import DataPreprocessor

class TestPhase11EndToEndUserJourney(unittest.TestCase):
    """
    Phase 11 Complete End-to-End Integration & User Journey Test Suite.
    Verifies data flow integrity across all 15 stages of the Career AI engine.
    """

    @classmethod
    def setUpClass(cls):
        """Loads backend analytical datasets and initializes services."""
        cls.ingestion = DataIngestion()
        cls.ingestion.load_all()
        cls.quality = DataQualityEngine()
        cls.preprocessor = DataPreprocessor(cls.quality)
        
        cls.df_market = cls.preprocessor.clean_datascience_jobs(cls.ingestion.raw_data['market'])
        cls.df_skills = cls.preprocessor.clean_analytics_jobs(cls.ingestion.raw_data['skills'])
        
        cls.market_layer = MarketIntelligence(cls.df_market)
        cls.skills_layer = SkillIntelligence(cls.df_skills)
        cls.market_service = CareerMarketEvidenceService(cls.market_layer, cls.skills_layer)

    def test_complete_career_ai_user_journey(self):
        """
        Executes the full candidate journey:
        RESUME -> PARSE -> PROFILE -> EVIDENCE -> ROLES -> MATCH -> GAP -> MATRIX -> ROADMAP -> ADAPTATION -> PROJECT -> COPILOT
        """
        # 1. Raw Resume Input
        sample_resume_text = """
        JANE DOE - DATA SCIENTIST & ML ENGINEER
        Contact: jane.doe@example.com | 555-0199
        
        SUMMARY:
        Results-driven Data Scientist with 4 years of experience building machine learning models in Python and SQL.
        
        EXPERIENCE:
        Senior Data Analyst | Enterprise Data Corp (2020 - Present)
        - Developed customer churn classification models using Scikit-Learn and Python, improving retention by 18%.
        - Wrote complex SQL queries in PostgreSQL to analyze 100M+ rows of user event analytics.
        - Deployed REST APIs using FastAPI and Docker for real-time model serving.

        EDUCATION:
        B.S. in Computer Science | State University (2016 - 2020)
        Coursework: Machine Learning, Statistics, Database Systems.
        """

        # 2. Text Parsing & Profile Extraction
        profile = ResumeParser.parse_profile(sample_resume_text, filename="jane_doe_resume.txt")
        self.assertEqual(profile["candidate"]["experience_years"], 4)
        self.assertGreater(profile["total_skills_count"], 5)
        self.assertIn("PYTHON", [s["key"] for s in profile["skills"]])

        # 3. Context Evidence & Proficiency Verification
        skills_map = {s["key"]: s for s in profile["skills"]}
        self.assertIn(skills_map["PYTHON"]["evidence_level"], ["PROFESSIONAL", "DEMONSTRATED"])
        self.assertGreaterEqual(skills_map["PYTHON"]["level"], 3)

        # 4. Dataset Lineage & Market Evidence Lookup
        provenance = self.market_service.get_dataset_provenance_audit()
        self.assertIn(provenance["summary"]["total_analytical_evidence_rows"], [17442, 17443])
        
        python_market = self.market_service.get_skill_market_value("PYTHON")
        self.assertEqual(python_market["evidence_type"], "OBSERVED_DATASET")

        # 5. Role Discovery (All Roles Ranking)
        discovery_roles = DeterministicSkillGapEngine.rank_all_roles_discovery(profile["skills"], experience_years=4)
        self.assertGreaterEqual(len(discovery_roles), 8)
        self.assertIn("role_fit_alignment_pct", discovery_roles[0])

        # 6. Target Role Selection & Gap Analysis
        target_role = RoleIntelligenceSystem.get_role("DATA_SCIENTIST")
        gap_analysis = DeterministicSkillGapEngine.calculate_gaps(profile["skills"], target_role, experience_years=4)
        
        self.assertIn("explainable_breakdown", gap_analysis)
        breakdown = gap_analysis["explainable_breakdown"]
        self.assertGreaterEqual(breakdown["matched_core_count"], 1)

        # 7. Personalized Roadmap Generation
        roadmap_10h = CareerRoadmapEngine.generate_roadmap(gap_analysis, weekly_hours=10)
        self.assertGreaterEqual(len(roadmap_10h["phases"]), 3)

        # 8. Dynamic User Adaptation Overrides
        roadmap_adapted = CareerRoadmapEngine.generate_roadmap(
            gap_analysis, 
            weekly_hours=20, 
            skipped_skills=["STATISTICS"], 
            priority_mode="accelerated"
        )
        self.assertLess(roadmap_adapted["total_roadmap_weeks"], roadmap_10h["total_roadmap_weeks"])
        self.assertIn("STATISTICS", roadmap_adapted["skipped_skills"])

        # 9. Portfolio Project Recommendation Engine
        rec_engine = ProjectRecommendationEngine()
        recommended_projects = rec_engine.get_recommendations_for_gaps(gap_analysis["ranked_skill_gaps"])
        self.assertGreater(len(recommended_projects), 0)

        # 10. Context-Grounded Copilot Query
        copilot = CareerCopilotService(self.market_service)
        copilot_response = copilot.answer_query(
            user_query="Why should I learn Docker for my role?",
            profile=profile,
            target_role_data=target_role,
            gap_analysis=gap_analysis,
            roadmap=roadmap_adapted
        )

        self.assertIn("answer", copilot_response)
        self.assertIn("evidence", copilot_response)
        self.assertIn("reasoning_summary", copilot_response)
        self.assertGreater(len(copilot_response["evidence"]), 0)

if __name__ == "__main__":
    unittest.main()
