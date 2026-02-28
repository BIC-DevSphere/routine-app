import Ionicons from "@expo/vector-icons/Ionicons";

export interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
  isLast?: boolean;
  isDark?: boolean;
}