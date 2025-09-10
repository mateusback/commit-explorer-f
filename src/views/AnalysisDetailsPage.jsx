import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, TrendingUp, Code, Users, Mail, User, GitBranch } from 'lucide-react';
import { fetchAnalysisById } from '../services/AnalysisService';
import StatSummaryCard from '../components/ui/StatSummaryCard';
import CommitFrequencyChart from '../components/analysis/CommitFrequencyChart';
import HourlyDistributionChart from '../components/analysis/HourlyDistributionChart';
import TopFilesChart from '../components/analysis/TopFilesChart';
import CommitTypesChart from '../components/analysis/CommitTypesChart';
import CommitsTable from '../components/analysis/CommitsTable';
import EvaluationSection from '../components/analysis/EvaluationSection';
import AnalysisHeader from '../components/analysis/AnalysisHeader';
import AuthorTabs from '../components/ui/AuthorTabs';
import UserAvatar from '../components/UserAvatar';

async function fetchAnalysisDetails(analysisId) {
  return fetchAnalysisById(analysisId);
}

function AuthorInfoCard({ author }) {
  if (!author) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-emerald-200 p-6 mb-6">
      <div className="flex items-center gap-4">
        <UserAvatar autor={author} className="w-16 h-16" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xl font-bold text-stone-800">{author.nome}</h3>
          </div>
          {author.email && (
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-stone-500" />
              <span className="text-stone-600">{author.email}</span>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              <span><strong>{author.totalCommits || 0}</strong> commits</span>
            </div>
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span><strong>{author.quantidadeCodeSmells || 0}</strong> code smells</span>
            </div>
            {author.pontuacaoGeral && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span><strong>{author.pontuacaoGeral.toFixed(1)}</strong> pontos</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

AuthorInfoCard.propTypes = {
  author: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string,
    totalCommits: PropTypes.number,
    quantidadeCodeSmells: PropTypes.number,
    pontuacaoGeral: PropTypes.number,
  }),
};

export default function AnalysisDetailsPage() {
  const { analysisId } = useParams();
  const [activeTab, setActiveTab] = useState('geral');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analysisDetails', analysisId],
    queryFn: () => fetchAnalysisDetails(analysisId),
  });

    const analysisData = data || null;
    const displayedData = useMemo(() => {
      if (!analysisData) return null;
      if (activeTab === 'geral') return analysisData.geral;
      
      const autorData = analysisData.autores?.find(autor => String(autor.idAutor) === activeTab);
      return autorData || null;
    }, [analysisData, activeTab]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

    if (error || !analysisData) {
      return <div className="text-center text-red-500 p-8">
        Erro ao carregar a análise: {error?.message || 'Dados não encontrados.'}
      </div>;
    }

    const { 
      feedback,
      pontuacaoTotal = feedback?.pontuacaoGeral, 
      totalCommits, 
      quantidadeCodeSmells, 
      complexidadeMedia, 
      commits, 
      charts 
    } = displayedData || {};

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho */}
        <div className="mb-8">
            <AnalysisHeader
              projectName={analysisData.geral?.nomeProjeto || 'Projeto Não Identificado'}
              repoUrl={analysisData.geral?.urlRepositorio || 'Url do Repositório'}
              branchName={analysisData.geral?.branch || 'Branch Não Identificada'}
              startDate={analysisData.geral?.dataInicio || 'Data de Início'}
              endDate={analysisData.geral?.dataFim || 'Data de Fim'}
              projectId={analysisData.geral?.idProjeto}
            />
        </div>

        {/* Tabs para seleção */}
          <AuthorTabs
            value={activeTab}
            onChange={setActiveTab}
            autores={analysisData.autores}
            geral={{
              totalCommits: analysisData.geral?.totalCommits,
              quantidadeCodeSmells: analysisData.geral?.quantidadeCodeSmells,
              pontuacaoTotal: analysisData.geral?.pontuacaoTotal,
            }}
          />

        {/* Conteúdo da aba */}
        {displayedData ? (
          <>
            {/* Card com informações do autor (apenas quando não for aba geral) */}
            {activeTab !== 'geral' && (
              <AuthorInfoCard 
                author={analysisData.autores?.find(autor => String(autor.idAutor) === activeTab)} 
              />
            )}

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
              <StatSummaryCard title="Pontuação" value={pontuacaoTotal?.toFixed(1) ?? 'N/A'} icon={<Award />} color={pontuacaoTotal > 75 ? 'emerald' : 'amber'} />
              <StatSummaryCard title="Total de Commits" value={totalCommits ?? 0} icon={<TrendingUp />} color='sky' />
              <StatSummaryCard title="Code Smells" value={quantidadeCodeSmells ?? 0} icon={<Code />} color='amber' />
              <StatSummaryCard title="Complexidade Média" value={complexidadeMedia?.toFixed(1) ?? 0} icon={<Users />} color='violet' />
            </div>

            {/* Gráficos - agora direto dos objetos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
              <CommitFrequencyChart data={charts?.frequenciaCommits} />
              <HourlyDistributionChart data={charts?.distribuicaoHorarios} />
              <TopFilesChart data={charts?.topArquivos} />
              <CommitTypesChart data={charts?.tipoCommits} />
            </div>

            {/* Tabela de commits */}
            {commits ? (
              <CommitsTable commits={commits} />
            ) : (
              <p className="text-center text-stone-500">Não há commits para esta seleção.</p>
            )}

            {/* Avaliação: mostra na aba geral e para cada autor se houver feedback */}
            {(activeTab === 'geral' && analysisData?.feedback) && (
              <EvaluationSection
                score={analysisData.geral?.pontuacaoTotal}
                feedbackData={analysisData.feedback}
              />
            )}
            {(activeTab !== 'geral' && displayedData?.feedback) && (
              <EvaluationSection
                score={displayedData?.pontuacaoGeral || pontuacaoTotal}
                feedbackData={displayedData.feedback}
              />
            )}
          </>
        ) : (
          <div className="text-center py-10">Carregando dados da aba...</div>
        )}
      </div>
    </div>
  );
}