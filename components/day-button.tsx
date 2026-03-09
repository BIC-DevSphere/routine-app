import { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SPRINGS, useScalePress } from "@/lib/animations";
import type { getNeoStyles } from "@/lib/neo-styles";

interface DayButtonProps {
  day: string;
  date: number;
  isActive: boolean;
  isDark: boolean;
  neo: ReturnType<typeof getNeoStyles>;
  onPress: () => void;
}

export function DayButton({ day, date, isActive, isDark, neo, onPress }: DayButtonProps) {
  const { style: pressStyle, onPressIn, onPressOut } = useScalePress(0.86);
  const scale = useSharedValue(isActive ? 1 : 0.93);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.93, SPRINGS.bouncy);
  }, [isActive]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    flex: 1,
  }));

  const inactiveLabelColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const inactiveDateColor  = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";

  return (
    <Animated.View style={[scaleStyle, pressStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[styles.btn, isActive && [neo.primaryRaised, styles.activeBtn]]}
      >
        <Text
          style={[
            styles.label,
            {
              color: isActive ? "#FFFFFF" : inactiveLabelColor,
              fontWeight: isActive ? "700" : "500",
              fontSize: isActive ? 11 : 10,
            },
          ]}
        >
          {day}
        </Text>
        <Text
          style={[
            styles.date,
            {
              color: isActive ? "#FFFFFF" : inactiveDateColor,
              fontWeight: isActive ? "700" : "400",
              fontSize: isActive ? 16 : 13,
            },
          ]}
        >
          {date}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  activeBtn: {
    borderRadius: 12,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    lineHeight: 20,
  },
});
