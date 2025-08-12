import React from 'react';

export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm ring-1 ring-stone-100 h-full flex flex-col">
      <h3 className="font-semibold text-stone-700 mb-4">{title}</h3>
      <div className="flex-grow h-72 w-full"> 
        {children}
      </div>
    </div>
  );
}