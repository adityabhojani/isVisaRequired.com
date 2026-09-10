import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PassportProvider } from "@/context/PassportContext";

// API base URL. This MUST always be set in a native build: the shared client
// falls back to a RELATIVE url when no base is configured, which resolves fine
// in a browser but has no origin inside a React Native app - every request
// would fail. EXPO_PUBLIC_DOMAIN stays available for pointing a dev build at a
// tunnel, a preview deployment or a local server; production falls back to the
// live site. Local hosts get http because nothing is serving TLS there.
const API_DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "www.isvisarequired.com";
const API_SCHEME = /^(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+)(:|$)/.test(API_DOMAIN)
  ? "http"
  : "https";
setBaseUrl(`${API_SCHEME}://${API_DOMAIN}`);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="destination/[code]"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PassportProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </PassportProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
