import { Container } from "@/components/container";
import Animated from "react-native-reanimated";
import {
  ScrollView,
  Text,
  View,
  Switch,
  Alert,
  StyleSheet,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useProfile } from "@/lib/api/profile";
import { useRouter } from "expo-router";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useFocusFade } from "@/lib/animations";
import { SettingItem } from "@/components/setting-item";

export default function Setting() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: session } = authClient.useSession();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const neo = getNeoStyles(isDark);
  const colors = isDark ? NEO_COLORS.dark : NEO_COLORS.light;

  const displayName = profile?.name || session?.user?.name || "User";
  const displayEmail = profile?.email || session?.user?.email;
  const iconMuted = isDark ? "#A3A3A3" : "#737373";
  const iconAccent = colors.primaryColor;

  const dividerColor = isDark ? colors.shadowLight : colors.shadowDark;

  const titleAnim      = useFocusFade(0,    -12);
  const profileAnim    = useFocusFade(80,    20);
  const appearanceAnim = useFocusFade(160,   20);
  const supportAnim    = useFocusFade(230,   20);
  const accountAnim    = useFocusFade(300,   20);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authClient.signOut();
        },
      },
    ]);
  };

  return (
    <Container>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <Animated.View style={titleAnim}>
          <Text className="text-foreground font-bold" style={styles.pageTitle}>
            Settings
          </Text>
          </Animated.View>

          <Animated.View style={[styles.section, profileAnim]}>
            <Text className="settings-title" style={styles.sectionTitle}>
              Profile
            </Text>
            <View style={[styles.groupCard, neo.raised, { backgroundColor: colors.bg }]}>
              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {displayName[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text className="text-xl font-bold text-foreground">
                    {displayName}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {displayEmail}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: dividerColor, opacity: 0.2 }]} />

              <View style={styles.infoRows}>
                <View style={styles.infoRow}>
                  <Text className="text-muted-foreground font-semibold">Student ID</Text>
                  <Text className="text-foreground font-bold">2023CS001</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: dividerColor, opacity: 0.2 }]} />
                <View style={styles.infoRow}>
                  <Text className="text-muted-foreground font-semibold">Group</Text>
                  <Text className="text-foreground font-bold">L5CG1</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.section, appearanceAnim]}>
            <Text className="settings-title" style={styles.sectionTitle}>
              Appearance
            </Text>
            <View style={[styles.groupCard, neo.raised, { backgroundColor: colors.bg }]}>
              <SettingItem
                icon="moon"
                label="Dark Mode"
                showChevron={false}
                isLast
                isDark={isDark}
                iconAccent={iconAccent}
                iconMuted={iconMuted}
                dividerColor={dividerColor}
                rightElement={
                  <Switch
                    value={isDark}
                    onValueChange={toggleColorScheme}
                    trackColor={{
                      false: isDark ? "#404040" : "#D4D4D4",
                      true: colors.primaryColor,
                    }}
                    thumbColor="#ffffff"
                    ios_backgroundColor={isDark ? "#404040" : "#D4D4D4"}
                  />
                }
              />
            </View>
          </Animated.View>

          <Animated.View style={[styles.section, supportAnim]}>
            <Text className="settings-title" style={styles.sectionTitle}>
              Support
            </Text>
            <View style={[styles.groupCard, neo.raised, { backgroundColor: colors.bg }]}>
              <SettingItem
                icon="help-buoy"
                label="Get Help"
                onPress={() => router.push("/(tabs)/support")}
                isDark={isDark}
                iconAccent={iconAccent}
                iconMuted={iconMuted}
                dividerColor={dividerColor}
              />
              <SettingItem
                icon="document-text"
                label="Terms of Service"
                onPress={() => {}}
                isDark={isDark}
                iconAccent={iconAccent}
                iconMuted={iconMuted}
                dividerColor={dividerColor}
              />
              <SettingItem
                icon="shield-checkmark"
                label="Privacy Policy"
                onPress={() => {}}
                isLast
                isDark={isDark}
                iconAccent={iconAccent}
                iconMuted={iconMuted}
                dividerColor={dividerColor}
              />
            </View>
          </Animated.View>

          <Animated.View style={[styles.section, accountAnim]}>
            <Text className="settings-title" style={styles.sectionTitle}>
              Account
            </Text>
            <View style={[styles.groupCard, neo.destructiveRaised]}>
              <SettingItem
                icon="log-out"
                label="Log Out"
                isDestructive
                showChevron={false}
                onPress={handleLogout}
                isLast
                isDark={isDark}
                iconAccent={iconAccent}
                iconMuted={iconMuted}
                dividerColor={dividerColor}
              />
            </View>
          </Animated.View>

          <Text className="text-muted-foreground text-xs text-center">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  page: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 30,
    lineHeight: 36,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    marginLeft: 4,
  },
  groupCard: {
    borderRadius: 20,
    overflow: "hidden",
    paddingVertical: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "hsla(342, 93%, 61%, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "hsl(342, 93%, 61%)",
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  infoRows: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
