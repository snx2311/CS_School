import React from 'react';

const Hero = () => {
  return (
    <div style={{ 
      height: '60vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center',
      padding: '0 20px',
      background: 'radial-gradient(circle, #112240 0%, #0a192f 100%)'
    }}>
      <h1 style={{ fontSize: '3.5rem', color: '#ccd6f6', marginBottom: '10px' }}>
        SECURE THE <span style={{ color: '#00ff41', textShadow: '0 0 10px #00ff41' }}>FUTURE</span>
      </h1>
      <p style={{ color: '#8892b0', fontSize: '1.2rem', maxWidth: '700px' }}>
        Cyber Security, Linux System Administration နဲ့ Real-World Hacking ကို အခြေခံကနေ ကျွမ်းကျင်တဲ့အထိ သင်ကြားပေးမှာပါ။
      </p>
    </div>
  );
};

export default Hero;