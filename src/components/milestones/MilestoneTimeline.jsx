import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaBaby, FaRunning, FaBook, FaHeart, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import EditMilestoneModal from './EditMilestoneModal';

const MilestoneTimeline = ({ childId, refresh, onEditClick, onDelete }) => {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const { user } = useAuth();

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

  const fetchMilestones = async () => {
    try {
      const link = `/api/milestones/get_milestones?child_id=${childId}`
      const response = await fetch(link,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
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

  useEffect(() => {
    fetchMilestones();
  }, [childId, refresh]);

  const handleDelete = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    setIsDeleting(milestoneId);
    try {
      const link = "/api/milestones/delete_milestone"
      const response = await fetch(link,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            milestone_id: milestoneId,
            user_id: user.id
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        fetchMilestones();
        onDelete && onDelete();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error deleting milestone');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (milestone, e) => {
    e.preventDefault();
    e.stopPropagation();
    onEditClick && onEditClick(milestone);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-[#7C9885]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBaby className="text-4xl text-[#7C9885] mx-auto mb-4" />
        <p className="text-[#666]">
          No milestones recorded yet. Add your first milestone!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="flex group">
            <div className="flex-shrink-0 w-32 text-sm text-[#666] pt-2 font-delius">
              {format(new Date(milestone.date_achieved), 'MMM dd, yyyy')}
            </div>
            <div className="flex-grow pl-8 relative border-l-2 border-[#E8D8D0]">
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#7C9885] ring-4 ring-white" />
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E8D8D0] hover:shadow-md transition-all duration-200 group-hover:border-[#7C9885]">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2 font-poppins">
                      {getMilestoneIcon(milestone.milestone_type)}
                      <span className="text-xs font-medium text-[#666] bg-[#F0F0F0] px-2 py-1 rounded-full">
                        {milestone.milestone_type}
                      </span>
                    </div>
                    <h4 className="font-medium text-[#2C3E50] leading-relaxed font-poppins">
                      {milestone.description}
                    </h4>
                    {milestone.notes && (
                      <p className="text-[#666] mt-2 text-sm italic font-poppins">
                        {milestone.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditClick(milestone, e)}
                      className="p-2 text-[#7C9885] hover:text-[#6B8574] transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      disabled={isDeleting === milestone.id}
                      className={`p-2 transition-colors ${
                        isDeleting === milestone.id
                          ? 'text-gray-400'
                          : 'text-pink-400 hover:text-pink-500'
                      }`}
                      title="Delete milestone"
                    >
                      {isDeleting === milestone.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMilestone && (
        <EditMilestoneModal
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onSuccess={() => {
            setEditingMilestone(null);
            fetchMilestones();
          }}
        />
      )}
    </>
  );
};

export default MilestoneTimeline;
