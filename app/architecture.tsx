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
        <Text className="text-white text-base font-extrabold tracking-widest uppercase">System Map</Text>
        <View className="w-9" />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView className="flex-1 px-4 py-5" showsVerticalScrollIndicator={false}>
          
          <Text className="text-cyan-400/80 text-[9px] font-extrabold tracking-widest text-center mb-8 mt-1 uppercase">
            Multi-Agent Orchestration Blueprint
          </Text>

          {/* Frontend Layer */}
          <View className="bg-[#0A0A0F] border border-blue-500/25 rounded-2xl p-5 mb-2 shadow-sm">
            <Text className="text-blue-400 font-extrabold text-[8px] uppercase tracking-wider mb-2">User Interface</Text>
            <Text className="text-white font-black text-lg tracking-tight mb-1">Expo React Native</Text>
            <Text className="text-cyan-100/60 text-xs leading-5">Modern mobile frontend styled with utility class tokens, providing an immersive, chat-based agent interaction shell.</Text>
          </View>

          <View className="items-center py-1.5">
            <Text className="text-cyan-800 font-bold">↓</Text>
          </View>

          {/* Orchestration Layer */}
          <View className="bg-gradient-to-br from-cyan-950/10 to-blue-950/10 border border-cyan-500/25 rounded-2xl p-4 mb-2 shadow-sm">
            <Text className="text-cyan-300 font-extrabold text-[8px] uppercase tracking-wider mb-3.5">Ustaad AI Pipeline</Text>
            
            <View className="flex-row items-center justify-between mb-3.5">
              <View className="bg-[#05050A] border border-cyan-700/40 p-2.5 rounded-xl w-[46%] items-center shadow-md">
                <Text className="text-white text-[9px] font-bold text-center tracking-wide uppercase">1. Intent Agent</Text>
              </View>
              <Text className="text-cyan-400/80 text-xs">→</Text>
              <View className="bg-[#05050A] border border-cyan-700/40 p-2.5 rounded-xl w-[46%] items-center shadow-md">
                <Text className="text-white text-[9px] font-bold text-center tracking-wide uppercase">2. Location Agent</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-1.5">
              <View className="bg-[#05050A] border border-cyan-700/40 p-2.5 rounded-xl w-[46%] items-center shadow-md">
                <Text className="text-white text-[9px] font-bold text-center tracking-wide uppercase">4. Booking Agent</Text>
              </View>
              <Text className="text-cyan-400/80 text-xs">←</Text>
              <View className="bg-[#05050A] border border-cyan-700/40 p-2.5 rounded-xl w-[46%] items-center shadow-md">
                <Text className="text-white text-[9px] font-bold text-center tracking-wide uppercase">3. Ranking Agent</Text>
              </View>
            </View>
            
            <Text className="text-cyan-200/50 text-[8px] text-center mt-2.5 uppercase tracking-wide">Dynamic State Orchestration Engine</Text>
          </View>

          <View className="items-center py-1.5">
            <Text className="text-cyan-800 font-bold">↓</Text>
          </View>

          <View className="flex-row justify-between mb-8">
            {/* AI Layer */}
            <View className="bg-[#0A0A0F] border border-purple-500/25 rounded-2xl p-3.5 w-[48%] shadow-sm">
              <Text className="text-purple-400 font-bold text-[8px] uppercase tracking-wider mb-1.5">Cognitive Layer</Text>
              <Text className="text-white font-extrabold text-sm tracking-tight mb-1" numberOfLines={1}>Gemini 3.5 Flash</Text>
              <Text className="text-cyan-100/50 text-[9px] leading-3.5">Deep NLU classification & JSON schema extraction.</Text>
            </View>

            {/* Data Layer */}
            <View className="bg-[#0A0A0F] border border-orange-500/25 rounded-2xl p-3.5 w-[48%] shadow-sm">
              <Text className="text-orange-400 font-bold text-[8px] uppercase tracking-wider mb-1.5">Data & Triggers</Text>
              <Text className="text-white font-extrabold text-sm tracking-tight mb-1" numberOfLines={1}>Async & Notifications</Text>
              <Text className="text-cyan-100/50 text-[9px] leading-3.5">Local cache, simulated DB, and scheduler client.</Text>
            </View>
          </View>

          <View className="h-10" />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
