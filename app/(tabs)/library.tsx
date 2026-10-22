import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getCatalog } from "../../src/catalog";
import { Status, useWatchlist } from "../../src/state";
import { C } from "../../src/theme";
import { Poster } from "../../src/ui";

const statuses: Status[] = ["Watching", "Plan to Watch", "Completed", "On-Hold", "Dropped"];
export default function LibraryScreen() {
  const { entries, setStatus } = useWatchlist(); const [active, setActive] = useState<Status>("Watching");
  const items = useMemo(() => getCatalog().filter((a) => entries[a.id] === active), [entries, active]);
  return <ScrollView style={s.screen} contentContainerStyle={s.page}><Text style={s.kicker}>YOUR PERSONAL LIBRARY</Text><Text style={s.heading}>My List</Text><Text style={s.sub}>Your anime, your pace.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>{statuses.map((status) => <Pressable onPress={() => setActive(status)} key={status} style={[s.tab, active === status && s.selected]}><Text style={[s.tabText, active === status && s.selectedText]}>{status}</Text></Pressable>)}</ScrollView>
    <Text style={s.count}>{items.length} {active.toLowerCase()} {items.length === 1 ? "title" : "titles"}</Text>
    {items.length ? <View style={s.grid}>{items.map((a) => <View key={a.id}><Poster anime={a} width={((globalThis as any).innerWidth ?? 390) / 2 - 28} onPress={() => router.push({ pathname: "/anime/[id]", params: { id: a.id } })} /><Pressable onPress={() => setStatus(a.id)} style={s.remove}><Text style={s.removeText}>Remove from list</Text></Pressable></View>)}</View> : <View style={s.empty}><Text style={s.emptyGlyph}>＋</Text><Text style={s.emptyTitle}>Nothing here yet</Text><Text style={s.emptySub}>Add anime from Home or Search to build this collection.</Text><Pressable onPress={() => router.push("/search")} style={s.button}><Text style={s.buttonText}>Explore anime</Text></Pressable></View>}
  </ScrollView>;
}
const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: C.bg }, page: { paddingTop: 22, paddingBottom: 28 }, kicker: { color: C.red, paddingHorizontal: 20, fontSize: 10, letterSpacing: 1.6, fontWeight: "800" }, heading: { color: C.white, fontSize: 30, fontWeight: "900", paddingHorizontal: 20, marginTop: 5 }, sub: { color: C.muted, fontSize: 13, paddingHorizontal: 20, marginTop: 4 }, tabs: { gap: 8, paddingHorizontal: 20, paddingVertical: 19 }, tab: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }, selected: { backgroundColor: C.redDark, borderColor: C.red }, tabText: { color: C.silver, fontSize: 11, fontWeight: "600" }, selectedText: { color: C.white }, count: { color: C.muted, fontSize: 11, paddingHorizontal: 20, marginBottom: 12 }, grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, justifyContent: "space-between" }, remove: { marginTop: -6, marginBottom: 16 }, removeText: { color: C.muted, fontSize: 10 }, empty: { margin: 20, marginTop: 35, padding: 25, borderRadius: 16, alignItems: "center", backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }, emptyGlyph: { fontSize: 31, color: C.red, marginBottom: 6 }, emptyTitle: { color: C.white, fontWeight: "800", fontSize: 18 }, emptySub: { color: C.muted, textAlign: "center", lineHeight: 20, marginTop: 8, fontSize: 12 }, button: { marginTop: 16, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.red }, buttonText: { color: C.white, fontWeight: "800", fontSize: 12 } });
