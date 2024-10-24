import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, CircularProgress, Autocomplete } from '@mui/material';
import axios from 'axios';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const AddFriend = ({ userId, friendId, onAddFriend }) => {
    const [barId, setBarId] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/v1/events');
                setEvents(response.data.events);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setBarId('');
        setSelectedEvent(null);
        setError('');
    };

    const handleSubmit = async () => {
        if (!userId || !friendId) {
            setError('User ID and Friend ID are required.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                `http://127.0.0.1:3001/api/v1/users/${userId}/friendships`,
                {
                    friendship: {
                        friend_id: friendId,
                        bar_id: selectedEvent ? selectedEvent.bar_id : null // Evento opcional
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            onAddFriend(response.data.friendship);
            handleClose();
        } catch (error) {
            console.error('Error adding friend:', error);
            setError('Failed to add friend. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{ bgcolor: '#A020F0' }}>
                Add Friend <PersonAddAlt1Icon />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a New Friend</DialogTitle>
                <DialogContent>
                    <Typography>Friend ID: {friendId || 'Loading...'}</Typography>

                    {/* Autocomplete para seleccionar evento (opcional) */}
                    <Autocomplete
                        options={events}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Select Event (Optional)" margin="dense" variant="outlined" fullWidth />}
                        onChange={(event, value) => setSelectedEvent(value)}
                    />

                    {error && <Typography color="error">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddFriend;
