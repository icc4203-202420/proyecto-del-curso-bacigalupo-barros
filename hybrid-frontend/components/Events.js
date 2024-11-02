import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../config';
import { launchImageLibrary } from 'react-native-image-picker';
import EventSummaryGenerator from './EventSummaryGenerator';

const Events = () => {
    const route = useRoute();
    const { bar_id } = route.params;
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);

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
                    const eventsWithPictures = data.events.map(event => ({
                        ...event,
                        event_pictures: Array.isArray(event.event_pictures) ? event.event_pictures : []
                    }));
                    setEvents(eventsWithPictures);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                Alert.alert('Error', 'No se pudieron cargar los eventos.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [bar_id]);

    const handleImageChange = async (event) => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
        });

        if (result.didCancel) {
            console.log('Usuario canceló la selección de imagen');
            return;
        } else if (result.error) {
            Alert.alert('Error', 'Error al seleccionar la imagen');
            return;
        } else if (result.assets && result.assets.length > 0) {
            const selectedFile = result.assets[0];
            const fileType = selectedFile.type || 'image/jpeg';
            const base64Image = `data:${fileType};base64,${selectedFile.base64}`;
            await handleImageUpload(event.id, base64Image);
        }
    };

    const handleCheckIn = (event) => {
        navigation.navigate('AddAttendance', { bar_id, event_id: event.id });
    };

    const handleViewAttendances = (event) => {
        navigation.navigate('Attendances', { bar_id, event_id: event.id });
    };

    const handleImageUpload = async (eventId, base64Image) => {
        setImageUploading(true);

        try {
            const response = await fetch(`${API_URL}/events/${eventId}/upload_picture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image }),
            });

            const data = await response.json();
            if (response.ok) {
                setEvents((prevEvents) =>
                    prevEvents.map((evt) =>
                        evt.id === eventId ? { ...evt, event_pictures: [...evt.event_pictures, { id: data.id, url: data.url }] } : evt
                    )
                );
            } else {
                Alert.alert('Error', 'No se pudo subir la imagen.');
            }
        } catch (error) {
            Alert.alert('Error', 'Error en la carga de la imagen.');
        } finally {
            setImageUploading(false);
        }
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
                            <Text>Descripción: {item.description}</Text>
                            <Text>Fecha: {formatDate(item.date)}</Text>
                            <Text>Hora Inicio: {item.start_date}</Text>
                            <Text>Hora Fin: {item.end_date}</Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleImageChange(item)}
                            >
                                <Text style={styles.buttonText}>{imageUploading ? 'Subiendo...' : 'Subir Imagen'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleCheckIn(item)}
                            >
                                <Text style={styles.buttonText}>Agregar Asistencia</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleViewAttendances(item)}
                            >
                                <Text style={styles.buttonText}>Ver Asistencias</Text>
                            </TouchableOpacity>

                            <EventSummaryGenerator eventId={item.id} />

                            <View style={styles.imageContainer}>
                                {Array.isArray(item.event_pictures) && item.event_pictures.length > 0 ? (
                                    item.event_pictures.map((picture) => (
                                        <Image 
                                            key={picture.id} 
                                            source={{ uri: picture.url }} 
                                            style={styles.eventImage} 
                                            resizeMode="contain" 
                                            onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
                                        />
                                    ))
                                ) : (
                                    <Text>No hay imágenes disponibles.</Text>
                                )}
                            </View>
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
    },
    imageContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        maxHeight: 200,
        overflow: 'hidden',
    },
    eventImage: {
        width: '100%',
        height: 100,
        marginBottom: 5,
    },
});

export default Events;
