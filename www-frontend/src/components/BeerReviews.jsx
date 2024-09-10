import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Container, CardContent, Divider, Button, CircularProgress, Tabs, Tab, Box } from '@mui/material';
import AddReview from './AddReview';
import { useParams, Link } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const initialState = {
    reviews: [],
    loading: true,
    error: null,
};

const ACTIONS = {
    FETCH_REVIEWS_SUCCESS: 'FETCH_REVIEWS_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
    ADD_REVIEW: 'ADD_REVIEW',
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_REVIEWS_SUCCESS:
            return {
                ...state,
                reviews: action.payload,
                loading: false,
            };
        case ACTIONS.FETCH_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case ACTIONS.ADD_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.payload],
            };
        default:
            return state;
    }
};

const BeerReviews = () => {
    const { id } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [tabIndex, setTabIndex] = useState(0); // Estado para manejar la pestaña activa

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`);
                dispatch({
                    type: ACTIONS.FETCH_REVIEWS_SUCCESS,
                    payload: reviewsResponse.data.reviews,
                });
            } catch (error) {
                dispatch({
                    type: ACTIONS.FETCH_ERROR,
                    payload: "Error fetching reviews",
                });
            }
        };

        fetchReviews();
    }, [id]);

    const handleNewReview = (newReview) => {
        dispatch({ type: ACTIONS.ADD_REVIEW, payload: newReview });
        setTabIndex(0); 
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (state.loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (state.error) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    {state.error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Card sx={{ marginTop: 2, padding: 2 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab label="Reviews"/>
                    
                    <Tab label="Add Review" />
                </Tabs>

                {tabIndex === 0 && (
                    <CardContent>
                        <Typography
                            variant="h5"
                            sx={{ color: '#000000', fontFamily: 'Times New Roman, serif', marginBottom: 2 }}
                        >
                            Reviews
                        </Typography>

                        {state.reviews.length > 0 ? (
                            state.reviews.map((review, index) => (
                                review && review.rating !== undefined ? (
                                    <div key={index} style={{ marginBottom: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#000000', fontFamily: 'Times New Roman, serif' }}
                                        >
                                            <strong>Rating:</strong> {review.rating} / 5
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#000000', fontFamily: 'Times New Roman, serif' }}
                                        >
                                            {review.text}
                                        </Typography>
                                        <Divider sx={{ marginY: 1 }} />
                                    </div>
                                ) : (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontFamily: 'Times New Roman, serif', marginBottom: 2 }}
                                    >
                                        Review data is not available (Recargar la página, solo así nos sirvió).
                                    </Typography>
                                )
                            ))
                        ) : (
                            <Typography
                                variant="body1"
                                sx={{ color: '#000000', fontFamily: 'Times New Roman, serif' }}
                            >
                                No reviews yet.
                            </Typography>
                        )}
                    </CardContent>
                )}

                {tabIndex === 1 && (
                    <CardContent>
                        <AddReview id={id} onNewReview={handleNewReview} />
                    </CardContent>
                )}
            </Card>

            <Button component={Link} to="/beers" variant="contained" sx={{ marginTop: 2, bgcolor: '#A020F0' }}>
                Back to Beers
            </Button>
        </Container>
    );
};

export default BeerReviews;
