export interface Prop {
  anime: AnimeProp;
}
export enum Type {
  Ona = "ONA",
  Special = "Special",
  Tv = "TV",
}
export interface AnimeProp {
  id: string;
  title: string;
  url: string;
  image: string;
  duration: string;
  japaneseTitle: string;
  type: Type;
  nsfw: boolean;
  sub: number;
  dub: number;
  episodes: number;
}

export interface AnimeInfo {
  id: string;
  title: string;
  malID: number;
  alID: number;
  japaneseTitle: string;
  image: string;
  description: string;
  type: string;
  url: string;
  recommendations: Recommendation[];
  relatedAnime: Recommendation[];
  subOrDub: string;
  hasSub: boolean;
  totalEpisodes: number;
  episodes: Episode[];
}

export interface PropsAnimeInfo {
  anime: AnimeInfo;
}
export interface Episode {
  id: string;
  number: number;
  title?: string;
  isFiller?: boolean;
  url: string;
}

export interface Recommendation {
  id: string;
  title: string;
  url: string;
  image: string;
  duration?: string;
  japaneseTitle: string;
  type: string;
  nsfw?: boolean;
  sub: number;
  dub: number;
  episodes: number;
}
