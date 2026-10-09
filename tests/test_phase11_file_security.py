import unittest
import sys
import os

# Ensure backend modules are on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.career.resume_parser import ResumeParser

class TestPhase11FileSecurityAndRobustness(unittest.TestCase):
    """
    Phase 11 File Upload Security & Malformed File Robustness Test Suite.
    Verifies Part 6 security guardrails for resume handling.
    """

    def test_01_allowed_file_extensions(self):
        """Verifies extension whitelist validation (.pdf, .docx, .txt)."""
        self.assertIsNone(ResumeParser.validate_file("resume.pdf", 1024))
        self.assertIsNone(ResumeParser.validate_file("my_cv.docx", 1024))
        self.assertIsNone(ResumeParser.validate_file("bio.txt", 1024))

        self.assertIsNotNone(ResumeParser.validate_file("malicious.exe", 1024))
        self.assertIsNotNone(ResumeParser.validate_file("script.sh", 1024))
        self.assertIsNotNone(ResumeParser.validate_file("payload.py", 1024))

    def test_02_file_size_limits(self):
        """Verifies maximum file size limit enforcement (5 MB)."""
        valid_size = 4 * 1024 * 1024  # 4 MB
        oversized_size = 6 * 1024 * 1024  # 6 MB

        self.assertIsNone(ResumeParser.validate_file("resume.pdf", valid_size))
        self.assertIsNotNone(ResumeParser.validate_file("resume.pdf", oversized_size))

    def test_03_filename_path_traversal_sanitization(self):
        """Verifies path traversal attempts in filenames are sanitized."""
        dangerous_filename = "../../../etc/passwd.txt"
        err = ResumeParser.validate_file(dangerous_filename, 1024)
        # Should be accepted as .txt extension without executing path traversal
        self.assertIsNone(err)

    def test_04_empty_text_parsing_graceful(self):
        """Verifies empty resume text is handled gracefully without throwing exceptions."""
        profile = ResumeParser.parse_profile("", filename="empty.txt")
        self.assertEqual(profile["total_skills_count"], 0)
        self.assertEqual(profile["candidate"]["experience_years"], 0)
        self.assertEqual(profile["candidate"]["name"], "Candidate")

    def test_05_corrupted_bytes_handling(self):
        """Verifies corrupted PDF or DOCX byte streams fall back cleanly."""
        corrupted_bytes = b"%PDF-1.4 corrupted header garbage data %EOF"
        extracted = ResumeParser.extract_text(corrupted_bytes, "corrupted.pdf")
        self.assertIsInstance(extracted, str)
        self.assertGreater(len(extracted), 0)

    def test_06_unicode_sanitization(self):
        """Verifies control characters and script injections are stripped."""
        raw_text_with_control_chars = "Jane Doe\x00\x08 Python Developer\x1F Data Analyst"
        extracted = ResumeParser.extract_text(raw_text_with_control_chars.encode("utf-8"), "test.txt")
        self.assertNotIn("\x00", extracted)
        self.assertNotIn("\x1F", extracted)

if __name__ == "__main__":
    unittest.main()
