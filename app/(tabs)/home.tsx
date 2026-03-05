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
import { useState, useMemo } from "react";
import { useRoutine } from "@/lib/api/routine";
import Header from "@/components/header";
import { DAYS, getTodayIndex, getWeekDates } from "@/lib/utils/routine";
import { RoutineContent } from "@/components/routine-content";

export default function Home() {
  const { isPending } = authClient.useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(getTodayIndex);

  const { data: routineData, isLoading, error, refetch } = useRoutine();

  const todayString = new Date().toDateString();
  const weekDates = useMemo(() => getWeekDates(), [todayString]);
  const todayRoutine = routineData?.week[activeDayIndex];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isPending) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-muted-foreground mt-4">Loading session...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-4">
          <Header />

          <View className="p-2 bg-secondary/50 flex w-full flex-row gap-4 border border-border rounded-xl">
            {DAYS.map((day, index) => {
              const isActiveDay = index === activeDayIndex;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveDayIndex(index)}
                  className={`flex-1 py-3 px-1 rounded-xl items-center justify-center ${
                    isActiveDay ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <View className="items-center gap-1">
                    <Text
                      className={`font-medium capitalize ${
                        isActiveDay
                          ? "text-primary-foreground text-sm"
                          : "text-foreground/50 text-xs"
                      }`}
                    >
                      {day}
                    </Text>
                    <Text
                      className={` ${
                        isActiveDay
                          ? "text-primary-foreground font-semibold text-lg"
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

          {isLoading && (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" className="text-primary" />
              <Text className="text-muted-foreground mt-4">
                Loading your routine...
              </Text>
            </View>
          )}

          {error && (
            <View className="bg-destructive/10 rounded-lg p-4 border border-destructive">
              <Text className="text-destructive font-semibold mb-1">
                Error loading routine
              </Text>
              <Text className="text-destructive-foreground">
                {error.message}
              </Text>
            </View>
          )}
          <RoutineContent
            isLoading={isLoading}
            routineData={routineData}
            todayRoutine={todayRoutine}
          />
        </View>
      </ScrollView>
    </Container>
  );
}
