import { AnimeInfo, AnimeProp } from "@/types";

export const fetchTopAiringAnime = async () => {
  const results: AnimeProp[] = [];

  const response = await fetch(
    `https://api-blush-nine-20.vercel.app/anime/zoro/top-airing`
  );
  const data = await response.json();
  data.results.map((anime: AnimeProp) => {
    results.push(anime);
  });
  results.length = 10;
  return results;
};
export const fetchRecentAnime = async () => {
  const results: AnimeProp[] = [];

  const response = await fetch(
    `https://api-blush-nine-20.vercel.app/anime/zoro/recent-episodes`
  );
  const data = await response.json();
  data.results.map((anime: AnimeProp) => {
    results.push(anime);
  });
  results.length = 10;
  return results;
};
export const fetchAnime = async (animeId: string) => {
  const results: AnimeInfo[] = [];
  const response = await fetch(
    `https://api-blush-nine-20.vercel.app/anime/zoro/info?id=${animeId}`
  );
  const data = await response.json();
  data.recommendations.length = 5;
  return data;
};
