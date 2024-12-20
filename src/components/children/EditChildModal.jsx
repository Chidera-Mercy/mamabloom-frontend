import React, { useState } from 'react';
import { FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const EditChildModal = ({ child, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: child.name,
    date_of_birth: child.date_of_birth,
    gender: child.gender,
    relationship_to_child: child.relationship_to_child,
    weight: child.weight || '',
    height: child.height || '',
    head_circumference: child.head_circumference || '',
    blood_group: child.blood_group || '',
    rh_factor: child.rh_factor || '',
    profile_picture: null,
    profile_picture_reader: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const rhFactors = ['positive', 'negative'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile_picture: file,
          profile_picture_reader: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.relationship_to_child) newErrors.relationship_to_child = 'Relationship is required';
    
    if (formData.weight && isNaN(formData.weight)) {
      newErrors.weight = 'Weight must be a number';
    }
    if (formData.height && isNaN(formData.height)) {
      newErrors.height = 'Height must be a number';
    }
    if (formData.head_circumference && isNaN(formData.head_circumference)) {
      newErrors.head_circumference = 'Head circumference must be a number';
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
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      formDataToSend.append('child_id', child.id);
      if (formData.profile_picture) {
        formDataToSend.append('profile_picture', formData.profile_picture);
      }

      const link = "/api/children/update_child"
      const response = await fetch(
        link,
        {
          method: 'POST',
          body: formDataToSend,
        }
      );

      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setErrors({ submit: data.message || 'Error updating child' });
      }
    } catch (error) {
      setErrors({ submit: 'Error connecting to server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E8D8D0]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-poppins text-[#2C3E50]">Edit Child Profile</h2>
              <p className="text-[#666] mt-1 font-delius">Update your child's information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <FaTimes className="text-[#666]" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#E8D8D0]">
                {formData.profile_picture || child.profile_picture ? (
                  <img
                    // `/api/get_image/${child.profile_picture}`
                    src={formData.profile_picture_reader || `/api/get_image/${child.profile_picture}`}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F0F0F0] flex items-center justify-center">
                    <FaCamera className="text-[#666] text-xl" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#7C9885] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6B8574] transition-colors">
                <FaCamera className="text-white text-sm" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-sm text-[#666]">
              Click the camera icon to change profile picture
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500' : 'border-[#E8D8D0]'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.date_of_birth ? 'border-red-500' : 'border-[#E8D8D0]'
                }`}
              />
              {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Relationship to Child
              </label>
              <select
                value={formData.relationship_to_child}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship_to_child: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="mother">Mother</option>
                <option value="father">Father</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Head Circumference (cm)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.head_circumference}
                onChange={(e) => setFormData(prev => ({ ...prev, head_circumference: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Blood Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Blood Group
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData(prev => ({ ...prev, blood_group: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="">Select blood group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                RH Factor
              </label>
              <select
                value={formData.rh_factor}
                onChange={(e) => setFormData(prev => ({ ...prev, rh_factor: e.target.value }))}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="">Select RH factor</option>
                {rhFactors.map(factor => (
                  <option key={factor} value={factor}>{factor}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[#E8D8D0] rounded-lg text-[#666] hover:bg-[#F8F8F8] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChildModal;
