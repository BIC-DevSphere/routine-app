import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
  isLast?: boolean;
  isDark: boolean;
  iconAccent: string;
  iconMuted: string;
  dividerColor: string;
}

export function SettingItem({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  isDestructive = false,
  rightElement,
  isLast = false,
  isDark,
  iconAccent,
  iconMuted,
  dividerColor,
}: SettingItemProps) {
  const iconBg = isDestructive
    ? "rgba(220,38,38,0.12)"
    : isDark
    ? "rgba(232,32,58,0.15)"
    : "rgba(219,22,40,0.09)";

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
        style={styles.row}
      >
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Ionicons
            name={icon}
            size={18}
            color={isDestructive ? "#ef4444" : iconAccent}
          />
        </View>
        <View style={styles.content}>
          <Text
            className={`text-base font-semibold ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            {label}
          </Text>
        </View>
        {value && (
          <Text className="text-muted-foreground text-sm font-medium">{value}</Text>
        )}
        {rightElement}
        {showChevron && !rightElement && (
          <Ionicons name="chevron-forward" size={18} color={iconMuted} />
        )}
      </TouchableOpacity>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.25,
  },
});
