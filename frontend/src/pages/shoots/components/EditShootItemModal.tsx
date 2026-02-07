import React, { useState, useEffect } from 'react';
import { X, Loader2, UserPlus, Users, Calendar, Trash2, ChevronDown, Camera } from 'lucide-react';

import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { useUsers } from '../../../hooks/useUsers';
import { useSettings } from '../../../hooks/useSettings';
import { useShoots } from '../../../hooks/useShoots';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
                eventDate: item.eventDate || '',
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
        if (!selectedUserId) {
            toast.error('Please select a user');
            return;
        }
        if (!item?.id) {
            toast.error('Item ID missing');
            return;
        }

        try {
            console.log('Assigning user:', selectedUserId, 'to item:', item.id);
            await assignUserToItem(item.id, selectedUserId);

            const user = users.find(u => u.id === selectedUserId);
            if (user) {
                setAssignedUsers(prev => {
                    if (prev.some(u => u.id === user.id)) return prev;
                    return [...prev, user];
                });
                toast.success(`Assigned ${user.name}`);
            }

            setSelectedUserId('');
            if (onRefresh) onRefresh();
        } catch (error: any) {
            console.error('Assignment failed:', error);
            // useShoots already toasts error, but logging helps
        }
    };

    const handleUnassignUser = async (userId: string) => {
        if (!item?.id) return;
        try {
            await unassignUserFromItem(item.id, userId);
            setAssignedUsers(prev => prev.filter(u => u.id !== userId));
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Unassignment failed:', error);
        }
    };

    const availableUsers = users.filter(u => !assignedUsers.some(au => au.id === u.id));

    if (!isOpen || !item) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    onInteractOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                            target.closest('.react-datepicker__day') ||
                            target.closest('[class*="react-datepicker"]')
                        ) {
                            e.preventDefault();
                        }
                    }}
                    className="fixed left-[50%] top-[50%] z-[101] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-0 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">

                    {/* Header */}
                    <div className="flex justify-between items-start px-6 py-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
                        <div>
                            <Dialog.Title className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Edit Shoot Item
                            </Dialog.Title>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase tracking-wider border border-zinc-200 dark:border-zinc-700">
                                    {item.type}
                                </span>
                                <p className="text-sm font-medium text-zinc-500">{item.name}</p>
                            </div>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                className="p-2 -mr-2 -mt-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Include Toggle Card */}
                        <div className="flex items-center justify-between p-5 bg-orange-50/50 dark:bg-zinc-800/50 rounded-2xl border border-orange-100/50 dark:border-zinc-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
                                    <Camera size={20} />
                                </div>
                                <div>
                                    <label htmlFor="isIncluded" className="block text-sm font-bold text-zinc-900 dark:text-white cursor-pointer">
                                        Include in Shoot
                                    </label>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        Mark this item as active
                                    </p>
                                </div>
                            </div>

                            {/* Custom Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="isIncluded"
                                    className="sr-only peer"
                                    checked={formData.isIncluded}
                                    onChange={(e) => setFormData({ ...formData, isIncluded: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                            </label>
                        </div>




                        {/* EVENT-specific fields */}
                        {isEventItem && (
                            <div className="space-y-5 p-6 bg-orange-50/50 dark:bg-zinc-800/30 rounded-3xl border border-orange-100/50 dark:border-zinc-800">
                                <div className="text-xs font-bold uppercase text-orange-600 dark:text-orange-500 flex items-center gap-2 tracking-wider">
                                    <Calendar size={14} className="stroke-[2.5]" /> Event Details
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1">Event Date</label>
                                        <div className="relative group">
                                            <style>{`
                                                .react-datepicker-wrapper { width: 100%; }
                                                .react-datepicker {
                                                    font-family: inherit;
                                                    border: 1px solid #e4e4e7;
                                                    border-radius: 0.75rem;
                                                    overflow: hidden;
                                                    background-color: #fff;
                                                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                                                    z-index: 9999;
                                                }
                                                .dark .react-datepicker {
                                                    border-color: #27272a;
                                                    background-color: #18181b;
                                                }
                                                .react-datepicker__header {
                                                    background-color: #fff;
                                                    border-bottom: 1px solid #f4f4f5;
                                                    padding-top: 1rem;
                                                }
                                                .dark .react-datepicker__header {
                                                    background-color: #18181b;
                                                    border-color: #27272a;
                                                }
                                                .react-datepicker__current-month {
                                                    font-weight: 700;
                                                    color: #18181b;
                                                    margin-bottom: 0.5rem;
                                                }
                                                .dark .react-datepicker__current-month { color: #fff; }
                                                .react-datepicker__day-name { color: #a1a1aa; }
                                                .react-datepicker__day {
                                                    color: #3f3f46;
                                                    border-radius: 0.375rem;
                                                    margin: 0.166rem;
                                                }
                                                .dark .react-datepicker__day { color: #e4e4e7; }
                                                .react-datepicker__day:hover {
                                                    background-color: #f4f4f5;
                                                    color: #000;
                                                }
                                                .dark .react-datepicker__day:hover {
                                                    background-color: #27272a;
                                                    color: #fff;
                                                }
                                                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                                                    background-color: #f97316 !important;
                                                    color: #fff !important;
                                                }
                                                .react-datepicker__triangle { display: none; }
                                                .react-datepicker__navigation-icon::before {
                                                    border-color: #a1a1aa;
                                                }
                                            `}</style>
                                            <DatePicker
                                                selected={formData.eventDate ? new Date(formData.eventDate) : null}
                                                onChange={(date: Date | null) => {
                                                    setFormData({ ...formData, eventDate: date ? date.toISOString() : '' });
                                                }}
                                                placeholderText="Select event date"
                                                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer placeholder:text-zinc-400"
                                                dateFormat="MMMM d, yyyy"
                                                wrapperClassName="w-full"
                                                popperPlacement="bottom-start"
                                                showPopperArrow={false}
                                                portalId="root"
                                                popperClassName="!z-[99999]"
                                                autoFocus={false}
                                            />
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1">Location</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="e.g. Grand Ballroom"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none dark:text-white text-sm shadow-sm transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                        )}

                        {/* Crew Assignment - Only for EVENT items when setting is enabled */}
                        {showCrewAssignment && (
                            <div className="space-y-3 p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <div className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 px-1">
                                    <Users size={12} /> Crew Assignment
                                </div>

                                {/* Assigned Users */}
                                {assignedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {assignedUsers.map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm shadow-sm"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-[11px] text-white font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{user.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUnassignUser(user.id)}
                                                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add User - Radix Select */}
                                {availableUsers.length > 0 && (
                                    <div className="flex gap-2">
                                        <Select.Root value={selectedUserId} onValueChange={setSelectedUserId}>
                                            <Select.Trigger className="flex-1 flex items-center justify-between px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-left focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 outline-none data-[placeholder]:text-zinc-500">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <Select.Value placeholder="Select crew..." />
                                                </div>
                                                <Select.Icon>
                                                    <ChevronDown size={14} className="text-zinc-400 opacity-50" />
                                                </Select.Icon>
                                            </Select.Trigger>

                                            <Select.Portal>
                                                <Select.Content
                                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden min-w-[200px] z-[9999]"
                                                    position="popper"
                                                    sideOffset={4}
                                                    align="start"
                                                >
                                                    <Select.Viewport className="p-1 max-h-[200px] overflow-y-auto">
                                                        {availableUsers.map((user: any) => (
                                                            <Select.Item
                                                                key={user.id}
                                                                value={user.id}
                                                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                                            >
                                                                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-medium shrink-0 uppercase border border-zinc-200 dark:border-zinc-700">
                                                                    {user.name?.charAt(0)}
                                                                </div>
                                                                <span className="truncate flex-1">
                                                                    <Select.ItemText>{user.name}</Select.ItemText>
                                                                </span>
                                                                {user.role?.name && (
                                                                    <span className="text-xs text-zinc-400 truncate max-w-[80px]">
                                                                        {user.role.name}
                                                                    </span>
                                                                )}
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Portal>
                                        </Select.Root>

                                        <button
                                            type="button"
                                            onClick={handleAssignUser}
                                            disabled={!selectedUserId}
                                            className="px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium shrink-0 flex items-center gap-1.5"
                                        >
                                            <UserPlus size={14} />
                                            <span>Assign</span>
                                        </button>
                                    </div>
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
                                        className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                                        disabled={!formData.isIncluded}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-zinc-500">Dimensions</label>
                                    <input
                                        type="text"
                                        value={formData.dimensions}
                                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                                        disabled={!formData.isIncluded}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-100 text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root >
    );
};

export default EditShootItemModal;
