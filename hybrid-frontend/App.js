import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
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
import Feed from './components/Feed';
import { FeedProvider } from './context/FeedContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente de Tab Navigation
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
      <Tab.Screen name="Feed" component={Feed} /> 
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('No se pueden recibir notificaciones. Permisos no concedidos.');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Token de notificación:', token);
      setExpoPushToken(token);
      // Aquí podrías enviar el token al servidor para que lo almacene
    };

    registerForPushNotificationsAsync();

    // Manejar la recepción de notificaciones
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notificación recibida:', notification);
      // Aquí puedes manejar la lógica de navegación cuando llega una notificación
    });

    return () => subscription.remove();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <FeedProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="BeerDetails" component={BeerDetails} />
          <Stack.Screen name="BeerReviews" component={BeerReviews} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="AddAttendance" component={AddAttendance} />
          <Stack.Screen name="Attendances" component={Attendances} />
        </Stack.Navigator>
      </NavigationContainer>
    </FeedProvider>

  );
}
