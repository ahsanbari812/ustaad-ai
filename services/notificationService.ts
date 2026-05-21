import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  /**
   * Request permissions for notifications
   */
  requestPermissions: async () => {
    if (Platform.OS === 'web') return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
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
        date: trigger
      } as Notifications.NotificationTriggerInput,
    });

    console.log(`Notification scheduled for: ${trigger.toLocaleString()} with ID: ${id}`);
    return id;
  },

  /**
   * Cancel all scheduled notifications
   */
  cancelAllNotifications: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
