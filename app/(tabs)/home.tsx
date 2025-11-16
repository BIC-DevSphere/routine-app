import { Container } from "@/components/container";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { WeekDay } from "@/lib/types/routine";
import { useRoutine } from "@/lib/api/routine";
import { Picker } from "@react-native-picker/picker";

export default function Home() {
  const { isRefetching, isPending } = authClient.useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 6 ? 0 : today > 5 ? 0 : today;
  });
  const [todayRoutine, setTodayRoutine] = useState<WeekDay | undefined>(
    undefined
  );

  const { data: routineData, isLoading, error, refetch } = useRoutine();

  useEffect(() => {
    if (routineData?.week) {
      const routineForToday = routineData.week[activeDayIndex];
      setTodayRoutine(routineForToday);
    }
  }, [activeDayIndex, routineData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isRefetching || isPending) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-muted-foreground mt-4">Loading session...</Text>
        </View>
      </Container>
    );
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  function formatTime(time: string) {
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  }

  return (
    <Container>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
          <View className="gap-4">
            <Text className="text-2xl text-foreground">Hello 🙋</Text>
            <Text className="text-2xl text-foreground">Good Day</Text>
          </View>
          <View className="w-40 border border-gray-300 rounded-lg bg-primary">
            <Picker
              selectedValue={activeDayIndex}
              onValueChange={(itemValue) => setActiveDayIndex(itemValue)}
              style={{ color: "#fff" }}
            >
              {days.map((day, index) => (
                <Picker.Item key={index} label={day} value={index} />
              ))}
            </Picker>
          </View>
        </View>

        {isLoading && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" className="text-primary" />
            <Text className="text-muted-foreground mt-4">
              Loading your routine...
            </Text>
          </View>
        )}

        {error && (
          <View className="px-4">
            <View className="bg-destructive/10 rounded-lg p-4 border border-destructive">
              <Text className="text-destructive font-semibold mb-1">
                Error loading routine
              </Text>
              <Text className="text-destructive-foreground">
                {error.message}
              </Text>
            </View>
          </View>
        )}
        <View className="px-4 pt-6 gap-4">
          <Text className="text-xl font-bold text-foreground">
            Your Schedule
          </Text>
          {routineData &&
          routineData.week.every((day: WeekDay) => day.slots.length === 0) ? (
            <View className="px-4 py-20">
              <Text className="text-center text-muted-foreground text-lg">
                No classes scheduled this week
              </Text>
            </View>
          ) : todayRoutine?.slots.length ? (
            todayRoutine.slots.map((slot, idx) => (
              <View
                key={idx}
                className="p-4 rounded-lg border border-primary/20 bg-primary/5"
              >
                <Text className="text-lg font-semibold text-foreground mb-1">
                  {slot.moduleName} ({slot.moduleCode})
                </Text>
                <Text className="text-base text-muted-foreground">
                  {slot.classType}: {formatTime(slot.startTime)} -{" "}
                  {formatTime(slot.endTime)}
                </Text>
                {slot.room && (
                  <Text className="text-sm text-muted-foreground mt-1">
                    Room: {slot.room}
                  </Text>
                )}
                {slot.teacher && (
                  <Text className="text-sm text-muted-foreground mt-1">
                    Teacher: {slot.teacher.name}
                  </Text>
                )}
                {slot.joinedGroups && slot.joinedGroups.length > 0 && (
                  <Text className="text-sm text-muted-foreground mt-1">
                    Group: {slot.joinedGroups.join(" + ")}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View className="px-4 py-20">
              <Text className="text-center text-muted-foreground text-lg">
                No classes scheduled for this day
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
