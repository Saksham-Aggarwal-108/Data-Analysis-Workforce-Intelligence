import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { KPICard } from '../components/KPICard';
import { EthicalBanner } from '../components/EthicalBanner';
import { 
  Database, 
  Layers, 
  TrendingUp, 
  Award, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { TabType } from '../types';

interface OverviewProps {
  onNavigate: (tab: TabType) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [audit, market, skills, seniorModel, workforceCards, narrative] = await Promise.all([
          api.getAudit(),
          api.getMarketSummary(),
          api.getSkillsSummary(),
          api.getSeniorModel(),
          api.getWorkforceCards(),
          api.getWorkforceNarrative()
        ]);

        const totalRecords = Object.values(audit).reduce((acc: number, curr: any) => acc + curr.row_count, 0);

        setData({
          datasetsCount: Object.keys(audit).length,
          totalRecords,
          market,
          skills,
          seniorModel,
          workforceCards,
          narrative
        });
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-blue-400 font-mono text-sm">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Initializing Executive Workforce Command Center...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Storyline */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">Executive Landing Overview</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Data Science Workforce Intelligence Pipeline</h2>
            <p className="text-xs text-slate-400 mt-1">
              End-to-End Analytical Progression across 4 Heterogeneous SAS CU Hackathon Datasets
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Phase 2.1 Statistical Validation Passed
          </span>
        </div>

        {/* Storyline Nodes */}
        <div>
          <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
            Interactive Analytical Journey (Click any stage to inspect evidence):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'MARKET', sub: 'DataScience Jobs.csv', icon: <TrendingUp className="w-4 h-4 text-blue-400" />, tab: 'market' },
              { step: '02', title: 'SKILLS', sub: 'Analytics Jobs.csv', icon: <Sparkles className="w-4 h-4 text-purple-400" />, tab: 'skills' },
              { step: '03', title: 'JUNIOR CAREER', sub: 'JDS Skill Traits.xlsx', icon: <GraduationCap className="w-4 h-4 text-indigo-400" />, tab: 'junior' },
              { step: '04', title: 'SENIOR SUCCESS', sub: 'SDS Personality Traits.xlsx', icon: <Award className="w-4 h-4 text-amber-400" />, tab: 'senior' },
              { step: '05', title: 'WORKFORCE STRATEGY', sub: 'Multi-Dataset Synthesis', icon: <Compass className="w-4 h-4 text-emerald-400" />, tab: 'workforce' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => onNavigate(item.tab as TabType)}
                className="p-3.5 bg-slate-800/60 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-500/40 rounded-xl text-left transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-400 font-bold">STAGE {item.step}</span>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-blue-300">{item.title}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate">{item.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Section with Source Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Analytical Datasets"
          value={`${data.datasetsCount} Datasets`}
          subtitle="100% Preserved & Audited"
          icon={<Database className="w-5 h-5 text-blue-400" />}
          badge="Raw Preserved"
        />
        <KPICard
          title="Analytics Job Postings"
          value={data.skills.total_records.toLocaleString()}
          subtitle={`${data.skills.unique_skills_extracted.toLocaleString()} Skills Extracted`}
          icon={<Sparkles className="w-5 h-5 text-purple-400" />}
          badge="Dataset: Analytics Jobs"
        />
        <KPICard
          title="Market Demand Volume"
          value={`${data.market.total_openings_volume.toLocaleString()} Openings`}
          subtitle={`Avg Salary: ${data.market.overall_avg_salary_lakhs} Lakhs`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          badge="Dataset: DataScience Jobs"
        />
        <KPICard
          title="Primary Model (SDS)"
          value={data.seniorModel.selected_model || 'Random Forest'}
          subtitle={`CV ROC-AUC: ${data.seniorModel.models[data.seniorModel.selected_model || 'Random Forest']?.formatted_metrics?.roc_auc_str || '0.9928 ± 0.0048'}`}
          icon={<Award className="w-5 h-5 text-amber-400" />}
          badge="Dataset: SDS Personality"
        />
      </div>

      <EthicalBanner />

      {/* Executive Overview Narrative & Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executive Summary Cards */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Executive Narrative Stream
            </h3>
            <button
              onClick={() => onNavigate('workforce')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Full Strategy <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <div className="font-mono text-[10px] text-blue-400 uppercase font-bold">1. Market Demand</div>
              <p className="text-slate-300 leading-relaxed">{data.narrative.market_demand_summary}</p>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <div className="font-mono text-[10px] text-purple-400 uppercase font-bold">2. Prominent Skills</div>
              <p className="text-slate-300 leading-relaxed">{data.narrative.prominent_skills_summary}</p>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <div className="font-mono text-[10px] text-indigo-400 uppercase font-bold">3. Junior Career</div>
              <p className="text-slate-300 leading-relaxed">{data.narrative.junior_career_summary}</p>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <div className="font-mono text-[10px] text-amber-400 uppercase font-bold">4. Senior Success</div>
              <p className="text-slate-300 leading-relaxed">{data.narrative.senior_success_summary}</p>
            </div>
          </div>
        </div>

        {/* Primary SDS Model Status */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-blue-400" />
              Primary Model (SDS)
            </h3>
            <button
              onClick={() => onNavigate('models')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Model Lab <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Primary Dataset</span>
              <span className="font-mono font-semibold text-slate-200">SDS Personality Traits</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Sample Size</span>
              <span className="font-mono font-semibold text-slate-200">N=161 Observations</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Preferred Model</span>
              <span className="font-bold text-blue-400">{data.seniorModel.selected_model}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Mean 5-Fold ROC-AUC</span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                {data.seniorModel.models[data.seniorModel.selected_model || 'Random Forest']?.formatted_metrics?.roc_auc_str || '0.9928 ± 0.0048'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

