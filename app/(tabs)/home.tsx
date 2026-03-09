import { Container } from "@/components/container";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { WeekDay } from "@/lib/types/routine";
import { useRoutine } from "@/lib/api/routine";
import Header from "@/components/header";
import { RoutineCard } from "@/components/routine-card";
import { DayButton } from "@/components/day-button";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { SPRINGS, useFocusFade } from "@/lib/animations";

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
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const { data: routineData, isLoading, error, refetch } = useRoutine();

  const pickerAnim = useFocusFade(60, 16);
  const contentOp  = useSharedValue(0);
  const contentTx  = useSharedValue(30);
  const prevDayRef = useRef(activeDayIndex);

  const contentAnim = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateX: contentTx.value }],
  }));

  useEffect(() => {
    if (routineData?.week) {
      setTodayRoutine(routineData.week[activeDayIndex]);
    }
  }, [routineData]);

  useEffect(() => {
    const direction = activeDayIndex > prevDayRef.current ? 1 : -1;
    prevDayRef.current = activeDayIndex;

    if (routineData?.week) {
      setTodayRoutine(routineData.week[activeDayIndex]);
    }

    contentTx.value = direction * 40;
    contentOp.value = 0;
    contentTx.value = withSpring(0, SPRINGS.gentle);
    contentOp.value = withTiming(1, { duration: 340, easing: Easing.out(Easing.cubic) });
  }, [activeDayIndex]);

  useEffect(() => {
    contentTx.value = 0;
    contentOp.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.ease) });
  }, []);

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
        <View style={styles.page}>
          <Header />

          <Animated.View style={[styles.dayPicker, neo.inset, pickerAnim]}>
            {days.map((day, index) => (
              <DayButton
                key={index}
                day={day}
                date={weekDates[index]}
                isActive={index === activeDayIndex}
                onPress={() => setActiveDayIndex(index)}
                isDark={isDarkColorScheme}
                neo={neo}
              />
            ))}
          </Animated.View>

          <Animated.View style={[styles.routineContent, contentAnim]}>
            {isLoading && (
              <View className="flex-1 justify-center items-center py-20">
                <ActivityIndicator size="large" className="text-primary" />
                <Text className="text-muted-foreground mt-4">
                  Loading your routine...
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text className="text-destructive font-semibold mb-1">
                  Error loading routine
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {error.message}
                </Text>
              </View>
            )}

            {!isLoading &&
              (routineData &&
              routineData.week.every((day: WeekDay) => day.slots.length === 0) ? (
                <View className="px-4 py-20">
                  <Text className="text-center text-muted-foreground text-lg">
                    No classes scheduled this week
                  </Text>
                </View>
              ) : todayRoutine?.slots.length ? (
                <View style={styles.cardsList}>
                  {todayRoutine.slots.map((slot, idx) => (
                    <RoutineCard key={idx} slot={slot} index={idx} />
                  ))}
                </View>
              ) : routineData ? (
                <View className="px-4 py-20">
                  <Text className="text-center text-muted-foreground text-lg">
                    No classes scheduled for this day
                  </Text>
                </View>
              ) : null)}
          </Animated.View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    gap: 16,
  },
  dayPicker: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 6,
    gap: 4,
  },
  dayBtn: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  activeDayBtn: {
    borderRadius: 12,
  },
  dayLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateLabel: {
    lineHeight: 20,
  },
  routineContent: {
    gap: 12,
  },
  cardsList: {
    gap: 12,
  },
  errorBox: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "rgba(219,22,40,0.08)",
    borderWidth: 1,
    borderColor: "rgba(219,22,40,0.25)",
  },
});
