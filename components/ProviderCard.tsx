import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ProviderMatch } from '../utils/types';

interface ProviderCardProps {
  key?: string;
  match: ProviderMatch;
  index: number;
  onBook: () => void;
}

export default function ProviderCard({ match, index, onBook }: ProviderCardProps) {
  const { provider, score, reasoning } = match;
  const router = useRouter();
  
  return (
    <View className="bg-[#05050A] rounded-xl p-4 mb-3 border border-cyan-900 shadow-lg shadow-cyan-900">
      <View className="flex-row justify-between items-start mb-2">
        <TouchableOpacity className="flex-1 flex-row items-center" onPress={() => router.push(`/provider/${provider.id}`)}>
          {provider.profilePic && (
            <Image 
              source={{ uri: provider.profilePic }} 
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, borderColor: '#06b6d4', borderWidth: 1 }}
            />
          )}
          <View>
            <Text className="text-white font-bold text-lg">{provider.name}</Text>
            <Text className="text-cyan-400 text-xs uppercase tracking-wider mt-1">{provider.service.replace('_', ' ')} • {provider.location}</Text>
          </View>
        </TouchableOpacity>
        {index === 0 && (
          <View className="bg-[#082f49] border border-[#0c4a6e] px-2 py-1 rounded">
            <Text className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">Top Match</Text>
          </View>
        )}
      </View>
      
      {provider.bio && (
        <Text style={{ color: '#A5F3FC', fontSize: 12, marginBottom: 8, fontStyle: 'italic', paddingHorizontal: 4 }}>
          "{provider.bio}"
        </Text>
      )}
      
      <View className="flex-row items-center mb-2">
        <Text className="text-yellow-400 font-bold mr-3">⭐ {provider.rating}</Text>
        <Text className="text-cyan-200 mr-3 text-xs">📍 {provider.distance}km</Text>
        <Text className="text-cyan-200 text-xs">⏳ {provider.responseTime}</Text>
      </View>
      
      <View className="bg-[#082f49] border border-[#0c4a6e] p-2 rounded mb-3">
        <Text className="text-cyan-300 text-[10px] italic">AI Reasoning: {reasoning}</Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-emerald-400 font-bold text-sm">{provider.estimatedPrice}</Text>
        <TouchableOpacity 
          className="bg-[#0c4a6e] border border-[#0369a1] px-4 py-1.5 rounded"
          onPress={onBook}
        >
          <Text className="text-cyan-400 font-bold text-xs uppercase tracking-wider">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
