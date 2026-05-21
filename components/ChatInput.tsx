// Chat Input Component - Message input with send button
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

  return (
    <View className="flex-row items-end px-3 py-2 bg-[#0C0C18] border-t border-gray-800">
      {/* Text Input */}
      <View className="flex-1 bg-[#1E1E2E] rounded-2xl px-4 py-2 mr-2 min-h-[44px] max-h-[120px] justify-center border border-gray-700/30">
        <TextInput
          className="text-white text-[15px] leading-5"
          placeholder="Type your service request..."
          placeholderTextColor="#6B7280"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
          editable={!isLoading}
          onKeyPress={(e) => {
            // Send on Enter (if not mobile or if web environment)
            // But allow Shift+Enter for new lines
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

      {/* Send Button */}
      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim() || isLoading}
        className={`w-11 h-11 rounded-full items-center justify-center ${
          text.trim() && !isLoading
            ? 'bg-emerald-600'
            : 'bg-gray-700'
        }`}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white text-lg">➤</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
