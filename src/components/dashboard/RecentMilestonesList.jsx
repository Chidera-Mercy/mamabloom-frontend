import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { FaBaby, FaRunning, FaBook, FaHeart } from 'react-icons/fa';

const RecentMilestonesList = ({ limit }) => {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Get icon based on milestone type
  const getMilestoneIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'physical':
        return <FaRunning className="text-blue-500" />;
      case 'cognitive':
        return <FaBook className="text-purple-500" />;
      case 'social':
        return <FaHeart className="text-pink-500" />;
      default:
        return <FaBaby className="text-green-500" />;
    }
  };

  useEffect(() => {
    const fetchRecentMilestones = async () => {
      try {
        const link = `/api/dashboard/get_recent_milestones?limit=${limit}`
        const response = await fetch(
          `http://169.239.251.102:3341/~anna.kodji/backend/dashboard/get_recent_milestones.php?limit=${limit}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: user.id
            })
          }
        );
        const data = await response.json();

        if (data.success) {
          setMilestones(data.milestones);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching milestones');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchRecentMilestones();
    }
  }, [limit, user?.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return (
    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
      {error}
    </div>
  );

  if (milestones.length === 0) {
    return (
      <div className="text-sm text-[#666] bg-gray-50 p-4 rounded-lg text-center">
        No milestones recorded yet. Start tracking your child's growth!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div 
          key={milestone.id} 
          className="flex items-start space-x-3 bg-white bg-opacity-50 p-3 rounded-lg hover:bg-opacity-70 transition-colors"
        >
          <div className="mt-1">
            {getMilestoneIcon(milestone.milestone_type)}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#2C3E50] font-poppins">
                {milestone.child_name}
                <span className="text-xs text-[#666] ml-2">
                  ({milestone.child_age})
                </span>
              </h4>
              <span className="text-xs text-[#666] font-delius">
                {format(new Date(milestone.date_achieved), 'MMM dd')}
              </span>
            </div>
            <p className="text-sm text-[#2C3E50] mt-1 font-poppins">
              {milestone.description}
            </p>
            {milestone.notes && (
              <p className="text-xs text-[#666] mt-1 italic font-poppins">
                {milestone.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentMilestonesList; 