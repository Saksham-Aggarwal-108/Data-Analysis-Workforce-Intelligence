import React from 'react';
import { ModelDetail } from '../types';
import { Layers } from 'lucide-react';

interface FoldMetricsTableProps {
  modelDetail: ModelDetail;
}

export const FoldMetricsTable: React.FC<FoldMetricsTableProps> = ({ modelDetail }) => {
  const { fold_metrics, stats_summary } = modelDetail;

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          5-Fold Cross-Validation Metric Breakdown ({modelDetail.name})
        </h4>
        <span className="text-[11px] font-mono text-slate-400">
          Showing Fold 1..5 + Fold Statistics
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 bg-slate-900">
            <tr>
              <th className="p-2.5">Validation Split</th>
              <th className="p-2.5 text-center">ROC-AUC</th>
              <th className="p-2.5 text-center">Accuracy</th>
              <th className="p-2.5 text-center">Precision</th>
              <th className="p-2.5 text-center">Recall</th>
              <th className="p-2.5 text-center">F1-Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {fold_metrics.map((fold) => (
              <tr key={fold.fold} className="hover:bg-slate-800/40">
                <td className="p-2.5 font-semibold text-slate-300 font-sans">Fold {fold.fold}</td>
                <td className="p-2.5 text-center text-emerald-400 font-semibold">{fold.roc_auc.toFixed(4)}</td>
                <td className="p-2.5 text-center text-slate-300">{fold.accuracy.toFixed(4)}</td>
                <td className="p-2.5 text-center text-slate-300">{fold.precision.toFixed(4)}</td>
                <td className="p-2.5 text-center text-slate-300">{fold.recall.toFixed(4)}</td>
                <td className="p-2.5 text-center text-slate-300">{fold.f1_score.toFixed(4)}</td>
              </tr>
            ))}
            
            {/* Summary Statistics Row: Mean ± Std */}
            <tr className="bg-blue-950/40 font-bold border-t-2 border-slate-700">
              <td className="p-3 font-sans text-blue-300">Mean ± Std</td>
              <td className="p-3 text-center text-emerald-300">
                {stats_summary.roc_auc.mean.toFixed(4)} ± {stats_summary.roc_auc.std.toFixed(4)}
              </td>
              <td className="p-3 text-center text-slate-200">
                {stats_summary.accuracy.mean.toFixed(4)} ± {stats_summary.accuracy.std.toFixed(4)}
              </td>
              <td className="p-3 text-center text-slate-200">
                {stats_summary.precision.mean.toFixed(4)} ± {stats_summary.precision.std.toFixed(4)}
              </td>
              <td className="p-3 text-center text-slate-200">
                {stats_summary.recall.mean.toFixed(4)} ± {stats_summary.recall.std.toFixed(4)}
              </td>
              <td className="p-3 text-center text-slate-200">
                {stats_summary.f1_score.mean.toFixed(4)} ± {stats_summary.f1_score.std.toFixed(4)}
              </td>
            </tr>

            {/* Min / Max Range Row */}
            <tr className="bg-slate-900/60 text-slate-400">
              <td className="p-2.5 font-sans">Range [Min - Max]</td>
              <td className="p-2.5 text-center">[{stats_summary.roc_auc.min.toFixed(4)} - {stats_summary.roc_auc.max.toFixed(4)}]</td>
              <td className="p-2.5 text-center">[{stats_summary.accuracy.min.toFixed(4)} - {stats_summary.accuracy.max.toFixed(4)}]</td>
              <td className="p-2.5 text-center">[{stats_summary.precision.min.toFixed(4)} - {stats_summary.precision.max.toFixed(4)}]</td>
              <td className="p-2.5 text-center">[{stats_summary.recall.min.toFixed(4)} - {stats_summary.recall.max.toFixed(4)}]</td>
              <td className="p-2.5 text-center">[{stats_summary.f1_score.min.toFixed(4)} - {stats_summary.f1_score.max.toFixed(4)}]</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
