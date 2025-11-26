import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from "toastify-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import NeedHelp from "./need-help";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  const placeholderColor = isDarkColorScheme ? "#9CA3AF" : "#6B7280";

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
    <View className="w-full gap-4">
      {/* Email Input */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold text-sm">
          Email Address
        </Text>
        <View className="input-row">
          <Ionicons
            name="mail-outline"
            size={20}
            color={placeholderColor}
          />
          <TextInput
            placeholder="email@gmail.com"
            value={email}
            onChangeText={setEmail}
            className="flex-1 text-foreground"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password Input */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold text-sm">Password</Text>
        <View className="input-row">
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={placeholderColor}
          />
          <TextInput
            placeholder="••••••••••"
            value={password}
            onChangeText={setPassword}
            className="flex-1 text-foreground"
            placeholderTextColor={placeholderColor}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={placeholderColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        className="auth-button"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-secondary text-center font-bold text-base">
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Forgot Password and Verify Email */}
      <TouchableOpacity onPress={() => setShowNeedHelp(true)} className="mt-2">
        <Text className="text-primary text-center font-medium">
          Need Help?
        </Text>
      </TouchableOpacity>

      <NeedHelp visible={showNeedHelp} onClose={() => setShowNeedHelp(false)} />

      <ToastManager />
    </View>
  );
}
