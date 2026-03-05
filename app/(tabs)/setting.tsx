import { Container } from "@/components/container";
import {
  ScrollView,
  Text,
  View,
  Switch,
  Alert,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useProfile } from "@/lib/api/profile";
import { useRouter } from "expo-router";
import { SettingItem } from "@/components/setting-item";

export default function Setting() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: session } = authClient.useSession();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const displayName = profile?.name || session?.user?.name || "User";
  const displayEmail = profile?.email || session?.user?.email;
  const isDark = colorScheme === "dark";

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-10">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>

          {/* Profile Section */}
          <View className="gap-4">
            <Text className="settings-title">Profile</Text>
            <View className="rounded-3xl p-6 gap-6 border border-border bg-secondary/50">
              {/* Header with avatar and edit button */}
              <View className="flex-row items-center">
                <View
                  className={`w-18 h-18 px-2 rounded-full items-center justify-center mr-4 ${
                    isDark ? "bg-primary/25" : "bg-primary/15"
                  }`}
                >
                  <Text className="text-2xl font-bold text-primary">
                    {displayName[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-xl font-bold text-foreground">
                    {displayName}
                  </Text>
                  <Text className="text-muted-foreground text-sm font-medium">
                    {displayEmail}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View className="h-[1px] bg-border" />

              {/* Student Information */}
              <View className="gap-6">
                <View className="flex-row justify-between items-center">
                  <Text className="text-muted-foreground font-semibold">
                    Student ID
                  </Text>
                  <Text className="text-foreground font-bold text-base">
                    2023CS001
                  </Text>
                </View>
                <View className="h-[0.5px] bg-border" />
                <View className="flex-row justify-between items-center">
                  <Text className="text-muted-foreground font-semibold">
                    Group
                  </Text>
                  <Text className="text-foreground font-bold text-base">
                    L5CG1
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View className="gap-4">
            <Text className="settings-title">Appearance</Text>
            <View className="rounded-3xl overflow-hidden border border-border bg-secondary/50">
              <SettingItem
                icon="moon"
                label="Dark Mode"
                showChevron={false}
                isLast={true}
                rightElement={
                  <Switch
                    value={isDark}
                    onValueChange={toggleColorScheme}
                    trackColor={{
                      false: isDark ? "#374151" : "#d1d5db",
                      true: isDark ? "#2563eb" : "#3b82f6",
                    }}
                    thumbColor={isDark ? "#ffffff" : "#ffffff"}
                    ios_backgroundColor={isDark ? "#374151" : "#d1d5db"}
                  />
                }
              />
            </View>
          </View>

          {/* Support */}
          <View className="gap-4">
            <Text className="settings-title">Support</Text>
            <View className="rounded-3xl overflow-hidden border border-border bg-secondary/50">
              <SettingItem
                icon="help-buoy"
                label="Get Help"
                onPress={() => router.push("/(tabs)/support")}
              />
              <SettingItem
                icon="document-text"
                label="Terms of Service"
                onPress={() => {}}
              />
              <SettingItem
                icon="shield-checkmark"
                label="Privacy Policy"
                onPress={() => {}}
                isLast={true}
              />
            </View>
          </View>

          {/* Account */}
          <View className="gap-4">
            <Text className="settings-title">Account</Text>
            <View className="rounded-3xl overflow-hidden border border-border bg-secondary/50">
              <SettingItem
                icon="log-out"
                label="Log Out"
                isDestructive
                showChevron={false}
                onPress={handleLogout}
                isLast={true}
              />
            </View>
          </View>

          <View className="items-center">
            <Text className="text-muted-foreground text-xs">Version 1.0.0</Text>
          </View>
        </View>

      </ScrollView>
    </Container>
  );
}
