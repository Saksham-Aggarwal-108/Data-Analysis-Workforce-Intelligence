import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.ingestion import DataIngestion
from app.quality import DataQualityEngine
from app.preprocessing import DataPreprocessor
from app.analysis.market import MarketIntelligence
from app.analysis.skills import SkillIntelligence
from app.career.taxonomy import SkillTaxonomy
from app.career.resume_parser import ResumeParser
from app.career.market_service import CareerMarketEvidenceService
from app.career.role_intelligence import RoleIntelligenceSystem
from app.career.skill_gap_engine import DeterministicSkillGapEngine
from app.career.roadmap_engine import CareerRoadmapEngine
from app.career.project_recommender import ProjectRecommendationEngine
from app.career.copilot_llm import CareerCopilotService

# 1. Pipeline startup & market data
ingestion = DataIngestion()
raw_results = ingestion.load_all()
quality = DataQualityEngine()
preprocessor = DataPreprocessor(quality)
df_market = preprocessor.clean_datascience_jobs(ingestion.raw_data['market'])
df_skills = preprocessor.clean_analytics_jobs(ingestion.raw_data['skills'])

market_layer = MarketIntelligence(df_market)
skills_layer = SkillIntelligence(df_skills)
market_service = CareerMarketEvidenceService(market_layer, skills_layer)

# 2. Parse sample resume text
sample_resume_text = """
JANE DOE - DATA SCIENTIST & ML ENGINEER
Email: jane.doe@example.com | Phone: 555-0199

SUMMARY:
Results-driven Data Scientist with 3 years of experience building machine learning models, SQL data pipelines, and Python analytics.

EXPERIENCE:
Data Scientist | TechCorp (2022 - Present)
- Developed customer churn classification models using Scikit-Learn and Python, increasing retention by 15%.
- Wrote complex SQL queries in PostgreSQL to analyze 50M+ rows of user analytics.
- Deployed REST APIs using FastAPI and Docker for real-time model inference.

EDUCATION:
B.S. in Computer Science | State University (2018 - 2022)
Relevant Coursework: Machine Learning, Statistics, Database Systems, Data Structures.

SKILLS:
Languages & Tools: Python, SQL, PostgreSQL, Scikit-Learn, Pandas, NumPy, FastAPI, Docker, Git.
"""

resume_parser = ResumeParser()
profile = ResumeParser.parse_profile(sample_resume_text, filename='jane_doe_resume.txt')
print("=== 1. EXTRACTED PROFILE ===")
print(json.dumps(profile, indent=2))

# 3. Role Matching & Skill Gap
role_system = RoleIntelligenceSystem()
match_res = DeterministicSkillGapEngine.rank_all_roles_discovery(profile['skills'])
print("\n=== 2. ALL ROLES MATCHING ===")
for r in match_res[:5]:
    print(f"{r['role_name']}: {r['role_fit_alignment_pct']}% alignment ({r['strong_matches_count']} matched, {r['critical_gaps_count']} gaps)")

target_role = "Data Scientist"
target_role_data = RoleIntelligenceSystem.get_role("DATA_SCIENTIST")
gap_analysis = DeterministicSkillGapEngine.calculate_gaps(profile['skills'], target_role_data)
print("\n=== 3. TARGET ROLE GAP ANALYSIS ===")
print(f"Target: {target_role} | Coverage: {gap_analysis['role_fit_coverage_pct']}%")

# 4. Roadmap Generation
roadmap = CareerRoadmapEngine.generate_roadmap(gap_analysis, weekly_hours=10)
print("\n=== 4. GENERATED ROADMAP ===")
print(f"Readiness: {roadmap['readiness_summary']}")
print(f"Phases count: {len(roadmap['phases'])}")

# 5. Copilot Chat
copilot = CareerCopilotService(market_service)
copilot_res = copilot.answer_query("What should I learn next and why?", profile, target_role_data, gap_analysis, roadmap)
print("\n=== 5. COPILOT RESPONSE ===")
print(json.dumps(copilot_res, indent=2))
