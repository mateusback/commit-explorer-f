import React from 'react';

import {
    LayoutDashboard,
    SearchCode,
    FolderGit2,
    GitCommit,
    BarChart3,
    Lightbulb,
    Settings,
    LogOut,
    GitBranch
} from 'lucide-react';

const Sidebar = ({ currentView, setView }) => {
    const navItems = [
        { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard /> },
        { id: 'analyze', label: 'Analisar Repositório', icon: <SearchCode /> },
        { id: 'projects', label: 'Projetos', icon: <FolderGit2 /> },
        { id: 'commits', label: 'Todos os Commits', icon: <GitCommit /> },
        { id: 'metrics', label: 'Métricas Globais', icon: <BarChart3 /> },
        { id: 'suggestions', label: 'Sugestões Globais', icon: <Lightbulb /> },
    ];

    const handleLinkClick = (e, viewId) => {
        e.preventDefault();
        setView(viewId);
        window.location.hash = viewId;
    };

    return (
        <aside className="w-64 bg-white p-5 shadow-xl flex flex-col rounded-r-2xl z-10 print:hidden">
            <div className="flex items-center space-x-3 mb-10">
                <div className="p-2 bg-emerald-500 rounded-lg">
                    <GitBranch className="text-white w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-600">Commit Explorer</h1>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleLinkClick(e, item.id)}
                                className={`flex items-center space-x-3 px-4 py-3 text-stone-600 hover:bg-stone-100 hover:text-emerald-600 rounded-lg transition-colors duration-150 group ${currentView === item.id ? 'active-nav-link' : ''}`}
                            >
                                {React.cloneElement(item.icon, { className: `w-5 h-5 text-stone-500 group-hover:text-emerald-600 transition-colors duration-150 ${currentView === item.id ? 'text-emerald-600' : ''}` })}
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                <a href="#settings" onClick={(e) => handleLinkClick(e, 'settings')} className={`flex items-center space-x-3 px-4 py-3 text-stone-600 hover:bg-stone-100 hover:text-emerald-600 rounded-lg transition-colors duration-150 group ${currentView === 'settings' ? 'active-nav-link' : ''}`}>
                    <Settings className={`w-5 h-5 text-stone-500 group-hover:text-emerald-600 transition-colors duration-150 ${currentView === 'settings' ? 'text-emerald-600' : ''}`} />
                    <span>Configurações</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 mt-2 text-stone-600 hover:bg-stone-100 hover:text-red-500 rounded-lg transition-colors duration-150 group">
                    <LogOut className="w-5 h-5 text-stone-500 group-hover:text-red-500 transition-colors duration-150" />
                    <span>Sair</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;