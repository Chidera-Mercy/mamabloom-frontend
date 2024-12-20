import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddChildModal from './AddChildModal';

const AddChildButton = ({ onChildAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChildAdded = () => {
    onChildAdded && onChildAdded();
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group h-full min-h-[200px] w-full rounded-lg border-2 border-dashed border-[#E8D8D0] hover:border-[#7C9885] bg-white hover:bg-[#F5F9F7] transition-all duration-300 p-6"
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          {/* Plus Icon */}
          <div className="w-12 h-12 rounded-full bg-[#F5F9F7] group-hover:bg-[#7C9885] transition-colors duration-300 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-[#7C9885] group-hover:text-white transition-colors duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center">
            <h3 className="text-lg font-medium font-poppins text-[#2C3E50] group-hover:text-[#7C9885] transition-colors duration-300">
              Add Child
            </h3>
            <p className="text-sm text-[#666] mt-1 font-delius">
              Track your child's growth journey
            </p>
          </div>
        </div>
      </button>

      {isModalOpen && (
        <AddChildModal 
          onClose={() => setIsModalOpen(false)}
          onAdd={handleChildAdded}
        />
      )}
    </>
  );
};

export default AddChildButton;