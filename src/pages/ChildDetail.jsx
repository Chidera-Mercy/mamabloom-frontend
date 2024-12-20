import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaPlus, FaBaby, FaRuler, FaWeight, FaTint } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';

// Import components
import MilestoneTimeline from '../components/milestones/MilestoneTimeline';
import HealthRecordsList from '../components/health/HealthRecordsList';
import AddMilestoneModal from '../components/milestones/AddMilestoneModal';
import AddHealthRecordModal from '../components/health/AddHealthRecordModal';
import EditChildModal from '../components/children/EditChildModal';
import EditMilestoneModal from '../components/milestones/EditMilestoneModal';
import EditHealthRecordModal from '../components/health/EditHealthRecordModal';

// Import decorative images
import decorativeBaby1 from '../assets/decorative-baby1.png';
import decorativeStars from '../assets/decorative-stars.png';
import decorativeToys from '../assets/decorative-toys.png';

const ChildDetail = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [child, setChild] = useState(null);
  const [activeTab, setActiveTab] = useState('milestones');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isEditHealthRecordModalOpen, setIsEditHealthRecordModalOpen] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);

  useEffect(() => {
    fetchChildDetails();
  }, [childId, user?.id]);

  const fetchChildDetails = async () => {
    try {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      const link = `/api/children/get_child?child_id=${childId}&user_id=${user.id}`
      const response = await fetch(link);
      const data = await response.json();

      if (data.success) {
        setChild(data.child);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching child details');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    if (years < 1) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
    return `${years} year${years !== 1 ? 's' : ''} old`;
  };

  const handleMilestoneEdit = (milestone) => {
    setSelectedMilestone(milestone);
    setIsEditMilestoneModalOpen(true);
  };

  const handleMilestoneEditSuccess = () => {
    setIsEditMilestoneModalOpen(false);
    setSelectedMilestone(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleMilestoneDelete = () => {
    fetchChildDetails();
  };

  const handleHealthRecordEdit = (record) => {
    setSelectedHealthRecord(record);
    setIsEditHealthRecordModalOpen(true);
  };

  const handleHealthRecordEditSuccess = () => {
    setIsEditHealthRecordModalOpen(false);
    setSelectedHealthRecord(null);
    setRefreshKey(prev => prev + 1);
    fetchChildDetails();
  };

  const handleHealthRecordDelete = () => {
    fetchChildDetails();
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] flex items-center justify-center">
      <div className="animate-pulse text-[#2C3E50] text-lg">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] flex items-center justify-center">
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] relative overflow-hidden">
      {/* Decorative Images */}
      <img 
        src={decorativeBaby1} 
        alt="" 
        className="absolute top-40 -right-8 w-48 opacity-60 pointer-events-none"
      />

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/children')}
          className="flex items-center text-[#2C3E50] hover:text-[#7C9885] transition-colors mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Children
        </button>

        {/* Child Header Card */}
        <div className="bg-white bg-opacity-70 rounded-xl shadow-sm p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-[#E8D8D0]">
                  {child.profile_picture ? (
                    <img
                      // `/api/get_image/${child.profile_picture}`
                      src={`/api/get_image/${child.profile_picture}`}
                      alt={child.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E8D8D0] flex items-center justify-center">
                      <FaBaby className="text-3xl text-[#2C3E50]" />
                    </div>
                  )}
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${child.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} flex items-center justify-center`}>
                  <span className="text-white text-sm">
                    {child.gender === 'male' ? '♂' : '♀'}
                  </span>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-poppins text-[#2C3E50]">{child.name}</h1>
                <p className="text-[#666] mt-1 font-delius">{calculateAge(child.date_of_birth)}</p>
                <div className="flex gap-4 mt-3">
                  {child.weight && (
                    <div className="flex items-center font-delius gap-1 text-sm text-[#666]">
                      <FaWeight className="text-[#7C9885]" />
                      <span>{child.weight} kg</span>
                    </div>
                  )}
                  {child.height && (
                    <div className="flex items-center font-delius gap-1 text-sm text-[#666]">
                      <FaRuler className="text-[#7C9885]" />
                      <span>{child.height} cm</span>
                    </div>
                  )}
                  {child.blood_group && (
                    <div className="flex items-center font-delius gap-1 text-sm text-[#666]">
                      <FaTint className="text-[#7C9885]" />
                      <span>{child.blood_group}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-[#7C9885] hover:text-[#6B8574] transition-colors"
            >
              <FaEdit className="text-xl" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#E8D8D0]">
            <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
              <div className="text-2xl font-medium font-delius text-[#2C3E50]">
                {child.milestone_count}
              </div>
              <div className="text-sm font-poppins text-[#666]">Milestones Recorded</div>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
              <div className="text-2xl font-medium font-delius text-[#2C3E50]">
                {child.health_record_count}
              </div>
              <div className="text-sm font-poppins text-[#666]">Health Records</div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white bg-opacity-70 rounded-xl shadow-sm p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg font-poppins transition-colors ${
                  activeTab === 'milestones'
                    ? 'bg-[#7C9885] text-white'
                    : 'text-[#2C3E50] hover:bg-[#F5F5F5]'
                }`}
                onClick={() => setActiveTab('milestones')}
              >
                Milestones
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors font-poppins ${
                  activeTab === 'health'
                    ? 'bg-[#7C9885] text-white'
                    : 'text-[#2C3E50] hover:bg-[#F5F5F5]'
                }`}
                onClick={() => setActiveTab('health')}
              >
                Health Records
              </button>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-colors font-poppins"
            >
              <FaPlus className="mr-2" />
              Add {activeTab === 'milestones' ? 'Milestone' : 'Health Record'}
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'milestones' ? (
              <MilestoneTimeline 
                childId={childId} 
                refresh={refreshKey}
                onEditClick={handleMilestoneEdit}
                onDelete={handleMilestoneDelete}
              />
            ) : (
              <HealthRecordsList 
                childId={childId}
                onEditClick={handleHealthRecordEdit}
                refresh={refreshKey}
                onDelete={handleHealthRecordDelete}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && activeTab === 'milestones' && (
        <AddMilestoneModal
          childId={childId}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            setRefreshKey(prev => prev + 1);
            fetchChildDetails();
          }}
        />
      )}

      {isAddModalOpen && activeTab === 'health' && (
        <AddHealthRecordModal
          childId={childId}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchChildDetails();
          }}
        />
      )}

      {isEditModalOpen && (
        <EditChildModal
          child={child}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchChildDetails();
          }}
        />
      )}

      {isEditMilestoneModalOpen && selectedMilestone && (
        <EditMilestoneModal
          milestone={selectedMilestone}
          onClose={() => {
            setIsEditMilestoneModalOpen(false);
            setSelectedMilestone(null);
          }}
          onSuccess={handleMilestoneEditSuccess}
        />
      )}

      {isEditHealthRecordModalOpen && selectedHealthRecord && (
        <EditHealthRecordModal
          record={selectedHealthRecord}
          onClose={() => {
            setIsEditHealthRecordModalOpen(false);
            setSelectedHealthRecord(null);
          }}
          onSuccess={handleHealthRecordEditSuccess}
        />
      )}
    </div>
  );
};

export default ChildDetail;
