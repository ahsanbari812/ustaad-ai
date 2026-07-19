import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setText('');
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <View className="flex-row items-end px-4 py-3.5 bg-[#03030A] border-t border-indigo-950/40">
      {/* Text Input Container */}
      <View className="flex-1 bg-[#0A0A14] rounded-2xl px-4 py-2 mr-2.5 min-h-[46px] max-h-[120px] justify-center border border-indigo-500/10 shadow-sm">
        <TextInput
          className="text-white text-[15px] leading-5 font-medium"
          placeholder="Ask for an electrician, plumber, tutor..."
          placeholderTextColor="#4b5563"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
          editable={!isLoading}
          style={{ paddingVertical: Platform.OS === 'ios' ? 4 : 0 }}
          onKeyPress={(e) => {
            const nativeEvent = e.nativeEvent as any;
            if (Platform.OS === 'web' && nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
              handleSend();
            }
          }}
          onSubmitEditing={() => {
            if (Platform.OS !== 'web') {
              handleSend();
            }
          }}
          blurOnSubmit={Platform.OS !== 'web'}
        />
      </View>

      {/* Modern Circular Send Button */}
      <TouchableOpacity
        onPress={handleSend}
        disabled={!hasText || isLoading}
        className={`w-11 h-11 rounded-full items-center justify-center shadow-lg ${
          hasText && !isLoading
            ? 'bg-indigo-600 shadow-indigo-500/20 border border-indigo-400/40 active:bg-indigo-500'
            : 'bg-indigo-950/20 border border-indigo-950/60 opacity-40'
        }`}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className={`text-sm ${hasText ? 'text-white font-black' : 'text-indigo-700'}`}>➤</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
