import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  trend?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  trend
}) => {
  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
          {icon && <div className="p-1.5 bg-slate-800 text-blue-400 rounded-lg">{icon}</div>}
        </div>
        <div className="text-2xl font-bold text-white tracking-tight my-1">{value}</div>
      </div>
      {(subtitle || badge || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {badge && (
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-medium">
              {badge}
            </span>
          )}
          {trend && <span className="text-emerald-400 font-medium">{trend}</span>}
        </div>
      )}
    </div>
  );
};
