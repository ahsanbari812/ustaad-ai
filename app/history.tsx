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
    <View className="bg-[#0A0A0F] p-4 rounded-2xl mb-4 border border-cyan-500/10 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-cyan-500 font-extrabold tracking-wider uppercase text-[9px]">ID: {item.id}</Text>
        <View className="bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full">
          <Text className="text-cyan-400 text-[8px] font-extrabold uppercase tracking-wide">{item.status}</Text>
        </View>
      </View>
      
      <Text className="text-white font-extrabold text-lg tracking-tight">{item.provider.name}</Text>
      <Text className="text-cyan-300/80 mb-3 uppercase tracking-wider text-[10px] mt-0.5">{item.service.replace('_', ' ')} • {item.location}</Text>
      
      <View className="bg-[#040408] p-3 rounded-xl flex-row items-center mt-2 border border-cyan-950/40">
        <Text className="text-lg mr-3">⏱️</Text>
        <View className="flex-1">
          <Text className="text-slate-500 font-bold text-[8px] uppercase tracking-wider">Scheduled Target</Text>
          <Text className="text-cyan-100 font-bold text-xs mt-0.5">{item.scheduled_time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#020205]">
      {/* Header */}
      <View className="px-4 py-4 border-b border-cyan-950/40 flex-row items-center justify-between shadow-sm z-10 bg-[#0A0A0F]">
        <View className="flex-row items-center">
            <Text className="text-xl mr-2.5">📂</Text>
            <Text className="text-white text-base font-extrabold tracking-widest uppercase">Audit Logs</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="bg-[#11111A] border border-cyan-500/20 px-3.5 py-1.5 rounded-full active:bg-cyan-950/40"
          activeOpacity={0.7}
        >
          <Text className="text-white text-[10px] font-extrabold tracking-wider uppercase">Close</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-cyan-500 font-extrabold tracking-wider uppercase text-xs">Retrieving Audit Trails...</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-20 h-20 rounded-full border border-cyan-500/10 items-center justify-center mb-5 relative">
            <View className="absolute inset-0 bg-cyan-500/5 rounded-full blur-2xl" />
            <Text className="text-3xl">📭</Text>
          </View>
          <Text className="text-white text-lg font-bold mb-1.5 tracking-wider uppercase">No Logs Available</Text>
          <Text className="text-slate-500 text-center text-xs tracking-wider">Dispatch transaction logs will populate here once bookings are created.</Text>
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
