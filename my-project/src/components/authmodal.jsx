import React, { useState, useEffect } from 'react';

const AuthModal = ({ isOpen, onClose, initialMode, onSuccess }) => {
    const [mode, setMode] = useState(initialMode || 'login');

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    // ... rest of your modal form UI goes here

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`https://api.hirequb.com/api/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('freeApplies', data.user.free_applies); // ADD THIS LINE

        if (data.user && data.user.is_premium) {
          localStorage.setItem('isPremium', 'true');
        } else {
          localStorage.removeItem('isPremium');
        }

        onSuccess();
        onClose();
        window.location.reload(); 
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("A network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>×</button>
        
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>
          {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {authMode === 'signup' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" disabled={isLoading} style={submitButtonStyle}>
            {isLoading ? 'Processing...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            style={{ color: '#0ea5e9', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {authMode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '400px',
  position: 'relative',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#64748b'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '16px'
};

const submitButtonStyle = {
  padding: '12px',
  backgroundColor: '#0f172a',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default AuthModal;