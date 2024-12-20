import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaVideo, FaPodcast, FaNewspaper, FaClock, FaEye } from 'react-icons/fa';
import defaultProfile from '../../assets/default-profile.png';

// Helper function to clean text content
const cleanTextContent = (text) => {
  if (!text) return '';
  return text
    .replace(/\\n/g, '\n')  // Replace \n with actual line breaks
    .replace(/\\r/g, '')    // Remove \r
    .replace(/\\/g, '')     // Remove remaining backslashes
    .trim();               // Remove extra whitespace
};

// Resource Card Component
export const ResourceCard = ({ resource }) => {
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo className="text-pink-500" />;
      case 'podcast':
        return <FaPodcast className="text-purple-500" />;
      default:
        return <FaNewspaper className="text-blue-500" />;
    }
  };

  return (
    <Link
      to={`/resources/${resource.resource_id}`}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative">
        {resource.thumbnail ? (
          <img
            // `/api/get_image/${resource.thumbnail}`
            src={resource.thumbnail ? `http://169.239.251.102:3341/~anna.kodji/backend/${resource.thumbnail}` : defaultProfile}
            alt={resource.title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
            {getTypeIcon(resource.type)}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center space-x-2">
          {getTypeIcon(resource.type)}
          <span className="text-sm capitalize">{resource.type}</span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
            {resource.category_name}
          </span>
          {resource.is_featured ? (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">
              Featured
            </span>
          ) : (
            <span></span>
          )}
        </div>
        
        <h3 className="text-lg font-medium text-[#2C3E50] mb-2 line-clamp-2 group-hover:text-[#7C9885] transition-colors duration-200">
          {cleanTextContent(resource.title)}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 border-t">
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-400" />
            <span>{new Date(resource.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaEye className="text-gray-400" />
            <span>{resource.view_count} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Featured Resource Card
export const FeaturedResourceCard = ({ resource }) => (
  <Link
    to={`/resources/${resource.resource_id}`}
    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
    {resource.thumbnail ? (
      <img
        // `/api/get_image/${resource.thumbnail}`
        src={resource.thumbnail ? `http://169.239.251.102:3341/~anna.kodji/backend/${resource.thumbnail}` : defaultProfile}
        alt={resource.title}
        className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
    ) : (
      <div className="w-full h-72 bg-gradient-to-br from-pink-400 to-pink-600" />
    )}
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
      <div className="flex items-center space-x-3 mb-3">
        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
          {resource.category_name}
        </span>
        <span className="px-3 py-1 bg-yellow-400/90 text-white rounded-full text-xs font-medium">
          Featured
        </span>
      </div>
      <h3 className="text-xl font-medium text-white mb-2 line-clamp-2">
        {cleanTextContent(resource.title)}
      </h3>
      <div className="flex items-center space-x-4 text-sm text-white/80">
        <div className="flex items-center space-x-2">
          <FaEye />
          <span>{resource.view_count} views</span>
        </div>
        <span>•</span>
        <span>{new Date(resource.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  </Link>
);