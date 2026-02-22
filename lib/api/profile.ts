import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@/lib/types/profile";
import { authClient } from "../auth-client";
import { axiosInstance } from "./axiosInstance";
import { API_ENDPOINTS } from "./apiConfig";

export function useProfile() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async (): Promise<Profile> => {
      if (!session) {
        throw new Error("No authentication session available");
      }

      const response = await axiosInstance.get(API_ENDPOINTS.userProfile);
      return response.data.data;
    },
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}

export async function updateProfile(profileData: {
  name?: string;
}): Promise<Profile> {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.userProfile,
    profileData,
  );
  return response.data.data;
}
