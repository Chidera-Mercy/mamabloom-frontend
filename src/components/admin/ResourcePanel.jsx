import { 
    FaPlus,
    FaTrash,
    FaStar,
    FaRegStar,
} from 'react-icons/fa';
import { Modal } from './Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { fetchApi } from "../../pages/AdminDashboard"

export const ResourcesPanel = () => {
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
    useEffect(() => {
      fetchResources();
      fetchCategories();
    }, []);
  
    const fetchResources = async () => {
      try {
        const data = await fetchApi('admin/get_resources.php');
        setResources(data.resources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
  
    const fetchCategories = async () => {
      try {
        const data = await fetchApi('admin/get_resource_categories.php');
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    const handleToggleFeatured = async (resourceId, currentStatus) => {
      try {
        const featured = currentStatus == '0' ? 1 : 0;
        await fetchApi('admin/toggle_resource_featured.php', {
          method: 'POST',
          body: JSON.stringify({ 
            resourceId,
            isFeatured: featured
          })
        });
        
        toast.success('Resource updated successfully');
        fetchResources();
      } catch (error) {
        console.error('Error updating resource:', error);
      }
    };
  
    const handleDeleteResource = async (resourceId) => {
      if (!window.confirm('Are you sure you want to delete this resource?')) return;
      
      try {
        await fetchApi('admin/delete_resource.php', {
          method: 'POST',
          body: JSON.stringify({ resourceId })
        });
        
        toast.success('Resource deleted successfully');
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    };
  
    const handleAddCategory = async () => {
      try {
        await fetchApi('admin/add_resource_category.php', {
          method: 'POST',
          body: JSON.stringify(newCategory)
        });
        
        toast.success('Category added successfully');
        setShowNewCategoryModal(false);
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        try {
          await fetchApi('admin/remove_resource_category.php', {
            method: 'POST',
            body: JSON.stringify({ categoryId })
          });
          
          toast.success('Category deleted successfully');
          fetchCategories();
        } catch (error) {
          console.error('Error deleting category:', error);
          toast.error('Failed to delete category');
        }
      };
  
      return (
        <div>
          <h2 className="font-poppins text-2xl font-bold mb-6 text-[#013f40]">Resource Management</h2>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-poppins text-lg font-bold text-[#013f40]">Resource Categories</h3>
                <button
                  onClick={() => setShowNewCategoryModal(true)}
                  className="bg-[#013f40] text-white font-poppins px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-poppins font-medium mb-2">{category.name}</h4>
                        <p className="font-delius text-sm text-gray-600">{category.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 transition-colors ml-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(resource => (
                  <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    {resource.thumbnail && (
                      <div className="h-48 rounded-t-lg bg-gray-200 overflow-hidden">
                        <img 
                          src={`/api/get_image/${resource.thumbnail}`} 
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-poppins font-medium">{resource.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleFeatured(resource.id, resource.is_featured)}
                            className={`transition-colors ${
                              resource.is_featured != '0' ? 'text-yellow-500' : 'text-gray-400'
                            } hover:text-yellow-600`}
                          >
                            {resource.is_featured != '0' ? <FaStar /> : <FaRegStar />}
                          </button>
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-delius ${
                            resource.type === 'article' ? 'bg-blue-100 text-blue-800' :
                            resource.type === 'video' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {resource.type}
                          </span>
                          <span className="text-sm text-gray-600 font-delius">
                            Views: {resource.view_count}
                          </span>
                        </div>
                        {resource.description && (
                          <p className="font-delius text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                        )}
                        {resource.external_url && (
                          <a 
                            href={resource.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-delius text-sm text-blue-600 hover:text-blue-800"
                          >
                            External Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          <Modal
            isOpen={showNewCategoryModal}
            onClose={() => setShowNewCategoryModal(false)}
            title="Add New Resource Category"
          >
            <div className="space-y-4">
              <div>
                <label className="block font-poppins text-sm mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#013f40]"
                />
              </div>
              <div>
                <label className="block font-poppins text-sm mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#013f40]"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewCategoryModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="bg-[#013f40] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                >
                  Add Category
                </button>
              </div>
            </div>
          </Modal>
        </div>
      );
  };
