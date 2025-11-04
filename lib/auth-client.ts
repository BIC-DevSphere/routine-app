import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "http://192.168.100.105:3000/api/auth", 
    plugins: [
        expoClient({
            scheme: "routine-app",
            storagePrefix: "routine-app",
            storage: SecureStore,
        })
    ],
    
});