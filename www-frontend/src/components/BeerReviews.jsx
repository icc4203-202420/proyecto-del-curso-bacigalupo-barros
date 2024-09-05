import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, TextField, Button, Typography, Box } from '@mui/material';

const BeerReviews = ({ beerId }) => {
    console.log("BeerReviews component is rendering for beerId:", beerId);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        text: '',
        rating: 3,
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}/reviews`);
                setReviews(response.data.reviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [beerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newReview.text.split(" ").length < 15) {
            alert("La reseña debe tener al menos 15 palabras.");
            return;
        }

        try {
            await axios.post(`http://127.0.0.1:3001/api/v1/reviews`, {
                ...newReview,
                beer_id: beerId
            });
            // Actualiza la lista de reseñas después de enviar una nueva
            setReviews([...reviews, newReview]);
            setNewReview({ text: '', rating: 3 });
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h5">Reviews</Typography>
            {reviews.map((review, index) => (
                <Box key={index} mt={2} mb={2}>
                    <Typography variant="body1">{review.text}</Typography>
                    <Typography variant="body2">Rating: {review.rating}</Typography>
                </Box>
            ))}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Escribe tu evaluación"
                    fullWidth
                    multiline
                    rows={4}
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    required
                />
                <Slider
                    value={newReview.rating}
                    onChange={(e, newValue) => setNewReview({ ...newReview, rating: newValue })}
                    aria-labelledby="rating-slider"
                    step={1}
                    marks
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                />
                <Button type="submit" variant="contained" color="primary">Enviar evaluación</Button>
            </form>
        </Box>
    );
};

export default BeerReviews;
