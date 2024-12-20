import { 
    FaPlus,
    FaTrash,
} from 'react-icons/fa';
import { Modal } from "./Modal"
import { fetchApi } from "../../pages/AdminDashboard"
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const ForumPanel = () => {
    const [categories, setCategories] = useState([]);
    const [threads, setThreads] = useState([]);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
    useEffect(() => {
      fetchCategories();
      fetchThreads();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const data = await fetchApi('admin/get_forum_categories.php');
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    const fetchThreads = async () => {
      try {
        const data = await fetchApi('admin/get_forum_threads.php');
        setThreads(data.threads);
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };
  
    const handleAddCategory = async () => {
      try {
        await fetchApi('admin/add_forum_category.php', {
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
  
    const handleRemoveCategory = async (categoryId) => {
      if (!window.confirm('Are you sure you want to remove this category?')) return;
      
      try {
        await fetchApi('admin/remove_forum_category.php', {
          method: 'POST',
          body: JSON.stringify({ categoryId })
        });
        
        toast.success('Category removed successfully');
        fetchCategories();
      } catch (error) {
        console.error('Error removing category:', error);
      }
    };
  
    const handleRemoveThread = async (threadId) => {
      if (!window.confirm('Are you sure you want to remove this thread?')) return;
      
      try {
        await fetchApi('admin/remove_forum_thread.php', {
          method: 'POST',
          body: JSON.stringify({ threadId })
        });
        
        toast.success('Thread removed successfully');
        fetchThreads();
      } catch (error) {
        console.error('Error removing thread:', error);
      }
    };
  
    return (
        <div>
          <h2 className="font-poppins text-2xl font-bold mb-6 text-[#013f40]">Forum Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-poppins text-lg font-bold text-[#013f40]">Forum Categories</h3>
                <button
                  onClick={() => setShowNewCategoryModal(true)}
                  className="bg-[#013f40] text-white font-poppins px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Category
                </button>
              </div>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="font-poppins font-medium text-[#013f40]">{category.name}</span>
                      <p className="font-delius text-gray-600 mt-1">{category.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveCategory(category.id)}
                      className="text-red-600 hover:text-red-800 transition-colors ml-4"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Recent Threads</h3>
              <div className="space-y-4">
                {threads.map(thread => (
                  <div key={thread.id} className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <p className="font-poppins font-medium text-[#013f40] mb-2">{thread.title}</p>
                          <div className="font-delius text-sm text-gray-600 space-y-1">
                            <p>Posted in: <span className="text-[#013f40]">{thread.category_name}</span></p>
                            <p>Author: <span className="text-[#013f40]">{thread.username}</span></p>
                            <p>{new Date(thread.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveThread(thread.id)}
                          className="text-red-600 hover:text-red-800 transition-colors ml-4"
                        >
                          <FaTrash />
                        </button>
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
            title="Add New Category"
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
  