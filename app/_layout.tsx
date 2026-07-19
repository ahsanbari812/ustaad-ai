// App Layout - Expo Router root layout
import 'react-native-reanimated';
import React from 'react';
import { LogBox } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import PushNotification from '../components/PushNotification';
import "../global.css";

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
]);


export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <PushNotification />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#03030A' },
          animation: 'slide_from_right',
          animationDuration: 320,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="dashboard" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="architecture" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
