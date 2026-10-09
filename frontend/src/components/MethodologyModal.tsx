import React from 'react';
import { X, Layers, CheckCircle2, ShieldCheck, Database, BrainCircuit, ArrowRight } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { step: '01', title: 'Unified Ingestion', desc: 'Preserves raw data integrity across all 4 heterogeneous Excel & CSV files without row-wise merging.' },
    { step: '02', title: 'Data Cleaning', desc: 'Identifies missing values, normalizes text schemas, trims whitespace, and applies transparent treatment rules.' },
    { step: '03', title: 'Quality Validation', desc: 'Audits exact data types, schema match, duplicate IDs, and flags anomalies with severity ratings.' },
    { step: '04', title: 'Feature Engineering', desc: 'Normalizes skill tokens, maps alias variations, and formats Big Five personality trait scales.' },
    { step: '05', title: 'Exploratory Analysis', desc: 'Computes role compensation distribution, within-band skill prevalence, and group trait medians.' },
    { step: '06', title: 'Statistical Testing', desc: 'Applies Shapiro-Wilk normality tests, Welch t-tests / Mann-Whitney U, Cohen\'s d, and FDR adjustments.' },
    { step: '07', title: 'Model Training', desc: 'Trains Logistic Regression, Decision Tree, and Random Forest models on isolated analytical tables.' },
    { step: '08', title: 'Cross-Validation', desc: 'Evaluates 5-fold Stratified CV, Grouped-by-ID CV sensitivity, and 50-fold Repeated Stratified CV.' },
    { step: '09', title: 'Explainability', desc: 'Computes Gini impurity importance, out-of-fold permutation importance, Logistic Odds Ratios, and VIF.' },
    { step: '10', title: 'Workforce Strategy', desc: 'Synthesizes 7-field traceable insight cards and executive narrative for organizational decision making.' }
  ];

  const pipelineStages = [
    { title: 'MARKET', dataset: 'DataScience Jobs.csv', focus: 'Employer Hiring Demand & Salary Ranges' },
    { title: 'SKILLS', dataset: 'Analytics Jobs.csv', focus: 'Normalized Skill Prevalence across Salary Bands' },
    { title: 'JUNIOR CAREER', dataset: 'JDS Skill Traits.xlsx', focus: 'Skill Trait Association with Salary Hike' },
    { title: 'SENIOR SUCCESS', dataset: 'SDS Personality Traits.xlsx', focus: 'Big Five Personality Trait Classification' },
    { title: 'WORKFORCE STRATEGY', dataset: 'Multi-Dataset Synthesis', focus: 'Actionable Intelligence for Talent Strategy' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">End-to-End Analytical Methodology Framework</h2>
              <p className="text-xs text-slate-400">Formal 10-Step Analytical Hierarchy & Data Provenance Specification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Pipeline Hierarchy Flow */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4" /> 5-Stage Analytical Evidence Chain
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/90 space-y-1 text-xs">
                <div className="font-mono text-[10px] text-emerald-400 font-bold">STAGE 0{idx + 1}</div>
                <div className="font-bold text-white">{stage.title}</div>
                <div className="text-[10px] font-mono text-blue-400">{stage.dataset}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">{stage.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Step Methodology Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> 10-Step Scientific Processing Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {steps.map((item) => (
              <div key={item.step} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px] font-bold">
                    STEP {item.step}
                  </span>
                  <span className="font-bold text-slate-200">{item.title}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strict Non-Merging Architecture Disclaimer */}
        <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-blue-300 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong>DATA INTEGRITY & SEPARATION NOTICE:</strong> The four hackathon datasets represent complementary evidence layers. They are <strong>NEVER row-wise merged</strong> into a single fabricated table. All statistical models operate strictly on their corresponding validated datasets.
          </div>
        </div>
      </div>
    </div>
  );
};
