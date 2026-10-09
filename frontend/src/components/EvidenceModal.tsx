import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle, CheckCircle2, Lightbulb, ArrowRight, AlertTriangle, Scale } from 'lucide-react';

export interface EvidenceItem {
  finding_id?: string;
  question: string;
  dataset: string;
  variables: string[];
  preparation?: string[];
  method: string;
  metric?: string;
  value?: string;
  evidence: string;
  finding: string;
  interpretation: string;
  implication: string;
  limitation: string;
}

interface EvidenceModalProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
              {item.finding_id || 'EVIDENCE ITEM'}
            </span>
            <span className="text-xs font-mono text-slate-400">Dataset: <strong className="text-slate-200">{item.dataset}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Analytical Question
          </div>
          <h3 className="text-base font-bold text-white pl-5">{item.question}</h3>
        </div>

        {/* Variables & Method Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pl-5">
          <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Variables Evaluated</div>
            <div className="font-mono text-blue-400 font-semibold">{item.variables.join(', ')}</div>
          </div>
          <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Analytical Method &amp; Metric</div>
            <div className="text-slate-200 font-semibold">{item.method} {item.metric ? `(${item.metric})` : ''}</div>
          </div>
        </div>

        {/* Evidence & Finding Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pl-5">
          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-400" /> Empirical Evidence
            </div>
            <p className="text-slate-300 leading-relaxed">{item.evidence}</p>
          </div>
          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-blue-400 font-mono uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-400" /> Analytical Finding
            </div>
            <p className="text-slate-200 font-semibold leading-relaxed">{item.finding}</p>
          </div>
        </div>

        {/* Interpretation & Implication */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pl-5 border-t border-slate-800/80 pt-3">
          <div className="space-y-1">
            <div className="text-[10px] text-indigo-400 font-mono uppercase font-bold flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-indigo-400" /> Interpretation
            </div>
            <p className="text-slate-300 leading-relaxed">{item.interpretation}</p>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-emerald-400" /> Implication
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">{item.implication}</p>
          </div>
        </div>

        {/* Limitations */}
        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2 ml-5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div><strong>Limitation:</strong> {item.limitation}</div>
        </div>
      </div>
    </div>
  );
};
