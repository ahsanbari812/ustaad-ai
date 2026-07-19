import { BookingSimulation } from '../utils/types';

export type NotificationCallback = (title: string, message: string) => void;

class ReminderService {
  private listener: NotificationCallback | null = null;

  setListener(callback: NotificationCallback) {
    this.listener = callback;
  }

  scheduleReminder(booking: BookingSimulation) {
    // In a real app, this would use Expo Notifications or Firebase Cloud Messaging.
    // For the hackathon demo, we simulate a push notification after 5 seconds.
    setTimeout(() => {
      if (this.listener) {
        this.listener(
          '⏰ Upcoming Appointment',
          `Reminder: Your ${booking.service.replace('_', ' ')} booking with ${booking.provider.name} is scheduled for ${booking.scheduled_time}.`
        );
      }
    }, 5000);
  }

  notify(title: string, message: string) {
    if (this.listener) {
      this.listener(title, message);
    }
  }
}

export const reminderService = new ReminderService();
