import { Stack } from 'expo-router';
import GradientTheme from '@/components/GradientTheme';

export default function RootLayout() {

  return (
    <GradientTheme>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="(tab)" />
        </Stack>
    </GradientTheme>
  );
}
