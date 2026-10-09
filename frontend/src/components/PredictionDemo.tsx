import React, { useState } from 'react';
import { api } from '../api';
import { PredictionResult } from '../types';
import { Sliders, Sparkles, AlertCircle, ShieldAlert, Award } from 'lucide-react';

export const PredictionDemo: React.FC = () => {
  const [traits, setTraits] = useState({
    neuroticism: 30,
    extraversion: 65,
    openness_to_experience: 75,
    agreeableness: 70,
    conscientiousness: 85
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, val: number) => {
    setTraits(prev => ({ ...prev, [key]: val }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await api.predictSeniorSuccess(traits);
      setResult(res);
    } catch (err) {
      console.error('Prediction API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Interactive SDS Senior Success Prediction Demonstration
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore model classification output for Big Five trait score combinations using the selected Random Forest model.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold">
          Live Model Inference
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders Input */}
        <div className="space-y-4">
          {[
            { key: 'neuroticism', label: 'Neuroticism (Emotional Reactivity)', color: 'accent-rose-500' },
            { key: 'extraversion', label: 'Extraversion (Social Engagement)', color: 'accent-blue-500' },
            { key: 'openness_to_experience', label: 'Openness to Experience (Curiosity)', color: 'accent-purple-500' },
            { key: 'agreeableness', label: 'Agreeableness (Collaboration)', color: 'accent-emerald-500' },
            { key: 'conscientiousness', label: 'Conscientiousness (Execution Discipline)', color: 'accent-indigo-500' }
          ].map((item) => {
            const val = (traits as any)[item.key];
            return (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono text-blue-400 font-bold">{val} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => handleChange(item.key, parseFloat(e.target.value))}
                  className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${item.color}`}
                />
              </div>
            );
          })}

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Computing Model Inference...' : 'Calculate Model Classification'}
          </button>
        </div>

        {/* Prediction Output Card */}
        <div className="flex flex-col justify-between p-5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Model Output</span>
                <span className="text-xs font-mono text-blue-400">{result.model_used}</span>
              </div>

              <div>
                <div className="text-xs text-slate-400">Predicted Success Label:</div>
                <div className={`text-xl font-extrabold mt-1 ${
                  result.predicted_class === 1 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {result.predicted_label}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Prob (High Success)</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{result.probability_high_pct}%</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Prob (Low Success)</div>
                  <div className="text-lg font-bold text-slate-400 font-mono mt-1">{result.probability_low_pct}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-8 text-slate-500">
              <Award className="w-8 h-8 text-slate-600" />
              <div className="text-xs">Adjust sliders and click button to run model prediction.</div>
            </div>
          )}

          {/* Mandatory Responsible AI Notice */}
          <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-lg text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>RESPONSIBLE AI DISCLAIMER:</strong> This is a model-based classification for analytical exploration. It is <strong>NOT</strong> a hiring recommendation, performance guarantee, or deterministic assessment of an individual.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
