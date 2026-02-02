import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, Check, CreditCard, Banknote, Building2, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdvancePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentData: { amount: number; method: string; reference?: string; date: Date }) => Promise<void>;
    totalAmount: number;
    currency?: string;
}

const PAYMENT_METHODS = [
    { value: 'CASH', label: 'Cash', icon: Banknote },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building2 },
    { value: 'CARD', label: 'Card', icon: CreditCard },
    { value: 'CHECK', label: 'Check', icon: CreditCard }, // Using CreditCard as placeholder or Generic
];

const AdvancePaymentModal: React.FC<AdvancePaymentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    totalAmount,
    currency = 'LKR'
}) => {
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('CASH');
    const [reference, setReference] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setIsSubmitting(true);
            await onConfirm({
                amount: numAmount,
                method,
                reference,
                date: new Date()
            });
            // Don't close here, assuming parent handles closing or navigating
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[201] w-full max-w-md translate-x-[-50%] translate-y-[-50%] outline-none p-0">
                    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">

                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                            <div>
                                <Dialog.Title className="text-lg font-bold text-zinc-900 dark:text-white">
                                    Advance Payment
                                </Dialog.Title>
                                <Dialog.Description className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    Record an initial payment for this shoot.
                                </Dialog.Description>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount ({currency})</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full text-3xl font-bold bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-2 focus:border-orange-500 focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-400">Total Agreed: {currency} {totalAmount.toLocaleString()}</span>
                                    {amount && !isNaN(parseFloat(amount)) && (
                                        <span className={`font-medium ${totalAmount - parseFloat(amount) < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                                            Remaining: {currency} {Math.max(0, totalAmount - parseFloat(amount)).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Payment Method</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PAYMENT_METHODS.map((pm) => {
                                        const Icon = pm.icon;
                                        const isSelected = method === pm.value;
                                        return (
                                            <div
                                                key={pm.value}
                                                onClick={() => setMethod(pm.value)}
                                                className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${isSelected
                                                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400'
                                                        : 'bg-zinc-50 dark:bg-zinc-900 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                <span className="text-xs font-bold">{pm.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reference / Notes */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Reference / Note (Optional)</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g. Transaction ID, Receipt #"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-zinc-900 dark:text-white"
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Skip Payment
                                </button>
                                <button
                                    type="submit"
                                    disabled={!amount || isSubmitting}
                                    className="flex-[2] py-3 px-4 rounded-xl bg-[#FF4D00] hover:bg-[#ff5e1a] text-white text-sm font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Record Payment'
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AdvancePaymentModal;
