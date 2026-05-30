import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { Country } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";

interface CountryPickerProps {
  countries: Country[];
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  excludeCode?: string;
}

export function CountryPicker({ countries, value, onChange, placeholder = "Select country", excludeCode }: CountryPickerProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  const selected = countries.find((c) => c.code === value);

  const filtered = useMemo(() => {
    const base = excludeCode ? countries.filter((c) => c.code !== excludeCode) : countries;
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [countries, query, excludeCode]);

  const handleSelect = useCallback((code: string) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  }, [onChange]);

  const styles = useMemo(() => StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
    },
    triggerFlag: {
      fontSize: 22,
    },
    triggerText: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: selected ? colors.foreground : colors.mutedForeground,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: insets.bottom + 8,
      maxHeight: "85%",
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 16,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.muted,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 12,
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
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      gap: 14,
    },
    itemFlag: {
      fontSize: 24,
    },
    itemName: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    itemCode: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 64,
    },
    selectedCheck: {
      marginLeft: 4,
    },
    emptyState: {
      padding: 40,
      alignItems: "center",
      gap: 8,
    },
    emptyText: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  }), [colors, insets, selected]);

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        {selected ? (
          <Text style={styles.triggerFlag}>{selected.flag}</Text>
        ) : (
          <Ionicons name="globe-outline" size={20} color={colors.mutedForeground} />
        )}
        <Text style={styles.triggerText}>{selected ? selected.name : placeholder}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <View style={styles.searchRow}>
              <Ionicons name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Search country..."
                placeholderTextColor={colors.mutedForeground}
                value={query}
                onChangeText={setQuery}
                autoFocus
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.code)}>
                  <Text style={styles.itemFlag}>{item.flag}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCode}>{item.code}</Text>
                  {item.code === value && (
                    <Ionicons
                      style={styles.selectedCheck}
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={32} color={colors.mutedForeground} />
                  <Text style={styles.emptyText}>No countries found</Text>
                </View>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
