import { Platform } from 'react-native';
import type * as NotificationsTypes from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';

let Notifications: typeof import('expo-notifications') | null = null;

const isExpoGo = 
  Constants.appOwnership === 'expo' || 
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    // Configure how notifications are handled when the app is in foreground
    Notifications?.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('expo-notifications is not available in this environment.');
  }
} else {
  console.log('Running in Expo Go: expo-notifications require skipped to avoid SDK 53 errors.');
}

export const notificationService = {
  /**
   * Request permissions for notifications
   */
  requestPermissions: async () => {
    if (Platform.OS === 'web' || !Notifications) return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get permissions for notifications!');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications!.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (e) {
      console.warn('Notifications not supported in this environment:', e);
      return false;
    }
  },

  /**
   * Schedule a reminder for an appointment
   * @param title Title of the notification
   * @param body Body of the notification
   * @param scheduledDate The actual date of the appointment
   * @param minutesBefore How many minutes before to send the reminder
   */
  scheduleAppointmentReminder: async (
    title: string,
    body: string,
    scheduledDate: Date,
    minutesBefore: number = 60
  ) => {
    if (!Notifications) return null;

    try {
      // Calculate the trigger time (appointment time minus X minutes)
      const trigger = new Date(scheduledDate.getTime() - minutesBefore * 60000);

      // If the trigger time is already in the past, don't schedule
      if (trigger <= new Date()) {
        console.log('Reminder time is in the past, skipping...');
        return null;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕒 Reminder: ${title}`,
          body: body,
          data: { type: 'appointment_reminder' },
          sound: true,
        },
        trigger: {
          type: Notifications!.SchedulableTriggerInputTypes.DATE,
          date: trigger,
          channelId: 'default',
        } as NotificationsTypes.NotificationTriggerInput,
      });

      console.log(`Notification scheduled for: ${trigger.toLocaleString()} with ID: ${id}`);
      return id;
    } catch (e) {
      console.warn('Failed to schedule notification:', e);
      return null;
    }
  },

  /**
   * Cancel all scheduled notifications
   */
  cancelAllNotifications: async () => {
    if (!Notifications) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.warn('Failed to cancel notifications:', e);
    }
  }
};
