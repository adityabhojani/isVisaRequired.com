import React, { useMemo } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { usePassport, type RecentLookup } from "@/context/PassportContext";
import { VisaStatusBadge } from "@/components/VisaStatusBadge";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SavedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { recentLookups, clearRecentLookups, selectedPassport } = usePassport();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleClear = () => {
    Alert.alert("Clear History", "Remove all recent lookups?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          clearRecentLookups();
        },
      },
    ]);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12,
      paddingHorizontal: 20,
      paddingBottom: 20,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    clearBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: colors.muted,
      borderRadius: 100,
    },
    clearBtnText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.destructive,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 14,
      backgroundColor: colors.background,
    },
    flags: {
      alignItems: "center",
      width: 44,
    },
    flagMain: { fontSize: 26 },
    flagSub: { fontSize: 14, marginTop: -4 },
    itemBody: { flex: 1 },
    itemRoute: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 5,
    },
    itemPassport: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    itemArrow: { marginHorizontal: 2 },
    itemDest: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    itemTime: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 74,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      gap: 12,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 20,
    },
  }), [colors, topPadding]);

  const renderItem = ({ item }: { item: RecentLookup }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({
        pathname: "/destination/[code]",
        params: { code: item.destinationCode, passport: item.passportCode },
      })}
    >
      <View style={styles.flags}>
        <Text style={styles.flagMain}>{item.destinationFlag}</Text>
        <Text style={styles.flagSub}>{item.passportFlag}</Text>
      </View>
      <View style={styles.itemBody}>
        <View style={styles.itemRoute}>
          <Text style={styles.itemPassport}>{item.passportName}</Text>
          <Ionicons style={styles.itemArrow} name="arrow-forward" size={11} color={colors.mutedForeground} />
          <Text style={styles.itemDest}>{item.destinationName}</Text>
        </View>
        <VisaStatusBadge requirement={item.requirement} size="sm" />
        <Text style={styles.itemTime}>{timeAgo(item.timestamp)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        {recentLookups.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Ionicons name="trash-outline" size={13} color={colors.destructive} />
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={recentLookups}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          recentLookups.length === 0 ? { flex: 1 } : {},
          { paddingBottom: Platform.OS === "web" ? 100 : 120 },
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyText}>
              Check a visa requirement and it will appear here
            </Text>
          </View>
        )}
      />
    </View>
  );
}
