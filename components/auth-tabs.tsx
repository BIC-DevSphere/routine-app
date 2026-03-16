import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useColorScheme } from "@/lib/use-color-scheme";
import { getNeoStyles, NEO_COLORS } from "@/lib/neo-styles";
import { useMountFade } from "@/lib/animations";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

const TABS = ["Sign In", "Sign Up"] as const;

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { isDarkColorScheme } = useColorScheme();
  const neo = getNeoStyles(isDarkColorScheme);
  const colors = isDarkColorScheme ? NEO_COLORS.dark : NEO_COLORS.light;

  const tabIndicatorX    = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);
  const contentOpacity    = useSharedValue(1);

  const [tabWidth, setTabWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const onTabBarLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(w);
    setTabWidth(w / 2);
  }, []);

  const switchTab = useCallback(
    (index: number) => {
      if (index === activeTab) return;

      const targetX = index * (containerWidth / 2);

      // Slide indicator with spring
      tabIndicatorX.value = withSpring(targetX, SPRING_CONFIG);

      // Slide content out, swap, slide content in
      const direction = index > activeTab ? -1 : 1;

      contentOpacity.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
      contentTranslateX.value = withTiming(
        direction * 40,
        { duration: 150, easing: Easing.out(Easing.ease) },
        () => {
          // After sliding out, jump to opposite side and slide in
          contentTranslateX.value = -direction * 40;
          runOnJS(setActiveTab)(index);
          contentOpacity.value = withTiming(1, {
            duration: 250,
            easing: Easing.out(Easing.ease),
          });
          contentTranslateX.value = withSpring(0, {
            damping: 22,
            stiffness: 220,
            mass: 0.7,
          });
        }
      );
    },
    [activeTab, containerWidth, tabIndicatorX, contentTranslateX, contentOpacity]
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorX.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentTranslateX.value }],
    opacity: contentOpacity.value,
  }));

  const primaryColor = colors.primaryColor;
  const inactiveTextColor = isDarkColorScheme ? "#A3A3A3" : "#737373";


  const headingMount = useMountFade(0,   -16);
  const cardMount    = useMountFade(140,  24);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.headingBlock, headingMount]}>
        <Text className="font-bold text-foreground" style={styles.title}>
          {activeTab === 0 ? "Welcome Back" : "Create Account"}
        </Text>
        <Text className="text-muted-foreground text-center" style={styles.subtitle}>
          {activeTab === 0
            ? "Sign in to access your routine"
            : "Fill in the details to get started"}
        </Text>
      </Animated.View>

      {/* Card */}
      <Animated.View style={[styles.card, neo.raised, { backgroundColor: colors.bg }, cardMount]}>
        {/* Tab Bar */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDarkColorScheme
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
          onLayout={onTabBarLayout}
        >
          {/* Sliding Indicator */}
          <Animated.View
            style={[
              styles.tabIndicator,
              indicatorStyle,
              {
                width: tabWidth,
                backgroundColor: primaryColor,
                shadowColor: primaryColor,
              },
            ]}
          />

          {/* Tab Buttons */}
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              onPress={() => switchTab(index)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === index ? "#FFFFFF" : inactiveTextColor,
                    fontWeight: activeTab === index ? "700" : "500",
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Animated Content */}
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          {activeTab === 0 ? <SignIn /> : <SignUp />}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 28,
  },
  headingBlock: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 11,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
  },
  contentContainer: {
    width: "100%",
    overflow: "hidden",
  },
});
