import React from 'react';
import { XCircle } from 'lucide-react';

export default function RepoInputGroup({ index, repo, onChange, onRemove, showRemove }) {
    return (
        <div className="p-4 border border-stone-200 rounded-lg relative space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">URL do Repositório</label>
                    <input
                        type="url"
                        required
                        value={repo.url}
                        onChange={(e) => onChange(index, 'url', e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="https://github.com/usuario/repo.git"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Branch</label>
                    <input
                        type="text"
                        required
                        value={repo.branch}
                        onChange={(e) => onChange(index, 'branch', e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="main"
                    />
                </div>
            </div>
            {showRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-2 right-2 text-stone-400 hover:text-red-500 transition-colors"
                    title="Remover Repositório"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
