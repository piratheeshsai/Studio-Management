import React from 'react';
import DashboardCard from '../DashboardCard';
import { Share2, Heart, MessageCircle } from 'lucide-react';

const ClientInteractionPanel: React.FC = () => {
    return (
        <DashboardCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Share2 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Client Activity</h3>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">Recent interactions</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-white/5 dark:to-white/[0.02] rounded-2xl border border-zinc-200 dark:border-white/5 text-center">
                    <div className="flex justify-center mb-2">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                    </div>
                    <span className="block text-2xl font-bold text-zinc-900 dark:text-white mb-1">24</span>
                    <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase tracking-widest">Selections</span>
                </div>
                <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-white/5 dark:to-white/[0.02] rounded-2xl border border-zinc-200 dark:border-white/5 text-center">
                    <div className="flex justify-center mb-2">
                        <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                    </div>
                    <span className="block text-2xl font-bold text-zinc-900 dark:text-white mb-1">8</span>
                    <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase tracking-widest">Comments</span>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="text-zinc-500 dark:text-slate-400">Gallery Link Status</span>
                    <span className="text-green-500 dark:text-green-400 font-medium">Active (Expires 2d)</span>
                </div>
                <div className="h-1 w-full bg-zinc-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[80%]" />
                </div>
            </div>
        </DashboardCard>
    );
};

export default ClientInteractionPanel;
