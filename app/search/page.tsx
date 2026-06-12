"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { searchAnime, fetchPopularAnime, getAnimeTitle, getAnimeImage } from "@/utils";
import { AnimeProp, SearchResult } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [popular, setPopular] = useState<AnimeProp[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPopularAnime(1, 30).then(setPopular).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchAnime(query, 1, 30);
        setResults(data);
        setHasMore(data.length >= 30);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const displayList = query.trim() ? results : popular.map((p) => ({
    id: p.id,
    title: p.title,
    coverImage: p.coverImage,
    type: p.type,
    episodes: p.episodes,
    status: p.status,
    format: p.format,
  }));

  return (
    <div className="min-h-screen bg-[#0F1117] sm:px-8 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {query.trim() ? `Resultats pour "${query}"` : "Catalogue"}
        </h1>

        <div className="relative mb-8">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Rechercher un anime par titre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition"
            autoFocus
          />
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="loading-spinner" />
          </div>
        )}

        {!loading && displayList.length === 0 && query.trim() && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun resultat trouve</p>
            <p className="text-gray-600 text-sm mt-2">Essayez un autre terme de recherche</p>
          </div>
        )}

        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
          {displayList.map((anime) => {
            const animeTitle = anime.title.english || anime.title.romaji || "Unknown";
            return (
              <Link
                key={anime.id}
                href={`/info/${anime.id}`}
                className="group"
              >
                <div className="relative w-full h-[28vh] rounded-xl overflow-hidden">
                  <Image
                    src={anime.coverImage.large}
                    alt={animeTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {anime.format}
                    </span>
                  </div>
                </div>
                <div className="py-2">
                  <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-red-400 transition">
                    {animeTitle}
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {anime.episodes || "?"} ep.
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
