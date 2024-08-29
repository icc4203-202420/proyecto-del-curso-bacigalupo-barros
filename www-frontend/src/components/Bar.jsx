import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Card, CardContent,Paper, Grid, CircularProgress, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const Bars = () => {
    const [bars, setBars] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
    }, [])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredBars = bars?.filter((bar) =>
        bar.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Container>
            <Typography variant="h2" 
                sx={{ 
                    marginBottom: 3, 
                    color: '#000000',
                    textAlign: 'center', 
                    fontFamily: 'Times New Roman, serif'
                }}>
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
                <Grid container spacing={3}>
                    {filteredBars.map((bar) => (
                        <Grid item xs={12} sm={6} md={4} key={bar.id}>
                            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center'}}>
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
                                <Typography variant="body2" >
                                    Address ID: {bar.address_id}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/bars/${bar.id}/events`}
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        marginTop: 2, 
                                        borderRadius: 1, 
                                        paddingX: 2
                                    }}
                                >
                                    Ver Eventos
                                </Button>
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