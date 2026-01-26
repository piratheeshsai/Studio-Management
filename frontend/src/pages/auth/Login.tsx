import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5,
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] w-full bg-[#050505] no-scrollbar selection:bg-orange-600/30 font-['Outfit'] relative overflow-x-hidden">

            {/* LEFT SIDE: Cinematic Lens Art Section (Hidden on Mobile) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="hidden lg:flex relative w-[55%] h-[100dvh] overflow-hidden bg-black"
            >
                {/* Immersive Background with Lens Blur */}
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0"
                >
                    <img
                        src="/studio-bg.png"
                        alt="Cinematic Studio"
                        className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1] grayscale"
                    />
                </motion.div>

                {/* Artisanal Overlays: Lens Flares & Prism Effects */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-[#050505]" />
                <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.05),transparent_50%)]" />

                {/* Decorative Prism Line */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 0.3, x: 0 }}
                    transition={{ delay: 1, duration: 2 }}
                    className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent skew-x-[25deg] blur-[1px]"
                />

                <div className="absolute top-12 left-12 z-30">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl">
                            <Camera className="w-4 h-4 text-white/40" />
                        </div>
                        <span className="text-white/40 text-[10px] uppercase tracking-[0.6em] font-semibold">Terminal Interface</span>
                    </motion.div>
                </div>

                <div className="absolute bottom-24 left-16 z-30 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mb-6 flex items-center gap-4"
                    >
                        <div className="h-[1px] w-8 bg-orange-600/40" />
                        <span className="text-orange-600/60 text-[10px] uppercase tracking-[0.4em] font-bold">Creative Management Platform</span>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.4, duration: 1.5 }}
                        className="text-white text-7xl mb-8 leading-[0.9] font-['Playfair_Display'] tracking-tight"
                    >
                        Lumière <br />
                        <span className="text-white/20 font-light not-italic font-['Outfit'] tracking-[0.2em] text-4xl mt-4 block uppercase leading-tight">Studio</span>
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.6, duration: 1.5 }}
                        className="text-white/30 text-xs font-light tracking-[0.2em] leading-relaxed max-w-xs"
                    >
                        Experience the orchestration of light, sound, and precision through our integrated terminal.
                    </motion.p>
                </div>
            </motion.div>

            {/* RIGHT SIDE / MOBILE TERMINAL: Integrated Lumière Portal */}
            <div className="flex-1 relative flex flex-col items-center justify-center bg-black px-4 lg:px-8 bg-cover bg-center overflow-y-auto no-scrollbar">

                {/* MOBILE BACKGROUND ART (Visible only on Mobile) */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <img
                        src="/studio-bg.png"
                        alt="Mobile Backdrop"
                        className="w-full h-full object-cover filter brightness-[0.2] contrast-[1.1] grayscale blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* AMBIENT GLOWS */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/[0.03] rounded-full blur-[120px] pointer-events-none z-1" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full lg:max-w-[420px] py-12 lg:py-16 relative z-10 flex flex-col items-center"
                >
                    {/* The Obsidian Card */}
                    <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-[40px] border border-white/5 rounded-[2.5rem] p-10 lg:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border-white/[0.03] flex flex-col items-center overflow-hidden">

                        {/* Integrated Header Branding */}
                        <motion.div variants={itemVariants} className="mb-14 text-center">
                            <h1 className="text-white text-5xl font-['Playfair_Display'] mb-4 leading-tight tracking-tight">
                                Lumière Studio
                            </h1>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-8 bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
                                <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-bold">Creative Management</p>
                            </div>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-8 w-full">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl text-red-500 text-[10px] uppercase tracking-widest font-bold text-center mb-4"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-6">
                                {/* Email Field */}
                                <motion.div variants={itemVariants} className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full bg-[#111111]/80 border border-white/[0.03] rounded-xl py-4 px-6 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-orange-600/30 focus:bg-orange-600/[0.02] focus:ring-1 focus:ring-orange-600/20 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>

                                {/* Password Field */}
                                <motion.div variants={itemVariants} className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Password</label>
                                    <div className="relative group/input">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••••••"
                                            className="w-full bg-[#111111]/80 border border-white/[0.03] rounded-xl py-4 px-6 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-orange-600/30 focus:bg-orange-600/[0.02] focus:ring-1 focus:ring-orange-600/20 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="pt-6">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative py-4.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(234,88,12,0.4)] disabled:opacity-50 group overflow-hidden"
                                >
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:animate-shimmer pointer-events-none" />

                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            <span>Sign In</span>
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </div>


                </motion.div>
            </div>

            {/* Global Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-150 mix-blend-overlay z-50" />
        </div>
    );
};

export default Login;
