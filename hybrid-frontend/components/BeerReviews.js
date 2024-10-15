import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Button, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AddReview from './AddReview';
import { useRoute, useNavigation } from '@react-navigation/native';

const BeerReviews = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params; 
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) {
                setError("No beer ID provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://10.33.1.198:3000/api/v1/beers/${id}/reviews`);
                setReviews(response.data.reviews);
            } catch (error) {
                setError("Error fetching reviews");
                Alert.alert("Error", "No se pudieron cargar las reseñas. Inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleNewReview = (newReview) => {
        setReviews((prevReviews) => [...prevReviews, newReview]);
        setTabIndex(0);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A020F0" />
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
        <View style={styles.container}>
            {tabIndex === 0 ? (
                <ScrollView>
                    <Text style={styles.title}>Reviews</Text>

                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <View key={index} style={styles.reviewContainer}>
                                <Text style={styles.reviewUser}>{review.user.handle} | Rating: {review.rating} / 5</Text>
                                <Text>{review.text}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>No reviews yet.</Text>
                    )}
                </ScrollView>
            ) : (
                <AddReview id={id} onNewReview={handleNewReview} />
            )}
            <Button title={tabIndex === 0 ? "Add Review" : "View Reviews"} onPress={() => setTabIndex(tabIndex === 0 ? 1 : 0)} color="#A020F0" />

            <Button title="Back to Beers" onPress={() => navigation.goBack()} color="#A020F0"/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
    reviewContainer: {
        marginBottom: 16,
    },
    reviewUser: {
        fontWeight: 'bold',
    },
});

export default BeerReviews;
