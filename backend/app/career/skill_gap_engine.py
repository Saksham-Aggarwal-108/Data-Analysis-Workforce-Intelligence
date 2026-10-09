from typing import Dict, Any, List
from app.career.taxonomy import SkillTaxonomy
from app.career.role_intelligence import RoleIntelligenceSystem

class DeterministicSkillGapEngine:
    """
    Deterministic Skill Gap Engine.
    Calculates numerical gaps, priorities, transferable skills, and matching coverage without LLM hallucination.
    Enhanced for Part 6 (Explainable Role Alignment Breakdown).
    """

    @classmethod
    def calculate_gaps(cls, candidate_skills: List[Dict[str, Any]], target_role_data: Dict[str, Any], experience_years: int = 0) -> Dict[str, Any]:
        """
        Computes deterministic skill gaps between candidate profile and target role requirements.
        Exposes explicit coverage ratios, transferable skills, optional skills, and experience alignment.
        """
        # Build candidate skill map {canonical_key: current_level}
        user_skills_map: Dict[str, int] = {}
        user_skill_keys: List[str] = []
        for item in candidate_skills:
            key = item.get("key")
            if not key:
                key = SkillTaxonomy.normalize_skill(item.get("display", ""))
            level = int(item.get("level", 3))
            user_skills_map[key] = max(user_skills_map.get(key, 0), level)
            if key not in user_skill_keys:
                user_skill_keys.append(key)

        required_skills = target_role_data.get("core_skills", [])
        preferred_skills = target_role_data.get("preferred_skills", [])
        
        strong_matches = []
        partial_matches = []
        critical_gaps = []
        all_gaps = []

        total_importance_points = 0
        earned_points = 0
        req_keys = set()

        for req in required_skills:
            r_key = req["key"]
            req_keys.add(r_key)
            r_imp = req.get("importance", "medium")
            r_level = int(req.get("required_level", 3))
            meta = SkillTaxonomy.get_metadata(r_key)
            
            imp_weight = 3 if r_imp == "critical" else (2 if r_imp == "high" else 1)
            total_importance_points += (r_level * imp_weight)

            user_level = user_skills_map.get(r_key, 0)
            gap_amount = max(0, r_level - user_level)

            if user_level >= r_level:
                earned_points += (r_level * imp_weight)
                strong_matches.append({
                    "skill_key": r_key,
                    "display_name": meta["display"],
                    "category": meta["category"],
                    "current_level": user_level,
                    "required_level": r_level,
                    "gap": 0,
                    "importance": r_imp
                })
            elif user_level > 0:
                earned_points += (user_level * imp_weight)
                partial_matches.append({
                    "skill_key": r_key,
                    "display_name": meta["display"],
                    "category": meta["category"],
                    "current_level": user_level,
                    "required_level": r_level,
                    "gap": gap_amount,
                    "importance": r_imp,
                    "priority": "high" if (r_imp == "critical" or gap_amount >= 2) else "medium",
                    "reason": f"Required at level {r_level}/5 for {target_role_data['role_name']}; candidate profile demonstrates partial level {user_level}/5."
                })
                all_gaps.append(partial_matches[-1])
            else:
                critical_gaps.append({
                    "skill_key": r_key,
                    "display_name": meta["display"],
                    "category": meta["category"],
                    "current_level": 0,
                    "required_level": r_level,
                    "gap": r_level,
                    "importance": r_imp,
                    "priority": "high" if r_imp in ["critical", "high"] else "medium",
                    "reason": f"Core requirement ({r_imp.upper()}) for {target_role_data['role_name']} with no prior evidence in candidate profile."
                })
                all_gaps.append(critical_gaps[-1])

        # Transferable Skills: candidate skills that are not in core requirements but add domain value
        transferable_skills = []
        optional_matched_skills = []

        for k in user_skill_keys:
            meta = SkillTaxonomy.get_metadata(k)
            if k in preferred_skills:
                optional_matched_skills.append({
                    "skill_key": k,
                    "display_name": meta["display"],
                    "category": meta["category"],
                    "level": user_skills_map[k]
                })
            elif k not in req_keys:
                transferable_skills.append({
                    "skill_key": k,
                    "display_name": meta["display"],
                    "category": meta["category"],
                    "level": user_skills_map[k]
                })

        # Core Skill Coverage ratio
        core_coverage_pct = round((len(strong_matches) / max(1, len(required_skills))) * 100, 1)
        role_fit_coverage_pct = round((earned_points / max(1, total_importance_points)) * 100, 1)

        # Experience Alignment status
        exp_range_str = target_role_data.get("experience_range", "0-5 Years")
        exp_status = "Aligned"
        if experience_years > 0:
            if "0-3" in exp_range_str and experience_years >= 4:
                exp_status = "Overqualified / Senior"
            elif "3-7" in exp_range_str and experience_years < 3:
                exp_status = "Developing / Junior"

        # Sort gaps by priority weight
        all_gaps = sorted(all_gaps, key=lambda x: (0 if x["importance"] == "critical" else (1 if x["importance"] == "high" else 2), -x["gap"]))

        return {
            "target_role": target_role_data["role_name"],
            "role_id": target_role_data["role_id"],
            "role_fit_coverage_pct": role_fit_coverage_pct,
            "explainable_breakdown": {
                "core_skill_coverage": f"{len(strong_matches)} / {len(required_skills)} ({core_coverage_pct}%)",
                "core_coverage_pct": core_coverage_pct,
                "weighted_alignment_pct": role_fit_coverage_pct,
                "matched_core_count": len(strong_matches),
                "total_core_count": len(required_skills),
                "transferable_count": len(transferable_skills),
                "optional_matched_count": len(optional_matched_skills),
                "experience_alignment_status": exp_status
            },
            "strong_matches": strong_matches,
            "partial_matches": partial_matches,
            "critical_gaps": critical_gaps,
            "transferable_skills": transferable_skills,
            "optional_matched_skills": optional_matched_skills,
            "ranked_skill_gaps": all_gaps,
            "total_requirements_count": len(required_skills),
            "met_requirements_count": len(strong_matches),
            "unmet_requirements_count": len(all_gaps)
        }

    @classmethod
    def rank_all_roles_discovery(cls, candidate_skills: List[Dict[str, Any]], experience_years: int = 0) -> List[Dict[str, Any]]:
        """
        Calculates Role Fit / Skill Alignment for ALL pre-defined target roles in Discovery Mode.
        """
        all_roles = RoleIntelligenceSystem.get_all_roles()
        ranked = []

        for role_data in all_roles:
            analysis = cls.calculate_gaps(candidate_skills, role_data, experience_years)
            ranked.append({
                "role_id": role_data["role_id"],
                "role_name": role_data["role_name"],
                "description": role_data["description"],
                "experience_range": role_data["experience_range"],
                "role_fit_alignment_pct": analysis["role_fit_coverage_pct"],
                "core_coverage_text": analysis["explainable_breakdown"]["core_skill_coverage"],
                "strong_matches_count": analysis["met_requirements_count"],
                "critical_gaps_count": len(analysis["critical_gaps"]),
                "transferable_skills_count": len(analysis["transferable_skills"]),
                "confidence_label": role_data["confidence_label"],
                "top_strong_matches": [m["display_name"] for m in analysis["strong_matches"][:3]],
                "top_missing_skills": [g["display_name"] for g in analysis["ranked_skill_gaps"][:3]]
            })

        # Sort descending by role fit alignment percentage
        ranked = sorted(ranked, key=lambda x: x["role_fit_alignment_pct"], reverse=True)
        return ranked
