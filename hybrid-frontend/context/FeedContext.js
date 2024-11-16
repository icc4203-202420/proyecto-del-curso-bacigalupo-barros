// context/FeedContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';
import { API_URL, CABLE_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

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
      const userId = await SecureStore.getItemAsync('userId');
      const token = await SecureStore.getItemAsync('token');

      if (!userId || !token) return;

      const fetchPosts = async () => {
        dispatch({ type: 'LOADING' });
        try {
          const response = await fetch(`${API_URL}/posts`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          dispatch({ type: 'SET_POSTS', payload: data });
        } catch (error) {
          dispatch({ type: 'ERROR', payload: error.message });
        }
      };

      await fetchPosts();

      // Set up WebSocket
      const cable = createConsumer(`${CABLE_URL}?user_id=${userId}`);
      const subscription = cable.subscriptions.create(
        {
          channel: 'FeedChannel',
        },
        {
          received: (data) => {
            dispatch({ type: 'ADD_POST', payload: data.post });
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
