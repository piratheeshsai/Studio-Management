import React, { useState } from 'react';
import { X, Loader2, CreditCard, Banknote, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    balanceDue: number;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onSave, balanceDue }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        method: 'CASH',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                ...formData,
                amount: Number(formData.amount)
            });
            onClose();
            setFormData({ amount: '', method: 'CASH', note: '', date: new Date().toISOString().split('T')[0] }); // Reset
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
                >
                    <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Record Payment</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex justify-between items-center">
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">Current Balance Due</span>
                            <span className="text-xl font-bold text-green-700 dark:text-green-400">${balanceDue.toLocaleString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:text-white font-mono text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Payment Method</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'CASH', label: 'Cash', icon: Banknote },
                                    { id: 'BANK_TRANSFER', label: 'Bank', icon: Landmark },
                                    { id: 'CHEQUE', label: 'Cheque', icon: CreditCard },
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, method: m.id })}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all
                                            ${formData.method === m.id
                                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white'
                                                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
                                    >
                                        <m.icon size={20} />
                                        <span className="text-xs font-bold">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Note (Optional)</label>
                            <input
                                type="text"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                                placeholder="e.g. Advance payment"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                Record Payment
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddPaymentModal;
