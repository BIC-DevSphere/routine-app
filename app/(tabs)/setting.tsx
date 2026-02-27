import { Container } from "@/components/container";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useProfile } from "@/lib/api/profile";
import { useRouter } from "expo-router";

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

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    showChevron = true,
    isDestructive = false,
    rightElement,
    isLast = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    isDestructive?: boolean;
    rightElement?: React.ReactNode;
    isLast?: boolean;
  }) => (
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
              : isDark
              ? "bg-primary/20"
              : "bg-primary/10"
          }`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isDestructive ? "#ef4444" : isDark ? "#60a5fa" : "#2563eb"}
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
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
        )}
      </TouchableOpacity>
      {!isLast && <View className="mx-5 h-[0.5px] bg-border" />}
    </View>
  );

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
