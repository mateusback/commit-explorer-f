import React, { useMemo, useState, useEffect } from 'react';
import { PlusCircle, PlayCircle, Loader2, GitBranch, Clock, AlertTriangle, GitFork, Settings } from 'lucide-react';
import RepoInputGroup from '../components/input/RepoInputGroup';
import GitHubTokenModal from '../components/modals/GitHubTokenModal';
import { useGitHubToken } from '../hooks/useGitHubToken';
import { analyzeRepositories } from '../services/AnalysisService';
import { NotificationService } from '../services/NotificationService';

function toDateOnly(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  if (d.getDate() < day) d.setDate(0);
  return d;
}

function formatYYYYMMDD(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function diffInMonthsStrict(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return months;
}

export default function AnalyzeView() {
  const [startDate, setStartDate] = useState('');
  const [projectName, setProjectName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [repositories, setRepositories] = useState([{ url: '', branch: 'main' }]);
  const [loading, setLoading] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  
  const { hasToken, saveToken } = useGitHubToken();

  useEffect(() => {
    if (!hasToken && !localStorage.getItem('github_token_skipped')) {
      setShowTokenModal(true);
    }
  }, [hasToken]);

  const endDateMin = startDate || undefined;
  const endDateMax = useMemo(() => {
    if (!startDate) return undefined;
    const max = addMonths(toDateOnly(startDate), 12);
    max.setDate(max.getDate() - 1);
    return formatYYYYMMDD(max);
  }, [startDate]);

  const addRepository = () => setRepositories([...repositories, { url: '', branch: 'main' }]);
  const removeRepository = (index) => setRepositories(repositories.filter((_, i) => i !== index));
  const updateRepository = (index, field, value) => {
    const updated = [...repositories];
    updated[index][field] = value;
    setRepositories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasToken) {
      NotificationService.error('Token do GitHub é obrigatório para análise de repositórios.');
      setShowTokenModal(true);
      return;
    }

    if (!projectName.trim()) {
      NotificationService.error('Por favor, informe o nome do projeto.');
      return;
    }

    if (!repositories.length || repositories.some(r => !r.url)) {
      NotificationService.error('Por favor, adicione pelo menos um repositório válido.');
      return;
    }

    const start = toDateOnly(startDate);
    const end = toDateOnly(endDate);

    if (start && end) {
      if (end < start) {
        NotificationService.error('A data de fim não pode ser anterior à data de início.');
        return;
      }
      const months = diffInMonthsStrict(start, end);
      if (months >= 12) {
        NotificationService.error('O período de análise deve ser menor que 12 meses.');
        return;
      }
    }

    setLoading(true);

    const payload = { projectName, startDate, endDate, projectLink, repositories };

    try {
      await analyzeRepositories(payload);
      NotificationService.success('Análise iniciada com sucesso!');
    } catch (err) {
      NotificationService.error(err.message || 'Erro ao analisar repositórios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Status do Token GitHub */}
      <div className={`rounded-xl border-2 p-6 ${hasToken 
        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200' 
        : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${hasToken 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
            : 'bg-gradient-to-br from-amber-500 to-amber-600'
          }`}>
            <GitFork className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold ${hasToken 
              ? 'text-emerald-800' 
              : 'text-amber-800'
            }`}>
              {hasToken ? 'Token GitHub Configurado' : 'Token GitHub Necessário'}
            </h3>
            <p className={`text-sm ${hasToken 
              ? 'text-emerald-700' 
              : 'text-amber-700'
            }`}>
              {hasToken 
                ? 'Você pode analisar repositórios privados e ter limites de API mais altos.' 
                : 'Configure seu token para acessar repositórios privados e evitar limites de API.'
              }
            </p>
          </div>
          {!hasToken && (
            <button
              onClick={() => setShowTokenModal(true)}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Settings className="w-4 h-4" />
              Configurar
            </button>
          )}
        </div>
      </div>

      {/* Formulário Principal */}
      <section className="bg-white rounded-2xl shadow-xl border border-stone-100 ring-1 ring-stone-50">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Nova Análise de Repositório</h3>
              <p className="text-emerald-100 text-sm">Insira os detalhes para iniciar a análise</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label htmlFor="projectName" className="block text-sm font-semibold text-stone-700 mb-2">
              Nome do Projeto <span className="text-red-500">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              placeholder="Ex: BackEnd - Commit Explorer"
              className="w-full p-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all hover:border-stone-300"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-stone-700 mb-2">Data de Início</label>
              <input
                id="startDate"
                type="date"
                className="w-full p-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-700 transition-all hover:border-stone-300"
                value={startDate}
                onChange={e => {
                  const v = e.target.value;
                  setStartDate(v);
                  if (endDate && v) {
                    const max = addMonths(toDateOnly(v), 12);
                    max.setDate(max.getDate() - 1);
                    const end = toDateOnly(endDate);
                    if (end < toDateOnly(v) || end > max) {
                      setEndDate('');
                    }
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-stone-700 mb-2">Data de Fim</label>
              <input
                id="endDate"
                type="date"
                className="w-full p-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-700 transition-all hover:border-stone-300"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={endDateMin}
                max={endDateMax}
              />
              {startDate && (
                <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  O período deve ser menor que 12 meses a partir da data inicial.
                </p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="projectLink" className="block text-sm font-semibold text-stone-700 mb-2">
              Link do Projeto Principal no GitHub
            </label>
            <input
              id="projectLink"
              type="url"
              placeholder="https://github.com/usuario/projeto"
              className="w-full p-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all hover:border-stone-300"
              value={projectLink}
              onChange={e => setProjectLink(e.target.value)}
            />
            <p className="text-xs text-stone-500 mt-2">Este link é usado para acessar as Issues, Pull Requests, etc.</p>
          </div>

          <div className="border-t border-stone-200 pt-6">
            <h4 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-600" />
              Repositórios para Análise de Commits
            </h4>
            <div className="space-y-4">
              {repositories.map((repo, index) => (
                <div key={`repo-${index}-${repo.url}`} className="bg-stone-50/50 border-2 border-stone-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200">
                  <RepoInputGroup
                    index={index}
                    repo={repo}
                    onChange={updateRepository}
                    onRemove={removeRepository}
                    showRemove={index > 0}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRepository}
              className="mt-6 w-full border-2 border-dashed border-stone-300 rounded-xl p-4 text-stone-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Adicionar outro repositório</span>
            </button>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading || !hasToken}
              className={`font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 ${
                loading || !hasToken
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  <span>Iniciar Análise</span>
                </>
              )}
            </button>
          </div>
          {!hasToken && (
            <p className="text-sm text-amber-600 mt-3 text-right flex items-center justify-end gap-1">
              <AlertTriangle className="w-4 h-4" />
              Configure seu token GitHub para habilitar a análise
            </p>
          )}
        </form>
      </section>

      {/* Modal do Token GitHub */}
      <GitHubTokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSave={saveToken}
      />
    </div>
  );
}
