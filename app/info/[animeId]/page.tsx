"use client";

import AnimeInfoCard from "@/components/AnimeInfoCard";
import { fetchAnimeInfo } from "@/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimeInfo } from "@/types";

const Page = () => {
  const params = useParams();
  const animeId = parseInt(params.animeId as string);
  const [infoAnime, setInfoAnime] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animeId || isNaN(animeId)) return;
    const load = async () => {
      try {
        const data = await fetchAnimeInfo(animeId);
        setInfoAnime(data);
      } catch (e) {
        setError("Impossible de charger les informations de l'anime.");
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

  if (error || !infoAnime) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-xl">{error || "Anime introuvable"}</p>
        <a href="/" className="text-red-500 hover:underline">
          Retour a l&apos;accueil
        </a>
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
