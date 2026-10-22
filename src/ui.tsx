import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Anime } from "./catalog";
import { C } from "./theme";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return <View style={styles.wordmark}><View style={styles.mark}><Text style={styles.markText}>S</Text></View><View><Text style={styles.brand}>{compact ? "SVO" : "SVOERA"}</Text>{!compact && <Text style={styles.tagline}>ANIME · YOUR WORLD, BEYOND REALITY</Text>}</View></View>;
}

export function Poster({ anime, width = 132, onPress, landscape = false }: { anime: Anime; width?: number; onPress: () => void; landscape?: boolean }) {
  const height = landscape ? 108 : width * 1.34;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${anime.title}`} onPress={onPress} style={[styles.posterWrap, { width }]}>
    <View style={[styles.poster, { height, backgroundColor: anime.colors[1] }]}>
      {anime.image ? <Image source={{ uri: anime.image }} resizeMode="cover" style={StyleSheet.absoluteFillObject} /> : <><View style={[styles.posterGlow, { backgroundColor: anime.colors[0] }]} /><View style={styles.posterOrb} /><Text style={styles.posterInitial}>{anime.initials}</Text></>}
      <View style={styles.posterFoot}><Text style={styles.posterBrand}>{anime.sourceId ? "ANILIST CATALOG" : "SVOERA PREVIEW"}</Text><Text style={styles.posterYear}>{anime.year || "COMING SOON"}</Text></View>
      {!!anime.progress && <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${anime.progress * 100}%` }]} /></View>}
    </View>
    <Text numberOfLines={2} style={styles.posterTitle}>{anime.title}</Text>
    <Text numberOfLines={1} style={styles.posterMeta}>{anime.status} · {anime.year || "Year TBA"}</Text>
  </Pressable>;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text>{action && <Pressable onPress={onAction}><Text style={styles.action}>{action} ›</Text></Pressable>}</View>;
}

const styles = StyleSheet.create({
  wordmark: { flexDirection: "row", alignItems: "center", gap: 10 }, mark: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: C.red, alignItems: "center", justifyContent: "center", backgroundColor: "#1A0D12" }, markText: { color: C.red, fontSize: 22, fontWeight: "900", fontStyle: "italic" }, brand: { color: C.white, fontSize: 17, fontWeight: "900", letterSpacing: 2.3 }, tagline: { color: C.muted, fontSize: 7, letterSpacing: 1, marginTop: 1 },
  posterWrap: { marginRight: 12 }, poster: { borderRadius: 13, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.border }, posterGlow: { position: "absolute", width: "125%", height: "76%", top: -5, borderRadius: 100, opacity: 0.72, transform: [{ rotate: "-24deg" }] }, posterOrb: { position: "absolute", width: 70, height: 70, borderRadius: 40, borderWidth: 1, borderColor: "#FFFFFF33", right: -22, top: 23 }, posterInitial: { color: "#FFFFFFD9", fontSize: 40, fontWeight: "200", letterSpacing: -2, textShadowColor: "#00000099", textShadowRadius: 14 }, posterFoot: { position: "absolute", bottom: 11, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between" }, posterBrand: { color: "#FFFFFF99", fontSize: 6, letterSpacing: 1 }, posterYear: { color: "#FFFFFF99", fontSize: 7 }, progressTrack: { height: 3, position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF33" }, progressFill: { height: 3, backgroundColor: C.red }, posterTitle: { color: C.white, fontSize: 13, fontWeight: "700", marginTop: 9 }, posterMeta: { color: C.muted, fontSize: 11, marginTop: 3 }, sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12, marginTop: 7 }, sectionTitle: { color: C.white, fontSize: 18, fontWeight: "800", letterSpacing: 0.1 }, action: { color: C.silver, fontSize: 12, fontWeight: "600" },
});
