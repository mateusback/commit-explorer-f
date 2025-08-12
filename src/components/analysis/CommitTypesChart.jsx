import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartCard from './ChartCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const TIPO_COMMIT_CORES = {
  FEATURE: '#60a5fa',
  BUGFIX: '#f87171',
  REFACTOR: '#818cf8',
  PERFORMANCE: '#a78bfa',
  DOCUMENTATION: '#34d399',
  TEST: '#2dd4bf',
  BUILD: '#94a3b8',
  CI: '#38bdf8',
  CHORE: '#a1a1aa',
  STYLE: '#f472b6',
  CLEANUP: '#22d3ee',
  REMOVE: '#fb923c',
  DEFAULT: '#9ca3af',
};

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea, options } = chart;
      if (!chartArea || !options) return;

      const total = options.plugins?.centerText?.total ?? 0;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = 'bold 2.5rem sans-serif';
      ctx.fillStyle = 'hsl(var(--bc, 0 0% 20%))';
      ctx.fillText(String(total), centerX, centerY - 10);

      ctx.font = '0.9rem sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText('Total', centerX, centerY + 20);
      ctx.restore();
    },
  };

export default function CommitTypesChart({ data }) {
  const totalCommits = useMemo(
    () => data.reduce((sum, item) => sum + (item.quantidadeCommits || 0), 0),
    [data]
  );

  const chartData = useMemo(() => {
    const labels = data.map((item) => item.tipoCommit || '—');
    const values = data.map((item) => item.quantidadeCommits || 0);
    const colors = data.map((item) => {
      const key = (item.tipoCommit || '').toUpperCase();
      return TIPO_COMMIT_CORES[key] || TIPO_COMMIT_CORES.DEFAULT;
    });

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 16,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const label = context.label || '';
              const value = context.parsed ?? 0;
              const percentage =
                totalCommits > 0 ? ((value / totalCommits) * 100).toFixed(1) : '0.0';
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
        centerText: { total: totalCommits },
      },
    }),
    [totalCommits]
  );

  return (
    <ChartCard title="Tipos de Commits">
      <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
    </ChartCard>
  );
}
