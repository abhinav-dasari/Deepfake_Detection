import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />
    };

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/50',
        error: 'bg-red-500/10 border-red-500/50',
        info: 'bg-blue-500/10 border-blue-500/50'
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-full duration-300 ${bgColors[type]}`}>
            {icons[type]}
            <p className="text-white text-sm font-medium pr-2">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
