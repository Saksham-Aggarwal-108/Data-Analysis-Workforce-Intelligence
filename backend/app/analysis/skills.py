import pandas as pd
import numpy as np
from collections import Counter
from typing import Dict, Any, List

class SkillIntelligence:
    """
    Skill Intelligence Layer Analysis Module (Phase 2 Deepening)
    Analyzes Analytics Jobs.csv:
    - Transparent, auditable skill alias mapping system
    - Within-band prevalence (postings containing skill in band / total postings in band)
    - Skill prevalence by experience band
    - Skill co-occurrence network
    """
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.alias_mappings = self._build_alias_mappings()

    def _build_alias_mappings(self) -> List[Dict[str, str]]:
        """
        Auditable mapping registry for skill normalization rules.
        """
        rules = [
            {"raw_pattern": "casing / whitespace", "normalized_skill": "Title Case Standard", "rule": "Strip leading/trailing spaces and convert to Title Case"},
            {"raw_pattern": "plsql, pl/sql, pl-sql", "normalized_skill": "PLSQL", "rule": "Unified SQL procedural language variants"},
            {"raw_pattern": "snow, servicenow", "normalized_skill": "ServiceNow", "rule": "Unified platform abbreviations"},
            {"raw_pattern": "hypermesh, hyper mesh", "normalized_skill": "HyperMesh", "rule": "Standardized FEA engineering tool spelling"},
            {"raw_pattern": "ls-dyna, ls dyna", "normalized_skill": "LS-DYNA", "rule": "Standardized simulation software casing"}
        ]
        return rules

    def get_alias_mappings(self) -> List[Dict[str, str]]:
        return self.alias_mappings

    def get_summary(self) -> Dict[str, Any]:
        total_records = len(self.df)
        all_skills = [skill for skills in self.df['skills_list'] for skill in skills]
        unique_skills_count = len(set(all_skills))
        top_salary_band = self.df['salary'].mode()[0] if len(self.df) > 0 else "N/A"
        avg_skills_per_job = float(round(self.df['skill_count'].mean(), 2))

        return {
            "total_records": total_records,
            "unique_skills_extracted": unique_skills_count,
            "total_skill_mentions": len(all_skills),
            "avg_skills_per_posting": avg_skills_per_job,
            "most_frequent_salary_band": top_salary_band
        }

    def get_top_skills(self, top_n: int = 20) -> List[Dict[str, Any]]:
        all_skills = [skill for skills in self.df['skills_list'] for skill in skills]
        counts = Counter(all_skills)
        total_jobs = len(self.df) if len(self.df) > 0 else 1

        res = []
        for skill, cnt in counts.most_common(top_n):
            res.append({
                "skill": skill,
                "frequency": cnt,
                "prevalence_pct": float(round((cnt / total_jobs) * 100, 2))
            })
        return res

    def get_skill_by_salary_band(self, top_n_skills: int = 15) -> Dict[str, Any]:
        top_skills = [s['skill'] for s in self.get_top_skills(top_n_skills)]
        bands = ['0to3', '3to6', '6to10', '10to15', '15to25', '25to50']
        
        band_totals = {band: len(self.df[self.df['salary'] == band]) for band in bands}

        matrix = []
        for skill in top_skills:
            row = {"skill": skill}
            for band in bands:
                total_in_band = band_totals[band]
                if total_in_band > 0:
                    band_df = self.df[self.df['salary'] == band]
                    cnt = sum(1 for skills in band_df['skills_list'] if skill in skills)
                    within_band_pct = float(round((cnt / total_in_band) * 100, 2))
                else:
                    within_band_pct = 0.0
                row[band] = within_band_pct
            matrix.append(row)

        return {
            "bands": bands,
            "band_posting_counts": band_totals,
            "skills_matrix": matrix
        }

    def get_skill_by_experience_band(self, top_n_skills: int = 10) -> Dict[str, Any]:
        top_skills = [s['skill'] for s in self.get_top_skills(top_n_skills)]
        exp_categories = ['Entry (0-2 yrs)', 'Mid (3-5 yrs)', 'Senior (6-10 yrs)', 'Lead (11+ yrs)']
        
        cat_totals = {cat: len(self.df[self.df['exp_category'] == cat]) for cat in exp_categories}

        matrix = []
        for skill in top_skills:
            row = {"skill": skill}
            for cat in exp_categories:
                total_in_cat = cat_totals[cat]
                if total_in_cat > 0:
                    cat_df = self.df[self.df['exp_category'] == cat]
                    cnt = sum(1 for skills in cat_df['skills_list'] if skill in skills)
                    within_cat_pct = float(round((cnt / total_in_cat) * 100, 2))
                else:
                    within_cat_pct = 0.0
                row[cat] = within_cat_pct
            matrix.append(row)

        return {
            "exp_categories": exp_categories,
            "exp_posting_counts": cat_totals,
            "skills_matrix": matrix
        }

    def get_skill_cooccurrence(self, top_n: int = 10) -> Dict[str, Any]:
        top_skills = [s['skill'] for s in self.get_top_skills(top_n)]
        skill_set = set(top_skills)

        co_matrix = {s1: {s2: 0 for s2 in top_skills} for s1 in top_skills}

        for skills in self.df['skills_list']:
            filtered = [s for s in skills if s in skill_set]
            for i in range(len(filtered)):
                for j in range(i + 1, len(filtered)):
                    s1, s2 = filtered[i], filtered[j]
                    co_matrix[s1][s2] += 1
                    co_matrix[s2][s1] += 1

        nodes = [{"id": s, "label": s} for s in top_skills]
        links = []
        for i in range(len(top_skills)):
            for j in range(i + 1, len(top_skills)):
                s1 = top_skills[i]
                s2 = top_skills[j]
                weight = co_matrix[s1][s2]
                if weight > 0:
                    links.append({"source": s1, "target": s2, "weight": weight})

        return {
            "nodes": nodes,
            "links": links
        }

    def get_experience_breakdown(self) -> List[Dict[str, Any]]:
        grouped = self.df.groupby('exp_category').agg(
            posting_count=('s_no', 'count'),
            avg_skill_count=('skill_count', 'mean')
        ).reset_index()

        res = []
        for _, row in grouped.iterrows():
            res.append({
                "exp_category": row['exp_category'],
                "posting_count": int(row['posting_count']),
                "avg_skill_count": float(round(row['avg_skill_count'], 2))
            })
        return res
