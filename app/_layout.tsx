import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { WatchlistProvider } from "../src/state";
import { C } from "../src/theme";

export default function RootLayout() {
  return <WatchlistProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="anime/[id]" options={{ headerShown: true, title: "SVOERA", headerStyle: { backgroundColor: C.bg }, headerTintColor: C.white, headerShadowVisible: false }} /><Stack.Screen name="search" options={{ headerShown: true, title: "Search", headerStyle: { backgroundColor: C.bg }, headerTintColor: C.white, headerShadowVisible: false }} /><Stack.Screen name="watch" /><Stack.Screen name="browser/[provider]" /></Stack></WatchlistProvider>;
}
