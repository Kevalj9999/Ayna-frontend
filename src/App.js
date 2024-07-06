import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwt'));

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Remove JWT from local storage
    setJwtToken(null); // Set JWT token to null in state
  };

  // Check for JWT token in local storage on mount
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setJwtToken(token);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={!jwtToken ? <Login setJwtToken={setJwtToken} className="centered-form" /> : <Navigate to="/chat" />}
        />
        <Route
          path="/signup"
          element={!jwtToken ? <Signup setJwtToken={setJwtToken} className="centered-form" /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={jwtToken ? <Chat jwtToken={jwtToken} logout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={!jwtToken ? <Navigate to="/login" /> : <Navigate to="/chat" />}
        />
      </Routes>
    </div>
  );
}

export default App;
