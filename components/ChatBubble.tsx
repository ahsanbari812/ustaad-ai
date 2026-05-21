// Chat Bubble Component - WhatsApp-inspired message bubbles
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChatMessage } from '../utils/types';
import ProviderCard from './ProviderCard';
import BookingConfirmation from './BookingConfirmation';

interface ChatBubbleProps {
  message: ChatMessage;
  onBook?: (index: number) => void;
  onTimeSelect?: (index: number, timeSlot: string) => void;
}

function generateTimeSlots(): string[] {
  const now = new Date();
  const hour = now.getHours();
  const slots: string[] = [];

  // Today slots (only future times)
  if (hour < 14) slots.push('Today 2:00 PM');
  if (hour < 16) slots.push('Today 4:00 PM');
  if (hour < 18) slots.push('Today 6:00 PM');
  if (hour < 20) slots.push('Today 8:00 PM');

  // Tomorrow slots
  slots.push('Tomorrow 10:00 AM');
  slots.push('Tomorrow 2:00 PM');
  slots.push('Tomorrow 6:00 PM');

  return slots.slice(0, 6); // Max 6 slots
}

export default function ChatBubble({ message, onBook, onTimeSelect }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <View className={`flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-3`}>
      {/* AI Avatar */}
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-emerald-600 items-center justify-center mr-2 mt-1 overflow-hidden">
          <Image 
            source={require('../assets/logo.jpg')} 
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      )}

      <View
        className={`max-w-[85%] rounded-3xl px-4 py-3 ${
          isUser
            ? 'bg-[#0891b2] rounded-br-sm shadow-lg shadow-cyan-900 border border-[#22d3ee]'
            : 'bg-[#0A0A0F] rounded-bl-sm border border-[#164e63] shadow-lg shadow-[#164e63]'
        }`}
      >
        {/* Message Text */}
        <Text className={`text-[15px] leading-6 ${isUser ? 'text-white' : 'text-cyan-50'} mb-2`}>
          {formatMessageText(message.text)}
        </Text>

        {/* Dynamic AI Components */}
        {!isUser && message.providers && message.providers.length > 0 && !message.booking && (
          <View className="mt-2">
            {message.providers.map((match, idx) => (
              <ProviderCard 
                key={match.provider.id} 
                match={match} 
                index={idx} 
                onBook={() => onBook && onBook(idx + 1)}
              />
            ))}
          </View>
        )}

        {/* Time Slot Selection */}
        {message.type === 'booking_time_select' && onTimeSelect && (
          <View className="mt-3">
            <View className="flex-row flex-wrap gap-2">
              {generateTimeSlots().map((slot) => (
                <TouchableOpacity
                  key={slot}
                  className="bg-[#0c4a6e] border border-[#0369a1] px-4 py-2.5 rounded-xl"
                  onPress={() => onTimeSelect(message.pendingBookingIndex || 1, slot)}
                  activeOpacity={0.7}
                >
                  <Text className="text-cyan-300 font-bold text-xs">{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!isUser && message.booking && (
          <BookingConfirmation booking={message.booking} />
        )}

        {/* Timestamp */}
        <Text className={`text-[10px] mt-1 ${isUser ? 'text-emerald-200' : 'text-gray-500'} text-right`}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

function formatMessageText(text: string): string {
  return text.replace(/\*\*/g, '');
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
