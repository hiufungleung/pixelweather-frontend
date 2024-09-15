import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="setting" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
