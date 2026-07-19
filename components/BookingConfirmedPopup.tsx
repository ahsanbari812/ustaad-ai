import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BookingConfirmedPopupProps {
  otp?: string;
  onDismiss: () => void;
}

export default function BookingConfirmedPopup({ otp, onDismiss }: BookingConfirmedPopupProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;
  const closingRef = useRef(false);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -16,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(onDismiss);
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 16,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(close, 4200);
    return () => clearTimeout(timer);
  }, [close, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 58,
        left: 0,
        right: 0,
        zIndex: 60,
        alignItems: 'center',
        opacity,
        transform: [{ translateY }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={close}
        className="w-[230px] bg-[#07130f]/95 border border-emerald-400/30 rounded-2xl px-4 py-3 shadow-lg shadow-emerald-950/40"
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-400/30 items-center justify-center mr-3">
            <Text className="text-emerald-300 text-[10px] font-black uppercase">OK</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-black" numberOfLines={1}>
              Booking confirmed
            </Text>
            <Text className="text-amber-300 text-xs font-bold mt-0.5" numberOfLines={1}>
              Job OTP: {otp || '----'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
