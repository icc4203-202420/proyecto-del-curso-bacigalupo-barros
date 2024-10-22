import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';  // Importar Tab Navigator
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './HomeScreen';
import Beers from './components/Beers';
import BeerDetails from './components/BeerDetails';
import BeerReviews from './components/BeerReviews';
import UsersSearch from './components/UserSearch';
import Bars from './components/Bars';
import Events from './components/Events';
import AddAttendance from './components/AddAttendances';
import Attendances from './components/Attendances';
import EventGallery from './components/EventGallery';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();  

// componente de Tab Navigation
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ 
        tabBarActiveTintColor: '#A020F0',  
        tabBarInactiveTintColor: '#000',  
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Beers" component={Beers} />
      <Tab.Screen name="UserSearch" component={UsersSearch} />
      <Tab.Screen name="Bars" component={Bars} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerReviews" component={BeerReviews} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="AddAttendance" component={AddAttendance} />
        <Stack.Screen name="Attendances" component={Attendances} />
        <Stack.Screen name="EventGallery" component={EventGallery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
