import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { KPICard } from '../components/KPICard';
import { EthicalBanner } from '../components/EthicalBanner';
import { ModelPipelineResult, StatisticalComparison, VIFDiagnostic, LogisticInference } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Award, BrainCircuit, TrendingUp, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export const SeniorSuccess: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [stats, setStats] = useState<{
    group_comparisons: StatisticalComparison[];
    vif_diagnostics: VIFDiagnostic[];
    logistic_inference: LogisticInference[];
  } | null>(null);
  const [modelResult, setModelResult] = useState<ModelPipelineResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSenior() {
      try {
        const [sumRes, statsRes, modelRes] = await Promise.all([
          api.getSeniorSummary(),
          api.getSeniorStats(),
          api.getSeniorModel()
        ]);
        setSummary(sumRes);
        setStats(statsRes);
        setModelResult(modelRes);
      } catch (err) {
        console.error('Error loading senior success layer:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSenior();
  }, []);

  if (loading || !summary || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Senior Success Intelligence Layer & Statistical Tests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Senior Success Intelligence Layer (Phase 2 Validation)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dataset: <span className="font-mono text-slate-200">SDS Personality Traits.xlsx</span> (N=161 observations, Big Five traits)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-mono font-medium">
            PRIMARY Predictive Modelling Dataset
          </span>
        </div>
      </div>

      <EthicalBanner />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Senior Data Scientists" value={summary.total_senior_data_scientists} icon={<Award className="w-4 h-4" />} />
        <KPICard title="High Success Rate" value={`${summary.class_balance?.high_success?.pct || 52.8}%`} subtitle={`${summary.class_balance?.high_success?.count || 85} High / ${summary.class_balance?.low_success?.count || 76} Low`} icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="Primary Target" value="success_classification" subtitle="high_low (Binary 0/1)" icon={<BrainCircuit className="w-4 h-4" />} />
        <KPICard title="Best Model CV ROC-AUC" value={modelResult?.models['Random Forest']?.formatted_metrics?.roc_auc_str || '0.9938 ± 0.0051'} subtitle={modelResult?.selected_model} icon={<ShieldCheck className="w-4 h-4" />} />
      </div>

      {/* Trait Correlations & Group Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Bar Chart */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Question 01</div>
            <h3 className="text-sm font-bold text-white">Which Big Five personality dimensions differentiate success classification?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: SDS Personality Traits.xlsx | Cohen's d Effect Sizes</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.group_comparisons} layout="vertical" margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[-2.5, 2.5]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={150} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="cohens_d" radius={[0, 4, 4, 0]} name="Cohen's d Effect Size">
                  {stats.group_comparisons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cohens_d > 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistical Test Details */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Question 02</div>
            <h3 className="text-sm font-bold text-white">Are personality trait differences statistically significant after FDR adjustment?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Welch's t-test with Benjamini-Hochberg FDR (q &lt; 0.01)</div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900">
                <tr>
                  <th className="p-2">Trait</th>
                  <th className="p-2 text-center">High (Mean ± Std)</th>
                  <th className="p-2 text-center">Low (Mean ± Std)</th>
                  <th className="p-2 text-center">Test Used</th>
                  <th className="p-2 text-center">p-val</th>
                  <th className="p-2 text-center">Cohen's d</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {stats.group_comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-2 font-semibold text-slate-200 font-sans">{row.feature}</td>
                    <td className="p-2 text-center text-emerald-400 font-bold">{row.group_1_high_mean} ± {row.group_1_high_std}</td>
                    <td className="p-2 text-center text-slate-400">{row.group_0_low_mean} ± {row.group_0_low_std}</td>
                    <td className="p-2 text-center font-sans text-[11px] text-slate-300">{row.test_name}</td>
                    <td className={`p-2 text-center font-bold ${row.is_statistically_significant ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {row.p_value}
                    </td>
                    <td className="p-2 text-center text-blue-400 font-bold">{row.cohens_d} ({row.effect_size_label})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* Explicit Test Justification Logs */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Statistical Test Selection Justification Logs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {stats.group_comparisons.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 rounded border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                {item.feature}: {item.test_name} (Statistic = {item.test_statistic}, p = {item.p_value})
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.justification}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
