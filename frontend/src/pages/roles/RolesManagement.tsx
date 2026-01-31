
import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Shield, MoreVertical, Pencil, Trash2, ShieldAlert, Briefcase, FileEdit, Eye, Zap, User, Users, Lock } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import type { Role } from '../../types/roles.types';

interface RolesManagementProps {
    searchQuery: string;
    roles: Role[];
    loading: boolean;
    fetchRoles: () => void;
    deleteRole: (id: string) => Promise<void>;
}

const RolesManagement = ({ searchQuery, roles, loading, fetchRoles, deleteRole }: RolesManagementProps) => {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();

    const getRoleIcon = (name: string) => {
        const normalized = name.toLowerCase();
        if (normalized.includes('super')) return Zap;
        if (normalized.includes('admin')) return ShieldAlert;
        if (normalized.includes('manager')) return Briefcase;
        if (normalized.includes('editor') || normalized.includes('write')) return FileEdit;
        if (normalized.includes('viewer') || normalized.includes('read')) return Eye;
        if (normalized.includes('user')) return User;
        return Shield;
    };

    // Use effect to fetch roles if not passed or initial
    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const getGradient = (name: string) => {
        const normalized = name.toLowerCase();
        if (normalized.includes('super')) return 'from-amber-500 to-orange-600';
        if (normalized.includes('admin')) return 'from-blue-600 to-cyan-500';
        if (normalized.includes('manager')) return 'from-emerald-500 to-teal-600';
        return 'from-zinc-500 to-zinc-700'; // Default
    };

    const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <DeleteConfirmationDialog
                isOpen={!!roleToDelete}
                onClose={() => setRoleToDelete(null)}
                onConfirm={async () => {
                    if (roleToDelete) {
                        await deleteRole(roleToDelete.id);
                        setRoleToDelete(null);
                    }
                }}
                title="Delete Role"
                description="Are you sure you want to permanently delete this role? Users assigned to this role may lose access to certain features."
                itemName={roleToDelete?.name}
            />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRoles.map((role) => {
                    const RoleIcon = getRoleIcon(role.name);
                    const userCount = role._count?.users || 0;
                    const gradient = getGradient(role.name);

                    return (
                        <div key={role.id} className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-1 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 hover:-translate-y-1">

                            {/* Card Content Container */}
                            <div className="flex flex-col h-full bg-white dark:bg-zinc-900/50 rounded-[20px] p-6 z-10 relative">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                                        <RoleIcon size={24} strokeWidth={1.5} />
                                    </div>

                                    {role.name !== 'SUPER_ADMIN' && (
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                                <button className="p-2 -mr-2 -mt-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 outline-none">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content
                                                    className="min-w-[160px] bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-white/10 p-1.5 z-50 animate-in fade-in-0 zoom-in-95"
                                                    align="end"
                                                >
                                                    <DropdownMenu.Item
                                                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 outline-none cursor-pointer transition-colors"
                                                        onClick={() => navigate(`/roles/${role.id}/edit`)}
                                                    >
                                                        <Pencil size={16} className="text-zinc-400" />
                                                        Edit Role
                                                    </DropdownMenu.Item>

                                                    {hasPermission('ROLE_DELETE') && (
                                                        <>
                                                            <DropdownMenu.Separator className="h-px bg-zinc-100 dark:bg-white/5 my-1" />
                                                            <DropdownMenu.Item
                                                                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 outline-none cursor-pointer transition-colors"
                                                                onClick={() => setRoleToDelete(role)}
                                                            >
                                                                <Trash2 size={16} />
                                                                Delete Role
                                                            </DropdownMenu.Item>
                                                        </>
                                                    )}
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    )}
                                </div>

                                {/* Title & Stats */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{role.name}</h3>
                                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} />
                                            <span>{userCount} Users</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                        <div className="flex items-center gap-1.5">
                                            <Lock size={16} />
                                            <span>{role.permissions.length} Perms</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Permissions Preview */}
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                                        <span>Capabilities</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.slice(0, 3).map(p => (
                                            <span
                                                key={p.id}
                                                className="px-2.5 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg border border-zinc-200 dark:border-white/5"
                                            >
                                                {p.name}
                                            </span>
                                        ))}
                                        {role.permissions.length > 3 && (
                                            <span className="px-2.5 py-1 text-xs font-medium bg-zinc-50 dark:bg-white/5 text-zinc-500 rounded-lg border border-zinc-200 dark:border-white/5">
                                                +{role.permissions.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State / Add New Card */}
                {hasPermission('ROLE_CREATE') && (
                    <button
                        onClick={() => navigate('/roles/create')}
                        className="group flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-300 gap-4"
                    >
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500 group-hover:scale-110 transition-transform duration-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Create New Role</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Define a new role and assign permissions</p>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default RolesManagement;
