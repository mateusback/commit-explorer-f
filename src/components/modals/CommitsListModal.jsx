import React from 'react';
import { X, GitCommit } from 'lucide-react';
import CommitCard from '../CommitCard';

export default function CommitsListModal({ isOpen, onClose, commits = [] }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-stone-50/80 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 flex items-center">
            <GitCommit className="mr-2 text-emerald-600" />
            Histórico de Commits do Projeto
          </h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {commits.length > 0 ? (
            <ul className="space-y-3">
              {commits.map(commit => (
                <li key={commit.hash}>
                  <CommitCard commit={commit} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-stone-500 text-center py-8">Nenhum commit encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}