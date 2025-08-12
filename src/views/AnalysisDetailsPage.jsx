import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, GitMerge, Award, TrendingUp, Code, Users } from 'lucide-react';

import { fetchAnalysisById } from '../services/analysisService'; 

import StatSummaryCard from '../components/ui/StatSummaryCard';
import MetricCard from '../components/analysis/MetricCard';
import CommitFrequencyChart from '../components/analysis/CommitFrequencyChart';
import HourlyDistributionChart from '../components/analysis/HourlyDistributionChart';
import TopFilesChart from '../components/analysis/TopFilesChart';
import CommitTypesChart from '../components/analysis/CommitTypesChart';
import CommitsTable from '../components/analysis/CommitsTable';
import EvaluationSection from '../components/analysis/EvaluationSection';
import AnalysisHeader from '../components/analysis/AnalysisHeader';

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

    if (activeTab === 'geral') {
      return data.geral;
    }
    
    return data.porAutor?.[activeTab];

  }, [data, activeTab]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error || !data) {
    return <div className="text-center text-red-500 p-8">Erro ao carregar a análise: {error?.message || 'Dados não encontrados.'}</div>;
  }
  
  const {
    pontuacaoTotal,
    totalCommits,
    quantidadeCodeSmells,
    complexidadeMedia,
    commits,
    charts
  } = displayedData || {};

  const chartsData = charts?.[0]; 

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to={`/projeto/${data.geral.idProjeto || 1}`}
            className="btn btn-ghost mb-4"
          >
            <ArrowLeft size={16} /> Voltar para o Projeto
          </Link>

          <AnalysisHeader
            studentName={data.geral?.studentName || 'Nome do Aluno'}
            repoName={data.geral?.repoName || 'Nome do Repositório'}
            onUpdate={() => {
              // lógica de recarregar análise
              refetch(); // se estiver usando react-query
            }}
          />
        </div>

        <div className="tabs tabs-boxed bg-base-100 shadow-md mb-8">
          <a
            className={`tab tab-lg ${activeTab === 'geral' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('geral')}
          >
            Visão Geral
          </a>
          {data.autores.map(autor => (
            <a
              key={autor.idAutor}
              className={`tab tab-lg ${activeTab === autor.idAutor.toString() ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(autor.idAutor.toString())}
            >
              {autor.nome}
            </a>
          ))}
        </div>

        {displayedData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
              <StatSummaryCard title="Pontuação" value={pontuacaoTotal?.toFixed(1) ?? 'N/A'} icon={<Award />} color={pontuacaoTotal > 75 ? 'emerald' : 'amber'} />
              <StatSummaryCard title="Total de Commits" value={totalCommits ?? 0} icon={<TrendingUp />} color='sky' />
              <StatSummaryCard title="Code Smells" value={quantidadeCodeSmells ?? 0} icon={<Code />} color='amber'/>
              <StatSummaryCard title="Complexidade Média" value={complexidadeMedia?.toFixed(1) ?? 0} icon={<Users />} color='violet' />
            </div>

            {chartsData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                <CommitFrequencyChart data={chartsData.frequenciaCommits} />
                <HourlyDistributionChart data={chartsData.distribuicaoHorarios} />
                <TopFilesChart data={chartsData.topArquivos} />
                <CommitTypesChart data={chartsData.tipoCommits} />
              </div>
            ) : <p className="text-center text-stone-500">Não há dados de gráfico para esta seleção.</p>}
            
            {commits ? (
              <CommitsTable commits={commits} />
            ) : <p className="text-center text-stone-500">Não há commits para esta seleção.</p>}
            
            {activeTab === 'geral' && (
              <EvaluationSection score={data.geral.pontuacaoTotal} />
            )}
          </>
        ) : (
          <div className="text-center py-10">Carregando dados da aba...</div>
        )}

      </div>
    </div>
  );
}