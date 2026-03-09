import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { updateProfile, useProfile } from "@/lib/api/profile";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProfileEditModalProps } from "@/lib/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";

export function ProfileEditModal({
  visible,
  onClose,
  onProfileUpdated,
}: ProfileEditModalProps) {
  const { data: profile } = useProfile();
  const [name, setName] = useState(profile?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  useEffect(() => {
    if (visible && profile?.name) {
      setName(profile.name);
    }
  }, [visible, profile?.name]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const data = await updateProfile({ name: name.trim() });
      queryClient.invalidateQueries({ queryKey: ["profile", profile?.id] });
      onProfileUpdated(data.name);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName(profile?.name || "");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            neo.raised,
            { backgroundColor: colors.bg },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text className="text-xl font-bold text-foreground">Edit Profile</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons
                name="close"
                size={20}
                color={isDarkColorScheme ? "#A3A3A3" : "#737373"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text className="text-sm font-semibold text-foreground" style={styles.fieldLabel}>
              Name
            </Text>
            <View style={[styles.inputRow, neo.inset]}>
              <Ionicons
                name="person-outline"
                size={18}
                color={isDarkColorScheme ? "#A3A3A3" : "#737373"}
              />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                className="flex-1 text-foreground"
                style={styles.textInput}
                placeholderTextColor={isDarkColorScheme ? "#A3A3A3" : "#737373"}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.cancelBtn, neo.raisedSm]}
              activeOpacity={0.85}
            >
              <Text className="text-center text-base font-semibold text-foreground">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading || !name.trim()}
              activeOpacity={0.82}
              style={[
                styles.saveBtn,
                neo.primaryRaised,
                (isLoading || !name.trim()) && styles.disabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 24,
    paddingBottom: 36,
    gap: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.3)",
    alignSelf: "center",
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(128,128,128,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});
