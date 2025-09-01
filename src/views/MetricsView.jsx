import React from 'react';
import { BarChart3, TrendingUp, Code, Clock, Users, FileText, AlertTriangle, Star } from 'lucide-react';

export default function MetricsView() {
    const metrics = [
        {
            icon: <BarChart3 className="text-blue-600" />,
            title: "Pontuação Total",
            description: "Métrica agregada que considera qualidade do código, frequência de commits, complexidade e code smells para gerar uma pontuação geral do projeto.",
            calculation: "Baseada em algoritmos de análise que ponderam diferentes aspectos da qualidade do desenvolvimento."
        },
        {
            icon: <Users className="text-emerald-600" />,
            title: "Total de Autores",
            description: "Contagem única de desenvolvedores que contribuíram com commits no período analisado.",
            calculation: "Agrupamento por ID único do autor, filtrando commits sem autor definido."
        },
        {
            icon: <TrendingUp className="text-violet-600" />,
            title: "Total de Commits",
            description: "Número total de commits realizados no período de análise especificado.",
            calculation: "Filtragem de commits entre data de início e fim, incluindo commits no período estabelecido."
        },
        {
            icon: <Code className="text-sky-600" />,
            title: "Linhas Adicionadas/Removidas",
            description: "Soma das linhas de código adicionadas e removidas em todos os arquivos alterados.",
            calculation: "Agregação das quantidades de linhas por arquivo alterado em cada commit do período."
        },
        {
            icon: <AlertTriangle className="text-amber-600" />,
            title: "Code Smells",
            description: "Quantidade de problemas de qualidade de código detectados através de análise estática.",
            calculation: "Contagem de análises de código do tipo 'SMELL' encontradas nos arquivos alterados."
        },
        {
            icon: <Star className="text-green-600" />,
            title: "Complexidade Média",
            description: "Média da complexidade geral dos commits, indicando a dificuldade das alterações realizadas.",
            calculation: "Média aritmética da complexidade geral de todos os commits no período analisado."
        },
        {
            icon: <Clock className="text-indigo-600" />,
            title: "Distribuição Horária",
            description: "Análise dos horários em que os commits são realizados, divididos em buckets de 24 horas.",
            calculation: "Agrupamento de commits por hora do dia (0-23h) para identificar padrões de trabalho."
        },
        {
            icon: <FileText className="text-teal-600" />,
            title: "Top Arquivos Modificados",
            description: "Ranking dos arquivos mais alterados baseado na soma de linhas adicionadas e removidas.",
            calculation: "Ordenação decrescente por quantidade total de alterações, limitado aos top 6 arquivos."
        }
    ];

    const chartTypes = [
        {
            title: "Frequência de Commits",
            description: "Gráfico de linha mostrando a distribuição temporal de commits por dia no período analisado."
        },
        {
            title: "Distribuição Horária",
            description: "Gráfico de barras com a quantidade de commits por hora do dia (00:00 - 23:00)."
        },
        {
            title: "Top Arquivos",
            description: "Ranking dos arquivos mais modificados, ordenados por quantidade de linhas alteradas."
        },
        {
            title: "Tipos de Commit",
            description: "Distribuição dos commits por tipo (feat, fix, docs, etc.) com ranking decrescente."
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-emerald-600 mb-4">Análise de Métricas Globais</h3>
                <p className="text-stone-600">
                    Esta página apresenta o detalhamento das métricas agregadas utilizadas para avaliar a qualidade 
                    e atividade de desenvolvimento em todos os projetos analisados pelo Commit Explorer.
                </p>
            </section>

            {/* Métricas Principais */}
            <section className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-medium text-stone-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Métricas Calculadas
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {metrics.map((metric, index) => (
                        <div key={index} className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    {React.cloneElement(metric.icon, { className: "w-6 h-6" })}
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-stone-800 mb-2">{metric.title}</h5>
                                    <p className="text-stone-600 text-sm mb-3">{metric.description}</p>
                                    <div className="bg-stone-50 p-3 rounded border border-stone-100">
                                        <p className="text-xs text-stone-500 font-medium mb-1">Cálculo:</p>
                                        <p className="text-xs text-stone-600">{metric.calculation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tipos de Gráficos */}
            <section className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-medium text-stone-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Visualizações e Gráficos
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {chartTypes.map((chart, index) => (
                        <div key={index} className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                            <h5 className="font-medium text-stone-800 mb-2">{chart.title}</h5>
                            <p className="text-stone-600 text-sm">{chart.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Metodologia */}
            <section className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-medium text-stone-800 mb-6 flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-600" />
                    Metodologia de Análise
                </h4>
                
                <div className="space-y-4">
                    <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                        <h5 className="font-medium text-stone-800 mb-2">Período de Análise</h5>
                        <p className="text-stone-600 text-sm">
                            Os commits são filtrados considerando o período especificado na solicitação de análise, 
                            incluindo commits entre a data de início (00:00:00) e data fim (23:59:59).
                        </p>
                    </div>
                    
                    <div className="border-l-4 border-sky-500 pl-4 bg-sky-50 p-3 rounded-r">
                        <h5 className="font-medium text-stone-800 mb-2">Agrupamento por Autor</h5>
                        <p className="text-stone-600 text-sm">
                            As métricas são calculadas tanto globalmente quanto agrupadas por autor único, 
                            permitindo análises individuais e comparativas entre desenvolvedores.
                        </p>
                    </div>
                    
                    <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                        <h5 className="font-medium text-stone-800 mb-2">Tratamento de Dados</h5>
                        <p className="text-stone-600 text-sm">
                            Implementação de funções seguras para tratar valores nulos, listas vazias e 
                            garantir a integridade dos cálculos estatísticos realizados.
                        </p>
                    </div>
                    
                    <div className="border-l-4 border-violet-500 pl-4 bg-violet-50 p-3 rounded-r">
                        <h5 className="font-medium text-stone-800 mb-2">Ranking e Ordenação</h5>
                        <p className="text-stone-600 text-sm">
                            Os dados são ordenados de forma decrescente por relevância (ex: autores por número de commits, 
                            arquivos por quantidade de alterações) para facilitar a identificação de padrões.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
