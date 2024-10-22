import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../config';
import AddAttendance from './AddAttendances';
import Attendances from './Attendances'; 
import EventGallery from './EventGallery';

const Events = () => {
    const route = useRoute(); 
    const { bar_id } = route.params; 
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: es });
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const event_url = `${API_URL}/bars/${bar_id}/events`;
                const response = await axios.get(event_url);
                const data = response.data;

                if (data.events) {
                    setEvents(data.events);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [bar_id]);

    const handleViewImages = (event) => {
        setSelectedEvent(event);
        navigation.navigate('EventGallery', { event }); 
    };

    const handleCheckIn = (event) => {
        console.log("Navigating to AddAttendance with bar_id:", bar_id, "and event_id:", event.id);
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

            {events.length > 0 ? (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.eventName}>{item.name}</Text>
                            <Text><strong>Descripción:</strong> {item.description}</Text>
                            <Text><strong>Fecha:</strong> {formatDate(item.date)}</Text>
                            <Text><strong>Hora Inicio:</strong> {item.start_date}</Text>
                            <Text><strong>Hora Fin:</strong> {item.end_date}</Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleViewImages(item)} // Ver imágenes del evento
                            >
                                <Text style={styles.buttonText}>Ver Imágenes</Text>
                            </TouchableOpacity>

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
                        </View>
                    )}
                />
            ) : (
                <Text>No hay eventos disponibles.</Text>
            )}

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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
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
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#A020F0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Events;
