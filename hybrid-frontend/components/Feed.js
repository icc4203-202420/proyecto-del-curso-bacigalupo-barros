import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveItem, getItem } from '../Storage';

const FeedItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('BeerDetails', { id: item.content.beer_id });
  };

  return (
    <View style={styles.feedItem}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{item.user.first_name} {item.user.last_name}</Text>
        <Text style={styles.handle}>@{item.user.handle}</Text>
      </View>
      
      <View style={styles.reviewContent}>
        <Text onPress={handlePress} style={styles.beerName}>
          {item.content.beer_name}
        </Text>
        <Text style={styles.rating}>Rating: {item.content.rating}/5</Text>
        <Text style={styles.reviewText}>{item.content.text}</Text>
      </View>
      
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );
};

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
    fetchFeed();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A020F0" />
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
          onEndReached={() => hasMore && fetchFeed()}
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  handle: {
    color: '#666',
    marginLeft: 8,
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
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

export default Feed;