"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimeInfo, StreamServer, WatchHistoryEntry } from "@/types";
import {
  fetchAnimeInfo,
  getStreamEmbedUrls,
  saveWatchHistory,
  getWatchHistory,
  getAnimeTitle,
  getAnimeImage,
  stripHtml,
} from "@/utils";

function WatchContent() {
  const searchParams = useSearchParams();
  const animeId = parseInt(searchParams.get("id") || "0");
  const episodeNum = parseInt(searchParams.get("ep") || "1");

  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [servers, setServers] = useState<StreamServer[]>([]);
  const [currentServerIdx, setCurrentServerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyEntry, setHistoryEntry] = useState<WatchHistoryEntry | null>(null);

  useEffect(() => {
    if (!animeId || isNaN(animeId)) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await fetchAnimeInfo(animeId);
        setAnimeInfo(info);

        const title = getAnimeTitle(info);
        const streamServers = getStreamEmbedUrls(title, episodeNum);
        setServers(streamServers);

        const history = getWatchHistory();
        const match = history.find(
          (h) => h.animeId === animeId && h.episodeNumber === episodeNum
        );
        if (match) setHistoryEntry(match);
      } catch (e) {
        setError("Impossible de charger l'anime.");
      }
      setLoading(false);
    };

    loadData();
  }, [animeId, episodeNum]);

  const recordProgress = useCallback(() => {
    if (!animeInfo) return;
    saveWatchHistory({
      animeId: animeInfo.id,
      animeTitle: getAnimeTitle(animeInfo),
      animeImage: getAnimeImage(animeInfo),
      episodeNumber: episodeNum,
      episodeTitle: `Episode ${episodeNum}`,
      progress: 0.5,
      duration: animeInfo.duration || 24,
      timestamp: Date.now(),
      server: servers[currentServerIdx]?.name || "default",
    });
  }, [animeInfo, episodeNum, currentServerIdx, servers]);

  useEffect(() => {
    const timer = setInterval(recordProgress, 10000);
    return () => clearInterval(timer);
  }, [recordProgress]);

  const totalEpisodes = animeInfo?.episodes || animeInfo?.nextAiringEpisode?.episode || 0;
  const title = animeInfo ? getAnimeTitle(animeInfo) : "";
  const currentServer = servers[currentServerIdx];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error && !animeInfo) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-xl">{error}</p>
        <Link href="/" className="text-red-500 hover:underline">
          Retour a l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
            Accueil
          </Link>
          {animeInfo && (
            <>
              <span className="text-gray-600 mx-2">/</span>
              <Link
                href={`/info/${animeInfo.id}`}
                className="text-gray-400 hover:text-white transition text-sm"
              >
                {title}
              </Link>
            </>
          )}
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-white text-sm">Episode {episodeNum}</span>
        </div>

        {/* Video Player - Embed iframe */}
        <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ minHeight: "50vh" }}>
          {currentServer?.url ? (
            <iframe
              src={currentServer.url}
              className="w-full rounded-xl"
              style={{ height: "70vh" }}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="flex items-center justify-center h-[50vh] text-gray-400">
              Aucun lecteur disponible
            </div>
          )}
        </div>

        {/* Server selector & controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {servers.length > 1 && (
            <div className="flex gap-2">
              {servers.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setCurrentServerIdx(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    i === currentServerIdx
                      ? "bg-red-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {animeInfo && (
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                {episodeNum > 1 && (
                  <Link
                    href={`/watch?id=${animeInfo.id}&ep=${episodeNum - 1}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                    Ep. {episodeNum - 1}
                  </Link>
                )}
                {episodeNum < totalEpisodes && (
                  <Link
                    href={`/watch?id=${animeInfo.id}&ep=${episodeNum + 1}`}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition ml-auto"
                  >
                    Ep. {episodeNum + 1}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </Link>
                )}
              </div>

              <div className="bg-slate-900/60 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-28 flex-shrink-0">
                    <Image
                      src={getAnimeImage(animeInfo)}
                      alt={title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                    <p className="text-sm text-gray-300 mb-2">
                      Episode {episodeNum} / {totalEpisodes || "?"}
                    </p>
                    {animeInfo.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {animeInfo.genres.slice(0, 4).map((g) => (
                          <span key={g} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {animeInfo.description && (
                  <p className="text-gray-400 text-sm leading-relaxed mt-4 line-clamp-3">
                    {stripHtml(animeInfo.description)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>
              <div className="bg-slate-900/60 rounded-xl p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-1.5">
                  {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((epNum) => (
                    <Link
                      key={epNum}
                      href={`/watch?id=${animeInfo.id}&ep=${epNum}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                        epNum === episodeNum
                          ? "bg-red-600/20 text-red-400 border border-red-600/30"
                          : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      <span className="w-8 text-center font-mono text-xs">
                        {epNum}
                      </span>
                      <span className="truncate flex-1">
                        Episode {epNum}
                      </span>
                      {epNum === episodeNum && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
                          <polygon points="6,3 20,12 6,21" />
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {animeInfo && animeInfo.recommendations?.nodes && animeInfo.recommendations.nodes.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-white mb-4">Recommandations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {animeInfo.recommendations.nodes.map((node, i) => {
                const rec = node.mediaRecommendation;
                if (!rec) return null;
                const recTitle = rec.title.english || rec.title.romaji || "Unknown";
                return (
                  <Link
                    key={rec.id || i}
                    href={`/info/${rec.id}`}
                    className="group bg-slate-900/60 rounded-xl overflow-hidden hover:bg-slate-800/60 transition"
                  >
                    <div className="relative w-full h-32">
                      <Image
                        src={rec.coverImage.large}
                        alt={recTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-red-400 transition">
                        {recTitle}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    }>
      <WatchContent />
    </Suspense>
  );
}
