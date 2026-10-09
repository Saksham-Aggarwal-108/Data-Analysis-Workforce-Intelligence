import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const EthicalBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-xs leading-relaxed flex items-start gap-3 my-4">
      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <div className="font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
          ETHICAL ANALYTICS & RESPONSIBLE AI GOVERNANCE RULE
        </div>
        <p>
          Personality trait findings derived from the SDS Personality Traits dataset represent <strong>observational associations</strong> among senior customer-facing data scientists. Personality variables must <strong>NEVER</strong> be interpreted as deterministic causes of success or used as standalone hiring filters or automated rejection criteria. SDS insights are designed exclusively for <strong>professional development, executive coaching, role-fit exploration, and workforce capability strategy</strong>.
        </p>
      </div>
    </div>
  );
};
