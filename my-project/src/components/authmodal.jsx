import React, { useState, useEffect } from 'react';

const AuthModal = ({ isOpen, onClose, initialMode, onSuccess }) => {
    const [authMode, setAuthMode] = useState(initialMode || 'login');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        fullName: '', // Note: Your backend doesn't save this yet, but we keep it for the UI
        email: '',
        password: ''
    });

    // Automatically use your live backend URL on Vercel, or localhost when testing locally
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (isOpen) {
            setAuthMode(initialMode);
            setErrorMsg(''); // Clear errors when modal opens
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        
        const endpoint = authMode === 'login' ? '/api/login' : '/api/signup';
        
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Real backend connection successful! Save the real JWT token.
            localStorage.setItem('token', data.token);
            
            // Optional: Save user data to show their email/status in the navbar later
            localStorage.setItem('user', JSON.stringify(data.user)); 

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative shadow-xl">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 font-bold">X</button>
                
                <div className="flex justify-between mb-4 border-b">
                    <button 
                        className={`pb-2 w-1/2 transition-colors ${authMode === 'login' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`} 
                        onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    >
                        Login
                    </button>
                    <button 
                        className={`pb-2 w-1/2 transition-colors ${authMode === 'signup' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`} 
                        onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                {errorMsg && (
                    <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded text-center">
                        {errorMsg}
                    </div>
                )}

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
                        onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setErrorMsg(''); }}
                    >
                        {authMode === 'login' ? 'Sign Up' : 'Log In'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;