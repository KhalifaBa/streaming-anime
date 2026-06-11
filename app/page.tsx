"use client";

import Hero from "@/components/Hero";
import AnimeCard from "@/components/AnimeCard";
import ContinueWatching from "@/components/ContinueWatching";
import { AnimeProp } from "@/types";
import { fetchTopAiringAnime, fetchRecentAnime } from "../utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [animeRecent, setAnimeRecent] = useState<AnimeProp[]>([]);
  const [animeTrend, setAnimeTrend] = useState<AnimeProp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [recent, trend] = await Promise.all([
          fetchRecentAnime(),
          fetchTopAiringAnime(),
        ]);
        setAnimeRecent(recent);
        setAnimeTrend(trend);
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center w-full bg-slate-900">
        <Hero />
      </div>

      <div className="sm:p-16 py-8 px-8 flex flex-col gap-12">
        <ContinueWatching />

        <section>
          <h2 className="text-3xl text-white font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-red-500 rounded-full" />
            Tendances
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div
              id="trend"
              className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6"
            >
              {animeTrend.map((anime: AnimeProp) => (
                <a key={anime.id} href={`info/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl text-white font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-blue-500 rounded-full" />
            Derniers episodes sortis
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {animeRecent.map((anime: AnimeProp) => (
                <a key={anime.id} href={`info/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
