"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { StreamServer, AnimeInfo, Episode, WatchHistoryEntry } from "@/types";
import {
  fetchStreamSources,
  fetchAnime,
  fetchMultipleServers,
  saveWatchHistory,
  getWatchHistory,
} from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default function WatchPage() {
  const params = useParams();
  const episodeId = decodeURIComponent(params.episodeId as string);

  const [servers, setServers] = useState<StreamServer[]>([]);
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<"sub" | "dub">("sub");
  const [historyEntry, setHistoryEntry] = useState<WatchHistoryEntry | null>(null);

  useEffect(() => {
    if (!episodeId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const serverData = await fetchMultipleServers(episodeId, category);
        setServers(serverData);

        if (serverData.length === 0) {
          const single = await fetchStreamSources(episodeId, "vidstreaming", category);
          setServers(single);
        }

        const history = getWatchHistory();
        const match = history.find((h) => h.episodeId === episodeId);
        if (match) {
          setHistoryEntry(match);
          if (match.animeId) {
            const info = await fetchAnime(match.animeId);
            setAnimeInfo(info);
          }
        } else {
          const animeIdPart = episodeId.split("?ep=")[0];
          if (animeIdPart) {
            try {
              const info = await fetchAnime(animeIdPart);
              setAnimeInfo(info);
            } catch {
              // can't fetch info without valid ID
            }
          }
        }
      } catch (err) {
        setError("Impossible de charger la vidéo. Essayez un autre serveur.");
      }
      setLoading(false);
    };

    loadData();
  }, [episodeId, category]);

  const handleProgress = useCallback(
    (progress: number, duration: number) => {
      if (!animeInfo) return;
      saveWatchHistory({
        animeId: animeInfo.id,
        animeTitle: animeInfo.title,
        animeImage: animeInfo.image,
        episodeId,
        episodeNumber: historyEntry?.episodeNumber || 0,
        episodeTitle: historyEntry?.episodeTitle,
        progress,
        duration,
        timestamp: Date.now(),
        server: category,
      });
    },
    [animeInfo, episodeId, category, historyEntry]
  );

  const currentEpisode = animeInfo?.episodes.find(
    (ep) => ep.id === episodeId
  );
  const episodeNumber = currentEpisode?.number || historyEntry?.episodeNumber || 0;

  const prevEpisode = animeInfo?.episodes.find(
    (ep) => ep.number === episodeNumber - 1
  );
  const nextEpisode = animeInfo?.episodes.find(
    (ep) => ep.number === episodeNumber + 1
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error && servers.length === 0) {
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
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition text-sm"
          >
            Accueil
          </Link>
          {animeInfo && (
            <>
              <span className="text-gray-600 mx-2">/</span>
              <Link
                href={`/info/${animeInfo.id}`}
                className="text-gray-400 hover:text-white transition text-sm"
              >
                {animeInfo.title}
              </Link>
            </>
          )}
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-white text-sm">Episode {episodeNumber}</span>
        </div>

        {servers.length > 0 && (
          <VideoPlayer
            servers={servers}
            onProgress={handleProgress}
            initialProgress={historyEntry?.progress}
            animeId={animeInfo?.id || ""}
            episodeId={episodeId}
          />
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setCategory("sub")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                category === "sub"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              VOSTFR
            </button>
            <button
              onClick={() => setCategory("dub")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                category === "dub"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              VF
            </button>
          </div>
        </div>

        {animeInfo && (
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                {prevEpisode && (
                  <Link
                    href={`/watch/${encodeURIComponent(prevEpisode.id)}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                    Ep. {prevEpisode.number}
                  </Link>
                )}
                {nextEpisode && (
                  <Link
                    href={`/watch/${encodeURIComponent(nextEpisode.id)}`}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition ml-auto"
                  >
                    Ep. {nextEpisode.number}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </Link>
                )}
              </div>

              <div className="bg-slate-900/60 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {animeInfo.title}
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  Episode {episodeNumber} / {animeInfo.totalEpisodes}
                </p>
                {animeInfo.description && (
                  <p
                    className="text-gray-400 text-sm leading-relaxed line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: animeInfo.description }}
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>
              <div className="bg-slate-900/60 rounded-xl p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-1.5">
                  {animeInfo.episodes.map((ep: Episode) => (
                    <Link
                      key={ep.id}
                      href={`/watch/${encodeURIComponent(ep.id)}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                        ep.id === episodeId
                          ? "bg-red-600/20 text-red-400 border border-red-600/30"
                          : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      <span className="w-8 text-center font-mono">
                        {ep.number}
                      </span>
                      <span className="truncate flex-1">
                        {ep.title || `Episode ${ep.number}`}
                      </span>
                      {ep.id === episodeId && (
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

        {animeInfo?.recommendations && animeInfo.recommendations.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-white mb-4">Recommandations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {animeInfo.recommendations.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/info/${rec.id}`}
                  className="group bg-slate-900/60 rounded-xl overflow-hidden hover:bg-slate-800/60 transition"
                >
                  <div className="relative w-full h-40">
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
    </div>
  );
}
