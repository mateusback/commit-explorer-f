import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { GitCommit, Puzzle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import CommitDetailsModal from '../modals/CommitDetailsModal';
import CommitTypeTag from '../../components/tags/CommitTypeTag';

function CommitCard({ commit }) {
  const tipo = commit.tipo ?? commit.tipoCommit;

  return (
    <div className='p-0.5'>
      <div className="bg-white p-2 rounded-xl shadow-sm ring-1 ring-stone-100 hover:ring-emerald-300 transition-all duration-300 flex items-center gap-4 cursor-pointer">
        <div className="p-2 rounded-lg bg-stone-100 text-stone-600">
          <GitCommit size={20} />
        </div>

        <div className="flex-grow min-w-0">
          <p title={commit.mensagem} className="font-semibold text-stone-800 truncate">
            {commit.mensagem}
          </p>
          <p className="text-xs text-stone-500">
            {commit.dataCommit}
          </p>
        </div>

        <div className="flex items-center gap-4 ml-auto flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-sm" title="Linhas adicionadas/removidas">
            <span className="font-bold text-emerald-600">+{commit.linhasAdicionadas}</span>
            <span className="text-stone-300">/</span>
            <span className="font-bold text-red-600">-{commit.linhasRemovidas}</span>
          </div>

          {/* Tag de tipo com cor mapeada */}
          <div className="hidden md:inline-block">
            <CommitTypeTag tipo={tipo} />
          </div>

          <code className="font-mono text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-md hidden lg:inline-block">
            {commit.hash}
          </code>
        </div>
      </div>
    </div>
  );
}

export default function CommitsTable({ commits = [] }) {
  const [selectedCommitId, setSelectedCommitId] = useState(null);

  const allCommitIds = useMemo(() => commits.map(c => c.id), [commits]);

  const handleCommitSelect = (commitId) => {
    setSelectedCommitId(commitId);
  };

  const handleCloseModal = () => {
    setSelectedCommitId(null);
  };

  if (!commits || commits.length === 0) {
    return (
      <div className="card bg-white mt-8 shadow-lg">
        <div className="card-body items-center text-center">
          <Puzzle size={48} className="mx-auto text-stone-300" />
          <h3 className="mt-4 text-lg font-semibold text-stone-700">Nenhum commit encontrado</h3>
          <p className="mt-1 text-sm text-stone-500">Os commits desta análise aparecerão aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-5 rounded-xl shadow-sm ring-1 ring-stone-100">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">Histórico de Commits</h2>

        <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
          {commits.map((commit, index) => (
            <div
              key={commit.id || index}
              className="block"
              onClick={() => handleCommitSelect(commit.id)}
            >
              <CommitCard commit={commit} />
            </div>
          ))}
        </div>
      </div>

      <CommitDetailsModal
        isOpen={!!selectedCommitId}
        onClose={handleCloseModal}
        initialCommitId={selectedCommitId}
        allCommitIds={allCommitIds}
      />
    </>
  );
}