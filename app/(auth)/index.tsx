import { ScrollView, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NEO_COLORS } from "@/lib/neo-styles";
import AuthTabs from "@/components/auth-tabs";

const auth = () => {
  const { isDarkColorScheme } = useColorScheme();
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <AuthTabs />
    </ScrollView>
  );
};

export default auth;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
