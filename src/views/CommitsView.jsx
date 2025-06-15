import React from 'react';

export default function CommitsView() {
    return (
        <section className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-emerald-600 mb-4">Registro de Todos os Commits</h3>
            <p className="text-stone-600 mb-4">Uma lista cronológica de todos os commits de todos os projetos.</p>
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <li className="text-sm text-stone-500 italic">Em breve: listagem dinâmica dos commits 🚀</li>
            </ul>
        </section>
    );
}
