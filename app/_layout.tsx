// App Layout - Expo Router root layout
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import PushNotification from '../components/PushNotification';
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <PushNotification />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A14' },
          animation: 'fade_from_bottom',
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="chat" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="history" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="provider/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="dashboard" options={{ presentation: 'modal', animation: 'slide_from_right' }} />
        <Stack.Screen name="architecture" options={{ presentation: 'modal', animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
