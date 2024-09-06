import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import AddReview from './AddReview';

const BeerReviews = ({ beerId }) => {
    const [reviews, setReviews] = useState([]);

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

    const handleNewReview = (newReview) => {
        setReviews([...reviews, newReview]);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <Typography variant="h5">Reviews</Typography>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id}>
                        <Typography variant="body2">
                            <strong>Rating:</strong> {review.rating} / 5
                        </Typography>
                        <Typography variant="body2">
                            {review.text}
                        </Typography>
                    </div>
                ))
            ) : (
                <Typography variant="body1">No reviews yet.</Typography>
            )}
            <AddReview beerId={beerId} onNewReview={handleNewReview} />
        </div>
    );
};

export default BeerReviews;
