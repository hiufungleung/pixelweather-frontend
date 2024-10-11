import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert, AppRegistry } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import { useAuth, AuthProvider } from '@/components/accAuth';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { API_LINK } from '@/constants/API_link';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';

const LOCATION_TASK_NAME = 'background-location-task';

// Function to request permissions and get the FCM token
async function registerForPushNotificationsAsync({ userToken }) {
    let token;
    // Request notification permissions from the user
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission isn't granted yet, request it
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // If the user has granted permission, get the device token
    if (finalStatus === 'granted') {
        try {
            // Get the native device token (FCM for Android)
            const { data } = await Notifications.getDevicePushTokenAsync();
            token = data;
            console.log('Native FCM Device Token:', token);
            console.log('usertoken: ', userToken);

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
                Alert.alert('Error', 'Error code 401.');
            }
        } catch (error) {
            console.error('Error getting device token:', error);
        }
    } else {
        console.log('Permission not granted for push notifications');
    }

    return token;
}

// Function to send location data to the backend
async function sendLocationToBackend(latitude, longitude, fcmToken, userToken) {
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
                fcm_token: fcmToken,  // Replace with your actual FCM token
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Location sent successfully:', responseData);
        } else {
            console.error('Failed to send location:', response.status);
        }
    } catch (error) {
        console.error('Error sending location:', error);
    }
}


