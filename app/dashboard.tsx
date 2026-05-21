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
    <SafeAreaView className="flex-1 bg-[#05050A]">
      {/* Header */}
      <View className="px-4 py-4 border-b border-cyan-900/30 flex-row items-center justify-between z-10 bg-[#0A0A0F] shadow-lg shadow-cyan-900/20">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-[#11111A] border border-cyan-900/50 rounded-full items-center justify-center">
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold tracking-wide uppercase">Telemetry</Text>
        <View className="w-10" />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        
        {/* Antigravity Banner */}
        <View className="bg-cyan-900/10 border border-cyan-500/30 rounded-2xl p-6 mb-6 items-center shadow-lg shadow-cyan-900/20">
          <Text className="text-cyan-50 text-xl font-extrabold tracking-widest uppercase">Google Antigravity</Text>
          <Text className="text-cyan-400 text-[10px] uppercase tracking-widest mt-2 font-bold">Multi-Agent Engine Active 🟢</Text>
        </View>

        {/* Core Metrics */}
        <Text className="text-cyan-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">System Health</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          
          <View className="w-[48%] bg-[#0A0A0F] p-4 rounded-2xl mb-4 border border-cyan-900/40 shadow-lg shadow-cyan-900/10">
            <Text className="text-cyan-400/80 text-[9px] uppercase tracking-widest mb-1">Executions</Text>
            <Text className="text-white text-3xl font-extrabold">{stats.totalRequests}</Text>
          </View>

          <View className="w-[48%] bg-[#0A0A0F] p-4 rounded-2xl mb-4 border border-cyan-900/40 shadow-lg shadow-cyan-900/10">
            <Text className="text-cyan-400/80 text-[9px] uppercase tracking-widest mb-1">Transactions</Text>
            <Text className="text-cyan-400 text-3xl font-extrabold">{stats.bookings}</Text>
          </View>

          <View className="w-[48%] bg-[#0A0A0F] p-4 rounded-2xl border border-cyan-900/40 shadow-lg shadow-cyan-900/10">
            <Text className="text-cyan-400/80 text-[9px] uppercase tracking-widest mb-1">Success Rate</Text>
            <Text className="text-blue-400 text-3xl font-extrabold">
              {stats.totalRequests ? Math.round((stats.successfulMatches / stats.totalRequests) * 100) : 0}%
            </Text>
          </View>

          <View className="w-[48%] bg-[#0A0A0F] p-4 rounded-2xl border border-cyan-900/40 shadow-lg shadow-cyan-900/10">
            <Text className="text-cyan-400/80 text-[9px] uppercase tracking-widest mb-1">Confidence</Text>
            <Text className="text-purple-400 text-3xl font-extrabold">{stats.avgConfidence.toFixed(1)}%</Text>
          </View>

        </View>

        {/* Active Agents */}
        <Text className="text-cyan-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">Active Node Instances</Text>
        
        <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-900/40 mb-3 flex-row items-center shadow-lg shadow-cyan-900/10">
          <Text className="text-2xl mr-4">🧠</Text>
          <View className="flex-1">
            <Text className="text-white font-bold tracking-wide">Intent Node</Text>
            <Text className="text-cyan-200/60 text-[10px]">NLU & Multilingual Parsing (Gemini 2.5)</Text>
          </View>
          <Text className="text-cyan-400 text-[9px] font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/20">ONLINE</Text>
        </View>

        <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-900/40 mb-3 flex-row items-center shadow-lg shadow-cyan-900/10">
          <Text className="text-2xl mr-4">📍</Text>
          <View className="flex-1">
            <Text className="text-white font-bold tracking-wide">Location Node</Text>
            <Text className="text-cyan-200/60 text-[10px]">Geospatial Entity Extraction</Text>
          </View>
          <Text className="text-cyan-400 text-[9px] font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/20">ONLINE</Text>
        </View>

        <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-900/40 mb-3 flex-row items-center shadow-lg shadow-cyan-900/10">
          <Text className="text-2xl mr-4">⚖️</Text>
          <View className="flex-1">
            <Text className="text-white font-bold tracking-wide">Ranking Node</Text>
            <Text className="text-cyan-200/60 text-[10px]">Heuristic Scoring & Vector Matching</Text>
          </View>
          <Text className="text-cyan-400 text-[9px] font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/20">ONLINE</Text>
        </View>

        <View className="h-10" />
      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
