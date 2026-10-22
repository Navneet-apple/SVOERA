import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { cacheAnime, catalog, Anime } from "../src/catalog";
import { isAniListEnabled, searchAnime } from "../src/anilist";
import { C } from "../src/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [remote, setRemote] = useState<Anime[] | null>(null);
  const [searchError, setSearchError] = useState("");
  useEffect(() => {
    if (!query.trim()) { setRemote(null); setSearchError(""); return; }
    if (!isAniListEnabled) { setRemote(null); setSearchError("Live AniList search is disabled until API use is approved for SVOERA."); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void searchAnime(query.trim(), controller.signal).then((items) => { cacheAnime(items); setRemote(items); setSearchError(""); }).catch((cause) => {
        if (!controller.signal.aborted) { setRemote([]); setSearchError(cause instanceof Error ? cause.message : "Search is unavailable."); }
      });
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  const results = useMemo(() => {
    const source = query.trim() ? (remote ?? catalog.filter((a) => `${a.title} ${a.alt ?? ""} ${a.genres.join(" ")}`.toLowerCase().includes(query.toLowerCase()))) : catalog;
    return source.filter((a) => !genre || a.genres.some((g) => g.toLowerCase() === genre.toLowerCase()));
  }, [query, genre, remote]);
  const genres = ["Action", "Fantasy", "Mystery", "Drama"];
  return <ScrollView style={s.screen} contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
    <Text style={s.eyebrow}>FIND YOUR NEXT WORLD</Text><TextInput autoFocus accessibilityLabel="Search anime titles" placeholder="Search titles, genres…" placeholderTextColor={C.muted} value={query} onChangeText={setQuery} style={s.input} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{genres.map((g) => <Pressable key={g} onPress={() => setGenre(genre === g ? "" : g)} style={[s.chip, genre === g && s.chipActive]}><Text style={[s.chipText, genre === g && { color: C.white }]}>{g}</Text></Pressable>)}</ScrollView>
    <Text style={s.heading}>{query ? `Results for “${query}”` : genre || "Popular searches"}<Text style={s.count}>  {results.length}</Text></Text>
    {results.map((a) => <Pressable key={a.id} onPress={() => router.push({ pathname: "/anime/[id]", params: { id: a.id } })} style={s.row}><View style={[s.thumb, { backgroundColor: a.colors[0] }]}>{a.image ? <Image source={{ uri: a.image }} resizeMode="cover" style={s.thumbImage} /> : <Text style={s.initial}>{a.initials}</Text>}</View><View style={{ flex: 1 }}><Text style={s.title}>{a.title}</Text><Text style={s.meta}>{a.year || "Year TBA"}  ·  {a.genres.join(" / ")}</Text><Text style={s.meta}>{a.status}  ·  {a.episodes || "TBA"} episodes</Text></View><Text style={s.chev}>›</Text></Pressable>)}
    {query.trim() && remote === null && <Text style={s.meta}>Searching AniList…</Text>}
    {!results.length && <View style={s.empty}><Text style={s.emptyTitle}>{searchError ? "AniList search unavailable" : "No titles found"}</Text><Text style={s.meta}>{searchError || "Try another title or clear the active genre."}</Text></View>}
    <Text style={s.disclaimer}>{!isAniListEnabled ? "Preview catalog · AniList live access requires approval" : query.trim() ? "Search results and artwork by AniList" : "AniList catalog · choose a title or search"}</Text>
  </ScrollView>;
}

const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: C.bg }, page: { padding: 20, paddingTop: 16, paddingBottom: 32 }, eyebrow: { color: C.red, fontSize: 10, letterSpacing: 1.7, fontWeight: "800", marginBottom: 12 }, input: { color: C.white, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 15, height: 52, fontSize: 15 }, chips: { gap: 8, paddingVertical: 16 }, chip: { paddingHorizontal: 13, paddingVertical: 8, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border }, chipActive: { backgroundColor: C.redDark, borderColor: C.red }, chipText: { color: C.silver, fontSize: 12, fontWeight: "600" }, heading: { color: C.white, fontSize: 18, fontWeight: "800", marginTop: 2, marginBottom: 12 }, count: { color: C.muted, fontSize: 12, fontWeight: "500" }, row: { minHeight: 84, padding: 10, flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: C.surface, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: C.border }, thumb: { width: 48, height: 62, borderRadius: 7, overflow: "hidden", alignItems: "center", justifyContent: "center" }, thumbImage: { width: "100%", height: "100%" }, initial: { color: "#FFFFFFCC", fontSize: 20, fontWeight: "300" }, title: { color: C.white, fontSize: 14, fontWeight: "700", marginBottom: 4 }, meta: { color: C.muted, fontSize: 11, marginTop: 2 }, chev: { color: C.muted, fontSize: 25, paddingHorizontal: 5 }, empty: { paddingVertical: 45, alignItems: "center", gap: 8 }, emptyTitle: { color: C.white, fontWeight: "800", fontSize: 17 }, disclaimer: { color: C.muted, fontSize: 10, marginTop: 16, textAlign: "center" } });
