import React from 'react';

export default function DashboardStatCard({ icon, title, value, subtitle, color = 'emerald', trend }) {
  const colorClasses = {
    emerald: {
      bg: 'from-emerald-100 to-emerald-50',
      icon: 'text-emerald-600',
      ring: 'ring-emerald-50',
      text: 'text-emerald-600'
    },
    amber: {
      bg: 'from-amber-100 to-amber-50',
      icon: 'text-amber-600',
      ring: 'ring-amber-50',
      text: 'text-amber-600'
    },
    sky: {
      bg: 'from-sky-100 to-sky-50',
      icon: 'text-sky-600',
      ring: 'ring-sky-50',
      text: 'text-sky-600'
    },
    purple: {
      bg: 'from-purple-100 to-purple-50',
      icon: 'text-purple-600',
      ring: 'ring-purple-50',
      text: 'text-purple-600'
    },
    red: {
      bg: 'from-red-100 to-red-50',
      icon: 'text-red-600',
      ring: 'ring-red-50',
      text: 'text-red-600'
    },
    blue: {
      bg: 'from-blue-100 to-blue-50',
      icon: 'text-blue-600',
      ring: 'ring-blue-50',
      text: 'text-blue-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.emerald;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200/60 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center ring-4 ${colors.ring} mb-4`}>
            <div className={`${colors.icon}`}>
              {icon}
            </div>
          </div>
          <h3 className="text-sm font-medium text-stone-600 mb-2">{title}</h3>
          <p className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</p>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
