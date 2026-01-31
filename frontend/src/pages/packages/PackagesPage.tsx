import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, RefreshCw, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import CreatePackageWizard from './components/CreatePackageWizard';
import EditPackageWizard from './components/EditPackageWizard';
import { useAuth } from '../../context/AuthContext';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import { packagesApi, type Package as PackageType } from '../../services/api/packages.api';

const PackagesPage: React.FC = () => {
    const { hasPermission } = useAuth();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [packageToDelete, setPackageToDelete] = useState<{ id: string; name: string } | null>(null);
    const [packageToEdit, setPackageToEdit] = useState<PackageType | null>(null);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const data = await packagesApi.getPackages();
            setPackages(data);
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSuccess = () => {
        console.log('Package created, refreshing list...');
        fetchPackages();
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        setPackageToDelete({ id, name });
    };

    const confirmDelete = async () => {
        if (!packageToDelete) return;

        try {
            await packagesApi.delete(packageToDelete.id);
            toast.success('Package deleted successfully');
            // Refresh the list after deletion
            fetchPackages();
        } catch (error) {
            console.error('Failed to delete package:', error);
            toast.error('Failed to delete package. Please try again.');
        }
    };

    const getCategoryLabel = (category: string) => {
        return category.split('_').map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Group packages by category
    const groupedPackages = filteredPackages.reduce((acc, pkg) => {
        const category = pkg.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(pkg);
        return acc;
    }, {} as Record<string, typeof filteredPackages>);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Consolidated Header & Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & Subtitle */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Packages
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage your service packages and pricing templates
                    </p>
                </div>

                {/* Compact Action Bar Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-1.5 shadow-sm dark:shadow-none flex flex-col sm:flex-row items-center gap-2 max-w-2xl w-full lg:w-auto">
                    {/* Search Input Container */}
                    <div className="relative flex-1 w-full lg:min-w-[300px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search packages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                        />
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={fetchPackages}
                            disabled={loading}
                            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-white/10"
                            title="Refresh packages"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>

                        {hasPermission('PACKAGE_CREATE') && (
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] whitespace-nowrap"
                            >
                                <Plus size={16} />
                                Add Package
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <RefreshCw size={32} className="animate-spin text-orange-500" />
                </div>
            ) : filteredPackages.length > 0 ? (
                <div className="space-y-10">
                    {/* Group packages by category */}
                    {Object.entries(groupedPackages).map(([category, categoryPackages]) => (
                        <div key={category}>
                            {/* Category Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                    {getCategoryLabel(category)}
                                </h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                            </div>

                            {/* Category Packages Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categoryPackages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className="relative group bg-white dark:bg-gradient-to-b dark:from-[#323237] dark:to-[#111112] rounded-2xl p-6 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] border border-zinc-100 dark:border-white/5 transition-all duration-300 max-w-sm mx-auto w-full"
                                    >
                                        {/* Package Name Badge at Top */}
                                        {/* Package Name Badge at Top */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-max">
                                            <span className="inline-block px-5 py-1.5 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white border border-white/10 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform-gpu">
                                                {pkg.name}
                                            </span>
                                        </div>

                                        {/* Action Buttons - Top Right */}
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {hasPermission('PACKAGE_UPDATE') && (
                                                <button
                                                    onClick={() => setPackageToEdit(pkg)}
                                                    className="p-2 bg-blue-500/90 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg"
                                                    title="Edit package"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            )}
                                            {hasPermission('PACKAGE_DELETE') && (
                                                <button
                                                    onClick={() => handleDelete(pkg.id, pkg.name)}
                                                    className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-colors shadow-lg"
                                                    title="Delete package"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Large Price Display */}
                                        <div className="text-center mb-6 pb-4 border-b border-zinc-100 dark:border-white/20">
                                            <div className="flex items-start justify-center gap-1">
                                                <span className="text-xl font-bold text-zinc-900 dark:text-white mt-1.5">Rs</span>
                                                <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                                                    {Number(pkg.basePrice).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Base Package Price</p>
                                        </div>

                                        {/* Description */}
                                        {pkg.description && (
                                            <p className="text-xs text-zinc-500 dark:text-zinc-300 text-center mb-4 px-2 line-clamp-2">
                                                {pkg.description}
                                            </p>
                                        )}

                                        {/* Features List with Checkmarks */}
                                        <div className="mb-6 flex justify-center">
                                            <div className="space-y-2 inline-flex flex-col w-full max-w-full">
                                                {pkg.items && pkg.items.length > 0 ? (
                                                    <>
                                                        {pkg.items.slice(0, 6).map((item, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 text-orange-500 dark:text-white mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                                                <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden">
                                                                    <span className="text-xs text-zinc-600 dark:text-zinc-200 font-medium truncate">
                                                                        {item.name}
                                                                    </span>
                                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                                        {item.type === 'PRODUCT' && (item.defDimensions || item.defPages || item.defQuantity) && (
                                                                            <>
                                                                                {item.defDimensions && (
                                                                                    <span className="text-[10px] text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                                                                        📐{item.defDimensions}
                                                                                    </span>
                                                                                )}
                                                                                {item.defPages && (
                                                                                    <span className="text-[10px] text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                                                                        📄{item.defPages}p
                                                                                    </span>
                                                                                )}
                                                                                {item.defQuantity && (
                                                                                    <span className="text-[10px] text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                                                                        × {item.defQuantity}
                                                                                    </span>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {pkg.items.length > 6 && (
                                                            <div className="flex items-start gap-2">
                                                                <Plus className="w-4 h-4 text-orange-500 dark:text-white mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                                                <span className="text-xs text-zinc-600 dark:text-zinc-200 font-medium">
                                                                    {pkg.items.length - 6} more items
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4 w-full">
                                                        No items added yet
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 dark:backdrop-blur-xl dark:border dark:border-white/10 rounded-full flex items-center justify-center mb-4">
                        <Package size={32} className="text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        {searchQuery ? 'No packages found' : 'No packages yet'}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
                        {searchQuery
                            ? `No packages match "${searchQuery}". Try a different search.`
                            : 'Create your first package template to streamline your booking process'}
                    </p>
                    {!searchQuery && hasPermission('PACKAGE_CREATE') && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30"
                        >
                            <Plus size={18} />
                            <span>Create Package</span>
                        </button>
                    )}
                </div>
            )
            }

            {/* Create Package Wizard */}
            <CreatePackageWizard
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={handleSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={!!packageToDelete}
                onClose={() => setPackageToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Package"
                description="This action cannot be undone. This will permanently delete this package and all its configured items."
                itemName={packageToDelete?.name}
                confirmText="Delete Package"
            />

            {/* Edit Package Wizard */}
            <EditPackageWizard
                isOpen={!!packageToEdit}
                onClose={() => setPackageToEdit(null)}
                onSuccess={handleSuccess}
                packageData={packageToEdit}
            />
        </div >
    );
};

export default PackagesPage;
