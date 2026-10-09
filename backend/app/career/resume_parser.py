import os
import re
import io
from typing import Dict, Any, List, Set, Optional
from app.career.taxonomy import SkillTaxonomy

class ResumeParser:
    """
    Secure Resume Parsing Engine for PDF, DOCX, and TXT files.
    Parses resume text into normalized CandidateProfile structure with zero shell execution risk.
    Features Part 4 & 5: Skill Evidence Level Classification and Transparent Proficiency Inference.
    """

    ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

    @classmethod
    def validate_file(cls, filename: str, content_length: int) -> Optional[str]:
        """Validates file extension and size limits."""
        if content_length > cls.MAX_FILE_SIZE_BYTES:
            return f"File size exceeds maximum limit of 5 MB ({content_length / (1024*1024):.2f} MB)."
        
        ext = os.path.splitext(filename)[1].lower()
        if ext not in cls.ALLOWED_EXTENSIONS:
            return f"Unsupported file extension '{ext}'. Allowed formats: PDF, DOCX, TXT."
        
        return None

    @classmethod
    def extract_text(cls, file_bytes: bytes, filename: str) -> str:
        """Extracts plain text safely from PDF, DOCX, or TXT content."""
        ext = os.path.splitext(filename)[1].lower()
        extracted_text = ""

        if ext == ".txt":
            try:
                extracted_text = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                extracted_text = file_bytes.decode("latin-1", errors="ignore")

        elif ext == ".docx":
            try:
                import docx
                doc = docx.Document(io.BytesIO(file_bytes))
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                for table in doc.tables:
                    for row in table.rows:
                        row_text = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                        if row_text:
                            paragraphs.append(row_text)
                extracted_text = "\n".join(paragraphs)
            except Exception as e:
                extracted_text = f"Error reading DOCX text: {str(e)}"

        elif ext == ".pdf":
            try:
                import pypdf
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                text_runs = []
                for page in reader.pages:
                    txt = page.extract_text()
                    if txt:
                        text_runs.append(txt)
                extracted_text = "\n".join(text_runs)
            except Exception as e:
                extracted_text = cls._fallback_pdf_text(file_bytes)

        # Sanitize text
        extracted_text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', extracted_text)
        return extracted_text.strip()

    @classmethod
    def _fallback_pdf_text(cls, pdf_bytes: bytes) -> str:
        """Fallback ASCII stream extractor for simple PDFs."""
        raw = pdf_bytes.decode("latin-1", errors="ignore")
        text_parts = re.findall(r'\((.*?)\)\s*Tj', raw)
        if text_parts:
            return "\n".join(text_parts)
        return "PDF content parsed via fallback filter."

    @classmethod
    def analyze_skill_evidence(cls, raw_text: str, alias: str, canonical_key: str, experience_years: int) -> Dict[str, Any]:
        """
        Part 4 & 5: Context-Aware Skill Evidence Classification & Proficiency Inference.
        Determines evidence level (PROFESSIONAL, PROJECT, COURSEWORK, INTEREST, DEMONSTRATED, MENTIONED)
        and infers numerical proficiency score (0 to 5) with transparent confidence.
        """
        lines = raw_text.splitlines()
        matching_lines = [l.strip() for l in lines if re.search(r'\b' + re.escape(alias) + r'\b', l, re.I)]
        
        evidence_text = matching_lines[0] if matching_lines else alias
        match_count = len(matching_lines)

        # Evidence level detection rules
        text_lower = raw_text.lower()
        snippet_lower = " ".join([l.lower() for l in matching_lines])

        evidence_level = "DEMONSTRATED"
        confidence = 0.85

        if any(kw in snippet_lower for kw in ["senior", "lead", "engineer", "scientist", "architect", "years", "work", "client", "present"]):
            evidence_level = "PROFESSIONAL"
            confidence = 0.95
        elif any(kw in snippet_lower for kw in ["project", "developed", "built", "implemented", "deployed", "designed"]):
            evidence_level = "PROJECT"
            confidence = 0.90
        elif any(kw in snippet_lower for kw in ["interested in", "looking to learn", "aspiring", "curious about", "want to learn"]):
            evidence_level = "INTEREST"
            confidence = 0.70
        elif any(kw in snippet_lower for kw in ["coursework", "academic", "class", "university", "degree", "studied"]):
            evidence_level = "COURSEWORK"
            confidence = 0.80
        elif match_count == 1:
            evidence_level = "MENTIONED"
            confidence = 0.75

        # Infer Numerical Proficiency Level (1 to 5)
        inferred_level = 3  # Default practical baseline
        if evidence_level == "INTEREST":
            inferred_level = 1
        elif evidence_level == "COURSEWORK":
            inferred_level = 2
        elif evidence_level == "MENTIONED":
            inferred_level = 2
        elif evidence_level == "PROJECT":
            inferred_level = 3 if experience_years < 2 else 4
        elif evidence_level == "PROFESSIONAL" or evidence_level == "DEMONSTRATED":
            if experience_years >= 5:
                inferred_level = 5
            elif experience_years >= 2 or match_count >= 3:
                inferred_level = 4
            else:
                inferred_level = 3

        meta = SkillTaxonomy.get_metadata(canonical_key)

        return {
            "key": canonical_key,
            "display": meta["display"],
            "category": meta["category"],
            "level": inferred_level,
            "evidence_level": evidence_level,
            "evidence_text": evidence_text[:140],
            "confidence": confidence,
            "match_count": match_count
        }

    @classmethod
    def parse_profile(cls, raw_text: str, filename: str = "uploaded_resume.txt") -> Dict[str, Any]:
        """
        Parses extracted resume text into structured CandidateProfile JSON object.
        """
        lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
        
        # 1. Candidate Name (Guess from first few lines)
        name = "Candidate"
        for l in lines[:5]:
            if len(l) < 40 and not re.search(r'resume|curriculum|email|phone|http|github', l, re.I):
                name = l
                break

        # 2. Extract Experience Years
        exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)\b', raw_text, re.I)
        experience_years = 0
        if exp_matches:
            try:
                experience_years = max([int(m) for m in exp_matches if int(m) < 40])
            except ValueError:
                experience_years = 0

        # 3. Extract Skills using Taxonomy with Evidence Classification
        detected_skills_map: Dict[str, Dict[str, Any]] = {}
        text_lower = raw_text.lower()

        for alias, canonical in SkillTaxonomy.ALIAS_MAP.items():
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, text_lower):
                evidence = cls.analyze_skill_evidence(raw_text, alias, canonical, experience_years)
                # Keep highest confidence / highest evidence level if multiple aliases match same skill
                if canonical not in detected_skills_map or evidence["confidence"] > detected_skills_map[canonical]["confidence"]:
                    detected_skills_map[canonical] = evidence

        flat_skills = sorted(list(detected_skills_map.values()), key=lambda s: s["display"])

        # Categorize Extracted Skills
        categorized_skills: Dict[str, List[Dict[str, Any]]] = {cat: [] for cat in SkillTaxonomy.CATEGORIES}
        for s in flat_skills:
            cat = s["category"]
            if cat in categorized_skills:
                categorized_skills[cat].append({
                    "key": s["key"],
                    "display": s["display"],
                    "level": s["level"],
                    "evidence_level": s["evidence_level"]
                })

        # 4. Extract Roles & Projects Evidence
        project_keywords = ["project", "built", "developed", "implemented", "system", "app", "model", "pipeline", "dashboard"]
        detected_projects = []
        for line in lines:
            if any(kw in line.lower() for kw in project_keywords) and len(line) > 20:
                detected_projects.append(line[:140])
                if len(detected_projects) >= 5:
                    break

        # 5. Profile Completeness Score
        completeness_pct = min(100, round((len(flat_skills) * 5) + (experience_years * 10) + (len(detected_projects) * 10), 1))

        profile = {
            "source_file": filename,
            "candidate": {
                "name": name,
                "experience_years": experience_years,
                "extracted_lines_count": len(lines),
                "profile_completeness_pct": completeness_pct
            },
            "skills": flat_skills,
            "categorized_skills": categorized_skills,
            "total_skills_count": len(flat_skills),
            "sample_projects": detected_projects,
            "raw_text_snippet": raw_text[:500]
        }
        return profile
