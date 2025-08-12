import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Filler, Legend);

const lineShadowPlugin = {
  id: 'lineShadow',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    ctx.save();
  },
  afterDatasetsDraw: (chart) => {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.dataset) return;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    meta.dataset.draw(ctx);
    ctx.restore();
  },
};

export default function CommitFrequencyChart({ data = [] }) {
  const canvasRef = useRef(null);

  const labels = useMemo(
    () =>
      data.map((item) =>
        new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      ),
    [data]
  );

  const backgroundColor = (ctx) => {
    const { chart } = ctx;
    const { ctx: context, chartArea } = chart;
    if (!chartArea) return 'rgba(16, 185, 129, 0.1)';

    const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
    return gradient;
  };

  const primaryStroke = '#10b981';
  const gridColor = 'rgba(0,0,0,0.06)';
  const tickColor = 'rgba(0,0,0,0.55)';

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Commits',
          data: data.map((item) => item.quantidadeCommits),
          backgroundColor,
          borderColor: primaryStroke,
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointHitRadius: 12,
          pointBorderWidth: 0,
          pointBackgroundColor: primaryStroke,
        },
      ],
    }),
    [labels, data]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        title: {
          display: false,
          text: 'Frequência de Commits',
          color: 'var(--fallback-bc, rgb(28,28,28))',
          font: { weight: '600', size: 16 },
          padding: { top: 8, bottom: 16 },
        },
        tooltip: {
          intersect: false,
          mode: 'index',
          padding: 12,
          backgroundColor: 'rgba(17,17,17,0.92)',
          titleColor: '#fff',
          bodyColor: '#fff',
          displayColors: false,
          callbacks: {
            title: (items) => items[0]?.label ?? '',
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
          },
        },
      },
      layout: { padding: { right: 8, left: 8 } },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tickColor,
            maxRotation: 0,
            autoSkip: true,
            autoSkipPadding: 14,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: tickColor,
            precision: 0,
            padding: 8,
          },
          suggestedMax: Math.max(...data.map(d => d.quantidadeCommits || 0), 5),
        },
      },
    }),
    [data]
  );

  if (!data?.length) {
    return (
      <ChartCard title="Frequência de Commits">
        <div className="h-64 flex items-center justify-center text-stone-500">
          Sem dados para exibir.
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Frequência de Commits">
      <div className="h-full w-full">
        <Line ref={canvasRef} options={options} data={chartData} plugins={[lineShadowPlugin]} />
      </div>
    </ChartCard>
  );
}
