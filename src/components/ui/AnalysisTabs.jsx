import React from 'react';
import PropTypes from 'prop-types';
import { GitBranch, Calendar, TrendingUp, Code, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { extractRepoNameFromUrl } from '../../utils/RepoUtils';

function AnalysisTabs({ value, onChange, analises, showOverview = true }) {
  if (!analises || analises.length === 0) {
    return null;
  }

  const handleTabClick = (analysisId) => {
    onChange(analysisId);
  };

  return (
    <div className="mb-8">
      <div className="border-b border-stone-200">
        <nav className="flex space-x-8 overflow-x-auto pb-4">
          {showOverview && (
            <button
              onClick={() => handleTabClick('overview')}
              className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                value === 'overview'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-semibold">Visão Geral</div>
                  <div className="text-xs text-stone-500">Todas as análises</div>
                </div>
              </div>
            </button>
          )}

          {analises.map((analise) => {
            const repoName = extractRepoNameFromUrl(analise.urlRepositorio);
            const displayName = repoName || analise.nomeBranch || `Análise ${analise.id}`;
            
            return (
              <button
                key={analise.id}
                onClick={() => handleTabClick(String(analise.id))}
                className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  value === String(analise.id)
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-semibold">{displayName}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      {analise.nomeBranch && repoName && (
                        <>
                          <span>Branch: {analise.nomeBranch}</span>
                          {analise.dataInicio && analise.dataFim && <span>•</span>}
                        </>
                      )}
                      {analise.dataInicio && analise.dataFim && (
                        <>
                          <Calendar className="w-3 h-3" />
                          {format(new Date(analise.dataInicio), 'dd/MM', { locale: ptBR })} - {format(new Date(analise.dataFim), 'dd/MM', { locale: ptBR })}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-2 text-right">
                    <div className="text-xs text-stone-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {analise.totalCommits || 0}
                    </div>
                    <div className="text-xs text-stone-600 flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {analise.quantidadeCodeSmells || 0}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

AnalysisTabs.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  analises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nomeBranch: PropTypes.string,
      urlRepositorio: PropTypes.string,
      dataInicio: PropTypes.string,
      dataFim: PropTypes.string,
      totalCommits: PropTypes.number,
      quantidadeCodeSmells: PropTypes.number,
    })
  ).isRequired,
  showOverview: PropTypes.bool,
};

export default AnalysisTabs;