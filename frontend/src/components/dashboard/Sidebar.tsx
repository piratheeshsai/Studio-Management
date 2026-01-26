import React from 'react';
import {
    LayoutDashboard,
    Users,
    Camera,
    Image,
    BookOpen,
    Sparkles,
    BarChart3,
    UserCog,
    Settings,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isExpanded: boolean;
    toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggle }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Clients', path: '/clients' },
        { icon: Camera, label: 'Shoots', path: '/shoots' },
        { icon: Image, label: 'Photos', path: '/photos' },
        { icon: BookOpen, label: 'Albums', path: '/albums' },
        { icon: Sparkles, label: 'AI Assistance', path: '/ai-assistance' },
        { icon: BarChart3, label: 'Revenue', path: '/revenue' },
        { icon: UserCog, label: 'Users', path: '/users' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="hidden md:block fixed left-8 top-[53%] -translate-y-1/2 z-40 max-h-[calc(100vh-64px)] overflow-visible">
            <motion.div
                initial={false}
                animate={{
                    width: isExpanded ? 240 : 80,
                    transition: { duration: 0.4, type: "spring", stiffness: 100, damping: 18 }
                }}
                className={`
                    flex flex-col h-auto max-h-[75vh] pt-4 pb-1
                    bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md 
                    border border-zinc-200 dark:border-white/5 
                    rounded-[40px] shadow-2xl relative z-40 overflow-hidden
                    transition-colors duration-300
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={toggle}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1A1A1A] text-zinc-600 dark:text-white p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-lg z-50 hover:scale-110 transition-transform"
                >
                    {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                {/* Navigation Items */}
                <div className="flex-1 flex flex-col gap-3 py-8 px-4 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <motion.div
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`
                                    relative flex items-center h-12 px-3 rounded-full cursor-pointer group
                                    transition-all duration-300
                                    ${isActive ? '' : 'hover:bg-zinc-100 dark:hover:bg-white/5'}
                                `}
                            >
                                {/* Active Pill Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-full shadow-lg"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon */}
                                <div className={`relative z-10 flex items-center justify-center w-8 h-8 ${isActive ? 'text-white dark:text-black' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}`}>
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                {/* Label */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`
                                                relative z-10 ml-3 font-medium text-sm whitespace-nowrap
                                                ${isActive ? 'text-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}
                                            `}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>


            </motion.div>
        </aside >
    );
};

export default Sidebar;
