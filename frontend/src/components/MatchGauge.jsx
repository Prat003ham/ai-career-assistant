import React from 'react';

const MatchGauge = ({ score = 80, size = 120, strokeWidth = 10, label = 'Overall Match' }) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'text-emerald-400';
  let strokeColor = '#34d399'; // emerald
  if (normalizedScore < 60) {
    colorClass = 'text-rose-400';
    strokeColor = '#fb7185';
  } else if (normalizedScore < 75) {
    colorClass = 'text-amber-400';
    strokeColor = '#fbbf24';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-black ${colorClass}`}>
            {Math.round(normalizedScore)}%
          </span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-400">{label}</span>}
    </div>
  );
};

export default MatchGauge;
