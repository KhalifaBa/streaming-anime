"use client";

import Hero from "@/components/Hero";
import AnimeCard from "@/components/AnimeCard";
import ContinueWatching from "@/components/ContinueWatching";
import { AnimeProp } from "@/types";
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchRecentEpisodes,
} from "../utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [trending, setTrending] = useState<AnimeProp[]>([]);
  const [popular, setPopular] = useState<AnimeProp[]>([]);
  const [recent, setRecent] = useState<AnimeProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p, r] = await Promise.all([
          fetchTrendingAnime(1, 12),
          fetchPopularAnime(1, 12),
          fetchRecentEpisodes(1, 12),
        ]);
        setTrending(t);
        setPopular(p);
        setRecent(r);
      } catch (e) {
        setError("Impossible de charger les animes. Vérifiez votre connexion et réessayez.");
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

        {error && (
          <div className="bg-red-900/30 border border-red-600/30 rounded-xl p-6 text-center">
            <p className="text-red-400 text-lg mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Réessayer
            </button>
          </div>
        )}

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
              className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5"
            >
              {trending.map((anime) => (
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
            En ce moment
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
              {recent.map((anime) => (
                <a key={anime.id} href={`info/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl text-white font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-green-500 rounded-full" />
            Les plus populaires
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
              {popular.map((anime) => (
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
