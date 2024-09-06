import { Stack } from 'expo-router';
import GradientTheme from '@/components/GradientTheme';

export default function RootLayout() {

  return (
    <GradientTheme>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
            title: '',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
          }}>
        </Stack>
    </GradientTheme>
  );
}
