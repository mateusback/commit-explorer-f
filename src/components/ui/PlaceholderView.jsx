import React from 'react';

const PlaceholderView = ({ title, description }) => (
    <section className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-emerald-600 mb-4">{title}</h3>
        <p className="text-stone-600">{description}</p>
    </section>
);

export default PlaceholderView;