import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  LayoutDashboard,
  SearchCode,
  FolderGit2,
  GitCommit,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  GitBranch,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: <LayoutDashboard /> },
    { path: '/analyze', label: 'Analisar Repositório', icon: <SearchCode /> },
    { path: '/projects', label: 'Projetos', icon: <FolderGit2 /> },
    { path: '/commits', label: 'Todos os Commits', icon: <GitCommit /> },
    { path: '/metrics', label: 'Métricas Globais', icon: <BarChart3 /> },
    { path: '/suggestions', label: 'Sugestões Globais', icon: <Lightbulb /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? <X className="w-6 h-6 text-emerald-600" /> : <Menu className="w-6 h-6 text-emerald-600" />}
      </button>

      <aside
        id='sidebar'
        className={`
          fixed top-0 left-0 h-full z-40 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          w-64 p-5 flex flex-col rounded-r-2xl print:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:flex md:w-80
        `}
      >
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <GitBranch className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-600">Commit Explorer</h1>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 text-stone-600 hover:bg-stone-100 hover:text-emerald-600 rounded-lg transition-colors duration-150 group ${
                      isActive ? 'bg-stone-100 text-emerald-600 font-semibold' : ''
                    }`
                  }
                >
                  {React.cloneElement(item.icon, {
                    className: `w-5 h-5 text-stone-500 group-hover:text-emerald-600 transition-colors duration-150 ${
                      isActive(item.path) ? 'text-emerald-600' : ''
                    }`,
                  })}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 text-stone-600 hover:bg-stone-100 hover:text-emerald-600 rounded-lg transition-colors duration-150 group ${
                isActive ? 'bg-stone-100 text-emerald-600 font-semibold' : ''
              }`
            }
          >
            <Settings className={`w-5 h-5 text-stone-500 group-hover:text-emerald-600`} />
            <span>Configurações</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center space-x-3 px-4 py-3 mt-2 text-stone-600 hover:bg-stone-100 hover:text-red-500 rounded-lg transition-colors duration-150 group"
          >
            <LogOut className="w-5 h-5 text-stone-500 group-hover:text-red-500 transition-colors duration-150" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
