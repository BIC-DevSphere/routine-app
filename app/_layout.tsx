import { Stack, useRouter } from "expo-router";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { NAV_THEME } from "@/lib/constants";
import React, { useRef } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Platform } from "react-native";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { authClient } from "@/lib/auth-client";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupsProvider } from "@/context/groupContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

export default function RootLayout() {
	const hasMounted = useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}

		if (Platform.OS === "web") {
			document.documentElement.classList.add("bg-background");
		}
		setAndroidNavigationBar(colorScheme);
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	React.useEffect(() => {
		if (isPending || !isColorSchemeLoaded) return;

		if (session) {
			router.replace("/(tabs)/home");
		} else {
			router.replace("/(auth)");
		}
	}, [session, isPending, isColorSchemeLoaded, router]);

	if (!isColorSchemeLoaded || isPending) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<GroupsProvider>
			<SafeAreaView style={{
				flex: 1,
				backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
			}}>
				<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
					<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
					<GestureHandlerRootView style={{ flex: 1 }}>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(auth)/index" />
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="reset-password" />
							<Stack.Screen name="+not-found" />
						</Stack>
					</GestureHandlerRootView>
				</ThemeProvider>
			</SafeAreaView>
			</GroupsProvider>
		</QueryClientProvider>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
