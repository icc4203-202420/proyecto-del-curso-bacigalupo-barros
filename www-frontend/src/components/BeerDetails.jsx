import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Card, CardContent, Button } from '@mui/material';
import BeerReviews from './BeerReviews';

const BeerDetails = () => {
    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [brewery, setBrewery] = useState(null);
    const [bars, setBars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                setBeer(response.data.beer);
                setBrewery(response.data.brewery);
                setBars(response.data.bars);
            } catch (error) {
                console.error("Error fetching beer details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBeerDetails();
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
                <>
                    <Card>
                        <CardContent>
                            <Typography variant="h3" gutterBottom>Beer Details</Typography>
                            <Typography variant="body1"><strong>Name:</strong> {beer.name}</Typography>
                            <Typography variant="body1"><strong>Style:</strong> {beer.style}</Typography>
                            <Typography variant="body1"><strong>Hop:</strong> {beer.hop}</Typography>
                            <Typography variant="body1"><strong>Yeast:</strong> {beer.yeast}</Typography>
                            <Typography variant="body1"><strong>Malts:</strong> {beer.malts}</Typography>
                            <Typography variant="body1"><strong>IBU:</strong> {beer.ibu}</Typography>
                            <Typography variant="body1"><strong>Alcohol Level:</strong> {beer.alcohol}</Typography>
                            <Typography variant="body1"><strong>BLG:</strong> {beer.blg}</Typography>
                            <Typography variant="body1">
                                <strong>Average Rating:</strong> {beer.avg_rating ? beer.avg_rating.toFixed(2) : 'No ratings yet'}
                            </Typography>

                            {brewery && (
                                <Typography variant="body1">
                                    <strong>Brewery:</strong> {brewery.name} (Established: {brewery.estdate})
                                </Typography>
                            )}

                            {bars.length > 0 ? (
                                <div>
                                    <Typography variant="body1"><strong>Bars Serving This Beer:</strong></Typography>
                                    {bars.map(bar => (
                                        <Typography key={bar.id} variant="body2">
                                            - {bar.name} (Location: {bar.latitude}, {bar.longitude})
                                        </Typography>
                                    ))}
                                </div>
                            ) : (
                                <Typography variant="body1">No bars serving this beer.</Typography>
                            )}

                            <Button
                                component={Link}
                                to="/beers"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '16px' }}
                            >
                                Back to Beers
                            </Button>
                        </CardContent>
                    </Card>
                    
                    {/* Component for displaying beer reviews */}
                    <BeerReviews beerId={id} />
                </>
            ) : (
                <Typography variant="h6">No details available for this beer.</Typography>
            )}
        </Container>
    );
};

export default BeerDetails;
