import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import HistoryCard from '../components/HistoryCard';
import Skeleton from '../components/Skeleton';


const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await api.getHistory();
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load history. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item =>
        item.prediction.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <HistoryIcon className="text-primary w-10 h-10" />
                        Detection History
                    </h2>
                    <p className="text-gray-400">Track and review all your past AI analysis results.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by prediction..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-lighter border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-video h-[280px]" />)}
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/50 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchHistory}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="text-center py-20 bg-dark-lighter rounded-3xl border border-gray-800 border-dashed">
                    <HistoryIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {searchTerm ? "No matching results" : "No history yet"}
                    </h3>
                    <p className="text-gray-400">
                        {searchTerm ? "Try searching for something else." : "Analyses you perform will appear here."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredHistory.map((item) => (
                        <HistoryCard key={item.id} record={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
