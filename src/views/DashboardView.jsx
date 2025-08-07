import React from 'react';
import ProgressSummaryCard from '../components/ui/ProgressSummaryCard';
import { TrendingUp, ShieldAlert, Puzzle, Award } from 'lucide-react';

export default function DashboardView() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ProgressSummaryCard
                icon={<TrendingUp />}
                title="Frequência Total de Commits"
                value="875"
                description="commits totais nos últimos 7 dias"
                color="emerald"
                progress={65}
            />
            <ProgressSummaryCard
                icon={<ShieldAlert />}
                title="Total de Code Smells"
                value="158"
                description="problemas ativos totais"
                color="amber"
                progress={50}
            />
            <ProgressSummaryCard
                icon={<Puzzle />}
                title="Complexidade Média de Projeto"
                value="8.1"
                description="pontuação ciclomática média"
                color="sky"
                progress={68}
            />
            <ProgressSummaryCard
                icon={<Award />}
                title="Pontuação Média de Qualidade"
                value="79%"
                description="saúde média do projeto"
                color="green"
                progress={79}
            />
        </section>
    );
}
