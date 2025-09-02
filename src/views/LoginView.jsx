import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitBranch, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { NotificationService } from '../services/NotificationService';
import GitHubTokenModal from '../components/modals/GitHubTokenModal';

export default function LoginView() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showTokenModal, setShowTokenModal] = useState(false);

    useEffect(() => {
        const sessionExpired = sessionStorage.getItem('sessionExpired');
        if (sessionExpired) {
            NotificationService.info('Sua sessão expirou. Faça login novamente.');
            sessionStorage.removeItem('sessionExpired');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form);
            
            const githubToken = localStorage.getItem('github_token');
            const tokenSkipped = localStorage.getItem('github_token_skipped');
            
            if (!githubToken && !tokenSkipped) {
                setShowTokenModal(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            NotificationService.error(err.message || 'Falha no login');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToken = async (token) => {
        localStorage.setItem('github_token', token);
        NotificationService.success('Token do GitHub salvo com sucesso!');
        navigate('/dashboard');
    };

    const handleCloseTokenModal = () => {
        setShowTokenModal(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-100 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300">
                        <GitBranch className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-emerald-700 mb-2 tracking-tight">Commit Explorer</h1>
                    <p className="text-stone-600 text-base">Analise a qualidade dos seus repositórios</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-stone-800 mb-2">Bem-vindo de volta</h2>
                        <p className="text-stone-600">Entre com suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-stone-700">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-stone-50/50 focus:bg-white placeholder:text-stone-400 text-stone-800 font-medium hover:border-stone-300"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-stone-700">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-stone-50/50 focus:bg-white placeholder:text-stone-400 text-stone-800 font-medium hover:border-stone-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-md"></span>
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            <span className="text-lg">{loading ? "Entrando..." : "Entrar na conta"}</span>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-200">
                        <p className="text-center text-stone-600">
                            Não tem uma conta?{' '}
                            <Link 
                                to="/register" 
                                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 hover:underline underline-offset-4"
                            >
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-stone-500">
                        © 2025 Commit Explorer.
                    </p>
                </div>
            </div>
            
            {/* GitHub Token Modal */}
            <GitHubTokenModal 
                isOpen={showTokenModal}
                onClose={handleCloseTokenModal}
                onSave={handleSaveToken}
            />
        </div>
    );
}
