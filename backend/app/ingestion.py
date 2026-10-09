import os
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple
from app.config import DATA_DIR, DATASET_FILES

class DataIngestion:
    """
    Robust Data Ingestion Module
    Handles CSV/XLSX loading, encoding fallback, metadata generation, and preservation of raw data.
    """
    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = data_dir
        self.raw_data: Dict[str, pd.DataFrame] = {}
        self.metadata: Dict[str, Dict[str, Any]] = {}

    def sanitize_val(self, val: Any) -> Any:
        if pd.isna(val):
            return None
        if isinstance(val, (np.integer, np.int64)):
            return int(val)
        if isinstance(val, (np.floating, np.float64)):
            return float(val) if not np.isnan(val) else None
        return str(val)

    def load_dataset(self, key: str, filename: str) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        filepath = os.path.join(self.data_dir, filename)
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Dataset file not found at: {filepath}")

        # Ingestion logic
        if filename.endswith(".csv"):
            try:
                df = pd.read_csv(filepath, encoding="utf-8")
                encoding_used = "utf-8"
            except UnicodeDecodeError:
                df = pd.read_csv(filepath, encoding="latin1")
                encoding_used = "latin1"
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(filepath)
            encoding_used = "openpyxl"
        else:
            raise ValueError(f"Unsupported file format: {filename}")

        # Preserve exact raw dataframe copy
        self.raw_data[key] = df.copy()

        # Build comprehensive metadata audit entry
        col_meta = []
        for col in df.columns:
            null_count = int(df[col].isnull().sum())
            null_pct = float(round((null_count / len(df)) * 100, 2)) if len(df) > 0 else 0.0
            unique_cnt = int(df[col].nunique(dropna=False))
            dtype = str(df[col].dtype)
            
            # Detect potential target or identifier
            col_lower = str(col).strip().lower()
            is_target = "target" in col_lower or "success" in col_lower or "hike" in col_lower
            is_id = col_lower in ["id", "s_no", "reference_no"]

            col_entry = {
                "name": str(col),
                "clean_name": str(col).strip(),
                "dtype": dtype,
                "missing_count": null_count,
                "missing_pct": null_pct,
                "unique_count": unique_cnt,
                "is_target": is_target,
                "is_identifier": is_id
            }
            if unique_cnt <= 15 or is_target:
                counts = {}
                for k, v in df[col].value_counts(dropna=False).items():
                    key_str = "NaN" if pd.isna(k) else str(k)
                    counts[key_str] = int(v)
                col_entry["value_counts"] = counts

            col_meta.append(col_entry)

        # Sanitize sample rows for JSON safety
        sample_dict_list = df.head(3).to_dict(orient="records")
        clean_sample = []
        for row in sample_dict_list:
            clean_row = {}
            for r_k, r_v in row.items():
                clean_row[str(r_k)] = self.sanitize_val(r_v)
            clean_sample.append(clean_row)

        meta = {
            "key": key,
            "filename": filename,
            "encoding_used": encoding_used,
            "row_count": len(df),
            "column_count": len(df.columns),
            "exact_columns": [str(c) for c in df.columns],
            "duplicate_rows": int(df.duplicated().sum()),
            "columns": col_meta,
            "sample_rows": clean_sample
        }

        self.metadata[key] = meta
        return df, meta

    def load_all(self) -> Dict[str, Tuple[pd.DataFrame, Dict[str, Any]]]:
        results = {}
        for key, fname in DATASET_FILES.items():
            results[key] = self.load_dataset(key, fname)
        return results
