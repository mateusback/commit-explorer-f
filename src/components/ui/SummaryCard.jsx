import React from 'react';

const SummaryCard = ({ icon, title, value, description, color, progress }) => {
    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-50', text: 'text-emerald-600', progress: 'bg-emerald-500', icon: 'text-emerald-500'
        },
        amber: {
            bg: 'bg-amber-50', text: 'text-amber-600', progress: 'bg-amber-500', icon: 'text-amber-500'
        },
        sky: {
            bg: 'bg-sky-50', text: 'text-sky-600', progress: 'bg-sky-500', icon: 'text-sky-500'
        },
        green: {
            bg: 'bg-green-50', text: 'text-green-600', progress: 'bg-green-500', icon: 'text-green-500'
        },
    };
    const classes = colorClasses[color] || colorClasses.emerald;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`flex items-center justify-center p-2.5 mb-1 ${classes.bg} rounded-lg`}>
                {React.cloneElement(icon, { className: `${classes.icon} w-6 h-6` })}
            </div>
            <div className="flex items-center justify-center  mb-3">
                <h3 className="text-lg font-medium text-stone-600">{title}</h3>
            </div>
            <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
            <p className="text-sm text-stone-500">{description}</p>
            {progress && (
                <div className="mt-3 h-2 bg-stone-100 rounded-full">
                    <div className={`${classes.progress} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    );
};

export default SummaryCard;