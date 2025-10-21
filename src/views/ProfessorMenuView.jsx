import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserPlus, Mail, Shield, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';
import AuthService from '../services/AuthService';
import { NotificationService } from '../services/NotificationService';
import { useAuth } from '../components/auth/AuthContext';

export default function ProfessorMenuView() {
    const { hasRole } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const promoteMutation = useMutation({
        mutationFn: AuthService.promoteToProfessor,
        onSuccess: (response) => {
            setEmail('');
            setIsSubmitting(false);
            NotificationService.success(response?.message || 'Usuário promovido a professor com sucesso!');
        },
        onError: (error) => {
            setIsSubmitting(false);
            NotificationService.error(
                error?.message || 'Erro ao promover usuário. Tente novamente.'
            );
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            NotificationService.error('Por favor, insira um email válido.');
            return;
        }

        if (!email.includes('@')) {
            NotificationService.error('Por favor, insira um email válido.');
            return;
        }

        setIsSubmitting(true);
        promoteMutation.mutate(email.toLowerCase().trim());
    };

    if (!hasRole('professor')) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Restrito</h3>
                    <p className="text-gray-600">Esta página é disponível apenas para professores.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulário para adicionar professor */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Promover a Professor</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email do Usuário
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="usuario@universidade.edu"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Digite o email do usuário que deseja promover a professor
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !email.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Promovendo...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Promover a Professor
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Informações sobre privilégios de professor */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Privilégios de Professor</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Promover Professores</h3>
                                    <p className="text-sm text-gray-600">
                                        Adicionar novos professores ao sistema
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Acesso Completo</h3>
                                    <p className="text-sm text-gray-600">
                                        Visualizar todos os projetos e análises dos estudantes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de avisos */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-yellow-900 mb-1">Informações Importantes</h3>
                        <div className="text-sm text-yellow-800 space-y-1">
                            <p>• O usuário deve estar registrado no sistema antes de ser promovido a professor</p>
                            <p>• Professores têm acesso a todas as funcionalidades administrativas</p>
                            <p>• Esta ação não pode ser desfeita através desta interface</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}