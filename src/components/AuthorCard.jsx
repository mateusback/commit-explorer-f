// src/components/AuthorCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { GitCommit, ArrowUp, ArrowDown } from 'lucide-react';

function AuthorStat({ icon, value, label }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-stone-600">
      <div className="text-emerald-700">{icon}</div>
      <span><strong>{value}</strong> {label}</span>
    </div>
  );
}

export default function AuthorCard({ autor }) {
  if (!autor) return null;

  return (
    <Link 
      to={`/autores/${autor.id}`} 
      className="block bg-white p-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-105"
    >
      <div className="flex items-center space-x-4">
        <UserAvatar 
          autor={autor}
          className="w-16 h-16"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-stone-800 truncate" title={autor.nome}>
            {autor.nome}
          </h4>
          <p className="text-sm text-stone-500 truncate" title={autor.email}>
            {autor.email}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
        <AuthorStat icon={<GitCommit size={16}/>} value={autor.totalCommits} label="commits"/>
        <AuthorStat icon={<ArrowUp size={16} className="text-green-500"/>} value={autor.totalLinhasAdicionadas} label="linhas adicionadas"/>
        <AuthorStat icon={<ArrowDown size={16} className="text-red-500"/>} value={autor.totalLinhasRemovidas} label="linhas removidas"/>
      </div>
    </Link>
  );
}