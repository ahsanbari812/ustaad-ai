import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { storageService } from '../services/storageService';
import { BookingSimulation } from '../utils/types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingHistoryScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [bookings, setBookings] = useState<BookingSimulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadBookings = async () => {
    const data = await storageService.getBookings();
    setBookings(data);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: BookingSimulation }) => (
    <View className="bg-[#0A0A0F] p-4 rounded-2xl mb-4 border border-cyan-900/40 shadow-lg shadow-cyan-900/10">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-cyan-400 font-bold tracking-widest uppercase text-[10px]">TRANSACTION: {item.id}</Text>
        <View className="bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded">
          <Text className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest">{item.status}</Text>
        </View>
      </View>
      
      <Text className="text-white font-extrabold text-xl tracking-tight">{item.provider.name}</Text>
      <Text className="text-cyan-300/60 mb-3 uppercase tracking-wider text-xs mt-1">{item.service.replace('_', ' ')} • {item.location}</Text>
      
      <View className="bg-[#05050A] p-3 rounded-xl flex-row items-center mt-2 border border-cyan-900/30">
        <Text className="text-xl mr-3">⏱️</Text>
        <View>
          <Text className="text-cyan-600 font-bold text-[9px] uppercase tracking-widest">Scheduled Execution</Text>
          <Text className="text-cyan-50 font-bold">{item.scheduled_time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#05050A]">
      <View className="px-4 py-4 border-b border-cyan-900/30 flex-row items-center justify-between shadow-lg shadow-cyan-900/20 z-10 bg-[#0A0A0F]">
        <View className="flex-row items-center">
            <Text className="text-2xl mr-2">📂</Text>
            <Text className="text-white text-lg font-bold tracking-wide uppercase">Audit Logs</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#11111A] border border-cyan-900/50 px-4 py-2 rounded-full">
          <Text className="text-white text-xs font-bold tracking-wider">CLOSE</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-cyan-500 font-bold tracking-widest uppercase">Retrieving Logs...</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-24 h-24 rounded-full border border-cyan-500/30 items-center justify-center mb-6 relative">
            <View className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl" />
            <Text className="text-4xl">📭</Text>
          </View>
          <Text className="text-white text-xl font-bold mb-2 tracking-wide uppercase">No Transactions</Text>
          <Text className="text-cyan-500/60 text-center text-xs tracking-wider">Agentic operations will be logged here securely.</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
