import React, { useState, useEffect } from 'react';

const AuthModal = ({ isOpen, onClose, initialMode, onSuccess }) => {
    // 1. Explicitly declare all the missing state variables
    const [authMode, setAuthMode] = useState(initialMode || 'login');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    // 2. Sync the modal view if initialMode changes from the Navbar clicks
    useEffect(() => {
        if (isOpen) {
            setAuthMode(initialMode);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    // 3. Handle live input typing
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 4. Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Placeholder for your actual backend API call
        setTimeout(() => {
            setIsLoading(false);
            if (onSuccess) onSuccess();
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative shadow-xl">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 font-bold">X</button>
                
                <div className="flex justify-between mb-4 border-b">
                    <button 
                        className={`pb-2 w-1/2 transition-colors ${authMode === 'login' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`} 
                        onClick={() => setAuthMode('login')}
                    >
                        Login
                    </button>
                    <button 
                        className={`pb-2 w-1/2 transition-colors ${authMode === 'signup' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`} 
                        onClick={() => setAuthMode('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {authMode === 'signup' && (
                        <input 
                            type="text" 
                            name="fullName"
                            placeholder="Full Name" 
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" 
                            required 
                        />
                    )}
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" 
                        required 
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`text-white p-2 rounded mt-2 font-bold transition-colors disabled:bg-gray-400 ${authMode === 'login' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isLoading ? 'Processing...' : (authMode === 'login' ? 'Login to HireQub' : 'Create Account')}
                    </button>
                </form>
                
                <div className="text-center mt-4 text-sm text-gray-600">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        className="text-blue-600 cursor-pointer font-bold hover:underline"
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    >
                        {authMode === 'login' ? 'Sign Up' : 'Log In'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;