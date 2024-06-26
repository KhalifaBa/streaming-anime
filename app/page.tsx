"use client";
import Image from "next/image";
import Hero from "@/components/Hero";
import AnimeCard from "@/components/AnimeCard";
import { AnimeProp } from "@/types";

import { fetchTopAiringAnime, fetchRecentAnime } from "../utils";
import {useEffect,useState} from "react";


export default function Home() {
    const [animeRecent,setAnimeRecent] = useState<AnimeProp[]>([])
    const [animeTrend,setAnimeTrend] = useState<AnimeProp[]>([])
    useEffect(() => {
        const fetchAnimeRecent = async () => {
            const animeRecent = await fetchRecentAnime()

            setAnimeRecent(animeRecent)
        }
        const fetchAnimeTrending = async () => {
            const animeTrend = await fetchTopAiringAnime()
            setAnimeTrend(animeTrend)
        }
        fetchAnimeTrending()
        fetchAnimeRecent()
    }, []);


  return (
    <div className="sm:p-16  py-16 px-12 flex flex-col gap-10">
      <div className="flex justify-center w-full bg-slate-900">
        <Hero />
      </div>
      <h2 className="text-3xl text-white font-bold">Les Animes du moments</h2>

      <section
        id="trend"
        className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10"
      >
        {animeTrend.map((anime: AnimeProp) => (
          <section key={anime.id}>
            <a href={"info/" + anime.id}>
              <AnimeCard key={anime.title} anime={anime} />
            </a>
          </section>
        ))}
      </section>
      <h2 className="text-3xl text-white font-bold">Les ajouts récents</h2>

      <section className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {animeRecent.map((anime: AnimeProp) => (
          <section key={anime.id}>
            <a href={"info/" + anime.id}>
              <AnimeCard key={anime.title} anime={anime} />
            </a>
          </section>
        ))}
      </section>
    </div>
  );
}
