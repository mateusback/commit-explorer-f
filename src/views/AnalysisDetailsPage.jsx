import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, TrendingUp, Code, Users } from 'lucide-react';

import { fetchAnalysisById } from '../services/analysisService';

import StatSummaryCard from '../components/ui/StatSummaryCard';
import CommitFrequencyChart from '../components/analysis/CommitFrequencyChart';
import HourlyDistributionChart from '../components/analysis/HourlyDistributionChart';
import TopFilesChart from '../components/analysis/TopFilesChart';
import CommitTypesChart from '../components/analysis/CommitTypesChart';
import CommitsTable from '../components/analysis/CommitsTable';
import EvaluationSection from '../components/analysis/EvaluationSection';
import AnalysisHeader from '../components/analysis/AnalysisHeader';
import AuthorTabs from '../components/ui/AuthorTabs';

async function fetchAnalysisDetails(analysisId) {
  return fetchAnalysisById(analysisId);
}

export default function AnalysisDetailsPage() {
  const { analysisId } = useParams();
  const [activeTab, setActiveTab] = useState('geral');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analysisDetails', analysisId],
    queryFn: () => fetchAnalysisDetails(analysisId),
  });

  const displayedData = useMemo(() => {
    if (!data) return null;
    if (activeTab === 'geral') return data.geral;
    return data.porAutor?.[activeTab] || null;
  }, [data, activeTab]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (error || !data) {
    return <div className="text-center text-red-500 p-8">
      Erro ao carregar a análise: {error?.message || 'Dados não encontrados.'}
    </div>;
  }

  const { pontuacaoTotal, totalCommits, quantidadeCodeSmells, complexidadeMedia, commits, charts } = displayedData || {};
  const chartsData = charts?.[0];

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho */}
        <div className="mb-8">
          <AnalysisHeader
            projectName={data.geral?.nomeProjeto || 'Projeto Não Identificado'}
            repoUrl={data.geral?.urlRepositorio || 'Url do Repositório'}
            branchName={data.geral?.branch || 'Branch Não Identificada'}
            startDate={data.geral?.dataInicio || 'Data de Início'}
            endDate={data.geral?.dataFim || 'Data de Fim'}
            projectId={data.geral?.idProjeto}
          />
        </div>

        {/* Tabs para seleção */}
        <AuthorTabs
          value={activeTab}
          onChange={setActiveTab}
          autores={data.autores}
          geralStats={{
            totalCommits: data.geral?.totalCommits,
            quantidadeCodeSmells: data.geral?.quantidadeCodeSmells,
            pontuacaoTotal: data.geral?.pontuacaoTotal,
          }}
        />

        {/* Conteúdo da aba */}
        {displayedData ? (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
              <StatSummaryCard title="Pontuação" value={pontuacaoTotal?.toFixed(1) ?? 'N/A'} icon={<Award />} color={pontuacaoTotal > 75 ? 'emerald' : 'amber'} />
              <StatSummaryCard title="Total de Commits" value={totalCommits ?? 0} icon={<TrendingUp />} color='sky' />
              <StatSummaryCard title="Code Smells" value={quantidadeCodeSmells ?? 0} icon={<Code />} color='amber' />
              <StatSummaryCard title="Complexidade Média" value={complexidadeMedia?.toFixed(1) ?? 0} icon={<Users />} color='violet' />
            </div>

            {/* Gráficos */}
            {chartsData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                <CommitFrequencyChart data={chartsData.frequenciaCommits} />
                <HourlyDistributionChart data={chartsData.distribuicaoHorarios} />
                <TopFilesChart data={chartsData.topArquivos} />
                <CommitTypesChart data={chartsData.tipoCommits} />
              </div>
            ) : (
              <p className="text-center text-stone-500">Não há dados de gráfico para esta seleção.</p>
            )}

            {/* Tabela de commits */}
            {commits ? (
              <CommitsTable commits={commits} />
            ) : (
              <p className="text-center text-stone-500">Não há commits para esta seleção.</p>
            )}

            {/* Avaliação só na aba geral */}
            {activeTab === 'geral' && (
              <EvaluationSection
                score={data.geral?.pontuacaoTotal}
                feedbackData={data?.feedback}
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