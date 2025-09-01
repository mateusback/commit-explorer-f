import React from 'react';
import GitHubTokenSettings from '../components/settings/GitHubTokenSettings';

export default function SettingsView() {
    return (
        <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-stone-100">
                <h3 className="text-2xl font-semibold text-stone-800 mb-2">Configurações</h3>
                <p className="text-stone-600">Configure o Commit Explorer, gerencie integrações e preferências.</p>
            </section>
            
            <GitHubTokenSettings />
        </div>
    );
}
