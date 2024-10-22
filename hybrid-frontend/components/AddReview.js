import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';

const AddReview = ({ id, onNewReview }) => {
    const [rating, setRating] = useState(3);
    const [reviewText, setReviewText] = useState('');
    const navigation = useNavigation();

    const countWords = (text) => {
        return text.trim().split(/\s+/).length;
    };

    const handleSubmit = async () => {
        if (!reviewText || countWords(reviewText) < 15) {
            Alert.alert('The review must have at least 15 words.');
            return;
        }

        if (rating === 0) {
            Alert.alert('Please provide a rating between 1 and 5.');
            return;
        }

        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            const token = storedToken ? storedToken.replace(/"/g, '') : null;

            if (!token) {
                Alert.alert('Error', 'User is not authenticated. Please log in again.');
                return;
            }

            const response = await fetch(`${API_URL}/beers/${id}/reviews`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    review: {
                        text: reviewText,
                        rating: parseFloat(rating.toFixed(1)),
                    }
                }),
            });

            const data = await response.json();
            if (data && data.review) {
                onNewReview(data.review);
            }

            setReviewText(''); 
            setRating(3);
            navigation.navigate('BeerDetails', { id }); 
        } catch (error) {
            console.error('Error submitting review:', error);
            navigation.navigate('BeerDetails', { id });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Your Review</Text>
            <Text style={styles.ratingText}>Rating: {rating.toFixed(1)}</Text>
            <Slider
                style={styles.slider}
                value={rating}
                onValueChange={(value) => setRating(parseFloat(value.toFixed(1)))}
                minimumValue={1}
                maximumValue={5}
                step={0.1}
                minimumTrackTintColor="#A020F0"
                maximumTrackTintColor="#000000"
            />
            <TextInput
                style={styles.textInput}
                placeholder="Your Review"
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
            />
            <Button
                onPress={handleSubmit}
                title="Submit Review"
                color="#A020F0"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 16,
        marginBottom: 10,
    },
    slider: {
        marginBottom: 20,
        width: 300,
        height: 40,
    },
    textInput: {
        height: 100,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default AddReview;
