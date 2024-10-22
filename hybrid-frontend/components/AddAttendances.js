import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const AddAttendance = ({ onCheckIn }) => {
    const route = useRoute();
    const { bar_id, event_id } = route.params; 
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [error, setError] = useState('');
    const [attendanceConfirmed, setAttendanceConfirmed] = useState(false); // Flag de confirmación

    console.log("bar_id:", bar_id);
    console.log("event_id:", event_id);

    if (!bar_id || !event_id) {
        Alert.alert('Error', 'Los identificadores de bar y evento son inválidos.');
        return null; 
    }

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        
        const storedToken = await AsyncStorage.getItem('authToken');
        const token = storedToken ? storedToken.replace(/"/g, '') : null;

        if (!token) {
            Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión nuevamente.');
            setIsCheckingIn(false);
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/bars/${bar_id}/events/${event_id}/attendances`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Response from server:", response.data);
            
            if (response.data.message) {
                Alert.alert('Éxito', response.data.message);
                setAttendanceConfirmed(true); // Actualizar el flag a true
                if (typeof onCheckIn === 'function') {
                    onCheckIn(response.data.attendance);
                } else {
                    console.error("onCheckIn prop is not a function");
                }
            }
        } catch (error) {
            console.error("Error checking in:", error);
            setError('No se pudo registrar la asistencia. Intenta nuevamente.');
            Alert.alert('Error', 'No se pudo registrar la asistencia. Intenta nuevamente.');
        } finally {
            setIsCheckingIn(false);
        }
    };

    return (
        <View style={styles.container}>
            {isCheckingIn ? (
                <ActivityIndicator size="large" color="#A020F0" />
            ) : (
                <>
                    <Button
                        title="Check In"
                        onPress={handleCheckIn}
                        color="#A020F0"
                        disabled={attendanceConfirmed} // Deshabilitar botón si ya se confirmó la asistencia
                    />
                    {attendanceConfirmed && (
                        <Text style={styles.confirmation}>Tu asistencia ha sido confirmada.</Text>
                    )}
                </>
            )}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    confirmation: {
        color: 'green',
        marginTop: 10,
    },
});

export default AddAttendance;
