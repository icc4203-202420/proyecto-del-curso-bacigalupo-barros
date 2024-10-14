// TagUsers.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, CircularProgress, Autocomplete } from '@mui/material';
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const TagUsers = ({ eventPictureId, onTagUser }) => {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/v1/users');
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setError('');
    };

    const handleSubmit = async () => {
        console.log("Event Picture ID:", eventPictureId);

        if (!selectedUser) {
            setError('Please select a user to tag.');
            return;
        }

        if (!eventPictureId) {
            setError('No event picture selected.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                `http://127.0.0.1:3001/api/v1/event_pictures/${eventPictureId}/tag_user`,
                {
                    user_id: selectedUser.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            onTagUser(response.data.photo_tag);
            handleClose();
        } catch (error) {
            console.error('Error tagging user:', error);
            setError('Failed to tag user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Button 
                variant="contained" 
                onClick={handleClickOpen} 
                sx={{ bgcolor: '#A020F0' }}
                startIcon={<PersonAddIcon />}
            >
                Tag User
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Tag a User in this Photo</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={users}
                        getOptionLabel={(option) => `${option.handle}`}
                        renderInput={(params) => <TextField {...params} label="Select User" margin="dense" variant="outlined" fullWidth />}
                        onChange={(event, value) => setSelectedUser(value)}
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
                        {isSubmitting ? <CircularProgress size={24} /> : 'Tag User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TagUsers;
