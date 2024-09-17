import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GradientTheme from '@/components/GradientTheme';
import AlertButton from '@/components/AlertButton';
import TimingBar from '@/components/TimingBar';

// Edit Button Component for editing Alert Type and Areas
function EditButton({ onPress, section }) {
    return (
        <TouchableOpacity style={styles.editButton} onPress={() => onPress(section)}>
            <FontAwesome name="edit" size={24} color="black" />
        </TouchableOpacity>
    );
}

// Main component
export default function AlertsScreen() {
    const [editingSection, setEditingSection] = useState(null); // Track the section being edited

    // Toggle edit mode for a specific section
    const toggleEditMode = (section) => {
        if (editingSection === section) {
            setEditingSection(null); // Exit edit mode for this section
        } else {
            setEditingSection(section); // Enter edit mode for this section
        }
    };

    // Render Alert Buttons with or without delete button based on edit mode
    function renderAlertButtons(data, isEditMode) {
        return data.map((item, index) => (
            <View key={index} style={styles.alertButtonContainer}>
                {isEditMode && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                        <FontAwesome name="minus-circle" size={20} color="red" />
                    </TouchableOpacity>
                )}
                <AlertButton alertText={item.category || item.suburb_name} />
            </View>
        ));
    }

    // Handle Delete button press
    const handleDelete = (item) => {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete ${item.category || item.suburb_name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => {
                        // Implement the delete logic here
                    }
                }
            ]
        );
    };

    const alertLocations = {
        'message': 'Data retrieved Successfully',
        'data': [
            { 'id': 101, 'suburb_name': 'Brisbane City' },
            { 'id': 102, 'suburb_name': 'St. Lucia' }
        ]
    };

    const alertTypes = {
        'message': 'Data retrieved Successfully',
        'data': [
            { 'id': 1, 'category': 'Rainy' },
            { 'id': 2, 'category': 'Sunny' }
        ]
    };

    return (
        <GradientTheme>
            <ScrollView style={styles.container}>
                {/* Alert Type Section */}
                <View style={styles.section}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Alert Type</Text>
                        <EditButton onPress={toggleEditMode} section="alertType" />
                    </View>
                    <View style={styles.buttonContainer}>
                        {renderAlertButtons(alertTypes.data, editingSection === 'alertType')}
                        <AlertButton alertText="+" />
                    </View>
                </View>

                {/* Alert Area Section */}
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Areas</Text>
                        <EditButton onPress={toggleEditMode} section="alertArea" />
                    </View>
                    <View style={styles.buttonContainer}>
                        {renderAlertButtons(alertLocations.data, editingSection === 'alertArea')}
                        <AlertButton alertText="+" />
                    </View>
                </View>

                {/* Alert Timing Section */}
                <View style={{ paddingBottom: 30 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Alert Timing</Text>
                        <EditButton onPress={toggleEditMode} section="alertTiming" />
                    </View>
                    <View style={styles.timingBarContainer}>
                        <TimingBar />
                        <TimingBar startTime="07:00" endTime="19:00" />
                        <TimingBar startTime="16:00" endTime="17:00" />
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
        alignSelf: 'flex-start',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        left: 7,
    },
    alertButtonContainer: {
        marginBottom: 10,
        width: '100%',
    },
    deleteButton: {
        position: 'absolute',
        left: -5, // Position the delete button near the alert button
        top: -5,
        zIndex: 10,
    },
});
