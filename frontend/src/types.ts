export interface AuditMetadata {
  [key: string]: {
    key: string;
    filename: string;
    encoding_used: string;
    row_count: number;
    column_count: number;
    exact_columns: string[];
    duplicate_rows: number;
    columns: Array<{
      name: string;
      clean_name: string;
      dtype: string;
      missing_count: number;
      missing_pct: number;
      unique_count: number;
      is_target: boolean;
      is_identifier: boolean;
      value_counts?: Record<string, number>;
    }>;
  };
}

export interface QualityProfile {
  dataset: string;
  num_rows: number;
  num_cols: number;
  missing_count: number;
  missing_pct: number;
  duplicate_count: number;
  numerical_summary: Record<string, any>;
  categorical_summary: Record<string, any>;
  quality_flags: Array<{
    issue: string;
    affected_count: number;
    severity: string;
    explanation: string;
    proposed_treatment: string;
  }>;
}

export interface QualityData {
  profiles: Record<string, QualityProfile>;
  audit_log: Array<{
    dataset: string;
    action: string;
    column: string;
    rationale: string;
    affected_rows: number;
  }>;
}

export interface MarketSummary {
  total_records: number;
  total_openings_volume: number;
  total_companies: number;
  unique_job_titles: number;
  overall_avg_salary_lakhs: number;
  overall_min_salary_lakhs: number;
  overall_max_salary_lakhs: number;
}

export interface RoleSalary {
  job_title: string;
  posting_count: number;
  total_openings: number;
  demand_share_pct: number;
  avg_salary: number;
  median_salary: number;
  min_salary: number;
  max_salary: number;
  salary_range: number;
  avg_min_exp_years: number;
}

export interface ExperienceSalary {
  min_experience_years: number;
  posting_count: number;
  total_openings: number;
  avg_salary: number;
  median_salary: number;
}

export interface CompanyDemand {
  company_name: string;
  posting_count: number;
  total_openings: number;
  avg_salary: number;
}

export interface SalaryDistribution {
  bins: Array<{ bin: string; count: number }>;
  stats: {
    mean: number;
    std: number;
    p25: number;
    p50: number;
    p75: number;
  };
}

export interface SkillSummary {
  total_records: number;
  unique_skills_extracted: number;
  total_skill_mentions: number;
  avg_skills_per_posting: number;
  most_frequent_salary_band: string;
}

export interface SkillTop {
  skill: string;
  frequency: number;
  prevalence_pct: number;
}

export interface SkillSalaryMatrix {
  bands: string[];
  band_posting_counts: Record<string, number>;
  skills_matrix: Array<{
    skill: string;
    [band: string]: any;
  }>;
}

export interface SkillAliasMapping {
  raw_pattern: string;
  normalized_skill: string;
  rule: string;
}

