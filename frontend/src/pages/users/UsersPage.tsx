
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck } from 'lucide-react';
import UserManagement from './components/UserManagement';
import RolesManagement from '../roles/RolesManagement';

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

    const tabs = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            {/* <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                    User Management
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Manage system access, roles, and permissions.
                </p>
            </div> */}

            {/* Tabs */}
            <div className="flex p-1 bg-zinc-100/50 dark:bg-zinc-800/40 backdrop-blur-xl rounded-2xl w-fit border border-zinc-200/50 dark:border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'users' | 'roles')}
                        className={`
              relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 outline-none
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
                        <span className={`relative z-10 flex items-center gap-2 ${activeTab === tab.id ? 'text-white dark:text-black' : ''}`}>
                            <tab.icon size={18} />
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
                        {activeTab === 'users' ? <UserManagement /> : <RolesManagement />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UsersPage;
