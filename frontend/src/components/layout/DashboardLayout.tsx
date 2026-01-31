import React, { type ReactNode, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';

import TopBar from '../dashboard/TopBar';
import MobileNav from '../dashboard/MobileNav';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-zinc-200 font-sans selection:bg-amber-500/30 overflow-x-hidden transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none z-0 transition-colors duration-500"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-200/30 dark:bg-purple-500/5 rounded-full blur-[150px] pointer-events-none z-0 transition-colors duration-500"></div>

            {/* Fixed Navigation Elements */}
            <TopBar />

            <Sidebar
                isExpanded={isSidebarExpanded}
                toggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
            />

            <MobileNav />

            {/* Main Content Area */}
            {/* Dynamic left padding based on sidebar state */}
            <main
                className={`
                    pt-24 pb-8 min-h-screen relative z-10 transition-all duration-300 ease-in-out
                    px-4 md:px-0 md:pr-8
                    ${isSidebarExpanded ? 'md:pl-80' : 'md:pl-36'}
                `}
            >
                <div className="max-w-[1800px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
