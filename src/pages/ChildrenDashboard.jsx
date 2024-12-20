import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ChildCard from '../components/children/ChildCard';
import AddChildButton from '../components/children/AddChildButton';
import Header from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
// Import decorative images
import decorativeBaby1 from '../assets/decorative-baby1.png'; 
import decorativeToys from '../assets/decorative-toys.png';
import decorativeStars from '../assets/decorative-stars.png';

const ChildrenDashboard = () => {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        setError('User not logged in');
        return;
      }
      const link = `/api/children/get_children?user_id=${user.id}`
      const response = await fetch(
        `http://169.239.251.102:3341/~anna.kodji/backend/children/get_children.php?user_id=${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setChildren(data.children);
      } else {
        setError(data.message || 'Failed to fetch children');
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [user?.id]);

  const handleChildDelete = (deletedChildId) => {
    setChildren(prevChildren => 
      prevChildren.filter(child => child.id !== deletedChildId)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] relative overflow-hidden">
      {/* Decorative Images */}
      <img 
        src={decorativeBaby1} 
        alt="" 
        className="absolute bottom-0 -right-0 w-80 opacity-70 pointer-events-none"
      />
      
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 mb-6 flex items-center text-[#2C3E50] hover:text-[#7C9885] transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Dashboard</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-medium text-[#2C3E50]">
            My Children's Growth Journey
          </h1>
          <p className="text-[#666] mt-2 font-delius text-xl">
            Track and celebrate every milestone
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                    <div className="flex-grow space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map(child => (
              <ChildCard 
                key={child.id} 
                child={child} 
                onDelete={handleChildDelete}
              />
            ))}
            <AddChildButton onChildAdded={fetchChildren} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenDashboard;