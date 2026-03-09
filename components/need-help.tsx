import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from "toastify-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";

interface NeedHelpProps {
    visible: boolean;
    onClose: () => void;
}

export default function NeedHelp({ visible, onClose }: NeedHelpProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedAction, setSelectedAction] = useState<'forgot' | 'verify' | null>(null);
    const { isDarkColorScheme } = useColorScheme();
    const neo = getNeoStyles(isDarkColorScheme);
    const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

    const placeholderColor = isDarkColorScheme ? "#A3A3A3" : "#737373";
    const iconColor = isDarkColorScheme ? "#A3A3A3" : "#737373";

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const result = await authClient.forgetPassword({
                email,
                redirectTo: "/reset-password",
            });

            if (result.error) {
                Toast.error(result.error.message || "Failed to send reset email");
            } else {
                Toast.success("Password reset email sent! Check your inbox.");
                setEmail("");
                setSelectedAction(null);
                onClose();
            }
        } catch (error: any) {
            Toast.error("Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!email.trim()) {
            Toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const result = await authClient.sendVerificationEmail({
                email,
            });

            if (result.error) {
                Toast.error(result.error.message || "Failed to send verification email");
            } else {
                Toast.success("Verification email sent! Check your inbox.");
                setEmail("");
                setSelectedAction(null);
                onClose();
            }
        } catch (error: any) {
            Toast.error("Failed to send verification email");
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setEmail("");
        setSelectedAction(null);
        setLoading(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.card, neo.raised, { backgroundColor: colors.bg }]}>
                    <View style={styles.header}>
                        <Text className="text-lg font-bold text-foreground">Need Help?</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={20} color={iconColor} />
                        </TouchableOpacity>
                    </View>

                    {!selectedAction ? (
                        <View style={styles.actionsGroup}>
                            <Text className="text-muted-foreground text-center text-sm" style={styles.subtitle}>
                                Choose what you need help with:
                            </Text>

                            <TouchableOpacity
                                style={[styles.optionBtn, neo.raisedSm, { backgroundColor: colors.bg }]}
                                onPress={() => setSelectedAction('forgot')}
                                activeOpacity={0.85}
                            >
                                <View style={styles.optionIcon}>
                                    <Ionicons name="key-outline" size={18} color={colors.primaryColor} />
                                </View>
                                <Text className="text-foreground font-semibold text-sm flex-1">
                                    Forgot Password
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color={iconColor} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionBtn, neo.raisedSm, { backgroundColor: colors.bg }]}
                                onPress={() => setSelectedAction('verify')}
                                activeOpacity={0.85}
                            >
                                <View style={styles.optionIcon}>
                                    <Ionicons name="mail-outline" size={18} color={colors.primaryColor} />
                                </View>
                                <Text className="text-foreground font-semibold text-sm flex-1">
                                    Verify Email
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color={iconColor} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actionsGroup}>
                            <TouchableOpacity
                                style={styles.backBtn}
                                onPress={() => setSelectedAction(null)}
                            >
                                <Ionicons name="arrow-back" size={18} color={iconColor} />
                                <Text className="text-muted-foreground ml-2 text-sm">Back</Text>
                            </TouchableOpacity>

                            <Text className="text-foreground font-semibold text-sm">
                                {selectedAction === 'forgot'
                                    ? 'Reset your password'
                                    : 'Resend verification email'}
                            </Text>

                            <View style={[styles.inputRow, neo.inset]}>
                                <Ionicons name="mail-outline" size={18} color={iconColor} />
                                <TextInput
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="flex-1 text-foreground"
                                    style={styles.textInput}
                                    placeholderTextColor={placeholderColor}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitBtn, neo.primaryRaised]}
                                onPress={selectedAction === 'forgot' ? handleForgotPassword : handleVerifyEmail}
                                disabled={loading}
                                activeOpacity={0.82}
                            >
                                <Text style={styles.submitText}>
                                    {loading
                                        ? "Sending..."
                                        : selectedAction === 'forgot'
                                        ? "Send Reset Email"
                                        : "Send Verification Email"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            <ToastManager />
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: "100%",
        maxWidth: 380,
        borderRadius: 22,
        padding: 22,
        gap: 16,
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
    actionsGroup: {
        gap: 12,
    },
    subtitle: {
        marginBottom: 4,
    },
    optionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 14,
    },
    optionIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(219,22,40,0.10)",
        alignItems: "center",
        justifyContent: "center",
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 13,
    },
    textInput: {
        flex: 1,
    },
    submitBtn: {
        borderRadius: 14,
        paddingVertical: 13,
        alignItems: "center",
    },
    submitText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
});
