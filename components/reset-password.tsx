import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from 'toastify-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, router } from 'expo-router';
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { isDarkColorScheme } = useColorScheme();
    const params = useLocalSearchParams();
    const neo = getNeoStyles(isDarkColorScheme);
    const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

    const placeholderColor = isDarkColorScheme ? "#A3A3A3" : "#737373";
    const iconColor = isDarkColorScheme ? "#A3A3A3" : "#737373";

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
        <View
          style={[styles.screen, { backgroundColor: colors.bg }]}
        >
            <Text className="font-bold text-foreground" style={styles.title}>
              Reset Password
            </Text>

            <View style={[styles.card, neo.raised, { backgroundColor: colors.bg }]}>
                <Text className="text-center text-muted-foreground text-sm">
                    Enter your new password below
                </Text>

                {/* New Password */}
                <View style={[styles.inputRow, neo.inset]}>
                    <Ionicons name="lock-closed-outline" size={20} color={iconColor} />
                    <TextInput
                        placeholder="New Password"
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

                {/* Confirm Password */}
                <View style={[styles.inputRow, neo.inset]}>
                    <Ionicons name="lock-closed-outline" size={20} color={iconColor} />
                    <TextInput
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        className="flex-1 text-foreground"
                        style={styles.textInput}
                        placeholderTextColor={placeholderColor}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? "eye" : "eye-off"}
                            size={20}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                </View>

                {/* Requirements */}
                <View style={styles.requirements}>
                    <Text className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                      Requirements:
                    </Text>
                    {["At least 8 characters", "One uppercase letter", "One lowercase letter", "One number"].map((r) => (
                      <View key={r} style={styles.reqRow}>
                        <View style={styles.reqDot} />
                        <Text className="text-xs text-muted-foreground">{r}</Text>
                      </View>
                    ))}
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                    style={[styles.primaryBtn, neo.primaryRaised]}
                    onPress={handleResetPassword}
                    disabled={loading}
                    activeOpacity={0.82}
                >
                    <Text style={styles.primaryBtnText}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Text>
                </TouchableOpacity>

                {/* Back */}
                <TouchableOpacity
                    style={[styles.backBtn, neo.raisedSm, { backgroundColor: colors.bg }]}
                    onPress={handleBackToSignIn}
                    activeOpacity={0.85}
                >
                    <Text className="text-center text-foreground font-semibold">
                      Back to Sign In
                    </Text>
                </TouchableOpacity>
            </View>
            <ToastManager />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        gap: 28,
    },
    title: {
        fontSize: 36,
        lineHeight: 42,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 22,
        padding: 24,
        gap: 16,
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
    requirements: {
        gap: 6,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "rgba(128,128,128,0.07)",
    },
    reqRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    reqDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: "hsl(342, 93%, 61%)",
        opacity: 0.7,
    },
    primaryBtn: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    primaryBtnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },
    backBtn: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
});
