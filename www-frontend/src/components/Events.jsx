import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Container, Grid, CircularProgress, Snackbar, Button, Card } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import Attendances from './Attendances';
import AddAttendance from "./AddAttendance";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CloseIcon from '@mui/icons-material/Close';

const Events = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: es });
    }; //pq sin esto se ve horrible
    const [events, setEvents] = useState(null);
    const { bar_id } = useParams();
    const [openSnackbar, setOpenSnackbar] = useState(false);

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

    const handleCheckIn = (attendance) => {
        console.log('Checked in');
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
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
            {events ? (
                <Grid item xs={3}>
                    {events.map((event) => (
                        <Card key={event.id} elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
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
                                Description: {event.description}
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Has confirmado tu asistencia."
                action={
                    <Button color="inherit" onClick={handleSnackbarClose}>
                        OK
                    </Button>
                }
                anchorOrigin={{
                    vertical: 'center', 
                    horizontal: 'center', 
                }}
                style={{
                    position: 'fixed',
                    bottom: 'auto',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        </Container>
    );
}

export default Events;
