import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { authClient } from "@/lib/auth-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";

export function LogoutButton() {
  const logout = () => authClient.signOut();
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  return (
    <TouchableOpacity
      onPress={logout}
      activeOpacity={0.85}
      style={[styles.card, neo.destructiveRaised]}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        </View>
        <View style={styles.textWrap}>
          <Text className="text-base font-bold text-destructive">Logout</Text>
          <Text className="text-sm text-muted-foreground">
            Sign out of your account
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    padding: 12,
    borderRadius: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(220,38,38,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});
