import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../services/ProjectService';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TimeConstants } from '../constants/TimeConstants';

export default function ProjectsView() {
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
      <section className="p-6 bg-white rounded-xl shadow">
        <p className="text-red-600 font-medium">Erro: {error.message}</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-emerald-600 mb-4">Gerenciar Projetos dos Alunos</h3>
      <p className="text-stone-600">Clique em um projeto para ver detalhes.</p>

      <div className="mt-4 space-y-3">
        {projects.map((proj) => (
          <div
            key={proj.idProjeto}
            className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
            onClick={() => window.location.href = `/projects/${proj.idProjeto}`}
          >
            <h4 className="font-medium text-emerald-700">
              {proj.nome}
            </h4>
            <p className="text-sm text-stone-500">
              Criado há {formatDistanceToNow(new Date(proj.dataCriacao), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
