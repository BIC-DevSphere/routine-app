import { Container } from "@/components/container";
import { ScrollView, Text, View, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { fetchRoutine } from "@/lib/api/routine";
import { useState, useEffect } from "react";
import { WeekDay } from "@/lib/types/routine";

export default function Home() {
	const { data: session, isRefetching, isPending } = authClient.useSession();
	const [refreshing, setRefreshing] = useState(false);
	const [activeDayIndex, setActiveDayIndex] = useState(new Date().getDay());
	const [todayRoutine, setTodayRoutine] = useState<WeekDay | undefined>(undefined);

	const {
		data: routineData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["routine"],
		queryFn: async () => {
			if (!session?.session.token) {
				throw new Error("No auth token available");
			}
			return fetchRoutine(session.session.token);
		},
		enabled: !!session?.session.token,
	});

	useEffect(() => {
		if (routineData?.data?.week) {
			const routineForToday = routineData.data.week[activeDayIndex];
			setTodayRoutine(routineForToday);
		}
	}, [activeDayIndex, routineData]);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	if (isRefetching || isPending) {
		return (
			<Container>
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" className="text-primary" />
					<Text className="text-muted-foreground mt-4">Loading session...</Text>
				</View>
			</Container>
		);
	}

	const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

	console.log(todayRoutine)

		function formatTime(time: string) {
		const [hour, minute] = time.split(":");
		let h = parseInt(hour, 10);
		const ampm = h >= 12 ? "PM" : "AM";
		h = h % 12 || 12;
		return `${h}:${minute} ${ampm}`;
}

	return (
		<Container>
			<ScrollView
				className="flex-1"
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View className="px-4 pt-6 pb-4 bg-gradient-to-b from-primary/5 to-transparent">
					<Text className="text-3xl font-bold text-foreground mb-1">
						Hello, {session?.user.name}! 👋
					</Text>
					<Text className="text-base text-muted-foreground">
						Here's your weekly schedule
					</Text>
				</View>

				{isLoading && (
					<View className="flex-1 justify-center items-center py-20">
						<ActivityIndicator size="large" className="text-primary" />
						<Text className="text-muted-foreground mt-4">
							Loading your routine...
						</Text>
					</View>
				)}

				{error && (
					<View className="px-4">
						<View className="bg-destructive/10 rounded-lg p-4 border border-destructive">
							<Text className="text-destructive font-semibold mb-1">
								Error loading routine
							</Text>
							<Text className="text-destructive-foreground">
								{error.message}
							</Text>
						</View>
					</View>
				)}

				<View className="px-4 pt-10 flex w-full flex-row gap-4">
					{days.map((day, index) => {
						const isActiveDay = index === activeDayIndex;
						return (
							<TouchableOpacity
								key={index}
								onPress={() => setActiveDayIndex(index)}
								className={`flex-1 w-10 py-6 p-1 border rounded-xl items-center justify-center shadow-sm ${
									isActiveDay
										? "bg-primary border-primary"
										: "border-gray-300 bg-background"
								}`}
							>
								<Text className={`text-sm font-medium capitalize ${
									isActiveDay ? "text-primary-foreground" : "text-foreground"
								}`}>
									{day}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>

				<View className="px-4 pt-6">
					{routineData?.data &&
						routineData.data.week.every((day) => day.slots.length === 0) ? (
							<View className="px-4 py-20">
								<Text className="text-center text-muted-foreground text-lg">
									No classes scheduled this week 
								</Text>
							</View>
						) : (
							todayRoutine?.slots.length ? (
								todayRoutine.slots.map((slot, idx) => (
									<View
										key={idx}
										className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5"
									>
										<Text className="text-lg font-semibold text-foreground mb-1">
											{slot.moduleName} ({slot.moduleCode})
										</Text>
										<Text className="text-base text-muted-foreground">
											{slot.classType} | {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
										</Text>
										{slot.room && (
											<Text className="text-sm text-muted-foreground mt-1">
												Room: {slot.room}
											</Text>
										)}
										{slot.teacher && (
											<Text className="text-sm text-muted-foreground mt-1">
												Teacher: {slot.teacher}
											</Text>
										)}
									</View>
								))
							) : (
								<View className="px-4 py-20">
									<Text className="text-center text-muted-foreground text-lg">
										No classes scheduled for this day
									</Text>
								</View>
							)
						)}
				</View>
			</ScrollView>
		</Container>
	);
}
