import React from 'react';

export default function Header({ title, subtitle }) {
    return (
        <header className="mb-8">
            <h2 className="text-3xl font-semibold text-emerald-700">{title}</h2>
            <p className="text-stone-500 mt-1">{subtitle}</p>
        </header>
    );
}
