
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoles } from '../../hooks/useRoles';
import { ArrowLeft, Check, Shield, Info } from 'lucide-react';

const EditRolePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { permissions, fetchPermissions, getRole, updateRolePermissions } = useRoles();
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            await fetchPermissions();
            const role = await getRole(id);
            if (role) {
                setRoleName(role.name);
                setSelectedPermissions(role.permissions.map((p: any) => p.slug));
            } else {
                navigate('/users'); // Redirect if role not found
            }
            setLoading(false);
        };
        loadData();
    }, [id, fetchPermissions, getRole, navigate]);

    const handleTogglePermission = (slug: string) => {
        setSelectedPermissions(prev =>
            prev.includes(slug)
                ? prev.filter(p => p !== slug)
                : [...prev, slug]
        );
    };

    const toggleGroup = (perms: typeof permissions) => {
        const slugs = perms.map(p => p.slug);
        const allSelected = slugs.every(s => selectedPermissions.includes(s));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(s => !slugs.includes(s)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...slugs])]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSubmitting(true);
        // Note: Currently backend only has updateRolePermissions, not rename role.
        // If we want to rename role we need backend update for that too.
        // For now, assuming only permissions update is supported or we reuse that endpoint if it supports name change (it doesn't usually).
        // Let's stick to updating permissions as per original scope and assume name is read-only or add endpoint later.

        // Actually, let's just update permissions as 'updateRolePermissions' implies.
        // If user edited name, we might need a separate call or update endpoint.
        const success = await updateRolePermissions(id, selectedPermissions);
        setSubmitting(false);

        if (success) {
            navigate('/users');
        }
    };

    // Group permissions
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const category = perm.name.split(' ')[1] || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(perm);
        return acc;
    }, {} as Record<string, typeof permissions>);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading role data...</div>;
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow text-zinc-500 dark:text-zinc-400 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Edit Role</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Modify role capabilities and access levels</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Column: Role Details */}
                <div className="xl:col-span-4 space-y-6 sticky top-8">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-6 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-black/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32" />

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-2xl text-orange-600 dark:text-orange-400">
                                    <Shield size={24} />
                                </div>
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Role Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        value={roleName}
                                        disabled // Make name read-only for now as we don't have rename endpoint handy or checked
                                        className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 rounded-xl text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                                        title="Role renaming is disabled"
                                    />
                                </div>

                                <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                    <div className="flex gap-3">
                                        <Info size={18} className="text-zinc-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                            Modifying permissions will immediately affect all users assigned to this role. Proceed with caution.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3.5 text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20 dark:shadow-white/20 active:scale-[0.98]"
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Permissions */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-8 rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            Assign Permissions
                        </h2>

                        <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                            {Object.entries(groupedPermissions).map(([category, perms]) => {
                                const isGroupSelected = perms.every(p => selectedPermissions.includes(p.slug));

                                return (
                                    <div key={category} className="group">
                                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-white/5">
                                            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                                {category}
                                                <span className="bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{perms.length}</span>
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(perms)}
                                                className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                                            >
                                                {isGroupSelected ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {perms.map((permission) => (
                                                <div
                                                    key={permission.slug}
                                                    onClick={() => handleTogglePermission(permission.slug)}
                                                    className={`
                                                    relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 group/item
                                                    ${selectedPermissions.includes(permission.slug)
                                                            ? 'bg-orange-50/50 border-orange-200 dark:bg-orange-950/10 dark:border-orange-500/20 shadow-sm shadow-orange-500/5'
                                                            : 'bg-white dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50'
                                                        }
                                                `}
                                                >
                                                    <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${selectedPermissions.includes(permission.slug)
                                                            ? 'bg-orange-500 border-orange-500 text-white scale-100'
                                                            : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-transparent group-hover/item:border-zinc-400'
                                                        }`}>
                                                        {selectedPermissions.includes(permission.slug) && <Check size={12} strokeWidth={3.5} />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm font-semibold mb-0.5 transition-colors ${selectedPermissions.includes(permission.slug)
                                                                ? 'text-zinc-900 dark:text-orange-50'
                                                                : 'text-zinc-700 dark:text-zinc-200'
                                                            }`}>
                                                            {permission.name}
                                                        </div>
                                                        <div className={`text-[11px] font-mono truncate transition-colors ${selectedPermissions.includes(permission.slug)
                                                                ? 'text-orange-700/70 dark:text-orange-300/60'
                                                                : 'text-zinc-400'
                                                            }`}>
                                                            {permission.slug}
                                                        </div>
                                                    </div>

                                                    {selectedPermissions.includes(permission.slug) && (
                                                        <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-500/10 dark:ring-orange-400/10 pointer-events-none" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditRolePage;
