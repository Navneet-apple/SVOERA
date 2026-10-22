import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { findAnime } from "../src/catalog";
import { C } from "../src/theme";

const providers = [
  { id: "anikoto", name: "AniKoto", url: "https://anikototv.to/home", note: "Opens provider website" },
  { id: "animegg", name: "AnimeGG", url: "https://www.animegg.org/", note: "Opens provider website" },
  { id: "reanime", name: "Re:Anime", url: "https://reanime.to/", note: "Opens provider website" },
];

export default function WatchProviderScreen() {
  const { anime } = useLocalSearchParams<{ anime?: string }>();
  const title = anime ? findAnime(anime)?.title : undefined;
  return <ScrollView style={s.screen} contentContainerStyle={s.page}>
    <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>‹  Back</Text></Pressable>
    <Text style={s.kicker}>SVOERA BROWSER</Text><Text style={s.heading}>Choose a provider</Text>
    {title && <Text style={s.subtitle}>Continue to a provider to search for “{title}”.</Text>}
    {!title && <Text style={s.subtitle}>Browse a provider’s website inside SVOERA.</Text>}
    {providers.map((provider) => <Pressable key={provider.id} onPress={() => router.push({ pathname: "/browser/[provider]", params: { provider: provider.id, url: provider.url } })} style={s.provider}>
      <View style={s.badge}><Text style={s.badgeText}>{provider.name.slice(0, 1)}</Text></View><View style={s.copy}><Text style={s.name}>{provider.name}</Text><Text style={s.note}>{provider.note}</Text></View><Text style={s.arrow}>↗</Text>
    </Pressable>)}
    <View style={s.info}><Text style={s.infoTitle}>Opens the provider’s site</Text><Text style={s.infoCopy}>SVOERA does not host, extract, or proxy provider video. The site controls its own search, availability, and playback.</Text></View>
  </ScrollView>;
}

const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: C.bg }, page: { padding: 20, paddingTop: 12, paddingBottom: 30 }, back: { paddingVertical: 10 }, backText: { color: C.silver, fontSize: 14 }, kicker: { color: C.red, fontSize: 10, letterSpacing: 1.6, fontWeight: "800", marginTop: 14 }, heading: { color: C.white, fontWeight: "900", fontSize: 27, marginTop: 6 }, subtitle: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 6, marginBottom: 17 }, provider: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 13, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, padding: 13, marginBottom: 9 }, badge: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#29111A", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.redDark }, badgeText: { color: C.red, fontSize: 20, fontWeight: "800" }, copy: { flex: 1, gap: 4 }, name: { color: C.white, fontSize: 14, fontWeight: "800" }, note: { color: C.muted, fontSize: 10 }, arrow: { color: C.silver, fontSize: 18 }, info: { marginTop: 16, padding: 14, borderRadius: 11, backgroundColor: C.surface, borderLeftWidth: 2, borderLeftColor: C.red, gap: 5 }, infoTitle: { color: C.silver, fontSize: 11, fontWeight: "700" }, infoCopy: { color: C.muted, fontSize: 10, lineHeight: 16 } });
