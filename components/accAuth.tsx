import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';
import { API_LINK } from "@/constants/API_link";
import { useRouter } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// Create a context for managing authentication state
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isSettingUpNotifications, setIsSettingUpNotifications] = useState(false);
    const router = useRouter();

    const requestLocationPermissions = async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            console.error('Foreground location permission not granted');
            return false;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            console.error('Background location permission not granted');
            return false;
        }

        console.log('Background location permission granted');
        return true;
    };

    const registerForPushNotificationsAsync = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permissions not granted');
                return;
            }

            const { data } = await Notifications.getDevicePushTokenAsync();
            console.log('FCM Token:', data);

            await SecureStore.setItemAsync('fcmToken', data);

            const response = await fetch(`${API_LINK}/register_fcm_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`, // Potential issue: Invalid token used
                },
                body: JSON.stringify({ fcm_token: data }),
            });

            if (response.status !== 200) {
                console.error('Failed to register FCM token. Status:', response.status);
                return;
            }

            console.log('FCM token registered successfully');
            return data;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
        }
    };

    const loadToken = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('userToken');
            const storedUserData = await SecureStore.getItemAsync('userData');

            if (storedToken) {
                setUserToken(storedToken);
                setUserData(JSON.parse(storedUserData));
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Failed to load token:', error);
        }
    };

    const login = async (email, password) => {
        if (!email || !password) {
            Alert.alert('Error', 'Missing email or password.');
            return false;
        }

        try {
            const response = await fetch(`${API_LINK}/handle_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const rawResponse = await response.text();

            if (rawResponse.includes('<')) {
                console.error('Server returned HTML instead of JSON:', rawResponse);
                Alert.alert('Server Error', 'Received unexpected response from server.');
                return false;
            }

            const data = JSON.parse(rawResponse);

            if (response.status === 200) {
                // Update SecureStore and state
                await SecureStore.setItemAsync('userToken', data.data.token);
                await SecureStore.setItemAsync('userData', JSON.stringify({
                    email: data.data.email,
                    username: data.data.username,
                }));

                setUserToken(data.data.token);
                setUserData({ email: data.data.email, username: data.data.username });
                setIsLoggedIn(true);

                Alert.alert('Success', 'Login successful!');
                return true;
            } else {
                Alert.alert('Error', data.error || 'Invalid credentials.');
                return false;
            }
        } catch (error) {
            console.error("Error: couldn't send the request", error);
            Alert.alert('Error', `${error.message}`);
            return false;
        }
    };

    const logout = async () => {
        if (!userToken) {
            Alert.alert('Error', 'No active session to log out.');
            return false;
        }

        try {
            const response = await fetch(`${API_LINK}/handle_logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ logout_all: false }),
            });

            if (response.status === 200 || response.status === 400 || response.status === 401) {

                // Clear SecureStore
                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('userData');
                await SecureStore.deleteItemAsync('fcmToken');

                // Reset state
                setIsLoggedIn(false);
                setUserToken(null);
                setUserData(null);

                Alert.alert('Success', 'Log out successful.');

                router.push('/login');
                return true;
            } else {
                Alert.alert('Error', 'An error occurred while logging out.');
                return false;
            }
        } catch (error) {
            Alert.alert('Error', `An error occurred: ${error.message}`);
            return false;
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    // Log state updates
    useEffect(() => {
        console.log('State updated:');
        console.log('isLoggedIn: ', isLoggedIn);
        console.log('userToken: ', userToken);
        console.log('userData: ', userData);
    }, [isLoggedIn, userToken, userData]);

    useEffect(() => {
        const setupNotifications = async () => {
            if (!userToken || isSettingUpNotifications) return;

            setIsSettingUpNotifications(true);
            await registerForPushNotificationsAsync();
            setIsSettingUpNotifications(false);
        };

        if (userToken) {
            setupNotifications();
        }
    }, [userToken]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userToken, userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

















/*
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';
import { API_LINK } from "@/constants/API_link";
import { useRouter } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';  // Import expo-location for background location tracking
import * as Notifications from 'expo-notifications';

// Define the task name at the top level
const LOCATION_TASK_NAME = 'background-location-task';

// Create a context for managing authentication state
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [fcmToken, setFcmToken] = useState(null);
    const router = useRouter();

    // Function to request permissions and get the FCM token
    async function registerForPushNotificationsAsync({ userToken }) {
        let token;
        console.log('Starting push notification registration with userToken:', userToken);

        try {
            // Request notification permissions from the user
            const permissionResponse = await Notifications.getPermissionsAsync();
            const existingStatus = permissionResponse.status;
            console.log('Existing notification permission status:', existingStatus);
            let finalStatus = existingStatus;

            // If permission isn't granted yet, request it
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            console.log('Final location permission status: ', finalStatus);

            // If the user has granted permission, get the device token
            if (finalStatus === 'granted') {
                try {
                    // Get the native device token (FCM for Android)
                    const { data } = await Notifications.getDevicePushTokenAsync();
                    token = data;
                    console.log('Native FCM Device Token:', token);

                    const requestBody = {
                        'fcm_token': token,
                    }

                    // Send the token to your backend server
                    const response = await fetch(`${API_LINK}/register_fcm_token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`
                        },
                        body: JSON.stringify(requestBody),
                    });

                    const feedback = await response.json();

                    if (response.status === 200) {
                        console.log('Successfully posted FCM token')
                    } else if (response.status === 400) {
                        Alert.alert('Error', 'Missing required data. Please try again.');
                    } else if (response.status === 500) {
                        Alert.alert('Error', 'Internal Error occurred.');
                    } else if (response.status === 401) {
                        Alert.alert('Error', 'Error code 401. Invalid credentail or tokens.');
                    }
                } catch (error) {
                    console.error('Error getting device token:', error);
                }
            } else {
                console.log('Permission not granted for push notifications');
            }
    } catch (error) {
        console.error('Error during notification permissions request:', error);
    }

        return token;
    }

    // When the app starts, check if login state is stored in SecureStore
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                const storedUserData = await SecureStore.getItemAsync('userData');

                if (storedToken) {
                    setUserToken(storedToken);
                    setUserData(JSON.parse(storedUserData));
                    setIsLoggedIn(true);
                } else {
                    setUserToken(null);  // Ensure state is updated correctly
                }
            } catch (e) {
                console.error('Failed to load token');
            }
        };
        loadToken();
    }, []);

    // Log state updates
    useEffect(() => {
        console.log('State updated:');
        console.log('isLoggedIn: ', isLoggedIn);
        console.log('userToken: ', userToken);
        console.log('userData: ', userData);
    }, [isLoggedIn, userToken, userData]);

    // Trigger setupPushNotifications when userToken is updated
    useEffect(() => {
        if (userToken) {
            setupPushNotifications(userToken);
        }
    }, [userToken]);

    // Function to request location permissions
    const requestLocationPermissions = async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            console.error('Foreground location permission not granted');
            return false;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            console.error('Background location permission not granted');
            return false;
        }

        console.log('Background location permission granted');
        return true;
    };

    const registerTask = async (userToken, fcmToken) => {
        // Request permissions before proceeding
        const hasPermission = await requestLocationPermissions();
        if (!hasPermission) {
            console.error('Location permission not granted. Cannot register background task.');
            return;
        }

        const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        console.log('Is Task Registered:', isTaskRegistered);

        const getUserToken = async () => {
            const storedToken = await SecureStore.getItemAsync('userToken');
            return storedToken;
        };

        if (isTaskRegistered) {
            console.log('Task already registered. No need to register again.');
            return;
        }

        console.log('Registering new background task...');

        // Start location updates in the background
        try {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                timeInterval: 60000,  // 1 minute
                distanceInterval: 0,   // No minimum distance
                foregroundService: {
                    notificationTitle: 'Location Tracking',
                    notificationBody: 'Your location is being tracked in the background.',
                },
            });

            TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
                if (error) {
                    console.error('Error in background location task:', error);
                    return;
                }

                if (data) {
                    const { locations } = data;
                    const location = locations[0]; // Get the latest location
                    if (location) {
                        const { latitude, longitude } = location.coords;
                        console.log(`Location in TaskManager: ${latitude}, ${longitude}`);
                        console.log('userToken: ', userToken);
                        console.log('fcmToken: ', fcmToken);

                        if (!userToken || !fcmToken) {
                            console.error('Missing userToken or fcmToken.');
                            return;
                        }

                        const sendLocationToBackend = async (latitude, longitude, fcmToken) => {
                            const userToken = await getUserToken();  // Ensure token is fresh
                            if (!userToken) {
                                console.error('No userToken found');
                                return;
                            }

                            try {
                                const response = await fetch(`${API_LINK}/handle_periodical_submitted_location`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${userToken}`,
                                    },
                                    body: JSON.stringify({
                                        latitude: latitude.toString(),
                                        longitude: longitude.toString(),
                                        fcm_token: fcmToken,
                                    }),
                                });

                                if (response.status === 201) {
                                    const responseData = await response.json();
                                    console.log('Location sent successfully:', responseData);
                                } else if (response.status === 204) {
                                    console.log('Location sent successfully: ', responseData.message );
                                } else {
                                    console.error(`Error: Status ${response.status}`);
                                }
                            } catch (error) {
                                console.error('Error sending location:', error);
                            }
                        };

                        // Call the function to send location to the backend
                        await sendLocationToBackend(latitude, longitude, fcmToken, userToken);
                    }
                }
            });

            console.log('Background task registered successfully.');
        } catch (error) {
            console.error('Error registering task:', error);
        }
    };

    const setupPushNotifications = async (userToken) => {
        console.log('Inside setupPushNotifications with userToken:', userToken);
        if (userToken && Platform.OS === 'android') {
            console.log('Passed userToken and platform check. Registering for push notifications...');
            console.log('Registering for push notifications...');
            const fetchedFcmToken = await registerForPushNotificationsAsync({ userToken });  // Use await to get the actual token
            if (!fetchedFcmToken) {
                console.error('Failed to get FCM Token.');
                return;
            } else {
                console.log('FCM Token:', fetchedFcmToken);
                setFcmToken(fetchedFcmToken);
            }

            // Register background task only if both userToken and fcmToken are available
            if (userToken && fetchedFcmToken) {
                console.log('start registering task...');
                registerTask(userToken, fetchedFcmToken);
            }
        } else {
            console.log('userToken is not available yet.');
        }
    };

    const login = async (email, password) => {
        if (!email || !password) {
            Alert.alert('Error', 'Missing email or password.');
            return false;
        }

        try {
            const response = await fetch(`${API_LINK}/handle_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const rawResponse = await response.text();

            if (rawResponse.includes('<')) {
                console.error('Server returned HTML instead of JSON:', rawResponse);
                Alert.alert('Server Error', 'Received unexpected response from server.');
                return false;
            }

            const data = JSON.parse(rawResponse);

            if (response.status === 200) {
                // Update SecureStore and state
                await SecureStore.setItemAsync('userToken', data.data.token);
                await SecureStore.setItemAsync('userData', JSON.stringify({
                    email: data.data.email,
                    username: data.data.username,
                }));

                console.log('isLoggedIn before login: ', isLoggedIn);
                console.log('userToken before login: ', userToken);
                console.log('userData before login: ', userData);

                setUserToken(data.data.token);
                setUserData({ email: data.data.email, username: data.data.username });
                setIsLoggedIn(true);

                Alert.alert('Success', 'Login successful!');
                return true;
            } else {
                Alert.alert('Error', data.error || 'Invalid credentials.');
                return false;
            }
        } catch (error) {
            console.error("Error: couldn't send the request", error);
            Alert.alert('Error', `${error.message}`);
            return false;
        }
    };

    const logout = async () => {
        if (!userToken) {
            Alert.alert('Error', 'No active session to log out.');
            return false;
        }

        try {
            const response = await fetch(`${API_LINK}/handle_logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ logout_all: false }),
            });

            if (response.status === 200 || response.status === 400 || response.status === 401) {
                // Unregister the background task when logging out
                const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
                if (isTaskRegistered) {
                    await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
                    console.log('Registered task removed.')
                }

                // Clear SecureStore
                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('userData');

                console.log('isLoggedIn before logout: ', isLoggedIn);
                console.log('userToken before logout: ', userToken);
                console.log('userData before logout: ', userData);

                // Reset state
                setIsLoggedIn(false);
                setUserToken(null);
                setUserData(null);

                // Log state after the state is set (using a setTimeout as a quick check for state changes)
                setTimeout(() => {
                    console.log('isLoggedIn after state update: ', isLoggedIn);
                    console.log('userToken after state update: ', userToken);
                    console.log('userData after state update: ', userData);
                }, 0);

                Alert.alert('Success', 'Log out successful.');

                router.push('/login');
                return true;
            } else {
                Alert.alert('Error', 'An error occurred while logging out.');
                return false;
            }
        } catch (error) {
            Alert.alert('Error', `An error occurred: ${error.message}`);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userToken, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext); */
