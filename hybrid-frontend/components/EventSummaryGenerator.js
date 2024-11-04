import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const EventSummaryGenerator = ({ eventId }) => {
    const [generating, setGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    const handleGenerateSummary = async () => {
        setGenerating(true);
        try {
            const response = await axios.post(`${API_URL}/events/${eventId}/generate_summary`);
            if (response.status === 200) {
                Alert.alert('Éxito', 'El resumen se está generando. Recibirás una notificación cuando esté listo.');
            } else {
                Alert.alert('Error', 'No se pudo iniciar la generación del resumen.');
            }
        } catch (error) {
            console.error('Error generando el resumen:', error);

            // Verifica si el error proviene del servidor y si contiene un mensaje específico
            if (error.response && error.response.status === 422) {
                Alert.alert('Error', 'Evento no terminado. Por favor completa el evento antes de generar el resumen.');
            } else {
                Alert.alert('Error', 'Hubo un problema al intentar generar el resumen.');
            }
        } finally {
            setGenerating(false);
        }
    };

    const checkSummaryAvailability = async () => {
        try {
            const response = await axios.get(`${API_URL}/events/${eventId}/summary`);
            if (response.status === 200) {
                setVideoUrl(response.data.video_url);
            }
        } catch (error) {
            console.error('Error verificando disponibilidad del resumen:', error);
            setVideoUrl(null);  // Si no está disponible, no muestra el video
        }
    };

    useEffect(() => {
        checkSummaryAvailability();
    }, []);

    return (
        <View style={{ marginTop: 10 }}>
            {generating ? (
                <ActivityIndicator size="small" color="#A020F0" />
            ) : (
                <TouchableOpacity onPress={handleGenerateSummary} style={{ backgroundColor: '#A020F0', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Generar Resumen</Text>
                </TouchableOpacity>
            )}

            {videoUrl && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 16, color: '#A020F0', textAlign: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>Resumen disponible: </Text>
                        <Text onPress={() => { }}>
                            Ver Video
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    );
};

export default EventSummaryGenerator;
