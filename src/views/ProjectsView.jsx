import React from 'react';

export default function ProjectsView() {
    return (
        <section className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-emerald-600 mb-4">Gerenciar Projetos dos Alunos</h3>
            <p className="text-stone-600">Esta seção listará todos os projetos dos alunos. Você poderá clicar em um projeto para ver seu dashboard específico, métricas e commits.</p>
            <div className="mt-4 space-y-3">
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                    <h4 className="font-medium text-emerald-700">Projeto Alpha - Aluno A</h4>
                    <p className="text-sm text-stone-500">Último commit: 2 horas atrás - Pontuação de Qualidade: 88%</p>
                </div>
            </div>
        </section>
    );
}
