import Animated from "react-native-reanimated";
import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { getFullDayDate } from "@/lib/utils/dateTime";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useFocusFade } from "@/lib/animations";

export default function Header() {
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const [formattedDate, setFormattedDate] = useState(getFullDayDate());

  const headingAnim = useFocusFade(0,   -14);
  const statsAnim   = useFocusFade(120, 20);

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(getFullDayDate());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={headingAnim}>
        <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
          {formattedDate}
        </Text>
        <Text className="text-foreground font-bold" style={styles.title}>
          Today's Schedule
        </Text>
      </Animated.View>

      <Animated.View style={[styles.statsRow, statsAnim]}>
        <View
          style={[
            styles.statCard,
            neo.raised,
            { backgroundColor: colors.bg },
          ]}
        >
          <Text className="text-primary font-bold" style={styles.statNumber}>
            2
          </Text>
          <Text className="text-muted-foreground text-sm">Classes Today</Text>
        </View>
        <View
          style={[
            styles.statCard,
            neo.raised,
            { backgroundColor: colors.bg },
          ]}
        >
          <Text className="text-primary font-bold" style={styles.statNumber}>
            5H 30M
          </Text>
          <Text className="text-muted-foreground text-sm">Total Time</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    lineHeight: 28,
  },
});
