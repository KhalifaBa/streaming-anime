"use server";
import { AnimeProp } from "@/types";
import { fetchTopAiringAnime, fetchRecentAnime } from "../utils";
import AnimeCard from "@/components/AnimeCard";

export async function fetchAnimeRecent() {
  const animeRecent = await fetchRecentAnime();

  return animeRecent.map((anime: AnimeProp) => (
    <AnimeCard key={anime.id} anime={anime} />
  ));
}
export async function fetchAnimeTrend() {
  const animeTrend = await fetchTopAiringAnime();

  return animeTrend.map((anime: AnimeProp) => (
    <AnimeCard key={anime.id} anime={anime} />
  ));
}
