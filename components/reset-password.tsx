import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from 'toastify-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, router } from 'expo-router';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { isDarkColorScheme } = useColorScheme();
    const params = useLocalSearchParams();

    const placeholderColor = isDarkColorScheme ? "#9CA3AF" : "#6B7280";

    const token = typeof params.token === 'string' ? params.token : '';

    useEffect(() => {
        if (!token) {
            Toast.error("Invalid or missing reset token");
            router.replace('/(auth)');
        }
    }, [token]);

    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            Toast.error("Password must be at least 8 characters long");
            return false;
        }
        if (!/(?=.*[a-z])/.test(password)) {
            Toast.error("Password must contain at least one lowercase letter");
            return false;
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            Toast.error("Password must contain at least one uppercase letter");
            return false;
        }
        if (!/(?=.*\d)/.test(password)) {
            Toast.error("Password must contain at least one number");
            return false;
        }
        return true;
    };

    const handleResetPassword = async () => {
        if (!password.trim() || !confirmPassword.trim()) {
            Toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Toast.error("Passwords do not match");
            return;
        }

        if (!validatePassword(password)) {
            return;
        }

        setLoading(true);
        try {
            const result = await authClient.resetPassword({
                newPassword: password,
                token: token,
            });

            if (result.error) {
                Toast.error(result.error.message || "Failed to reset password");
            } else {
                Toast.success("Password reset successful! You can now sign in with your new password.");
                setTimeout(() => {
                    router.replace('/(auth)');
                }, 2000);
            }
        } catch (error: any) {
            Toast.error("Failed to reset password. Please try again.");
            console.error("Reset password error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToSignIn = () => {
        router.replace('/(auth)');
    };

    if (!token) {
        return null; 
    }

    return (
        <View className="flex-1 justify-center items-center px-4">
            <Text className="font-bold font-serif text-5xl text-foreground mb-8">Reset Password</Text>
            <View className="w-full max-w-96 rounded-xl">
                <View className="items-center shadow-sm shadow-current rounded-xl px-6 py-10 bg-background">
                    <View className="w-full gap-6 max-w-80 px-5 py-6">
                        <Text className="text-center text-muted-foreground mb-4">
                            Enter your new password below
                        </Text>

                        <View className="input-row">
                            <Ionicons name="lock-closed-outline" size={20} color={placeholderColor} />
                            <TextInput
                                placeholder="New Password"
                                value={password}
                                onChangeText={setPassword}
                                className="input-text"
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

                        <View className="input-row">
                            <Ionicons name="lock-closed-outline" size={20} color={placeholderColor} />
                            <TextInput
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                className="input-text"
                                placeholderTextColor={placeholderColor}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color={placeholderColor}
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="gap-2 mb-4">
                            <Text className="text-xs text-muted-foreground">Password requirements:</Text>
                            <Text className="text-xs text-muted-foreground">• At least 8 characters long</Text>
                            <Text className="text-xs text-muted-foreground">• One uppercase letter</Text>
                            <Text className="text-xs text-muted-foreground">• One lowercase letter</Text>
                            <Text className="text-xs text-muted-foreground">• One number</Text>
                        </View>

                        <TouchableOpacity
                            className="bg-primary text-center rounded-xl p-3"
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            <Text className="text-primary-foreground text-center font-bold">
                                {loading ? "Resetting Password..." : "Reset Password"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-muted/50 border border-muted rounded-xl p-3 mt-2"
                            onPress={handleBackToSignIn}
                        >
                            <Text className="text-muted-foreground text-center font-medium">Back to Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ToastManager />
        </View>
    );
}