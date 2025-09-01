import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitBranch, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { NotificationService } from '../services/NotificationService';

export default function RegisterView() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form);
            NotificationService.success('Cadastro concluído. Faça login para continuar.');
            navigate('/login');
        } catch (err) {
            NotificationService.error(err.message || 'Falha no registro');
        } finally {
            setLoading(false);
        }
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
                    <p className="text-stone-600 text-base">Registre-se para começar a explorar</p>
                </div>

                {/* Register Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-stone-800 mb-2">Criar conta</h2>
                        <p className="text-stone-600">Preencha os dados para começar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-stone-700">Nome completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-stone-50/50 focus:bg-white placeholder:text-stone-400 text-stone-800 font-medium hover:border-stone-300"
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </div>
                        </div>

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
                                <UserPlus className="w-5 h-5" />
                            )}
                            <span className="text-lg">{loading ? "Criando conta..." : "Criar conta"}</span>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-200">
                        <p className="text-center text-stone-600">
                            Já tem uma conta?{' '}
                            <Link 
                                to="/login" 
                                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 hover:underline underline-offset-4"
                            >
                                Fazer login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-stone-500">
                        © 2024 Commit Explorer. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
