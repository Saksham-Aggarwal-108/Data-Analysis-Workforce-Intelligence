import pandas as pd
import numpy as np
from typing import Dict, Any, List

class FeatureEngineeringRegistry:
    """
    Transparent Feature Engineering Registry
    Generates domain features across analytical layers while preserving full metadata lineage.
    """
    def __init__(self):
        self.catalog: List[Dict[str, str]] = []

    def register_feature(self, feature_name: str, source_vars: List[str], transformation: str, rationale: str, dataset: str):
        self.catalog.append({
            "feature_name": feature_name,
            "dataset": dataset,
            "source_variables": source_vars,
            "transformation": transformation,
            "rationale": rationale
        })

    def engineer_market_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        # Feature: salary_per_exp
        df['salary_per_exp'] = df['avg_salary_num'] / (df['min_experience'] + 1.0)
        self.register_feature(
            feature_name="salary_per_exp",
            dataset="market",
            source_vars=["avg_salary_num", "min_experience"],
            transformation="avg_salary_num / (min_experience + 1.0)",
            rationale="Quantifies compensation premium per year of minimum required experience."
        )

        return df

    def engineer_skills_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        # Feature: is_multi_location
        df['is_multi_location'] = df['location'].astype(str).str.contains(',').astype(int)
        self.register_feature(
            feature_name="is_multi_location",
            dataset="skills",
            source_vars=["location"],
            transformation="1 if ',' in location else 0",
            rationale="Identifies job postings accepting remote or multiple geographic hubs."
        )

        return df

    def engineer_junior_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        # Skill columns after cleaning
        skill_cols = [c for c in df.columns if c.endswith('_skills')]

        if len(skill_cols) > 0:
            df['total_skill_score'] = df[skill_cols].sum(axis=1)
            self.register_feature(
                feature_name="total_skill_score",
                dataset="junior",
                source_vars=skill_cols,
                transformation="Sum of all 5 skill trait scores",
                rationale="Measures aggregate technical & communication competence for junior profiles."
            )

            stem_cols = [c for c in skill_cols if 'dashboard' not in c]
            if len(stem_cols) > 0:
                df['stem_skill_avg'] = df[stem_cols].mean(axis=1)
                self.register_feature(
                    feature_name="stem_skill_avg",
                    dataset="junior",
                    source_vars=stem_cols,
                    transformation="Mean of STEM skills (Big Data, Math, Coding, AI/ML)",
                    rationale="Quantifies core analytical depth."
                )

                if 'dashboard_and_storytelling_skills' in df.columns:
                    df['storytelling_ratio'] = df['dashboard_and_storytelling_skills'] / (df['stem_skill_avg'] + 1e-5)
                    self.register_feature(
                        feature_name="storytelling_ratio",
                        dataset="junior",
                        source_vars=["dashboard_and_storytelling_skills", "stem_skill_avg"],
                        transformation="dashboard_skills / (stem_skill_avg + 1e-5)",
                        rationale="Evaluates balance between technical analysis and business communication."
                    )

        return df

    def engineer_senior_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        traits = ['neuroticism', 'extraversion', 'openness_to_experience', 'agreeableness', 'conscientiousness']
        present_traits = [t for t in traits if t in df.columns]

        if len(present_traits) == 5:
            # Emotional stability
            df['emotional_stability'] = 100 - df['neuroticism']
            self.register_feature(
                feature_name="emotional_stability",
                dataset="senior",
                source_vars=["neuroticism"],
                transformation="100 - neuroticism",
                rationale="Inverts neuroticism scale to measure emotional resilience in high-pressure roles."
            )

            # Work drive
            df['work_drive'] = df['conscientiousness'] + df['openness_to_experience']
            self.register_feature(
                feature_name="work_drive",
                dataset="senior",
                source_vars=["conscientiousness", "openness_to_experience"],
                transformation="conscientiousness + openness_to_experience",
                rationale="Combines execution focus with curiosity & adaptability."
            )

            # Interpersonal balance
            df['interpersonal_balance'] = df['extraversion'] + df['agreeableness']
            self.register_feature(
                feature_name="interpersonal_balance",
                dataset="senior",
                source_vars=["extraversion", "agreeableness"],
                transformation="extraversion + agreeableness",
                rationale="Measures social engagement and collaborative team orientation."
            )

        return df

    def get_catalog(self) -> List[Dict[str, str]]:
        return self.catalog
