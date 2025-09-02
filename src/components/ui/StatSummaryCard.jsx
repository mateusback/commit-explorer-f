import React from 'react';

const colorVariants = {
  emerald: 'text-emerald-600 bg-emerald-50 ring-emerald-100',
  violet: 'text-violet-600 bg-violet-50 ring-violet-100',
  sky: 'text-sky-600 bg-sky-50 ring-sky-100',
  amber: 'text-amber-600 bg-amber-50 ring-amber-100',
  red: 'text-red-600 bg-red-50 ring-red-100',
};

export default function StatSummaryCard({ icon, title, value, description, color, onClick }) {
  const colorStyles = colorVariants[color] || colorVariants.emerald;

  const cardContent = (
    <div className="bg-white p-5 rounded-xl shadow-sm h-full flex flex-col ring-1 ring-stone-100">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colorStyles} ring-4`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <p className="text-3xl font-bold text-stone-800">{value}</p>
      </div>
      
      <div className="flex-grow mt-4">
        <h3 className="font-semibold text-stone-700">{title}</h3>
        <p className="text-xs text-stone-400 mt-1 truncate">{description}</p>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="h-full w-full text-left">
        {cardContent}
      </button>
    );
  }

  return cardContent;
}