
import React, { useState, useEffect } from 'react';
import { X, User, Package, Calculator, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePackages } from '../../../hooks/usePackages';
import { useClients } from '../../../hooks/useClients';
import { useShoots } from '../../../hooks/useShoots';


interface CreateShootModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateShootModal: React.FC<CreateShootModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { clients, loading: clientsLoading } = useClients();
    const { packages, loading: packagesLoading, fetchPackages } = usePackages();
    const { createShoot } = useShoots();

    // Fetch packages when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPackages();
        }
    }, [isOpen, fetchPackages]);

    const isDataLoading = clientsLoading || packagesLoading;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [step, setStep] = useState(1);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [searchClient, setSearchClient] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedClient(null);
            setSelectedPackage(null);
            setFinalPrice(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedPackage) {
            setFinalPrice(Number(selectedPackage.basePrice)); // Ensure numeric
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
                startDate: new Date().toISOString(), // Default to today, or add date picker
            });
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredClients = Array.isArray(clients) ? clients.filter(c => c.name.toLowerCase().includes(searchClient.toLowerCase())) : [];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
                >
                    <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-bold text-white">Create New Shoot</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-between mb-8 px-4">
                            {[
                                { num: 1, label: 'Select Client', icon: User },
                                { num: 2, label: 'Select Package', icon: Package },
                                { num: 3, label: 'Review', icon: Calculator }
                            ].map((s) => (
                                <div key={s.num} className={`flex flex-col items-center gap-2 ${step === s.num ? 'text-orange-500' : step > s.num ? 'text-green-500' : 'text-zinc-600'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 
                                        ${step === s.num ? 'border-orange-500 bg-orange-500/10' :
                                            step > s.num ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
                                        <s.icon size={14} />
                                    </div>
                                    <span className="text-xs font-medium">{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search clients..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-white"
                                        value={searchClient}
                                        onChange={(e) => setSearchClient(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    {filteredClients.map(client => (
                                        <div
                                            key={client.id}
                                            onClick={() => setSelectedClient(client)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                                                ${selectedClient?.id === client.id
                                                    ? 'bg-orange-500/10 border-orange-500 text-white'
                                                    : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-300'}`}
                                        >
                                            <div>
                                                <div className="font-medium">{client.name}</div>
                                                <div className="text-xs text-zinc-500">{client.email}</div>
                                            </div>
                                            {selectedClient?.id === client.id && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {Array.isArray(packages) && packages.map((pkg: any) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]
                                                ${selectedPackage?.id === pkg.id
                                                    ? 'bg-orange-500/10 border-orange-500 relative overflow-hidden'
                                                    : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800'}`}
                                        >
                                            <div className="font-bold text-white mb-1">{pkg.name}</div>
                                            <div className="text-xs text-orange-400 font-mono mb-4">{pkg.category}</div>
                                            <div className="text-xl font-bold text-white">${Number(pkg.basePrice).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 space-y-4">
                                    <div className="flex justify-between items-center border-b border-zinc-700/50 pb-3">
                                        <span className="text-zinc-400">Client</span>
                                        <span className="text-white font-medium">{selectedClient?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-700/50 pb-3">
                                        <span className="text-zinc-400">Package</span>
                                        <span className="text-white font-medium">{selectedPackage?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-zinc-400">Base Price</span>
                                        <span className="text-white font-mono">${Number(selectedPackage?.basePrice).toLocaleString()}</span>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-700 flex justify-between items-center">
                                        <label className="text-sm font-medium text-orange-400">Final Agreed Price</label>
                                        <input
                                            type="number"
                                            value={finalPrice}
                                            onChange={(e) => setFinalPrice(Number(e.target.value))}
                                            className="bg-black/30 border border-zinc-600 rounded px-2 py-1 text-right text-white font-mono w-32 focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-zinc-800 flex justify-between">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            onClick={() => {
                                if (step < 3) setStep(s => s + 1);
                                else handleSubmit();
                            }}
                            disabled={
                                (step === 1 && !selectedClient) ||
                                (step === 2 && !selectedPackage) ||
                                isSubmitting
                            }
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                            {step === 3 ? 'Create Shoot' : 'Next'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateShootModal;
