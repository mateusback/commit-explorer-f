import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, TrendingUp, Code, Users, Mail, User, GitBranch } from 'lucide-react';
import { fetchAnalysisById } from '../services/AnalysisService';
import { fetchProjectAnalyses } from '../services/ProjectService';
import StatSummaryCard from '../components/ui/StatSummaryCard';
import CommitFrequencyChart from '../components/analysis/CommitFrequencyChart';
import HourlyDistributionChart from '../components/analysis/HourlyDistributionChart';
import TopFilesChart from '../components/analysis/TopFilesChart';
import CommitTypesChart from '../components/analysis/CommitTypesChart';
import CommitsTable from '../components/analysis/CommitsTable';
import EvaluationSection from '../components/analysis/EvaluationSection';
import AnalysisHeader from '../components/analysis/AnalysisHeader';
import AuthorTabs from '../components/ui/AuthorTabs';
import AnalysisTabs from '../components/ui/AnalysisTabs';
import AnalysisOverview from '../components/analysis/AnalysisOverview';
import UserAvatar from '../components/UserAvatar';

async function fetchAnalysisDetails(analysisId) {
  return fetchAnalysisById(analysisId);
}

async function fetchProjectAnalysesData(projectId) {
  return fetchProjectAnalyses(projectId);
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
  const { analysisId, idProjeto } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAnalysisId = searchParams.get('analise');
  
  const [activeAnalysisTab, setActiveAnalysisTab] = useState(initialAnalysisId || 'overview');
  const [activeAuthorTab, setActiveAuthorTab] = useState('geral');

  // Se temos um analysisId, buscar análise específica (modo antigo)
  // Se temos um idProjeto, buscar todas as análises do projeto (modo novo)
  const { data: singleAnalysisData, isLoading: isLoadingSingle, error: errorSingle } = useQuery({
    queryKey: ['analysisDetails', analysisId],
    queryFn: () => fetchAnalysisDetails(analysisId),
    enabled: !!analysisId,
  });

  const { data: projectData, isLoading: isLoadingProject, error: errorProject } = useQuery({
    queryKey: ['projectAnalyses', idProjeto],
    queryFn: () => fetchProjectAnalysesData(idProjeto),
    enabled: !!idProjeto,
  });

  // Determinar qual dados usar e modo de operação
  const isProjectMode = !!idProjeto;
  const isLoading = isProjectMode ? isLoadingProject : isLoadingSingle;
  const error = isProjectMode ? errorProject : errorSingle;

  // Dados das análises disponíveis
  const availableAnalyses = useMemo(() => {
    if (isProjectMode && projectData) {
      return projectData.analises || [];
    }
    return [];
  }, [isProjectMode, projectData]);

  // Função para alterar análise e atualizar URL
  const handleAnalysisChange = (analysisId) => {
    setActiveAnalysisTab(analysisId);
    if (analysisId === 'overview') {
      // Remover parâmetro de análise da URL
      searchParams.delete('analise');
      setSearchParams(searchParams, { replace: true });
    } else {
      // Adicionar/atualizar parâmetro de análise na URL
      searchParams.set('analise', analysisId);
      setSearchParams(searchParams, { replace: true });
    }
    // Reset author tab when switching analysis
    setActiveAuthorTab('geral');
  };

  // Dados da análise atualmente selecionada
  const currentAnalysisId = useMemo(() => {
    if (!isProjectMode) return analysisId;
    if (activeAnalysisTab === 'overview') return null;
    return activeAnalysisTab;
  }, [isProjectMode, analysisId, activeAnalysisTab]);

  // Buscar dados detalhados da análise selecionada (só quando necessário)
  const { data: currentAnalysisData, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['analysisDetails', currentAnalysisId],
    queryFn: () => fetchAnalysisDetails(currentAnalysisId),
    enabled: !!currentAnalysisId,
  });

  // Dados finais para exibição
  const analysisData = useMemo(() => {
    if (isProjectMode) {
      return currentAnalysisData || null;
    }
    return singleAnalysisData || null;
  }, [isProjectMode, currentAnalysisData, singleAnalysisData]);

  const displayedData = useMemo(() => {
    if (!analysisData) return null;
    if (activeAuthorTab === 'geral') return analysisData.geral;
    
    const autorData = analysisData.autores?.find(autor => String(autor.idAutor) === activeAuthorTab);
    return autorData || null;
  }, [analysisData, activeAuthorTab]);

  if (isLoading || (isProjectMode && isLoadingCurrent && activeAnalysisTab !== 'overview')) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">
      Erro ao carregar os dados: {error?.message || 'Dados não encontrados.'}
    </div>;
  }

  // Se estamos no modo projeto mas não temos análises
  if (isProjectMode && (!availableAnalyses || availableAnalyses.length === 0)) {
    return <div className="text-center text-stone-500 p-8">
      Nenhuma análise encontrada para este projeto.
    </div>;
  }

  // Se estamos no modo análise única mas não temos dados
  if (!isProjectMode && !analysisData) {
    return <div className="text-center text-red-500 p-8">
      Análise não encontrada.
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

  const projectName = isProjectMode 
    ? (projectData?.analises?.[0]?.nomeProjeto || 'Projeto')
    : (analysisData?.geral?.nomeProjeto || 'Projeto Não Identificado');

  const repoUrl = isProjectMode
    ? (projectData?.analises?.[0]?.urlRepositorio)
    : (analysisData?.geral?.urlRepositorio);

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho - só mostrar quando temos dados específicos */}
        {analysisData && (
          <div className="mb-8">
            <AnalysisHeader
              projectName={analysisData.geral?.nomeProjeto || projectName}
              repoUrl={analysisData.geral?.urlRepositorio || 'Url do Repositório'}
              branchName={analysisData.geral?.branch || 'Branch Não Identificada'}
              startDate={analysisData.geral?.dataInicio || 'Data de Início'}
              endDate={analysisData.geral?.dataFim || 'Data de Fim'}
              projectId={analysisData.geral?.idProjeto}
            />
          </div>
        )}

        {/* Tabs de análises (só no modo projeto) */}
        {isProjectMode && (
          <AnalysisTabs
            value={activeAnalysisTab}
            onChange={handleAnalysisChange}
            analises={availableAnalyses}
            showOverview={true}
          />
        )}

        {/* Conteúdo baseado na seleção */}
        {isProjectMode && activeAnalysisTab === 'overview' ? (
          <AnalysisOverview 
            analises={availableAnalyses.map(analise => ({
              ...analise,
              urlRepositorio: repoUrl || analise.urlRepositorio
            }))} 
            projectName={projectName} 
          />
        ) : (
          <>
            {/* Tabs de autores (só quando temos dados de análise específica) */}
            {analysisData && (
              <AuthorTabs
                value={activeAuthorTab}
                onChange={setActiveAuthorTab}
                autores={analysisData.autores}
                geral={{
                  totalCommits: analysisData.geral?.totalCommits,
                  quantidadeCodeSmells: analysisData.geral?.quantidadeCodeSmells,
                  pontuacaoTotal: analysisData.geral?.pontuacaoTotal,
                }}
              />
            )}

            {/* Conteúdo da aba de autor */}
            {displayedData ? (
              <>
                {/* Card com informações do autor (apenas quando não for aba geral) */}
                {activeAuthorTab !== 'geral' && analysisData && (
                  <AuthorInfoCard 
                    author={analysisData.autores?.find(autor => String(autor.idAutor) === activeAuthorTab)} 
                  />
                )}

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
                  <StatSummaryCard title="Pontuação" value={displayedData.pontuacaoTotal?.toFixed(1) ?? 'N/A'} icon={<Award />} color={displayedData.pontuacaoTotal > 75 ? 'emerald' : 'amber'} />
                  <StatSummaryCard title="Total de Commits" value={displayedData.totalCommits ?? 0} icon={<TrendingUp />} color='sky' />
                  <StatSummaryCard title="Code Smells" value={displayedData.quantidadeCodeSmells ?? 0} icon={<Code />} color='amber' />
                  <StatSummaryCard title="Complexidade Média" value={displayedData.complexidadeMedia?.toFixed(1) ?? 0} icon={<Users />} color='violet' />
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                  <CommitFrequencyChart data={displayedData.charts?.frequenciaCommits} />
                  <HourlyDistributionChart data={displayedData.charts?.distribuicaoHorarios} />
                  <TopFilesChart data={displayedData.charts?.topArquivos} />
                  <CommitTypesChart data={displayedData.charts?.tipoCommits} />
                </div>

                {/* Tabela de commits */}
                {displayedData.commits ? (
                  <CommitsTable commits={displayedData.commits} />
                ) : (
                  <p className="text-center text-stone-500">Não há commits para esta seleção.</p>
                )}

                {/* Avaliação */}
                {(activeAuthorTab === 'geral' && analysisData?.feedback) && (
                  <EvaluationSection
                    score={analysisData.geral?.pontuacaoTotal}
                    feedbackData={analysisData.feedback}
                  />
                )}
                {(activeAuthorTab !== 'geral' && displayedData?.feedback) && (
                  <EvaluationSection
                    score={displayedData?.pontuacaoGeral || displayedData.pontuacaoTotal}
                    feedbackData={displayedData.feedback}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-10">
                {isProjectMode && activeAnalysisTab !== 'overview' ? 'Carregando análise selecionada...' : 'Selecione uma análise para visualizar os detalhes.'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}