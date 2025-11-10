import axios from "axios";
import type { Profile } from "@/lib/types/profile";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

export async function getProfile(): Promise<Profile> {
  const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
    withCredentials: true,
  });
  return response.data.data;
}

export async function updateProfile(profileData: {
  name?: string;
  email?: string;
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
