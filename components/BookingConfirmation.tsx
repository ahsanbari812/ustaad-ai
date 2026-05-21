import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BookingSimulation } from '../utils/types';

export default function BookingConfirmation({ booking }: { booking: BookingSimulation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = booking.status_logs || ['Initializing...', 'Contacting...', 'Confirmed.'];

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  return (
    <View className="bg-[#0A0A1F] border border-emerald-500/40 rounded-3xl p-5 mt-2 shadow-2xl shadow-emerald-900/20">
      {/* Header with Pulsing Status */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <View className="flex-row items-center mb-1">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
              Live Operations Trace
            </Text>
          </View>
          <Text className="text-white font-extrabold text-2xl tracking-tight">Booking Secured</Text>
          <Text className="text-slate-500 text-[10px] font-mono mt-1">ID: {booking.id}</Text>
        </View>
        <View className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          <Text className="text-emerald-400 font-bold text-[10px]">ETA: {booking.eta}</Text>
        </View>
      </View>

      {/* Animated Timeline */}
      <View className="bg-[#111122] rounded-2xl p-4 mb-5 border border-slate-800">
        {steps.map((step, idx) => (
          <View key={idx} className={`flex-row items-center mb-2 ${idx > currentStep ? 'opacity-20' : 'opacity-100'}`}>
            <View className={`w-4 h-4 rounded-full items-center justify-center mr-3 ${idx < currentStep ? 'bg-emerald-500' : idx === currentStep ? 'bg-emerald-400' : 'bg-slate-700'}`}>
              {idx < currentStep ? (
                <Text className="text-[8px] text-white">✓</Text>
              ) : idx === currentStep ? (
                <ActivityIndicator size="small" color="#fff" style={{ transform: [{ scale: 0.4 }] }} />
              ) : null}
            </View>
            <Text className={`text-xs ${idx === currentStep ? 'text-white font-bold' : 'text-slate-400'}`}>
              {step}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Provider & OTP Row */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-[#161633] rounded-2xl p-4 border border-blue-500/20">
          <Text className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mb-1">Assigned Ustaad</Text>
          <Text className="text-white font-bold text-base" numberOfLines={1}>{booking.provider.name}</Text>
          <Text className="text-blue-400 text-[10px] mt-1">★ {booking.provider.rating} Rating</Text>
        </View>
        
        <View className="w-[100px] bg-amber-500/10 rounded-2xl p-4 border border-amber-500/30 items-center justify-center">
          <Text className="text-amber-500/70 text-[9px] uppercase font-bold tracking-widest mb-1">Job OTP</Text>
          <Text className="text-amber-400 font-mono text-xl font-bold tracking-tighter">{booking.otp}</Text>
        </View>
      </View>

      <View className="mt-4 pt-4 border-t border-slate-800/50 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Scheduled Time</Text>
          <Text className="text-slate-300 text-xs font-semibold">{booking.scheduled_time}</Text>
        </View>
        <View className="bg-blue-600 px-4 py-2 rounded-xl">
          <Text className="text-white font-bold text-[10px] uppercase">Track Live</Text>
        </View>
      </View>
    </View>
  );
}

