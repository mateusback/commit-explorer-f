import React from 'react';
import { Clock, GitBranch, CheckCircle2, XCircle, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function RecentAnalysesTable({ analyses }) {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    if (status === 'CONCLUIDA') return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (status === 'FALHA') return <XCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const getStatusBadge = (status) => {
    const styles = {
      CONCLUIDA: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
      FALHA: 'bg-red-100 text-red-700 ring-red-200',
      EM_ANDAMENTO: 'bg-blue-100 text-blue-700 ring-blue-200',
    };
    
    const labels = {
      CONCLUIDA: 'Concluída',
      FALHA: 'Falha',
      EM_ANDAMENTO: 'Em Andamento',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ring-1 ${styles[status] || styles.EM_ANDAMENTO}`}>
        {getStatusIcon(status)}
        {labels[status] || status}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-stone-400';
    if (score >= 75) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleRowClick = (id) => {
    navigate(`/analysis/${id}`);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200/60">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center ring-4 ring-indigo-50 mr-3">
          <Clock className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-800">Análises Recentes</h3>
          <p className="text-xs text-stone-600">Últimas 5 análises realizadas</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="text-left py-3 px-4 text-xs font-bold text-stone-600 uppercase tracking-wider">Projeto</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-stone-600 uppercase tracking-wider">Usuário</th>
              <th className="text-center py-3 px-4 text-xs font-bold text-stone-600 uppercase tracking-wider">Status</th>
              <th className="text-center py-3 px-4 text-xs font-bold text-stone-600 uppercase tracking-wider">Score</th>
              <th className="text-center py-3 px-4 text-xs font-bold text-stone-600 uppercase tracking-wider">Commits</th>
              <th className="text-right py-3 px-4 text-xs font-bold text-stone-600 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((analysis) => (
              <tr 
                key={analysis.id}
                onClick={() => handleRowClick(analysis.id)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors duration-150"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">{analysis.nomeProjeto}</p>
                      <p className="text-xs text-stone-500 truncate">{analysis.urlRepositorio}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-stone-700">{analysis.nomeUsuario}</p>
                </td>
                <td className="py-4 px-4 text-center">
                  {getStatusBadge(analysis.status)}
                </td>
                <td className="py-4 px-4 text-center">
                  {analysis.pontuacao ? (
                    <div className="flex items-center justify-center gap-1">
                      <Award className={`w-4 h-4 ${getScoreColor(analysis.pontuacao)}`} />
                      <span className={`text-sm font-bold ${getScoreColor(analysis.pontuacao)}`}>
                        {analysis.pontuacao.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400">-</span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm font-semibold text-stone-700">{analysis.totalCommits}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <p className="text-sm text-stone-700">
                    {format(new Date(analysis.dataCriacao), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                  <p className="text-xs text-stone-500">
                    {format(new Date(analysis.dataCriacao), 'HH:mm', { locale: ptBR })}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
