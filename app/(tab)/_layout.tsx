import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';

export default function TabLayout() {
  return (
    <GradientTheme>
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
            name="(index)"
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
            name="(alert)"
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
