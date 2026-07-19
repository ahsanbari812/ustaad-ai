import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, KeyboardAvoidingView, Platform,
  ActivityIndicator, TouchableOpacity, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import QuickActionChips from '../components/QuickActionChips';
import DiscoveryHub from '../components/DiscoveryHub';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import BookingConfirmedPopup from '../components/BookingConfirmedPopup';
import { runAgenticWorkflow, OrchestratorResult } from '../services/agentOrchestrator';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { parseAppointmentTime } from '../utils/dateTimeUtils';
import { ChatMessage, AgentLog, BookingSimulation } from '../utils/types';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  text: '👋 Assalam-o-Alaikum! I\'m Ustaad AI — your smart service finder.\n\nTell me what service you need in English, Urdu, or Roman Urdu!',
  sender: 'ai',
  timestamp: new Date(),
  type: 'text',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestLogs, setLatestLogs] = useState<AgentLog[]>([]);
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorResult | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [bookingPopup, setBookingPopup] = useState<{ id: string; otp?: string } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const orchestratorStateRef = useRef<OrchestratorResult | null>(null);
  const shownBookingPopupsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadChatHistory();
    notificationService.requestPermissions();
  }, []);

  const loadChatHistory = async () => {
    const history = await storageService.getMessages();
    if (history && history.length > 0) {
      messagesRef.current = history;
      setMessages(history);
    } else {
      messagesRef.current = [WELCOME_MESSAGE];
      setMessages([WELCOME_MESSAGE]);
    }
  };

  const saveMessages = async (newMessages: ChatMessage[]) => {
    messagesRef.current = newMessages;
    setMessages(newMessages);
    await storageService.saveMessages(newMessages);
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 100);
  }, []);

  const handleReset = async () => {
    await storageService.clearAll();
    await notificationService.cancelAllNotifications();
    messagesRef.current = [WELCOME_MESSAGE];
    setMessages([WELCOME_MESSAGE]);
    orchestratorStateRef.current = null;
    setOrchestratorState(null);
    setLatestLogs([]);
    setBookingPopup(null);
    shownBookingPopupsRef.current.clear();
  };

  const handleSend = useCallback(async (text: string, bookingChoice?: number) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, text, sender: 'user', timestamp: new Date(), type: 'text',
    };
    const updatedMessages = [...messagesRef.current, userMessage];
    saveMessages(updatedMessages);
    setIsLoading(true);
    setLatestLogs([]);
    try {
      const result = await runAgenticWorkflow(text, bookingChoice, orchestratorStateRef.current || undefined);
      orchestratorStateRef.current = result;
      setOrchestratorState(result);
      
      // If booking was successful, schedule a reminder
      if (result.booking) {
        const appointmentTime = parseAppointmentTime(result.intent.time || '1 hour');
        notificationService.scheduleAppointmentReminder(
          `${result.booking.service.replace('_', ' ')} with ${result.booking.provider.name}`,
          `Your appointment in ${result.booking.location} starts in 1 hour. Get ready!`,
          appointmentTime
        );
      }

      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: result.replyMessage,
        sender: 'ai',
        timestamp: new Date(),
        type: result.booking ? 'booking_confirmation' : (result.providers.length > 0 ? 'provider_list' : 'text'),
        providers: result.providers,
        booking: result.booking || undefined,
        intent: result.intent,
        agentLogs: result.reasoningLogs
      };
      saveMessages([...updatedMessages, aiResponse]);
      setLatestLogs(result.reasoningLogs || []);
      scrollToBottom();
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: '⚠️ Agents encountered an error. Please try again.',
        sender: 'ai', timestamp: new Date(), type: 'text',
      };
      saveMessages([...updatedMessages, errorMessage]);
      scrollToBottom();
    } finally { 
      setIsLoading(false);
      scrollToBottom();
    }
  }, [scrollToBottom]);

  const handleBook = useCallback((index: number) => {
    // Step 1: Show time selection instead of immediately booking
    const providerName = orchestratorStateRef.current?.providers?.[index - 1]?.provider?.name || 'the provider';
    
    const timeSelectMsg: ChatMessage = {
      id: `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: `📅 When would you like to schedule ${providerName}?\n\nSelect a time slot below:`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'booking_time_select',
      pendingBookingIndex: index,
    };

    const updated = [...messagesRef.current, timeSelectMsg];
    saveMessages(updated);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleTimeSelect = useCallback((index: number, timeSlot: string) => {
    // Step 2: User selected a time, now complete the booking
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: `📅 ${timeSlot}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    const updated = [...messagesRef.current, userMsg];
    saveMessages(updated);
    setIsLoading(true);

    // Override the intent time with selected slot immutably
    if (orchestratorStateRef.current) {
      const updatedState = {
        ...orchestratorStateRef.current,
        intent: { ...orchestratorStateRef.current.intent, time: timeSlot }
      };
      orchestratorStateRef.current = updatedState;
      setOrchestratorState(updatedState);
    }
    
    handleSend(`Book provider ${index} for ${timeSlot}`, index);
  }, [handleSend]);



  const handleBookingComplete = useCallback((booking: BookingSimulation) => {
    if (shownBookingPopupsRef.current.has(booking.id)) return;

    shownBookingPopupsRef.current.add(booking.id);
    setBookingPopup({ id: booking.id, otp: booking.otp });
  }, []);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <ChatBubble
      message={item}
      onBook={handleBook}
      onTimeSelect={handleTimeSelect}
      onBookingComplete={handleBookingComplete}
    />
  ), [handleBook, handleTimeSelect, handleBookingComplete]);

  return (
    <View style={{ flex: 1, backgroundColor: '#03030A', paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-3 py-2.5 bg-[#0A0A14] border-b border-indigo-950/60 flex-row items-center justify-between shadow-sm z-10">
        <View className="flex-row items-center flex-1 mr-1">
          <TouchableOpacity 
            className="w-8 h-8 rounded-full bg-[#11111A] border border-indigo-950/80 items-center justify-center mr-2 overflow-hidden"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../assets/logo-final.png')} 
              style={{ width: '100%', height: '100%' }}
            />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-base font-bold tracking-wide" numberOfLines={1}>
              Ustaad AI <Text className="text-indigo-400 font-normal text-xs">v4.0</Text>
            </Text>
            <Text className="text-indigo-400/80 text-[8px] font-bold tracking-wider uppercase" numberOfLines={1}>
              AI Chat Assistant
            </Text>
          </View>
        </View>
        <View className="flex-row gap-1">
          <TouchableOpacity 
            className="bg-[#11111A] border border-indigo-950 w-8 h-8 rounded-full items-center justify-center active:bg-indigo-950/40"
            onPress={() => router.push('/dashboard')}
            activeOpacity={0.7}
          >
            <Text className="text-white text-xs">📊</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#11111A] border border-indigo-950 w-8 h-8 rounded-full items-center justify-center active:bg-indigo-950/40"
            onPress={() => router.push('/architecture')}
            activeOpacity={0.7}
          >
            <Text className="text-white text-xs">🏗️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#11111A] border border-indigo-950 w-8 h-8 rounded-full items-center justify-center active:bg-indigo-950/40"
            onPress={() => router.push('/history')}
            activeOpacity={0.7}
          >
            <Text className="text-white text-xs">📂</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#450a0a] border border-[#991b1b] w-8 h-8 rounded-full items-center justify-center active:bg-red-950"
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text className="text-white text-xs">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item: ChatMessage) => item.id}
          className="flex-1 pt-3"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          ListHeaderComponent={<DiscoveryHub onSelectService={handleSend} />}
          keyboardShouldPersistTaps="handled"
        />

        {isLoading && (
          <View className="flex-row items-center px-4 py-2.5">
            <View className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 items-center justify-center mr-2 overflow-hidden">
              <Text className="text-white text-xs">🤖</Text>
            </View>
            <View className="bg-[#0A0A14] rounded-2xl rounded-bl-sm px-4 py-3 flex-row items-center border border-indigo-500/10 shadow-sm">
              <ActivityIndicator size="small" color="#6366f1" />
              <Text className="text-indigo-300 text-xs ml-2.5 font-medium">Orchestrating agent workflow...</Text>
            </View>
          </View>
        )}

        {latestLogs.length > 0 && (
          <View className="px-4 mb-2">
            <TouchableOpacity 
              onPress={() => setShowLogs(!showLogs)}
              className="bg-[#0A0A14] border border-indigo-500/15 py-2 px-4 rounded-full self-start flex-row items-center shadow-md shadow-indigo-950/20"
            >
              <Text className="text-indigo-400 text-xs font-bold uppercase tracking-widest mr-2">
                {showLogs ? 'Hide Agent Trace' : 'Show Agent Trace'}
              </Text>
              <Text className="text-indigo-400 text-xs">{showLogs ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {latestLogs.length > 0 && showLogs && <WorkflowVisualizer logs={latestLogs} />}

        {!isLoading && messages.length <= 2 && (
          <QuickActionChips onSelect={(t) => handleSend(t)} />
        )}

        <ChatInput onSend={(t) => handleSend(t)} isLoading={isLoading} />
      </KeyboardAvoidingView>

      {bookingPopup && (
        <BookingConfirmedPopup
          key={bookingPopup.id}
          otp={bookingPopup.otp}
          onDismiss={() => setBookingPopup(null)}
        />
      )}
    </View>
  );
}
