import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const EditHealthRecordModal = ({ record, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    record_type: record.record_type,
    date_recorded: record.date_recorded,
    details: record.details,
    doctor_name: record.doctor_name,
    next_appointment: record.next_appointment || ''
  });

  const recordTypes = [
    { value: 'checkup', label: 'Check-up' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'measurement', label: 'Measurement' },
    { value: 'illness', label: 'Illness' },
    { value: 'dental', label: 'Dental' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const link = "/api/health/update_health_record"
      const response = await fetch(link,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            record_id: record.record_id
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating health record:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E8D8D0]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-poppins font-medium text-[#2C3E50]">Edit Health Record</h2>
            <button
              onClick={onClose}
              className="text-[#666] hover:text-[#2C3E50] transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Record Type
              </label>
              <select
                value={formData.record_type}
                onChange={(e) => setFormData({ ...formData, record_type: e.target.value })}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                required
              >
                {recordTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Date Recorded
              </label>
              <input
                type="date"
                value={formData.date_recorded}
                onChange={(e) => setFormData({ ...formData, date_recorded: e.target.value })}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Details
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885] min-h-[100px]"
                required
                placeholder="Enter health record details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Doctor's Name
              </label>
              <input
                type="text"
                value={formData.doctor_name}
                onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                required
                placeholder="Enter doctor's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Next Appointment
              </label>
              <input
                type="date"
                value={formData.next_appointment}
                onChange={(e) => setFormData({ ...formData, next_appointment: e.target.value })}
                className="w-full p-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                placeholder="Select next appointment date (if applicable)"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#666] hover:text-[#2C3E50] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHealthRecordModal; 
