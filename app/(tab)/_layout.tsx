import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import { useAuth } from '@/components/accAuth';
import * as Notifications from 'expo-notifications';
import FlashMessage, { showMessage } from 'react-native-flash-message';

export default function TabLayout() {

    // Get the userToken from the authentication context
    const { userToken } = useAuth();

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

    // Check permission status for Android 13+ devices since they handle notification differently
    useEffect(() => {
        const checkPermissions = async () => {
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

    // Handle notifications using Expo Notifications
    useEffect(() => {
        // Handle notifications when app is in foreground
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received in foreground:', notification);
            const { title, body } = notification.request.content;
            
            showMessage({
                message: title || 'Notification',
                description: body || 'No content',
                type: 'success',
                icon: 'auto',
                duration: 4000,
            });
        });

        return () => subscription.remove();
    }, []);

    // Handle notification taps (background/quit state)
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Notification tapped:', response.notification);
            const { title, body } = response.notification.request.content;
            showMessage({
                message: title || 'Notification',
                description: body || 'No content',
                type: 'info',
                icon: 'auto',
                duration: 5000,
            });
        });

        return () => subscription.remove();
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
                        height: Platform.OS === 'android' ? 80 : 80,
                        paddingBottom: 0,
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
                        tabBarStyle: { display: 'none' },
                        tabBarButton: () => null,
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
        flex: 1,
        paddingHorizontal: 4,
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
        textAlign: 'center',
    },
    tabBarIcon: {
        position: 'relative',
    }
});