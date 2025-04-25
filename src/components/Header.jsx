import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const [profileMenu, setProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user') !== null);
  const displayName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '';
  const [language, setLanguage] = useState('en'); // 'en' for English, 'hi' for Hindi

  const handleProfileClick = () => {
    setProfileMenu(!profileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // In a real app, you would update the UI language here
  };

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-green-600 text-xl">TNSchemes</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={handleProfileClick}
                className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium hover:bg-green-600 transition transform hover:scale-105"
              >
                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
              </button>
              
              {profileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate("/login")}
                className="border-2 border-green-500 text-green-500 px-4 py-1.5 rounded-lg font-medium hover:bg-green-50 transition"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="bg-green-500 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-green-600 transition"
              >
                Sign Up
              </button>
            </div>
          )}
          
        </div>
      </div>
    </header>
  );
}

export default Header; 