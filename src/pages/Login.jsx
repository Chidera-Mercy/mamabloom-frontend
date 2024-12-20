import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authImage from '../assets/auth-img.png';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.password?.trim()) newErrors.password = 'Password is required';
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
      const link = "/api/auth/login"
      const response = await fetch('http://169.239.251.102:3341/~anna.kodji/backend/auth/login.php', {
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
        navigate("/dashboard");
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
            <span className="text-amber-50">Welcome back </span>
            <span className="text-pink-300">Mama</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              {isLoading ? 'Please wait...' : 'Login'}
            </button>

            <p className="text-center text-amber-50">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-pink-300 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 