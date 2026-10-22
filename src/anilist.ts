import { Anime } from "./catalog";

const ENDPOINT = "https://graphql.anilist.co";
// SVOERA includes personal anime tracking; keep live requests off until AniList
// has approved this competing use under its API terms.
export const isAniListEnabled = process.env.EXPO_PUBLIC_ANILIST_APPROVED === "true";
const FIELDS = `id title { romaji english native } description(asHtml: false) episodes status seasonYear genres averageScore format coverImage { extraLarge large } bannerImage siteUrl nextAiringEpisode { episode airingAt }`;
const HOME_QUERY = `query SvoeraHome {
  trending: Page(page: 1, perPage: 12) { media(type: ANIME, isAdult: false, sort: TRENDING_DESC) { ${FIELDS} } }
  airing: Page(page: 1, perPage: 12) { media(type: ANIME, isAdult: false, status: RELEASING, sort: POPULARITY_DESC) { ${FIELDS} } }
  popular: Page(page: 1, perPage: 12) { media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) { ${FIELDS} } }
  upcoming: Page(page: 1, perPage: 12) { media(type: ANIME, isAdult: false, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) { ${FIELDS} } }
}`;

type AniListMedia = {
  id: number;
  title: { romaji?: string | null; english?: string | null; native?: string | null };
  description?: string | null;
  episodes?: number | null;
  status?: string | null;
  seasonYear?: number | null;
  genres?: string[];
  averageScore?: number | null;
  format?: string | null;
  coverImage?: { extraLarge?: string | null; large?: string | null } | null;
  bannerImage?: string | null;
  siteUrl?: string | null;
  nextAiringEpisode?: { episode?: number | null; airingAt?: number | null } | null;
};
type HomeData = { trending: { media: AniListMedia[] }; airing: { media: AniListMedia[] }; popular: { media: AniListMedia[] }; upcoming: { media: AniListMedia[] } };

function toAnime(media: AniListMedia): Anime {
  const title = media.title.english || media.title.romaji || media.title.native || `Anime ${media.id}`;
  const status = media.status === "RELEASING" ? "Airing" : media.status === "NOT_YET_RELEASED" ? "Upcoming" : media.status === "FINISHED" ? "Finished" : media.status || "Unknown";
  return {
    id: `anilist-${media.id}`, sourceId: media.id, title, alt: media.title.native || media.title.romaji || undefined,
    year: media.seasonYear || 0, status, episodes: media.episodes || 0, genres: media.genres || [],
    synopsis: media.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "No synopsis is available from AniList.",
    initials: title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
    colors: ["#3B2334", "#121319"], rating: media.averageScore ? (media.averageScore / 10).toFixed(1) : undefined,
    episode: media.nextAiringEpisode?.episode ? `Episode ${media.nextAiringEpisode.episode}` : undefined,
    image: media.coverImage?.extraLarge || media.coverImage?.large || undefined, banner: media.bannerImage || undefined, sourceUrl: media.siteUrl || `https://anilist.co/anime/${media.id}`, format: media.format || undefined,
  };
}

export async function fetchHomeCatalog(signal?: AbortSignal) {
  if (!isAniListEnabled) throw new Error("AniList use in this anime tracking app needs approval before live requests are enabled.");
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: HOME_QUERY }),
    signal,
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length || !payload.data) throw new Error(payload.errors?.[0]?.message || `AniList request failed (${response.status})`);
  const data = payload.data as HomeData;
  const trending = data.trending.media.map(toAnime);
  const airing = data.airing.media.map(toAnime);
  const popular = data.popular.media.map(toAnime);
  const upcoming = data.upcoming.media.map(toAnime);
  const all = [...new Map([...trending, ...airing, ...popular, ...upcoming].map((item) => [item.id, item])).values()];
  return { trending, airing, popular, upcoming, all };
}

export async function searchAnime(query: string, signal?: AbortSignal): Promise<Anime[]> {
  if (!isAniListEnabled) throw new Error("AniList search is disabled until API use is approved for SVOERA.");
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: `query ($search: String!) { Page(page: 1, perPage: 20) { media(search: $search, type: ANIME, isAdult: false, sort: SEARCH_MATCH) { ${FIELDS} } } }`, variables: { search: query } }),
    signal,
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length || !payload.data) throw new Error(payload.errors?.[0]?.message || `AniList search failed (${response.status})`);
  return (payload.data.Page.media as AniListMedia[]).map(toAnime);
}
