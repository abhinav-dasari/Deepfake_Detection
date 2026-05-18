import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    ShieldCheck,
    ShieldAlert,
    Activity,
    PlusCircle,
    ArrowRight,
    TrendingUp,
    History,
    Loader2
} from 'lucide-react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';

import Skeleton from '../components/Skeleton';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        real: 0,
        fake: 0,
        avgConfidence: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const history = await api.getHistory();

            if (Array.isArray(history)) {
                const total = history.length;
                const real = history.filter(item => item.prediction === 'Real').length;
                const fake = total - real;
                const avgConfidence = total > 0
                    ? (history.reduce((acc, curr) => acc + curr.confidence, 0) / total) * 100
                    : 0;

                setStats({
                    total,
                    real,
                    fake,
                    avgConfidence,
                    recentActivity: history.slice(0, 5)
                });
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-12 w-40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-96" />
                    <div className="space-y-6">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">Command Center</h2>
                    <p className="text-gray-400">An overview of your deepfake detection statistics and activity.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/upload')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Detection
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Scans"
                    value={stats.total}
                    icon={Activity}
                    colorClass="bg-blue-500"
                    description="Total images analyzed by AI"
                />
                <StatCard
                    label="Authentic (Real)"
                    value={stats.real}
                    icon={ShieldCheck}
                    colorClass="bg-green-500"
                    description={`${((stats.real / (stats.total || 1)) * 100).toFixed(1)}% of all scans`}
                />
                <StatCard
                    label="Deepfakes (Fake)"
                    value={stats.fake}
                    icon={ShieldAlert}
                    colorClass="bg-red-500"
                    description={`${((stats.fake / (stats.total || 1)) * 100).toFixed(1)}% detection rate`}
                />
                <StatCard
                    label="Avg. Confidence"
                    value={`${stats.avgConfidence.toFixed(1)}%`}
                    icon={TrendingUp}
                    colorClass="bg-purple-500"
                    description="AI model certainty level"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-dark-lighter border border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <History className="text-primary w-6 h-6" />
                            Recent Activity
                        </h3>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-primary hover:text-primary-light flex items-center gap-1 font-medium transition-colors"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-4 bg-dark rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                                            {activity.image && <img src={activity.image} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${activity.prediction === 'Real' ? 'text-green-500' : 'text-red-500'}`}>
                                                {activity.prediction}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(activity.created_at).toLocaleDateString()} at {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-400 font-mono text-sm leading-none block">
                                            {(activity.confidence * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Confidence</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 italic">
                                No recent activity. Start by uploading an image.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Info */}
                <div className="space-y-6">
                    <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold text-white mb-2">Protect Integrity</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Stay one step ahead of AI manipulation. Our enhanced vision transformers can detect subtle artifacts invisible to the human eye.
                            </p>
                            <button
                                onClick={() => navigate('/upload')}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
                            >
                                Start Analysis
                            </button>
                        </div>
                        <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-primary opacity-5 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-dark-lighter border border-gray-800 rounded-3xl p-8">
                        <h4 className="text-lg font-bold text-white mb-4">Detection Tips</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                Use high resolution original images for best accuracy.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                Ensure lighting is consistent and sharp.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                Avoid heavy compression or screenshotting.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
