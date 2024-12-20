import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaComments, FaSpinner, FaRegCommentDots } from 'react-icons/fa';

const PopularTopics = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const link = "/api/forum/get_popular_categories"
        const response = await fetch(
          'http://169.239.251.102:3341/~anna.kodji/backend/forum/get_popular_categories.php'
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg animate-pulse">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-100 rounded"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-4">
          <FaRegCommentDots className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Unable to load popular topics</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-4">
          <FaRegCommentDots className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No active discussions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-[#2C3E50]">
          Popular Topics
        </h3>
        <FaComments className="text-[#7C9885]" />
      </div>
      <div className="space-y-4">
        {categories.map((category) => (
          <Link
            key={category.category_id}
            to={`/community?category=${category.category_id}`}
            className="block p-3 border border-[#E8D8D0] rounded-lg hover:border-[#7C9885] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-[#2C3E50] group-hover:text-[#7C9885] transition-colors font-medium">
                  {category.name}
                </h4>
                <p className="text-sm text-[#666] mt-1">
                  {category.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#666]">
                  <span>{category.thread_count} discussions</span>
                  <span>{category.total_replies} replies</span>
                </div>
              </div>
              <div className="mt-1">
                <FaChevronRight className="text-[#7C9885] opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTopics; 