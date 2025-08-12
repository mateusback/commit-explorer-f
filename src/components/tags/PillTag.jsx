import React from 'react';

function getReadableTextColor(hexColor) {
  const hex = (hexColor || '').replace('#', '');
  if (hex.length !== 6) return '#111827'; 
  const r = parseInt(hex.slice(0,2), 16) / 255;
  const g = parseInt(hex.slice(2,4), 16) / 255;
  const b = parseInt(hex.slice(4,6), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4));
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.6 ? '#111827' : '#FFFFFF';
}

function PillTag({ label, color = '#e5e7eb', title, className = '' }) {
  const textColor = getReadableTextColor(color);
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
      style={{ backgroundColor: color, color: textColor, borderColor: color }}
      title={title || label}
    >
      {label}
    </span>
  );
}

export default React.memo(PillTag);
