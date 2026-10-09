import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { QualityData, AuditMetadata } from '../types';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const DataQuality: React.FC = () => {
  const [quality, setQuality] = useState<QualityData | null>(null);
  const [audit, setAudit] = useState<AuditMetadata | null>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQualityData() {
      try {
        const [qRes, aRes, fRes] = await Promise.all([
          api.getQuality(),
          api.getAudit(),
          api.getFeatures()
        ]);
        setQuality(qRes);
        setAudit(aRes);
        setFeatures(fRes);
      } catch (err) {
        console.error('Error loading quality dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQualityData();
  }, []);

  if (loading || !quality) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Data Quality & Lineage Engine...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Data Quality & Pipeline Lineage Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Data Quality Audit, Anomaly Detection Flags, Transformation Logs & Feature Lineage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono font-medium">
            Audit Log Active ({quality.audit_log.length} Transformations)
          </span>
        </div>
      </div>

      {/* Datasets Quality Overview Table */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          Dataset Quality Health Matrix
        </h3>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 bg-slate-900">
              <tr>
                <th className="p-3">Dataset Layer</th>
                <th className="p-3 text-center">Total Rows</th>
                <th className="p-3 text-center">Raw Columns</th>
                <th className="p-3 text-center">Engineered Features</th>
                <th className="p-3 text-center">Missing %</th>
                <th className="p-3 text-center">Duplicates</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {Object.entries(quality.profiles).map(([key, prof]) => {
                const rawCols = audit?.[key]?.column_count ?? prof.num_cols;
                const engineeredCount = prof.num_cols - rawCols > 0 ? prof.num_cols - rawCols : 0;
                return (
                  <tr key={key} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-200 font-sans uppercase">{key} Layer</td>
                    <td className="p-3 text-center text-slate-300">{prof.num_rows.toLocaleString()}</td>
                    <td className="p-3 text-center text-blue-400 font-bold">{rawCols} Raw Cols</td>
                    <td className="p-3 text-center text-indigo-400 font-bold font-sans">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[11px]">
                        +{engineeredCount} Engineered
                      </span>
                    </td>
                    <td className={`p-3 text-center font-bold ${prof.missing_pct > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {prof.missing_pct}%
                    </td>
                    <td className="p-3 text-center text-slate-300">{prof.duplicate_count}</td>
                    <td className="p-3 text-center font-sans">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Cleaned &amp; Loaded
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Flags & Proposed Treatments */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Detected Quality Issues & Documented Treatments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(quality.profiles).flatMap(p => p.quality_flags).map((flag, idx) => (
            <div key={idx} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">{flag.issue}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                  {flag.severity}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{flag.explanation}</p>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                <strong className="text-emerald-400">Treatment Applied:</strong> {flag.proposed_treatment}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Audit Log */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Pipeline Transformation Audit Log</h3>
        <div className="overflow-x-auto max-h-64 scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 bg-slate-900 sticky top-0">
              <tr>
                <th className="p-2.5">Dataset</th>
                <th className="p-2.5">Action</th>
                <th className="p-2.5">Target Column(s)</th>
                <th className="p-2.5">Rationale</th>
                <th className="p-2.5 text-center">Affected Rows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {quality.audit_log.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-mono text-blue-400 uppercase">{log.dataset}</td>
                  <td className="p-2.5 font-bold text-slate-200">{log.action}</td>
                  <td className="p-2.5 font-mono text-slate-300">{log.column}</td>
                  <td className="p-2.5 text-slate-400">{log.rationale}</td>
                  <td className="p-2.5 font-mono text-center text-slate-300">{log.affected_rows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
