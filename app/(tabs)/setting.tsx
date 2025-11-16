import { Container } from "@/components/container";
import { ProfileDisplay } from "@/components/profile-display";
import { ProfileEditModal } from "@/components/profile-edit";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { ScrollView, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function Setting() {
  const { data: session } = authClient.useSession();
  const [displayName, setDisplayName] = useState(session?.user?.name || "");
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  useEffect(() => {
    setDisplayName(session?.user?.name || "");
  }, [session?.user?.name]);

  const handleProfileUpdated = (newName: string) => {
    setDisplayName(newName);
  };

  return (
    <Container>
      <ScrollView className="flex-1 px-4">
        <View className="">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Setting
          </Text>
          <Text className="text-lg text-muted-foreground">
            Discover settings
          </Text>
        </View>

        <View className="pt-6">
          <ProfileDisplay
            name={displayName}
            onEditPress={() => setIsProfileModalVisible(true)}
          />
          <ThemeToggle />
          <LogoutButton />
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
