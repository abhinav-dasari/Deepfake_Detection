import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, History, LogOut, Shield } from 'lucide-react';
import { api } from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Upload', path: '/upload', icon: Upload },
        { label: 'History', path: '/history', icon: History },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-darker/80 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                            DeepFake <span className="text-primary">Shield</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
                                        ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav (Simple bottom bar version) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-lighter border-t border-gray-800 px-4 py-3 flex justify-around items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-colors
                                ${isActive ? 'text-primary' : 'text-gray-500'}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
