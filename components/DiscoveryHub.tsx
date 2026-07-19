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
        <Text className="text-indigo-400 font-extrabold text-[9px] uppercase tracking-wider">Services Categories</Text>
        <Text className="text-slate-500 text-[8px] uppercase font-bold tracking-wider">{SERVICES.length} Available</Text>
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
            className="bg-[#0A0A14] border rounded-2xl p-3.5 mr-3 items-center w-22 shadow-sm active:bg-indigo-950/10"
            style={{ borderColor: `${s.color}20` }}
            activeOpacity={0.7}
          >
            <View style={{ backgroundColor: `${s.color}15`, borderColor: `${s.color}30` }} className="w-10 h-10 rounded-xl items-center justify-center border mb-2.5">
              <Text className="text-xl">{s.icon}</Text>
            </View>
            <Text className="text-white font-extrabold text-[10px] uppercase tracking-wider">{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-4 mb-2.5">
        <Text className="text-indigo-400 font-extrabold text-[9px] uppercase tracking-wider">Service Coverage Areas</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row gap-2">
          {LOCATIONS.map((loc) => (
            <View key={loc} className="bg-[#0A0A14] border border-indigo-500/10 px-3.5 py-1.5 rounded-full">
              <Text className="text-indigo-300/80 text-[9px] font-semibold tracking-wide uppercase">{loc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
