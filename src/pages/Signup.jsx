import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authImage from '../assets/auth-img.png';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username?.trim()) newErrors.username = 'Username is required';
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password?.trim()) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password?.trim().length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // /api/auth/signup
      const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/auth/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
    
      if (data.success) {
        const userData = {
          id: data.user.user_id,
          username: data.user.username,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          role: data.user.role,
          profileImage: data.user.profile_picture_url
        };
        
        login(userData);
        const redirectPath = userData.role === 'admin' ? '/admin-dashboard' : '/dashboard';
        navigate(redirectPath);
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: 'Error connecting to server' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block md:w-[40%] bg-gradient-to-b from-pink-200 to-purple-200">
        <img 
          src={authImage} 
          alt="Mama Bloom" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full md:w-[60%] bg-[#212247] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-chonburi text-center mb-8">
            <span className="text-amber-50">Hello </span>
            <span className="text-pink-300">Mama</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 p-3 bg-transparent border border-gray-500 rounded-md text-white focus:outline-none focus:border-pink-300"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full pl-10 p-3 bg-transparent border border-gray-500 rounded-md text-white focus:outline-none focus:border-pink-300"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full pl-10 p-3 bg-transparent border border-gray-500 rounded-md text-white focus:outline-none focus:border-pink-300"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email field */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 p-3 bg-transparent border border-gray-500 rounded-md text-white focus:outline-none focus:border-pink-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password fields */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 p-3 bg-transparent border border-gray-500 rounded-md text-white focus:outline-none focus:border-pink-300"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 p-3 bg-transparent border border-gray-500 rounded-md text-white focus:outline-none focus:border-pink-300"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Profile Image Upload */}
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-gray-400 text-xl" />
                  )}
                </div>
                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 text-amber-50 cursor-pointer">
                <span>
                  {formData.profileImage ? 'Change Picture' : 'Profile Picture (optional)'}
                </span>
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-900/20 rounded-lg">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-300 text-[#212247] py-3 rounded-md hover:bg-pink-400 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : 'Sign Up'}
            </button>

            <p className="text-center text-amber-50">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-pink-300 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup; 