import pandas as pd
import numpy as np
from typing import Dict, Any, List

class DataQualityEngine:
    """
    Data Quality Engine
    Performs data quality profiling, anomaly detection, treatment proposal,
    and maintains an audit log of all dataset transformations.
    """
    def __init__(self):
        self.audit_log: List[Dict[str, Any]] = []

    def log_transformation(self, dataset_key: str, action: str, target_col: str, rationale: str, affected_rows: int):
        entry = {
            "dataset": dataset_key,
            "action": action,
            "column": target_col,
            "rationale": rationale,
            "affected_rows": affected_rows
        }
        self.audit_log.append(entry)

    def Profile_dataset(self, df: pd.DataFrame, dataset_name: str) -> Dict[str, Any]:
        num_rows, num_cols = df.shape
        missing_count = int(df.isnull().sum().sum())
        total_cells = num_rows * num_cols if num_rows * num_cols > 0 else 1
        missing_pct = float(round((missing_count / total_cells) * 100, 2))
        
        # Filter out list or unhashable columns for duplication checking
        hashable_cols = [
            col for col in df.columns 
            if not df[col].apply(lambda x: isinstance(x, (list, dict, set))).any()
        ]
        dup_count = int(df.duplicated(subset=hashable_cols).sum()) if hashable_cols else 0

        num_summary = {}
        num_cols_list = df.select_dtypes(include=[np.number]).columns
        for col in num_cols_list:
            s = df[col].dropna()
            if len(s) > 0:
                q1 = s.quantile(0.25)
                q3 = s.quantile(0.75)
                iqr = q3 - q1
                outliers = int(((s < (q1 - 1.5 * iqr)) | (s > (q3 + 1.5 * iqr))).sum())
                num_summary[col] = {
                    "mean": float(round(s.mean(), 2)),
                    "std": float(round(s.std(), 2)),
                    "min": float(round(s.min(), 2)),
                    "q25": float(round(q1, 2)),
                    "median": float(round(s.median(), 2)),
                    "q75": float(round(q3, 2)),
                    "max": float(round(s.max(), 2)),
                    "outliers_iqr": outliers
                }

        cat_summary = {}
        cat_cols_list = [c for c in df.select_dtypes(include=["object", "category"]).columns if c in hashable_cols]
        for col in cat_cols_list:
            top_vals = df[col].value_counts(dropna=False).head(5).to_dict()
            cat_summary[col] = {
                "unique": int(df[col].nunique(dropna=False)),
                "top_categories": {str(k): int(v) for k, v in top_vals.items()}
            }

        quality_flags = []

        # Specific domain quality checks
        if dataset_name == "market":
            if "reference_no" in df.columns:
                ref_dups = int(df.duplicated(subset=["reference_no"]).sum())
                if ref_dups > 0:
                    quality_flags.append({
                        "issue": "Repeated Reference Numbers",
                        "affected_count": ref_dups,
                        "severity": "MEDIUM",
                        "explanation": f"reference_no has {ref_dups} non-unique instances across different companies.",
                        "proposed_treatment": "Preserve all records; treat reference_no as a portal job code, not a unique primary key."
                    })
        elif dataset_name == "skills":
            if "job_type" in df.columns:
                jt_nulls = int(df["job_type"].isnull().sum())
                quality_flags.append({
                    "issue": "High Missingness in job_type",
                    "affected_count": jt_nulls,
                    "severity": "HIGH",
                    "explanation": f"job_type is missing in {jt_nulls} records ({jt_nulls/len(df)*100:.1f}%).",
                    "proposed_treatment": "Impute missing values as 'Unspecified' and standardize remaining casing (e.g., 'analytics' -> 'Analytics')."
                })
        elif dataset_name in ["junior", "senior"]:
            if "id" in df.columns:
                id_dups = int(df.duplicated(subset=["id"]).sum())
                if id_dups > 0:
                    quality_flags.append({
                        "issue": "Duplicate Candidate IDs",
                        "affected_count": id_dups,
                        "severity": "MEDIUM",
                        "explanation": f"{dataset_name.upper()} dataset has {id_dups} repeated ID entries with distinct trait/target values.",
                        "proposed_treatment": "Preserve each record as a separate observed assessment event per hackathon rules."
                    })

        return {
            "dataset": dataset_name,
            "num_rows": num_rows,
            "num_cols": num_cols,
            "missing_count": missing_count,
            "missing_pct": missing_pct,
            "duplicate_count": dup_count,
            "numerical_summary": num_summary,
            "categorical_summary": cat_summary,
            "quality_flags": quality_flags
        }

    def get_audit_log(self) -> List[Dict[str, Any]]:
        return self.audit_log
