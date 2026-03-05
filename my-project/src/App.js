import React, { useState, useEffect } from 'react';
import Navbar from './components/nav';
import JobFilter from './components/filter';
import JobFeedBody from './components/body';
import AppliedJobs from './components/applied'; 
import ManageBilling from './components/billing';
import CategoryView from './components/CategoryView';
import Contact from './components/Contact';
import AuthModal from './components/authmodal'; // NEW: Imported your AuthModal
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  
  const [currentView, setCurrentView] = useState('feed'); 

  // NEW: State to control the AuthModal globally from App.js
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');

  // NEW: Function to easily pop the modal open from anywhere
  const openAuth = (mode = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.startsWith('/category/')) {
      setCurrentView('category');
    } else if (path === '/applied') {
      setCurrentView('applied');
    } else if (path === '/billing') {
      setCurrentView('billing');
    } else if (path === '/contact') {
      setCurrentView('contact');
    }
  }, []);

  useEffect(() => {
    if (currentView !== 'feed') return; 

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const url = `https://api.hirequb.com/api/jobs?page=${page}&title=${encodeURIComponent(searchTitle)}&location=${encodeURIComponent(searchLocation)}&department=${encodeURIComponent(searchDepartment)}`;
    
    fetch(url, { headers })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Backend Error:', data.error);
          setLoading(false);
          return;
        }

        if (!Array.isArray(data) || data.length === 0) {
          setHasMore(false);
        } else {
          setJobs(prevJobs => page === 1 ? data : [...prevJobs, ...data]);
          if (page === 1) setHasMore(true); 
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, [page, searchTitle, searchLocation, searchDepartment, currentView]);

  const executeSearch = (title, location, department) => {
    setSearchTitle(title);
    setSearchLocation(location);
    setSearchDepartment(department);
    setPage(1); 
  };

  return (
    <div>
      {/* UPDATED: Passed openAuth to Navbar so its login buttons still work */}
      <Navbar onViewChange={setCurrentView} openAuth={openAuth} />
      
      {currentView === 'feed' && (
        <>
          <JobFilter onSearch={executeSearch} />
          <div className="job-feed-container">
            {jobs.map((job) => (
              <JobFeedBody 
                key={job.greenhouse_id} 
                jobId={job.id}
                title={job.title}
                company={job.company_token}
                location={job.location}
                department={job.department}
                url={job.apply_url}
                isPremium={job.is_premium}
                openAuth={openAuth} // NEW: Passed openAuth to the job card
              />
            ))}
          </div>
          
          {loading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading jobs...</p>}
          
          {hasMore && !loading && jobs.length > 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <button 
                onClick={() => setPage(prev => prev + 1)}
                style={{ backgroundColor: '#0284c7', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}
              >
                Load More Jobs
              </button>
            </div>
          )}
          
          {!hasMore && !loading && jobs.length > 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No more jobs to load.</p>
          )}

          {!loading && jobs.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No jobs found matching your search.</p>
          )}
        </>
      )}

      {currentView === 'applied' && <AppliedJobs />}
      {currentView === 'billing' && <ManageBilling />}
      {currentView === 'category' && <CategoryView openAuth={openAuth} />} {/* Passed to CategoryView too in case SEO visitors click apply */}
      {currentView === 'contact' && <Contact />}

      {/* NEW: Global AuthModal controlled by App.js */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
        onSuccess={() => {
            // Optional: Force a refresh to update the UI once they successfully log in
            window.location.reload(); 
        }}
      />
    </div>
  );
}

export default App;