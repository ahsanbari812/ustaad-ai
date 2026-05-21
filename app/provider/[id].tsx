import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import providersData from '../../data/providers.json';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const provider = providersData.find(p => p.id === id);

  if (!provider) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0A14] items-center justify-center">
        <Text className="text-white">Provider not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-emerald-600 px-4 py-2 rounded">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A14]">
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center">
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <View className="bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-500/30">
          <Text className="text-emerald-400 font-bold text-xs uppercase">{provider.service.replace('_', ' ')}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Avatar / Identity */}
        <View className="items-center mt-4 mb-6">
          <View className="w-24 h-24 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-full items-center justify-center border-4 border-[#1E1E2E] shadow-2xl">
            <Text className="text-4xl text-white font-bold">{provider.name.charAt(0)}</Text>
          </View>
          <Text className="text-white text-2xl font-bold mt-4 text-center">{provider.name}</Text>
          <Text className="text-slate-400 text-sm mt-1">📍 {provider.location} • {provider.distance}km away</Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between bg-[#1E1E2E] rounded-2xl p-4 border border-slate-800 mb-6 shadow-lg shadow-black/20">
          <View className="items-center flex-1">
            <Text className="text-yellow-400 text-lg font-bold">⭐ {provider.rating}</Text>
            <Text className="text-slate-400 text-xs mt-1">Rating</Text>
          </View>
          <View className="w-[1px] bg-slate-700 mx-2" />
          <View className="items-center flex-1">
            <Text className="text-white text-lg font-bold">{provider.experience_years} yrs</Text>
            <Text className="text-slate-400 text-xs mt-1">Experience</Text>
          </View>
          <View className="w-[1px] bg-slate-700 mx-2" />
          <View className="items-center flex-1">
            <Text className="text-emerald-400 text-lg font-bold">{provider.availability ? 'Yes' : 'No'}</Text>
            <Text className="text-slate-400 text-xs mt-1">Available</Text>
          </View>
        </View>

        {/* Details List */}
        <View className="bg-[#1E1E2E] rounded-2xl p-4 border border-slate-800 mb-6">
          <Text className="text-white font-bold text-lg mb-4">Service Details</Text>
          
          <View className="flex-row justify-between mb-4 border-b border-slate-800 pb-4">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-lg w-8">💰</Text>
              <Text className="text-slate-300">Estimated Price</Text>
            </View>
            <Text className="text-white font-medium">{(provider as any).estimatedPrice || provider.price_range}</Text>
          </View>
          
          <View className="flex-row justify-between mb-4 border-b border-slate-800 pb-4">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-lg w-8">⚡</Text>
              <Text className="text-slate-300">Response Time</Text>
            </View>
            <Text className="text-white font-medium">{(provider as any).responseTime || '30 mins'}</Text>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-lg w-8">📞</Text>
              <Text className="text-slate-300">Contact</Text>
            </View>
            <Text className="text-emerald-400 font-medium">{provider.phone}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Action */}
      <View className="p-4 bg-[#0C0C18] border-t border-slate-800 pb-8">
        <TouchableOpacity 
          className={`py-4 rounded-xl items-center shadow-lg ${provider.availability ? 'bg-emerald-600 shadow-emerald-900/50' : 'bg-slate-700 opacity-50'}`}
          disabled={!provider.availability}
          onPress={() => {
            // Simulated booking action
            router.back();
            // In a full implementation, this could trigger a context update to send "book X" to the chat
          }}
        >
          <Text className="text-white font-bold text-lg">
            {provider.availability ? 'Book Appointment' : 'Currently Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
