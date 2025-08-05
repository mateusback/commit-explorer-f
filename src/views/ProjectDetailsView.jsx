import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectAnalyses } from '../services/ProjectService';
import {
  Loader2,
  TrendingUp,
  ShieldAlert,
  Puzzle,
  Award,
  Users,
  GitMerge,
  GitCommit,
  Siren,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SummaryCard from '../components/ui/SummaryCard';

function ScoreGauge({ score }) {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const colorClass = getScoreColor(score);

  return (
    <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-stone-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={colorClass}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className={`absolute text-3xl font-bold ${colorClass}`}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function StatItem({ icon, label, value, valueClassName = '' }) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
            <div className="flex-shrink-0 text-emerald-600">{icon}</div>
            <div>
                <p className="text-sm text-stone-500">{label}</p>
                <p className={`text-lg font-semibold text-stone-800 ${valueClassName}`}>{value}</p>
            </div>
        </div>
    )
}

export default function ProjectDetailsView() {
  const { idProjeto } = useParams();

  const {
    data: resumo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['projectAnalyses', idProjeto],
    queryFn: () => fetchProjectAnalyses(idProjeto),
  });

  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-stone-600">Carregando análises...</span>
      </section>
    );
  }

  if (isError || !resumo) {
    return (
      <section className="p-6 bg-white rounded-xl shadow">
        <p className="text-red-600 font-medium">
          Erro: {error?.message || 'Erro ao carregar os dados do projeto.'}
        </p>
      </section>
    );
  }

  const {
    totalCommits = 0,
    totalCodeSmells = 0,
    pontuacaoMedia = 0,
    analises = [],
    totalAutores = 0,
    branchsAnalizadas = [],
  } = resumo;
  
  const complexidadeMediaGeral = analises.length > 0
    ? analises.reduce((acc, curr) => acc + curr.complexidadeMedia, 0) / analises.length
    : 0;


  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-stone-700 mb-4">Resumo do Projeto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <SummaryCard
                icon={<Award />}
                title="Pontuação Média"
                value={`${pontuacaoMedia.toFixed(1)}%`}
                description="Média de todas as análises"
                color="green"
                progress={Math.round(pontuacaoMedia)}
            />
            <SummaryCard
                icon={<ShieldAlert />}
                title="Total de Code Smells"
                value={totalCodeSmells}
                description="Problemas de código"
                color="amber"
                progress={Math.min((totalCodeSmells / 500) * 100, 100)}
            />
             <SummaryCard
                icon={<TrendingUp />}
                title="Total de Commits"
                value={totalCommits}
                description="Em todas as branches"
                color="emerald"
                progress={Math.min((totalCommits / 1000) * 100, 100)}
            />
            <SummaryCard
                icon={<Users />}
                title="Autores Únicos"
                value={totalAutores}
                description="Contribuidores do projeto"
                color="violet"
                progress={Math.min((totalAutores / 10) * 100, 100)}
            />
             <SummaryCard
                icon={<GitMerge />}
                title="Branches Analisadas"
                value={branchsAnalizadas.length}
                description={branchsAnalizadas.join(', ')}
                color="sky"
                progress={100}
            />
        </div>
      </section>

      <section>
         <h2 className="text-2xl font-bold text-stone-700 mb-4">Histórico de Análises</h2>
         {analises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Puzzle size={48} className="mx-auto text-stone-300" />
            <h3 className="mt-4 text-xl font-semibold text-stone-700">Nenhuma análise encontrada</h3>
            <p className="mt-1 text-stone-500">Quando uma análise for realizada, ela aparecerá aqui.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {analises.map((a, idx) => (
              <li
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl"
              >
                <div className="p-6 flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                     <ScoreGauge score={a.pontuacaoTotal} />
                     <p className="mt-2 text-sm font-medium text-stone-600">Pontuação de Qualidade</p>
                  </div>
                  
                  <div className="hidden lg:block w-px bg-stone-200 self-stretch"></div>

                  <div className="flex-grow w-full">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="flex items-center text-xl font-bold text-emerald-700">
                               <GitMerge className="w-5 h-5 mr-2" />
                               Branch: {a.nomeBranch}
                            </h4>
                            <p className="text-xs text-stone-500 mt-1">
                                Analisado {formatDistanceToNow(new Date(a.dataAnalise), {
                                locale: ptBR,
                                addSuffix: true,
                                })}
                            </p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatItem icon={<Siren size={24}/>} label="Code Smells" value={a.quantidadeCodeSmells} valueClassName={a.quantidadeCodeSmells > 20 ? 'text-red-500' : 'text-stone-800'} />
                        <StatItem icon={<Puzzle size={24}/>} label="Complexidade Média" value={a.complexidadeMedia?.toFixed(1)} />
                        <StatItem icon={<GitCommit size={24}/>} label="Commits na Análise" value={a.totalCommits} />
                        <StatItem icon={<Users size={24}/>} label="Autores na Análise" value={a.totalAutores} />
                     </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}