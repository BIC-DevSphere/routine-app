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

export const authClient = createAuthClient({
    baseURL: `${process.env.EXPO_PUBLIC_SERVER_URL}/api/auth`, 
    plugins: [
        expoClient({
            scheme: "routine-app",
            storagePrefix: "routine-app",
            storage: Platform.OS === 'web' ? localStorage : SecureStore,
        }),
        inferAdditionalFields<AuthConfig>()
    ],
    
});