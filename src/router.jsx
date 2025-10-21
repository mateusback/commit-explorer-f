import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';

import DashboardView from './views/DashboardView';
import AnalyzeView from './views/AnalyzeView';
import StatusView from './views/StatusView';
import ProjectsView from './views/ProjectsView';
import ProjectDetailsView from './views/ProjectDetailsView';
import CommitDetailsView from './views/CommitDetailsView';
import MetricsView from './views/MetricsView';
import SettingsView from './views/SettingsView';
import AnalysisDetailsPage from './views/AnalysisDetailsPage';
import AnalysisRedirect from './components/AnalysisRedirect';
import ProfessorMenuView from './views/ProfessorMenuView';
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
            path: '/status',
            element: <StatusView />,
            handle: withMeta('Status das Análises', 'Monitore o progresso das suas análises em tempo real.'),
          },
          {
            path: '/projects',
            element: <ProjectsView />,
            handle: withMeta('Gerenciar Projetos', 'Navegue e selecione projetos individuais para análise detalhada.'),
          },
          {
            path: '/projects/:idProjeto',
            element: <ProjectDetailsView />,
            handle: withMeta('Detalhes do Projeto', 'Métricas, atividades e recomendações por repositório.'),
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
            path: '/settings',
            element: <SettingsView />,
            handle: withMeta('Configurações da Aplicação', 'Configure o Commit Explorer, integrações e preferências.'),
          },
          {
            path: '/professor',
            element: (
              <RoleProtectedRoute requiredRole="professor">
                <ProfessorMenuView />
              </RoleProtectedRoute>
            ),
            handle: withMeta('Menu do Professor', 'Promova usuários para professores.'),
          },
          {
            path: '/analise/:analysisId',
            element: <AnalysisRedirect />,
            handle: withMeta('Carregando Análise', 'Redirecionando para visualização completa.'),
          },
          {
            path: '/projeto/:idProjeto/analises',
            element: <AnalysisDetailsPage />,
            handle: withMeta('Análises do Projeto', 'Visualização completa de todas as análises do projeto.'),
          },
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
