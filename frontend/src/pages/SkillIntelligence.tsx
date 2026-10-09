import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { KPICard } from '../components/KPICard';
import { SkillSummary, SkillTop, SkillSalaryMatrix, SkillAliasMapping } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Sparkles, Code2, Layers, DollarSign, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export const SkillIntelligence: React.FC = () => {
  const [summary, setSummary] = useState<SkillSummary | null>(null);
  const [topSkills, setTopSkills] = useState<SkillTop[]>([]);
  const [salaryMatrix, setSalaryMatrix] = useState<SkillSalaryMatrix | null>(null);
  const [aliasMappings, setAliasMappings] = useState<SkillAliasMapping[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('python');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const [sumRes, topRes, matrixRes, aliasRes] = await Promise.all([
          api.getSkillsSummary(),
          api.getSkillsTop(15),
          api.getSkillsSalaryMatrix(),
          api.getSkillsAliasMapping()
        ]);
        setSummary(sumRes);
        setTopSkills(topRes);
        setSalaryMatrix(matrixRes);
        setAliasMappings(aliasRes);
        if (topRes.length > 0) {
          setSelectedSkill(topRes[0].skill);
        }
      } catch (err) {
        console.error('Error loading skill intelligence:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-400 font-mono text-sm">Loading Skill Intelligence Layer & Salary Matrix...</div>
      </div>
    );
  }

  // Find matrix row for selected skill
  const selectedSkillMatrixRow = salaryMatrix?.skills_matrix.find(
    r => r.skill.toLowerCase() === selectedSkill.toLowerCase()
  );

  const selectedSkillTopData = topSkills.find(
    s => s.skill.toLowerCase() === selectedSkill.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Skill Intelligence Layer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dataset: <span className="font-mono text-slate-200">Analytics Jobs.csv</span> (15,841 postings, 6,104 unique normalized skills)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-mono font-medium">
            Methodology: Within-Band Skill Prevalence
          </span>
        </div>
      </div>

      {/* Methodology Disclaimer */}
      <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs text-purple-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong>METHODOLOGY SAFEGUARD:</strong> Salary bands in <em>Analytics Jobs.csv</em> are categorical (e.g. 0-3L, 3-6L, 10-15L). Skill demand is measured strictly as <strong>within-band prevalence percentage</strong> (proportion of postings in that band requiring the skill). Raw skill count is <strong>NEVER</strong> used to infer linear continuous salary association.
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Postings Analyzed" value={summary.total_records.toLocaleString()} icon={<Layers className="w-4 h-4 text-blue-400" />} />
        <KPICard title="Unique Skills Extracted" value={summary.unique_skills_extracted.toLocaleString()} icon={<Code2 className="w-4 h-4 text-purple-400" />} />
        <KPICard title="Avg Skills / Job" value={summary.avg_skills_per_posting} icon={<Sparkles className="w-4 h-4 text-emerald-400" />} />
        <KPICard title="Top Salary Band Volume" value={`${summary.most_frequent_salary_band} Lakhs`} icon={<DollarSign className="w-4 h-4 text-amber-400" />} />
      </div>

      {/* Top Skills Ranking */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
        <div>
          <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Question 01</div>
          <h3 className="text-sm font-bold text-white">Which normalized skills appear most frequently in analytics postings?</h3>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Dataset: Analytics Jobs.csv | Overall Posting Prevalence (%)</div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSkills} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
              <YAxis dataKey="skill" type="category" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="prevalence_pct" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Posting Prevalence (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Skill Explorer */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Interactive Explorer</div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              Deep Skill Explorer: Prevalence across Salary Bands
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Skill:</span>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 font-mono font-semibold focus:outline-none focus:border-purple-500"
            >
              {topSkills.map((s, idx) => (
                <option key={idx} value={s.skill}>{s.skill.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedSkillMatrixRow ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs font-mono">
              {['0to3', '3to6', '6to10', '10to15', '15to25', '25to50'].map((band) => (
                <div key={band} className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">{band} Lakhs</div>
                  <div className="text-lg font-bold text-purple-400 mt-1">
                    {selectedSkillMatrixRow[band]}%
                  </div>
                  <div className="text-[9px] text-slate-500">prevalence</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <strong className="text-purple-400">Insight for {selectedSkill.toUpperCase()}:</strong> In the lowest salary band (0-3L), prevalence is {selectedSkillMatrixRow['0to3']}%. As salary tier increases to executive senior bands (25-50L), prevalence reaches {selectedSkillMatrixRow['25to50']}%, demonstrating how employer skill demand shifts across organizational compensation tiers.
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">Select a skill above to explore salary band breakdown.</div>
        )}
      </div>

      {/* Skill x Salary Band Heatmap Matrix */}
      {salaryMatrix && (
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
          <div>
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Question 02</div>
            <h3 className="text-sm font-bold text-white">How does skill prevalence vary across categorical salary bands?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Percentage of postings requiring each skill within specific salary bands (0-3L up to 25-50L).
            </p>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900">
                <tr>
                  <th className="p-3">Skill Token</th>
                  <th className="p-3 text-center">0to3 Lakhs</th>
                  <th className="p-3 text-center">3to6 Lakhs</th>
                  <th className="p-3 text-center">6to10 Lakhs</th>
                  <th className="p-3 text-center">10to15 Lakhs</th>
                  <th className="p-3 text-center">15to25 Lakhs</th>
                  <th className="p-3 text-center">25to50 Lakhs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {salaryMatrix.skills_matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 font-mono">
                    <td className="p-3 font-semibold text-slate-200 font-sans">{row.skill}</td>
                    <td className="p-3 text-center text-slate-300">{row['0to3']}%</td>
                    <td className="p-3 text-center text-slate-300">{row['3to6']}%</td>
                    <td className="p-3 text-center text-blue-400 font-semibold">{row['6to10']}%</td>
                    <td className="p-3 text-center text-indigo-400 font-semibold">{row['10to15']}%</td>
                    <td className="p-3 text-center text-purple-400 font-semibold">{row['15to25']}%</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row['25to50']}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skill Alias Normalization Transparency Table */}
      {aliasMappings.length > 0 && (
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Transparency Protocol</div>
            <h3 className="text-sm font-bold text-white">Skill Alias Normalization & Canonical Mapping Rules</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrates how raw textual job posting strings were clean-mapped into canonical skill entities.
            </p>
          </div>

          <div className="overflow-x-auto max-h-64 scrollbar-thin">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 bg-slate-900 sticky top-0">
                <tr>
                  <th className="p-2.5">Raw Text Pattern</th>
                  <th className="p-2.5">Normalized Skill Entity</th>
                  <th className="p-2.5">Normalization Treatment Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {aliasMappings.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-slate-400">{rule.raw_pattern}</td>
                    <td className="p-2.5 font-bold text-purple-400">{rule.normalized_skill}</td>
                    <td className="p-2.5 font-sans text-slate-300 text-[11px]">{rule.rule}</td>
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

