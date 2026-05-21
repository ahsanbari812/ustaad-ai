import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, KeyboardAvoidingView, Platform,
  ActivityIndicator, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import QuickActionChips from '../components/QuickActionChips';
import DiscoveryHub from '../components/DiscoveryHub';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import { runAgenticWorkflow, OrchestratorResult } from '../services/agentOrchestrator';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { parseAppointmentTime } from '../utils/dateTimeUtils';
import { ChatMessage, AgentLog } from '../utils/types';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  text: '👋 Assalam-o-Alaikum! I\'m Ustaad AI — your smart service finder.\n\nTell me what service you need in English, Urdu, or Roman Urdu!',
  sender: 'ai',
  timestamp: new Date(),
  type: 'text',
};

export default function HomeScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestLogs, setLatestLogs] = useState<AgentLog[]>([]);
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorResult | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatHistory();
    notificationService.requestPermissions();
  }, []);

  const loadChatHistory = async () => {
    const history = await storageService.getMessages();
    if (history && history.length > 0) {
      setMessages(history);
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  };

  const saveMessages = async (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    await storageService.saveMessages(newMessages);
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 100);
  }, []);

  const handleReset = async () => {
    await storageService.clearAll();
    await notificationService.cancelAllNotifications();
    setMessages([WELCOME_MESSAGE]);
    setOrchestratorState(null);
    setLatestLogs([]);
  };

  const handleSend = useCallback(async (text: string, bookingChoice?: number) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, text, sender: 'user', timestamp: new Date(), type: 'text',
    };
    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    setIsLoading(true);
    setLatestLogs([]);
    try {
      const result = await runAgenticWorkflow(text, bookingChoice, orchestratorState || undefined);
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
  }, [messages, orchestratorState, scrollToBottom]);

  const handleBook = useCallback((index: number) => {
    // Step 1: Show time selection instead of immediately booking
    const providerName = orchestratorState?.providers?.[index - 1]?.provider?.name || 'the provider';
    
    const timeSelectMsg: ChatMessage = {
      id: `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: `📅 When would you like to schedule ${providerName}?\n\nSelect a time slot below:`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'booking_time_select',
      pendingBookingIndex: index,
    };

    const updated = [...messages, timeSelectMsg];
    saveMessages(updated);
    scrollToBottom();
  }, [messages, orchestratorState, scrollToBottom]);

  const handleTimeSelect = useCallback((index: number, timeSlot: string) => {
    // Step 2: User selected a time, now complete the booking
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: `📅 ${timeSlot}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    const updated = [...messages, userMsg];
    saveMessages(updated);
    setIsLoading(true);

    // Override the intent time with selected slot and run booking
    if (orchestratorState) {
      orchestratorState.intent.time = timeSlot;
    }
    
    handleSend(`Book provider ${index} for ${timeSlot}`, index);
  }, [messages, orchestratorState, handleSend]);



  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} onBook={handleBook} onTimeSelect={handleTimeSelect} />
  ), [handleBook, handleTimeSelect]);

  return (
    <SafeAreaView className="flex-1 bg-[#05050A]" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 bg-[#0A0A0F] border-b border-[#164e63] flex-row items-center justify-between shadow-lg shadow-[#164e63] z-10">
        <View className="flex-row items-center">
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-[#11111A] border border-[#164e63] items-center justify-center mr-3 overflow-hidden"
            onPress={() => router.push('/')}
          >
            <Image 
              source={require('../assets/logo-final.png')} 
              style={{ width: '100%', height: '100%' }}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-lg font-bold tracking-wide">Ustaad AI <Text className="text-cyan-500 font-normal text-sm">v4.0</Text></Text>
            <Text className="text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase">Google Antigravity Core</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity 
            className="bg-[#11111A] p-2 rounded-full border border-[#164e63] w-9 h-9 items-center justify-center"
            onPress={() => router.push('/dashboard')}
          >
            <Text className="text-white text-xs">📊</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#11111A] p-2 rounded-full border border-[#164e63] w-9 h-9 items-center justify-center"
            onPress={() => router.push('/architecture')}
          >
            <Text className="text-white text-xs">🏗️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#11111A] p-2 rounded-full border border-[#164e63] w-9 h-9 items-center justify-center"
            onPress={() => router.push('/history')}
          >
            <Text className="text-white text-xs">📂</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#450a0a] p-2 rounded-full border border-[#991b1b] w-9 h-9 items-center justify-center"
            onPress={handleReset}
          >
            <Text className="text-white text-xs">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
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
          <View className="flex-row items-center px-6 py-3">
            <View className="w-8 h-8 rounded-full bg-emerald-600 items-center justify-center mr-2">
              <Text className="text-white text-xs">🤖</Text>
            </View>
            <View className="bg-[#1E1E2E] rounded-2xl rounded-bl-sm px-4 py-3 flex-row items-center border border-[#064e3b]">
              <ActivityIndicator size="small" color="#10B981" />
              <Text className="text-emerald-400 text-sm ml-2">Agents analyzing request...</Text>
            </View>
          </View>
        )}

        {latestLogs.length > 0 && (
          <View className="px-4 mb-2">
            <TouchableOpacity 
              onPress={() => setShowLogs(!showLogs)}
              className="bg-[#11111A] border border-[#164e63] py-2 px-4 rounded-full self-start flex-row items-center shadow-lg shadow-[#164e63]"
            >
              <Text className="text-cyan-400 text-xs font-bold uppercase tracking-widest mr-2">
                {showLogs ? 'Hide Agent Trace' : 'Show Agent Trace'}
              </Text>
              <Text className="text-cyan-400 text-xs">{showLogs ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {latestLogs.length > 0 && showLogs && <WorkflowVisualizer logs={latestLogs} />}

        {!isLoading && messages.length <= 2 && (
          <QuickActionChips onSelect={(t) => handleSend(t)} />
        )}

        <ChatInput onSend={(t) => handleSend(t)} isLoading={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
