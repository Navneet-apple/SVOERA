import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { C } from "../../src/theme";

const PROVIDERS: Record<string, { label: string; url: string }> = {
  anikoto: { label: "AniKoto", url: "https://anikototv.to/home" },
  animegg: { label: "AnimeGG", url: "https://www.animegg.org/" },
  reanime: { label: "Re:Anime", url: "https://reanime.to/" },
};

export default function ProviderBrowserScreen() {
  const { provider } = useLocalSearchParams<{ provider: string }>();
  const site = PROVIDERS[provider];
  const web = useRef<WebView>(null);
  const [navigation, setNavigation] = useState<WebViewNavigation | null>(null);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (navigation?.canGoBack) { web.current?.goBack(); return true; }
      router.back(); return true;
    });
    return () => sub.remove();
  }, [navigation?.canGoBack]);

  if (!site) return <View style={s.center}><Text style={s.errorTitle}>Provider unavailable</Text><Pressable onPress={() => router.back()}><Text style={s.link}>Go back</Text></Pressable></View>;

  return <View style={s.screen}>
    <View style={s.toolbar}><Pressable onPress={() => router.back()} style={s.toolButton}><Text style={s.toolText}>×</Text></Pressable><View style={s.host}><Text style={s.hostName}>{site.label}</Text><Text numberOfLines={1} style={s.hostUrl}>{navigation?.url ? new URL(navigation.url).hostname : new URL(site.url).hostname}</Text></View><Pressable onPress={() => web.current?.reload()} style={s.toolButton}><Text style={s.reload}>↻</Text></Pressable></View>
    {progress > 0 && progress < 1 && <View style={s.progress}><View style={[s.progressFill, { width: `${progress * 100}%` }]} /></View>}
    {failed && <View style={s.errorBanner}><Text style={s.errorCopy}>This page could not load.</Text><Pressable onPress={() => { setFailed(false); web.current?.reload(); }}><Text style={s.link}>Retry</Text></Pressable></View>}
    <WebView
      ref={web}
      source={{ uri: site.url }}
      originWhitelist={["http://*", "https://*"]}
      onShouldStartLoadWithRequest={(request) => request.url.startsWith("https://") || request.url.startsWith("http://")}
      onNavigationStateChange={setNavigation}
      onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      onLoadStart={() => { setFailed(false); setProgress(0.05); }}
      onLoadEnd={() => setProgress(1)}
      onError={() => setFailed(true)}
      onHttpError={({ nativeEvent }) => { if (nativeEvent.statusCode >= 400) setFailed(true); }}
      javaScriptEnabled
      domStorageEnabled
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction
      setSupportMultipleWindows={false}
      startInLoadingState
      renderLoading={() => <View style={s.loading}><ActivityIndicator color={C.red} /><Text style={s.loadingText}>Opening {site.label}…</Text></View>}
      style={s.web}
    />
    <View style={s.bottom}><Pressable accessibilityRole="button" accessibilityLabel="Browser back" onPress={() => navigation?.canGoBack && web.current?.goBack()} style={s.bottomButton}><Text style={[s.bottomIcon, !navigation?.canGoBack && s.disabled]}>‹</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Browser forward" onPress={() => navigation?.canGoForward && web.current?.goForward()} style={s.bottomButton}><Text style={[s.bottomIcon, !navigation?.canGoForward && s.disabled]}>›</Text></Pressable><Text numberOfLines={1} style={s.bottomCaption}>Provider website · SVOERA does not host video</Text></View>
  </View>;
}

const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: C.bg }, toolbar: { height: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface }, toolButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: C.card }, toolText: { color: C.silver, fontSize: 24, lineHeight: 28 }, reload: { color: C.silver, fontSize: 22 }, host: { flex: 1, gap: 2 }, hostName: { color: C.white, fontSize: 12, fontWeight: "800" }, hostUrl: { color: C.muted, fontSize: 9 }, progress: { height: 2, backgroundColor: C.surface }, progressFill: { height: 2, backgroundColor: C.red }, web: { flex: 1 }, loading: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: C.bg, zIndex: 1 }, loadingText: { color: C.muted, fontSize: 11 }, errorBanner: { flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#29111A" }, errorCopy: { color: C.silver, fontSize: 11 }, link: { color: C.red, fontWeight: "800", fontSize: 11 }, bottom: { height: 46, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 15 }, bottomButton: { width: 22 }, bottomIcon: { color: C.silver, fontSize: 26, lineHeight: 30 }, disabled: { color: C.raised }, bottomCaption: { flex: 1, textAlign: "right", color: C.muted, fontSize: 8 }, center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", gap: 12 }, errorTitle: { color: C.white, fontWeight: "800", fontSize: 17 } });
