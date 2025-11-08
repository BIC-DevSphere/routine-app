import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RoutineData } from "../types/routine";
import { authClient } from "../auth-client";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";


export function useRoutine() {
	const { data: session } = authClient.useSession();

	return useQuery({
		queryKey: ["routine", session?.user?.id],
		queryFn: async (): Promise<RoutineData> => {
			if (!session) {
				throw new Error("No authentication session available");
			}
			const cookies = authClient.getCookie();

			const response = await axios.get(`${API_BASE_URL}/api/routines/group`, {
				headers: {
					"Content-Type": "application/json",
					Cookie: cookies
				},
				withCredentials: true,
			});
			return response.data.data;
		},
		enabled: !!session?.user,
		staleTime: 5 * 60 * 1000,
		retry: 3,
	});
}
