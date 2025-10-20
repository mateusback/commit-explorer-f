import React from 'react';
import PropTypes from 'prop-types';
import { Award, TrendingUp, Code, Users, GitBranch, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatSummaryCard from '../ui/StatSummaryCard';
import { extractRepoNameFromUrl } from '../../utils/RepoUtils';

function AnalysisOverview({ analises, projectName }) {
  if (!analises || analises.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-stone-500">Nenhuma análise encontrada para este projeto.</p>
      </div>
    );
  }

  // Extrair nome do repositório da primeira análise
  const repoUrl = analises[0]?.urlRepositorio;
  const repoName = extractRepoNameFromUrl(repoUrl);
  const displayName = repoName || projectName;

  // Calcular estatísticas agregadas
  const totalCommits = analises.reduce((sum, a) => sum + (a.totalCommits || 0), 0);
  const totalCodeSmells = analises.reduce((sum, a) => sum + (a.quantidadeCodeSmells || 0), 0);
  const totalAutores = analises.reduce((sum, a) => sum + (a.totalAutores || 0), 0);
  const pontuacaoMedia = analises.reduce((sum, a) => sum + (a.pontuacaoTotal || 0), 0) / analises.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-emerald-200 p-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">{displayName}</h2>
        {repoName && projectName && repoName !== projectName && (
          <p className="text-lg text-stone-600 mb-2">{projectName}</p>
        )}
        <p className="text-stone-600">Visão geral de todas as análises realizadas neste projeto</p>
      </div>

      {/* Cards de estatísticas agregadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatSummaryCard 
          title="Pontuação Média" 
          value={pontuacaoMedia.toFixed(1)} 
          icon={<Award />} 
          color={pontuacaoMedia > 75 ? 'emerald' : pontuacaoMedia > 50 ? 'amber' : 'red'} 
        />
        <StatSummaryCard 
          title="Total de Commits" 
          value={totalCommits} 
          icon={<TrendingUp />} 
          color="sky" 
        />
        <StatSummaryCard 
          title="Code Smells" 
          value={totalCodeSmells} 
          icon={<Code />} 
          color="amber" 
        />
        <StatSummaryCard 
          title="Total Autores" 
          value={totalAutores} 
          icon={<Users />} 
          color="violet" 
        />
      </div>

      {/* Lista de análises */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-stone-800 mb-4">Histórico de Análises</h3>
        <div className="grid gap-4">
          {analises.map((analise) => (
            <div key={analise.id} className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-lg font-semibold text-stone-800">{analise.nomeBranch}</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Calendar className="w-4 h-4" />
                  {analise.dataInicio && analise.dataFim && (
                    <span>
                      {format(new Date(analise.dataInicio), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(analise.dataFim), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{analise.pontuacaoTotal?.toFixed(1) || 'N/A'}</div>
                  <div className="text-sm text-stone-500">Pontuação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-600">{analise.totalCommits || 0}</div>
                  <div className="text-sm text-stone-500">Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{analise.quantidadeCodeSmells || 0}</div>
                  <div className="text-sm text-stone-500">Code Smells</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">{analise.totalAutores || 0}</div>
                  <div className="text-sm text-stone-500">Autores</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

AnalysisOverview.propTypes = {
  analises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nomeBranch: PropTypes.string,
      pontuacaoTotal: PropTypes.number,
      totalCommits: PropTypes.number,
      quantidadeCodeSmells: PropTypes.number,
      totalAutores: PropTypes.number,
      dataInicio: PropTypes.string,
      dataFim: PropTypes.string,
    })
  ).isRequired,
  projectName: PropTypes.string,
};

export default AnalysisOverview;