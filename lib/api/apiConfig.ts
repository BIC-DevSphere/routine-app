const API_BASE_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  baseURL: API_BASE_URL,

  userProfile: "/api/user/profile",
  routinesGroup: "/api/routines/group",
  groupsList: "/api/groups",
};
