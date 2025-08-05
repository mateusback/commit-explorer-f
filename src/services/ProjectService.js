import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

export async function fetchProjects() {
  console.log('[API] fetchProjects called');
  const response = await BaseHttpClient.get(APIRoutes.LIST_PROJECTS);
  console.log('[API] fetchProjects', response);
  return response.projetos || [];
}