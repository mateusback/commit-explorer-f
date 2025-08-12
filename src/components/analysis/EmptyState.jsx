import React from 'react';

export function EmptyState({ icon = null, title = 'Nada por aqui', description = 'Sem dados disponíveis no momento.' }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow">
      <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-stone-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-stone-700">{title}</h3>
      <p className="mt-1 text-stone-500">{description}</p>
    </div>
  );
}
