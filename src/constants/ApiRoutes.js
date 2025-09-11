const gitRoute = '/api/v1/git';
const projectsRoute = '/api/v1/projects';
const commitRoute = '/api/v1/commits';
const analysisRoute = '/api/v1/analysis';
const authRoute = '/auth';

const APIRoutes = {
  ANALYZE_REPOSITORIES: `${gitRoute}/analyze`,
  GET_ANALYSIS_BY_ID: (id) => `${analysisRoute}/${id}`,
  FETCH_REQUESTS: `${analysisRoute}/solicitacoes`,
  RETRY_ANALYSIS: (id) => `${analysisRoute}/${id}/reenviar`,
  LIST_PROJECTS: `${projectsRoute}/list`,
  LIST_PROJECT_ANALYSIS: `${projectsRoute}/analysis`,
  GET_COMMIT_BY_ID: (idCommit) => `${commitRoute}/${idCommit}`,
  AUTH_LOGIN: `${authRoute}/login`,
  AUTH_REGISTER: `${authRoute}/signup`,
};

export default APIRoutes;
