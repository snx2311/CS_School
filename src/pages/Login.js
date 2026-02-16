import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from 'parse';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await Parse.User.logIn(username, password);
      navigate('/dashboard');
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.box} onSubmit={handleLogin}>
        <h2 style={{ color: '#00ff41' }}>SYSTEM ACCESS</h2>
        <input type="text" placeholder="Username" style={styles.input} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Passcode" style={styles.input} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={styles.btn}>LOGIN</button>
        <p style={{ color: '#8892b0', cursor: 'pointer', marginTop: '15px' }} onClick={() => navigate('/register')}>
          New here? Create an account.
        </p>
      </form>
    </div>
  );
};

// Styles အတူတူပဲမို့လို့ Register ထဲကအတိုင်း သုံးထားပါတယ်
const styles = {
  container: { backgroundColor: '#0a192f', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  box: { background: '#112240', padding: '40px', borderRadius: '10px', border: '1px solid #00ff41', textAlign: 'center', width: '350px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', background: '#0a192f', border: '1px solid #233554', color: '#00ff41', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#00ff41', border: 'none', color: '#0a192f', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default Login;