import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditShootItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onSave: (data: any) => Promise<void>;
}

const EditShootItemModal: React.FC<EditShootItemModalProps> = ({ isOpen, onClose, item, onSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        isIncluded: true,
        pages: 0,
        dimensions: '',
        status: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                isIncluded: item.isIncluded,
                pages: item.pages || 0,
                dimensions: item.dimensions || '',
                status: item.status || 'DESIGNING'
            });
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Item: {item.name}</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            <input
                                type="checkbox"
                                id="isIncluded"
                                checked={formData.isIncluded}
                                onChange={(e) => setFormData({ ...formData, isIncluded: e.target.checked })}
                                className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor="isIncluded" className="text-sm font-medium text-zinc-900 dark:text-white select-none cursor-pointer">
                                Include in Shoot
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500">Pages</label>
                                <input
                                    type="number"
                                    value={formData.pages}
                                    onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                                    disabled={!formData.isIncluded}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500">Dimensions</label>
                                <input
                                    type="text"
                                    value={formData.dimensions}
                                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                                    disabled={!formData.isIncluded}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white cursor-pointer"
                                disabled={!formData.isIncluded}
                            >
                                <option value="DESIGNING">Designing</option>
                                <option value="PRINTING">Printing</option>
                                <option value="READY">Ready</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
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
                                className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditShootItemModal;
