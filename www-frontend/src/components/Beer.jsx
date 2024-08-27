import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';

const Beers = () => {
    const [beers, setBeers] = useState(null);
    
    useEffect(() => {
        const fetchBeers = async () => {
            try {
                const beer_url = `http://127.0.0.1:3001/api/v1/beers`;
                const response = await axios.get(beer_url);
                const data = await response.data;

                if (data.beers) { 
                    setBeers(data.beers);
                }
            } catch (error) {
                console.error("Error fetching beers:", error);
            }
        };

        fetchBeers();
    }, []);

    return (
        <Container>
            <Typography variant="h2" >
                Lista de Cervezas
            </Typography>
            {beers ? (
                <Grid container spacing={3}>
                    {beers.map((beer) => (
                        <Grid item xs={12} sm={6} md={4} key={beer.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {beer.name}
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary">
                                        Yeast: {beer.yeast}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Malts: {beer.malts}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {beer.ibu}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Alcohol level: {beer.alcohol}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            )}
        </Container>
    );
};
    
export default Beers;
