import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import AlertButton from '@/components/AlertButton';
import TimingBar from '@/components/TimingBar';
import SuburbSearch from '@/components/SuburbSearch';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/accAuth';
import { API_LINK } from '@/constants/API_link';

// Edit button component for editing Alert Type and Areas
function EditButton({ onPress, section }) {
    return (
        <TouchableOpacity style={styles.editButton} onPress={() => onPress(section)}>
            <FontAwesome name="edit" size={24} color="black" />
        </TouchableOpacity>
    );
}

// Add button component for add alert type, location and timing
function AddButton({ onPress }) {
    return (
        <TouchableOpacity style={styles.editButton} onPress={onPress}>
            <FontAwesome name="plus" size={24} color="black" />
        </TouchableOpacity>
    );
}

// Delete button component to delete alert type and location
function DeleteButton({ item, section, token }) {

    // Handle Delete button press
    const handleDelete = async (item, section, token) => {
        const url =
            section === "alertType"
                ? `${API_LINK}/user_alert_weather` // DELETE weather alert
                : `${API_LINK}/user_alert_suburb`; // DELETE alert location

        // Confirm deletion
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete ${item.category || item.suburb_name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await fetch(url, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`, // Add your auth token here
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ id: item.id }), // Send the id in the request body
                            });

                            const data = await response.json();

                            if (response.ok) {
                                Alert.alert('Success', `Successfully deleted ${item.category || item.suburb_name}`);

                                // Remove the item from the state after successful deletion
                                if (section === "alertType") {
                                    setWeatherAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== item.id));
                                } else if (section === "alertArea") {
                                    setAlertLocations((prevLocations) => prevLocations.filter(location => location.id !== item.id));
                                }
                            } else {
                                if (response.status === 400) {
                                    Alert.alert('Error', 'Missing or invalid ID.');
                                } else if (response.status === 401) {
                                    Alert.alert('Error', 'Invalid or expired token.');
                                } else if (response.status === 422) {
                                    Alert.alert('Error', 'Record does not exist or wrong format.');
                                } else if (response.status === 500) {
                                    Alert.alert('Error', 'Internal server error. Please try again later.');
                                } else {
                                    Alert.alert('Error', 'An unknown error occurred.');
                                }
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to connect to the server. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item, section)}>
            <FontAwesome name="minus-circle" size={20} color="red" />
        </TouchableOpacity>
    );
}

// Main screen
export default function AlertsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Track the section being edited
    const [editingSection, setEditingSection] = useState(null);

    // error use state
    const [error, setError] = useState(null);

    // alert weather types use state
    const [weatherAlerts, setWeatherAlerts] = useState([
        { 'id': 1, 'category': 'Rainy' },
        { 'id': 2, 'category': 'Clear Sky' },
        { 'id': 3, 'category': 'Thunderstorm' },
        { 'id': 4, 'category': 'Hot' },
        { 'id': 5, 'category': 'Cold' },
        { 'id': 6, 'category': 'Hail' },
    ]);

    // alert location use state
    const [alertLocations, setAlertLocations] = useState([
        { 'id': 101, 'suburb_name': 'Brisbane City' },
        { 'id': 102, 'suburb_name': 'St. Lucia' },
        { 'id': 103, 'suburb_name': 'Sunnybank' },
        { 'id': 104, 'suburb_name': 'Buranda' },
        { 'id': 105, 'suburb_name': 'Milton' },
        { 'id': 106, 'suburb_name': 'Chermside' },
        { 'id': 107, 'suburb_name': 'Toowoomba' },
    ])

    // alert timing use state
    const [alertTiming, setAlertTiming] = useState([
        { 'id': 11, 'start_time': '17:00:00', 'end_time': '18:00:00', 'is_active': false },
        { 'id': 10, 'start_time': '16:00:00', 'end_time': '17:00:00', 'is_active': true },
        { 'id': 15, 'start_time': '20:00:00', 'end_time': '21:00:00', 'is_active': true },
        { 'id': 12, 'start_time': '18:00:00', 'end_time': '19:00:00', 'is_active': true },
        { 'id': 13, 'start_time': '19:00:00', 'end_time': '20:00:00', 'is_active': false },
    ])

    // if the user is not logged in, login screen is displayed
    const { userToken, isLoggedIn } = useAuth();

/*     if (!isLoggedIn) {
        return (
            <GradientTheme>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{fontSize: 15, marginBottom: '3%'}}>Please log in to customize your weather alert</Text>
                    <TouchableOpacity style={styles.popUpBtn} onPress={() => router.push('/login')}>
                        <Text style={styles.popUpBtnText}>Sign up or log in</Text>
                    </TouchableOpacity>
                </View>
            </GradientTheme>
        );
    } */

    // Generalized fetch function
    const fetchData = async (url, setState) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                setState(jsonResponse.data);
                setLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(`${API_LINK}/user_alert_weather`, setWeatherAlerts);
        fetchData(`${API_LINK}/user_alert_suburb`, setAlertLocations);
        fetchData(`${API_LINK}/user_alert_time`, setAlertTiming);
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={ColorScheme.BTN_BACKGROUND} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} />;
    }

    // error message
    /*     if (error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{margin: '2%',}}>Error: {error}</Text>
                    <Button title="Back"/>
                </View>
            );
        } */

    // Toggle edit mode for a specific section
    const toggleEditMode = (section) => {
        if (editingSection === section) {
            setEditingSection(null); // Exit edit mode for this section
        } else {
            setEditingSection(section); // Enter edit mode for this section
        }
    };

    // Render Alert Buttons with or without delete button based on edit mode
    function renderAlertButtons(data, isEditMode, section) {
        return data
            .sort((a, b) => {
                // Check if suburb_name is defined for both
                if (!a.suburb_name || !b.suburb_name) {
                    // If suburb_name is undefined, compare categories
                    return a.category.localeCompare(b.category);
                }
                // Otherwise, compare suburb_name first and fallback to category
                return a.suburb_name.localeCompare(b.suburb_name);
            })
            .map((item, index) => (
                <View key={index} style={styles.alertButtonContainer}>
                    {isEditMode && (
                        <DeleteButton item={item} section={section} token={userToken}/>
                    )}
                    <AlertButton alertText={item.category || item.suburb_name} />
                </View>
            ));
    }

    function renderAlertTiming(data, isEditMode) {
        return data
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
            .map((item, index) => (
                <View key={index} style={styles.alertTimingContainer}>
                    {isEditMode && (
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                            <FontAwesome name="minus-circle" size={20} color="red" />
                        </TouchableOpacity>
                    )}
                    <TimingBar
                        startTime={item.start_time}
                        endTime={item.end_time}
                        isActive={item.is_active}
                        onToggle={() => toggleTiming(item)}
                    />
                </View>
            ));
    }

    // Toggle active alert timing
    const toggleTiming = async (item) => {
        const updatedIsActive = !item.is_active; // Toggle the current status of `is_active`

        const requestBody = {
            id: item.id,
            start_time: item.start_time,
            end_time: item.end_time,
            is_active: updatedIsActive
        };

        try {
            const response = await fetch(`${API_LINK}/user_alert_time`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Replace with actual token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Send the updated time info
            });

            const data = await response.json();

            if (response.ok) {
                // Update the state locally to reflect the change
                setAlertTiming(prevTimings =>
                    prevTimings.map(alert =>
                        alert.id === item.id ? { ...alert, is_active: updatedIsActive } : alert
                    )
                );
            } else {
                // Handle errors
                if (response.status === 400) {
                    Alert.alert('Error', 'Missing or invalid data.');
                } else if (response.status === 401) {
                    Alert.alert('Error', 'Invalid or expired token.');
                } else if (response.status === 422) {
                    Alert.alert('Error', 'Invalid time range or data format.');
                } else if (response.status === 500) {
                    Alert.alert('Error', 'Server error. Please try again later.');
                } else {
                    Alert.alert('Error', 'An unknown error occurred.');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to the server. Please try again.');
        }
    };

    return (
        <GradientTheme>
            <ScrollView style={styles.container}>
                {/* Alert Type Section */}
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Active Alert Type</Text>
                        <View style={styles.headerActionBtns}>
                            <AddButton onPress={() => router.push('/addAlertWeather')} />
                            <EditButton onPress={toggleEditMode} section="alertType" />
                        </View>

                    </View>
                    <View style={styles.buttonContainer}>
                        {renderAlertButtons(weatherAlerts, editingSection === 'alertType', 'alertType')}
                    </View>
                </View>

                {/* Alert Location Section */}
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Active Alert Areas</Text>
                        <View style={styles.headerActionBtns}>
                            <AddButton onPress={() => router.push('/addAlertLocation')} />
                            <EditButton onPress={toggleEditMode} section="alertArea" />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        {renderAlertButtons(alertLocations, editingSection === 'alertArea', 'alertArea')}
                    </View>
                </View>

                {/* Alert Timing Section */}
                <View style={{ paddingBottom: 30 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Alert Timing</Text>
                        <View style={styles.headerActionBtns}>
                            <AddButton onPress={() => router.push('/addAlertTiming')} />
                            <EditButton onPress={toggleEditMode} section="alertTiming" />
                        </View>
                    </View>
                    <View style={styles.timingBarContainer}>
                        <View key="0" style={styles.alertTimingContainer}>
                            <TimingBar startTime="00:00:00" endTime="23:59:59" isActive={true} />
                        </View>
                        {renderAlertTiming(alertTiming, editingSection === 'alertTiming')}
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
        marginBottom: '2%',
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: '3%',
        alignSelf: 'flex-start',
    },
    headerActionBtns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '20%',
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
