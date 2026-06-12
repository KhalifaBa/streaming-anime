"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WatchHistoryEntry } from "@/types";
import { getContinueWatching } from "@/utils";

function ContinueWatching() {
  const [entries, setEntries] = useState<WatchHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getContinueWatching());
  }, []);

  if (entries.length === 0) return null;

  return (
    <div>
      <h2 className="text-3xl text-white font-bold mb-6 flex items-center gap-3">
        <span className="w-1 h-8 bg-orange-500 rounded-full" />
        Continuer a regarder
      </h2>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {entries.slice(0, 10).map((entry) => (
          <Link
            key={`${entry.animeId}-${entry.episodeNumber}`}
            href={`/watch?id=${entry.animeId}&ep=${entry.episodeNumber}`}
            className="group"
          >
            <div className="relative w-full h-[22vh] rounded-xl overflow-hidden">
              <Image
                src={entry.animeImage}
                alt={entry.animeTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="w-full h-1 bg-white/20 rounded-full mb-2">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${entry.progress * 100}%` }}
                  />
                </div>
                <p className="text-white text-sm font-semibold line-clamp-1">
                  {entry.animeTitle}
                </p>
                <p className="text-gray-300 text-xs">
                  Episode {entry.episodeNumber}
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatching;
