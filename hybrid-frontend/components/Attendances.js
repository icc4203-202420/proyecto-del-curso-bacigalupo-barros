import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

const AddAttendance = () => {
  const [eventId, setEventId] = useState('');

  const handleAddAttendance = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const response = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añade el token al encabezado
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Attendance added successfully!');
      } else {
        Alert.alert('Error', data.status?.message || 'Failed to add attendance.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Event ID"
        value={eventId}
        onChangeText={setEventId}
        style={styles.input}
      />
      <Button title="Add Attendance" onPress={handleAddAttendance} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
});

export default AddAttendance;
