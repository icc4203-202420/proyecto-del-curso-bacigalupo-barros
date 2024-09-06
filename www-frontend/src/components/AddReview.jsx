import React, { useState } from 'react';
import { Slider, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const AddReview = ({ beerId, onNewReview }) => {
    const [rating, setRating] = useState(3);
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (reviewText.length < 15) {
            setError('The review must be at least 15 words long.');
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:3001/api/v1/beers/${beerId}/reviews`, {
                rating,
                text: reviewText,
            });
            onNewReview(response.data.review);  // Update the reviews list
            setReviewText('');
            setRating(3);  // Reset the form
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <Typography variant="h5">Add Your Review</Typography>
            <Slider
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                min={1}
                max={5}
                step={0.1}
                marks
                valueLabelDisplay="auto"
                style={{ marginBottom: '20px' }}
            />
            <TextField
                label="Your Review"
                multiline
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                fullWidth
                variant="outlined"
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: '10px' }}
            >
                Submit Review
            </Button>
        </div>
    );
};

export default AddReview;
