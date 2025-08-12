import React from 'react';

const complexityClasses = {
  'Alta': 'badge-error',
  'Média': 'badge-warning',
  'Baixa': 'badge-success',
};

export default function CommitsTable({ commits }) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title"><i className="bi bi-table me-2"></i>Detalhes dos Commits</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Data/Hora</th>
                <th>Mensagem</th>
                <th>Alterações</th>
                <th>Complexidade</th>
              </tr>
            </thead>
            <tbody>
              {commits.map((commit, index) => (
                <tr key={index} className="hover">
                  <td><kbd className="kbd kbd-sm">{commit.hash}</kbd></td>
                  <td>{commit.date}</td>
                  <td title={commit.message} className="max-w-xs truncate">{commit.message}</td>
                  <td>
                    <span className="text-success font-mono">+{commit.additions}</span> / 
                    <span className="text-error font-mono">-{commit.deletions}</span>
                  </td>
                  <td>
                    <span className={`badge ${complexityClasses[commit.complexity] || 'badge-ghost'}`}>
                      {commit.complexity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}