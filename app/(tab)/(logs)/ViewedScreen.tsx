import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Button } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import PostTemplate from '@/components/PostTemplate';
import * as ColorScheme from '@/constants/ColorScheme';
import { useAuth } from '@/components/accAuth'
import { API_LINK } from '@/constants/API_link';

export default function ViewedScreen() {
    const [data, setData] = useState([
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
    );
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userToken } = useAuth();

    const fetchViewedPosts = async () => {
        try {
            const response = await fetch(`${API_LINK}/posts/view`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                setData(jsonResponse.data);
            } else {
                const errorResponse = await response.json();
                setError(errorResponse.error);
            }
        } catch (err) {
            setError('Failed to fetch viewed posts.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchViewedPosts();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchViewedPosts();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={ColorScheme.BTN_BACKGROUND} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{margin: '2%',}}>Error: {error}</Text>
                <Button title="Back"/>
            </View>
        );
      }

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

    return (
        <GradientTheme>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.post_id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.flatListContent}
            />
        </GradientTheme>
    );
};

const styles = StyleSheet.create({
    flatListContent: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

