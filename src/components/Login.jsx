import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Form.css';

const Login = ({ setJwtToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    fetch('https://precious-flower-79d4f83922.strapiapp.com/api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: username, password: password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Incorrect username or password');
        }
        return response.json();
      })
      .then(data => {
        if (data.jwt) {
          localStorage.setItem('jwt', data.jwt);
          setJwtToken(data.jwt);
        }
      })
      .catch(error => {
        setError(error.message); // Set error message state
        console.error('Error:', error);
      });
  };

  return (
    <div className="form-container">
      <h2>Welcome to Chat Room</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
};

export default Login;
