import { RoutineCard } from "@/components/routine-card";
import { Text, View } from "react-native";
import type { RoutineContentProps } from "@/lib/types/routine";

export function RoutineContent({
  isLoading,
  routineData,
  todayRoutine,
}: RoutineContentProps) {
  if (isLoading || !routineData) return null;

  const isWeekEmpty = routineData.week.every((day) => day.slots.length === 0);

  if (isWeekEmpty) {
    return (
      <View className="px-4 py-20">
        <Text className="text-center text-muted-foreground text-lg">
          No classes scheduled this week
        </Text>
      </View>
    );
  }

  if (!todayRoutine?.slots.length) {
    return (
      <View className="px-4 py-20">
        <Text className="text-center text-muted-foreground text-lg">
          No classes scheduled for this day
        </Text>
      </View>
    );
  }

  return (
    <>
      {todayRoutine.slots.map((slot) => (
        <RoutineCard
          key={`${slot.moduleCode}-${slot.startTime}-${slot.classType}`}
          slot={slot}
        />
      ))}
    </>
  );
}