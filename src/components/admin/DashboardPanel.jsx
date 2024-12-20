import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { FaUsers, FaComments, FaBook, FaUserPlus } from 'react-icons/fa';
import { fetchApi } from "../../pages/AdminDashboard";
import ForumDistribution from './ForumDistribution';

const COLORS = ['#013f40', '#025c5d', '#037a7b', '#049899'];

export const DashboardPanel = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await fetchApi('admin/get_dashboard_stats.php');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const getTotalThreads = (forumStats) => 
    forumStats.reduce((total, category) => total + parseInt(category.thread_count, 10), 0);

  if (!stats) return <div>Loading...</div>;

  const StatCard = ({ icon: Icon, label, value, subValue }) => {

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
            <div>
            <p className="font-delius text-gray-600 mb-1">{label}</p>
            <p className="font-poppins text-2xl font-bold text-[#013f40]">{value}</p>
            {subValue && (
                <p className="font-delius text-sm text-gray-500 mt-1">{subValue}</p>
            )}
            </div>
            <Icon size={24} className="text-[#013f40]" />
        </div>
        </div>
  )};

  return (
    <div>
      <h2 className="font-poppins text-2xl font-bold mb-6 text-[#013f40]">Dashboard Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={FaUsers} 
          label="Total Users" 
          value={stats.userStats.total_users}
          subValue={`+${stats.userStats.new_users_30d} this month`}
        />
        <StatCard 
          icon={FaUserPlus} 
          label="New Users (7d)" 
          value={stats.userStats.new_users_7d}
        />
        <StatCard 
          icon={FaComments} 
          label="Forum Threads" 
          value={getTotalThreads(stats.forumStats)}
        />
        <StatCard 
          icon={FaBook} 
          label="Total Resources" 
          value={stats.resourceStats.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">User Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="new_users" stroke="#013f40" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forum Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Forum Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.forumStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="thread_count" name="Threads" fill="#013f40" />
                <Bar dataKey="reply_count" name="Replies" fill="#037a7b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Resources */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Top Resources</h3>
          <div className="space-y-4">
            {stats.resourceStats.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-poppins font-medium text-[#013f40]">{resource.title}</h4>
                  <p className="font-delius text-sm text-gray-600">
                    {resource.category_name} • {resource.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-poppins text-lg font-medium text-[#013f40]">
                    {resource.view_count.toLocaleString()}
                  </p>
                  <p className="font-delius text-sm text-gray-600">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forum Categories Distribution */}
        <ForumDistribution stats={stats} />
      </div>
    </div>
  );
};

export default DashboardPanel;