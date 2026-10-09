from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

from app.ingestion import DataIngestion
from app.quality import DataQualityEngine
from app.preprocessing import DataPreprocessor
from app.features import FeatureEngineeringRegistry
from app.analysis.market import MarketIntelligence
from app.analysis.skills import SkillIntelligence
from app.analysis.junior import JuniorCareerIntelligence
from app.analysis.senior import SeniorSuccessIntelligence
from app.analysis.workforce import UnifiedWorkforceIntelligence
from app.export_lineage import LineageExportGenerator

from app.career.taxonomy import SkillTaxonomy
from app.career.resume_parser import ResumeParser
from app.career.market_service import CareerMarketEvidenceService
from app.career.role_intelligence import RoleIntelligenceSystem
from app.career.skill_gap_engine import DeterministicSkillGapEngine
from app.career.roadmap_engine import CareerRoadmapEngine
from app.career.copilot_llm import CareerCopilotService

app = FastAPI(
    title="Data Science Workforce Intelligence API",
    description="Backend API for SAS CU Hackathon - Workforce Analytics & Predictive Platform (Phase 2.1)",
    version="2.1.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Model for Prediction Request
class TraitPredictionInput(BaseModel):
    neuroticism: float = Field(..., ge=0, le=100, description="Neuroticism score (0-100)")
    extraversion: float = Field(..., ge=0, le=100, description="Extraversion score (0-100)")
    openness_to_experience: float = Field(..., ge=0, le=100, description="Openness score (0-100)")
    agreeableness: float = Field(..., ge=0, le=100, description="Agreeableness score (0-100)")
    conscientiousness: float = Field(..., ge=0, le=100, description="Conscientiousness score (0-100)")

# Pydantic Models for Career AI System
class SkillInput(BaseModel):
    key: Optional[str] = None
    display: str
    level: int = Field(3, ge=1, le=5)

class ManualProfileInput(BaseModel):
    name: str = "Candidate"
    experience_years: int = Field(0, ge=0, le=40)
    skills: List[SkillInput]
    target_role: Optional[str] = None
    weekly_hours: int = Field(10, ge=1, le=80)
    career_goal: Optional[str] = "Transition to target role"

class MatchRequestInput(BaseModel):
    skills: List[SkillInput]
    target_role: Optional[str] = None
    experience_years: int = Field(0, ge=0, le=40)

class RoadmapRequestInput(BaseModel):
    skills: List[SkillInput]
    target_role: str
    weekly_hours: int = Field(10, ge=1, le=80)
    career_goal: Optional[str] = "Transition to target role"
    skipped_skills: Optional[List[str]] = None
    priority_mode: Optional[str] = "standard"

class CopilotQueryInput(BaseModel):
    query: str
    skills: List[SkillInput]
    target_role: Optional[str] = None
    weekly_hours: int = Field(10, ge=1, le=80)

# Global State Container
state: Dict[str, Any] = {}

@app.on_event("startup")
def startup_event():
    """
    Execute full pipeline on startup:
    INGEST -> QUALITY AUDIT -> PREPROCESS -> FEATURE ENGINEERING -> ANALYTICS -> STATS -> ML PIPELINES -> LEAKAGE AUDIT -> WORKFORCE
    """
    print(">>> Starting Data Science Workforce Intelligence Pipeline (Phase 2.1)...")
    
    # 1. Ingestion
    ingestion = DataIngestion()
    raw_results = ingestion.load_all()

    # 2. Data Quality Engine
    quality = DataQualityEngine()
    
    # 3. Preprocessing
    preprocessor = DataPreprocessor(quality)
    df_market = preprocessor.clean_datascience_jobs(ingestion.raw_data["market"])
    df_skills = preprocessor.clean_analytics_jobs(ingestion.raw_data["skills"])
    df_junior = preprocessor.clean_jds_traits(ingestion.raw_data["junior"])
    df_senior = preprocessor.clean_sds_traits(ingestion.raw_data["senior"])

    # 4. Feature Engineering
    features_reg = FeatureEngineeringRegistry()
    df_market = features_reg.engineer_market_features(df_market)
    df_skills = features_reg.engineer_skills_features(df_skills)
    df_junior = features_reg.engineer_junior_features(df_junior)
    df_senior = features_reg.engineer_senior_features(df_senior)

    # 5. Data Quality Profiles
    profiles = {
        "market": quality.Profile_dataset(df_market, "market"),
        "skills": quality.Profile_dataset(df_skills, "skills"),
        "junior": quality.Profile_dataset(df_junior, "junior"),
        "senior": quality.Profile_dataset(df_senior, "senior")
    }

    # 6. Analytical Layers
    market_layer = MarketIntelligence(df_market)
    skills_layer = SkillIntelligence(df_skills)
    junior_layer = JuniorCareerIntelligence(df_junior)
    senior_layer = SeniorSuccessIntelligence(df_senior)

    # 7. Statistical & ML Models
    sds_model_res = senior_layer.get_model_results()
    jds_model_res = junior_layer.get_model_results()
    
    sds_stats = senior_layer.get_group_comparisons()
    vif_diagnostics = senior_layer.get_vif_diagnostics()
    logistic_inference = senior_layer.get_logistic_inference()
    junior_stats = junior_layer.get_group_comparisons()

    # 8. Unified Workforce Intelligence Layer
    workforce_layer = UnifiedWorkforceIntelligence(
        market_summary=market_layer.get_summary(),
        skill_summary=skills_layer.get_summary(),
        junior_summary=junior_layer.get_summary(),
        senior_summary=senior_layer.get_summary(),
        sds_models=sds_model_res,
        sds_stats=sds_stats
    )
    insight_cards = workforce_layer.generate_insight_cards()
    executive_narrative = workforce_layer.generate_executive_narrative()

    # 9. Career AI Services Initialization
    market_evidence_service = CareerMarketEvidenceService(market_layer, skills_layer)
    copilot_service = CareerCopilotService(market_evidence_service)

    # Store in state
    state["ingestion_metadata"] = ingestion.metadata
    state["quality_profiles"] = profiles
    state["audit_log"] = quality.get_audit_log()
    state["feature_catalog"] = features_reg.get_catalog()
    
    state["market_layer"] = market_layer
    state["skills_layer"] = skills_layer
    state["junior_layer"] = junior_layer
    state["senior_layer"] = senior_layer
    
    state["sds_model_res"] = sds_model_res
    state["jds_model_res"] = jds_model_res
    state["sds_stats"] = sds_stats
    state["vif_diagnostics"] = vif_diagnostics
    state["logistic_inference"] = logistic_inference
    state["junior_stats"] = junior_stats
    
    state["insight_cards"] = insight_cards
    state["executive_narrative"] = executive_narrative
    state["market_evidence_service"] = market_evidence_service
    state["copilot_service"] = copilot_service

    print(">>> Data Science Workforce Intelligence Pipeline & Career AI Copilot Initialized Successfully!")

@app.get("/api/health")
def get_health():
    return {"status": "online", "message": "Workforce Intelligence API Operational (Phase 2.1 Audit Gate Passed)"}

@app.get("/api/audit")
def get_audit():
    return state.get("ingestion_metadata", {})

@app.get("/api/quality")
def get_quality():
    return {
        "profiles": state.get("quality_profiles", {}),
        "audit_log": state.get("audit_log", [])
    }

@app.get("/api/features")
def get_features():
    return state.get("feature_catalog", [])

@app.get("/api/market/summary")
def get_market_summary():
    return state["market_layer"].get_summary()

@app.get("/api/market/roles")
def get_market_roles():
    return state["market_layer"].get_salary_by_role()

@app.get("/api/market/experience")
def get_market_experience():
    return state["market_layer"].get_salary_by_experience()

@app.get("/api/market/companies")
def get_market_companies():
    return state["market_layer"].get_top_companies()

@app.get("/api/market/salary-dist")
def get_market_salary_dist():
    return state["market_layer"].get_salary_distribution()

@app.get("/api/skills/summary")
def get_skills_summary():
    return state["skills_layer"].get_summary()

@app.get("/api/skills/top")
def get_skills_top(top_n: int = 20):
    return state["skills_layer"].get_top_skills(top_n)

@app.get("/api/skills/salary-matrix")
def get_skills_salary_matrix():
    return state["skills_layer"].get_skill_by_salary_band()

@app.get("/api/skills/experience-matrix")
def get_skills_experience_matrix():
    return state["skills_layer"].get_skill_by_experience_band()

@app.get("/api/skills/alias-mapping")
def get_skills_alias_mapping():
    return state["skills_layer"].get_alias_mappings()

@app.get("/api/skills/cooccurrence")
def get_skills_cooccurrence(top_n: int = 12):
    return state["skills_layer"].get_skill_cooccurrence(top_n)

@app.get("/api/skills/experience")
def get_skills_experience():
    return state["skills_layer"].get_experience_breakdown()

@app.get("/api/junior/summary")
def get_junior_summary():
    return state["junior_layer"].get_summary()

@app.get("/api/junior/stats")
def get_junior_stats():
    return state.get("junior_stats", [])

@app.get("/api/junior/model")
def get_junior_model():
    return state.get("jds_model_res", {})

@app.get("/api/senior/summary")
def get_senior_summary():
    return state["senior_layer"].get_summary()

@app.get("/api/senior/stats")
def get_senior_stats():
    return {
        "group_comparisons": state.get("sds_stats", []),
        "vif_diagnostics": state.get("vif_diagnostics", []),
        "logistic_inference": state.get("logistic_inference", [])
    }

@app.get("/api/senior/model")
def get_senior_model():
    return state.get("sds_model_res", {})

@app.get("/api/senior/validation-audit")
def get_senior_validation_audit():
    sds_res = state.get("sds_model_res", {})
    return {
        "official_cv": {
            "method": "5-Fold Stratified Cross-Validation",
            "folds": 5,
            "stratification": sds_res.get("fold_stratification_logs", []),
            "comparison_table": sds_res.get("comparison_table", [])
        },
        "grouped_cv_sensitivity": sds_res.get("grouped_cv_sensitivity", {}),
        "robustness_cv_50folds": sds_res.get("robustness_cv_50folds", {}),
        "leakage_audit": sds_res.get("leakage_audit", {}),
        "model_selection": sds_res.get("selection_rationale", {}),
        "statistical_inference": {
            "vif": state.get("vif_diagnostics", []),
            "logistic_coefficients": state.get("logistic_inference", [])
        },
        "group_comparisons": state.get("sds_stats", []),
        "responsible_ai": {
            "limitations": [
                "Observational study sample of N=161 senior customer-facing data scientists.",
                "Does not establish deterministic causality."
            ],
            "non_causal_language": "Variables represent statistical associations under fitted models.",
            "prohibited_use": "Personality variables MUST NOT be used as automated hiring rejection filters."
        }
    }

@app.post("/api/senior/predict")
def predict_senior_success(input_data: TraitPredictionInput):
    if "senior_layer" not in state:
        ingestion = DataIngestion()
        ingestion.load_all()
        quality = DataQualityEngine()
        preprocessor = DataPreprocessor(quality)
        df_senior = preprocessor.clean_sds_traits(ingestion.raw_data["senior"])
        features_reg = FeatureEngineeringRegistry()
        df_senior = features_reg.engineer_senior_features(df_senior)
        state["senior_layer"] = SeniorSuccessIntelligence(df_senior)

    trait_dict = input_data.dict()
    res = state["senior_layer"].predict_single(trait_dict)
    return res

@app.get("/api/workforce/cards")
def get_workforce_cards():
    return state.get("insight_cards", [])

@app.get("/api/workforce/narrative")
def get_workforce_narrative():
    return state.get("executive_narrative", {})

from app.evidence_registry import EvidenceRegistryBuilder

@app.get("/api/evidence/master-registry")
def get_master_registry():
    builder = EvidenceRegistryBuilder(state)
    return builder.get_master_registry()

@app.get("/api/evidence/model-card")
def get_model_card():
    builder = EvidenceRegistryBuilder(state)
    return builder.get_model_card()

@app.get("/api/evidence/lineage")
def get_evidence_lineage():
    builder = EvidenceRegistryBuilder(state)
    return builder.get_evidence_lineage_system()

@app.get("/api/evidence/datasets")
def get_dataset_evidence():
    builder = EvidenceRegistryBuilder(state)
    return builder.get_dataset_evidence_table()

@app.get("/api/evidence/rubric-matrix")
def get_rubric_matrix():
    builder = EvidenceRegistryBuilder(state)
    return builder.get_rubric_evidence_matrix()

@app.get("/api/evidence/presentation-checklist")
def get_presentation_checklist():
    builder = EvidenceRegistryBuilder(state)
    return builder.get_presentation_checklist()

@app.get("/api/export/metadata")
def get_export_metadata():
    exporter = LineageExportGenerator(
        data_audit=state.get("ingestion_metadata", {}),
        quality_log=state.get("audit_log", []),
        feature_catalog=state.get("feature_catalog", []),
        market_results=state["market_layer"].get_summary(),
        skill_results=state["skills_layer"].get_summary(),
        junior_results=state["junior_layer"].get_summary(),
        senior_results=state["senior_layer"].get_summary(),
        sds_models=state.get("sds_model_res", {}),
        sds_stats=state.get("sds_stats", []),
        vif_diagnostics=state.get("vif_diagnostics", []),
        logistic_inference=state.get("logistic_inference", []),
        insight_cards=state.get("insight_cards", []),
        executive_narrative=state.get("executive_narrative", {})
    )
    return exporter.generate_report_metadata()

# ==============================================================================
# CAREER AI & WORKFORCE COPILOT REST API ENDPOINTS (PHASE 9)
# ==============================================================================

@app.post("/api/career/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """Parses uploaded PDF/DOCX/TXT resume into CandidateProfile structure."""
    file_bytes = await file.read()
    val_err = ResumeParser.validate_file(file.filename, len(file_bytes))
    if val_err:
        raise HTTPException(status_code=400, detail=val_err)
    
    extracted_text = ResumeParser.extract_text(file_bytes, file.filename)
    if not extracted_text:
        raise HTTPException(status_code=422, detail="Failed to extract readable text from resume file.")
    
    profile = ResumeParser.parse_profile(extracted_text, file.filename)
    return profile

@app.post("/api/career/profile")
def create_manual_profile(input_data: ManualProfileInput):
    """Processes manual skill entries and profile inputs into normalized CandidateProfile."""
    skills_list = []
    categorized = {cat: [] for cat in SkillTaxonomy.CATEGORIES}

    for sk in input_data.skills:
        c_key = sk.key if sk.key else SkillTaxonomy.normalize_skill(sk.display)
        meta = SkillTaxonomy.get_metadata(c_key)
        item = {
            "key": c_key,
            "display": meta["display"],
            "category": meta["category"],
            "level": sk.level
        }
        skills_list.append(item)
        if meta["category"] in categorized:
            categorized[meta["category"]].append(item)

    return {
        "candidate": {
            "name": input_data.name,
            "experience_years": input_data.experience_years,
            "target_role": input_data.target_role
        },
        "skills": skills_list,
        "categorized_skills": categorized,
        "total_skills_count": len(skills_list),
        "weekly_hours": input_data.weekly_hours,
        "career_goal": input_data.career_goal
    }

@app.get("/api/career/roles")
def get_career_roles():
    """Returns canonical target role definitions and required skill profiles."""
    return RoleIntelligenceSystem.get_all_roles()

@app.post("/api/career/match")
def match_career_roles(input_data: MatchRequestInput):
    """
    If target_role is specified: returns detailed gap analysis for target role.
    If target_role is None: returns ranked role discovery list for ALL roles.
    """
    candidate_skills = [s.dict() for s in input_data.skills]

    if input_data.target_role:
        target_role_data = RoleIntelligenceSystem.get_role(input_data.target_role)
        if not target_role_data:
            target_role_data = RoleIntelligenceSystem.ROLES["DATA_SCIENTIST"]
        
        analysis = DeterministicSkillGapEngine.calculate_gaps(candidate_skills, target_role_data)
        return {
            "mode": "target_role",
            "match_analysis": analysis
        }
    else:
        discovery = DeterministicSkillGapEngine.rank_all_roles_discovery(candidate_skills)
        return {
            "mode": "career_discovery",
            "ranked_roles": discovery
        }

@app.post("/api/career/skill-gap")
def get_skill_gaps(input_data: MatchRequestInput):
    """Calculates deterministic skill gaps for a specified target role."""
    candidate_skills = [s.dict() for s in input_data.skills]
    target_role_data = RoleIntelligenceSystem.get_role(input_data.target_role or "DATA_SCIENTIST")
    if not target_role_data:
        target_role_data = RoleIntelligenceSystem.ROLES["DATA_SCIENTIST"]
    
    return DeterministicSkillGapEngine.calculate_gaps(candidate_skills, target_role_data)

@app.post("/api/career/roadmap")
def generate_career_roadmap(input_data: RoadmapRequestInput):
    """Generates a dynamic personalized career roadmap based on candidate gaps and weekly hours."""
    candidate_skills = [s.dict() for s in input_data.skills]
    target_role_data = RoleIntelligenceSystem.get_role(input_data.target_role)
    if not target_role_data:
        target_role_data = RoleIntelligenceSystem.ROLES["DATA_SCIENTIST"]
    
    gap_analysis = DeterministicSkillGapEngine.calculate_gaps(candidate_skills, target_role_data)
    roadmap = CareerRoadmapEngine.generate_roadmap(
        gap_analysis=gap_analysis,
        weekly_hours=input_data.weekly_hours,
        career_goal=input_data.career_goal or "Transition to target role",
        skipped_skills=input_data.skipped_skills,
        priority_mode=input_data.priority_mode or "standard"
    )
    return roadmap

@app.post("/api/career/copilot")
def query_career_copilot(input_data: CopilotQueryInput):
    """Interactive AI Copilot chat query for personalized guidance."""
    candidate_skills = [s.dict() for s in input_data.skills]
    target_role_data = RoleIntelligenceSystem.get_role(input_data.target_role or "DATA_SCIENTIST")
    gap_analysis = DeterministicSkillGapEngine.calculate_gaps(candidate_skills, target_role_data) if target_role_data else None
    
    roadmap = CareerRoadmapEngine.generate_roadmap(gap_analysis, input_data.weekly_hours) if gap_analysis else None
    
    copilot = state.get("copilot_service", CareerCopilotService())
    res = copilot.answer_query(
        user_query=input_data.query,
        profile={"total_skills_count": len(candidate_skills), "candidate": {"name": "Candidate"}},
        target_role_data=target_role_data,
        gap_analysis=gap_analysis,
        roadmap=roadmap
    )
    return res

@app.get("/api/career/market")
def get_career_market():
    """Returns dataset-grounded market evidence overview."""
    market_svc = state.get("market_evidence_service")
    if not market_svc:
        market_svc = CareerMarketEvidenceService(state.get("market_layer"), state.get("skills_layer"))
    return market_svc.get_market_overview()


