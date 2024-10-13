import React, { useEffect } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import { API_LINK } from '@/constants/API_link';
import { useAuth } from '@/components/accAuth';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task globally
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Background location task error:', error);
        return;
    }

    if (data) {
        const { locations } = data;
        const location = locations[0];

        if (location) {
            const { latitude, longitude } = location.coords;
            console.log(`Location: ${latitude}, ${longitude}`);

            const fcmToken = await SecureStore.getItemAsync('fcmToken');
            const userToken = await SecureStore.getItemAsync('userToken');

            if (!userToken) {
                console.error('User token is missing, skipping location submission.');
                return;
            }

            try {
                const response = await fetch(`${API_LINK}/handle_periodical_submitted_location`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({ latitude, longitude, fcm_token: fcmToken }),
                });

                if (response.ok) {
                    console.log('Location sent successfully.');
                } else {
                    console.error(`Error sending location: ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to send location:', error);
            }
        }
    }
});

export default function LocationUpdateComponent() {
    const { userToken, isLoggedIn } = useAuth();

    useEffect(() => {

        const initializeTracking = async () => {
            const fcmToken = await SecureStore.getItemAsync('fcmToken');
            const hasPermissions = await requestPermissions();

            if (hasPermissions) {
                console.log('Starting background location tracking...');
                await startBackgroundLocationTracking(fcmToken, userToken);
            }
        };

        const unregisterTaskIfLoggedOut = async () => {
            try {
                const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
                if (isTaskRegistered) {
                    console.log('Unregistering background task...');
                    await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
                    console.log('Background task unregistered.');
                } else {
                    console.log(`Task '${LOCATION_TASK_NAME}' not registered, skipping unregistration.`);
                }
            } catch (error) {
                console.error('Error during task unregistration:', error);
            }
        };

        if (userToken) {
            initializeTracking(); // Start tracking when the component mounts
        }

        if (!isLoggedIn) {
            unregisterTaskIfLoggedOut();
        }

        // Cleanup on unmount
        return () => {
            unregisterTaskIfLoggedOut();
        };
    }, [userToken, isLoggedIn]); // Re-run when userToken or login status changes

    return (
        <>
        </>
    );
}

// Request foreground and background location permissions
const requestPermissions = async () => {
    try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            Alert.alert('Permission denied', 'Foreground location access is required.');
            return false;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            Alert.alert('Permission denied', 'Background location access is required.');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error requesting location permissions:', error);
        return false;
    }
};

// Start background location tracking
const startBackgroundLocationTracking = async (fcmToken, userToken) => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isRegistered) {
        console.log('Location tracking task already registered.');
        return;
    }

    try {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 300000, // Every 5 minutes (300,000 ms)
            distanceInterval: 0, // Trigger based on time, not distance
            foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Your location is being tracked.',
            },
        });

        console.log('Background location tracking started.');
    } catch (error) {
        console.error('Error starting background location tracking:', error);
    }
};




/* import React, { useEffect, useRef, useState } from 'react';
import { View, Text, AppState, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { API_LINK } from '@/constants/API_link';
import { useAuth } from '@/components/accAuth';

export default function LocationUpdateComponent() {
    const { userToken } = useAuth();
    const [fcmToken, setFcmToken] = useState(null);
    const [appState, setAppState] = useState(AppState.currentState);
    const intervalRef = useRef(null); // Store interval ID

    // Fetch FCM token from SecureStore
    useEffect(() => {
        const fetchFcmToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('fcmToken');
                setFcmToken(token);
            } catch (error) {
                console.error('Error fetching FCM token:', error);
            }
        };
        fetchFcmToken();
    }, []);

    // Function to send location to backend
    const sendLocationToBackend = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coords;

            console.log(`Location: ${latitude}, ${longitude}`);

            const requestBody = {
                latitude,
                longitude,
                fcm_token: fcmToken,
            };

            const response = await fetch(`${API_LINK}/handle_periodical_submitted_location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                console.error(`Failed to send location: ${response.status}`);
            } else {
                console.log('Location sent successfully.');
            }
        } catch (error) {
            console.error('Error sending location:', error);
        }
    };

    // Start tracking location every 5 minutes
    const startTracking = () => {
        console.log('Starting location tracking...');
        if (intervalRef.current) clearInterval(intervalRef.current); // Clear previous interval

        intervalRef.current = setInterval(() => {
            sendLocationToBackend();
        }, 30000); // 300,000 ms = 5 minutes
    };

    // Stop tracking
    const stopTracking = () => {
        console.log('Stopping location tracking...');
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Request location permissions
    const requestPermissions = async () => {
        try {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Foreground location access is required.');
                return false;
            }

            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Background location access is required.');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            return false;
        }
    };

    // Handle app state changes (foreground/background)
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            console.log(`App state changed to: ${nextAppState}`);
            if (nextAppState === 'active') {
                startTracking(); // Ensure tracking on foreground
            }
            setAppState(nextAppState);
        };

        // Add AppState listener
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Cleanup on unmount
        return () => {
            subscription.remove();
            stopTracking(); // Stop tracking when component unmounts
        };
    }, []);

    // Initialize tracking on component mount
    useEffect(() => {
        const initializeTracking = async () => {
            const hasPermissions = await requestPermissions();
            if (hasPermissions) {
                startTracking(); // Start tracking if permissions are granted
            }
        };

        initializeTracking();

        return () => {
            stopTracking(); // Clean up interval on unmount
        };
    }, []);

    return (
        <View>
            <Text>Tracking location every 5 minutes...</Text>
        </View>
    );
} */




/*
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { API_LINK } from '@/constants/API_link';
import { useAuth } from '@/components/accAuth';
import FlashMessage from 'react-native-flash-message';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';

const LOCATION_TASK_NAME = 'background-location-task';

export default function LocationUpdateComponent() {
  const { userToken } = useAuth(); // Get the userToken from authentication context
  const [fcmToken, setFcmToken] = useState(null); // Store the FCM token

  // Save FCM token and userToken in SecureStore
  useEffect(() => {
    if (userToken) {
      SecureStore.setItemAsync('userToken', userToken);
    }
    if (fcmToken) {
      SecureStore.setItemAsync('fcmToken', fcmToken);
    }
  }, [userToken, fcmToken]);

  // 1. Request User Permission for Notifications (FCM)
  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      try {
        const { data } = await Notifications.getDevicePushTokenAsync();
        token = data;
        setFcmToken(token);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    } else {
      console.log('Permission not granted for push notifications');
    }
    return token;
  };

  // 2. Request User Permission for Location (Foreground and Background)
  const requestLocationPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable location permissions.');
        return false;
      }

      if (Platform.OS === 'android') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          Alert.alert('Background Location Permission Denied');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  };

  // 3. Start Location Updates in the Background
  const startBackgroundLocationTracking = async () => {
    const { status } = await Location.getBackgroundPermissionsAsync();
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000, // Update every 5 minutes
        distanceInterval: 0,  // Update based on time, not distance
        showsBackgroundLocationIndicator: true, // iOS specific: Shows background location indicator
      });
      console.log('Background location tracking started');
    }
  };

  // 4. Initialize location tracking and push notifications
  useEffect(() => {
    const initializeLocationTracking = async () => {
      const pushNotificationToken = await registerForPushNotificationsAsync();
      if (pushNotificationToken && await requestLocationPermissions()) {
        startBackgroundLocationTracking(); // Start background location tracking
      }
    };

    initializeLocationTracking();
  }, []);

  return <FlashMessage position="top" />;
}
 */
