import type { ComponentProps } from "react";
import type Ionicons from "@expo/vector-icons/Ionicons";

export interface SettingItemProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
  isLast?: boolean;
  isDark?: boolean;
}
