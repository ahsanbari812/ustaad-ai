import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ProviderMatch } from '../utils/types';

interface ProviderCardProps {
  match: ProviderMatch;
  index: number;
  onBook: () => void;
}

export default function ProviderCard({ match, index, onBook }: ProviderCardProps) {
  const { provider, score, reasoning } = match;
  const router = useRouter();
  
  return (
    <View className="bg-[#0A0A14] rounded-2xl p-3.5 mb-3 border border-indigo-500/10 shadow-sm">
      {/* Header Info */}
      <View className="flex-row justify-between items-start mb-2.5 flex-wrap gap-y-1">
        <TouchableOpacity 
          className="flex-row items-center flex-1 min-w-[65%]" 
          onPress={() => router.push(`/provider/${provider.id}`)}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} 
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8, borderColor: '#6366f1', borderWidth: 1 }}
          />
          <View className="flex-1">
            <Text className="text-white font-extrabold text-base" numberOfLines={1}>{provider.name}</Text>
            <Text className="text-indigo-400/80 text-[10px] font-semibold uppercase tracking-wider mt-0.5" numberOfLines={1}>
              {provider.service.replace('_', ' ')} • {provider.location}
            </Text>
          </View>
        </TouchableOpacity>
        
        {index === 0 && (
          <View className="bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full self-start">
            <Text className="text-indigo-400 text-[8px] font-extrabold uppercase tracking-wider">Top Match</Text>
          </View>
        )}
      </View>
      
      {provider.bio && (
        <Text style={{ color: '#E0E7FF', fontSize: 11, marginBottom: 8, fontStyle: 'italic', paddingHorizontal: 2 }}>
          "{provider.bio}"
        </Text>
      )}
      
      {/* Metrics Row */}
      <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1 mb-2.5">
        <View className="flex-row items-center bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
          <Text className="text-yellow-400 font-extrabold text-[10px]">⭐ {provider.rating}</Text>
        </View>
        <View className="flex-row items-center bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          <Text className="text-indigo-300 font-semibold text-[10px]">📍 {provider.distance}km</Text>
        </View>
        <View className="flex-row items-center bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <Text className="text-emerald-300 font-semibold text-[10px]">⏳ {provider.responseTime}</Text>
        </View>
      </View>
      
      {/* AI Reasoning Section */}
      <View className="bg-indigo-950/10 border border-indigo-500/10 p-2.5 rounded-xl mb-3">
        <Text className="text-indigo-200/80 text-[10px] leading-4 font-medium">AI Match Reasoning: {reasoning}</Text>
      </View>
      
      {/* Price and Book Action */}
      <View className="flex-row justify-between items-center pt-1">
        <View>
          <Text className="text-slate-500 text-[8px] uppercase tracking-wider font-bold">Est. Price</Text>
          <Text className="text-emerald-400 font-black text-sm">{provider.estimatedPrice}</Text>
        </View>
        <TouchableOpacity 
          className="bg-indigo-600 border border-indigo-400/40 px-4 py-2 rounded-xl active:bg-indigo-500"
          onPress={onBook}
          activeOpacity={0.7}
        >
          <Text className="text-white font-extrabold text-[10px] uppercase tracking-widest">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
