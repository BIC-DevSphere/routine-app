import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from "toastify-react-native";
import { useGroups } from "@/context/groupContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { groups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkColorScheme } = useColorScheme();

  const placeholderColor = isDarkColorScheme ? "#9CA3AF" : "#6B7280";

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
    <View className="w-full gap-4">
      {/* Name Input */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold text-sm">Full Name</Text>
        <View className="input-row">
          <Ionicons name="person-outline" size={20} color={placeholderColor} />
          <TextInput
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            className="flex-1 text-foreground"
            placeholderTextColor={placeholderColor}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Email Input */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold text-sm">
          Email Address
        </Text>
        <View className="input-row">
          <Ionicons name="mail-outline" size={20} color={placeholderColor} />
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

      {/* Group Selection */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold text-sm">
          Select Group
        </Text>
        <View className="input-row py-0">
          <Ionicons name="people-outline" size={20} color={placeholderColor} />
          <Picker
            selectedValue={selectedGroup}
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
            style={{ color: "#fff", flex: 1 }}
          >
            <Picker.Item label="Group" value="" enabled={false} />
            {groups.map((e) => (
              <Picker.Item key={e.id} label={e.name} value={e.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        className="auth-button"
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text className="text-secondary text-center font-bold text-base">
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <ToastManager />
    </View>
  );
}
