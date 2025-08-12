const gitRoute = '/api/v1/git';
const projectsRoute = '/api/v1/projects';
const commitRoute = '/api/v1/commits';
const analysisRoute = '/api/v1/analysis';

const APIRoutes = {
  ANALYZE_REPOSITORIES: `${gitRoute}/analyze`,
  LIST_PROJECTS: `${projectsRoute}/list`,
  LIST_PROJECT_ANALYSIS: `${projectsRoute}/analysis`,
  GET_COMMIT_BY_ID: (idCommit) => `${commitRoute}/${idCommit}`,
  GET_ANALYSIS_BY_ID: (idAnalysis) => `${analysisRoute}/${idAnalysis}`,
};

export default APIRoutes;
