import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

export async function fetchProjects() {
  const response = await BaseHttpClient.get(APIRoutes.LIST_PROJECTS);
  return response?.projetos || response || [];
}

export async function fetchProjectAnalyses(idProjeto) {
  const response = await BaseHttpClient.get(`${APIRoutes.LIST_PROJECT_ANALYSIS}/${idProjeto}`);
  return response || null;
}

export async function deleteProjectById(id) {
  return BaseHttpClient.delete(APIRoutes.DELETE_PROJECT_BY_ID(id));
}