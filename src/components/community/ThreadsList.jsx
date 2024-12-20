import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaComments, FaThumbtack } from 'react-icons/fa';

const ThreadsList = ({ category = 'all', searchQuery = '' }) => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const link = "/api/forum/get_threads"
        const url = new URL(link);
        if (category !== 'all') {
          url.searchParams.append('category', category);
        }
        if (searchQuery) {
          url.searchParams.append('search', searchQuery);
        }
        console.log('Thread data:00');
        const response = await fetch(url);
        const data = await response.json();
        console.log('Thread data:');
        console.log('Thread data:', data);

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
  }, [category, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-[#666] mb-4">No discussions found</p>
        <Link
          to="/community/new-thread"
          className="inline-block px-4 py-2 bg-gradient-to-r from-[#7C9885] to-[#9DB4A1] text-white rounded-lg"
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
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                {thread.is_pinned && (
                  <FaThumbtack className="text-[#7C9885]" size={14} />
                )}
                <Link
                  to={`/community/thread/${thread.thread_id}`}
                  className="text-lg font-medium text-[#2C3E50] hover:text-[#7C9885]"
                >
                  {thread.title}
                </Link>
              </div>
              <div className="mt-2 text-sm text-[#666]">
                <span>Posted by {thread.username}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(thread.created_at), 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <span className="text-[#7C9885]">{thread.category_name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[#666]">
              <FaComments />
              <span className="text-sm">{thread.reply_count || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadsList;
