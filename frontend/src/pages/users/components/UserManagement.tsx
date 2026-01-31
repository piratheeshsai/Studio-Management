import { useState } from 'react';
import { Plus, Search, MoreVertical, Loader2, RefreshCw, Pencil, Trash2, CheckCircle, UserX } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';
import type { User } from '../../../types/user.types';

interface UserManagementProps {
    searchQuery: string;
    users: User[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    deactivateUser: (id: string) => Promise<void>;
    activateUser: (id: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    setIsAddUserModalOpen: (isOpen: boolean) => void;
    isAddUserModalOpen: boolean;
}

const UserManagement = ({
    searchQuery,
    users,
    loading,
    error,
    refetch,
    deactivateUser,
    activateUser,
    deleteUser,
    setIsAddUserModalOpen,
    isAddUserModalOpen
}: UserManagementProps) => {
    const { user: currentUser, hasPermission } = useAuth();
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [confirmDetail, setConfirmDetail] = useState<{
        type: 'deactivate' | 'delete' | 'activate';
        user: User;
        title: string;
        description: string;
        confirmText: string;
    } | null>(null);

    // Filter users based on search query
    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Users Table / List */}
            <div className="bg-white/50 dark:bg-gradient-to-b dark:from-[#323237] dark:to-[#111112] backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden">
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
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
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
                                                            onClick={() => setUserToEdit(user)}
                                                        >
                                                            <Pencil size={14} />
                                                            Edit
                                                        </DropdownMenu.Item>

                                                        {hasPermission('USER_DELETE') && (
                                                            <>
                                                                <DropdownMenu.Separator className="h-px bg-zinc-100 dark:bg-white/5 my-1" />
                                                                {user.status === 'Active' ? (
                                                                    <DropdownMenu.Item
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 outline-none cursor-pointer"
                                                                        onClick={() => setConfirmDetail({
                                                                            type: 'deactivate',
                                                                            user,
                                                                            title: 'Deactivate User',
                                                                            description: `Are you sure you want to deactivate ${user.name}? This will prevent them from logging into the system.`,
                                                                            confirmText: 'Deactivate'
                                                                        })}
                                                                    >
                                                                        <UserX size={14} />
                                                                        Deactivate
                                                                    </DropdownMenu.Item>
                                                                ) : (
                                                                    <DropdownMenu.Item
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 outline-none cursor-pointer"
                                                                        onClick={() => setConfirmDetail({
                                                                            type: 'activate',
                                                                            user,
                                                                            title: 'Activate User',
                                                                            description: `Are you sure you want to activate ${user.name}? They will be able to log in again.`,
                                                                            confirmText: 'Activate'
                                                                        })}
                                                                    >
                                                                        <CheckCircle size={14} />
                                                                        Activate
                                                                    </DropdownMenu.Item>
                                                                )}
                                                            </>
                                                        )}

                                                        {currentUser?.role === 'SUPER_ADMIN' && (
                                                            <>
                                                                <DropdownMenu.Separator className="h-px bg-zinc-100 dark:bg-white/5 my-1" />
                                                                <DropdownMenu.Item
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 outline-none cursor-pointer"
                                                                    onClick={() => setConfirmDetail({
                                                                        type: 'delete',
                                                                        user,
                                                                        title: 'Delete User Permanently',
                                                                        description: `PERMANENT ACTION: Are you sure you want to DELETE ${user.name}? This cannot be undone and all associated data will be removed.`,
                                                                        confirmText: 'Delete Permanently'
                                                                    })}
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

            <EditUserModal
                isOpen={!!userToEdit}
                user={userToEdit}
                onClose={() => setUserToEdit(null)}
                onSuccess={refetch}
            />

            <DeleteConfirmationDialog
                isOpen={!!confirmDetail}
                onClose={() => setConfirmDetail(null)}
                onConfirm={async () => {
                    if (!confirmDetail) return;

                    try {
                        if (confirmDetail.type === 'deactivate') {
                            await deactivateUser(confirmDetail.user.id);
                            toast.success('User deactivated successfully');
                        } else if (confirmDetail.type === 'activate') {
                            await activateUser(confirmDetail.user.id);
                            toast.success('User activated successfully');
                        } else {
                            await deleteUser(confirmDetail.user.id);
                            toast.success('User deleted permanently');
                        }
                    } catch (error) {
                        toast.error(`Failed to ${confirmDetail.type} user`);
                    }
                }}
                title={confirmDetail?.title || ''}
                description={confirmDetail?.description || ''}
                itemName={confirmDetail?.user.name}
                confirmText={confirmDetail?.confirmText}
            />
        </div>
    );
};

export default UserManagement;
