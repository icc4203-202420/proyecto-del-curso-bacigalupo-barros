import React from 'react';
import { Button, View, Alert } from 'react-native';
import { deleteItem } from '../Storage';
import { useNavigation } from '@react-navigation/native';

const LogOut = ({ onLogout = () => console.log('Logged out!') }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await deleteItem('authToken');
      onLogout(); 
      Alert.alert('Logged Out', 'You have been logged out successfully!');
      
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View>
      <Button title="Log Out" onPress={handleLogout} color="#000000" />
    </View>
  );
};

export default LogOut;
