import React from 'react';
import DashboardCard from '../DashboardCard';
import { BookOpen, Plus, Layout } from 'lucide-react';

const AlbumBuilderPreview: React.FC = () => {
    return (
        <DashboardCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Album Builder</h3>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">Drafts & Layouts</p>
                    </div>
                </div>
                <button className="p-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Plus className="w-4 h-4 text-zinc-600 dark:text-white" />
                </button>
            </div>

            <div className="relative h-40 bg-zinc-100 dark:bg-[#0A0A0A] rounded-xl border border-zinc-200 dark:border-white/5 overflow-hidden group cursor-pointer">
                {/* Mock Album Spread */}
                <div className="absolute inset-4 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-sm overflow-hidden relative shadow-sm">
                        <div className="absolute top-2 left-2 right-2 bottom-1/2 bg-zinc-200 dark:bg-slate-700 rounded-sm" />
                        <div className="absolute top-[60%] left-2 right-2 bottom-2 bg-zinc-200 dark:bg-slate-700/50 rounded-sm" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-sm overflow-hidden relative shadow-sm">
                        <div className="absolute top-2 left-2 w-1/2 bottom-2 bg-zinc-200 dark:bg-slate-700 rounded-sm" />
                        <div className="absolute top-2 right-2 w-[calc(50%-12px)] bottom-2 bg-zinc-200 dark:bg-slate-700/50 rounded-sm" />
                    </div>
                </div>

                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-[2px] opacity-100 group-hover:opacity-0 transition-opacity">
                    <div className="text-center">
                        <span className="block text-sm font-medium text-zinc-900 dark:text-white">Smith Wedding Album</span>
                        <span className="text-xs text-zinc-500 dark:text-slate-400">Edited 2h ago</span>
                    </div>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-indigo-600 px-4 py-2 rounded-lg font-medium text-white shadow-lg shadow-indigo-600/20">
                        Continue Editing
                    </div>
                </div>
            </div>

            <div className="mt-4 flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/5 w-full">
                    <Layout className="w-4 h-4 text-zinc-400 dark:text-slate-400" />
                    <span className="text-xs text-zinc-600 dark:text-slate-300">Layouts</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/5 w-full">
                    <BookOpen className="w-4 h-4 text-zinc-400 dark:text-slate-400" />
                    <span className="text-xs text-zinc-600 dark:text-slate-300">Templates</span>
                </div>
            </div>
        </DashboardCard>
    );
};

export default AlbumBuilderPreview;
