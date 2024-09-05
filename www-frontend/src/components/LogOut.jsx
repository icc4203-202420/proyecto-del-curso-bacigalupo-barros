// src/components/Logout.js
import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const LogOut = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.delete('http://127.0.0.1:3001/api/v1/logout', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      localStorage.removeItem('token');
      onLogout();

      alert('Logged out successfully.');
    } catch (error) {
      console.error('Logout Error:', error);
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      LogOut
    </Button>
  );
};

export default LogOut;
