import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

export async function fetchDashboard() {
  const response = await BaseHttpClient.get(APIRoutes.DASHBOARD);
  return response;
}