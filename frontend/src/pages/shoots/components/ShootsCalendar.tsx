import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Shoot } from '../../../types/shoot.types';

interface ShootsCalendarProps {
    shoots: Shoot[];
}

const ShootsCalendar: React.FC<ShootsCalendarProps> = ({ shoots }) => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to get days in month
    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Helper to get first day of month (0-6, Sun-Sat)
    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Navigate months
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Group shoots by date
    const shootsByDate = useMemo(() => {
        const map = new Map<string, Shoot[]>();
        shoots.forEach(shoot => {
            if (shoot.eventDate) {
                const dateKey = new Date(shoot.eventDate).toDateString();
                const existing = map.get(dateKey) || [];
                map.set(dateKey, [...existing, shoot]);
            }
        });
        return map;
    }, [shoots]);

    // Generate calendar grid
    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Blank spaces for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 rounded-[2rem] bg-transparent" />);
        }

        // Days of current month
        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            const dateKey = date.toDateString();
            const dayShoots = shootsByDate.get(dateKey) || [];
            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <div
                    key={d}
                    className={`
                        group relative h-32 p-3 rounded-[2rem] transition-colors border
                        ${isToday
                            ? 'bg-white dark:bg-zinc-900 ring-2 ring-orange-500/20 border-orange-100 dark:border-orange-900/30'
                            : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700'
                        }
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`
                            text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-colors
                            ${isToday
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                : 'text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800'
                            }
                        `}>
                            {d}
                        </span>
                        {dayShoots.length > 0 && (
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                {dayShoots.length} SHOOTS
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5 overflow-y-auto max-h-[80px] scrollbar-none">
                        {dayShoots.map(shoot => (
                            <div
                                key={shoot.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/shoots/${shoot.id}`);
                                }}
                                className="cursor-pointer group/shoot"
                            >
                                <div className={`
                                    flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all
                                    ${shoot.status === 'COMPLETED'
                                        ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'
                                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 hover:border-orange-200 dark:hover:border-orange-900'
                                    }
                                `}>
                                    {/* Avatar */}
                                    <div className={`
                                        w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0
                                        ${shoot.status === 'COMPLETED' ? 'bg-green-500' : 'bg-zinc-800 dark:bg-zinc-600'}
                                    `}>
                                        {shoot.client?.name?.charAt(0) || '?'}
                                    </div>

                                    <div className="flex items-center gap-1.5 min-w-0">
                                        {shoot.shootCode && (
                                            <span className="text-[9px] font-mono font-bold text-zinc-500 dark:text-zinc-500 shrink-0">
                                                {shoot.shootCode}
                                            </span>
                                        )}
                                        <span className="truncate text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                                            {shoot.client?.name}
                                        </span>
                                    </div>
                                    {shoot.status !== 'COMPLETED' && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            );
        }

        return days;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* Stats / Legend - Left/Center aligned in design or separated */}
                <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Completed</span>
                    </div>
                </div>

                {/* Centered Month Navigation */}
                <div className="flex items-center bg-white dark:bg-zinc-900 rounded-2xl p-1.5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <h2 className="w-40 text-center text-sm font-bold text-zinc-900 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>

                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>

                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>

                    <button
                        onClick={goToToday}
                        className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-zinc-50/50 dark:bg-black/20 rounded-[2.5rem] p-6 border border-zinc-100 dark:border-white/5">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-4">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
};

export default ShootsCalendar;
