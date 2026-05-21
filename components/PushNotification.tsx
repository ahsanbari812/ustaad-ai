import React, { useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { reminderService } from '../services/reminderService';

export default function PushNotification() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [translateY] = useState(new Animated.Value(-100));

  useEffect(() => {
    reminderService.setListener((t, m) => {
      setTitle(t);
      setMessage(m);
      setVisible(true);

      Animated.spring(translateY, {
        toValue: 50,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        closeNotification();
      }, 5000);
    });
  }, []);

  const closeNotification = () => {
    Animated.timing(translateY, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{ 
        transform: [{ translateY }],
        shadowColor: '#064e3b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10
      }}
      className="absolute top-0 left-4 right-4 z-50 bg-[#0A0A0F]/95 border border-emerald-500/30 p-4 rounded-3xl backdrop-blur-md"
    >
      <TouchableOpacity onPress={closeNotification} activeOpacity={0.9}>
        <View className="flex-row items-center">
          <View className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl w-10 h-10 items-center justify-center mr-3 shadow-inner">
            <Text className="text-xl">🛠️</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-0.5">
              <Text className="text-emerald-400 font-extrabold text-[10px] uppercase tracking-[0.2em]">{title}</Text>
              <Text className="text-slate-500 text-[8px]">JUST NOW</Text>
            </View>
            <Text className="text-white font-semibold text-[13px] leading-4" numberOfLines={2}>{message}</Text>
          </View>
        </View>
        <View className="w-10 h-1 bg-emerald-500/20 rounded-full self-center mt-3" />
      </TouchableOpacity>
    </Animated.View>
  );
}
