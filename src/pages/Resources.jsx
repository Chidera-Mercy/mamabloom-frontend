import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/layout/Header';
import { ResourceCard, FeaturedResourceCard } from '../components/resources/ResourceCard';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredResources, setFeaturedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const link = "/api/resources/get_categories"
        const catResponse = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/resources/get_categories.php');
        const catData = await catResponse.json();
        if (catData.success) {
          setCategories([{ category_id: 'all', name: 'All Categories' }, ...catData.categories]);
        }

        // Fetch all resources for featured section
        const link2 = "/api/resources/get_resources"
        const allResourcesResponse = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/resources/get_resources.php');
        const allResourcesData = await allResourcesResponse.json();
        if (allResourcesData.success) {
          setFeaturedResources(allResourcesData.resources.filter(r => r.is_featured));
        }

        // Fetch filtered resources
        const link3 = "/api/resources/get_resources"
        const resourcesUrl = new URL('http://169.239.251.102:3341/~anna.kodji/backend/resources/get_resources.php');
        if (activeCategory !== 'all') {
          resourcesUrl.searchParams.append('category', activeCategory);
        }
        if (searchQuery) {
          resourcesUrl.searchParams.append('search', searchQuery);
        }

        const resResponse = await fetch(resourcesUrl);
        const resData = await resResponse.json();
        if (resData.success) {
          setResources(resData.resources);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const NoResourcesPlaceholder = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-white bg-opacity-70 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-poppins text-[#2C3E50] mb-2">No Resources Found</h3>
        <p className="text-[#666] font-delius mb-4">
          {searchQuery 
            ? "No resources match your search criteria"
            : "No resources available in this category yet"}
        </p>
        <Link
          to="/resources/create"
          className="inline-flex items-center px-6 py-3 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-all duration-300 shadow-sm hover:shadow-md font-poppins"
        >
          <FaPlus className="mr-2" />
          Share First Resource
        </Link>
      </div>
    </div>
  );

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF]">
        <Header /> 
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-poppins font-medium text-[#2C3E50]">Parenting Resources</h1>
              <p className="text-[#666] mt-2 font-delius text-lg">
                Discover helpful guides and tips for your parenting journey
              </p>
            </div>
            <Link
              to="/resources/create"
              className="inline-flex items-center px-6 py-3 bg-[#7C9885] text-white rounded-lg hover:bg-[#6B8574] transition-all duration-300 shadow-sm hover:shadow-md font-poppins"
            >
              <FaPlus className="mr-2" />
              Share Resource
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pl-12 bg-white bg-opacity-70 backdrop-blur-sm border border-[#E8D8D0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C9885] focus:border-transparent shadow-sm font-poppins"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666]" />
          </div>
        </div>

        {/* Featured Resources - Always visible */}
        {featuredResources.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl text-[#2C3E50] mb-6 font-poppins font-medium">Featured Resources</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredResources.slice(0, 2).map(resource => (
                <FeaturedResourceCard key={resource.resource_id} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <button
                key={category.category_id}
                onClick={() => handleCategoryChange(category.category_id)}
                className={`p-4 rounded-lg text-center transition-all duration-200 shadow-sm hover:shadow-md font-poppins ${
                  activeCategory === category.category_id
                    ? 'bg-[#7C9885] text-white'
                    : 'bg-white hover:bg-[#FDF8F5] text-[#2C3E50]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.length > 0 ? (
                resources.map(resource => (
                  <ResourceCard key={resource.resource_id} resource={resource} />
                ))
              ) : (
                <NoResourcesPlaceholder />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resources;