import { AnimeProp, StreamServer, WatchHistoryEntry } from "@/types";

export const fetchTopAiringAnime = async () => {
  const results: AnimeProp[] = [];
  const response = await fetch("/api/anime/zoro/top-airing");
  const data = await response.json();
  if (data.results) {
    data.results.map((anime: AnimeProp) => results.push(anime));
    results.length = 10;
  }
  return results;
};

export const fetchRecentAnime = async () => {
  const results: AnimeProp[] = [];
  const response = await fetch("/api/anime/zoro/recent-episodes");
  const data = await response.json();
  if (data.results) {
    data.results.map((anime: AnimeProp) => results.push(anime));
    results.length = 10;
  }
  return results;
};

export const fetchAnime = async (animeId: string) => {
  const response = await fetch(`/api/anime/zoro/info?id=${encodeURIComponent(animeId)}`);
  const data = await response.json();
  if (data.recommendations) data.recommendations.length = 4;
  return data;
};

export const fetchStreamSources = async (
  episodeId: string,
  server: string = "vidstreaming",
  category: string = "sub"
): Promise<StreamServer[]> => {
  try {
    const response = await fetch(
      `/api/anime/zoro/watch?id=${encodeURIComponent(episodeId)}&server=${encodeURIComponent(server)}&category=${encodeURIComponent(category)}`
    );
    const data = await response.json();
    if (data.sources && data.sources.length > 0) {
      return [
        {
          name: server,
          sources: data.sources.map((s: { url: string; type: string; quality?: string }) => ({
            url: s.url,
            type: s.type,
            quality: s.quality || undefined,
          })),
        },
      ];
    }
    if (data.source && data.source.length > 0) {
      return [
        {
          name: server,
          sources: data.source.map((s: { url: string; type: string; quality?: string }) => ({
            url: s.url,
            type: s.type,
            quality: s.quality || undefined,
          })),
        },
      ];
    }
    return [];
  } catch {
    return [];
  }
};

export const fetchMultipleServers = async (
  episodeId: string,
  category: string = "sub"
): Promise<StreamServer[]> => {
  const servers = ["vidstreaming", "megacloud", "streamsb", "streamtape"];
  const results: StreamServer[] = [];

  for (const server of servers) {
    try {
      const streamServer = await fetchStreamSources(episodeId, server, category);
      if (streamServer.length > 0 && streamServer[0].sources.length > 0) {
        results.push(streamServer[0]);
      }
    } catch {
      continue;
    }
  }
  return results;
};

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
      (h) => h.animeId === entry.animeId && h.episodeId === entry.episodeId
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

export const removeWatchHistory = (animeId: string, episodeId: string) => {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory().filter(
      (h) => !(h.animeId === animeId && h.episodeId === episodeId)
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // silently fail
  }
};

export const getContinueWatching = (): WatchHistoryEntry[] => {
  return getWatchHistory().filter((h) => h.progress < 0.9 && h.duration > 0);
};
