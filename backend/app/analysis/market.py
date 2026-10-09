import pandas as pd
import numpy as np
from typing import Dict, Any, List

class MarketIntelligence:
    """
    Market Intelligence Layer Analysis Module (Phase 2 Deepening)
    Analyzes DataScience Jobs.csv:
    - Total job opening volume represented by num_of_jobs
    - Demand share by role (num_of_jobs per role / total num_of_jobs)
    - Salary spread and minimum experience requirements per role
    """
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def get_summary(self) -> Dict[str, Any]:
        total_postings = len(self.df)
        total_job_volume = int(self.df['num_of_jobs'].sum())
        total_companies = int(self.df['company_name'].nunique())
        unique_titles = int(self.df['job_title'].nunique())
        avg_salary = float(round(self.df['avg_salary_num'].mean(), 2))
        min_salary_overall = float(round(self.df['min_salary_num'].min(), 2))
        max_salary_overall = float(round(self.df['max_salary_num'].max(), 2))

        return {
            "total_records": total_postings,
            "total_openings_volume": total_job_volume,
            "total_companies": total_companies,
            "unique_job_titles": unique_titles,
            "overall_avg_salary_lakhs": avg_salary,
            "overall_min_salary_lakhs": min_salary_overall,
            "overall_max_salary_lakhs": max_salary_overall
        }

    def get_salary_by_role(self) -> List[Dict[str, Any]]:
        total_job_volume = float(self.df['num_of_jobs'].sum()) if self.df['num_of_jobs'].sum() > 0 else 1.0

        grouped = self.df.groupby('job_title').agg(
            posting_count=('reference_no', 'count'),
            total_openings=('num_of_jobs', 'sum'),
            avg_salary=('avg_salary_num', 'mean'),
            median_salary=('avg_salary_num', 'median'),
            min_salary=('min_salary_num', 'min'),
            max_salary=('max_salary_num', 'max'),
            avg_min_exp=('min_experience', 'mean')
        ).reset_index()

        grouped['demand_share_pct'] = (grouped['total_openings'] / total_job_volume) * 100.0
        grouped['salary_range'] = grouped['max_salary'] - grouped['min_salary']
        grouped = grouped.sort_values(by='total_openings', ascending=False)

        res = []
        for _, row in grouped.iterrows():
            res.append({
                "job_title": row['job_title'],
                "posting_count": int(row['posting_count']),
                "total_openings": int(row['total_openings']),
                "demand_share_pct": float(round(row['demand_share_pct'], 2)),
                "avg_salary": float(round(row['avg_salary'], 2)),
                "median_salary": float(round(row['median_salary'], 2)),
                "min_salary": float(round(row['min_salary'], 2)),
                "max_salary": float(round(row['max_salary'], 2)),
                "salary_range": float(round(row['salary_range'], 2)),
                "avg_min_exp_years": float(round(row['avg_min_exp'], 1))
            })
        return res

    def get_salary_by_experience(self) -> List[Dict[str, Any]]:
        grouped = self.df.groupby('min_experience').agg(
            posting_count=('reference_no', 'count'),
            total_openings=('num_of_jobs', 'sum'),
            avg_salary=('avg_salary_num', 'mean'),
            median_salary=('avg_salary_num', 'median')
        ).reset_index().sort_values(by='min_experience')

        res = []
        for _, row in grouped.iterrows():
            res.append({
                "min_experience_years": int(row['min_experience']),
                "posting_count": int(row['posting_count']),
                "total_openings": int(row['total_openings']),
                "avg_salary": float(round(row['avg_salary'], 2)),
                "median_salary": float(round(row['median_salary'], 2))
            })
        return res

    def get_top_companies(self, top_n: int = 15) -> List[Dict[str, Any]]:
        grouped = self.df.groupby('company_name').agg(
            posting_count=('reference_no', 'count'),
            total_openings=('num_of_jobs', 'sum'),
            avg_salary=('avg_salary_num', 'mean')
        ).reset_index().sort_values(by='total_openings', ascending=False).head(top_n)

        res = []
        for _, row in grouped.iterrows():
            res.append({
                "company_name": row['company_name'],
                "posting_count": int(row['posting_count']),
                "total_openings": int(row['total_openings']),
                "avg_salary": float(round(row['avg_salary'], 2))
            })
        return res

    def get_salary_distribution(self) -> Dict[str, Any]:
        salaries = self.df['avg_salary_num'].dropna()
        bins = [0, 5, 10, 15, 20, 25, 30, 50, 100]
        labels = ['< 5L', '5L-10L', '10L-15L', '15L-20L', '20L-25L', '25L-30L', '30L-50L', '50L+']
        hist, bin_edges = np.histogram(salaries, bins=bins)

        dist = []
        for label, count in zip(labels, hist):
            dist.append({"bin": label, "count": int(count)})

        return {
            "bins": dist,
            "stats": {
                "mean": float(round(salaries.mean(), 2)),
                "std": float(round(salaries.std(), 2)),
                "p25": float(round(salaries.quantile(0.25), 2)),
                "p50": float(round(salaries.median(), 2)),
                "p75": float(round(salaries.quantile(0.75), 2))
            }
        }
