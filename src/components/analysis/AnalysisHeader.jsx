import React from 'react';
import { ArrowLeft, Calendar, GitBranch, GitCommit, Trash2, MoreVertical } from 'lucide-react';
import { extractRepoNameFromUrl } from '../../utils/RepoUtils';

export default function AnalysisPageHeader({ 
  projectName, 
  repoUrl, 
  branchName, 
  startDate, 
  endDate, 
  projectId, 
  analysisId, 
  onDeleteAnalysis, 
  showDeleteButton = false 
}) {
  const repoName = extractRepoNameFromUrl(repoUrl);
  
  return (
    <header className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-stone-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <a href={`/projeto/${projectId}`} className="flex items-center text-sm text-stone-500 hover:text-emerald-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o Projeto
          </a>
          <h1 className="text-3xl font-bold text-stone-800">
            {repoName || projectName || 'Análise do Projeto'}
          </h1>
          {repoName && projectName && repoName !== projectName && (
            <p className="text-lg text-stone-600 mt-1">{projectName}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-100 px-3 py-2 rounded-lg">
            <Calendar size={16} className="text-stone-500" />
            <strong>Período:</strong>
            <span>{startDate} - {endDate}</span>
          </div>
          
          {showDeleteButton && onDeleteAnalysis && (
            <button
              onClick={onDeleteAnalysis}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir Análise"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Excluir</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="divider my-4"></div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <GitBranch size={16} />
          <strong>Repositório:</strong>
          <span className="font-mono text-emerald-700">{repoUrl || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <GitCommit size={16} />
          <strong>Branch:</strong>
          <span>{branchName || 'N/A'}</span>
        </div>
      </div>
    </header>
  );
}