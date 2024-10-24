import React from 'react';
import { Button, View } from 'react-native';

const LogOut = ({ onLogout }) => {
  return (
    <View>
      <Button title="Log Out" onPress={onLogout} color="#000000" />
    </View>
  );
};

export default LogOut;
