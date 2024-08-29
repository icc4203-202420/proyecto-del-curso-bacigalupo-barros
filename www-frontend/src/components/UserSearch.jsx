import React, { useState } from 'react';
import axios from 'axios'; //para futura implementación de los requests
import { TextField, Button, Container, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserSearch = () => {
    const [handle, setHandle] = useState("");

    const handleInputChange = (state) => {
        setHandle(state.target.value);
    };
    const handleSearch = () => {
        console.log("Buscando usuario:", handle);
    };

    return (
        <Container style={{ marginTop: '20px', textAlign: 'center' }}>
            <Typography variant="h2" 
                sx={{ 
                    marginBottom: 3, 
                    textAlign: 'center', 
                    color: "#000000",
                    fontFamily: 'Times New Roman, serif'
                }}>
                Search User by Handle
            </Typography>
            <TextField
                label="User's Handle" 
                variant="outlined"
                value={handle}
                onChange={handleInputChange}
                style={{ marginBottom: '20px', width: '300px' }}
                InputProps={{
                    style: {
                        color: 'black', //visible text
                    },
                }}
                InputLabelProps={{
                    style: {
                        color: 'black', // visible label
                    },
                }}
            />
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
            >
                <AccountCircleIcon /> Search
            </Button>
        </Container>
    );
};

export default UserSearch;
