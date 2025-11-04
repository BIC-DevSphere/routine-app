import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";
import { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"

const auth = () => {

    const [newUser, setNewUser] = useState<boolean>(false);

    return (
        <View className="flex-1 justify-center items-center">
            <Text className="font-bold font-serif text-5xl text-foreground">Routine</Text>
            <View className="w-full  max-w-96 rounded-xl">
                <View className="items-center shadow-sm shadow-current rounded-xl px-6 py-10 bg-background">
                {newUser ?
                    <SignUp /> :
                    <SignIn />
                }
                <View>
                    <TouchableOpacity onPress={() => setNewUser(!newUser)}>
                        <Text className="text-primary">{newUser ? "Click here to sign in" : "Click here to sign up"} </Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>

        </View>
    )
}

export default auth