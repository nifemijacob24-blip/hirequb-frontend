import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:support@hirequb.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>Contact Us</h1>
        <p style={{ color: '#475569', marginTop: '10px', fontSize: '1.1rem' }}>
          Have a question or need support? Drop us a message and we'll get back to you.
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#334155' }}>Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', outline: 'none' }}
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#334155' }}>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', outline: 'none' }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#334155' }}>Message</label>
            <textarea 
              required 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', minHeight: '150px', outline: 'none' }}
              placeholder="How can we help you?"
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: '#0ea5e9', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;