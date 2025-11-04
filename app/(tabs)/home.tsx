import { Container } from "@/components/container";
import { ScrollView, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { User } from "better-auth/types";

export default function Home() {
	const {data: session, isRefetching, isPending} = authClient.useSession();


	if (isRefetching || isPending) {
		return <Text>Loading...</Text>
	}

	return (
		<Container>
			<ScrollView className="flex-1 px-4">
				<View className="">
					<Text className="text-4xl font-sans font-bold text-foreground mb-2">
						Routine app
					</Text>
					<Text className="text-lg text-muted-foreground">
						Hello, {session?.user.name}z
					</Text>
				</View>
			</ScrollView>
		</Container>
	);
}
