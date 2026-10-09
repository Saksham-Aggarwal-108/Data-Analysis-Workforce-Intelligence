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
from app.career.copilot_llm import CareerCopilotService
from app.analysis.market import MarketIntelligence
from app.analysis.skills import SkillIntelligence
from app.ingestion import DataIngestion
from app.quality import DataQualityEngine
from app.preprocessing import DataPreprocessor

class TestPhase10CareerAIValidation(unittest.TestCase):
    """
    Phase 10 Intelligence Validation & End-to-End Test Suite.
    Verifies Part 1 to Part 20 requirements.
    """

    @classmethod
    def setUpClass(cls):
        """Loads backend analytical datasets once for test suite."""
        cls.ingestion = DataIngestion()
        cls.ingestion.load_all()
        cls.quality = DataQualityEngine()
        cls.preprocessor = DataPreprocessor(cls.quality)
        
        cls.df_market = cls.preprocessor.clean_datascience_jobs(cls.ingestion.raw_data['market'])
        cls.df_skills = cls.preprocessor.clean_analytics_jobs(cls.ingestion.raw_data['skills'])
        
        cls.market_layer = MarketIntelligence(cls.df_market)
        cls.skills_layer = SkillIntelligence(cls.df_skills)
        cls.market_service = CareerMarketEvidenceService(cls.market_layer, cls.skills_layer)

    def test_01_market_provenance_row_counts(self):
        """Verifies Part 2 dataset raw vs analytical row count audit."""
        audit = self.market_service.get_dataset_provenance_audit()
        self.assertEqual(audit["datascience_jobs"]["raw_rows"], 1602)
        self.assertEqual(audit["datascience_jobs"]["clean_analytical_rows"], 1602)
        self.assertEqual(audit["analytics_jobs"]["raw_rows"], 15841)
        self.assertGreaterEqual(audit["analytics_jobs"]["clean_analytical_rows"], 15840)
        self.assertEqual(audit["summary"]["total_raw_rows"], 17443)

    def test_02_resume_parsing_and_evidence_levels(self):
        """Verifies Part 4 & 5 context evidence extraction and proficiency inference."""
        sample_resume = """
        JANE DOE - SENIOR DATA SCIENTIST
        Experience: 5 years building machine learning systems in Python and SQL.
        
        PROJECTS:
        - Developed customer churn prediction models using Scikit-Learn and Pandas.
        - Interested in looking to learn Kubernetes for cloud container orchestration.
        - Academic coursework included Database Systems and Statistics.
        """
        profile = ResumeParser.parse_profile(sample_resume, filename="test_resume.txt")
        self.assertEqual(profile["candidate"]["experience_years"], 5)
        self.assertGreater(len(profile["skills"]), 0)
        
        skills_map = {s["key"]: s for s in profile["skills"]}
        self.assertIn("PYTHON", skills_map)
        self.assertIn("MACHINE_LEARNING", skills_map)
        self.assertIn("KUBERNETES", skills_map)

        # Evidence level verification
        self.assertIn(skills_map["PYTHON"]["evidence_level"], ["PROFESSIONAL", "DEMONSTRATED"])
        self.assertEqual(skills_map["KUBERNETES"]["evidence_level"], "INTEREST")
        self.assertEqual(skills_map["KUBERNETES"]["level"], 1)

    def test_03_explainable_role_matching(self):
        """Verifies Part 6 explainable coverage ratios and gap calculations."""
        candidate_skills = [
            {"key": "PYTHON", "display": "Python", "level": 5},
            {"key": "SQL", "display": "SQL", "level": 3},
            {"key": "PANDAS", "display": "Pandas", "level": 3}
        ]
        target_role = RoleIntelligenceSystem.get_role("DATA_SCIENTIST")
        analysis = DeterministicSkillGapEngine.calculate_gaps(candidate_skills, target_role, experience_years=3)

        self.assertIn("explainable_breakdown", analysis)
        breakdown = analysis["explainable_breakdown"]
        self.assertIn("core_skill_coverage", breakdown)
        self.assertGreaterEqual(breakdown["matched_core_count"], 1)
        self.assertGreater(len(analysis["critical_gaps"]), 0)

    def test_04_roadmap_personalization_and_adaptation(self):
        """Verifies Part 8 & 9 roadmap generation and adaptation to user constraints."""
        candidate_skills = [
            {"key": "PYTHON", "display": "Python", "level": 4},
            {"key": "SQL", "display": "SQL", "level": 3}
        ]
        target_role = RoleIntelligenceSystem.get_role("DATA_SCIENTIST")
        gap_analysis = DeterministicSkillGapEngine.calculate_gaps(candidate_skills, target_role)

        # Standard 10 hrs/wk
        roadmap_10h = CareerRoadmapEngine.generate_roadmap(gap_analysis, weekly_hours=10)
        # Accelerated 20 hrs/wk with skipped skills
        roadmap_20h = CareerRoadmapEngine.generate_roadmap(
            gap_analysis, 
            weekly_hours=20, 
            skipped_skills=["STATISTICS"], 
            priority_mode="accelerated"
        )

        self.assertGreater(roadmap_10h["total_roadmap_weeks"], roadmap_20h["total_roadmap_weeks"])
        self.assertIn("STATISTICS", roadmap_20h["skipped_skills"])

    def test_05_copilot_structured_response(self):
        """Verifies Parts 10, 11 & 12 structured Copilot response schema."""
        copilot = CareerCopilotService(self.market_service)
        profile = {"total_skills_count": 5, "candidate": {"name": "Jane Doe"}}
        target_role = RoleIntelligenceSystem.get_role("DATA_SCIENTIST")
        gap_analysis = DeterministicSkillGapEngine.calculate_gaps([{"key": "PYTHON", "level": 4}], target_role)
        roadmap = CareerRoadmapEngine.generate_roadmap(gap_analysis, weekly_hours=10)

        response = copilot.answer_query("Why should I learn Machine Learning?", profile, target_role, gap_analysis, roadmap)
        
        self.assertIn("query", response)
        self.assertIn("answer", response)
        self.assertIn("reasoning_summary", response)
        self.assertIn("evidence", response)
        self.assertIn("recommended_actions", response)
        self.assertIn("warnings", response)
        self.assertGreater(len(response["evidence"]), 0)

    def test_06_secure_file_validation(self):
        """Verifies Part 19 security rules for file upload validation."""
        self.assertIsNotNone(ResumeParser.validate_file("malicious_script.sh", 100))
        self.assertIsNotNone(ResumeParser.validate_file("huge_file.pdf", 10 * 1024 * 1024))
        self.assertIsNone(ResumeParser.validate_file("valid_resume.pdf", 1 * 1024 * 1024))

if __name__ == "__main__":
    unittest.main()
