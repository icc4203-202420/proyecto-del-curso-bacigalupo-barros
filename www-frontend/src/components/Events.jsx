import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Container, Grid, CircularProgress, Snackbar, Button, Card } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import Attendances from './Attendances';
import AddAttendance from "./AddAttendance";
import EventGallery from './EventGallery'; 
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Events = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: es });
    };
    
    const [events, setEvents] = useState(null);
    const { bar_id } = useParams();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchEvents = async () => { 
            try {
                const event_url = `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events`;
                const response = await axios.get(event_url); 
                const data = await response.data;

                console.log(data);

                if (data.event) { 
                    setEvents([data.event]);
                } else if (data.events) { 
                    setEvents(data.events);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [bar_id]);

    const handleCheckIn = (attendance) => {
        console.log('Checked in');
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleEventSelect = (event) => {
        console.log("Evento seleccionado:", event);
        setSelectedEvent(event);  
    };

    const handleViewImages = (event) => {
        handleEventSelect(event);
        navigate(`/events/${event.id}`, { state: { event } }); 
    };

    return (
        <Container>
            <Typography variant="h2" 
                sx={{ 
                    marginBottom: 3, 
                    color: '#000000',
                    textAlign: 'center', 
                    fontFamily: 'Times New Roman, serif'
                }}>
                Eventos del bar
            </Typography>
    
            {selectedEvent ? (
                <EventGallery event={selectedEvent} /> 
            ) : events !== null ? ( 
                events.length > 0 ? ( 
                    <Grid container spacing={2}>
                        {events.map((event) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <Card elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
                                    <Typography variant="h5" 
                                        sx={{ 
                                            marginBottom: 1, 
                                            color: '#000000',
                                            textAlign: 'center', 
                                            fontFamily: 'Times New Roman, serif'
                                        }}>
                                        Nombre: {event.name}
                                    </Typography>
                                    <Typography>
                                        Descripción: {event.description}
                                    </Typography>
                                    <Typography>
                                        Fecha: {formatDate(event.date)}
                                    </Typography>
                                    <Typography>
                                        Hora Inicio: {event.start_date}
                                    </Typography>
                                    <Typography>
                                        Hora Fin: {event.end_date}
                                    </Typography>
                                    <Typography>
                                        ID del Bar: {event.bar_id}
                                    </Typography>
    
                                    <AddAttendance bar_id={bar_id} event_id={event.id} onCheckIn={handleCheckIn} />
                                    <Attendances event_id={event.id} />
    
                                    <Button
                                        variant="contained"
                                        sx={{ 
                                            bgcolor: '#A020F0', 
                                            color: 'white', 
                                            marginTop: '16px'
                                        }}
                                        onClick={() => {
                                            console.log("Botón Ver Imágenes clickeado para:", event);
                                            handleEventSelect(event);
                                            handleViewImages(event);
                                        }}
                                    >
                                        Ver Imágenes
                                    </Button>
    
                                    <Button
                                        component={Link}
                                        to="/bars"
                                        variant="contained"
                                        sx={{ 
                                            bgcolor: '#A020F0', 
                                            position: 'fixed', 
                                            top: 60, 
                                            left: 5, 
                                            zIndex: 9999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}
                                    >
                                        <ArrowBack sx={{ mr: 1 }} />
                                        Volver a Bars
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No hay eventos disponibles.</Typography>
                )
            ) : (
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            )}
        </Container>
    );
}

export default Events;
