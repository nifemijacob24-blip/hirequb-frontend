import React, { useState } from 'react';

const ManageBilling = () => {
  const isPremiumUser = localStorage.getItem('isPremium') === 'true';
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your Premium access?")) return;
    
    setIsCancelling(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://api.hirequb.com/api/user/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('isPremium');
        window.location.reload();
      } else {
        alert("Failed to cancel subscription. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("An error occurred while cancelling.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#0f172a' }}>Account & Billing</h2>
      
      <div style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '24px', 
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#334155' }}>Current Plan</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              {isPremiumUser ? 'Premium Remote Access' : 'Free Basic Access'}
            </p>
          </div>
          <span style={{ 
            backgroundColor: isPremiumUser ? '#dcfce7' : '#f1f5f9', 
            color: isPremiumUser ? '#166534' : '#475569', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            {isPremiumUser ? 'Active' : 'Free'}
          </span>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#334155' }}>Plan Details</h3>
          {isPremiumUser ? (
            <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>
              You are currently subscribed to the monthly premium plan. You have unrestricted access to apply for all premium remote jobs and direct company links.
            </p>
          ) : (
            <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>
              You are currently on the free plan. Upgrade to Premium from any locked job listing on the feed to unlock unlimited applications to exclusive remote roles.
            </p>
          )}
        </div>

        {isPremiumUser && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleCancel}
              disabled={isCancelling}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: isCancelling ? 'not-allowed' : 'pointer',
                opacity: isCancelling ? 0.7 : 1
              }}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBilling;