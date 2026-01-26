
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axios';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setStatus('submitting');
        const toastId = toast.loading('Updating password...');

        try {
            const response = await api.post('/auth/change-password', { password: formData.password });
            // Update token in local storage and context
            localStorage.setItem('access_token', response.data.access_token);
            toast.success('Password updated successfully!', { id: toastId });

            setTimeout(() => {
                navigate('/dashboard');
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            setStatus('idle');
            const msg = err.response?.data?.message || "Failed to change password";
            toast.error(msg, { id: toastId });
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-white/10 p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-900 dark:text-white">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Change Password</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        You must change your password before continuing.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-zinc-900/20 dark:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
