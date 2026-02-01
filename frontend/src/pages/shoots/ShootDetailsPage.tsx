
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, FileEdit, Plus, CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useShoots } from '../../hooks/useShoots';
import { useEffect } from 'react';
import EditShootItemModal from './components/EditShootItemModal';
import AddPaymentModal from './components/AddPaymentModal';

const ShootDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'items' | 'payments'>('items');

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

    if (isLoading) return <div className="p-6 text-center text-zinc-500">Loading...</div>;
    if (!shoot) return <div className="p-6 text-center text-red-500">Shoot not found</div>;

    const totalPaid = shoot.payments?.reduce((acc: number, p: any) => acc + Number(p.amount), 0) || 0;
    const balance = Number(shoot.finalPrice) - totalPaid;

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/shoots')}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-600 dark:text-zinc-300"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-zinc-900 dark:text-white">
                        {shoot.client?.name}
                        <span className="text-sm font-normal px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                            {shoot.packageName}
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
                        <Calendar size={14} /> {new Date(shoot.createdAt).toLocaleDateString()} • ID: #{shoot.id.slice(0, 8)}
                    </p>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm text-zinc-500">Balance Due</div>
                        <div className={`text-xl font-bold ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ${balance.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right px-4 border-l border-zinc-200 dark:border-zinc-700">
                        <div className="text-sm text-zinc-500">Total Price</div>
                        <div className="text-xl font-bold text-zinc-900 dark:text-white">
                            ${Number(shoot.finalPrice).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setActiveTab('items')}
                    className={`pb-3 px-2 font-medium text-sm transition-all relative ${activeTab === 'items' ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
                >
                    Deliverables
                    {activeTab === 'items' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-500" />}
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`pb-3 px-2 font-medium text-sm transition-all relative ${activeTab === 'payments' ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
                >
                    Payments & Finance
                    {activeTab === 'payments' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-500" />}
                </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'items' ? (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-medium text-zinc-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Item Name</th>
                                    <th className="px-6 py-3">Dimensions</th>
                                    <th className="px-6 py-3">Pages</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {shoot.items?.map((item: any) => (
                                    <tr key={item.id} className={`group ${!item.isIncluded ? 'opacity-50 grayscale' : ''}`}>
                                        <td className="px-6 py-4 font-medium relative text-zinc-900 dark:text-zinc-300">
                                            {item.name}
                                            {!item.isIncluded && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-red-500 -rotate-90">EXCLUDED</span>}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{item.dimensions || '-'}</td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{item.pages || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="text-zinc-400 hover:text-orange-500 transition-colors p-2"
                                            >
                                                <FileEdit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus size={16} />
                            Record Payment
                        </button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-medium text-zinc-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Method</th>
                                    <th className="px-6 py-3">Note</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {shoot.payments?.map((payment: any) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{new Date(payment.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                                <CreditCard size={14} className="text-zinc-400" />
                                                {payment.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 italic">{payment.note || '-'}</td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-green-600 dark:text-green-400">
                                            ${Number(payment.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!shoot.payments || shoot.payments.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 italic">No payments recorded</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-zinc-50 dark:bg-zinc-800/50 font-medium text-zinc-900 dark:text-zinc-200">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right">Total Paid</td>
                                    <td className="px-6 py-4 text-right text-lg">${totalPaid.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
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
