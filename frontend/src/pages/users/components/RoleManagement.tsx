

import { Shield, Plus, MoreVertical, Check } from 'lucide-react';

const RoleManagement = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Roles & Permissions</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Define access levels for different user types.</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-zinc-900/20 dark:shadow-white/20">
                    <Plus size={18} />
                    <span>Create Role</span>
                </button>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-2xl p-6 hover:border-zinc-300 dark:hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                <Shield size={24} />
                            </div>
                            <button className="p-2 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg text-zinc-400">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Administrator</h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">
                            Full access to all system features and settings. Can manage other users.
                        </p>

                        <div className="space-y-2 mb-6">
                            {['Manage Users', 'Edit Content', 'System Settings'].map((perm, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                    <Check size={14} className="text-emerald-500" />
                                    <span>{perm}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((u) => (
                                    <div key={u} className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"></div>
                                ))}
                            </div>
                            <span className="text-xs text-zinc-500 font-medium">12 Users</span>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default RoleManagement;
