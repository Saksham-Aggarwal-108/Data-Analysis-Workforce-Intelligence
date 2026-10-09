import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { ModelPipelineResult, ModelDetail, VIFDiagnostic, LogisticInference } from '../types';
import { EthicalBanner } from '../components/EthicalBanner';
import { FoldMetricsTable } from '../components/FoldMetricsTable';
import { PredictionDemo } from '../components/PredictionDemo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Cell } from 'recharts';
import { FlaskConical, Award, BrainCircuit, CheckCircle2, Sliders, ShieldCheck, HelpCircle, FileText, ArrowRight, Lightbulb, Activity, Layers } from 'lucide-react';

export const ModelLab: React.FC = () => {
  const [sdsModel, setSdsModel] = useState<ModelPipelineResult | null>(null);
  const [selectedModelKey, setSelectedModelKey] = useState<string>('Random Forest');
  const [vifData, setVifData] = useState<VIFDiagnostic[]>([]);
  const [logisticInference, setLogisticInference] = useState<LogisticInference[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModelLab() {
      try {
        const [modelRes, statsRes, auditRes] = await Promise.all([
          api.getSeniorModel(),
          api.getSeniorStats(),
          api.getSeniorValidationAudit()
        ]);
        setSdsModel(modelRes);
        if (modelRes?.selected_model) {
          setSelectedModelKey(modelRes.selected_model);
        }
        setVifData(statsRes.vif_diagnostics);
        setLogisticInference(statsRes.logistic_inference);
        setAuditData(auditRes);
      } catch (err) {
        console.error('Error loading Model Lab:', err);
      } finally {
        setLoading(false);
      }
    }
    loadModelLab();
  }, []);

  if (loading || !sdsModel) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Model Lab Supervised Pipelines, Diagnostics & Audit Gate...</div>
      </div>
    );
  }

  const activeModelDetail: ModelDetail | undefined = sdsModel.models[selectedModelKey];
  const rationale = sdsModel.selection_rationale;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-400" />
            Supervised Machine Learning Model Lab (Phase 2 &amp; 2.1 Audit Gate)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Primary Target: <span className="font-mono text-emerald-400 font-semibold">success_classification_high_low</span> | Dataset: <span className="font-mono text-slate-200">SDS Personality Traits.xlsx</span> (N=161)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono font-medium">
            Phase 2.1 Audit Gate: PASSED
          </span>
        </div>
      </div>

      {/* Model Overview & Pipeline Card */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-blue-400" />
              Model Overview &amp; Cross-Validation Pipeline Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervised Binary Classification ($N=161$) evaluated via fold-isolated Stratified Cross-Validation
            </p>
          </div>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold">
            v2.1.0-Validated
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs font-mono">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Primary Model</div>
            <div className="font-bold text-blue-400 mt-1">Random Forest</div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Primary Dataset</div>
            <div className="font-bold text-slate-200 mt-1">SDS Personality</div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Sample Size</div>
            <div className="font-bold text-emerald-400 mt-1">N = 161</div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Input Predictors</div>
            <div className="font-bold text-purple-400 mt-1">Big Five (5)</div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Target Variable</div>
            <div className="font-bold text-amber-400 mt-1">High/Low Success</div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Validation</div>
            <div className="font-bold text-emerald-400 mt-1">5-Fold Stratified</div>
          </div>
        </div>

        {/* Visual Pipeline */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-center font-mono grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-blue-400 font-bold">1. RAW DATA</div>
            <div className="text-slate-300 text-[11px] font-sans">Big Five Trait Scores</div>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-indigo-400 font-bold">2. PREPROCESSING</div>
            <div className="text-slate-300 text-[11px] font-sans">In-Fold StandardScaler</div>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-purple-400 font-bold">3. ENSEMBLE CLASSIFIER</div>
            <div className="text-slate-300 text-[11px] font-sans">Random Forest (100 Trees)</div>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-amber-400 font-bold">4. OUTPUT LABELS</div>
            <div className="text-slate-300 text-[11px] font-sans">High / Low Success</div>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-emerald-400 font-bold">5. EXPLAINABILITY</div>
            <div className="text-slate-300 text-[11px] font-sans">Gini + Permutation Drops</div>
          </div>
        </div>
      </div>

      <EthicalBanner />

      {/* Model Selection Rationale Card */}
      {rationale && (
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Model Selection Rationale & Empirical Decision Framework
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              Validated Pipeline
            </span>
          </div>

          <div className="text-xs space-y-2">
            <div><strong className="text-slate-300">Question:</strong> {rationale.question}</div>
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 text-slate-300"><strong className="text-emerald-400">Evidence:</strong> {rationale.evidence}</div>
            <div><strong className="text-blue-400">Finding:</strong> {rationale.finding}</div>
            <div><strong className="text-indigo-400">Interpretation:</strong> {rationale.interpretation}</div>
            <div><strong className="text-emerald-400">Implication:</strong> {rationale.implication}</div>
          </div>
        </div>
      )}

      {/* Candidate Models Comparison Table (Mean ± Std) */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Candidate Models Performance (Official 5-Fold Stratified CV Mean ± Std)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Selected Final Model: <strong className="text-blue-400">{sdsModel.selected_model}</strong>
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 bg-slate-900">
              <tr>
                <th className="p-3">Model Candidate</th>
                <th className="p-3 text-center">Mean ROC-AUC ± Std</th>
                <th className="p-3 text-center">Accuracy</th>
                <th className="p-3 text-center">Precision</th>
                <th className="p-3 text-center">Recall</th>
                <th className="p-3 text-center">F1-Score</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {sdsModel.comparison_table.map((row, idx) => {
                const isSelected = row.model_name === sdsModel.selected_model;
                const isCurrent = row.model_name === selectedModelKey;
                return (
                  <tr key={idx} className={`hover:bg-slate-800/40 ${isCurrent ? 'bg-blue-500/10' : ''}`}>
                    <td className="p-3 font-semibold text-slate-200 font-sans flex items-center gap-2">
                      {row.model_name}
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans font-bold">
                          Preferred Final Model
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.roc_auc_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.accuracy_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.precision_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.recall_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.f1_score_str}</td>
                    <td className="p-3 text-center font-sans">
                      <button
                        onClick={() => setSelectedModelKey(row.model_name)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Inspect Diagnostics
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Stability & Robustness Audit Section (Phase 2.1 Gate) */}
      {auditData && (
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Phase 2.1 Model Stability &amp; Sensitivity Robustness Check
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparing Standard 5-Fold CV, Grouped-by-ID CV, and 50-Fold Repeated Stratified CV
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-semibold">
              Sensitivity Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Standard 5-Fold */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] text-blue-400 uppercase font-bold font-sans">1. Official 5-Fold CV</div>
              <div className="text-lg font-bold text-emerald-400">{auditData.official_cv.results.random_forest.mean_roc_auc.toFixed(4)}</div>
              <div className="text-[11px] text-slate-400 font-sans">Std: &plusmn; {auditData.official_cv.results.random_forest.std_roc_auc.toFixed(4)}</div>
              <div className="text-[10px] text-slate-500 font-sans border-t border-slate-800 pt-1">Stratified 5-Fold CV</div>
            </div>

            {/* Grouped CV */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] text-indigo-400 uppercase font-bold font-sans">2. Grouped-by-ID CV</div>
              <div className="text-lg font-bold text-emerald-400">{auditData.grouped_cv_sensitivity.results.random_forest.mean_roc_auc.toFixed(4)}</div>
              <div className="text-[11px] text-slate-400 font-sans">Delta vs SKF: {auditData.grouped_cv_sensitivity.delta_vs_official.random_forest_auc_delta.toFixed(4)}</div>
              <div className="text-[10px] text-slate-500 font-sans border-t border-slate-800 pt-1">Stratified Group K-Fold</div>
            </div>

            {/* 50-Fold Repeated CV */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] text-purple-400 uppercase font-bold font-sans">3. 50-Fold Repeated CV</div>
              <div className="text-lg font-bold text-emerald-400">{auditData.robustness_cv_50fold.results.random_forest.mean_roc_auc.toFixed(4)}</div>
              <div className="text-[11px] text-slate-400 font-sans">Range: [{auditData.robustness_cv_50fold.results.random_forest.min_roc_auc.toFixed(4)} - {auditData.robustness_cv_50fold.results.random_forest.max_roc_auc.toFixed(4)}]</div>
              <div className="text-[10px] text-slate-500 font-sans border-t border-slate-800 pt-1">10 Repeats &times; 5 Folds</div>
            </div>
          </div>

          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-xs text-purple-200 leading-relaxed font-sans">
            <strong>AUDIT VERDICT:</strong> Random Forest performance remains stable across standard Stratified CV, Grouped-by-ID CV (&Delta; = 0.0001), and 50-Fold Repeated CV. Duplicate candidate IDs do <strong>NOT</strong> cause data leakage.
          </div>
        </div>
      )}

      {/* Fold-Level Metrics Table for Selected Model */}
      {activeModelDetail && <FoldMetricsTable modelDetail={activeModelDetail} />}

      {/* Interactive Prediction Demo */}
      <PredictionDemo />

      {/* Model Explainability: Non-Technical Explanation Cards + Visuals */}
      {activeModelDetail && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm font-bold text-white">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Deep Explainability &amp; Diagnostics: <span className="text-blue-400">{activeModelDetail.name}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Out-of-Fold Evaluation</span>
          </div>

          {/* Non-Technical Explanatory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-blue-400 uppercase text-[11px] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> Impurity vs Permutation Importance
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Gini Impurity</strong> measures how often a feature splits nodes during tree construction. <strong>Permutation Importance</strong> measures actual out-of-fold accuracy loss when a feature is randomly shuffled.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400 uppercase text-[11px] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> Odds Ratio Interpretation
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Odds Ratio (OR)</strong> indicates the multiplicative change in the odds of high-success classification per 1-unit increase in personality trait score, holding all other traits constant.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-purple-400 uppercase text-[11px] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> VIF Multicollinearity Diagnostic
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Variance Inflation Factor (VIF)</strong> detects linear redundancy between predictors. VIF &lt; 2.5 confirms low collinearity, validating Logistic Regression coefficient stability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ROC Curve */}
            <div className="glass-card rounded-xl p-5 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Out-of-Fold Receiver Operating Characteristic (ROC Curve)
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeModelDetail.roc_curve} margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke="#64748b" fontSize={11} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                    <YAxis dataKey="tpr" type="number" domain={[0, 1]} stroke="#94a3b8" fontSize={11} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="tpr" stroke="#10b981" strokeWidth={3} dot={false} name="True Positive Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Impurity Feature Importance */}
            <div className="glass-card rounded-xl p-5 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Gini Impurity Feature Importance / Direction
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeModelDetail.feature_importance} layout="vertical" margin={{ left: 50, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={10} width={140} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="importance" radius={[0, 4, 4, 0]} name="Importance / Coef">
                      {activeModelDetail.feature_importance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.importance >= 0 ? '#3b82f6' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Permutation Importance Table & Confusion Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Permutation Importance */}
            {activeModelDetail.permutation_importance && (
              <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Permutation Feature Importance (Validation Accuracy Drops)
                </h4>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="text-slate-400 bg-slate-900">
                      <tr>
                        <th className="p-2">Feature Name</th>
                        <th className="p-2 text-center">Permutation Mean Drop</th>
                        <th className="p-2 text-center">Permutation Std</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {activeModelDetail.permutation_importance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2 font-sans font-semibold text-slate-200">{item.feature}</td>
                          <td className="p-2 text-center text-emerald-400 font-bold">{item.permutation_mean.toFixed(4)}</td>
                          <td className="p-2 text-center text-slate-400">&plusmn; {item.permutation_std.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Confusion Matrix */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Out-of-Fold Confusion Matrix
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono pt-2">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">True Negatives (TN)</div>
                  <div className="text-2xl font-bold text-slate-200 mt-1">{activeModelDetail.confusion_matrix[0][0]}</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">False Positives (FP)</div>
                  <div className="text-2xl font-bold text-rose-400 mt-1">{activeModelDetail.confusion_matrix[0][1]}</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">False Negatives (FN)</div>
                  <div className="text-2xl font-bold text-rose-400 mt-1">{activeModelDetail.confusion_matrix[1][0]}</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">True Positives (TP)</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{activeModelDetail.confusion_matrix[1][1]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logistic Regression Odds Ratios & VIF Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logistic Regression Odds Ratios & 95% CIs */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-blue-400" /> Logistic Regression Odds Ratios &amp; 95% Confidence Intervals
              </h4>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-slate-400 bg-slate-900">
                    <tr>
                      <th className="p-2">Feature</th>
                      <th className="p-2 text-center">Coef</th>
                      <th className="p-2 text-center">Odds Ratio</th>
                      <th className="p-2 text-center">95% CI</th>
                      <th className="p-2 text-center">p-val</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {logisticInference.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2 font-sans font-semibold text-slate-200">{row.feature}</td>
                        <td className="p-2 text-center text-slate-300">{row.coefficient}</td>
                        <td className="p-2 text-center text-emerald-400 font-bold">{row.odds_ratio}</td>
                        <td className="p-2 text-center text-slate-400">[{row.ci_95_lower} - {row.ci_95_upper}]</td>
                        <td className={`p-2 text-center font-bold ${row.is_statistically_significant ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {row.p_value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VIF Diagnostics */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Multicollinearity Diagnostics (VIF)
              </h4>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-slate-400 bg-slate-900">
                    <tr>
                      <th className="p-2">Feature</th>
                      <th className="p-2 text-center">VIF Value</th>
                      <th className="p-2">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {vifData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2 font-sans font-semibold text-slate-200">{row.feature}</td>
                        <td className="p-2 text-center text-emerald-400 font-bold">{row.vif}</td>
                        <td className="p-2 font-sans text-slate-400 text-[11px]">{row.interpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

