import React, { useState, useEffect } from 'react';
import { X, Loader2, UserPlus, Users, MapPin, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUsers } from '../../../hooks/useUsers';
import { useSettings } from '../../../hooks/useSettings';
import { useShoots } from '../../../hooks/useShoots';

interface EditShootItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onSave: (data: any) => Promise<void>;
    onRefresh?: () => void;
}

const EditShootItemModal: React.FC<EditShootItemModalProps> = ({ isOpen, onClose, item, onSave, onRefresh }) => {
    const { users } = useUsers();
    const { settings } = useSettings();
    const { assignUserToItem, unassignUserFromItem } = useShoots();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        isIncluded: true,
        pages: 0,
        dimensions: '',
        status: '',
        eventDate: '',
        location: '',
    });
    const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    const isEventItem = item?.type === 'EVENT';
    const showCrewAssignment = isEventItem && settings?.enableCrewAssignment;

    useEffect(() => {
        if (item) {
            setFormData({
                isIncluded: item.isIncluded,
                pages: item.pages || 0,
                dimensions: item.dimensions || '',
                status: item.status || 'DESIGNING',
                eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : '',
                location: item.location || '',
            });
            setAssignedUsers(item.assignments?.map((a: any) => a.user) || []);
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSave = isEventItem
                ? { ...formData, eventDate: formData.eventDate || undefined }
                : { isIncluded: formData.isIncluded, pages: formData.pages, dimensions: formData.dimensions, status: formData.status };
            await onSave(dataToSave);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignUser = async () => {
        if (!selectedUserId || !item?.id) return;
        try {
            await assignUserToItem(item.id, selectedUserId);
            const user = users.find(u => u.id === selectedUserId);
            if (user) {
                setAssignedUsers(prev => [...prev, user]);
            }
            setSelectedUserId('');
            onRefresh?.();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnassignUser = async (userId: string) => {
        if (!item?.id) return;
        try {
            await unassignUserFromItem(item.id, userId);
            setAssignedUsers(prev => prev.filter(u => u.id !== userId));
            onRefresh?.();
        } catch (error) {
            console.error(error);
        }
    };

    const availableUsers = users.filter(u => !assignedUsers.some(au => au.id === u.id));

    if (!isOpen || !item) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit: {item.name}</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Include Toggle */}
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

                        {/* EVENT-specific fields */}
                        {isEventItem && (
                            <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg border border-orange-100 dark:border-orange-500/20">
                                <div className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                    <Calendar size={12} /> Event Details
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Event Date</label>
                                        <input
                                            type="date"
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                            <MapPin size={10} /> Location
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Grand Ballroom"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Crew Assignment - Only for EVENT items when setting is enabled */}
                        {showCrewAssignment && (
                            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                    <Users size={12} /> Crew Assignment
                                </div>

                                {/* Assigned Users */}
                                {assignedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {assignedUsers.map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-zinc-700 dark:text-zinc-300">{user.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUnassignUser(user.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add User */}
                                {availableUsers.length > 0 && (
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedUserId}
                                            onChange={(e) => setSelectedUserId(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white text-sm"
                                        >
                                            <option value="">Select crew member...</option>
                                            {availableUsers.map((user: any) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.role?.name || 'No role'})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAssignUser}
                                            disabled={!selectedUserId}
                                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                    </div>
                                )}

                                {availableUsers.length === 0 && assignedUsers.length > 0 && (
                                    <p className="text-xs text-zinc-500">All available users are assigned</p>
                                )}
                            </div>
                        )}

                        {/* PRODUCT-specific fields */}
                        {!isEventItem && (
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
                        )}

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white cursor-pointer"
                                disabled={!formData.isIncluded}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="DESIGNING">Designing</option>
                                <option value="PRINTING">Printing</option>
                                <option value="READY">Ready</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
                        </div>

                        {/* Actions */}
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
