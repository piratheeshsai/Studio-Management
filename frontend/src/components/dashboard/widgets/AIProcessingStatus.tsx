import React from 'react';
import DashboardCard from '../DashboardCard';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

const AIProcessingStatus: React.FC = () => {
    return (
        <DashboardCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">AI Processing</h3>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">Real-time status</p>
                    </div>
                </div>
            </div>

            {/* Status Items */}
            <div className="space-y-4">
                {/* Auto-Culling */}
                <div className="group p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-zinc-700 dark:text-slate-300">Auto-Culling</span>
                        <span className="text-xs font-bold text-teal-500 dark:text-teal-400">84%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-slate-500 mt-2">Processing batch #2049...</p>
                </div>

                {/* Face Grouping */}
                <div className="group p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-zinc-700 dark:text-slate-300">Face Grouping</span>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 dark:text-amber-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Working</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                </div>

                {/* Quality Score */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-emerald-400">A+</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-100">Quality Check</p>
                            <p className="text-[10px] text-emerald-400/80">Excellent focus detected</p>
                        </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
            </div>
        </DashboardCard>
    );
};

export default AIProcessingStatus;
