import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostTemplate from '@/components/PostTemplate'
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme'

// Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

// API calls to fetch viewed posts here

// Sample data for testing
const initialData =
    {
      'message': 'Data retrieved Successfully',
      'data': [
        {
          'post_id': 1,
          'latitude': -33.8688,
          'longitude': 151.2093,
          'suburb_id': 101,
          'suburb_name': 'Brisbane City',
          'weather_id': 1,
          'weather_category': 'Clear Sky',
          'weather': 'Clear Sky',
          'weather_code': 100,
          'created_at': '2024-09-16T10:00:00Z',
          'likes': 10,
          'views': 100,
          'reports': 1,
          'is_active': true,
          'comment': 'It is a sunny day!'
        },
        {
          'post_id': 2,
          'latitude': -34.9285,
          'longitude': 138.6007,
          'suburb_id': 102,
          'suburb_name': 'St. Lucia',
          'weather_id': 2,
          'weather_category': 'Rainy',
          'weather': 'Light Rain',
          'weather_code': 200,
          'created_at': '2024-09-16T11:00:00Z',
          'likes': 5,
          'views': 50,
          'reports': 0,
          'is_active': true,
          'comment': 'It is raining heavily!'
        }
      ]
    };

// function to render post items
const renderItem = ({ item }) => (
        <PostTemplate
            postId={item.post_id}
            weatherCondition={item.weather_category}
            comment={item.comment}
            location={item.suburb_name}
            postedTime={item.created_at}
            likes={item.likes}
            isSelfPost={false}
        />
);

// Viewed Screen
function ViewedScreen() {
    const [data, setData] = useState(initialData.data);  // This is your post data
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        // Simulate fetching new data (e.g., making an API call)
        setTimeout(() => {
            // Assuming new data would replace or update the existing data
            const newData = [
                {
                    postId: 7,
                    icon: '🌧️',
                    weatherCondition: 'Now it is Rainy',
                    location: '25 Queen St \nBrisbane',
                    postedTime: '2024-09-13T09:00:00Z',
                    likes: 12000,
                },
            ];

            setData(newData);  // Update the data
            setRefreshing(false);  // Stop the refreshing indicator
        }, 2000);  // Simulating a network request delay
    }, []);

    return (
        <GradientTheme>
            <FlatList
                data={initialData.data}
                renderItem={renderItem}
                keyExtractor={(item) => item.post_id.toString()}
                contentContainerStyle={styles.flatListContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </GradientTheme>
    );
}

// API calls to fetch posted posts here

const postData =
{
  'message': 'Data retrieved Successfully',
  'data': [
    {
      'post_id': 1,
      'latitude': -33.8688,
      'longitude': 151.2093,
      'suburb_id': 101,
      'suburb_name': 'Brisbane City',
      'weather_id': 1,
      'weather_category': 'Clear Sky',
      'weather': 'Clear Sky',
      'weather_code': 100,
      'created_at': '2024-09-16T10:00:00Z',
      'likes': 10,
      'views': 100,
      'reports': 1,
      'is_active': false,
      'comment': 'It is a sunny day!'
    },
    {
      'post_id': 2,
      'latitude': -33.8688,
      'longitude': 151.2093,
      'suburb_id': 103,
      'suburb_name': 'Sunnybank',
      'weather_id': 1,
      'weather_category': 'Storm',
      'weather': 'Clear Sky',
      'weather_code': 100,
      'created_at': '2024-09-16T10:00:00Z',
      'likes': 10,
      'views': 100,
      'reports': 1,
      'is_active': false,
      'comment': 'It is a sunny day!'
    }
  ]
}

// Posted Screen
function PostedScreen() {
    return (
        <GradientTheme>
            <FlatList
                data={postData.data}
                renderItem={renderItem}
                keyExtractor={(item) => item.post_id.toString()}
                contentContainerStyle={styles.flatListContent}
            />
        </GradientTheme>
    );
}

// Main Logs Component with Top Tabs
export default function LogsScreen() {

    return (
        <GradientTheme>
            <Tab.Navigator
                initialRouteName="Viewed"
                screenOptions={{
                    tabBarActiveTintColor: '#6200EE',
                    tabBarInactiveTintColor: '#AAA',
                    tabBarIndicatorStyle: { backgroundColor: '#6200EE' },
                    tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
                    tabBarStyle: {
                        backgroundColor: 'translucent',
                        elevation: 0,
                        paddingTop: 50},
                }}
            >
                <Tab.Screen
                    name="Viewed"
                    component={ViewedScreen}
                    options={{ tabBarLabel: 'VIEWED' }}
                />
                <Tab.Screen
                    name="Posted"
                    component={PostedScreen}
                    options={{ tabBarLabel: 'POSTED' }}
                />
            </Tab.Navigator>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1,
        gap: 8,
    },
    flatListContent: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    text: {
        fontSize: 18,
    },
});
