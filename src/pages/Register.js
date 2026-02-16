import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from 'parse';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
      await user.signUp();
      alert("Registration Successful! Now you can Login.");
      navigate('/login'); // Register ပြီးရင် Login ကို လွှတ်မယ်
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.box} onSubmit={handleRegister}>
        <h2 style={{ color: '#00ff41' }}>CREATE AN ACCOUNT</h2>
        <input type="text" placeholder="Username" style={styles.input} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" style={styles.input} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Passcode" style={styles.input} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={styles.btn}>SIGN UP</button>
        <p style={{ color: '#8892b0', cursor: 'pointer', marginTop: '15px' }} onClick={() => navigate('/login')}>
          Already have an account? Login here.
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0a192f', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  box: { background: '#112240', padding: '40px', borderRadius: '10px', border: '1px solid #00ff41', textAlign: 'center', width: '350px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', background: '#0a192f', border: '1px solid #233554', color: '#00ff41', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#00ff41', border: 'none', color: '#0a192f', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default Register;