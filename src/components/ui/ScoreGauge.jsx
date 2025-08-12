import React from 'react';

export default function ScoreGauge({ score = 0, size = 120 }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (s / 100) * circumference;

  const getColor = (val) => (val >= 75 ? 'text-emerald-500' : val >= 50 ? 'text-amber-500' : 'text-red-500');
  const color = getColor(s);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox="0 0 120 120" aria-label={`Pontuação ${s.toFixed(1)}`}> 
        <circle className="text-stone-200" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
        <circle
          className={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className={`absolute text-3xl font-bold ${color}`}>{s.toFixed(1)}</span>
    </div>
  );
}