import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    roc_auc_score, accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_curve
)
from typing import Dict, Any, List

class JDSModelPipeline:
    """
    Supporting ML Pipeline for JDS Skill Traits dataset.
    Phase 2 Enhanced Pipeline:
    - 5-Fold Stratified CV with per-fold tracking & Mean ± Std calculation
    - Model comparison table with fold variability metrics
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
        self.results = {}

    def run_pipeline(self) -> Dict[str, Any]:
        X = self.df[self.predictors].copy()
        y = self.df[self.target].copy()

        models = {
            "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
            "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=4),
            "Random Forest": RandomForestClassifier(random_state=42, n_estimators=50, max_depth=4)
        }

        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        comparison_table = []
        detailed_models = {}

        best_model_name = None
        best_mean_auc = -1.0

        for name, clf in models.items():
            fold_metrics = []
            oof_preds = np.zeros(len(self.df))
            oof_probas = np.zeros(len(self.df))

            for fold_idx, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
                X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
                y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

                clf_fold = clf.__class__(**clf.get_params())
                clf_fold.fit(X_train, y_train)

                val_pred = clf_fold.predict(X_val)
                val_proba = clf_fold.predict_proba(X_val)[:, 1] if hasattr(clf_fold, "predict_proba") else val_pred

                oof_preds[val_idx] = val_pred
                oof_probas[val_idx] = val_proba

                f_auc = float(round(roc_auc_score(y_val, val_proba), 4))
                f_acc = float(round(accuracy_score(y_val, val_pred), 4))
                f_prec = float(round(precision_score(y_val, val_pred, zero_division=0), 4))
                f_rec = float(round(recall_score(y_val, val_pred, zero_division=0), 4))
                f_f1 = float(round(f1_score(y_val, val_pred, zero_division=0), 4))

                fold_metrics.append({
                    "fold": fold_idx,
                    "roc_auc": f_auc,
                    "accuracy": f_acc,
                    "precision": f_prec,
                    "recall": f_rec,
                    "f1_score": f_f1
                })

            aucs = [m["roc_auc"] for m in fold_metrics]
            accs = [m["accuracy"] for m in fold_metrics]
            precs = [m["precision"] for m in fold_metrics]
            recs = [m["recall"] for m in fold_metrics]
            f1s = [m["f1_score"] for m in fold_metrics]

            stats_summary = {
                "roc_auc": {"mean": round(np.mean(aucs), 4), "std": round(np.std(aucs), 4), "min": round(min(aucs), 4), "max": round(max(aucs), 4)},
                "accuracy": {"mean": round(np.mean(accs), 4), "std": round(np.std(accs), 4), "min": round(min(accs), 4), "max": round(max(accs), 4)},
                "precision": {"mean": round(np.mean(precs), 4), "std": round(np.std(precs), 4), "min": round(min(precs), 4), "max": round(max(precs), 4)},
                "recall": {"mean": round(np.mean(recs), 4), "std": round(np.std(recs), 4), "min": round(min(recs), 4), "max": round(max(recs), 4)},
                "f1_score": {"mean": round(np.mean(f1s), 4), "std": round(np.std(f1s), 4), "min": round(min(f1s), 4), "max": round(max(f1s), 4)}
            }

            cm = confusion_matrix(y, oof_preds).tolist()
            fpr, tpr, _ = roc_curve(y, oof_probas)
            roc_points = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)} for f, t in zip(fpr, tpr)]

            clf.fit(X, y)
            feature_imp = []
            if hasattr(clf, "coef_"):
                for p, c in zip(self.predictors, clf.coef_[0]):
                    feature_imp.append({"feature": p, "importance": round(float(c), 4), "type": "coefficient"})
            elif hasattr(clf, "feature_importances_"):
                for p, imp in zip(self.predictors, clf.feature_importances_):
                    feature_imp.append({"feature": p, "importance": round(float(imp), 4), "type": "importance"})

            feature_imp = sorted(feature_imp, key=lambda x: abs(x["importance"]), reverse=True)

            formatted_metrics = {
                "roc_auc_str": f"{stats_summary['roc_auc']['mean']:.4f} ± {stats_summary['roc_auc']['std']:.4f}",
                "accuracy_str": f"{stats_summary['accuracy']['mean']:.4f} ± {stats_summary['accuracy']['std']:.4f}",
                "precision_str": f"{stats_summary['precision']['mean']:.4f} ± {stats_summary['precision']['std']:.4f}",
                "recall_str": f"{stats_summary['recall']['mean']:.4f} ± {stats_summary['recall']['std']:.4f}",
                "f1_score_str": f"{stats_summary['f1_score']['mean']:.4f} ± {stats_summary['f1_score']['std']:.4f}"
            }

            model_data = {
                "name": name,
                "stats_summary": stats_summary,
                "formatted_metrics": formatted_metrics,
                "fold_metrics": fold_metrics,
                "confusion_matrix": cm,
                "roc_curve": roc_points,
                "feature_importance": feature_imp
            }

            detailed_models[name] = model_data
            comparison_table.append({
                "model_name": name,
                "mean_roc_auc": stats_summary['roc_auc']['mean'],
                "roc_auc_std": stats_summary['roc_auc']['std'],
                "roc_auc_str": formatted_metrics["roc_auc_str"],
                "accuracy_str": formatted_metrics["accuracy_str"],
                "precision_str": formatted_metrics["precision_str"],
                "recall_str": formatted_metrics["recall_str"],
                "f1_score_str": formatted_metrics["f1_score_str"]
            })

            if stats_summary['roc_auc']['mean'] > best_mean_auc:
                best_mean_auc = stats_summary['roc_auc']['mean']
                best_model_name = name

        self.results = {
            "target": self.target,
            "predictors": self.predictors,
            "sample_size": len(self.df),
            "best_model_name": best_model_name,
            "best_auc": best_mean_auc,
            "comparison_table": comparison_table,
            "models": detailed_models
        }
        return self.results
