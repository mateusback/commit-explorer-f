const gitRoute = '/api/v1/git';
const projectsRoute = '/api/v1/projects';

const APIRoutes = {
  ANALYZE_REPOSITORIES: `${gitRoute}/analyze`,
  LIST_PROJECTS: `${projectsRoute}/list`,
  LIST_PROJECT_ANALYSIS: `${projectsRoute}/analysis`,
};

export default APIRoutes;
