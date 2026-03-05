import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "@/lib/use-color-scheme";
import type { SettingItemProps } from "@/lib/types/setting";

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
}: SettingItemProps) {
  const { isDarkColorScheme } = useColorScheme();
  const effectiveDark = isDark ?? isDarkColorScheme;

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        className={`flex-row items-center px-5 py-4 gap-4 ${
          onPress ? "active:bg-accent/50" : ""
        }`}
      >
        <View
          className={`w-9 h-9 rounded-full items-center justify-center ${
            isDestructive
              ? "bg-destructive/15"
              : effectiveDark
                ? "bg-primary/20"
                : "bg-primary/10"
          }`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              isDestructive ? "#ef4444" : effectiveDark ? "#60a5fa" : "#2563eb"
            }
          />
        </View>
        <View className="flex-1">
          <Text
            className={`text-base font-semibold ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            {label}
          </Text>
        </View>
        {value && (
          <Text className="text-muted-foreground text-sm mr-3 font-medium">
            {value}
          </Text>
        )}
        {rightElement}
        {showChevron && !rightElement && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={effectiveDark ? "#9ca3af" : "#6b7280"}
          />
        )}
      </TouchableOpacity>
      {!isLast && <View className="mx-5 h-[0.5px] bg-border" />}
    </View>
  );
}
