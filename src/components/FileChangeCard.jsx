import React, { useState, useMemo } from 'react';
import { ChevronDown, File, AlertCircle } from 'lucide-react';
import CodeSmellCard from './CodeSmellCard';
import { Diff, Hunk, parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';

const actionClasses = {
  ADICIONADO: 'bg-emerald-100 text-emerald-800',
  MODIFICADO: 'bg-yellow-100 text-yellow-800',
  REMOVIDO: 'bg-red-100 text-red-800',
  RENOMEADO: 'bg-sky-100 text-sky-800',
};

const mapActionToDiffType = {
  ADICIONADO: 'add',
  MODIFICADO: 'modify',
  REMOVIDO: 'delete',
  RENOMEADO: 'modify',
};

export default function FileChangeCard({ file }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSmells = file.analisesCodigos && file.analisesCodigos.filter(s => s.tipo !== 'INFO').length > 0;

    const diff = useMemo(() => {
    const isJavaFile = file.nomeArquivo?.endsWith('.java');
    const hasContent = file.conteudoAntes || file.conteudoDepois;

    if (!isJavaFile || !hasContent) return null;

    try {
        const conteudoAntes = (file.conteudoAntes || '').split('\n').map(l => `-${l}`).join('\n');
        const conteudoDepois = (file.conteudoDepois || '').split('\n').map(l => `+${l}`).join('\n');
        const diffText = `--- a/${file.nomeArquivo}\n+++ b/${file.nomeArquivo}\n${conteudoAntes}\n${conteudoDepois}`;

        const parsed = parseDiff(diffText, { nearbySequences: 'zip' });
        return parsed?.[0] || null;
    } catch (err) {
        console.warn('Erro ao gerar diff:', err);
        return null;
    }
    }, [file]);


  return (
    <div className="border border-stone-200 rounded-lg bg-white overflow-hidden">
      <header 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <File className="w-5 h-5 text-stone-500 flex-shrink-0" />
          <span className="font-mono text-sm truncate">{file.nomeArquivo}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm flex items-center gap-2">
            <span className="text-green-600 font-bold">+{file.qtdLinhasAdicionadas}</span>
            <span className="text-red-600 font-bold">-{file.qtdLinhasRemovidas}</span>
          </div>
          {hasSmells && (
            <div className="flex items-center gap-1 text-sm font-bold text-orange-600">
              <AlertCircle size={16} />
              {file.analisesCodigos.filter(s => s.tipo !== 'INFO').length}
            </div>
          )}
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${actionClasses[file.flgTipoAcao]}`}>
            {file.flgTipoAcao}
          </span>
          <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </header>

      {isOpen && (
        <div className="border-t border-stone-200">
          {hasSmells && (
            <div className="bg-stone-50 p-4 space-y-3">
              <h4 className="font-bold text-stone-700">Code Smells Identificados</h4>
              {file.analisesCodigos.map(smell => (
                <CodeSmellCard key={smell.id} smell={smell} />
              ))}
            </div>
          )}
          
          {diff && diff.hunks ? (
            <div className="font-mono text-sm">
              <Diff viewType="split" diffType={mapActionToDiffType[file.flgTipoAcao]} hunks={diff.hunks}>
                {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
              </Diff>
            </div>
          ) : (
            <p className="p-4 text-sm text-stone-500 bg-stone-50 text-center">
              Visualização de diff disponível apenas para arquivos .java.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
