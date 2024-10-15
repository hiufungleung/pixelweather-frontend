// Import necessary modules and components
import React, { useState } from 'react';
import { 
    TouchableOpacity, 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Image, 
    Share 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientTheme from '@/components/GradientTheme'; // Custom theme component
import * as ColorScheme from '@/constants/ColorScheme'; // Color constants
import * as Mappings from '@/constants/Mappings'; // Mappings for weather names
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/components/accAuth'; // Authentication hook

export default function PostCompletedScreen() {
    const { returnData } = useLocalSearchParams(); // Retrieve data from query params
    const navigation = useNavigation();
    const router = useRouter();

    // Handle navigation to the "logs" screen with direct refresh
    const handleViewPost = () => {
        navigation.navigate('logs', {
            screen: 'Posted',
            params: { directRefresh: true },
        });
    };

    // Log and parse the return data from query params
    console.log('returnData:', returnData);
    const parsedReturnData = returnData ? JSON.parse(returnData) : null;
    console.log('parsedReturnData:', parsedReturnData);

    // Function to handle sharing the post details
    const onShare = async () => {
        if (!parsedReturnData) {
            console.error('No data to share');
            return;
        }
        try {
            const { suburb_name, weather, comment, created_at } = parsedReturnData;

            const result = await Share.share({
                message: `Beware of the weather in ${suburb_name}: It's ${Mappings.WeatherNamesMapping[weather]}!\n\n${comment}\n\nPosted on: ${new Date(created_at).toLocaleString()}`,
            });

            if (result.action === Share.sharedAction) {
                console.log(
                    result.activityType 
                        ? `Shared with activity type: ${result.activityType}` 
                        : 'Post shared successfully!'
                );
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing the post:', error.message);
        }
    };

    return (
        <GradientTheme>
            <View style={styles.container}>
                {/* Back button to navigate to the map screen */}
                <TouchableOpacity onPress={() => router.push('/(map)/map')}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>

                {/* Card displaying post completion details */}
                <View style={styles.card}>
                    <Image 
                        source={require('@/assets/icons/16.png')} 
                        style={styles.icon} 
                        resizeMode="contain" 
                    />
                    <Text style={styles.header}>Successful!</Text>
                    <Text style={styles.label}>Thank you for your sharing!</Text>

                    {/* Buttons for sharing and viewing the post */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onShare} style={styles.saveButton}>
                            <Text style={styles.saveText}>SHARE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleViewPost} style={styles.saveButton}>
                            <Text style={styles.saveText}>VIEW THE POST</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GradientTheme>
    );
}

// Stylesheet for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '5%',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFFA3', // Semi-transparent white
        paddingHorizontal: '10%',
        paddingTop: '10%',
        borderRadius: 10,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: '10%',
        color: ColorScheme.BTN_BACKGROUND,
    },
    backButton: {
        fontSize: 40,
        color: 'black',
    },
    icon: {
        width: '70%',
        height: '35%',
        alignSelf: 'center',
        marginBottom: '10%',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: '5%',
        alignSelf: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: '5%',
        borderRadius: 10,
        width: '90%',
        marginBottom: '4%',
    },
    saveText: {
        color: 'white',
        textAlign: 'center',
    },
});
