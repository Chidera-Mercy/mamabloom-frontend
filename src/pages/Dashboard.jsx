import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBaby, FaUsers, FaBook, FaChevronRight } from 'react-icons/fa';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import RecentMilestonesList from '../components/dashboard/RecentMilestonesList';
import RecentForumPosts from '../components/dashboard/RecentForumPosts';
import { ResourceCard } from '../components/resources/ResourceCard';
import Header from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import decorativeMother1 from '../assets/decorative-mum1.png';
import decorativeFlowers from '../assets/decorative-flowers.png';
import decorativeToys from '../assets/decorative-toys.png';

const Dashboard = () => {
  const [featuredResources, setFeaturedResources] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeaturedResources = async () => {
      try {
        const link = "/api/dashboard/get_resources"
        const response = await fetch(link);
        const data = await response.json();
        
        if (data.success) {
          setFeaturedResources(data.featured_resources);
        }
      } catch (error) {
        console.error('Error fetching featured resources:', error);
      }
    };

    fetchFeaturedResources();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] relative">
      {/* Decorative Elements with improved positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img 
          src={decorativeMother1} 
          alt="" 
          className="absolute top-24 -right-8 w-72 opacity-15 transform rotate-2"
        />
        <img 
          src={decorativeFlowers} 
          alt="" 
          className="absolute bottom-24 -left-16 w-56 opacity-15 transform rotate-45"
        />
        <img 
          src={decorativeToys} 
          alt="" 
          className="absolute top-1/2 -right-4 w-48 opacity-15 transform -rotate-12"
        />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        {/* Welcome Section with enhanced styling */}
        <section className="pt-8 pb-6">
          <div className="bg-white/80 rounded-2xl p-8 backdrop-blur-md shadow-lg border border-white/20">
            <h1 className="text-4xl font-poppins font-medium text-[#7C9885] mb-3">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-[#666] font-delius text-xl">
              Track your child's journey and connect with other parents
            </p>
          </div>
        </section>

        {/* Quick Actions with improved grid layout */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              icon={<FaBaby className="text-4xl text-[#7C9885]" />}
              title="Track Growth"
              description="Record milestones, health updates"
              link="/children"
              className="hover:transform hover:scale-105 transition-transform"
            />
            <QuickActionCard
              icon={<FaUsers className="text-4xl text-[#7C9885]" />}
              title="Community"
              description="Connect with other parents"
              link="/community"
              className="hover:transform hover:scale-105 transition-transform"
            />
            <QuickActionCard
              icon={<FaBook className="text-4xl text-[#7C9885]" />}
              title="Resources"
              description="Parenting guides and tips"
              link="/resources"
              className="hover:transform hover:scale-105 transition-transform"
            />
          </div>
        </section>

        {/* Recent Activity with enhanced card design */}
        <section className="mb-8">
          <h2 className="text-2xl font-poppins font-medium text-[#2C3E50] mb-6 pl-2">
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-delius text-xl text-[#2C3E50]">
                  Latest Milestones
                </h3>
                <Link 
                  to="/children" 
                  className="flex items-center text-[#7C9885] hover:text-[#5A7262] transition-colors font-delius group"
                >
                  View all
                  <FaChevronRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <RecentMilestonesList limit={3} />
            </div>

            <div className="bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-delius text-xl text-[#2C3E50]">
                  Community Updates
                </h3>
                <Link 
                  to="/community" 
                  className="flex items-center text-[#7C9885] hover:text-[#5A7262] transition-colors font-delius group"
                >
                  Join discussion
                  <FaChevronRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <RecentForumPosts limit={3} />
            </div>
          </div>
        </section>

        {/* Featured Resources with improved card layout */}
        <section>
          <div className="bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-poppins font-medium text-[#2C3E50]">
                Featured Resources
              </h2>
              <Link 
                to="/resources" 
                className="flex items-center text-[#7C9885] hover:text-[#5A7262] transition-colors font-delius group"
              >
                View all resources
                <FaChevronRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.map(resource => (
                <ResourceCard 
                  key={resource.resource_id} 
                  resource={resource}
                  className="hover:transform hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
