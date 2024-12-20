import React, { useState } from 'react';
import { FaSpinner, FaBaby, FaRunning, FaBook, FaHeart, FaComments } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const EditMilestoneModal = ({ milestone, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    milestone_type: milestone.milestone_type,
    description: milestone.description,
    date_achieved: milestone.date_achieved,
    notes: milestone.notes || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const milestoneTypes = [
    {
      value: 'physical',
      label: 'Physical Development',
      examples: 'Walking, Crawling, First Steps',
      icon: <FaRunning className="text-blue-500" />
    },
    {
      value: 'cognitive',
      label: 'Cognitive Development',
      examples: 'First Words, Problem Solving, Recognition',
      icon: <FaBook className="text-purple-500" />
    },
    {
      value: 'social',
      label: 'Social & Emotional',
      examples: 'First Smile, Sharing, Making Friends',
      icon: <FaHeart className="text-pink-500" />
    },
    {
      value: 'language',
      label: 'Language & Communication',
      examples: 'Babbling, First Word, Sentences',
      icon: <FaComments className="text-green-500" />
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.milestone_type) {
      newErrors.milestone_type = 'Please select a milestone type';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date_achieved) {
      newErrors.date_achieved = 'Date is required';
    } else {
      // Check if date is not in the future
      const selectedDate = new Date(formData.date_achieved);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date_achieved = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const link = "/api/milestones/update_milestone"
      const response = await fetch(
        'http://169.239.251.102:3341/~anna.kodji/backend/milestones/update_milestone.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            milestone_id: milestone.id,
            user_id: user.id
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setErrors({ submit: data.message || 'Error updating milestone' });
      }
    } catch (error) {
      setErrors({ submit: 'Error connecting to server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E8D8D0]">
          <h2 className="text-2xl font-poppins font-medium text-[#2C3E50]">Update Milestone</h2>
          <p className="text-[#666] mt-1 font-delius">Capture your child's special moments</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Milestone Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2C3E50]">
              Type of Milestone
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {milestoneTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => handleChange({
                    target: { name: 'milestone_type', value: type.value }
                  })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${formData.milestone_type === type.value
                      ? 'border-[#7C9885] bg-[#F5F9F7]'
                      : 'border-[#E8D8D0] hover:border-[#7C9885]'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {type.icon}
                    <h3 className="font-medium text-[#2C3E50]">{type.label}</h3>
                  </div>
                  <p className="text-sm text-[#666]">{type.examples}</p>
                </div>
              ))}
            </div>
            {errors.milestone_type && (
              <p className="text-red-500 text-sm mt-1">{errors.milestone_type}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2C3E50]">
              What did your child achieve?
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? 'border-red-500' : 'border-[#E8D8D0]'
              } focus:outline-none focus:border-[#7C9885]`}
              placeholder="Describe the milestone..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Date Achieved */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2C3E50]">
              When did this happen?
            </label>
            <input
              type="date"
              name="date_achieved"
              value={formData.date_achieved}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.date_achieved ? 'border-red-500' : 'border-[#E8D8D0]'
              } focus:outline-none focus:border-[#7C9885]`}
            />
            {errors.date_achieved && (
              <p className="text-red-500 text-sm">{errors.date_achieved}</p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2C3E50]">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 rounded-lg border border-[#E8D8D0] focus:outline-none focus:border-[#7C9885]"
              placeholder="Any additional details you'd like to remember..."
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[#E8D8D0] rounded-lg text-[#666] hover:bg-[#F8F8F8] transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-colors duration-200 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Update Milestone'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMilestoneModal; 