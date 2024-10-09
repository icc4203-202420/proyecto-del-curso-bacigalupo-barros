import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './HomeScreen';
import Beers from './components/Beers';
import BeerDetails from './components/BeerDetails';
import BeerReviews from './components/BeerReviews';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Beers" component={Beers} />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerReviews" component={BeerReviews} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
