// Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setJwtToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Remove JWT from local storage
    setJwtToken(null); // Set JWT token to null in state
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
