import React, { useState, useEffect } from 'react';
import { Button, Dialog, TextInput, ActivityIndicator, Alert, FlatList, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; 

const TagUsers = ({ eventPictureId, onTagUser }) => {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/users`);
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        if (!selectedUser) {
            Alert.alert('Por favor selecciona un usuario para etiquetar.');
            return;
        }

        if (!eventPictureId) {
            Alert.alert('No se ha seleccionado ninguna imagen del evento.');
            return;
        }

        setIsSubmitting(true);
        const token = await AsyncStorage.getItem('authToken'); // Obtener el token de AsyncStorage

        try {
            const response = await axios.post(
                `${API_URL}/event_pictures/${eventPictureId}/tag_user`,
                {
                    user_id: selectedUser.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el token en los headers
                    },
                }
            );

            onTagUser(response.data.photo_tag);
            setOpen(false);
        } catch (error) {
            console.error('Error tagging user:', error);
            Alert.alert('Error al etiquetar usuario. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user => user.handle.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <Button title="Tag User" onPress={() => setOpen(true)} />
            <Dialog visible={open} onDismiss={() => setOpen(false)}>
                <TextInput
                    placeholder="Selecciona Usuario"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <FlatList
                    data={filteredUsers}
                    keyExtractor={user => user.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedUser(item)}>
                            <Text>{item.handle}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Button
                    title={isSubmitting ? "Cargando..." : "Etiquetar Usuario"}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                />
            </Dialog>
        </>
    );
};

export default TagUsers;
