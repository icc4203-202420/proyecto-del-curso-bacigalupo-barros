import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Usando expo-image-picker para seleccionar imágenes
import { getItem } from '../Storage';
import { API_URL } from '../config';

const UploadImage = ({ route, navigation }) => {
    const { event_id } = route.params;  
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');

    // Solicitar permisos para la galería y la cámara
    useEffect(() => {
        const requestPermissions = async () => {
            const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

            if (mediaStatus !== 'granted') {
                alert('Se necesitan permisos para acceder a la galería');
            }
            if (cameraStatus !== 'granted') {
                alert('Se necesitan permisos para acceder a la cámara');
            }
        };

        requestPermissions();
    }, []);

    // Función para seleccionar imagen desde la galería
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Guardamos la URI de la imagen seleccionada
        }
    };

    // Función para tomar una foto con la cámara
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Guardamos la URI de la foto tomada
        }
    };

    const handleUploadImage = async () => {
        console.log('Subiendo imagen para el evento:', event_id);
      
        // Verificar que hay una imagen seleccionada
        if (!image) {
            console.log("No se ha seleccionado ninguna imagen.");
            return;
        }
    
        const formData = new FormData();
        const user_id = await getItem('userId'); // Asegúrate de obtener el user_id correcto
        console.log("User ID obtenido:", user_id);
        const storedToken = await getItem('authToken');
        const token = storedToken ? storedToken.replace(/"/g, '') : null;
    
        // Agregar la imagen al FormData correctamente como archivo
        const uri = image;
        const fileType = uri.split('.').pop(); // Obtenemos la extensión del archivo
        const name = uri.split('/').pop(); // Obtenemos el nombre del archivo desde la URI

        formData.append('user_id', user_id);
        formData.append('event_picture[image]', {
            uri: uri,
            type: `image/${fileType}`,
            name: name,
        });
    
        // Usar la descripción ingresada por el usuario
        formData.append('event_picture[description]', description);
    
        // Realizar la solicitud POST a la API
        try {
            const response = await fetch(`${API_URL}/events/${event_id}/event_pictures`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                body: formData,
            });
            
            const responseText = await response.text(); // Leer la respuesta como texto
            console.log('Respuesta de la API:', responseText);
    
            if (response.ok) {
                const responseJson = JSON.parse(responseText);
                console.log('Imagen subida exitosamente:', responseJson.message);
            } else {
                const responseJson = JSON.parse(responseText);
                console.error('Error al subir la imagen:', responseJson.errors || 'No se especificaron errores');
            }
        } catch (error) {
            console.error('Error en la solicitud de subida:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sube una Imagen para el Evento</Text>
            
            {/* Botón para seleccionar imagen desde la galería */}
            <Button title="Seleccionar Imagen" onPress={pickImage} />

            {/* Botón para tomar foto con la cámara */}
            <Button title="Tomar Foto" onPress={takePhoto} />
            
            {image && (
                <>
                    <Image source={{ uri: image }} style={styles.image} />
                    {/*<Text style={styles.uriText}>{image}</Text>*/}
                </>
            )}
            <TextInput
                style={styles.input}
                placeholder="Ingresa una descripción"
                value={description}
                onChangeText={setDescription}
            />
            <Button title="Subir Imagen" onPress={handleUploadImage} />
            <Button
                title="Ver Imágenes del Evento"
                onPress={() => navigation.navigate('ViewEventPictures', { event_id })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    uriText: {
        fontSize: 12,
        marginTop: 10,
        color: 'gray',
    },
});

export default UploadImage;
