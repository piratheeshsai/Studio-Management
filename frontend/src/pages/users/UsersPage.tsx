import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Search, RefreshCw, Plus } from 'lucide-react';
import UserManagement from './components/UserManagement';
import RolesManagement from '../roles/RolesManagement';
import { useUsers } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [searchQuery, setSearchQuery] = useState('');

    // Lifted hooks for global actions
    const userHook = useUsers();
    const roleHook = useRoles();

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    const tabs = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
    ];

    const handleRefresh = () => {
        if (activeTab === 'users') {
            userHook.refetch();
        } else {
            roleHook.fetchRoles();
        }
    };

    const handleAdd = () => {
        if (activeTab === 'users') {
            setIsAddUserModalOpen(true);
        } else {
            navigate('/roles/create');
        }
    };

    const isLoading = activeTab === 'users' ? userHook.loading : roleHook.loading;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Consolidated Header & Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & Subtitle */}
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        User Management
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Manage system access, roles, and permissions
                    </p>
                </div>

                {/* Compact Action Bar Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-1.5 shadow-sm dark:shadow-none flex flex-col sm:flex-row items-center gap-2 max-w-2xl w-full lg:w-auto">
                    {/* Search Input Container */}
                    <div className="relative flex-1 w-full lg:min-w-[300px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder={activeTab === 'users' ? "Search users..." : "Search roles..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                        />
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-white/10"
                            title="Refresh"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </button>

                        {((activeTab === 'users' && hasPermission('USER_CREATE')) ||
                            (activeTab === 'roles' && hasPermission('ROLE_CREATE'))) && (
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-[0.98] whitespace-nowrap"
                                >
                                    <Plus size={16} />
                                    {activeTab === 'users' ? 'Add User' : 'Create Role'}
                                </button>
                            )}
                    </div>
                </div>
            </div>

            {/* Tabs (Secondary Row) */}
            <div className="flex items-center gap-2 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as 'users' | 'roles');
                            setSearchQuery(''); // Clear search when switching
                        }}
                        className={`
                            relative flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 outline-none
                            ${activeTab === tab.id ? 'text-white shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}
                        `}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative z-10 flex items-center gap-1.5 ${activeTab === tab.id ? 'text-white dark:text-black' : ''}`}>
                            <tab.icon size={16} />
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'users' ? (
                            <UserManagement
                                searchQuery={searchQuery}
                                users={userHook.users}
                                loading={userHook.loading}
                                error={userHook.error}
                                refetch={userHook.refetch}
                                deactivateUser={userHook.deactivateUser}
                                activateUser={userHook.activateUser}
                                deleteUser={userHook.deleteUser}
                                setIsAddUserModalOpen={setIsAddUserModalOpen}
                                isAddUserModalOpen={isAddUserModalOpen}
                            />
                        ) : (
                            <RolesManagement
                                searchQuery={searchQuery}
                                roles={roleHook.roles}
                                loading={roleHook.loading}
                                fetchRoles={roleHook.fetchRoles}
                                deleteRole={roleHook.deleteRole}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UsersPage;
