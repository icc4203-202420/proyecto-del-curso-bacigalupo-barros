import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import AddFriend from './AddFriend';
import { useNavigation } from '@react-navigation/native'; 
import { API_URL } from '../config';

const UsersSearch = () => {
    const [users, setUsers] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/users`);
                const data = response.data;

                if (data.users) {
                    setUsers(data.users);
                }

                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
                    setUserId(decodedToken.sub);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSearchChange = (text) => {
        setSearchTerm(text.toLowerCase());
    };

    const handleCardClick = (id) => {
        navigation.navigate('UserDetail', { userId: id });
    };

    const handleAddFriend = (friendship) => {
        console.log('New friendship:', friendship);
    };

    const filteredUsers = users?.filter((user) =>
        user.handle.toLowerCase().includes(searchTerm)
    );

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                Buscar Usuarios
            </Text>
            <TextInput
                placeholder="Buscar por Handle"
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 20,
                    paddingLeft: 8
                }}
                onChangeText={handleSearchChange}
                value={searchTerm}
            />
            {users ? (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(user) => user.id.toString()}
                    renderItem={({ item: user }) => (
                        <TouchableOpacity onPress={() => handleCardClick(user.id)} style={{ marginBottom: 15, padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}>
                            <Text style={{ fontSize: 18, marginBottom: 5 }}>{user.handle}</Text>
                            <Text><strong>Nombre:</strong> {user.first_name} {user.last_name}</Text>
                            {userId && user.id !== userId && (
                                <View style={{ marginTop: 10 }}>
                                    <AddFriend userId={userId} friendId={user.id} onAddFriend={handleAddFriend} />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{ paddingBottom: 20 }} 
                />
            ) : (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            )}
        </ScrollView>
    );
};

export default UsersSearch;
