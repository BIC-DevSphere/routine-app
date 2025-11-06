import { RoutineResponse } from "../types/routine";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

export async function fetchRoutine(token: string): Promise<RoutineResponse> {
	const response = await fetch(`${API_BASE_URL}/api/routines/group`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		credentials: "include"
	});

	if (!response.ok) {
		throw new Error("Failed to fetch routine");
	}

	return response.json();
}
