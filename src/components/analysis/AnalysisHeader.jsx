import React from 'react';
import { ArrowLeft, Calendar, GitBranch, GitCommit } from 'lucide-react';

export default function AnalysisPageHeader({ projectName, repoUrl, branchName, startDate, endDate, projectId }) {
  return (
    <header className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-stone-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <a href={`/projeto/${projectId}`} className="flex items-center text-sm text-stone-500 hover:text-emerald-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o Projeto
          </a>
          <h1 className="text-3xl font-bold text-stone-800">
            {projectName || 'Análise do Projeto'}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-100 px-3 py-2 rounded-lg mt-4 md:mt-0">
          <Calendar size={16} className="text-stone-500" />
          <strong>Período:</strong>
          <span>{startDate} - {endDate}</span>
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