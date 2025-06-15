import React, { useState } from 'react';
import { PlusCircle, PlayCircle, Loader2, XCircle } from 'lucide-react';

import RepoInputGroup from '../components/input/RepoInputGroup';

export default function AnalyzeView() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectLink, setProjectLink] = useState('');
    const [repositories, setRepositories] = useState([{ url: '', branch: 'main' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);

    const addRepository = () => {
        setRepositories([...repositories, { url: '', branch: 'main' }]);
    };

    const removeRepository = (index) => {
        setRepositories(repositories.filter((_, i) => i !== index));
    };

    const updateRepository = (index, field, value) => {
        const updated = [...repositories];
        updated[index][field] = value;
        setRepositories(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setShowResults(false);

        if (!repositories.length || repositories.some(r => !r.url)) {
            setError('Por favor, adicione pelo menos um repositório válido.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowResults(true);
        }, 2000);
    };

    return (
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8 max-w-5xl mx-auto">
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-semibold text-emerald-600 mb-1">Analisar Repositórios</h3>
                <p className="text-stone-500 mb-6">Insira os detalhes para iniciar a análise.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Data de Início</label>
                        <input type="date" className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Data de Fim</label>
                        <input type="date" className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-stone-600 mb-1">Link do Projeto Principal no GitHub</label>
                    <input type="url" placeholder="https://github.com/usuario/projeto" className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500" value={projectLink} onChange={e => setProjectLink(e.target.value)} />
                    <p className="text-xs text-stone-400 mt-1">Este link é usado para acessar as Issues, Pull Requests, etc.</p>
                </div>

                <h4 className="text-lg font-semibold text-emerald-600 mb-4 border-t pt-4">Repositórios para Análise de Commits</h4>
                <div className="space-y-4">
                    {repositories.map((repo, index) => (
                        <RepoInputGroup
                            key={index}
                            index={index}
                            repo={repo}
                            onChange={updateRepository}
                            onRemove={removeRepository}
                            showRemove={index > 0}
                        />
                    ))}
                </div>

                <button type="button" onClick={addRepository} className="mt-4 flex items-center space-x-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    <PlusCircle className="w-4 h-4" />
                    <span>Adicionar outro repositório</span>
                </button>

                <div className="mt-8 border-t pt-6 flex justify-end">
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg shadow hover:shadow-md transition-all duration-150 flex items-center space-x-2">
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Analisando...</span>
                            </>
                        ) : (
                            <>
                                <PlayCircle className="w-5 h-5" />
                                <span>Analisar</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                    <strong>Erro:</strong> {error}
                </div>
            )}

            {showResults && (
                <div className="mt-8 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg analysis-placeholder">
                    Resultados da análise simulados aqui.
                </div>
            )}
        </section>
    );
}
