// context/FeedContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';
import { API_URL, CABLE_URL } from '../config';
import * as SecureStore from 'expo-secure-store';
import { saveItem, getItem } from '../Storage';

const FeedContext = createContext();

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

function feedReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case 'ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function FeedProvider({ children }) {
  const [state, dispatch] = useReducer(feedReducer, initialState);

  useEffect(() => {
    const initializeFeed = async () => {
      const userId = await getItem('userId');
      const storedToken = await getItem('authToken');
      const token = storedToken ? storedToken.replace(/"/g, '') : null;
      console.log('User ID:', userId, 'Token:', token);
  
      if (!token) {
        console.error('No token found, user is not authorized.');
        return; // Si no hay token, no seguimos con la conexión WebSocket
      }
  
      // Verificación en el API antes de proceder con la WebSocket
      const fetchFeed = async () => {
        dispatch({ type: 'LOADING' });
        try {
          const response = await fetch(`${API_URL}/feed`, { 
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log('Feed items fetched:', data); 
          dispatch({ type: 'SET_POSTS', payload: data.feed_items });
        } catch (error) {
          console.error('Error fetching feed:', error);
          dispatch({ type: 'ERROR', payload: error.message });
        }
      };
  
      await fetchFeed();
  
      // Establece la conexión WebSocket
      console.log('Setting up WebSocket...');
      const cable = createConsumer(`${CABLE_URL}?user_id=${userId}&auth_token=${token}`);
      console.log('CABLE: ', cable)
      const subscription = cable.subscriptions.create(
        { channel: 'FeedChannel' },
        {
          connected() {
            console.log('Successfully connected to FeedChannel');
          },
          received(data) {
            console.log('Received data on FeedChannel:', data);  // Este log es crucial para verificar si el canal recibe los datos
            dispatch({ type: 'ADD_POST', payload: data.post });
          },
          disconnected(reason) {
            console.log('Disconnected from FeedChannel. Reason:', reason);  // Aquí se capturan los detalles de la desconexión
          },
        }
      );      
  
      return () => {
        subscription.unsubscribe();
        cable.disconnect();
      };
    };
  
    initializeFeed();
  }, []);
  
  return (
    <FeedContext.Provider value={{ state, dispatch }}>
      {children}
    </FeedContext.Provider>
  );
}

export const useFeed = () => useContext(FeedContext);
