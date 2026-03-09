import { StyleSheet } from "react-native";

export const NEO_COLORS = {
  light: {
    bg: "#FFFFFF",
    shadowDark: "#D4D4D4",
    shadowLight: "#FFFFFF",
    inputBg: "#F5F5F5",
    primaryColor: "#DB1628",
    primaryDark: "#920E1A",
    primaryLight: "#F87171",
  },
  dark: {
    bg: "#0A0A0A",
    shadowDark: "#000000",
    shadowLight: "#262626",
    inputBg: "#171717",
    primaryColor: "#E8203A",
    primaryDark: "#7F0D18",
    primaryLight: "#F87171",
  },
};

export const getNeoStyles = (isDark: boolean) => {
  const c = isDark ? NEO_COLORS.dark : NEO_COLORS.light;

  return StyleSheet.create({
    raised: {
      shadowColor: c.shadowDark,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: isDark ? 0.85 : 0.9,
      shadowRadius: 10,
      elevation: 6,
      borderWidth: 1.5,
      borderTopColor: c.shadowLight,
      borderLeftColor: c.shadowLight,
      borderBottomColor: c.shadowDark,
      borderRightColor: c.shadowDark,
    },
    raisedSm: {
      shadowColor: c.shadowDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: isDark ? 0.85 : 0.9,
      shadowRadius: 7,
      elevation: 4,
      borderWidth: 1.5,
      borderTopColor: c.shadowLight,
      borderLeftColor: c.shadowLight,
      borderBottomColor: c.shadowDark,
      borderRightColor: c.shadowDark,
    },
    inset: {
      backgroundColor: c.inputBg,
      borderWidth: 1.5,
      borderTopColor: c.shadowDark,
      borderLeftColor: c.shadowDark,
      borderBottomColor: c.shadowLight,
      borderRightColor: c.shadowLight,
    },
    primaryRaised: {
      backgroundColor: c.primaryColor,
      shadowColor: c.primaryDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1.5,
      borderTopColor: c.primaryLight,
      borderLeftColor: c.primaryLight,
      borderBottomColor: c.primaryDark,
      borderRightColor: c.primaryDark,
    },
    destructiveRaised: {
      backgroundColor: isDark ? "#2A1515" : "#FDF0F0",
      borderWidth: 1.5,
      borderTopColor: isDark ? "#3D1F1F" : "#FFFFFF",
      borderLeftColor: isDark ? "#3D1F1F" : "#FFFFFF",
      borderBottomColor: isDark ? "#1A0A0A" : "#FFCDD2",
      borderRightColor: isDark ? "#1A0A0A" : "#FFCDD2",
    },
  });
};
