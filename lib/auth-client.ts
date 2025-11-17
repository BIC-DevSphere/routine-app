import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { Platform } from 'react-native';

type AuthConfig = {
    user: {
        additionalFields: {
            groupId: {
                type: "string";
                required: true;
            };
        };
    };
};

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || "https://routine-backend-ia1t.onrender.com";

if (!SERVER_URL) {
    throw new Error(
        "EXPO_PUBLIC_SERVER_URL is missing! Check eas.json and rebuild the app."
    );
}

export const authClient = createAuthClient({
    baseURL: `${SERVER_URL}/api/auth`,
    plugins: [
        expoClient({
            scheme: "routine-app",
            storagePrefix: "routine-app",
            storage: Platform.OS === 'web' ? localStorage : SecureStore,
        }),
        inferAdditionalFields<AuthConfig>()
    ],
});