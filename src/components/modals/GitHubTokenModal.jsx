import React, { useState } from 'react';
import { Github, Lock, Info, X } from 'lucide-react';

export default function GitHubTokenModal({ isOpen, onClose, onSave }) {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token.trim()) return;
        
        setLoading(true);
        try {
            await onSave(token.trim());
            setToken('');
            onClose();
        } catch (error) {
            console.error('Erro ao salvar token:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('github_token_skipped', 'true');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Github className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-stone-800">Token do GitHub</h2>
                            <p className="text-stone-500 text-sm">Configuração necessária</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-blue-800 mb-2">Por que precisamos do seu token?</p>
                            <ul className="text-blue-700 space-y-1">
                                <li>• Para analisar repositórios privados</li>
                                <li>• Evitar limites de rate da API do GitHub</li>
                                <li>• Melhor performance nas análises</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                        <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-emerald-800 mb-1">Segurança garantida</p>
                            <p className="text-emerald-700">
                                Seu token será armazenado apenas no seu navegador (localStorage) e nunca enviado para nossos servidores.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                            Token do GitHub (Personal Access Token)
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 placeholder:text-stone-400 font-mono text-sm"
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                        <p className="text-xs text-stone-500 mt-2">
                            <a 
                                href="https://github.com/settings/tokens" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 underline"
                            >
                                Criar token no GitHub
                            </a>
                            {' '}• Permissões necessárias: repo, read:user
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex-1 px-4 py-3 text-stone-600 border-2 border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-semibold"
                        >
                            Pular por agora
                        </button>
                        <button
                            type="submit"
                            disabled={!token.trim() || loading}
                            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <Lock className="w-4 h-4" />
                            )}
                            {loading ? 'Salvando...' : 'Salvar Token'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
