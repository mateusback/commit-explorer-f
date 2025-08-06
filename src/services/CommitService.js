import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

export async function fetchCommitDetails(idCommit) {
  const response = await BaseHttpClient.get(APIRoutes.GET_COMMIT_BY_ID(idCommit));
  return response;
}