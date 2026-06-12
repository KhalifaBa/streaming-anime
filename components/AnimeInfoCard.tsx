"use client";

import { AnimeInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getWatchHistory } from "@/utils";
import { WatchHistoryEntry } from "@/types";
import { getAnimeTitle, getAnimeImage, stripHtml, formatAiringDate } from "@/utils";

const AnimeInfoCard = ({ anime }: { anime: AnimeInfo }) => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>([]);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  useEffect(() => {
    setWatchHistory(getWatchHistory());
  }, []);

  const title = getAnimeTitle(anime);
  const image = getAnimeImage(anime);
  const description = stripHtml(anime.description);
  const totalEpisodes = anime.episodes || anime.nextAiringEpisode?.episode || 0;
  const displayEpisodes = showAllEpisodes ? totalEpisodes : Math.min(totalEpisodes, 36);

  const getEpisodeProgress = (epNum: number) => {
    const entry = watchHistory.find(
      (h) => h.animeId === anime.id && h.episodeNumber === epNum
    );
    return entry?.progress || 0;
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="p-6 md:p-10">
        {anime.bannerImage && (
          <div className="relative w-full h-[25vh] md:h-[35vh] rounded-xl overflow-hidden mb-8 -mt-6 md:-mt-10 -mx-6 md:-mx-10">
            <Image
              src={anime.bannerImage}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-[#0F1117]/50 to-transparent" />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="relative w-full lg:w-[280px] h-[400px] flex-shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-xl object-cover shadow-xl"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {title}
            </h1>
            {anime.title.native && (
              <p className="text-gray-500 text-sm mb-4">{anime.title.native}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-red-600/20 text-red-400 border border-red-600/30 text-xs px-3 py-1 rounded-lg font-semibold">
                {anime.format}
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-3 py-1 rounded-lg">
                {anime.status === "RELEASING" ? "En cours" : anime.status === "FINISHED" ? "Termine" : anime.status}
              </span>
              {totalEpisodes > 0 && (
                <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-3 py-1 rounded-lg">
                  {totalEpisodes} episodes
                </span>
              )}
              {anime.season && (
                <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-3 py-1 rounded-lg">
                  {anime.season} {anime.startDate?.year}
                </span>
              )}
              {anime.averageScore && (
                <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 text-xs px-3 py-1 rounded-lg">
                  {anime.averageScore}%
                </span>
              )}
            </div>
            {anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {anime.genres.map((g) => (
                  <span key={g} className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {g}
                  </span>
                ))}
              </div>
            )}
            {anime.nextAiringEpisode && (
              <p className="text-sm text-green-400 mb-3">
                Episode {anime.nextAiringEpisode.episode} - {formatAiringDate(anime.nextAiringEpisode.airingAt)}
              </p>
            )}
            {description && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-5">
                {description}
              </p>
            )}
            {anime.studios.nodes.length > 0 && (
              <p className="text-gray-500 text-xs mt-3">
                Studio: {anime.studios.nodes.map((s) => s.name).join(", ")}
              </p>
            )}
          </div>
        </div>

        {totalEpisodes > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-red-500 rounded-full" />
              Episodes
            </h3>
            <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
              {Array.from({ length: displayEpisodes }, (_, i) => i + 1).map((epNum) => {
                const progress = getEpisodeProgress(epNum);
                return (
                  <Link
                    key={epNum}
                    href={`/watch/${anime.id}?ep=${epNum}`}
                    className="group relative bg-slate-800/50 hover:bg-slate-700/60 border border-white/5 hover:border-red-500/30 rounded-lg overflow-hidden transition-all"
                  >
                    {progress > 0 && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    )}
                    <div className="px-3 py-2.5 flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono w-6 text-center">
                        {epNum}
                      </span>
                      <span className="text-xs text-white line-clamp-1 flex-1 group-hover:text-red-400 transition">
                        Episode {epNum}
                      </span>
                      <svg
                        width="12"
                        height="12"
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
            {totalEpisodes > 36 && !showAllEpisodes && (
              <button
                onClick={() => setShowAllEpisodes(true)}
                className="mt-4 text-red-400 hover:text-red-300 text-sm font-semibold transition"
              >
                Voir les {totalEpisodes} episodes
              </button>
            )}
          </div>
        )}

        {anime.recommendations.nodes.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              Recommandations
            </h3>
            <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
              {anime.recommendations.nodes.map((node, i) => {
                const rec = node.mediaRecommendation;
                if (!rec) return null;
                const recTitle = rec.title.english || rec.title.romaji || "Unknown";
                return (
                  <Link
                    key={rec.id || i}
                    href={`/info/${rec.id}`}
                    className="group bg-slate-900/60 rounded-xl overflow-hidden hover:bg-slate-800/60 transition"
                  >
                    <div className="relative w-full h-36">
                      <Image
                        src={rec.coverImage.large}
                        alt={recTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-red-400 transition">
                        {recTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {rec.episodes || "?"} ep.
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimeInfoCard;
