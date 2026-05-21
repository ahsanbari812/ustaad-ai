import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, BookingSimulation } from '../utils/types';

const CHAT_KEY = '@ustaad_chat_history';
const BOOKINGS_KEY = '@ustaad_bookings_history';

export const storageService = {
  // Chat History
  async saveMessages(messages: ChatMessage[]) {
    try {
      await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat:', e);
    }
  },

  async getMessages(): Promise<ChatMessage[] | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(CHAT_KEY);
      if (jsonValue) {
        const parsed = JSON.parse(jsonValue);
        // Re-hydrate Date objects
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
      return null;
    } catch (e) {
      console.error('Error reading chat:', e);
      return null;
    }
  },

  // Booking History
  async saveBooking(booking: BookingSimulation) {
    try {
      const existing = await this.getBookings();
      const updated = [booking, ...(existing || [])];
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving booking:', e);
    }
  },

  async getBookings(): Promise<BookingSimulation[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(BOOKINGS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading bookings:', e);
      return [];
    }
  },

  async clearAll() {
    await AsyncStorage.clear();
  }
};
