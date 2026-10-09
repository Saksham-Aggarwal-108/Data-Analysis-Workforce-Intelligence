import os
import sys
import unittest
import json
from io import BytesIO

# Ensure backend modules are on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi.testclient import TestClient
from app.main import app

class TestPhase9CareerAIAndModelLab(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_model_lab_prediction_valid_request(self):
        """Regression Test: Valid prediction payload returns 200 with probability and class."""
        payload = {
            "neuroticism": 25.0,
            "extraversion": 70.0,
            "openness_to_experience": 80.0,
            "agreeableness": 75.0,
            "conscientiousness": 85.0
        }
        res = self.client.post("/api/senior/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        
        self.assertIn("predicted_class", data)
        self.assertIn("predicted_label", data)
        self.assertIn("probability_high_pct", data)
        self.assertIn("probability_low_pct", data)
        self.assertIn("disclaimer", data)
        self.assertEqual(data["model_used"], "Random Forest")
        self.assertGreaterEqual(data["probability_high_pct"], 0.0)
        self.assertLessEqual(data["probability_high_pct"], 100.0)
        self.assertEqual(round(data["probability_high_pct"] + data["probability_low_pct"], 1), 100.0)

    def test_model_lab_prediction_invalid_bounds(self):
        """Regression Test: Invalid predictor score (<0 or >100) is rejected with 422."""
        payload = {
            "neuroticism": -10.0,
            "extraversion": 70.0,
            "openness_to_experience": 80.0,
            "agreeableness": 75.0,
            "conscientiousness": 85.0
        }
        res = self.client.post("/api/senior/predict", json=payload)
        self.assertEqual(res.status_code, 422)

    def test_career_roles_api(self):
        """Test GET /api/career/roles returns canonical role definitions."""
        res = self.client.get("/api/career/roles")
        self.assertEqual(res.status_code, 200)
        roles = res.json()
        self.assertGreaterEqual(len(roles), 8)
        role_ids = [r["role_id"] for r in roles]
        self.assertIn("DATA_SCIENTIST", role_ids)
        self.assertIn("MACHINE_LEARNING_ENGINEER", role_ids)

    def test_career_skill_gap_engine(self):
        """Test deterministic skill gap calculation for target role."""
        payload = {
            "skills": [
                {"display": "Python", "level": 4},
                {"display": "SQL", "level": 3}
            ],
            "target_role": "DATA_SCIENTIST"
        }
        res = self.client.post("/api/career/skill-gap", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["target_role"], "Data Scientist")
        self.assertIn("role_fit_coverage_pct", data)
        self.assertIn("critical_gaps", data)
        self.assertIn("strong_matches", data)

    def test_career_roadmap_generation(self):
        """Test dynamic roadmap generation with prerequisite ordering."""
        payload = {
            "skills": [
                {"display": "Python", "level": 3}
            ],
            "target_role": "GENERATIVE_AI_ENGINEER",
            "weekly_hours": 15
        }
        res = self.client.post("/api/career/roadmap", json=payload)
        self.assertEqual(res.status_code, 200)
        roadmap = res.json()
        self.assertIn("phases", roadmap)
        self.assertIn("portfolio_projects", roadmap)
        self.assertGreaterEqual(len(roadmap["phases"]), 3)
        self.assertEqual(roadmap["weekly_hours_allocated"], 15)

    def test_resume_parser_txt(self):
        """Test parsing plain text resume."""
        sample_txt = b"John Doe\nData Scientist\nPython, SQL, PyTorch, Pandas\nExperience: 3 years\nBuilt RAG pipeline."
        file_obj = ("resume.txt", BytesIO(sample_txt), "text/plain")
        res = self.client.post("/api/career/parse-resume", files={"file": file_obj})
        self.assertEqual(res.status_code, 200)
        profile = res.json()
        self.assertEqual(profile["candidate"]["experience_years"], 3)
        skill_keys = [s["key"] for s in profile["skills"]]
        self.assertIn("PYTHON", skill_keys)
        self.assertIn("SQL", skill_keys)

    def test_copilot_chat(self):
        """Test interactive Career Copilot query response."""
        payload = {
            "query": "Why should I learn Docker for Machine Learning Engineer?",
            "skills": [{"display": "Python", "level": 4}],
            "target_role": "MACHINE_LEARNING_ENGINEER"
        }
        res = self.client.post("/api/career/copilot", json=payload)
        self.assertEqual(res.status_code, 200)
        chat_res = res.json()
        self.assertIn("answer", chat_res)
        self.assertIn("evidence_note", chat_res)

if __name__ == "__main__":
    unittest.main()
