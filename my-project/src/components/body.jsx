import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const JobFeedBody = ({ jobId, title, company, location, department, url, isPremium }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isPremiumUser = localStorage.getItem('isPremium') === 'true';
  // Parse the free applies count, defaulting to 0 if not logged in
  const freeApplies = parseInt(localStorage.getItem('freeApplies') || '0', 10);

  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY, 
    tx_ref: Date.now().toString(),
    amount: 9.99, 
    currency: 'USD',
    payment_options: 'card', 
    payment_plan: '154986', 
    customer: {
      email: 'user@hirequb.com', 
      name: 'HireQub User',
    },
    customizations: {
      title: 'HireQub Premium',
      description: 'Unlock access to apply for all premium remote jobs',
      logo: 'https://www.hirequb.com/favicon.svg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleApplyClick = async (jobId) => {
    // 1. Check login status instantly before doing anything else
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Please log in to apply for this job.");
        return; // The function stops here, meaning the blank window never opens
    }

    // 2. NOW open the blank window for Safari, since we know they are logged in
    let newWindow = null;
    if (typeof window !== 'undefined') {
        newWindow = window.open('', '_blank');
    }

    try {
        const apiUrl = process.env.REACT_APP_API_URL; 

        const response = await fetch(`${apiUrl}/api/jobs/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jobId: jobId }) 
        });

        const data = await response.json();

        if (response.ok) {
            const currentApplies = parseInt(localStorage.getItem('freeApplies') || '0', 10);
            if (currentApplies > 0 && !isPremiumUser) {
                 localStorage.setItem('freeApplies', (currentApplies - 1).toString());
            }
            
            if (newWindow) {
                newWindow.location.href = url;
            } else {
                window.location.assign(url);
            }
            
        } else if (response.status === 403) {
            if (newWindow) newWindow.close(); 
            setShowPremiumModal(true);
        } else {
            if (newWindow) newWindow.close();
            alert(data.error || "Something went wrong.");
        }
    } catch (error) {
        if (newWindow) newWindow.close();
        console.error("Apply error:", error);
    }
};

  const proceedToPayment = () => {
    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === 'successful') {
          try {
            await fetch('https://api.hirequb.com/api/user/upgrade', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            localStorage.setItem('isPremium', 'true');
            closePaymentModal();
            setShowPremiumModal(false);
            window.open(url, '_blank', 'noopener,noreferrer'); 
          } catch (error) {
            console.error('Upgrade failed', error);
          }
        } else {
          closePaymentModal();
        }
      },
      onClose: () => {},
    });
  };

  const handleMarkApplied = async () => {
    setIsMarking(true);
    try {
      const response = await fetch('https://api.hirequb.com/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });

      if (response.ok) {
        setIsHidden(true); 
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsMarking(false);
    }
  };

  if (isHidden) return null;

  // Determine what text to show on the apply button
  let applyButtonText = 'Apply Now';
  if (isPremium && !isPremiumUser) {
    if (freeApplies > 0) {
      applyButtonText = `Apply`;
    } else {
      applyButtonText = 'Unlock Premium to Apply';
    }
  }

  return (
    <>
      <div style={cardStyle}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <h2 style={{ margin: '0', fontSize: '1.25rem' }}>{title}</h2>
            <span style={badgeStyle}>{department}</span>
          </div>
          
          <div style={{ margin: '15px 0', color: '#475569' }}>
            <p style={{ margin: '5px 0' }}><strong>🏢 Company:</strong> {company}</p>
            <p style={{ margin: '5px 0' }}><strong>📍 Location:</strong> {location}</p>
            {isPremium && !isPremiumUser && (
              <p style={{ margin: '5px 0', color: '#eab308', fontWeight: 'bold' }}>⭐ Premium Listing</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button 
            onClick={() => handleApplyClick(jobId)} 
            style={buttonStyle}
          >
            {applyButtonText}
          </button>
          
          {isLoggedIn && (
            <button 
              onClick={handleMarkApplied} 
              disabled={isMarking}
              style={secondaryButtonStyle}
            >
              {isMarking ? 'Saving...' : 'Mark as Applied'}
            </button>
          )}
        </div>
      </div>

      {showPremiumModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, fontSize: '1.5rem', color: '#0f172a' }}>Upgrade to Premium</h3>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              You've used all 5 of your free applications! Upgrade now to unlock unlimited access to exclusive remote opportunities.
            </p>
            
            <ul style={featureListStyle}>
              <li style={featureItemStyle}>✓ Apply to unlimited premium remote jobs</li>
              <li style={featureItemStyle}>✓ Direct links to company application portals</li>
              <li style={featureItemStyle}>✓ Daily updates with the freshest remote roles</li>
              <li style={featureItemStyle}>✓ Best Spam filtered job board</li>
            </ul>

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
              <button 
                onClick={() => setShowPremiumModal(false)} 
                style={cancelButtonStyle}
              >
                Cancel
              </button>
              <button 
                onClick={proceedToPayment} 
                style={payButtonStyle}
              >
                Upgrade Now - $9.99 / month
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const cardStyle = {
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  padding: '20px',
  backgroundColor: '#fff',
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
  backgroundColor: '#0f172a',
  color: '#ffffff',
  padding: '10px 0',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const secondaryButtonStyle = {
  flex: 1,
  backgroundColor: '#f1f5f9',
  color: '#0f172a',
  border: '1px solid #cbd5e1',
  padding: '10px 0',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
};

const featureListStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: '0 0 20px 0',
  color: '#334155'
};

const featureItemStyle = {
  marginBottom: '10px',
  fontWeight: '500'
};

const cancelButtonStyle = {
  flex: 1,
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '12px 0',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const payButtonStyle = {
  flex: 2,
  backgroundColor: '#0ea5e9',
  color: '#fff',
  border: 'none',
  padding: '12px 0',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default JobFeedBody;