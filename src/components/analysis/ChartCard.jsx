import React from 'react';

export default function ChartCard({ title, children }) {
  return (
    <div className="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-lg mb-2">{title}</h2>
        <div className="h-72 w-full"> 
          {children}
        </div>
      </div>
    </div>
  );
}