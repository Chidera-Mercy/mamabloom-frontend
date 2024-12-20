import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const NewThread = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: ''
  });

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const link = "/api/forum/get_categories"
        const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/forum/get_categories.php');
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.categories);
          // Set default category if categories exist
          if (data.categories.length > 0) {
            setFormData(prev => ({
              ...prev,
              category_id: data.categories[0].category_id
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user.id;
      const link = "/api/forum/create_thread"
      const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/forum/create_thread.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: user_id
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/community/thread/${data.thread_id}`);
      } else {
        setError(data.message || 'Failed to create discussion');
      }
    } catch (error) {
      setError('An error occurred while creating the discussion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#666] hover:text-[#7C9885] mb-4 font-poppins"
          >
            <FaArrowLeft className="mr-2" />
            Back to Community
          </button>
          <h1 className="text-3xl font-medium text-[#2C3E50] font-poppins">Start a New Discussion</h1>
          <p className="text-[#666] mt-2 font-delius">
            Share your thoughts, questions, or experiences with the community
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#2C3E50] mb-2">
                Category
              </label>
              <select
                id="category"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885] focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#2C3E50] mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What would you like to discuss?"
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885] focus:border-transparent"
                required
                minLength={5}
                maxLength={255}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[#2C3E50] mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Share your thoughts..."
                rows={6}
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885] focus:border-transparent"
                required
                minLength={20}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gradient-to-r from-[#2C3E50] to-[#35587e] text-white rounded-lg 
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#35587e] hover:to-[#2C3E50]'}
                  transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                {isSubmitting ? 'Creating...' : 'Create Discussion'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewThread; 