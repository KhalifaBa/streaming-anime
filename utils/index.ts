import { ResultElement } from "@/components/AnimeCard";

export const fetchTopAiringAnime = async () => {
  const response = await fetch(
    "https://api-blush-nine-20.vercel.app/anime/gogoanime/top-airing"
  );
  const data = await response.json();

  return data.results;
};
