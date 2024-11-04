import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../config';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import EventSummaryGenerator from './EventSummaryGenerator';

const Events = () => {
    const route = useRoute();
    const { bar_id } = route.params;
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

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
                } else {
                    Alert.alert('No hay eventos', 'No se encontraron eventos para este bar.');
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                Alert.alert('Error', 'No se pudieron cargar los eventos. Por favor, inténtalo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const users_url = `${API_URL}/users`; // Cambia esto por la URL real para obtener usuarios
                const response = await axios.get(users_url);
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
                Alert.alert('Error', 'No se pudieron cargar los usuarios. Por favor, inténtalo más tarde.');
            }
        };

        fetchEvents();
        fetchUsers();
    }, [bar_id]);

    const handleImageChange = async (event) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
            Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar una imagen.');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const selectedFile = result.assets[0];
            const fileType = selectedFile.type || 'image/jpeg';
            const base64Image = `data:${fileType};base64,${selectedFile.base64}`;
            setSelectedImage({ eventId: event.id, base64Image });
            setModalVisible(true);
        } else {
            console.log('Usuario canceló la selección de imagen');
        }
    };
    

    const handleUserSelection = (user) => {
        // Alternar la selección del usuario
        if (selectedUsers.includes(user)) {
            setSelectedUsers(prev => prev.filter(u => u !== user)); // Desmarcar si ya está seleccionado
        } else {
            setSelectedUsers(prev => [...prev, user]); // Marcar como seleccionado
        }
    };

    const handleConfirmSelection = () => {
        console.log('Usuarios seleccionados:', selectedUsers);
        if (selectedImage) {
            selectedUsers.forEach(user => {
                handleImageUpload(selectedImage.eventId, selectedImage.base64Image, user);
            });
        }
        setModalVisible(false); // Cierra el modal
        setSelectedUsers([]); // Limpiar selección
    };

    const handleCheckIn = (event) => {
        navigation.navigate('AddAttendance', { bar_id, event_id: event.id });
    };

    const handleViewAttendances = (event) => {
        navigation.navigate('Attendances', { bar_id, event_id: event.id });
    };

    const handleImageUpload = async (eventId, base64Image, user) => {
        setImageUploading(true);
        try {
            const response = await fetch(`${API_URL}/events/${eventId}/upload_picture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image, userId: user.id }),
            });

            const data = await response.json();
            const LOCAL_URL = `http://10.33.0.108:3000/`;
            if (response.ok) {
                const imageUrl = data.url.startsWith('http') ? data.url : `${LOCAL_URL}${data.url}`;
                setEvents((prevEvents) =>
                    prevEvents.map((evt) =>
                        evt.id === eventId ? {
                            ...evt,
                            event_pictures: [...evt.event_pictures, { id: data.id, url: imageUrl }]
                        } : evt
                    )
                );
            } else {
                console.error('Error al subir la imagen:', data.error);
                Alert.alert('Error', 'No se pudo subir la imagen. Por favor, inténtalo más tarde.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Alert.alert('Error', 'Error en la carga de la imagen. Por favor, inténtalo más tarde.');
        } finally {
            setImageUploading(false);
        }
    };

    const handleImageClick = (image) => {
        Alert.alert("Imagen Clickeada", `ID de la imagen: ${image.id}`);
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
                                onPress={() => handleImageChange(item)} // Seleccionar imagen para el evento
                            >
                                <Text style={styles.buttonText}>{imageUploading ? 'Subiendo...' : 'Subir Imagen'}</Text>
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

                            <EventSummaryGenerator eventId={item.id} />

                            <View style={styles.imageContainer}>
                                {Array.isArray(item.event_pictures) && item.event_pictures.length > 0 ? (
                                    item.event_pictures.map((picture) => (
                                        <TouchableOpacity key={picture.id} onPress={() => handleImageClick(picture)}>
                                            <Image
                                                source={{ uri: picture.url }}
                                                style={styles.eventImage}
                                                resizeMode="contain"
                                                onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
                                            />
                                        </TouchableOpacity>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text>Selecciona Usuarios</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar usuarios..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <FlatList
                        data={users.filter(user => user.handle.toLowerCase().includes(searchText.toLowerCase()))}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleUserSelection(item)} style={[styles.userItem, selectedUsers.includes(item) && styles.selectedUser]}>
                                <Text>{item.handle}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Confirmar Selección" onPress={handleConfirmSelection} />
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
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
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    eventImage: {
        width: 100,
        height: 100,
        margin: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
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
});

export default Events;
