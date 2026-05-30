import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useListCountries, useGetVisaStats, getGetVisaStatsQueryKey } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { usePassport } from "@/context/PassportContext";
import { CountryPicker } from "@/components/CountryPicker";
import { Skeleton } from "@/components/SkeletonCard";

interface StatCardProps {
  value: number;
  label: string;
  colorKey: string;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
}

function StatCard({ value, label, colorKey, icon }: StatCardProps) {
  const colors = useColors();
  const color = colors[colorKey as keyof typeof colors] as string;
  return (
    <View style={[statStyles.card, { backgroundColor: `${color}12`, borderColor: `${color}25` }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    minWidth: "22%",
  },
  value: { fontSize: 22, fontFamily: "Inter_700Bold" },
  label: { fontSize: 10, fontFamily: "Inter_500Medium", textAlign: "center" },
});

const TIER_CONFIG = [
  { key: "S", minScore: 150, label: "S — Elite", description: "Visa-free to nearly everywhere" },
  { key: "A", minScore: 120, label: "A — Strong", description: "Easy access to most countries" },
  { key: "B", minScore: 90, label: "B — Good", description: "Good international mobility" },
  { key: "C", minScore: 60, label: "C — Average", description: "Standard travel options" },
  { key: "D", minScore: 0, label: "D — Restricted", description: "Many visa requirements apply" },
];

function getPassportTier(visaFree: number): typeof TIER_CONFIG[0] {
  return TIER_CONFIG.find((t) => visaFree >= t.minScore) ?? TIER_CONFIG[TIER_CONFIG.length - 1];
}

export default function PassportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedPassport, setSelectedPassport } = usePassport();
  const [showPicker, setShowPicker] = useState(false);

  const { data: countries = [], isLoading: countriesLoading } = useListCountries({});
  const { data: stats, isLoading: statsLoading } = useGetVisaStats(
    { passport: selectedPassport },
    { query: { enabled: !!selectedPassport, queryKey: getGetVisaStatsQueryKey({ passport: selectedPassport }) } }
  );

  const passportCountry = useMemo(
    () => countries.find((c) => c.code === selectedPassport),
    [countries, selectedPassport]
  );

  const tier = useMemo(() => {
    if (!stats) return null;
    return getPassportTier(stats.visaFree);
  }, [stats]);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    body: {
      padding: 20,
      gap: 20,
      paddingBottom: Platform.OS === "web" ? 100 : 120,
    },
    heroCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 24,
      gap: 16,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    heroLeft: { gap: 4 },
    heroLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "rgba(255,255,255,0.7)",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    heroCountry: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    heroFlag: { fontSize: 52 },
    heroRankRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    heroRankBadge: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    heroRankNum: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    heroRankLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.7)",
    },
    tierBadge: {
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      gap: 2,
    },
    tierKey: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    tierLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.7)",
    },
    changeBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 12,
      paddingVertical: 12,
    },
    changeBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    sectionTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    pickerCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    pickerLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.muted,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    progressRow: { gap: 8 },
    progressLabel: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    progressText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    progressCount: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
    },
    header: {
      paddingTop: topPadding + 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
  }), [colors, topPadding]);

  const progressItems = stats ? [
    { label: "Visa Free", count: stats.visaFree, color: colors.visaFree },
    { label: "Visa on Arrival", count: stats.visaOnArrival, color: colors.visaOnArrival },
    { label: "eVisa", count: stats.eVisa, color: colors.eVisa },
    { label: "Visa Required", count: stats.visaRequired, color: colors.visaRequired },
    { label: "No Admission", count: stats.noAdmission, color: colors.noAdmission },
  ] : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Passport</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
      >
        {showPicker || !selectedPassport ? (
          <View style={styles.pickerCard}>
            {!selectedPassport && !showPicker && (
              <View style={{ alignItems: "center", paddingVertical: 8, gap: 8 }}>
                <Text style={{ fontSize: 40 }}>🛂</Text>
                <Text style={[styles.sectionTitle, { textAlign: "center", marginBottom: 0 }]}>
                  Select your passport
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center" }}>
                  Choose your passport country to see your power rank, tier, and travel access breakdown.
                </Text>
              </View>
            )}
            <Text style={styles.pickerLabel}>Passport Country</Text>
            <CountryPicker
              countries={countries}
              value={selectedPassport}
              onChange={(code) => {
                setSelectedPassport(code);
                setShowPicker(false);
              }}
              placeholder="Select your passport"
            />
          </View>
        ) : (
          <>
            {passportCountry && (
              <View style={styles.heroCard}>
                <View style={styles.heroTop}>
                  <View style={styles.heroLeft}>
                    <Text style={styles.heroLabel}>Your Passport</Text>
                    <Text style={styles.heroCountry}>{passportCountry.name}</Text>
                  </View>
                  <Text style={styles.heroFlag}>{passportCountry.flag}</Text>
                </View>

                {stats && tier ? (
                  <View style={styles.heroRankRow}>
                    <View style={styles.heroRankBadge}>
                      <Text style={styles.heroRankNum}>#{stats.powerRank}</Text>
                      <Text style={styles.heroRankLabel}>Global Rank</Text>
                    </View>
                    <View style={[styles.tierBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                      <Text style={styles.tierKey}>{tier.key}</Text>
                      <Text style={styles.tierLabel}>Tier</Text>
                    </View>
                  </View>
                ) : statsLoading ? (
                  <View style={{ gap: 8 }}>
                    <Skeleton width={120} height={20} />
                    <Skeleton width={80} height={14} />
                  </View>
                ) : null}

                <TouchableOpacity style={styles.changeBtn} onPress={() => setShowPicker(true)}>
                  <Ionicons name="swap-horizontal" size={16} color="#FFFFFF" />
                  <Text style={styles.changeBtnText}>Change Passport</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {stats && !statsLoading ? (
          <>
            <Text style={styles.sectionTitle}>Access Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard value={stats.visaFree} label="Visa Free" colorKey="visaFree" icon="checkmark-circle" />
              <StatCard value={stats.visaOnArrival} label="On Arrival" colorKey="visaOnArrival" icon="time" />
              <StatCard value={stats.eVisa} label="eVisa" colorKey="eVisa" icon="shield-checkmark" />
              <StatCard value={stats.visaRequired} label="Visa Req." colorKey="visaRequired" icon="alert-circle" />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Breakdown</Text>
            <View style={{ gap: 14 }}>
              {progressItems.map((item) => (
                <View key={item.label} style={styles.progressRow}>
                  <View style={styles.progressLabel}>
                    <Text style={styles.progressText}>{item.label}</Text>
                    <Text style={styles.progressCount}>{item.count} / {stats.total}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.round((item.count / stats.total) * 100)}%` as `${number}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : statsLoading ? (
          <View style={{ gap: 12 }}>
            {[...Array(4)].map((_, i) => <Skeleton key={i} height={56} />)}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
