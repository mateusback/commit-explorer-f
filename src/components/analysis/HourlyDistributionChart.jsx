import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function HourlyDistributionChart({ data = [] }) {
  const canvasRef = useRef(null);

  const rows = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data]
      .map(r => ({
        hora: (r?.horario || '').slice(0, 5),
        hourNum: Number((r?.horario || '00:00').slice(0, 2)) || 0,
        total: Number(r?.totalCommits) || 0,
      }))
      .sort((a, b) => a.hourNum - b.hourNum);
  }, [data]);

  const labels = rows.map(r => r.hora);
  const values = rows.map(r => r.total);
  const maxValue = values.length ? Math.max(...values) : 0;

  const barFill = (ctx) => {
    const { chart } = ctx;
    const { ctx: context, chartArea } = chart || {};
    if (!chartArea) return 'rgba(46,184,114,0.50)';
    const g = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, 'rgba(46,184,114,0.65)');
    g.addColorStop(1, 'rgba(46,184,114,0.60)');
    return g;
  };

  const highlightColor = 'rgba(46,184,114,1)';
  const borderColor = 'rgba(34,139,84,0.9)';

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Commits',
          data: values,
          backgroundColor: (ctx) => {
            const idx = ctx.dataIndex;
            const v = values[idx];
            return v === maxValue && v > 0 ? highlightColor : barFill(ctx);
          },
          borderColor: (ctx) => {
            const idx = ctx.dataIndex;
            const v = values[idx];
            return v === maxValue && v > 0 ? borderColor : 'transparent';
          },
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [labels, values, maxValue]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        title: {
          display: false, //Deixando assim, por enquanto
          text: 'Distribuição por Horário',
          color: 'var(--fallback-bc, rgb(28,28,28))',
          font: { weight: '600', size: 16 },
          padding: { top: 8, bottom: 12 },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(17,17,17,0.92)',
          titleColor: '#fff',
          bodyColor: '#fff',
          displayColors: false,
          padding: 10,
          callbacks: {
            title: (items) => (items?.[0]?.label ? `Hora: ${items[0].label}` : ''),
            label: (ctx) => ` Commits: ${ctx.parsed.y}`,
          },
        },
      },
      layout: { padding: { left: 8, right: 8 } },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: 'rgba(0,0,0,0.55)',
            maxRotation: 0,
            autoSkip: true,
            autoSkipPadding: 10,
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(maxValue, 5),
          grid: {
            color: 'rgba(0,0,0,0.06)',
            drawBorder: false,
          },
          ticks: {
            color: 'rgba(0,0,0,0.55)',
            precision: 0,
            padding: 6,
          },
        },
      },
    }),
    [maxValue]
  );

  if (!rows.length) {
    return (
      <ChartCard title="Distribuição por Horário">
        <div className="h-64 flex items-center justify-center text-stone-500">
          Sem dados para exibir.
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Distribuição por Horário">
      <div className="h-72">
        <Bar ref={canvasRef} options={options} data={chartData} />
      </div>
    </ChartCard>
  );
}
