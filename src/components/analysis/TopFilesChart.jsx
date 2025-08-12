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

const GRADIENT_FROM = '#FDDA97FF';
const GRADIENT_TO  = '#FFD06CFF';
const BORDER_COLOR = '#FFD06CFF';
const LABEL_COLOR  = '#44403c';

function truncatePath(path, maxLength = 30) {
 if (path.length <= maxLength) return path;
 const startLength = Math.floor(maxLength / 2) - 2;
 const endLength = Math.floor(maxLength / 2) - 2;
 return `${path.substring(0, startLength)}...${path.substring(path.length - endLength)}`;
}

export default function TopFilesChart({ data = [] }) {
 const { chartData, options } = useMemo(() => {
    if (!data || data.length === 0) {
        return { chartData: null, options: null };
    }
  const sortedData = [...data].sort((a, b) => b.totalAlteracoes - a.totalAlteracoes);
  const fullLabels = sortedData.map(item => item.nomeArquivo);
  const truncatedLabels = fullLabels.map(label => truncatePath(label));

  const chartData = {
   labels: truncatedLabels,
   datasets: [{
    label: 'Alterações',
    data: sortedData.map(item => item.totalAlteracoes),
    backgroundColor: (ctx) => {
     const { chart } = ctx;
     const { ctx: c, chartArea } = chart;
     if (!chartArea) return GRADIENT_TO;
     const g = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
     g.addColorStop(0, GRADIENT_FROM);
     g.addColorStop(1, GRADIENT_TO);
     return g;
    },
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 6,
    hoverBackgroundColor: GRADIENT_TO,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
   }],
  };

  const options = {
   indexAxis: 'y',
   responsive: true,
   maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
   plugins: {
    legend: { display: false },
    tooltip: {
          backgroundColor: 'rgba(17,17,17,0.92)',
          titleColor: '#fff',
          bodyColor: '#fff',
          displayColors: false,
          padding: 10,
     callbacks: {
      title: (items) => fullLabels[items[0].dataIndex],
            label: (ctx) => `  Alterações: ${ctx.parsed.x}`,
     },
    },
   },
   scales: {
    x: {
     grid: { drawBorder: false, display: false },
     ticks: { display: false },
          beginAtZero: true,
    },
    y: {
     grid: { display: false },
     ticks: { color: LABEL_COLOR, font: { size: 11 } },
    },
   },
  };

  return { chartData, options };
 }, [data]);

  if (!chartData) {
    return (
      <ChartCard title="Top Arquivos Modificados">
        <div className="h-full flex items-center justify-center text-stone-500">
          Sem dados para exibir.
        </div>
      </ChartCard>
    );
  }

 return (
  <ChartCard title="Top Arquivos Modificados">
      <div className="h-full w-full">
     <Bar options={options} data={chartData} />
      </div>
  </ChartCard>
 );
}