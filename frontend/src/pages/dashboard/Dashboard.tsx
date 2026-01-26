import React from 'react';

import DashboardCard from '../../components/dashboard/DashboardCard';
import LivePreviewCard from '../../components/dashboard/widgets/LivePreviewCard';
import AIProcessingStatus from '../../components/dashboard/widgets/AIProcessingStatus';
import StatsCard from '../../components/dashboard/widgets/StatsCard';
import AlbumBuilderPreview from '../../components/dashboard/widgets/AlbumBuilderPreview';
import CollaborationPanel from '../../components/dashboard/widgets/CollaborationPanel';
import ClientInteractionPanel from '../../components/dashboard/widgets/ClientInteractionPanel';
import RevenueChart from '../../components/dashboard/widgets/RevenueChart';
import CloudStorageCard from '../../components/dashboard/widgets/CloudStorageCard';
import { Image, Users, Layers, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <>
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* Row 1: Hero (Live Preview) + Stats Column */}
                <LivePreviewCard />

                <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <StatsCard
                        title="Total Photos"
                        value="24,593"
                        subtext="+1,204 this week"
                        icon={Image}
                        color="blue"
                        trend="+12%"
                    />
                    <StatsCard
                        title="Active Clients"
                        value="128"
                        subtext="3 new today"
                        icon={Users}
                        color="purple"
                        trend="+12%"
                    />
                    <StatsCard
                        title="Projects"
                        value="15"
                        subtext="8 in progress"
                        icon={Layers}
                        color="amber"
                    />
                </div>

                <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <AIProcessingStatus />
                    <CloudStorageCard />
                </div>


                {/* Row 2: Interaction & Analytics */}
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <RevenueChart />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <CollaborationPanel />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <ClientInteractionPanel />
                </div>

                {/* Row 3: Tools */}
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                    <AlbumBuilderPreview />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <DashboardCard className="p-6 h-full flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Quick Action</h3>
                        <p className="text-xs text-slate-400">Create new workflow</p>
                    </DashboardCard>
                </div>
            </div>
        </>
    );
};

export default Dashboard;

