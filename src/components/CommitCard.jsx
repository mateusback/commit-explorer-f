import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { GitCommit, Calendar, GitMerge, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CommitCard({ commit, onCommitSelect }) {
  if (!commit) return null;

  const getScoreColor = (s) => {
    if (s >= 75) return 'text-emerald-600';
    if (s >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const truncatedMessage = commit.mensagem.split('\n')[0];
  const shortHash = commit.hash.substring(0, 7);

  const cardBgClass = commit.ehMerge 
    ? 'bg-sky-50 hover:bg-sky-100' 
    : 'bg-white hover:bg-stone-50';
  
  const messageClass = commit.ehMerge 
    ? 'italic text-stone-600'
    : 'font-medium text-stone-800';

  const scoreColorClass = commit.pontuacao != null ? getScoreColor(commit.pontuacao) : 'text-stone-500';

  return (
    <button
      type="button"
      onClick={() => onCommitSelect(commit.id)} 
      className={`block w-full text-left p-4 rounded-lg shadow-sm transition-all ${cardBgClass}`}
    >
      <div className="flex items-start space-x-4">
        <div className="w-5 h-5 mt-1 flex-shrink-0">
          {commit.ehMerge ? (
            <GitMerge className="text-violet-500" />
          ) : (
            <GitCommit className="text-stone-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-emerald-600" title={commit.hash}>{shortHash}</p>
          <p className={`truncate ${messageClass}`} title={truncatedMessage}>
            {truncatedMessage}
          </p>
          
          <div className="flex items-center justify-between mt-2 text-xs text-stone-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Link to={`/autores/${commit.autor.id}`} className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <UserAvatar autor={commit.autor} className="w-4 h-4 mr-1.5" />
                  <span className="hover:underline">{commit.autor.nome}</span>
                </Link>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1.5" />
                <span>{format(new Date(commit.dataCommit), "dd MMM yyyy", { locale: ptBR })}</span>
              </div>
            </div>
            {commit.pontuacao != null && (
              <div className={`flex items-center font-bold ${scoreColorClass}`}>
                <Award className="w-4 h-4 mr-1" />
                <span>{commit.pontuacao.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}