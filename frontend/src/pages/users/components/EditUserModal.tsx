
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { toast } from 'sonner';
import { X, Loader2, AlertCircle, ChevronDown, Check, RefreshCw, Copy } from 'lucide-react';
import { useRoles } from '../../../hooks/useRoles';
import api from '../../../api/axios';
import type { User } from '../../../types/user.types';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSuccess, user }) => {
    const { roles, loading: rolesLoading, fetchRoles } = useRoles();

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen, fetchRoles]);

    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: string;
        password: string;
    }>({
        name: '',
        email: '',
        role: '',
        password: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role?.name || '',
                password: '',
            });
            setStatus('idle');
            setErrorMessage('');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setStatus('submitting');
        const toastId = toast.loading('Updating user...');

        try {
            // Build the update payload - only include password if it's provided
            const updatePayload: {
                name: string;
                email: string;
                role: string;
                password?: string;
            } = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            // Only send password if a new one was entered
            if (formData.password && formData.password.trim() !== '') {
                updatePayload.password = formData.password;
            }

            await api.post(`/auth/users/${user.id}`, updatePayload);
            toast.success('User updated successfully!', { id: toastId });
            onSuccess();
            onClose();
        } catch (err: any) {
            setStatus('idle');
            const msg = err.response?.data?.message || 'Failed to update user';
            toast.error(msg, { id: toastId });
            setErrorMessage(msg);
        } finally {
            setStatus('idle');
        }
    };

    if (!user) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#323237] dark:to-[#111112] shadow-2xl border border-zinc-200 dark:border-white/10 p-0 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-white/5">
                        <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Edit User
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password (Optional)</label>
                            <div className="relative flex gap-2">
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none font-mono"
                                    placeholder="Leave blank to keep current"
                                />
                                <div className="flex gap-1 absolute right-2 top-1.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                                            let pass = '';
                                            for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
                                            setFormData(prev => ({ ...prev, password: pass }));
                                        }}
                                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg text-zinc-500 transition-colors"
                                        title="Generate Password"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (formData.password) {
                                                navigator.clipboard.writeText(formData.password);
                                                toast.success('Password copied to clipboard!');
                                            }
                                        }}
                                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg text-zinc-500 transition-colors"
                                        title="Copy Password"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500">Only fill this if you want to reset the user's password.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
                            <Select.Root
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                                disabled={rolesLoading}
                            >
                                <Select.Trigger className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none text-sm text-zinc-900 dark:text-zinc-100">
                                    <Select.Value placeholder="Select a role..." />
                                    <Select.Icon>
                                        {rolesLoading ? (
                                            <Loader2 size={16} className="animate-spin text-zinc-400" />
                                        ) : (
                                            <ChevronDown size={16} className="text-zinc-500" />
                                        )}
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="overflow-hidden bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-white/10 z-[102]">
                                        <Select.Viewport className="p-1">
                                            {roles.map((role) => (
                                                <Select.Item
                                                    key={role.id}
                                                    value={role.name}
                                                    className="relative flex items-center px-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 focus:bg-zinc-100 dark:focus:bg-white/5 focus:outline-none cursor-pointer user-select-none data-[state=checked]:text-black dark:data-[state=checked]:text-white data-[state=checked]:font-medium"
                                                >
                                                    <Select.ItemText>{role.name}</Select.ItemText>
                                                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                                                        <Check size={14} />
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                            ))}
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 pt-2">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="flex-1 px-3 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors text-zinc-700 dark:text-zinc-300 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="flex-1 px-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-zinc-900/20 dark:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EditUserModal;
