import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BookingSimulation } from '../utils/types';

export default function BookingConfirmation({
  booking,
  messageTimestamp,
  onCompleted,
}: {
  booking: BookingSimulation;
  messageTimestamp?: Date | string;
  onCompleted?: (booking: BookingSimulation) => void;
}) {
  const steps = booking.status_logs || ['Initializing...', 'Contacting...', 'Confirmed.'];

  // Check if booking was created recently (within last 15 seconds)
  const isRecent = (() => {
    if (!messageTimestamp) return false;
    const timeMs = typeof messageTimestamp === 'string' ? Date.parse(messageTimestamp) : new Date(messageTimestamp).getTime();
    return (Date.now() - timeMs) < 15000;
  })();

  const [currentStep, setCurrentStep] = useState(isRecent ? 0 : steps.length);
  const hasReportedCompletion = useRef(false);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  useEffect(() => {
    if (!isRecent || !onCompleted || hasReportedCompletion.current || currentStep < steps.length) {
      return;
    }

    hasReportedCompletion.current = true;
    const timer = setTimeout(() => onCompleted(booking), 250);
    return () => clearTimeout(timer);
  }, [booking, currentStep, isRecent, onCompleted, steps.length]);

  return (
    <View className="bg-[#0A0A14] border border-indigo-500/20 rounded-2xl p-4 mt-2 shadow-sm">
      {/* Header with Pulsing Status */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center mb-1">
            <View className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5 shadow shadow-indigo-400 animate-pulse" />
            <Text className="text-indigo-400/80 font-extrabold text-[9px] uppercase tracking-wider">
              System Dispatch Log
            </Text>
          </View>
          <Text className="text-white font-black text-lg tracking-tight">Booking Secured</Text>
          <Text className="text-slate-500 text-[9px] font-mono mt-0.5" numberOfLines={1}>ID: {booking.id}</Text>
        </View>
        <View className="bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          <Text className="text-indigo-300 font-extrabold text-[9px]">ETA: {booking.eta}</Text>
        </View>
      </View>

      {/* Animated Timeline */}
      <View className="bg-[#040408] rounded-xl p-3 mb-4 border border-indigo-950/40">
        {steps.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <View key={idx} className={`flex-row items-center mb-1.5 ${idx > currentStep ? 'opacity-25' : 'opacity-100'}`}>
              <View className={`w-3.5 h-3.5 rounded-full items-center justify-center mr-2 ${isComplete ? 'bg-indigo-600' : isActive ? 'bg-indigo-400/40 border border-indigo-400' : 'bg-slate-800'}`}>
                {isComplete ? (
                  <Text className="text-[7px] text-white font-bold">✓</Text>
                ) : isActive ? (
                  <ActivityIndicator size="small" color="#818cf8" style={{ transform: [{ scale: 0.35 }] }} />
                ) : null}
              </View>
              <Text className={`text-[11px] ${isActive ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                {step}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Provider & OTP Row */}
      <View className="flex-row gap-2.5">
        <View className="flex-1 bg-[#080812] rounded-xl p-3 border border-indigo-500/10">
          <Text className="text-slate-500 text-[8px] font-bold uppercase tracking-wider mb-0.5">Assigned Partner</Text>
          <Text className="text-white font-extrabold text-sm" numberOfLines={1}>{booking.provider.name}</Text>
          <Text className="text-indigo-400/80 text-[9px] mt-0.5">★ {booking.provider.rating} Rating</Text>
        </View>

        <View className="w-[84px] bg-amber-500/5 rounded-xl p-3 border border-amber-500/20 items-center justify-center">
          <Text className="text-amber-500/70 text-[8px] font-bold uppercase tracking-wider mb-0.5">Job OTP</Text>
          <Text className="text-amber-400 font-mono text-lg font-bold tracking-widest">{booking.otp}</Text>
        </View>
      </View>

      <View className="mt-4 pt-3.5 border-t border-slate-800/50 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <Text className="text-slate-500 text-[8px] font-bold uppercase tracking-wider mb-0.5">Scheduled Execution</Text>
          <Text className="text-slate-300 text-xs font-semibold" numberOfLines={1}>{booking.scheduled_time}</Text>
        </View>
        <TouchableOpacity
          className="bg-indigo-600 px-3.5 py-1.5 rounded-lg active:bg-indigo-500"
          activeOpacity={0.7}
        >
          <Text className="text-white font-black text-[9px] uppercase tracking-wider">Track Live</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
