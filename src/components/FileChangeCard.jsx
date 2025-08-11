import React, { useState, useMemo } from 'react';
import { ChevronDown, File, AlertCircle } from 'lucide-react';
import CodeSmellCard from './CodeSmellCard';
import { Diff, Hunk, parseDiff, markEdits, Decoration } from 'react-diff-view';
import * as DiffLib from 'diff';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
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

const MAX_CHARS = 1_500_000;
const INTRA_MODE = 'char';

const ensureLfNoFinal = (s) => String(s ?? '').replace(/\r\n|\r/g, '\n');
const ensureLf = (s) => {
  const t = ensureLfNoFinal(s);
  return t.endsWith('\n') ? t : t + '\n';
};

function normalizeForCompareNoFinal(s) {
  return ensureLfNoFinal(s)
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .join('\n');
}

function buildNaiveUnifiedPatch(nomeArquivo, beforeRaw, afterRaw, acao) {
  const before = acao === 'ADICIONADO' ? '' : (beforeRaw ?? '');
  const after  = acao === 'REMOVIDO'   ? '' : (afterRaw  ?? '');
  const beforeLines = before ? before.split('\n') : [];
  const afterLines  = after  ? after.split('\n')  : [];
  const normCount = (arr) => (arr.length && arr[arr.length - 1] === '' ? arr.length - 1 : arr.length);
  const oldStart = beforeLines.length ? 1 : 0;
  const newStart = afterLines.length ? 1 : 0;
  const oldCount = normCount(beforeLines);
  const newCount = normCount(afterLines);
  const lines = [
    `--- a/${nomeArquivo}`,
    `+++ b/${nomeArquivo}`,
    `@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`,
    ...beforeLines.map((l) => `-${l}`),
    ...afterLines.map((l) => `+${l}`),
    '',
  ];
  return lines.join('\n');
}

function tryParse(patch) {
  try {
    const files = parseDiff(patch, { nearbySequences: 'zip' });
    if (files?.[0]?.hunks?.length) return files[0];
    return null;
  } catch {
    return null;
  }
}

function genParsed(nomeArquivo, before, after, opts) {
  return (
    tryParse(DiffLib.createTwoFilesPatch(`a/${nomeArquivo}`, `b/${nomeArquivo}`, before, after, '', '', opts) + '\n') ||
    tryParse(DiffLib.createPatch(nomeArquivo, before, after, '', '', opts) + '\n') ||
    tryParse(buildNaiveUnifiedPatch(nomeArquivo, before, after, 'MODIFICADO'))
  );
}

function keepOnlyChanges(hunks) {
  if (!Array.isArray(hunks)) return [];
  return hunks
    .map((h) => ({
      ...h,
      lines: (h.lines || []).filter((ln) => ln.type === 'insert' || ln.type === 'delete'),
    }))
    .filter((h) => h.lines.length > 0);
}

function safeParseDiff({ nomeArquivo, flgTipoAcao, conteudoAntes, conteudoDepois }) {
  const beforeRawIn = String(conteudoAntes ?? '');
  const afterRawIn  = String(conteudoDepois ?? '');

  let beforeLF = ensureLfNoFinal(beforeRawIn);
  let afterLF  = ensureLfNoFinal(afterRawIn);

  if (flgTipoAcao === 'ADICIONADO') beforeLF = '';
  if (flgTipoAcao === 'REMOVIDO')   afterLF  = '';

  const beforeCalc = normalizeForCompareNoFinal(beforeLF);
  const afterCalc  = normalizeForCompareNoFinal(afterLF);

  const totalChars = (beforeLF.length + afterLF.length);
  if (totalChars > MAX_CHARS) return { parsedDiff: null, tooBig: true, whitespaceOnly: false };

  const optsRaw = { context: 3 };
  const optsTight = { context: 0 }; 

  let parsed = genParsed(nomeArquivo, ensureLf(beforeLF), ensureLf(afterLF), optsRaw);
  if (parsed) {
    const whitespaceOnly = beforeCalc === afterCalc && beforeLF !== afterLF;
    parsed.hunks = keepOnlyChanges(parsed.hunks);
    parsed.oldPath = `a/${nomeArquivo}`;
    parsed.newPath = `b/${nomeArquivo}`;
    return { parsedDiff: parsed, tooBig: false, whitespaceOnly };
  }

  parsed = genParsed(nomeArquivo, ensureLf(beforeCalc), ensureLf(afterCalc), optsTight);
  if (parsed) {
    parsed.hunks = keepOnlyChanges(parsed.hunks);
    parsed.oldPath = `a/${nomeArquivo}`;
    parsed.newPath = `b/${nomeArquivo}`;
    return { parsedDiff: parsed, tooBig: false, whitespaceOnly: false };
  }

  const rawEqual = beforeRawIn === afterRawIn;
  const calcEqual = beforeCalc === afterCalc;
  const whitespaceOnly = calcEqual && !rawEqual;

  return { parsedDiff: null, tooBig: false, whitespaceOnly };
}

