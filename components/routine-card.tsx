import Animated from "react-native-reanimated";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Slot } from "@/lib/types/routine";
import { formatTime } from "@/lib/utils/dateTime";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useMountFade, useScalePress, usePulseScale } from "@/lib/animations";

interface RoutineCardProps {
  slot: Slot;
  index?: number;
}

export function RoutineCard({ slot, index = 0 }: RoutineCardProps) {
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;
  const mutedIcon = isDarkColorScheme ? "#9ca3af" : "#6b7280";


  const mountAnim  = useMountFade(index * 70, 22);
  const { style: pressStyle, onPressIn, onPressOut } = useScalePress(0.97);
  const liveDotAnim = usePulseScale(0.7, 1.35, 600);

  // Check if class is happening now
  const now = new Date();
  const [startH, startM] = slot.startTime.split(":").map(Number);
  const [endH, endM] = slot.endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isHappeningNow =
    currentMinutes >= startMinutes && currentMinutes < endMinutes;

  return (
    <Animated.View style={[mountAnim, pressStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[styles.card, neo.raised, { backgroundColor: colors.bg }]}
        >
          <View className="flex-row items-center justify-between">
            <View className="row-center-gap">
              <Text
                style={styles.moduleBadge}
                className="text-primary font-bold text-xs"
              >
                {slot.moduleCode}
              </Text>
              <Text className="text-xs text-muted-foreground font-medium">
                {slot.classType}
              </Text>
            </View>
            {isHappeningNow && (
              <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, liveDotAnim]} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            )}
          </View>

          <Text className="text-base font-bold text-foreground mt-2">
            {slot.moduleName}
          </Text>

          <View
            style={[
              styles.divider,
              { backgroundColor: isDarkColorScheme ? colors.shadowLight : colors.shadowDark },
            ]}
          />

          <View className="gap-2">
            <View className="row-center-gap">
              <Ionicons name="time-outline" size={14} color={mutedIcon} />
              <Text className="text-sm text-muted-foreground">
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </Text>
            </View>
            {slot.room && (
              <View className="row-center-gap">
                <Ionicons name="location-outline" size={14} color={mutedIcon} />
                <Text className="text-sm text-muted-foreground">{slot.room}</Text>
              </View>
            )}
            {slot.teacher && (
              <View className="flex-row items-center justify-between">
                <View className="row-center-gap">
                  <Ionicons name="person-outline" size={14} color={mutedIcon} />
                  <Text className="text-sm text-muted-foreground">
                    {slot.teacher.name}
                  </Text>
                </View>
                {slot.joinedGroups && slot.joinedGroups.length > 0 && (
                  <View style={styles.groupBadge}>
                    <Text style={styles.groupBadgeText}>
                      {slot.joinedGroups.join(" + ")}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  moduleBadge: {
    backgroundColor: "rgba(219,22,40,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  liveText: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    opacity: 0.4,
    marginVertical: 4,
  },
  groupBadge: {
    backgroundColor: "rgba(219,22,40,0.10)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  groupBadgeText: {
    color: "#DB1628",
    fontSize: 11,
    fontWeight: "600",
  },
});
