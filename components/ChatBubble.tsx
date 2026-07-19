// Chat Bubble Component - WhatsApp-inspired message bubbles
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { BookingSimulation, ChatMessage } from '../utils/types';
import ProviderCard from './ProviderCard';
import BookingConfirmation from './BookingConfirmation';

interface ChatBubbleProps {
  message: ChatMessage;
  onBook?: (index: number) => void;
  onTimeSelect?: (index: number, timeSlot: string) => void;
  onBookingComplete?: (booking: BookingSimulation) => void;
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

export default function ChatBubble({ message, onBook, onTimeSelect, onBookingComplete }: ChatBubbleProps) {
  const isUser = message.sender === 'user';
  const hasCards = !isUser && (
    (message.providers && message.providers.length > 0) || 
    !!message.booking || 
    message.type === 'booking_time_select'
  );

  return (
    <View className="mb-4 px-3">
      <View className={`flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
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
          className={`${
            isUser
              ? 'bg-indigo-600 rounded-br-sm border border-indigo-400/40 shadow-sm shadow-indigo-950/10'
              : 'bg-[#0A0A14] rounded-bl-sm border border-indigo-950 shadow-sm'
          } max-w-[85%] rounded-3xl px-4 py-3`}
        >
          {/* Message Text */}
          <Text className={`text-[15px] leading-6 ${isUser ? 'text-white' : 'text-indigo-50'} ${hasCards ? 'mb-1' : ''}`}>
            {formatMessageText(message.text)}
          </Text>

          {/* Timestamp for text-only messages */}
          {!hasCards && (
            <Text className={`text-[10px] mt-1 ${isUser ? 'text-indigo-100/70' : 'text-slate-500'} text-right`}>
              {formatTime(message.timestamp)}
            </Text>
          )}
        </View>
      </View>

      {/* Dynamic AI Components - Rendered outside the text bubble with full alignment */}
      {hasCards && (
        <View className="ml-10 mt-2 mr-1">
          {/* Provider Card List */}
          {message.providers && message.providers.length > 0 && !message.booking && (
            <View>
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
            <View className="bg-[#0A0A14] border border-indigo-950 rounded-2xl p-3.5 shadow-sm">
              <View className="flex-row flex-wrap gap-2">
                {generateTimeSlots().map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    className="bg-indigo-950/40 border border-indigo-500/25 px-3.5 py-2.5 rounded-xl active:bg-indigo-500/20"
                    onPress={() => onTimeSelect(message.pendingBookingIndex || 1, slot)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-indigo-300 font-bold text-xs">{slot}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Booking Confirmation */}
          {message.booking && (
            <BookingConfirmation
              booking={message.booking}
              messageTimestamp={message.timestamp}
              onCompleted={onBookingComplete}
            />
          )}

          {/* Timestamp for rich card messages */}
          <Text className="text-[10px] mt-2 text-slate-500 text-right pr-2">
            {formatTime(message.timestamp)}
          </Text>
        </View>
      )}
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
