import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderGit2, GitBranch, Users, Award, AlertCircle, Loader2 } from 'lucide-react';
import { fetchDashboard } from '../services/DashboardService';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import StatusChart from '../components/dashboard/StatusChart';
import RecentAnalysesTable from '../components/dashboard/RecentAnalysesTable';
import TopProjectsList from '../components/dashboard/TopProjectsList';
import ProfessorOverview from '../components/dashboard/ProfessorOverview';
import { useAuth } from '../components/auth/AuthContext';

export default function DashboardView() {
    const { hasRole } = useAuth();
    const isProfessor = hasRole('professor');

    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboard,
        refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
        staleTime: 2 * 60 * 1000, // Considera dados "fresh" por 2 minutos
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-stone-600 font-medium">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Erro ao carregar dashboard</h3>
                    <p className="text-stone-600">{error.message || 'Não foi possível carregar os dados'}</p>
                </div>
            </div>
        );
    }

    const {
        estatisticas,
        analisesRecentes,
        topProjetos,
        atividadeTendencia,
        visaoGeralAlunos,
    } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Dashboard</h2>
        <p className="text-stone-600">Visão geral das suas análises e métricas de qualidade</p>
      </div>

      {/* Estatísticas Principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          icon={<FolderGit2 className="w-6 h-6" />}
          title="Total de Projetos"
          value={estatisticas.totalProjetos}
          subtitle="projetos analisados"
          color="emerald"
        />
        <DashboardStatCard
          icon={<GitBranch className="w-6 h-6" />}
          title="Total de Commits"
          value={estatisticas.totalCommits.toLocaleString('pt-BR')}
          subtitle="commits processados"
          color="blue"
        />
        <DashboardStatCard
          icon={<Users className="w-6 h-6" />}
          title="Total de Autores"
          value={estatisticas.totalAutores}
          subtitle="desenvolvedores únicos"
          color="purple"
        />
        <DashboardStatCard
          icon={<Award className="w-6 h-6" />}
          title="Score Médio"
          value={estatisticas.pontuacaoMedia.toFixed(1)}
          subtitle="qualidade geral"
          color="amber"
        />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart
            dates={atividadeTendencia.datas}
            commits={atividadeTendencia.commits}
            analyses={atividadeTendencia.analises}
          />
        </div>
        <div>
          <StatusChart
            completed={estatisticas.analisesCompletas}
            inProgress={estatisticas.analisesEmAndamento}
            failed={estatisticas.analisesFalhadas}
          />
        </div>
      </section>

      {/* Tabela de Análises Recentes */}
      <section>
        <RecentAnalysesTable analyses={analisesRecentes} />
      </section>

      {/* Top Projetos e Visão de Alunos (se professor) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProjectsList projects={topProjetos} />
        {isProfessor && visaoGeralAlunos && (
          <ProfessorOverview studentsData={visaoGeralAlunos} />
        )}
      </section>
    </div>
  );
}