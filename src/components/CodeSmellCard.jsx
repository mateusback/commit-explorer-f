import React from 'react';
import { TriangleAlert } from 'lucide-react';

const severityMap = {
  1: { text: 'INFO', classes: 'border-sky-500 bg-sky-50 text-sky-800' },
  2: { text: 'MINOR', classes: 'border-yellow-500 bg-yellow-50 text-yellow-800' },
  3: { text: 'MAJOR', classes: 'border-orange-500 bg-orange-50 text-orange-800' },
  4: { text: 'CRITICAL', classes: 'border-red-500 bg-red-50 text-red-800' },
};

export default function CodeSmellCard({ smell }) {
  if (smell.tipo === 'INFO') {
    return null;
  }
  
  const severity = severityMap[smell.severidade] || { classes: 'border-stone-300' };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${severity.classes}`}>
      <div className="flex items-start gap-3">
        <TriangleAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold">{smell.descricaoSmell}</p>
          {smell.linha && (
             <p className="text-xs font-mono mt-2 bg-stone-200 inline-block px-1.5 py-0.5 rounded">Linha: {smell.linha}</p>
          )}
        </div>
      </div>
    </div>
  );
}