import { useState } from 'react';
import { Plus, Search, MoreVertical, Filter, Loader2, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import { useUsers } from '../../../hooks/useUsers';
import { useAuth } from '../../../context/AuthContext';
import AddUserModal from './AddUserModal';

const UserManagement = () => {
    const { hasPermission, user: currentUser } = useAuth();
    const { users, loading, error, refetch, deactivateUser, deleteUser } = useUsers();
    console.log('Users data:', users);

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 text-zinc-800 dark:text-zinc-200"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={refetch}
                        className="p-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors text-zinc-700 dark:text-zinc-300"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors text-zinc-700 dark:text-zinc-300">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    {hasPermission('USER_CREATE') && (
                        <button
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-zinc-900/20 dark:shadow-white/20"
                        >
                            <Plus size={18} />
                            <span>Add User</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Users Table / List */}
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">User</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Role</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Joined</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                                            <Loader2 className="animate-spin" size={24} />
                                            <span>Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-medium">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {user.role?.name || 'No Role'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-zinc-500'}`}></span>
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger asChild>
                                                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 outline-none">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Portal>
                                                    <DropdownMenu.Content
                                                        className="min-w-[160px] bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-white/10 p-1 z-50 animate-in fade-in-0 zoom-in-95"
                                                        align="end"
                                                    >
                                                        <DropdownMenu.Item
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 outline-none cursor-pointer"
                                                            onClick={() => toast.info(`Edit user ${user.name}`)}
                                                        >
                                                            <Pencil size={14} />
                                                            Edit
                                                        </DropdownMenu.Item>

                                                        {hasPermission('USER_DELETE') && (
                                                            <>
                                                                <DropdownMenu.Separator className="h-px bg-zinc-100 dark:bg-white/5 my-1" />
                                                                <DropdownMenu.Item
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 outline-none cursor-pointer"
                                                                    onClick={async () => {
                                                                        if (window.confirm(`Are you sure you want to deactivate ${user.name}? This will prevent them from logging in.`)) {
                                                                            try {
                                                                                await deactivateUser(user.id);
                                                                                toast.success('User deactivated successfully');
                                                                            } catch (error) {
                                                                                toast.error('Failed to deactivate user');
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 size={14} />
                                                                    Deactivate
                                                                </DropdownMenu.Item>
                                                            </>
                                                        )}

                                                        {currentUser?.role === 'SUPER_ADMIN' && (
                                                            <>
                                                                <DropdownMenu.Separator className="h-px bg-zinc-100 dark:bg-white/5 my-1" />
                                                                <DropdownMenu.Item
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 outline-none cursor-pointer"
                                                                    onClick={async () => {
                                                                        if (window.confirm(`PERMANENT ACTION: Are you sure you want to PERMANENTLY DELETE ${user.name}? This cannot be undone.`)) {
                                                                            try {
                                                                                await deleteUser(user.id);
                                                                                toast.success('User deleted permanently');
                                                                            } catch (error) {
                                                                                toast.error('Failed to delete user');
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 size={14} />
                                                                    Delete (Permanent)
                                                                </DropdownMenu.Item>
                                                            </>
                                                        )}
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
            </div>

            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={refetch}
            />
        </div>
    );
};

export default UserManagement;
