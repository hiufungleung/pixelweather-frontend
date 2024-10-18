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

export default function TabLayout() {

    const { userToken } = useAuth(); // Get the userToken from the authentication context
    const [firebaseMessaging, setFirebaseMessaging] = useState(null); // Track Firebase messaging module

    useEffect(() => {
        const setupFirebaseMessaging = async () => {
            // Dynamically import Firebase messaging for Android only
            import('@react-native-firebase/messaging')
                .then((firebaseModule) => {
                    const messaging = firebaseModule.default;
                    setFirebaseMessaging(messaging); // Set messaging in state
                    console.log('Firebase messaging imported successfully.')
                })
                .catch((error) => {
                    console.error('Error loading Firebase messaging module:', error);
                });
        };

        if (userToken && !firebaseMessaging) {
            setupFirebaseMessaging();
        }
    }, [userToken]);

    // Create a notification channel on Android for foreground notifications
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                sound: true, // Ensure sound is enabled
            }).then(() => console.log('Notification channel set.'));
        }
    }, []);

    useEffect(() => {
        const checkPermissions = async () => {
            // Only for Android 13+ devices
            if (Platform.OS === 'android' && Platform.Version >= 33) {
                const { status } = await Notifications.requestPermissionsAsync();

                if (status !== 'granted') {
                    Alert.alert('Permission not granted', 'Notification permissions are required for this app.');
                } else {
                    console.log('Notification permission granted.');
                }
            }
        };

        checkPermissions();
    }, []);

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
                    duration: 4000,
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

    return (
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
                                <FontAwesome size={28} name="list" color={color} />
                                <Text style={[styles.tabLabel, { color }]}>Posts</Text>
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