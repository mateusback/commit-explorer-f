import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

export function analyzeRepositories(payload) {
  const githubToken = localStorage.getItem('github_token');
  const enhancedPayload = {
    ...payload,
    ...(githubToken && { githubToken })
  };

  return BaseHttpClient.post(APIRoutes.ANALYZE_REPOSITORIES, enhancedPayload);
}