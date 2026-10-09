# FINAL COMPETITION CHECKLIST

**Project Title**: Data Science Workforce Intelligence  
**Team**: The Processors  
**Event**: SAS CU Hackathon  

---

### BEFORE EVENT
- [x] Project workspace folder verified (`e:/COLLEGE/Hackathon/SAS-CU-HACKATHON`)
- [x] `run_demo.bat` startup script tested
- [x] Backend API tested (`python -m unittest discover -s tests -p "test_*.py" -v`)
- [x] Frontend build tested (`cmd /c npm run build`)
- [x] Browser rendering verified at 100% zoom
- [x] Final Approach Note Word Document compiled (`SAS_CU_Hackathon_The_Processors_Final_Approach_Note.docx`)
- [x] Backup materials copied to USB drive
- [x] All 4 source data files present in `data/`
- [x] Offline local execution verified (zero external API dependencies)

---

### BEFORE PRESENTATION
- [ ] Run `run_demo.bat`
- [ ] Open Chrome/Edge to `http://localhost:3000`
- [ ] Verify Executive Overview loads cleanly
- [ ] Open **Jury Demo Mode** tab (`http://localhost:3000`)
- [ ] Verify Model Lab out-of-fold metrics (`0.9928` ROC-AUC)
- [ ] Test 1 trial calculation on Prediction Demo slider
- [ ] Confirm "Responsible AI" badge is visible
- [ ] Ensure browser zoom is set to **100%**
- [ ] Mute notifications and close background apps

---

### DURING PRESENTATION
- [ ] **Problem** (0:00–0:20): Explain fragmented workforce decision-making
- [ ] **Four Datasets** (0:20–0:45): Introduce the 4 evidence layers (1,602 + 15,841 + 139 + 161)
- [ ] **No Invalid Merge** (0:45–1:05): Explain why datasets remain analytically isolated
- [ ] **Market & Skills** (1:05–1:30): Show salary bounding and Python/SQL/MLOps prevalence
- [ ] **Junior Career** (1:30–1:50): Highlight storytelling & SQL association with >15% salary hike
- [ ] **Senior Success Model** (1:50–2:20): Present Random Forest AUC 0.9928, Conscientiousness OR 8.56
- [ ] **Validation** (2:20–2:40): Explain Grouped-ID sensitivity ($\Delta = 0.0001$) & 50-Fold Repeated CV ($0.9957$)
- [ ] **Responsible AI** (2:40–2:55): State prohibition of automated candidate hiring/rejection
- [ ] **Workforce Strategy & Closing** (2:55–3:00): Conclude with traceable evidence transformation

---

### AFTER PRESENTATION
- [ ] Answer judge Q&As using `docs/JURY_MOCK_INTERVIEW.md`
- [ ] Do NOT overclaim or assert causality
- [ ] Distinguish observational association from causality
- [ ] Distinguish ROC-AUC ($0.9928$) from accuracy ($0.9627$)
- [ ] Direct judges to `/models` and `/quality` tabs for deep technical lineage
