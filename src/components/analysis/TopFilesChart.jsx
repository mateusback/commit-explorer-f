import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Gradiente moderno (pastel → vibrante)
const GRADIENT_FROM = '#a5b4fc'; // indigo-300
const GRADIENT_TO   = '#60a5fa'; // blue-400
const BORDER_COLOR  = '#60a5fa';
const LABEL_COLOR   = '#334155'; // slate-700

function truncatePath(path, maxLength = 30) {
  if (path.length <= maxLength) return path;
  const startLength = Math.floor(maxLength / 2) - 2;
  const endLength = Math.floor(maxLength / 2) - 2;
  return `${path.substring(0, startLength)}...${path.substring(path.length - endLength)}`;
}

export default function TopFilesChart({ data }) {
  const { chartData, options } = useMemo(() => {
    const fullLabels = data.map(item => item.nomeArquivo);
    const truncatedLabels = fullLabels.map(label => truncatePath(label));

    const chartData = {
      labels: truncatedLabels,
      datasets: [{
        label: 'Alterações',
        data: data.map(item => item.totalAlteracoes),
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return GRADIENT_TO; // fallback no first render
          const g = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          g.addColorStop(0, GRADIENT_FROM);
          g.addColorStop(1, GRADIENT_TO);
          return g;
        },
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: BORDER_COLOR,
      }],
    };

    const options = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => fullLabels[items[0].dataIndex],
          },
        },
        // Se você tiver o chartjs-plugin-datalabels instalado e registrado, isso funciona.
        // Caso não tenha, pode deixar ou remover sem quebrar.
        datalabels: {
          display: true,
          color: LABEL_COLOR,
          anchor: 'end',
          align: 'end',
          offset: 8,
          font: { weight: 'bold', size: 12 },
          formatter: (value) => value,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { display: false },
        },
        y: {
          grid: { display: false },
          ticks: { color: LABEL_COLOR },
        },
      },
    };

    return { chartData, options };
  }, [data]);

  return (
    <ChartCard title="Top Arquivos Modificados">
      <Bar options={options} data={chartData} />
    </ChartCard>
  );
}
