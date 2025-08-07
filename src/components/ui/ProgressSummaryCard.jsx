import React from 'react';

// Mapeamento de cores mais robusto e explícito
const colorVariants = {
  emerald: {
    icon: 'text-emerald-600 bg-emerald-50 ring-emerald-100',
    progress: 'bg-emerald-500'
  },
  amber: {
    icon: 'text-amber-600 bg-amber-50 ring-amber-100',
    progress: 'bg-amber-500'
  },
  sky: {
    icon: 'text-sky-600 bg-sky-50 ring-sky-100',
    progress: 'bg-sky-500'
  },
  violet: {
    icon: 'text-violet-600 bg-violet-50 ring-violet-100',
    progress: 'bg-violet-600'
  },
  green: {
    icon: 'text-green-600 bg-green-50 ring-green-100',
    progress: 'bg-green-500'
  },
};

export default function ProgressSummaryCard({ icon, title, value, description, color, progress }) {
  // Define um padrão e pega o objeto de estilos completo
  const colorStyles = colorVariants[color] || colorVariants.emerald;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-full flex flex-col ring-1 ring-stone-100">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colorStyles.icon} ring-4`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-stone-800">{value}</h3>
          <p className="text-sm text-stone-500">{title}</p>
        </div>
      </div>
      
      <div className="flex-grow"></div> 
      
      <div className="mt-4">
        <div className="h-2 w-full bg-stone-100 rounded-full">
          <div 
            // Usa a classe de progresso diretamente, sem manipulação de string
            className={`h-2 rounded-full ${colorStyles.progress}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-1.5 truncate">{description}</p>
      </div>
    </div>
  );
}