export default function TabLayout() {

    const { userToken } = useAuth(); // Get the userToken from the authentication context
    console.log('userToken:', userToken);
    const [firebaseMessaging, setFirebaseMessaging] = useState(null); // Track Firebase messaging module

    let fcmToken;

    useEffect(() => {
        const setupPushNotifications = async () => {
            if (userToken && Platform.OS === 'android') {
                console.log('Registering for push notifications...');
                fcmToken = await registerForPushNotificationsAsync({ userToken });  // Use await to get the actual token
                console.log('FCM Token:', fcmToken);
                // startBackgroundLocationTracking(userToken, fcmToken);  // Start background tracking after getting the FCM token
                setupPushNotifications();  // Call the async function inside useEffect

                // Dynamically import Firebase messaging for Android only
                import('@react-native-firebase/messaging')
                    .then((firebaseModule) => {
                        const messaging = firebaseModule.default;
                        setFirebaseMessaging(messaging); // Set messaging in state
                    })
                    .catch((error) => {
                        console.error('Error loading Firebase messaging module:', error);
                    });

            } else {
                console.log('userToken is not available yet.');
            }
        };
    }, [userToken]);

    // Handle foreground messages
    useEffect(() => {
        if (firebaseMessaging && Platform.OS === 'android') {
            const unsubscribe = firebaseMessaging.onMessage(async (remoteMessage) => {
                console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
                const { title, body } = remoteMessage.notification;

                // Show a flash message at the top of the screen
                showMessage({
                    message: title,
                    description: body,
                    type: 'success',
                    icon: 'auto',
                    duration: 5000,
                });
            });

            // Clean up the foreground message listener
            return () => unsubscribe();
        }
    }, [firebaseMessaging]);

    // Handle background and quit state messages
    useEffect(() => {
        if (firebaseMessaging && Platform.OS === 'android') {
            firebaseMessaging.setBackgroundMessageHandler(async (remoteMessage) => {
                console.log('Message handled in the background!', remoteMessage);
            });
        }
    }, [firebaseMessaging]);

    // Listener for notification opened in background or quit state
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log('Notification opened in background or quit state:', response.notification);
                const { title, body } = response.notification.request.content;
                showMessage({
                    message: title || 'Notification',
                    description: body || 'No Body Content',
                    type: 'info',
                    icon: 'auto',
                    duration: 5000,
                });
            });
        }
    }, []);

    /*     useEffect(() => {
            import('@react-native-firebase/messaging')
              .then((messaging) => {
                console.log('Firebase messaging module loaded');
                // Use the messaging module here
              })
              .catch((error) => {
                console.error('Error loading Firebase messaging module', error);
              });
    
            // handle foreground messages
            const unsubscribe = messaging().onMessage(async remoteMessage => {
                console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
                const { title, body } = remoteMessage.notification
    
                // Show a flash message at the top of the screen
                showMessage({
                    message: title,
                    description: body,
                    type: 'success', // Based on your needs
                    icon: 'auto',
                    duration: 5000,
                });
            });
            return unsubscribe;
        }, []);
    
        // handle background and quit state messages
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
        AppRegistry.registerComponent('app', () => App);
    
        useEffect(() => {
          // Listener for when a user taps on a background or quit state notification
          const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification opened from background or quit state:', remoteMessage);
    
            // Extract title and body
            const { title, body } = remoteMessage.notification;
    
            // Show flash message when the app is opened due to the notification tap
            showMessage({
              message: title || 'Notification',
              description: body || 'No Body Content',
              type: 'info',
              icon: 'auto',
              duration: 5000,
            });
          });
    
          return unsubscribe; // Clean up the listener on component unmount
        }, []); */


    /*     const startForegroundPermissions = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Foreground location permission not granted');
                    return false;
                }
                return true;
            } catch (error) {
                console.error('Error requesting foreground permissions: ', error);
                return false;
            }
        };
    
        const startBackgroundPermissions = async () => {
            try {
                let { status } = await Location.requestBackgroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Background location permission not granted');
                    return false;
                }
                return true;
            } catch (error) {
                console.error('Error requesting background permissions: ', error);
                return false;
            }
        };
    
        // Define the background task
        TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
            if (error) {
                console.error('Error in background location task:', error);
                return;
            }
    
            if (data) {
                const { locations } = data;
                const location = locations[0]; // Assuming only one location update
                if (location) {
                    const { latitude, longitude } = location.coords;
    
                    sendLocationToBackend(latitude, longitude, fcmToken, userToken)
                }
            }
        });
    
        const startBackgroundLocationUpdates = async () => {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            if (status === 'granted') {
                await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 300000, // 5 minutes in milliseconds
                    distanceInterval: 0, // If you only want updates based on time
                    deferredUpdatesInterval: 300000, // 5 minutes in milliseconds
                    showsBackgroundLocationIndicator: true, // Shows the indicator in the status bar (iOS)
                });
            }
        }; */

    /*     useEffect(() => {
            startForegroundPermissions();
            startBackgroundPermissions();
            startBackgroundLocationUpdates();
        }, []); */

    return (
        <AuthProvider>
            <GradientTheme>
                <FlashMessage position="top" />
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: ColorScheme.SECOND_BTN,
                        tabBarInactiveTintColor: ColorScheme.BTN_BACKGROUND,
                        tabBarActiveBackgroundColor: ColorScheme.BTN_BACKGROUND,
                        tabBarInactiveBackgroundColor: 'transparent',
                        tabBarStyle: {
                            backgroundColor: ColorScheme.SECOND_BTN,
                            bottom: 0,
                            elevation: 0,
                            height: Platform.OS === 'android' ? 80 : 80,  // 設定不同平台的 tabBar 高度
                            paddingBottom: 0,  // 增加 Android 中的內邊距
                            borderTopWidth: 0,
                        },
                        tabBarIconStyle: {
                            marginTop: 10,
                        },
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: '#363EFF',
                        },
                        headerTintColor: ColorScheme.SECOND_BTN,
                        headerShown: false,
                    }}
                >
                    <Tabs.Screen
                        name="(map)"
                        options={{
                            title: '',
                            tabBarIcon: ({ color }) => (
                                <View style={styles.tabContainer}>
                                    <FontAwesome6 size={28} name="location-dot" color={color} />
                                    <Text style={[styles.tabLabel, { color }]}>Home</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="(logs)"
                        options={{
                            title: '',
                            tabBarIcon: ({ color }) => (
                                <View style={styles.tabContainer}>
                                    <FontAwesome size={28} name="folder" color={color} />
                                    <Text style={[styles.tabLabel, { color }]}>Log</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="(alert)"
                        options={{
                            title: '',
                            tabBarIcon: ({ color }) => (
                                <View style={styles.tabContainer}>
                                    <FontAwesome size={28} name="bell" color={color} />
                                    <Text style={[styles.tabLabel, { color }]}>Alerts</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="(setting)"
                        options={{
                            title: '',
                            tabBarIcon: ({ color }) => (
                                <View style={styles.tabContainer}>
                                    <FontAwesome size={28} name="cog" color={color} />
                                    <Text style={[styles.tabLabel, { color }]}>Setting</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="(index)"
                        options={{
                            title: 'Welcome Page',
                            tabBarStyle: { display: 'none' }, // 隱藏 TabBar
                            tabBarButton: () => null,         // 不顯示按鈕
                            headerShown: false,
                        }}
                    />
                </Tabs>
            </GradientTheme>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // height: Platform.OS === 'android' ? 60 : 50, // 調整 Tab 項目的高度，使其在 Android 中完整顯示
        // paddingBottom: Platform.OS === 'android' ? 5 : 0, // 在 Android 中加入額外的下邊距
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    tabBarIcon: {
        position: 'relative',
    }
});