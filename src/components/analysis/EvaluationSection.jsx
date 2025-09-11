import React, { useState, useMemo, useRef } from 'react';
import { ThumbsUp, ThumbsDown, ClipboardEdit, Info, CheckCircle2, AlertTriangle, Award } from 'lucide-react';
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
    pontuacaoGeral = undefined,
    conceito = undefined,
    pontuacaoFrequenciaConsistencia = undefined,
    pontuacaoQualidadeMensagens = undefined,
    pontuacaoVariedadeTipos = undefined,
    pontuacaoDistribuicaoTrabalho = undefined,
    pontuacaoDistribuicaoTemporal = undefined,
    pontuacaoQualidadeTecnica = undefined,
  } = feedbackData || {};

  const getScoreColor = (s) => {
    if (s >= 75) return 'text-emerald-600';
    if (s >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (s) => {
    if (s >= 75) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreBgColor = (s) => {
    if (s >= 75) return 'bg-emerald-50';
    if (s >= 50) return 'bg-amber-50';
    return 'bg-red-50';
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
    <section className="bg-gradient-to-br from-white via-stone-50/50 to-white p-6 rounded-2xl shadow-lg ring-1 ring-stone-200/60 mt-4">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center ring-4 ring-emerald-50 mr-4">
          <Award className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Avaliação e Feedback</h2>
          <p className="text-sm text-stone-600">Análise detalhada do desempenho do projeto</p>
        </div>
      </div>

      <div id="analysis-page-content" ref={contentRef} className="p-2">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
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
              <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl ring-1 ring-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-800 flex items-center mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <ThumbsUp size={16} className="text-emerald-600" />
                  </div>
                  Pontos Positivos
                </h3>
                <ul className="space-y-3 text-sm text-stone-700">
                  {pp?.length > 0 ? (
                    pp.map((ponto, i) => (
                      <li key={i} className="flex items-start bg-white/60 p-3 rounded-lg">
                        <CheckCircle2 className="mr-3 mt-0.5 text-emerald-500 flex-shrink-0" size={16} />
                        <span className="leading-relaxed">{ponto}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-400 italic bg-white/60 p-3 rounded-lg">Nenhum ponto positivo destacado.</li>
                  )}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl ring-1 ring-amber-100 shadow-sm">
                <h3 className="font-bold text-amber-800 flex items-center mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <ThumbsDown size={16} className="text-amber-600" />
                  </div>
                  Pontos de Melhoria
                </h3>
                <ul className="space-y-3 text-sm text-stone-700">
                  {pn?.length > 0 ? (
                    pn.map((ponto, i) => (
                      <li key={i} className="flex items-start bg-white/60 p-3 rounded-lg">
                        <AlertTriangle className="mr-3 mt-0.5 text-amber-500 flex-shrink-0" size={16} />
                        <span className="leading-relaxed">{ponto}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-400 italic bg-white/60 p-3 rounded-lg">Nenhum ponto de melhoria destacado.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl ring-1 ring-blue-100 shadow-sm">
              <h3 className="font-bold text-blue-800 flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Info size={16} className="text-blue-600" />
                </div>
                Sugestões de Ação
              </h3>
              {sg?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sg.map((s, i) => (
                    <div key={i} className="text-sm px-4 py-3 rounded-lg bg-white/80 ring-1 ring-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="leading-relaxed">{s}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400 italic bg-white/60 p-4 rounded-lg">Sem sugestões específicas.</p>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl ring-1 ring-purple-100 shadow-sm">
              <label htmlFor="feedback-textarea" className="font-bold text-purple-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <ClipboardEdit size={16} className="text-purple-600" />
                </div>
                Feedback Adicional
              </label>
              <textarea
                id="feedback-textarea"
                className="textarea textarea-bordered w-full h-32 bg-white/80 border-purple-200 focus:ring-purple-400 focus:border-purple-400 rounded-lg shadow-sm placeholder:text-stone-400 placeholder:italic p-4 text-sm leading-relaxed resize-none"
                placeholder="Adicione observações ou comentários adicionais sobre a análise..."
                value={feedbackExtra}
                onChange={(e) => setFeedbackExtra(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-stone-50/50 rounded-xl p-6 ring-1 ring-stone-200/60 shadow-lg h-fit sticky top-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center ring-4 ring-emerald-50">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-bold text-stone-800 mb-6 text-lg">Resultado da Análise</h3>
              
              {/* Pontuação Principal */}
              {typeof pontuacaoGeral === 'number' ? (
                <>
                  <div className="relative mb-4">
                    <p className={`text-5xl font-black ${getScoreColor(pontuacaoGeral)} drop-shadow-sm`}>
                      {pontuacaoGeral.toFixed(1)}
                    </p>
                    <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-stone-100/50 to-transparent rounded-full blur-xl -z-10"></div>
                  </div>
                  <p className="text-sm font-medium text-stone-600 mb-4 tracking-wide uppercase">Pontuação Geral</p>
                </>
              ) : typeof score === 'number' ? (
                <>
                  <div className="relative mb-4">
                    <p className={`text-5xl font-black ${getScoreColor(score)} drop-shadow-sm`}>
                      {score.toFixed(1)}
                    </p>
                    <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-stone-100/50 to-transparent rounded-full blur-xl -z-10"></div>
                  </div>
                  <p className="text-sm font-medium text-stone-600 mb-4 tracking-wide uppercase">Pontuação de Qualidade</p>
                </>
              ) : (
                <div className="mb-4" />
              )}
              
              {/* Conceito */}
              {(conceito || nota) && (
                <div className="mb-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ring-2 shadow-md ${getNotaColor(conceito || nota)}`}>
                    <span className="mr-2">🏆</span>
                    Conceito {conceito || nota}
                  </span>
                </div>
              )}

              {/* Pontuações Detalhadas */}
              {(pontuacaoFrequenciaConsistencia !== undefined || pontuacaoQualidadeMensagens !== undefined) && (
                <div className="w-full space-y-4 mb-6">
                  <div className="border-t border-stone-200 pt-4">
                    <h4 className="text-sm font-bold text-stone-700 mb-3 flex items-center justify-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      Métricas Detalhadas
                    </h4>
                  </div>
                  
                  <div className="space-y-3 bg-white/60 rounded-lg p-4 ring-1 ring-stone-100">
                    {pontuacaoFrequenciaConsistencia !== undefined && (
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-700 flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            Freq. & Consistência
                          </span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${getScoreColor(pontuacaoFrequenciaConsistencia)} bg-stone-50`}>
                            {pontuacaoFrequenciaConsistencia.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                          <div 
                            className={`h-2 rounded-full ${getScoreBarColor(pontuacaoFrequenciaConsistencia)} shadow-sm transition-all duration-300`}
                            style={{ width: `${Math.min(pontuacaoFrequenciaConsistencia, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {pontuacaoQualidadeMensagens !== undefined && (
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-700 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            Qualidade Mensagens
                          </span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${getScoreColor(pontuacaoQualidadeMensagens)} bg-stone-50`}>
                            {pontuacaoQualidadeMensagens.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                          <div 
                            className={`h-2 rounded-full ${getScoreBarColor(pontuacaoQualidadeMensagens)} shadow-sm transition-all duration-300`}
                            style={{ width: `${Math.min(pontuacaoQualidadeMensagens, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {pontuacaoVariedadeTipos !== undefined && (
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-700 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                            Variedade de Tipos
                          </span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${getScoreColor(pontuacaoVariedadeTipos)} bg-stone-50`}>
                            {pontuacaoVariedadeTipos.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                          <div 
                            className={`h-2 rounded-full ${getScoreBarColor(pontuacaoVariedadeTipos)} shadow-sm transition-all duration-300`}
                            style={{ width: `${Math.min(pontuacaoVariedadeTipos, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {pontuacaoDistribuicaoTrabalho !== undefined && (
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-700 flex items-center">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                            Distr. do Trabalho
                          </span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${getScoreColor(pontuacaoDistribuicaoTrabalho)} bg-stone-50`}>
                            {pontuacaoDistribuicaoTrabalho.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                          <div 
                            className={`h-2 rounded-full ${getScoreBarColor(pontuacaoDistribuicaoTrabalho)} shadow-sm transition-all duration-300`}
                            style={{ width: `${Math.min(pontuacaoDistribuicaoTrabalho, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {pontuacaoDistribuicaoTemporal !== undefined && (
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-700 flex items-center">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                            Distr. Temporal
                          </span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${getScoreColor(pontuacaoDistribuicaoTemporal)} bg-stone-50`}>
                            {pontuacaoDistribuicaoTemporal.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                          <div 
                            className={`h-2 rounded-full ${getScoreBarColor(pontuacaoDistribuicaoTemporal)} shadow-sm transition-all duration-300`}
                            style={{ width: `${Math.min(pontuacaoDistribuicaoTemporal, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {pontuacaoQualidadeTecnica !== undefined && (
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-700 flex items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                            Qualidade Técnica
                          </span>
                          {pontuacaoQualidadeTecnica === null ? (
                            <span className="text-sm font-medium px-2 py-1 rounded-md text-stone-500 bg-stone-100 italic">
                              Desconsiderado
                            </span>
                          ) : (
                            <span className={`text-sm font-bold px-2 py-1 rounded-md ${getScoreColor(pontuacaoQualidadeTecnica)} bg-stone-50`}>
                              {pontuacaoQualidadeTecnica.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        {pontuacaoQualidadeTecnica !== null ? (
                          <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                            <div 
                              className={`h-2 rounded-full ${getScoreBarColor(pontuacaoQualidadeTecnica)} shadow-sm transition-all duration-300`}
                              style={{ width: `${Math.min(pontuacaoQualidadeTecnica, 100)}%` }}
                            ></div>
                          </div>
                        ) : (
                          <div className="w-full bg-stone-200 rounded-full h-2 shadow-inner">
                            <div className="h-2 rounded-full bg-stone-300 shadow-sm" style={{ width: '100%' }}>
                              <div className="h-full flex items-center justify-center">
                                <span className="text-[10px] font-medium text-stone-600">N/A</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="w-full">
                <ExportWholePageButton
                  text="Salvar Avaliação"
                  filename={`avaliacao-${new Date().toISOString().slice(0, 10)}.pdf`}
                  landscape={false}
                  selector="#analysis-page-content"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
