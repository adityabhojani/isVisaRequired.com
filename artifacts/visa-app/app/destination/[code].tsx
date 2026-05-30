import React, { useMemo } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGetDestinationInfo, getGetDestinationInfoQueryKey } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { VisaStatusBadge } from "@/components/VisaStatusBadge";
import { Skeleton } from "@/components/SkeletonCard";

export default function DestinationScreen() {
  const { code, passport } = useLocalSearchParams<{ code: string; passport: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const passportCode = passport ?? "US";

  const { data, isLoading, error, refetch } = useGetDestinationInfo(
    { passport: passportCode, destination: code ?? "" },
    { query: { enabled: !!code && !!passportCode, queryKey: getGetDestinationInfoQueryKey({ passport: passportCode, destination: code ?? "" }) } }
  );

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    body: { padding: 20, gap: 20, paddingBottom: Platform.OS === "web" ? 60 : 40 },
    heroCard: {
      borderRadius: 20,
      padding: 22,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    heroFlag: { fontSize: 52 },
    heroInfo: { flex: 1 },
    heroName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    heroRegion: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      marginBottom: 10,
    },
    section: { gap: 12 },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 14,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },
    rowLabel: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      flex: 1,
    },
    rowValue: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      flex: 2,
      textAlign: "right",
    },
    divider: { height: 1, backgroundColor: colors.border },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    infoIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    infoLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    infoValue: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    docItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      paddingVertical: 3,
    },
    docText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 19,
    },
    stepItem: {
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
    },
    stepNum: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    stepNumText: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    stepText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 19,
      paddingTop: 3,
    },
    applyBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    applyBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    attractionCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    attractionIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    attractionBody: { flex: 1 },
    attractionName: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 3,
    },
    attractionDesc: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 17,
    },
    attractionDuration: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 5,
    },
    attractionDurationText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    notesCard: {
      backgroundColor: `${colors.accent}12`,
      borderRadius: 12,
      padding: 14,
      flexDirection: "row",
      gap: 10,
      borderWidth: 1,
      borderColor: `${colors.accent}30`,
    },
    notesText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 19,
    },
    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      gap: 12,
    },
    errorText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textAlign: "center",
    },
  }), [colors, insets]);

  const attractionIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    landmark: "business",
    nature: "leaf",
    museum: "library",
    beach: "sunny",
    city: "grid",
    heritage: "home",
    temple: "star",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {data ? data.destinationCountry.name : code}
        </Text>
      </View>

      {isLoading ? (
        <ScrollView contentContainerStyle={styles.body}>
          <Skeleton width="100%" height={120} borderRadius={20} />
          <View style={{ gap: 10 }}>
            {[...Array(4)].map((_, i) => <Skeleton key={i} height={56} />)}
          </View>
        </ScrollView>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={36} color={colors.mutedForeground} />
          <Text style={styles.errorText}>Could not load destination info</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : data ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <Text style={styles.heroFlag}>{data.destinationCountry.flag}</Text>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{data.destinationCountry.name}</Text>
              <Text style={styles.heroRegion}>{data.destinationCountry.region}</Text>
              <VisaStatusBadge requirement={data.requirement} size="md" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entry Requirements</Text>
            <View style={styles.card}>
              {data.maxStay && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Max Stay</Text>
                    <Text style={styles.rowValue}>{data.maxStay}</Text>
                  </View>
                  <View style={styles.divider} />
                </>
              )}
              {data.visaDetail.feeUSD !== null && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Visa Fee</Text>
                    <Text style={styles.rowValue}>
                      {data.visaDetail.feeUSD === 0 ? "Free" : `$${data.visaDetail.feeUSD} USD`}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                </>
              )}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Processing</Text>
                <Text style={styles.rowValue}>{data.visaDetail.processingDays}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Max Stay</Text>
                <Text style={styles.rowValue}>{data.visaDetail.maxStay}</Text>
              </View>
            </View>
          </View>

          {data.visaDetail.documents.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Required Documents</Text>
              <View style={styles.card}>
                {data.visaDetail.documents.map((doc, i) => (
                  <View key={i} style={styles.docItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.visaFree} />
                    <Text style={styles.docText}>{doc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {data.visaDetail.process.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Application Process</Text>
              <View style={styles.card}>
                {data.visaDetail.process.map((step, i) => (
                  <View key={i} style={styles.stepItem}>
                    <View style={styles.stepNum}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {data.visaDetail.notes && (
            <View style={styles.notesCard}>
              <Ionicons name="information-circle" size={20} color={colors.accent} />
              <Text style={styles.notesText}>{data.visaDetail.notes}</Text>
            </View>
          )}

          {data.officialLinks?.visaPortal && (
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => Linking.openURL(data.officialLinks!.visaPortal)}
            >
              <Ionicons name="open-outline" size={18} color="#FFFFFF" />
              <Text style={styles.applyBtnText}>Apply for Visa</Text>
            </TouchableOpacity>
          )}

          {data.touristInfo && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About {data.destinationCountry.name}</Text>
                <View style={styles.card}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="business" size={16} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Capital</Text>
                      <Text style={styles.infoValue}>{data.touristInfo.capital}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="cash" size={16} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Currency</Text>
                      <Text style={styles.infoValue}>{data.touristInfo.currency}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="chatbubble" size={16} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Language</Text>
                      <Text style={styles.infoValue}>{data.touristInfo.language}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="sunny" size={16} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Best Time to Visit</Text>
                      <Text style={styles.infoValue}>{data.touristInfo.bestTimeToVisit}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {data.touristInfo.attractions.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Top Attractions</Text>
                  {data.touristInfo.attractions.slice(0, 6).map((a, i) => (
                    <View key={i} style={styles.attractionCard}>
                      <View style={styles.attractionIcon}>
                        <Ionicons
                          name={attractionIcons[a.type] ?? "star"}
                          size={18}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.attractionBody}>
                        <Text style={styles.attractionName}>{a.name}</Text>
                        <Text style={styles.attractionDesc} numberOfLines={2}>{a.description}</Text>
                        <View style={styles.attractionDuration}>
                          <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
                          <Text style={styles.attractionDurationText}>{a.visitDuration}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      ) : null}
    </View>
  );
}
