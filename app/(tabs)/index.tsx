import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { cacheAnime, catalog } from "../../src/catalog";
import { fetchHomeCatalog, isAniListEnabled } from "../../src/anilist";
import { useWatchlist } from "../../src/state";
import { C } from "../../src/theme";
import { Poster, SectionTitle, Wordmark } from "../../src/ui";

const open = (id: string) => router.push({ pathname: "/anime/[id]", params: { id } });
export default function HomeScreen() {
  const [live, setLive] = useState<Awaited<ReturnType<typeof fetchHomeCatalog>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { entries, setStatus } = useWatchlist();
  const loadCatalog = useCallback(async (signal?: AbortSignal) => {
    if (!isAniListEnabled) { setLoading(false); setError("AniList use in this anime tracking app needs approval before live requests are enabled."); return; }
    setLoading(true); setError("");
    try { const result = await fetchHomeCatalog(signal); cacheAnime(result.all); setLive(result); }
    catch (cause) { if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "Could not reach AniList."); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, []);
  useEffect(() => { const controller = new AbortController(); void loadCatalog(controller.signal); return () => controller.abort(); }, [loadCatalog]);
  const featured = live?.trending[0] || catalog[0];
  const heroArtwork = featured.banner || featured.image;
  const airing = live?.airing ?? catalog.filter((item) => item.status === "Airing");
  const trending = live?.trending ?? catalog;
  const popular = live?.popular ?? catalog;
  const upcoming = live?.upcoming ?? catalog.filter((item) => item.status === "Upcoming");
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><Wordmark /><Pressable accessibilityRole="button" accessibilityLabel="Search anime" onPress={() => router.push("/search")} style={styles.search}><Text style={styles.searchIcon}>⌕</Text></Pressable></View>
    <Pressable onPress={() => open(featured.id)} style={styles.hero}>
      {heroArtwork ? <Image source={{ uri: heroArtwork }} resizeMode="cover" style={StyleSheet.absoluteFillObject} /> : <View style={styles.heroOrb} />}<View style={styles.heroOrbit} /><View style={styles.heroShade} />
      <View style={styles.heroCopy}><Text style={styles.kicker}>SVOERA SPOTLIGHT  /  TRENDING</Text><Text numberOfLines={2} style={styles.heroTitle}>{featured.title.toUpperCase()}</Text><Text style={styles.heroMeta}>{[...featured.genres.slice(0, 2), featured.year || "YEAR TBA"].join("  ·  ").toUpperCase()}</Text><Text numberOfLines={2} style={styles.heroSynopsis}>{featured.synopsis}</Text>
        <View style={styles.heroButtons}><Pressable onPress={() => open(featured.id)} style={styles.primary}><Text style={styles.primaryText}>View title  ›</Text></Pressable><Pressable onPress={() => entries[featured.id] ? open(featured.id) : setStatus(featured.id, "Plan to Watch")} style={styles.secondary}><Text style={styles.secondaryText}>{entries[featured.id] ? "✓  In My List" : "+  My List"}</Text></Pressable></View></View>
      <View style={styles.heroMark}><Text style={styles.heroMarkText}>S</Text></View>
    </Pressable>
    <View style={styles.dots}><View style={styles.dotActive} /><View style={styles.dot} /><View style={styles.dot} /></View>
    <SectionTitle title="Continue Watching" action="See all" onAction={() => router.push("/(tabs)/library")} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>{catalog.filter((item) => item.progress).map((item) => <Poster key={item.id} anime={item} width={158} landscape onPress={() => open(item.id)} />)}</ScrollView>
    <SectionTitle title="Top Airing" action="See all" onAction={() => router.push("/search")} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>{airing.map((item) => <Poster key={item.id} anime={item} onPress={() => open(item.id)} />)}</ScrollView>
    <SectionTitle title="Trending Now" action="See all" onAction={() => router.push("/search")} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>{trending.map((item) => <Poster key={item.id} anime={item} onPress={() => open(item.id)} />)}</ScrollView>
    <SectionTitle title="Most Popular" action="See all" onAction={() => router.push("/search")} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>{popular.map((item) => <Poster key={item.id} anime={item} onPress={() => open(item.id)} />)}</ScrollView>
    <SectionTitle title="Coming Soon" action="See all" onAction={() => router.push("/search")} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>{upcoming.map((item) => <Poster key={item.id} anime={item} onPress={() => open(item.id)} />)}</ScrollView>
    {loading && <View style={styles.status}><ActivityIndicator color={C.red} /><Text style={styles.statusText}>Loading AniList catalog…</Text></View>}
    {!!error && <View style={styles.error}><Text style={styles.errorText}>{isAniListEnabled ? "AniList is unavailable. Showing preview titles." : "Live AniList requests are off until approval. Showing preview titles."}</Text>{isAniListEnabled && <Pressable onPress={() => void loadCatalog()}><Text style={styles.retry}>Retry</Text></Pressable>}</View>}
    <View style={styles.note}><View style={styles.noteDot} /><Text style={styles.noteText}>{live ? "Catalog and artwork by AniList" : isAniListEnabled ? "Preview titles shown until AniList is available" : "Preview catalog · AniList approval required"}</Text></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg }, content: { paddingBottom: 26 }, header: { height: 62, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, search: { width: 38, height: 38, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: C.card, borderWidth: 1, borderColor: C.border }, searchIcon: { fontSize: 27, color: C.white, lineHeight: 30 },
  hero: { marginHorizontal: 14, height: 390, borderRadius: 20, overflow: "hidden", backgroundColor: "#17191F", borderWidth: 1, borderColor: C.border, justifyContent: "flex-end" }, heroOrb: { position: "absolute", width: 300, height: 300, borderRadius: 160, top: 6, right: -60, backgroundColor: "#17485A" }, heroOrbit: { position: "absolute", width: 330, height: 330, borderRadius: 170, top: -3, right: -90, borderWidth: 1, borderColor: "#A4D9E833", transform: [{ rotate: "20deg" }] }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "#080A0D99" }, heroMark: { position: "absolute", right: 26, top: 50, width: 110, height: 110, borderRadius: 60, borderWidth: 1, borderColor: "#FFFFFF44", alignItems: "center", justifyContent: "center", backgroundColor: "#090A0D22" }, heroMarkText: { color: "#FFFFFF77", fontSize: 76, fontWeight: "200", fontStyle: "italic" }, heroCopy: { padding: 21, zIndex: 1 }, kicker: { color: "#F1F2F4A0", fontSize: 9, fontWeight: "800", letterSpacing: 2 }, heroTitle: { marginTop: 11, color: C.white, fontSize: 30, lineHeight: 31, fontWeight: "900", letterSpacing: 1.2 }, heroMeta: { color: "#D2D5D9", fontSize: 9, letterSpacing: 1.5, marginTop: 10, fontWeight: "700" }, heroSynopsis: { color: "#C7C9CE", fontSize: 12, lineHeight: 18, marginTop: 9, maxWidth: 300 }, heroButtons: { flexDirection: "row", gap: 9, marginTop: 16 }, primary: { paddingHorizontal: 17, height: 39, justifyContent: "center", borderRadius: 7, backgroundColor: C.red }, primaryText: { color: C.white, fontSize: 12, fontWeight: "800" }, secondary: { paddingHorizontal: 15, height: 39, justifyContent: "center", borderRadius: 7, borderWidth: 1, borderColor: "#FFFFFF66", backgroundColor: "#090A0D66" }, secondaryText: { color: C.white, fontSize: 12, fontWeight: "700" }, dots: { flexDirection: "row", justifyContent: "center", gap: 5, marginVertical: 12 }, dotActive: { width: 17, height: 4, backgroundColor: C.red, borderRadius: 3 }, dot: { width: 5, height: 4, backgroundColor: C.raised, borderRadius: 3 }, carousel: { paddingLeft: 20, paddingRight: 8, paddingBottom: 18 }, status: { flexDirection: "row", gap: 9, alignItems: "center", paddingHorizontal: 20, paddingVertical: 12 }, statusText: { color: C.muted, fontSize: 11 }, error: { marginHorizontal: 20, padding: 12, backgroundColor: C.surface, borderRadius: 9, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, errorText: { color: C.silver, fontSize: 10 }, retry: { color: C.red, fontWeight: "800", fontSize: 11 }, note: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 20, paddingTop: 6 }, noteDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: C.amber }, noteText: { color: C.muted, fontSize: 10 },
});
