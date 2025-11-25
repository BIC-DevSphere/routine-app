import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Slot } from "@/lib/types/routine";
import { formatTime } from "@/lib/utils/dateTime";

interface RoutineCardProps {
  slot: Slot;
}

export function RoutineCard({ slot }: RoutineCardProps) {
  return (
    <View className="p-4 bg-background rounded-xl border border-secondary shadow-md shadow-border gap-2">
      <View className="row-center-gap">
        <Text className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md text-sm">
          {slot.moduleCode}
        </Text>
        <Text className="text-sm text-muted-foreground font-medium">
          {slot.classType}
        </Text>
      </View>
      <Text className="text-lg font-semibold text-foreground">
        {slot.moduleName}
      </Text>
      <View className="row-center-gap">
        <Ionicons name="time-outline" size={16} style={{color: '#888'}} />
        <Text className="text-sm text-muted-foreground">
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </Text>
      </View>
      {slot.room && (
        <View className="row-center-gap">
          <Ionicons name="location-outline" size={16} style={{color: '#888'}} />
          <Text className="text-sm text-muted-foreground">
            {slot.room}
          </Text>
        </View>
      )}
      {slot.teacher && (
        <View className="flex-row items-center justify-between">
          <View className="row-center-gap">
            <Ionicons name="person-outline" size={16} style={{color: '#888'}} />
            <Text className="text-sm text-muted-foreground">
              {slot.teacher.name}
            </Text>
          </View>
          {slot.joinedGroups && slot.joinedGroups.length > 0 && (
            <Text className="ml-3 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-lg text-xs">
              {slot.joinedGroups.join(" + ")}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
