export type Anime = {
  id: string; title: string; alt?: string; year: number; status: string;
  episodes: number; genres: string[]; synopsis: string; initials: string;
  colors: [string, string]; rating?: string; progress?: number; episode?: string;
  image?: string; banner?: string; sourceUrl?: string; sourceId?: number; format?: string;
};

export const catalog: Anime[] = [
  { id: "blue-hour", title: "Blue Hour Protocol", alt: "蒼の境界", year: 2026, status: "Airing", episodes: 12, genres: ["Sci-Fi", "Mystery"], synopsis: "At the edge of a city that forgets one hour every night, a quiet signal analyst finds a voice hiding between the missing minutes.", initials: "BH", colors: ["#163F55", "#10151F"], rating: "8.8", progress: 0.42, episode: "Episode 05" },
  { id: "crimson-orbit", title: "Crimson Orbit", alt: "紅い軌道", year: 2025, status: "Airing", episodes: 24, genres: ["Action", "Adventure"], synopsis: "A rogue pilot and a fallen star-knight cross the outer colonies to stop an ancient weapon from waking beneath Mars.", initials: "CO", colors: ["#6D1830", "#1D121C"], rating: "9.1", progress: 0.68, episode: "Episode 16" },
  { id: "paper-moon", title: "The Paper Moon", year: 2024, status: "Finished", episodes: 13, genres: ["Drama", "Fantasy"], synopsis: "An apprentice illustrator discovers that every drawing left unfinished becomes a place someone can enter in their dreams.", initials: "PM", colors: ["#54456A", "#191820"], rating: "8.5" },
  { id: "last-signal", title: "Last Signal at Dawn", year: 2026, status: "Upcoming", episodes: 0, genres: ["Thriller", "Supernatural"], synopsis: "Every sunrise brings a new message from a missing train. One student is the only person who can hear it.", initials: "LS", colors: ["#79523A", "#171418"], rating: "—" },
  { id: "quiet-season", title: "A Quiet Season", year: 2023, status: "Finished", episodes: 11, genres: ["Slice of Life", "Romance"], synopsis: "Two neighbors find their own rhythm after inheriting a small greenhouse on the edge of town.", initials: "QS", colors: ["#587466", "#161C1A"], rating: "8.2" },
  { id: "glass-tide", title: "Glass Tide", year: 2025, status: "Airing", episodes: 12, genres: ["Fantasy", "Adventure"], synopsis: "On an ocean made of glass, a cartographer charts the shifting islands before the tide turns them to sand.", initials: "GT", colors: ["#3D6177", "#12171E"], rating: "8.7" },
];

const liveCatalog = new Map<string, Anime>();
export function cacheAnime(items: Anime[]) { items.forEach((item) => liveCatalog.set(item.id, item)); }
export function findAnime(id: string) { return liveCatalog.get(id) ?? catalog.find((item) => item.id === id); }
export function getCatalog() { return [...catalog, ...liveCatalog.values()]; }

export const schedule = [
  { day: "MON", time: "18:30", title: "Blue Hour Protocol", episode: "Episode 06 · Sample schedule" },
  { day: "TUE", time: "20:00", title: "Crimson Orbit", episode: "Episode 17 · Sample schedule" },
  { day: "THU", time: "19:15", title: "Glass Tide", episode: "Episode 08 · Sample schedule" },
];
