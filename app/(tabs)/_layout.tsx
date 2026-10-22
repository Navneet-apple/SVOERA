import { Tabs } from "expo-router";
import { C } from "../../src/theme";

const symbols: Record<string, string> = { index: "⌂", schedule: "◷", library: "▤", downloads: "↓", profile: "◉" };
export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.red, tabBarInactiveTintColor: C.muted, tabBarStyle: { height: 66, paddingTop: 7, paddingBottom: 7, backgroundColor: C.surface, borderTopColor: C.border }, sceneStyle: { backgroundColor: C.bg }, tabBarLabelStyle: { fontSize: 10, fontWeight: "600" } }}>
    <Tabs.Screen name="index" options={{ title: "Home", tabBarLabel: "Home", tabBarIcon: ({ color }) => <TabGlyph text={symbols.index} color={color} /> }} />
    <Tabs.Screen name="schedule" options={{ title: "Schedule", tabBarIcon: ({ color }) => <TabGlyph text={symbols.schedule} color={color} /> }} />
    <Tabs.Screen name="library" options={{ title: "My List", tabBarIcon: ({ color }) => <TabGlyph text={symbols.library} color={color} /> }} />
    <Tabs.Screen name="downloads" options={{ title: "Download", tabBarIcon: ({ color }) => <TabGlyph text={symbols.downloads} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <TabGlyph text={symbols.profile} color={color} /> }} />
  </Tabs>;
}

import { Text } from "react-native";
function TabGlyph({ text, color }: { text: string; color: string }) { return <Text style={{ color, fontSize: 21, lineHeight: 24 }}>{text}</Text>; }
