import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaSyringe, FaWeight, FaRuler, FaCalendarCheck, FaSpinner, FaPencilAlt, FaTrash, FaUserMd, FaCalendarAlt, FaTooth, FaThermometerHalf } from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import EditHealthRecordModal from './EditHealthRecordModal';

const HealthRecordsList = ({ childId, onEditClick, refresh, onDelete }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const { user } = useAuth();

  const recordTypeIcons = {
    'checkup': <FaStethoscope className="text-blue-500" />,
    'vaccination': <FaSyringe className="text-green-500" />,
    'measurement': <FaRuler className="text-purple-500" />,
    'dental': <FaTooth className="text-orange-500" />,
    'illness': <FaThermometerHalf className="text-red-500" />
  };

  const fetchRecords = async () => {
    try {
      const link = `/api/health/get_health_records?child_id=${childId}`
      const response = await fetch(
        `http://169.239.251.102:3341/~anna.kodji/backend/health/get_health_records.php?child_id=${childId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.records);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch health records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [childId, refresh]);

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this health record?')) {
      return;
    }

    setIsDeleting(recordId);
    try {
      const link = "/api/health/delete_health_record"
      const response = await fetch(
        'http://169.239.251.102:3341/~anna.kodji/backend/health/delete_health_record.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            record_id: recordId,
            user_id: user.id
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        fetchRecords();
        onDelete && onDelete();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (record, e) => {
    e.preventDefault();
    e.stopPropagation();
    onEditClick && onEditClick(record);
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

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <FaStethoscope className="text-4xl text-[#7C9885] mx-auto mb-4" />
        <p className="text-[#666]">
          No health records found. Add your first record!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {records.map(record => (
        <div
          key={record.record_id}
          className="bg-white bg-opacity-70 p-6 rounded-xl shadow-sm border border-[#E8D8D0] hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                {recordTypeIcons[record.record_type.toLowerCase()] || <FaStethoscope className="text-[#7C9885]" />}
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#2C3E50] capitalize group-hover:text-[#7C9885] transition-colors font-poppins">
                  {record.record_type}
                </h3>
                <p className="text-sm text-[#666] font-delius">
                  {format(new Date(record.date_recorded), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleEditClick(record, e)}
                className="p-2 text-[#7C9885] hover:text-[#6B8574] transition-colors"
                title="Edit record"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={() => handleDelete(record.record_id)}
                disabled={isDeleting === record.record_id}
                className={`p-2 transition-colors ${
                  isDeleting === record.record_id
                    ? 'text-gray-400'
                    : 'text-pink-400 hover:text-pink-500'
                }`}
                title="Delete record"
              >
                {isDeleting === record.record_id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-[#2C3E50] leading-relaxed font-poppins">
              {record.details}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[#666]">
              {record.doctor_name && (
                <div className="flex items-center gap-2 font-poppins">
                  <FaUserMd className="text-[#7C9885]" />
                  <span>Dr. {record.doctor_name}</span>
                </div>
              )}
              {record.next_appointment && (
                <div className="flex items-center gap-2 font-poppins">
                  <FaCalendarAlt className="text-[#7C9885]" />
                  <span>Next: {format(new Date(record.next_appointment), 'MMMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isEditModalOpen && selectedRecord && (
        <EditHealthRecordModal
          record={selectedRecord}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRecord(null);
          }}
          onSuccess={() => {
            fetchRecords();
            setIsEditModalOpen(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default HealthRecordsList;