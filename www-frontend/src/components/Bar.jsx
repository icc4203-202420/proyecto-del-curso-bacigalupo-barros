import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Card, CardContent,Paper, Grid, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Bars = () => {
    const [bars, setBars] = useState(null);
    
    useEffect(() => {
        const fetchBars = async () => { 
            try {
                const bar_url = `http://127.0.0.1:3001/api/v1/bars`;
                const response = await axios.get(bar_url); 
                const data = await response.data;

                if (data.bars) { 
                    setBars(data.bars);
                }
            } catch (error) {
                console.error("Error fetching bars:", error);
            }
        };
        fetchBars();
    }, [])

    return (
        <Container>
            <Typography variant="h2" gutterBottom align="center">
                Lista de Bares
            </Typography>
            {bars ? (
                <Grid container spacing={2}>
                    {bars.map((bar) => (
                        <Grid item xs={12} sm={6} md={4} key={bar.id}>
                            <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
                                <Typography variant="h6">
                                    {bar.name} | {bar.id}
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                        Address ID: {bar.address_id} 
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                        Latitude: {bar.latitude}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                        Longitude: {bar.longitude}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/bars/${bar.id}/events`}
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '16px' }}
                                >
                                    Ver Eventos
                                </Button>
                            </Paper>
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
    
export default Bars;
