import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import PostedScreen from './PostedScreen';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/accAuth';

export default function PostedTab() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    // If the user is not logged in, login screen is displayed
    if (!isLoggedIn) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{fontSize: 15, marginBottom: '3%'}}>
                    Please log in to view your posted posts.
                </Text>
                <TouchableOpacity
                    style={styles.popUpBtn}
                    onPress={() => router.push('/login')}>
                    <Text style={styles.popUpBtnText}>Sign up or log in</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <PostedScreen />;
}

const styles = StyleSheet.create({
    popUpBtn: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: '4%',
        borderRadius: 10,
        width: '45%',
    },
    popUpBtnText: {
        color: 'white',
        textAlign: 'center',
    }
});