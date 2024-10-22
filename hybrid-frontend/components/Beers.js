import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '../config';

const Beers = () => {
    const [beers, setBeers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBeers = async () => {
            try {
                const response = await fetch(`${API_URL}/beers`);
                const data = await response.json();
                if (data.beers) {
                    setBeers(data.beers);
                }
            } catch (error) {
                console.error("Error fetching beers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBeers();
    }, []);

    const handleCardClick = (id) => {
        navigation.navigate('BeerDetails', { id });
    };

    const filteredBeers = beers.filter(beer =>
        beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Cervezas</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar cervezas"
                onChangeText={setSearchTerm}
                value={searchTerm}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredBeers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleCardClick(item.id)} style={styles.card}>
                            <MaterialCommunityIcons name="beer" size={48} color="#000" />
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text>Yeast: {item.yeast}</Text>
                            <Text>Malts: {item.malts}</Text>
                            <Text>Alcohol level: {item.alcohol}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default Beers;
