import {
  AuditMetadata,
  QualityData,
  MarketSummary,
  RoleSalary,
  ExperienceSalary,
  CompanyDemand,
  SalaryDistribution,
  SkillSummary,
  SkillTop,
  SkillSalaryMatrix,
  SkillAliasMapping,
  ModelPipelineResult,
  StatisticalComparison,
  VIFDiagnostic,
  LogisticInference,
  PredictionResult,
  HackathonInsightCard,
  ExecutiveNarrative
} from './types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, init);
  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getHealth: () => fetchJson<{ status: string; message: string }>('/health'),
  getAudit: () => fetchJson<AuditMetadata>('/audit'),
  getQuality: () => fetchJson<QualityData>('/quality'),
  getFeatures: () => fetchJson<any[]>('/features'),
  
  // Market
  getMarketSummary: () => fetchJson<MarketSummary>('/market/summary'),
  getMarketRoles: () => fetchJson<RoleSalary[]>('/market/roles'),
  getMarketExperience: () => fetchJson<ExperienceSalary[]>('/market/experience'),
  getMarketCompanies: () => fetchJson<CompanyDemand[]>('/market/companies'),
  getMarketSalaryDist: () => fetchJson<SalaryDistribution>('/market/salary-dist'),

  // Skills
  getSkillsSummary: () => fetchJson<SkillSummary>('/skills/summary'),
  getSkillsTop: (top_n = 20) => fetchJson<SkillTop[]>(`/skills/top?top_n=${top_n}`),
  getSkillsSalaryMatrix: () => fetchJson<SkillSalaryMatrix>('/skills/salary-matrix'),
  getSkillsExperienceMatrix: () => fetchJson<any>('/skills/experience-matrix'),
  getSkillsAliasMapping: () => fetchJson<SkillAliasMapping[]>('/skills/alias-mapping'),
  getSkillsExperience: () => fetchJson<any[]>('/skills/experience'),

  // Junior
  getJuniorSummary: () => fetchJson<any>('/junior/summary'),
  getJuniorStats: () => fetchJson<StatisticalComparison[]>('/junior/stats'),
  getJuniorModel: () => fetchJson<ModelPipelineResult>('/junior/model'),

  // Senior
  getSeniorSummary: () => fetchJson<any>('/senior/summary'),
  getSeniorStats: () => fetchJson<{
    group_comparisons: StatisticalComparison[];
    vif_diagnostics: VIFDiagnostic[];
    logistic_inference: LogisticInference[];
  }>('/senior/stats'),
  getSeniorModel: () => fetchJson<ModelPipelineResult>('/senior/model'),
  getSeniorValidationAudit: () => fetchJson<any>('/senior/validation-audit'),
  predictSeniorSuccess: (traits: {
    neuroticism: number;
    extraversion: number;
    openness_to_experience: number;
    agreeableness: number;
    conscientiousness: number;
  }) => fetchJson<PredictionResult>('/senior/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(traits)
  }),

  // Workforce
  getWorkforceCards: () => fetchJson<HackathonInsightCard[]>('/workforce/cards'),
  getWorkforceNarrative: () => fetchJson<ExecutiveNarrative>('/workforce/narrative'),
  getExportMetadata: () => fetchJson<any>('/export/metadata'),

  // Career AI & Copilot (Phase 9)
  parseResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/career/parse-resume`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Resume Upload Error ${response.status}`);
    }
    return response.json();
  },
  createManualProfile: (payload: any) => fetchJson<any>('/career/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }),
  getCareerRoles: () => fetchJson<any[]>('/career/roles'),
  matchCareerRoles: (payload: any) => fetchJson<any>('/career/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }),
  getSkillGaps: (payload: any) => fetchJson<any>('/career/skill-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }),
  generateCareerRoadmap: (payload: any) => fetchJson<any>('/career/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }),
  queryCareerCopilot: (payload: any) => fetchJson<any>('/career/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }),
  getCareerMarket: () => fetchJson<any>('/career/market')
};

