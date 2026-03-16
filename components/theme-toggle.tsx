import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";

export function ThemeToggle() {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const neo = getNeoStyles(isDark);
  const colors = isDark ? NEO_COLORS.dark : NEO_COLORS.light;

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      activeOpacity={0.85}
      style={[styles.card, neo.raised, { backgroundColor: colors.bg }]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: isDark ? "rgba(251,191,36,0.15)" : "rgba(245,158,11,0.12)" },
          ]}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={20}
            color={isDark ? "#fbbf24" : "#f59e0b"}
          />
        </View>
        <View style={styles.textWrap}>
          <Text className="text-base font-bold text-foreground">Theme</Text>
          <Text className="text-sm text-muted-foreground">
            {isDark ? "Dark mode" : "Light mode"}
          </Text>
        </View>
        {/* Toggle pill */}
        <View
          style={[
            styles.pill,
            neo.inset,
            { backgroundColor: isDark ? colors.primaryColor : colors.shadowDark },
          ]}
        >
          <View
            style={[
              styles.thumb,
              { transform: [{ translateX: isDark ? 20 : 0 }] },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    padding: 16,
    borderRadius: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  pill: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
});