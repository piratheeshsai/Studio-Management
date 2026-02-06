
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Package, LayoutList, LayoutGrid, Kanban, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import CreateShootWizard from './components/CreateShootWizard';
import ShootsCalendar from './components/ShootsCalendar';
import { useShoots } from '../../hooks/useShoots';
import { useAuth } from '../../context/AuthContext';

const ShootsPage = () => {
    const { hasPermission } = useAuth();
    const { shoots, loading, fetchShoots } = useShoots();
    const [activeTab, setActiveTab] = useState('All Shoots');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban' | 'calendar'>('list');
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        fetchShoots();
    }, [fetchShoots]);

    // Calculate pagination
    const totalItems = Array.isArray(shoots) ? shoots.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedShoots = Array.isArray(shoots) ? shoots.slice(startIndex, endIndex) : [];

    // Reset to page 1 when changing view mode or tab
    React.useEffect(() => {
        setCurrentPage(1);
    }, [viewMode, activeTab]);

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
                            { id: 'kanban', icon: Kanban, label: 'Kanban' },
                            { id: 'calendar', icon: Calendar, label: 'Calendar' }
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

                        {hasPermission('SHOOT_CREATE') && (
                            <button
                                onClick={() => setActiveTab('New Shoot')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-[0.98] whitespace-nowrap"
                            >
                                <Plus size={16} />
                                New Shoot
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs (Secondary Row) */}
            <div className="flex p-1 bg-zinc-100/50 dark:bg-zinc-800/40 backdrop-blur-xl rounded-2xl w-fit border border-zinc-200/50 dark:border-white/5 h-fit">
                {['All Shoots', 'New Shoot', 'Calendar', 'Reports']
                    .filter(tab => tab !== 'New Shoot' || hasPermission('SHOOT_CREATE'))
                    .map((tab) => {
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
                        key={activeTab + viewMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'All Shoots' && (
                            <div className="space-y-6">


                                {/* Content based on View Mode */}
                                {viewMode === 'calendar' ? (
                                    <ShootsCalendar shoots={shoots} />
                                ) : viewMode === 'kanban' ? (
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
                                    <>
                                        <div className="flex flex-col gap-5">
                                            {paginatedShoots.map((shoot) => {
                                                // Calculate real progress from shoot items
                                                const totalItems = shoot.items?.length || 0;
                                                const completedItems = shoot.items?.filter(item =>
                                                    item.status === 'DELIVERED' || item.status === 'READY'
                                                ).length || 0;
                                                const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                                                // Determine workflow stage
                                                let workflowStage = 'Not Started';
                                                if (shoot.items && shoot.items.length > 0) {
                                                    const statuses = shoot.items.map(i => i.status);
                                                    if (statuses.some(s => s === 'DELIVERED')) workflowStage = 'Delivery';
                                                    else if (statuses.some(s => s === 'READY')) workflowStage = 'Ready';
                                                    else if (statuses.some(s => s === 'PRINTING')) workflowStage = 'Printing';
                                                    else if (statuses.some(s => s === 'DESIGNING')) workflowStage = 'Culling Architecture';
                                                }

                                                // Split shoot code for stacked display (e.g. "W-22" -> "W-" and "22")
                                                const shootCode = shoot.shootCode || 'N/A';
                                                const [codePrefix, codeNumber] = shootCode.includes('-')
                                                    ? shootCode.split('-')
                                                    : [shootCode, ''];

                                                return (
                                                    <motion.div
                                                        key={shoot.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        onClick={() => navigate(`/shoots/${shoot.id}`)}
                                                        className="group relative flex items-center bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] px-8 py-4 cursor-pointer hover:border-orange-200 dark:hover:border-orange-900/50 transition-all hover:shadow-xl hover:shadow-orange-500/5 dark:hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.15)] overflow-hidden"
                                                    >
                                                        {/* Left Glow/Gradient Effect */}
                                                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-orange-500/5 dark:from-orange-900/10 to-transparent pointer-events-none" />
                                                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/5 dark:bg-orange-600/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-orange-500/10 dark:group-hover:bg-orange-600/20 transition-all duration-500" />

                                                        {/* 1. Shoot Code Badge */}
                                                        <div className="shrink-0 w-24 flex flex-col items-center justify-center z-10">
                                                            <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover:border-orange-500/30 dark:group-hover:border-orange-500/30 transition-colors duration-300 shadow-inner dark:shadow-none">
                                                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
                                                                    {codePrefix}
                                                                </span>
                                                                <span className="text-2xl font-black text-zinc-900 dark:text-white font-mono tracking-tighter group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                                                                    {codeNumber}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Divider */}
                                                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800/50 mx-6" />

                                                        {/* 2. Client & Type */}
                                                        <div className="w-[280px] shrink-0">
                                                            <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-1">
                                                                {shoot.client?.name || "Client Name"}
                                                            </h3>
                                                            <div className="text-[9px] font-bold text-orange-600 dark:text-orange-500 tracking-[0.2em] uppercase">
                                                                {shoot.category?.replace('_', ' ') || 'Shoot'} • {shoot.packageName || 'Package'}
                                                            </div>
                                                        </div>

                                                        {/* 3. Workflow Progress */}
                                                        <div className="flex-1 w-full max-w-[200px] mx-6">
                                                            <div className="flex flex-col gap-1 mb-2">
                                                                <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                                                    Phase:
                                                                </span>
                                                                <div className="flex items-baseline justify-between">
                                                                    <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                                                                        {workflowStage}
                                                                    </span>
                                                                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                                                        {progress}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-orange-500 dark:bg-orange-600 rounded-full"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* 4. Status Badge */}
                                                        <div className="shrink-0 mx-4">
                                                            <div className={`
                                                                px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border transition-colors
                                                                ${shoot.status === 'BOOKED' || shoot.status === 'IN_PROGRESS'
                                                                    ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50 text-orange-600 dark:text-orange-500 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/40'
                                                                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                                                                }
                                                            `}>
                                                                {shoot.status === 'IN_PROGRESS' ? 'ACTIVE' : shoot.status}
                                                            </div>
                                                        </div>

                                                        {/* Divider */}
                                                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800/50 mx-4" />

                                                        {/* 5. Details Grid */}
                                                        <div className="shrink-0 grid grid-cols-2 gap-x-6 gap-y-2 ml-2">
                                                            {/* Row 1: Date & Total Price */}
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={12} className="text-orange-600 dark:text-orange-500" />
                                                                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                                                                    {shoot.eventDate ? new Date(shoot.eventDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'TBD'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-3 h-3 text-orange-600 dark:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                                                                    LKR {Number(shoot.finalPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                </span>
                                                            </div>

                                                            {/* Row 2: Balance & Location */}
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-3 h-3 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                </svg>
                                                                <span className="text-[10px] font-bold text-red-500 dark:text-red-400">
                                                                    LKR {(() => {
                                                                        const totalPaid = shoot.payments?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
                                                                        const balance = Number(shoot.finalPrice) - totalPaid;
                                                                        return balance.toLocaleString('en-US', { minimumFractionDigits: 2 });
                                                                    })()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-3 h-3 text-orange-600 dark:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 cursor-help" title={shoot.client?.address || 'No Address'}>
                                                                    {shoot.client?.address ? `${shoot.client.address.slice(0, 10)}${shoot.client.address.length > 10 ? '...' : ''}` : 'No Address'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    Showing <span className="font-semibold text-zinc-900 dark:text-white">{startIndex + 1}</span> to <span className="font-semibold text-zinc-900 dark:text-white">{Math.min(endIndex, totalItems)}</span> of <span className="font-semibold text-zinc-900 dark:text-white">{totalItems}</span> shoots
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                                    >
                                                        Previous
                                                    </button>

                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                            .filter(page => {
                                                                // Show first, last, current, and adjacent pages
                                                                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                                                            })
                                                            .map((page, idx, arr) => (
                                                                <React.Fragment key={page}>
                                                                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                                                                        <span className="px-2 text-zinc-400">...</span>
                                                                    )}
                                                                    <button
                                                                        onClick={() => setCurrentPage(page)}
                                                                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === page
                                                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg'
                                                                            : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                                            }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                </React.Fragment>
                                                            ))}
                                                    </div>

                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'Calendar' && (
                            <div className="animate-in fade-in duration-500">
                                <ShootsCalendar shoots={shoots} />
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
                </AnimatePresence >
            </div >
        </div >
    );
};

export default ShootsPage;
