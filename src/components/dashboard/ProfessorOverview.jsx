import React from 'react';
import { GraduationCap, Users, TrendingUp, Award } from 'lucide-react';

export default function ProfessorOverview({ studentsData }) {
  const { totalAlunos, alunosAtivos, alunosComProjetos, pontuacaoMediaAlunos, topAlunos } = studentsData;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 75) return 'text-lime-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-orange-600';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-emerald-50';
    if (score >= 75) return 'bg-lime-50';
    if (score >= 60) return 'bg-amber-50';
    return 'bg-orange-50';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-6 shadow-sm ring-1 ring-indigo-200/60">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center ring-4 ring-indigo-50 mr-4">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-stone-800">Visão Geral dos Alunos</h3>
          <p className="text-sm text-stone-600">Estatísticas da turma</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg ring-1 ring-stone-200/60">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium text-stone-600">Total de Alunos</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalAlunos}</p>
        </div>

        <div className="bg-white p-4 rounded-lg ring-1 ring-stone-200/60">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-medium text-stone-600">Alunos Ativos</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{alunosAtivos}</p>
        </div>

        <div className="bg-white p-4 rounded-lg ring-1 ring-stone-200/60">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-medium text-stone-600">Com Projetos</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{alunosComProjetos}</p>
        </div>

        <div className="bg-white p-4 rounded-lg ring-1 ring-stone-200/60">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <p className="text-xs font-medium text-stone-600">Score Médio</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{pontuacaoMediaAlunos.toFixed(1)}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          Top 5 Alunos
        </h4>
        <div className="space-y-2">
          {topAlunos.map((aluno, index) => (
            <div
              key={aluno.id}
              className={`flex items-center justify-between p-3 rounded-lg ring-1 ring-stone-200 ${getScoreBg(aluno.pontuacaoMedia)}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-stone-400 w-6 text-center">#{index + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{aluno.nome}</p>
                  <p className="text-xs text-stone-600">
                    {aluno.totalProjetos} {aluno.totalProjetos === 1 ? 'projeto' : 'projetos'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-black ${getScoreColor(aluno.pontuacaoMedia)}`}>
                  {aluno.pontuacaoMedia.toFixed(1)}
                </p>
                <p className="text-xs text-stone-500 font-medium">Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
