import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GradientTheme from '@/components/GradientTheme';
import AlertButton from '@/components/AlertButton';
import TimingBar from '@/components/TimingBar';

// Edit Button Component for editing Alert Type and Areas
function EditButton() {
    return (
        <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={24} color="black" />
        </TouchableOpacity>
    );
}

function renderAlertButtons(data) {
    return data.map((item, index) => (
        <AlertButton alertText={item.weather || item.suburb_name} key={index}/>
    ))
}

const alertLocations = [
    { "suburb_name": 'Woolloongabba' },
    { "suburb_name": 'Brisbane City' },
    { "suburb_name": 'Sunnybank' },
    { "suburb_name": 'Greenslopes' },
    { "suburb_name": 'St. Lucia' },
]

const alertTypes = [
    { "weather": 'Thunderstorm' },
    { "weather": 'Rain' },
    { "weather": 'Drizzle' },
    { "weather": 'Hail' },
    { "weather": 'Squalls' },
]

// Main component
export default function AlertsScreen() {
    const [isEditMode, setIsEditMode] = useState(false); // Track edit mode state

    // Toggle the edit mode
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <GradientTheme>
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Alert Type</Text>
                        <EditButton />
                    </View>
                    <View style={styles.buttonContainer}>

                        {renderAlertButtons(alertTypes)}

                        <AlertButton alertText="+" />
                    </View>
                </View>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Areas</Text>
                        <EditButton />
                    </View>
                    <View style={styles.buttonContainer}>

                        {renderAlertButtons(alertLocations)}

                        <AlertButton alertText="+" />
                    </View>
                </View>
                <View style={{ paddingBottom: 30 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Alert Timing</Text>
                        <EditButton />
                    </View>
                    <View style={styles.timingBarContainer}>
                        <TimingBar></TimingBar>
                        <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
                        <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
                        <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
                        <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
                        <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
                        <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
                    </View>
                </View>
            </ScrollView>
        </GradientTheme>
    );
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
        marginBottom: 10,
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        alignSelf: 'flex-start', // Aligns the header to the left
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%', // Adjust width to fit buttons better
    },
    timingBarContainer: {
        width: '100%',
    },
});
