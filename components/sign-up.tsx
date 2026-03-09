import { useState } from "react";
import Animated from "react-native-reanimated";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from "toastify-react-native";
import { useGroups } from "@/context/groupContext";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useMountFade, useScalePress } from "@/lib/animations";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { groups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const placeholderColor = isDarkColorScheme ? "#A3A3A3" : "#737373";
  const iconColor = isDarkColorScheme ? "#A3A3A3" : "#737373";
  const pickerTextColor = isDarkColorScheme ? "#FAFAFA" : "#0A0A0A";

  const nameAnim  = useMountFade(0,   18);
  const emailAnim = useMountFade(70,  18);
  const passAnim  = useMountFade(140, 18);
  const groupAnim = useMountFade(210, 18);
  const btnAnim   = useMountFade(280, 14);
  const { style: btnPressStyle, onPressIn: btnPressIn, onPressOut: btnPressOut } = useScalePress(0.96);

  const handleSignUp = async () => {
    setLoading(true);
    if (email == "" || password == "" || name == "" || selectedGroup == "") {
      Toast.error("Fill all the inputs");
      setLoading(false);
      return null;
    }

    const result = await authClient.signUp.email({
      email,
      password,
      name,
      groupId: selectedGroup,
    });
    setLoading(false);

    if (result.error) {
      Toast.error(result.error.message || "Invalid credentials");
      console.log("Error while signing up: ", result.error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputGroup, nameAnim]}>
        <Text className="text-foreground font-semibold text-sm" style={styles.label}>
          Full Name
        </Text>
        <View style={[styles.inputRow, neo.inset]}>
          <Ionicons name="person-outline" size={20} color={iconColor} />
          <TextInput
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            className="flex-1 text-foreground"
            style={styles.textInput}
            placeholderTextColor={placeholderColor}
            autoCapitalize="words"
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.inputGroup, emailAnim]}>
        <Text className="text-foreground font-semibold text-sm" style={styles.label}>
          Email Address
        </Text>
        <View style={[styles.inputRow, neo.inset]}>
          <Ionicons name="mail-outline" size={20} color={iconColor} />
          <TextInput
            placeholder="email@gmail.com"
            value={email}
            onChangeText={setEmail}
            className="flex-1 text-foreground"
            style={styles.textInput}
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.inputGroup, passAnim]}>
        <Text className="text-foreground font-semibold text-sm" style={styles.label}>
          Password
        </Text>
        <View style={[styles.inputRow, neo.inset]}>
          <Ionicons name="lock-closed-outline" size={20} color={iconColor} />
          <TextInput
            placeholder="••••••••••"
            value={password}
            onChangeText={setPassword}
            className="flex-1 text-foreground"
            style={styles.textInput}
            placeholderTextColor={placeholderColor}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.inputGroup, groupAnim]}>
        <Text className="text-foreground font-semibold text-sm" style={styles.label}>
          Select Group
        </Text>
        <View style={[styles.pickerRow, neo.inset]}>
          <Ionicons name="people-outline" size={20} color={iconColor} />
          <Picker
            selectedValue={selectedGroup}
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
            style={[styles.picker, { color: pickerTextColor }]}
            dropdownIconColor={pickerTextColor}
          >
            <Picker.Item label="Select a group" value="" enabled={false} />
            {groups.map((e) => (
              <Picker.Item key={e.id} label={e.name} value={e.id} />
            ))}
          </Picker>
        </View>
      </Animated.View>

      <Animated.View style={btnAnim}>
        <Animated.View style={btnPressStyle}>
          <TouchableOpacity
            style={[styles.primaryButton, neo.primaryRaised]}
            onPress={handleSignUp}
            onPressIn={btnPressIn}
            onPressOut={btnPressOut}
            disabled={loading}
            activeOpacity={1}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Signing up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <ToastManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  textInput: {
    flex: 1,
  },
  picker: {
    flex: 1,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
