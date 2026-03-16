import FontAwesome from "@expo/vector-icons/FontAwesome";
import Animated from "react-native-reanimated";
import { useTabFocus } from "@/lib/animations";

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}

export const TabBarIcon = ({ name, color, focused }: TabBarIconProps) => {
  const animStyle = useTabFocus(focused);

  return (
    <Animated.View style={[{ marginBottom: -3 }, animStyle]}>
      <FontAwesome size={24} name={name} color={color} />
    </Animated.View>
  );
};
