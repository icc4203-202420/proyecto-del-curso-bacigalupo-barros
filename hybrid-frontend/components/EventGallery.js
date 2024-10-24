import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventPicture from './EventPicture';
import { API_URL } from '../config'; 
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker

const EventGallery = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const initialEvent = route.params?.event;

    const [event, setEvent] = useState(initialEvent);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const eventId = initialEvent?.id || route.params?.event?.id;
                if (eventId) {
                    const response = await axios.get(`${API_URL}/events/${eventId}`);
                    setEvent(response.data.event);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudo obtener el evento');
            } finally {
                setLoading(false);
            }
        };

        if (!event) {
            fetchEvent();
        } else {
            setLoading(false);
        }
    }, [event, route.params]);

    const handleImageChange = async () => {
        // Solicitar permiso para acceder a las imágenes
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permiso denegado para acceder a la biblioteca de fotos.');
            return;
        }

        // Abrir el selector de imágenes
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]); // Establecer la imagen seleccionada
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            Alert.alert('Por favor selecciona una imagen antes de subir.');
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            uri: selectedImage.uri,
            name: selectedImage.fileName || 'image.jpg', // Usar el nombre de archivo o un valor por defecto
            type: selectedImage.type || 'image/jpeg', // Usar el tipo de archivo o un valor por defecto
        });

        try {
            const eventId = event?.id;
            if (!eventId) {
                Alert.alert('ID del evento no está disponible.');
                return;
            }

            const token = await AsyncStorage.getItem('authToken'); // Obtener el token de AsyncStorage

            const response = await axios.post(`${API_URL}/events/${eventId}/upload_picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Incluir el token en los headers
                },
            });

            Alert.alert('Imagen subida exitosamente');
            const updatedEventResponse = await axios.get(`${API_URL}/events/${eventId}`);
            setEvent(updatedEventResponse.data.event);
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            Alert.alert(error.response?.data?.message || 'Error al subir la imagen');
        }
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text style={{ color: 'red' }}>{error}</Text>;
    }

    if (!event) {
        return <Text>No se encontró el evento.</Text>;
    }

    return (
        <ScrollView style={{ margin: 10 }}>
            <Text style={{ fontSize: 24, textAlign: 'center', fontFamily: 'Times New Roman' }}>
                {event.name}
            </Text>
            <Text style={{ fontSize: 18, textAlign: 'center', fontFamily: 'Times New Roman' }}>
                Descripción: {event.description}
            </Text>
            <Image source={{ uri: event.flyer_url }} style={{ width: '100%', height: 200, marginVertical: 10 }} />

            <Text style={{ fontSize: 18, textAlign: 'center', fontFamily: 'Times New Roman' }}>
                Imágenes del Evento:
            </Text>

            {event.event_pictures && event.event_pictures.length > 0 ? (
                event.event_pictures.map((picture) => (
                    <EventPicture key={picture.id} imageUrl={picture.url} pictureId={picture.id} />
                ))
            ) : (
                <Text style={{ textAlign: 'center', fontFamily: 'Times New Roman' }}>
                    No hay imágenes disponibles para este evento.
                </Text>
            )}

            <Button title="Seleccionar Imagen" onPress={handleImageChange} />
            <Button title="Subir Imagen" onPress={handleImageUpload} />
            <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', top: 10, left: 10 }}
            />
        </ScrollView>
    );
};

export default EventGallery;
