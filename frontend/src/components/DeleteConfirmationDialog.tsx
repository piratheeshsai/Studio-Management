
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    description: string;
    itemName?: string;
    confirmText?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    confirmText = 'Delete Permanently'
}) => {
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-white/10 p-0 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <Dialog.Title className="text-lg font-bold text-zinc-900 dark:text-white">
                                    {title}
                                </Dialog.Title>
                                {itemName && (
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        target: <span className="font-mono text-zinc-700 dark:text-zinc-300">{itemName}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <Dialog.Description className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            {description}
                        </Dialog.Description>

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DeleteConfirmationDialog;
