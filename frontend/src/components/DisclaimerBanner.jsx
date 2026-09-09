import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const DisclaimerBanner = ({ role = 'candidate' }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
      <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-200 block mb-0.5">Responsible AI & Transparency Notice</span>
        {role === 'employer' ? (
          <p>
            AI compatibility scores serve strictly as decision-support indicators and must not be used as the sole basis for hiring or rejection. Recruitment decisions rest with humans and evaluate holistic candidate potential.
          </p>
        ) : (
          <p>
            Match scores and improvement recommendations are AI-assisted estimates based on keyword and experience alignment. They are intended as learning guidance rather than guaranteed hiring outcomes.
          </p>
        )}
      </div>
    </div>
  );
};

export default DisclaimerBanner;
