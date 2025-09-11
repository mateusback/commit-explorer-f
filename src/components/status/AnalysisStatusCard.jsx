import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  GitBranch,
  Calendar,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusService from '../../services/StatusService';
import { NotificationService } from '../../services/NotificationService';

const statusConfig = {
  PENDENTE: {
    label: 'Pendente',
    color: 'amber',
    icon: Clock,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800'
  },
  EM_ANDAMENTO: {
    label: 'Em Andamento',
    color: 'blue',
    icon: Loader2,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  CONCLUIDA: {
    label: 'Concluída',
    color: 'green',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  },
  FALHA: {
    label: 'Falhou',
    color: 'red',
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800'
  }
};

export default function AnalysisStatusCard({ analysis, onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const status = statusConfig[analysis.status] || statusConfig.PENDENTE;
  const StatusIcon = status.icon;

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await StatusService.retryAnalysis(analysis.id);
      NotificationService.success('Análise reenviada com sucesso!');
      onRefresh();
    } catch (error) {
      NotificationService.error(error.message || 'Erro ao reenviar análise');
    } finally {
      setIsRetrying(false);
    }
  };

  const canRetry = analysis.status === 'FALHA';

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-100 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.bgColor} ring-1 ${status.borderColor}`}>
            <StatusIcon 
              className={`w-5 h-5 ${status.textColor} ${analysis.status === 'EM_ANDAMENTO' ? 'animate-spin' : ''}`} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">{analysis.projectName}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
              {status.label}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {canRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Tentar novamente"
            >
              {isRetrying ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RotateCcw className="w-3 h-3" />
              )}
              {isRetrying ? 'Reenviando...' : 'Tentar novamente'}
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title={isExpanded ? "Recolher" : "Expandir"}
          >
            <GitBranch className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-stone-500">Criada:</span>
          <p className="font-medium text-stone-800">
            {formatDistanceToNow(new Date(analysis.createdAt), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </p>
        </div>
        <div>
          <span className="text-stone-500">Repositórios:</span>
          <p className="font-medium text-stone-800">{analysis.repositoryCount || 0}</p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-stone-200 space-y-4">
          {/* Repository List */}
          {analysis.repositories && analysis.repositories.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-800 mb-2">Repositórios:</h4>
              <div className="space-y-2">
                {analysis.repositories.map((repo, repoIndex) => (
                  <div key={`${analysis.id}-repo-${repoIndex}`} className="bg-white/50 border border-stone-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-stone-500" />
                      <span className="font-medium text-stone-800 truncate">{repo.url}</span>
                      <span className="text-xs bg-stone-200 px-2 py-1 rounded">{repo.branch}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Period */}
          {(analysis.startDate || analysis.endDate) && (
            <div>
              <h4 className="font-semibold text-stone-800 mb-2">Período de Análise:</h4>
              <div className="bg-white/50 border border-stone-200 rounded-lg p-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span>De: {analysis.startDate ? new Date(analysis.startDate).toLocaleDateString('pt-BR') : 'Não definido'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span>Até: {analysis.endDate ? new Date(analysis.endDate).toLocaleDateString('pt-BR') : 'Não definido'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {analysis.status === 'FALHA' && analysis.errorMessage && (
            <div>
              <h4 className="font-semibold text-red-800 mb-2">Erro:</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 mb-3">{analysis.errorMessage}</p>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetrying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {isRetrying ? 'Reenviando análise...' : 'Tentar novamente'}
                </button>
              </div>
            </div>
          )}

          {/* Last Update */}
          {analysis.updatedAt && (
            <div className="text-xs text-stone-500">
              Última atualização: {formatDistanceToNow(new Date(analysis.updatedAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

AnalysisStatusCard.propTypes = {
  analysis: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    projectName: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'FALHA']).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    repositoryCount: PropTypes.number,
    repositories: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      branch: PropTypes.string.isRequired
    })),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    errorMessage: PropTypes.string
  }).isRequired,
  onRefresh: PropTypes.func.isRequired
};
