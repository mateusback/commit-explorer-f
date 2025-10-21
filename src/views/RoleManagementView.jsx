import { useState, useEffect } from 'react';
import { Users, Shield, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';

export default function RoleManagementView() {
    const { hasRole } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    // Mock data for demonstration - replace with actual API call
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setUsers([
                {
                    id: 1,
                    name: 'João Silva',
                    email: 'joao.silva@universidade.edu',
                    role: 'student',
                    createdAt: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Maria Santos',
                    email: 'maria.santos@universidade.edu',
                    role: 'professor',
                    createdAt: '2024-01-10'
                },
                {
                    id: 3,
                    name: 'Pedro Oliveira',
                    email: 'pedro.oliveira@universidade.edu',
                    role: 'student',
                    createdAt: '2024-01-20'
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleEditRole = (user) => {
        setEditingUser(user.id);
        setNewRole(user.role);
    };

    const handleSaveRole = async (userId) => {
        // Here you would make an API call to update the user's role
        console.log(`Updating user ${userId} role to ${newRole}`);
        
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        ));
        
        setEditingUser(null);
        setNewRole('');
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setNewRole('');
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'professor':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'student':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
                </div>
                <p className="text-gray-600">
                    Gerencie as funções e permissões dos usuários do sistema
                </p>
            </div>

            <div className="bg-white rounded-lg shadow border">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Usuários Registrados</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Função
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data de Registro
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingUser === user.id ? (
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="student">Estudante</option>
                                                <option value="professor">Professor</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                {user.role === 'professor' ? 'Professor' : 
                                                 user.role === 'student' ? 'Estudante' : 
                                                 user.role === 'admin' ? 'Administrador' : user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {editingUser === user.id ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleSaveRole(user.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-sm text-green-700 hover:text-green-900 focus:outline-none"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEditRole(user)}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-900 focus:outline-none"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Editar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                        <p className="text-gray-600">Não há usuários registrados no sistema.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-1">Sobre as Funções</h3>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p><strong>Estudante:</strong> Pode visualizar análises e projetos, mas não pode gerenciar usuários.</p>
                            <p><strong>Professor:</strong> Pode gerenciar usuários e acessar todas as funcionalidades do sistema.</p>
                            <p><strong>Administrador:</strong> Acesso completo ao sistema, incluindo configurações avançadas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}