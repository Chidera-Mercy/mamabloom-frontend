import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaComments, FaUserCircle, FaHeart } from 'react-icons/fa';
import defaultProfile from '../../assets/default-profile.png';

const ThreadsList = ({ activeCategory = 'all', searchQuery = '' }) => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const link = "/api/forum/get_threads"
        const url = new URL('http://169.239.251.102:3341/~anna.kodji/backend/forum/get_threads.php');
        
        if (activeCategory && activeCategory !== 'all') {
          url.searchParams.append('category', activeCategory);
        }
        
        if (searchQuery) {
          url.searchParams.append('search', searchQuery);
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setThreads(data.threads);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching threads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [activeCategory, searchQuery]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="mb-4">
          <FaComments className="mx-auto text-4xl text-gray-300" />
        </div>
        <p className="text-[#666] mb-4">No discussions found</p>
        <Link
          to="/community/new-thread"
          className="inline-block px-6 py-2 bg-gradient-to-r from-[#7C9885] to-[#9DB4A1] text-white rounded-lg hover:from-[#6B8574] hover:to-[#8CA390] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Start a new discussion
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div
          key={thread.thread_id}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start space-x-4">
            {/* User Profile Picture */}
            <div className="flex-shrink-0">
              {console.log(thread)}
              {console.log(thread.profile_picture)}
              {thread.profile_picture ? (
                <img
                  // `/api/get_image/${thread.profile_picture}`
                  src={ thread.profile_picture ? `http://169.239.251.102:3341/~anna.kodji/backend/${thread.profile_picture}` : defaultProfile }
                  alt={thread.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#7C9885]"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Thread Content */}
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    
                    <Link
                      to={`/community/thread/${thread.thread_id}`}
                      className="text-lg font-medium text-[#2C3E50] hover:text-[#7C9885] transition-colors duration-200 font-poppins"
                    >
                      {thread.title}
                    </Link>
                  </div>
                  <div className="mt-2 text-sm text-[#666] flex items-center flex-wrap gap-2">
                    <span className="font-medium text-[#7C9885] font-poppins">{thread.username}</span>
                    <span>•</span>
                    <span className="font-delius">{format(new Date(thread.created_at), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span className="bg-[#F0F4F1] px-2 py-1 rounded-full text-[#7C9885] font-poppins">
                      {thread.category_name}
                    </span>
                  </div>
                  {thread.content && (
                    <p className="mt-2 text-[#666] line-clamp-2">{thread.content}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2 text-[#666]">
                    <FaComments className="text-[#2C3E50]" />
                    <span className="text-sm text-[#2C3E50] font-delius">{thread.reply_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#666]">
                    <FaHeart className="text-[#E57373]" />
                    <span className="text-sm text-[#2C3E50] font-delius">{thread.likes_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadsList; 