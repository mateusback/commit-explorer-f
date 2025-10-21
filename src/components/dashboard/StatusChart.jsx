import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Activity, CheckCircle2, Loader2, XCircle } from 'lucide-react';

export default function StatusChart({ completed, inProgress, failed }) {
  const total = completed + inProgress + failed;

  const data = {
    labels: ['Concluídas', 'Em Andamento', 'Falhadas'],
    datasets: [
      {
        data: [completed, inProgress, failed],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200/60">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center ring-4 ring-purple-50 mr-3">
          <Activity className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-800">Status das Análises</h3>
          <p className="text-xs text-stone-600">Distribuição por estado</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-4" style={{ height: '200px' }}>
        <div className="relative w-full h-full">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-stone-800">{total}</p>
              <p className="text-xs text-stone-600 font-medium">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-stone-700">Concluídas</span>
          </div>
          <span className="text-sm font-bold text-emerald-700">{completed}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-stone-700">Em Andamento</span>
          </div>
          <span className="text-sm font-bold text-blue-700">{inProgress}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-stone-700">Falhadas</span>
          </div>
          <span className="text-sm font-bold text-red-700">{failed}</span>
        </div>
      </div>
    </div>
  );
}
