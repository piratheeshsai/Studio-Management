
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Circle,
    CreditCard,
    FileText,
    MapPin,
    Package,
    Printer,
    Scissors,
    Camera,
    Image,
    Plus,
    ExternalLink,
    Download,
    Eye,
    Clock,
    Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useShoots } from '../../hooks/useShoots';
import EditShootItemModal from './components/EditShootItemModal';
import AddPaymentModal from './components/AddPaymentModal';

// Pipeline stages for the workflow
const PIPELINE_STAGES = [
    { id: 'shot', label: 'Shot Taken', icon: Camera },
    { id: 'culling', label: 'Culling', icon: Scissors },
    { id: 'editing', label: 'Editing', icon: Image },
    { id: 'album', label: 'Album Design', icon: FileText },
    { id: 'printing', label: 'Printing', icon: Printer },
    { id: 'ready', label: 'Ready', icon: CheckCircle },
];

// Map shoot status to pipeline stage index
const getStageFromStatus = (status: string): number => {
    switch (status) {
        case 'BOOKED': return 0;
        case 'PENDING': return 1;
        case 'IN_PROGRESS': return 3;
        case 'COMPLETED': return 5;
        default: return 0;
    }
};

// Get item type icon
const getItemIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('album') || t.includes('magazine')) return FileText;
    if (t.includes('frame') || t.includes('portrait')) return Image;
    if (t.includes('usb') || t.includes('drive')) return Package;
    return Package;
};

const ShootDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getShoot, updateShootItem, addPayment } = useShoots();
    const [shoot, setShoot] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [editingItem, setEditingItem] = useState<any>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const refreshShoot = () => {
        if (id) {
            getShoot(id).then(data => {
                setShoot(data);
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        }
    };

    useEffect(() => {
        refreshShoot();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-zinc-500">Loading...</div>
            </div>
        );
    }

    if (!shoot) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-red-500">Shoot not found</div>
            </div>
        );
    }

    const totalPaid = shoot.payments?.reduce((acc: number, p: any) => acc + Number(p.amount), 0) || 0;
    const balance = Number(shoot.finalPrice) - totalPaid;
    const paymentProgress = Math.min((totalPaid / Number(shoot.finalPrice)) * 100, 100);

    // Calculate deliverables progress
    const totalItems = shoot.items?.length || 0;
    const completedItems = shoot.items?.filter((item: any) =>
        item.status === 'READY' || item.status === 'DELIVERED'
    ).length || 0;
    const deliveryProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const currentStage = getStageFromStatus(shoot.status);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/shoots')}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Shoots
            </button>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ===== HERO HEADER (Top Left - Spans 2 cols) ===== */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden shadow-sm dark:shadow-none">
                    {/* Live Project Badge */}
                    <div className="absolute top-6 left-8">
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-500 text-xs font-bold uppercase tracking-wider rounded-full border border-orange-500/30">
                            Live Project
                        </span>
                    </div>

                    {/* Est. Delivery */}
                    <div className="absolute top-6 right-8 flex items-center gap-2 text-zinc-500 text-sm">
                        <Clock size={14} />
                        <span>Est. Delivery: {shoot.eventDate ? new Date(shoot.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}</span>
                    </div>

                    <div className="mt-12 space-y-6">
                        {/* Client Name */}
                        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
                            {shoot.client?.name}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
                            <span>{shoot.category}</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="font-mono text-orange-600 dark:text-orange-500">{shoot.shootCode}</span>
                        </div>

                        {/* Progress Section */}
                        <div className="pt-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Post-Processing Status</div>
                                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-500">{deliveryProgress}%</div>
                                </div>
                                <div className="text-right text-sm text-zinc-500">
                                    Currently in: <span className="text-zinc-700 dark:text-zinc-300">{PIPELINE_STAGES[currentStage]?.label}</span>
                                </div>
                            </div>

                            {/* Progress Bar with Glow */}
                            <div className="relative h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${deliveryProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FINANCIAL PULSE (Top Right) ===== */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-6">
                        <Sparkles size={16} className="text-orange-500" />
                        <span className="text-sm font-medium">Financial Pulse</span>
                    </div>

                    <div className="space-y-4">
                        {/* Total Contract */}
                        <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                            <span className="text-zinc-500">Total Contract</span>
                            <span className="text-xl font-bold text-zinc-900 dark:text-white font-mono">${Number(shoot.finalPrice).toLocaleString()}</span>
                        </div>

                        {/* Paid Amount */}
                        <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                            <span className="text-zinc-500">Paid Amount</span>
                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">${totalPaid.toLocaleString()}</span>
                        </div>

                        {/* Balance Due */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold rounded">BALANCE DUE</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">${balance.toLocaleString()}</span>
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Plus size={12} />
                                    Record
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Download size={14} />
                            Download Invoice
                        </button>
                        <button className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Eye size={14} />
                            Client View
                        </button>
                    </div>
                </div>

                {/* ===== PRODUCTION PIPELINE (Middle - Full Width) ===== */}
                <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-0 w-full max-w-4xl">
                            {PIPELINE_STAGES.map((stage, index) => {
                                const Icon = stage.icon;
                                const isCompleted = index <= currentStage;
                                const isCurrent = index === currentStage;

                                return (
                                    <div key={stage.id} className="flex items-center flex-1">
                                        {/* Stage Node */}
                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center transition-all
                                                        ${isCompleted
                                                        ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                    }
                                                        ${isCurrent ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900' : ''}
                                                    `}
                                            >
                                                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                                            </button>
                                            <span className={`text-xs font-medium text-center ${isCompleted ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                                {stage.label}
                                            </span>
                                        </div>

                                        {/* Connector Line */}
                                        {index < PIPELINE_STAGES.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-2 ${index < currentStage ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ===== LOGISTICS & EVENTS (Bottom Left) ===== */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                            <MapPin size={16} className="text-orange-500" />
                            <span className="text-sm font-medium">Production Logistics</span>
                        </div>
                        <button className="text-xs text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center gap-1">
                            View Full Itinerary <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* EVENT type items */}
                        {shoot.items?.filter((item: any) => item.type === 'EVENT').map((item: any) => (
                            <div
                                key={item.id}
                                onClick={() => setEditingItem(item)}
                                className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50 cursor-pointer hover:border-orange-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/20 rounded-lg">
                                            <Calendar size={16} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <div className="text-zinc-900 dark:text-white font-medium">{item.name}</div>
                                            {item.description && (
                                                <div className="text-zinc-500 text-xs mt-0.5">{item.description}</div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`
                                        px-2 py-1 text-xs font-medium rounded
                                        ${item.status === 'DELIVERED' || item.status === 'READY'
                                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                                        }
                                    `}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Empty state for events */}
                        {(!shoot.items || shoot.items.filter((i: any) => i.type === 'EVENT').length === 0) && (
                            <div className="text-center py-6 text-zinc-400 dark:text-zinc-600 text-sm">
                                No events added yet
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== DELIVERABLES CHECKLIST (Bottom Right - Spans 2 cols) ===== */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-6">
                        <Package size={16} className="text-orange-500" />
                        <span className="text-sm font-medium">Physical Deliverables</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shoot.items?.filter((item: any) => item.type === 'PRODUCT').map((item: any) => {
                            const ItemIcon = getItemIcon(item.type || item.name);
                            const isReady = item.status === 'READY' || item.status === 'DELIVERED';

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setEditingItem(item)}
                                    className={`
                                            flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                                            ${isReady
                                            ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-700/50'
                                            : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-orange-500/50'
                                        }
                                        `}
                                >
                                    <div className={`p-2 rounded-lg ${isReady ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'}`}>
                                        <ItemIcon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-zinc-900 dark:text-white font-medium truncate">{item.name}</div>
                                        <div className="text-zinc-500 text-xs truncate">
                                            {item.dimensions && `${item.dimensions}`}
                                            {item.pages && ` • ${item.pages} pages`}
                                        </div>
                                    </div>
                                    <span className={`
                                            px-2 py-1 text-xs font-medium rounded
                                            ${isReady
                                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                                        }
                                        `}>
                                        {item.status}
                                    </span>
                                </div>
                            );
                        })}

                        {(!shoot.items || shoot.items.filter((i: any) => i.type === 'PRODUCT').length === 0) && (
                            <div className="col-span-2 text-center py-8 text-zinc-400 dark:text-zinc-600">
                                No production items added yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditShootItemModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                item={editingItem}
                onSave={async (data) => {
                    await updateShootItem(editingItem.id, data);
                    refreshShoot();
                }}
            />

            <AddPaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                balanceDue={balance}
                onSave={async (data) => {
                    await addPayment(shoot.id, data);
                    refreshShoot();
                }}
            />
        </div>
    );
};

export default ShootDetailsPage;
