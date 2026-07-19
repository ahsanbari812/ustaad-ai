import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import providersData from '../../data/providers.json';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const provider = providersData.find(p => p.id === id);

  if (!provider) {
    return (
      <SafeAreaView className="flex-1 bg-[#020205] items-center justify-center">
        <Text className="text-white font-bold">Partner not found</Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-4 bg-cyan-600 px-4 py-2 rounded-xl"
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#020205]">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between z-10 border-b border-cyan-950/40 bg-[#0A0A0F]">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-9 h-9 bg-[#11111A] border border-cyan-500/20 rounded-full items-center justify-center active:bg-cyan-950/40"
          activeOpacity={0.7}
        >
          <Text className="text-white text-base">←</Text>
        </TouchableOpacity>
        <View className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
          <Text className="text-cyan-400 font-extrabold text-[9px] uppercase tracking-wider">{provider.service.replace('_', ' ')}</Text>
        </View>
        <View className="w-9" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Avatar / Identity */}
        <View className="items-center mt-6 mb-6">
          <View className="w-20 h-20 bg-cyan-950/20 rounded-full items-center justify-center border border-cyan-500/30 shadow-md">
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} 
              style={{ width: '100%', height: '100%', borderRadius: 40 }}
            />
          </View>
          <Text className="text-white text-xl font-black mt-4 text-center">{provider.name}</Text>
          <Text className="text-slate-400 text-xs mt-1">📍 {provider.location} • {provider.distance}km away</Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-500/10 mb-5 shadow-sm">
          <View className="items-center flex-1">
            <Text className="text-yellow-400 text-base font-black">⭐ {provider.rating}</Text>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Rating</Text>
          </View>
          <View className="w-[1px] bg-slate-800/80 mx-2" />
          <View className="items-center flex-1">
            <Text className="text-white text-base font-black">{provider.experience_years} Yrs</Text>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Experience</Text>
          </View>
          <View className="w-[1px] bg-slate-800/80 mx-2" />
          <View className="items-center flex-1">
            <Text className="text-emerald-400 text-base font-black">{provider.availability ? 'Yes' : 'No'}</Text>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Available</Text>
          </View>
        </View>

        {/* Details List */}
        <View className="bg-[#0A0A0F] rounded-2xl p-4 border border-cyan-500/10 mb-6">
          <Text className="text-white font-extrabold text-sm mb-4 uppercase tracking-wider">Service Overview</Text>
          
          <View className="flex-row justify-between mb-4 border-b border-slate-900 pb-3">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-base w-7">💰</Text>
              <Text className="text-slate-400 text-xs font-semibold">Estimated Price</Text>
            </View>
            <Text className="text-emerald-400 font-extrabold text-xs">{(provider as any).estimatedPrice || provider.price_range}</Text>
          </View>
          
          <View className="flex-row justify-between mb-4 border-b border-slate-900 pb-3">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-base w-7">⚡</Text>
              <Text className="text-slate-400 text-xs font-semibold">Response Time</Text>
            </View>
            <Text className="text-cyan-300 font-extrabold text-xs">{(provider as any).responseTime || '30 mins'}</Text>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-base w-7">📞</Text>
              <Text className="text-slate-400 text-xs font-semibold">Verification Contact</Text>
            </View>
            <Text className="text-cyan-100 font-extrabold text-xs">{provider.phone}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Action */}
      <View className="p-4 bg-[#0A0A0F] border-t border-cyan-950/40 pb-8">
        <TouchableOpacity 
          className={`py-4 rounded-2xl items-center shadow-lg ${provider.availability ? 'bg-cyan-600 border border-cyan-400/30 active:bg-cyan-500' : 'bg-slate-800 opacity-40'}`}
          disabled={!provider.availability}
          onPress={() => {
            router.back();
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-extrabold text-sm uppercase tracking-widest">
            {provider.availability ? 'Request Callback' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
