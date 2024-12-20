import React, { useState, useEffect } from 'react';
import { 
  FaTh, 
  FaUsers, 
  FaComments, 
  FaBook, 
  FaChartBar,
} from 'react-icons/fa';
import {UsersPanel} from '../components/admin/UserPanel';
import {ForumPanel} from '../components/admin/ForumPanel';
import {ResourcesPanel} from '../components/admin/ResourcePanel';
import {DashboardPanel} from '../components/admin/DashboardPanel';
import { toast } from 'react-toastify';
import Header from '../components/layout/Header';

// Utility function for API calls
export const fetchApi = async (endpoint, options = {}) => {
  try {
    // Ensure endpoint starts with a forward slash if not present
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const link = `/api/get_data${formattedEndpoint}`;

    const response = await fetch(link, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'API request failed');
    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    toast.error(error.message || 'An error occurred');
    throw error;
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await fetchApi('admin/get_stats.php');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTh },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'forum', label: 'Forum', icon: FaComments },
    { id: 'resources', label: 'Resources', icon: FaBook },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPanel />;
      case 'users':
        return <UsersPanel />;
      case 'forum':
        return <ForumPanel />;
      case 'resources':
        return <ResourcesPanel />;
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF]">
        <Header />
      <div className="flex">
        <div className="w-64 min-h-screen bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="p-6">
            <h1 className="font-poppins text-2xl font-bold text-[#013f40] mb-8">Admin Panel</h1>
            <nav>
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg font-poppins text-sm transition-all hover:scale-105 ${
                    activeTab === id
                      ? 'bg-[#013f40] text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
