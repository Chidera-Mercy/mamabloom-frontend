import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaHeart, FaComments } from 'react-icons/fa';
import defaultProfile from '../../assets/default-profile.png';

const RecentForumPosts = ({ limit }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const link = `/api/dashboard/get_recent_posts?limit=${limit}`
        const response = await fetch(
          `http://169.239.251.102:3341/~anna.kodji/backend/dashboard/get_recent_posts.php?limit=${limit}`
        );
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) return (
    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
      {error}
    </div>
  );
  
  if (posts.length === 0) {
    return (
      <div className="text-sm text-[#666] bg-gray-50 p-4 rounded-lg text-center">
        No discussions yet. Be the first to start one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          to={`/community/thread/${post.id}`}
          className="block bg-white bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img
                // `/api/get_image/${post.author_image}`
                src={ post.author_image ? `http://169.239.251.102:3341/~anna.kodji/backend/${post.author_image}` : defaultProfile }
                alt={post.author_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-[#2C3E50] truncate font-poppins">
                  {post.title}
                </h4>
                <span className="text-xs text-[#666] flex-shrink-0 font-delius">
                  {format(new Date(post.created_at), 'MMM dd')}
                </span>
              </div>
              <p className="text-xs text-[#666] mt-1 line-clamp-2 font-poppins">
                {post.content}
              </p>
              <div className="flex items-center gap-4 mt-2 font-delius">
                <div 
                  className="text-xs text-[#7C9885] bg-[#F0F4F1] px-2 py-1 rounded-full"
                >
                  {post.category_name}
                </div>
                <div className="flex items-center gap-3 text-xs text-[#666]">
                  <span className="flex items-center gap-1">
                    <FaComments className="text-[#2C3E50]" />
                    {post.reply_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-[#E57373]" />
                    {post.like_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentForumPosts;