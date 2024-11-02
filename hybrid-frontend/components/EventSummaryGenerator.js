// EventSummaryGenerator.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const EventSummaryGenerator = ({ eventId }) => {
    const [generating, setGenerating] = useState(false);

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
            Alert.alert('Error', 'Hubo un problema al intentar generar el resumen.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <View style={{ marginTop: 10 }}>
            {generating ? (
                <ActivityIndicator size="small" color="#A020F0" />
            ) : (
                <TouchableOpacity onPress={handleGenerateSummary} style={{ backgroundColor: '#A020F0', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Generar Resumen</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default EventSummaryGenerator;
