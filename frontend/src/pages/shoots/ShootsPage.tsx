
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Package, LayoutList, LayoutGrid, Kanban, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import CreateShootWizard from './components/CreateShootWizard';
import { useShoots } from '../../hooks/useShoots';

const ShootsPage = () => {
    const { shoots, loading, fetchShoots } = useShoots();
    const [activeTab, setActiveTab] = useState('All Shoots');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchShoots();
    }, [fetchShoots]);

    return (
        <div className="p-6 space-y-6">
            {/* Consolidated Header & Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & Subtitle */}
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Shoots
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Manage client bookings and deliverables
                    </p>
                </div>

                {/* Compact Action Bar Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-1.5 shadow-sm dark:shadow-none flex flex-col sm:flex-row items-center gap-2 max-w-4xl w-full lg:w-auto">
                    {/* Search Input Container */}
                    <div className="relative flex-1 w-full lg:min-w-[240px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search shoots..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl p-0.5">
                        {[
                            { id: 'list', icon: LayoutList, label: 'List' },
                            { id: 'grid', icon: LayoutGrid, label: 'Grid' },
                            { id: 'kanban', icon: Kanban, label: 'Kanban' }
                        ].map((view) => (
                            <button
                                key={view.id}
                                onClick={() => setViewMode(view.id as any)}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === view.id
                                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
                                    }`}
                                title={view.label}
                            >
                                <view.icon size={14} />
                            </button>
                        ))}
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-white/10"
                            title="Filter"
                        >
                            <Filter size={16} />
                        </button>

                        <button
                            onClick={() => setActiveTab('New Shoot')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-[0.98] whitespace-nowrap"
                        >
                            <Plus size={16} />
                            New Shoot
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs (Secondary Row) */}
            <div className="flex items-center gap-2 w-fit">
                {['All Shoots', 'New Shoot', 'Calendar', 'Reports'].map((tab) => {
                    const icon = tab === 'All Shoots' ? Package : tab === 'New Shoot' ? Sparkles : tab === 'Calendar' ? Calendar : Filter;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                relative flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 outline-none
                                ${activeTab === tab ? 'text-white shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}
                            `}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className={`relative z-10 flex items-center gap-1.5 ${activeTab === tab ? 'text-white dark:text-black' : ''}`}>
                                {React.createElement(icon, { size: 16 })}
                                {tab}
                            </span>
                        </button>
                    );
                })}
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
                        {activeTab === 'All Shoots' && (
                            <div className="space-y-6">


                                {/* Content based on View Mode */}
                                {viewMode === 'kanban' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
                                        {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((status) => {
                                            const statusShoots = Array.isArray(shoots) ? shoots.filter(s => s.status === status) : [];
                                            const statusColor = status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20' :
                                                status === 'IN_PROGRESS' ? 'text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' :
                                                    'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';

                                            return (
                                                <div key={status} className="min-w-[300px] bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 p-4 space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${status === 'PENDING' ? 'bg-yellow-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'}`} />
                                                            {status.replace('_', ' ')}
                                                        </h3>
                                                        <span className="text-xs bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">{statusShoots.length}</span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {statusShoots.map(shoot => (
                                                            <motion.div
                                                                key={shoot.id}
                                                                layoutId={`shoot-${shoot.id}`}
                                                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm"
                                                                onClick={() => navigate(`/shoots/${shoot.id}`)}
                                                            >
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500/10 to-orange-600/10 dark:from-red-500/20 dark:to-orange-600/20 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold border border-red-500/10 text-xs">
                                                                        {shoot.client?.name?.charAt(0)}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-xs text-zinc-500">{new Date(shoot.createdAt).toLocaleDateString()}</div>
                                                                    </div>
                                                                </div>

                                                                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{shoot.client?.name}</h4>
                                                                <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
                                                                    <Package size={12} />
                                                                    <span className="truncate">{shoot.packageName}</span>
                                                                </div>

                                                                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-3">
                                                                    <div className="font-medium text-zinc-300 text-sm">${Number(shoot.finalPrice).toLocaleString()}</div>
                                                                    {/* {shoot.balance > 0 && <span className="text-xs text-red-500 dark:text-red-400 font-medium">Due: ${shoot.balance.toLocaleString()}</span>} */}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                        {Array.isArray(shoots) && shoots.map((shoot) => (
                                            <motion.div
                                                key={shoot.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`
                                                    bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-all cursor-pointer group p-4
                                                    ${viewMode === 'list' ? 'grid grid-cols-12 gap-4 items-center' : 'flex flex-col gap-4'}
                                                `}
                                                onClick={() => navigate(`/shoots/${shoot.id}`)}
                                            >
                                                <div className={`${viewMode === 'list' ? 'col-span-4' : 'w-full'} flex items-center gap-4`}>
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/10 to-orange-600/10 dark:from-red-500/20 dark:to-orange-600/20 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold border border-red-500/10 shrink-0">
                                                        {shoot.client?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{shoot.client?.name}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                            <Package size={14} />
                                                            {shoot.packageName}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`${viewMode === 'list' ? 'col-span-3' : 'w-full'} flex items-center gap-2 text-zinc-500 dark:text-zinc-400`}>
                                                    <Calendar size={16} />
                                                    {new Date(shoot.createdAt).toLocaleDateString()}
                                                </div>

                                                <div className={`${viewMode === 'list' ? 'col-span-2' : 'w-full'}`}>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border inline-block
                                                        ${shoot.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20' :
                                                            shoot.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-500 dark:border-yellow-500/20' :
                                                                'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/20'}`}
                                                    >
                                                        {shoot.status}
                                                    </span>
                                                </div>

                                                <div className={`${viewMode === 'list' ? 'col-span-2 text-right' : 'w-full flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800/50 pt-3 mt-auto'}`}>
                                                    <div className="text-zinc-900 dark:text-white font-medium">${Number(shoot.finalPrice).toLocaleString()}</div>
                                                    {/* Balance calculation requires payments data */}
                                                    {/* {shoot.balance > 0 && (
                                                        <div className="text-xs text-red-500 dark:text-red-400">Due: ${shoot.balance.toLocaleString()}</div>
                                                    )} */}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Calendar' && (
                            <div className="h-[600px] flex items-center justify-center bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 rounded-xl text-zinc-400 dark:text-zinc-500">
                                <div className="text-center">
                                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Calendar View Coming Soon</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Reports' && (
                            <div className="h-[600px] flex items-center justify-center bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 rounded-xl text-zinc-400 dark:text-zinc-500">
                                <div className="text-center">
                                    <Filter size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Detailed Reports Coming Soon</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'New Shoot' && (
                            <CreateShootWizard
                                onSuccess={() => {
                                    fetchShoots();
                                    setActiveTab('All Shoots');
                                }}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ShootsPage;
