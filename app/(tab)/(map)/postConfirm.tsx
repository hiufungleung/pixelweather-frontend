import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import * as WeatherIcons from '@/constants/WeatherIcons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

// simulation of successfully posted data
const returnData =
    {
      'message': 'Data created Successfully',
      'data': {
        'id': 1,
        'latitude': -33.8688,
        'longitude': 151.2093,
        'suburb_id': 2,
        'suburb_name': 'Brisbane City',
        'postcode': 4000,
        'state_code': 'QLD',
        'weather_id': 1,
        'weather': 'Sunny',
        'weather_code': 100,
        'created_at': '2024-09-16T10:00:00Z',
        'likes': 0,
        'views': 0,
        'reports': 0,
        'is_active': true,
        'comment': 'It iss a sunny day!'
      }
    }

export default function PostConfirm() {
    const { weather, preparationText } = useLocalSearchParams(); // Get the query params
    const router = useRouter();
    const { postData, setPostData } = useState(null);

    const weatherIcon = WeatherIcons.weatherIconMap[weather];

    const handlePostPress = () => {
            // Navigate to postConfirm with query params
            router.push({
                pathname: 'postCompleted',
                params:  { returnData: JSON.stringify(returnData) },
            });
        };

    return (
        <GradientTheme>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <View style={styles.card}>
                    <Text style={styles.header}>Post Confirm</Text>

                    {weatherIcon && (
                        <Image source={weatherIcon} style={styles.icon} />
                    )}

                    <Text style={styles.label}>Now it's {weather}</Text>
                    <View style={styles.preparationTextContainer}>
                        <Text style={styles.preparationText}>{preparationText}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>BACK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePostPress} style={styles.saveButton}>
                            <Text style={styles.saveText}>POST</Text>
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
    },
    icon: {
        width: '55%',
        height: '30%',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        fontSize: 40,
        color: 'black',
    },
    cancelButton: {
        backgroundColor: ColorScheme.SECOND_BTN,
        padding: '5%',
        borderRadius: 10,
        width: '45%',
    },
    cancelText: {
        textAlign: 'center',
        color: 'red',
    },
    saveButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: '5%',
        borderRadius: 10,
        width: '45%',
    },
    saveText: {
        color: 'white',
        textAlign: 'center',
    },
});