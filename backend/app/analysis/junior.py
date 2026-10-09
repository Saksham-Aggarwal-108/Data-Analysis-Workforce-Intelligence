import pandas as pd
from typing import Dict, Any, List
from app.models.jds_pipeline import JDSModelPipeline
from app.stats import StatisticalAnalyzer

class JuniorCareerIntelligence:
    """
    Junior Career Intelligence Layer Analysis Module (Phase 2 Enhanced)
    Combines:
    - Skill trait distributions & target class balance
    - Exploratory group comparison (High vs Low Hike, Cohen's d, Welch t-test / Mann-Whitney U)
    - Supporting classification model pipeline
    """
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.predictors = [
            'big_data_skills',
            'maths_stats_skills',
            'coding_skills',
            'ai_and_ml_skills',
            'dashboard_and_storytelling_skills'
        ]
        self.target = 'salary_hike_high_or_low'
        self.pipeline = JDSModelPipeline(df)

    def get_summary(self) -> Dict[str, Any]:
        total_records = len(self.df)
        target_dist = self.df[self.target].value_counts().to_dict()
        high_cnt = int(target_dist.get(1, 0))
        low_cnt = int(target_dist.get(0, 0))

        skill_means = {}
        for col in self.predictors:
            if col in self.df.columns:
                skill_means[col] = float(round(self.df[col].mean(), 2))

        return {
            "total_candidates": total_records,
            "target_variable": self.target,
            "class_balance": {
                "high_hike": {"count": high_cnt, "pct": float(round((high_cnt / total_records) * 100, 2))},
                "low_hike": {"count": low_cnt, "pct": float(round((low_cnt / total_records) * 100, 2))}
            },
            "skill_means": skill_means
        }

    def get_group_comparisons(self) -> List[Dict[str, Any]]:
        return StatisticalAnalyzer.compare_groups(self.df, self.target, self.predictors)

    def get_model_results(self) -> Dict[str, Any]:
        return self.pipeline.run_pipeline()
