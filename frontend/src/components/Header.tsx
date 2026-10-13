import React, { useState, useEffect } from 'react';
import { BrainCircuit, Layers, Download, HelpCircle, AlertCircle } from 'lucide-react';
import { MethodologyModal } from './MethodologyModal';
import { api } from '../api';

interface HeaderProps {
  onExportMetadata: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportMetadata }) => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        await api.getHealth();
        if (isMounted) setIsOnline(true);
      } catch (err) {
        if (isMounted) setIsOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  DATA SCIENCE WORKFORCE INTELLIGENCE
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-semibold">
                    SAS CU HACKATHON
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    Team The Processors
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Market &rarr; Skills &rarr; Career &rarr; Success &rarr; Strategy
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              View Methodology
            </button>

            {isOnline === true ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                API Connected (127.0.0.1:8000)
              </div>
            ) : isOnline === false ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-mono" title="Backend not reachable at http://127.0.0.1:8000">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Backend Offline (Retrying...)
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                Checking Connection...
              </div>
            )}

            <button
              onClick={onExportMetadata}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Lineage JSON
            </button>
          </div>
        </div>
      </header>

      <MethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </>
  );
};

