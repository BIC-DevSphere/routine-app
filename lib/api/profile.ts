import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Profile } from "@/lib/types/profile";
import { authClient } from "../auth-client";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

export function useProfile() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async (): Promise<Profile> => {
      if (!session) {
        throw new Error("No authentication session available");
      }
      const cookies = authClient.getCookie();

      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies,
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

// Updating doesn't work currently
export async function updateProfile(profileData: {
  name?: string;
}): Promise<Profile> {
  const response = await axios.patch(
    `${API_BASE_URL}/api/user/profile`,
    profileData,
    {
      withCredentials: true,
    }
  );
  return response.data.data;
}
