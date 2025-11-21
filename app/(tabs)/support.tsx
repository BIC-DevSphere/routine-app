import { Container } from "@/components/container";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Support() {
    const { isDarkColorScheme } = useColorScheme();
    const [issueType, setIssueType] = useState("bug");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert("Error", "Please enter a description");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setDescription("");
            Alert.alert("Success", "Your support request has been submitted.");
        }, 1500);
    };

    return (
        <Container>
            <ScrollView className="flex-1 p-4">
                <Text className="text-2xl font-bold text-foreground mb-6">
                    Support
                </Text>

                <View className="gap-6">
                    <View className="gap-2">
                        <Text className="text-base font-medium text-foreground">
                            Issue Type
                        </Text>
                        <View className="border border-border rounded-xl bg-secondary/50 overflow-hidden">
                            <Picker
                                selectedValue={issueType}
                                onValueChange={(itemValue) => setIssueType(itemValue)}
                                style={{
                                    color: isDarkColorScheme ? "#FFFFFF" : "#000000",
                                }}
                                dropdownIconColor={isDarkColorScheme ? "#FFFFFF" : "#000000"}
                            >
                                <Picker.Item label="Report a Bug" value="bug" />
                                <Picker.Item label="Feature Request" value="feature" />
                                <Picker.Item label="General Inquiry" value="general" />
                            </Picker>
                        </View>
                    </View>

                    <View className="gap-2">
                        <Text className="text-base font-medium text-foreground">
                            Description
                        </Text>
                        <TextInput
                            className="bg-secondary/50 border border-border rounded-xl p-4 text-foreground min-h-[150px] text-base"
                            placeholder="Describe your issue or request..."
                            placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                            multiline
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className={`py-4 rounded-xl items-center justify-center shadow-sm mt-4 ${isSubmitting ? "bg-primary/70" : "bg-primary"
                            }`}
                    >
                        <Text className="text-primary-foreground font-bold text-lg">
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Container>
    );
}
