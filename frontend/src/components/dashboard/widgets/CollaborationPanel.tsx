import React from 'react';
import DashboardCard from '../DashboardCard';
import { MessageSquare, MoreHorizontal } from 'lucide-react';

const CollaborationPanel: React.FC = () => {
    const activeUsers = [
        { id: 1, name: 'Sarah M.', status: 'Editing IMG_8932', avatar: 'S', color: 'bg-rose-500' },
        { id: 2, name: 'David K.', status: 'Reviewing Album', avatar: 'D', color: 'bg-blue-500' },
        { id: 3, name: 'Alex R.', status: 'Exporting...', avatar: 'A', color: 'bg-amber-500' },
    ];

    return (
        <DashboardCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Team</h3>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">3 active now</p>
                    </div>
                </div>
                <button className="text-zinc-400 dark:text-slate-500 hover:text-zinc-600 dark:hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-transparent group-hover:ring-zinc-200 dark:group-hover:ring-white/10 transition-all`}>
                            {user.avatar}
                            <span className="absolute bottom-1 right-0 w-2.5 h-2.5 border-2 border-white dark:border-[#151515] bg-green-500 rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-pink-500/80 dark:text-pink-400/80 truncate">{user.status}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 text-xs font-medium text-zinc-400 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg border border-dashed border-zinc-300 dark:border-slate-700 hover:border-zinc-400 dark:hover:border-slate-500 transition-all">
                + Invite Collaborator
            </button>
        </DashboardCard>
    );
};

export default CollaborationPanel;
