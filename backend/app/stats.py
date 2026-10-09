import pandas as pd
import numpy as np
import scipy.stats as stats
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor
from statsmodels.stats.multitest import multipletests
from typing import Dict, Any, List

class StatisticalAnalyzer:
    """
    Statistical Analysis Module (Phase 2.1 Enhanced)
    Provides rigorous statistical testing:
    - Multicollinearity (VIF)
    - Logistic Regression parametric inference (Coef, SE, Odds Ratio, 95% CI, p-values)
    - Two-sample comparisons (Welch's t-test / Mann-Whitney U based on Shapiro-Wilk normality)
    - Effect size calculation (Cohen's d)
    - Benjamini-Hochberg FDR Multiple Testing Adjustment
    """
    
    @staticmethod
    def calculate_vif(df: pd.DataFrame, predictors: List[str]) -> List[Dict[str, Any]]:
        X = df[predictors].dropna().copy()
        X_const = sm.add_constant(X)
        
        vif_data = []
        for i, col in enumerate(predictors):
            vif_val = variance_inflation_factor(X_const.values, i + 1)
            
            if vif_val < 5.0:
                interp = "Low multicollinearity (Safe linear redundancy)"
            elif vif_val < 10.0:
                interp = "Moderate multicollinearity (Monitor predictor overlap)"
            else:
                interp = "High multicollinearity (Potential variance inflation)"
                
            vif_data.append({
                "feature": col,
                "vif": float(round(vif_val, 3)),
                "interpretation": interp
            })
            
        vif_data = sorted(vif_data, key=lambda x: x["vif"], reverse=True)
        return vif_data

    @staticmethod
    def calculate_logistic_inference(df: pd.DataFrame, predictors: List[str], target: str) -> List[Dict[str, Any]]:
        X = df[predictors].copy()
        y = df[target].copy()
        
        X_const = sm.add_constant(X)
        model = sm.Logit(y, X_const).fit(disp=False)
        
        params = model.params
        bse = model.bse
        pvalues = model.pvalues
        conf = model.conf_int()
        
        raw_pvals = [float(pvalues[col]) for col in predictors if col in params]
        # Benjamini-Hochberg FDR adjustment
        _, adj_pvals, _, _ = multipletests(raw_pvals, alpha=0.05, method='fdr_bh')
        
        results = []
        for idx, col in enumerate(predictors):
            if col in params:
                coef = float(params[col])
                se = float(bse[col])
                pval = raw_pvals[idx]
                adj_pval = float(adj_pvals[idx])
                odds_ratio = float(np.exp(coef))
                ci_lower = float(np.exp(conf.loc[col, 0]))
                ci_upper = float(np.exp(conf.loc[col, 1]))
                
                results.append({
                    "feature": col,
                    "coefficient": round(coef, 4),
                    "standard_error": round(se, 4),
                    "p_value": round(pval, 4),
                    "adj_p_value_fdr": round(adj_pval, 4),
                    "odds_ratio": round(odds_ratio, 4),
                    "ci_95_lower": round(ci_lower, 4),
                    "ci_95_upper": round(ci_upper, 4),
                    "is_statistically_significant": pval < 0.05,
                    "direction": "Positively associated with High Success label in fitted model" if coef > 0 else "Negatively associated with High Success label in fitted model"
                })
                
        results = sorted(results, key=lambda x: abs(x["coefficient"]), reverse=True)
        return results

    @staticmethod
    def compare_groups(df: pd.DataFrame, group_col: str, predictors: List[str]) -> List[Dict[str, Any]]:
        results_raw = []
        raw_pvals = []
        
        g1 = df[df[group_col] == 1]
        g0 = df[df[group_col] == 0]
        
        for col in predictors:
            v1 = g1[col].dropna()
            v0 = g0[col].dropna()
            
            # Shapiro-Wilk Normality test
            sw1_stat, sw1_p = stats.shapiro(v1)
            sw0_stat, sw0_p = stats.shapiro(v0)
            is_normal = (sw1_p > 0.05) and (sw0_p > 0.05)
            
            # Descriptive statistics per group
            m1, std1 = float(v1.mean()), float(v1.std())
            m0, std0 = float(v0.mean()), float(v0.std())
            med1, iqr1 = float(v1.median()), float(v1.quantile(0.75) - v1.quantile(0.25))
            med0, iqr0 = float(v0.median()), float(v0.quantile(0.75) - v0.quantile(0.25))
            
            # Test selection
            if is_normal:
                test_name = "Welch's t-test"
                stat_res = stats.ttest_ind(v1, v0, equal_var=False)
                test_stat = float(stat_res.statistic)
                p_val = float(stat_res.pvalue)
                justification = "Selected Welch's t-test because both group distributions passed Shapiro-Wilk normality (p > 0.05) without assuming equal variances."
            else:
                test_name = "Mann-Whitney U Test"
                stat_res = stats.mannwhitneyu(v1, v0, alternative='two-sided')
                test_stat = float(stat_res.statistic)
                p_val = float(stat_res.pvalue)
                justification = "Selected non-parametric Mann-Whitney U test because at least one group violated Shapiro-Wilk normality (p <= 0.05)."
                
            # Cohen's d Effect Size
            n1, n2 = len(v1), len(v0)
            pooled_std = np.sqrt(((n1 - 1) * std1**2 + (n2 - 1) * std0**2) / (n1 + n2 - 2))
            cohens_d = (m1 - m0) / (pooled_std + 1e-8) if pooled_std > 0 else 0.0
            
            abs_d = abs(cohens_d)
            if abs_d < 0.2:
                d_label = "Negligible"
            elif abs_d < 0.5:
                d_label = "Small"
            elif abs_d < 0.8:
                d_label = "Medium"
            else:
                d_label = "Large"
                
            raw_pvals.append(p_val)
            results_raw.append({
                "feature": col,
                "group_1_high_mean": round(m1, 2),
                "group_1_high_std": round(std1, 2),
                "group_1_high_median": round(med1, 2),
                "group_1_high_iqr": round(iqr1, 2),
                "group_0_low_mean": round(m0, 2),
                "group_0_low_std": round(std0, 2),
                "group_0_low_median": round(med0, 2),
                "group_0_low_iqr": round(iqr0, 2),
                "delta_mean": round(m1 - m0, 2),
                "test_name": test_name,
                "test_statistic": round(test_stat, 3),
                "p_value": round(p_val, 4),
                "cohens_d": round(cohens_d, 3),
                "effect_size_label": d_label,
                "justification": justification
            })

        # Apply Benjamini-Hochberg FDR adjustment across all 5 predictor hypothesis tests
        _, adj_pvals, _, _ = multipletests(raw_pvals, alpha=0.05, method='fdr_bh')
        
        final_results = []
        for item, adj_p in zip(results_raw, adj_pvals):
            item["adj_p_value_fdr"] = round(float(adj_p), 4)
            item["is_statistically_significant"] = float(adj_p) < 0.05
            item["fdr_note"] = "Adjusted for 5 hypotheses using Benjamini-Hochberg FDR procedure."
            final_results.append(item)

        final_results = sorted(final_results, key=lambda x: abs(x["cohens_d"]), reverse=True)
        return final_results
