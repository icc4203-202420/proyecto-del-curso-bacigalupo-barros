import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, CircularProgress } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const AddAttendance = ({ bar_id, event_id, onCheckIn }) => {
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [error, setError] = useState('');

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setHasCheckedIn(true);
            onCheckIn(response.data.attendance);
        } catch (error) {
            console.error("Error checking in:", error);
            setError('Failed to check in. Please try again.');
        } finally {
            setIsCheckingIn(false);
        }
    };

    return (
        <div>
            {isCheckingIn ? (
                <CircularProgress />
            ) : (
                <Button
                    onClick={handleCheckIn}
                    variant="contained"
                    sx={{ bgcolor: '#A020F0' }}
                >
                    Check In<CheckBoxIcon />
                </Button>
            )}
            
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default AddAttendance;
