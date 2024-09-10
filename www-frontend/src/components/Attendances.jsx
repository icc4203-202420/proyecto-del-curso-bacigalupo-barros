import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, CircularProgress, Card } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Attendances = ({ event_id }) => {
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState('');
    const { bar_id } = useParams();

    useEffect(() => {
        const fetchAttendances = async () => {
            const token = localStorage.getItem('authToken'); 

            try {
                const response = await axios.get(
                    `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` 
                        }
                    }
                );

                if (Array.isArray(response.data)) {
                    setAttendances(response.data);
                }
            } catch (error) {
                console.error("Error fetching attendances:", error);
                setError('Failed to fetch attendances. Please try again.');
            }
        };

        if (event_id) {
            fetchAttendances();
        }
    }, [bar_id, event_id]);

    return (
        <Container>
            <Typography variant="h4" sx={{ marginBottom: 3, color: '#000000', textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                <strong>Attendances for Event</strong>
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {attendances.length > 0 ? (
                <Grid container spacing={3}>
                    {attendances.map((attendance) => (
                        <Grid item xs={12} sm={6} md={4} key={attendance.user_id}>
                            <Card elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ marginBottom: 3, color: '#000000', textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
                                    {attendance.first_name} {attendance.last_name} {attendance.handle}
                                </Typography>
                                <Typography>
                                    Checked In: {attendance.checked_in ? 'Yes' : 'No'}
                                </Typography>
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

export default Attendances;
