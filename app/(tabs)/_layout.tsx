import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import { TabBarIcon } from "@/components/tabbar-icon";

export default function TabLayout() {
	const { isDarkColorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: isDarkColorScheme
					? "hsl(353, 81%, 55%)"
					: "hsl(353, 81%, 47%)",
				tabBarInactiveTintColor: isDarkColorScheme
					? "#A3A3A3"
					: "#737373",
				tabBarStyle: {
					backgroundColor: isDarkColorScheme
						? "#0A0A0A"
						: "#FFFFFF",
					borderTopColor: isDarkColorScheme
						? "#262626"
						: "#E5E5E5",
					paddingBottom: 6,
					height: 58,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name="home" color={color} focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name="setting"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name="cog" color={color} focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name="support"
				options={{
					title: "Support",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name="life-ring" color={color} focused={focused} />
					),
				}}
			/>
		</Tabs>
	);
}