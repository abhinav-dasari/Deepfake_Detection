import React from 'react';

const StatCard = ({ label, value, icon: Icon, colorClass, description }) => {
    return (
        <div className="bg-dark-lighter border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <div>
                <h3 className="text-gray-400 font-medium mb-1">{label}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{value}</span>
                </div>
                {description && (
                    <p className="text-gray-500 text-xs mt-2 italic">{description}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
