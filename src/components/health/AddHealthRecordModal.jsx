import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaStethoscope, FaSyringe, FaRuler, FaTooth, FaThermometerHalf } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AddHealthRecordModal = ({ childId, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    record_type: 'checkup',
    date_recorded: new Date().toISOString().split('T')[0],
    details: '',
    doctor_name: '',
    next_appointment: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordTypes = [
    { 
      value: 'checkup', 
      label: 'Check-up',
      icon: <FaStethoscope className="text-blue-500" />,
      description: 'Regular health check-up or consultation'
    },
    { 
      value: 'vaccination', 
      label: 'Vaccination',
      icon: <FaSyringe className="text-green-500" />,
      description: 'Immunization or vaccine administration'
    },
    { 
      value: 'measurement', 
      label: 'Measurement',
      icon: <FaRuler className="text-purple-500" />,
      description: 'Height, weight, or other measurements'
    },
    { 
      value: 'illness', 
      label: 'Illness',
      icon: <FaThermometerHalf className="text-red-500" />,
      description: 'Sickness, infection, or other health issues'
    },
    { 
      value: 'dental', 
      label: 'Dental',
      icon: <FaTooth className="text-orange-500" />,
      description: 'Dental check-up or procedure'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date_recorded) {
      newErrors.date_recorded = 'Date is required';
    }
    if (!formData.details.trim()) {
      newErrors.details = 'Details are required';
    }
    if (!formData.doctor_name.trim()) {
      newErrors.doctor_name = "Doctor's name is required";
    }
    if (formData.next_appointment && new Date(formData.next_appointment) < new Date(formData.date_recorded)) {
      newErrors.next_appointment = 'Next appointment cannot be before record date';
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
      const link = "/api/health/add_health_record"
      const response = await fetch(
        'http://169.239.251.102:3341/~anna.kodji/backend/health/add_health_record.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            child_id: childId
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setErrors({ submit: data.message || 'Error adding health record' });
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
              <h2 className="text-2xl font-poppins font-medium text-[#2C3E50]">Add Health Record</h2>
              <p className="text-[#666] mt-1 font-delius">Record your child's health journey</p>
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
          {/* Record Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recordTypes.map(type => (
              <div
                key={type.value}
                onClick={() => setFormData(prev => ({ ...prev, record_type: type.value }))}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${formData.record_type === type.value
                    ? 'border-[#7C9885] bg-[#F5F9F7]'
                    : 'border-[#E8D8D0] hover:border-[#7C9885]'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {type.icon}
                  <h3 className="font-medium text-[#2C3E50]">{type.label}</h3>
                </div>
                <p className="text-xs text-[#666]">{type.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date Recorded */}
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Date Recorded
              </label>
              <input
                type="date"
                value={formData.date_recorded}
                onChange={(e) => setFormData(prev => ({ ...prev, date_recorded: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.date_recorded 
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-[#E8D8D0] focus:ring-[#7C9885]/20'
                }`}
              />
              {errors.date_recorded && (
                <p className="text-red-500 text-xs mt-1">{errors.date_recorded}</p>
              )}
            </div>

            {/* Doctor's Name */}
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Doctor's Name
              </label>
              <input
                type="text"
                value={formData.doctor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.doctor_name 
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-[#E8D8D0] focus:ring-[#7C9885]/20'
                }`}
                placeholder="Enter doctor's name"
              />
              {errors.doctor_name && (
                <p className="text-red-500 text-xs mt-1">{errors.doctor_name}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Details
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 min-h-[100px] ${
                errors.details 
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#E8D8D0] focus:ring-[#7C9885]/20'
              }`}
              placeholder="Enter health record details..."
            />
            {errors.details && (
              <p className="text-red-500 text-xs mt-1">{errors.details}</p>
            )}
          </div>

          {/* Next Appointment */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Next Appointment (Optional)
            </label>
            <input
              type="date"
              value={formData.next_appointment}
              onChange={(e) => setFormData(prev => ({ ...prev, next_appointment: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.next_appointment 
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#E8D8D0] focus:ring-[#7C9885]/20'
              }`}
            />
            {errors.next_appointment && (
              <p className="text-red-500 text-xs mt-1">{errors.next_appointment}</p>
            )}
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
                'Save Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHealthRecordModal;