import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { updateProfile } from "@/lib/api/profile";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProfileEditModalProps } from "@/lib/types/profile";

export function ProfileEditModal({
  visible,
  onClose,
  onProfileUpdated,
}: ProfileEditModalProps) {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible && session?.user?.name) {
      setName(session.user.name);
    }
  }, [visible, session?.user?.name]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const data = await updateProfile({ name: name.trim() });
      onProfileUpdated(data.name)
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName(session?.user?.name || "");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-foreground">
              Edit Profile
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-base font-medium text-foreground mb-2">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              className="border border-primary/20 rounded-lg p-3 text-base text-foreground bg-background"
              placeholderTextColor="#999"
            />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 p-3 rounded-lg border border-primary/20 bg-background"
            >
              <Text className="text-center text-base font-medium text-foreground">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading || !name.trim()}
              className="flex-1 p-3 rounded-lg bg-primary disabled:opacity-50"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-center text-base font-medium text-primary-foreground">
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
