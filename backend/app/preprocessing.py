import pandas as pd
import numpy as np
import re
from typing import Dict, Any, List, Tuple
from app.quality import DataQualityEngine

class DataPreprocessor:
    """
    Data-Specific Preprocessing Module
    Cleans raw datasets, standardizes headers, parses complex strings,
    validates domain rules, and logs all operations into the Data Quality Engine.
    """
    def __init__(self, quality_engine: DataQualityEngine):
        self.quality = quality_engine

    def parse_lakh_salary(self, val: str) -> float:
        if pd.isna(val) or not isinstance(val, str):
            return np.nan
        cleaned = val.strip().replace('L', '').replace('l', '').strip()
        try:
            return float(cleaned)
        except ValueError:
            return np.nan

    def clean_datascience_jobs(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        df = df_raw.copy()

        # Parse numeric salary values
        df['avg_salary_num'] = df['avg_salary'].apply(self.parse_lakh_salary)
        df['min_salary_num'] = df['min_salary'].apply(self.parse_lakh_salary)
        df['max_salary_num'] = df['max_salary'].apply(self.parse_lakh_salary)

        # Derived salary metrics
        df['salary_range'] = df['max_salary_num'] - df['min_salary_num']

        # Validate salary logic: min <= avg <= max
        invalid_salary_rows = df[
            (df['min_salary_num'] > df['avg_salary_num']) |
            (df['avg_salary_num'] > df['max_salary_num'])
        ]
        
        self.quality.log_transformation(
            dataset_key="market",
            action="PARSED_SALARY_NUMERIC",
            target_col="avg_salary, min_salary, max_salary",
            rationale="Extracted numeric Lakh floats from string salary representations while preserving original text.",
            affected_rows=len(df)
        )

        if len(invalid_salary_rows) > 0:
            self.quality.log_transformation(
                dataset_key="market",
                action="SALARY_LOGIC_CHECK",
                target_col="min_salary_num <= avg_salary_num <= max_salary_num",
                rationale=f"Identified {len(invalid_salary_rows)} rows violating salary ordering rules.",
                affected_rows=len(invalid_salary_rows)
            )

        return df

    def parse_exp_string(self, exp_str: str) -> Tuple[float, float]:
        if pd.isna(exp_str) or not isinstance(exp_str, str):
            return (np.nan, np.nan)
        
        # Match pattern e.g. "6-10 yrs", "8-12 yrs", "3 yrs", "0-2 Yrs"
        nums = re.findall(r'\d+', exp_str)
        if len(nums) >= 2:
            return (float(nums[0]), float(nums[1]))
        elif len(nums) == 1:
            val = float(nums[0])
            return (val, val)
        return (np.nan, np.nan)

    def clean_analytics_jobs(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        df = df_raw.copy()

        # 1. Standardize job_type
        df['job_type_clean'] = df['job_type'].astype(str).str.strip().str.title()
        df.loc[df['job_type'].isnull(), 'job_type_clean'] = 'Unspecified'
        df.loc[df['job_type_clean'] == 'Analytic', 'job_type_clean'] = 'Analytics'
        df.loc[df['job_type_clean'] == 'Nan', 'job_type_clean'] = 'Unspecified'

        self.quality.log_transformation(
            dataset_key="skills",
            action="STANDARDIZED_JOB_TYPE",
            target_col="job_type",
            rationale="Unified job_type casing variants to 'Analytics' and imputed nulls as 'Unspecified'.",
            affected_rows=len(df)
        )

        # 2. Parse experience ranges
        exp_parsed = df['experience'].apply(self.parse_exp_string)
        df['min_exp_years'] = [p[0] for p in exp_parsed]
        df['max_exp_years'] = [p[1] for p in exp_parsed]
        df['avg_exp_years'] = (df['min_exp_years'] + df['max_exp_years']) / 2.0

        # Category for experience
        def categorize_exp(val):
            if pd.isna(val):
                return 'Unspecified'
            if val <= 2:
                return 'Entry (0-2 yrs)'
            elif val <= 5:
                return 'Mid (3-5 yrs)'
            elif val <= 10:
                return 'Senior (6-10 yrs)'
            else:
                return 'Lead (11+ yrs)'

        df['exp_category'] = df['avg_exp_years'].apply(categorize_exp)

        # 3. Clean and tokenize key_skills
        def process_skills(skills_str):
            if pd.isna(skills_str) or not isinstance(skills_str, str):
                return [], 0
            # Split by comma or semicolon
            raw_tokens = [s.strip() for s in re.split(r'[,;]', skills_str) if s.strip()]
            # Normalize casing for skill deduplication per row
            seen = set()
            normalized = []
            for token in raw_tokens:
                token_clean = token.title()
                if token_clean.lower() not in seen:
                    seen.add(token_clean.lower())
                    normalized.append(token_clean)
            return normalized, len(normalized)

        skill_results = df['key_skills'].apply(process_skills)
        df['skills_list'] = [s[0] for s in skill_results]
        df['skill_count'] = [s[1] for s in skill_results]

        # 4. Standardize salary band
        salary_order = {
            '0to3': 1,
            '3to6': 2,
            '6to10': 3,
            '10to15': 4,
            '15to25': 5,
            '25to50': 6
        }
        df['salary_band_ordered'] = df['salary'].map(salary_order).fillna(0).astype(int)

        self.quality.log_transformation(
            dataset_key="skills",
            action="PARSED_SKILLS_AND_EXP",
            target_col="key_skills, experience, salary",
            rationale="Tokenized skills list per record without row duplicates, parsed experience numbers, mapped salary bands.",
            affected_rows=len(df)
        )

        return df

    def clean_jds_traits(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        df = df_raw.copy()

        # Standardize column headers
        clean_cols = {}
        for c in df.columns:
            clean = c.strip().replace('-', '_').lower()
            clean_cols[c] = clean
        df = df.rename(columns=clean_cols)

        self.quality.log_transformation(
            dataset_key="junior",
            action="STANDARDIZED_HEADERS",
            target_col="maths-stats_skills -> maths_stats_skills",
            rationale="Renamed hyphenated header to pythonic underscore convention.",
            affected_rows=len(df)
        )

        return df

    def clean_sds_traits(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        df = df_raw.copy()

        # Fix whitespace issues in headers e.g. ' extraversion', 'success_ classification_ high_low'
        clean_cols = {}
        for c in df.columns:
            clean = c.strip().lower()
            # Collapse internal double/extra spaces
            clean = re.sub(r'\s+', '_', clean)
            clean = re.sub(r'_+', '_', clean)
            clean_cols[c] = clean

        df = df.rename(columns=clean_cols)

        # Expected target column after cleaning: 'success_classification_high_low'
        self.quality.log_transformation(
            dataset_key="senior",
            action="HEADER_WHITESPACE_CLEANING",
            target_col="extraversion, success_classification_high_low",
            rationale="Removed leading spaces and collapsed internal whitespace in raw SDS headers.",
            affected_rows=len(df)
        )

        return df
