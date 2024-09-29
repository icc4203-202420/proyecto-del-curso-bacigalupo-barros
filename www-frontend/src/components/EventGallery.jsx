import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';

const EventGallery = () => {
    const location = useLocation();
    const event = location.state?.event;

    console.log("Evento recibido en EventGallery:", event); 

    if (!event) {
        return <Typography>No se encontró el evento.</Typography>;
    }

    return (
        <Card sx={{ margin: 2, maxWidth: 600, mx: "auto" }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {event.name}
                </Typography>
                <Typography variant="body2">
                    Descripción: {event.description}
                </Typography>
                <Typography variant="body2">
                    Flyer: 
                    <img src={event.flyer_url} alt="Flyer" style={{ maxWidth: '100%', margin: '10px 0' }} />
                </Typography>
                
                <Typography variant="body2">
                    Pictures:
                </Typography>
                {event.event_pictures && event.event_pictures.length > 0 ? (
                    event.event_pictures.map((picture, index) => (
                        <CardMedia
                            key={index}
                            component="img"
                            alt={`Event Picture ${index + 1}`}
                            height="140"
                            image={picture.url}
                            sx={{ marginBottom: 1 }} 
                        />
                    ))
                ) : (
                    <Typography>No hay imágenes disponibles para este evento.</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default EventGallery;
