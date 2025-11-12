import { TouchableOpacity, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import Ionicons from "@expo/vector-icons/Ionicons";

export function LogoutButton() {
  const logout = () => authClient.signOut();

  return (
    <TouchableOpacity
      onPress={logout}
      className="mb-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground mb-1">
            Logout
          </Text>
          <Text className="text-base text-muted-foreground">
            Sign out of your account
          </Text>
        </View>
        <Ionicons name="log-out-outline" size={24} color="#dc2626" />
      </View>
    </TouchableOpacity>
  );
}
