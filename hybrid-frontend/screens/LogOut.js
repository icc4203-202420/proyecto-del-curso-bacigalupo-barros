import React from 'react';
import { Button, View } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Importa SecureStore

const LogOut = ({ onLogout }) => {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authToken'); // Elimina el token de SecureStore
    onLogout(); // Llama a la función onLogout pasada como props
  };

  return (
    <View>
      <Button title="Log Out" onPress={handleLogout} color="#000000" />
    </View>
  );
};

export default LogOut;
