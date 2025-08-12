import React from 'react';

const Icon = ({ name }) => <i className={`bi bi-${name}`}></i>;

export default function AnalysisHeader({ studentName, repoName, onUpdate }) {
  return (
    <div>
      <div className="p-6 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Icon name="graph-up" />
          Dashboard de Análise de Commits
        </h1>
        <p className="opacity-75 mt-1">
          Análise detalhada para: <strong>{studentName} - {repoName}</strong>
        </p>
      </div>

      <div className="card bg-base-100 shadow-md my-6">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4"><Icon name="funnel" /> Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Data de Início</span>
              </label>
              <input type="date" className="input input-bordered w-full" defaultValue="2024-01-01" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Data de Fim</span>
              </label>
              <input type="date" className="input input-bordered w-full" defaultValue="2024-01-10" />
            </div>
            <div className="form-control w-full md:col-span-2">
              <button className="btn btn-primary" onClick={onUpdate}>
                <Icon name="arrow-clockwise" /> Atualizar Análise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}