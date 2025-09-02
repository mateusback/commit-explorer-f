import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Loader2, 
  RefreshCw, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter,
  Search
} from 'lucide-react';
import StatusService from '../services/StatusService';
import AnalysisStatusCard from '../components/status/AnalysisStatusCard';
import StatSummaryCard from '../components/ui/StatSummaryCard';
import { TimeConstants } from '../constants/TimeConstants';

export default function StatusView() {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: analyses,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['analysisStatus'],
    queryFn: StatusService.fetchAnalysisStatus,
    refetchInterval: 30000,
    staleTime: TimeConstants.THIRTY_SECONDS,
    refetchOnWindowFocus: true,
  });

  const filteredAnalyses = React.useMemo(() => {
    if (!analyses) return [];
    
    let filtered = analyses;

    if (filter !== 'ALL') {
      filtered = filtered.filter(analysis => analysis.status === filter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(analysis => 
        analysis.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.repositoryUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.repositories?.some(repo => 
          repo.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [analyses, filter, searchTerm]);

  const getStatusCounts = () => {
    if (!analyses) return {};
    
    return analyses.reduce((counts, analysis) => {
      counts[analysis.status] = (counts[analysis.status] || 0) + 1;
      return counts;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-stone-600">Carregando status das análises...</span>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Erro ao carregar análises</h3>
          <p className="text-red-600 mb-4">{error?.message || 'Erro desconhecido'}</p>
          <button 
            onClick={() => refetch()} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatSummaryCard
          icon={<Clock />}
          title="Em Andamento"
          value={statusCounts.EM_ANDAMENTO || 0}
          description="Análises sendo executadas"
          color="sky"
          onClick={() => setFilter('EM_ANDAMENTO')}
        />
        
        <StatSummaryCard
          icon={<Activity />}
          title="Pendentes"
          value={statusCounts.PENDENTE || 0}
          description="Aguardando processamento"
          color="amber"
          onClick={() => setFilter('PENDENTE')}
        />
        
        <StatSummaryCard
          icon={<CheckCircle />}
          title="Concluídas"
          value={statusCounts.CONCLUIDA || 0}
          description="Finalizadas com sucesso"
          color="emerald"
          onClick={() => setFilter('CONCLUIDA')}
        />
        
        <StatSummaryCard
          icon={<XCircle />}
          title="Falharam"
          value={statusCounts.FALHA || 0}
          description="Ocorreram erros"
          color="red"
          onClick={() => setFilter('FALHA')}
        />
      </section>

      {/* Filters and Search */}
      <section className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome do projeto ou repositório..."
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">Todos os Status</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="PENDENTE">Pendente</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="FALHA">Falhou</option>
            </select>
          </div>
        </div>
      </section>

      {/* Analysis List */}
      <section>
        {filteredAnalyses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                {searchTerm || filter !== 'ALL' ? 'Nenhuma análise encontrada' : 'Nenhuma análise iniciada'}
              </h3>
              <p className="text-stone-600 mb-6 leading-relaxed">
                {searchTerm || filter !== 'ALL' 
                  ? 'Tente ajustar os filtros para encontrar outras análises.'
                  : 'Quando você iniciar uma análise, ela aparecerá aqui para acompanhamento em tempo real.'
                }
              </p>
              {!searchTerm && filter === 'ALL' && (
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5"
                >
                  <Activity className="w-5 h-5" />
                  <span>Iniciar Nova Análise</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <AnalysisStatusCard
                key={analysis.id}
                analysis={analysis}
                onRefresh={refetch}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
