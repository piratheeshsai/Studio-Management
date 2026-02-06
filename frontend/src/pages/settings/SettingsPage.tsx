import { useState } from 'react';
import { Settings, Users, ToggleLeft, ToggleRight, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';

const SettingsPage = () => {
    const { settings, loading, updateSettings } = useSettings();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleToggleCrewAssignment = async () => {
        if (!settings) return;

        setSaving(true);
        setSaved(false);

        try {
            await updateSettings({
                enableCrewAssignment: !settings.enableCrewAssignment,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to update settings:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Settings size={24} className="text-orange-500" />
                    Settings
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Configure your studio preferences
                </p>
            </div>

            {/* Settings Cards */}
            <div className="space-y-6">
                {/* Crew Assignment Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                <Users size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    Enable Crew Assignment
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">
                                    When enabled, users will only see shoots and events they are assigned to.
                                    Useful for larger teams with multiple photographers and editors.
                                </p>
                                <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                                    {settings?.enableCrewAssignment ? (
                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                            <Check size={12} />
                                            Users see only assigned shoots
                                        </span>
                                    ) : (
                                        <span>All users with permission see all shoots</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleToggleCrewAssignment}
                            disabled={saving}
                            className="relative p-1 transition-all hover:scale-105 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 size={32} className="animate-spin text-orange-500" />
                            ) : settings?.enableCrewAssignment ? (
                                <ToggleRight size={48} className="text-orange-500" />
                            ) : (
                                <ToggleLeft size={48} className="text-zinc-300 dark:text-zinc-600" />
                            )}
                        </button>
                    </div>

                    {/* Saved indicator */}
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2"
                        >
                            <Check size={16} />
                            Settings saved successfully
                        </motion.div>
                    )}
                </motion.div>

                {/* Future settings placeholder */}
                <div className="text-center py-8 text-zinc-400 dark:text-zinc-600 text-sm border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    More settings coming soon...
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
