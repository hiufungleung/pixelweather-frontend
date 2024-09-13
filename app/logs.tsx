import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostTemplate from '@/components/PostTemplate'
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme'

// Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

// Sample data for testing
const data = [
    {
        postId: 1,
        icon: '☀️',
        weatherCondition: 'Sunny',
        location: '49-1 Boomerang Rd \nSt Lucia',
        postedTime: '2024-09-13T04:00:00Z',
        likes: 20000,
    },
    {
        postId: 2,
        icon: '🌧️',
        weatherCondition: 'Rainy',
        location: '12 James St \nFortitude Valley',
        postedTime: '2024-09-12T11:30:00Z',
        likes: 1350,
    },
    {
        postId: 3,
        icon: '⛅',
        weatherCondition: 'Cloudy',
        location: '25 Main St \nSouth Bank',
        postedTime: '2024-09-12T09:15:00Z',
        likes: 999,
    },
    {
        postId: 4,
        icon: '🌩️',
        weatherCondition: 'Stormy',
        location: '500 Queen St \nBrisbane',
        postedTime: '2024-09-11T23:00:00Z',
        likes: 3005,
    },
    {
        postId: 5,
        icon: '❄️',
        weatherCondition: 'Snowy',
        location: '10 Beach Ave \nGold Coast',
        postedTime: '2024-09-10T05:00:00Z',
        likes: 150,
    },
    {
        postId: 6,
        icon: '🌤️',
        weatherCondition: 'Clear',
        location: '35 Park Rd \nToowong',
        postedTime: '2024-09-12T07:45:00Z',
        likes: 9500,
    },
];

// Viewed Screen
function ViewedScreen() {
    const renderItem = ({ item }) => (
        <PostTemplate
            postId={item.postId}
            icon={item.icon}
            weatherCondition={item.weatherCondition}
            location={item.location}
            postedTime={item.postedTime}
            likes={item.likes}
        />
    );

    return (
        <GradientTheme>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.postId.toString()}
                contentContainerStyle={styles.flatListContent}
            />
        </GradientTheme>
    );
}

// Posted Screen
function PostedScreen() {
    const renderItem = ({ item }) => (
        <PostTemplate
            postId={item.postId}
            icon={item.icon}
            weatherCondition={item.weatherCondition}
            location={item.location}
            postedTime={item.postedTime}
            likes={item.likes}
        />
    );
    return (
        <GradientTheme>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.postId.toString()}
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
          }}>
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
        paddingTop: 10,
    },
    text: {
        fontSize: 18,
    },
});
