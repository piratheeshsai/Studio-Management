
import { useState } from 'react';
import { Users, Search, RefreshCw, Plus, MapPin, Pencil, Trash2, Loader2, Filter, Check, ArrowUpAZ, ArrowDownAZ, MoreHorizontal } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../context/AuthContext';
import AddClientModal from './components/AddClientModal';
import EditClientModal from './components/EditClientModal';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import type { Client } from '../../types/client.types';

const ClientsPage = () => {
    const { hasPermission } = useAuth();
    const { clients, loading, refresh, deleteClient } = useClients();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    // Filter & Sort State
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' });
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

    const toggleFilter = (filter: string) => {
        const newFilters = new Set(activeFilters);
        if (newFilters.has(filter)) {
            newFilters.delete(filter);
        } else {
            newFilters.add(filter);
        }
        setActiveFilters(newFilters);
    };

    const toggleSort = (key: keyof Client) => {
        setSortConfig(current => {
            if (current?.key === key && current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const filteredClients = clients
        .filter(client => {
            // Search Query
            const matchesSearch =
                client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.phone?.includes(searchQuery);

            if (!matchesSearch) return false;

            // Active Filters
            if (activeFilters.has('hasEmail') && !client.email) return false;
            if (activeFilters.has('hasPhone') && !client.phone) return false;
            if (activeFilters.has('hasAddress') && !client.address) return false;

            return true;
        })
        .sort((a, b) => {
            if (!sortConfig) return 0;

            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            return sortConfig.direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Consolidated Header & Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & Subtitle */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Clients
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage your {clients.length} active users
                    </p>
                </div>

                {/* Compact Action Bar Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-1.5 shadow-sm dark:shadow-none flex flex-col sm:flex-row items-center gap-2 max-w-2xl w-full lg:w-auto">
                    {/* Search Input Container */}
                    <div className="relative flex-1 w-full lg:min-w-[300px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                        />
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Filter Dropdown */}
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    className={`relative p-2 rounded-xl border transition-all flex items-center justify-center gap-2 ${activeFilters.size > 0 ? 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400' : 'bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                                    title="Filter clients"
                                >
                                    <Filter size={16} className={activeFilters.size > 0 ? "fill-current" : ""} />
                                    {activeFilters.size > 0 && (
                                        <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-orange-500 text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                                            {activeFilters.size}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content className="z-[100] min-w-[220px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={8}>
                                    <DropdownMenu.Label className="text-[10px] font-bold text-zinc-400 px-3 py-2 uppercase tracking-widest">
                                        Sort By
                                    </DropdownMenu.Label>
                                    <DropdownMenu.Item
                                        onClick={() => toggleSort('name')}
                                        className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 outline-none cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {sortConfig?.key === 'name' && sortConfig?.direction === 'asc' ? <ArrowUpAZ size={14} /> : <ArrowDownAZ size={14} />}
                                            </div>
                                            Name
                                        </div>
                                        {sortConfig?.key === 'name' && <Check size={16} className="text-orange-500" />}
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Separator className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent my-2" />

                                    <DropdownMenu.Label className="text-[10px] font-bold text-zinc-400 px-3 py-2 uppercase tracking-widest">
                                        Filters
                                    </DropdownMenu.Label>
                                    {['hasEmail', 'hasPhone', 'hasAddress'].map((filter) => (
                                        <DropdownMenu.Item
                                            key={filter}
                                            onClick={() => toggleFilter(filter)}
                                            className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 outline-none cursor-pointer transition-colors"
                                        >
                                            <span className="capitalize">{filter.replace('has', 'Has ')}</span>
                                            {activeFilters.has(filter) && <Check size={16} className="text-orange-500" />}
                                        </DropdownMenu.Item>
                                    ))}
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>

                        <button
                            onClick={refresh}
                            disabled={loading}
                            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-white/10"
                            title="Refresh clients"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>

                        {hasPermission('CLIENT_CREATE') && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] whitespace-nowrap"
                            >
                                <Plus size={16} />
                                Add Client
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Standard Table Container */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/5">

                                <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Notes</th>
                                <th className="px-6 py-3 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-zinc-400 animate-pulse">
                                            <Loader2 className="animate-spin" size={24} />
                                            <span className="text-xs font-medium tracking-wide">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                                            <div className="size-12 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-400">
                                                <Users size={20} strokeWidth={1.5} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-sm font-medium text-zinc-900 dark:text-white">No clients found</h3>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                                                    {searchQuery || activeFilters.size > 0 ? 'Try adjusting filters' : 'Add your first client'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors border-b border-zinc-100 dark:border-white/5 last:border-0 relative">

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 text-xs font-bold border border-zinc-200 dark:border-white/5">
                                                    {client.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm text-zinc-900 dark:text-white">
                                                        {client.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        {client.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.phone ? (
                                                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 font-mono">
                                                    {client.phone}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.address ? (
                                                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 max-w-[150px]">
                                                    <MapPin size={12} className="text-zinc-400" />
                                                    <span className="text-xs font-medium truncate">{client.address}</span>
                                                </div>
                                            ) : (
                                                <span className="text-zinc-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.internal_notes ? (
                                                <div className="max-w-[140px]">
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate" title={client.internal_notes}>
                                                        {client.internal_notes}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-zinc-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger asChild>
                                                    <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Portal>
                                                    <DropdownMenu.Content className="z-[100] min-w-[160px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100" align="end" sideOffset={5}>
                                                        <DropdownMenu.Item
                                                            onClick={() => setClientToEdit(client)}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 outline-none cursor-pointer transition-colors"
                                                        >
                                                            <Pencil size={14} className="text-zinc-400" />
                                                            Edit
                                                        </DropdownMenu.Item>

                                                        <DropdownMenu.Separator className="h-px bg-zinc-100 dark:bg-white/5 my-1" />

                                                        <DropdownMenu.Item
                                                            onClick={() => setClientToDelete(client)}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 outline-none cursor-pointer transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </DropdownMenu.Item>
                                                    </DropdownMenu.Content>
                                                </DropdownMenu.Portal>
                                            </DropdownMenu.Root>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Standard */}
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02]">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Showing <span className="font-medium">{filteredClients.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all disabled:opacity-50" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals & Dialogs */}
            <AddClientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={refresh}
            />

            <EditClientModal
                isOpen={!!clientToEdit}
                client={clientToEdit}
                onClose={() => setClientToEdit(null)}
                onSuccess={refresh}
            />

            <DeleteConfirmationDialog
                isOpen={!!clientToDelete}
                onClose={() => setClientToDelete(null)}
                onConfirm={async () => {
                    if (clientToDelete) {
                        await deleteClient(clientToDelete.id);
                    }
                }}
                title="Delete Client"
                description="Are you sure you want to delete this client? This will permanently remove their contact information and history. This action cannot be undone."
                itemName={clientToDelete?.name}
            />
        </div>
    );
};

export default ClientsPage;
