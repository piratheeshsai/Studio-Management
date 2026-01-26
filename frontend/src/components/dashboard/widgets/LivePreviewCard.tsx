import React from 'react';
import DashboardCard from '../DashboardCard';
import { Play, Mic, Camera } from 'lucide-react';

const LivePreviewCard: React.FC = () => {
    return (
        <DashboardCard colSpan="md:col-span-2 row-span-2" className="min-h-[400px]">
            {/* Header / Status Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-semibold text-red-100 tracking-wider uppercase">Live • Studio A</span>
                </div>
                <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                    <span className="text-xs text-white/80 font-mono">Camera 01</span>
                </div>
            </div>

            {/* Main Preview Area (Mock Image) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop"
                    alt="Live Studio Feed"
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between">
                <div className="flex gap-4">
                    <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all">
                        <Mic className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-600/20 transition-all">
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Session</span>
                </button>
            </div>
        </DashboardCard>
    );
};

export default LivePreviewCard;
