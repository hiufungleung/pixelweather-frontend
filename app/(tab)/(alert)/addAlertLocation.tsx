import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import SuburbSearch from '@/components/SuburbSearch';

export default function AddAlertWeather() {

    const router = useRouter();

    const placeholder = {
        label: 'Select an alert weather type',
        value: null,
    };

    const [selectedValue, setSelectedValue] = useState(null);

    const options = [
        { label: 'Clear Sky', value: '40' },
        { label: 'Rainy', value: '20' },
        { label: 'Cloudy', value: '43' },
        { label: 'Thunderstorm', value: '1' },
        { label: 'Windy', value: '45' },
        { label: 'Storm', value: '46' },
        { label: 'Fog', value: '34' },
        { label: 'Hail', value: '47' },
        { label: 'Hot', value: '48' },
        { label: 'Cold', value: '49' },
    ];

    return (
        <GradientTheme>
        {/* Add Alert Location Section */}
                <View style={styles.popUp}>
                    <Text style={styles.popUpHeader}>Add Alert Location</Text>
                    <Text style={styles.popUpText}>Search suburb name in Queensland</Text>
                    <SuburbSearch />
                    <View style={styles.popUpBtnContainer}>
                        <TouchableOpacity style={styles.popUpBtn}>
                            <Text style={styles.popUpBtnText}>Add Type</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popUpBtn}>
                            <Text style={styles.popUpBtnText} onPress={() => router.back()}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </GradientTheme>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '5%',
        marginTop: '15%',
    },
    headerContainer: {
        flexDirection: 'row', // Puts the text and icon in a row
        justifyContent: 'space-between', // Aligns text to the left and icon to the right
        alignItems: 'center', // Vertically centers the text and icon
        marginBottom: '2%',
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: '3%',
        alignSelf: 'flex-start',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '96%',
        left: 7,
    },
    alertButtonContainer: {
        marginBottom: '1%',
        width: '48%',
    },
    deleteButton: {
        position: 'absolute',
        top: -5,
        zIndex: 10,
    },
    alertTimingContainer: {
        width: '96%',
    },
    popUp: {
        backgroundColor: '#FFFFFFB3',
        padding: '6%',
        margin: '3%',
        marginTop: '70%',
        borderRadius: 10,
    },
    popUpHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        marginVertical: '3%',
    },
    popUpText: {
        color: ColorScheme.BTN_BACKGROUND,
        marginBottom: '5%',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: '4%',
        borderRadius: 5,
        marginBottom: '8%',
        backgroundColor: 'white',
    },
    popUpBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: '5%',
    },
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
