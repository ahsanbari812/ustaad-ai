import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const SERVICES = [
  { id: '1', name: 'Plumber', icon: '🚰', color: '#ef4444' },
  { id: '2', name: 'Electrician', icon: '⚡', color: '#eab308' },
  { id: '3', name: 'Tutor', icon: '📚', color: '#3b82f6' },
  { id: '4', name: 'AC Tech', icon: '❄️', color: '#06b6d4' },
  { id: '5', name: 'Mechanic', icon: '🔧', color: '#64748b' },
  { id: '6', name: 'Carpenter', icon: '🪚', color: '#92400e' },
  { id: '7', name: 'Painter', icon: '🎨', color: '#ec4899' },
  { id: '8', name: 'Beautician', icon: '💅', color: '#d946ef' },
];

const LOCATIONS = [
  'Gulshan', 'DHA', 'Clifton', 'Nazimabad', 'PECHS', 'Korangi', 'FB Area', 'Malir'
];

interface DiscoveryHubProps {
  onSelectService: (service: string) => void;
}

export default function DiscoveryHub({ onSelectService }: DiscoveryHubProps) {
  return (
    <View className="mb-6">
      <View className="px-4 mb-3 flex-row justify-between items-center">
        <Text className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em]">Available Services</Text>
        <Text className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">{SERVICES.length} Categories</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mb-6"
      >
        {SERVICES.map((s) => (
          <TouchableOpacity 
            key={s.id}
            onPress={() => onSelectService(`I need a ${s.name}`)}
            className="bg-[#0A0A0F] border border-slate-800 rounded-2xl p-4 mr-3 items-center w-24 shadow-sm"
          >
            <View style={{ backgroundColor: `${s.color}20`, borderColor: `${s.color}40` }} className="w-12 h-12 rounded-2xl items-center justify-center border mb-3">
              <Text className="text-2xl">{s.icon}</Text>
            </View>
            <Text className="text-white font-bold text-[11px]">{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-4 mb-3">
        <Text className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em]">Service Coverage</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row gap-2">
          {LOCATIONS.map((loc) => (
            <View key={loc} className="bg-[#11111A] border border-cyan-900/30 px-3 py-1.5 rounded-full">
              <Text className="text-cyan-200/60 text-[10px] font-bold uppercase tracking-widest">{loc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
