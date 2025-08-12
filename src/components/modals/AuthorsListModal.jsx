import React from 'react';
import { X, Users } from 'lucide-react';
import AuthorCard from '../AuthorCard';

export default function AuthorsListModal({ isOpen, onClose, autores = [] }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-stone-50/80 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 flex items-center">
            <Users className="mr-2 text-emerald-600" />
            Contribuidores do Projeto
          </h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {autores.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {autores.map(autor => (
                <div key={autor.id || autor.email} onClick={onClose}>
                  <AuthorCard autor={autor} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-8">Nenhum autor encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}