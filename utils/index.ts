import { AnimeProp, AnimeInfo, SearchResult, StreamServer, WatchHistoryEntry } from "@/types";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

async function anilistQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "AniList error");
  return json.data;
}

// --- Home page queries ---

export const fetchTrendingAnime = async (page = 1, perPage = 20): Promise<AnimeProp[]> => {
  const data = await anilistQuery<{ Page: { media: AnimeProp[] } }>(`
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          id idMal title { romaji english native } coverImage { large medium extraLarge }
          bannerImage description episodes status genres season
          startDate { year month day } nextAiringEpisode { episode airingAt }
          type format averageScore popularity siteUrl
          studios { nodes { name } } synonyms duration
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
};

export const fetchPopularAnime = async (page = 1, perPage = 20): Promise<AnimeProp[]> => {
  const data = await anilistQuery<{ Page: { media: AnimeProp[] } }>(`
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id idMal title { romaji english native } coverImage { large medium extraLarge }
          bannerImage description episodes status genres season
          startDate { year month day } nextAiringEpisode { episode airingAt }
          type format averageScore popularity siteUrl
          studios { nodes { name } } synonyms duration
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
};

export const fetchRecentEpisodes = async (page = 1, perPage = 20): Promise<AnimeProp[]> => {
  const data = await anilistQuery<{ Page: { media: AnimeProp[] } }>(`
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, status: RELEASING, sort: UPDATED_DATE_DESC, isAdult: false, countryOfOrigin: "JP") {
          id idMal title { romaji english native } coverImage { large medium extraLarge }
          bannerImage description episodes status genres season
          startDate { year month day } nextAiringEpisode { episode airingAt }
          type format averageScore popularity siteUrl
          studios { nodes { name } } synonyms duration
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
};

export const fetchUpcomingAnime = async (page = 1, perPage = 20): Promise<AnimeProp[]> => {
  const data = await anilistQuery<{ Page: { media: AnimeProp[] } }>(`
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC, isAdult: false) {
          id idMal title { romaji english native } coverImage { large medium extraLarge }
          bannerImage description episodes status genres season
          startDate { year month day } nextAiringEpisode { episode airingAt }
          type format averageScore popularity siteUrl
          studios { nodes { name } } synonyms duration
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
};

// --- Anime info ---

export const fetchAnimeInfo = async (id: number): Promise<AnimeInfo> => {
  const data = await anilistQuery<{ Media: AnimeInfo }>(`
    query($id: Int) {
      Media(id: $id, type: ANIME) {
        id idMal title { romaji english native } coverImage { large medium extraLarge }
        bannerImage description episodes status genres season
        startDate { year month day } nextAiringEpisode { episode airingAt }
        type format averageScore popularity siteUrl
        studios { nodes { name } } synonyms duration
        streamingEpisodes { title thumbnail url site }
        relations {
          edges { relationType node { id title { romaji english } coverImage { large } type format } }
        }
        recommendations {
          nodes { mediaRecommendation { id title { romaji english } coverImage { large } episodes type status } }
        }
      }
    }
  `, { id });
  return data.Media;
};

// --- Search ---

export const searchAnime = async (query: string, page = 1, perPage = 20): Promise<SearchResult[]> => {
  const data = await anilistQuery<{ Page: { media: SearchResult[] } }>(`
    query($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME, isAdult: false) {
          id title { romaji english } coverImage { large } type episodes status format
        }
      }
    }
  `, { search: query, page, perPage });
  return data.Page.media;
};

// --- Streaming embed URLs ---
// These are client-side embed URLs that the browser loads directly in an iframe

export function getStreamEmbedUrls(animeTitle: string, episodeNumber: number): StreamServer[] {
  const slug = animeTitle
    .toLowerCase()
    .replace(/[^0-9a-z]+/g, "-")
    .replace(/^-|-$/g, "");

  return [
    {
      name: "Vidstreaming",
      url: `https://goload.pro/streaming.php?title=${encodeURIComponent(animeTitle)}&episode=${episodeNumber}`,
    },
    {
      name: "GogoAnime",
      url: `https://gogoanime3.net/${slug}-episode-${episodeNumber}`,
    },
    {
      name: "AniNeko",
      url: `https://anineko.to/anime/${slug}-episode-${episodeNumber}`,
    },
  ];
}

export function getGogoAnimeEmbedUrl(gogoAnimeId: string, episode: number): string {
  return `https://goload.pro/streaming.php?id=${gogoAnimeId}&episode=${episode}`;
}

// --- Watch History (localStorage) ---

const HISTORY_KEY = "anime_watch_history";

export const getWatchHistory = (): WatchHistoryEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveWatchHistory = (entry: WatchHistoryEntry) => {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    const existing = history.findIndex(
      (h) => h.animeId === entry.animeId && h.episodeNumber === entry.episodeNumber
    );
    if (existing >= 0) {
      history[existing] = entry;
    } else {
      history.unshift(entry);
    }
    history.sort((a, b) => b.timestamp - a.timestamp);
    if (history.length > 50) history.length = 50;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // silently fail
  }
};

export const removeWatchHistory = (animeId: number, episodeNumber: number) => {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory().filter(
      (h) => !(h.animeId === animeId && h.episodeNumber === episodeNumber)
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // silently fail
  }
};

export const getContinueWatching = (): WatchHistoryEntry[] => {
  return getWatchHistory().filter((h) => h.progress < 0.9 && h.duration > 0);
};

// --- Helper ---

export function getAnimeTitle(anime: { title: { english: string | null; romaji: string | null } }): string {
  return anime.title.english || anime.title.romaji || "Unknown";
}

export function getAnimeImage(anime: { coverImage: { large: string; extraLarge?: string } }): string {
  return anime.coverImage.extraLarge || anime.coverImage.large;
}

export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}

export function formatAiringDate(timestamp: number | null): string {
  if (!timestamp) return "";
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
