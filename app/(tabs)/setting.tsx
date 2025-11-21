import { Container } from "@/components/container";
import { ProfileEditModal } from "@/components/profile-edit";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useProfile } from "@/lib/api/profile";
import { useRouter } from "expo-router";

export default function Setting() {
  const router = useRouter();
  const { data: profile, refetch } = useProfile();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const isDark = colorScheme === "dark";

  const handleProfileUpdated = async () => {
    await refetch();
  };

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
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    isDestructive?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center p-4 border-b border-border/50 last:border-b-0"
    >
      <View
        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isDestructive ? "bg-destructive/10" : "bg-primary/10"
          }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isDestructive ? "#ef4444" : isDark ? "#60a5fa" : "#2563eb"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-medium ${isDestructive ? "text-destructive" : "text-foreground"
            }`}
        >
          {label}
        </Text>
      </View>
      {value && (
        <Text className="text-muted-foreground text-sm mr-2">{value}</Text>
      )}
      {rightElement}
      {showChevron && !rightElement && (
        <Ionicons
          name="chevron-forward"
          size={20}
          className="text-muted-foreground"
          color={isDark ? "#9ca3af" : "#6b7280"}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 pt-2">
          <Text className="text-3xl font-bold text-foreground mb-6">
            Settings
          </Text>

          {/* Profile Section */}
          <TouchableOpacity
            onPress={() => setIsProfileModalVisible(true)}
            className="bg-secondary/50 rounded-2xl p-4 mb-6 flex-row items-center border border-border/50"
          >
            <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mr-4">
              <Text className="text-2xl font-bold text-primary">
                {profile?.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground">
                {profile?.name || "User"}
              </Text>
              <Text className="text-muted-foreground">{profile?.email}</Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-background items-center justify-center border border-border/50">
              <Ionicons
                name="pencil"
                size={14}
                color={isDark ? "#fff" : "#000"}
              />
            </View>
          </TouchableOpacity>

          {/* Preferences */}
          <Text className="text-sm font-semibold text-muted-foreground ml-2 mb-2 uppercase tracking-wider">
            Preferences
          </Text>
          <View className="bg-secondary/50 rounded-2xl overflow-hidden border border-border/50 mb-6">
            <SettingItem
              icon="moon"
              label="Dark Mode"
              showChevron={false}
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: "#767577", true: "#2563eb" }}
                  thumbColor={isDark ? "#ffffff" : "#f4f3f4"}
                />
              }
            />
            <SettingItem
              icon="notifications"
              label="Notifications"
              value="On"
              onPress={() => { }}
            />
          </View>

          {/* Support */}
          <Text className="text-sm font-semibold text-muted-foreground ml-2 mb-2 uppercase tracking-wider">
            Support
          </Text>
          <View className="bg-secondary/50 rounded-2xl overflow-hidden border border-border/50 mb-6">
            <SettingItem
              icon="help-buoy"
              label="Get Help"
              onPress={() => router.push("/(tabs)/support")}
            />
            <SettingItem
              icon="document-text"
              label="Terms of Service"
              onPress={() => { }}
            />
            <SettingItem
              icon="shield-checkmark"
              label="Privacy Policy"
              onPress={() => { }}
            />
          </View>

          {/* Account */}
          <Text className="text-sm font-semibold text-muted-foreground ml-2 mb-2 uppercase tracking-wider">
            Account
          </Text>
          <View className="bg-secondary/50 rounded-2xl overflow-hidden border border-border/50 mb-8">
            <SettingItem
              icon="log-out"
              label="Log Out"
              isDestructive
              showChevron={false}
              onPress={handleLogout}
            />
          </View>

          <View className="items-center mb-8">
            <Text className="text-muted-foreground text-xs">
              Version 1.0.0
            </Text>
          </View>
        </View>

        <ProfileEditModal
          visible={isProfileModalVisible}
          onClose={() => setIsProfileModalVisible(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      </ScrollView>
    </Container>
  );
}
