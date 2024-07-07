import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Signup = ({ setJwtToken }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://precious-flower-79d4f83922.strapiapp.com/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      
      if (data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        setJwtToken(data.jwt);
        navigate('/chat'); // Redirect to chat page after successful signup
      }
    } catch (error) {
      setError(error.message); // Set error message state
      console.error('Error signing up:', error);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 6 characters)"
          minLength={6}
          required
        />
        <small className="password-requirement">Minimum 6 characters</small>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <button onClick={handleGoToLogin}>Go to Login</button></p>
    </div>
  );
};

export default Signup;
