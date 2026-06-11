"use client";

import { Episode, PropsAnimeInfo, Recommendation } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getWatchHistory } from "@/utils";
import { WatchHistoryEntry } from "@/types";

const AnimeInfoCard = ({ anime }: PropsAnimeInfo) => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>([]);

  useEffect(() => {
    setWatchHistory(getWatchHistory());
  }, []);

  const getEpisodeProgress = (episodeId: string) => {
    const entry = watchHistory.find((h) => h.episodeId === episodeId);
    return entry?.progress || 0;
  };

  return (
    <section className="bg-[#0F1117] mx-auto max-w-6xl">
      <div className="p-6 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="relative w-full lg:w-[300px] h-[400px] flex-shrink-0">
            <Image
              src={
                anime.image.length < 1 ? "/missing_original.webp" : anime.image
              }
              alt={anime.title}
              fill
              className="rounded-xl object-cover shadow-xl"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {anime.title}
            </h1>
            {anime.japaneseTitle && (
              <p className="text-gray-500 text-sm mb-4">{anime.japaneseTitle}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-red-600/20 text-red-400 border border-red-600/30 text-sm px-3 py-1 rounded-lg font-semibold">
                {anime.type}
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 text-sm px-3 py-1 rounded-lg">
                {anime.totalEpisodes} episodes
              </span>
              {anime.hasSub && (
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 text-sm px-3 py-1 rounded-lg">
                  VOSTFR
                </span>
              )}
            </div>
            {anime.description && (
              <p
                className="text-gray-300 leading-relaxed line-clamp-6"
                dangerouslySetInnerHTML={{ __html: anime.description }}
              />
            )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-red-500 rounded-full" />
            Episodes
          </h3>
          <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3">
            {anime.episodes.map((episode: Episode) => {
              const progress = getEpisodeProgress(episode.id);
              return (
                <Link
                  key={episode.id}
                  href={`/watch/${encodeURIComponent(episode.id)}`}
                  className="group relative bg-slate-800/50 hover:bg-slate-700/60 border border-white/5 hover:border-red-500/30 rounded-xl overflow-hidden transition-all"
                >
                  {progress > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                  <div className="px-3 py-3 flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-mono w-6">
                      {episode.number}
                    </span>
                    <span className="text-sm text-white line-clamp-1 flex-1 group-hover:text-red-400 transition">
                      {episode.title || `Episode ${episode.number}`}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {anime.recommendations && anime.recommendations.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              Recommandations
            </h3>
            <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
              {anime.recommendations.map((rec: Recommendation) => (
                <Link
                  key={rec.id}
                  href={`/info/${rec.id}`}
                  className="group bg-slate-900/60 rounded-xl overflow-hidden hover:bg-slate-800/60 transition"
                >
                  <div className="relative w-full h-36">
                    <Image
                      src={rec.image || "/missing_original.webp"}
                      alt={rec.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-red-400 transition">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {rec.sub} ep. VOSTFR
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimeInfoCard;
