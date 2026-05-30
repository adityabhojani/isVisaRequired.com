import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface RecentLookup {
  id: string;
  passportCode: string;
  passportName: string;
  passportFlag: string;
  destinationCode: string;
  destinationName: string;
  destinationFlag: string;
  requirement: string;
  timestamp: number;
}

interface PassportContextType {
  selectedPassport: string;
  setSelectedPassport: (code: string) => void;
  recentLookups: RecentLookup[];
  addRecentLookup: (lookup: Omit<RecentLookup, "id" | "timestamp">) => void;
  clearRecentLookups: () => void;
}

const PassportContext = createContext<PassportContextType>({
  selectedPassport: "US",
  setSelectedPassport: () => {},
  recentLookups: [],
  addRecentLookup: () => {},
  clearRecentLookups: () => {},
});

const PASSPORT_KEY = "selected_passport";
const RECENT_KEY = "recent_lookups";
const MAX_RECENT = 30;

export function PassportProvider({ children }: { children: React.ReactNode }) {
  const [selectedPassport, setSelectedPassportState] = useState<string>("US");
  const [recentLookups, setRecentLookups] = useState<RecentLookup[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [savedPassport, savedRecent] = await Promise.all([
          AsyncStorage.getItem(PASSPORT_KEY),
          AsyncStorage.getItem(RECENT_KEY),
        ]);
        if (savedPassport) setSelectedPassportState(savedPassport);
        if (savedRecent) setRecentLookups(JSON.parse(savedRecent));
      } catch {}
    })();
  }, []);

  const setSelectedPassport = useCallback(async (code: string) => {
    setSelectedPassportState(code);
    try { await AsyncStorage.setItem(PASSPORT_KEY, code); } catch {}
  }, []);

  const addRecentLookup = useCallback(async (lookup: Omit<RecentLookup, "id" | "timestamp">) => {
    const newEntry: RecentLookup = {
      ...lookup,
      id: `${lookup.passportCode}-${lookup.destinationCode}-${Date.now()}`,
      timestamp: Date.now(),
    };
    setRecentLookups((prev) => {
      const filtered = prev.filter(
        (l) => !(l.passportCode === lookup.passportCode && l.destinationCode === lookup.destinationCode)
      );
      const updated = [newEntry, ...filtered].slice(0, MAX_RECENT);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const clearRecentLookups = useCallback(async () => {
    setRecentLookups([]);
    try { await AsyncStorage.removeItem(RECENT_KEY); } catch {}
  }, []);

  return (
    <PassportContext.Provider
      value={{ selectedPassport, setSelectedPassport, recentLookups, addRecentLookup, clearRecentLookups }}
    >
      {children}
    </PassportContext.Provider>
  );
}

export const usePassport = () => useContext(PassportContext);
