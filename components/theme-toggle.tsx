import { TouchableOpacity, Text, View } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";

export function ThemeToggle() {
  const { toggleColorScheme, colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground mb-1">
            Theme
          </Text>
          <Text className="text-base text-muted-foreground">
            {isDark ? "Dark mode" : "Light mode"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={24}
            color={isDark ? "#fbbf24" : "#f59e0b"}
          />
          <View
            className={`ml-3 w-12 h-6 rounded-full p-1 ${
              isDark ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <View
              className={`w-4 h-4 rounded-full bg-white ${
                isDark ? "ml-6" : "ml-0"
              }`}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}