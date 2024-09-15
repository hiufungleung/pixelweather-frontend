import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import GradientTheme from '@/components/GradientTheme';

export default function TabLayout() {
  return (
    <GradientTheme>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#493971',
            tabBarActiveBackgroundColor: '#493971',
            tabBarInactiveBackgroundColor: 'transparent',
            tabBarStyle: {
              backgroundColor: '#FFFFFF80',
              bottom: 0,
              elevation: 0,
            },
            headerTitleAlign: 'center',
            headerStyle: {
               backgroundColor: '#363EFF',
            },
            headerTintColor: '#FFFFFF',
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="location-dot" color={color} />,
            }}
          />
          <Tabs.Screen
            name="logs"
            options={{
              title: 'Log',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="folder" color={color} />,
            }}
          />
          <Tabs.Screen
            name="alert"
            options={{
              title: 'Alerts',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} />,
            }}
          />
          <Tabs.Screen
            name="(setting)"
            options={{
              title: 'Setting',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            }}
          />
        </Tabs>
    </GradientTheme>
  );
}
