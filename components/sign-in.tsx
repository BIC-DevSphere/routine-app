import { useState } from "react";
import Animated from "react-native-reanimated";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from "toastify-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import NeedHelp from "./need-help";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useMountFade, useScalePress } from "@/lib/animations";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const placeholderColor = isDarkColorScheme ? "#A3A3A3" : "#737373";
  const iconColor = isDarkColorScheme ? "#A3A3A3" : "#737373";


  const emailAnim    = useMountFade(0,   18);
  const passwordAnim = useMountFade(80,  18);
  const btnAnim      = useMountFade(160, 18);
  const helpAnim     = useMountFade(220, 10);
  const { style: btnPressStyle, onPressIn: btnPressIn, onPressOut: btnPressOut } = useScalePress(0.96);

  const handleLogin = async () => {
    setLoading(true);
    if (email == "" || password == "") {
      Toast.error("Fill all the inputs");
      setLoading(false);
      return null;
    }

    const result = await authClient.signIn.email({
      email,
      password,
    });
    setLoading(false);

    if (result.error) {
      Toast.error(
        result.error.message
          ? "Check Email to Verify First"
          : "Invalid credentials"
      );
      console.log("Error while logging in: ", result.error.message);
      console.log(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputGroup, emailAnim]}>
        <Text className="text-foreground font-semibold text-sm" style={styles.label}>
          Email Address
        </Text>
        <View
          style={[
            styles.inputRow,
            neo.inset,
          ]}
        >
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

      <Animated.View style={[styles.inputGroup, passwordAnim]}>
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

      <Animated.View style={btnAnim}>
        <Animated.View style={btnPressStyle}>
          <TouchableOpacity
            style={[styles.primaryButton, neo.primaryRaised]}
            onPress={handleLogin}
            onPressIn={btnPressIn}
            onPressOut={btnPressOut}
            disabled={loading}
            activeOpacity={1}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View style={helpAnim}>
        <TouchableOpacity
          onPress={() => setShowNeedHelp(true)}
          style={styles.helpButton}
        >
          <Text className="text-primary text-center font-semibold text-sm">
            Need Help?
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <NeedHelp visible={showNeedHelp} onClose={() => setShowNeedHelp(false)} />
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
  textInput: {
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
  helpButton: {
    marginTop: 4,
    paddingVertical: 6,
  },
});