function renderToken(token) {
  const html = Prism.highlight(token.value ?? '', Prism.languages.java, 'java');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function resolveSmellLine(smell) {
  const newLine = smell?.linha ?? smell?.line ?? smell?.lineNumber ?? smell?.linhaDepois ?? null;
  const oldLine = smell?.linhaAntes ?? null;
  return { oldLine, newLine };
}
function buildSmellLineMaps(smells) {
  const byOld = new Map();
  const byNew = new Map();
  for (const s of smells) {
    const { oldLine, newLine } = resolveSmellLine(s);
    if (Number.isInteger(oldLine) && oldLine > 0) {
      if (!byOld.has(oldLine)) byOld.set(oldLine, []);
      byOld.get(oldLine).push(s);
    }
    if (Number.isInteger(newLine) && newLine > 0) {
      if (!byNew.has(newLine)) byNew.set(newLine, []);
      byNew.get(newLine).push(s);
    }
  }
  return { byOld, byNew };
}

function PlainDiff({ beforeText, afterText }) {
  const parts = DiffLib.diffLines(beforeText ?? '', afterText ?? '');
  return (
    <div className="font-mono text-xs leading-5 overflow-auto">
      {parts.map((p, i) => {
        if (p.added) return <pre key={i} className="bg-emerald-50 px-3 py-1">+ {p.value}</pre>;
        if (p.removed) return <pre key={i} className="bg-red-50 px-3 py-1">- {p.value}</pre>;
        return null;
      })}
    </div>
  );
}

export default function FileChangeCard({ file }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    nomeArquivo = 'arquivo-desconhecido',
    flgTipoAcao = 'MODIFICADO',
    conteudoAntes = '',
    conteudoDepois = '',
    qtdLinhasAdicionadas = 0,
    qtdLinhasRemovidas = 0,
    analisesCodigos = [],
  } = file ?? {};

  const smells = useMemo(
    () => (Array.isArray(analisesCodigos) ? analisesCodigos.filter((s) => s?.tipo !== 'INFO') : []),
    [analisesCodigos]
  );
  const hasSmells = smells.length > 0;

  const { byOld: smellByOldLine, byNew: smellByNewLine } = useMemo(
    () => buildSmellLineMaps(smells),
    [smells]
  );

  const parsedState = useMemo(() => safeParseDiff({
    nomeArquivo, flgTipoAcao, conteudoAntes, conteudoDepois
  }), [nomeArquivo, flgTipoAcao, conteudoAntes, conteudoDepois]);

  const { parsedDiff, tooBig, whitespaceOnly } = parsedState;

  const hunksForView = useMemo(() => {
    const hs = parsedDiff?.hunks ? [...parsedDiff.hunks] : [];
    if (hs.length) {
      try { markEdits(hs, { type: INTRA_MODE }); } catch {}
    }
    return hs;
  }, [parsedDiff]);

  const showDiff = hunksForView.length > 0;

  let diffMessage = '';
  if (tooBig) diffMessage = 'Arquivo muito grande para visualizar o diff aqui.';
  else diffMessage = 'Não foi possível gerar o diff para este arquivo.';

  return (
    <div className="border border-stone-200 rounded-lg bg-white overflow-hidden">
      <header
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <File className="w-5 h-5 text-stone-500 flex-shrink-0" />
          <span className="font-mono text-sm truncate" title={nomeArquivo}>
            {nomeArquivo}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-sm flex items-center gap-2" title="Linhas adicionadas/removidas">
            <span className="text-green-600 font-bold">+{qtdLinhasAdicionadas ?? 0}</span>
            <span className="text-red-600 font-bold">-{qtdLinhasRemovidas ?? 0}</span>
          </div>

          {hasSmells && (
            <div className="flex items-center gap-1 text-sm font-bold text-orange-600" title="Code smells (exclui INFO)">
              <AlertCircle size={16} />
              {smells.length}
            </div>
          )}

          <span className={`text-xs font-bold px-2 py-1 rounded-full ${actionClasses[flgTipoAcao] ?? 'bg-stone-100 text-stone-800'}`}>
            {flgTipoAcao}
          </span>

          <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </header>

      {isOpen && (
        <div className="border-t border-stone-200">

          {hasSmells && (
            <div className="bg-stone-50 p-4 space-y-3">
              <h4 className="font-bold text-stone-700">Code Smells Identificados</h4>
              {smells.map((smell) => (
                <CodeSmellCard key={smell.id ?? `${smell.tipo}-${smell.descricaoSmell}`} smell={smell} />
              ))}
            </div>
          )}

          {whitespaceOnly && (
            <div className="px-4 py-2 text-xs text-stone-600 bg-amber-50 border-b border-amber-200">
              Mudanças apenas de formatação (EOL/indentação/espaços).
            </div>
          )}

          {showDiff ? (
            <div className="file-diff-container">
              <div className="font-mono text-sm">
                <Diff
                  viewType="split"
                  diffType={mapActionToDiffType[flgTipoAcao] ?? 'modify'}
                  hunks={hunksForView}
                  renderToken={renderToken}
                  highlight
                >
                  {(hunks) => (
                    <>
                      <Decoration>
                        {[
                          <span key="old" className="px-2">a/{nomeArquivo}</span>,
                          <span key="new" className="px-2">b/{nomeArquivo}</span>,
                        ]}
                      </Decoration>

                      {hunks.map((hunk) => (
                        <Hunk
                          key={`${hunk.content}-${hunk.oldStart}-${hunk.newStart}`}
                          hunk={hunk}
                          renderGutter={(props) => {
                            const { side, lineNumber, renderDefault, className, ...rest } = props;
                            const smellsForLine = side === 'old'
                              ? smellByOldLine.get(lineNumber)
                              : smellByNewLine.get(lineNumber);

                            return (
                              <div className={`relative ${className || ''}`} {...rest}>
                                {renderDefault()}
                                {smellsForLine?.length ? (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                                    <span
                                      className="smell-badge"
                                      title={smellsForLine.map(s => s.descricaoSmell || s.tipo).join('\n')}
                                    >
                                      !
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }}
                          renderContent={(props) => {
                            const { side, line, renderDefault, className, ...rest } = props;
                            const lineNumber = side === 'old' ? line.oldLineNumber : line.newLineNumber;
                            const smellsForLine = side === 'old'
                              ? smellByOldLine.get(lineNumber)
                              : smellByNewLine.get(lineNumber);

                            const extra = smellsForLine?.length ? 'smell-highlight' : '';
                            return (
                              <div className={`${className || ''} ${extra}`} {...rest}>
                                {renderDefault()}
                              </div>
                            );
                          }}
                        />
                      ))}
                    </>
                  )}
                </Diff>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <PlainDiff beforeText={ensureLfNoFinal(conteudoAntes)} afterText={ensureLfNoFinal(conteudoDepois)} />
              {!tooBig && !whitespaceOnly && (
                <p className="mt-2 text-xs text-stone-500">
                  Exibição alternativa por não conseguir parsear um patch unificado.
                </p>
              )}
              {tooBig && (
                <p className="mt-2 text-xs text-stone-500">
                  Arquivo grande demais para o visualizador padrão.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
