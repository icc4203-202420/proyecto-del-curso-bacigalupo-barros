import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    handle: '',
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = () => {
    const { password, password_confirmation } = formData;

    if (password !== password_confirmation) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    Alert.alert('Registro exitoso', 'Usuario registrado correctamente.');
    navigation.navigate('Login');
  };

  return (
    <View>
      <TextInput
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => handleChange('first_name', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => handleChange('last_name', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Confirm Password"
        value={formData.password_confirmation}
        onChangeText={(text) => handleChange('password_confirmation', text)}
        secureTextEntry
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Handle"
        value={formData.handle}
        onChangeText={(text) => handleChange('handle', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
};

export default SignUpScreen;
