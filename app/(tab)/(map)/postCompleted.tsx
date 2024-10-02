import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, Image, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function PostCompletedScreen() {
    const { returnData, setReturnData } = useLocalSearchParams();
    const navigation = useNavigation();
    const handleViewPost = () => {
                // Navigate to postConfirm with query params
                navigation.navigate('logs', { screen: 'Posted' });
            };

    const handleBackToHome = () => {
        navigation.navigate('map'); //
    };

    const parsedReturnData = returnData ? JSON.parse(returnData) : null;

    // Function to handle post sharing
        const onShare = async () => {
            if (!parsedReturnData) {
                    console.error('No data to share');
                    return;
                }
            try {
                const { suburb_name, weather, comment, created_at } = parsedReturnData.data;

                const result = await Share.share({
                    message: `Beware of the weather in ${suburb_name}: It's ${weather}! \n\n${comment} \n\nPosted on: ${new Date(created_at).toLocaleString()}`,
                });

                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        console.log('Shared with activity type:', result.activityType);
                    } else {
                        console.log('Post shared successfully!');
                    }
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
                <View style={styles.card}>
                    <Image source={require('@/assets/icons/16.png')} style={styles.icon} />
                    <Text style={styles.header}>Successful!</Text>
                    <Text style={styles.label}>Thank you for your sharing!</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onShare} style={styles.saveButton}>
                            <Text style={styles.saveText}>SHARE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleViewPost} style={styles.saveButton}>
                            <Text style={styles.saveText}>VIEW THE POST</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
                            <Text style={styles.saveText}>BACK TO HOME</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '5%',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFFA3',
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
    preparationTextContainer: {
        backgroundColor: '#FFFFFF',
        marginBottom: '10%',
        padding: '7%',
        borderRadius: 10,
    },
    preparationText: {
        fontSize: 18,
    },
    buttonContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: '5%',
    },
    saveButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: '4%',
        borderRadius: 10,
        width: '49%',
        marginBottom: '4%',
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        textAlign: 'center',
    },
    backButtonContainer: {
        marginTop: '5%',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: '5%',
        borderRadius: 10,
        width: '100%',  //
        alignItems: 'center',
    },
});