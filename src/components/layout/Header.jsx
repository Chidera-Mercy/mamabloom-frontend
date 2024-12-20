import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBaby, FaUsers, FaBook } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import defaultProfile from '../../assets/default-profile.png';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  {console.log(user.profileImage)}
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white bg-opacity-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src={logo} 
              alt="MamaBloom Logo" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 rounded-md font-medium text-white bg-[#013f40] hover:bg-blue-950 transition-all duration-300 transform hover:scale-105 font-poppins"
              >
                Admin Dashboard
              </button>
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 group"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-[#2C3E50] group-hover:text-[#7C9885] transition-colors font-poppins">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[#666] font-delius">
                    {user?.username}
                  </p>
                </div>
                <img
                  // `/api/get_image/${user.profileImage}`
                  src={user.profileImage ? `/api/get_image/${user.profileImage}` : defaultProfile}
                  alt={user?.username || 'Profile'}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-[#7C9885] transition-transform group-hover:scale-105"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="md:hidden px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-[#2C3E50]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-[#666]">
                      {user?.username}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-[#F8F9FA] transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
