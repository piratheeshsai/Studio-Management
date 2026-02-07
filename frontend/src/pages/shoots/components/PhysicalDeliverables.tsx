import { FileText, Image, Package } from 'lucide-react';
import type { ShootItem } from '../../../types/shoot.types';

// Get item type icon
const getItemIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('album') || t.includes('magazine')) return FileText;
    if (t.includes('frame') || t.includes('portrait')) return Image;
    if (t.includes('usb') || t.includes('drive')) return Package;
    return Package;
};

interface PhysicalDeliverablesProps {
    items: ShootItem[];
    onEditItem: (item: ShootItem) => void;
}

const PhysicalDeliverables = ({ items, onEditItem }: PhysicalDeliverablesProps) => {
    const productItems = items?.filter(item => item.type === 'PRODUCT') || [];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'READY':
                return { label: 'READY', color: 'bg-emerald-500' };
            case 'DELIVERED':
                return { label: 'DELIVERED', color: 'bg-blue-500' };
            case 'DESIGNING':
                return { label: 'IN DESIGN', color: 'bg-yellow-500' };
            case 'PRINTING':
                return { label: 'PRINTING', color: 'bg-orange-500' };
            case 'IN_PROGRESS':
                return { label: 'IN PROGRESS', color: 'bg-yellow-500' };
            case 'PENDING':
                return { label: 'QUEUED', color: 'bg-zinc-600' };
            default:
                return { label: status?.replace('_', ' ') || 'QUEUED', color: 'bg-zinc-600' };
        }
    };

    return (
        <div className="bg-[#09090b] text-white rounded-[2rem] p-8 border border-zinc-800 shadow-2xl relative overflow-hidden group">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/10">
                        <Package size={20} className="text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Physical Deliverables</h2>
                </div>

                <div className="space-y-4">
                    {productItems.map((item) => {
                        const ItemIcon = getItemIcon(item.type || item.name);
                        const { label, color } = getStatusConfig(item.status);

                        return (
                            <div
                                key={item.id}
                                onClick={() => onEditItem(item)}
                                className="bg-[#121214] p-2 pr-6 rounded-[1.5rem] border border-white/5 flex items-center gap-5 cursor-pointer hover:bg-[#18181b] transition-colors group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#09090b] flex items-center justify-center text-orange-600 border border-white/5 group-hover:border-orange-500/20 transition-colors">
                                    <ItemIcon size={20} strokeWidth={1.5} />
                                </div>

                                <div className="flex-1 min-w-0 py-1">
                                    <h4 className="text-white font-bold text-base truncate">{item.name}</h4>
                                    <p className="text-zinc-500 text-[11px] font-medium mt-0.5 truncate uppercase tracking-wide">
                                        {item.description || (item.dimensions ? `${item.dimensions} • ${item.pages || 0} Pages` : 'PREMIUM QUALITY')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
                                        {label}
                                    </span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
                                </div>
                            </div>
                        );
                    })}

                    {productItems.length === 0 && (
                        <div className="py-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-3xl">
                            No deliverables added yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhysicalDeliverables;
