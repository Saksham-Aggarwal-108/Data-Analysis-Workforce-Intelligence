import os
import sys
import unittest
import pandas as pd
import numpy as np

# Ensure backend modules are on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.config import DATA_DIR, DATASET_FILES
from app.ingestion import DataIngestion
from app.quality import DataQualityEngine
from app.preprocessing import DataPreprocessor
from app.features import FeatureEngineeringRegistry
from app.stats import StatisticalAnalyzer
from app.models.sds_pipeline import SDSModelPipeline
from app.models.jds_pipeline import JDSModelPipeline
from app.analysis.market import MarketIntelligence
from app.analysis.skills import SkillIntelligence

class TestWorkforceIntelligencePipeline(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.ingestion = DataIngestion(DATA_DIR)
        cls.raw_data = cls.ingestion.load_all()
        cls.quality = DataQualityEngine()
        cls.preprocessor = DataPreprocessor(cls.quality)
        cls.features_reg = FeatureEngineeringRegistry()
        
        # Clean datasets
        cls.df_market = cls.preprocessor.clean_datascience_jobs(cls.ingestion.raw_data["market"])
        cls.df_skills = cls.preprocessor.clean_analytics_jobs(cls.ingestion.raw_data["skills"])
        cls.df_junior = cls.preprocessor.clean_jds_traits(cls.ingestion.raw_data["junior"])
        cls.df_senior = cls.preprocessor.clean_sds_traits(cls.ingestion.raw_data["senior"])
        
        # Feature Engineering
        cls.df_market = cls.features_reg.engineer_market_features(cls.df_market)
        cls.df_skills = cls.features_reg.engineer_skills_features(cls.df_skills)
        cls.df_junior = cls.features_reg.engineer_junior_features(cls.df_junior)
        cls.df_senior = cls.features_reg.engineer_senior_features(cls.df_senior)

    def test_ingestion(self):
        """Verify all 4 raw datasets load correctly with expected shape."""
        self.assertEqual(len(self.ingestion.raw_data["market"]), 1602)
        self.assertEqual(len(self.ingestion.raw_data["skills"]), 15841)
        self.assertEqual(len(self.ingestion.raw_data["junior"]), 139)
        self.assertEqual(len(self.ingestion.raw_data["senior"]), 161)

    def test_preprocessing(self):
        """Verify salary string parsing and column header cleaning."""
        self.assertIn("avg_salary_num", self.df_market.columns)
        self.assertEqual(self.df_market["avg_salary_num"].dtype, "float64")
        self.assertIn("success_classification_high_low", self.df_senior.columns)
        self.assertIn("extraversion", self.df_senior.columns)

    def test_feature_engineering(self):
        """Verify engineered features are present in dataframes."""
        self.assertIn("salary_per_exp", self.df_market.columns)
        self.assertIn("skill_count", self.df_skills.columns)
        self.assertIn("total_skill_score", self.df_junior.columns)
        self.assertIn("emotional_stability", self.df_senior.columns)

    def test_statistical_analyzer(self):
        """Test VIF, Logistic inference, and Group comparisons."""
        predictors = ['neuroticism', 'extraversion', 'openness_to_experience', 'agreeableness', 'conscientiousness']
        
        # VIF
        vif_res = StatisticalAnalyzer.calculate_vif(self.df_senior, predictors)
        self.assertEqual(len(vif_res), 5)
        for item in vif_res:
            self.assertGreater(item["vif"], 0)

        # Logistic inference
        log_res = StatisticalAnalyzer.calculate_logistic_inference(self.df_senior, predictors, 'success_classification_high_low')
        self.assertEqual(len(log_res), 5)
        self.assertIn("odds_ratio", log_res[0])

        # Group comparison
        group_res = StatisticalAnalyzer.compare_groups(self.df_senior, 'success_classification_high_low', predictors)
        self.assertEqual(len(group_res), 5)
        self.assertIn("cohens_d", group_res[0])

    def test_sds_primary_pipeline(self):
        """Test SDS 5-fold stratified pipeline and fold metrics."""
        pipeline = SDSModelPipeline(self.df_senior)
        res = pipeline.run_pipeline()
        
        self.assertEqual(res["sample_size"], 161)
        self.assertIn("Random Forest", res["models"])
        
        # Verify fold-level metrics
        rf_data = res["models"]["Random Forest"]
        self.assertEqual(len(rf_data["fold_metrics"]), 5)
        self.assertIn("mean", rf_data["stats_summary"]["roc_auc"])
        self.assertGreater(rf_data["stats_summary"]["roc_auc"]["mean"], 0.8)

        # Verify live prediction engine
        sample_input = {
            "neuroticism": 25.0,
            "extraversion": 70.0,
            "openness_to_experience": 80.0,
            "agreeableness": 75.0,
            "conscientiousness": 85.0
        }
        pred_res = pipeline.predict_single(sample_input)
        self.assertIn("predicted_class", pred_res)
        self.assertIn("probability_high_pct", pred_res)

    def test_evidence_registry(self):
        """Test Phase 4 Evidence Registry and Lineage System."""
        from app.models.sds_pipeline import SDSModelPipeline
        from app.analysis.market import MarketIntelligence
        from app.analysis.skills import SkillIntelligence
        from app.analysis.junior import JuniorCareerIntelligence
        from app.analysis.senior import SeniorSuccessIntelligence
        from app.analysis.workforce import UnifiedWorkforceIntelligence
        from app.evidence_registry import EvidenceRegistryBuilder

        market_layer = MarketIntelligence(self.df_market)
        skills_layer = SkillIntelligence(self.df_skills)
        junior_layer = JuniorCareerIntelligence(self.df_junior)
        senior_layer = SeniorSuccessIntelligence(self.df_senior)

        sds_model_res = senior_layer.get_model_results()
        sds_stats = senior_layer.get_group_comparisons()
        vif_diagnostics = senior_layer.get_vif_diagnostics()
        logistic_inference = senior_layer.get_logistic_inference()

        workforce_layer = UnifiedWorkforceIntelligence(
            market_summary=market_layer.get_summary(),
            skill_summary=skills_layer.get_summary(),
            junior_summary=junior_layer.get_summary(),
            senior_summary=senior_layer.get_summary(),
            sds_models=sds_model_res,
            sds_stats=sds_stats
        )

        dummy_state = {
            "market_layer": market_layer,
            "skills_layer": skills_layer,
            "junior_layer": junior_layer,
            "senior_layer": senior_layer,
            "sds_model_res": sds_model_res,
            "sds_stats": sds_stats,
            "vif_diagnostics": vif_diagnostics,
            "logistic_inference": logistic_inference,
            "insight_cards": workforce_layer.generate_insight_cards(),
            "executive_narrative": workforce_layer.generate_executive_narrative(),
            "ingestion_metadata": self.ingestion.metadata
        }

        builder = EvidenceRegistryBuilder(dummy_state)
        master_reg = builder.get_master_registry()
        
        self.assertIn("dataset_inventory", master_reg)
        self.assertIn("model_card", master_reg)
        self.assertIn("rubric_matrix", master_reg)
        self.assertEqual(len(master_reg["dataset_inventory"]), 4)
        self.assertEqual(master_reg["model_card"]["sample_size"], 161)
        self.assertEqual(len(master_reg["rubric_matrix"]), 6)

    def test_frozen_model_parameters(self):
        """Regression Test: Proves SDS Random Forest hyperparameters and ROC-AUC metrics remain strictly frozen."""
        pipeline = SDSModelPipeline(self.df_senior)
        res = pipeline.run_pipeline()
        rf_model = pipeline.trained_models["Random Forest"]
        
        # Verify frozen hyperparameters
        self.assertEqual(rf_model.n_estimators, 100)
        self.assertEqual(rf_model.random_state, 42)

        # Verify pipeline execution metrics
        rf_stats = res["models"]["Random Forest"]["stats_summary"]["roc_auc"]
        self.assertAlmostEqual(rf_stats["mean"], 0.9928, delta=0.01)
        self.assertEqual(res["sample_size"], 161)

if __name__ == "__main__":
    unittest.main()

