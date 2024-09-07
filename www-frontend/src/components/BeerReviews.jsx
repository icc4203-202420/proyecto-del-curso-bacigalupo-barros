import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Container, CardContent, Divider, Button } from '@mui/material';
import AddReview from './AddReview';
import { useParams, Link } from 'react-router-dom';


const BeerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                console.log("BeerReviews ID:", id); 
                const url = `http://127.0.0.1:3001/api/v1/beers/${id}/reviews`
                const response = await axios.get(url);
                console.log(id)
                setReviews(response.data.reviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [id]);

    const handleNewReview = (newReview) => {
        setReviews([...reviews, newReview]);
    };

    return (
        <Container>
            <Card sx={{ marginTop: 2, padding: 2 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ color: '#000000', fontFamily: 'Times New Roman, serif', marginBottom: 2 }}>
                        Reviews
                    </Typography>
                    
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} style={{ marginBottom: 2 }}>
                                <Typography variant="body2" sx={{ color: '#000000', fontFamily: 'Times New Roman, serif' }}>
                                    <strong>Rating:</strong> {review.rating} / 5
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#000000', fontFamily: 'Times New Roman, serif' }}>
                                    {review.text}
                                </Typography>
                                <Divider sx={{ marginY: 1 }} />
                            </div>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ color: '#000000', fontFamily: 'Times New Roman, serif' }}>
                            No reviews yet.
                        </Typography>
                    )}
                    
                    <AddReview id={id} onNewReview={handleNewReview} />
                </CardContent>
            </Card>
            <Button
                component={Link}
                to={`/beers/${id}`}
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
            >
                Beer Details
            </Button>
        </Container>
    );
};

export default BeerReviews;
