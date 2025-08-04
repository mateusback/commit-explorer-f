import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

import DashboardView from './views/DashboardView';
import AnalyzeView from './views/AnalyzeView';
import ProjectsView from './views/ProjectsView';
import CommitsView from './views/CommitsView';
import MetricsView from './views/MetricsView';
import SuggestionsView from './views/SuggestionsView';
import SettingsView from './views/SettingsView';

const pageInfo = {
    '/dashboard': {
        title: 'Visão Geral dos Projetos',
        subtitle: 'Insights agregados de todos os repositórios dos alunos.',
    },
    '/analyze': {
        title: 'Analisar Repositórios GitHub',
        subtitle: 'Envie uma URL de repositório para obter sua análise de qualidade e atividade.',
    },
    '/projects': {
        title: 'Gerenciar Projetos dos Alunos',
        subtitle: 'Navegue e selecione projetos individuais para análise detalhada.',
    },
    '/commits': {
        title: 'Registro de Todos os Commits',
        subtitle: 'Uma lista cronológica de todos os commits de todos os projetos.',
    },
    '/metrics': {
        title: 'Análise de Métricas Globais',
        subtitle: 'Detalhamento das métricas agregadas de todos os projetos.',
    },
    '/suggestions': {
        title: 'Feed de Sugestões Globais',
        subtitle: 'Uma lista abrangente de todas as sugestões.',
    },
    '/settings': {
        title: 'Configurações da Aplicação',
        subtitle: 'Configure o Commit Explorer, integrações e preferências.',
    },
};

export default function App() {
    const location = useLocation();
    const info = pageInfo[location.pathname] || pageInfo['/dashboard'];

    return (
        <div className="flex h-screen overflow-hidden bg-stone-50 text-stone-700">
            <Sidebar currentPath={location.pathname} />
            <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto bg-stone-50">
                <Header title={info.title} subtitle={info.subtitle} />
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<DashboardView />} />
                    <Route path="/analyze" element={<AnalyzeView />} />
                    <Route path="/projects" element={<ProjectsView />} />
                    <Route path="/commits" element={<CommitsView />} />
                    <Route path="/metrics" element={<MetricsView />} />
                    <Route path="/suggestions" element={<SuggestionsView />} />
                    <Route path="/settings" element={<SettingsView />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
                <footer className="mt-8 text-center text-sm text-stone-400 print:hidden">
                    Commit Explorer &copy; 2024
                </footer>
            </main>
        </div>
    );
}
