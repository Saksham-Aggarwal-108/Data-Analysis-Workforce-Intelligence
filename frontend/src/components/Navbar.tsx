import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  GraduationCap, 
  Award, 
  Compass, 
  FlaskConical, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; isJury?: boolean; isCareer?: boolean }> = [
    { id: 'overview', label: 'Executive Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'career', label: 'Career AI Copilot', icon: <Bot className="w-4 h-4 text-indigo-400" />, isCareer: true },
    { id: 'market', label: 'Market Intelligence', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'skills', label: 'Skill Intelligence', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
    { id: 'junior', label: 'Junior Career', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'senior', label: 'Senior Success', icon: <Award className="w-4 h-4" /> },
    { id: 'workforce', label: 'Workforce Strategy', icon: <Compass className="w-4 h-4" /> },
    { id: 'models', label: 'Model Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'quality', label: 'Data Quality Engine', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'jury', label: 'Jury Demo Mode', icon: <Sparkles className="w-4 h-4 text-amber-400" />, isJury: true },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? tab.isJury
                    ? 'border-amber-500 text-amber-300 bg-amber-500/10'
                    : tab.isCareer
                    ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                    : 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : tab.isJury
                  ? 'border-transparent text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
                  : tab.isCareer
                  ? 'border-transparent text-indigo-400/80 hover:text-indigo-300 hover:bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
