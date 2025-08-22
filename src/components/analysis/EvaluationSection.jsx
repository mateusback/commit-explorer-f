import React, { useState, useMemo, useRef } from 'react';
import { ThumbsUp, ThumbsDown, ClipboardEdit, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ExportWholePageButton } from '../buttons/ExportWholePageButton';

export default function EvaluationSection({score, feedbackData}) {
  const [feedbackExtra, setFeedbackExtra] = useState('');
  const contentRef = useRef(null);

  const {
    pontosPositivos: pp = [],
    pontosNegativos: pn = [],
    sugestoes: sg = [],
    feedback: resumo = '',
    nota = undefined,
  } = feedbackData || {};

  const getScoreColor = (s) => {
    if (s >= 75) return 'text-emerald-600';
    if (s >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getNotaColor = (n) => {
    const map = {
      A: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
      B: 'bg-lime-100 text-lime-700 ring-lime-200',
      C: 'bg-amber-100 text-amber-700 ring-amber-200',
      D: 'bg-orange-100 text-orange-700 ring-orange-200',
      E: 'bg-red-100 text-red-700 ring-red-200',
      F: 'bg-red-100 text-red-700 ring-red-200',
    };
    return map[(n || '').toUpperCase()] || 'bg-stone-100 text-stone-700 ring-stone-200';
  };

  return (
    <section className="bg-white p-5 rounded-xl shadow-sm h-full flex flex-col ring-1 ring-stone-100 mt-2">
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Avaliação e Feedback</h2>

      <div id="analysis-page-content" ref={contentRef} className="card-body p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo compacto do período / métricas */}
              {(resumo || nota) && (
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-emerald-50 via-white to-stone-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
                        <Info size={20} />
                      </div>
                      <span className="text-lg font-semibold text-stone-700">Resumo da Análise</span>
                    </div>
                    {nota && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ring-1 ${getNotaColor(
                          nota
                        )}`}
                      >
                        Nota {nota}
                      </span>
                    )}
                  </div>
                  {resumo && (
                    <p className="text-sm leading-relaxed text-stone-700">
                      {resumo}
                    </p>
                  )}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-100 rounded-full opacity-30 blur-2xl"></div>
                </div>
              )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-stone-700 flex items-center mb-2">
                  <ThumbsUp size={18} className="mr-2 text-emerald-500" />
                  Pontos Positivos
                </h3>
                <ul className="space-y-2 text-sm text-stone-700">
                  {pp?.length > 0 ? (
                    pp.map((ponto, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="mr-2 mt-0.5 text-emerald-500" size={16} />
                        <span>{ponto}</span>
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
                <ul className="space-y-2 text-sm text-stone-700">
                  {pn?.length > 0 ? (
                    pn.map((ponto, i) => (
                      <li key={i} className="flex items-start">
                        <AlertTriangle className="mr-2 mt-0.5 text-amber-500" size={16} />
                        <span>{ponto}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-400 italic">Nenhum ponto de melhoria destacado.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-stone-700">Sugestões de Ação</h3>
              {sg?.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sg.map((s, i) => (
                    <li key={i} className="text-sm px-3 py-2 rounded-lg bg-white ring-1 ring-stone-200 shadow-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-400 italic">Sem sugestões específicas.</p>
              )}
            </div>
            <div>
              <label htmlFor="feedback-textarea" className="font-semibold text-stone-700 mb-2 flex items-center">
                <ClipboardEdit size={18} className="mr-2 text-stone-500" />
                Feedback Adicional
              </label>
              <textarea
                id="feedback-textarea"
                className="textarea textarea-bordered w-full h-32 bg-stone-50 focus:ring-emerald-400 focus:border-emerald-400 rounded-sm shadow-sm placeholder:text-stone-400 placeholder:italic p-2"
                placeholder="Adicione um feedback manual (opcional)…"
                value={feedbackExtra}
                onChange={(e) => setFeedbackExtra(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-stone-50/80 rounded-xl p-6 flex flex-col items-center justify-center text-center ring-1 ring-stone-200">
            <h3 className="font-semibold text-stone-700">Resultado</h3>
            {typeof score === 'number' ? (
              <>
                <p className={`text-7xl font-bold my-2 ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                </p>
                <p className="text-sm text-stone-500 mb-4">Pontuação de qualidade</p>
              </>
            ) : (
              <div className="mb-4" />
            )}
            {nota && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ring-1 ${getNotaColor(nota)} mb-6`}>
                Conceito Recomendado: {nota}
              </div>
            )}
            <ExportWholePageButton
              text="Salvar Avaliação"
              filename={`avaliacao-${new Date().toISOString().slice(0, 10)}.pdf`}
              landscape={false}
              selector="#analysis-page-content"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
