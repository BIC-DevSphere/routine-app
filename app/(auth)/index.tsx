import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

const auth = () => {
  const [newUser, setNewUser] = useState<boolean>(false);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 justify-center items-center">
        {/* Content Card */}
        <View className="w-full px-4">
          <View className="items-center">
            {/* Logo/Title and Subtitle */}
            <Text className="font-bold text-3xl text-foreground mb-2">
              {newUser ? "Create Account" : "Sign In To Routine"}
            </Text>
            <Text className="text-muted-foreground text-center text-base mb-8">
              Let's Personalize Your Routine
            </Text>
          </View>

          {/* Form Card */}
          <View className="rounded-2xl px-6 py-8 bg-background">
            {newUser ? <SignUp /> : <SignIn />}

            {/* Toggle Auth Mode */}
            <View className="mt-8">
              <TouchableOpacity onPress={() => setNewUser(!newUser)}>
                <Text className="text-center text-muted-foreground">
                  {newUser
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <Text className="text-primary font-semibold">
                    {newUser ? "Sign In" : "Sign Up"}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default auth;
