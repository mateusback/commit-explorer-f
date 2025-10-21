import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalysisById } from '../services/AnalysisService';

function AnalysisRedirect() {
  const { analysisId } = useParams();
  const navigate = useNavigate();

  const { data: analysisData, isLoading, error } = useQuery({
    queryKey: ['analysisDetails', analysisId],
    queryFn: () => fetchAnalysisById(analysisId),
  });

  useEffect(() => {
    if (analysisData && analysisData.geral) {
      // Tentar diferentes formas de obter o project ID
      let projectId = analysisData.geral.idProjeto || 
                     analysisData.geral.projectId || 
                     analysisData.projectId ||
                     analysisData.idProjeto;
      
      if (projectId) {
        navigate(`/projeto/${projectId}/analises?analise=${analysisId}`, { replace: true });
      } else {
        // Fallback: buscar pela URL do repositório se existir
        console.warn('Projeto ID não encontrado diretamente, tentando fallback...');
        // Você pode implementar uma busca por repositório URL se necessário
        console.error('Projeto não encontrado para a análise:', analysisId);
      }
    }
  }, [analysisData, analysisId, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Carregando análise...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Erro ao carregar a análise: {error?.message || 'Dados não encontrados.'}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
      <span className="ml-2">Redirecionando...</span>
    </div>
  );
}

export default AnalysisRedirect;