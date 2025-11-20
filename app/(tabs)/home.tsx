import { Container } from "@/components/container";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { WeekDay } from "@/lib/types/routine";
import { useRoutine } from "@/lib/api/routine";
import Header from "@/components/header";
import { RoutineCard } from "@/components/routine-card";

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

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  const weekDates = days.map((_, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    return date.getDate();
  });

  return (
    <Container>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header />
        <View className="p-4">
          <View className="p-2 bg-secondary/70 flex w-full flex-row gap-4 shadow-md shadow-border rounded-xl">
            {days.map((day, index) => {
              const isActiveDay = index === activeDayIndex;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveDayIndex(index)}
                  className={`flex-1 py-3 px-1 rounded-xl items-center justify-center shadow-sm ${
                    isActiveDay ? "bg-primary shadow-md" : "bg-background"
                  }`}
                >
                  <View className="items-center gap-1">
                    <Text
                      className={`text-xs font-medium capitalize ${
                        isActiveDay
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isActiveDay
                          ? "text-primary-foreground font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {weekDates[index]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
            Today's Classes
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
              <RoutineCard key={idx} slot={slot} />
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
