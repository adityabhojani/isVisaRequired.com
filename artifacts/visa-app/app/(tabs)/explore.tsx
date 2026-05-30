import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { VisaRequirement } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { usePassport } from "@/context/PassportContext";
import { Skeleton } from "@/components/SkeletonCard";

const REGIONS = ["All", "Europe", "Asia", "Americas", "Africa", "Oceania"];

const REQ_DOT: Record<VisaRequirement, { color: string; label: string }> = {
  visa_free:       { color: "#22c55e", label: "Visa Free" },
  visa_on_arrival: { color: "#f59e0b", label: "On Arrival" },
  e_visa:          { color: "#3b82f6", label: "eVisa" },
  visa_required:   { color: "#f97316", label: "Visa Req." },
  no_admission:    { color: "#ef4444", label: "No Entry" },
};

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedPassport } = usePassport();
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const { data: countries = [], isLoading } = useListCountries({});
  const { data: allVisaResults = [] } = useCheckVisaAll(
    { passport: selectedPassport },
    { query: { enabled: !!selectedPassport, staleTime: 5 * 60 * 1000, queryKey: getCheckVisaAllQueryKey({ passport: selectedPassport }) } }
  );

  const visaMap = useMemo(() => {
    const map: Record<string, VisaRequirement> = {};
    allVisaResults.forEach((r) => {
      map[r.destinationCountry.code] = r.requirement as VisaRequirement;
    });
    return map;
  }, [allVisaResults]);

  const filtered = useMemo(() => {
    let list = countries;
    if (selectedRegion !== "All") list = list.filter((c) => c.region === selectedRegion);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }
    return list;
  }, [countries, query, selectedRegion]);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    title: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.muted,
      borderRadius: 12,
      paddingHorizontal: 12,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      paddingVertical: Platform.OS === "ios" ? 12 : 10,
    },
    regionList: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
    },
    regionChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    regionChipText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    countItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      gap: 14,
      backgroundColor: colors.background,
    },
    flagCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    flagText: { fontSize: 24 },
    countryInfo: { flex: 1 },
    countryName: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    countryRegion: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 1,
    },
    reqBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 100,
    },
    reqDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    reqLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
    },
    countryCode: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      backgroundColor: colors.muted,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 6,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 78,
    },
    countLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    loadingContainer: { padding: 20, gap: 12 },
    legendRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  }), [colors, topPadding]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search countries..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        ListHeaderComponent={() => (
          <>
            <FlatList
              horizontal
              data={REGIONS}
              keyExtractor={(r) => r}
              contentContainerStyle={styles.regionList}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: region }) => {
                const active = region === selectedRegion;
                return (
                  <TouchableOpacity
                    style={[
                      styles.regionChip,
                      {
                        backgroundColor: active ? colors.primary : colors.card,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedRegion(region)}
                  >
                    <Text
                      style={[
                        styles.regionChipText,
                        { color: active ? "#FFFFFF" : colors.foreground },
                      ]}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            {allVisaResults.length > 0 && (
              <View style={styles.legendRow}>
                {Object.entries(REQ_DOT).map(([key, { color, label }]) => (
                  <View key={key} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: color }]} />
                    <Text style={styles.legendText}>{label}</Text>
                  </View>
                ))}
              </View>
            )}
            {isLoading && (
              <View style={styles.loadingContainer}>
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} width="100%" height={56} borderRadius={8} />
                ))}
              </View>
            )}
            {!isLoading && (
              <Text style={styles.countLabel}>{filtered.length} countries</Text>
            )}
          </>
        )}
        renderItem={({ item }) => {
          const req = visaMap[item.code] as VisaRequirement | undefined;
          const reqConfig = req ? REQ_DOT[req] : null;
          return (
            <TouchableOpacity
              style={styles.countItem}
              onPress={() => router.push({
                pathname: "/destination/[code]",
                params: { code: item.code, passport: selectedPassport },
              })}
            >
              <View style={styles.flagCircle}>
                <Text style={styles.flagText}>{item.flag}</Text>
              </View>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{item.name}</Text>
                <Text style={styles.countryRegion}>{item.region}</Text>
              </View>
              {reqConfig ? (
                <View style={[styles.reqBadge, { backgroundColor: `${reqConfig.color}18` }]}>
                  <View style={[styles.reqDot, { backgroundColor: reqConfig.color }]} />
                  <Text style={[styles.reqLabel, { color: reqConfig.color }]}>{reqConfig.label}</Text>
                </View>
              ) : (
                <Text style={styles.countryCode}>{item.code}</Text>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 120 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
