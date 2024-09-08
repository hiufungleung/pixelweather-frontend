import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostTemplate from '@/components/PostTemplate'
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme'

// Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

// Viewed Screen
function ViewedScreen() {
  return (
      <GradientTheme>
      <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Viewed Posts</Text>
      </SafeAreaView>
      </GradientTheme>
  );
}

// Posted Screen
function PostedScreen() {
  return (
      <GradientTheme>
      <View style={styles.container}>
          <Text style={styles.text}>Posted Posts</Text>
      </View>
      </GradientTheme>
  );
}

// Main Logs Component with Top Tabs
export default function LogsScreen() {
  return (
      <GradientTheme>
      <Tab.Navigator
          initialRouteName="Viewed"
          screenOptions={{
            tabBarActiveTintColor: '#6200EE',
            tabBarInactiveTintColor: '#AAA',
            tabBarIndicatorStyle: { backgroundColor: '#6200EE' },
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarStyle: {
                backgroundColor: 'translucent',
                elevation: 0,
                paddingTop: 50},
          }}>
          <Tab.Screen
            name="Viewed"
            component={ViewedScreen}
            options={{ tabBarLabel: 'VIEWED' }}
          />
          <Tab.Screen
            name="Posted"
            component={PostedScreen}
            options={{ tabBarLabel: 'POSTED' }}
          />
      </Tab.Navigator>
      </GradientTheme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
