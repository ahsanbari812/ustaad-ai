import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

const SUGGESTIONS = [
  { icon: '⚡', text: 'Kal DHA mein electrician chahiye' },
  { icon: '❄️', text: 'AC technician urgently Johar' },
  { icon: '🔧', text: 'Need plumber tomorrow in Gulshan' },
  { icon: '🪚', text: 'Carpenter chahiye furniture fix karna hai' },
];

export default function QuickActionChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <View className="mb-2">
      <Text className="text-slate-500 text-xs px-4 mb-2">Try asking for:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {SUGGESTIONS.map((s, idx) => (
          <TouchableOpacity 
            key={idx}
            className="bg-[#0A0A0F] border border-cyan-900/40 px-3.5 py-2 rounded-full flex-row items-center shadow shadow-cyan-900/10 active:bg-cyan-950/20"
            onPress={() => onSelect(s.text)}
            activeOpacity={0.7}
          >
            <Text className="text-xs mr-1.5">{s.icon}</Text>
            <Text className="text-cyan-300 font-semibold text-xs">{s.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
