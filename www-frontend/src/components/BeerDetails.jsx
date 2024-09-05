import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Card, CardContent, Button } from '@mui/material';

const BeerDetails = () => {
    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBeer = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                setBeer(response.data.beer);
            } catch (error) {
                console.error("Error fetching beer details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBeer();
    }, [id]);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            {beer ? (
                <Card>
                    <CardContent>
                        <Typography variant="h3" gutterBottom>Beer Details</Typography>
                        <Typography variant="body1">Yeast: {beer.yeast}</Typography>
                        <Typography variant="body1">Malts: {beer.malts}</Typography>
                        <Typography variant="body1">Alcohol level: {beer.alcohol}</Typography>
                        <Typography variant="body1">Brewery: </Typography>
                        <Typography variant="body1">Bars serving this beer: </Typography>
                        <Button
                                    component={Link}
                                    to= "/beers"
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '16px' }}
                                >
                                    Vuelta a Beers
                                </Button>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="h6">No details available for this beer.</Typography>
            )}
        </Container>
    );
};

export default BeerDetails;
