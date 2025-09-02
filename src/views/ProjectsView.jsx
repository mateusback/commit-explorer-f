import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../services/ProjectService';
import { Loader2, FolderGit2, Plus, SearchCode, GitBranch } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TimeConstants } from '../constants/TimeConstants';
import { Link, useNavigate } from 'react-router-dom';

export default function ProjectsView() {
  const navigate = useNavigate();
  
  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['projectsList'],
    queryFn: fetchProjects,
    staleTime: TimeConstants.TEN_MINUTES,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-stone-600">Carregando projetos...</span>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderGit2 className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Erro ao carregar projetos</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  if (!isLoading && (!projects || projects.length === 0)) {
    return (
      <div className="space-y-6">
        {/* Card principal de estado vazio */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FolderGit2 className="w-12 h-12 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-stone-800 mb-3">
              Ainda não há projetos
            </h2>
            
            <p className="text-stone-600 mb-8 leading-relaxed">
              Comece sua jornada de análise de código criando seu primeiro projeto. 
              Analise repositórios e obtenha insights valiosos sobre a qualidade do seu código.
            </p>

            <Link
              to="/analyze"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold px-6 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="text-lg">Realizar Primeira Análise</span>
            </Link>
          </div>
        </section>

        {/* Cards de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <SearchCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">Análise Detalhada</h3>
            <p className="text-stone-600 text-sm">
              Analise commits, detecte code smells e obtenha métricas de qualidade do código
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">Repositórios Git</h3>
            <p className="text-stone-600 text-sm">
              Conecte repositórios públicos ou privados do GitHub para análise completa
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <FolderGit2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">Gerenciamento</h3>
            <p className="text-stone-600 text-sm">
              Organize seus projetos e acompanhe o progresso da qualidade do código
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-stone-800 mb-2">Seus Projetos</h3>
          <p className="text-stone-600">Gerencie e monitore seus projetos analisados</p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div
            key={proj.idProjeto}
            className="group p-4 border-2 border-stone-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition-all duration-200"
            onClick={() => navigate(`/projects/${proj.idProjeto}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors">
                <FolderGit2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                  {proj.nome}
                </h4>
                <p className="text-sm text-stone-500">
                  Criado {formatDistanceToNow(new Date(proj.dataCriacao), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 text-emerald-600">
                  →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
