import React from 'react';
import { Search, Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const TopBar: React.FC = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex items-center justify-between px-8 
            bg-gradient-to-b from-white/95 via-white/80 to-transparent 
            dark:from-[#09090b] dark:via-[#09090b]/80 dark:to-transparent 
            pointer-events-none transition-colors duration-300">
            {/* Pointer events auto enabled on children */}

            {/* 1. Brand / Logo (Far Left - Aligned with Sidebar) */}
            <div className="flex items-center gap-3 pointer-events-auto min-w-[240px]">
                {/* Logo Icon */}
                <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4L6 28H34L20 4Z" fill="#F97316" stroke="#F97316" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M20 16L14 28H26L20 16Z" className="fill-zinc-900 dark:fill-[#09090b]" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight font-sans transition-colors">Stu<span className="font-normal text-zinc-900 dark:text-white">dio</span></span>
            </div>

            {/* 2. Search Bar (Centered) */}
            <div className="flex-1 flex justify-center pointer-events-auto">
                <div className="relative group w-full max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-600 dark:text-zinc-500 dark:group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2.5 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-2xl 
                            bg-white dark:bg-[#09090b] 
                            text-zinc-900 dark:text-zinc-200 
                            placeholder-zinc-400 dark:placeholder-zinc-500 
                            focus:outline-none focus:bg-zinc-50 dark:focus:bg-[#121214] 
                            focus:ring-1 focus:ring-amber-500/30 
                            text-sm transition-all shadow-sm hover:shadow-md
                            hover:border-zinc-300 dark:hover:border-zinc-700 
                            hover:bg-zinc-50 dark:hover:bg-[#121214]"
                        placeholder="Search here"
                    />
                </div>
            </div>

            {/* 3. Actions (Right) */}
            <div className="flex items-center justify-end gap-3 pointer-events-auto min-w-[240px]">
                {/* Theme Toggle Box */}
                <div
                    onClick={toggleTheme}
                    className="flex items-center bg-white dark:bg-[#09090b] rounded-xl p-1 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md h-10 cursor-pointer transition-all"
                >
                    <button
                        className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-300 ${theme === 'dark'
                                ? 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'
                                : 'bg-white text-amber-500 shadow-sm transform scale-105'
                            }`}
                    >
                        <Sun className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                        className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-300 ${theme === 'light'
                                ? 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'
                                : 'bg-[#18181b] text-white shadow-sm transform scale-105'
                            }`}
                    >
                        <Moon className="w-3.5 h-3.5 fill-current" />
                    </button>
                </div>

                {/* Notification Box */}
                <button className="relative h-10 w-10 flex items-center justify-center 
                    bg-white dark:bg-[#09090b] 
                    rounded-xl 
                    text-zinc-600 dark:text-zinc-400 
                    hover:text-zinc-900 dark:hover:text-white 
                    border border-zinc-200 dark:border-zinc-800 
                    hover:bg-zinc-50 dark:hover:bg-[#121214] 
                    transition-all shadow-sm hover:shadow-md group">
                    <Bell className="w-4.5 h-4.5 group-hover:animate-swing" />
                    <span className="absolute top-2.5 right-2.5 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#09090b] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                </button>

                {/* Profile Box */}
                <button className="flex items-center gap-2 pl-1 pr-3 h-10 
                    bg-white dark:bg-[#09090b] 
                    rounded-xl 
                    border border-zinc-200 dark:border-zinc-800 
                    hover:bg-zinc-50 dark:hover:bg-[#121214] 
                    transition-all shadow-sm hover:shadow-md group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center ring-1 ring-zinc-200 dark:ring-[#0A0A0A] group-hover:ring-amber-500/50 transition-all overflow-hidden border border-white/5">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
