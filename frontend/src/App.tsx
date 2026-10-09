import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Overview } from './pages/Overview';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { SkillIntelligence } from './pages/SkillIntelligence';
import { JuniorCareer } from './pages/JuniorCareer';
import { SeniorSuccess } from './pages/SeniorSuccess';
import { WorkforceStrategy } from './pages/WorkforceStrategy';
import { ModelLab } from './pages/ModelLab';
import { DataQuality } from './pages/DataQuality';
import { JuryModeView } from './components/JuryModeView';
import { CareerAIView } from './components/CareerAIView';
import { TabType } from './types';
import { api } from './api';

import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const handleExportMetadata = async () => {
    try {
      const data = await api.getExportMetadata();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workforce_intelligence_hackathon_metadata.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting metadata:', err);
      alert('Failed to export metadata. Ensure backend API is online.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Header onExportMetadata={handleExportMetadata} />
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <ErrorBoundary key={activeTab}>
          {activeTab === 'overview' && <Overview onNavigate={setActiveTab} />}
          {activeTab === 'career' && <CareerAIView />}
          {activeTab === 'market' && <MarketIntelligence />}
          {activeTab === 'skills' && <SkillIntelligence />}
          {activeTab === 'junior' && <JuniorCareer />}
          {activeTab === 'senior' && <SeniorSuccess />}
          {activeTab === 'workforce' && <WorkforceStrategy />}
          {activeTab === 'models' && <ModelLab />}
          {activeTab === 'quality' && <DataQuality />}
          {activeTab === 'jury' && <JuryModeView onNavigate={setActiveTab} />}
        </ErrorBoundary>
      </main>

      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 font-mono">
        DATA SCIENCE WORKFORCE INTELLIGENCE &bull; COMPETITION-GRADE SAS CU HACKATHON PLATFORM
      </footer>
    </div>
  );
}

export default App;
