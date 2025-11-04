import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Setting() {

	const { toggleColorScheme } = useColorScheme()
	
	const logout = () => authClient.signOut();

	return (
		<Container>
			<ScrollView className="flex-1 px-4">
				<View className="">
					<Text className="text-3xl font-bold text-foreground mb-2">
						Setting
					</Text>
					<Text className="text-lg text-muted-foreground">
						Discover settings
					</Text>
				</View>

				<View className="pt-6 items-center">
					<TouchableOpacity onPress={() => toggleColorScheme()} className="bg-foreground p-4 m-4 items-center w-40 rounded-xl">
						<Text className="text-background ">Toggle mode</Text>
					</TouchableOpacity>
				</View>
				<View className="items-center">
					<TouchableOpacity onPress={() => logout()} className="bg-destructive p-4 m-4 items-center w-40 rounded-xl">
						<Text className="text-background">Log out</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</Container>
	);
}
