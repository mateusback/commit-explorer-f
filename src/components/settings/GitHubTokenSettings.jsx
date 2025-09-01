import React, { useState } from 'react';
import { Github, Lock, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';
import { useGitHubToken } from '../../hooks/useGitHubToken';
import { NotificationService } from '../../services/NotificationService';

export default function GitHubTokenSettings() {
    const { token, hasToken, saveToken, removeToken } = useGitHubToken();
    const [isEditing, setIsEditing] = useState(false);
    const [newToken, setNewToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!newToken.trim()) {
            NotificationService.error('Token não pode estar vazio');
            return;
        }

        setLoading(true);
        try {
            saveToken(newToken.trim());
            setIsEditing(false);
            setNewToken('');
            NotificationService.success('Token do GitHub atualizado com sucesso!');
        } catch (error) {
            NotificationService.error('Erro ao salvar token');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        if (confirm('Tem certeza que deseja remover o token do GitHub?')) {
            removeToken();
            NotificationService.success('Token removido com sucesso');
        }
    };

    const maskToken = (token) => {
        if (!token) return '';
        return token.substring(0, 4) + '•'.repeat(Math.max(0, token.length - 8)) + token.substring(token.length - 4);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Github className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-stone-800">Token do GitHub</h3>
                    <p className="text-stone-500 text-sm">Configure seu Personal Access Token para melhor performance</p>
                </div>
            </div>

            {!hasToken && !isEditing ? (
                <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Github className="w-8 h-8 text-stone-400" />
                    </div>
                    <h4 className="text-stone-700 font-semibold mb-2">Token não configurado</h4>
                    <p className="text-stone-500 text-sm mb-6">
                        Configure um token do GitHub para analisar repositórios privados e evitar limites de rate
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
                    >
                        <Github className="w-4 h-4" />
                        Configurar Token
                    </button>
                </div>
            ) : isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Personal Access Token
                        </label>
                        <input
                            type="password"
                            value={newToken}
                            onChange={(e) => setNewToken(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 placeholder:text-stone-400 font-mono text-sm"
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        />
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
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewToken('');
                            }}
                            className="flex-1 px-4 py-2 text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!newToken.trim() || loading}
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <Lock className="w-4 h-4" />
                            )}
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-emerald-800">Token configurado</p>
                                <p className="text-sm text-emerald-600 font-mono">
                                    {showToken ? token : maskToken(token)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowToken(!showToken)}
                            className="text-emerald-600 hover:text-emerald-700 p-1"
                        >
                            {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Editar
                        </button>
                        <button
                            onClick={handleRemove}
                            className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remover
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
