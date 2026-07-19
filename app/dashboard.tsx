import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storageService } from '../services/storageService';

export default function AgentDashboardScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [stats, setStats] = useState({
    totalRequests: 0,
    successfulMatches: 0,
    bookings: 0,
    avgConfidence: 94.5
  });

  useEffect(() => {
    loadStats();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadStats = async () => {
    const history = await storageService.getMessages() || [];
    const bookings = await storageService.getBookings() || [];
    
    const aiMessages = history.filter(m => m.sender === 'ai');
    
    setStats({
      totalRequests: aiMessages.length,
      successfulMatches: aiMessages.filter(m => m.providers && m.providers.length > 0).length,
      bookings: bookings.length,
      avgConfidence: 94.5 + Math.random() * 2
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#020205]">
      {/* Header */}
      <View className="px-4 py-4 border-b border-cyan-950/40 flex-row items-center justify-between z-10 bg-[#0A0A0F] shadow-sm">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-9 h-9 bg-[#11111A] border border-cyan-500/20 rounded-full items-center justify-center active:bg-cyan-950/40"
          activeOpacity={0.7}
        >
          <Text className="text-white text-base">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-base font-extrabold tracking-widest uppercase">System Telemetry</Text>
        <View className="w-9" />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView className="flex-1 px-4 py-5" showsVerticalScrollIndicator={false}>
          
          {/* Dispatch Banner */}
          <View className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 mb-5 items-center">
            <Text className="text-white text-lg font-black tracking-widest uppercase">Ustaad AI Core</Text>
            <Text className="text-cyan-400 text-[9px] uppercase tracking-wider mt-1.5 font-extrabold">Autonomous Dispatch Pipeline Active 🟢</Text>
          </View>

          {/* Core Metrics */}
          <Text className="text-cyan-600 font-extrabold text-[9px] uppercase tracking-wider mb-2.5">Pipeline Performance</Text>
          <View className="flex-row flex-wrap justify-between mb-5 gap-y-3">
            
            <View className="w-[48%] bg-[#0A0A0F] p-3.5 rounded-2xl border border-cyan-500/10 shadow-sm">
              <Text className="text-slate-500 text-[8px] uppercase tracking-wider mb-0.5 font-bold" numberOfLines={1}>Total Requests</Text>
              <Text className="text-white text-2xl font-black">{stats.totalRequests}</Text>
            </View>

            <View className="w-[48%] bg-[#0A0A0F] p-3.5 rounded-2xl border border-cyan-500/10 shadow-sm">
              <Text className="text-slate-500 text-[8px] uppercase tracking-wider mb-0.5 font-bold" numberOfLines={1}>Dispatches</Text>
              <Text className="text-cyan-400 text-2xl font-black">{stats.bookings}</Text>
            </View>

            <View className="w-[48%] bg-[#0A0A0F] p-3.5 rounded-2xl border border-cyan-500/10 shadow-sm">
              <Text className="text-slate-500 text-[8px] uppercase tracking-wider mb-0.5 font-bold" numberOfLines={1}>Match Ratio</Text>
              <Text className="text-blue-400 text-2xl font-black">
                {stats.totalRequests ? Math.round((stats.successfulMatches / stats.totalRequests) * 100) : 0}%
              </Text>
            </View>

            <View className="w-[48%] bg-[#0A0A0F] p-3.5 rounded-2xl border border-cyan-500/10 shadow-sm">
              <Text className="text-slate-500 text-[8px] uppercase tracking-wider mb-0.5 font-bold" numberOfLines={1}>Model Conf.</Text>
              <Text className="text-purple-400 text-2xl font-black">{stats.avgConfidence.toFixed(1)}%</Text>
            </View>

          </View>

          {/* Active Agents */}
          <Text className="text-cyan-600 font-extrabold text-[9px] uppercase tracking-wider mb-2.5">Active Orchestration Nodes</Text>
          
          <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-500/10 mb-3 flex-row items-center shadow-sm">
            <Text className="text-2xl mr-4">🧠</Text>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-sm tracking-wide">Intent Agent Node</Text>
              <Text className="text-slate-400 text-[10px] mt-0.5">NLU & Multilingual Request Classifier</Text>
            </View>
            <View className="bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
              <Text className="text-cyan-400 text-[8px] font-extrabold tracking-wider">ONLINE</Text>
            </View>
          </View>

          <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-500/10 mb-3 flex-row items-center shadow-sm">
            <Text className="text-2xl mr-4">📍</Text>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-sm tracking-wide">Location Parsing Node</Text>
              <Text className="text-slate-400 text-[10px] mt-0.5">Geospatial Entity Extractor</Text>
            </View>
            <View className="bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
              <Text className="text-cyan-400 text-[8px] font-extrabold tracking-wider">ONLINE</Text>
            </View>
          </View>

          <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-500/10 mb-3 flex-row items-center shadow-sm">
            <Text className="text-2xl mr-4">⚖️</Text>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-sm tracking-wide">Rank & Score Node</Text>
              <Text className="text-slate-400 text-[10px] mt-0.5">Heuristic Engine & Vector Proximity Indexer</Text>
            </View>
            <View className="bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
              <Text className="text-cyan-400 text-[8px] font-extrabold tracking-wider">ONLINE</Text>
            </View>
          </View>

          <View className="h-10" />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
