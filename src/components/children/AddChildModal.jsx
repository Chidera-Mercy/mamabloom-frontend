import React, { useState } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AddChildModal = ({ onClose, onAdd }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: '',
    dateOfBirth: '',
    gender: '',
    relationship: '',
    photo: null,
    weight: '',
    height: '',
    headCircumference: '',
    bloodGroup: '',
    rhFactor: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const rhFactors = ['positive', 'negative'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.relationship) newErrors.relationship = 'Relationship is required';
    
    // Validate numeric fields if provided
    if (formData.weight && isNaN(formData.weight)) {
      newErrors.weight = 'Weight must be a number';
    }
    if (formData.height && isNaN(formData.height)) {
      newErrors.height = 'Height must be a number';
    }
    if (formData.headCircumference && isNaN(formData.headCircumference)) {
      newErrors.headCircumference = 'Head circumference must be a number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        setErrors({ submit: 'User not logged in' });
        return;
      }

      const link = "/api/children/add_child"
      const response = await fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onAdd && onAdd();
        onClose();
      } else {
        setErrors({ submit: data.message || 'Error adding child' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error connecting to server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-poppins font-medium text-[#2C3E50] mb-6">Add New Child</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm text-[#666] mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-[#E8D8D0]'
              } focus:outline-none focus:border-[#7C9885]`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm text-[#666] mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.dateOfBirth ? 'border-red-500' : 'border-[#E8D8D0]'
              } focus:outline-none focus:border-[#7C9885]`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm text-[#666] mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.gender ? 'border-red-500' : 'border-[#E8D8D0]'
              } focus:outline-none focus:border-[#7C9885]`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          {/* Relationship Field */}
          <div>
            <label className="block text-sm text-[#666] mb-1">Relationship to Child</label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.relationship ? 'border-red-500' : 'border-[#E8D8D0]'
              } focus:outline-none focus:border-[#7C9885]`}
            >
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="guardian">Guardian</option>
              <option value="caregiver">Caregiver</option>
              <option value="other">Other</option>
            </select>
            {errors.relationship && <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>}
          </div>

          {/* Photo Upload Field (Optional) */}
          <div className="space-y-2">
          <label className="block text-sm font-medium text-[#2C3E50]">
            Profile Picture (Optional)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E8D8D0] flex items-center justify-center">
                {formData.photo ? (
                  <img 
                    src={formData.photo}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaCamera className="text-[#2C3E50] text-xl" />
                )}
              </div>
              {formData.photo && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-[#2C3E50] cursor-pointer hover:text-[#7C9885]">
              <span>
                {formData.photo ? 'Change Picture' : 'Upload Picture'}
              </span>
              <input 
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        </div>

          {/* New fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded-lg border border-[#E8D8D0] focus:outline-none focus:border-[#7C9885]"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#666] mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.01"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded-lg border border-[#E8D8D0] focus:outline-none focus:border-[#7C9885]"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#666] mb-1">Head Circumference (cm)</label>
            <input
              type="number"
              step="0.01"
              name="headCircumference"
              value={formData.headCircumference}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-4 py-2 rounded-lg border border-[#E8D8D0] focus:outline-none focus:border-[#7C9885]"
            />
            {errors.headCircumference && (
              <p className="text-red-500 text-sm mt-1">{errors.headCircumference}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#E8D8D0] focus:outline-none focus:border-[#7C9885]"
              >
                <option value="">Select blood group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#666] mb-1">RH Factor</label>
              <select
                name="rhFactor"
                value={formData.rhFactor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#E8D8D0] focus:outline-none focus:border-[#7C9885]"
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
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-500 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[#E8D8D0] rounded-lg text-[#666] hover:bg-[#F8F8F8]"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Child'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