export interface FoldMetric {
  fold: number;
  roc_auc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface MetricStatSummary {
  mean: number;
  std: number;
  min: number;
  max: number;
}

export interface ModelDetail {
  name: string;
  stats_summary: {
    roc_auc: MetricStatSummary;
    accuracy: MetricStatSummary;
    precision: MetricStatSummary;
    recall: MetricStatSummary;
    f1_score: MetricStatSummary;
  };
  formatted_metrics: {
    roc_auc_str: string;
    accuracy_str: string;
    precision_str: string;
    recall_str: string;
    f1_score_str: string;
  };
  fold_metrics: FoldMetric[];
  confusion_matrix: number[][];
  roc_curve: Array<{ fpr: number; tpr: number }>;
  feature_importance: Array<{
    feature: string;
    importance: number;
    type: string;
    direction?: string;
  }>;
  permutation_importance?: Array<{
    feature: string;
    permutation_mean: number;
    permutation_std: number;
  }>;
}

export interface ModelMetricRow {
  model_name: string;
  mean_roc_auc: number;
  roc_auc_std: number;
  roc_auc_str: string;
  accuracy_str: string;
  precision_str: string;
  recall_str: string;
  f1_score_str: string;
  is_selected?: boolean;
}

export interface ModelPipelineResult {
  primary_target?: string;
  target?: string;
  predictors: string[];
  sample_size: number;
  class_balance?: {
    [key: string]: { count: number; pct: number };
  };
  fold_stratification_logs?: Array<{
    fold: number;
    val_count: number;
    val_high_count: number;
    val_low_count: number;
    val_high_pct: number;
    is_stratified: boolean;
  }>;
  selected_model?: string;
  best_model_name?: string;
  best_mean_auc?: number;
  best_auc?: number;
  comparison_table: ModelMetricRow[];
  models: Record<string, ModelDetail>;
  selection_rationale?: {
    question: string;
    evidence: string;
    finding: string;
    interpretation: string;
    implication: string;
  };
  ethical_disclaimer?: string;
}

export interface StatisticalComparison {
  feature: string;
  group_1_high_mean: number;
  group_1_high_std: number;
  group_1_high_median: number;
  group_1_high_iqr: number;
  group_0_low_mean: number;
  group_0_low_std: number;
  group_0_low_median: number;
  group_0_low_iqr: number;
  delta_mean: number;
  test_name: string;
  test_statistic: number;
  p_value: number;
  is_statistically_significant: boolean;
  cohens_d: number;
  effect_size_label: string;
  justification: string;
}

export interface VIFDiagnostic {
  feature: string;
  vif: number;
  interpretation: string;
}

export interface LogisticInference {
  feature: string;
  coefficient: number;
  standard_error: number;
  p_value: number;
  odds_ratio: number;
  ci_95_lower: number;
  ci_95_upper: number;
  is_statistically_significant: boolean;
  direction: string;
}

export interface PredictionResult {
  model_used: string;
  input_traits: Record<string, number>;
  predicted_class: number;
  predicted_label: string;
  probability_high_pct: number;
  probability_low_pct: number;
  disclaimer: string;
}

export interface HackathonInsightCard {
  id: string;
  title: string;
  question: string;
  dataset: string;
  variables: string[];
  analysis: string;
  evidence: string;
  finding: string;
  interpretation: string;
  implication: string;
  limitations: string;
}

export interface ExecutiveNarrative {
  title: string;
  market_demand_summary: string;
  prominent_skills_summary: string;
  junior_career_summary: string;
  senior_success_summary: string;
  strategic_learnings: string[];
  what_not_to_conclude: string[];
}

export interface SkillItem {
  key?: string;
  display: string;
  category?: string;
  level: number;
  evidence_level?: string;
  evidence_text?: string;
  confidence?: number;
  match_count?: number;
}

export interface CandidateProfile {
  source_file?: string;
  candidate: {
    name: string;
    experience_years: number;
    extracted_lines_count?: number;
    profile_completeness_pct?: number;
    target_role?: string;
  };
  skills: SkillItem[];
  categorized_skills: Record<string, SkillItem[]>;
  total_skills_count: number;
  sample_projects?: string[];
  raw_text_snippet?: string;
  weekly_hours?: number;
  career_goal?: string;
}

export interface CareerRole {
  role_id: string;
  role_name: string;
  description: string;
  experience_range: string;
  confidence_label: string;
  core_skills: Array<{ key: string; importance: string; required_level: number }>;
  preferred_skills: string[];
  common_deliverables: string[];
}

export interface SkillGapItem {
  skill_key: string;
  display_name: string;
  category: string;
  current_level: number;
  required_level: number;
  gap: number;
  importance: string;
  priority?: string;
  reason?: string;
}

export interface ExplainableBreakdown {
  core_skill_coverage: string;
  core_coverage_pct: number;
  weighted_alignment_pct: number;
  matched_core_count: number;
  total_core_count: number;
  transferable_count: number;
  optional_matched_count: number;
  experience_alignment_status: string;
}

export interface SkillGapAnalysis {
  target_role: string;
  role_id: string;
  role_fit_coverage_pct: number;
  explainable_breakdown?: ExplainableBreakdown;
  strong_matches: SkillGapItem[];
  partial_matches: SkillGapItem[];
  critical_gaps: SkillGapItem[];
  transferable_skills?: Array<{ skill_key: string; display_name: string; category: string; level: number }>;
  optional_matched_skills?: Array<{ skill_key: string; display_name: string; category: string; level: number }>;
  ranked_skill_gaps: SkillGapItem[];
  total_requirements_count: number;
  met_requirements_count: number;
  unmet_requirements_count: number;
}

export interface RoleDiscoveryItem {
  role_id: string;
  role_name: string;
  description: string;
  experience_range: string;
  role_fit_alignment_pct: number;
  core_coverage_text?: string;
  strong_matches_count: number;
  critical_gaps_count: number;
  transferable_skills_count?: number;
  confidence_label: string;
  top_strong_matches: string[];
  top_missing_skills: string[];
}

export interface RoadmapPhase {
  phase_number: number;
  title: string;
  duration_weeks: number;
  duration_label: string;
  objective: string;
  why_now?: string;
  why_it_matters: string;
  skills: string[];
  prerequisites: string[];
  concepts_to_learn: string[];
  practice_tasks: string[];
  project: {
    title: string;
    deliverables?: string[];
    deliverable?: string;
    skills_addressed?: string[];
  };
  validation_checkpoint: string;
}

export interface ProjectRecommendation {
  title: string;
  difficulty?: string;
  target_skill?: string;
  why_this_project?: string;
  deliverables: string[];
  technologies?: string[];
  portfolio_value?: string;
  interview_value?: string;
}

export interface CareerRoadmap {
  target_role: string;
  role_fit_coverage_pct?: number;
  career_goal?: string;
  weekly_hours?: number;
  total_roadmap_weeks?: number;
  priority_mode?: string;
  skipped_skills?: string[];
  readiness_summary: string;
  priorities: string[];
  phases: RoadmapPhase[];
  portfolio_projects: ProjectRecommendation[];
  next_actions?: string[];
}

export interface CopilotEvidenceItem {
  source: string;
  type: string;
  text: string;
  provenance: string;
}

export interface CopilotChatResponse {
  query: string;
  answer: string;
  reasoning_summary?: string;
  evidence?: CopilotEvidenceItem[];
  recommended_actions?: string[];
  related_skills?: string[];
  roadmap_changes?: string[];
  warnings?: string[];
  evidence_note?: string;
  llm_provider?: string;
}

export type TabType = 
  | 'overview'
  | 'market'
  | 'skills'
  | 'junior'
  | 'senior'
  | 'workforce'
  | 'models'
  | 'quality'
  | 'jury'
  | 'career';
