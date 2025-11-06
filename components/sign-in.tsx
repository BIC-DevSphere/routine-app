import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from 'toastify-react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { isDarkColorScheme } = useColorScheme();

    const placeholderColor = isDarkColorScheme ? "#9CA3AF" : "#6B7280"; 

    const handleLogin = async () => {
        setLoading(true);
        if (email == "" || password == "") {
            Toast.error("Fill all the inputs")
            setLoading(false);
            return null;
        }

        const result = await authClient.signIn.email({
            email,
            password,
        });
        setLoading(false)

        if (result.error) {
            Toast.error(result.error.message || "Invalid credentials")
            console.log("Error while logging in: ", result.error.message)
            console.log(result.error);
        }

    };

    return (
        <View className="w-full gap-6 max-w-80 px-5 py-6">
            <View className="input-row">
                <Ionicons name="mail-outline" size={20} color={placeholderColor} />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    className="input-text"
                    placeholderTextColor={placeholderColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View className="input-row">
                <Ionicons name="lock-closed-outline" size={20} color={placeholderColor} />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    className="input-text"
                    placeholderTextColor={placeholderColor}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                    <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color={placeholderColor}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                className="bg-primary text-center rounded-xl p-3"
                onPress={handleLogin}
            >
                <Text className="text-secondary text-center font-bold">{loading ? "Logging in " : "Login "}</Text>
            </TouchableOpacity>

            <ToastManager />
        </View>
    );
}