import json
import os
from typing import Dict, Any

class LineageExportGenerator:
    """
    Generates structured, machine-readable JSON metadata export
    for SAS CU Hackathon Approach Note update and Round-2 presentation traceability.
    """
    def __init__(self, data_audit: Dict, quality_log: list, feature_catalog: list,
                 market_results: Dict, skill_results: Dict, junior_results: Dict,
                 senior_results: Dict, sds_models: Dict, sds_stats: list,
                 vif_diagnostics: list, logistic_inference: list,
                 insight_cards: list, executive_narrative: Dict):
        self.data_audit = data_audit
        self.quality_log = quality_log
        self.feature_catalog = feature_catalog
        self.market_results = market_results
        self.skill_results = skill_results
        self.junior_results = junior_results
        self.senior_results = senior_results
        self.sds_models = sds_models
        self.sds_stats = sds_stats
        self.vif_diagnostics = vif_diagnostics
        self.logistic_inference = logistic_inference
        self.insight_cards = insight_cards
        self.executive_narrative = executive_narrative

    def generate_report_metadata(self) -> Dict[str, Any]:
        return {
            "project_name": "DATA SCIENCE WORKFORCE INTELLIGENCE",
            "subtitle": "Connecting Market Demand, Skills, Compensation and Professional Success",
            "hackathon": "SAS CU Hackathon",
            "analytical_storyline": "MARKET -> SKILLS -> JUNIOR CAREER -> SENIOR SUCCESS -> WORKFORCE STRATEGY",
            "approach_note_traceability": {
                "problem_definition": "How can organizations use market-demand, skill, compensation and professional-outcome data to optimize workforce strategy?",
                "analytics_objectives": "Build a competition-grade, explainable platform integrating 4 separate analytical datasets.",
                "approach": "Multi-dataset architecture keeping layers separate without false row-level merges.",
                "data_exploration": self.data_audit,
                "data_preparation": {
                    "audit_log": self.quality_log,
                    "feature_engineering": self.feature_catalog
                },
                "data_analysis": {
                    "market_layer": self.market_results,
                    "skill_layer": self.skill_results,
                    "junior_group_comparisons": self.junior_results,
                    "senior_statistical_tests": self.sds_stats,
                    "vif_diagnostics": self.vif_diagnostics,
                    "logistic_regression_inference": self.logistic_inference
                },
                "model_development_and_validation": {
                    "sds_primary_pipeline": self.sds_models,
                    "jds_supporting_pipeline": self.junior_results
                },
                "results_summary": [
                    {
                        "dataset": "SDS Personality Traits.xlsx",
                        "variable": "success_classification_high_low",
                        "method": "5-Fold Stratified Random Forest CV",
                        "metric": "Mean ROC-AUC",
                        "value": self.sds_models.get("best_mean_auc"),
                        "interpretation": "Random Forest provides superior non-linear classification with minimal fold variance."
                    },
                    {
                        "dataset": "SDS Personality Traits.xlsx",
                        "variable": "conscientiousness",
                        "method": "Logistic Regression / Odds Ratio",
                        "metric": "Odds Ratio",
                        "value": next((item["odds_ratio"] for item in self.logistic_inference if item["feature"] == "conscientiousness"), "N/A"),
                        "interpretation": "Conscientiousness shows strong positive odds ratio association with senior success."
                    }
                ],
                "limitations": [
                    "SDS and JDS datasets represent observational samples (N=161 and N=139).",
                    "DataScience Jobs.csv salary strings represent job posting offerings.",
                    "Personality findings represent associations, not deterministic causality."
                ],
                "workforce_implications": self.insight_cards
            },
            "executive_narrative": self.executive_narrative
        }
