import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import ToastManager, { Toast } from 'toastify-react-native'
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

    const handleLogin = async () => {
        setLoading(true);
        if (email == "" || password == "" || name == "" || selectedGroup == "") {
            Toast.error("Fill all the inputs")
            setLoading(false);
            return null;
        }

        const result = await authClient.signUp.email({
            email,
            password,
            name,
        });
        setLoading(false)

        if (result.error) {
            Toast.error(result.error.message || "Invalid credentials")
            console.log("Error while logging in: ", result.error.message)
        }

    };

    return (
        <View className="w-full gap-6 max-w-80 rounded-xl px-5 py-6">
            <View className="input-row">
                <Ionicons name="person-outline" size={20} color={placeholderColor} />
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    className="input-text"
                    placeholderTextColor={placeholderColor}
                />
            </View>
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={placeholderColor}
                    />
                </TouchableOpacity>
            </View>
            <View className="bg-input border border-border rounded-xl">
            <Picker
                selectedValue={selectedGroup}
                onValueChange={(itemValue) => setSelectedGroup(itemValue)}
                className="p-5"
            >
                <Picker.Item label="Select Group" value="" enabled={false} />
                {groups.map((e)=>(
                    <Picker.Item key={e.id} label={e.name}  />
                ))}
            </Picker>
            </View>
            <TouchableOpacity
                className="bg-primary text-center rounded-xl p-3"
                onPress={handleLogin}
            >
                <Text className="text-secondary text-center font-bold">{loading ? "Signing up " : "Sign up "}</Text>
            </TouchableOpacity>
        
            <ToastManager />
        </View>
    );
}