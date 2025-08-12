import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCommitDetails } from '../services/CommitService';
import { Loader2, Copy, Check, ArrowUp, ArrowDown, FileText, AlertCircle, Award } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import FileChangeCard from '../components/FileChangeCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ScoreStatCard({ score }) {
  const getScoreColor = (s) => {
    if (s >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' };
    if (s >= 50) return { text: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'ring-yellow-200' };
    return { text: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200' };
  };
  const colors = getScoreColor(score);

  return (
    <div className={`p-4 rounded-lg shadow-sm flex items-center gap-4 ${colors.bg} ring-2 ${colors.ring}`}>
      <Award size={32} className={colors.text} />
      <div>
        <p className={`text-3xl font-bold ${colors.text}`}>{score.toFixed(2)}</p>
        <p className={`text-sm font-semibold ${colors.text}`}>Pontuação de Qualidade</p>
      </div>
    </div>
  )
}

function StatItem({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-4">
      <div className="flex-shrink-0 text-stone-500">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-stone-800">{value}</p>
        <p className="text-sm text-stone-500">{label}</p>
      </div>
    </div>
  )
}

export default function CommitDetailsView() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const { data: commit, isLoading, isError, error } = useQuery({
    queryKey: ['commitDetails', id],
    queryFn: () => fetchCommitDetails(id),
  });

  const handleCopy = () => {
    if (commit?.hash) {
      navigator.clipboard.writeText(commit.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </section>
    );
  }

  if (isError) {
    return <p className="text-red-500 p-6">Erro ao carregar detalhes do commit: {error.message}</p>;
  }

  if (!commit) {
    return <p className="text-stone-500 p-6">Detalhes do commit não encontrados.</p>;
  }

  const totalCodeSmells = commit.arquivosAlterados.reduce((acc, file) => acc + file.analisesCodigos.filter(s => s.tipo !== 'INFO').length, 0);

  return (
    <div className="space-y-8 p-4 md:p-6">
      <section className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">{commit.mensagem.split('\n')[0]}</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500 mb-6">
          <Link to={`/autores/${commit.autor.id}`} className="flex items-center gap-2 hover:text-emerald-600">
            <UserAvatar autor={commit.autor} className="w-6 h-6" />
            <span className="font-bold">{commit.autor.nome}</span>
          </Link>
          <span>Commit em <strong className="text-stone-600">{format(new Date(commit.dataCommit), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}</strong></span>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-sm bg-stone-100 p-2 rounded-lg">
          <span className="text-stone-600">hash:</span>
          <span className="text-emerald-700 truncate">{commit.hash}</span>
          <button onClick={handleCopy} className="ml-auto p-1.5 rounded-md hover:bg-stone-200">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreStatCard score={commit.pontuacao} />
        <StatItem icon={<AlertCircle size={32}/>} label="Total de Code Smells" value={totalCodeSmells} />
        <StatItem icon={<FileText size={32}/>} label="Arquivos Alterados" value={commit.totalArquivosAlterados} />
        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="text-center">
                <p className="text-2xl font-bold text-green-600">+{commit.linhasAdicionadas}</p>
                <p className="text-sm text-stone-500">Linhas Adicionadas</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-red-600">-{commit.linhasRemovidas}</p>
                <p className="text-sm text-stone-500">Linhas Removidas</p>
            </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-emerald-600 mb-4">Análise dos Arquivos Alterados</h3>
        <div className="space-y-3">
          {commit.arquivosAlterados.map(file => (
            <FileChangeCard key={file.id} file={file} />
          ))}
        </div>
      </section>
    </div>
  );
}