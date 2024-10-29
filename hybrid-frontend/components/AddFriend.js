import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const AddFriend = ({ userId, friendId, onAddFriend, existingFriendships }) => {
  const [barId, setBarId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setBarId('');
    setSelectedEvent(null);
    setError('');
    setShowSuccessPopup(false);
  };

  const handleSubmit = async () => {
    if (!userId || !friendId) {
      setError('User ID and Friend ID are required.');
      return;
    }

    setIsSubmitting(true);
    const storedToken = await AsyncStorage.getItem('authToken');
    const token = storedToken ? storedToken.replace(/"/g, '') : null;

    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión nuevamente.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/users/${userId}/friendships`,
        {
          friendship: {
            friend_id: friendId,
            bar_id: selectedEvent ? selectedEvent.bar_id : null,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onAddFriend(response.data.friendship); // Actualiza la lista de amigos
      setSuccessMessage('¡Amistad agregada con éxito!'); 
      setShowSuccessPopup(true); 
      handleClose();
    } catch (error) {
      console.error('Error adding friend:', error);
      setError('Failed to add friend. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyFriend = existingFriendships?.includes(friendId);

  return (
    <View>
      <TouchableOpacity
        onPress={handleOpen}
        style={{ backgroundColor: '#A020F0', padding: 10, borderRadius: 5 }}
        disabled={isAlreadyFriend}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isAlreadyFriend ? 'Ya son amigos' : 'Add Friend'}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Add a New Friend</Text>
            <Text>Friend ID: {friendId || 'Loading...'}</Text>

            <Text style={{ marginTop: 20, marginBottom: 10 }}>Select Event (Optional)</Text>
            <FlatList
              data={events}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedEvent(item)} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                  <Text style={{ color: selectedEvent === item ? 'blue' : 'black' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button title="Cancel" onPress={handleClose} color="red" />
              <Button
                title={isSubmitting ? '' : 'Submit'}
                onPress={handleSubmit}
                disabled={isSubmitting || isAlreadyFriend} // Deshabilitar si ya son amigos
                color="#A020F0"
              />
              {isSubmitting && <ActivityIndicator size="small" color="#A020F0" />}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessPopup} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold' }}>{successMessage}</Text>
            <TouchableOpacity onPress={() => setShowSuccessPopup(false)} style={{ marginTop: 20, backgroundColor: '#A020F0', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddFriend;
