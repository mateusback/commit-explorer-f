import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

const StatusService = {
  async fetchAnalysisStatus() {
    try {
      const response = await BaseHttpClient.get(APIRoutes.FETCH_REQUESTS);
      
      const solicitacoes = response?.solicitacoes || response || [];
      
      if (Array.isArray(solicitacoes)) {
        return solicitacoes.map(solicitacao => ({
          id: solicitacao.id || Math.random(),
          projectName: solicitacao.nomeProjeto,
          status: solicitacao.status,
          createdAt: solicitacao.dataSolicitacao,
          startDate: solicitacao.dataInicio,
          endDate: solicitacao.dataFim,
          repositoryUrl: solicitacao.repositorioUrl,
          branch: solicitacao.branch,
          projectUrl: solicitacao.projetoUrl,
          errorMessage: solicitacao.mensagemErro,
          repositories: [{
            url: solicitacao.repositorioUrl,
            branch: solicitacao.branch
          }],
          repositoryCount: 1
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar status das análises:', error);
      throw error;
    }
  },

  async retryAnalysis(analysisId) {
    try {
      const response = await BaseHttpClient.patch(APIRoutes.RETRY_ANALYSIS(analysisId));
      return response;
    } catch (error) {
      console.error('Erro ao reenviar análise:', error);
      throw error;
    }
  }
};  

export default StatusService;
