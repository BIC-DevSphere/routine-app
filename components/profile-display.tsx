import Animated from "react-native-reanimated";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProfileDisplayProps } from "@/lib/types/profile";
import { useProfile } from "@/lib/api/profile";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useMountFade, useScalePress } from "@/lib/animations";

export function ProfileDisplay({ onEditPress }: ProfileDisplayProps) {
  const { data: profile } = useProfile();
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const mountAnim = useMountFade(0, 16);
  const { style: pressStyle, onPressIn, onPressOut } = useScalePress(0.97);

  if (!profile) {
    return null;
  }

  return (
    <Animated.View style={[mountAnim, pressStyle]}>
      <TouchableOpacity
        onPress={onEditPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[styles.card, neo.raised, { backgroundColor: colors.bg }]}
      >
      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {profile.name?.[0]?.toUpperCase() || "U"}
          </Text>
        </View>
        <View style={styles.info}>
          <Text className="text-base font-bold text-foreground">
            {profile.name}
          </Text>
          <Text className="text-sm text-muted-foreground">{profile.email}</Text>
        </View>
        <View style={styles.editBtn}>
          <Ionicons name="pencil" size={16} color={colors.primaryColor} />
        </View>
      </View>
      </TouchableOpacity>
    </Animated.View>
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
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "hsla(342, 93%, 61%, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "hsl(342, 93%, 61%)",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "hsla(342, 93%, 61%, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
