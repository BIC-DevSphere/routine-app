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
        className={`flex-row items-center px-5 py-4 ${onPress ? 'active:bg-accent/50' : ''}`}
      >
        <View
          className={`w-9 h-9 rounded-full items-center justify-center mr-4 ${
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
            color={
              isDestructive 
                ? "#ef4444" 
                : isDark 
                  ? "#60a5fa" 
                  : "#2563eb"
            }
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
      {!isLast && (
        <View className="ml-[52px] mr-5 h-[0.5px] bg-border/40" />
      )}
    </View>
  );

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-3 pb-8">
          <Text className="text-3xl font-bold text-foreground mb-8 mt-2">
            Settings
          </Text>

          {/* Profile Section */}
          <View className={`rounded-3xl p-6 mb-8 border ${
            isDark 
              ? "bg-card/80 border-border/30 shadow-lg shadow-black/20" 
              : "bg-card border-border/50 shadow-sm shadow-black/5"
          }`}>
            {/* Header with avatar and edit button */}
            <View className="flex-row items-center mb-6">
              <View className={`w-18 h-18 px-2 rounded-full items-center justify-center mr-4 ${
                isDark ? "bg-primary/25" : "bg-primary/15"
              }`}>
                <Text className="text-2xl font-bold text-primary">
                  {profile?.name?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground mb-1">
                  {profile?.name || "User"}
                </Text>
                <Text className="text-muted-foreground text-sm font-medium">
                  {profile?.email}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsProfileModalVisible(true)}
                className={`w-11 h-11 rounded-2xl items-center justify-center border ${
                  isDark 
                    ? "bg-secondary border-border/50" 
                    : "bg-secondary/70 border-border/60"
                }`}
              >
                <Ionicons
                  name="pencil"
                  size={18}
                  color={isDark ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-border/40 mb-6" />

            {/* Student Information */}
            <View>
              <View className="flex-row justify-between items-center py-4">
                <Text className="text-muted-foreground font-semibold">
                  Student ID
                </Text>
                <Text className="text-foreground font-bold text-base">
                  2023CS001
                </Text>
              </View>
              <View className="h-[0.5px] bg-border/30" />
              <View className="flex-row justify-between items-center py-4">
                <Text className="text-muted-foreground font-semibold">
                  Group
                </Text>
                <Text className="text-foreground font-bold text-base">
                  L5CG1
                </Text>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <Text className="text-sm font-bold text-muted-foreground ml-3 mb-3 uppercase tracking-wider">
            Appearance
          </Text>
          <View className={`rounded-3xl overflow-hidden border mb-8 ${
            isDark 
              ? "bg-card/80 border-border/30 shadow-lg shadow-black/20" 
              : "bg-card border-border/50 shadow-sm shadow-black/5"
          }`}>
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
                    true: isDark ? "#2563eb" : "#3b82f6" 
                  }}
                  thumbColor={isDark ? "#ffffff" : "#ffffff"}
                  ios_backgroundColor={isDark ? "#374151" : "#d1d5db"}
                />
              }
            />
          </View>

          {/* Support */}
          <Text className="text-sm font-bold text-muted-foreground ml-3 mb-3 uppercase tracking-wider">
            Support
          </Text>
          <View className={`rounded-3xl overflow-hidden border mb-8 ${
            isDark 
              ? "bg-card/80 border-border/30 shadow-lg shadow-black/20" 
              : "bg-card border-border/50 shadow-sm shadow-black/5"
          }`}>
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
              isLast={true}
            />
          </View>

          {/* Account */}
          <Text className="text-sm font-bold text-muted-foreground ml-3 mb-3 uppercase tracking-wider">
            Account
          </Text>
          <View className={`rounded-3xl overflow-hidden border mb-8 ${
            isDark 
              ? "bg-card/80 border-border/30 shadow-lg shadow-black/20" 
              : "bg-card border-border/50 shadow-sm shadow-black/5"
          }`}>
            <SettingItem
              icon="log-out"
              label="Log Out"
              isDestructive
              showChevron={false}
              onPress={handleLogout}
              isLast={true}
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
