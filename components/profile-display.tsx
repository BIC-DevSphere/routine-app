import { TouchableOpacity, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ProfileDisplayProps} from "@/lib/types/profile"

export function ProfileDisplay({ onEditPress, name }: ProfileDisplayProps) {
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return null;
  }

  const newName = name || session.user.name

  return (
    <TouchableOpacity
      onPress={onEditPress}
      className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {newName}
          </Text>
          <Text className="text-base text-muted-foreground">
            {session.user.email}
          </Text>
        </View>
        <Ionicons name="pencil" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );
}
