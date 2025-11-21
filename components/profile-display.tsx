import { TouchableOpacity, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ProfileDisplayProps} from "@/lib/types/profile"
import { useProfile } from "@/lib/api/profile";

export function ProfileDisplay({ onEditPress }: ProfileDisplayProps) {
  const { data: profile } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onEditPress}
      className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {profile.name}
          </Text>
          <Text className="text-base text-muted-foreground">
            {profile.email}
          </Text>
        </View>
        <Ionicons name="pencil" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );
}
