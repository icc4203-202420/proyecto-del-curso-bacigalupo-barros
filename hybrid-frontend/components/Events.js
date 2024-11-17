import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../config';
import { getItem } from '../Storage';
import UploadImage from './UploadImage';
import ViewEventPictures from './ViewEventPictures';

const Events = () => {
    const route = useRoute();
    const { bar_id } = route.params;
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [description, setDescription] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: es });
    };

    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, [bar_id]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_URL}/bars/${bar_id}/events`);
            if (response.data.events) {
                setEvents(response.data.events);
            } else {
                Alert.alert('No hay eventos', 'No se encontraron eventos para este bar.');
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            Alert.alert('Error', 'No se pudieron cargar los eventos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
            Alert.alert('Error', 'No se pudieron cargar los usuarios.');
        }
    };

    const handleUserSelection = (user) => {
        setSelectedUsers(prev => 
            prev.includes(user) ? 
            prev.filter(u => u !== user) : 
            [...prev, user]
        );
    };

    const handleConfirmSelection = async () => {
        // You can perform any necessary actions after confirming user selection
        setSelectedUsers([]);
        setDescription('');
    };

    const handleCheckIn = (event) => {
        navigation.navigate('AddAttendance', { bar_id, event_id: event.id });
    };

    const handleViewAttendances = (event) => {
        navigation.navigate('Attendances', { bar_id, event_id: event.id });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A020F0" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eventos del Bar</Text>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.eventName}>{item.name}</Text>
                        <Text>Descripción: {item.description}</Text>
                        <Text>Fecha: {formatDate(item.date)}</Text>
                        <Text>Hora Inicio: {item.start_date}</Text>
                        <Text>Hora Fin: {item.end_date}</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleCheckIn(item)} // Agregar asistencia
                        >
                            <Text style={styles.buttonText}>Agregar Asistencia</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleViewAttendances(item)} // Ver asistencias
                        >
                            <Text style={styles.buttonText}>Ver Asistencias</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('UploadImage', { event_id: item.id })} 
                        >
                            <Text style={styles.buttonText}>Galería de Imágenes y Subidas</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Button
                title="Volver a Bares"
                color="#A020F0"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#A020F0',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInput: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    userItem: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedUser: {
        backgroundColor: '#D3D3D3',
    },
    descriptionInput: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Events;
