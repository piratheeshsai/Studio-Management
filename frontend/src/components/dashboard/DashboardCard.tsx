import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    colSpan?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '', delay = 0, colSpan = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`
                bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md 
                border border-zinc-200 dark:border-white/5 
                rounded-[20px] 
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                hover:border-zinc-300 dark:hover:border-white/10
                transition-all duration-300
                overflow-hidden
                relative
                group
                ${colSpan}
                ${className}
            `}
        >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {children}
        </motion.div>
    );
};

export default DashboardCard;
