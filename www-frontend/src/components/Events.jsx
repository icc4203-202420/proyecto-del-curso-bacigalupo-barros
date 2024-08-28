import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Container, Grid, CircularProgress, Paper, Button, Card } from '@mui/material';
import axios from 'axios';


const Events = () => {
    const [events, setEvents] = useState(null);
    const { bar_id } = useParams();

    useEffect(() => {
        const fetchEvents = async () => { 
            try {
                const event_url = `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events`;
                const response = await axios.get(event_url); 
                const data = await response.data;

                if (data.events) { 
                    setEvents(data.events);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [bar_id])

    return (
        <Container>
            <Typography variant="h2" gutterBottom align="center">
                Eventos del bar
            </Typography>
            {events ? (
                <Grid item xs={3}>
                    {events.map((event) => (
                            <Card elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
                                <Typography variant="h6">
                                    Nombre: {event.name}
                                </Typography>
                                <Typography>
                                    Fecha: {event.date}
                                </Typography>
                                <Typography>
                                   ID del Bar: {event.bar_id}
                                </Typography>
                                <Button
                                    component={Link}
                                    to= "/bars"
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '16px' }}
                                >
                                    Vuelta a Bars
                                </Button>
                            </Card>
                    ))}
                </Grid>
                ) : (
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            )}
        </Container>
    );
}

export default Events;
