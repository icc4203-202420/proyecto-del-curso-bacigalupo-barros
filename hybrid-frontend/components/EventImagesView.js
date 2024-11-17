import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

const EventImagesView = ({ route, navigation }) => {
  const { event } = route.params;

  const handleImageClick = (image) => {
    Alert.alert("Imagen Clickeada", `ID de la imagen: ${image.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imágenes del Evento: {event.name}</Text>

      <FlatList
        data={event.event_pictures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleImageClick(item)}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.eventImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
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
  imageContainer: {
    marginBottom: 10,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: '#A020F0',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default EventImagesView;
