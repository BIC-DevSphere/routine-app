import { useQuery } from "@tanstack/react-query";
import { RoutineData } from "../types/routine";
import { authClient } from "../auth-client";
import { axiosInstance } from "./axiosInstance";
import { API_ENDPOINTS } from "./apiConfig";

export function useRoutine() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ["routine", session?.user?.id],
    queryFn: async (): Promise<RoutineData> => {
      if (!session) {
        throw new Error("No authentication session available");
      }

      const response = await axiosInstance.get(API_ENDPOINTS.routinesGroup);
      return response.data.data;
    },
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}
