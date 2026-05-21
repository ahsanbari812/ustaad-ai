import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const teamMembers = [
    { name: "Muhammad Ahsan Bari", role: "AI Engineer" },
    { name: "Ramaize Shahab", role: "Full Stack Developer" }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Top Header */}
        <View className="px-6 pt-10 pb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Image
              source={require('../assets/logo-final.png')}
              style={{ width: 32, height: 32, borderRadius: 8 }}
              className="mr-3"
            />
            <Text className="text-white font-bold tracking-widest text-sm">USTAAD AI</Text>
          </View>
          <View className="bg-[#1A1A1A] border border-[#333] px-3 py-1 rounded-full">
            <Text className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Challenge 2</Text>
          </View>
        </View>

        {/* Minimal Hero Section */}
        <View className="px-6 pt-12 pb-16">
          <Text className="text-cyan-400 text-sm font-light tracking-[4px] uppercase mb-2">
            #AISeekho2026 Antigravity Hackathon
          </Text>
          <Text className="text-white text-5xl font-extrabold tracking-tight mb-4 leading-[56px]">
            Agentic AI for the{"\n"}Informal Economy.
          </Text>
          <Text className="text-slate-400 text-base leading-7 mb-10 pr-4">
            Ustaad AI orchestrates multiple specialized AI agents to seamlessly connect users with local service providers through a natural language interface.
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/chat')}
            className="bg-white rounded-full py-4 items-center mb-6 shadow-sm shadow-white/10"
          >
            <Text className="text-black font-extrabold text-[15px] tracking-wide">Launch Experience</Text>
          </TouchableOpacity>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push('/dashboard')}
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 items-center justify-center flex-row"
            >
              <Text className="mr-2">📊</Text>
              <Text className="text-white text-xs font-bold tracking-widest uppercase">Telemetry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/architecture')}
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 items-center justify-center flex-row"
            >
              <Text className="mr-2">🏗️</Text>
              <Text className="text-white text-xs font-bold tracking-widest uppercase">Architecture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Clean Features Section */}
        <View className="px-6 mb-16">
          <Text className="text-white font-bold text-lg mb-6">System Capabilities</Text>

          <View className="bg-[#111] border border-[#222] rounded-3xl p-6 mb-4">
            <View className="w-10 h-10 bg-[#1A1A1A] rounded-full items-center justify-center mb-4 border border-[#333]">
              <Text>🧠</Text>
            </View>
            <Text className="text-white font-bold text-base mb-2">Intent & NLP Processing</Text>
            <Text className="text-slate-400 text-sm leading-6">Powered by Gemini 2.5 Flash, our agents seamlessly parse unstructured Roman Urdu requests into structured intent data.</Text>
          </View>

          <View className="bg-[#111] border border-[#222] rounded-3xl p-6 mb-4">
            <View className="w-10 h-10 bg-[#1A1A1A] rounded-full items-center justify-center mb-4 border border-[#333]">
              <Text>⚡</Text>
            </View>
            <Text className="text-white font-bold text-base mb-2">Sequential Orchestration</Text>
            <Text className="text-slate-400 text-sm leading-6">A multi-agent pipeline passing context between Intent, Location, Ranking, and Booking nodes for flawless execution.</Text>
          </View>

          <View className="bg-[#111] border border-[#222] rounded-3xl p-6">
            <View className="w-10 h-10 bg-[#1A1A1A] rounded-full items-center justify-center mb-4 border border-[#333]">
              <Text>⚖️</Text>
            </View>
            <Text className="text-white font-bold text-base mb-2">Heuristic Ranking</Text>
            <Text className="text-slate-400 text-sm leading-6">Providers are matched using simulated vector distances, ratings, and response times for the most optimal recommendation.</Text>
          </View>
        </View>

        {/* Minimal Team Section */}
        <View className="px-6">
          <Text className="text-white font-bold text-lg mb-6">Development Team</Text>

          <View className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden">
            {teamMembers.map((member, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between p-5 ${index !== teamMembers.length - 1 ? 'border-b border-[#222]' : ''}`}
              >
                <View>
                  <Text className="text-white font-bold text-base">{member.name}</Text>
                  <Text className="text-slate-500 text-xs mt-1 uppercase tracking-widest">{member.role}</Text>
                </View>
                <View className="bg-[#1A1A1A] w-8 h-8 rounded-full items-center justify-center border border-[#333]">
                  <Text className="text-slate-400 text-xs">→</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
