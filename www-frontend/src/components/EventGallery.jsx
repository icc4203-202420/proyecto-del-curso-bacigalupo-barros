import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';
import EventPicture from './EventPicture';
import { ArrowBack } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';

const EventGallery = () => {
    const location = useLocation();
    const initialEvent = location.state?.event;

    const [event, setEvent] = useState(initialEvent);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const eventId = initialEvent?.id || location.state?.event?.id;
                if (eventId) {
                    const response = await axios.get(`http://127.0.0.1:3001/api/v1/events/${eventId}`);
                    setEvent(response.data.event);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudo obtener el evento');
            } finally {
                setLoading(false);
            }
        };

        if (!event) {
            fetchEvent();
        } else {
            setLoading(false);
        }
    }, [event, location.state]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert('Por favor selecciona una imagen antes de subir.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const eventId = event?.id;
            if (!eventId) {
                alert('ID del evento no está disponible.');
                return;
            }

            const response = await axios.post(`http://127.0.0.1:3001/api/v1/events/${eventId}/upload_picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Imagen subida exitosamente');
            const updatedEventResponse = await axios.get(`http://127.0.0.1:3001/api/v1/events/${eventId}`);
            setEvent(updatedEventResponse.data.event);
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert(error.response?.data?.message || 'Error al subir la imagen');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!event) {
        return <Typography>No se encontró el evento.</Typography>;
    }

    return (
        <Card sx={{ margin: 2, maxWidth: 600, mx: "auto" }}>
            <CardContent>
                <Typography variant="h4" component="div" sx={{ textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                    {event.name}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                    Descripción: {event.description}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                    Flyer:
                    <img src={event.flyer_url} alt="Flyer" style={{ maxWidth: '100%', margin: '10px 0' }} />
                </Typography>

                <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                    Event Pictures:
                </Typography>
                
                <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '10px'
                }}>
                    {event.event_pictures && event.event_pictures.length > 0 ? (
                        event.event_pictures.map((picture) => (
                            <EventPicture 
                                key={picture.id} 
                                imageUrl={picture.url} 
                                pictureId={picture.id}
                            />
                        ))
                    ) : (
                        <Typography sx={{ textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                            No hay imágenes disponibles para este evento.
                        </Typography>
                    )}
                </div>

                <Typography variant="h5" sx={{ marginTop: 2, textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                    Upload Picture:
                </Typography>
                <input
                    accept="image/*"
                    id="file-upload"
                    type="file"
                    style={{ display: 'none' }} 
                    onChange={handleImageChange}
                />
                <label htmlFor="file-upload">
                    <Button variant="contained" component="span" sx={{ bgcolor: '#A020F0', marginTop: 2 }}>
                        <ImageIcon /> Seleccionar Imagen
                    </Button>
                </label>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ bgcolor: '#A020F0', marginTop: 2 }}
                    onClick={handleImageUpload}
                >
                    <UploadIcon /> Subir Imagen
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
                    Volver a Bares
                </Button>
            </CardContent>
        </Card>
    );
};

export default EventGallery;
