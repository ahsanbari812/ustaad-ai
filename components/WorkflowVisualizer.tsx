import React from 'react';
import { View, Text, ScrollView } from 'react-native';
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
      
      <View className="bg-[#0A0A0F] border border-[#164e63] rounded-xl p-3 shadow-lg">
        <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator={true}>
          {logs.map((log, index) => {
            const isLast = index === logs.length - 1;
            
            return (
              <View key={index} className="flex-row">
                {/* Timeline graphic */}
                <View className="items-center mr-2.5 mt-1">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#082f49] border border-cyan-500 items-center justify-center">
                    <View className="w-1 h-1 rounded-full bg-cyan-300" />
                  </View>
                  {!isLast && <View className="w-[1px] h-[34px] bg-[#164e63] my-0.5" />}
                </View>

                {/* Log Details */}
                <View className="flex-1 pb-3">
                  <View className="flex-row justify-between items-center mb-0.5">
                    <Text className="text-cyan-50 font-bold text-[10px] tracking-wider uppercase">{log.agent}</Text>
                    <Text className="text-cyan-600 text-[9px]">{log.duration_ms}ms</Text>
                  </View>
                  
                  <Text className="text-cyan-400 text-[9px] mb-0.5 font-bold uppercase tracking-wider">{log.action}</Text>
                  <Text className="text-cyan-200 text-[10px] leading-3.5">{log.output}</Text>
                  
                  {log.confidence && (
                    <View className="mt-1.5 flex-row items-center">
                      <Text className="text-cyan-700 text-[8px] mr-1.5 uppercase tracking-wider">Conf</Text>
                      <View className="flex-1 h-1 bg-[#164e63] rounded-full mr-1.5">
                        <View 
                          className="h-full bg-cyan-400 rounded-full" 
                          style={{ width: `${log.confidence}%` }} 
                        />
                      </View>
                      <Text className="text-cyan-400 font-bold text-[8px]">{log.confidence}%</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
