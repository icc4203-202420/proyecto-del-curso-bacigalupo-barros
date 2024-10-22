import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const Bars = ({ navigation }) => {
    const [bars, setBars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBars = async () => {
            try {
                const response = await axios.get(`${API_URL}/bars`);
                if (response.data.bars) {
                    setBars(response.data.bars);
                }
            } catch (error) {
                console.error("Error fetching bars:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBars();
    }, []);

    const handleSearchChange = (text) => {
        setSearchTerm(text.toLowerCase());
    };

    const handleCardClick = (id) => {
        navigation.navigate('Events', { bar_id: id });
    };

    const filteredBars = bars.filter((bar) =>
        bar.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A020F0" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Buscar Bares"
                style={styles.searchInput}
                onChangeText={handleSearchChange}
                value={searchTerm}
            />
            <FlatList
                data={filteredBars}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleCardClick(item.id)}>
                        <Text style={styles.barName}>{item.name}</Text>
                        <Text style={styles.barAddress}><strong>Dirección:</strong> {item.address.line1}</Text>
                        <Text style={styles.barCity}><strong>Ciudad:</strong> {item.address.city}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    barName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    barAddress: {
        fontSize: 14,
        color: '#555',
    },
    barCity: {
        fontSize: 14,
        color: '#555',
    },
    list: {
        paddingBottom: 20,
    },
});

export default Bars;
