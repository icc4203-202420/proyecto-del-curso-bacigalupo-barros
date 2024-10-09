import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const BeerDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params; 
    const [beer, setBeer] = useState(null);
    const [brewery, setBrewery] = useState(null);
    const [bars, setBars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBeer(data.beer);
                setBrewery(data.brewery);
                setBars(data.bars);
            } catch (error) {
                console.error("Error fetching beer details:", error);
                setError("Error fetching beer details. Please try again later."); 
            } finally {
                setLoading(false);
            }
        };
        fetchBeerDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {beer ? (
                <>
                    <Text style={styles.title}>Beer Details</Text>
                    <Text style={styles.detail}><strong>Name:</strong> {beer.name}</Text>
                    <Text style={styles.detail}><strong>Style:</strong> {beer.style}</Text>
                    <Text style={styles.detail}><strong>Hop:</strong> {beer.hop}</Text>
                    <Text style={styles.detail}><strong>Yeast:</strong> {beer.yeast}</Text>
                    <Text style={styles.detail}><strong>Malts:</strong> {beer.malts}</Text>
                    <Text style={styles.detail}><strong>IBU:</strong> {beer.ibu}</Text>
                    <Text style={styles.detail}><strong>Alcohol Level:</strong> {beer.alcohol}</Text>
                    <Text style={styles.detail}><strong>BLG:</strong> {beer.blg}</Text>
                    <Text style={styles.detail}>
                        <strong>Average Rating:</strong> {beer.avg_rating ? beer.avg_rating.toFixed(2) : 'No ratings yet'}
                    </Text>

                    {brewery && (
                        <Text style={styles.detail}>
                            <strong>Brewery:</strong> {brewery.name} (Established: {brewery.estdate})
                        </Text>
                    )}

                    {bars.length > 0 ? (
                        <View>
                            <Text style={styles.detail}><strong>Bars Serving This Beer:</strong></Text>
                            {bars.map(bar => (
                                <Text key={bar.id} style={styles.detail}>
                                    - {bar.name} (Location: {bar.latitude}, {bar.longitude})
                                </Text>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.detail}>No bars serving this beer.</Text>
                    )}
                    <Button 
                        title="View Reviews" 
                        onPress={() => navigation.navigate('BeerReviews', { id })}
                        color="#A020F0"
                    />
                </>
            ) : (
                <Text style={styles.detail}>No details available for this beer.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detail: {
        fontSize: 16,
        marginBottom: 8,
    },
});

export default BeerDetailsScreen;
