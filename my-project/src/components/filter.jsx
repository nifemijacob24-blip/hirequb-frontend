import React, { useState } from 'react';

const JobFilter = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    // Pass empty string for department to prevent the API crash
    onSearch(title, location, '');
  };

  return (
    <form onSubmit={handleSubmit} style={filterContainerStyle}>
      <input 
        type="text" 
        placeholder="Job Title, Keywords, or Company" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <input 
        type="text" 
        placeholder="e.g. Worldwide, US Only, EMEA" 
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" style={searchButtonStyle}>
        Find Jobs
      </button>
    </form>
  );
};

const filterContainerStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  flexWrap: 'wrap' 
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  flex: '1',
  minWidth: '200px',
  fontSize: '16px'
};

const searchButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#0f172a',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '16px'
};

export default JobFilter;