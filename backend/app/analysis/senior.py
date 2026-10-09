import pandas as pd
from typing import Dict, Any, List
from app.models.sds_pipeline import SDSModelPipeline
from app.stats import StatisticalAnalyzer

class SeniorSuccessIntelligence:
    """
    Senior Success Intelligence Layer Analysis Module (Phase 2 Enhanced)
    Combines:
    - Target class balance checks
    - Big Five exploratory group comparisons (Mean, Std, Median, IQR, Shapiro-Wilk, Welch t-test/Mann-Whitney U, Cohen's d)
    - VIF Multicollinearity Diagnostics
    - Logistic Regression Inference (Coef, SE, Odds Ratio, 95% CI, p-value)
    - Primary SDS ML pipeline with fold-level metrics & live prediction engine
    """
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.predictors = [
            'neuroticism',
            'extraversion',
            'openness_to_experience',
            'agreeableness',
            'conscientiousness'
        ]
        self.target = 'success_classification_high_low'
        self.pipeline = SDSModelPipeline(df)

    def get_summary(self) -> Dict[str, Any]:
        total_records = len(self.df)
        target_dist = self.df[self.target].value_counts().to_dict()
        high_cnt = int(target_dist.get(1, 0))
        low_cnt = int(target_dist.get(0, 0))

        trait_means = {}
        for t in self.predictors:
            if t in self.df.columns:
                trait_means[t] = float(round(self.df[t].mean(), 2))

        return {
            "total_senior_data_scientists": total_records,
            "target_variable": self.target,
            "class_balance": {
                "high_success": {"count": high_cnt, "pct": float(round((high_cnt / total_records) * 100, 2))},
                "low_success": {"count": low_cnt, "pct": float(round((low_cnt / total_records) * 100, 2))}
            },
            "big_five_means": trait_means
        }

    def get_group_comparisons(self) -> List[Dict[str, Any]]:
        return StatisticalAnalyzer.compare_groups(self.df, self.target, self.predictors)

    def get_vif_diagnostics(self) -> List[Dict[str, Any]]:
        return StatisticalAnalyzer.calculate_vif(self.df, self.predictors)

    def get_logistic_inference(self) -> List[Dict[str, Any]]:
        return StatisticalAnalyzer.calculate_logistic_inference(self.df, self.predictors, self.target)

    def get_model_results(self) -> Dict[str, Any]:
        return self.pipeline.run_pipeline()

    def predict_single(self, trait_values: Dict[str, float]) -> Dict[str, Any]:
        return self.pipeline.predict_single(trait_values)
