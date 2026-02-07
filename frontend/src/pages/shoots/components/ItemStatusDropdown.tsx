import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending', color: 'bg-zinc-500' },
    { value: 'DESIGNING', label: 'Designing', color: 'bg-blue-500' },
    { value: 'PRINTING', label: 'Printing', color: 'bg-purple-500' },
    { value: 'READY', label: 'Ready', color: 'bg-emerald-500' },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-600' },
];

interface ItemStatusDropdownProps {
    currentStatus: string;
    onStatusChange: (status: string) => void;
}

const ItemStatusDropdown: React.FC<ItemStatusDropdownProps> = ({ currentStatus, onStatusChange }) => {
    const current = STATUS_OPTIONS.find(s => s.value === currentStatus);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'READY':
            case 'DELIVERED':
                return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
            case 'DESIGNING':
                return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
            case 'PRINTING':
                return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
            default:
                return 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400';
        }
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 shrink-0
                        hover:ring-2 hover:ring-offset-1 hover:ring-orange-500/50 transition-all cursor-pointer
                        ${getStatusStyle(currentStatus)}
                    `}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${current?.color}`} />
                    {current?.label || currentStatus}
                    <ChevronDown size={12} className="opacity-60" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-1 z-[100] min-w-[140px]"
                    sideOffset={4}
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                >
                    {STATUS_OPTIONS.map((status) => (
                        <DropdownMenu.Item
                            key={status.value}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (status.value !== currentStatus) {
                                    onStatusChange(status.value);
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <span className={`w-2 h-2 rounded-full ${status.color}`} />
                            <span className="flex-1 text-zinc-900 dark:text-white">{status.label}</span>
                            {status.value === currentStatus && (
                                <Check size={14} className="text-orange-500" />
                            )}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default ItemStatusDropdown;
