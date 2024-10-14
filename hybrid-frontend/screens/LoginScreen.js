import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogInScreen = ({ onLogin = () => console.log('test') }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigation = useNavigation(); 

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.94:3000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: formData })
      });

      const data = await response.json();
      console.log('Response data:', data); 

      if (response.ok) {
        const token = data.status.token; 
        if (token) {
          onLogin(token); 
          setSuccessMessage('Login successful!');
          setErrorMessage('');
          Alert.alert('Success', 'Login successful!');
          navigation.navigate('Home'); 
        } else {
          setErrorMessage('Unable to retrieve token. Please try again.');
        }
      } else {
        const errorMsg = data.status?.message || 'An error occurred.';
        setErrorMessage(errorMsg);
        setSuccessMessage('');
        Alert.alert('Error', errorMsg);
      }

    } catch (error) {
      console.error('Fetch error:', error); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => handleChange('email', text)}
        value={formData.email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => handleChange('password', text)}
        value={formData.password}
        secureTextEntry={true}
      />

      <Button title="Log In" onPress={handleSubmit} color="#A020F0" />

      <Text style={styles.signupText} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Times New Roman',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  signupText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default LogInScreen;
