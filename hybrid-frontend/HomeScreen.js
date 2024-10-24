import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LogOut from './screens/LogOut';  
import { useNavigation } from '@react-navigation/native'; 

const HomeScreen = () => {
  const navigation = useNavigation(); 
  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to BARMAN!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="View Beers"
          onPress={() => navigation.navigate('Beers')}
          color="#A020F0"
        />
      </View>

      <View style={styles.buttonContainer}>
        <LogOut onLogout={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%', 
    marginTop: 20, 
  },
});

export default HomeScreen;
