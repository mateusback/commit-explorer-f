import React from 'react';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function TopProjectsList({ projects }) {
  const navigate = useNavigate();

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

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏅';
  };

  const handleProjectClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200/60">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center ring-4 ring-yellow-50 mr-3">
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-800">Top 5 Projetos</h3>
          <p className="text-xs text-stone-600">Melhores pontuações médias</p>
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
            className={`p-4 rounded-xl ring-1 ring-stone-200 hover:ring-stone-300 cursor-pointer transition-all duration-200 hover:shadow-md ${getScoreBg(project.pontuacaoMedia)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">{getMedalEmoji(index)}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-stone-800 truncate">{project.nome}</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {project.totalAnalises} {project.totalAnalises === 1 ? 'análise' : 'análises'}
                  </p>
                </div>
              </div>
              <div className={`text-right flex-shrink-0 ml-3`}>
                <p className={`text-2xl font-black ${getScoreColor(project.pontuacaoMedia)}`}>
                  {project.pontuacaoMedia.toFixed(1)}
                </p>
                <p className="text-xs text-stone-500 font-medium">Score</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Calendar className="w-3 h-3" />
              <span>
                Última análise: {format(new Date(project.dataUltimaAnalise), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
