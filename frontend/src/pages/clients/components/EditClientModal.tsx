import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { useClients } from '../../../hooks/useClients';
import type { Client, CreateClientData } from '../../../types/client.types';

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    onSuccess: () => void | Promise<void>;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onSuccess }) => {
    const { updateClient } = useClients();
    const [formData, setFormData] = useState<CreateClientData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        internal_notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                email: client.email || '',
                phone: client.phone || '',
                address: client.address || '',
                internal_notes: client.internal_notes || ''
            });
            setFieldErrors({}); // Clear errors when client changes
        }
    }, [client]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;

        if (!formData.name.trim() || !formData.phone?.trim()) {
            toast.error('Name and Phone Number are required');
            return;
        }

        setIsSubmitting(true);
        setFieldErrors({});
        const toastId = toast.loading('Updating client...');

        try {
            await updateClient(client.id, {
                ...formData,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                internal_notes: formData.internal_notes || undefined
            });

            toast.success('Client updated successfully', { id: toastId });
            await onSuccess();
            onClose();
        } catch (error: any) {
            const msg = error.message || 'Failed to update client';

            if (msg.toLowerCase().includes('email')) {
                setFieldErrors(prev => ({ ...prev, email: msg }));
            } else if (msg.toLowerCase().includes('phone')) {
                setFieldErrors(prev => ({ ...prev, phone: msg }));
            } else {
                toast.error(msg, { id: toastId });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#323237] dark:to-[#111112] shadow-2xl border border-zinc-200 dark:border-white/10 p-0 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out duration-200 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-white/5">
                        <Dialog.Title className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            Edit Client
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border ${fieldErrors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-200 dark:border-white/10 focus:ring-zinc-900/10 dark:focus:ring-white/10'} rounded-xl focus:ring-2 focus:outline-none transition-all`}
                                    placeholder="john@example.com"
                                />
                                {fieldErrors.email && (
                                    <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border ${fieldErrors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-200 dark:border-white/10 focus:ring-zinc-900/10 dark:focus:ring-white/10'} rounded-xl focus:ring-2 focus:outline-none transition-all`}
                                    placeholder="+1 (555) 000-0000"
                                />
                                {fieldErrors.phone && (
                                    <p className="text-xs text-red-500 font-medium">{fieldErrors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>



                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Internal Studio Notes (Private)</label>
                            <textarea
                                value={formData.internal_notes}
                                onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2.5 bg-amber-50/30 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none resize-none transition-all"
                                placeholder="e.g. VIP client, Referred by Arun..."
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-white/5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/10 transition-all text-zinc-700 dark:text-zinc-300 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-zinc-900/20 dark:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Update Client'
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EditClientModal;
