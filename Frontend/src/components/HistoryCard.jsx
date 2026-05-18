import React from 'react';
import { ShieldCheck, ShieldAlert, Calendar, BarChart3 } from 'lucide-react';

const HistoryCard = ({ record }) => {
    const isReal = record.prediction === 'Real';
    const date = new Date(record.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="bg-dark-lighter border border-gray-800 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
            <div className="relative aspect-video bg-dark overflow-hidden">
                {record.image ? (
                    <img
                        src={record.image}
                        alt="Detection"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <ShieldCheck className="w-12 h-12 opacity-10" />
                    </div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border
          ${isReal
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
                >
                    {record.prediction.toUpperCase()}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                        <BarChart3 className="w-4 h-4" />
                        <span>{(record.confidence * 100).toFixed(1)}%</span>
                    </div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${isReal ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${record.confidence * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;
