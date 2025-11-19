import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export default function Header() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name;

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }

  function getIconName() {
    const h = new Date().getHours();
    if (h < 12) return "sunny";
    if (h < 17) return "partly-sunny";
    return "moon";
  }

  function getFormattedDate() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const [greeting, setGreeting] = useState(getGreeting());
  const [formattedDate, setFormattedDate] = useState(getFormattedDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      setFormattedDate(getFormattedDate());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="bg-primary p-5">
      <View className="flex-row items-start justify-between">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name={getIconName()} size={18} className="text-white" />
            <Text className="text-white text-sm">{greeting}</Text>
          </View>
          <Text className="text-white text-2xl font-semibold">{name}</Text>
          <Text className="text-white">{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}