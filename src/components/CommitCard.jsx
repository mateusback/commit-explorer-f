import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { GitCommit, Calendar, GitMerge } from 'lucide-react'; 
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CommitCard({ commit }) {
  if (!commit) return null;

  const truncatedMessage = commit.mensagem.split('\n')[0];
  const shortHash = commit.hash.substring(0, 7);

  const cardBgClass = commit.ehMerge 
    ? 'bg-green-50 hover:bg-green-100' 
    : 'bg-white hover:bg-stone-50';
  
  const messageClass = commit.ehMerge 
    ? 'italic text-stone-600'
    : 'font-medium text-stone-800';

  return (
    <Link 
      to={`/commits/${commit.hash}`} 
      className={`block p-4 rounded-lg shadow-sm transition-all ${cardBgClass}`}
    >
      <div className="flex items-start space-x-4">
        <div className="w-5 h-5 mt-1 flex-shrink-0">
          {commit.ehMerge ? (
            <GitMerge className="text-emerald-00" />
          ) : (
            <GitCommit className="text-stone-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-emerald-600" title={commit.hash}>{shortHash}</p>
          <p className={`truncate ${messageClass}`} title={truncatedMessage}>
            {truncatedMessage}
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-stone-500">
            <div className="flex items-center">
              <UserAvatar autor={commit.autor} className="w-4 h-4 mr-1.5" />
              <span>{commit.autor.nome}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1.5" />
              <span>{format(new Date(commit.dataCommit), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}