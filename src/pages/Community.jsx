import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaRegCommentDots, FaArrowLeft } from 'react-icons/fa';
import communityDecor from '../assets/community-decor.png';
import ThreadsList from '../components/forum/ThreadsList';
import PopularTopics from '../components/forum/PopularTopics';
import CommunityGuidelines from '../components/forum/CommunityGuidelines';
import Header from '../components/layout/Header';

const Community = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 


  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const link = "/api/forum/get_categories"
        const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/forum/get_categories.php');
        const data = await response.json();
        console.log(data);
        
        if (data.success) {
          setCategories([
            { category_id: 'all', name: 'All Discussions' },
            ...data.categories
          ]);
        } else {
          setError('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
     fetchCategories();
  }, []);

  // Add debounce for search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] pt-4">
        {/* Decorative Image */}
        <img
          src={communityDecor}
          alt=""
          className="absolute top-20 right-0 w-40 h-40 object-contain opacity-50"
        />
        <Header />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#2C3E50] hover:text-[#7C9885] transition-colors mt-8 mb-6"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-poppins">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-poppins font-medium text-[#2C3E50]">Community</h1>
              <p className="text-[#666] mt-2 font-delius text-lg">
                Connect, share, and grow with other parents
              </p>
            </div>
            <Link
              to="/community/new-thread"
              className="inline-flex items-center px-6 py-3 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-all duration-300 shadow-sm hover:shadow-md font-poppins"
            >
              <FaPlus className="mr-2" />
              Start Discussion
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pl-12 bg-white bg-opacity-70 backdrop-blur-sm border border-[#E8D8D0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C9885] focus:border-transparent shadow-sm font-poppins"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666]" />
          </div>

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Categories & Guidelines */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-poppins font-medium text-[#2C3E50] mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.category_id}
                      onClick={() => handleCategoryChange(category.category_id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-poppins ${
                        activeCategory === category.category_id
                          ? 'bg-[#7C9885] text-white'
                          : 'text-[#2C3E50] hover:bg-[#F5F9F7]'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Community Guidelines */}
              <CommunityGuidelines />
            </div>

            {/* Middle Column - Threads List */}
            <div className="lg:col-span-2">
              <ThreadsList 
                activeCategory={activeCategory} 
                searchQuery={debouncedSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;