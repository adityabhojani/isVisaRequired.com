import React, { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  useListCountries,
  useCheckVisa,
  useGetVisaStats,
  useGetPopularDestinations,
  getCheckVisaQueryKey,
  getGetVisaStatsQueryKey,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { usePassport } from "@/context/PassportContext";
import { CountryPicker } from "@/components/CountryPicker";
import { VisaStatusBadge } from "@/components/VisaStatusBadge";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function CheckScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedPassport, setSelectedPassport, addRecentLookup } = usePassport();
  const [destination, setDestination] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const { data: countries = [], isLoading: countriesLoading } = useListCountries({});
  const { data: popularDests = [] } = useGetPopularDestinations({});

  const passportCountry = useMemo(() => countries.find((c) => c.code === selectedPassport), [countries, selectedPassport]);

  const {
    data: visaResult,
    isFetching: visaFetching,
    error: visaError,
    refetch,
  } = useCheckVisa(
    { passport: selectedPassport, destination },
    { query: { enabled: !!destination && !!selectedPassport && hasChecked, queryKey: getCheckVisaQueryKey({ passport: selectedPassport, destination }) } }
  );

  // Only show loading state when we've actually triggered a check
  const visaLoading = visaFetching && hasChecked;

  const { data: passportStats } = useGetVisaStats(
    { passport: selectedPassport },
    { query: { enabled: !!selectedPassport, queryKey: getGetVisaStatsQueryKey({ passport: selectedPassport }) } }
  );

  const handleCheck = () => {
    if (!destination || !selectedPassport) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHasChecked(true);
    refetch();
  };

  const handleDestinationChange = (code: string) => {
    setDestination(code);
    setHasChecked(false);
  };

  const handleViewDestination = () => {
    if (!visaResult) return;
    addRecentLookup({
      passportCode: selectedPassport,
      passportName: passportCountry?.name ?? "",
      passportFlag: passportCountry?.flag ?? "",
      destinationCode: destination,
      destinationName: visaResult.destinationCountry.name,
      destinationFlag: visaResult.destinationCountry.flag,
      requirement: visaResult.requirement,
    });
    router.push({
      pathname: "/destination/[code]",
      params: { code: destination, passport: selectedPassport },
    });
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    headerSub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.75)",
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 18,
    },
    statChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 100,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 6,
    },
    statChipText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    body: { padding: 20, gap: 16 },
    section: { gap: 8 },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 2,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    checkBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    checkBtnDisabled: { opacity: 0.5 },
    checkBtnText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    countryFlag: { fontSize: 32 },
    resultHeaderText: { flex: 1 },
    resultCountryName: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    resultRegion: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    resultBody: { padding: 18, gap: 14 },
    resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    resultLabel: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    resultValue: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    notesText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    detailBtn: {
      margin: 18,
      marginTop: 4,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: 13,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    detailBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    popularSection: { gap: 12 },
    popularTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    popularGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    popularChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 100,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    popularChipFlag: { fontSize: 18 },
    popularChipText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    passportChangeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    changeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 100,
    },
    changeBtnText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: "#FFFFFF",
    },
    passportPickerContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    passportPickerLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  }), [colors, topPadding]);

  const [showPassportPicker, setShowPassportPicker] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 120 }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.passportChangeRow}>
          <Text style={styles.headerTitle}>Visa Check</Text>
          <TouchableOpacity style={styles.changeBtn} onPress={() => setShowPassportPicker(!showPassportPicker)}>
            <Ionicons name="swap-horizontal" size={12} color="#FFFFFF" />
            <Text style={styles.changeBtnText}>Passport</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSub}>
          {passportCountry ? `${passportCountry.flag} ${passportCountry.name} passport` : "Select your passport"}
        </Text>
        {passportStats && (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="checkmark-circle" size={12} color="#4ADE80" />
              <Text style={styles.statChipText}>{passportStats.visaFree} visa-free</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="trending-up" size={12} color="#FCD34D" />
              <Text style={styles.statChipText}>Rank #{passportStats.powerRank}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {showPassportPicker && (
          <View style={styles.passportPickerContainer}>
            <Text style={styles.passportPickerLabel}>Your Passport</Text>
            <CountryPicker
              countries={countries}
              value={selectedPassport}
              onChange={(code) => {
                setSelectedPassport(code);
                setShowPassportPicker(false);
                setHasChecked(false);
              }}
              placeholder="Select passport country"
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Destination</Text>
          <View style={styles.card}>
            <CountryPicker
              countries={countries}
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Where are you going?"
              excludeCode={selectedPassport}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkBtn, (!destination || !selectedPassport) && styles.checkBtnDisabled]}
          onPress={handleCheck}
          disabled={!destination || !selectedPassport || visaLoading}
        >
          <Ionicons name="search" size={18} color="#FFFFFF" />
          <Text style={styles.checkBtnText}>
            {visaLoading ? "Checking..." : "Check Visa Requirements"}
          </Text>
        </TouchableOpacity>

        {visaLoading && <SkeletonCard />}

        {visaError && hasChecked && (
          <View style={[styles.card, { alignItems: "center", gap: 8 }]}>
            <Ionicons name="warning-outline" size={28} color={colors.destructive} />
            <Text style={{ color: colors.destructive, fontFamily: "Inter_500Medium", fontSize: 14 }}>
              Failed to check visa requirements
            </Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {visaResult && !visaLoading && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.countryFlag}>{visaResult.destinationCountry.flag}</Text>
              <View style={styles.resultHeaderText}>
                <Text style={styles.resultCountryName}>{visaResult.destinationCountry.name}</Text>
                <Text style={styles.resultRegion}>{visaResult.destinationCountry.region}</Text>
              </View>
              <VisaStatusBadge requirement={visaResult.requirement} size="sm" />
            </View>

            <View style={styles.resultBody}>
              <VisaStatusBadge requirement={visaResult.requirement} size="lg" />

              {visaResult.maxStay && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Max Stay</Text>
                  <Text style={styles.resultValue}>{visaResult.maxStay}</Text>
                </View>
              )}

              {visaResult.notes && (
                <Text style={styles.notesText}>{visaResult.notes}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.detailBtn} onPress={handleViewDestination}>
              <Text style={styles.detailBtnText}>View Full Details</Text>
              <Ionicons name="arrow-forward" size={15} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {!visaResult && !visaLoading && popularDests.length > 0 && (
          <View style={styles.popularSection}>
            <Text style={styles.popularTitle}>Popular Destinations</Text>
            <View style={styles.popularGrid}>
              {popularDests.slice(0, 12).map((dest) => (
                <TouchableOpacity
                  key={dest.code}
                  style={styles.popularChip}
                  onPress={() => {
                    handleDestinationChange(dest.code);
                  }}
                >
                  <Text style={styles.popularChipFlag}>{dest.flag}</Text>
                  <Text style={styles.popularChipText}>{dest.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
