import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    handle: '',
    address_attributes: {
      line1: '',  
      line2: '',
      city: '',
      country_id: '' 
    } 
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      address_attributes: {
        ...prevData.address_attributes,
        [name]: value
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3001/api/v1/signup', { user: formData });
      setSuccessMessage(response.data.status.message);
      setErrorMessage('');
      console.log('Full Response:', response);
    } catch (error) {
      setErrorMessage(error.response?.data?.status?.message || 'An error occurred.');
      setSuccessMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" sx={{ 
                    marginBottom: 3, 
                    color: '#000000',
                    textAlign: 'center', 
                    fontFamily: 'Times New Roman, serif'
                }}>
        Sign Up
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <TextField
        label="First Name"
        name="first_name"
        variant="outlined"
        onChange={handleChange}
        required
      />
      <TextField
        label="Last Name"
        name="last_name"
        variant="outlined"
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        onChange={handleChange}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        variant="outlined"
        onChange={handleChange}
        required
      />
      <TextField
        label="Confirm Password"
        name="password_confirmation"
        type="password"
        variant="outlined"
        onChange={handleChange}
        required
      />
      <TextField
        label="Handle"
        name="handle"
        variant="outlined"
        onChange={handleChange}
        required
      />

      <TextField
        label="Address Line 1"
        name="line1"
        variant="outlined"
        onChange={handleAddressChange}
      />
      <TextField
        label="Address Line 2"
        name="line2"
        variant="outlined"
        onChange={handleAddressChange}
      />
      <TextField
        label="City"
        name="city"
        variant="outlined"
        onChange={handleAddressChange}
      />
      <TextField
        label="Country ID (optional)"
        name="country_id"
        variant="outlined"
        type="number"  // Puedes cambiar el tipo si es necesario
        onChange={handleChange}
        placeholder="Enter Country ID (if applicable)"
        />
      <Button type="submit" variant="contained" color="primary" size="large">
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUp;
