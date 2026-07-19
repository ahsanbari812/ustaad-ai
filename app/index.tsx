import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#03030A]">
      {/* Sleek Neon Background Glow Orbs */}
      <View className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px]" pointerEvents="none" />
      <View className="absolute top-[250px] right-[-100px] w-[350px] h-[350px] bg-indigo-900/10 rounded-full blur-[120px]" pointerEvents="none" />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Top Brand Navbar */}
          <View className="px-6 pt-8 pb-4 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Image
                source={require('../assets/logo-final.png')}
                style={{ width: 36, height: 36, borderRadius: 12, borderColor: '#312e81', borderWidth: 1 }}
                className="mr-3"
              />
              <Text className="text-white font-extrabold tracking-[0.3em] text-xs uppercase">USTAAD AI</Text>
            </View>
            <View className="bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
              <Text className="text-indigo-300 text-[8px] font-extrabold tracking-wider uppercase">ENGINE v4.0</Text>
            </View>
          </View>

          {/* Premium Hero Title */}
          <View className="px-6 pt-12 pb-10">
            <View className="bg-purple-950/20 border border-purple-500/20 px-3 py-1 rounded-full self-start mb-4">
              <Text className="text-purple-400 text-[9px] font-bold tracking-[0.2em] uppercase">INTELLIGENT DISPATCH</Text>
            </View>
            
            <Text className="text-white text-5xl font-black tracking-tighter mb-5 leading-[54px]">
              On-Demand{"\n"}Services,{"\n"}
              <Text className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Orchestrated.</Text>
            </Text>
            
            <Text className="text-slate-400 text-sm leading-6 mb-10 pr-4 font-medium">
              Ustaad AI coordinates specialized NLU agents to seamlessly connect you with expert local providers through a natural language interface.
            </Text>

            {/* Glowing CTA Button (Indigo/Purple Theme) */}
            <TouchableOpacity
              onPress={() => router.push('/chat')}
              className="bg-indigo-600 rounded-2xl py-4 items-center mb-5 shadow-lg shadow-indigo-500/30 active:bg-indigo-500 border border-indigo-400/40"
              activeOpacity={0.8}
            >
              <Text className="text-white font-extrabold text-sm tracking-widest uppercase">Launch Assistant</Text>
            </TouchableOpacity>

            {/* Sub Nav Links */}
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => router.push('/dashboard')}
                className="flex-1 bg-[#0A0A14] border border-indigo-950/40 rounded-2xl py-4 items-center justify-center flex-row active:bg-indigo-950/20"
                activeOpacity={0.7}
              >
                <Text className="mr-2 text-xs">📊</Text>
                <Text className="text-slate-300 text-[10px] font-bold tracking-wider uppercase">Telemetry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/architecture')}
                className="flex-1 bg-[#0A0A14] border border-indigo-950/40 rounded-2xl py-4 items-center justify-center flex-row active:bg-indigo-950/20"
                activeOpacity={0.7}
              >
                <Text className="mr-2 text-xs">🏗️</Text>
                <Text className="text-slate-300 text-[10px] font-bold tracking-wider uppercase">Architecture</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Engine Capabilities */}
          <View className="px-6 mb-12">
            <Text className="text-white font-extrabold text-xs mb-6 uppercase tracking-widest">Capabilities Grid</Text>

            {/* Capability Card 1 */}
            <View className="bg-[#0A0A14] border border-indigo-950/60 rounded-3xl p-5 mb-4 shadow-sm relative overflow-hidden">
              <View className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
              <View className="w-9 h-9 bg-indigo-950/40 rounded-xl items-center justify-center mb-3 border border-indigo-500/20">
                <Text className="text-sm">🧠</Text>
              </View>
              <Text className="text-white font-extrabold text-xs mb-1.5 uppercase tracking-wider">Multilingual NLU</Text>
              <Text className="text-slate-400 text-xs leading-5">
                Uses Google Gemini models to instantly translate and parse unstructured Roman Urdu and English requests into structured intent entities.
              </Text>
            </View>

            {/* Capability Card 2 */}
            <View className="bg-[#0A0A14] border border-indigo-950/60 rounded-3xl p-5 mb-4 shadow-sm relative overflow-hidden">
              <View className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl" />
              <View className="w-9 h-9 bg-purple-950/40 rounded-xl items-center justify-center mb-3 border border-purple-500/20">
                <Text className="text-sm">⚡</Text>
              </View>
              <Text className="text-white font-extrabold text-xs mb-1.5 uppercase tracking-wider">Orchestration Flow</Text>
              <Text className="text-slate-400 text-xs leading-5">
                Coordinates intent classifiers, location parsers, and ranking systems dynamically in a multi-agent pipeline for high-precision dispatches.
              </Text>
            </View>

            {/* Capability Card 3 */}
            <View className="bg-[#0A0A14] border border-indigo-950/60 rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <View className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl" />
              <View className="w-9 h-9 bg-pink-950/40 rounded-xl items-center justify-center mb-3 border border-pink-500/20">
                <Text className="text-sm">⚖️</Text>
              </View>
              <Text className="text-white font-extrabold text-xs mb-1.5 uppercase tracking-wider">Ranking Heuristics</Text>
              <Text className="text-slate-400 text-xs leading-5">
                Automatically matches and indexes service professionals based on physical distance, provider ratings, and response-speed telemetry.
              </Text>
            </View>
          </View>

          {/* Sleek Minimal Branding Footer */}
          <View className="px-6 items-center pt-4">
            <Text className="text-slate-600 text-[9px] uppercase tracking-[0.3em] font-extrabold">Ustaad AI Platform</Text>
            <Text className="text-slate-700 text-[8px] mt-1 tracking-wider">An on-demand agentic service marketplace.</Text>
          </View>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
