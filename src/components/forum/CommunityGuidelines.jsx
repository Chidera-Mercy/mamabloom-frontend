import React, { useState } from 'react';
import { FaHeart, FaShieldAlt, FaRegLightbulb, FaRegComments } from 'react-icons/fa';

const CommunityGuidelines = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const guidelines = [
    {
      icon: <FaHeart className="text-pink-400" />,
      title: "Be Kind & Supportive",
      description: "Treat others with respect and empathy. We're all here to support each other on our parenting journey."
    },
    {
      icon: <FaShieldAlt className="text-[#7C9885]" />,
      title: "Protect Privacy",
      description: "Be mindful of sharing personal information. Respect others' privacy as you'd want yours respected."
    },
    {
      icon: <FaRegLightbulb className="text-amber-400" />,
      title: "Share Constructively",
      description: "Share experiences and advice in a constructive way. Avoid judgment and criticism."
    },
    {
      icon: <FaRegComments className="text-blue-400" />,
      title: "Stay On Topic",
      description: "Keep discussions relevant to parenting and child development."
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-[#2C3E50] mb-4">
        Community Guidelines
      </h3>
      
      <div className={`space-y-4 ${!isExpanded ? 'max-h-[200px] overflow-hidden' : ''}`}>
        {guidelines.map((guideline, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FDF8F5]">
              {guideline.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#2C3E50]">
                {guideline.title}
              </h4>
              <p className="text-sm text-[#666] mt-1">
                {guideline.description}
              </p>
            </div>
          </div>
        ))}

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 text-sm text-[#7C9885] hover:text-[#6B8574] transition-colors"
      >
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>

      <div className="mt-6 pt-4 border-t border-[#E8D8D0]">
        <p className="text-xs text-[#666] italic">
          By participating in our community, you agree to follow these guidelines. 
          Repeated violations may result in restricted access.
        </p>
      </div>
    </div>
  );
};

export default CommunityGuidelines; 