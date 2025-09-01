import React from 'react';
import { BarChart3, TrendingUp, Code, Clock, Users, FileText, AlertTriangle, Star, LineChart, Activity } from 'lucide-react';

export default function MetricsView() {
    const metrics = [
        {
            icon: <Star className="text-emerald-600" />,
            title: "Pontuação de Qualidade",
            description: "Avaliação geral que considera qualidade do código, frequência de commits e boas práticas de desenvolvimento.",
            benefit: "Permite identificar o nível de maturidade do projeto e áreas de melhoria."
        },
        {
            icon: <Users className="text-blue-600" />,
            title: "Colaboradores Ativos",
            description: "Número de desenvolvedores únicos que contribuíram com o projeto no período analisado.",
            benefit: "Mostra o engajamento da equipe e distribuição de responsabilidades."
        },
        {
            icon: <Code className="text-sky-600" />,
            title: "Atividade de Desenvolvimento",
            description: "Volume de código modificado, incluindo linhas adicionadas e removidas por cada desenvolvedor.",
            benefit: "Indica a produtividade e o nível de atividade da equipe."
        },
        {
            icon: <AlertTriangle className="text-amber-600" />,
            title: "Problemas de Qualidade",
            description: "Identificação automática de padrões problemáticos no código que podem impactar a manutenibilidade.",
            benefit: "Ajuda a prevenir bugs e facilita futuras modificações no código."
        },
        {
            icon: <Activity className="text-green-600" />,
            title: "Complexidade do Código",
            description: "Análise da complexidade média dos commits, indicando a dificuldade de compreensão e manutenção.",
            benefit: "Orienta decisões sobre refatoração e simplificação do código."
        },
        {
            icon: <Clock className="text-indigo-600" />,
            title: "Padrões de Trabalho",
            description: "Análise dos horários de desenvolvimento para identificar padrões de produtividade da equipe.",
            benefit: "Oferece insights sobre o ritmo de trabalho e pode indicar sobrecarga."
        }
    ];

    const chartTypes = [
        {
            icon: <LineChart className="text-blue-500" />,
            title: "Evolução no Tempo",
            description: "Visualização da frequência de commits ao longo do período, mostrando tendências de atividade.",
            value: "Identifica picos de atividade e períodos de menor produtividade."
        },
        {
            icon: <BarChart3 className="text-purple-500" />,
            title: "Distribuição por Horário",
            description: "Mostra em quais horários a equipe é mais produtiva durante o dia.",
            value: "Ajuda a entender os padrões de trabalho e otimizar reuniões."
        },
        {
            icon: <TrendingUp className="text-green-500" />,
            title: "Arquivos Mais Modificados",
            description: "Ranking dos arquivos que recebem mais alterações, indicando pontos críticos do sistema.",
            value: "Identifica componentes que podem precisar de refatoração."
        },
        {
            icon: <FileText className="text-amber-500" />,
            title: "Tipos de Mudanças",
            description: "Categorização dos commits por tipo (funcionalidade, correção, melhoria, etc.).",
            value: "Mostra como o tempo da equipe está sendo investido."
        }
    ];

    return (
        <div className="space-y-6">

            {/* Indicadores Principais */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                    Principais Indicadores
                </h2>
                
                <div className="grid gap-6 lg:grid-cols-2">
                    {metrics.map((metric, index) => (
                        <div key={index} className="group p-6 border-2 border-stone-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-stone-100 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
                                    {React.cloneElement(metric.icon, { className: "w-6 h-6" })}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-stone-800 mb-3 text-lg">{metric.title}</h3>
                                    <p className="text-stone-600 mb-4 leading-relaxed">{metric.description}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Por que é importante:</p>
                                        <p className="text-sm text-emerald-800 leading-relaxed">{metric.benefit}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Visualizações */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    Gráficos e Análises Visuais
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                    {chartTypes.map((chart, index) => (
                        <div key={index} className="group p-6 border-2 border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-stone-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                                    {chart.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-stone-800 mb-3 text-lg">{chart.title}</h3>
                                    <p className="text-stone-600 mb-4 leading-relaxed">{chart.description}</p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Benefício:</p>
                                        <p className="text-sm text-blue-800 leading-relaxed">{chart.value}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Como usar as informações */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-emerald-600" />
                    Como Interpretar os Resultados
                </h2>
                
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-green-800 mb-3">Pontuação Alta</h4>
                        <p className="text-green-700 text-sm leading-relaxed">
                            Indica um projeto bem estruturado, com boa qualidade de código e práticas consistentes de desenvolvimento.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-amber-800 mb-3">Pontos de Atenção</h4>
                        <p className="text-amber-700 text-sm leading-relaxed">
                            Métricas médias podem indicar oportunidades de melhoria na organização do código ou processos da equipe.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-blue-800 mb-3">Colaboração</h4>
                        <p className="text-blue-700 text-sm leading-relaxed">
                            Analise a distribuição de trabalho entre os membros da equipe para identificar sobrecargas ou oportunidades de mentoria.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
