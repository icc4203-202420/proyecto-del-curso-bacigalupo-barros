import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BeerIcon from '@mui/icons-material/SportsBar';
import { Typography, Container, Card, CardContent, Grid, CircularProgress, TextField } from '@mui/material';

const Beers = () => {
    const [beers, setBeers] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredBeers = beers?.filter((beer) =>
        beer.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Container>
            <Typography variant="h2" 
                sx={{ 
                    marginBottom: 3, 
                    color: '#000000',
                    textAlign: 'center', 
                    fontFamily: 'Times New Roman, serif'
                }}>
                Lista de Cervezas
            </Typography>
            <TextField
                label="Buscar cervezas"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 3 }}
                onChange={handleSearchChange}
                value={searchTerm}
            />
            {beers ? (
                <Grid container spacing={3}>
                    {filteredBeers.map((beer) => (
                        <Grid item xs={12} sm={6} md={4} key={beer.id}>
                            <Card>
                                <CardContent>
                                    <Typography>
                                        <BeerIcon /> 
                                    </Typography>
                                    <Typography variant="h5" sx={{ marginBottom: 2, color: '#000000',textAlign: 'center', fontFamily: 'Times New Roman, serif'}}>
                                        {beer.name}
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary">
                                        Yeast: {beer.yeast}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Malts: {beer.malts}
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
