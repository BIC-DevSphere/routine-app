import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { getFullDayDate, getGreeting, getIconName } from "@/lib/utils/dateTime";
import { useProfile } from "@/lib/api/profile";

export default function Header() {
  const { data: profile } = useProfile();
  const name = profile?.name;

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
    <View className="bg-primary p-5">
      <View className="flex-row items-start justify-between">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name={getIconName()} size={18} style={{color: '#fff'}} />
            <Text className="text-white text-sm">{greeting}</Text>
          </View>
          <Text className="text-white text-2xl font-semibold">{name}</Text>
          <Text className="text-white">{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}