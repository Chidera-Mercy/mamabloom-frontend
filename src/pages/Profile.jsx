import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUserCircle,
  FaMapPin, 
  FaUpload, 
  FaSignOutAlt, 
  FaArrowLeft,
  FaCalendar,
  FaMailBulk,
  FaEdit,
  FaTimes,
  FaSave
} from 'react-icons/fa';
import momBaby from '../assets/mom-baby.png';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const link = `/api/users/get_profile?user_id=${user.id}`
        const response = await fetch(`http://169.239.251.102:3341/~anna.kodji/backend/users/get_profile.php?user_id=${user.id}`);
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.profile);
          setFormData({
            first_name: data.profile.first_name || '',
            last_name: data.profile.last_name || '',
            bio: data.profile.bio || '',
            location: data.profile.location || ''
          });
          // `/api/get_image/${data.profile.profile_picture_url}`
          setPreviewUrl(data.profile.profile_picture_url ? 
            `http://169.239.251.102:3341/~anna.kodji/backend/${data.profile.profile_picture_url}` : 
            null
          );
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update the handleSubmit function in your Profile component
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    formDataToSend.append('user_id', user.id);
    if (profilePicture) {
      formDataToSend.append('profile_picture', profilePicture);
    }

    try {
      setLoading(true);
      const link = "/api/users/update_profile"
      const response = await fetch("http://169.239.251.102:3341/~anna.kodji/backend/users/update_profile.php", {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        // Update the AuthContext with the new user data
        const userData = {
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          profileImage: data.user.profile_picture_url
        };
        
        updateUser(userData);
        setIsEditing(false);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center text-gray-700 hover:text-primary transition-colors"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-poppins">Back to Dashboard</span>
        </button>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r  from-blue-300 to-pink-300">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={profile?.username}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center">
                    <FaUserCircle className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <FaUpload className="h-4 w-4 text-primary" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handlePictureChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-medium text-gray-800 font-poppins">
                  {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : profile?.username}
                </h1>
                <div className="mt-2 space-y-2">
                  {profile?.email && (
                    <p className="text-gray-600 flex items-center font-delius">
                      <FaMailBulk className="h-4 w-4 mr-2" />
                      {profile.email}
                    </p>
                  )}
                  {profile?.location && (
                    <p className="text-gray-600 flex items-center font-delius">
                      <FaMapPin className="h-4 w-4 mr-2" />
                      {profile.location}
                    </p>
                  )}
                  <p className="text-gray-600 flex items-center font-delius">
                    <FaCalendar className="h-4 w-4 mr-2" />
                    Joined {new Date(profile?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-poppins"
                >
                  {isEditing ? (
                    <>
                      <FaTimes className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 text-white rounded-lg bg-gradient-to-r  from-blue-300 to-pink-300 hover:from-pink-300 hover:to-blue-300 transition-colors"
                >
                  <FaSave className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="prose max-w-none mt-6 font-poppins">
                {profile?.bio ? (
                  <p className="text-gray-600">{profile.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio provided yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Decorative Images */}
      <img
        src={momBaby}
        alt="Mother and Baby"
        className="fixed bottom-0 right-8 w-80 opacity-20 pointer-events-none"
      />
    </div>
  );
};

export default Profile;