import React from 'react';

export function Tabs({ items = [], active, onChange }) {
  return (
    <div className="tabs tabs-boxed bg-base-100 shadow mb-6 overflow-x-auto">
      {items.map(({ key, label }) => (
        <button
          key={key}
          className={`tab tab-lg whitespace-nowrap ${active === key ? 'tab-active' : ''}`}
          onClick={() => onChange(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
