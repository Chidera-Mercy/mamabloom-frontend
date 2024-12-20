import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaRuler, FaWeight, FaTrash } from 'react-icons/fa';

const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  
  if (years < 1) {
    return `${months} month${months !== 1 ? 's' : ''} old`;
  }
  return `${years} year${years !== 1 ? 's' : ''} old`;
};

const ChildCard = ({ child, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const age = calculateAge(child.date_of_birth);

  const handleDelete = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      setIsDeleting(true);
      const link = "/api/children/delete_child"
      const response = await fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ child_id: child.id }),
      });

      const data = await response.json();

      if (data.success) {
        onDelete && onDelete(child.id);
      } else {
        console.error('Failed to delete child:', data.message);
      }
    } catch (error) {
      console.error('Error deleting child:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <Link 
      to={`/child/${child.id}`}
      className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#E8D8D0] hover:scale-[1.02] group relative"
    >
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 p-2 text-pink-500 hover:text-pink-500 transition-colors"
      >
        {showConfirm ? (
          <span className="text-xs font-medium">
            {isDeleting ? 'Deleting...' : 'Click again to confirm'}
          </span>
        ) : (
          <FaTrash />
        )}
      </button>

      <div className="flex items-start space-x-4">
        <div className="relative">
          {child.profile_picture ? (
            <img
              // `/api/get_image/${child.profile_picture}`
              src={`/api/get_image/${child.profile_picture}`}
              alt={child.name}
              className="w-20 h-20 rounded-xl object-cover border-2 border-[#E8D8D0] group-hover:border-[#7C9885] transition-colors"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=E8D8D0&color=2C3E50`;
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-[#E8D8D0] flex items-center justify-center group-hover:bg-[#7C9885] transition-colors">
              <FaUser className="text-2xl text-[#2C3E50] group-hover:text-white" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#7C9885] flex items-center justify-center">
            <span className="text-white text-xs">
              {child.gender === 'male' ? '♂' : '♀'}
            </span>
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-medium font-poppins text-[#2C3E50] group-hover:text-[#7C9885] transition-colors">
            {child.name}
          </h3>
          <p className="text-[#666] text-sm font-delius">{age}</p>
          
          {(child.height || child.weight) && (
            <div className="mt-3 flex items-center gap-4 text-xs text-[#666] font-delius">
              {child.height && (
                <div className="flex items-center gap-1">
                  <FaRuler className="text-[#7C9885]" />
                  <span>{child.height} cm</span>
                </div>
              )}
              {child.weight && (
                <div className="flex items-center gap-1">
                  <FaWeight className="text-[#7C9885]" />
                  <span>{child.weight} kg</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChildCard;
