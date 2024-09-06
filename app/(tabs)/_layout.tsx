import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GradientTheme from '@/components/GradientTheme';

export default function TabLayout() {
  return (
    <>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#21005D',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
              backgroundColor: '#BCB2FE',
            },
            headerTitleAlign: 'center',
            headerStyle: {
               backgroundColor: '#363EFF',
            },
            headerTintColor: '#FFFFFF',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="location-dot" color={color} />,
              headerTransparent: true, // Makes the header transparent
                 header: () => (
                   <>
                     <StatusBar translucent={true} backgroundColor="transparent" style="light" />
                   </>
              ),
            }}
          />
          <Tabs.Screen
            name="logs"
            options={{
              title: 'Post',
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
            name="setting"
            options={{
              title: 'Setting',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            }}
          />
        </Tabs>
    </>
  );
}
