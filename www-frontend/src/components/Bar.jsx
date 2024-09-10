import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Paper, Grid, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const Bars = () => {
    const [bars, setBars] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); 

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
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleCardClick = (id) => {
        navigate(`/bars/${id}/events`);
    };

    const filteredBars = bars?.filter((bar) =>
        bar.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Container>
            <Typography
                variant="h2"
                sx={{
                    marginBottom: 3,
                    color: '#000000',
                    textAlign: 'center',
                    fontFamily: 'Times New Roman, serif'
                }}
            >
                Lista de Bares
            </Typography>
            <TextField
                label="Buscar Bares"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 3 }}
                onChange={handleSearchChange}
                value={searchTerm}
            />
            {bars ? (
                <Grid container spacing={2}>
                    {filteredBars.map((bar) => (
                        <Grid item xs={12} sm={6} md={4} key={bar.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}
                                onClick={() => handleCardClick(bar.id)} 
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: 2,
                                        color: '#000000',
                                        fontFamily: 'Times New Roman, serif'                                    
                                    }}
                                >
                                    {bar.name} | {bar.id}
                                </Typography>
                                <Typography variant="body2">
                                    Address ID: {bar.address_id}
                                </Typography>
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
