import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  // Usando expo-image-picker para seleccionar imágenes
import { getItem } from '../Storage';
import { API_URL } from '../config';

const UploadImage = ({ route, navigation }) => {
    const { event_id } = route.params;  
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('')

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);  // Guardamos la URI de la imagen seleccionada
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
        const user_id = await getItem('userId'); // Asegúrate de obtener el user_id correcto (podría ser un valor de contexto o del perfil de usuario)
        console.log("User ID obtenido:", user_id);
        const storedToken = await getItem('authToken');
        const token = storedToken ? storedToken.replace(/"/g, '') : null;
    
        // Agregar la imagen al FormData correctamente como archivo
        const uri = image;
        const fileType = uri.split('.').pop();  // Obtenemos la extensión del archivo
        console.log(fileType)
        const name = uri.split('/').pop();     // Obtenemos el nombre del archivo desde la URI
        console.log(name)

        formData.append('user_id', user_id);
        formData.append('event_picture[image]', {
            uri: uri,
            type: `image/${fileType}`,
            name: name,
        });
    
        // Si deseas enviar una descripción junto con la imagen, agrega otro campo:
        formData.append('event_picture[description]', 'Descripción de la Imagen');
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
            
            // Verificar si la respuesta es válida
            const responseText = await response.text();  // Usamos .text() para leer la respuesta como texto
            console.log('Respuesta de la API:', responseText);
    
            if (response.ok) {
                const responseJson = JSON.parse(responseText);
                console.log('Imagen subida exitosamente:', responseJson.message);
            } else {
                // Si la respuesta no es OK, mostramos el error
                const responseJson = JSON.parse(responseText);  // Parsear la respuesta
                console.error('Error al subir la imagen:', responseJson.errors || 'No se especificaron errores');
            }
        } catch (error) {
            console.error('Error en la solicitud de subida:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sube una Imagen para el Evento</Text>
            <Button title="Seleccionar Imagen" onPress={pickImage} />
            {image && (
                <>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Text style={styles.uriText}>{image}</Text> 
                </>
            )}
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
