import React from 'react';
import DashboardCard from '../DashboardCard';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    subtext: string;
    icon: LucideIcon;
    color: string; // e.g. 'blue', 'amber', 'purple'
    trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtext, icon: Icon, color, trend }) => {
    // Dynamic color classes based on prop (simplified mapping for common tailwind colors)
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
        amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
        rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20',
    };

    const activeColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;


    return (
        <DashboardCard className="p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</h4>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${activeColorClass} border`}>
                    <Icon className={`w-5 h-5`} />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 dark:text-slate-500">{subtext}</span>
                {trend && (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        {trend}
                    </span>
                )}
            </div>
        </DashboardCard>
    );
};

export default StatsCard;
