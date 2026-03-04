import React, { useState, useEffect } from 'react';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view applied jobs.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.hirequb.com/api/jobs/applied', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch applied jobs');
        
        const data = await response.json();
        setAppliedJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading your applications...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '40px', color: 'red' }}>{error}</p>;
  if (appliedJobs.length === 0) return <p style={{ textAlign: 'center', marginTop: '40px' }}>You haven't applied to any jobs yet!</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>
        Your Applications
      </h1>
      
      <div className="job-feed-container">
        {appliedJobs.map((job) => (
          <div key={job.id} style={cardStyle}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h2 style={{ margin: '0', fontSize: '1.25rem' }}>{job.title}</h2>
                <span style={badgeStyle}>{job.department}</span>
              </div>
              
              <div style={{ margin: '15px 0', color: '#475569' }}>
                <p style={{ margin: '5px 0' }}><strong>🏢 Company:</strong> {job.company_token}</p>
                <p style={{ margin: '5px 0' }}><strong>📍 Location:</strong> {job.location}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#16a34a' }}>
                  ✓ Applied on {new Date(job.applied_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <a href={job.apply_url} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
                Review Listing
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between' 
};

const badgeStyle = {
  backgroundColor: '#e0f2fe',
  color: '#0284c7',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  whiteSpace: 'nowrap'
};

const buttonStyle = {
  flex: 1,
  textAlign: 'center',
  backgroundColor: '#e2e8f0',
  color: '#0f172a',
  padding: '10px 0',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold'
};

export default AppliedJobs;