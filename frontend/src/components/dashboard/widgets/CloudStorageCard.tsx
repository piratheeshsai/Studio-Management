import React from 'react';
import DashboardCard from '../DashboardCard';
import { Cloud } from 'lucide-react';

const CloudStorageCard: React.FC = () => {
    return (
        <DashboardCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Cloud className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Cloud Storage</h3>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">Capacity & Usage</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            {/* Background Circle */}
                            <path
                                className="text-zinc-200 dark:text-slate-800"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            {/* Progress Circle (75%) */}
                            <path
                                className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                strokeDasharray="75, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-zinc-900 dark:text-white">1.5<span className="text-sm font-normal text-zinc-400 dark:text-slate-400">TB</span></span>
                            <span className="text-[10px] text-zinc-400 dark:text-slate-400">Used of 2TB</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5">
                        <h4 className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Photos</h4>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">1.2 TB</p>
                        <div className="w-full h-1 bg-zinc-200 dark:bg-slate-700 rounded-full mt-2">
                            <div className="h-full bg-blue-500 rounded-full w-[80%]" />
                        </div>
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5">
                        <h4 className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Videos</h4>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">300 GB</p>
                        <div className="w-full h-1 bg-zinc-200 dark:bg-slate-700 rounded-full mt-2">
                            <div className="h-full bg-purple-500 rounded-full w-[40%]" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};

export default CloudStorageCard;
