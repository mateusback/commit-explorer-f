import React, { useMemo, useState } from 'react';
import { PlusCircle, PlayCircle, Loader2 } from 'lucide-react';
import RepoInputGroup from '../components/input/RepoInputGroup';
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
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(false);

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
      setShowResults(true);
      NotificationService.success('Análise iniciada com sucesso!');
    } catch (err) {
      NotificationService.error(err.message || 'Erro ao analisar repositórios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg mb-8 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-emerald-600 mb-1">Analisar Repositórios</h3>
        <p className="text-stone-500 mb-6">Insira os detalhes para iniciar a análise.</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-600 mb-1">
            Nome do Projeto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: BackEnd - Commit Explorer"
            className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Data de Início</label>
            <input
              type="date"
              className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
            <label className="block text-sm font-medium text-stone-600 mb-1">Data de Fim</label>
            <input
              type="date"
              className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={endDateMin}
              max={endDateMax}
            />
            {startDate && (
              <p className="text-xs text-stone-400 mt-1">
                O período deve ser menor que 12 meses a partir da data inicial.
              </p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-stone-600 mb-1">Link do Projeto Principal no GitHub</label>
          <input
            type="url"
            placeholder="https://github.com/usuario/projeto"
            className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            value={projectLink}
            onChange={e => setProjectLink(e.target.value)}
          />
          <p className="text-xs text-stone-400 mt-1">Este link é usado para acessar as Issues, Pull Requests, etc.</p>
        </div>

        <h4 className="text-lg font-semibold text-emerald-600 mb-4 border-t pt-4">Repositórios para Análise de Commits</h4>
        <div className="space-y-4">
          {repositories.map((repo, index) => (
            <RepoInputGroup
              key={index}
              index={index}
              repo={repo}
              onChange={updateRepository}
              onRemove={removeRepository}
              showRemove={index > 0}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addRepository}
          className="mt-4 flex items-center space-x-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Adicionar outro repositório</span>
        </button>

        <div className="mt-8 border-t pt-6 flex justify-end">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg shadow hover:shadow-md transition-all duration-150 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analisando...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span>Analisar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
