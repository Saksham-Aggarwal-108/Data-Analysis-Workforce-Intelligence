import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  CandidateProfile, 
  CareerRole, 
  SkillGapAnalysis, 
  RoleDiscoveryItem, 
  CareerRoadmap, 
  CopilotChatResponse,
  SkillItem
} from '../types';
import { 
  Bot, 
  Upload, 
  FileText, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Briefcase, 
  Send, 
  BookOpen, 
  Code, 
  ShieldAlert,
  Award,
  ArrowRight,
  RefreshCw,
  Zap,
  Sliders,
  Grid,
  Check,
  Plus
} from 'lucide-react';

export const CareerAIView: React.FC = () => {
  // Step indicator (1: Profile, 2: Market, 3: Career Path, 4: Gap Analysis & Matrix, 5: Roadmap & Copilot)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [candidateName, setCandidateName] = useState<string>("Candidate");
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [selectedRole, setSelectedRole] = useState<string>("DATA_SCIENTIST");
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [priorityMode, setPriorityMode] = useState<string>("standard");
  const [skippedSkills, setSkippedSkills] = useState<string[]>([]);

  // Profile Skills State with Evidence Levels
  const [skillsList, setSkillsList] = useState<SkillItem[]>([
    { display: "Python", key: "PYTHON", level: 4, category: "Programming", evidence_level: "PROFESSIONAL", confidence: 0.95 },
    { display: "SQL", key: "SQL", level: 3, category: "Databases", evidence_level: "DEMONSTRATED", confidence: 0.90 },
    { display: "Pandas", key: "PANDAS", level: 3, category: "Data Analysis & Processing", evidence_level: "PROJECT", confidence: 0.85 },
    { display: "Data Analysis", key: "DATA_ANALYSIS", level: 3, category: "Data Analysis & Processing", evidence_level: "DEMONSTRATED", confidence: 0.85 }
  ]);
  const [newSkillText, setNewSkillText] = useState<string>("");
  const [newSkillLevel, setNewSkillLevel] = useState<number>(3);
  const [completenessPct, setCompletenessPct] = useState<number>(75);

  // File Upload State
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsedFileName, setParsedFileName] = useState<string | null>(null);

  // Data State
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [marketOverview, setMarketOverview] = useState<any>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [discoveryRoles, setDiscoveryRoles] = useState<RoleDiscoveryItem[]>([]);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [addedProjects, setAddedProjects] = useState<string[]>([]);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; note?: string; evidence?: any[] }>>([
    { 
      sender: 'bot', 
      text: "Hello! I am your Workforce Career AI Copilot. Upload your resume or select your target role to generate a dynamic personalized career roadmap grounded in market evidence." 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // UI Accordion expansion state
  const [openPhaseIndex, setOpenPhaseIndex] = useState<number | null>(0);

  // Load roles & market evidence on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [rolesRes, marketRes] = await Promise.all([
          api.getCareerRoles(),
          api.getCareerMarket()
        ]);
        setRoles(rolesRes);
        setMarketOverview(marketRes);
      } catch (err) {
        console.error('Error loading Career AI initial data:', err);
      }
    }
    loadInitialData();
  }, []);

  // Run Gap Analysis & Roadmap Generation
  const handleRunAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const matchRes = await api.matchCareerRoles({
        skills: skillsList,
        target_role: selectedRole === 'DISCOVERY' ? null : selectedRole,
        experience_years: experienceYears
      });

      if (matchRes.mode === 'target_role') {
        setMatchAnalysis(matchRes.match_analysis);
        setDiscoveryRoles([]);
        
        // Generate Roadmap
        const roadRes = await api.generateCareerRoadmap({
          skills: skillsList,
          target_role: selectedRole,
          weekly_hours: weeklyHours,
          career_goal: `Transition to ${selectedRole}`,
          skipped_skills: skippedSkills,
          priority_mode: priorityMode
        });
        setRoadmap(roadRes);
      } else {
        setDiscoveryRoles(matchRes.ranked_roles);
        setMatchAnalysis(null);
        setRoadmap(null);
      }
    } catch (err) {
      console.error('Error computing career match:', err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Auto-run analysis when skills, role, hours, skipped skills, or priority mode change
  useEffect(() => {
    handleRunAnalysis();
  }, [skillsList.length, selectedRole, weeklyHours, priorityMode, skippedSkills.length]);

  // Handle Resume Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const profile: CandidateProfile = await api.parseResume(file);
      setParsedFileName(file.name);
      if (profile.candidate?.name) setCandidateName(profile.candidate.name);
      if (profile.candidate?.experience_years) setExperienceYears(profile.candidate.experience_years);
      if (profile.candidate?.profile_completeness_pct) setCompletenessPct(profile.candidate.profile_completeness_pct);
      
      if (profile.skills && profile.skills.length > 0) {
        setSkillsList(profile.skills);
      }
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setUploadError(err.message || 'Failed to parse resume file.');
    } finally {
      setUploading(false);
    }
  };

  // Add Skill Manually
  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const exists = skillsList.some(s => s.display.toLowerCase() === newSkillText.trim().toLowerCase());
    if (!exists) {
      setSkillsList(prev => [...prev, { display: newSkillText.trim(), level: newSkillLevel, evidence_level: "DEMONSTRATED", confidence: 0.85 }]);
      setNewSkillText("");
    }
  };

  // Remove Skill
  const handleRemoveSkill = (display: string) => {
    setSkillsList(prev => prev.filter(s => s.display !== display));
  };

  // Toggle Skipped Skill Override
  const handleToggleSkipSkill = (skillKey: string) => {
    setSkippedSkills(prev => 
      prev.includes(skillKey) ? prev.filter(k => k !== skillKey) : [...prev, skillKey]
    );
  };

  // Toggle Project Add to Roadmap
  const handleToggleAddProject = (title: string) => {
    setAddedProjects(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // Handle Chat Submit
  const handleSendChat = async (overrideQuery?: string) => {
    const q = overrideQuery || chatInput;
    if (!q.trim() || chatLoading) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: q }]);
    if (!overrideQuery) setChatInput("");
    setChatLoading(true);

    try {
      const res: CopilotChatResponse = await api.queryCareerCopilot({
        query: q,
        skills: skillsList,
        target_role: selectedRole === 'DISCOVERY' ? 'DATA_SCIENTIST' : selectedRole,
        weekly_hours: weeklyHours
      });

      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: res.answer, 
        note: res.evidence_note,
        evidence: res.evidence
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I encountered an error connecting to the copilot engine." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Responsible AI Persistent Badge */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <strong className="uppercase">Responsible AI Guardrail:</strong>
          <span className="text-slate-300">Analytical Estimate Only. Skill alignment metrics do not constitute hiring scores or employment guarantees.</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px]">System 2 Career Engine</span>
      </div>

      {/* Top Header Command Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> Career AI Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                17,443 Raw Postings (17,442 Usable)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              CAREER INTELLIGENCE PLATFORM
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Turn your current technical skills into your next career move. Parse your resume, ground claims in observed market evidence, inspect deterministic gap coverage, and execute a dynamic learning roadmap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAnalysis}
              disabled={loadingAnalysis}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalysis ? 'animate-spin' : ''}`} />
              Re-Calculate Career Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* 5-Stage Step Indicator */}
      <div className="glass-card rounded-xl p-4 border border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-mono">
          {[
            { step: 1, label: "1. Profile & Resume", icon: <FileText className="w-3.5 h-3.5 mx-auto mb-1" /> },
            { step: 2, label: "2. Market Grounding", icon: <TrendingUp className="w-3.5 h-3.5 mx-auto mb-1" /> },
            { step: 3, label: "3. Career Path DAG", icon: <Target className="w-3.5 h-3.5 mx-auto mb-1" /> },
            { step: 4, label: "4. Gap & Demand Matrix", icon: <Grid className="w-3.5 h-3.5 mx-auto mb-1" /> },
            { step: 5, label: "5. Roadmap & Copilot", icon: <Sparkles className="w-3.5 h-3.5 mx-auto mb-1" /> }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-lg border transition-all ${
                activeStep === s.step
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 font-bold shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column (Left 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* STAGE 1: PROFILE & RESUME DASHBOARD */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Stage 1: Professional Profile &amp; Resume Intelligence
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted technical skills with transparent evidence levels (Demonstrated, Project, Coursework)
                </p>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs text-slate-400">Completeness Score</div>
                <div className="text-lg font-bold text-emerald-400">{completenessPct}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Drag and Drop Resume */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-dashed border-slate-700 space-y-3 text-center">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Upload Resume File</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, TXT (Max 5 MB)</div>
                </div>

                <label className="inline-block px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
                  {uploading ? 'Parsing Text & Evidence...' : 'Choose Resume File'}
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>

                {parsedFileName && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Parsed: {parsedFileName}
                  </div>
                )}
                {uploadError && (
                  <div className="text-[11px] text-rose-400 font-mono">{uploadError}</div>
                )}
              </div>

              {/* Option 2: Target Role & Study Hours Configuration */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-400" /> Target Role Selection
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-indigo-500"
                >
                  <option value="DISCOVERY">🔍 Explore All Roles (Discovery Mode)</option>
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      🎯 {r.role_name} ({r.experience_range})
                    </option>
                  ))}
                </select>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Weekly Study Hours:</span>
                    <span className="font-mono text-indigo-400 font-bold">{weeklyHours} hrs / week</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Priority Mode Toggle */}
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800 font-mono">
                  <span className="text-slate-400">Roadmap Mode:</span>
                  <div className="flex gap-1">
                    {['standard', 'accelerated', 'deep_mastery'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setPriorityMode(mode)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          priorityMode === mode
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {mode.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Dashboard Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Candidate Name</div>
                <div className="text-sm font-bold text-white mt-0.5 truncate">{candidateName}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Detected Skills</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">{skillsList.length} Skills</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Experience Alignment</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{experienceYears} Years</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Completeness Gauge</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{completenessPct}% Complete</div>
              </div>
            </div>

            {/* Manual Skill Management & Evidence Badges */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Detected Profile Skills with Evidence Classification</span>
                <span className="text-[10px] text-slate-400 font-mono">Part 4 Evidence Model</span>
              </div>

              {/* Skills Badges with Evidence Levels */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-thin p-2 bg-slate-950 rounded-xl border border-slate-800">
                {skillsList.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-indigo-300 rounded-lg text-xs font-mono flex items-center gap-2 shadow-sm"
                  >
                    <span>{sk.display}</span>
                    <span className="text-[10px] font-bold text-indigo-400">L{sk.level}</span>
                    {sk.evidence_level && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                        sk.evidence_level === 'PROFESSIONAL'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sk.evidence_level === 'PROJECT'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {sk.evidence_level}
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveSkill(sk.display)}
                      className="text-slate-500 hover:text-rose-400 font-bold ml-0.5"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill Bar */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter additional skill (e.g. PyTorch, Docker, LangChain)..."
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300"
                >
                  <option value={1}>L1 Beginner</option>
                  <option value={2}>L2 Intermediate</option>
                  <option value={3}>L3 Proficient</option>
                  <option value={4}>L4 Advanced</option>
                  <option value={5}>L5 Expert</option>
                </select>
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>

          {/* STAGE 2: MARKET EVIDENCE GROUNDING */}
          {marketOverview && (
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Stage 2: Dataset Provenance Audit &amp; Market Grounding
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  {marketOverview.evidence_source}
                </span>
              </div>

              {/* Part 2 Audit Banner: Raw vs Analytical Rows */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-[11px] text-slate-300 font-bold uppercase">Dataset Provenance Audit (Part 2 Verification):</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400">DataScience Jobs.csv:</span> <strong className="text-white">1,602 Raw Rows &rarr; 1,602 Analytical Rows (100% Usable)</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400">Analytics Jobs.csv:</span> <strong className="text-white">15,841 Raw Rows &rarr; 15,840 Analytical Rows (99.99% Usable)</strong>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  * Excluded 1 row from Analytics Jobs due to null key_skills value. Combined analytical evidence total: <strong className="text-emerald-400">17,442 Postings</strong>.
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Analytical Evidence Total</div>
                  <div className="text-sm font-bold text-white mt-1">{marketOverview.total_job_postings_analyzed.toLocaleString()} Postings</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Avg Market Salary</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{marketOverview.market_salary_bounds.avg_overall_lakhs} Lakhs INR</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Min-Max Bounds</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">{marketOverview.market_salary_bounds.min_overall_lakhs}L - {marketOverview.market_salary_bounds.max_overall_lakhs}L</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Top Demanded</div>
                  <div className="text-sm font-bold text-indigo-400 mt-1">Python (68%) / SQL (54%)</div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: VISUAL CAREER PATH DAG GRAPH */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  Stage 3: Visual Career Path Graph (Part 7 DAG Representation)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Directed career transition graph derived from core skill requirements and transferable proficiencies
                </p>
              </div>
            </div>

            {/* Visual DAG Nodes Container */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Center Candidate Node */}
                <div className="p-3 bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-center shadow-lg w-full md:w-48">
                  <div className="text-[10px] text-indigo-300 font-bold uppercase">Current Candidate Profile</div>
                  <div className="text-sm font-black text-white mt-0.5">{candidateName}</div>
                  <div className="text-[10px] text-indigo-400">{skillsList.length} Skills Detected</div>
                </div>

                <div className="text-indigo-400 text-lg font-bold hidden md:block">&rarr;</div>

                {/* Role Adjacent Paths */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                  {roles.slice(0, 6).map((role, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedRole(role.role_id)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedRole === role.role_id
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">{role.role_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{role.experience_range}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 4: GAP ANALYSIS & MARKET x SKILLS QUADRANT MATRIX */}
          {matchAnalysis && (
            <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Stage 4: Explainable Role Fit &amp; Skill Gap Matrix — {matchAnalysis.target_role}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Core Skill Coverage Ratio: <strong className="text-emerald-400 font-mono">{matchAnalysis.explainable_breakdown?.core_skill_coverage || `${matchAnalysis.met_requirements_count}/${matchAnalysis.total_requirements_count}`}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400 font-mono">{matchAnalysis.role_fit_coverage_pct}%</div>
                  <div className="text-[10px] font-mono text-slate-400">Weighted Alignment Score</div>
                </div>
              </div>

              {/* Explainable Metric Breakdown Badges (Part 6) */}
              {matchAnalysis.explainable_breakdown && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Core Skill Coverage</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">{matchAnalysis.explainable_breakdown.core_skill_coverage}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Transferable Skills</div>
                    <div className="text-sm font-bold text-indigo-400 mt-1">{matchAnalysis.explainable_breakdown.transferable_count} Skills</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Optional Matched</div>
                    <div className="text-sm font-bold text-purple-400 mt-1">{matchAnalysis.explainable_breakdown.optional_matched_count} Skills</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Experience Alignment</div>
                    <div className="text-sm font-bold text-amber-400 mt-1">{matchAnalysis.explainable_breakdown.experience_alignment_status}</div>
                  </div>
                </div>
              )}

              {/* Part 15: MARKET DEMAND x YOUR SKILLS QUADRANT MATRIX */}
              <div className="space-y-3 border-t border-slate-800 pt-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-indigo-400" /> Part 15: Market Demand &times; Your Skills Quadrant Matrix
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Plotted by Market Demand vs Your Skill Level</span>
                </div>

                {/* 2D Quadrant Container */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                  {/* Q2 Top-Left: Learn Next (High Priority) */}
                  <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg space-y-2 min-h-28">
                    <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between">
                      <span>1. LEARN NEXT (High Demand / Low Skill)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">PRIORITY GAP</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchAnalysis.critical_gaps.slice(0, 4).map((g, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] rounded">
                          {g.display_name} (Req L{g.required_level})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Q1 Top-Right: Strong Advantage */}
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2 min-h-28">
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                      <span>2. STRONG ADVANTAGE (High Demand / High Skill)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">MATCHED</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchAnalysis.strong_matches.slice(0, 4).map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] rounded">
                          {m.display_name} (L{m.current_level})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Q3 Bottom-Left: Low Priority */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 min-h-28">
                    <div className="text-[11px] font-bold text-slate-400">3. LOW PRIORITY (Low Demand / Low Skill)</div>
                    <div className="text-[10px] text-slate-500">Unrequired niche skills with low market frequency</div>
                  </div>

                  {/* Q4 Bottom-Right: Maintain / Niche */}
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-lg space-y-2 min-h-28">
                    <div className="text-[11px] font-bold text-indigo-300 flex items-center justify-between">
                      <span>4. MAINTAIN / TRANSFERABLE (Low Demand / High Skill)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">TRANSFERABLE</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(matchAnalysis.transferable_skills || []).slice(0, 4).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] rounded">
                          {t.display_name} (L{t.level})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Gap Matrix Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detailed Skill Gap Breakdown ({matchAnalysis.unmet_requirements_count} Gaps Identified)
                </h4>

                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="text-slate-400 bg-slate-900">
                      <tr>
                        <th className="p-2.5">Skill Name</th>
                        <th className="p-2.5 text-center">Current Level</th>
                        <th className="p-2.5 text-center">Required Level</th>
                        <th className="p-2.5 text-center">Gap Amount</th>
                        <th className="p-2.5 text-center">Importance</th>
                        <th className="p-2.5 text-center">Adaptation</th>
                        <th className="p-2.5">Requirement Rationale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-sans">
                      {matchAnalysis.ranked_skill_gaps.map((gap, idx) => {
                        const isSkipped = skippedSkills.includes(gap.skill_key);
                        return (
                          <tr key={idx} className={`hover:bg-slate-800/40 ${isSkipped ? 'opacity-50 line-through' : ''}`}>
                            <td className="p-2.5 font-bold text-slate-200 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-400" />
                              {gap.display_name}
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-slate-400">L{gap.current_level}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-indigo-400">L{gap.required_level}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-rose-400">+{gap.gap} Levels</td>
                            <td className="p-2.5 text-center font-mono">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                gap.importance === 'critical'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {gap.importance}
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-mono">
                              <button
                                onClick={() => handleToggleSkipSkill(gap.skill_key)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                  isSkipped
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                              >
                                {isSkipped ? 'Skipped' : 'Skip Skill'}
                              </button>
                            </td>
                            <td className="p-2.5 text-slate-300 text-[11px] leading-relaxed">{gap.reason}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DISCOVERY MODE: ALL ROLES RANKING */}
          {discoveryRoles.length > 0 && (
            <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Career Discovery Mode: All Roles Skill Alignment Ranking
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluated against your {skillsList.length} candidate profile skills
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoveryRoles.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">{item.role_name}</div>
                      <span className="text-base font-black text-indigo-400 font-mono">{item.role_fit_alignment_pct}%</span>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>

                    <div className="space-y-1 text-xs">
                      <div className="text-emerald-400 text-[11px]">
                        <strong>Strong Matches:</strong> {item.top_strong_matches.join(', ') || 'Basics'}
                      </div>
                      <div className="text-rose-400 text-[11px]">
                        <strong>Missing Gaps:</strong> {item.top_missing_skills.join(', ')}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRole(item.role_id)}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors border border-slate-700"
                    >
                      Select {item.role_name} Roadmap &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 5: DYNAMIC PERSONALIZED ROADMAP */}
          {roadmap && (
            <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Stage 5: Personalized Learning &amp; Capstone Roadmap — {roadmap.target_role}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Timeline: <strong className="text-emerald-400 font-mono">{roadmap.total_roadmap_weeks || 9} Weeks</strong> at {weeklyHours} hrs/wk ({priorityMode.toUpperCase()} mode)
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-semibold rounded-lg">
                  {roadmap.phases.length} Execution Phases
                </span>
              </div>

              {/* Summary Box */}
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 leading-relaxed font-sans">
                <strong>READINESS SUMMARY:</strong> {roadmap.readiness_summary}
              </div>

              {/* Expandable Phase Cards */}
              <div className="space-y-4">
                {roadmap.phases.map((phase, idx) => {
                  const isOpen = openPhaseIndex === idx;
                  return (
                    <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                      <button
                        onClick={() => setOpenPhaseIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                            P{phase.phase_number}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">{phase.title}</div>
                            <div className="text-[11px] text-indigo-400 font-mono">{phase.duration_label}</div>
                          </div>
                        </div>

                        {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>

                      {isOpen && (
                        <div className="p-5 pt-2 border-t border-slate-800/60 bg-slate-950/40 space-y-4 text-xs">
                          {/* Part 8 Why Now Explanation */}
                          {phase.why_now && (
                            <div className="p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-indigo-200 text-xs">
                              <strong className="text-indigo-400 font-mono uppercase text-[10px]">Why Scheduled Now:</strong> {phase.why_now}
                            </div>
                          )}

                          <div>
                            <strong className="text-slate-400 uppercase text-[10px] font-mono">Objective &amp; Why It Matters:</strong>
                            <p className="text-slate-200 leading-relaxed mt-0.5">{phase.objective} — {phase.why_it_matters}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Concepts */}
                            <div className="space-y-1.5 p-3 bg-slate-900 rounded-lg border border-slate-800">
                              <div className="font-bold text-indigo-400 text-[11px]">Key Concepts To Master:</div>
                              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                                {phase.concepts_to_learn.map((c, cIdx) => (
                                  <li key={cIdx}>{c}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Practice Tasks */}
                            <div className="space-y-1.5 p-3 bg-slate-900 rounded-lg border border-slate-800">
                              <div className="font-bold text-emerald-400 text-[11px]">Practical Hands-on Exercises:</div>
                              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                                {phase.practice_tasks.map((pt, ptIdx) => (
                                  <li key={ptIdx}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Phase Project & Checkpoint */}
                          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Phase Project Deliverable</div>
                              <div className="text-xs font-bold text-white mt-0.5">{phase.project.title}</div>
                              <div className="text-[11px] text-slate-400">{phase.project.deliverable || phase.project.deliverables?.join(', ')}</div>
                            </div>

                            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
                              <span className="text-emerald-400 font-bold">Checkpoint:</span> {phase.validation_checkpoint}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Portfolio Project Recommendations with Add-to-Roadmap Toggle (Part 17) */}
              <div className="space-y-4 border-t border-slate-800 pt-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-indigo-400" /> Recommended Portfolio Projects (Part 17 Engine)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Add projects directly to your capstone phase</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {roadmap.portfolio_projects.map((proj, pIdx) => {
                    const isAdded = addedProjects.includes(proj.title);
                    return (
                      <div key={pIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-300 text-xs">{proj.title}</span>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono rounded">
                            {proj.difficulty || 'Intermediate'}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{proj.why_this_project}</p>

                        <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] text-emerald-300">
                          <strong>Portfolio Impact:</strong> {proj.portfolio_value || 'Demonstrates production execution capability'}
                        </div>

                        <button
                          onClick={() => handleToggleAddProject(proj.title)}
                          className={`w-full py-1.5 rounded text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30'
                          }`}
                        >
                          {isAdded ? <><Check className="w-3.5 h-3.5" /> ADDED TO ROADMAP</> : <><Plus className="w-3.5 h-3.5" /> ADD TO ROADMAP</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Chat Copilot Drawer (Right Column) */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                Career AI Copilot Assistant
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">Active Context</span>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Suggested Context Questions:</div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                {[
                  "Why should I learn Docker for my role?",
                  "What should I focus on this month?",
                  "Which portfolio project should I build?",
                  "Can I transition with my current skills?"
                ].map((prompt, prIdx) => (
                  <button
                    key={prIdx}
                    onClick={() => handleSendChat(prompt)}
                    className="text-left p-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg border border-slate-800 transition-colors text-[11px]"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Window */}
            <div className="h-96 overflow-y-auto scrollbar-thin p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              {chatMessages.map((msg, mIdx) => (
                <div
                  key={mIdx}
                  className={`flex flex-col text-xs ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[95%] font-sans leading-relaxed space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Part 11 Evidence Provenance Badges */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[10px]">
                        <div className="text-slate-400 uppercase text-[9px]">Dataset Evidence Provenance:</div>
                        {msg.evidence.map((ev, evIdx) => (
                          <div key={evIdx} className="p-1.5 bg-slate-950 rounded border border-slate-800 text-emerald-300">
                            <strong>[{ev.type}]:</strong> {ev.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.note && (
                      <div className="text-[9px] font-mono text-emerald-400 border-t border-slate-800 pt-1">
                        {msg.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="text-xs font-mono text-indigo-400 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 animate-spin" /> Grounding query in context...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Ask career copilot anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
