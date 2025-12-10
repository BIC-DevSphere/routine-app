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
    <View className="bg-primary py-10 px-5">
      <View className="flex-row items-start justify-between">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name={getIconName()} size={18} style={{color: '#fff'}} />
            <Text className="text-white text">{greeting}</Text>
          </View>
          <Text className="text-white text-3xl font-medium">{name}</Text>
          <Text className="text-white text-sm">{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}