import React, { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, ClipboardEdit, Download, Loader2 } from 'lucide-react';
import { ExportWholePageButton } from '../buttons/ExportWholePageButton';

export default function EvaluationSection({ score, pontosPositivos = [], pontosNegativos = [] }) {
  const [feedback, setFeedback] = useState('');
  const contentRef = useRef(null);

  const getScoreColor = (s) => {
    if (s >= 75) return 'text-emerald-600';
    if (s >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <section className="bg-white p-5 rounded-xl shadow-sm h-full flex flex-col ring-1 ring-stone-100 mt-2">
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Avaliação e Feedback</h2>

      <div id="analysis-page-content" ref={contentRef} className="card-body p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Coluna Esquerda: Pontos e Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-stone-700 flex items-center mb-2">
                  <ThumbsUp size={18} className="mr-2 text-emerald-500" />
                  Pontos Positivos
                </h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  {pontosPositivos.length > 0 ? (
                    pontosPositivos.map((ponto, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1 text-emerald-500">✓</span>{ponto}
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-400 italic">Nenhum ponto positivo destacado.</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-stone-700 flex items-center mb-2">
                  <ThumbsDown size={18} className="mr-2 text-amber-500" />
                  Pontos de Melhoria
                </h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  {pontosNegativos.length > 0 ? (
                    pontosNegativos.map((ponto, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1 text-amber-500">!</span>{ponto}
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-400 italic">Nenhum ponto de melhoria destacado.</li>
                  )}
                </ul>
              </div>
            </div>
            <div>
              <label htmlFor="feedback-textarea" className="font-semibold text-stone-700 mb-2 flex items-center">
                <ClipboardEdit size={18} className="mr-2 text-stone-500" />
                Feedback Adicional
              </label>
              <textarea
                id="feedback-textarea"
                className="textarea textarea-bordered w-full h-32 bg-stone-50 focus:ring-emerald-400 focus:border-emerald-400 rounded-sm shadow-sm placeholder:text-stone-400 placeholder:italic p-2"
                placeholder="Adicione um feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>

          {/* Coluna Direita: Nota e Ação */}
          <div className="bg-stone-50/80 rounded-xl p-6 flex flex-col items-center justify-center text-center ring-1 ring-stone-200">
            <h3 className="font-semibold text-stone-700">Nota Sugerida</h3>
            <p className={`text-7xl font-bold my-2 ${getScoreColor(score)}`}>
              {score?.toFixed(1)}
            </p>
            <p className="text-sm text-stone-500 mb-6">
              Baseado na análise de qualidade
            </p>
            
            <ExportWholePageButton
              text="Salvar Avaliação"
              filename={`avaliacao-${new Date().toISOString().slice(0, 10)}.pdf`}
              landscape={false}
            />

          </div>
        </div>
      </div>
    </section>
  );
}
