import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Modal } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from 'toastify-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NeedHelpProps {
    visible: boolean;
    onClose: () => void;
}

export default function NeedHelp({ visible, onClose }: NeedHelpProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedAction, setSelectedAction] = useState<'forgot' | 'verify' | null>(null);
    const { isDarkColorScheme } = useColorScheme();

    const placeholderColor = isDarkColorScheme ? "#9CA3AF" : "#6B7280";

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
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-background rounded-2xl p-6 w-full max-w-sm">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-foreground">Need Help?</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color={placeholderColor} />
                        </TouchableOpacity>
                    </View>

                    {!selectedAction ? (
                        <View className="gap-4">
                            <Text className="text-muted-foreground text-center mb-4">
                                Choose what you need help with:
                            </Text>
                            
                            <TouchableOpacity
                                className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex-row items-center"
                                onPress={() => setSelectedAction('forgot')}
                            >
                                <Ionicons name="key-outline" size={20} color={placeholderColor} />
                                <Text className="text-foreground font-medium ml-3">Forgot Password</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex-row items-center"
                                onPress={() => setSelectedAction('verify')}
                            >
                                <Ionicons name="mail-outline" size={20} color={placeholderColor} />
                                <Text className="text-foreground font-medium ml-3">Verify Email</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="gap-4">
                            <TouchableOpacity
                                className="flex-row items-center mb-2"
                                onPress={() => setSelectedAction(null)}
                            >
                                <Ionicons name="arrow-back" size={20} color={placeholderColor} />
                                <Text className="text-muted-foreground ml-2">Back</Text>
                            </TouchableOpacity>

                            <Text className="text-foreground font-medium mb-4">
                                {selectedAction === 'forgot' 
                                    ? 'Reset your password' 
                                    : 'Resend verification email'
                                }
                            </Text>

                            <View className="input-row">
                                <Ionicons name="mail-outline" size={20} color={placeholderColor} />
                                <TextInput
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="input-text"
                                    placeholderTextColor={placeholderColor}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-primary rounded-xl p-3"
                                onPress={selectedAction === 'forgot' ? handleForgotPassword : handleVerifyEmail}
                                disabled={loading}
                            >
                                <Text className="text-primary-foreground text-center font-bold">
                                    {loading 
                                        ? "Sending..." 
                                        : selectedAction === 'forgot' 
                                        ? "Send Reset Email" 
                                        : "Send Verification Email"
                                    }
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