import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { KPICard } from '../components/KPICard';
import { RoleSalary, ExperienceSalary, CompanyDemand, SalaryDistribution, MarketSummary } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Cell 
} from 'recharts';
import { TrendingUp, Building2, Briefcase, DollarSign } from 'lucide-react';

export const MarketIntelligence: React.FC = () => {
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [roles, setRoles] = useState<RoleSalary[]>([]);
  const [experience, setExperience] = useState<ExperienceSalary[]>([]);
  const [companies, setCompanies] = useState<CompanyDemand[]>([]);
  const [salaryDist, setSalaryDist] = useState<SalaryDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarket() {
      try {
        const [sumRes, roleRes, expRes, compRes, distRes] = await Promise.all([
          api.getMarketSummary(),
          api.getMarketRoles(),
          api.getMarketExperience(),
          api.getMarketCompanies(),
          api.getMarketSalaryDist()
        ]);
        setSummary(sumRes);
        setRoles(roleRes);
        setExperience(expRes);
        setCompanies(compRes);
        setSalaryDist(distRes);
      } catch (err) {
        console.error('Error loading market intelligence:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMarket();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Market Intelligence Layer...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Market Intelligence Layer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dataset: <span className="font-mono text-slate-200">DataScience Jobs.csv</span> (1,602 postings, 100% complete)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-mono font-medium">
            Layer A: Compensation & Hiring Demand
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Job Postings" value={summary.total_records} icon={<Briefcase className="w-4 h-4" />} />
        <KPICard title="Total Openings Volume" value={summary.total_openings_volume.toLocaleString()} icon={<Building2 className="w-4 h-4" />} />
        <KPICard title="Overall Avg Salary" value={`${summary.overall_avg_salary_lakhs} Lakhs`} icon={<DollarSign className="w-4 h-4" />} />
        <KPICard title="Hiring Companies" value={summary.total_companies} icon={<Building2 className="w-4 h-4" />} />
      </div>

      {/* Role Salary & Experience Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Salary Chart */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Question 01</div>
            <h3 className="text-sm font-bold text-white">Which roles show the strongest advertised salary levels?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: DataScience Jobs.csv | Unit: ₹ Lakhs INR per annum</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roles.slice(0, 10)} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="L" />
                <YAxis dataKey="job_title" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avg_salary" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Avg Salary (Lakhs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Experience vs Salary Chart */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Question 02</div>
            <h3 className="text-sm font-bold text-white">How does minimum experience requirement impact salary progression?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: DataScience Jobs.csv | Unit: Years vs ₹ Lakhs INR</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experience} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="min_experience_years" stroke="#64748b" fontSize={11} label={{ value: 'Min Exp (Years)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="L" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="avg_salary" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} name="Avg Salary (Lakhs)" />
                <Line type="monotone" dataKey="median_salary" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Median Salary (Lakhs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Salary Distribution Histogram & Top Hiring Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Distribution */}
        {salaryDist && (
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
            <div>
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Question 03</div>
              <h3 className="text-sm font-bold text-white">What is the overall distribution of advertised salaries?</h3>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: DataScience Jobs.csv | Bin Count Histogram</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryDist.bins}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="bin" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Postings Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Hiring Companies */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Question 04</div>
            <h3 className="text-sm font-bold text-white">Which employers account for the highest volume of open positions?</h3>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: DataScience Jobs.csv | Ranked Employer Concentration</div>
          </div>
          <div className="overflow-x-auto max-h-64 scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900 sticky top-0">
                <tr>
                  <th className="p-2">Company Name</th>
                  <th className="p-2">Postings</th>
                  <th className="p-2">Total Openings</th>
                  <th className="p-2">Avg Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {companies.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-2 font-medium text-slate-200">{comp.company_name}</td>
                    <td className="p-2 text-slate-400 font-mono">{comp.posting_count}</td>
                    <td className="p-2 text-blue-400 font-mono font-semibold">{comp.total_openings}</td>
                    <td className="p-2 text-emerald-400 font-mono">{comp.avg_salary}L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
