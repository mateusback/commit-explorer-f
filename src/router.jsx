import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';

import DashboardView from './views/DashboardView';
import AnalyzeView from './views/AnalyzeView';
import ProjectsView from './views/ProjectsView';
import ProjectDetailsView from './views/ProjectDetailsView';
import CommitsView from './views/CommitsView';
import CommitDetailsView from './views/CommitDetailsView';
import MetricsView from './views/MetricsView';
import SuggestionsView from './views/SuggestionsView';
import SettingsView from './views/SettingsView';
import AnalysisDetailsPage from './views/AnalysisDetailsPage';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';

const withMeta = (title, subtitle) => ({ title, subtitle });

export const router = createBrowserRouter([
  {
    element: <AuthProvider><AuthLayout /></AuthProvider>,
    children: [
      { path: '/login', element: <LoginView /> },
      { path: '/register', element: <RegisterView /> },
    ],
  },
  {
    element: <AuthProvider><ProtectedRoute /></AuthProvider>,
    children: [
      {
        element: (
          <Suspense fallback={<div className="p-6">Carregando…</div>}>
            <AppLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: '/dashboard',
            element: <DashboardView />,
            handle: withMeta('Visão Geral dos Projetos', 'Insights agregados de todos os repositórios dos alunos.'),
          },
          {
            path: '/analyze',
            element: <AnalyzeView />,
            handle: withMeta('Analisar Repositórios GitHub', 'Envie uma URL de repositório para obter sua análise de qualidade e atividade.'),
          },
          {
            path: '/projects',
            element: <ProjectsView />,
            handle: withMeta('Gerenciar Projetos dos Alunos', 'Navegue e selecione projetos individuais para análise detalhada.'),
          },
          {
            path: '/projects/:idProjeto',
            element: <ProjectDetailsView />,
            handle: withMeta('Detalhes do Projeto', 'Métricas, atividades e recomendações por repositório.'),
          },
          {
            path: '/commits',
            element: <CommitsView />,
            handle: withMeta('Registro de Todos os Commits', 'Uma lista cronológica de todos os commits de todos os projetos.'),
          },
          {
            path: '/commits/:id',
            element: <CommitDetailsView />,
            handle: withMeta('Detalhes do Commit', 'Mudanças, arquivos afetados e sugestões específicas.'),
          },
          {
            path: '/metrics',
            element: <MetricsView />,
            handle: withMeta('Análise de Métricas Globais', 'Detalhamento das métricas agregadas de todos os projetos.'),
          },
          {
            path: '/suggestions',
            element: <SuggestionsView />,
            handle: withMeta('Feed de Sugestões Globais', 'Uma lista abrangente de todas as sugestões.'),
          },
          {
            path: '/settings',
            element: <SettingsView />,
            handle: withMeta('Configurações da Aplicação', 'Configure o Commit Explorer, integrações e preferências.'),
          },
          {
            path: '/analise/:analysisId',
            element: <AnalysisDetailsPage />,
            handle: withMeta('Detalhes da Análise', 'Resultados completos da análise solicitada.'),
          },
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
