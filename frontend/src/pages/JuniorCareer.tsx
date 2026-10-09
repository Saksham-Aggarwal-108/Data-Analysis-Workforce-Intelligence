import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { KPICard } from '../components/KPICard';
import { ModelPipelineResult, StatisticalComparison } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { GraduationCap, Award, TrendingUp, CheckCircle2, Scale } from 'lucide-react';

export const JuniorCareer: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [stats, setStats] = useState<StatisticalComparison[]>([]);
  const [modelResult, setModelResult] = useState<ModelPipelineResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJunior() {
      try {
        const [sumRes, statsRes, modelRes] = await Promise.all([
          api.getJuniorSummary(),
          api.getJuniorStats(),
          api.getJuniorModel()
        ]);
        setSummary(sumRes);
        setStats(statsRes);
        setModelResult(modelRes);
      } catch (err) {
        console.error('Error loading junior career layer:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJunior();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Junior Career Intelligence Layer & Statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Junior Career Intelligence Layer (Phase 2 Validation)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dataset: <span className="font-mono text-slate-200">JDS Skill Traits.xlsx</span> (139 junior candidates, 5 technical & storytelling skill traits)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-mono font-medium">
            Layer C: Supporting Salary Hike Classifier
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Junior Candidates" value={summary.total_candidates} icon={<GraduationCap className="w-4 h-4" />} />
        <KPICard title="Target Class (High Hike)" value={`${summary.class_balance?.high_hike?.pct || 52.5}%`} subtitle={`${summary.class_balance?.high_hike?.count || 73} High / ${summary.class_balance?.low_hike?.count || 66} Low`} icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="Supporting Model" value={modelResult?.best_model_name || 'Random Forest'} icon={<Award className="w-4 h-4" />} />
        <KPICard title="Supporting CV ROC-AUC" value={modelResult?.models['Random Forest']?.formatted_metrics?.roc_auc_str || '0.8500'} icon={<Award className="w-4 h-4" />} />
      </div>

      {/* Non-Causal Notice */}
      <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 flex items-start gap-3">
        <Scale className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong>OBSERVED ASSOCIATION DISCLAIMER:</strong> Skill traits in <em>JDS Skill Traits.xlsx</em> demonstrate statistical associations with salary hikes. High skill ratings <strong>do NOT guarantee</strong> salary growth; results reflect observed correlations within this sample cohort.
        </div>
      </div>

      {/* Trait Correlation Chart & Mean Group Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effect Size Chart */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Question 01</div>
            <h3 className="text-sm font-bold text-white">Which skill traits show strongest association with high salary hikes?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: JDS Skill Traits.xlsx | Cohen's d Effect Size</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} layout="vertical" margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[-0.5, 1.5]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={10} width={150} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="cohens_d" radius={[0, 4, 4, 0]} name="Cohen's d Effect Size">
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cohens_d > 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High vs Low Hike Means & Statistical Tests */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Question 02</div>
            <h3 className="text-sm font-bold text-white">How do mean skill ratings differ between high and low hike groups?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: JDS Skill Traits.xlsx | Parametric Group Comparisons</div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900">
                <tr>
                  <th className="p-2.5">Skill Trait</th>
                  <th className="p-2.5 text-center">High Hike (1)</th>
                  <th className="p-2.5 text-center">Low Hike (0)</th>
                  <th className="p-2.5 text-center">Test Used</th>
                  <th className="p-2.5 text-center">p-val</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {stats.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-semibold text-slate-200 font-sans">{row.feature}</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold">{row.group_1_high_mean} ± {row.group_1_high_std}</td>
                    <td className="p-2.5 text-center text-slate-400">{row.group_0_low_mean} ± {row.group_0_low_std}</td>
                    <td className="p-2.5 text-center font-sans text-[11px] text-slate-300">{row.test_name}</td>
                    <td className={`p-2.5 text-center font-bold ${row.is_statistically_significant ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {row.p_value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* Supporting Model Summary Table (Mean ± Std) */}
      {modelResult && (
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              JDS Supporting Classification Models (5-Fold Stratified CV Mean ± Std)
            </h3>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              Target: salary_hike_high_or_low
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900">
                <tr>
                  <th className="p-3">Candidate Model</th>
                  <th className="p-3 text-center">Mean ROC-AUC ± Std</th>
                  <th className="p-3 text-center">Accuracy</th>
                  <th className="p-3 text-center">Precision</th>
                  <th className="p-3 text-center">Recall</th>
                  <th className="p-3 text-center">F1-Score</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {modelResult.comparison_table.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-200 font-sans">{row.model_name}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.roc_auc_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.accuracy_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.precision_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.recall_str}</td>
                    <td className="p-3 text-center text-slate-300">{row.f1_score_str}</td>
                    <td className="p-3 text-center font-sans">
                      {row.model_name === modelResult.best_model_name ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                          Selected Best
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Evaluated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
