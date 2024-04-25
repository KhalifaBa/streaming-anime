import Image from "next/image";
import AnimeCard, { ResultElement } from "@/components/AnimeCard";
import { AnimeProp } from "@/components/AnimeCard";
import { fetchTopAiringAnime } from "../utils";

export default async function Home() {
  const animeTrend = await fetchTopAiringAnime();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="text-3xl text-white font-bold">Explore Anime</h2>
      {animeTrend.map((anime: ResultElement) => (
        <AnimeCard key={anime.title} anime={anime} />
      ))}
      <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10"></section>
    </main>
  );
}
