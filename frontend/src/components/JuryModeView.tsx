import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Award, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  BrainCircuit, 
  Activity, 
  Database,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Compass,
  Lock,
  FileCheck
} from 'lucide-react';
import { TabType } from '../types';

interface JuryModeViewProps {
  onNavigate: (tab: TabType) => void;
}

export const JuryModeView: React.FC<JuryModeViewProps> = ({ onNavigate }) => {
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(0);

  const toggleQa = (index: number) => {
    setOpenQaIndex(openQaIndex === index ? null : index);
  };

  const qaList = [
    {
      q: "1. Why use four separate datasets instead of one merged dataset?",
      a: "The datasets describe four distinct evidence layers (Market Demand, Skill Prevalence, Junior Career Growth, Senior Professional Success) and do not share a defensible common entity identifier. A row-wise merge would create artificial row correlations and false inference. We preserve analytical isolation at the data level and synthesize evidence at the workforce-strategy layer."
    },
    {
      q: "2. Why didn't you merge them row-wise?",
      a: "Merging without a common candidate ID across job postings and employee records would violate basic statistical independence. Isolating the datasets allows each layer to use appropriate methodologies (e.g. NLP tokenization for job postings vs. 5-fold cross-validated Random Forest for senior personality traits)."
    },
    {
      q: "3. Why is SDS Personality Traits the primary predictive modeling dataset?",
      a: "SDS Personality Traits contains structured Big Five psychological dimensions alongside verified binary performance outcomes for senior customer-facing data scientists ($N=161$), making it the highest-signal dataset for supervised classification."
    },
    {
      q: "4. Why choose Random Forest as the primary model?",
      a: "Random Forest achieved superior out-of-fold ROC-AUC ($0.9928 \\pm 0.0048$) compared to Logistic Regression ($0.9575$) and Decision Tree ($0.9328$). Its ensemble design captures non-linear feature interactions between Conscientiousness and Neuroticism without overfitting."
    },
    {
      q: "5. Why not use Deep Learning / Neural Networks?",
      a: "Deep learning models require thousands of observations and lack inherent tabular explainability. On $N=161$, a deep network would severely overfit. Random Forest provides clear Gini and Permutation importance with lower variance."
    },
    {
      q: "6. Why only 161 observations in the SDS dataset?",
      a: "Senior customer-facing data science roles with verified personality assessments are rare enterprise cohorts. The sample size ($N=161$) is appropriate for exploratory workforce research, and our 5-fold cross-validation and 50-fold repeated CV confirm statistical stability."
    },
    {
      q: "7. Doesn't 0.9928 ROC-AUC indicate overfitting or data leakage?",
      a: "No. The ROC-AUC was evaluated strictly out-of-fold inside a 5-Fold Stratified CV pipeline with fold-isolated scaling. Furthermore, sensitivity checks (Grouped-by-ID CV $\\Delta = 0.0001$ and 50-Fold Repeated CV AUC $= 0.9957$) prove performance is genuine within this sample."
    },
    {
      q: "8. How did you verify that data leakage did not occur?",
      a: "We implemented fold-isolated preprocessing where `StandardScaler` is fitted exclusively on training folds. We also audited candidate ID repeats and ran `StratifiedGroupKFold` sensitivity analysis, which yielded an identical ROC-AUC ($0.9927$), proving zero ID leakage."
    },
    {
      q: "9. Why run Grouped-by-ID Cross Validation?",
      a: "To test whether the 9 repeated candidate ID entries (18 rows total) in SDS artificially inflated performance when split across folds. The grouped CV confirmed zero performance drop ($\Delta = 0.0001$)."
    },
    {
      q: "10. What does 50-Fold Repeated CV tell us?",
      a: "It proves that model accuracy and ROC-AUC are not artifacts of a lucky 5-fold split. Across 10 repeats of 5-fold CV (50 evaluations), the mean ROC-AUC remained $0.9957 \\pm 0.0080$."
    },
    {
      q: "11. Why use StandardScaler strictly inside CV folds?",
      a: "Fitting scalers on the full dataset before splitting leaks test set mean and variance into training folds. In-fold scaling ensures complete validation isolation."
    },
    {
      q: "12. Why include Logistic Regression as a baseline?",
      a: "Logistic Regression provides parametric interpretability via Odds Ratios ($8.56$ for Conscientiousness) and standard errors, validating the linear direction of trait effects alongside Random Forest."
    },
    {
      q: "13. Why use Cohen's d effect size alongside p-values?",
      a: "P-values indicate statistical significance, while Cohen's $d$ measures practical magnitude. Conscientiousness showed $d = +2.05$ (huge positive effect) and Neuroticism showed $d = -1.97$ (huge negative effect)."
    },
    {
      q: "14. What does the VIF diagnostic prove?",
      a: "Variance Inflation Factor (VIF) checks for multicollinearity among the Big Five predictors. All VIF values were $< 2.5$, proving low collinearity and stable regression coefficients."
    },
    {
      q: "15. Can this model be used for automated candidate hiring?",
      a: "ABSOLUTELY NOT. Personality traits represent observational associations in a specific sample. Under Responsible AI governance rules, personality metrics must NEVER be used to reject candidates or automate hiring decisions."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900 p-6 rounded-2xl border border-blue-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Jury Mode Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                System Frozen &amp; Verified
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Jury Presentation Command Center
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Rapid 7-minute visual walkthrough: Problem formulation, 4-dataset architecture, cross-validated Random Forest explainability ($0.9928$ ROC-AUC), validation robustness, and Responsible AI strategy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('models')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
            >
              Open Model Lab
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. OUR MODEL IN 60 SECONDS */}
      <div className="glass-card rounded-xl p-6 border border-blue-500/30 bg-blue-950/20 space-y-3">
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
          <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-blue-400" />
            Our Model In 60 Seconds
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
            Core Pitch
          </span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          "We use the <strong>SDS Personality Traits dataset</strong> to study whether five observed personality dimensions are statistically associated with a binary high/low professional-success classification in the supplied sample ($N=161$). A <strong>Random Forest Classifier</strong> learns patterns across the five dimensions and classifies observations into high or low success with <strong>ROC-AUC = 0.9928 &plusmn; 0.0048</strong>. We evaluate it using 5-fold stratified cross-validation rather than a single split, and additionally perform <strong>grouped-ID sensitivity analysis</strong> and <strong>50-fold repeated cross-validation</strong> to test robustness. The model identifies statistical signals, not causal relationships. Therefore, we position it as exploratory workforce intelligence rather than an automated hiring system."
        </p>
      </div>

      {/* 2. WHY NOT MERGE THE DATASETS? (ARCHITECTURE CARD) */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Dataset Architecture: Why We Do NOT Row-Wise Merge
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Methodological isolation across 4 complementary workforce evidence layers
            </p>
          </div>
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded">
            Analytical Isolation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-blue-400 uppercase">Layer 1: Market</div>
            <div className="text-sm font-bold text-white">DataScience Jobs</div>
            <div className="text-xs font-mono text-emerald-400 font-bold">1,602 Records</div>
            <div className="text-[10px] text-slate-400 font-sans">Advertised Salary &amp; Experience</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-indigo-400 uppercase">Layer 2: Skills</div>
            <div className="text-sm font-bold text-white">Analytics Jobs</div>
            <div className="text-xs font-mono text-emerald-400 font-bold">15,841 Records</div>
            <div className="text-[10px] text-slate-400 font-sans">Skill Prevalence across Bands</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-purple-400 uppercase">Layer 3: Junior</div>
            <div className="text-sm font-bold text-white">JDS Skill Traits</div>
            <div className="text-xs font-mono text-emerald-400 font-bold">139 Records</div>
            <div className="text-[10px] text-slate-400 font-sans">Skill Traits &amp; Salary Hike</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-amber-400 uppercase">Layer 4: Senior</div>
            <div className="text-sm font-bold text-white">SDS Personality</div>
            <div className="text-xs font-mono text-emerald-400 font-bold">161 Records</div>
            <div className="text-[10px] text-slate-400 font-sans">Big Five &amp; High Success ML</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <ShieldAlert className="w-4 h-4" />
            Methodological Defense: No False Merging
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            "The four datasets describe different evidence layers and do <strong>NOT</strong> share a defensible common entity identifier. A row-wise merge would create artificial relationships and false statistical inference. We therefore keep the datasets analytically isolated and synthesize their evidence at the <strong>Workforce Strategy Layer</strong>."
          </p>
        </div>
      </div>

      {/* 3. HOW OUR MODEL WORKS (VISUAL PIPELINE) */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              How Our Model Works: End-to-End Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              From raw Big Five trait inputs to out-of-fold evaluation &amp; feature importance
            </p>
          </div>
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono rounded">
            Random Forest Classifier
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs text-center font-mono">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-blue-400 font-bold">1. INPUTS</div>
            <div className="text-slate-200 font-sans font-medium text-[11px]">Big Five Traits</div>
            <div className="text-[9px] text-slate-400 font-mono">N, E, O, A, C</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-indigo-400 font-bold">2. PREPROCESSING</div>
            <div className="text-slate-200 font-sans font-medium text-[11px]">In-Fold Scaler</div>
            <div className="text-[9px] text-slate-400 font-mono">StandardScaler</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-purple-400 font-bold">3. ENSEMBLE ML</div>
            <div className="text-slate-200 font-sans font-medium text-[11px]">Random Forest</div>
            <div className="text-[9px] text-slate-400 font-mono">100 Trees (Depth 5)</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-amber-400 font-bold">4. CLASSIFICATION</div>
            <div className="text-slate-200 font-sans font-medium text-[11px]">Success Label</div>
            <div className="text-[9px] text-slate-400 font-mono">High vs Low</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-emerald-400 font-bold">5. EVALUATION</div>
            <div className="text-slate-200 font-sans font-medium text-[11px]">Stratified 5-Fold</div>
            <div className="text-[9px] text-emerald-400 font-bold">AUC = 0.9928</div>
          </div>
        </div>
      </div>

      {/* 4. WHY SHOULD I TRUST THIS MODEL? (8-STEP VALIDATION CHAIN) */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-400" />
              Why Should I Trust This Model? (8-Step Validation Chain)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical verification preventing data leakage, overfitting, and statistical bias
            </p>
          </div>
          <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono rounded">
            Validation Gate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              title: "1. Stratified 5-Fold Cross Validation",
              desc: "Ensures equal target class proportions (53.4% high success) across all 5 folds to prevent fold bias.",
              value: "ROC-AUC: 0.9928 ± 0.0048"
            },
            {
              title: "2. Grouped-by-Candidate-ID Sensitivity Analysis",
              desc: "Checks whether candidate ID repeats cause leakage across folds.",
              value: "Grouped AUC: 0.9927 (Delta = 0.0001)"
            },
            {
              title: "3. 50-Fold Repeated Cross Validation",
              desc: "Evaluates stability across 10 repeats of 5-fold CV to confirm results are not artifacts of a single split.",
              value: "Repeated AUC: 0.9957 ± 0.0080"
            },
            {
              title: "4. Out-of-Fold (OOF) Prediction Evaluation",
              desc: "Evaluates model predictions strictly on held-out validation folds that were unseen during training.",
              value: "Accuracy: 0.9627 ± 0.0177"
            },
            {
              title: "5. Out-of-Fold Confusion Matrix",
              desc: "Examines exact error counts: 69 True Negatives, 4 False Positives, 2 False Negatives, 86 True Positives.",
              value: "Precision: 0.9548 | Recall: 0.9773"
            },
            {
              title: "6. Multicollinearity VIF Diagnostic",
              desc: "Verifies that predictor variables are not collinear. All VIF values are well below the strict 5.0 threshold.",
              value: "Max VIF: 2.41 (Conscientiousness)"
            },
            {
              title: "7. Statistical Significance Inference",
              desc: "Welch's t-test with Benjamini-Hochberg FDR correction confirms trait differences are statistically genuine.",
              value: "FDR q-value < 0.01"
            },
            {
              title: "8. Responsible AI Governance Review",
              desc: "Ensures non-causal interpretation and explicitly prohibits automated candidate hiring/rejection usage.",
              value: "Governance Status: PASSED"
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{item.title}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.value}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FROM DATA TO DECISION (VISUAL JOURNEY) */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              From Data To Decision: 5-Stage Visual Journey
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Traceability from macro hiring demand down to actionable workforce strategy
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              stage: "Stage 1: Market Intelligence",
              icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
              question: "What does the employer market advertise for data science roles?",
              method: "Regex salary parsing & experience distribution analysis on 1,602 postings.",
              finding: "Advertised salary increases from 8.4L (0-2 yrs) to 28.5L (10+ yrs).",
              implication: "Provides baseline compensation bounding for talent acquisition."
            },
            {
              stage: "Stage 2: Skill Intelligence",
              icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
              question: "What capabilities appear across salary tiers?",
              method: "Tokenization & alias mapping of 15,841 job listings across salary bands.",
              finding: "Python (68%) & SQL (54%) dominate across all bands; Cloud & MLOps spike in 25-50L tier.",
              implication: "Guides upskilling curriculum toward high-value technical capabilities."
            },
            {
              stage: "Stage 3: Junior Career Intelligence",
              icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
              question: "What observed traits associate with early-career salary growth?",
              method: "Statistical comparison & classification model on JDS junior dataset (N=139).",
              finding: "Storytelling & SQL exhibit strongest association with >15% salary hike.",
              implication: "Focuses junior onboarding on communication and core data manipulation."
            },
            {
              stage: "Stage 4: Senior Success Intelligence",
              icon: <Award className="w-4 h-4 text-amber-400" />,
              question: "What personality patterns correlate with senior performance?",
              method: "Cross-validated Random Forest (AUC 0.9928) & Logistic Odds Ratios on SDS (N=161).",
              finding: "Conscientiousness (d=+2.05, OR=8.56) and Emotional Stability (d=-1.97) are key signals.",
              implication: "Informs executive coaching, team design, and retention strategies."
            },
            {
              stage: "Stage 5: Workforce Strategy",
              icon: <Compass className="w-4 h-4 text-emerald-400" />,
              question: "How do we synthesize evidence into responsible workforce action?",
              method: "Evidence registry traceability linking questions, findings, implications, and limitations.",
              finding: "Synthesizes market, skill, and performance insights into unified recommendations.",
              implication: "Drives evidence-informed workforce planning while enforcing Responsible AI boundaries."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  {item.icon}
                  {item.stage}
                </div>
                <span className="text-[10px] font-mono text-slate-400">Step {idx + 1} of 5</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px]">
                <div><strong className="text-slate-400">Question:</strong> <span className="text-slate-200">{item.question}</span></div>
                <div><strong className="text-slate-400">Method:</strong> <span className="text-slate-300">{item.method}</span></div>
                <div><strong className="text-emerald-400">Key Finding:</strong> <span className="text-slate-200">{item.finding}</span></div>
                <div><strong className="text-blue-400">Implication:</strong> <span className="text-slate-300">{item.implication}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RESPONSIBLE AI EXPERIENCE PANEL */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Responsible AI Governance Panel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict ethical boundaries for psychological workforce analytics
            </p>
          </div>
          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono rounded">
            Governance Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* CAN SUPPORT */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="font-bold text-emerald-400 uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> What This Platform CAN Support
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-center gap-2">&bull; Workforce planning and skill gap analysis</li>
              <li className="flex items-center gap-2">&bull; Professional development and capability coaching</li>
              <li className="flex items-center gap-2">&bull; Team design and complementary role structuring</li>
              <li className="flex items-center gap-2">&bull; Role-fit exploration and career pathway planning</li>
              <li className="flex items-center gap-2">&bull; Exploratory workforce intelligence within sample context</li>
            </ul>
          </div>

          {/* MUST NOT DO */}
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
            <div className="font-bold text-rose-400 uppercase text-[11px] flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> What This Model MUST NOT Do
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-center gap-2">&bull; Automated candidate hiring or recruitment gatekeeping</li>
              <li className="flex items-center gap-2">&bull; Candidate rejection based on personality scores</li>
              <li className="flex items-center gap-2">&bull; Personality-based employment discrimination</li>
              <li className="flex items-center gap-2">&bull; Deterministic claims of individual success or failure</li>
              <li className="flex items-center gap-2">&bull; Assertions of direct psychological causality</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-slate-900 rounded-lg text-slate-400 text-[11px] text-center font-mono">
          Note: External validation on larger and representative datasets is strictly required before operational deployment.
        </div>
      </div>

      {/* 7. COLLAPSIBLE JURY Q&A PANEL */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Jury Technical &amp; Strategic Q&amp;A Defense Panel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Concise, technically defensible answers to 15 key jury questions
            </p>
          </div>
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono rounded">
            Interactive Defense
          </span>
        </div>

        <div className="space-y-2">
          {qaList.map((item, idx) => {
            const isOpen = openQaIndex === idx;
            return (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleQa(idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-blue-400 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-800/60 bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
