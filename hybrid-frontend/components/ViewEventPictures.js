import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { API_URL } from '../config';

const ViewEventPictures = ({ route }) => {
    const { event_id } = route.params;  
    const [pictures, setPictures] = useState([]);

    useEffect(() => {
        const fetchPictures = async () => {
            try {
                const response = await fetch(`${API_URL}/events/${event_id}`);
                const data = await response.json(); 
                //console.error(data) 
                setPictures(data.event_pictures || []);
            } catch (error) {
                console.error('Error en la solicitud de imágenes:', error.message);
            }
        };
    
        fetchPictures();
    }, [event_id]);
    
    const renderPicture = ({ item }) => (
        <View style={styles.pictureContainer}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <Text style={styles.userId}>@{item.user_handle || 'Desconocido'}: {item.description || 'Sin descripción'}</Text> 
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Imágenes del Evento</Text>
            <FlatList
                data={pictures}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPicture}
                contentContainerStyle={styles.list}
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
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    pictureContainer: {
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: '#A020F0',  // Fondo morado
        padding: 10,                  // Espaciado interno
        borderRadius: 10,             // Bordes redondeados
        borderWidth: 2,               // Borde morado
        borderColor: '#8e44ad',       // Color del borde morado
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 10,             // Bordes redondeados en la imagen
    },
    description: {
        fontSize: 16,
        color: '#fff',                // Texto blanco
        textAlign: 'center',          // Centrar texto
        marginBottom: 5,              // Espaciado inferior
    },
    userId: {
        fontSize: 14,
        color: '#f0f0f0',             // Color de texto suave para el userHandle
        marginTop: 5,
        textAlign: 'center',          // Centrar el texto
    },
});

export default ViewEventPictures;
