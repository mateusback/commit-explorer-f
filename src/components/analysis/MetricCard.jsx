import React from 'react';

const COLORS = {
  primary:  'from-primary/20 via-primary/10 to-transparent',
  secondary:'from-secondary/20 via-secondary/10 to-transparent',
  accent:   'from-accent/20 via-accent/10 to-transparent',
  info:     'from-info/20 via-info/10 to-transparent',
  success:  'from-success/20 via-success/10 to-transparent',
  warning:  'from-warning/20 via-warning/10 to-transparent',
  error:    'from-error/20 via-error/10 to-transparent',
};

const ICON_BG = {
  primary:  'bg-primary text-primary-content',
  secondary:'bg-secondary text-secondary-content',
  accent:   'bg-accent text-accent-content',
  info:     'bg-info text-info-content',
  success:  'bg-success text-success-content',
  warning:  'bg-warning text-warning-content',
  error:    'bg-error text-error-content',
};

export default function MetricCard({
  title,
  value,
  icon,
  trendInfo,
  color = 'primary',     // primary | secondary | accent | info | success | warning | error
  size = 'md',           // sm | md | lg
  variant = 'glass',     // glass | solid | soft
  onClick,               // opcional: vira "card clicável"
  className = '',
}) {
  const clickable = !!onClick;

  const paddings = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }[size];

  const valueSize = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }[size];

  const iconSize = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  }[size];

  const baseClasses = [
    'relative group rounded-2xl border shadow-sm transition-all duration-300',
    'border-base-200/70 hover:border-base-300/70',
    'hover:shadow-lg',
    variant === 'glass' && 'bg-base-100/70 backdrop-blur supports-[backdrop-filter]:bg-base-100/60',
    variant === 'solid' && 'bg-base-100',
    variant === 'soft' && 'bg-base-200/40',
    clickable && 'cursor-pointer hover:-translate-y-[1px]',
    className
  ].filter(Boolean).join(' ');

  const iconClasses = [
    'grid place-items-center rounded-2xl shadow-inner relative overflow-hidden',
    ICON_BG[color] || ICON_BG.primary,
    iconSize
  ].filter(Boolean).join(' ');

  return (
    <div className={baseClasses} onClick={onClick} role={clickable ? 'button' : undefined}>
      {/* Glow/gradient sutil no topo */}
      <div
        aria-hidden
        className={[
          'pointer-events-none absolute inset-x-0 -top-px h-16 rounded-t-2xl blur-2xl',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'bg-gradient-to-b',
          COLORS[color] || COLORS.primary
        ].join(' ')}
      />

      {/* Borda com “sheen” no hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-base-200/0 group-hover:ring-1 group-hover:ring-base-200/80 transition-all"
      />

      <div className={['card-body', paddings].join(' ')}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-base-content/70 truncate">{title}</div>
            <div className={[valueSize, 'font-bold tracking-tight text-base-content'].join(' ')}>
              {value}
            </div>
            {trendInfo && (
              <div className="mt-1 text-xs text-base-content/60">{trendInfo}</div>
            )}
          </div>

          <div className="shrink-0">
            <div className={iconClasses}>
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,rgba(255,255,255,0.35),transparent)]"
              />
              <div className="relative scale-95 group-hover:scale-100 transition-transform">
                {icon}
              </div>
            </div>
          </div>
        </div>

        {/* Linha separadora suave */}
        <div className="mt-4 h-px bg-gradient-to-r from-base-200/0 via-base-200/80 to-base-200/0" />
      </div>
    </div>
  );
}
