import { StatsCard } from './StatsCard';
export const OverviewPanel = ({ stats }) => {
if (!stats) return <div>Loading...</div>;

return (
    <div>
    <h2 className="font-poppins text-2xl font-bold mb-6 text-[#013f40]">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Forum Threads', value: stats.totalThreads },
        { label: 'Resources', value: stats.totalResources },
        { label: 'Active Today', value: stats.activeUsers },
        ].map((stat, index) => (
        <StatsCard key={index} {...stat} />
        ))}
    </div>
    </div>
);
};
