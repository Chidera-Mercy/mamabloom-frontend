import { FaTrash,} from 'react-icons/fa';
import { fetchApi } from "../../pages/AdminDashboard"
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const UsersPanel = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    useEffect(() => {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, [searchTerm, users]);
  
    const fetchUsers = async () => {
      try {
        const data = await fetchApi('admin/get_users.php');
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    const handleRemoveUser = async (userId) => {
      if (!window.confirm('Are you sure you want to remove this user?')) return;
      
      try {
        await fetchApi('admin/remove_user.php', {
          method: 'POST',
          body: JSON.stringify({ userId })
        });
        
        toast.success('User removed successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error removing user:', error);
      }
    };
  
    return (
      <div>
        <h2 className="font-poppins text-2xl font-bold mb-6 text-[#013f40]">User Management</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#013f40]"
            />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="font-poppins text-sm text-gray-600">
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Joined</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-oldstandard">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.first_name?.[0] || user.username[0]}
                          </div>
                          <span className="ml-2">{user.first_name || user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user.location || 'N/A'}</td>
                      <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
};