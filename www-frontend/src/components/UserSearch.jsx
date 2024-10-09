import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Grid, CircularProgress, TextField, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import AddFriend from './AddFriend';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const UsersSearch = () => {
    const [users, setUsers] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/users`);
                const data = response.data;

                if (data.users) {
                    setUsers(data.users);
                }

                const token = localStorage.getItem('authToken');
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1])); // para poder sacar el user del token
                    setUserId(decodedToken.sub);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleCardClick = (id) => {
        navigate(`/users/${id}`);
    };

    const handleAddFriend = (friendship) => {
        console.log('New friendship:', friendship);
    };

    const filteredUsers = users?.filter((user) =>
        user.handle.toLowerCase().includes(searchTerm)
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
                Buscar Usuarios
            </Typography>
            <TextField
                label="Buscar por Handle"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 3 }}
                onChange={handleSearchChange}
                value={searchTerm}
            />
            {users ? (
                <Grid container spacing={2}>
                    {filteredUsers.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Card>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: 2,
                                        color: '#000000',
                                        fontFamily: 'Times New Roman, serif'                                    
                                    }}
                                >
                                    {user.handle}
                                </Typography>
                                <Typography sx={{
                                        color: '#000000',
                                        fontFamily: 'Times New Roman, serif'                                    
                                    }}>
                                    <strong>Name:</strong> {user.first_name} {user.last_name}
                                </Typography>
                                <Typography sx={{
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}>
                                    {userId && user.id !== userId && (
                                        <AddFriend userId={userId} friendId={user.id} onAddFriend={handleAddFriend} />
                                    )}
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

export default UsersSearch;
