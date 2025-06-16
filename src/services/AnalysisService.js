import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

export function analyzeRepositories(payload) {
  return BaseHttpClient.post(APIRoutes.ANALYZE_REPOSITORIES, payload);
}
