import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { View, Text } from 'react-native'

const NextClassHeader = () => {
  return (
    <View className="
      mx-4 mt-4 rounded-2xl
      gap-2
      p-4
      bg-background
      shadow-lg shadow-black/30
      dark:shadow-black/40
      border border-border/40 dark:border-border
    ">
      
      {/* Top Label */}
      <Text className="text-muted-foreground text-sm">
        Next Class In
      </Text>

      {/* Time + Icon */}
      <View className="flex-row justify-between items-center border-b pb-2 border-border/50">
        <Text className="text-3xl font-medium text-foreground">
          2h 15m
        </Text>
        
        <View className="
          p-2 rounded-xl 
          bg-primary/10 
          dark::border border-primary/30 
          items-center justify-center
        ">
          <Ionicons name="time-outline" size={20} style={{ color: '#4F46E5' }} />
        </View>
      </View>

      {/* Class Name */}
      <Text className="text-sm text-foreground font-medium">
        Concepts and Technologies of AI
      </Text>

    </View>
  )
}

export default NextClassHeader
