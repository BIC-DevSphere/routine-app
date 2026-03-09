import { Container } from "@/components/container";
import Animated from "react-native-reanimated";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useScalePress, useFocusFade } from "@/lib/animations";

export default function Support() {
  const { isDarkColorScheme } = useColorScheme();
  const [issueType, setIssueType] = useState("bug");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDescription("");
      Alert.alert("Success", "Your support request has been submitted.");
    }, 1500);
  };

  const pickerTextColor = isDarkColorScheme ? "#FFFFFF" : "#1C2333";

  const titleAnim = useFocusFade(0,    -10);
  const issueAnim = useFocusFade(100,   20);
  const descAnim  = useFocusFade(180,   20);
  const btnAnim   = useFocusFade(260,   16);
  const { style: btnPressStyle, onPressIn: btnPressIn, onPressOut: btnPressOut } = useScalePress(0.96);

  return (
    <Container>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <Animated.View style={titleAnim}>
          <Text className="text-foreground font-bold" style={styles.pageTitle}>
            Support
          </Text>
          </Animated.View>

          <Animated.View style={[styles.field, issueAnim]}>
            <Text className="text-sm font-semibold text-foreground" style={styles.label}>
              Issue Type
            </Text>
            <View style={[styles.pickerWrap, neo.inset]}>
              <Picker
                selectedValue={issueType}
                onValueChange={(v) => setIssueType(v)}
                style={[styles.picker, { color: pickerTextColor }]}
                dropdownIconColor={pickerTextColor}
              >
                <Picker.Item label="Missing Class/Routine" value="ROUTINE_MISSING" />
                <Picker.Item label="Incorrect Time" value="TIME_INCORRECT" />
                <Picker.Item label="Incorrect Room" value="ROOM_INCORRECT" />
                <Picker.Item label="Incorrect Teacher" value="TEACHER_INCORRECT" />
                <Picker.Item label="Class Cancelled" value="CLASS_MISSING" />
                <Picker.Item label="Other" value="OTHER" />
              </Picker>
            </View>
          </Animated.View>

          <Animated.View style={[styles.field, descAnim]}>
            <Text className="text-sm font-semibold text-foreground" style={styles.label}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textarea,
                neo.inset,
                { color: isDarkColorScheme ? "#F5F5F5" : "#1C2333" },
              ]}
              placeholder="Describe your issue or request..."
              placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </Animated.View>

          <Animated.View style={btnAnim}>
            <Animated.View style={btnPressStyle}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                onPressIn={btnPressIn}
                onPressOut={btnPressOut}
                activeOpacity={1}
                style={[
                  styles.submitBtn,
                  neo.primaryRaised,
                  isSubmitting && styles.disabled,
                ]}
              >
                <Text style={styles.submitText}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  page: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 30,
    lineHeight: 36,
  },
  field: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  pickerWrap: {
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  picker: {
    flex: 1,
  },
  textarea: {
    borderRadius: 14,
    padding: 16,
    minHeight: 140,
    fontSize: 14,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
