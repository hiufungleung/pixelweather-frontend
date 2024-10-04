import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Alert, Button } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import PostTemplate from '@/components/PostTemplate';
import * as ColorScheme from '@/constants/ColorScheme';
import { useAuth } from '@/components/accAuth'
import { API_LINK } from '@/constants/API_link';

export default function PostedScreen() {
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
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userToken } = useAuth(); // Replace with actual token

    // Fetch the posted posts data
    const fetchPostedPosts = async () => {
        try {
            const response = await fetch(`${API_LINK}/posts`, {
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
            setError('Failed to fetch posted posts.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle deleting a post
    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`${API_LINK}/posts`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: postId }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Post deleted successfully.');
                // Remove the post from the state
                setData(data.filter(post => post.post_id !== postId));
            } else {
                const errorResponse = await response.json();
                Alert.alert('Error', errorResponse.error || 'Failed to delete the post.');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to connect to the server.');
        }
    };

    useEffect(() => {
        fetchPostedPosts();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={ColorScheme.BTN_BACKGROUND} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

     if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ margin: '2%' }}>Error: {error}</Text>
                <Button title='back' />
            </View>
        );
    }

    // Render each post with the delete button if it is the user's post
    const renderItem = ({ item }) => (
        <PostTemplate
            postId={item.post_id}
            weatherCondition={item.weather_category}
            comment={item.comment}
            location={item.suburb_name}
            postedTime={item.created_at}
            likes={item.likes}
            isSelfPost={true} // Posted posts are self posts
            onDelete={handleDeletePost} // Pass the delete handler to the post template
        />
    );

    return (
        <GradientTheme>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.post_id.toString()}
                contentContainerStyle={styles.flatListContent}
            />
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    flatListContent: {
        alignItems: 'center',
        paddingVertical: 10,
    },
});
