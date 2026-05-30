import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export type VisaRequirement = "visa_free" | "visa_on_arrival" | "e_visa" | "visa_required" | "no_admission";

interface Config {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  colorKey: keyof ReturnType<typeof useColors>;
}

const CONFIG: Record<VisaRequirement, Config> = {
  visa_free: { label: "Visa Free", iconName: "checkmark-circle", colorKey: "visaFree" },
  visa_on_arrival: { label: "Visa on Arrival", iconName: "time", colorKey: "visaOnArrival" },
  e_visa: { label: "eVisa", iconName: "shield-checkmark", colorKey: "eVisa" },
  visa_required: { label: "Visa Required", iconName: "alert-circle", colorKey: "visaRequired" },
  no_admission: { label: "No Admission", iconName: "close-circle", colorKey: "noAdmission" },
};

interface Props {
  requirement: VisaRequirement | string;
  size?: "sm" | "md" | "lg";
}

export function VisaStatusBadge({ requirement, size = "md" }: Props) {
  const colors = useColors();
  const config = CONFIG[requirement as VisaRequirement] ?? {
    label: requirement,
    iconName: "help-circle" as keyof typeof Ionicons.glyphMap,
    colorKey: "mutedForeground" as keyof ReturnType<typeof useColors>,
  };

  const color = colors[config.colorKey as keyof typeof colors] as string;

  const paddingV = size === "sm" ? 4 : size === "lg" ? 10 : 7;
  const paddingH = size === "sm" ? 8 : size === "lg" ? 16 : 12;
  const fontSize = size === "sm" ? 11 : size === "lg" ? 15 : 13;
  const iconSize = size === "sm" ? 12 : size === "lg" ? 18 : 15;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}18`,
          borderColor: `${color}40`,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
        },
      ]}
    >
      <Ionicons name={config.iconName} size={iconSize} color={color} />
      <Text style={[styles.label, { color, fontSize }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 100,
    gap: 5,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
  },
});
