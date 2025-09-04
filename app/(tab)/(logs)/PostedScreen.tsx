import React, { useCallback, useEffect } from 'react';
import GradientTheme from '@/components/GradientTheme';
import PostList from '@/components/PostList';
import { usePosts } from '@/hooks/usePosts';
import ErrorMessage from '@/components/ErrorMessage';
import { ActivityIndicator } from 'react-native';
import * as ColorScheme from '@/constants/ColorScheme';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import * as RN from 'react-native';

export default function PostedScreen() {
    const { data, likedPosts, reportedPosts, selfPosts, refreshing, loading, error,
        handleToggleLike, handleDeletePost, handleReportPost, fetchPosts,
        fetchLikedPosts } = usePosts();
    const router = useRouter();
    const { directRefresh } = useLocalSearchParams();

    // Get params passed when navigating to this screen

    const onRefresh = useCallback(() => {
        fetchPosts();
        fetchLikedPosts();
    }, []);

    // Trigger refresh when the screen is focused (navigated to) with `directRefresh` param
    useFocusEffect(
        useCallback(() => {
            if (directRefresh) {
                onRefresh();
            }
        }, [directRefresh, onRefresh])
    );

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color={ColorScheme.BTN_BACKGROUND}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            />
        );
    }

    if (error) {
        return <ErrorMessage error={error} onRetry={onRefresh} />;
    }

    return (
        <PostList
            data={data}
            refreshing={refreshing}
            onRefresh={onRefresh}
            likedPosts={likedPosts}
            reportedPosts={reportedPosts}
            selfPosts={data}  // all posts are self posts
            handleToggleLike={handleToggleLike}
            handleReportPost={handleReportPost}
            handleDeletePost={handleDeletePost}
            router={router}
        />
    );
}
