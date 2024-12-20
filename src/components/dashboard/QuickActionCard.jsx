import React from 'react';
import { Link } from 'react-router-dom';

const QuickActionCard = ({ icon, title, description, link }) => {
  return (
    <Link 
      to={link}
      className="bg-white bg-opacity-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl text-[#7C9885]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-[#2C3E50] font-poppins">{title}</h3>
          <p className="text-sm text-[#666] mt-1 font-poppins">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default QuickActionCard; 