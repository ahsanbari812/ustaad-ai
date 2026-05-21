import React from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { AgentLog } from '../utils/types';

interface Props {
  logs: AgentLog[];
}

export default function WorkflowVisualizer({ logs }: Props) {
  if (!logs || logs.length === 0) return null;

  return (
    <View className="px-4 py-2 my-2">
      <Text className="text-cyan-400/60 font-bold text-[10px] uppercase mb-2 tracking-[0.2em]">
        Agent Pipeline Execution Status
      </Text>
      
      <View className="bg-[#0A0A0F] border border-[#164e63] rounded-xl p-3 shadow-lg shadow-[#164e63]">
        {logs.map((log, index) => {
          const isLast = index === logs.length - 1;
          
          return (
            <View key={index} className="flex-row">
              {/* Timeline graphic */}
              <View className="items-center mr-3 mt-1">
                <View className="w-3 h-3 rounded-full bg-[#082f49] border border-cyan-500 items-center justify-center shadow shadow-[#0891b2]">
                  <View className="w-1 h-1 rounded-full bg-cyan-300" />
                </View>
                {!isLast && <View className="w-[1px] h-full bg-[#164e63] my-1" />}
              </View>

              {/* Log Details */}
              <View className="flex-1 pb-4">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-cyan-50 font-bold text-xs tracking-wider uppercase">{log.agent}</Text>
                  <Text className="text-cyan-600 text-[10px]">{log.duration_ms}ms</Text>
                </View>
                
                <Text className="text-cyan-400 text-[10px] mb-1 font-bold uppercase tracking-widest">{log.action}</Text>
                <Text className="text-cyan-200 text-[11px] leading-4">{log.output}</Text>
                
                {log.confidence && (
                  <View className="mt-2 flex-row items-center">
                    <Text className="text-cyan-700 text-[9px] mr-2 uppercase tracking-widest">Confidence</Text>
                    <View className="flex-1 h-1 bg-[#164e63] rounded-full mr-2">
                      <View 
                        className="h-full bg-cyan-400 rounded-full shadow shadow-[#0891b2]" 
                        style={{ width: `${log.confidence}%` }} 
                      />
                    </View>
                    <Text className="text-cyan-400 font-bold text-[9px]">{log.confidence}%</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
