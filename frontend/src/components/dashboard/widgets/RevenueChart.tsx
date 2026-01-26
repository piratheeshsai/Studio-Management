import React from 'react';
import DashboardCard from '../DashboardCard';
import { TrendingUp, Download } from 'lucide-react';

const RevenueChart: React.FC = () => {
    // Mock data points for visual representation
    const data = [40, 35, 55, 45, 60, 55, 75, 65, 85, 80, 95, 90];

    return (
        <DashboardCard className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Revenue</h3>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">Monthly Performance</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg text-xs font-medium text-zinc-600 dark:text-slate-300 transition-colors border border-zinc-200 dark:border-white/5">
                    <Download className="w-3.5 h-3.5" />
                    Export
                </button>
            </div>

            <div className="flex items-end gap-2 h-40 mt-4 px-2">
                {data.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            ${h * 100}
                        </div>

                        <div
                            style={{ height: `${h}%` }}
                            className={`w-full rounded-t-sm bg-gradient-to-t from-emerald-500/20 to-emerald-500/60 hover:from-emerald-400/40 hover:to-emerald-400/80 transition-all duration-300 relative`}
                        >
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-2 pt-2 border-t border-zinc-200 dark:border-white/5">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].filter((_, i) => i % 2 === 0).map((m) => (
                    <span key={m} className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase">{m}</span>
                ))}
            </div>
        </DashboardCard>
    );
};

export default RevenueChart;
