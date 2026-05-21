import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SystemArchitectureScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#05050A]">
      {/* Header */}
      <View className="px-4 py-4 border-b border-cyan-900/30 flex-row items-center justify-between z-10 bg-[#0A0A0F] shadow-lg shadow-cyan-900/20">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-[#11111A] border border-cyan-900/50 rounded-full items-center justify-center">
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold tracking-wide uppercase">Architecture Map</Text>
        <View className="w-10" />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        
        <Text className="text-cyan-400/80 text-[10px] tracking-widest text-center mb-8 mt-2 uppercase">
          Agentic Orchestration Framework
        </Text>

        {/* Frontend Layer */}
        <View className="bg-[#0A0A0F] border border-blue-500/30 rounded-2xl p-5 mb-2 shadow-lg shadow-blue-900/10">
          <Text className="text-blue-400 font-bold text-[9px] uppercase tracking-widest mb-2">Presentation Layer</Text>
          <Text className="text-white font-extrabold text-xl tracking-tight mb-1">Expo React Native</Text>
          <Text className="text-cyan-100/60 text-xs">Cross-platform UI with NativeWind styling, providing a WhatsApp-like Chat UX.</Text>
        </View>

        <View className="items-center py-2">
          <Text className="text-cyan-700 font-bold">↓</Text>
        </View>

        {/* Orchestration Layer */}
        <View className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/40 rounded-2xl p-5 mb-2 shadow-2xl shadow-cyan-900/20">
          <Text className="text-cyan-300 font-bold text-[9px] uppercase tracking-[0.2em] mb-4">Google Antigravity Pipeline</Text>
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-[#05050A] border border-cyan-700/50 p-3 rounded-xl w-[45%] items-center shadow-lg shadow-cyan-900/30">
              <Text className="text-white text-[10px] font-bold text-center tracking-widest uppercase">1. Intent Node</Text>
            </View>
            <Text className="text-cyan-400 text-xs">→</Text>
            <View className="bg-[#05050A] border border-cyan-700/50 p-3 rounded-xl w-[45%] items-center shadow-lg shadow-cyan-900/30">
              <Text className="text-white text-[10px] font-bold text-center tracking-widest uppercase">2. Location Node</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-[#05050A] border border-cyan-700/50 p-3 rounded-xl w-[45%] items-center shadow-lg shadow-cyan-900/30">
              <Text className="text-white text-[10px] font-bold text-center tracking-widest uppercase">4. Booking Node</Text>
            </View>
            <Text className="text-cyan-400 text-xs">←</Text>
            <View className="bg-[#05050A] border border-cyan-700/50 p-3 rounded-xl w-[45%] items-center shadow-lg shadow-cyan-900/30">
              <Text className="text-white text-[10px] font-bold text-center tracking-widest uppercase">3. Ranking Node</Text>
            </View>
          </View>
          
          <Text className="text-cyan-200/50 text-[9px] text-center mt-3 uppercase tracking-widest">Multi-Agent State Orchestration Engine</Text>
        </View>

        <View className="items-center py-2">
          <Text className="text-cyan-700 font-bold">↓</Text>
        </View>

        <View className="flex-row justify-between mb-8">
          {/* AI Layer */}
          <View className="bg-[#0A0A0F] border border-purple-500/40 rounded-2xl p-5 w-[48%] shadow-lg shadow-purple-900/10">
            <Text className="text-purple-400 font-bold text-[9px] uppercase tracking-widest mb-2">Cognitive Layer</Text>
            <Text className="text-white font-extrabold tracking-tight mb-2">Gemini 2.5 Flash</Text>
            <Text className="text-cyan-100/60 text-[10px] leading-4">NLU & JSON extraction for unstructured text.</Text>
          </View>

          {/* Data Layer */}
          <View className="bg-[#0A0A0F] border border-orange-500/40 rounded-2xl p-5 w-[48%] shadow-lg shadow-orange-900/10">
            <Text className="text-orange-400 font-bold text-[9px] uppercase tracking-widest mb-2">Persistence Layer</Text>
            <Text className="text-white font-extrabold tracking-tight mb-2">Local Async & API</Text>
            <Text className="text-cyan-100/60 text-[10px] leading-4">Local history, simulated DB, and push triggers.</Text>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
