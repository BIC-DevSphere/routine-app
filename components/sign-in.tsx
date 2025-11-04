import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from 'toastify-react-native'
export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        }

    };

    return (
        <View className="w-full gap-6 max-w-80 px-5 py-6">
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="bg-input border border-border rounded-xl p-5 text-foreground focus:ring-2 focus:ring-primary"
                placeholderTextColor={placeholderColor}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                className="bg-input border border-border rounded-xl p-5 text-foreground focus:ring-2 focus:ring-primary"
                placeholderTextColor={placeholderColor}
                secureTextEntry
            />
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