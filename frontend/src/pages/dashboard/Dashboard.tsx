import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, User, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Studio Dashboard</h1>
                        <p className="text-slate-400">Welcome back, {user?.name}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Profile</h3>
                        <p className="text-lg font-semibold text-white">{user?.email}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Role</h3>
                        <p className="text-lg font-semibold text-white">{user?.role}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => window.location.href = '/register'}
                    >
                        <div className="bg-amber-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">User Management</h3>
                        <p className="text-lg font-semibold text-white">Add New User</p>
                    </motion.div>
                </div>

                <div className="mt-12 bg-blue-600/10 border border-blue-600/20 rounded-3xl p-12 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to manage your studio?</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">The full Studio and Album management modules are coming soon in the next development phase.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
