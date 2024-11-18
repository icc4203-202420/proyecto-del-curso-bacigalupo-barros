import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Image } from 'react-native';
import axios from 'axios';
import { createConsumer } from '@rails/actioncable';
import { API_URL, CABLE_URL } from '../config';
import { getItem } from '../Storage';
import { useNavigation } from '@react-navigation/native';

const FeedItem = ({ item }) => {
  const navigation = useNavigation();

  const handleBeerPress = () => {
    console.log('Navigating to BeerDetails with ID:', item.content.beer_id);
    navigation.navigate('BeerDetails', { id: item.content.beer_id });
  };
  const handleEventPress = () => {
    console.log('Navigating to Bar with event ID:', item.content.bar_id);
    navigation.navigate('Bars', { id: item.content.bar_id });
  };

  useEffect(() => {
    console.log('Feed item:', item);
    console.log('Content:', item.content);
  }, [item]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.feedItem}>
      {item.content && (
        <>
          {/* Reseña de la cerveza */}
          {item.content.beer_id && (
            <View style={styles.reviewContent}>
              <Text style={styles.beerName} onPress={handleBeerPress}>
                Beer: {item.content.beer_name}
              </Text>
              <Text style={styles.beerName}>Review By: @{item.user.handle}</Text>
              <Text style={styles.rating}>Global Rating: {item.content.global_rating}/5</Text>
              <Text style={styles.rating}>Posted Rating: {item.content.rating}/5</Text>
              <Text style={styles.reviewText}>{item.content.text}</Text>
            </View>
          )}

          {/* Imagen del evento */}
          {item.content.event_picture_id && (
            <View style={styles.eventContent}>
              <Text style={styles.beerName} onPress={handleEventPress}>
              Event: {item.content.event_name}
              </Text>
              <Text style={styles.beerName}>Bar: {item.content.bar_name}</Text>
              <Text style={styles.beerName}>Posted By: @{item.user.handle}</Text>
              <Image
                source={{ uri: item.content.image_url }}
                style={styles.eventImage}
                onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
              />
              <Text style={styles.reviewText}>{item.content.description}</Text>
            </View>
          )}

          {/* Fecha de publicación */}
          {item.created_at && (
            <Text style={styles.timestamp}>Posted on: {formatDate(item.created_at)}</Text>
          )}
        </>
      )}
    </View>
  );
};

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [cable, setCable] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const fetchFeed = async (resetOffset = false) => {
    try {
      const storedToken = await getItem('authToken');
      const token = storedToken ? storedToken.replace(/"/g, '') : null;
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      const newOffset = resetOffset ? 0 : offset;
      console.log('Fetching feed with offset:', newOffset);
      
      const response = await axios.get(`${API_URL}/feed`, {
        params: { offset: newOffset },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Feed response:', response.data);
      const { feed_items, has_more } = response.data;
      
      setFeedItems(prevItems => 
        resetOffset ? feed_items : [...prevItems, ...feed_items]
      );
      setHasMore(has_more);
      setOffset(newOffset + feed_items.length);
    } catch (error) {
      console.error('Error fetching feed:', error.response || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeed(true);
  }, []);

  useEffect(() => {
    const initializeFeed = async () => {
      const userId = await getItem('userId');
      const storedToken = await getItem('authToken');
      const token = storedToken ? storedToken.replace(/"/g, '') : null;
      console.log('User ID:', userId, 'Token:', token);
  
      if (!token) {
        console.error('No token found, user is not authorized.');
        return;
      }

      // Establece la conexión WebSocket
      console.log('Setting up WebSocket...');
      const cable = createConsumer(`${CABLE_URL}?user_id=${userId}&auth_token=${token}`);
      console.log('CABLE: ', cable);
      const subscription = cable.subscriptions.create(
        { channel: 'FeedChannel' },
        {
          connected() {
            console.log('Successfully connected to FeedChannel');
          },
          received(data) {
            console.log('Received data on FeedChannel:', data);
            setFeedItems(prevItems => [data.post, ...prevItems]); // Añadir el nuevo post a la lista de posts
          },
          disconnected(reason) {
            console.log('Disconnected from FeedChannel. Reason:', reason);
          },
        }
      );
      setCable(cable);
      setSubscription(subscription);
    };

    initializeFeed();

    // Cleanup: Desconectar la suscripción al salir
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (cable) {
        cable.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} color="#A020F0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {feedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay actividad reciente</Text>
        </View>
      ) : (
        <FlatList
          data={feedItems}
          renderItem={({ item }) => <FeedItem item={item} />}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            if (hasMore) {
              console.log('Fetching more feed items...');
              fetchFeed();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  feedItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewContent: {
    marginVertical: 8,
  },
  beerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A020F0',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 24,
  },
  eventContent: {
    marginTop: 8,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    color: '#aaa',
  },
});

export default Feed;
