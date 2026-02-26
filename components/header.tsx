import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { getFullDayDate, getGreeting, getIconName } from "@/lib/utils/dateTime";
import { useProfile } from "@/lib/api/profile";

export default function Header() {
  const { data: profile } = useProfile();
  const name = profile?.name;
  console.log(profile);

  const [greeting, setGreeting] = useState(getGreeting());
  const [formattedDate, setFormattedDate] = useState(getFullDayDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      setFormattedDate(getFullDayDate());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="gap-4">
      <Text className="text-foreground text-sm">{formattedDate}</Text>
      <Text className="text-foreground text-3xl">Today's Schedule</Text>
      <View className="flex-row gap-4">
        <View className="header-overview">
          <Text className="text-foreground text-2xl">2</Text>
          <Text className="text-foreground text-sm">Classes</Text>
        </View>
        <View className="header-overview">
          <Text className="text-foreground text-2xl">5H 30M</Text>
          <Text className="text-foreground text-sm">Total Time</Text>
        </View>
      </View>
    </View>
  );
}
