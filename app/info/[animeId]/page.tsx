"use client";

import AnimeInfoCard from "@/components/AnimeInfoCard";
import { fetchAnime } from "@/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimeInfo } from "@/types";

const Page = () => {
  const params = useParams();
  const animeId = params.animeId as string;
  const [infoAnime, setInfoAnime] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) return;
    const load = async () => {
      try {
        const data = await fetchAnime(animeId);
        setInfoAnime(data);
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    load();
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!infoAnime) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <p className="text-gray-400">Anime introuvable</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F1117] sm:px-8 px-4 py-6">
      <AnimeInfoCard anime={infoAnime} />
    </div>
  );
};

export default Page;
