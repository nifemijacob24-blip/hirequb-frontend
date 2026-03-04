import React, { useState, useEffect } from 'react';
import AuthModal from './authmodal'; 

function Navbar({ onViewChange }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    onViewChange('feed'); 
    window.location.reload(); 
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false); 
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleNavClick = (view) => {
    onViewChange(view);
    setIsMobileMenuOpen(false); 
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex-shrink-0 flex items-center">
              <span 
                onClick={() => handleNavClick('feed')}
                className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                HireQub
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavClick('feed')}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
              >
                Find Jobs
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
              >
                Contact Us
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => handleNavClick('applied')}
                    className="hidden md:block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
                  >
                    Applied Jobs
                  </button>
                  <button 
                    onClick={() => handleNavClick('billing')}
                    className="hidden md:block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
                  >
                    Billing
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => openAuth('login')}
                    className="hidden md:block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => openAuth('signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
                  >
                    Sign Up
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center text-slate-600 dark:text-slate-300 ml-2"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => handleNavClick('feed')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Find Jobs
            </button>
            
            <button 
              onClick={() => handleNavClick('contact')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Us
            </button>
            
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => handleNavClick('applied')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Applied Jobs
                </button>
                <button 
                  onClick={() => handleNavClick('billing')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Billing
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => openAuth('login')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Log In
                </button>
                <button 
                  onClick={() => openAuth('signup')}
                  className="block w-full text-left px-3 py-2 mt-1 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Navbar;