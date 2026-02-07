import { Calendar, Clock, ExternalLink, Map, MapPin } from 'lucide-react';
import type { ShootItem } from '../../../types/shoot.types';

interface ProductionLogisticsProps {
    items: ShootItem[];
    onEditItem: (item: ShootItem) => void;
}

const ProductionLogistics = ({ items, onEditItem }: ProductionLogisticsProps) => {
    // Filter for event items 
    // Note: Assuming 'EVENT' type or inferred from presence of eventDate if type is generic. 
    // Based on original code, explicit type check was used.
    const eventItems = items?.filter(item => item.type === 'EVENT') || [];

    return (
        <div className="bg-[#09090b] text-white rounded-[2rem] p-8 border border-zinc-800 shadow-2xl relative overflow-hidden group">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/10">
                            <Calendar size={20} className="text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">Production Logistics</h2>
                    </div>
                    <button className="text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors group/btn">
                        View Full Itinerary
                        <ExternalLink size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-4 pb-2">
                    {eventItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onEditItem(item)}
                            className="flex-1 min-w-[200px] basis-[200px] bg-[#121214] p-3 rounded-xl border border-white/5 relative group cursor-pointer hover:border-orange-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em]">
                                    {item.eventDate ? new Date(item.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'DATE TBD'}
                                </span>
                                <Map className="text-zinc-600 group-hover:text-zinc-400 transition-colors" size={12} />
                            </div>

                            <h3 className="text-sm font-bold text-white mb-2 leading-tight truncate" title={item.name}>
                                {item.name}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-500 font-medium">
                                <div className="flex items-center gap-1">
                                    <Clock size={11} className="text-zinc-600" />
                                    <span>
                                        {item.startTime && item.endTime
                                            ? `${item.startTime} - ${item.endTime}`
                                            : (item.startTime || 'Time TBD')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={11} className="text-zinc-600" />
                                    <span className="truncate max-w-[120px]">{item.location || 'Location TBD'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {eventItems.length === 0 && (
                        <div className="w-full py-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-3xl">
                            No logistics added yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductionLogistics;
