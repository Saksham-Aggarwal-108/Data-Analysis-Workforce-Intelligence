import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { HackathonInsightCard, ExecutiveNarrative } from '../types';
import { EvidenceModal, EvidenceItem } from '../components/EvidenceModal';
import { Compass, FileText, CheckCircle2, HelpCircle, ArrowRight, Lightbulb, ShieldAlert, BookOpen, AlertOctagon, Layers } from 'lucide-react';

export const WorkforceStrategy: React.FC = () => {
  const [cards, setCards] = useState<HackathonInsightCard[]>([]);
  const [narrative, setNarrative] = useState<ExecutiveNarrative | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkforce() {
      try {
        const [cRes, nRes] = await Promise.all([
          api.getWorkforceCards(),
          api.getWorkforceNarrative()
        ]);
        setCards(cRes);
        setNarrative(nRes);
      } catch (err) {
        console.error('Error loading workforce strategy:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkforce();
  }, []);

  if (loading || !narrative) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Unified Workforce Intelligence &amp; Executive Narrative...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            Unified Workforce Intelligence Layer (Phase 4 Evidence Mode)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-Layer Evidence Synthesis across Market, Skills, Junior Career, and Senior Success
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono font-medium">
            Multi-Dataset Synthesis (No False Row Merging)
          </span>
        </div>
      </div>

      {/* Executive Narrative Section */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Executive Narrative &amp; Strategic Synthesis
          </h3>
          <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
            Hackathon Executive Overview
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider">1. What Does the Market Demand?</div>
            <p className="text-slate-300 leading-relaxed">{narrative.market_demand_summary}</p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-purple-400 uppercase text-[10px] tracking-wider">2. Which Skills Are Prominent?</div>
            <p className="text-slate-300 leading-relaxed">{narrative.prominent_skills_summary}</p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-indigo-400 uppercase text-[10px] tracking-wider">3. Junior Career Signals</div>
            <p className="text-slate-300 leading-relaxed">{narrative.junior_career_summary}</p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-amber-400 uppercase text-[10px] tracking-wider">4. Senior Success Signals</div>
            <p className="text-slate-300 leading-relaxed">{narrative.senior_success_summary}</p>
          </div>
        </div>

        {/* Strategic Learnings & What NOT to Conclude */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
            <div className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strategic Organisational Learnings
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {narrative.strategic_learnings.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-2">
            <div className="font-bold text-rose-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" /> What Should NOT Be Concluded
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {narrative.what_not_to_conclude.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 7-Field Hackathon Insight Cards with Evidence Mode */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white">7-Field Traceable Hackathon Insight Cards</h3>
        {cards.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-6 border border-slate-800 space-y-4 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
                  {item.id}
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Dataset: {item.dataset}
                </span>
                <button
                  onClick={() => setSelectedEvidence({
                    finding_id: item.id,
                    question: item.question,
                    dataset: item.dataset,
                    variables: item.variables,
                    method: item.analysis,
                    evidence: item.evidence,
                    finding: item.finding,
                    interpretation: item.interpretation,
                    implication: item.implication,
                    limitation: item.limitations
                  })}
                  className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" /> View Evidence
                </button>
              </div>
            </div>

            {/* Question */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Question
              </div>
              <div className="text-sm font-bold text-white pl-5">{item.question}</div>
            </div>

            {/* Analysis Method & Variables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-5">
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/90 text-xs space-y-1">
                <div className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Variables Analyzed</div>
                <div className="font-mono text-blue-400 text-[11px]">{item.variables.join(', ')}</div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/90 text-xs space-y-1">
                <div className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Analytical Method</div>
                <div className="text-slate-300">{item.analysis}</div>
              </div>
            </div>

            {/* Evidence & Finding Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-5">
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/90 text-xs space-y-1">
                <div className="font-semibold text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-400" /> Empirical Evidence
                </div>
                <p className="text-slate-300 leading-relaxed">{item.evidence}</p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/90 text-xs space-y-1">
                <div className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" /> Analytical Finding
                </div>
                <p className="text-slate-200 font-semibold leading-relaxed">{item.finding}</p>
              </div>
            </div>

            {/* Interpretation & Implication */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-5 border-t border-slate-800/60 pt-3">
              <div className="text-xs space-y-1">
                <div className="font-semibold text-indigo-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-indigo-400" /> Analytical Interpretation
                </div>
                <p className="text-slate-300 leading-relaxed">{item.interpretation}</p>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-semibold text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Strategic Implication
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">{item.implication}</p>
              </div>
            </div>

            {/* Limitations Footer */}
            <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg text-[11px] text-amber-300/80 leading-relaxed flex items-start gap-2 ml-5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div><strong>Limitation:</strong> {item.limitations}</div>
            </div>
          </div>
        ))}
      </div>

      <EvidenceModal item={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
    </div>
  );
};

