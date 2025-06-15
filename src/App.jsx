import React, { useState, useEffect } from 'react';

import './App.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

import DashboardView from './views/DashboardView';
import AnalyzeView from './views/AnalyzeView';
import ProjectsView from './views/ProjectsView';
import CommitsView from './views/CommitsView';
import MetricsView from './views/MetricsView';
import SuggestionsView from './views/SuggestionsView';
import SettingsView from './views/SettingsView';

export default function App() {
    const [view, setView] = useState('dashboard');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                setView(hash);
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const pageInfo = {
        'dashboard': { title: 'Visão Geral dos Projetos', subtitle: 'Insights agregados de todos os repositórios dos alunos.' },
        'analyze': { title: 'Analisar Repositórios GitHub', subtitle: 'Envie uma URL de repositório para obter sua análise de qualidade e atividade.' },
        'projects': { title: 'Gerenciar Projetos dos Alunos', subtitle: 'Navegue e selecione projetos individuais para análise detalhada.' },
        'commits': { title: 'Registro de Todos os Commits', subtitle: 'Uma lista cronológica de todos os commits de todos os projetos.' },
        'metrics': { title: 'Análise de Métricas Globais', subtitle: 'Detalhamento das métricas agregadas de todos os projetos.' },
        'suggestions': { title: 'Feed de Sugestões Globais', subtitle: 'Uma lista abrangente de todas as sugestões.' },
        'settings': { title: 'Configurações da Aplicação', subtitle: 'Configure o Commit Explorer, integrações e preferências.' }
    };

    const currentInfo = pageInfo[view] || pageInfo.dashboard;

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <DashboardView />;
            case 'analyze':
                return <AnalyzeView />;
            case 'projects':
                return <ProjectsView />;
            case 'commits':
                return <CommitsView />;
            case 'metrics':
                return <MetricsView />;
            case 'suggestions':
                return <SuggestionsView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-stone-50 text-stone-700">
            <Sidebar currentView={view} setView={setView} />
            <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto bg-stone-50">
                <Header title={currentInfo.title} subtitle={currentInfo.subtitle} />
                {renderView()}
                <footer className="mt-8 text-center text-sm text-stone-400 print:hidden">
                    Commit Explorer &copy; 2024
                </footer>
            </main>
        </div>
    );
}
