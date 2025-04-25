import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      });
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-500 px-6 py-4">
          <h1 className="text-white text-2xl font-bold">User Profile</h1>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 text-green-600 rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold">
              {userData.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="space-y-4">
            {/* <div className="border-b pb-2">
              <h2 className="text-sm text-gray-500">Full Name</h2>
              <p className="text-lg font-medium">{userData.name}</p>
            </div> */}
            
            <div className="border-b pb-2">
              <h2 className="text-sm text-gray-500">Username</h2>
              <p className="text-lg font-medium">{userData.username}</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 