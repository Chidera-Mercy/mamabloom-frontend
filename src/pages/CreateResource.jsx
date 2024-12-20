import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';

const CreateResource = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'article',
    introduction: '',
    paragraphs: [''],
    conclusion: '',
    description: '',
    external_url: '',
    category_id: '',
    is_featured: 0
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const link = "/api/resources/get_categories"
        const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/resources/get_categories.php');
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.categories);
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
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('author_id', user.id);
      formDataToSend.append('is_featured', formData.is_featured);

      // Type-specific content
      if (formData.type === 'article') {
        formDataToSend.append('introduction', formData.introduction);
        formDataToSend.append('paragraphs', JSON.stringify(formData.paragraphs));
        formDataToSend.append('conclusion', formData.conclusion);
      } else {
        formDataToSend.append('description', formData.description);
        formDataToSend.append('external_url', formData.external_url);
      }

      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

      const link = "/api/resources/create_resource"
      const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/resources/create_resource.php', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        navigate('/resources');
      } else {
        setError(data.message || 'Failed to create resource');
      }
    } catch (error) {
      setError('An error occurred while creating the resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 0 : 1) : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F5] to-[#F7E6E3] py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-[#666] mb-4">Please log in to share resources.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gradient-to-r from-[#7C9885] to-[#9DB4A1] text-white rounded-lg"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#666] hover:text-[#7C9885] mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Resources
          </button>
          <h1 className="text-3xl font-serif text-[#2C3E50]">Share a Resource</h1>
        </div>

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
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
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
              <label htmlFor="type" className="block text-sm font-medium text-[#2C3E50] mb-2">
                Resource Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                required
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="podcast">Podcast</option>
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
                className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                required
              />
            </div>

            {formData.type === 'article' ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#2C3E50]">
                  Content
                </label>
                <div className="space-y-4">
                  {/* Introduction section */}
                  <div>
                    <label htmlFor="introduction" className="block text-sm text-[#666] mb-2">
                      Introduction
                    </label>
                    <textarea
                      id="introduction"
                      name="introduction"
                      value={formData.introduction}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                      required
                    />
                  </div>

                  {/* Main content paragraphs */}
                  {formData.paragraphs.map((paragraph, index) => (
                    <div key={index} className="relative">
                      <label className="block text-sm text-[#666] mb-2">
                        Paragraph {index + 1}
                      </label>
                      <textarea
                        value={paragraph}
                        onChange={(e) => {
                          const newParagraphs = [...formData.paragraphs];
                          newParagraphs[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            paragraphs: newParagraphs
                          }));
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                        required
                      />
                      {formData.paragraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newParagraphs = [...formData.paragraphs];
                            newParagraphs.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              paragraphs: newParagraphs
                            }));
                          }}
                          className="absolute -right-6 top-8 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Conclusion section */}
                  <div>
                    <label htmlFor="conclusion" className="block text-sm text-[#666] mb-2">
                      Conclusion
                    </label>
                    <textarea
                      id="conclusion"
                      name="conclusion"
                      value={formData.conclusion}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        paragraphs: [...prev.paragraphs, '']
                      }));
                    }}
                    className="px-4 py-2 text-sm text-[#7C9885] border border-[#7C9885] rounded-lg hover:bg-[#7C9885] hover:text-white transition-colors"
                  >
                    Add Paragraph
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[#2C3E50] mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="external_url" className="block text-sm font-medium text-[#2C3E50] mb-2">
                    {formData.type === 'video' ? 'Video URL' : 'Podcast URL'}
                  </label>
                  <input
                    type="url"
                    id="external_url"
                    name="external_url"
                    value={formData.external_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#E8D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C9885]"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                Thumbnail Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#E8D8D0] rounded-lg">
                <div className="space-y-1 text-center">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Preview" className="mx-auto h-32 w-32 object-cover" />
                  ) : (
                    <FaUpload className="mx-auto h-12 w-12 text-[#666]" />
                  )}
                  <div className="flex text-sm text-[#666]">
                    <label className="relative cursor-pointer rounded-md font-medium text-[#7C9885] hover:text-[#6B8574]">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="thumbnail"
                        onChange={handleThumbnailChange}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 text-[#7C9885] border-[#E8D8D0] rounded focus:ring-[#7C9885]"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-[#2C3E50]">
                Feature this resource
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gradient-to-r from-[#7C9885] to-[#9DB4A1] text-white rounded-lg 
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#6B8574] hover:to-[#8CA390]'}
                  transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                {isSubmitting ? 'Sharing...' : 'Share Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateResource;