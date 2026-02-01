import React, { useState, useEffect } from 'react';
import { User, Package, Loader2, Search, Plus, Check, ChevronRight, Minus, MoreHorizontal, Image, LayoutTemplate, Wand2, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePackages } from '../../../hooks/usePackages';
import { useClients } from '../../../hooks/useClients';
import { useShoots } from '../../../hooks/useShoots';
import AddClientModal from '../../clients/components/AddClientModal';

interface CreateShootWizardProps {
    onSuccess?: () => void;
}

const CreateShootWizard: React.FC<CreateShootWizardProps> = ({ onSuccess }) => {
    const { clients, loading: clientsLoading } = useClients();
    const { packages, loading: packagesLoading, fetchPackages } = usePackages();
    const { createShoot, shoots, fetchShoots } = useShoots();

    useEffect(() => {
        fetchPackages();
        fetchShoots();
    }, [fetchPackages, fetchShoots]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Selection State
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [searchClient, setSearchClient] = useState('');
    const [searchPackage, setSearchPackage] = useState('');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Filter Packages
    const filteredPackages = React.useMemo(() => {
        if (!Array.isArray(packages)) return [];

        const filtered = packages.filter((pkg: any) => {
            const query = searchPackage.toLowerCase();
            const matchesSearch = (pkg.name || '').toLowerCase().includes(query) || (pkg.category || '').toLowerCase().includes(query);
            const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // If searching or specific category, show all. Otherwise limit to 3.
        const hasActiveFilter = searchPackage.trim() !== '' || selectedCategory !== 'All';
        return hasActiveFilter ? filtered : filtered.slice(0, 3);
    }, [packages, searchPackage, selectedCategory]);
    const [shootItems, setShootItems] = useState<any[]>([]);

    // Determine Recently Used Packages
    const recentPackages = React.useMemo(() => {
        if (!shoots.length || !packages.length) return [];

        const recentNames = new Set();
        const results: any[] = [];

        // Sort shoots by date descending
        const sortedShoots = [...shoots].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        for (const shoot of sortedShoots) {
            if (results.length >= 5) break;
            const pkg = packages.find((p: any) => p.name === shoot.packageName && p.basePrice === shoot.finalPrice); // Match name and approx price/uniqueness
            // Fallback to just name match
            const loosePkg = packages.find((p: any) => p.name === shoot.packageName);

            if (loosePkg && !recentNames.has(loosePkg.id)) {
                recentNames.add(loosePkg.id);
                results.push(loosePkg);
            }
        }
        return results;
    }, [shoots, packages]);



    // Reset items when package changes
    useEffect(() => {
        if (selectedPackage) {
            setFinalPrice(Number(selectedPackage.basePrice));
            if (Array.isArray(selectedPackage.items)) {
                setShootItems(selectedPackage.items.map((item: any) => ({
                    name: item.name,
                    type: item.type,
                    dimensions: item.defDimensions,
                    pages: item.defPages,
                    quantity: item.defQuantity || 1,
                    description: item.description,
                    isIncluded: true
                })));
            }
        } else {
            setShootItems([]);
            setFinalPrice(0);
        }
    }, [selectedPackage]);

    const handleSubmit = async () => {
        if (!selectedClient || !selectedPackage) return;

        setIsSubmitting(true);
        try {
            await createShoot({
                clientId: selectedClient.id,
                packageId: selectedPackage.id,
                finalPrice: finalPrice,
                description: `Shoot for ${selectedPackage.name}`,
                startDate: new Date().toISOString(),
                items: shootItems
            });
            onSuccess?.();
            // Reset
            setSelectedClient(null);
            setSelectedPackage(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleItem = (index: number) => {
        const newItems = [...shootItems];
        newItems[index].isIncluded = !newItems[index].isIncluded;
        setShootItems(newItems);
    };

    const updateItemPages = (index: number, pages: number) => {
        const newItems = [...shootItems];
        if (newItems[index].pages !== undefined) {
            newItems[index].pages = pages;
        } else {
            newItems[index].quantity = pages;
        }
        setShootItems(newItems);
    };

    const updateItemDimensions = (index: number, dimensions: string) => {
        const newItems = [...shootItems];
        newItems[index].dimensions = dimensions;
        setShootItems(newItems);
    };

    const filteredClients = Array.isArray(clients) ? clients.filter(c => c.name.toLowerCase().includes(searchClient.toLowerCase())) : [];

    return (
        <div className="h-full flex gap-6 overflow-hidden text-zinc-900 dark:text-white p-3">

            {/* Left Column: Selections */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

                {/* 1. Client Selection */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-white font-mono">01</div>
                        <h2 className="text-xl font-bold tracking-tight">Select Client</h2>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1.5 mb-4 shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search client..."
                                className="w-full bg-transparent border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-0 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-all font-medium"
                                value={searchClient}
                                onChange={(e) => setSearchClient(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 items-stretch">
                        {filteredClients.slice(0, 3).map(client => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`flex-1 min-w-0 p-3 rounded-2xl border transition-all cursor-pointer relative group shadow-sm
                                ${selectedClient?.id === client.id
                                        ? 'bg-white dark:bg-zinc-900 border-orange-500 ring-2 ring-orange-500/10 dark:ring-orange-500/20 shadow-lg shadow-orange-500/10'
                                        : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold text-lg border border-zinc-100 dark:border-zinc-700">
                                            {client.name.charAt(0)}
                                        </div>
                                        {selectedClient?.id === client.id && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-zinc-900 dark:text-white text-sm truncate leading-tight">{client.name}</div>
                                        <div className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">{client.email}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Card - Compact */}
                        <div
                            onClick={() => setShowAddClientModal(true)}
                            className="shrink-0 w-20 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">New</span>
                        </div>
                    </div>
                </div>

                {/* 2. Package Selection */}
                <div className="pb-4">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-white font-mono">02</div>
                            <h2 className="text-xl font-bold tracking-tight">Select Package</h2>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search packages..."
                                    className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-0 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-all font-medium"
                                    value={searchPackage}
                                    onChange={(e) => setSearchPackage(e.target.value)}
                                />
                            </div>

                            {/* Category Filter Dropdown */}
                            <div className="relative shrink-0">
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="h-[42px] px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex items-center gap-2 text-sm font-medium hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-w-[140px] justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter size={14} className="text-zinc-400" />
                                        <span className="truncate max-w-[100px]">{selectedCategory === 'All' ? 'Filter' : selectedCategory}</span>
                                    </div>
                                    <ChevronDown size={14} className="text-zinc-400" />
                                </button>

                                {showCategoryDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-2 max-h-60 overflow-y-auto">
                                            <div className="px-2 pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">Categories</span>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedCategory('All'); setShowCategoryDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group ${selectedCategory === 'All' ? 'font-bold text-orange-500' : 'text-zinc-700 dark:text-zinc-300'}`}
                                            >
                                                <span>All Packages</span>
                                                {selectedCategory === 'All' && <Check size={14} />}
                                            </button>
                                            {(Array.from(new Set(Array.isArray(packages) ? packages.map((p: any) => p.category) : [])) as string[]).map(category => (
                                                <button
                                                    key={category}
                                                    onClick={() => { setSelectedCategory(category); setShowCategoryDropdown(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group ${selectedCategory === category ? 'font-bold text-orange-500' : 'text-zinc-700 dark:text-zinc-300'}`}
                                                >
                                                    <span className="truncate">{category}</span>
                                                    {selectedCategory === category && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredPackages.map((pkg: any) => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`relative h-64 p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden group duration-300
                                ${selectedPackage?.id === pkg.id
                                        ? 'bg-orange-50/50 dark:bg-zinc-900 border-orange-500 ring-2 ring-orange-500/20 shadow-xl shadow-orange-500/10 dark:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]'
                                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg'}`}
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${selectedPackage?.id === pkg.id
                                    ? 'from-orange-50 via-white to-orange-50/30 dark:from-orange-500/20 dark:via-orange-900/10 dark:to-zinc-950 opacity-100'
                                    : 'from-zinc-50 to-white dark:from-stone-800/40 dark:via-zinc-900/60 dark:to-black opacity-0 dark:opacity-100 group-hover:opacity-100'
                                    }`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-600 dark:text-orange-500 mb-2 block">
                                            {pkg.category}
                                        </span>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">{pkg.name}</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                                            {pkg.description || "Comprehensive coverage for your special moments."}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex items-end justify-between">
                                        <div className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                            ${Number(pkg.basePrice).toLocaleString()}
                                        </div>

                                        {selectedPackage?.id === pkg.id && (
                                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredPackages.length === 0 && (
                            <div className="col-span-full py-12 text-center text-zinc-400 text-sm font-medium border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                                No packages found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Configuration & Confirm */}
            <div className="w-[320px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex flex-col shadow-2xl overflow-hidden shrink-0 h-full relative z-20">
                {/* Header */}
                <div className="p-5 pb-0 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Review & Customize</h2>
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-6">

                    {/* Selected Client */}
                    <div>
                        <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider mb-2">Selected Client</div>
                        {selectedClient ? (
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-2.5 pr-3 flex items-center justify-between border border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm shrink-0">
                                        {/* Placeholder Avatar */}
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-sm">{selectedClient.name.charAt(0)}</div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-xs text-zinc-900 dark:text-white truncate">{selectedClient.name}</div>
                                        <div className="text-[10px] font-medium text-zinc-500 truncate">Premium Member</div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedClient(null)} className="text-[10px] text-[#FF4D00] font-bold hover:underline shrink-0">Change</button>
                            </div>
                        ) : (
                            <div className="p-3 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-center text-zinc-400 text-[10px] font-medium">No client selected</div>
                        )}
                    </div>

                    {/* Editable Deliverables */}
                    <div>
                        <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider mb-3">Editable Deliverables</div>
                        <div className="space-y-4">
                            {shootItems.filter(i => (i.type || '').toUpperCase() === 'PRODUCT').map((item, index) => {
                                const realIndex = shootItems.indexOf(item);
                                return (
                                    <div key={index} className="space-y-0">
                                        {/* Header Row */}
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-[#1c1c1c] flex items-center justify-center text-orange-600 dark:text-orange-500 border border-transparent dark:border-white/5">
                                                    {item.name.toLowerCase().includes('photo') ? <Image size={16} /> :
                                                        item.name.toLowerCase().includes('album') ? <LayoutTemplate size={16} /> :
                                                            <Package size={16} />}
                                                </div>
                                                <span className="font-bold text-zinc-900 dark:text-white text-sm">{item.name}</span>
                                            </div>
                                            {/* Toggle */}
                                            <div
                                                onClick={() => toggleItem(realIndex)}
                                                className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-300 relative ${item.isIncluded ? 'bg-[#FF4D00]' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${item.isIncluded ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </div>

                                        {/* Counter Row (Only if included) */}
                                        <AnimatePresence>
                                            {item.isIncluded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mb-2 h-8 bg-zinc-100 dark:bg-[#111] border border-zinc-200 dark:border-white/5 rounded-lg flex items-center justify-between px-1">
                                                        <div className="flex flex-1 items-center justify-center gap-2 px-1">
                                                            <button
                                                                onClick={() => updateItemPages(realIndex, Math.max(0, (item.pages || item.quantity || 0) - 1))}
                                                                className="w-5 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={item.pages || item.quantity || 0}
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value);
                                                                    updateItemPages(realIndex, isNaN(val) ? 0 : val);
                                                                }}
                                                                className="w-8 bg-transparent text-center font-bold text-zinc-900 dark:text-white font-mono text-xs outline-none p-0 appearance-none"
                                                            />
                                                            <button
                                                                onClick={() => updateItemPages(realIndex, (item.pages || item.quantity || 0) + 1)}
                                                                className="w-5 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>

                                                        {/* Dimension Input (with divider) */}
                                                        {item.dimensions && (
                                                            <>
                                                                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 mx-1" />
                                                                <div className="px-2 flex items-center gap-2 h-full">
                                                                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">SIZE</span>
                                                                    <input
                                                                        type="text"
                                                                        value={item.dimensions}
                                                                        onChange={(e) => updateItemDimensions(realIndex, e.target.value)}
                                                                        className="w-12 bg-transparent text-right text-xs font-bold text-zinc-900 dark:text-white outline-none placeholder:text-zinc-600 focus:text-orange-500 transition-colors"
                                                                        placeholder="Size"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Additional Services */}
                    <div>
                        <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider mb-3">Additional Services</div>
                        <div className="space-y-3">
                            {shootItems.filter(i => (i.type || '').toUpperCase() !== 'PRODUCT').map((item, index) => {
                                const realIndex = shootItems.indexOf(item);
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                                                {item.name.toLowerCase().includes('ai') ? <Wand2 size={14} /> : <Check size={14} />}
                                            </div>
                                            <span className="font-bold text-zinc-900 dark:text-white text-xs">{item.name}</span>
                                        </div>
                                        <div
                                            onClick={() => toggleItem(realIndex)}
                                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 relative ${item.isIncluded ? 'bg-[#FF4D00]' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${item.isIncluded ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Static Placeholder for Demo if empty */}
                            {shootItems.filter(i => (i.type || '').toUpperCase() !== 'PRODUCT').length === 0 && (
                                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between opacity-60">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                            <Wand2 size={14} />
                                        </div>
                                        <span className="font-bold text-zinc-500 text-xs">AI Culling</span>
                                    </div>
                                    <div className="w-10 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 relative">
                                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 bg-zinc-50/50 dark:bg-zinc-950/50 mt-auto border-t border-zinc-100 dark:border-zinc-900 backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Total Agreed Price</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">${finalPrice.toLocaleString()}</span>
                        </div>
                        {finalPrice < (selectedPackage ? Number(selectedPackage.basePrice) : 0) && (
                            <div className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full mb-1">
                                SAVING ${((selectedPackage ? Number(selectedPackage.basePrice) : 0) - finalPrice).toLocaleString()}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedClient || !selectedPackage || isSubmitting}
                        className="w-full py-3 bg-[#FF4D00] hover:bg-[#ff5e1a] text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_15px_-4px_rgba(255,77,0,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(255,77,0,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Confirm Booking"}
                    </button>
                </div>
            </div>

            <AddClientModal
                isOpen={showAddClientModal}
                onClose={() => setShowAddClientModal(false)}
                onSuccess={(newClient) => {
                    if (newClient) {
                        setSelectedClient(newClient);
                        setSearchClient('');
                    }
                }}
            />
        </div>
    );
};

export default CreateShootWizard;
