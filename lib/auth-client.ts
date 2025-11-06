import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: `${process.env.EXPO_PUBLIC_SERVER_URL}/api/auth`, 
    plugins: [
        expoClient({
            scheme: "routine-app",
            storagePrefix: "routine-app",
            storage: SecureStore,
        })
    ],
    
});