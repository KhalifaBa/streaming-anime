export interface AnimeProp {
  id: number;
  idMal: number | null;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
    medium: string;
    extraLarge: string;
  };
  bannerImage: string | null;
  description: string | null;
  episodes: number | null;
  status: string;
  genres: string[];
  season: string | null;
  startDate: { year: number | null; month: number | null; day: number | null } | null;
  nextAiringEpisode: { episode: number; airingAt: number } | null;
  type: string;
  format: string;
  averageScore: number | null;
  popularity: number | null;
  siteUrl: string;
  studios: { nodes: { name: string }[] };
  synonyms: string[];
  duration: number | null;
}

export interface AnimeInfo extends AnimeProp {
  streamingEpisodes: {
    title: string;
    thumbnail: string;
    url: string;
    site: string;
  }[];
  relations: {
    edges: {
      relationType: string;
      node: {
        id: number;
        title: { romaji: string | null; english: string | null };
        coverImage: { large: string };
        type: string;
        format: string;
      };
    }[];
  };
  recommendations: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: { romaji: string | null; english: string | null };
        coverImage: { large: string };
        episodes: number | null;
        type: string;
        status: string;
      };
    }[];
  };
}

export interface StreamServer {
  name: string;
  url: string;
}

export interface WatchHistoryEntry {
  animeId: number;
  animeTitle: string;
  animeImage: string;
  episodeNumber: number;
  episodeTitle: string;
  progress: number;
  duration: number;
  timestamp: number;
  server: string;
}

export interface SearchResult {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
  };
  coverImage: {
    large: string;
  };
  type: string;
  episodes: number | null;
  status: string;
  format: string;
}
