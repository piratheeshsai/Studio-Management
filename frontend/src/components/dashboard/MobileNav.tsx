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
    Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, path: '/dashboard', label: 'Dash' },
        { icon: Users, path: '/clients', label: 'Clients' },
        { icon: Camera, path: '/shoots', label: 'Shoots' },
        { icon: Sparkles, path: '/ai-assistance', label: 'AI' },
        { icon: Settings, path: '/settings', label: 'Settings' },
    ];

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-[#18181b]/90 dark:bg-[#18181b]/90 bg-white/90 backdrop-blur-xl border border-white/10 dark:border-white/10 border-zinc-200 rounded-2xl shadow-2xl flex items-center justify-between px-6 py-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive
                                    ? 'text-amber-500'
                                    : 'text-zinc-500 dark:text-zinc-400'
                                }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
