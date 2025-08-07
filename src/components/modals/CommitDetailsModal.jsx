import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import CommitDetailsContent from '../commit/CommitDetailsContent';

export default function CommitDetailsModal({ isOpen, onClose, initialCommitId, allCommitIds = [] }) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (initialCommitId) {
      setCurrentIndex(allCommitIds.indexOf(initialCommitId));
    }
  }, [initialCommitId, allCommitIds]);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < allCommitIds.length - 1;

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) setCurrentIndex(prev => prev - 1);
  }, [canGoPrevious]);

  const handleNext = useCallback(() => {
    if (canGoNext) setCurrentIndex(prev => prev + 1);
  }, [canGoNext]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrevious, handleNext, onClose]);

  if (!isOpen || currentIndex === -1) {
    return null;
  }

  const currentCommitId = allCommitIds[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* CABEÇALHO REFINADO */}
        <header className="flex items-center justify-between p-4 border-b border-stone-200">
          
          {/* Grupo de botões de navegação à esquerda */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevious} 
              disabled={!canGoPrevious} 
              className="btn btn-sm btn-ghost btn-circle disabled:opacity-30"
              aria-label="Commit Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext} 
              disabled={!canGoNext} 
              className="btn btn-sm btn-ghost btn-circle disabled:opacity-30"
              aria-label="Próximo Commit"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Contador central */}
          <p className="text-sm text-stone-500">
            Commit {currentIndex + 1} de {allCommitIds.length}
          </p>
          
          {/* Botão de fechar à direita */}
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <CommitDetailsContent commitId={currentCommitId} />
        </main>
      </div>
    </div>
  );
}