import React, { useState } from 'react';

export default function EvaluationSection({ score }) {
  const [feedback, setFeedback] = useState('');

  const handleSave = () => {
    console.log("Salvando avaliação:", { score, feedback });
  };

  return (
    <div className="card bg-base-200/50 shadow-md my-8">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4"><i className="bi bi-clipboard-check me-2"></i>Avaliação do Aluno</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-success mb-2"><i className="bi bi-check-circle me-2"></i>Pontos Positivos</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Frequência consistente de commits</li>
                  <li>Mensagens de commit descritivas</li>
                  <li>Boa variedade de tipos de commits</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-warning mb-2"><i className="bi bi-exclamation-triangle me-2"></i>Pontos de Melhoria</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Alguns commits com alta complexidade</li>
                  <li>Concentração de atividade em horários específicos</li>
                </ul>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Feedback Adicional</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-32" 
                placeholder="Adicione comentários específicos sobre o desempenho do aluno..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center p-6 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg shadow-lg w-full">
              <h3 className="mb-2">Nota Sugerida</h3>
              <p className="text-6xl font-black tracking-tight">{score}</p>
              <p className="opacity-75 mb-4">Bom desempenho geral</p>
              <button className="btn btn-ghost" onClick={handleSave}>
                <i className="bi bi-save me-2"></i>Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}