const API_BASE_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  baseURL: API_BASE_URL,

  userProfile: `${API_BASE_URL}/api/user/profile`,
  routinesGroup: `${API_BASE_URL}/api/routines/group`,
  groupsList: `${API_BASE_URL}/api/groups`,
};
