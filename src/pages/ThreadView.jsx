import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaArrowLeft, FaUserCircle, FaComments, FaHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import defaultProfile from '../assets/default-profile.png';
import Header from '../components/layout/Header';
const ThreadView = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        // `/api/forum/get_thread?thread_id=${threadId}&user_id=${user?.id || 0}`
        const response = await fetch(
          `/api/forum/get_thread?thread_id=${threadId}&user_id=${user?.id || 0}`
        );
        const data = await response.json();

        if (data.success) {
          setThread(data.thread);
          setReplies(data.replies || []);
          setIsLiked(data.thread.is_liked === 1);
          setLikesCount(data.thread.likes_count);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching thread');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [threadId, user?.id]);

  const handleReply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const link = "/api/forum/create_reply"
      const response = await fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          user_id: user.id,
          content: replyContent
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyContent('');
        // Refresh replies
        const link2 = `/api/forum/get_thread?thread_id=${threadId}`
        const updatedThread = await fetch(link2);
        const updatedData = await updatedThread.json();
        if (updatedData.success) {
          setReplies(updatedData.replies || []);
        }
      } else {
        setSubmitError(data.message || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      setSubmitError('Error posting reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return; // Don't allow if not logged in

    try {
      const link = "/api/forum/toggle_like"
      const response = await fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          user_id: user.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLiked(data.action === 'liked');
        setLikesCount(data.likes_count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !thread) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'Thread not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] py-8">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/community")}
          className="flex items-center text-[#666] hover:text-[#7C9885] mb-6 font-poppins"
        >
          <FaArrowLeft className="mr-2" />
          Back to Community
        </button>

        {/* Thread */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex space-x-4">
            {/* Author Profile Picture */}
            <div className="flex-shrink-0">
              {thread.profile_picture ? (
                <img
                  // `/api/get_image/${thread.profile_picture}` 
                  src={thread.profile_picture ? `/api/get_image/${thread.profile_picture}` : defaultProfile}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Thread Content */}
            <div className="flex-grow">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-medium text-[#2C3E50] font-poppins">
                  {thread.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-[#666]">
                    <FaComments className="text-[#2C3E50]" />
                    <span className="text-sm font-delius">{replies.length}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#666]">
                    <button 
                      onClick={handleLikeToggle}
                      className={`transition-colors ${!user ? 'cursor-not-allowed opacity-50' : 'hover:text-pink-500'}`}
                      disabled={!user}
                    >
                      <FaHeart className={isLiked ? 'text-pink-500' : 'text-[#E57373]'} />
                    </button>
                    <span className="text-sm font-delius">{likesCount}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-[#666] mb-4">
                <span className="font-poppins">Posted by {thread.username}</span>
                <span className="mx-2">•</span>
                <span className="font-delius">{format(new Date(thread.created_at), 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <span className="text-[#7C9885] font-poppins">{thread.category_name}</span>
              </div>
              <div className="prose max-w-none font-poppins">
                {thread.content}
              </div>
            </div>
          </div>
        </div>

        {/* Leave a Reply Section */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-[#2C3E50] mb-4 font-poppins">
              Leave a Reply
            </h3>
            <form onSubmit={handleReply}>
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {submitError}
                </div>
              )}
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885] focus:border-transparent font-poppins"
                rows={4}
                required
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-gradient-to-r from-blue-300 to-pink-300 text-white rounded-lg 
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-300 hover:to-blue-300'}
                    transition-all duration-300 shadow-md hover:shadow-lg font-poppins`}
                >
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Replies Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-[#2C3E50] font-poppins">
            Replies ({replies.length})
          </h2>
          {replies.map((reply) => (
            <div key={reply.reply_id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex space-x-4">
                {/* Reply Author Profile Picture */}
                <div className="flex-shrink-0">
                  {reply.profile_picture ? (
                    <img
                      // `/api/get_image/${reply.profile_picture}`
                      src={reply.profile_picture ? `/api/get_image/${reply.profile_picture}` : defaultProfile}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                {/* Reply Content */}
                <div className="flex-grow">
                  <div className="text-sm text-[#666] mb-2">
                    <span className="font-medium font-poppins">{reply.username}</span>
                    <span className="mx-2">•</span>
                    <span className="font-delius">{format(new Date(reply.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="prose max-w-none font-poppins">
                    {reply.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadView; 
