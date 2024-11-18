import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications'; // Importar la librería de notificaciones
import LogOut from './screens/LogOut';  
import { useNavigation } from '@react-navigation/native'; 

const HomeScreen = () => {
  const navigation = useNavigation(); 

  // Solicitar permisos para las notificaciones
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Se requieren permisos para mostrar notificaciones.');
        }
      }
    };

    requestPermissions();

    // Manejador de notificaciones recibidas
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
      // Mostrar una alerta con el contenido de la notificación
      Alert.alert(notification.request.content.title, notification.request.content.body);
    });

    return () => subscription.remove(); // Limpiar el manejador al desmontar el componente
  }, []);

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notificación de prueba",
        body: 'Esta es una notificación enviada desde la aplicación.',
        data: { someData: 'goes here' },
        sound: 'default', // Asegúrate de que hay un sonido por defecto
      },
      trigger: { seconds: 10 }, // Se enviará después de 10 segundos
    });
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to BARMAN!</Text>
      <View style={styles.buttonContainer}>
        <LogOut onLogout={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%', 
    marginTop: 20, 
  },
});

export default HomeScreen;
