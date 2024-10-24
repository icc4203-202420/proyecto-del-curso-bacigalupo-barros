import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { API_URL } from '../config';

const Attendances = () => {
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState('');
    const route = useRoute();
    const { bar_id, event_id } = route.params; 

    useEffect(() => {
        const fetchAttendances = async () => {
            const storedToken = await AsyncStorage.getItem('authToken');
            const token = storedToken ? storedToken.replace(/"/g, '') : null; 

            if (!token) {
                setError('No estás autenticado. Por favor, inicia sesión nuevamente.');
                return;
            }

            try {
                const response = await axios.get(
                    `${API_URL}/bars/${bar_id}/events/${event_id}/attendances`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` 
                        }
                    }
                );

                if (Array.isArray(response.data)) {
                    setAttendances(response.data);
                }
            } catch (error) {
                console.error("Error fetching attendances:", error);
                setError('No se pudieron cargar las asistencias. Intenta nuevamente.');
            }
        };

        if (event_id) {
            fetchAttendances();
        }
    }, [bar_id, event_id]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Asistencias para el Evento</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            {attendances.length > 0 ? (
                <FlatList
                    data={attendances}
                    keyExtractor={(item) => item.user_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.attendeeName}>{item.first_name} {item.last_name}</Text>
                            <Text style={styles.attendeeHandle}>Handle: @{item.handle}</Text>
                            <Text>Checked In: {item.checked_in ? 'Sí' : 'No'}</Text>
                        </View>
                    )}
                />
            ) : (
                <ActivityIndicator size="large" color="#A020F0" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    card: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    attendeeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    attendeeHandle: {
        fontSize: 16,
        color: '#555',
    },
});

export default Attendances;
