import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', padding: '20px 5%', 
      background: '#0a192f', borderBottom: '2px solid #00ff41', alignItems: 'center' 
    }}>
      <h2 
        onClick={() => navigate('/')} 
        style={{ color: '#00ff41', margin: 0, letterSpacing: '2px', cursor: 'pointer' }}
      >
        CS_SCHOOL
      </h2>
      <div style={{ display: 'flex', gap: '20px', color: '#ccd6f6', fontWeight: 'bold', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Courses</span>
        <span 
          onClick={() => navigate('/login')}
          style={{ 
            border: '1px solid #00ff41', padding: '5px 15px', borderRadius: '5px', 
            color: '#00ff41', cursor: 'pointer' 
          }}
        >
          Terminal Login
        </span>
      </div>
    </nav>
  );
};

export default Navbar;